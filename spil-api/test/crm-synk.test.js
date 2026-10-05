'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { hashPassword } = require('../src/crypto');
process.env.ADMIN_PASSWORD_HASH = hashPassword('x-test-adgangskode');
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { synkOnce } = require('../src/crmSynk');

function fakeCrm(statusFn = () => 201) {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      kald.push({ url: req.url, body: JSON.parse(b || '{}') });
      res.writeHead(statusFn(), { 'content-type': 'application/json' });
      res.end('{}');
    });
  });
  return new Promise((r) => srv.listen(0, () => r({ srv, kald, url: `http://127.0.0.1:${srv.address().port}/api/v1/newsletter` })));
}

test('Packrush-spillernes ja og afmelding til SmartPack sendes til CRM én gang hver', async (t) => {
  let status = 503;
  const crm = await fakeCrm(() => status);
  process.env.SMARTPACK_CRM_URL = crm.url;
  delete process.env.SMARTPACK_CRM_KEY;
  const h = await startHarness();
  t.after(async () => { await h.teardown(); crm.srv.close(); delete process.env.SMARTPACK_CRM_KEY; delete process.env.SMARTPACK_CRM_URL; });

  const ja = registrerSpiller(h.baseUrl, { navn: 'Anna Andersen', email: 'anna@shop.dk', tilmeldinger: ['sp'] });
  const r1 = await api(h.baseUrl, 'POST', '/players', { body: ja.body });
  assert.ok([200, 201].includes(r1.status), JSON.stringify(r1.body));
  const nej = registrerSpiller(h.baseUrl, { navn: 'Bo Bech', email: 'bo@shop.dk', tilmeldinger: [] });
  await api(h.baseUrl, 'POST', '/players', { body: nej.body });

  // Uden nøgle: intet sendes
  assert.equal((await synkOnce(h.pool)).stop, 'ingen nøgle');
  assert.equal(crm.kald.length, 0);

  // CRM nede: stop, intet springes over
  process.env.SMARTPACK_CRM_KEY = 'spk_test';
  const nede = await synkOnce(h.pool);
  assert.match(nede.stop, /HTTP 503/);
  assert.equal(crm.kald.length, 1);

  // CRM oppe igen: Anna sendes
  status = 201;
  const ok = await synkOnce(h.pool);
  assert.equal(ok.sendt, 1);
  const k = crm.kald[crm.kald.length - 1];
  assert.equal(k.url, '/api/v1/newsletter');
  assert.equal(k.body.email, 'anna@shop.dk');
  assert.equal(k.body.source, 'packrush');
  assert.equal(k.body.newsletter, true);
  assert.match(k.body.consentText, /SmartPack må sende mig nyheder/);

  // Intet nyt: intet sendes igen
  const n = crm.kald.length;
  assert.equal((await synkOnce(h.pool)).behandlet, 0);
  assert.equal(crm.kald.length, n);

  // Anna afmelder sig i spillet -> unsubscribe
  const af = await api(h.baseUrl, 'DELETE', '/me/subs/sp', { token: r1.body.token });
  assert.equal(af.status, 200, JSON.stringify(af.body));
  await synkOnce(h.pool);
  const u = crm.kald[crm.kald.length - 1];
  assert.equal(u.url, '/api/v1/newsletter/unsubscribe');
  assert.equal(u.body.email, 'anna@shop.dk');
});
