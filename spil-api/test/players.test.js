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

// --- Telefon-opfølgning (brugerens beslutning, 2. okt. 2026) ---

test('telefon er valgfrit ved registrering (med og uden), og normaliseres/valideres når det er angivet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  // Uden telefon: helt OK, samme som hidtil.
  const uden = await registrerSpiller(h.baseUrl, { email: 'uden-tlf@example.dk' });
  const regUden = await api(h.baseUrl, 'POST', '/players', { body: uden.body });
  assert.equal(regUden.status, 201);
  const meUden = await api(h.baseUrl, 'GET', '/me', { token: regUden.body.token });
  assert.equal(meUden.body.telefon, null);

  // Med telefon: gemmes normaliseret (kun cifre).
  const med = await registrerSpiller(h.baseUrl, { email: 'med-tlf@example.dk', telefon: '+45 20 30 40 50' });
  const regMed = await api(h.baseUrl, 'POST', '/players', { body: med.body });
  assert.equal(regMed.status, 201);
  const meMed = await api(h.baseUrl, 'GET', '/me', { token: regMed.body.token });
  assert.equal(meMed.body.telefon, '4520304050');

  // Angivet, men for kort efter normalisering: afvist, intet oprettes.
  const forKort = await registrerSpiller(h.baseUrl, { email: 'kort-tlf@example.dk', telefon: '1234567' });
  const regForKort = await api(h.baseUrl, 'POST', '/players', { body: forKort.body });
  assert.equal(regForKort.status, 400);
  assert.equal(regForKort.body.kode, 'ugyldigt_telefon');
  const findes = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'kort-tlf@example.dk'");
  assert.equal(findes.rows.length, 0);
});

test('PATCH /me { telefon } sætter/retter telefonnummeret bagefter, uden at påvirke firma (og omvendt)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'patch-tlf@example.dk', firma: 'Oprindeligt Firma' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const sat = await api(h.baseUrl, 'PATCH', '/me', { token, body: { telefon: '20304050' } });
  assert.equal(sat.status, 200);
  assert.equal(sat.body.telefon, '20304050');
  assert.equal(sat.body.firma, undefined, 'firma var ikke med i denne request og må ikke optræde i svaret');

  // Firma skal STADIG være uændret — en PATCH med kun telefon må ALDRIG rydde det.
  const me1 = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me1.body.firma, 'Oprindeligt Firma');
  assert.equal(me1.body.telefon, '20304050');

  // Omvendt: en PATCH med kun firma må ALDRIG rydde telefonen.
  const firmaPatch = await api(h.baseUrl, 'PATCH', '/me', { token, body: { firma: 'Nyt Firma' } });
  assert.equal(firmaPatch.status, 200);
  assert.equal(firmaPatch.body.telefon, undefined);
  const me2 = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me2.body.telefon, '20304050', 'telefon må ikke være ryddet af en firma-kun PATCH');
  assert.equal(me2.body.firma, 'Nyt Firma');

  // Ret til et andet (gyldigt) nummer.
  const rettet = await api(h.baseUrl, 'PATCH', '/me', { token, body: { telefon: '30405060' } });
  assert.equal(rettet.status, 200);
  assert.equal(rettet.body.telefon, '30405060');

  // For kort: afvist, det gamle nummer bevares.
  const forKort = await api(h.baseUrl, 'PATCH', '/me', { token, body: { telefon: '123' } });
  assert.equal(forKort.status, 400);
  assert.equal(forKort.body.kode, 'ugyldigt_telefon');
  const me3 = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me3.body.telefon, '30405060');

  // Intet felt med i det hele taget: afvist.
  const tomt = await api(h.baseUrl, 'PATCH', '/me', { token, body: {} });
  assert.equal(tomt.status, 400);
  assert.equal(tomt.body.kode, 'intet_at_opdatere');
});

test('telefon er kun unikt NÅR det er sat: to spillere uden telefon er OK, to med samme telefon er det IKKE', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  // To spillere UDEN telefon — helt OK, ikke en kollision.
  const a = await registrerSpiller(h.baseUrl, { email: 'ingen-tlf-a@example.dk' });
  const b = await registrerSpiller(h.baseUrl, { email: 'ingen-tlf-b@example.dk' });
  assert.equal((await api(h.baseUrl, 'POST', '/players', { body: a.body })).status, 201);
  assert.equal((await api(h.baseUrl, 'POST', '/players', { body: b.body })).status, 201);

  // To spillere med SAMME telefon ved registrering — den anden afvises.
  const c = await registrerSpiller(h.baseUrl, { email: 'samme-tlf-c@example.dk', telefon: '20304050' });
  const d = await registrerSpiller(h.baseUrl, { email: 'samme-tlf-d@example.dk', telefon: '20304050' });
  assert.equal((await api(h.baseUrl, 'POST', '/players', { body: c.body })).status, 201);
  const regD = await api(h.baseUrl, 'POST', '/players', { body: d.body });
  assert.equal(regD.status, 400);
  assert.equal(regD.body.kode, 'telefon_i_brug');
  const dFindes = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'samme-tlf-d@example.dk'");
  assert.equal(dFindes.rows.length, 0, 'spiller D må ikke være oprettet');

  // Samme kollision via PATCH /me (spiller B forsøger at sætte spiller C's nummer).
  const regB = await api(h.baseUrl, 'POST', '/players', { body: b.body });
  const patchKollision = await api(h.baseUrl, 'PATCH', '/me', {
    token: regB.body.token,
    body: { telefon: '20304050' },
  });
  assert.equal(patchKollision.status, 400);
  assert.equal(patchKollision.body.kode, 'telefon_i_brug');
});

test('sms-tilmelding afvises uden telefon (registrering og PUT /me/subs|ticks), og lykkes efter PATCH /me har sat ét', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  // Ved registrering: sms uden telefon afvises, intet oprettes.
  const udenTlf = await registrerSpiller(h.baseUrl, {
    email: 'sms-uden-tlf@example.dk',
    tilmeldinger: ['sms'],
  });
  const regAfvist = await api(h.baseUrl, 'POST', '/players', { body: udenTlf.body });
  assert.equal(regAfvist.status, 400);
  assert.equal(regAfvist.body.kode, 'telefon_kraeves');
  const findes = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'sms-uden-tlf@example.dk'");
  assert.equal(findes.rows.length, 0);

  // Registrér UDEN sms (og uden telefon) — derefter PUT /me/subs og
  // PUT /me/ticks med 'sms' skal begge afvises, indtil telefon er sat.
  const { body } = await registrerSpiller(h.baseUrl, { email: 'sms-senere@example.dk' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const subsFoer = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms'] } });
  assert.equal(subsFoer.status, 400);
  assert.equal(subsFoer.body.kode, 'telefon_kraeves');

  const ticksFoer = await api(h.baseUrl, 'PUT', '/me/ticks', { token, body: { keys: ['sms'] } });
  assert.equal(ticksFoer.status, 400);
  assert.equal(ticksFoer.body.kode, 'telefon_kraeves');

  // Sæt telefon via PATCH /me — nu lykkes begge.
  const patch = await api(h.baseUrl, 'PATCH', '/me', { token, body: { telefon: '20304050' } });
  assert.equal(patch.status, 200);

  const subsEfter = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms'] } });
  assert.equal(subsEfter.status, 200);
  assert.ok(subsEfter.body.mine_noegler.includes('sms'));

  const ticksEfter = await api(h.baseUrl, 'PUT', '/me/ticks', { token, body: { keys: ['sms'] } });
  assert.equal(ticksEfter.status, 200);
  assert.deepEqual(ticksEfter.body.mine_flueben, ['sms']);

  // At AFMELDE sms er derimod altid tilladt, telefon eller ej.
  const afmeld = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: [] } });
  assert.equal(afmeld.status, 200);
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

  // Telefon-opfølgning: sms kræver et registreret telefonnummer.
  const { body } = await registrerSpiller(h.baseUrl, { telefon: '20304050' });
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

  // Telefon-opfølgning: sms kræver et registreret telefonnummer.
  const { body } = await registrerSpiller(h.baseUrl, { telefon: '20304050' });
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

  // Telefon-opfølgning: sms kræver et registreret telefonnummer.
  const { body } = await registrerSpiller(h.baseUrl, { telefon: '20304050' });
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

  // Telefon-opfølgning: sms kræver et registreret telefonnummer.
  const { body } = await registrerSpiller(h.baseUrl, { telefon: '20304050' });
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

// S1 (merge-review, opfølgende sikkerhedsgennemgang): denne test dækkede
// FØR den rene IP-brede grænse (ÉT fælles loft på 10, på tværs af ALLE
// spilleres emails) — det var selve den opførsel, der blokerede hele
// messens delte Wi-Fi efter blot 10 forkerte forsøg FRA HVEM SOM HELST mod
// HVILKEN SOM HELST konto. Testen er erstattet af to-lags-testene nedenfor,
// der dækker PRÆCIS det modsatte, ønskede scenarie: mange forkerte forsøg
// mod ÉN konto rammer IKKE andre spilleres login fra samme IP, mens et
// SÆRLIGT HØJT antal forkerte forsøg spredt over MANGE forskellige konti
// stadig rammer et fælles IP-loft.

test('S1: 10 forkerte forsoeg mod ÉN e-mail blokerer IKKE en ANDEN spillers login fra SAMME IP', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const STAND_IP = { 'x-client-ip': '203.0.113.50' };

  // To FORSKELLIGE spillere, begge registreret fra samme (delte) IP.
  const a = await registrerSpiller(h.baseUrl, { email: 'offer-a@example.dk', pin: '1111' });
  const b = await registrerSpiller(h.baseUrl, { email: 'offer-b@example.dk', pin: '2222' });
  await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: STAND_IP });
  await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: STAND_IP });

  // 10 forkerte forsoeg mod SAMME konto (spiller A), fra SAMME IP. Kontoen
  // laases efter PIN_MAKS_FEJL (5) af dem (pin_spaerret) — resten af de 10
  // rammer derfor det laas, ikke en frisk "forkert pin"-fejl, men det er
  // netop pointen: selv et tocifret antal forsoeg, der UDTØMMER det snaevre
  // (IP, email)-lag for ÉN konto, maa ikke smitte af paa andre konti paa
  // samme IP (se naeste assertion).
  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'POST', '/players', {
      body: { ...a.body, pin: '0000' },
      headers: STAND_IP,
    });
    assert.ok([400, 429].includes(r.status), `forsoeg ${i + 1} mod spiller A skal vaere 400 (forkert) eller 429 (konto-laast), ikke en IP-bred blokering`);
    assert.notEqual(r.body.kode, 'ip_login_spaerret', `forsoeg ${i + 1} mod KUN spiller A maa ikke ramme det IP-brede loft`);
  }

  // Spiller B — en ANDEN konto, SAMME IP — kan stadig logge rigtigt ind.
  const bLogin = await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: STAND_IP });
  assert.equal(bLogin.status, 200, 'spiller B maa IKKE vaere blokeret af spiller A\'s forkerte forsoeg fra samme IP');
  assert.equal(bLogin.body.type, 'login');
});

test('S1: det snaevre (IP, email)-loft er FAELLES mellem login (POST /players) og DELETE /me — rammer ÉN konto, ikke andre konti paa samme IP', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const STAND_IP = { 'x-client-ip': '198.51.100.9' };

  const a = await registrerSpiller(h.baseUrl, { email: 'ip-email-a@example.dk', pin: '1111' });
  const b = await registrerSpiller(h.baseUrl, { email: 'ip-email-b@example.dk', pin: '2222' });
  const regA = await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: STAND_IP });
  await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: STAND_IP });
  const tokenA = regA.body.token;

  // 10 forkerte forsoeg mod spiller A's konto, FORDELT over begge
  // endpoints (login + DELETE /me) — begge bruger den samme delte
  // ipLoginLimiter (se src/app.js), saa det snaevre (IP, email)-loft paa 10
  // naas uanset hvilket af de to endpoints forsoegene kommer fra.
  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line no-await-in-loop
    await api(h.baseUrl, 'POST', '/players', { body: { ...a.body, pin: '0000' }, headers: STAND_IP });
  }
  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line no-await-in-loop
    await api(h.baseUrl, 'DELETE', '/me', { token: tokenA, body: { pinkode: '0000' }, headers: STAND_IP });
  }

  // Det 11. forsoeg mod SAMME konto (uanset endpoint) rammer nu det
  // snaevre (IP, email)-loft.
  const elevte = await api(h.baseUrl, 'DELETE', '/me', {
    token: tokenA,
    body: { pinkode: '0000' },
    headers: STAND_IP,
  });
  assert.equal(elevte.status, 429);
  assert.equal(elevte.body.kode, 'ip_login_spaerret');

  // Men spiller B — en ANDEN konto, SAMME IP — er helt upaavirket: kan
  // stadig logge korrekt ind.
  const bLogin = await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: STAND_IP });
  assert.equal(bLogin.status, 200, 'spiller B maa ikke rammes af det loft spiller A har udtoemt');
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
// Telefon-opfølgning (2. okt. 2026): bekræftelsen er nu KUN {pinkode} —
// IKKE længere telefon (se API.md). Rate-limiten er desuden IKKE længere en
// separat/dupliceret tæller — den deler SAMME pr.-spiller-tæller
// (pin_fejl/pin_spaerret_til) og SAMME IP-tæller som login i POST /players,
// se testene nedenfor for begge dele.

test('M4: DELETE /me uden bearer-token afvises (401), intet slettes', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const res = await api(h.baseUrl, 'DELETE', '/me', { body: { pinkode: '1234' } });
  assert.equal(res.status, 401);
});

test('M4: DELETE /me med gyldigt bearer-token men FORKERT pinkode afvises, intet slettes', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'slet-forkert@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const res = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '9999' } });
  assert.equal(res.status, 403);
  assert.equal(res.body.kode, 'bekraeftelse_forkert');

  const fortsatTil = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'slet-forkert@example.dk'");
  assert.equal(fortsatTil.rows.length, 1);
  const me = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(me.status, 200);
});

test('M4: DELETE /me med korrekt bearer + korrekt pinkode sletter spilleren rigtigt', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'slet-rigtigt@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const res = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '1234' } });
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

test('M4: DELETE /me afviser en legacy-spiller uden pin_hash (telefon er IKKE længere en gyldig bekraeftelse)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  // Simulerer en spiller oprettet FOER pinkoden: intet pin_hash, kun telefon.
  const { body } = await registrerSpiller(h.baseUrl, { email: 'legacy@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;
  await h.pool.query("UPDATE spiller SET pin_hash = NULL, telefon = '20304050' WHERE email = 'legacy@example.dk'");

  // Telefon duer IKKE længere som bekræftelse ved sletning.
  const medTelefon = await api(h.baseUrl, 'DELETE', '/me', { token, body: { telefon: '20304050' } });
  assert.equal(medTelefon.status, 403);
  assert.equal(medTelefon.body.kode, 'bekraeftelse_forkert');

  // Og der er ingen pinkode at matche imod (pin_hash er NULL).
  const medPin = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '1234' } });
  assert.equal(medPin.status, 403);

  const stadigTil = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'legacy@example.dk'");
  assert.equal(stadigTil.rows.length, 1, 'legacy-spilleren uden pin kan ikke slette sig selv her — skal forbi standen');
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
    const r = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '0000' } });
    sidsteStatus = r.status;
  }
  assert.equal(sidsteStatus, 403, 'det 5. (laasende) forsoeg svarer stadig "forkert", ikke "spaerret" — laaset maerkes foerst NAESTE forsoeg');

  // Det 6. forsoeg — selv med KORREKT pinkode — rammer nu pr.-spiller-laaset.
  const sjette = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '1234' } });
  assert.equal(sjette.status, 429);
  assert.equal(sjette.body.kode, 'pin_spaerret');

  const findes = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'slet-bruteforce@example.dk'");
  assert.equal(findes.rows.length, 1);
});

test('M4: forkerte DELETE /me-bekraeftelser taeller med i SAMME pr.-spiller-spaerring som login (ikke en separat/duplikeret taeller)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'delt-pinfejl@example.dk', pin: '1234' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  // 3 forkerte DELETE /me-forsoeg + 2 forkerte LOGIN-forsoeg = 5 forkerte i
  // alt for SAMME spiller — hvis taellerne var separate, ville ingen af de
  // to nedenfor vaere laast endnu.
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '0000' } });
    assert.equal(r.status, 403);
  }
  for (let i = 0; i < 2; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'POST', '/players', { body: { ...body, pin: '0000' } });
    assert.equal(r.status, 400);
  }

  // Spilleren er nu laast (5. forkerte, uanset hvilket af de to endpoints
  // det kom fra) — et 6. forsoeg med KORREKT pinkode afvises stadig, baade
  // ved login og ved sletning.
  const loginLaast = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(loginLaast.status, 429);
  assert.equal(loginLaast.body.kode, 'pin_spaerret');

  const sletLaast = await api(h.baseUrl, 'DELETE', '/me', { token, body: { pinkode: '1234' } });
  assert.equal(sletLaast.status, 429);
  assert.equal(sletLaast.body.kode, 'pin_spaerret');

  const findes = await h.pool.query("SELECT 1 FROM spiller WHERE email = 'delt-pinfejl@example.dk'");
  assert.equal(findes.rows.length, 1);
});

test('S1: forkerte forsoeg mod TO FORSKELLIGE konti, fordelt over login og DELETE /me, fra SAMME IP rammer IKKE laengere et faelles loft paa 10 (det var S1-fejlen)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const IP = { 'x-client-ip': '203.0.113.77' };

  const a = await registrerSpiller(h.baseUrl, { email: 'ip-delt-a@example.dk', pin: '1111' });
  const b = await registrerSpiller(h.baseUrl, { email: 'ip-delt-b@example.dk', pin: '2222' });
  const regA = await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: IP });
  await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: IP });
  const tokenA = regA.body.token;

  // 4 forkerte LOGIN-forsoeg (spiller B) + 4 forkerte DELETE /me-forsoeg
  // (spiller A) = 8 fra SAMME IP, fordelt over to FORSKELLIGE konti og to
  // FORSKELLIGE endpoints — UNDER baade pr.-spiller-loftet (5) og det
  // snaevre (IP, email)-loft (10) for hver konto for sig. FØR S1-fixet delte
  // alle forsoeg fra samme IP ÉT loft paa 10 UANSET email — her ville det
  // 9./10. forsoeg (uanset hvilken konto) altsaa have ramt det. Nu, hvor
  // loftet er pr. (IP, email) i stedet, rammer ingen af dem noget som
  // helst.
  for (let i = 0; i < 4; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'POST', '/players', { body: { ...b.body, pin: '0000' }, headers: IP });
    assert.equal(r.status, 400);
  }
  for (let i = 0; i < 4; i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await api(h.baseUrl, 'DELETE', '/me', { token: tokenA, body: { pinkode: '0000' }, headers: IP });
    assert.equal(r.status, 403);
  }

  // Begge konti kan nu logge korrekt ind fra samme IP — intet faelles loft
  // paa tvaers af de to konti blev ramt.
  const aLogin = await api(h.baseUrl, 'POST', '/players', { body: a.body, headers: IP });
  assert.equal(aLogin.status, 200);
  const bLogin = await api(h.baseUrl, 'POST', '/players', { body: b.body, headers: IP });
  assert.equal(bLogin.status, 200);
});

// S1: det høje, IP-ALENE lag (PIN_IP_ALENE_MAKS_FORKERTE, på tværs af ALLE
// emails) testes direkte mod den RIGTIGE, eksporterede createIpLoginLimiter()
// — altså den faktiske produktionsfunktion som src/app.js opretter ÉN
// instans af og deler mellem POST /players og DELETE /me (ikke en
// isoleret/dupliceret genimplementering). Vi undgår bevidst at gå via
// fuld HTTP+DB for de 300+ forskellige konti dette kræver (ville gøre
// testsuiten unødigt langsom) — i stedet bygges minimale `req`-objekter,
// der efterligner PRÆCIS det `req.body.email`/`req.headers`-shape routerne
// selv læser (se emailNoegleFra() i src/routes/players.js).
test('S1: et stort antal (over det hoeje IP-loft) forkerte forsoeg mod MANGE forskellige emails fra samme IP rammer stadig IP-loftet', async (t) => {
  const { createIpLoginLimiter } = require('../src/routes/players');
  const limiter = createIpLoginLimiter();
  const IP = '203.0.113.200';

  function reqFor(i) {
    return { headers: { 'x-client-ip': IP }, body: { email: `mange-emails-${i}@example.dk` } };
  }

  // 300 forkerte forsoeg mod 300 FORSKELLIGE emails fra SAMME IP — hver
  // enkelt er langt under det snaevre (IP, email)-loft (10, samme email
  // optraeder jo kun ÉN gang), men de deler alle det IP-ALENE loft.
  for (let i = 0; i < 300; i++) {
    const req = reqFor(i);
    assert.equal(limiter.check(req), null, `forsoeg ${i + 1} skal stadig vaere tilladt (under det hoeje IP-loft)`);
    limiter.consume(req);
  }

  // Det 301. forsoeg — igen mod en HELT NY email, samme IP — rammer nu det
  // hoeje IP-alene-loft.
  const sidsteReq = reqFor(300);
  const retryAfterSec = limiter.check(sidsteReq);
  assert.notEqual(retryAfterSec, null, 'det 301. forsoeg paa tvaers af 301 forskellige emails skal rammes af IP-loftet');

  // Kontrol: en HELT ANDEN IP er upaavirket af dette — samme lave email-tal
  // ville ikke engang vaere taet paa noget loft.
  const andenIpReq = { headers: { 'x-client-ip': '203.0.113.201' }, body: { email: 'mange-emails-0@example.dk' } };
  assert.equal(limiter.check(andenIpReq), null);
});
