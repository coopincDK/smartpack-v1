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

test('PUT /me/subs sætter den VARIGE tilmelding, giver IKKE liv, og logger bekraeftet/trukket_tilbage', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

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
