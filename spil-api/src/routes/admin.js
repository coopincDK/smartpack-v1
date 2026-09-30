'use strict';

const express = require('express');
const config = require('../config');
const { verifyPassword } = require('../crypto');
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

const LISTE_RE = /^[a-z0-9:_.-]+$/;

async function getCfgRow(pool) {
  const { rows } = await pool.query('SELECT offentlig, hemmelig FROM config WHERE id = 1');
  return rows[0] || { offentlig: {}, hemmelig: {} };
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

function adminRouter(pool) {
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

  router.get('/admin/eksport/samtykke/:liste.csv', admin, async (req, res, next) => {
    try {
      const liste = req.params.liste;
      if (!LISTE_RE.test(liste)) {
        return res.status(400).json({ fejl: 'Ugyldigt listenavn.', kode: 'ugyldig_liste' });
      }
      const { rows } = await pool.query(
        `SELECT s.navn, s.email, s.telefon, s.firma, k.liste, k.givet, k.trukket_tilbage, k.tekst_version
         FROM samtykke k JOIN spiller s ON s.id = k.spiller_id
         WHERE k.liste = $1 ORDER BY k.givet ASC`,
        [liste]
      );
      const csv = toCsv(rows, [
        { title: 'navn', value: (r) => r.navn },
        { title: 'email', value: (r) => r.email },
        { title: 'telefon', value: (r) => r.telefon },
        { title: 'firma', value: (r) => r.firma },
        { title: 'liste', value: (r) => r.liste },
        { title: 'givet', value: (r) => r.givet.toISOString() },
        { title: 'trukket_tilbage', value: (r) => (r.trukket_tilbage ? r.trukket_tilbage.toISOString() : '') },
        { title: 'tekst_version', value: (r) => r.tekst_version },
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
      const { rows } = await pool.query(
        `SELECT s.navn, s.email, s.telefon, s.firma FROM spiller s
         JOIN samtykke k ON k.spiller_id = s.id AND k.liste = 'sms' AND k.trukket_tilbage IS NULL
         WHERE s.skjult = false ORDER BY s.navn ASC`
      );
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
      const { rows } = await pool.query(
        `SELECT DISTINCT s.navn, s.email, s.telefon, s.firma, n.data
         FROM spiller s
         JOIN samtykke k ON k.spiller_id = s.id AND k.liste = 'sms' AND k.trukket_tilbage IS NULL
         JOIN notifikation n ON n.spiller_id = s.id AND n.type = 'beaten'
         WHERE s.skjult = false AND (n.data->>'day') = $1
         ORDER BY s.navn ASC`,
        [today]
      );
      const csv = toCsv(rows, [
        { title: 'navn', value: (r) => r.navn },
        { title: 'email', value: (r) => r.email },
        { title: 'telefon', value: (r) => r.telefon },
        { title: 'firma', value: (r) => r.firma },
        {
          title: 'sms_tekst',
          value: (r) =>
            `Hej ${r.navn}! Du blev overhalet i "Pluk. Pak. Send." af ${r.data.by} med ${r.data.score} point. Kan du tage tronen tilbage? Spil igen på standen!`,
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

  // Rigtig sletning (GDPR) — sletter spilleren og alt tilhørende data.
  router.delete('/admin/spillere/:pid', admin, async (req, res, next) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('SELECT id FROM spiller WHERE public_id = $1 FOR UPDATE', [
        req.params.pid,
      ]);
      if (!rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ fejl: 'Ukendt spiller.', kode: 'ukendt_spiller' });
      }
      const id = rows[0].id;
      await client.query('UPDATE raffle_draws SET spiller_id = NULL WHERE spiller_id = $1', [id]);
      await client.query('UPDATE spiller SET ref_spiller_id = NULL WHERE ref_spiller_id = $1', [id]);
      await client.query('DELETE FROM notifikation WHERE spiller_id = $1', [id]);
      await client.query('DELETE FROM samtykke WHERE spiller_id = $1', [id]);
      await client.query('DELETE FROM forsoeg WHERE spiller_id = $1', [id]);
      await client.query('DELETE FROM spiller WHERE id = $1', [id]);
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

  return router;
}

module.exports = { adminRouter };
