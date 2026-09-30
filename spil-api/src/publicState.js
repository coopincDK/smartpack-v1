'use strict';

// Bygger det offentlige udtræk til GET /state. Dette er den ENESTE vej
// klienter (inkl. andre spilleres browsere og standvæggen) må læse
// spildata på — INGEN email/telefon/samtykker/vennekode/ref-info må
// nogensinde optræde her.
//
// Packrush, opgave B: navnevisning afhænger nu af HVEM der spørger. Den
// interne 2-sekunders-cache holder altid den FULDE version (fulde navne);
// selve request-specifikke maskering (kort navn medmindre admin/stand) sker
// billigt pr. kald ovenpå cachen, se getPublicState() nedenfor.

const { shortName } = require('./rules/nameDisplay');

const CACHE_MS = 2000;
let cache = null; // { at, payload }

function invalidateStateCache() {
  cache = null;
}

function sanitizeDuel(duel) {
  if (!duel || typeof duel !== 'object') return null;
  if (typeof duel.vs !== 'string' || !duel.vs.trim()) return null;
  return { vs: duel.vs.trim().slice(0, 40) };
}

async function buildPublicState(pool) {
  const cfgRes = await pool.query('SELECT offentlig FROM config WHERE id = 1');
  const cfg = (cfgRes.rows[0] && cfgRes.rows[0].offentlig) || {};

  const spillereRes = await pool.query(
    `SELECT id, public_id, navn, firma, firma_noegle, oprettet, badges
     FROM spiller WHERE skjult = false ORDER BY oprettet ASC`
  );

  const forsoegRes = await pool.query(
    `SELECT spiller_id, samlet, runde1, runde2, runde3, stats, bf, duel, start_server, slut_server, oprettet
     FROM forsoeg WHERE status = 'godkendt' ORDER BY oprettet ASC`
  );

  const attemptsBySpiller = new Map();
  for (const a of forsoegRes.rows) {
    const list = attemptsBySpiller.get(a.spiller_id) || [];
    list.push({
      score: a.samlet,
      rounds: [a.runde1, a.runde2, a.runde3],
      s: a.stats || {},
      day: a.oprettet.toISOString().slice(0, 10),
      at: a.start_server ? a.start_server.toISOString() : null,
      end: a.slut_server ? a.slut_server.toISOString() : null,
      bf: !!a.bf,
      duel: sanitizeDuel(a.duel),
    });
    attemptsBySpiller.set(a.spiller_id, list);
  }

  // Bemærk: `name`/`duel.vs` er her ALTID de fulde navne — maskering til
  // "Fornavn E." sker først i toPublicView() nedenfor, pr. request.
  const players = spillereRes.rows.map((p) => ({
    pid: p.public_id,
    name: p.navn,
    company: p.firma,
    companyKey: p.firma_noegle,
    created: p.oprettet.toISOString(),
    badges: p.badges || [],
    attempts: attemptsBySpiller.get(p.id) || [],
  }));

  return { cfg, players };
}

async function getFullPublicState(pool) {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.payload;
  const payload = await buildPublicState(pool);
  cache = { at: now, payload };
  return payload;
}

// Maskerer navne til "Fornavn E." (eller det ene ord, hvis kun ét) — se
// src/rules/nameDisplay.js. Bruges til ALLE forbindelser UDEN en gyldig
// admin/stand-session.
function toPublicView(full) {
  return {
    cfg: full.cfg,
    players: full.players.map((p) => ({
      ...p,
      name: shortName(p.name),
      attempts: p.attempts.map((a) => (a.duel ? { ...a, duel: { vs: shortName(a.duel.vs) } } : a)),
    })),
  };
}

// Admin/stand-sessioner ser de fulde navne uændret.
function toPrivilegedView(full) {
  return full;
}

async function getPublicState(pool, privileged) {
  const full = await getFullPublicState(pool);
  return privileged ? toPrivilegedView(full) : toPublicView(full);
}

module.exports = { getPublicState, invalidateStateCache, sanitizeDuel, toPublicView, toPrivilegedView };
