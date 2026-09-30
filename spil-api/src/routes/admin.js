'use strict';

const express = require('express');
const config = require('../config');
const { verifyPassword, randomCode } = require('../crypto');
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
const { playerToP } = require('../lifeBag');
const { clientIp } = require('../middleware/clientIp');
const { deletePlayerFully } = require('../playerDeletion');
const { runBackup: defaultRunBackup } = require('../backup');

const LISTE_RE = /^[a-z0-9:_.-]+$/;
const NULSTIL_BEKRAEFT = 'NULSTIL';
// Ét-gangs-standtablet-login-koder — se API.md, afsnit "Stand-login-flow".
const STAND_KODE_TTL_MS = 5 * 60 * 1000;
const STAND_KODE_LEN = 6;

async function getCfgRow(pool) {
  const { rows } = await pool.query('SELECT offentlig, hemmelig FROM config WHERE id = 1');
  return rows[0] || { offentlig: {}, hemmelig: {} };
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

function adminRouter(pool, opts) {
  opts = opts || {};
  const runBackup = opts.runBackup || defaultRunBackup;
  const router = express.Router();
  const admin = requireAdmin(pool);
  const loginLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    besked: 'For mange loginforsøg. Prøv igen om lidt.',
  });

  router.post('/admin/login', loginLimiter, async (req, res, next) => {
    try {
      const password = String((req.body && req.body.password) || '');
      if (!config.adminPasswordHash || !verifyPassword(password, config.adminPasswordHash)) {
        return res.status(401).json({ fejl: 'Forkert adgangskode.', kode: 'forkert_adgangskode' });
      }
      const token = await createSession(pool, config.adminSessionTtlMs);
      setSessionCookie(res, token, config.cookieSecure, config.adminSessionTtlMs);
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

  router.get('/admin/spillere', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, public_id, navn, email, telefon, firma, firma_noegle, vennekode, oprettet, skjult, badges
         FROM spiller ORDER BY oprettet DESC`
      );
      const cfgRow = await getCfgRow(pool);
      const ud = [];
      for (const r of rows) {
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
          tickets: await computeTickets(pool, r.id, cfgRow.offentlig),
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
      const cfgRow = await getCfgRow(pool);
      const offentlig = body.offentlig ? { ...cfgRow.offentlig, ...body.offentlig } : cfgRow.offentlig;
      const hemmelig = body.hemmelig ? { ...cfgRow.hemmelig, ...body.hemmelig } : cfgRow.hemmelig;
      await pool.query('UPDATE config SET offentlig = $1, hemmelig = $2 WHERE id = 1', [
        JSON.stringify(offentlig),
        JSON.stringify(hemmelig),
      ]);
      invalidateStateCache();
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
      res.json({ ok: true });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Bulk-afmelding af en tilmeldings-liste for en liste af emails (samme
  // NØGLE-format som PUT /me/subs's keys / DELETE /me/subs/:liste — 'sp',
  // 'm:<partner>', 'sms'). Logger ALTID en 'trukket_tilbage'-hændelse for
  // hver FUNDET email (uanset om listen allerede var afmeldt), med
  // kilde:'admin' — se API.md.
  router.post('/admin/afmeld', admin, async (req, res, next) => {
    const key = String((req.body && req.body.liste) || '').trim();
    const emailsRaw = Array.isArray(req.body && req.body.emails) ? req.body.emails : [];
    if (!key) return res.status(400).json({ fejl: 'Mangler liste.', kode: 'mangler_liste' });

    const client = await pool.connect();
    try {
      const cfgRow = await getCfgRow(pool);
      if (!subOptions(cfgRow.offentlig).some((o) => o.key === key)) {
        return res.status(400).json({ fejl: 'Ukendt tilmeldings-liste.', kode: 'ukendt_liste' });
      }

      const emails = [
        ...new Set(
          emailsRaw
            .map((e) => String(e || '').trim().toLowerCase())
            .filter(Boolean)
        ),
      ];
      if (!emails.length) return res.status(400).json({ fejl: 'Mangler emails.', kode: 'mangler_emails' });

      await client.query('BEGIN');
      const now = new Date();
      const ikkeFundet = [];
      let fundetAntal = 0;

      for (const email of emails) {
        const rowRes = await client.query('SELECT * FROM spiller WHERE email = $1 FOR UPDATE', [email]);
        if (!rowRes.rows.length) {
          ikkeFundet.push(email);
          continue;
        }
        const row = rowRes.rows[0];
        const p = playerToP(row);
        const tilbage = subKeys(p).filter((k) => k !== key);
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
        // Logges UBETINGET for hver fundet email (også hvis listen allerede
        // var afmeldt) — admin/afmeld er en audit-handling, ikke kun en
        // tilstandsændring, se API.md.
        await client.query(
          `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst_version, kilde, ip, user_agent, type)
           VALUES ($1,$2,$3,1,'admin',$4,$5,'trukket_tilbage')`,
          [row.id, listNameFor(key), now, clientIp(req), req.headers['user-agent'] || null]
        );
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
