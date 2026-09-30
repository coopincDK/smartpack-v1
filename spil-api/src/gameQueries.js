'use strict';

// DB-understøttede opslag der spejler klientens rank()/firms()/daysPlayed()/
// tickets()/goalMet() — men udregnet server-side, kun til brug i finish()-
// flowet (badges-kontekst, feats, beaten-notifikationer, lodtrækningslodder).
// Klienten genudregner selv rank/near-miss-tekster ud fra GET /state.

const { RECORDS, MET, isBetter } = require('./rules/scoring');

function metricSqlExpr(metric) {
  if (metric === 'total') return 'samlet';
  if (metric === 'r1') return 'runde1';
  if (metric === 'r2') return 'runde2';
  if (metric === 'r3') return 'runde3';
  // Sikkerhed: `metric` kan stamme fra admin-config (cfg.mission, se goalMet()
  // nedenfor), som ikke er valideret mod en fast liste ved PUT /admin/config.
  // Uden dette tjek ville et vilkårligt config-felt kunne splejses direkte ind
  // i SQL'en herunder (SQL-injektion). Kun alfanumerisk + underscore tillades.
  if (typeof metric !== 'string' || !/^[a-zA-Z0-9_]+$/.test(metric)) {
    throw new Error(`Ugyldig metrik-nøgle: ${JSON.stringify(metric)}`);
  }
  return `(stats->>'${metric}')::numeric`;
}

function todayStr(now) {
  return now.toISOString().slice(0, 10);
}

// Bedste værdi for en metrik BLANDT ALLE SPILLERE i dag, ekskl. ét forsøg (id).
async function bestMetricToday(client, metric, excludeForsoegId, day) {
  const expr = metricSqlExpr(metric);
  const dir = MET[metric] && MET[metric].low ? 'MIN' : 'MAX';
  const { rows } = await client.query(
    `SELECT ${dir}(${expr}) AS best FROM forsoeg
     WHERE status = 'godkendt' AND id != $1 AND oprettet::date = $2 AND ${expr} > 0`,
    [excludeForsoegId, day]
  );
  const v = rows[0] && rows[0].best;
  return v === null || v === undefined ? undefined : Number(v);
}

// Spillerens egen bedste værdi for en metrik, ALLE dage, ekskl. ét forsøg.
async function bestMetricPersonal(client, metric, excludeForsoegId, spillerId) {
  const expr = metricSqlExpr(metric);
  const dir = MET[metric] && MET[metric].low ? 'MIN' : 'MAX';
  const { rows } = await client.query(
    `SELECT ${dir}(${expr}) AS best FROM forsoeg
     WHERE status = 'godkendt' AND id != $1 AND spiller_id = $2 AND ${expr} > 0`,
    [excludeForsoegId, spillerId]
  );
  const v = rows[0] && rows[0].best;
  return v === null || v === undefined ? undefined : Number(v);
}

// Udregner "feats" (dagens rekord / personlig rekord) for et NETOP GEMT forsøg.
async function computeFeats(client, forsoeg) {
  const feats = [];
  const day = forsoeg.oprettet_dato;
  for (const metric of RECORDS) {
    const mine = metric === 'r1' ? forsoeg.runde1
      : metric === 'r2' ? forsoeg.runde2
      : metric === 'r3' ? forsoeg.runde3
      : forsoeg.stats ? forsoeg.stats[metric] : undefined;
    if (mine === undefined || mine === null || mine <= 0) continue;

    const dagensBedste = await bestMetricToday(client, metric, forsoeg.id, day);
    if (dagensBedste === undefined || isBetter(metric, mine, dagensBedste)) {
      feats.push({ metric, type: 'dagens_rekord', vaerdi: mine });
      continue;
    }
    const personligBedste = await bestMetricPersonal(client, metric, forsoeg.id, forsoeg.spiller_id);
    if (personligBedste === undefined || isBetter(metric, mine, personligBedste)) {
      feats.push({ metric, type: 'personlig_rekord', vaerdi: mine });
    }
  }
  return feats;
}

// Dagens rangliste: bedste `samlet` pr. spiller i dag, sorteret (ties brydes
// af spiller.oprettet ASC — ældste tilmelding vinder ties, jf. rank()-reglen).
async function todayLeaderboard(client, day) {
  const { rows } = await client.query(
    `SELECT f.spiller_id, MAX(f.samlet) AS best, s.oprettet AS spiller_oprettet
     FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
     WHERE f.status = 'godkendt' AND f.oprettet::date = $1
     GROUP BY f.spiller_id, s.oprettet
     ORDER BY best DESC, s.oprettet ASC`,
    [day]
  );
  return rows.map((r) => ({ spillerId: r.spiller_id, best: Number(r.best), oprettet: r.spiller_oprettet }));
}

async function daysPlayedAll(client, spillerId) {
  const { rows } = await client.query(
    `SELECT COUNT(DISTINCT oprettet::date) AS n FROM forsoeg WHERE spiller_id = $1 AND status = 'godkendt'`,
    [spillerId]
  );
  return Number(rows[0].n);
}

async function daysPlayedSince(client, spillerId, periodStart) {
  const { rows } = await client.query(
    `SELECT COUNT(DISTINCT oprettet::date) AS n FROM forsoeg
     WHERE spiller_id = $1 AND status = 'godkendt' AND oprettet::date >= $2`,
    [spillerId, periodStart]
  );
  return Number(rows[0].n);
}

async function goalMet(client, spillerId, cfg) {
  if (!cfg.goal || cfg.goal <= 0) return false;
  // cfg.mission kommer fra admin-config (PUT /admin/config), som ikke
  // begrænser feltet til en kendt liste af metrikker — fald sikkert tilbage
  // til 'total' hvis en administrator (utilsigtet eller ej) har sat noget
  // andet end en kendt MET/RECORDS-nøgle. Se metricSqlExpr() ovenfor.
  const ONLY_METRICS = new Set(['total', 'r1', 'r2', 'r3', ...RECORDS]);
  const metric = ONLY_METRICS.has(cfg.mission) ? cfg.mission : 'total';
  const expr = metricSqlExpr(metric);
  const dir = MET[metric] && MET[metric].low ? 'MIN' : 'MAX';
  const zeroOk = metric === 'total';
  const { rows } = await client.query(
    `SELECT ${dir}(${expr}) AS best FROM forsoeg WHERE spiller_id = $1 AND status = 'godkendt' ${
      zeroOk ? '' : `AND ${expr} > 0`
    }`,
    [spillerId]
  );
  const best = rows[0] && rows[0].best !== null ? Number(rows[0].best) : undefined;
  if (best === undefined) return false;
  const low = MET[metric] && MET[metric].low;
  return low ? best <= cfg.goal : best >= cfg.goal;
}

async function computeTickets(client, spillerId, cfg) {
  const dage = await daysPlayedSince(client, spillerId, cfg.periodStart || '2000-01-01');
  const naaetMaal = await goalMet(client, spillerId, cfg);
  return dage + (naaetMaal ? 1 : 0);
}

module.exports = {
  metricSqlExpr,
  todayStr,
  bestMetricToday,
  bestMetricPersonal,
  computeFeats,
  todayLeaderboard,
  daysPlayedAll,
  daysPlayedSince,
  goalMet,
  computeTickets,
};
