'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');
const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';
const { startHarness, api } = require('./helpers/appHarness');

test('arrangementets hemmelige QR-kode bekræfter deltagelse, ugyldig kode gør ikke', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];

  const start = await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027/arrangementer', { adminCookie: ac });
  assert.equal(start.status, 200);
  assert.deepEqual(start.body.arrangementer.map((a) => a.kilde), ['ehandelskonferencen', 'ehandelsdagen']);
  assert.match(start.body.arrangementer[0].qr_svg, /<svg/);

  const idag = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Copenhagen' });
  const ny = await api(h.baseUrl, 'POST', '/admin/kampagne/ehandelsdagen-2027/arrangementer', { adminCookie: ac, body: { navn: 'Digi Day 2026', kilde: 'digiday', dato: idag } });
  assert.equal(ny.status, 201, JSON.stringify(ny.body));
  const liste = (await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027/arrangementer', { adminCookie: ac })).body.arrangementer;
  const digi = liste.find((a) => a.kilde === 'digiday');
  const kode = new URL(digi.link).searchParams.get('a');

  const ok = await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Anna', firma: 'Shop', email: 'anna@shop.dk', qr: kode } });
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  assert.equal(ok.body.bekraeftet, true);
  assert.equal(ok.body.arrangement, 'Digi Day 2026');

  const forkert = await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Bo', firma: 'X', email: 'bo@x.dk', qr: 'abcdef1234567890', kilde: 'digiday' } });
  assert.equal(forkert.status, 201);
  assert.equal(forkert.body.bekraeftet, false);

  // Konferencens kode virker ikke i dag (kun 8/10-2026)
  const konfKode = new URL(liste.find((a) => a.kilde === 'ehandelskonferencen').link).searchParams.get('a');
  const forTidligt = await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'C', firma: 'Y', email: 'c@y.dk', qr: konfKode } });
  assert.equal(forTidligt.body.bekraeftet, idag === '2026-10-08');

  // Gentilmelding uden kode fjerner ikke bekræftelsen
  await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Anna', firma: 'Shop', email: 'anna@shop.dk' } });
  const l = await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027', { adminCookie: ac });
  const anna = l.body.tilmeldinger.find((x) => x.email === 'anna@shop.dk');
  assert.equal(anna.bekraeftet, true);
  assert.equal(anna.arrangement, 'Digi Day 2026');
  // På konferencedagen bekræfter konferencens kode også "C" ovenfor.
  assert.equal(l.body.bekraeftede, idag === '2026-10-08' ? 2 : 1);
});
