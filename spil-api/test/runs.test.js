'use strict';

process.env.RUNS_START_RATE_LIMIT_MS = '0'; // deaktivér rate-limit i denne test-fil

const test = require('node:test');
const assert = require('node:assert/strict');
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { ROUND_MAX } = require('../src/rules/scoring');

const GYLDIG_STATS = {
  orders: 5,
  errors: 0,
  fast: 3,
  packed: 6,
  perfects: 2,
  streak: 2,
  tower: 5,
  turbos: 0,
  sent: 10,
  rets: 2,
  strikes: 0,
  pus: 1,
  partners: 1,
};
const GYLDIGE_RUNDER = [50, 60, 40];

async function nytForsoegMedForudFortid(h, token, sekunderTilbage) {
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);
  await h.pool.query(
    `UPDATE forsoeg SET start_server = start_server - ($1 || ' seconds')::interval WHERE runde_id = $2`,
    [sekunderTilbage, start.body.runde_id]
  );
  return start.body.runde_id;
}

// Sætter et forsøgs start_server til tidligt om morgenen (00:05) SAMME
// (københavnske) dag som "nu" — deterministisk simulering af en offline-kø
// synket senere samme dag, uden risiko for at ramme et dagsskifte (i
// modsætning til at trække et fast antal timer fra "nu", som kunne krydse
// midnat afhængigt af hvornår testen rent faktisk kører).
async function flytStartServerTilTidligtIDag(h, rundeId) {
  await h.pool.query(
    `UPDATE forsoeg
     SET start_server = (date_trunc('day', now() AT TIME ZONE 'Europe/Copenhagen') AT TIME ZONE 'Europe/Copenhagen') + interval '5 minutes'
     WHERE runde_id = $1`,
    [rundeId]
  );
}

async function opretSpillerOgToken(h, overrides) {
  const { body } = await registrerSpiller(h.baseUrl, overrides);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  return reg.body.token;
}

test('POST /runs opretter et aktivt forsøg og bruger et liv', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);

  const før = await api(h.baseUrl, 'GET', '/me', { token });
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);
  assert.ok(start.body.runde_id);
  assert.equal(start.body.liv.n, før.body.liv.n - 1);
});

test('POST /runs afviser når spilleren ikke har flere liv', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);

  const me = await api(h.baseUrl, 'GET', '/me', { token });
  const antalLiv = me.body.liv.n;
  for (let i = 0; i < antalLiv; i++) {
    // brug hvert liv ved at oprette og straks afvise et forsøg (for kort tid -> afvist, men livet er brugt)
    const start = await api(h.baseUrl, 'POST', '/runs', { token });
    assert.equal(start.status, 201);
    await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
      token,
      body: { rounds: [1, 1, 1], s: {}, bf: false, duel: null, spilletid_klient_ms: 1000 },
    });
  }
  const sidste = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(sidste.status, 400);
  assert.equal(sidste.body.kode, 'ingen_liv');
});

test('finish godkender et realistisk forsøg og er idempotent ved gentagelse', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  const rundeId = await nytForsoegMedForudFortid(h, token, 80);

  const finishBody = {
    rounds: GYLDIGE_RUNDER,
    s: GYLDIG_STATS,
    bf: false,
    duel: null,
    spilletid_klient_ms: 81000,
  };

  const r1 = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, { token, body: finishBody });
  assert.equal(r1.status, 200);
  assert.equal(r1.body.godkendt, true);
  assert.equal(r1.body.forsoeg.samlet, GYLDIGE_RUNDER.reduce((a, b) => a + b, 0));

  const r2 = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, { token, body: finishBody });
  assert.equal(r2.status, 200);
  assert.deepEqual(r2.body, r1.body);

  // Bivirkninger kørte kun én gang: mærker duplikeres ikke.
  const me = await api(h.baseUrl, 'GET', '/me', { token });
  const unikke = new Set(me.body.badges);
  assert.equal(unikke.size, me.body.badges.length);
});

test('finish afviser urealistisk høj rundescore', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  const rundeId = await nytForsoegMedForudFortid(h, token, 80);

  const res = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, {
    token,
    body: {
      rounds: [ROUND_MAX[1] + 1, 0, 0],
      s: {},
      bf: false,
      duel: null,
      spilletid_klient_ms: 81000,
    },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.godkendt, false);
  assert.equal(res.body.aarsag, 'urealistisk_score');
});

test('finish afviser for kort spilletid', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  const start = await api(h.baseUrl, 'POST', '/runs', { token });

  const res = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token,
    body: { rounds: [10, 10, 10], s: {}, bf: false, duel: null, spilletid_klient_ms: 2000 },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.godkendt, false);
  assert.equal(res.body.aarsag, 'for_kort_spilletid');
});

test('finish afviser hvis klient/server-tid ikke stemmer overens', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  // Server mener forsøget varede ~80 sek., klienten hævder ~200 sek. — begge
  // er over minimum hver for sig, men afstanden er langt over tolerancen.
  const rundeId = await nytForsoegMedForudFortid(h, token, 80);

  const res = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, {
    token,
    body: { rounds: [10, 10, 10], s: {}, bf: false, duel: null, spilletid_klient_ms: 200000 },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.aarsag, 'tid_mismatch');
});

test('finish kræver at forsøget tilhører den autentificerede spiller', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const tokenA = await opretSpillerOgToken(h, { email: 'a2@example.dk', telefon: '20304060' });
  const tokenB = await opretSpillerOgToken(h, { email: 'b2@example.dk', telefon: '20304061' });
  const rundeId = await nytForsoegMedForudFortid(h, tokenA, 80);

  const res = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, {
    token: tokenB,
    body: { rounds: GYLDIGE_RUNDER, s: GYLDIG_STATS, bf: false, duel: null, spilletid_klient_ms: 81000 },
  });
  assert.equal(res.status, 404);
});

// --- Opgave A: løsnet tidsvalidering + finish resten af dagen + dagsskifte ---

test('finish godkendes selvom server_elapsed er MEGET længere end klientens påståede aktive tid (offline-kø)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  // Forsøget "startede" tidligt i morges (server-side, samme dag som nu) —
  // simulerer at klienten var offline og først synker resultatet flere timer
  // senere SAMME dag. Deterministisk (se flytStartServerTilTidligtIDag),
  // ingen risiko for dagsskifte.
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);
  await flytStartServerTilTidligtIDag(h, start.body.runde_id);
  const rundeId = start.body.runde_id;

  const res = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, {
    token,
    body: { rounds: GYLDIGE_RUNDER, s: GYLDIG_STATS, bf: false, duel: null, spilletid_klient_ms: 81000 },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.godkendt, true);
});

test('finish afviser tid_mismatch KUN når klienten påstår MERE aktiv tid end der er gået, ikke når server_elapsed er større', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  const rundeId = await nytForsoegMedForudFortid(h, token, 80);

  // Klienten hævder at have spillet aktivt i 200 sek., men der er kun gået
  // ~80 sek. i alt siden start -> for meget påstået aktiv tid -> tid_mismatch.
  const res = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, {
    token,
    body: { rounds: [10, 10, 10], s: {}, bf: false, duel: null, spilletid_klient_ms: 200000 },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.aarsag, 'tid_mismatch');
});

test('finish afviser for_lang_spilletid når klienten påstår en urealistisk høj AKTIV spilletid (uafhængigt af server_elapsed)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);
  const { MAX_AKTIV_SPILLETID_MS } = require('../src/rules/scoring');
  // for_lang_spilletid tjekkes udelukkende mod klientMs (uafhængigt af
  // server_elapsed, se src/rules/scoring.js) — intet behov for at flytte
  // start_server her.
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);
  const rundeId = start.body.runde_id;

  const res = await api(h.baseUrl, 'POST', `/runs/${rundeId}/finish`, {
    token,
    body: {
      rounds: [10, 10, 10],
      s: {},
      bf: false,
      duel: null,
      spilletid_klient_ms: MAX_AKTIV_SPILLETID_MS + 1000,
    },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.aarsag, 'for_lang_spilletid');
});

test('et aktivt forsøg kan finish\'es resten af dagen, men behandles som udløbet ved dagsskifte', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);

  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);
  // Flyt forsøgets start_server 30 timer tilbage — garanteret en TIDLIGERE
  // (københavnske) dag end i dag, uanset klokkeslæt/sommer-vintertid (en dag
  // er højst 25 timer).
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '30 hours' WHERE runde_id = $1`, [
    start.body.runde_id,
  ]);

  const finish = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token,
    body: { rounds: GYLDIGE_RUNDER, s: GYLDIG_STATS, bf: false, duel: null, spilletid_klient_ms: 81000 },
  });
  assert.equal(finish.status, 409);
  assert.equal(finish.body.kode, 'forsoeg_udloebet');

  const statusRes = await h.pool.query('SELECT status FROM forsoeg WHERE runde_id = $1', [start.body.runde_id]);
  assert.equal(statusRes.rows[0].status, 'udloebet');
});

test('POST /runs uden ny: et forsøg fra en TIDLIGERE dag behandles som udløbet (ikke genoptaget) næste gang det stødes på', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);

  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '30 hours' WHERE runde_id = $1`, [
    start.body.runde_id,
  ]);

  const igen = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(igen.status, 201);
  assert.notEqual(igen.body.runde_id, start.body.runde_id);
  assert.equal(igen.body.genoptaget, undefined, 'skal IKKE genoptages — det gamle forsøg er fra en tidligere dag');

  const gammelStatus = await h.pool.query('SELECT status FROM forsoeg WHERE runde_id = $1', [start.body.runde_id]);
  assert.equal(gammelStatus.rows[0].status, 'udloebet');
});

// --- Opgave B: {ny:true} ---

test('POST /runs uden ny returnerer det eksisterende aktive forsøg (genoptaget), uden at bruge endnu et liv', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);

  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);

  const igen = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(igen.status, 200);
  assert.equal(igen.body.genoptaget, true);
  assert.equal(igen.body.runde_id, start.body.runde_id);

  const me = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me.body.liv.n, start.body.liv.n, 'intet ekstra liv brugt ved genoptagelse');
});

test('POST /runs {ny:true} opgiver det aktive forsøg (uden refusion) og starter et helt nyt med et nyt liv', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const token = await opretSpillerOgToken(h);

  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);

  const nyt = await api(h.baseUrl, 'POST', '/runs', { token, body: { ny: true } });
  assert.equal(nyt.status, 201);
  assert.notEqual(nyt.body.runde_id, start.body.runde_id);
  assert.equal(nyt.body.genoptaget, undefined);
  // Et ekstra liv er brugt (det gamle forsøgs liv refunderes IKKE).
  assert.equal(nyt.body.liv.n, start.body.liv.n - 1);

  const gammelStatus = await h.pool.query('SELECT status FROM forsoeg WHERE runde_id = $1', [start.body.runde_id]);
  assert.equal(gammelStatus.rows[0].status, 'opgivet');

  // Det opgivne forsøg kan ikke længere finish'es normalt (ikke 'aktiv').
  const finishGammel = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token,
    body: { rounds: GYLDIGE_RUNDER, s: GYLDIG_STATS, bf: false, duel: null, spilletid_klient_ms: 81000 },
  });
  assert.equal(finishGammel.status, 409);
  assert.equal(finishGammel.body.kode, 'ikke_aktivt');
});
