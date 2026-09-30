'use strict';

const express = require('express');
const crypto = require('crypto');
const { requirePlayer } = require('../middleware/playerAuth');
const { createRateLimiter } = require('../middleware/rateLimit');
const { clientIp } = require('../middleware/clientIp');
const { currentBag, persistBag, livView, playerToP } = require('../lifeBag');
const { useLife, refill, todayStr } = require('../rules/life');
const { MAX_LIVES } = require('../rules/constants');
const {
  validateRoundScores,
  validateSpilletid,
  validateStatsKonsistens,
  evaluateBadges,
} = require('../rules/scoring');
const { computeFeats, todayLeaderboard, daysPlayedAll, computeTickets } = require('../gameQueries');
const { invalidateStateCache } = require('../publicState');
const config = require('../config');

const MAKS_STATS_FELTER = 40; // simpel størrelses-guard på indsendt s-objekt

async function getCfg(pool) {
  const { rows } = await pool.query('SELECT offentlig FROM config WHERE id = 1');
  return (rows[0] && rows[0].offentlig) || {};
}

function sanitizeStats(s) {
  if (!s || typeof s !== 'object') return {};
  const out = {};
  let n = 0;
  for (const [k, v] of Object.entries(s)) {
    if (n++ >= MAKS_STATS_FELTER) break;
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
  }
  return out;
}

function runsRouter(pool, ws) {
  const router = express.Router();
  const auth = requirePlayer(pool);
  const startLimiter = createRateLimiter({
    windowMs: config.runsStartRateLimitMs,
    max: 1,
    keyFn: (req) => 'start:' + req.player.id,
    besked: 'Vent lidt før du starter et nyt forsøg.',
  });

  router.post('/runs', auth, startLimiter, async (req, res, next) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const row = (await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id])).rows[0];
      const cfg = await getCfg(pool);
      const now = new Date();
      // Opgave B: {ny:true} opgiver et evt. aktivt forsøg og starter et HELT
      // NYT (nyt liv, refunderes ikke) — se API.md.
      const ny = !!(req.body && req.body.ny);

      const aktiv = await client.query(
        `SELECT * FROM forsoeg WHERE spiller_id = $1 AND status = 'aktiv' ORDER BY oprettet DESC LIMIT 1`,
        [row.id]
      );
      if (aktiv.rows.length) {
        const a = aktiv.rows[0];
        // Opgave A: et aktivt forsøg kan finish'es resten af den (københavnske)
        // dag det blev startet på — IKKE kun inden for et kort tidsvindue som
        // tidligere (AKTIV_UDLOEB_MS, 15 min.). Er det stadig samme dag OG
        // klienten ikke selv beder om et nyt ({ny:true}), returnér DET
        // eksisterende forsøg uden at bruge endnu et liv (genoptaget).
        const sammeDag = todayStr(a.start_server) === todayStr(now);
        if (sammeDag && !ny) {
          await client.query('COMMIT');
          return res.json({ runde_id: a.runde_id, start_server: a.start_server, genoptaget: true });
        }
        // Enten er der eksplicit bedt om et nyt forsøg (ny:true, samme dag —
        // det gamle OPGIVES, livet refunderes ikke), eller det aktive forsøg
        // er fra en TIDLIGERE dag og skal uanset `ny` behandles som udløbet
        // (dagsskifte, se API.md, "Dage og tidszoner").
        const nyStatus = sammeDag ? 'opgivet' : 'udloebet';
        await client.query(`UPDATE forsoeg SET status = $1 WHERE id = $2`, [nyStatus, a.id]);
      }

      const bag = await currentBag(client, row, cfg, now);
      const brugt = useLife(bag);
      if (!brugt) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Du har ikke flere liv lige nu.', kode: 'ingen_liv' });
      }
      await persistBag(client, row.id, brugt);

      const rundeId = crypto.randomUUID();
      await client.query(
        `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, spilversion, ip)
         VALUES ($1, $2, $3, 'aktiv', $4, $5)`,
        [row.id, rundeId, now, (req.body && req.body.spilversion) || null, clientIp(req)]
      );

      await client.query('COMMIT');

      res.status(201).json({
        runde_id: rundeId,
        start_server: now.toISOString(),
        liv: livView(brugt, playerToP(row), cfg, now),
      });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  router.post('/runs/:runde_id/finish', auth, async (req, res, next) => {
    const rundeId = req.params.runde_id;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const forsoegRes = await client.query(
        `SELECT * FROM forsoeg WHERE runde_id = $1 AND spiller_id = $2 FOR UPDATE`,
        [rundeId, req.player.id]
      );
      if (!forsoegRes.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ fejl: 'Ukendt forsøg.', kode: 'ukendt_forsoeg' });
      }
      const forsoeg = forsoegRes.rows[0];
      const now = new Date();

      if (forsoeg.status !== 'aktiv') {
        // Idempotent gentagelse: samme svar, ingen bivirkninger køres igen.
        await client.query('COMMIT');
        if (forsoeg.resultat) return res.json(forsoeg.resultat);
        return res.status(409).json({ fejl: 'Forsøget er allerede afsluttet eller udløbet.', kode: 'ikke_aktivt' });
      }

      // Opgave A: et aktivt forsøg fra en TIDLIGERE (københavnske) dag skal
      // behandles som udløbet, uanset hvornår vi støder på det — også ved et
      // finish-forsøg (ikke kun ved næste POST /runs). Se API.md.
      if (todayStr(forsoeg.start_server) !== todayStr(now)) {
        await client.query(`UPDATE forsoeg SET status = 'udloebet' WHERE id = $1`, [forsoeg.id]);
        await client.query('COMMIT');
        return res
          .status(409)
          .json({ fejl: 'Forsøget er udløbet (dagsskifte siden det blev startet).', kode: 'forsoeg_udloebet' });
      }

      const cfg = await getCfg(pool);
      const body = req.body || {};
      const roundsRaw = Array.isArray(body.rounds) ? body.rounds.map((n) => Math.round(Number(n))) : null;
      const s = sanitizeStats(body.s);
      const bf = !!body.bf;
      const duelRaw = body.duel && typeof body.duel === 'object' ? body.duel : null;
      const klientMs = Math.round(Number(body.spilletid_klient_ms));

      // Anonymiserings-id-fix: `duel.vsId` (valgfrit, NYT — modstanderens
      // `pid`) løses her til modstanderens INTERNE spiller-id, gemt som
      // `duel.vs_spiller_id` ved siden af det fritekst-navn (`duel.vs`)
      // klienten selv sender. Bruges KUN til at gøre en evt. senere
      // GDPR-anonymisering af modstanderens navn ID-baseret i stedet for
      // navnematch (se src/playerDeletion.js) — eksponeres ALDRIG i noget
      // offentligt svar (GET /state's sanitizeDuel medtager den ikke).
      let duel = null;
      if (duelRaw) {
        duel = { ...duelRaw };
        if (duel.vsId) {
          const modRes = await client.query('SELECT id FROM spiller WHERE public_id = $1', [
            String(duel.vsId).slice(0, 40),
          ]);
          if (modRes.rows.length) duel.vs_spiller_id = modRes.rows[0].id;
        }
      }

      const serverMs = now.getTime() - new Date(forsoeg.start_server).getTime();
      const samlet = roundsRaw ? roundsRaw.reduce((a, b) => a + b, 0) : 0;

      let afvisning = null;
      const rCheck = validateRoundScores(roundsRaw || []);
      if (!rCheck.ok) afvisning = rCheck;
      if (!afvisning) {
        const tCheck = validateSpilletid(serverMs, klientMs, cfg);
        if (!tCheck.ok) afvisning = tCheck;
      }
      if (!afvisning) {
        const sCheck = validateStatsKonsistens(s);
        if (!sCheck.ok) afvisning = sCheck;
      }

      if (afvisning) {
        const resultat = { godkendt: false, aarsag: afvisning.kode, besked: afvisning.besked };
        await client.query(
          `UPDATE forsoeg SET status='afvist', afvist_aarsag=$1, slut_server=$2, spilletid_server_ms=$3,
             spilletid_klient_ms=$4, runde1=$5, runde2=$6, runde3=$7, samlet=$8, stats=$9, bf=$10, duel=$11, resultat=$12
           WHERE id = $13`,
          [
            afvisning.kode,
            now,
            serverMs,
            Number.isFinite(klientMs) ? klientMs : null,
            roundsRaw ? roundsRaw[0] : null,
            roundsRaw ? roundsRaw[1] : null,
            roundsRaw ? roundsRaw[2] : null,
            samlet,
            JSON.stringify(s),
            bf,
            duel ? JSON.stringify(duel) : null,
            JSON.stringify(resultat),
            forsoeg.id,
          ]
        );
        await client.query('COMMIT');
        return res.status(400).json(resultat);
      }

      const rounds = roundsRaw;

      // --- GODKENDT: kør hele finish()-flowet atomisk ---
      const today = todayStr(now);
      const scorer = (await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [req.player.id])).rows[0];

      // 1) Beaten-notifikationer: dagens top-10 FØR dette forsøg tælles med.
      const forinden = await todayLeaderboard(client, today);
      const top10 = forinden.slice(0, 10);
      const beatenNotifs = [];
      for (const row of top10) {
        if (row.spillerId === scorer.id) continue;
        if (row.best < samlet) {
          beatenNotifs.push({
            spillerId: row.spillerId,
            data: {
              by: scorer.navn,
              // Anonymiserings-id-fix: ID ved siden af navnefeltet, sat her
              // ved SKRIVETIDSPUNKTET (scorer er altid definitivt kendt —
              // den autentificerede spiller der lige har afsluttet et
              // forsøg). Bruges af src/playerDeletion.js i stedet for
              // navnematch ved GDPR-sletning. Se API.md.
              by_spiller_id: scorer.id,
              firm: scorer.firma,
              score: samlet,
              mine: row.best,
              at: now.toISOString(),
              day: today,
              lead: top10[0] && top10[0].best === row.best,
            },
          });
        }
      }

      // 2) Gem selve forsøget.
      await client.query(
        `UPDATE forsoeg SET status='godkendt', slut_server=$1, spilletid_server_ms=$2, spilletid_klient_ms=$3,
           runde1=$4, runde2=$5, runde3=$6, samlet=$7, stats=$8, bf=$9, duel=$10
         WHERE id = $11`,
        [
          now,
          serverMs,
          klientMs,
          rounds[0],
          rounds[1],
          rounds[2],
          samlet,
          JSON.stringify(s),
          bf,
          duel ? JSON.stringify(duel) : null,
          forsoeg.id,
        ]
      );

      // 3) Badges (kontekst: rang/dage EFTER dette forsøg er gemt).
      const dageEfter = await daysPlayedAll(client, scorer.id);
      const rangEfter = await todayLeaderboard(client, today);
      const mitRangIdx = rangEfter.findIndex((r) => r.spillerId === scorer.id);
      const rangKontekst = {
        rank: mitRangIdx === -1 ? 0 : mitRangIdx + 1,
        others: Math.max(0, rangEfter.length - 1),
        days: dageEfter,
      };
      const nyeBadges = evaluateBadges({ samlet, s, bf, rounds }, rangKontekst, scorer.badges || []);
      const badgesEfter = [...(scorer.badges || []), ...nyeBadges];

      // 4) Udfordrings-liv: gav denne spiller en udfordrer +1 liv (højst 1x/time/modstander)?
      const gaveNotifs = [];
      let chlOpdateret = scorer.chl || {};
      let ekstra02Ny = scorer.ekstra_02;
      const chFrom = scorer.ekstra_02 ? JSON.parse(scorer.ekstra_02) : null;
      if (chFrom && chFrom.dag === today && chFrom.fra_spiller_id !== scorer.id) {
        const modstanderKey = String(chFrom.fra_spiller_id);
        const sidst = chlOpdateret[modstanderKey] ? new Date(chlOpdateret[modstanderKey]).getTime() : 0;
        if (now.getTime() - sidst >= 3600 * 1000) {
          const modstanderRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [
            chFrom.fra_spiller_id,
          ]);
          if (modstanderRes.rows.length) {
            const modstander = modstanderRes.rows[0];
            const mBag = await currentBag(client, modstander, cfg, now);
            await persistBag(client, modstander.id, { ...mBag, n: Math.min(MAX_LIVES, mBag.n + 1) });
            gaveNotifs.push({
              spillerId: modstander.id,
              data: { type: 'udfordring_liv', fra: scorer.navn, fra_spiller_id: scorer.id, at: now.toISOString() },
            });
            chlOpdateret = { ...chlOpdateret, [modstanderKey]: now.toISOString() };
          }
        }
        ekstra02Ny = null;
      }

      // 5) Vennekode-refill: er dette spillerens FØRSTE nogensinde godkendte forsøg?
      let refBetaltNy = scorer.ref_betalt;
      if (scorer.ref_spiller_id && !scorer.ref_betalt) {
        const antalFoer = await client.query(
          `SELECT COUNT(*) AS n FROM forsoeg WHERE spiller_id = $1 AND status = 'godkendt' AND id != $2`,
          [scorer.id, forsoeg.id]
        );
        if (Number(antalFoer.rows[0].n) === 0) {
          const venRes = await client.query('SELECT * FROM spiller WHERE id = $1 FOR UPDATE', [scorer.ref_spiller_id]);
          if (venRes.rows.length) {
            const ven = venRes.rows[0];
            const vBag = await currentBag(client, ven, cfg, now);
            await persistBag(client, ven.id, refill(vBag, playerToP(ven), cfg, now));
            gaveNotifs.push({
              spillerId: ven.id,
              data: { type: 'vennekode_refill', fra: scorer.navn, fra_spiller_id: scorer.id, at: now.toISOString() },
            });
          }
          refBetaltNy = true;
        }
      }

      // 6) Feats (dagens/personlig rekord).
      const feats = await computeFeats(client, {
        id: forsoeg.id,
        spiller_id: scorer.id,
        runde1: rounds[0],
        runde2: rounds[1],
        runde3: rounds[2],
        stats: s,
        oprettet_dato: today,
      });

      await client.query(`UPDATE spiller SET badges = $1, chl = $2, ekstra_02 = $3, ref_betalt = $4 WHERE id = $5`, [
        JSON.stringify(badgesEfter),
        JSON.stringify(chlOpdateret),
        ekstra02Ny,
        refBetaltNy,
        scorer.id,
      ]);

      for (const n of beatenNotifs) {
        const modtagerRes = await client.query('SELECT firma_noegle FROM spiller WHERE id = $1', [n.spillerId]);
        const colleague =
          !!scorer.firma_noegle &&
          modtagerRes.rows.length &&
          modtagerRes.rows[0].firma_noegle === scorer.firma_noegle;
        await client.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'beaten', $2)`, [
          n.spillerId,
          JSON.stringify({ ...n.data, colleague }),
        ]);
      }
      for (const g of gaveNotifs) {
        await client.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'gift', $2)`, [
          g.spillerId,
          JSON.stringify(g.data),
        ]);
      }

      const scorerFrisk = (await client.query('SELECT * FROM spiller WHERE id = $1', [scorer.id])).rows[0];
      const bagScorer = await currentBag(client, scorerFrisk, cfg, now);
      const tickets = await computeTickets(client, scorer.id, cfg);

      const resultat = {
        godkendt: true,
        forsoeg: { runde_id: rundeId, rounds, samlet, s, bf, spilletid_server_ms: serverMs },
        maerker: nyeBadges,
        feats,
        rang: rangKontekst,
        liv: livView(bagScorer, playerToP(scorerFrisk), cfg, now),
        tickets,
      };

      await client.query('UPDATE forsoeg SET resultat = $1 WHERE id = $2', [JSON.stringify(resultat), forsoeg.id]);

      await client.query('COMMIT');
      invalidateStateCache();
      if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();

      res.json(resultat);
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  return router;
}

module.exports = { runsRouter };
