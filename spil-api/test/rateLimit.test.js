'use strict';

process.env.RUNS_START_RATE_LIMIT_MS = '2000'; // lille, men IKKE 0 — se sidste tests i denne fil

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

// N12: et genoptaget-svar (intet nyt forsøg, intet nyt liv) må ALDRIG
// forbruge rate-limit-"slottet" — og må heller ikke lade et tidligere
// forbrug (fra den oprindelige oprettelse) blive stående og blokere det
// efterfølgende {ny:true}-kald, som en klient typisk sender LIGE EFTER at
// have set genoptaget:true, for bevidst at opgive det gamle forsøg og starte
// et nyt (se src/routes/runs.js).
test('N12: genoptaget-svar forbruger IKKE rate-limit-slottet — et efterfølgende {ny:true} kan gennemføre uden 429', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  // 1) Opretter et forsøg — bruger et liv OG rate-limit-slottet.
  const foerste = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(foerste.status, 201);

  // 2) Samme kald igen, uden ny — genoptager det eksisterende (ingen ændring,
  // intet liv brugt) og må IKKE forbruge rate-limit-slottet.
  const genoptaget = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(genoptaget.status, 200);
  assert.equal(genoptaget.body.genoptaget, true);
  assert.equal(genoptaget.body.runde_id, foerste.body.runde_id);

  // 3) {ny:true} rent faktisk opretter et nyt forsøg (nyt liv) — skal
  // gennemføre uden 429, selvom det kommer godt inden for rate-limit-vinduet
  // efter kald 1.
  const nyt = await api(h.baseUrl, 'POST', '/runs', { token, body: { ny: true } });
  assert.equal(nyt.status, 201, 'skal IKKE rammes af 429 pga. det forudgående, ikke-forbrugende genoptaget-kald');
  assert.notEqual(nyt.body.runde_id, foerste.body.runde_id);
});

// N12 (kontrol): sikrer at ovenstående fix ikke ved et uheld har slået hele
// rate-limiten på POST /runs fra — to RIGTIGE forsøgsoprettelser (begge
// bruger et liv og indsætter en ny forsoeg-række) inden for samme vindue skal
// stadig rammes af 429.
test('N12: to RIGTIGE forsøgsoprettelser inden for rate-limit-vinduet rammer stadig 429', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const foerste = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(foerste.status, 201);

  // Ingen genoptaget-kald imellem — {ny:true} her er den ANDEN reelle
  // oprettelse inden for vinduet og skal rammes af 429.
  const anden = await api(h.baseUrl, 'POST', '/runs', { token, body: { ny: true } });
  assert.equal(anden.status, 429, 'to reelle oprettelser inden for vinduet skal stadig rate-limites');
});
