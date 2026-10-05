'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

async function adminCookie(h) {
  const r = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  return (r.headers.get('set-cookie') || '').split(';')[0];
}

test('kampagnetilmelding: 10 lodder + Packrush-lodder oveni, gentilmelding samler kilder', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  // Mangler felter
  assert.equal((await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'A', email: 'x@y.dk' } })).status, 400);
  assert.equal((await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'A', firma: 'F', email: 'nej' } })).status, 400);
  assert.equal((await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { kampagne: 'findes-ikke', navn: 'A', firma: 'F', email: 'a@b.dk' } })).status, 400);

  const r1 = await api(h.baseUrl, 'POST', '/kampagne/tilmeld', {
    body: { navn: 'Anna', klub: 'Grenaa IF', firma: 'MinShop ApS', email: 'anna@minshop.dk', telefon: '12345678', nyhedsbrev: 'ja', kilde: 'ehandelskonferencen' },
  });
  assert.equal(r1.status, 201, JSON.stringify(r1.body));
  assert.equal(r1.body.lodder_basis, 10);

  await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Bo', firma: 'Andet Firma', email: 'bo@andet.dk' } });

  // Anna spiller Packrush med samme mail i konferencens periode: 2986 point = 6 lodder oveni
  const { body } = registrerSpiller(h.baseUrl, { email: 'anna@minshop.dk', firma: 'minshop.dk' });
  assert.equal((await api(h.baseUrl, 'POST', '/players', { body })).status, 201);
  const sid = (await h.pool.query('SELECT id FROM spiller WHERE email = $1', ['anna@minshop.dk'])).rows[0].id;
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet)
     VALUES ($1, gen_random_uuid(), '2026-10-08 11:58:00+02', '2026-10-08 12:00:00+02', 2986, 'godkendt', '2026-10-08 12:00:00+02')`,
    [sid]
  );

  // Gentilmelding fra Digi Day: én række, to kilder, mailliste bevares
  await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Anna A.', firma: 'MinShop ApS', email: 'ANNA@minshop.dk', kilde: 'digiday' } });

  assert.equal((await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027')).status, 401);
  const l = await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027', { adminCookie: ac });
  assert.equal(l.status, 200);
  assert.equal(l.body.antal, 2);
  const anna = l.body.tilmeldinger.find((x) => x.email.toLowerCase() === 'anna@minshop.dk');
  assert.deepEqual(anna.kilder, ['ehandelskonferencen', 'digiday']);
  assert.equal(anna.nyhedsbrev, true);
  assert.equal(anna.klub, 'Grenaa IF');
  assert.equal(anna.har_spillet, true);
  assert.equal(anna.lodder_spil, 6);
  assert.equal(anna.lodder, 16);
  const bo = l.body.tilmeldinger.find((x) => x.navn === 'Bo');
  assert.equal(bo.har_spillet, false);
  assert.equal(bo.lodder, 10);
  assert.equal(l.body.lodder_i_alt, 26);
  assert.equal(l.body.mailliste, 1);

  const csv = await fetch(h.baseUrl + '/admin/kampagne/ehandelsdagen-2027.csv', { headers: { cookie: ac } });
  assert.equal(csv.status, 200);
  const txt = await csv.text();
  assert.match(txt, /navn;klub;firma;email/);
  assert.match(txt, /ehandelskonferencen \+ digiday/);
  assert.equal((await api(h.baseUrl, 'GET', '/admin/kampagne/findes-ikke', { adminCookie: ac })).status, 404);
});
