'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { startHarness, api, registrerSpiller, slaaSmsTil } = require('./helpers/appHarness');
const { boostCode } = require('../src/rules/boostCode');
const { todayStr } = require('../src/rules/life');

test('registrering opretter spiller og returnerer token', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const res = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(res.status, 201);
  assert.equal(res.body.type, 'ny');
  assert.ok(res.body.token && res.body.token.length >= 32);
  assert.ok(res.body.spiller.vennekode);
});

test('firma er valgfrit ved registrering (0-40 tegn); PATCH /me sætter/retter det bagefter', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { firma: '' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  assert.equal(reg.body.spiller.firma, '');

  // Uden firma tæller spilleren IKKE med i firmakampen: companyKey i GET
  // /state skal være tom/falsy (klientens firms() springer allerede sådan
  // en over, se spil/index.html#firms).
  const stateFoer = await api(h.baseUrl, 'GET', '/state');
  const pFoer = stateFoer.body.players.find((p) => p.pid === reg.body.spiller.pid);
  assert.ok(!pFoer.companyKey, 'spiller uden firma skal have en tom/falsy companyKey');

  const token = reg.body.token;
  const patch = await api(h.baseUrl, 'PATCH', '/me', { token, body: { firma: 'Nyt Firma ApS' } });
  assert.equal(patch.status, 200);
  assert.equal(patch.body.firma, 'Nyt Firma ApS');

  const me = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me.body.firma, 'Nyt Firma ApS');

  const stateEfter = await api(h.baseUrl, 'GET', '/state');
  const pEfter = stateEfter.body.players.find((p) => p.pid === reg.body.spiller.pid);
  assert.ok(pEfter.companyKey, 'skal have en companyKey efter PATCH /me sætter firma');

  const forLangt = await api(h.baseUrl, 'PATCH', '/me', { token, body: { firma: 'x'.repeat(41) } });
  assert.equal(forLangt.status, 400);
  assert.equal(forLangt.body.kode, 'ugyldigt_firma');
});

test('login kræver at pinkoden matcher — afviser uden at overskrive', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'login@example.dk', pin: '4321' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);

  const gemt = await h.pool.query(`SELECT telefon, pin_hash FROM spiller WHERE email = 'login@example.dk'`);
  assert.equal(gemt.rows[0].telefon, null, 'telefon må ikke gemmes');
  assert.ok(gemt.rows[0].pin_hash && gemt.rows[0].pin_hash !== '4321', 'pinkoden gemmes kun som hash');

  const forkert = await api(h.baseUrl, 'POST', '/players', {
    body: { ...body, pin: '0000' },
  });
  assert.equal(forkert.status, 400);
  assert.equal(forkert.body.kode, 'pin_matcher_ikke');

  const korrekt = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(korrekt.status, 200);
  assert.equal(korrekt.body.type, 'login');
  assert.ok(korrekt.body.token);
  // Opgave C: login OPRETTER et nyt token — det gamle token roteres/
  // tilbagekaldes IKKE længere (flere samtidige enheder er nu tilladt).
  assert.notEqual(korrekt.body.token, reg.body.token);
  const meGammelt = await api(h.baseUrl, 'GET', '/me', { token: reg.body.token });
  assert.equal(meGammelt.status, 200, 'det oprindelige registrerings-token skal STADIG virke efter et login');
});

test('opgave C: en spiller kan være logget ind på FLERE enheder samtidig — login overskriver ikke tidligere udstedte tokens', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'multi-device@example.dk', telefon: '20304090' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const tokenTelefon = reg.body.token;

  const loginStand = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(loginStand.status, 200);
  const tokenStand = loginStand.body.token;
  assert.notEqual(tokenTelefon, tokenStand);

  // Begge tokens virker SAMTIDIG.
  const meTelefon = await api(h.baseUrl, 'GET', '/me', { token: tokenTelefon });
  const meStand = await api(h.baseUrl, 'GET', '/me', { token: tokenStand });
  assert.equal(meTelefon.status, 200);
  assert.equal(meStand.status, 200);
  assert.equal(meTelefon.body.pid, meStand.body.pid);

  // Endnu et login giver et tredje token, uden at ugyldiggøre de to første.
  const loginTablet = await api(h.baseUrl, 'POST', '/players', { body });
  const tokenTablet = loginTablet.body.token;
  const meTelefonIgen = await api(h.baseUrl, 'GET', '/me', { token: tokenTelefon });
  const meStandIgen = await api(h.baseUrl, 'GET', '/me', { token: tokenStand });
  const meTablet = await api(h.baseUrl, 'GET', '/me', { token: tokenTablet });
  assert.equal(meTelefonIgen.status, 200);
  assert.equal(meStandIgen.status, 200);
  assert.equal(meTablet.status, 200);
});

test('registrering kræver en pinkode på 4 cifre', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  for (const pin of ['', '123', '12345', 'abcd']) {
    const { body } = await registrerSpiller(h.baseUrl, { pin });
    const res = await api(h.baseUrl, 'POST', '/players', { body });
    assert.equal(res.status, 400, `pin "${pin}" skal afvises`);
    assert.equal(res.body.kode, 'ugyldig_pin');
  }
});

test('5 forkerte pinkoder spærrer spilleren i 15 min., også for den rigtige kode', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'spaer@example.dk', pin: '1111' });
  await api(h.baseUrl, 'POST', '/players', { body });
  for (let i = 0; i < 5; i++) {
    const r = await api(h.baseUrl, 'POST', '/players', { body: { ...body, pin: '2222' } });
    assert.equal(r.status, 400);
  }
  const spaerret = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(spaerret.status, 429);
  assert.equal(spaerret.body.kode, 'pin_spaerret');

  // Ophæv spærringen (som efter 15 min.) — så virker den rigtige kode igen,
  // og tælleren nulstilles.
  await h.pool.query(`UPDATE spiller SET pin_spaerret_til = now() - interval '1 minute' WHERE email = 'spaer@example.dk'`);
  const ok = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(ok.status, 200);
  const r = await h.pool.query(`SELECT pin_fejl, pin_spaerret_til FROM spiller WHERE email = 'spaer@example.dk'`);
  assert.equal(r.rows[0].pin_fejl, 0);
  assert.equal(r.rows[0].pin_spaerret_til, null);
});

test('PUT /me/subs sætter den VARIGE tilmelding, giver IKKE liv, og logger bekraeftet/trukket_tilbage', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const foer = await api(h.baseUrl, 'GET', '/me', { token });

  const s1 = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sp', 'sms'] } });
  assert.equal(s1.status, 200);
  assert.equal(s1.body.friske_liv, undefined); // /me/subs giver ikke liv siden Packrush
  assert.equal(s1.body.liv.n, foer.body.liv.n); // uændret antal liv

  const me1 = await api(h.baseUrl, 'GET', '/me', { token });
  assert.deepEqual(new Set(me1.body.mine_noegler), new Set(['sp', 'sms']));
  const smsStatus1 = me1.body.samtykker.find((s) => s.liste === 'sms');
  assert.equal(smsStatus1.aktiv, true);

  const s2 = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: [] } });
  assert.equal(s2.status, 200);

  const me2 = await api(h.baseUrl, 'GET', '/me', { token });
  const smsStatus2 = me2.body.samtykker.find((s) => s.liste === 'sms');
  assert.equal(smsStatus2.aktiv, false);
  assert.equal(smsStatus2.seneste_haendelse.type, 'trukket_tilbage');
  assert.ok(smsStatus2.foerste_bekraeftelse, 'foerste_bekraeftelse bevares selvom listen nu er inaktiv');
});

test('PUT /me/ticks (dagens flueben) giver friske liv, PUT /me/subs gør ikke', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const foer = await api(h.baseUrl, 'GET', '/me', { token });

  const subs = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms'] } });
  assert.equal(subs.status, 200);
  assert.equal(subs.body.liv.n, foer.body.liv.n); // ingen liv fra /me/subs

  const ticks = await api(h.baseUrl, 'PUT', '/me/ticks', { token, body: { keys: ['sms'] } });
  assert.equal(ticks.status, 200);
  assert.equal(ticks.body.friske_liv, 1); // 'sms' giver liv når den er tikket af i dag
  assert.equal(ticks.body.liv.n, foer.body.liv.n + 1);
  assert.deepEqual(ticks.body.mine_flueben, ['sms']);

  // Gentikning samme dag giver IKKE ekstra liv.
  const ticksIgen = await api(h.baseUrl, 'PUT', '/me/ticks', { token, body: { keys: [] } });
  assert.equal(ticksIgen.body.friske_liv, 0);
  const ticksIgen2 = await api(h.baseUrl, 'PUT', '/me/ticks', { token, body: { keys: ['sms'] } });
  assert.equal(ticksIgen2.body.friske_liv, 0);
});

test('DELETE /me/subs/:liste er en ægte, varig afmelding (trukket_tilbage logges, fjernes fra dagens flueben)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms', 'sp'] } });
  await api(h.baseUrl, 'PUT', '/me/ticks', { token, body: { keys: ['sms'] } });

  const slet = await api(h.baseUrl, 'DELETE', '/me/subs/sms', { token });
  assert.equal(slet.status, 200);
  assert.deepEqual(new Set(slet.body.mine_noegler), new Set(['sp']));

  const me = await api(h.baseUrl, 'GET', '/me', { token });
  assert.ok(!me.body.mine_noegler.includes('sms'));
  assert.deepEqual(me.body.mine_flueben, []); // fjernet fra dagens flueben også
  const smsStatus = me.body.samtykker.find((s) => s.liste === 'sms');
  assert.equal(smsStatus.aktiv, false);

  // Idempotent: at slette en liste der ikke er tilmeldt, fejler ikke.
  const igen = await api(h.baseUrl, 'DELETE', '/me/subs/sms', { token });
  assert.equal(igen.status, 200);
});

test('GET /me kræver bearer-token', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const res = await api(h.baseUrl, 'GET', '/me');
  assert.equal(res.status, 401);
});

test('POST /me/boost: kræver sms-tilmelding, korrekt kode, og kun én gang pr. dag', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const cfgRes = await h.pool.query('SELECT hemmelig FROM config WHERE id = 1');
  const pin = cfgRes.rows[0].hemmelig.pin;
  const kode = boostCode(todayStr(new Date()), pin);

  // Uden sms-tilmelding, men med KORREKT kode: afvist på tilmeldingstjekket.
  const forInden = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: kode } });
  assert.equal(forInden.status, 400);
  assert.equal(forInden.body.kode, 'ikke_tilmeldt_sms');

  // Opgave F: uden sms-tilmelding, men med FORKERT kode: koden tjekkes
  // FØRST — 'ukendt_kode', IKKE 'ikke_tilmeldt_sms' (uanset tilmeldingsstatus).
  const forkertUdenSms = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: 'ZZZZ' } });
  assert.equal(forkertUdenSms.status, 400);
  assert.equal(forkertUdenSms.body.kode, 'ukendt_kode');

  await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms'] } });

  // Opgave F: en kode der ikke matcher dagens facit giver ALTID 'ukendt_kode'
  // (uanset tilmeldingsstatus) — signalerer til klienten at den bør prøve
  // koden som en udfordrings-/vennekode i stedet.
  const forkert = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: 'XXXX' } });
  assert.equal(forkert.status, 400);
  assert.equal(forkert.body.kode, 'ukendt_kode');

  const meFoer = await api(h.baseUrl, 'GET', '/me', { token });
  const korrekt = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: kode } });
  assert.equal(korrekt.status, 200);
  assert.equal(korrekt.body.liv.n, meFoer.body.liv.n + 2);

  const igen = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: kode } });
  assert.equal(igen.status, 400);
  assert.equal(igen.body.kode, 'allerede_brugt');
});

// --- M3: IP-bred rate-limit paa login-/pin-forsoeg (sikkerhedsgennemgang) ---

test('M3: en IP der laver 10+ forkerte pin-forsoeg paa tvaers af forskellige spilleres emails bliver selv blokeret', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const ANGRIBER_IP = { 'x-client-ip': '203.0.113.50' };

  // To FORSKELLIGE spillere, begge forsoegt fra samme IP.
  const a = await registrerSpiller(h.baseUrl, { email: 'offer-a@example.dk', pin: '1111' });
  const b = await registrerSpiller(h.baseUrl, { email: 'offer-b@example.dk', pin: '2222' });
  await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: ANGRIBER_IP });
  await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: ANGRIBER_IP });

  // 10 forkerte forsoeg, fordelt over de to ofre (ikke 5+5 mod samme — netop
  // pointen er at graensen er paa tvaers af spillere, ikke pr. spiller).
  let sidsteStatus;
  for (let i = 0; i < 10; i++) {
    const offer = i % 2 === 0 ? a.body : b.body;
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'POST', '/players', {
      body: { ...offer, pin: '0000' },
      headers: ANGRIBER_IP,
    });
    sidsteStatus = r.status;
  }
  assert.equal(sidsteStatus, 400, 'de foerste 10 forkerte forsoeg skal stadig behandles som almindelige forkerte pinkoder');

  // Det 11. forkerte forsoeg fra SAMME IP rammer nu IP-graensen.
  const elevte = await api(h.baseUrl, 'POST', '/players', {
    body: { ...a.body, pin: '0000' },
    headers: ANGRIBER_IP,
  });
  assert.equal(elevte.status, 429);
  assert.equal(elevte.body.kode, 'ip_login_spaerret');
});

test('M3: en spillers korte spaerring (pin_spaerret) paavirker IKKE andre spilleres mulighed for at logge ind fra samme IP', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const STAND_IP = { 'x-client-ip': '198.51.100.9' };

  const a = await registrerSpiller(h.baseUrl, { email: 'kollega-a@example.dk', pin: '1234' });
  const b = await registrerSpiller(h.baseUrl, { email: 'kollega-b@example.dk', pin: '5678' });
  await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: STAND_IP });
  await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: STAND_IP });

  // Laas kollega-A konto (5 forkerte) — under M3-loftet (10) paa denne IP.
  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line no-await-in-loop
    await api(h.baseUrl, 'POST', '/players', { body: { ...a.body, pin: '0000' }, headers: STAND_IP });
  }
  const aSpaerret = await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: STAND_IP });
  assert.equal(aSpaerret.status, 429);
  assert.equal(aSpaerret.body.kode, 'pin_spaerret');

  // Kollega-B kan stadig logge ind RIGTIGT fra samme IP.
  const bLogin = await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: STAND_IP });
  assert.equal(bLogin.status, 200);
  assert.equal(bLogin.body.type, 'login');
});

test('M3: et VELLYKKET login forbruger ikke IP-graensens slots', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const IP = { 'x-client-ip': '192.0.2.77' };

  const { body } = await registrerSpiller(h.baseUrl, { email: 'ok-login@example.dk', pin: '4242' });
  await api(h.baseUrl, 'POST', '/players', { body, headers: IP });

  for (let i = 0; i < 15; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'POST', '/players', { body, headers: IP });
    assert.equal(r.status, 200, `vellykket login nr. ${i + 1} skal ikke rammes af IP-graensen`);
  }
});

// --- M4: selvbetjent sletning DELETE /me (sikkerhedsgennemgang) ---

test('M4: DELETE /me uden bearer-token afvises (401), intet slettes', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const res = await api(h.baseUrl, 'DELETE', '/me', { body: { pin: '1234' } });
  assert.equal(res.status, 401);
});

test('M4: DELETE /me med gyldigt bearer-token men FORKERT pin afvises, intet slettes', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'slet-forkert@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const res = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pin: '9999' } });
  assert.equal(res.status, 403);
  assert.equal(res.body.kode, 'bekraeftelse_forkert');

  const fortsatTil = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'slet-forkert@example.dk'");
  assert.equal(fortsatTil.rows.length, 1);
  const me = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me.status, 200);
});

test('M4: DELETE /me med korrekt bearer + korrekt pin sletter spilleren rigtigt', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'slet-rigtigt@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const res = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pin: '1234' } });
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);

  const vaek = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'slet-rigtigt@example.dk'");
  assert.equal(vaek.rows.length, 0, 'spilleren skal vaere helt vaek');

  const meEfter = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(meEfter.status, 401);

  const logRows = await h.pool.query(
    "SELECT detaljer FROM admin_audit_log WHERE handling = 'selvbetjent_sletning' ORDER BY id DESC LIMIT 1"
  );
  assert.equal(logRows.rows.length, 1);
  const detaljer = JSON.stringify(logRows.rows[0].detaljer);
  assert.ok(!detaljer.includes('slet-rigtigt@example.dk'), 'email maa ikke optraede i audit-loggen');
  assert.equal(logRows.rows[0].detaljer.begrundelse, 'selvbetjent sletning');
});

test('M4: DELETE /me med korrekt telefon (legacy-spiller uden pin) sletter spilleren', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  // Simulerer en spiller oprettet FOER pinkoden: intet pin_hash, kun telefon.
  const { body } = await registrerSpiller(h.baseUrl, { email: 'legacy@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;
  await h.pool.query("UPDATE spiller SET pin_hash = NULL, telefon = '20304050' WHERE email = 'legacy@example.dk'");

  const forkert = await api(h.baseUrl, 'DELETE', '/me', { token, body: { telefon: '20304099' } });
  assert.equal(forkert.status, 403);

  const rigtig = await api(h.baseUrl, 'DELETE', '/me', { token, body: { telefon: '001120304050' } });
  assert.equal(rigtig.status, 200);
  const vaek = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'legacy@example.dk'");
  assert.equal(vaek.rows.length, 0);
});

test('M4: 5 forkerte bekraeftelser paa DELETE /me spaerrer yderligere forsoeg i et kvarter (brute-force-beskyttelse)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'slet-bruteforce@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  let sidsteStatus;
  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pin: '0000' } });
    sidsteStatus = r.status;
  }
  assert.equal(sidsteStatus, 403);

  const sjette = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pin: '1234' } });
  assert.equal(sjette.status, 429);
  assert.equal(sjette.body.kode, 'for_mange_forsoeg');

  const findes = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'slet-bruteforce@example.dk'");
  assert.equal(findes.rows.length, 1);
});
