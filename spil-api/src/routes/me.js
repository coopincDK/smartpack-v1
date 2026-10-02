'use strict';

const { loadOffentligCfg } = require('../cfgLoad');
const { SAMTYKKE_VERSION } = require('../partners');

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
  samtykkeTekstFor,
} = require('../rules/life');
const { boostCode } = require('../rules/boostCode');
const { MAX_LIVES } = require('../rules/constants');
const { firmKey } = require('../rules/firmKey');
const { currentBag, persistBag, livView, playerToP } = require('../lifeBag');
const { computeTickets } = require('../gameQueries');
const { clientIp } = require('../middleware/clientIp');
const { invalidateStateCache } = require('../publicState');
const { resolveSessionRole } = require('../middleware/adminAuth');
const { maskedName } = require('../rules/nameDisplay');
const { MAKS_FIRMA } = require('./players');

const MAKS_KODE = 5;

async function getCfg(pool) {
  return loadOffentligCfg(pool);
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
async function logSamtykke(client, spillerId, liste, type, kilde, req, now, tekst) {
  await client.query(
    `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst, tekst_version, kilde, ip, user_agent, type)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [spillerId, liste, now, tekst || null, tekst ? SAMTYKKE_VERSION : 1, kilde, clientIp(req), req.headers['user-agent'] || null, type]
  );
}

// Sikkerhedsgennemgang (denne opfølgende runde): notifikation.data.by
// (beaten) og .data.fra (gift) blev tidligere returneret RÅT af GET /me — en
// id-reference (by_spiller_id/fra_spiller_id, se src/routes/runs.js) fandtes
// allerede ved siden af navnet, men blev hidtil KUN brugt ved GDPR-
// anonymisering, aldrig ved selve læsningen. En helt almindelig spiller
// kunne dermed se andre spilleres FULDE, ufaskerede navn via sine egne
// notifikationer — også OM SIG SELV, dvs. uafhængigt af om DEN forbindelse
// har admin/stand-privilegie — hvilket omgik hele navnemaskerings-designet
// (se API.md, "Packrush-ændringer", opgave B).
//
// Rettet ved LÆSNING: slår navnet op FRISKT via id-referencen (den
// autoritative kilde — kan i dag ikke afvige fra snapshottet, da spillere
// ikke kan omdøbe sig selv, men er den korrekte kilde fremadrettet), falder
// tilbage til det denormaliserede snapshot-navn hvis id'et mangler (ældre
// rækker fra før anonymiserings-id-fixet), og sender RESULTATET gennem
// PRÆCIS samme maskeringsfunktion som GET /state (`maskedName` — fuldt navn
// kun ved en gyldig admin/stand-session for DENNE forbindelse; "Slettet
// spiller" vises altid uændret, aldrig maskeret videre). De interne
// id-felter selv eksponeres ALDRIG i klientsvaret — samme princip som
// forsoeg.duel.vs_spiller_id, der heller aldrig optræder i et offentligt
// svar (se API.md).
function maskNotifikation(data, navnMap, privileged) {
  if (!data || typeof data !== 'object') return data;
  const ud = { ...data };
  if (Object.prototype.hasOwnProperty.call(ud, 'by')) {
    const frisk = ud.by_spiller_id != null ? navnMap.get(ud.by_spiller_id) : undefined;
    ud.by = maskedName(frisk !== undefined ? frisk : ud.by, privileged);
  }
  if (Object.prototype.hasOwnProperty.call(ud, 'fra')) {
    const frisk = ud.fra_spiller_id != null ? navnMap.get(ud.fra_spiller_id) : undefined;
    ud.fra = maskedName(frisk !== undefined ? frisk : ud.fra, privileged);
  }
  delete ud.by_spiller_id;
  delete ud.fra_spiller_id;
  return ud;
}

function meRouter(pool, ws) {
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

      // Denne forbindelses privilegie afgør om notifikationernes navne
      // maskeres eller vises fuldt — se maskNotifikation() ovenfor. Bemærk:
      // dette er UAFHÆNGIGT af hvem spilleren selv er (bearer-tokenet),
      // udelukkende om DENNE forbindelse har en gyldig admin/stand-
      // sessionscookie, nøjagtig samme regel som GET /state.
      const rolle = await resolveSessionRole(pool, req);
      const privilegeret = rolle === 'admin' || rolle === 'stand';
      const navnIds = new Set();
      for (const n of notifs.rows) {
        if (n.data && n.data.by_spiller_id != null) navnIds.add(n.data.by_spiller_id);
        if (n.data && n.data.fra_spiller_id != null) navnIds.add(n.data.fra_spiller_id);
      }
      let navnMap = new Map();
      if (navnIds.size) {
        const { rows: navnRows } = await client.query('SELECT id, navn FROM spiller WHERE id = ANY($1::bigint[])', [
          Array.from(navnIds),
        ]);
        navnMap = new Map(navnRows.map((r) => [r.id, r.navn]));
      }

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
        liv: livView(bag, playerToP(row), cfg, now),
        notifikationer: notifs.rows.map((n) => ({
          id: n.id,
          type: n.type,
          data: maskNotifikation(n.data, navnMap, privilegeret),
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

  // Packrush-opfølgning: firma er nu valgfrit ved registrering (0–40 tegn)
  // — dette endpoint lader en spiller sætte/rette det bagefter. Genberegner
  // firma_noegle (samme algoritme som ved registrering, se
  // src/rules/firmKey.js) — spillere UDEN firma får en tom nøgle og tæller
  // derved IKKE med i firmakampen (GET /state's companyKey er tom/falsy for
  // dem, og klientens firms() springer allerede falsy companyKey over).
  router.patch('/me', auth, async (req, res, next) => {
    const firma = String((req.body && req.body.firma) || '').trim();
    if (firma.length > MAKS_FIRMA) {
      return res
        .status(400)
        .json({ fejl: `Firmanavn må højst være ${MAKS_FIRMA} tegn.`, kode: 'ugyldigt_firma' });
    }
    try {
      await pool.query('UPDATE spiller SET firma = $1, firma_noegle = $2 WHERE id = $3', [
        firma,
        firmKey(firma),
        req.player.id,
      ]);
      invalidateStateCache();
      // Opgave E: state.changed broadcastes nu også ved firma-ændring (rører
      // companyKey/company i GET /state's players-liste).
      if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();
      res.json({ ok: true, firma });
    } catch (e) {
      next(e);
    }
  });

  // N9 (fjerde opfølgende runde, afsluttende review): der fandtes hidtil
  // intet spiller-logout-endpoint overhovedet (kun admin/stand-afmeld, se
  // src/routes/admin.js). Tilbagekalder KUN det ENE token der blev brugt til
  // at kalde DETTE endpoint (`req.player.token_id`, sat af
  // src/spillerToken.js#loadPlayerByToken via `requirePlayer`) — spillerens
  // ØVRIGE tokens (andre enheder, se "Flere samtidige tokens pr. spiller" i
  // API.md) rører vi ALDRIG. Idempotent: kald igen med et allerede
  // tilbagekaldt token giver 401 (tokenet er jo netop nu ugyldigt).
  router.post('/me/logout', auth, async (req, res, next) => {
    try {
      await pool.query('UPDATE spiller_token SET tilbagekaldt = now() WHERE id = $1 AND tilbagekaldt IS NULL', [
        req.player.token_id,
      ]);
      res.json({ ok: true });
    } catch (e) {
      next(e);
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
        dag: todayStr(new Date()),
      });
      await pool.query('UPDATE spiller SET ekstra_02 = $1 WHERE id = $2', [chFrom, req.player.id]);
      // Sikkerhedsgennemgang (fundet ved samme adversarielle gennemgang som
      // notifikations-maskeringen, se maskNotifikation() ovenfor): `udfordrer`
      // returnerede hidtil kode-ejerens FULDE, ufaskerede navn til en helt
      // almindelig spiller — samme lækage-klasse som notifikationerne, blot
      // ikke via en gemt/genlæst kolonne. Maskeres nu efter samme regel
      // (kun feltets INDHOLD ændres, ikke feltnavn/responsstruktur).
      const rolle = await resolveSessionRole(pool, req);
      const privilegeret = rolle === 'admin' || rolle === 'stand';
      res.json({ ok: true, udfordrer: maskedName(rows[0].navn, privilegeret) });
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

      // Opgave F: sammenlign FØRST koden mod dagens facit, FØR nogen
      // tilmeldings-/brugstjek. En kode der ikke matcher dagens boostkode
      // svarer ALTID med den samme, distinkte kode 'ukendt_kode' — uanset
      // spillerens tilmeldingsstatus — så klienten ved den i stedet bør
      // prøve koden som en udfordrings-/vennekode (POST /me/challenge, som
      // bruger nøjagtig samme fejlkode for "kendte jeg ikke den kode").
      if (code !== boostCode(today, pin)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Ukendt kode.', kode: 'ukendt_kode' });
      }

      // Koden matchede — fortsæt med de eksisterende tjek, uændret rækkefølge.
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

      const bag = await currentBag(client, row, cfg, now);
      // Packrush: MAX_LIVES-loft gælder også sms-boost-tildelingen.
      const nyBag = { ...bag, n: Math.min(MAX_LIVES, bag.n + (cfg.boostLives || 2)) };
      await persistBag(client, row.id, nyBag);
      await client.query('UPDATE spiller SET ekstra_03 = $1 WHERE id = $2', [today, row.id]);

      await client.query('COMMIT');
      res.json({ ok: true, liv: livView(nyBag, playerToP(row), cfg, now) });
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
        await logSamtykke(client, row.id, listNameFor(key), 'bekraeftet', 'subs', req, now, samtykkeTekstFor(cfg, key));
      }
      for (const key of result.removed) {
        await logSamtykke(client, row.id, listNameFor(key), 'trukket_tilbage', 'subs', req, now);
      }

      await client.query('COMMIT');
      invalidateStateCache();

      // Bemærk: bruger result.p (EFTER setSubsPure), ikke playerToP(row) —
      // setSubsPure kan have klippet dagens flueben ned (fjernet nøgler man
      // lige har afmeldt varigt), hvilket ændrer hvilke lister der tæller
      // med i regen-beregningen. next_regen_ms skal afspejle DET, ikke det
      // gamle billede fra før dette kald (fundet under sikkerheds-
      // gennemgangen).
      res.json({
        ok: true,
        liv: livView(bag, result.p, cfg, now),
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
        await logSamtykke(client, row.id, listNameFor(key), 'bekraeftet', 'ticks', req, now, samtykkeTekstFor(cfg, key));
      }

      await client.query('COMMIT');
      invalidateStateCache();

      // Samme begrundelse som i PUT /me/subs ovenfor: brug result.p (EFTER
      // setTicksPure), ikke playerToP(row).
      res.json({
        ok: true,
        friske_liv: result.fresh,
        liv: livView(result.bag, result.p, cfg, now),
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

module.exports = { meRouter, samtykkerFor };
