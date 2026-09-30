'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false'; // tests kører over http, ikke https

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

function cookieFra(res) {
  const raw = res.headers.get('set-cookie');
  if (!raw) return null;
  return raw.split(';')[0];
}

test('admin-endpoints kræver session', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const uden = await api(h.baseUrl, 'GET', '/admin/spillere');
  assert.equal(uden.status, 401);

  const forkertLogin = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: 'forkert' } });
  assert.equal(forkertLogin.status, 401);
});

test('admin-login med korrekt adgangskode giver adgang til beskyttede endpoints', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  assert.equal(login.status, 200);
  const cookie = cookieFra(login);
  assert.ok(cookie);

  const spillere = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie: cookie });
  assert.equal(spillere.status, 200);
  assert.ok(Array.isArray(spillere.body.spillere));

  const cfg = await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: cookie });
  assert.equal(cfg.status, 200);
  assert.ok('pin' in cfg.body.hemmelig);

  const boost = await api(h.baseUrl, 'GET', '/admin/boostkode', { adminCookie: cookie });
  assert.equal(boost.status, 200);
  assert.equal(boost.body.kode.length, 4);
});

test('stand-login-flow: admin udsteder ét-gangs-kode, standtablet bytter den til en stand-session', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  assert.equal(kodeRes.status, 200);
  assert.ok(kodeRes.body.kode);

  // Uden admin-cookie kræves der (bevidst) ingen — koden selv er beviset.
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  assert.equal(standLogin.status, 200);
  const standCookie = cookieFra(standLogin);
  assert.ok(standCookie);

  // Koden er ét-gangs — samme kode igen fejler.
  const igen = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  assert.equal(igen.status, 400);
  assert.equal(igen.body.kode, 'ugyldig_kode');

  // En stand-session giver IKKE adgang til rigtige admin-only endpoints
  // (fx spillerliste/CSV/sletning) — kun ret til at se fulde navne.
  const spillereSomStand = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie: standCookie });
  assert.equal(spillereSomStand.status, 403);
  assert.equal(spillereSomStand.body.kode, 'kraever_admin');

  const csvSomStand = await api(h.baseUrl, 'GET', '/admin/eksport/spillere.csv', { adminCookie: standCookie });
  assert.equal(csvSomStand.status, 403);

  // ...men en RIGTIG admin-session virker stadig upåvirket.
  const spillereSomAdmin = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillereSomAdmin.status, 200);
});

test('ugyldig/udløbet stand-login-kode afvises', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const res = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: 'XXXXXX' } });
  assert.equal(res.status, 400);
  assert.equal(res.body.kode, 'ugyldig_kode');
});

test('admin-logout ugyldiggør sessionen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const cookie = cookieFra(login);

  const logud = await api(h.baseUrl, 'POST', '/admin/logout', { adminCookie: cookie });
  assert.equal(logud.status, 200);

  const efter = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie: cookie });
  assert.equal(efter.status, 401);
});

test('DELETE /admin/spillere/:pid sletter spilleren og anonymiserer rest-referencer i andre spilleres data', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const { body: sletBody } = registrerSpiller(h.baseUrl, { navn: 'Slettes Snart' });
  const sletReg = await api(h.baseUrl, 'POST', '/players', { body: sletBody });
  const sletPid = sletReg.body.spiller.pid;

  const { body: overleverBody } = registrerSpiller(h.baseUrl, { navn: 'Overlever Olsen' });
  const overleverReg = await api(h.baseUrl, 'POST', '/players', { body: overleverBody });
  const overleverId = (
    await h.pool.query('SELECT id FROM spiller WHERE public_id = $1', [overleverReg.body.spiller.pid])
  ).rows[0].id;

  await h.pool.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'beaten', $2::jsonb)`, [
    overleverId,
    JSON.stringify({ by: 'Slettes Snart', score: 500 }),
  ]);

  const slet = await api(h.baseUrl, 'DELETE', `/admin/spillere/${sletPid}`, { adminCookie });
  assert.equal(slet.status, 200);

  const spillereEfter = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.ok(!spillereEfter.body.spillere.some((s) => s.pid === sletPid));

  const notif = await h.pool.query('SELECT data FROM notifikation WHERE spiller_id = $1', [overleverId]);
  assert.equal(notif.rows[0].data.by, 'Slettet spiller');

  const igen = await api(h.baseUrl, 'DELETE', `/admin/spillere/${sletPid}`, { adminCookie });
  assert.equal(igen.status, 404);
});

test('POST /admin/afmeld logger trukket_tilbage for fundne emails og rapporterer fundet/ikke_fundet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const { body } = registrerSpiller(h.baseUrl, { email: 'afmeld@example.dk', tilmeldinger: ['sms'] });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  const token = reg.body.token;

  const foer = await api(h.baseUrl, 'GET', '/me', { token });
  assert.ok(foer.body.mine_noegler.includes('sms'));

  const res = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie,
    body: { liste: 'sms', emails: ['afmeld@example.dk', 'ukendt@example.dk'] },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.fundet, 1);
  assert.deepEqual(res.body.ikke_fundet, ['ukendt@example.dk']);

  const efter = await api(h.baseUrl, 'GET', '/me', { token });
  assert.ok(!efter.body.mine_noegler.includes('sms'));
  const smsStatus = efter.body.samtykker.find((s) => s.liste === 'sms');
  assert.equal(smsStatus.aktiv, false);
  assert.equal(smsStatus.seneste_haendelse.type, 'trukket_tilbage');
});

test('POST /admin/afmeld kræver admin-session (ikke stand), og en ukendt liste afvises', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const ukendt = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie,
    body: { liste: 'ikke-en-liste', emails: ['x@example.dk'] },
  });
  assert.equal(ukendt.status, 400);
  assert.equal(ukendt.body.kode, 'ukendt_liste');

  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);

  const somStand = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie: standCookie,
    body: { liste: 'sms', emails: ['x@example.dk'] },
  });
  assert.equal(somStand.status, 403);
});

test('POST /admin/nulstil kræver PRÆCIS bekræftelsesstrengen, tager en backup FØR sletning, sletter alt og logger en audit-række', async (t) => {
  const kald = [];
  const stubBackup = async () => {
    kald.push(Date.now());
    return '/var/backups/spil-api/nulstil-test.sql';
  };
  const h = await startHarness({ adminRouterOpts: { runBackup: stubBackup } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });
  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });

  const forkert = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'ja tak' } });
  assert.equal(forkert.status, 400);
  assert.equal(forkert.body.kode, 'mangler_bekraeftelse');
  assert.equal(kald.length, 0, 'backuppen må IKKE tages hvis bekræftelsen er forkert');

  const spillereFoer = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillereFoer.body.spillere.length, 2);

  const res = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'NULSTIL' } });
  assert.equal(res.status, 200);
  assert.equal(res.body.antal_slettet, 2);
  assert.equal(kald.length, 1, 'backuppen skal tages nøjagtig én gang, FØR sletningen');

  const spillereEfter = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillereEfter.body.spillere.length, 0);

  const audit = await h.pool.query('SELECT handling, antal, admin_session_id FROM admin_audit_log');
  assert.equal(audit.rows.length, 1);
  assert.equal(audit.rows[0].handling, 'nulstil');
  assert.equal(Number(audit.rows[0].antal), 2);
  assert.ok(audit.rows[0].admin_session_id, 'skal logge HVILKEN admin-session der udførte nulstillingen');
});

test('POST /admin/nulstil afbrydes helt hvis backuppen fejler — ingen spillere slettes', async (t) => {
  const failingBackup = async () => {
    throw new Error('pg_dump utilgængelig i test');
  };
  const h = await startHarness({ adminRouterOpts: { runBackup: failingBackup } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });

  const res = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'NULSTIL' } });
  assert.equal(res.status, 500);

  const spillere = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillere.body.spillere.length, 1, 'ingen spillere må slettes hvis sikkerhedskopien fejlede');
});

test('POST /admin/nulstil kræver admin-session (ikke stand)', async (t) => {
  const h = await startHarness({ adminRouterOpts: { runBackup: async () => '/tmp/x.sql' } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);

  const res = await api(h.baseUrl, 'POST', '/admin/nulstil', {
    adminCookie: standCookie,
    body: { bekraeft: 'NULSTIL' },
  });
  assert.equal(res.status, 403);
});
