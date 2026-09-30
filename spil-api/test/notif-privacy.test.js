'use strict';

// Sikkerhedsgennemgang (Tredje opfølgende ændringsrunde): id-referencerne
// fra forrige runde (by_spiller_id/fra_spiller_id/vs_spiller_id) blev KUN
// brugt ved GDPR-anonymisering — selve læsevejen (GET /me, GET /state)
// returnerede stadig det rå, ufaskerede navn direkte. Se API.md, "Tredje
// opfølgende ændringsrunde", og src/routes/me.js#maskNotifikation.

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode-notif';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false'; // tests kører over http, ikke https

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

function cookieFra(res) {
  const raw = res.headers.get('set-cookie');
  if (!raw) return null;
  return raw.split(';')[0];
}

async function opretSpillerOgToken(h, overrides) {
  const { body } = await registrerSpiller(h.baseUrl, overrides);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  return { token: reg.body.token, pid: reg.body.spiller.pid, vennekode: reg.body.spiller.vennekode };
}

// Starter og fuldfører et forsøg der garanteret bliver GODKENDT (samme
// mønster som test/runs.test.js: start_server flyttes 80 sek. tilbage, så
// spilletid_klient_ms=81000 ligger over minimum og matcher server_elapsed).
async function fuldfoerGodkendtForsoeg(h, token, rounds, duel) {
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  assert.equal(start.status, 201);
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '80 seconds' WHERE runde_id = $1`, [
    start.body.runde_id,
  ]);
  const finish = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token,
    body: { rounds, s: {}, bf: false, duel: duel || null, spilletid_klient_ms: 81000 },
  });
  assert.equal(finish.status, 200);
  assert.equal(finish.body.godkendt, true, JSON.stringify(finish.body));
  return { rundeId: start.body.runde_id, finish: finish.body };
}

test('GET /me maskerer beaten-notifikationens data.by uden admin/stand-session, viser fuldt navn MED', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const a = await opretSpillerOgToken(h, { navn: 'Anna Andersen', email: 'anna-notif@example.dk', telefon: '20301001' });
  const b = await opretSpillerOgToken(h, { navn: 'Bo Hansen', email: 'bo-notif@example.dk', telefon: '20301002' });

  await fuldfoerGodkendtForsoeg(h, a.token, [10, 10, 10]); // A: 30 point
  await fuldfoerGodkendtForsoeg(h, b.token, [20, 20, 20]); // B: 60 point > A -> beaten-notif til A

  const uden = await api(h.baseUrl, 'GET', '/me', { token: a.token });
  assert.equal(uden.status, 200);
  const beaten = uden.body.notifikationer.find((n) => n.type === 'beaten');
  assert.ok(beaten, 'A skal have en beaten-notifikation');
  assert.equal(beaten.data.by, 'Bo H.', 'uden privilegeret session skal navnet være maskeret');
  assert.notEqual(beaten.data.by, 'Bo Hansen');
  assert.ok(!('by_spiller_id' in beaten.data), 'det interne id-felt må aldrig eksponeres i klientsvaret');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const medAdmin = await api(h.baseUrl, 'GET', '/me', { token: a.token, adminCookie });
  const beatenAdmin = medAdmin.body.notifikationer.find((n) => n.type === 'beaten');
  assert.equal(beatenAdmin.data.by, 'Bo Hansen', 'en gyldig admin-session skal se det fulde navn');

  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);
  const medStand = await api(h.baseUrl, 'GET', '/me', { token: a.token, adminCookie: standCookie });
  const beatenStand = medStand.body.notifikationer.find((n) => n.type === 'beaten');
  assert.equal(beatenStand.data.by, 'Bo Hansen', 'en gyldig stand-session skal også se det fulde navn');
});

test('GET /me maskerer gave-notifikationens data.fra (udfordring_liv) uden privilegie, viser fuldt navn med admin', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const a = await opretSpillerOgToken(h, {
    navn: 'Cecilie Christensen',
    email: 'cc-notif@example.dk',
    telefon: '20301003',
  });
  const b = await opretSpillerOgToken(h, { navn: 'Dan Dahl', email: 'dd-notif@example.dk', telefon: '20301004' });

  // A udfordrer B (bruger B's vennekode) — når A dernæst gennemfører sit
  // FØRSTE forsøg i dag, får B (koden-ejeren) en 'udfordring_liv'-gave med
  // data.fra = A.navn (se src/routes/runs.js's finish-flow, punkt 4).
  const challenge = await api(h.baseUrl, 'POST', '/me/challenge', { token: a.token, body: { code: b.vennekode } });
  assert.equal(challenge.status, 200);

  await fuldfoerGodkendtForsoeg(h, a.token, [10, 10, 10]);

  const uden = await api(h.baseUrl, 'GET', '/me', { token: b.token });
  const gave = uden.body.notifikationer.find((n) => n.type === 'gift' && n.data.type === 'udfordring_liv');
  assert.ok(gave, 'B skal have en udfordring_liv-gave-notifikation');
  assert.equal(gave.data.fra, 'Cecilie C.', 'uden privilegeret session skal navnet være maskeret');
  assert.ok(!('fra_spiller_id' in gave.data), 'det interne id-felt må aldrig eksponeres i klientsvaret');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const medAdmin = await api(h.baseUrl, 'GET', '/me', { token: b.token, adminCookie });
  const gaveAdmin = medAdmin.body.notifikationer.find((n) => n.type === 'gift' && n.data.type === 'udfordring_liv');
  assert.equal(gaveAdmin.data.fra, 'Cecilie Christensen', 'en gyldig admin-session skal se det fulde navn');
});

test('POST /me/challenge maskerer "udfordrer" uden admin/stand-session, viser fuldt navn med admin', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const a = await opretSpillerOgToken(h, { navn: 'Jens Jensen', email: 'jens-notif@example.dk', telefon: '20301011' });
  const b = await opretSpillerOgToken(h, { navn: 'Kirsten Kruse', email: 'kirsten-notif@example.dk', telefon: '20301012' });

  const uden = await api(h.baseUrl, 'POST', '/me/challenge', { token: a.token, body: { code: b.vennekode } });
  assert.equal(uden.status, 200);
  assert.equal(uden.body.udfordrer, 'Kirsten K.', 'uden privilegeret session skal navnet være maskeret');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const medAdmin = await api(h.baseUrl, 'POST', '/me/challenge', {
    token: a.token,
    adminCookie,
    body: { code: b.vennekode },
  });
  assert.equal(medAdmin.status, 200);
  assert.equal(medAdmin.body.udfordrer, 'Kirsten Kruse', 'en gyldig admin-session skal se det fulde navn');
});

test('en siden slettet spillers reference giver "Slettet spiller" uændret, både maskeret og fuld visning', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const a = await opretSpillerOgToken(h, {
    navn: 'Overlever Olsen',
    email: 'overlever-notif@example.dk',
    telefon: '20301005',
  });
  const b = await opretSpillerOgToken(h, { navn: 'Slettes Snart', email: 'slettes-notif@example.dk', telefon: '20301006' });

  await fuldfoerGodkendtForsoeg(h, a.token, [10, 10, 10]);
  await fuldfoerGodkendtForsoeg(h, b.token, [20, 20, 20]); // beaten-notif til A med by=Slettes Snart

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const slet = await api(h.baseUrl, 'DELETE', `/admin/spillere/${b.pid}`, { adminCookie });
  assert.equal(slet.status, 200);

  const uden = await api(h.baseUrl, 'GET', '/me', { token: a.token });
  const beaten = uden.body.notifikationer.find((n) => n.type === 'beaten');
  assert.equal(
    beaten.data.by,
    'Slettet spiller',
    'sentinel-værdien skal vises uændret, ikke maskeres videre til "Slettet s."'
  );

  const medAdmin = await api(h.baseUrl, 'GET', '/me', { token: a.token, adminCookie });
  const beatenAdmin = medAdmin.body.notifikationer.find((n) => n.type === 'beaten');
  assert.equal(beatenAdmin.data.by, 'Slettet spiller', 'også uændret ved fuld/privilegeret visning');
});

test('forsoeg.duel.vs kan ikke forfalskes: kendt vsId overskriver med modstanderens RIGTIGE navn', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const a = await opretSpillerOgToken(h, { navn: 'Frida Friis', email: 'frida-notif@example.dk', telefon: '20301007' });
  const b = await opretSpillerOgToken(h, { navn: 'Georg Groth', email: 'georg-notif@example.dk', telefon: '20301008' });

  const { rundeId } = await fuldfoerGodkendtForsoeg(h, a.token, [10, 10, 10], {
    vs: 'Falsk Modstander',
    vsId: b.pid,
  });

  const raa = await h.pool.query(`SELECT duel FROM forsoeg WHERE runde_id = $1`, [rundeId]);
  assert.equal(
    raa.rows[0].duel.vs,
    'Georg Groth',
    'snapshottet skal overskrives med modstanderens RIGTIGE navn, ikke klientens forfalskede tekst'
  );
  const bId = (await h.pool.query('SELECT id FROM spiller WHERE public_id = $1', [b.pid])).rows[0].id;
  assert.equal(raa.rows[0].duel.vs_spiller_id, bId);

  const state = await api(h.baseUrl, 'GET', '/state');
  const spillerA = state.body.players.find((p) => p.pid === a.pid);
  const duelAttempt = spillerA.attempts.find((att) => att.duel);
  assert.ok(duelAttempt, 'A skal have et forsøg med duel-info i GET /state');
  assert.equal(
    duelAttempt.duel.vs,
    'Georg G.',
    'GET /state skal vise modstanderens RIGTIGE (maskerede) navn, aldrig klientens forfalskede tekst'
  );
});

test('GET /state viser "Slettet spiller" uændret for en duel-modstander der siden er slettet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const a = await opretSpillerOgToken(h, { navn: 'Helle Holm', email: 'helle-notif@example.dk', telefon: '20301009' });
  const b = await opretSpillerOgToken(h, { navn: 'Ib Iversen', email: 'ib-notif@example.dk', telefon: '20301010' });

  await fuldfoerGodkendtForsoeg(h, a.token, [10, 10, 10], { vs: 'Ib Iversen', vsId: b.pid });

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const slet = await api(h.baseUrl, 'DELETE', `/admin/spillere/${b.pid}`, { adminCookie });
  assert.equal(slet.status, 200);

  const state = await api(h.baseUrl, 'GET', '/state');
  const spillerA = state.body.players.find((p) => p.pid === a.pid);
  const duelAttempt = spillerA.attempts.find((att) => att.duel);
  assert.equal(
    duelAttempt.duel.vs,
    'Slettet spiller',
    'skal vises uændret, ikke maskeres videre til det vildledende "Slettet s."'
  );
});
