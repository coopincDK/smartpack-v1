'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');
const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

async function spiller(h, email, firma) {
  const { body } = registrerSpiller(h.baseUrl, { email, firma });
  const r = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  return (await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email])).rows[0].id;
}
async function spil(h, id, samlet, slut) {
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet)
     VALUES ($1, gen_random_uuid(), $2::timestamptz - interval '2 minutes', $2, $3, 'godkendt', $2)`,
    [id, slut, samlet]
  );
}

test('efterårsferie: 1 lod pr. spil (højst 5 pr. dag), messe-firmaer først efter turneringen, adskilt fra messen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const { matchNoegle } = require('../src/konkurrence');
  await h.pool.query("INSERT INTO deltagerliste_firma (firma, firma_noegle, kilde) VALUES ('Messe Shop', $1, 'test') ON CONFLICT DO NOTHING", [matchNoegle('Messe Shop')]);

  const ude = await spiller(h, 'ude@x.dk', 'Ude ApS');
  const messe = await spiller(h, 'messe@x.dk', 'Messe Shop');
  const sp = await spiller(h, 'ansat@smartpack.dk', 'SmartPack');

  // Udenfor: før start (tæller ikke), 2 spil samme dag (1 lod), en anden dag (1 lod), efter slut (tæller ikke)
  await spil(h, ude, 900, '2026-10-05T12:00:00+02:00');
  await spil(h, ude, 1000, '2026-10-06T10:00:00+02:00');
  await spil(h, ude, 1500, '2026-10-06T23:30:00+02:00');
  await spil(h, ude, 1200, '2026-10-08T12:00:00+02:00');
  await spil(h, ude, 9999, '2026-10-19T00:30:00+02:00');
  // Messe-firma: under turneringen (tæller ikke her), efter 16.30 samme dag (1 lod)
  await spil(h, messe, 5000, '2026-10-08T12:00:00+02:00');
  await spil(h, messe, 1300, '2026-10-08T17:00:00+02:00');
  // SmartPack (udelukket): kun efter turneringen
  await spil(h, sp, 4000, '2026-10-07T10:00:00+02:00');

  // Loft: 7 spil samme dag giver højst 5 lodder
  const mange = await spiller(h, 'mange@x.dk', 'Mange ApS');
  for (let i = 0; i < 7; i++) await spil(h, mange, 100 + i, `2026-10-10T1${i}:00:00+02:00`);
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const r = await api(h.baseUrl, 'GET', '/admin/efteraar', { adminCookie: ac });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  const by = Object.fromEntries(r.body.spillere.map((p) => [p.email, p]));
  assert.equal(by['ude@x.dk'].lodder, 3, '2 spil 6/10 + 1 spil 8/10');
  assert.equal(by['ude@x.dk'].bedste, 1500);
  assert.equal(by['messe@x.dk'].lodder, 1);
  assert.equal(by['messe@x.dk'].bedste, 1300, 'messe-spillet kl. 12 tæller ikke');
  assert.equal(by['ansat@smartpack.dk'], undefined, 'SmartPack før turneringen tæller ikke');
  assert.equal(r.body.lodder_i_alt, 9);
  assert.equal(r.body.top[0].email, 'ude@x.dk');
  assert.equal(by['mange@x.dk'].lodder, 5, 'loft på 5 pr. dag');

  const pub = await api(h.baseUrl, 'GET', '/efteraar');
  assert.equal(pub.status, 200);
  assert.equal(pub.body.spillere, 3);
  assert.equal(JSON.stringify(pub.body).includes('@'), false, 'ingen mails offentligt');

  const v1 = await api(h.baseUrl, 'POST', '/admin/efteraar/traek', { adminCookie: ac, body: { type: 'lod' } });
  assert.equal(v1.status, 200); assert.equal(v1.body.praemie, '2 flasker');
  const v2 = await api(h.baseUrl, 'POST', '/admin/efteraar/traek', { adminCookie: ac, body: { type: 'lod' } });
  assert.equal(v2.status, 200); assert.equal(v2.body.praemie, '1 flaske');
  assert.notEqual(v1.body.vinder.email, v2.body.vinder.email, 'samme person kan ikke vinde begge');
  const v3 = await api(h.baseUrl, 'POST', '/admin/efteraar/traek', { adminCookie: ac, body: { type: 'lod' } });
  assert.equal(v3.status, 400, 'højst to vindere');
  const log = (await h.pool.query('SELECT count(*)::int n FROM efteraar_traekning')).rows[0].n;
  assert.equal(log, 2);

  // Messe-turneringens lodder er upåvirkede: ingen konkurrence_traekning oprettet
  const k = (await h.pool.query('SELECT count(*)::int n FROM konkurrence_traekning')).rows[0].n;
  assert.equal(k, 0);
});
