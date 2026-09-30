'use strict';

process.env.RUNS_START_RATE_LIMIT_MS = '250'; // lille, men IKKE 0 — se sidste test i denne fil

const test = require('node:test');
const assert = require('node:assert/strict');
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

// Opgave D: den generelle skrive-rate-limit pr. IP er hævet markant
// (120 -> 1000/min) for at rumme messe-Wi-Fi bag NAT (hundredvis af enheder
// deler ofte ÉN offentlig IP). Limiteren (src/app.js) gælder for ALLE
// ikke-GET/HEAD-kald uanset sti (også en ukendt/404-sti er billigt at teste
// mod, uden DB-belastning) — se app.js: writeLimiter er mounted FØR alle
// routere og nøgles kun på klient-IP, ikke sti.
test('opgave D: generel skrive-rate-limit er hævet markant (mindst 150 skrivninger/min/IP tillades nu, hvor 120 var loftet før)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  let ramte429 = false;
  for (let i = 0; i < 150; i++) {
    // eslint-disable-next-line no-await-in-loop
    const res = await api(h.baseUrl, 'POST', '/ukendt-sti-' + i);
    if (res.status === 429) {
      ramte429 = true;
      break;
    }
    assert.equal(res.status, 404); // ukendt endpoint, men IKKE rate-limited
  }
  assert.equal(ramte429, false, 'skulle IKKE ramme 429 efter kun 150 skrive-kald (det gamle loft var 120)');
});

test('opgave D: admin-login-raten (5/min/IP) er UÆNDRET', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  let sidsteStatus;
  for (let i = 0; i < 6; i++) {
    // eslint-disable-next-line no-await-in-loop
    const res = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: 'helt-forkert' } });
    sidsteStatus = res.status;
  }
  assert.equal(sidsteStatus, 429, 'det 6. login-forsøg inden for samme minut skal stadig rammes af 5/min-grænsen');
});

// Selvsyn (adversariel gennemgang, opgave B): kan {ny:true} misbruges til at
// spamme liv-forbrug hurtigere end rate-limiten tillader? Nej — startLimiter
// (src/routes/runs.js) er mounted FØR selve handleren og gælder for ALLE
// kald til POST /runs, uanset body-indhold.
test('{ny:true} kan IKKE bruges til at omgå POST /runs-rate-limiten (1 kald/spiller/vindue, uanset body)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const foerste = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(foerste.status, 201);

  const medNyMedSamme = await api(h.baseUrl, 'POST', '/runs', { token, body: { ny: true } });
  assert.equal(medNyMedSamme.status, 429, 'ny:true skal rammes af rate-limiten ligesom et almindeligt kald');
});
