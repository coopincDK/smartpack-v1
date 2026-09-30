'use strict';

const express = require('express');
const { requirePlayer } = require('../middleware/playerAuth');
const {
  subKeys,
  subOptions,
  setSubsPure,
  setTicksPure,
  listNameFor,
  todayStr,
  todayTickKeys,
} = require('../rules/life');
const { boostCode } = require('../rules/boostCode');
const { MAX_LIVES } = require('../rules/constants');
const { currentBag, persistBag, livView, playerToP } = require('../lifeBag');
const { computeTickets } = require('../gameQueries');
const { clientIp } = require('../middleware/clientIp');
const { invalidateStateCache } = require('../publicState');

const MAKS_KODE = 5;

async function getCfg(pool) {
  const { rows } = await pool.query('SELECT offentlig FROM config WHERE id = 1');
  return (rows[0] && rows[0].offentlig) || {};
}

// Samtykke-hændelsesloggen (se migrations/003_packrush.sql) giver ét svar
// pr. liste: den seneste hændelse (afgør om listen er AKTIV lige nu) + den
// FØRSTE nogensinde bekræftede hændelse for den liste.
async function samtykkerFor(client, spillerId) {
  const { rows } = await client.query(
    `WITH seneste AS (
       SELECT DISTINCT ON (liste) liste, type, tidspunkt, tekst_version
       FROM samtykke WHERE spiller_id = $1 ORDER BY liste, tidspunkt DESC, id DESC
     ), foerste AS (
       SELECT liste, MIN(tidspunkt) AS foerste_bekraeftelse
       FROM samtykke WHERE spiller_id = $1 AND type = 'bekraeftet' GROUP BY liste
     )
     SELECT s.liste, s.type AS seneste_type, s.tidspunkt AS seneste_tidspunkt, s.tekst_version, f.foerste_bekraeftelse
     FROM seneste s LEFT JOIN foerste f ON f.liste = s.liste
     ORDER BY s.liste`,
    [spillerId]
  );
  return rows.map((r) => ({
    liste: r.liste,
    aktiv: r.seneste_type === 'bekraeftet',
    foerste_bekraeftelse: r.foerste_bekraeftelse,
    seneste_haendelse: { type: r.seneste_type, tidspunkt: r.seneste_tidspunkt },
    tekst_version: r.tekst_version,
  }));
}

// Logger én samtykke-hændelse (bekraeftet/trukket_tilbage) — se API.md,
// afsnit "Packrush-ændringer".
async function logSamtykke(client, spillerId, liste, type, kilde, req, now) {
  await client.query(
    `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst_version, kilde, ip, user_agent, type)
     VALUES ($1,$2,$3,1,$4,$5,$6,$7)`,
    [spillerId, liste, now, kilde, clientIp(req), req.headers['user-agent'] || null, type]
  );
}

function meRouter(pool) {
  const router = express.Router();
  const auth = requirePlayer(pool);

  router.get('/me', auth, async (req, res, next) => {
    const client = await pool.connect();
    try {
      const cfg = await getCfg(pool);
      const now = new Date();
      const row = req.player;
      const bag = await currentBag(client, row, cfg, now);
      await persistBag(client, row.id, bag);

      const samtykker = await samtykkerFor(client, row.id);
      const notifs = await client.query(
        `SELECT id, type, data, oprettet, set FROM notifikation
         WHERE spiller_id = $1 ORDER BY oprettet DESC LIMIT 50`,
        [row.id]
      );
      const tickets = await computeTickets(client, row.id, cfg);

      res.json({
        pid: row.public_id,
        navn: row.navn,
        email: row.email,
        telefon: row.telefon,
        firma: row.firma,
        vennekode: row.vennekode,
        badges: row.badges || [],
        abonnementer: subOptions(cfg),
        mine_noegler: subKeys(playerToP(row)),
        mine_flueben: todayTickKeys(playerToP(row), now),
        samtykker,
        liv: livView(bag, row, cfg, now),
        notifikationer: notifs.rows.map((n) => ({
          id: n.id,
          type: n.type,
          data: n.data,
          oprettet: n.oprettet,
          seen: n.set,
        })),
        tickets,
      });
    } catch (e) {
      next(e);
    } finally {
      client.release();
    }
  });

  router.post('/me/seen', auth, async (req, res, next) => {
    const ids = Array.isArray(req.body && req.body.ids) ? req.body.ids.filter(Number.isInteger) : null;
    try {
      if (ids && ids.length) {
        await pool.query(
          'UPDATE notifikation SET set = true WHERE spiller_id = $1 AND id = ANY($2::bigint[])',
          [req.player.id, ids]
        );
      } else {
        await pool.query('UPDATE notifikation SET set = true WHERE spiller_id = $1', [req.player.id]);
      }
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.post('/me/challenge', auth, async (req, res, next) => {
    const code = String((req.body && req.body.code) || '').trim().toUpperCase().slice(0, MAKS_KODE);
    if (!code) return res.status(400).json({ fejl: 'Mangler kode.', kode: 'mangler_kode' });
    try {
      const { rows } = await pool.query('SELECT id, navn FROM spiller WHERE vennekode = $1 AND id != $2', [
        code,
        req.player.id,
      ]);
      if (!rows.length) {
        return res.status(400).json({ fejl: 'Ukendt udfordringskode.', kode: 'ukendt_kode' });
      }
      const chFrom = JSON.stringify({
        kode: code,
        fra_spiller_id: rows[0].id,
        fra_navn: rows[0].navn,
        dag: new Date().toISOString().slice(0, 10),
      });
      await pool.query('UPDATE spiller SET ekstra_02 = $1 WHERE id = $2', [chFrom, req.player.id]);
      res.json({ ok: true, udfordrer: rows[0].navn });
    } catch (e) {
      next(e);
    }
  });

  // Indløser dagens sms-boostkode (svarer til klientens useCode()). Koden
  // selv (og PIN'en den er udledt af) forlader ALDRIG serveren her — kun
  // spillerens gæt sammenlignes mod et server-side udregnet facit.
  router.post('/me/boost', auth, async (req, res, next) => {
    const code = String((req.body && req.body.code) || '').trim().toUpperCase().slice(0, MAKS_KODE);
    if (!code) return res.status(400).json({ fejl: 'Mangler kode.', kode: 'mangler_kode' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cfgRes = await client.query('SELECT offentlig, hemmelig FROM config WHERE id = 1');
      const cfg = cfgRes.rows[0].offentlig || {};
      const pin = (cfgRes.rows[0].hemmelig || {}).pin || '8500';
      const now = new Date();
      const today = todayStr(now);

      const rowRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id]);
      const row = rowRes.rows[0];

      if (cfg.smsBoost === false) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Sms-boost er ikke aktiveret lige nu.', kode: 'boost_ikke_aktiv' });
      }
      if (!row.notify) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: 'Du skal være tilmeldt sms for at bruge en boostkode.', kode: 'ikke_tilmeldt_sms' });
      }
      if (row.ekstra_03 === today) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Du har allerede brugt dagens boostkode.', kode: 'allerede_brugt' });
      }
      if (code !== boostCode(today, pin)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Forkert kode.', kode: 'forkert_kode' });
      }

      const bag = await currentBag(client, row, cfg, now);
      // Packrush: MAX_LIVES-loft gælder også sms-boost-tildelingen.
      const nyBag = { ...bag, n: Math.min(MAX_LIVES, bag.n + (cfg.boostLives || 2)) };
      await persistBag(client, row.id, nyBag);
      await client.query('UPDATE spiller SET ekstra_03 = $1 WHERE id = $2', [today, row.id]);

      await client.query('COMMIT');
      res.json({ ok: true, liv: livView(nyBag, row, cfg, now) });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Den VARIGE af-/tilmelding (setSubs). Giver IKKE liv siden Packrush —
  // det gør kun PUT /me/ticks (dagens flueben). Se API.md, afsnit
  // "Packrush-ændringer", for forskellen mellem de to endpoints.
  router.put('/me/subs', auth, async (req, res, next) => {
    const keys = Array.isArray(req.body && req.body.keys) ? req.body.keys.map(String) : [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cfg = await getCfg(pool);
      const now = new Date();
      const rowRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id]);
      const row = rowRes.rows[0];

      // Ingen liv-tildeling her, men vi genberegner/persisterer bagen
      // alligevel (håndterer evt. naturlig regen/dags-skift siden sidst).
      const bag = await currentBag(client, row, cfg, now);
      await persistBag(client, row.id, bag);

      const result = setSubsPure(playerToP(row), keys, cfg, now);
      await client.query(
        'UPDATE spiller SET marketing = $1, mail_to = $2, notify = $3, tick_dag = $4, tick_keys = $5 WHERE id = $6',
        [result.p.marketing, JSON.stringify(result.p.mailTo), result.p.notify, result.p.tick.day, JSON.stringify(result.p.tick.keys), row.id]
      );

      for (const key of result.added) {
        await logSamtykke(client, row.id, listNameFor(key), 'bekraeftet', 'subs', req, now);
      }
      for (const key of result.removed) {
        await logSamtykke(client, row.id, listNameFor(key), 'trukket_tilbage', 'subs', req, now);
      }

      await client.query('COMMIT');
      invalidateStateCache();

      res.json({
        ok: true,
        liv: livView(bag, row, cfg, now),
        mine_noegler: subKeys(result.p),
      });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Ægte, varig afmelding af ÉN liste (DENNE er den nye GDPR-afmeldings-
  // knap — findes endnu ikke i spillets UI, se API.md). `:liste` er en
  // tilmeldings-NØGLE (samme format som `keys` ovenfor: 'sp', 'm:<partner>',
  // 'sms') — IKKE samtykke-tabellens listenavn ('smartpack'/'partner:X'/'sms').
  router.delete('/me/subs/:liste', auth, async (req, res, next) => {
    const fjernKey = String(req.params.liste || '');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cfg = await getCfg(pool);
      const now = new Date();
      const rowRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id]);
      const row = rowRes.rows[0];

      const p = playerToP(row);
      const tilbage = subKeys(p).filter((k) => k !== fjernKey);
      const result = setSubsPure(p, tilbage, cfg, now);

      await client.query(
        'UPDATE spiller SET marketing = $1, mail_to = $2, notify = $3, tick_dag = $4, tick_keys = $5 WHERE id = $6',
        [result.p.marketing, JSON.stringify(result.p.mailTo), result.p.notify, result.p.tick.day, JSON.stringify(result.p.tick.keys), row.id]
      );

      for (const key of result.removed) {
        await logSamtykke(client, row.id, listNameFor(key), 'trukket_tilbage', 'unsub', req, now);
      }

      await client.query('COMMIT');
      invalidateStateCache();

      res.json({ ok: true, mine_noegler: subKeys(result.p) });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Dagens flueben (setTicks). Et NYT flueben er en ny, VARIG bekræftelse
  // (logges i samtykke som 'bekraeftet' og vokser marketing/mail_to/notify —
  // ALDRIG krympende). Fjernelse af et flueben er KUN for i dag. Giver
  // friske liv for lister der ikke allerede har givet liv i dag.
  router.put('/me/ticks', auth, async (req, res, next) => {
    const keys = Array.isArray(req.body && req.body.keys) ? req.body.keys.map(String) : [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cfg = await getCfg(pool);
      const now = new Date();
      const rowRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id]);
      const row = rowRes.rows[0];

      const bagBefore = await currentBag(client, row, cfg, now);
      const result = setTicksPure(playerToP(row), keys, cfg, bagBefore, now);

      await client.query(
        `UPDATE spiller SET marketing = $1, mail_to = $2, notify = $3, tick_dag = $4, tick_keys = $5,
           liv_dag = $6, liv_n = $7, liv_t = $8, ekstra_01 = $9 WHERE id = $10`,
        [
          result.p.marketing,
          JSON.stringify(result.p.mailTo),
          result.p.notify,
          result.bag.day,
          JSON.stringify(result.p.tick.keys),
          result.bag.day,
          result.bag.n,
          new Date(result.bag.t),
          JSON.stringify(result.bag.g),
          row.id,
        ]
      );

      for (const key of result.added) {
        await logSamtykke(client, row.id, listNameFor(key), 'bekraeftet', 'ticks', req, now);
      }

      await client.query('COMMIT');
      invalidateStateCache();

      res.json({
        ok: true,
        friske_liv: result.fresh,
        liv: livView(result.bag, row, cfg, now),
        mine_noegler: subKeys(result.p),
        mine_flueben: result.p.tick.keys,
      });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  return router;
}

module.exports = { meRouter };
