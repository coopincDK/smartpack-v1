'use strict';

// Regression: ét anonymt kald med et objekt med egen toString crashede hele
// processen (String() kastede i en async-handler uden try/catch). Skadelige
// typer skal nu give 400, og processen skal leve videre.

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const express = require('express');
const { hashPassword } = require('../src/crypto');
process.env.ADMIN_PASSWORD_HASH = hashPassword('x-test-adgangskode');
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { paalaegAsyncFejlhaandtering } = require('../src/middleware/asyncFejl');

// Unik klient-IP pr. kald, så hjemmesidens rate-limit (20/min) ikke rammes.
let ipNr = 0;
const nyIp = () => ({ 'x-client-ip': `10.9.${Math.floor(ipNr / 250)}.${(ipNr++ % 250) + 1}` });

const SKADELIGE = [
  ['objekt med toString', { toString: 1 }],
  ['tomt objekt', {}],
  ['liste af objekter med toString', [{ toString: 1 }]],
  ['liste', ['a@b.dk']],
  ['boolean', true],
  ['meget lang streng', 'x'.repeat(6000)],
];

test('hjemmeside/kontakt og /players afviser skadelige typer med 400 og processen lever', async (t) => {
  let ubehandlet = 0;
  const lyt = () => { ubehandlet += 1; };
  process.on('unhandledRejection', lyt);
  const h = await startHarness();
  t.after(async () => { process.off('unhandledRejection', lyt); await h.teardown(); });

  const felter = ['email', 'name', 'type', 'phone', 'message', 'shops', '_hp', 'newsletter'];
  for (const [navn, vaerdi] of SKADELIGE.concat([['tal i liste-felt', 123], ['null', null]])) {
    for (const felt of felter) {
      if ((navn === 'null' || navn === 'tal i liste-felt') && felt !== 'email') continue;
      const body = { name: 'x', email: 'a@b.dk', [felt]: vaerdi };
      const r = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body, headers: nyIp() });
      // newsletter må være boolean; shops må være liste af tekster.
      const lovligt = (felt === 'newsletter' && vaerdi === true) || (felt === 'shops' && Array.isArray(vaerdi) && vaerdi.every((x) => typeof x === 'string'));
      if (lovligt) continue;
      const loest = vaerdi === null && felt !== 'email' && felt !== 'name';
      if (loest) continue;
      assert.equal(r.status, 400, `${navn} i ${felt}: ${r.status}`);
    }
  }
  // Selve krasj-payloaden fra fejlrapporten.
  let r = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { email: { toString: 1 }, name: 'x' }, headers: nyIp() });
  assert.equal(r.status, 400);
  assert.equal(r.body.kode, 'ugyldigt_input');
  // Over body-grænsen (64 kb) og ugyldig JSON er klientfejl (4xx), ikke 500.
  r = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { email: 'x'.repeat(200000) }, headers: nyIp() });
  assert.equal(r.status, 413);
  const raa = await fetch(h.baseUrl + '/hjemmeside/kontakt', { method: 'POST', headers: { 'content-type': 'application/json', ...nyIp() }, body: '{"email":' });
  assert.equal(raa.status, 400);
  // Body der er en liste i stedet for et objekt.
  r = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: [1, 2], headers: nyIp() });
  assert.equal(r.status, 400);

  // /players: samme klasse af fejl, FØR try-blokken.
  for (const felt of ['email', 'navn', 'pin', 'firma', 'telefon', 'vennekode', 'udfordringskode', 'tilmeldinger']) {
    for (const [navn, vaerdi] of SKADELIGE) {
      if (felt === 'tilmeldinger' && Array.isArray(vaerdi) && vaerdi.every((x) => typeof x === 'string')) continue;
      const { body } = registrerSpiller(h.baseUrl, { [felt]: vaerdi });
      const p = await api(h.baseUrl, 'POST', '/players', { body, headers: nyIp() });
      assert.equal(p.status, 400, `/players ${navn} i ${felt}: ${p.status}`);
      assert.equal(p.body.kode, 'ugyldigt_input');
    }
  }

  // Processen lever, og serveren svarer stadig, også på en gyldig registrering.
  assert.equal((await api(h.baseUrl, 'GET', '/health')).status, 200);
  const { body } = registrerSpiller(h.baseUrl);
  assert.equal((await api(h.baseUrl, 'POST', '/players', { body, headers: nyIp() })).status, 201);
  await new Promise((res) => setImmediate(res));
  assert.equal(ubehandlet, 0, 'ingen unhandledRejection');
});

test('async-fejl i en handler giver 500 via fejl-handleren i stedet for at vælte processen', async (t) => {
  paalaegAsyncFejlhaandtering();
  const app = express();
  app.get('/kaster', async () => { throw new Error('boom'); });
  app.get('/afviser', (req, res) => Promise.reject(new Error('boom')));
  app.get('/ok', async (req, res) => { res.json({ ok: true }); });
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(500).json({ kode: 'serverfejl' }));
  const srv = http.createServer(app);
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  t.after(() => new Promise((r) => srv.close(r)));
  const base = `http://127.0.0.1:${srv.address().port}`;

  let ubehandlet = 0;
  const lyt = () => { ubehandlet += 1; };
  process.on('unhandledRejection', lyt);
  t.after(() => process.off('unhandledRejection', lyt));

  assert.equal((await api(base, 'GET', '/kaster')).status, 500);
  assert.equal((await api(base, 'GET', '/afviser')).status, 500);
  assert.equal((await api(base, 'GET', '/ok')).status, 200);
  await new Promise((res) => setImmediate(res));
  assert.equal(ubehandlet, 0);
});
