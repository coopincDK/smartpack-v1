'use strict';

// Partnere til Packrush — se API.md, afsnit "Partnere".
//  - Offentligt: GET /partnere, GET /partnere/:slug/logo, GET /praemier,
//    POST /partnere/ansoeg
//  - Admin (eksisterende admin-session): /admin/partnere*, /admin/partner-brugere*,
//    /admin/konkurrence
//  - Partner (egen cookie-session): /partner/*

const crypto = require('crypto');
const express = require('express');
const config = require('../config');
const { sha256Hex, hashPassword, verifyPassword } = require('../crypto');
const { requireAdmin, parseCookies } = require('../middleware/adminAuth');
const { createRateLimiter } = require('../middleware/rateLimit');
const P = require('../partners');
const { konkurrenceView } = require('../konkurrence');
const { invalidateStateCache } = require('../publicState');

const PARTNER_COOKIE = 'spil_partner_session';
const PARTNER_SESSION_TTL_MS = 12 * 3600 * 1000;
const MIN_KODE = 10;
const LOGO_MAX = 600 * 1024;
const LOGO_TYPER = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

// Alle kolonner undtagen logo-bytes.
const KOLONNER = `id, slug, status, vist_i_spil, powerup, navn, firmanavn, cvr, adresse, hjemmeside,
  kort_beskrivelse, beskrivelse, kontakt_navn, kontakt_email, kontakt_telefon,
  giver_praemie, praemie_titel, praemie_vaerdi, praemie_vaerdi_type, praemie_moms,
  praemie_beskrivelse, praemie_udbytte, praemie_betingelser, praemie_indloesning,
  ansoegning_besked, (logo IS NOT NULL) AS har_logo, logo_type, oprettet, opdateret`;

function setPartnerCookie(res, token, maxAgeMs) {
  const attrs = [
    `${PARTNER_COOKIE}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
  ];
  if (config.cookieSecure) attrs.push('Secure');
  res.append('Set-Cookie', attrs.join('; '));
}

function sendFejl(res, e, next) {
  if (e instanceof P.Valideringsfejl) {
    return res.status(400).json({ fejl: e.message, kode: 'ugyldig', felt: e.felt });
  }
  return next(e);
}

function erUuid(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s || ''));
}

async function hentPartner(pool, id) {
  if (!erUuid(id)) return null;
  const { rows } = await pool.query(`SELECT ${KOLONNER} FROM partner WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function unikSlug(pool, navn) {
  const base = P.slugFra(navn);
  let slug = base;
  for (let i = 2; i < 1000; i++) {
    const { rows } = await pool.query('SELECT 1 FROM partner WHERE slug = $1', [slug]);
    if (!rows.length) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${crypto.randomBytes(3).toString('hex')}`;
}

// UPDATE partner SET <felter>, opdateret = now() WHERE id = $1
async function opdaterPartner(pool, id, felter) {
  const keys = Object.keys(felter);
  if (!keys.length) return hentPartner(pool, id);
  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  await pool.query(`UPDATE partner SET ${sets.join(', ')}, opdateret = now() WHERE id = $1`, [
    id,
    ...keys.map((k) => felter[k]),
  ]);
  return hentPartner(pool, id);
}

async function audit(pool, req, handling, detaljer) {
  try {
    await pool.query(
      'INSERT INTO admin_audit_log (admin_session_id, handling, antal, detaljer) VALUES ($1, $2, $3, $4)',
      [req.adminSession ? req.adminSession.id : null, handling, null, JSON.stringify(detaljer || {})]
    );
  } catch (e) {
    // Audit må aldrig vælte selve handlingen.
  }
}

// Kræver gyldig partner-session. `tilladFoerSkift` = må bruges, selv om
// startkoden ikke er skiftet endnu (kun /partner/mig, /skift-kode og /logout).
function requirePartner(pool, tilladFoerSkift) {
  return async function (req, res, next) {
    const token = parseCookies(req)[PARTNER_COOKIE];
    if (!token) return res.status(401).json({ fejl: 'Ikke logget ind.', kode: 'ingen_session' });
    try {
      const { rows } = await pool.query(
        `SELECT s.id AS session_id, b.id AS bruger_id, b.partner_id, b.email, b.navn, b.skal_skifte_kode, p.status
           FROM partner_session s
           JOIN partner_bruger b ON b.id = s.bruger_id
           JOIN partner p ON p.id = b.partner_id
          WHERE s.token_hash = $1 AND s.udloeber > now()`,
        [sha256Hex(token)]
      );
      if (!rows.length) return res.status(401).json({ fejl: 'Sessionen er udløbet.', kode: 'udloebet_session' });
      const s = rows[0];
      if (s.status === 'arkiveret' || s.status === 'afvist') {
        return res.status(403).json({ fejl: 'Partneren er ikke aktiv.', kode: 'partner_inaktiv' });
      }
      if (s.skal_skifte_kode && !tilladFoerSkift) {
        return res.status(403).json({ fejl: 'Du skal vælge en ny kode først.', kode: 'skal_skifte_kode' });
      }
      req.partnerSession = s;
      next();
    } catch (e) {
      next(e);
    }
  };
}

function partnersRouter(pool) {
  const router = express.Router();
  const admin = requireAdmin(pool);
  const partner = requirePartner(pool, false);
  const partnerFoerSkift = requirePartner(pool, true);
  const loginLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5, besked: 'For mange loginforsøg. Prøv igen om lidt.' });
  const ansoegLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5, besked: 'For mange ansøgninger. Prøv igen senere.' });
  const logoBody = express.raw({ type: LOGO_TYPER, limit: LOGO_MAX });

  // ---------------------------------------------------------------- offentligt

  router.get('/partnere', async (req, res, next) => {
    try {
      const { rows } = await pool.query(`SELECT ${KOLONNER} FROM partner WHERE status = 'aktiv' AND vist_i_spil = true ORDER BY navn`);
      const partnere = rows.filter(P.erSynlig).map(P.offentligPartner);
      res.set('Cache-Control', 'public, max-age=60');
      res.json({ partnere, powerups: P.POWERUPS });
    } catch (e) {
      next(e);
    }
  });

  router.get('/partnere/:slug/logo', async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        "SELECT logo, logo_type FROM partner WHERE slug = $1 AND status = 'aktiv' AND logo IS NOT NULL",
        [String(req.params.slug)]
      );
      if (!rows.length) return res.status(404).json({ fejl: 'Intet logo.', kode: 'ikke_fundet' });
      res.set('Content-Type', rows[0].logo_type || 'application/octet-stream');
      res.set('Cache-Control', 'public, max-age=86400');
      res.set('X-Content-Type-Options', 'nosniff');
      // SVG kan indeholde script; vis det kun som billede, aldrig som side.
      res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
      res.send(rows[0].logo);
    } catch (e) {
      next(e);
    }
  });

  router.get('/praemier', async (req, res, next) => {
    try {
      const { rows } = await pool.query(`SELECT ${KOLONNER} FROM partner WHERE status = 'aktiv' AND vist_i_spil = true`);
      const praemier = rows
        .filter(P.erSynlig)
        .map(P.offentligPartner)
        .filter((p) => p.praemie)
        .sort((a, b) => (b.praemie.vaerdi || 0) - (a.praemie.vaerdi || 0) || a.navn.localeCompare(b.navn, 'da'));
      const samlet = praemier.reduce((s, p) => s + (p.praemie.vaerdi || 0), 0);
      const { rows: k } = await pool.query('SELECT * FROM konkurrence WHERE id = 1');
      res.set('Cache-Control', 'public, max-age=60');
      res.json({
        konkurrence: konkurrenceView(k[0]),
        praemier,
        samlet_vaerdi: samlet,
        samlet_indeholder_op_til: praemier.some((p) => p.praemie.vaerdi_type === 'op_til'),
      });
    } catch (e) {
      next(e);
    }
  });

  router.post('/partnere/ansoeg', ansoegLimiter, async (req, res, next) => {
    try {
      const b = req.body || {};
      const firmanavn = P.renTekst(b.firmanavn, 200);
      const kontaktNavn = P.renTekst(b.kontakt_navn, 200);
      const email = P.renEmail(b.kontakt_email, 'kontakt_email');
      if (!firmanavn) throw new P.Valideringsfejl('Skriv firmanavnet.', 'firmanavn');
      if (!kontaktNavn) throw new P.Valideringsfejl('Skriv dit navn.', 'kontakt_navn');
      if (!email) throw new P.Valideringsfejl('Skriv din e-mail.', 'kontakt_email');
      const felter = P.renFelter(
        { hjemmeside: b.hjemmeside, kontakt_telefon: b.kontakt_telefon, kort_beskrivelse: b.kort_beskrivelse },
        ['hjemmeside', 'kontakt_telefon', 'kort_beskrivelse']
      );
      const besked = P.renTekst(b.besked, 4000);
      const id = crypto.randomUUID();
      const slug = await unikSlug(pool, firmanavn);
      await pool.query(
        `INSERT INTO partner (id, slug, status, navn, firmanavn, kontakt_navn, kontakt_email, kontakt_telefon,
                              hjemmeside, kort_beskrivelse, ansoegning_besked)
         VALUES ($1, $2, 'ansoegt', $3, $3, $4, $5, $6, $7, $8, $9)`,
        [id, slug, firmanavn, kontaktNavn, email, felter.kontakt_telefon || '', felter.hjemmeside || '', felter.kort_beskrivelse || '', besked]
      );
      res.status(201).json({ ok: true });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  // --------------------------------------------------------------------- admin

  router.get('/admin/partnere', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT ${KOLONNER}, (SELECT count(*)::int FROM partner_bruger b WHERE b.partner_id = partner.id) AS antal_brugere
           FROM partner ORDER BY (status = 'ansoegt') DESC, (status = 'aktiv') DESC, navn`
      );
      res.json({ partnere: rows.map(P.fuldPartner), powerups: P.POWERUPS });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/partnere/:id', admin, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.params.id);
      if (!p) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      const { rows: brugere } = await pool.query(
        'SELECT id, email, navn, skal_skifte_kode, oprettet, sidst_login FROM partner_bruger WHERE partner_id = $1 ORDER BY oprettet',
        [p.id]
      );
      res.json({ partner: P.fuldPartner(p), brugere });
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/partnere', admin, async (req, res, next) => {
    try {
      const felter = P.renFelter(req.body, P.ADMIN_REDIGERBARE);
      if (!felter.navn) throw new P.Valideringsfejl('Partneren skal have et navn.', 'navn');
      const id = crypto.randomUUID();
      const slug = await unikSlug(pool, felter.navn);
      await pool.query("INSERT INTO partner (id, slug, status, navn) VALUES ($1, $2, 'aktiv', $3)", [id, slug, felter.navn]);
      delete felter.navn;
      const p = await opdaterPartner(pool, id, felter);
      await audit(pool, req, 'partner_oprettet', { partner_id: id, navn: p.navn });
      res.status(201).json({ partner: P.fuldPartner(p) });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  router.put('/admin/partnere/:id', admin, async (req, res, next) => {
    try {
      const før = await hentPartner(pool, req.params.id);
      if (!før) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      const felter = P.renFelter(req.body, P.ADMIN_REDIGERBARE);
      const p = await opdaterPartner(pool, før.id, felter);
      if (felter.status && felter.status !== før.status) {
        await audit(pool, req, 'partner_status', { partner_id: p.id, navn: p.navn, fra: før.status, til: p.status });
      }
      res.json({ partner: P.fuldPartner(p) });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  // Godkend en ansøgning (ansoegt -> aktiv). Vises stadig ikke i spillet, før
  // admin slår "vist_i_spil" til, og profilen er udfyldt.
  router.post('/admin/partnere/:id/godkend', admin, async (req, res, next) => {
    try {
      const p0 = await hentPartner(pool, req.params.id);
      if (!p0) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      const p = await opdaterPartner(pool, p0.id, { status: 'aktiv' });
      await audit(pool, req, 'partner_godkendt', { partner_id: p.id, navn: p.navn });
      res.json({ partner: P.fuldPartner(p) });
    } catch (e) {
      next(e);
    }
  });

  // "Slet": en ansøgning, der aldrig er blevet godkendt og ingen brugere har,
  // slettes helt. Alle andre arkiveres, så samtykker til partnerens nyhedsmail
  // stadig kan dokumenteres. Arkiverede kan genaktiveres med PUT status='aktiv'.
  router.delete('/admin/partnere/:id', admin, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.params.id);
      if (!p) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      const { rows } = await pool.query('SELECT count(*)::int AS n FROM partner_bruger WHERE partner_id = $1', [p.id]);
      if ((p.status === 'ansoegt' || p.status === 'afvist') && rows[0].n === 0) {
        await pool.query('DELETE FROM partner WHERE id = $1', [p.id]);
        await audit(pool, req, 'partner_slettet', { partner_id: p.id, navn: p.navn });
        return res.json({ ok: true, resultat: 'slettet' });
      }
      await opdaterPartner(pool, p.id, { status: 'arkiveret', vist_i_spil: false });
      await pool.query(
        'DELETE FROM partner_session WHERE bruger_id IN (SELECT id FROM partner_bruger WHERE partner_id = $1)',
        [p.id]
      );
      await audit(pool, req, 'partner_arkiveret', { partner_id: p.id, navn: p.navn });
      res.json({ ok: true, resultat: 'arkiveret' });
    } catch (e) {
      next(e);
    }
  });

  async function gemLogo(partnerId, req, res, tilPartner) {
    const type = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!LOGO_TYPER.includes(type) || !Buffer.isBuffer(req.body) || !req.body.length) {
      return res.status(400).json({ fejl: 'Logoet skal være PNG, JPG, WEBP eller SVG (højst 600 KB).', kode: 'ugyldigt_logo' });
    }
    await pool.query('UPDATE partner SET logo = $2, logo_type = $3, opdateret = now() WHERE id = $1', [partnerId, req.body, type]);
    const fuld = P.fuldPartner(await hentPartner(pool, partnerId));
    if (tilPartner) delete fuld.ansoegning_besked;
    return res.json({ partner: fuld });
  }

  router.put('/admin/partnere/:id/logo', admin, logoBody, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.params.id);
      if (!p) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      await gemLogo(p.id, req, res);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/admin/partnere/:id/logo', admin, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.params.id);
      if (!p) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      await pool.query('UPDATE partner SET logo = NULL, logo_type = NULL, opdateret = now() WHERE id = $1', [p.id]);
      res.json({ partner: P.fuldPartner(await hentPartner(pool, p.id)) });
    } catch (e) {
      next(e);
    }
  });

  // Opret en partnerbruger med en startkode. Brugeren skal vælge sin egen kode
  // første gang, der logges ind.
  router.post('/admin/partnere/:id/brugere', admin, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.params.id);
      if (!p) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      const b = req.body || {};
      const email = P.renEmail(b.email, 'email');
      const navn = P.renTekst(b.navn, 200);
      const kode = String(b.kode || '');
      if (!email) throw new P.Valideringsfejl('Skriv brugerens e-mail.', 'email');
      if (kode.length < MIN_KODE) throw new P.Valideringsfejl(`Startkoden skal være mindst ${MIN_KODE} tegn.`, 'kode');
      const { rows: findes } = await pool.query('SELECT 1 FROM partner_bruger WHERE email = $1', [email]);
      if (findes.length) throw new P.Valideringsfejl('Der findes allerede en bruger med den e-mail.', 'email');
      const id = crypto.randomUUID();
      await pool.query(
        'INSERT INTO partner_bruger (id, partner_id, email, navn, password_hash, skal_skifte_kode) VALUES ($1, $2, $3, $4, $5, true)',
        [id, p.id, email, navn, hashPassword(kode)]
      );
      await audit(pool, req, 'partner_bruger_oprettet', { partner_id: p.id, bruger_id: id });
      res.status(201).json({ bruger: { id, email, navn, skal_skifte_kode: true } });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  // Ny startkode (fx glemt kode). Logger brugeren ud overalt.
  router.post('/admin/partner-brugere/:bid/nulstil', admin, async (req, res, next) => {
    try {
      if (!erUuid(req.params.bid)) return res.status(404).json({ fejl: 'Brugeren findes ikke.', kode: 'ikke_fundet' });
      const kode = String((req.body && req.body.kode) || '');
      if (kode.length < MIN_KODE) throw new P.Valideringsfejl(`Startkoden skal være mindst ${MIN_KODE} tegn.`, 'kode');
      const r = await pool.query(
        'UPDATE partner_bruger SET password_hash = $2, skal_skifte_kode = true WHERE id = $1',
        [req.params.bid, hashPassword(kode)]
      );
      if (!r.rowCount) return res.status(404).json({ fejl: 'Brugeren findes ikke.', kode: 'ikke_fundet' });
      await pool.query('DELETE FROM partner_session WHERE bruger_id = $1', [req.params.bid]);
      await audit(pool, req, 'partner_bruger_nulstillet', { bruger_id: req.params.bid });
      res.json({ ok: true });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  router.delete('/admin/partner-brugere/:bid', admin, async (req, res, next) => {
    try {
      if (!erUuid(req.params.bid)) return res.status(404).json({ fejl: 'Brugeren findes ikke.', kode: 'ikke_fundet' });
      const r = await pool.query('DELETE FROM partner_bruger WHERE id = $1', [req.params.bid]);
      if (!r.rowCount) return res.status(404).json({ fejl: 'Brugeren findes ikke.', kode: 'ikke_fundet' });
      await audit(pool, req, 'partner_bruger_slettet', { bruger_id: req.params.bid });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/konkurrence', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query('SELECT * FROM konkurrence WHERE id = 1');
      res.json({ konkurrence: rows[0], visning: konkurrenceView(rows[0]) });
    } catch (e) {
      next(e);
    }
  });

  router.put('/admin/konkurrence', admin, async (req, res, next) => {
    try {
      const b = req.body || {};
      let tid = null;
      if (b.lodtraekning) {
        const d = new Date(b.lodtraekning);
        if (Number.isNaN(d.getTime())) throw new P.Valideringsfejl('Datoen for lodtrækning er ugyldig.', 'lodtraekning');
        tid = d.toISOString();
      }
      let start = null;
      if (b.start) {
        const d = new Date(b.start);
        if (Number.isNaN(d.getTime())) throw new P.Valideringsfejl('Startdatoen er ugyldig.', 'start');
        start = d.toISOString();
      }
      if (start && !tid) throw new P.Valideringsfejl('Udfyld også lodtrækningen, når der er en startdato.', 'lodtraekning');
      if (start && tid && new Date(start) >= new Date(tid)) {
        throw new P.Valideringsfejl('Starten skal ligge før lodtrækningen.', 'start');
      }
      let vinderDato = null;
      if (b.vinder_dato) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.vinder_dato))) {
          throw new P.Valideringsfejl('Vinderdatoen er ugyldig.', 'vinder_dato');
        }
        vinderDato = String(b.vinder_dato);
      }
      await pool.query(
        `UPDATE konkurrence SET navn = $1, lodtraekning = $2, tekst_aktiv = $3, tekst_slut = $4,
                vinder_navn = $5, vinder_firma = $6, vinder_dato = $7, vinder_tekst = $8, start = $9,
                opdateret = now() WHERE id = 1`,
        [
          P.renTekst(b.navn, 200),
          tid,
          P.renTekst(b.tekst_aktiv, 2000),
          P.renTekst(b.tekst_slut, 2000),
          P.renTekst(b.vinder_navn, 200),
          P.renTekst(b.vinder_firma, 200),
          vinderDato,
          P.renTekst(b.vinder_tekst, 2000),
          start,
        ]
      );
      // Spillet får konkurrencen med i /state.
      invalidateStateCache();
      const { rows } = await pool.query('SELECT * FROM konkurrence WHERE id = 1');
      res.json({ konkurrence: rows[0], visning: konkurrenceView(rows[0]) });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  // ------------------------------------------------------------------- partner

  router.post('/partner/login', loginLimiter, async (req, res, next) => {
    try {
      const email = String((req.body && req.body.email) || '').trim().toLowerCase();
      const kode = String((req.body && req.body.kode) || '');
      const { rows } = await pool.query(
        `SELECT b.*, p.status FROM partner_bruger b JOIN partner p ON p.id = b.partner_id WHERE b.email = $1`,
        [email]
      );
      const b = rows[0];
      if (!b || !verifyPassword(kode, b.password_hash)) {
        return res.status(401).json({ fejl: 'Forkert e-mail eller kode.', kode: 'forkert_login' });
      }
      if (b.status === 'arkiveret' || b.status === 'afvist') {
        return res.status(403).json({ fejl: 'Partneren er ikke aktiv. Kontakt SmartPack.', kode: 'partner_inaktiv' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      await pool.query('INSERT INTO partner_session (id, bruger_id, token_hash, udloeber) VALUES ($1, $2, $3, $4)', [
        crypto.randomUUID(),
        b.id,
        sha256Hex(token),
        new Date(Date.now() + PARTNER_SESSION_TTL_MS),
      ]);
      await pool.query('UPDATE partner_bruger SET sidst_login = now() WHERE id = $1', [b.id]);
      await pool.query('DELETE FROM partner_session WHERE udloeber < now()');
      setPartnerCookie(res, token, PARTNER_SESSION_TTL_MS);
      res.json({ ok: true, skal_skifte_kode: b.skal_skifte_kode });
    } catch (e) {
      next(e);
    }
  });

  router.post('/partner/logout', async (req, res, next) => {
    try {
      const token = parseCookies(req)[PARTNER_COOKIE];
      if (token) await pool.query('DELETE FROM partner_session WHERE token_hash = $1', [sha256Hex(token)]);
      setPartnerCookie(res, '', 0);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.post('/partner/skift-kode', loginLimiter, partnerFoerSkift, async (req, res, next) => {
    try {
      const gammel = String((req.body && req.body.gammel) || '');
      const ny = String((req.body && req.body.ny) || '');
      const { rows } = await pool.query('SELECT password_hash FROM partner_bruger WHERE id = $1', [req.partnerSession.bruger_id]);
      if (!rows.length || !verifyPassword(gammel, rows[0].password_hash)) {
        return res.status(401).json({ fejl: 'Den nuværende kode er forkert.', kode: 'forkert_kode' });
      }
      if (ny.length < MIN_KODE) throw new P.Valideringsfejl(`Den nye kode skal være mindst ${MIN_KODE} tegn.`, 'ny');
      if (ny === gammel) throw new P.Valideringsfejl('Den nye kode skal være en anden end startkoden.', 'ny');
      await pool.query('UPDATE partner_bruger SET password_hash = $2, skal_skifte_kode = false WHERE id = $1', [
        req.partnerSession.bruger_id,
        hashPassword(ny),
      ]);
      // Log andre sessioner ud; behold den nuværende.
      await pool.query('DELETE FROM partner_session WHERE bruger_id = $1 AND id <> $2', [
        req.partnerSession.bruger_id,
        req.partnerSession.session_id,
      ]);
      res.json({ ok: true });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  router.get('/partner/mig', partnerFoerSkift, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.partnerSession.partner_id);
      const s = req.partnerSession;
      // Interne felter (status-historik, ansøgningstekst) vises ikke for partneren.
      const { ansoegning_besked, ...synlig } = P.fuldPartner(p);
      res.json({
        bruger: { email: s.email, navn: s.navn, skal_skifte_kode: s.skal_skifte_kode },
        partner: s.skal_skifte_kode ? { navn: p.navn } : synlig,
        powerups: P.POWERUPS,
      });
    } catch (e) {
      next(e);
    }
  });

  router.put('/partner/mig', partner, async (req, res, next) => {
    try {
      const felter = P.renFelter(req.body, P.PARTNER_REDIGERBARE);
      const p = await opdaterPartner(pool, req.partnerSession.partner_id, felter);
      const { ansoegning_besked, ...synlig } = P.fuldPartner(p);
      res.json({ partner: synlig });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  router.put('/partner/mig/logo', partner, logoBody, async (req, res, next) => {
    try {
      await gemLogo(req.partnerSession.partner_id, req, res, true);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = { partnersRouter, PARTNER_COOKIE };
