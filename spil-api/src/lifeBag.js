'use strict';

const { lifeState, nextRegenMs, todayStr } = require('./rules/life');

function playerToP(row) {
  return {
    marketing: row.marketing,
    mailTo: row.mail_to || [],
    notify: row.notify,
  };
}

function rowToBag(row) {
  return {
    day: row.liv_dag ? new Date(row.liv_dag).toISOString().slice(0, 10) : null,
    n: row.liv_n || 0,
    t: row.liv_t ? new Date(row.liv_t).getTime() : null,
    g: row.ekstra_01 ? JSON.parse(row.ekstra_01) : [],
  };
}

// Genberegner dagens liv-bag for en spiller (håndterer dags-skift + naturlig
// regen). Kalder DB for at tælle dagens forsøg, HVIS dagen lige er skiftet.
async function currentBag(client, row, cfg, now) {
  const bag = rowToBag(row);
  const p = playerToP(row);
  const today = todayStr(now);
  let attemptsToday = 0;
  if (bag.day !== today) {
    const { rows } = await client.query(
      `SELECT COUNT(*) AS n FROM forsoeg WHERE spiller_id = $1 AND oprettet::date = $2`,
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

function livView(bag, row, cfg, now) {
  return { n: bag.n, next_regen_ms: nextRegenMs(bag, playerToP(row), cfg, now) };
}

module.exports = { playerToP, rowToBag, currentBag, persistBag, livView };
