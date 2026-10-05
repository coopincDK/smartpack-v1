'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { hashPassword } = require('../src/crypto');
process.env.ADMIN_PASSWORD_HASH = hashPassword('x-test-adgangskode');
process.env.COOKIE_SECURE = 'false';
const { startHarness, api } = require('./helpers/appHarness');

function fakeCrm() {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      kald.push({ url: req.url, auth: req.headers.authorization, body: JSON.parse(b || '{}') });
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end('{"data":{"id":"1"}}');
    });
  });
  return new Promise((r) => srv.listen(0, () => r({ srv, kald, url: `http://127.0.0.1:${srv.address().port}/api/v1/newsletter` })));
}

test('kontaktformularen sendes til CRM /contact-form med felter, nyhedsbrev og honeypot', async (t) => {
  const crm = await fakeCrm();
  process.env.SMARTPACK_CRM_URL = crm.url;
  process.env.SMARTPACK_CRM_KEY = 'spk_test';
  const h = await startHarness();
  t.after(async () => { await h.teardown(); crm.srv.close(); delete process.env.SMARTPACK_CRM_KEY; delete process.env.SMARTPACK_CRM_URL; });

  assert.equal((await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { name: 'A', email: 'nej' } })).status, 400);

  const r = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', {
    body: { type: 'learn', name: 'Jens Hansen', email: 'jens@firma.dk', company: 'Firma ApS', phone: '22334455', orders: '50-100', shops: ['Shopify', 'WooCommerce'], erp: ['e-conomic'], comment: 'Vil gerne høre om priser', newsletter: 'Ja', page: 'https://smartpack.dk/kontakt', _hp: '' },
  });
  assert.equal(r.status, 200);
  assert.equal(r.body.crm, true);
  const k = crm.kald[0];
  assert.equal(k.url, '/api/v1/contact-form');
  assert.equal(k.auth, 'Bearer spk_test');
  assert.equal(k.body.message, 'Vil gerne høre om priser');
  assert.equal(k.body.webshop, 'Shopify, WooCommerce');
  assert.equal(k.body.type, 'Lead');
  assert.equal(k.body.newsletter, true);
  assert.equal(k.body.consentText, 'Ja tak til praktiske tips om lager og logistik');
  assert.equal(k.body._hp, undefined);

  await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { type: 'support', name: 'B', email: 'b@x.dk', subject: 'Label', message: 'Printer driller', newsletter: 'Nej', _hp: 'spam' } });
  const k2 = crm.kald[1].body;
  assert.equal(k2.message, 'Label\n\nPrinter driller');
  assert.equal(k2.newsletter, undefined);
  assert.equal(k2._hp, 'spam');
});

test('uden nøgle svarer endpointet stadig ok, men crm:false', async (t) => {
  delete process.env.SMARTPACK_CRM_KEY;
  const h = await startHarness();
  t.after(() => h.teardown());
  const r = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { name: 'C', email: 'c@x.dk', message: 'hej' } });
  assert.equal(r.status, 200);
  assert.equal(r.body.crm, false);
});
