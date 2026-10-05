'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api } = require('./helpers/appHarness');

function fakeCrm(status = 201) {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      kald.push({ auth: req.headers.authorization, body: JSON.parse(b || '{}') });
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(status < 300 ? '{"data":{"created":true}}' : '{"error":"Ugyldig e-mail"}');
    });
  });
  return new Promise((r) => srv.listen(0, () => r({ srv, kald, url: `http://127.0.0.1:${srv.address().port}/api/v1/newsletter` })));
}
const vent = (ms) => new Promise((r) => setTimeout(r, ms));

test('kampagnetilmelding sendes til CRM med kilde, notater og samtykketekst', async (t) => {
  const crm = await fakeCrm();
  process.env.SMARTPACK_CRM_URL = crm.url;
  process.env.SMARTPACK_CRM_KEY = 'spk_test';
  const h = await startHarness();
  t.after(async () => { await h.teardown(); crm.srv.close(); delete process.env.SMARTPACK_CRM_KEY; delete process.env.SMARTPACK_CRM_URL; });

  const r = await api(h.baseUrl, 'POST', '/kampagne/tilmeld', {
    body: { navn: 'Anna', klub: 'AGF', firma: 'MinShop', email: 'anna@minshop.dk', telefon: '12345678', nyhedsbrev: true, kilde: 'digiday' },
  });
  assert.equal(r.status, 201);
  await vent(400);
  assert.equal(crm.kald.length, 1);
  const k = crm.kald[0];
  assert.equal(k.auth, 'Bearer spk_test');
  assert.equal(k.body.source, 'digiday');
  assert.equal(k.body.newsletter, true);
  assert.match(k.body.consentText, /Ja tak til SmartPacks mailliste/);
  assert.equal(k.body.notes.klub, undefined);
  assert.equal(k.body.phone, undefined);
  const row = (await h.pool.query('SELECT crm_sendt, crm_fejl FROM kampagne_tilmelding')).rows[0];
  assert.ok(row.crm_sendt);
  assert.equal(row.crm_fejl, null);

  // Uden flueben sendes intet til CRM'et (H4)
  await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Bo', firma: 'X', email: 'bo@x.dk' } });
  await vent(400);
  assert.equal(crm.kald.length, 1);
});

test('uden nøgle markeres rækken, og admin kan sende de manglende bagefter', async (t) => {
  const crm = await fakeCrm();
  process.env.SMARTPACK_CRM_URL = crm.url;
  delete process.env.SMARTPACK_CRM_KEY;
  const h = await startHarness();
  t.after(async () => { await h.teardown(); crm.srv.close(); delete process.env.SMARTPACK_CRM_KEY; delete process.env.SMARTPACK_CRM_URL; });

  await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'C', firma: 'Y', email: 'c@y.dk', nyhedsbrev: true } });
  await vent(300);
  assert.equal(crm.kald.length, 0);
  let row = (await h.pool.query('SELECT crm_sendt, crm_fejl FROM kampagne_tilmelding')).rows[0];
  assert.equal(row.crm_sendt, null);
  assert.equal(row.crm_fejl, 'ingen nøgle');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const l = await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027', { adminCookie: ac });
  assert.equal(l.body.crm_mangler, 1);

  process.env.SMARTPACK_CRM_KEY = 'spk_test';
  const s = await api(h.baseUrl, 'POST', '/admin/kampagne/ehandelsdagen-2027/crm-send', { adminCookie: ac });
  assert.equal(s.status, 200);
  assert.equal(s.body.sendt, 1);
  assert.equal(crm.kald.length, 1);
  row = (await h.pool.query('SELECT crm_sendt FROM kampagne_tilmelding')).rows[0];
  assert.ok(row.crm_sendt);
});
