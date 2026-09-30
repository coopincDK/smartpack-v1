'use strict';

const http = require('http');
const { createApp } = require('../../src/app');
const { attachWs } = require('../../src/ws');
const { setupTestDb } = require('./testDb');

async function startHarness() {
  const { pool, teardown, backend } = await setupTestDb();
  const server = http.createServer();
  const ws = attachWs(server, pool);
  const app = createApp(pool, ws);
  server.on('request', app);

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const wsUrl = `ws://127.0.0.1:${port}/ws`;

  return {
    pool,
    backend,
    baseUrl,
    wsUrl,
    async teardown() {
      // Luk evt. åbne WS-forbindelser hårdt først — ellers kan server.close()
      // hænge på at vente på en graceful close-handshake fra testklienter.
      for (const client of ws.wss.clients) {
        try {
          client.terminate();
        } catch (e) {
          /* ignore */
        }
      }
      await new Promise((resolve) => server.close(resolve));
      await teardown();
    },
  };
}

async function api(baseUrl, method, path, { token, body, adminCookie } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers['authorization'] = 'Bearer ' + token;
  if (adminCookie) headers['cookie'] = adminCookie;
  const res = await fetch(baseUrl + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    /* tomt svar */
  }
  return { status: res.status, headers: res.headers, body: json };
}

// Bygger en gyldig, tilfældig registrerings-body. Foretager IKKE selv kaldet
// — kalderen skal selv POST'e den til /players (og evt. genbruge samme body
// til et efterfølgende login-forsøg).
function registrerSpiller(baseUrl, overrides = {}) {
  const unik = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const body = Object.assign(
    {
      navn: 'Test Testesen',
      email: `test-${unik}@example.dk`,
      telefon: '2' + String(Math.floor(10000000 + Math.random() * 89999999)).slice(0, 7),
      firma: 'Testfirma ApS',
      tilmeldinger: [],
      accepterer_betingelser: true,
    },
    overrides
  );
  return { body };
}

module.exports = { startHarness, api, registrerSpiller };
