'use strict';

process.env.RUNS_START_RATE_LIMIT_MS = '0';
const test = require('node:test');
const assert = require('node:assert/strict');
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { iTurnering } = require('../src/rules/turnering');

test('turneringsvindue: periodens dage kl. 8.00-16.30 dansk tid', () => {
  const cfg = { periodStart: '2026-10-08', periodEnd: '2026-10-08' };
  assert.equal(iTurnering(cfg, new Date('2026-10-08T07:59:00+02:00')), false);
  assert.equal(iTurnering(cfg, new Date('2026-10-08T08:00:00+02:00')), true);
  assert.equal(iTurnering(cfg, new Date('2026-10-08T16:29:00+02:00')), true);
  assert.equal(iTurnering(cfg, new Date('2026-10-08T16:30:00+02:00')), false);
  assert.equal(iTurnering(cfg, new Date('2026-10-09T10:00:00+02:00')), false);
});

const STATS = { orders: 6, errors: 1, fast: 2.1, packed: 49, perfects: 2, streak: 2, tower: 12, combo: 14, sent: 50, rets: 10, strikes: 0, pus: 2, partners: 2 };
async function spil(h, token, bf) {
  const start = await api(h.baseUrl, 'POST', '/runs', { token });
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '100 seconds' WHERE runde_id = $1`, [start.body.runde_id]);
  return api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, { token, body: { rounds: [1194, 3276, 3518], s: STATS, bf, duel: null, spilletid_klient_ms: 99000 } });
}

test('Black Friday uden for turneringen: én om dagen, ubegrænset med SmartPacks nyhedsmail', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await h.pool.query(`UPDATE config SET offentlig = offentlig || '{"periodStart":"2000-01-01","periodEnd":"2000-01-01","perDay":5}'::jsonb WHERE id = 1`);
  const a = registrerSpiller(h.baseUrl, { tilmeldinger: [] }).body;
  const ta = (await api(h.baseUrl, 'POST', '/players', { body: a })).body.token;
  assert.equal((await spil(h, ta, true)).status, 200);
  const anden = await spil(h, ta, true);
  assert.equal(anden.status, 400); assert.equal(anden.body.aarsag, 'bf_brugt');
  const b = registrerSpiller(h.baseUrl, { tilmeldinger: ['sp'] }).body;
  const tb = (await api(h.baseUrl, 'POST', '/players', { body: b })).body.token;
  assert.equal((await spil(h, tb, true)).status, 200);
  assert.equal((await spil(h, tb, true)).status, 200, 'nyhedsmail giver ubegrænset uden for turneringen');
});
