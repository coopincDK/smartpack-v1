'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { hashPassword } = require('../src/crypto');
process.env.ADMIN_PASSWORD_HASH = hashPassword('x-test-adgangskode');
process.env.COOKIE_SECURE = 'false';
const { startHarness, api } = require('./helpers/appHarness');

test('partneransøgning sendes til CRM-indbakken', async (t) => {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = ''; req.on('data', (c) => (b += c));
    req.on('end', () => { kald.push({ url: req.url, body: JSON.parse(b || '{}') }); res.writeHead(201, { 'content-type': 'application/json' }); res.end('{}'); });
  });
  await new Promise((r) => srv.listen(0, r));
  process.env.SMARTPACK_CRM_URL = `http://127.0.0.1:${srv.address().port}/api/v1/newsletter`;
  process.env.SMARTPACK_CRM_KEY = 'spk_test';
  const h = await startHarness();
  t.after(async () => { await h.teardown(); srv.close(); delete process.env.SMARTPACK_CRM_KEY; delete process.env.SMARTPACK_CRM_URL; });

  const r = await api(h.baseUrl, 'POST', '/partnere/ansoeg', {
    body: { firmanavn: 'Ny Partner ApS', kontakt_navn: 'Lone', kontakt_email: 'lone@ny.dk', kontakt_telefon: '12345678', hjemmeside: 'https://ny.dk', kort_beskrivelse: 'Fragtsoftware', besked: 'Vi vil gerne være med' },
  });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  await new Promise((x) => setTimeout(x, 400));
  assert.equal(kald.length, 1);
  assert.equal(kald[0].url, '/api/v1/contact-form');
  assert.equal(kald[0].body.company, 'Ny Partner ApS');
  assert.match(kald[0].body.message, /partner i Packrush[\s\S]*Fragtsoftware[\s\S]*Vi vil gerne/);
});
