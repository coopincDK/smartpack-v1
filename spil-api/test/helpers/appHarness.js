'use strict';

const http = require('http');
const { createApp } = require('../../src/app');
const { attachWs } = require('../../src/ws');
const { setupTestDb } = require('./testDb');

// opts.wsOpts videresendes til attachWs() (fx { revalidateMs } for at teste
// WS-sessionsrevalidering uden at vente 60 sekunder i en test).
// opts.adminRouterOpts videresendes til adminRouter() (fx { runBackup } for
// at stubbe POST /admin/nulstil's pg_dump-kald, se src/backup.js).
async function startHarness(opts = {}) {
  const { pool, teardown, backend } = await setupTestDb({ poolMax: opts.poolMax });
  const server = http.createServer();
  const ws = attachWs(server, pool, opts.wsOpts);
  const app = createApp(pool, ws, { adminRouterOpts: opts.adminRouterOpts });
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
      if (ws.stopRevalidation) ws.stopRevalidation();
      await new Promise((resolve) => server.close(resolve));
      await teardown();
    },
  };
}

// `headers` (valgfri): ekstra/overskrivende headers — bruges af fx M3-testene
// til at sætte en fast `X-Client-IP` pr. testklient (serveren stoler
// UDELUKKENDE på den headeren, se src/middleware/clientIp.js — alle kald fra
// testsuiten deler ellers samme loopback-socket og ville ellers tælle som
// samme klient-IP).
async function api(baseUrl, method, path, { token, body, adminCookie, headers: extraHeaders } = {}) {
  // De offentlige formular-endpoints kræver Origin fra smartpack.dk (src/middleware/origin.js).
  const headers = { 'content-type': 'application/json', origin: 'https://smartpack.dk' };
  if (token) headers['authorization'] = 'Bearer ' + token;
  if (adminCookie) headers['cookie'] = adminCookie;
  if (extraHeaders) Object.assign(headers, extraHeaders);
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
      pin: '1234',
      firma: 'Testfirma ApS',
      tilmeldinger: [],
      accepterer_betingelser: true,
    },
    overrides
  );
  return { body };
}

// Sms er slået fra som standard (010_pinkode.sql). Tests der bruger sms-
// listen som eksempel på en tilmelding, slår den til igen her.
async function slaaSmsTil(pool) {
  await pool.query(
    `UPDATE config SET offentlig = offentlig || '{"smsOn": true, "smsBoost": true}'::jsonb WHERE id = 1`
  );
}

module.exports = { startHarness, api, registrerSpiller, slaaSmsTil };
