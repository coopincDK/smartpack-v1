'use strict';

// Fjerde opfølgende ændringsrunde (afsluttende review), N9: "Bearer-tokens
// udløber aldrig" — se API.md, "Fjerde opfølgende ændringsrunde", og
// src/spillerToken.js. Tester: POST /me/logout tilbagekalder KUN det token
// der blev kaldt med (andre tokens for samme spiller forbliver gyldige); et
// token der ikke har været brugt inden for TTL'en afvises ved
// autentificering; sidst_brugt opdateres højst én gang i minuttet pr.
// token.

const test = require('node:test');
const assert = require('node:assert/strict');
const { sha256Hex } = require('../src/crypto');

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

async function sidstBrugtFor(pool, token) {
  const { rows } = await pool.query('SELECT sidst_brugt FROM spiller_token WHERE token_hash = $1', [
    sha256Hex(token),
  ]);
  return rows[0] && rows[0].sidst_brugt;
}

async function saetSidstBrugt(pool, token, dato) {
  await pool.query('UPDATE spiller_token SET sidst_brugt = $1 WHERE token_hash = $2', [dato, sha256Hex(token)]);
}

test('POST /me/logout tilbagekalder KUN det token der blev kaldt med — andre tokens for samme spiller virker stadig', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'logout-multi@example.dk', telefon: '20305001' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const tokenA = reg.body.token;

  const loginB = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(loginB.status, 200);
  const tokenB = loginB.body.token;

  const logout = await api(h.baseUrl, 'POST', '/me/logout', { token: tokenA });
  assert.equal(logout.status, 200);
  assert.equal(logout.body.ok, true);

  const meA = await api(h.baseUrl, 'GET', '/me', { token: tokenA });
  assert.equal(meA.status, 401, 'det tilbagekaldte token skal ikke længere virke');
  assert.equal(meA.body.kode, 'ugyldigt_token');

  const meB = await api(h.baseUrl, 'GET', '/me', { token: tokenB });
  assert.equal(meB.status, 200, 'spillerens ANDET token (anden enhed) skal stadig virke uændret');
});

test('POST /me/logout kræver bearer-token, og kan ikke bruges to gange på samme token', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const uden = await api(h.baseUrl, 'POST', '/me/logout');
  assert.equal(uden.status, 401);

  const { body } = await registrerSpiller(h.baseUrl, { email: 'logout-idempotent@example.dk', telefon: '20305002' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const foerste = await api(h.baseUrl, 'POST', '/me/logout', { token });
  assert.equal(foerste.status, 200);

  const anden = await api(h.baseUrl, 'POST', '/me/logout', { token });
  assert.equal(anden.status, 401, 'tokenet er jo netop nu tilbagekaldt, og dermed ugyldigt');
});

test('N9: et token der ikke har været brugt inden for TTL\'en afvises — selvom det aldrig blev tilbagekaldt', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'ttl-udloebet@example.dk', telefon: '20305003' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  // Frisk token virker.
  const foer = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(foer.status, 200);

  // Simulerer at tokenet ikke har været brugt i over 30 dage (default-TTL,
  // se config.playerTokenTtlMs) — UDEN at det er tilbagekaldt.
  const forLaengeSiden = new Date(Date.now() - 31 * 24 * 3600 * 1000);
  await saetSidstBrugt(h.pool, token, forLaengeSiden);

  const efter = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(efter.status, 401, 'et token der ikke har været brugt i over TTL\'en skal afvises');
  assert.equal(efter.body.kode, 'ugyldigt_token');

  const raa = await h.pool.query('SELECT tilbagekaldt FROM spiller_token WHERE token_hash = $1', [sha256Hex(token)]);
  assert.equal(raa.rows[0].tilbagekaldt, null, 'TTL-afvisningen sker ved BRUG, ikke ved at markere tilbagekaldt her');
});

test('N9: et token der har været brugt for under en time siden (godt inden for TTL) virker uændret', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'ttl-frisk@example.dk', telefon: '20305004' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  await saetSidstBrugt(h.pool, token, new Date(Date.now() - 3600 * 1000));

  const res = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(res.status, 200);
});

test('N9: sidst_brugt opdateres højst én gang i minuttet pr. token', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'throttle@example.dk', telefon: '20305005' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  // Simulerer at tokenet blev brugt for 30 sekunder siden — inden for
  // throttle-vinduet (1 minut).
  const for30SekSiden = new Date(Date.now() - 30 * 1000);
  await saetSidstBrugt(h.pool, token, for30SekSiden);

  const res1 = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(res1.status, 200);
  const sidstBrugt1 = await sidstBrugtFor(h.pool, token);
  assert.equal(
    new Date(sidstBrugt1).getTime(),
    for30SekSiden.getTime(),
    'sidst_brugt skal IKKE opdateres igen inden for samme minut'
  );

  // Simulerer at tokenet sidst blev brugt for 90 sekunder siden — UDENFOR
  // throttle-vinduet.
  const for90SekSiden = new Date(Date.now() - 90 * 1000);
  await saetSidstBrugt(h.pool, token, for90SekSiden);

  const foerAndetKald = Date.now();
  const res2 = await api(h.baseUrl, 'GET', '/me', { token });
  assert.equal(res2.status, 200);
  const sidstBrugt2 = await sidstBrugtFor(h.pool, token);
  assert.ok(
    new Date(sidstBrugt2).getTime() >= foerAndetKald - 1000,
    'sidst_brugt SKAL opdateres til nu, når det er over et minut siden sidst'
  );
});
