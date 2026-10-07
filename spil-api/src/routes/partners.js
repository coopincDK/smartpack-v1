'use strict';

const { invalidateStateCache } = require('../publicState');

// Partnere til Packrush — se API.md, afsnit "Partnere".
//  - Offentligt: GET /partnere, GET /partnere/:slug/logo, GET /praemier,
//    POST /partnere/ansoeg
//  - Admin (eksisterende admin-session): /admin/partnere*, /admin/partner-brugere*,
//    /admin/konkurrence
//  - Partner (egen cookie-session): /partner/*

const crypto = require('crypto');
const express = require('express');
const config = require('../config');
const { sha256Hex, hashPassword, verifyPassword, randomCode } = require('../crypto');
const { requireAdmin, parseCookies } = require('../middleware/adminAuth');
const { createRateLimiter } = require('../middleware/rateLimit');
const P = require('../partners');
const { toCsv } = require('../csv');
const { clientIp } = require('../middleware/clientIp');
const { sendTilCrm, crmKontaktUrl } = require('../crm');
const SMS = require('../sms');

// Login og startkode på sms til en ny/nulstillet partnerbruger (kun hvis admin har bedt om det).
async function smsLogin(pool, { til, email, kode, ny }) {
  if (!til) return null;
  if (!SMS.msisdn(til)) return { ok: false, grund: 'ugyldigt_nummer' };
  return SMS.send(pool, {
    type: 'partner_login', noegle: `${email}-${Date.now()}`, til, test: true, kunNodstop: true,
    logTekst: `${ny ? 'Dit login' : 'Ny kode'} til Packrush-partnerportalen. Log ind på smartpack.dk/spil/partner/ med din mail ${email} og Startkode: ****. Du bliver bedt om at vælge din egen kode første gang.`,
    tekst: `${ny ? 'Dit login' : 'Ny kode'} til Packrush-partnerportalen. Log ind på smartpack.dk/spil/partner/ med din mail ${email} og Startkode: ${kode}. Du bliver bedt om at vælge din egen kode første gang.`,
  });
}

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
  produktkategori, privatlivspolitik, afmeld_email, levering_navn, levering_email, privatliv_standard, privatliv_standard_tid,
  praemie_ikke_med, praemie_sidste_frist::text AS praemie_sidste_frist, praemie_flyt,
  fordel_ydelse, fordel_rabat, fordel_koebskrav, fordel_gyldig_til::text AS fordel_gyldig_til,
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
  felter = { ...felter };
  const foer = await hentPartner(pool, id);
  if (!foer) return null;
  // Standardprivatlivspolitik: når den vælges, peger linket på vores side for
  // partneren; vælges den fra, fjernes linket igen (kun hvis det var vores).
  if ('privatliv_standard' in felter) {
    const efter = { ...foer, ...felter };
    if (felter.privatliv_standard) {
      if (!P.privatlivMail(efter)) {
        throw new P.Valideringsfejl('Skriv en mail til afmeldinger og persondata først. Den står i standardpolitikken.', 'afmeld_email');
      }
      felter.privatlivspolitik = P.standardPrivatlivUrl(foer.slug);
      if (!foer.privatliv_standard) felter.privatliv_standard_tid = new Date();
    } else if ((felter.privatlivspolitik ?? foer.privatlivspolitik) === P.standardPrivatlivUrl(foer.slug)) {
      felter.privatlivspolitik = '';
    }
  } else if (foer.privatliv_standard && 'privatlivspolitik' in felter && felter.privatlivspolitik && felter.privatlivspolitik !== P.standardPrivatlivUrl(foer.slug)) {
    // Partneren skriver sit eget link: så bruges standarden ikke længere.
    felter.privatliv_standard = false;
  }
  const keys = Object.keys(felter);
  if (!keys.length) return foer;
  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  await pool.query(`UPDATE partner SET ${sets.join(', ')}, opdateret = now() WHERE id = $1`, [
    id,
    ...keys.map((k) => felter[k]),
  ]);
  // Partnerne indgår i spillets tilmeldingslister (cfg.partnerLister i
  // GET /state, se src/cfgLoad.js), så state-cachen skal ryddes.
  invalidateStateCache();
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

function konkurrenceView(k) {
  const nu = Date.now();
  const tid = k && k.lodtraekning ? new Date(k.lodtraekning).getTime() : null;
  const aktiv = tid !== null && tid > nu;
  return {
    navn: k ? k.navn : '',
    lodtraekning: k && k.lodtraekning ? new Date(k.lodtraekning).toISOString() : null,
    aktiv,
    tekst: aktiv ? (k.tekst_aktiv || '') : (k ? k.tekst_slut : ''),
    vinder:
      k && k.vinder_navn
        ? { navn: k.vinder_navn, firma: k.vinder_firma || '', dato: k.vinder_dato || null, tekst: k.vinder_tekst || '' }
        : null,
  };
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

  // Standardprivatlivspolitikkens data (kun partnere, der har valgt standarden).
  router.get('/partnere/:slug/privatliv', async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT ${KOLONNER} FROM partner WHERE slug = $1 AND status = 'aktiv' AND privatliv_standard = true`,
        [String(req.params.slug)]
      );
      if (!rows.length) return res.status(404).json({ fejl: 'Ingen standardpolitik for den partner.', kode: 'ikke_fundet' });
      const p = rows[0];
      res.set('Cache-Control', 'public, max-age=60');
      res.json({
        navn: p.navn,
        firmanavn: p.firmanavn || p.navn,
        cvr: p.cvr,
        adresse: p.adresse,
        hjemmeside: p.hjemmeside,
        produktkategori: p.produktkategori || 'sine produkter og ydelser',
        mail: P.privatlivMail(p),
        valgt: p.privatliv_standard_tid,
      });
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
      // Kopi til CRM'ets indbakke (kontaktformularen), så ansøgningen kan blive til et lead.
      // Efter svaret og uden at kunne fejle ansøgningen; uden SMARTPACK_CRM_KEY sker intet.
      const crmBody = {
        name: kontaktNavn, email, company: firmanavn, type: 'Partneransøgning (Packrush)',
        message: ['Ansøgning om at blive partner i Packrush.', felter.kort_beskrivelse, besked].filter(Boolean).join('\n\n'),
        page: 'https://smartpack.dk/spil/partner/',
      };
      if (felter.kontakt_telefon) crmBody.phone = felter.kontakt_telefon;
      if (felter.hjemmeside) crmBody.hjemmeside = felter.hjemmeside;
      sendTilCrm(crmBody, crmKontaktUrl())
        .then((r) => { if (!r.ok) console.error('[crm] partneransøgning', r.fejl); })
        .catch((e) => console.error('[crm] partneransøgning', e.message));
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
        invalidateStateCache();
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
        'INSERT INTO partner_bruger (id, partner_id, email, navn, password_hash, skal_skifte_kode, telefon) VALUES ($1, $2, $3, $4, $5, true, $6)',
        [id, p.id, email, navn, hashPassword(kode), SMS.msisdn(b.sms_telefon || p.kontakt_telefon) || null]
      );
      await audit(pool, req, 'partner_bruger_oprettet', { partner_id: p.id, bruger_id: id });
      const sms = await smsLogin(pool, { til: b.sms_telefon, email, kode, ny: true }).catch(() => ({ ok: false, grund: 'fejl' }));
      res.status(201).json({ bruger: { id, email, navn, skal_skifte_kode: true }, sms });
    } catch (e) {
      sendFejl(res, e, next);
    }
  });

  // Login-info på sms til ALLE partnere (Martin 7/10), uanset om de har været logget ind, og
  // uanset status, undtagen afviste og arkiverede.
  //  - Partnerbrugere med mobilnummer: login-info uden kode (adressen, mailen og "Glemt koden").
  //    Hver bruger får højst én (type partner_info, nøgle = bruger-id).
  //  - Partnere UDEN bruger, men med kontaktens mail og mobilnummer: der oprettes en bruger
  //    (kontaktens mail), og login + en ny startkode sendes på sms, præcis som "Ny bruger".
  // ?vis=1 viser modtagerne uden at sende eller oprette noget.
  router.post('/admin/partner-brugere/sms-info', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT b.id, b.email, b.telefon, p.navn, p.kontakt_telefon
           FROM partner_bruger b JOIN partner p ON p.id = b.partner_id
          WHERE p.status NOT IN ('afvist', 'arkiveret') ORDER BY p.navn, b.email`
      );
      const modtagere = rows.map((r) => {
        const tlf = SMS.msisdn(r.telefon) || ((!r.telefon && SMS.msisdn(r.kontakt_telefon)) ? SMS.msisdn(r.kontakt_telefon) : null);
        return { id: r.id, partner: r.navn, email: r.email, telefon: tlf };
      });
      const med = modtagere.filter((m) => m.telefon), uden = modtagere.filter((m) => !m.telefon);

      const { rows: udenBruger } = await pool.query(
        `SELECT p.id, p.navn, p.kontakt_navn, p.kontakt_email, p.kontakt_telefon FROM partner p
          WHERE p.status NOT IN ('afvist', 'arkiveret')
            AND NOT EXISTS (SELECT 1 FROM partner_bruger b WHERE b.partner_id = p.id)
          ORDER BY p.navn`
      );
      const opret = [];
      for (const p of udenBruger) {
        let email = null;
        try { email = P.renEmail(p.kontakt_email, 'email'); } catch (e) { email = null; }
        const tlf = SMS.msisdn(p.kontakt_telefon);
        const mangler = !email ? 'kontaktens mail mangler' : !tlf ? 'kontaktens mobilnummer mangler' : null;
        if (!mangler) {
          const { rows: findes } = await pool.query('SELECT 1 FROM partner_bruger WHERE email = $1', [email]);
          if (findes.length) { uden.push({ partner: p.navn, email, telefon: null, grund: 'mailen bruges allerede af en anden partner' }); continue; }
          opret.push({ partner_id: p.id, partner: p.navn, navn: p.kontakt_navn || '', email, telefon: tlf });
        } else uden.push({ partner: p.navn, email: email || '', telefon: null, grund: mangler });
      }
      if (req.query.vis === '1') return res.json({ med, opret, uden });

      const resultat = [];
      for (const m of med) {
        const r = await SMS.send(pool, {
          type: 'partner_info', noegle: m.id, til: m.telefon, test: true, kunNodstop: true,
          tekst: `Din bruger til Packrush-partnerportalen er klar: smartpack.dk/spil/partner/ Log ind med din mail ${m.email}. Har du glemt koden eller ikke fået en, så tryk "Glemt koden" og skriv dit mobilnummer.`,
        }).catch(() => ({ ok: false, grund: 'fejl' }));
        resultat.push({ partner: m.partner, email: m.email, ok: !!r.ok, grund: r.grund || null });
      }
      for (const o of opret) {
        const kode = randomCode(12);
        const id = crypto.randomUUID();
        await pool.query(
          'INSERT INTO partner_bruger (id, partner_id, email, navn, password_hash, skal_skifte_kode, telefon) VALUES ($1, $2, $3, $4, $5, true, $6)',
          [id, o.partner_id, o.email, o.navn, hashPassword(kode), o.telefon]
        );
        await audit(pool, req, 'partner_bruger_oprettet', { partner_id: o.partner_id, bruger_id: id, via: 'sms_alle' });
        const r = await smsLogin(pool, { til: o.telefon, email: o.email, kode, ny: true }).catch(() => ({ ok: false, grund: 'fejl' }));
        resultat.push({ partner: o.partner, email: o.email, ok: !!(r && r.ok), grund: (r && r.grund) || null, oprettet: true });
      }
      await audit(pool, req, 'partner_sms_info', { sendt: resultat.filter((r) => r.ok).length, i_alt: med.length + opret.length, oprettet: opret.length });
      res.json({ resultat, uden });
    } catch (e) { next(e); }
  });

  // Ny startkode (fx glemt kode). Logger brugeren ud overalt.
  router.post('/admin/partner-brugere/:bid/nulstil', admin, async (req, res, next) => {
    try {
      if (!erUuid(req.params.bid)) return res.status(404).json({ fejl: 'Brugeren findes ikke.', kode: 'ikke_fundet' });
      const kode = String((req.body && req.body.kode) || '');
      if (kode.length < MIN_KODE) throw new P.Valideringsfejl(`Startkoden skal være mindst ${MIN_KODE} tegn.`, 'kode');
      const r = await pool.query(
        'UPDATE partner_bruger SET password_hash = $2, skal_skifte_kode = true, telefon = COALESCE($3, telefon) WHERE id = $1',
        [req.params.bid, hashPassword(kode), SMS.msisdn((req.body && req.body.sms_telefon) || '') || null]
      );
      if (!r.rowCount) return res.status(404).json({ fejl: 'Brugeren findes ikke.', kode: 'ikke_fundet' });
      await pool.query('DELETE FROM partner_session WHERE bruger_id = $1', [req.params.bid]);
      await audit(pool, req, 'partner_bruger_nulstillet', { bruger_id: req.params.bid });
      let sms = null;
      if (req.body && req.body.sms_telefon) {
        const { rows: br } = await pool.query('SELECT email FROM partner_bruger WHERE id = $1', [req.params.bid]);
        sms = await smsLogin(pool, { til: req.body.sms_telefon, email: br[0].email, kode, ny: false }).catch(() => ({ ok: false, grund: 'fejl' }));
      }
      res.json({ ok: true, sms });
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
      let vinderDato = null;
      if (b.vinder_dato) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.vinder_dato))) {
          throw new P.Valideringsfejl('Vinderdatoen er ugyldig.', 'vinder_dato');
        }
        vinderDato = String(b.vinder_dato);
      }
      await pool.query(
        `UPDATE konkurrence SET navn = $1, lodtraekning = $2, tekst_aktiv = $3, tekst_slut = $4,
                vinder_navn = $5, vinder_firma = $6, vinder_dato = $7, vinder_tekst = $8, opdateret = now() WHERE id = 1`,
        [
          P.renTekst(b.navn, 200),
          tid,
          P.renTekst(b.tekst_aktiv, 2000),
          P.renTekst(b.tekst_slut, 2000),
          P.renTekst(b.vinder_navn, 200),
          P.renTekst(b.vinder_firma, 200),
          vinderDato,
          P.renTekst(b.vinder_tekst, 2000),
        ]
      );
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

  // Glemt kode: partneren skriver sit mobilnummer og får et engangslink på sms.
  // Svaret er altid det samme, så man ikke kan bruge formularen til at se, hvilke numre der findes.
  const glemtLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5, besked: 'For mange forsøg. Prøv igen om lidt.' });
  router.post('/partner/glemt-kode', glemtLimiter, async (req, res, next) => {
    try {
      const tlf = SMS.msisdn((req.body && req.body.telefon) || '');
      const svar = { ok: true, besked: 'Er nummeret registreret hos os, sender vi et link på sms om et øjeblik. Linket virker i 30 minutter.' };
      if (!tlf) return res.json(svar);
      const { rows } = await pool.query(
        `SELECT b.id, b.email, b.telefon, p.kontakt_telefon, p.kontakt_email
           FROM partner_bruger b JOIN partner p ON p.id = b.partner_id
          WHERE p.status <> 'arkiveret'`
      );
      const ramt = rows.filter((r) => SMS.msisdn(r.telefon) === tlf
        || (SMS.msisdn(r.kontakt_telefon) === tlf && (!r.telefon || String(r.kontakt_email || '').toLowerCase() === r.email))).slice(0, 3);
      for (const r of ramt) {
        const token = crypto.randomBytes(24).toString('base64url');
        await pool.query("UPDATE partner_bruger SET nulstil_hash = $2, nulstil_udloeber = now() + interval '30 minutes' WHERE id = $1", [r.id, sha256Hex(token)]);
        const link = `https://smartpack.dk/spil/partner/?nulstil=${token}`;
        await SMS.send(pool, {
          type: 'partner_nulstil', noegle: `${r.id}-${Date.now()}`, til: tlf, test: true, kunNodstop: true,
          logTekst: `Nulstil din kode til Packrush-partnerportalen (${r.email}): https://smartpack.dk/spil/partner/?nulstil=****. Linket virker i 30 minutter.`,
          tekst: `Nulstil din kode til Packrush-partnerportalen (${r.email}): ${link} Linket virker i 30 minutter.`,
        }).catch(() => null);
      }
      res.json(svar);
    } catch (e) { next(e); }
  });

  // Ny kode via engangslinket fra sms'en. Logger brugeren ud overalt.
  router.post('/partner/nulstil-kode', loginLimiter, async (req, res, next) => {
    try {
      const token = String((req.body && req.body.token) || '');
      const ny = String((req.body && req.body.ny) || '');
      if (ny.length < MIN_KODE) throw new P.Valideringsfejl(`Den nye kode skal være mindst ${MIN_KODE} tegn.`, 'ny');
      const { rows } = await pool.query(
        `UPDATE partner_bruger SET password_hash = $2, skal_skifte_kode = false, nulstil_hash = NULL, nulstil_udloeber = NULL
          WHERE nulstil_hash = $1 AND nulstil_udloeber > now() RETURNING id, email`,
        [sha256Hex(token), hashPassword(ny)]
      );
      if (!rows.length) return res.status(400).json({ fejl: 'Linket er udløbet eller allerede brugt. Bed om et nyt.', kode: 'ugyldigt_link' });
      await pool.query('DELETE FROM partner_session WHERE bruger_id = $1', [rows[0].id]);
      res.json({ ok: true, email: rows[0].email });
    } catch (e) { sendFejl(res, e, next); }
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

  // --- Partnervilkår: erklæringer og accept (packrush-tekster.md, afsnit 4E) ---

  async function senesteAccept(partnerId) {
    const { rows } = await pool.query(
      `SELECT bruger_email, vilkaar_version, tidspunkt FROM partner_accept
       WHERE partner_id = $1 ORDER BY tidspunkt DESC LIMIT 1`,
      [partnerId]
    );
    return rows[0] || null;
  }

  router.get('/partner/vilkaar', partner, async (req, res, next) => {
    try {
      const a = await senesteAccept(req.partnerSession.partner_id);
      res.json({
        version: P.PARTNERVILKAAR_VERSION,
        url: '/spil/partnervilkaar/',
        erklaeringer: P.ERKLAERINGER,
        accepteret: a && a.vilkaar_version === P.PARTNERVILKAAR_VERSION ? a : null,
      });
    } catch (e) {
      next(e);
    }
  });

  router.post('/partner/vilkaar', partner, async (req, res, next) => {
    try {
      const svar = (req.body && req.body.erklaeringer) || {};
      const mangler = P.ERKLAERINGER.filter((e) => svar[e.key] !== true).map((e) => e.key);
      if (mangler.length) {
        return res.status(400).json({ fejl: 'Sæt flueben ved alle erklæringerne.', kode: 'mangler_erklaeringer', mangler });
      }
      const s = req.partnerSession;
      const erkl = Object.fromEntries(P.ERKLAERINGER.map((e) => [e.key, e.tekst]));
      await pool.query(
        `INSERT INTO partner_accept (partner_id, bruger_id, bruger_email, vilkaar_version, erklaeringer, ip)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.partner_id, s.bruger_id, s.email, P.PARTNERVILKAAR_VERSION, JSON.stringify(erkl), clientIp(req)]
      );
      res.json({ ok: true, accepteret: await senesteAccept(s.partner_id) });
    } catch (e) {
      next(e);
    }
  });

  // --- Leads (partnervilkår pkt. 7) ---
  // Kun spillere, hvis SENESTE hændelse på listen 'partner:<slug>' er en
  // bekræftelse. Partneren ser aldrig andre partneres leads. Kræver, at
  // vilkårene er accepteret. Hver download logges.
  // Samtykkerne er en log (bekraeftet/trukket_tilbage pr. spiller og liste).
  // Tilstanden "pr. et tidspunkt" er den seneste hændelse før tidspunktet.
  // Bruges til "siden sidst": nye = aktiv nu, men ikke aktiv ved sidste
  // download; afmeldte = aktiv ved sidste download, men ikke nu. En spiller,
  // der afmelder sig og tilmelder sig igen, bliver "ny" igen.
  async function samtykkeTilstande(slug) {
    const liste = 'partner:' + slug;
    const { rows } = await pool.query(
      `SELECT spiller_id, type, tidspunkt, tekst, tekst_version, id FROM samtykke
       WHERE liste = $1 ORDER BY tidspunkt ASC, id ASC`,
      [liste]
    );
    return rows;
  }
  function tilstandVed(rows, tidspunkt) {
    const m = new Map();
    for (const r of rows) {
      if (tidspunkt && new Date(r.tidspunkt) > tidspunkt) continue;
      m.set(String(r.spiller_id), r);
    }
    return m;
  }
  function sidsteAfmelding(rows, spillerId) {
    let t = null;
    for (const r of rows) if (String(r.spiller_id) === String(spillerId) && r.type === 'trukket_tilbage') t = r.tidspunkt;
    return t;
  }
  async function spillerMap(ids) {
    if (!ids.length) return new Map();
    const { rows } = await pool.query('SELECT id, public_id, navn, email, firma FROM spiller WHERE id = ANY($1::bigint[])', [ids]);
    return new Map(rows.map((x) => [String(x.id), x]));
  }
  function tilLead(slug, x, r, status, afmeldt) {
    return {
      lead_id: sha256Hex(slug + ':' + x.public_id).slice(0, 16),
      navn: x.navn,
      email: x.email,
      firma: x.firma,
      status,
      samtykke_tidspunkt: r.type === 'bekraeftet' ? r.tidspunkt : null,
      afmeldt_tidspunkt: afmeldt || null,
      samtykke_tekst: r.type === 'bekraeftet' ? r.tekst || '' : '',
      samtykke_version: r.tekst_version,
    };
  }

  async function sidsteDownload(partnerId) {
    const { rows } = await pool.query(
      'SELECT tidspunkt, antal, slags FROM partner_lead_download WHERE partner_id = $1 ORDER BY tidspunkt DESC LIMIT 1',
      [partnerId]
    );
    return rows[0] || null;
  }

  // Alle aktive leads lige nu.
  async function hentLeads(slug) {
    const rows = await samtykkeTilstande(slug);
    const nu = tilstandVed(rows, null);
    const aktive = [...nu.values()].filter((r) => r.type === 'bekraeftet');
    const sp = await spillerMap(aktive.map((r) => r.spiller_id));
    return aktive.filter((r) => sp.has(String(r.spiller_id))).map((r) => tilLead(slug, sp.get(String(r.spiller_id)), r, 'aktiv'));
  }

  // Ændringer siden et tidspunkt (sidste download): nye og afmeldte.
  async function hentAendringer(slug, siden) {
    const rows = await samtykkeTilstande(slug);
    const foer = tilstandVed(rows, siden);
    const nu = tilstandVed(rows, null);
    const ud = [];
    for (const [sid, r] of nu) {
      const varAktiv = foer.has(sid) && foer.get(sid).type === 'bekraeftet';
      const erAktiv = r.type === 'bekraeftet';
      if (erAktiv && !varAktiv) ud.push({ sid, r, status: 'ny' });
      else if (!erAktiv && varAktiv) ud.push({ sid, r, status: 'afmeldt' });
    }
    const sp = await spillerMap(ud.map((u) => u.r.spiller_id));
    return ud
      .filter((u) => sp.has(u.sid))
      .map((u) => tilLead(slug, sp.get(u.sid), u.r, u.status, u.status === 'afmeldt' ? sidsteAfmelding(rows, u.sid) : null))
      .sort((a, b) => (a.status === b.status ? 0 : a.status === 'ny' ? -1 : 1));
  }

  // Ingen formler i Excel: felter, der starter med = + - @, får et ' foran.
  const csvSikker = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  };

  // Øvrige aktive partnere med kontaktoplysninger, så partnerne kan finde
  // hinanden. Kun til læsning, og først når partnervilkårene er accepteret
  // (vilkårene siger, at kontaktoplysningerne deles med de øvrige partnere).
  router.get('/partner/partnere', partner, async (req, res, next) => {
    try {
      const s = req.partnerSession;
      const a = await senesteAccept(s.partner_id);
      if (!a || a.vilkaar_version !== P.PARTNERVILKAAR_VERSION) {
        return res.status(403).json({ fejl: 'Accepter partnervilkårene først.', kode: 'vilkaar_ikke_accepteret' });
      }
      const { rows } = await pool.query(
        `SELECT ${KOLONNER} FROM partner WHERE status = 'aktiv' AND id <> $1 ORDER BY lower(navn)`,
        [s.partner_id]
      );
      res.json({
        partnere: rows.map((p) => ({
          navn: p.navn,
          firmanavn: p.firmanavn,
          hjemmeside: p.hjemmeside,
          kort_beskrivelse: p.kort_beskrivelse,
          kontakt_navn: p.kontakt_navn,
          kontakt_email: p.kontakt_email,
          kontakt_telefon: p.kontakt_telefon,
        })),
      });
    } catch (e) {
      next(e);
    }
  });

  router.get('/partner/leads', partner, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.partnerSession.partner_id);
      const leads = await hentLeads(p.slug);
      const sidst = await sidsteDownload(p.id);
      let nye = 0, afmeldte = 0;
      if (sidst) {
        const ae = await hentAendringer(p.slug, new Date(sidst.tidspunkt));
        nye = ae.filter((x) => x.status === 'ny').length;
        afmeldte = ae.filter((x) => x.status === 'afmeldt').length;
      }
      res.json({ antal: leads.length, sidst_hentet: sidst ? sidst.tidspunkt : null, sidst_antal: sidst ? sidst.antal : null, nye_siden_sidst: nye, afmeldte_siden_sidst: afmeldte });
    } catch (e) {
      next(e);
    }
  });

  router.get('/partner/leads.csv', partner, async (req, res, next) => {
    try {
      const s = req.partnerSession;
      const a = await senesteAccept(s.partner_id);
      if (!a || a.vilkaar_version !== P.PARTNERVILKAAR_VERSION) {
        return res.status(403).json({ fejl: 'Accepter partnervilkårene først.', kode: 'vilkaar_ikke_accepteret' });
      }
      const p = await hentPartner(pool, s.partner_id);
      // ?siden=sidst: kun ændringer siden partnerens seneste download (nye +
      // afmeldte). Uden en tidligere download er det hele den aktive liste.
      const sidst = await sidsteDownload(p.id);
      const aendringer = String(req.query.siden || '') === 'sidst' && sidst;
      const siden = aendringer ? new Date(sidst.tidspunkt) : null;
      const leads = aendringer ? await hentAendringer(p.slug, siden) : await hentLeads(p.slug);
      const filId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO partner_lead_download (partner_id, bruger_id, bruger_email, antal, fil_id, ip, slags, siden)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [s.partner_id, s.bruger_id, s.email, leads.length, filId, clientIp(req), aendringer ? 'aendringer' : 'alle', siden]
      );
      const iso = (d) => (d ? new Date(d).toISOString() : '');
      const csv = toCsv(leads, [
        { title: 'lead_id', value: (r) => r.lead_id },
        { title: 'status', value: (r) => r.status },
        { title: 'navn', value: (r) => csvSikker(r.navn) },
        { title: 'arbejdsmail', value: (r) => csvSikker(r.email) },
        { title: 'virksomhed', value: (r) => csvSikker(r.firma) },
        { title: 'samtykke_tidspunkt', value: (r) => iso(r.samtykke_tidspunkt) },
        { title: 'afmeldt_tidspunkt', value: (r) => iso(r.afmeldt_tidspunkt) },
        { title: 'samtykke_tekst', value: (r) => csvSikker(r.samtykke_tekst) },
        { title: 'samtykke_version', value: (r) => r.samtykke_version },
        { title: 'kanal', value: () => 'e-mail' },
      ]);
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="packrush-leads-${p.slug}${aendringer ? '-aendringer' : ''}.csv"`);
      res.set('X-Fil-Id', filId);
      res.send('\ufeff' + csv);
    } catch (e) {
      next(e);
    }
  });

  // Admin: hvem har accepteret, og hvem har hentet leads.
  router.get('/admin/partnere/:id/log', admin, async (req, res, next) => {
    try {
      const p = await hentPartner(pool, req.params.id);
      if (!p) return res.status(404).json({ fejl: 'Partneren findes ikke.', kode: 'ikke_fundet' });
      const { rows: accept } = await pool.query(
        'SELECT bruger_email, vilkaar_version, tidspunkt FROM partner_accept WHERE partner_id = $1 ORDER BY tidspunkt DESC',
        [p.id]
      );
      const { rows: downloads } = await pool.query(
        'SELECT bruger_email, antal, fil_id, tidspunkt, slags, siden FROM partner_lead_download WHERE partner_id = $1 ORDER BY tidspunkt DESC',
        [p.id]
      );
      res.json({ accept, downloads });
    } catch (e) {
      next(e);
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
