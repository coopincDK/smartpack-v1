'use strict';

const { lifeState, nextRegenMs, todayStr } = require('./rules/life');
const { cphDateExpr } = require('./rules/tzDate');

// Bemærk: `liv_dag`/`tick_dag` er Postgres `date`-kolonner (ingen
// tidspunkt/tidszone). `src/db.js` afregistrerer node-pg's standard-
// typeparser for `date` (OID 1082), så `row.liv_dag`/`row.tick_dag` her ER
// allerede rå 'YYYY-MM-DD'-tekststrenge — ikke JS Date-objekter, som ville
// kræve en tidszone-afhængig (og dermed potentielt forkert, se
// src/rules/tzDate.js) omvej via .toISOString(). Se src/db.js for
// begrundelsen.
function playerToP(row) {
  return {
    marketing: row.marketing,
    mailTo: row.mail_to || [],
    notify: row.notify,
    // Dagens flueben (p.tick) — adskilt fra den varige tilmelding ovenfor,
    // se src/rules/life.js#todayTickKeys og API.md, "Packrush-ændringer".
    tick: row.tick_dag ? { day: row.tick_dag, keys: row.tick_keys || [] } : null,
  };
}

function rowToBag(row) {
  return {
    day: row.liv_dag || null,
    n: row.liv_n || 0,
    t: row.liv_t ? new Date(row.liv_t).getTime() : null,
    g: row.ekstra_01 ? JSON.parse(row.ekstra_01) : [],
  };
}

// Genberegner dagens liv-bag for en spiller (håndterer dags-skift + naturlig
// regen). Kalder DB for at tælle dagens forsøg, HVIS dagen lige er skiftet.
// "I dag" regnes i Europe/Copenhagen (cphDateExpr), se src/rules/tzDate.js.
async function currentBag(client, row, cfg, now) {
  const bag = rowToBag(row);
  const p = playerToP(row);
  const today = todayStr(now);
  let attemptsToday = 0;
  if (bag.day !== today) {
    const { rows } = await client.query(
      `SELECT COUNT(*) AS n FROM forsoeg WHERE spiller_id = $1 AND ${cphDateExpr('oprettet')} = $2`,
      [row.id, today]
    );
    attemptsToday = Number(rows[0].n);
  }
  return lifeState(bag, p, cfg, now, attemptsToday);
}

async function persistBag(client, spillerId, bag) {
  await client.query(
    `UPDATE spiller SET liv_dag = $1, liv_n = $2, liv_t = $3, ekstra_01 = $4 WHERE id = $5`,
    [bag.day, bag.n, new Date(bag.t), JSON.stringify(bag.g || []), spillerId]
  );
}

// livView(bag, p, cfg, now): `p` SKAL være resultatet EFTER en evt.
// opdatering i dette kald (fx setSubsPure/setTicksPure's `result.p`), ikke
// den gamle DB-række — ellers regnes `next_regen_ms` ud fra et forældet
// abonnements-/flueben-billede (fundet under sikkerhedsgennemgangen: gav et
// forkert tal lige efter en handling der selv ændrer liv-grundlaget). Kald
// enten med `playerToP(row)` (uændret spiller) eller `result.p` (efter
// setSubsPure/setTicksPure) — se src/routes/me.js og src/routes/runs.js.
function livView(bag, p, cfg, now) {
  return { n: bag.n, next_regen_ms: nextRegenMs(bag, p, cfg, now) };
}

module.exports = { playerToP, rowToBag, currentBag, persistBag, livView };
