'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
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

test('login kræver at telefonnummeret matcher — afviser uden at overskrive', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'login@example.dk', telefon: '20304050' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);

  const forkert = await api(h.baseUrl, 'POST', '/players', {
    body: { ...body, telefon: '99999999' },
  });
  assert.equal(forkert.status, 400);
  assert.equal(forkert.body.kode, 'telefon_matcher_ikke');

  const korrekt = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(korrekt.status, 200);
  assert.equal(korrekt.body.type, 'login');
  assert.ok(korrekt.body.token);
  assert.notEqual(korrekt.body.token, reg.body.token); // token roteres ved login
});

test('unikt telefonnummer pr. spiller — dublet afvises', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body: b1 } = await registrerSpiller(h.baseUrl, { email: 'a@example.dk', telefon: '20304050' });
  await api(h.baseUrl, 'POST', '/players', { body: b1 });

  const { body: b2 } = await registrerSpiller(h.baseUrl, { email: 'b@example.dk', telefon: '20304050' });
  const res = await api(h.baseUrl, 'POST', '/players', { body: b2 });
  assert.equal(res.status, 400);
  assert.equal(res.body.kode, 'telefon_optaget');
});

test('PUT /me/subs bevarer samtykke-historik ved afmelding (trukket_tilbage sættes, intet slettes)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const s1 = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sp', 'sms'] } });
  assert.equal(s1.status, 200);
  assert.equal(s1.body.friske_liv, 1); // kun 'sms' giver liv

  const me1 = await api(h.baseUrl, 'GET', '/me', { token });
  const smsAktiv = me1.body.samtykker.filter((s) => s.liste === 'sms' && !s.trukket_tilbage);
  assert.equal(smsAktiv.length, 1);

  const s2 = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: [] } });
  assert.equal(s2.status, 200);

  const me2 = await api(h.baseUrl, 'GET', '/me', { token });
  const smsRækker = me2.body.samtykker.filter((s) => s.liste === 'sms');
  assert.equal(smsRækker.length, 1); // ingen ny række, samme række opdateret
  assert.ok(smsRækker[0].trukket_tilbage, 'skal have trukket_tilbage sat');

  // Gentilmelding opretter en NY aktiv række (historik bevares).
  const s3 = await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms'] } });
  assert.equal(s3.status, 200);
  const me3 = await api(h.baseUrl, 'GET', '/me', { token });
  const smsRækkerEfter = me3.body.samtykker.filter((s) => s.liste === 'sms');
  assert.equal(smsRækkerEfter.length, 2);
  assert.equal(smsRækkerEfter.filter((s) => !s.trukket_tilbage).length, 1);
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

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const cfgRes = await h.pool.query('SELECT hemmelig FROM config WHERE id = 1');
  const pin = cfgRes.rows[0].hemmelig.pin;
  const kode = boostCode(todayStr(new Date()), pin);

  // Uden sms-tilmelding: afvist.
  const forInden = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: kode } });
  assert.equal(forInden.status, 400);
  assert.equal(forInden.body.kode, 'ikke_tilmeldt_sms');

  await api(h.baseUrl, 'PUT', '/me/subs', { token, body: { keys: ['sms'] } });

  const forkert = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: 'XXXX' } });
  assert.equal(forkert.status, 400);
  assert.equal(forkert.body.kode, 'forkert_kode');

  const meFoer = await api(h.baseUrl, 'GET', '/me', { token });
  const korrekt = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: kode } });
  assert.equal(korrekt.status, 200);
  assert.equal(korrekt.body.liv.n, meFoer.body.liv.n + 2);

  const igen = await api(h.baseUrl, 'POST', '/me/boost', { token, body: { code: kode } });
  assert.equal(igen.status, 400);
  assert.equal(igen.body.kode, 'allerede_brugt');
});
