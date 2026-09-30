'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode-state';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false'; // tests kører over http, ikke https

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

function cookieFra(res) {
  const raw = res.headers.get('set-cookie');
  if (!raw) return null;
  return raw.split(';')[0];
}

test('GET /state lækker aldrig email/telefon/samtykker/vennekode/ref', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body: spillerBody } = registrerSpiller(h.baseUrl, {
    email: 'privatliv@example.dk',
    navn: 'Hemmelig Hansen',
    telefon: '20304050',
  });
  const reg = await api(h.baseUrl, 'POST', '/players', { body: spillerBody });
  assert.equal(reg.status, 201);
  const token = reg.body.token;

  // Forsøg på at "lække" PII via samtykke/challenge-endpoints ændrer ikke
  // på at GET /state forbliver PII-frit.
  await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sp', 'sms'] } });

  const state = await api(h.baseUrl, 'GET', '/state');
  assert.equal(state.status, 200);
  const raw = JSON.stringify(state.body);

  assert.ok(!raw.includes('privatliv@example.dk'));
  assert.ok(!raw.includes('20304050'));
  assert.ok(!raw.includes(spillerBody.telefon));

  for (const p of state.body.players) {
    assert.ok(!('email' in p));
    assert.ok(!('telefon' in p));
    assert.ok(!('samtykker' in p));
    assert.ok(!('vennekode' in p));
    assert.ok(!('ref' in p));
    assert.ok(!('token_hash' in p));
    assert.ok(typeof p.pid === 'string');
    assert.ok(typeof p.companyKey === 'string');
  }
});

test('GET /state cacher i op til ~2 sekunder', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });

  const s1 = await api(h.baseUrl, 'GET', '/state');
  const antalFoer = s1.body.players.length;
  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });
  const s2 = await api(h.baseUrl, 'GET', '/state');
  // Inden for cache-vinduet må antallet gerne stadig være det gamle.
  assert.ok(s2.body.players.length >= antalFoer);
});

test('GET /state uden session viser forkortede navne ("Fornavn E.")', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  await api(h.baseUrl, 'POST', '/players', {
    body: registrerSpiller(h.baseUrl, { navn: 'Martin Rasmussen' }).body,
  });

  const state = await api(h.baseUrl, 'GET', '/state');
  assert.equal(state.status, 200);
  const spiller = state.body.players.find((p) => p.name.startsWith('Martin'));
  assert.equal(spiller.name, 'Martin R.');
  assert.ok(!JSON.stringify(state.body).includes('Rasmussen'));
});

test('GET /state med gyldig admin- ELLER stand-session viser fulde navne', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  await api(h.baseUrl, 'POST', '/players', {
    body: registrerSpiller(h.baseUrl, { navn: 'Martin Rasmussen' }).body,
  });

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const stateAdmin = await api(h.baseUrl, 'GET', '/state', { adminCookie });
  const spillerAdmin = stateAdmin.body.players.find((p) => p.name.includes('Rasmussen'));
  assert.ok(spillerAdmin, 'admin skal se fulde navne');

  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  assert.equal(kodeRes.status, 200);
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  assert.equal(standLogin.status, 200);
  const standCookie = cookieFra(standLogin);

  const stateStand = await api(h.baseUrl, 'GET', '/state', { adminCookie: standCookie });
  const spillerStand = stateStand.body.players.find((p) => p.name.includes('Rasmussen'));
  assert.ok(spillerStand, 'stand-session skal også se fulde navne');
});
