'use strict';

process.env.RUNS_START_RATE_LIMIT_MS = '0';
const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');
const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

test('VAR: automatiseret spil sættes på pause, spilleren anmoder, admin godkender', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const { body } = registrerSpiller(h.baseUrl, { navn: 'Bot Botsen' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '160 seconds' WHERE runde_id = $1`, [start.body.runde_id]);
  const fin = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token,
    body: { rounds: [4076, 17057, 1927], s: { orders: 27, errors: 0, fast: 0.5, packed: 52, perfects: 52, streak: 52, tower: 52, combo: 129, sent: 48, rets: 14, strikes: 0, pus: 1, partners: 3 }, bf: false, duel: null, spilletid_klient_ms: 158000 },
  });
  assert.equal(fin.status, 400, JSON.stringify(fin.body));
  assert.equal(fin.body.aarsag, 'var');
  assert.ok(fin.body.grunde.some((g) => /52 perfekte/.test(g)));
  const st = (await h.pool.query('SELECT status, var_status FROM forsoeg WHERE runde_id = $1', [start.body.runde_id])).rows[0];
  assert.deepEqual(st, { status: 'var', var_status: 'flag' });

  // Ikke på tavlen
  const state = await api(h.baseUrl, 'GET', '/state');
  const bot = Object.values(state.body.players || {}).find((p) => p.name && /Bot/.test(p.name));
  assert.ok(!bot || !(bot.attempts || []).some((a) => a.score === 23060), 'VAR-spil vises ikke');

  const anm = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/var`, { token, body: { besked: 'Jeg er bare god' } });
  assert.equal(anm.status, 200);

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const liste = await api(h.baseUrl, 'GET', '/admin/var', { adminCookie: ac });
  assert.equal(liste.body.var[0].var_status, 'anmodet');
  assert.equal(liste.body.var[0].var_besked, 'Jeg er bare god');
  const ok = await api(h.baseUrl, 'POST', `/admin/var/${liste.body.var[0].id}`, { adminCookie: ac, body: { godkend: true } });
  assert.equal(ok.status, 200);
  const efter = (await h.pool.query('SELECT status, var_status FROM forsoeg WHERE runde_id = $1', [start.body.runde_id])).rows[0];
  assert.deepEqual(efter, { status: 'godkendt', var_status: 'godkendt' });
  const igen = await api(h.baseUrl, 'POST', `/admin/var/${liste.body.var[0].id}`, { adminCookie: ac, body: { godkend: false } });
  assert.equal(igen.status, 404, 'kan ikke afgøres to gange');
});

test('VAR: et normalt menneskeligt spil går igennem', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const { body } = registrerSpiller(h.baseUrl);
  const token = (await api(h.baseUrl, 'POST', '/players', { body })).body.token;
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '100 seconds' WHERE runde_id = $1`, [start.body.runde_id]);
  const fin = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token, body: { rounds: [1194, 3276, 3518], s: { orders: 6, errors: 1, fast: 2.1, packed: 49, perfects: 2, streak: 2, tower: 12, combo: 14, sent: 50, rets: 10, strikes: 0, pus: 2, partners: 2 }, bf: true, duel: null, spilletid_klient_ms: 99000 },
  });
  assert.equal(fin.status, 200, JSON.stringify(fin.body));
  assert.equal(fin.body.godkendt, true);
});
