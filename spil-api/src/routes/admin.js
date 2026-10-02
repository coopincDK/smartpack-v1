'use strict';

const express = require('express');
const { medPartnere, partnerLister } = require('../cfgLoad');
const config = require('../config');
const crypto = require('crypto');
const { verifyPassword, randomCode, hashPassword, sha256Hex } = require('../crypto');
const {
  requireAdmin,
  createSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  parseCookies,
  COOKIE_NAME,
} = require('../middleware/adminAuth');
const { createRateLimiter } = require('../middleware/rateLimit');
const { toCsv } = require('../csv');
const { boostCode } = require('../rules/boostCode');
const { computeTickets, todayStr } = require('../gameQueries');
const { invalidateStateCache } = require('../publicState');
const { subKeys, subOptions, setSubsPure, listNameFor } = require('../rules/life');
const { playerToP, currentBag, livView } = require('../lifeBag');
const { samtykkerFor } = require('./me');
const { clientIp } = require('../middleware/clientIp');
const { deletePlayerFully } = require('../playerDeletion');
const { runBackup: defaultRunBackup } = require('../backup');

const LISTE_RE = /^[a-z0-9:_.-]+$/;
const NULSTIL_BEKRAEFT = 'NULSTIL';
// Ét-gangs-standtablet-login-koder — se API.md, afsnit "Stand-login-flow".
const STAND_KODE_TTL_MS = 5 * 60 * 1000;
const STAND_KODE_LEN = 6;

// `raw: true` giver config præcis som den står i databasen (bruges, når den
// skal gemmes igen). Ellers lægges de aktive partnere ind som lister, se
// src/cfgLoad.js.
async function getCfgRow(pool, { raw = false } = {}) {
  const { rows } = await pool.query('SELECT offentlig, hemmelig FROM config WHERE id = 1');
  const row = rows[0] || { offentlig: {}, hemmelig: {} };
  if (raw) return row;
  return { ...row, offentlig: medPartnere(row.offentlig, await partnerLister(pool)) };
}

// Hvilke spiller-id'er har aktiv ('bekraeftet') status for én bestemt liste
// LIGE NU. Henter samtykke_status-viewet HELT UFILTRERET og filtrerer i
// JS — se den udførlige begrundelse i src/retention.js#findRetentionCandidates
// (kort: en SQL-side JOIN/WHERE-filtrering på viewets seneste_type-kolonne
// er upålidelig under pg-mem, som testsuiten falder tilbage til uden Docker).
async function activeSpillerIds(pool, liste) {
  const { rows } = await pool.query('SELECT spiller_id, liste, seneste_type FROM samtykke_status');
  return new Set(
    rows.filter((r) => r.liste === liste && r.seneste_type === 'bekraeftet').map((r) => String(r.spiller_id))
  );
}

async function drawWinner(pool, cfg) {
  const { rows } = await pool.query('SELECT id, navn, email FROM spiller WHERE skjult = false');
  const vaegte = [];
  for (const r of rows) {
    const t = await computeTickets(pool, r.id, cfg);
    if (t > 0) vaegte.push({ id: r.id, navn: r.navn, email: r.email, tickets: t });
  }
  const total = vaegte.reduce((a, w) => a + w.tickets, 0);
  if (total <= 0) return null;
  let x = Math.random() * total;
  for (const w of vaegte) {
    x -= w.tickets;
    if (x <= 0) return w;
  }
  return vaegte[vaegte.length - 1];
}

function adminRouter(pool, ws, opts) {
  opts = opts || {};
  const runBackup = opts.runBackup || defaultRunBackup;
  const router = express.Router();
  const admin = requireAdmin(pool);
  const loginLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    besked: 'For mange loginforsøg. Prøv igen om lidt.',
  });

  // Den gældende admin-kode: den admin selv har valgt (admin_kode), ellers
  // ADMIN_PASSWORD_HASH fra .env. Se 013_admin_kode.sql.
  async function aktuelAdminHash() {
    const { rows } = await pool.query('SELECT password_hash FROM admin_kode WHERE id = 1');
    return (rows[0] && rows[0].password_hash) || config.adminPasswordHash || '';
  }

  const skiftKodeLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    besked: 'For mange forsøg. Prøv igen om lidt.',
  });

  router.post('/admin/login', loginLimiter, async (req, res, next) => {
    try {
      const password = String((req.body && req.body.password) || '');
      const email = String((req.body && req.body.email) || '').trim().toLowerCase();
      if (email) {
        // Personligt login. Samme svar ved ukendt e-mail og forkert kode.
        const { rows } = await pool.query('SELECT * FROM admin_bruger WHERE email = $1', [email]);
        const b = rows[0];
        const nu = Date.now();
        if (b && b.spaerret_til && new Date(b.spaerret_til).getTime() > nu) {
          return res.status(429).json({ fejl: 'For mange forkerte forsøg. Prøv igen om et kvarter.', kode: 'spaerret' });
        }
        if (!b || !b.aktiv || !verifyPassword(password, b.password_hash)) {
          if (b) {
            const fejl = (b.pw_fejl || 0) + 1;
            await pool.query('UPDATE admin_bruger SET pw_fejl = $1, spaerret_til = $2 WHERE id = $3', [
              fejl >= 5 ? 0 : fejl,
              fejl >= 5 ? new Date(nu + 15 * 60 * 1000) : null,
              b.id,
            ]);
          }
          return res.status(401).json({ fejl: 'Forkert e-mail eller kode.', kode: 'forkert_adgangskode' });
        }
        const token = await createSession(pool, config.adminSessionTtlMs);
        await pool.query('UPDATE admin_session SET bruger_id = $1 WHERE token_hash = $2', [b.id, sha256Hex(token)]);
        await pool.query('UPDATE admin_bruger SET sidst_login = now(), pw_fejl = 0, spaerret_til = NULL WHERE id = $1', [b.id]);
        setSessionCookie(res, token, config.cookieSecure, config.adminSessionTtlMs);
        return res.json({ ok: true, email: b.email, skal_skifte_kode: b.skal_skifte_kode });
      }
      const hash = await aktuelAdminHash();
      if (!hash || !verifyPassword(password, hash)) {
        return res.status(401).json({ fejl: 'Forkert adgangskode.', kode: 'forkert_adgangskode' });
      }
      const token = await createSession(pool, config.adminSessionTtlMs);
      setSessionCookie(res, token, config.cookieSecure, config.adminSessionTtlMs);
      res.json({ ok: true, email: null, skal_skifte_kode: false });
    } catch (e) {
      next(e);
    }
  });

  // Skift admin-koden. Kræver den nuværende kode. Alle andre admin-sessioner
  // logges ud, så en gammel kode ikke kan bruges videre et andet sted.
  router.post('/admin/skift-kode', skiftKodeLimiter, admin, async (req, res, next) => {
    try {
      const gammel = String((req.body && req.body.gammel) || '');
      const ny = String((req.body && req.body.ny) || '');
      if (req.adminBruger) {
        // Personligt login: skifter kun brugerens egen kode.
        const { rows } = await pool.query('SELECT password_hash FROM admin_bruger WHERE id = $1', [req.adminBruger.id]);
        if (!verifyPassword(gammel, rows[0].password_hash)) {
          return res.status(401).json({ fejl: 'Den nuværende kode er forkert.', kode: 'forkert_adgangskode' });
        }
        if (ny.length < 12) return res.status(400).json({ fejl: 'Den nye kode skal være mindst 12 tegn.', kode: 'for_kort' });
        if (ny === gammel) {
          return res.status(400).json({ fejl: 'Den nye kode skal være forskellig fra den gamle.', kode: 'samme_kode' });
        }
        await pool.query('UPDATE admin_bruger SET password_hash = $1, skal_skifte_kode = false WHERE id = $2', [
          hashPassword(ny),
          req.adminBruger.id,
        ]);
        await pool.query('DELETE FROM admin_session WHERE bruger_id = $1 AND id <> $2', [req.adminBruger.id, req.adminSession.id]);
        return res.json({ ok: true });
      }
      const hash = await aktuelAdminHash();
      if (!hash || !verifyPassword(gammel, hash)) {
        return res.status(401).json({ fejl: 'Den nuværende kode er forkert.', kode: 'forkert_adgangskode' });
      }
      if (ny.length < 12) {
        return res.status(400).json({ fejl: 'Den nye kode skal være mindst 12 tegn.', kode: 'for_kort' });
      }
      if (ny === gammel) {
        return res.status(400).json({ fejl: 'Den nye kode skal være forskellig fra den gamle.', kode: 'samme_kode' });
      }
      await pool.query(
        `INSERT INTO admin_kode (id, password_hash, opdateret) VALUES (1, $1, now())
         ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, opdateret = now()`,
        [hashPassword(ny)]
      );
      await pool.query("DELETE FROM admin_session WHERE id <> $1 AND rolle = 'admin' AND bruger_id IS NULL", [
        req.adminSession.id,
      ]);
      await pool.query(
        `INSERT INTO admin_audit_log (admin_session_id, handling, detaljer) VALUES ($1, 'admin_kode_skiftet', '{}'::jsonb)`,
        [req.adminSession.id]
      );
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  // --- Personlige admin-logins (014_admin_brugere.sql) ---
  const SMARTPACK_MAIL = /^[^\s@]+@smartpack\.dk$/;

  router.get('/admin/mig', admin, (req, res) => {
    const b = req.adminBruger;
    res.json(b ? { email: b.email, navn: b.navn, skal_skifte_kode: b.skal_skifte_kode } : { email: null, skal_skifte_kode: false });
  });

  router.get('/admin/brugere', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, navn, aktiv, skal_skifte_kode, oprettet, sidst_login FROM admin_bruger ORDER BY email'
      );
      res.json({ brugere: rows });
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/brugere', admin, async (req, res, next) => {
    try {
      const email = String((req.body && req.body.email) || '').trim().toLowerCase();
      const navn = String((req.body && req.body.navn) || '').trim().slice(0, 100);
      const kode = String((req.body && req.body.kode) || '');
      if (!SMARTPACK_MAIL.test(email)) {
        return res.status(400).json({ fejl: 'Kun @smartpack.dk-adresser kan være admin.', kode: 'ugyldig_email' });
      }
      if (kode.length < 10) return res.status(400).json({ fejl: 'Startkoden skal være mindst 10 tegn.', kode: 'for_kort' });
      const findes = await pool.query('SELECT id, aktiv FROM admin_bruger WHERE email = $1', [email]);
      if (findes.rows.length && findes.rows[0].aktiv) {
        return res.status(400).json({ fejl: 'Der findes allerede en admin med den e-mail.', kode: 'findes' });
      }
      const id = findes.rows.length ? findes.rows[0].id : crypto.randomUUID();
      await pool.query(
        `INSERT INTO admin_bruger (id, email, navn, password_hash, skal_skifte_kode, aktiv)
         VALUES ($1, $2, $3, $4, true, true)
         ON CONFLICT (email) DO UPDATE SET navn = EXCLUDED.navn, password_hash = EXCLUDED.password_hash,
           skal_skifte_kode = true, aktiv = true, pw_fejl = 0, spaerret_til = NULL`,
        [id, email, navn, hashPassword(kode)]
      );
      await pool.query(
        `INSERT INTO admin_audit_log (admin_session_id, handling, detaljer) VALUES ($1, 'admin_bruger_oprettet', $2)`,
        [req.adminSession.id, JSON.stringify({ email })]
      );
      res.status(201).json({ ok: true, id, email });
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/brugere/:id/nulstil', admin, async (req, res, next) => {
    try {
      const kode = String((req.body && req.body.kode) || '');
      if (kode.length < 10) return res.status(400).json({ fejl: 'Startkoden skal være mindst 10 tegn.', kode: 'for_kort' });
      const r = await pool.query(
        'UPDATE admin_bruger SET password_hash = $1, skal_skifte_kode = true, pw_fejl = 0, spaerret_til = NULL WHERE id = $2',
        [hashPassword(kode), req.params.id]
      );
      if (!r.rowCount) return res.status(404).json({ fejl: 'Ukendt admin.', kode: 'ikke_fundet' });
      await pool.query('DELETE FROM admin_session WHERE bruger_id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  // Luk et admin-login (rækken bevares, så historikken kan ses).
  router.delete('/admin/brugere/:id', admin, async (req, res, next) => {
    try {
      if (req.adminBruger && req.adminBruger.id === req.params.id) {
        return res.status(400).json({ fejl: 'Du kan ikke lukke dit eget login.', kode: 'eget_login' });
      }
      const r = await pool.query('UPDATE admin_bruger SET aktiv = false WHERE id = $1', [req.params.id]);
      if (!r.rowCount) return res.status(404).json({ fejl: 'Ukendt admin.', kode: 'ikke_fundet' });
      await pool.query('DELETE FROM admin_session WHERE bruger_id = $1', [req.params.id]);
      await pool.query(
        `INSERT INTO admin_audit_log (admin_session_id, handling, detaljer) VALUES ($1, 'admin_bruger_lukket', $2)`,
        [req.adminSession.id, JSON.stringify({ id: req.params.id })]
      );
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/logout', admin, async (req, res, next) => {
    try {
      const token = parseCookies(req)[COOKIE_NAME];
      await destroySession(pool, token);
      clearSessionCookie(res, config.cookieSecure);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  // Opgave G: komplet organisatordata. Ud over de oprindelige felter (nu
  // også fuldt, UMASKERET navn — dette ER et admin-endpoint) medtager hver
  // spiller: `tilmeldinger` (varige, afledte samtykke-status pr. liste,
  // inkl. om sms/notify er aktiv — samme form som GET /me's `samtykker`, se
  // src/routes/me.js#samtykkerFor), `beaten_i_dag` (dagens
  // beaten-notifikationer fra notifikation-tabellen), `forsoeg` (score, dag,
  // sluttidspunkt for hvert GODKENDT forsøg), og `liv` (liv tilbage i dag).
  // Se API.md for de præcise feltnavne.
  router.get('/admin/spillere', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM spiller ORDER BY oprettet DESC`);
      const cfgRow = await getCfgRow(pool);
      const cfg = cfgRow.offentlig || {};
      const now = new Date();
      const today = todayStr(now);

      const ud = [];
      for (const r of rows) {
        const tilmeldinger = await samtykkerFor(pool, r.id);
        const bag = await currentBag(pool, r, cfg, now);

        const forsoegRes = await pool.query(
          `SELECT samlet, oprettet, slut_server FROM forsoeg
           WHERE spiller_id = $1 AND status = 'godkendt' ORDER BY oprettet ASC`,
          [r.id]
        );
        const forsoeg = forsoegRes.rows.map((f) => ({
          score: f.samlet,
          dag: todayStr(f.oprettet),
          slut_server: f.slut_server ? f.slut_server.toISOString() : null,
        }));

        const beatenRes = await pool.query(
          `SELECT data, oprettet FROM notifikation
           WHERE spiller_id = $1 AND type = 'beaten' AND (data->>'day') = $2
           ORDER BY oprettet ASC`,
          [r.id, today]
        );
        const beatenIDag = beatenRes.rows.map((n) => ({ ...n.data, oprettet: n.oprettet }));

        ud.push({
          pid: r.public_id,
          navn: r.navn,
          email: r.email,
          telefon: r.telefon,
          firma: r.firma,
          firmaNoegle: r.firma_noegle,
          vennekode: r.vennekode,
          oprettet: r.oprettet,
          skjult: r.skjult,
          badges: r.badges,
          tickets: await computeTickets(pool, r.id, cfg),
          tilmeldinger,
          beaten_i_dag: beatenIDag,
          forsoeg,
          liv: livView(bag, playerToP(r), cfg, now),
        });
      }
      res.json({ spillere: ud });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/eksport/spillere.csv', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT public_id, navn, email, telefon, firma, vennekode, oprettet, skjult FROM spiller ORDER BY oprettet ASC`
      );
      const csv = toCsv(rows, [
        { title: 'pid', value: (r) => r.public_id },
        { title: 'navn', value: (r) => r.navn },
        { title: 'email', value: (r) => r.email },
        { title: 'telefon', value: (r) => r.telefon },
        { title: 'firma', value: (r) => r.firma },
        { title: 'vennekode', value: (r) => r.vennekode },
        { title: 'oprettet', value: (r) => r.oprettet.toISOString() },
        { title: 'skjult', value: (r) => r.skjult },
      ]);
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="spillere.csv"');
      res.send(csv);
    } catch (e) {
      next(e);
    }
  });

  // Packrush: samtykke er nu en hændelseslog (se migrations/003_packrush.sql)
  // — CSV'en viser derfor FØRSTE og SENESTE bekræftelse pr. spiller (ikke
  // bare ét tidspunkt), plus om listen er aktiv lige nu. Beregnet i JS ud
  // fra rå hændelser (samme begrundelse som activeSpillerIds() ovenfor —
  // undgår upålidelig SQL-side filtrering af en DISTINCT ON-baseret status
  // under pg-mem-testfaldbacket).
  router.get('/admin/eksport/samtykke/:liste.csv', admin, async (req, res, next) => {
    try {
      const liste = req.params.liste;
      if (!LISTE_RE.test(liste)) {
        return res.status(400).json({ fejl: 'Ugyldigt listenavn.', kode: 'ugyldig_liste' });
      }
      const { rows: haendelser } = await pool.query(
        `SELECT spiller_id, type, tidspunkt FROM samtykke WHERE liste = $1 ORDER BY spiller_id, tidspunkt ASC, id ASC`,
        [liste]
      );
      const perSpiller = new Map();
      for (const h of haendelser) {
        const key = String(h.spiller_id);
        let acc = perSpiller.get(key);
        if (!acc) {
          acc = { foerste_bekraeftelse: null, seneste_bekraeftelse: null, seneste_type: null };
          perSpiller.set(key, acc);
        }
        if (h.type === 'bekraeftet') {
          if (!acc.foerste_bekraeftelse) acc.foerste_bekraeftelse = h.tidspunkt;
          acc.seneste_bekraeftelse = h.tidspunkt;
        }
        acc.seneste_type = h.type; // rækkerne er ORDER BY tidspunkt ASC, så sidste tildeling vinder
      }

      const { rows: spillere } = await pool.query('SELECT id, navn, email, telefon, firma FROM spiller');
      const spillerById = new Map(spillere.map((s) => [String(s.id), s]));

      const rows = [...perSpiller.entries()]
        .map(([id, acc]) => {
          const s = spillerById.get(id);
          return s ? { ...s, ...acc } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.navn.localeCompare(b.navn));

      const csv = toCsv(rows, [
        { title: 'navn', value: (r) => r.navn },
        { title: 'email', value: (r) => r.email },
        { title: 'telefon', value: (r) => r.telefon },
        { title: 'firma', value: (r) => r.firma },
        { title: 'liste', value: () => liste },
        {
          title: 'foerste_bekraeftelse',
          value: (r) => (r.foerste_bekraeftelse ? new Date(r.foerste_bekraeftelse).toISOString() : ''),
        },
        {
          title: 'seneste_bekraeftelse',
          value: (r) => (r.seneste_bekraeftelse ? new Date(r.seneste_bekraeftelse).toISOString() : ''),
        },
        { title: 'aktiv', value: (r) => r.seneste_type === 'bekraeftet' },
      ]);
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="samtykke-${liste.replace(/[^a-z0-9_.-]/gi, '_')}.csv"`);
      res.send(csv);
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/eksport/sms.csv', admin, async (req, res, next) => {
    try {
      const aktiveIds = await activeSpillerIds(pool, 'sms');
      const alle = await pool.query(
        `SELECT id, navn, email, telefon, firma FROM spiller WHERE skjult = false ORDER BY navn ASC`
      );
      const rows = alle.rows.filter((r) => aktiveIds.has(String(r.id)));
      const csv = toCsv(rows, [
        { title: 'navn', value: (r) => r.navn },
        { title: 'email', value: (r) => r.email },
        { title: 'telefon', value: (r) => r.telefon },
        { title: 'firma', value: (r) => r.firma },
      ]);
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="sms-liste.csv"');
      res.send(csv);
    } catch (e) {
      next(e);
    }
  });

  // Revanche-liste: spillere på sms-listen der er blevet overhalet i dag
  // (svarer til klientens revList()) — inkl. en SMS-tekst-skabelon pr. række.
  router.get('/admin/eksport/revanche.csv', admin, async (req, res, next) => {
    try {
      const today = todayStr(new Date());
      const aktiveIds = await activeSpillerIds(pool, 'sms');
      const alle = await pool.query(
        `SELECT DISTINCT s.id, s.navn, s.email, s.telefon, s.firma, n.data
         FROM spiller s
         JOIN notifikation n ON n.spiller_id = s.id AND n.type = 'beaten'
         WHERE s.skjult = false AND (n.data->>'day') = $1
         ORDER BY s.navn ASC`,
        [today]
      );
      const rows = alle.rows.filter((r) => aktiveIds.has(String(r.id)));
      const csv = toCsv(rows, [
        { title: 'navn', value: (r) => r.navn },
        { title: 'email', value: (r) => r.email },
        { title: 'telefon', value: (r) => r.telefon },
        { title: 'firma', value: (r) => r.firma },
        {
          title: 'sms_tekst',
          value: (r) =>
            `Hej ${r.navn}! Du blev overhalet i "Packrush" af ${r.data.by} med ${r.data.score} point. Kan du tage tronen tilbage? Spil igen på standen!`,
        },
      ]);
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="revanche-liste.csv"');
      res.send(csv);
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/lodtraekning', admin, async (req, res, next) => {
    try {
      const kortNavn = String((req.body && req.body.kort_navn) || 'default').slice(0, 60);
      const cfgRow = await getCfgRow(pool);
      const vinder = await drawWinner(pool, cfgRow.offentlig);
      if (!vinder) {
        return res.status(400).json({ fejl: 'Ingen spillere er berettiget til lodtrækning.', kode: 'ingen_vinder' });
      }
      await pool.query(
        `INSERT INTO raffle_draws (kort_navn, spiller_id, spiller_navn_snapshot, email_snapshot)
         VALUES ($1, $2, $3, $4)`,
        [kortNavn, vinder.id, vinder.navn, vinder.email]
      );
      res.json({ vinder: { navn: vinder.navn, email: vinder.email, tickets: vinder.tickets } });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/config', admin, async (req, res, next) => {
    try {
      const cfgRow = await getCfgRow(pool);
      res.json(cfgRow);
    } catch (e) {
      next(e);
    }
  });

  router.put('/admin/config', admin, async (req, res, next) => {
    try {
      const body = req.body || {};
      const cfgRow = await getCfgRow(pool, { raw: true });
      // partnerLister er afledt af partner-tabellen og må ikke gemmes i config.
      const ind = body.offentlig ? { ...body.offentlig } : null;
      if (ind) delete ind.partnerLister;
      const offentlig = ind ? { ...cfgRow.offentlig, ...ind } : cfgRow.offentlig;
      const hemmelig = body.hemmelig ? { ...cfgRow.hemmelig, ...body.hemmelig } : cfgRow.hemmelig;
      await pool.query('UPDATE config SET offentlig = $1, hemmelig = $2 WHERE id = 1', [
        JSON.stringify(offentlig),
        JSON.stringify(hemmelig),
      ]);
      invalidateStateCache();
      // Opgave E: state.changed broadcastes nu også ved admin-config-ændring
      // (GET /state's cfg-felt afspejler den nye config).
      if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();
      res.json({ offentlig, hemmelig });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/boostkode', admin, async (req, res, next) => {
    try {
      const cfgRow = await getCfgRow(pool);
      const today = todayStr(new Date());
      const kode = boostCode(today, cfgRow.hemmelig.pin || '8500');
      res.json({ dag: today, kode });
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/spillere/:pid/skjul', admin, async (req, res, next) => {
    try {
      const skjult = !!(req.body && req.body.skjult);
      const { rowCount } = await pool.query('UPDATE spiller SET skjult = $1 WHERE public_id = $2', [
        skjult,
        req.params.pid,
      ]);
      if (!rowCount) return res.status(404).json({ fejl: 'Ukendt spiller.', kode: 'ukendt_spiller' });
      invalidateStateCache();
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  // Nulstil en spillers pinkode (glemt pinkode eller profil oprettet før
  // pinkoderne). Standen giver spilleren en ny, tilfældig 4-cifret pinkode,
  // som kun vises her én gang. Spærringen ophæves samtidig.
  async function nulstilPin(res, next, where, value) {
    try {
      const pin = randomCode(4, '0123456789');
      const { rowCount } = await pool.query(
        `UPDATE spiller SET pin_hash = $1, pin_fejl = 0, pin_spaerret_til = NULL WHERE ${where} = $2`,
        [hashPassword(pin), value]
      );
      if (!rowCount) return res.status(404).json({ fejl: 'Ukendt spiller.', kode: 'ukendt_spiller' });
      res.json({ ok: true, pin });
    } catch (e) {
      next(e);
    }
  }
  router.post('/admin/spillere/:pid/nulstil-pin', admin, (req, res, next) =>
    nulstilPin(res, next, 'public_id', req.params.pid)
  );
  // Samme, men slået op på e-mail (det standen har ved hånden).
  router.post('/admin/nulstil-pin', admin, (req, res, next) =>
    nulstilPin(res, next, 'email', String((req.body && req.body.email) || '').trim().toLowerCase())
  );

  // Rigtig sletning (GDPR) — sletter spilleren og alt tilhørende data, samt
  // anonymiserer rest-referencer i andre spilleres data (se
  // src/playerDeletion.js — samme fælles funktion som det natlige
  // GDPR-oprydningsjob og POST /admin/nulstil bruger).
  router.delete('/admin/spillere/:pid', admin, async (req, res, next) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('SELECT id, navn FROM spiller WHERE public_id = $1 FOR UPDATE', [
        req.params.pid,
      ]);
      if (!rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ fejl: 'Ukendt spiller.', kode: 'ukendt_spiller' });
      }
      await deletePlayerFully(client, rows[0].id, rows[0].navn);
      await client.query('COMMIT');
      invalidateStateCache();
      // Opgave E: state.changed broadcastes nu også ved sletning af én
      // spiller (forsvinder fra GET /state's players-liste).
      if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();
      res.json({ ok: true });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Slår én modtager-identifikator op — enten en email (indeholder '@') eller
  // et telefonnummer (matchet på de sidste 8 cifre, SAMME matchning som login
  // bruger, se src/routes/players.js#last8) — se API.md, opgave H.
  async function findSpillerByIdentifier(client, raw) {
    const val = String(raw || '').trim();
    if (!val) return null;
    if (val.includes('@')) {
      const r = await client.query('SELECT * FROM spiller WHERE email = $1 FOR UPDATE', [val.toLowerCase()]);
      return r.rows[0] || null;
    }
    const cifre = val.replace(/[^0-9]/g, '');
    if (cifre.length < 8) return null;
    const sidste8 = cifre.slice(-8);
    // LIKE + `||` i stedet for fx `right(telefon, 8)` — bevidst simpelt og
    // portabelt (samme forbehold som andre steder i kodebasen, se README.md,
    // "pg-mem-forbehold"). `telefon` er allerede rene cifre (normalizePhone
    // ved registrering), så dette matcher nøjagtig de sidste 8 cifre.
    const r = await client.query('SELECT * FROM spiller WHERE telefon LIKE (\'%\' || $1) FOR UPDATE', [sidste8]);
    return r.rows[0] || null;
  }

  // Bulk-afmelding af en tilmeldings-liste for en liste af modtagere (samme
  // NØGLE-format som PUT /me/subs's keys / DELETE /me/subs/:liste — 'sp',
  // 'm:<partner>', 'sms' — ELLER 'alle' for samtlige lister, se nedenfor).
  // `emails`-arrayet kan indeholde BÅDE emails og telefonnumre (opgave H) —
  // se findSpillerByIdentifier ovenfor.
  router.post('/admin/afmeld', admin, async (req, res, next) => {
    const key = String((req.body && req.body.liste) || '').trim();
    const identifiersRaw = Array.isArray(req.body && req.body.emails) ? req.body.emails : [];
    if (!key) return res.status(400).json({ fejl: 'Mangler liste.', kode: 'mangler_liste' });

    const client = await pool.connect();
    try {
      const cfgRow = await getCfgRow(pool);
      const erAlle = key === 'alle';
      if (!erAlle && !subOptions(cfgRow.offentlig).some((o) => o.key === key)) {
        return res.status(400).json({ fejl: 'Ukendt tilmeldings-liste.', kode: 'ukendt_liste' });
      }

      const identifiers = [...new Set(identifiersRaw.map((e) => String(e || '').trim()).filter(Boolean))];
      if (!identifiers.length) return res.status(400).json({ fejl: 'Mangler emails.', kode: 'mangler_emails' });

      await client.query('BEGIN');
      const now = new Date();
      const ikkeFundet = [];
      let fundetAntal = 0;

      for (const ident of identifiers) {
        const row = await findSpillerByIdentifier(client, ident);
        if (!row) {
          ikkeFundet.push(ident);
          continue;
        }
        const p = playerToP(row);
        // `liste: "alle"`: opgiv ALLE varigt tilmeldte lister (desired=[]) —
        // `result.removed` indeholder da netop de lister spilleren rent
        // faktisk var aktivt tilmeldt (kun DEM logges, se nedenfor). En
        // enkelt navngiven liste opfører sig som hidtil (kun DEN fjernes).
        const tilbage = erAlle ? [] : subKeys(p).filter((k) => k !== key);
        const result = setSubsPure(p, tilbage, cfgRow.offentlig, now);

        await client.query(
          'UPDATE spiller SET marketing = $1, mail_to = $2, notify = $3, tick_dag = $4, tick_keys = $5 WHERE id = $6',
          [
            result.p.marketing,
            JSON.stringify(result.p.mailTo),
            result.p.notify,
            result.p.tick.day,
            JSON.stringify(result.p.tick.keys),
            row.id,
          ]
        );

        if (erAlle) {
          // Kun for lister spilleren VAR aktivt tilmeldt (result.removed) —
          // i modsætning til en enkelt navngiven liste logges IKKE
          // ubetinget for enhver mulig liste, se API.md.
          for (const fjernetKey of result.removed) {
            await client.query(
              `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst_version, kilde, ip, user_agent, type)
               VALUES ($1,$2,$3,1,'admin',$4,$5,'trukket_tilbage')`,
              [row.id, listNameFor(fjernetKey), now, clientIp(req), req.headers['user-agent'] || null]
            );
          }
        } else {
          // Logges UBETINGET for hver fundet modtager (også hvis listen
          // allerede var afmeldt) — admin/afmeld er en audit-handling, ikke
          // kun en tilstandsændring, se API.md.
          await client.query(
            `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst_version, kilde, ip, user_agent, type)
             VALUES ($1,$2,$3,1,'admin',$4,$5,'trukket_tilbage')`,
            [row.id, listNameFor(key), now, clientIp(req), req.headers['user-agent'] || null]
          );
        }
        fundetAntal++;
      }

      await client.query('COMMIT');
      invalidateStateCache();
      res.json({ fundet: fundetAntal, ikke_fundet: ikkeFundet });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Fuld nulstilling — RYDDER AL SPILLERDATA. Tiltænkt at rydde testdata
  // efter en generalprøve, se API.md. Kræver PRÆCIS bekræftelses-strengen
  // "NULSTIL" (ellers 400 — INGEN sletning sker). Tager FØRST en pg_dump
  // (se src/backup.js) som sikkerhedsnet; fejler backuppen, afbrydes
  // nulstillingen HELT (ingen transaktion åbnes engang). Derefter slettes
  // ALLE spillere (+ deres forsøg/notifikationer/samtykker) via samme
  // fælles src/playerDeletion.js som retention-jobbet og
  // DELETE /admin/spillere/:pid. Uigenkaldeligt efter bekræftelsen.
  router.post('/admin/nulstil', admin, async (req, res, next) => {
    try {
      const bekraeft = String((req.body && req.body.bekraeft) || '');
      if (bekraeft !== NULSTIL_BEKRAEFT) {
        return res.status(400).json({
          fejl: `Bekræftelse mangler eller er forkert — send bekraeft: "${NULSTIL_BEKRAEFT}".`,
          kode: 'mangler_bekraeftelse',
        });
      }

      const backupSti = await runBackup();

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const { rows } = await client.query('SELECT id, navn FROM spiller ORDER BY id FOR UPDATE');
        for (const r of rows) {
          await deletePlayerFully(client, r.id, r.navn);
        }
        await client.query(
          `INSERT INTO admin_audit_log (admin_session_id, handling, antal, detaljer)
           VALUES ($1, 'nulstil', $2, $3)`,
          [req.adminSession.id, rows.length, JSON.stringify({ backup: backupSti })]
        );
        await client.query('COMMIT');
        invalidateStateCache();
        // Opgave E: state.changed broadcastes nu også ved admin/nulstil
        // (ALLE spillere forsvinder fra GET /state's players-liste).
        if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();

        // ALDRIG navne/emails i loggen — kun antal + backup-sti + hvilken
        // admin-session (session-id, ikke adgangskoden), se README.md.
        // eslint-disable-next-line no-console
        console.log(
          `[admin/nulstil] ${new Date().toISOString()} slettede ${rows.length} spiller(e), ` +
            `admin-session ${req.adminSession.id}, backup: ${backupSti}`
        );
        res.json({ ok: true, antal_slettet: rows.length, backup: backupSti });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (e) {
      next(e);
    }
  });

  // --- Stand-login-flow (opgave B) --------------------------------------
  // 1) En admin (kræver fuld admin-adgang) genererer en kort, tilfældig,
  //    ét-gangs-kode med kort udløb fra adminpanelet.
  // 2) En medarbejder taster koden ind på standtablettens EGEN browser
  //    (POST /stand-login nedenfor — intet admin-krav der, koden ER
  //    adgangsbeviset). Ved match udstedes en langtlevende 'stand'-session
  //    KUN til den forbindelse — se API.md, afsnit "Stand-login-flow".
  router.post('/admin/stand-login-kode', admin, async (req, res, next) => {
    try {
      const kode = randomCode(STAND_KODE_LEN);
      const udloeber = new Date(Date.now() + STAND_KODE_TTL_MS);
      await pool.query('INSERT INTO stand_login_kode (kode, udloeber) VALUES ($1, $2)', [kode, udloeber]);
      res.json({ kode, udloeber, gyldig_i_ms: STAND_KODE_TTL_MS });
    } catch (e) {
      next(e);
    }
  });

  const standLoginLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 10,
    besked: 'For mange loginforsøg. Prøv igen om lidt.',
  });

  // Bevidst UDEN for-krav om admin-cookie — koden selv er adgangsbeviset.
  // Se filens toptekst for hele flowet.
  router.post('/stand-login', standLoginLimiter, async (req, res, next) => {
    try {
      const kode = String((req.body && req.body.kode) || '').trim().toUpperCase();
      if (!kode) return res.status(400).json({ fejl: 'Mangler kode.', kode: 'mangler_kode' });

      const { rowCount } = await pool.query(
        `UPDATE stand_login_kode SET brugt = true WHERE kode = $1 AND brugt = false AND udloeber > now()`,
        [kode]
      );
      if (!rowCount) {
        return res.status(400).json({ fejl: 'Ugyldig eller udløbet kode.', kode: 'ugyldig_kode' });
      }

      const token = await createSession(pool, config.standSessionTtlMs, 'stand');
      setSessionCookie(res, token, config.cookieSecure, config.standSessionTtlMs);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = { adminRouter };
