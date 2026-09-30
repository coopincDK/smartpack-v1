'use strict';

const express = require('express');
const { requirePlayer } = require('../middleware/playerAuth');
const { subKeys, subOptions, setSubsPure, listNameFor, todayStr } = require('../rules/life');
const { boostCode } = require('../rules/boostCode');
const { currentBag, persistBag, livView, playerToP } = require('../lifeBag');
const { computeTickets } = require('../gameQueries');
const { clientIp } = require('../middleware/clientIp');
const { invalidateStateCache } = require('../publicState');

const MAKS_KODE = 5;

async function getCfg(pool) {
  const { rows } = await pool.query('SELECT offentlig FROM config WHERE id = 1');
  return (rows[0] && rows[0].offentlig) || {};
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

      const consents = await client.query(
        `SELECT liste, givet, trukket_tilbage, tekst_version FROM samtykke
         WHERE spiller_id = $1 ORDER BY givet DESC`,
        [row.id]
      );
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
        samtykker: consents.rows.map((c) => ({
          liste: c.liste,
          givet: c.givet,
          trukket_tilbage: c.trukket_tilbage,
          tekst_version: c.tekst_version,
        })),
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
      const nyBag = { ...bag, n: bag.n + (cfg.boostLives || 2) };
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

  router.put('/me/subs', auth, async (req, res, next) => {
    const keys = Array.isArray(req.body && req.body.keys) ? req.body.keys.map(String) : [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cfg = await getCfg(pool);
      const now = new Date();
      const rowRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id]);
      const row = rowRes.rows[0];
      const bagBefore = await currentBag(client, row, cfg, now);
      const result = setSubsPure(playerToP(row), keys, cfg, bagBefore);

      await client.query(
        'UPDATE spiller SET marketing = $1, mail_to = $2, notify = $3, liv_dag = $4, liv_n = $5, liv_t = $6, ekstra_01 = $7 WHERE id = $8',
        [
          result.p.marketing,
          JSON.stringify(result.p.mailTo),
          result.p.notify,
          result.bag.day,
          result.bag.n,
          new Date(result.bag.t),
          JSON.stringify(result.bag.g),
          row.id,
        ]
      );

      // Bemærk: `result.added` er allerede udregnet af setSubsPure ud fra
      // spillerens AKTUELLE tilmeldinger (låst via FOR UPDATE ovenfor), så en
      // reel konflikt mod det partielle unikke indeks bør ikke kunne opstå.
      for (const key of result.added) {
        const liste = listNameFor(key);
        await client.query(
          `INSERT INTO samtykke (spiller_id, liste, givet, tekst_version, kilde, ip, user_agent)
           VALUES ($1,$2,$3,1,'subs',$4,$5)`,
          [row.id, liste, now, clientIp(req), req.headers['user-agent'] || null]
        );
      }
      for (const key of result.removed) {
        const liste = listNameFor(key);
        await client.query(
          `UPDATE samtykke SET trukket_tilbage = $1
           WHERE spiller_id = $2 AND liste = $3 AND trukket_tilbage IS NULL`,
          [now, row.id, liste]
        );
      }

      await client.query('COMMIT');
      invalidateStateCache();

      res.json({
        ok: true,
        friske_liv: result.fresh,
        liv: livView(result.bag, row, cfg, now),
        mine_noegler: subKeys(result.p),
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
