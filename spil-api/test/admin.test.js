'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false'; // tests kører over http, ikke https

const { startHarness, api } = require('./helpers/appHarness');

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
