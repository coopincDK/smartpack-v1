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
