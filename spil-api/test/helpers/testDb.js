'use strict';

// Testdatabase-strategi (se README.md):
//  - Er `docker` tilgængeligt lokalt: spinner en engangs postgres:16-
//    container op, kører migrationerne mod den, og rydder op bagefter.
//  - Ellers: falder tilbage til pg-mem (in-memory Postgres-emulator).
//    Dette er et BEST-EFFORT fallback — pg-mem understøtter ikke 100% af
//    Postgres' funktionalitet (fx visse citext-nuancer), så Docker er den
//    anbefalede vej. Se README.md.

const { execSync } = require('child_process');
const { Client, Pool } = require('pg');
const { migrate } = require('../../src/db');

function dockerAvailable() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function waitForPg(connectionString, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastErr;
  while (Date.now() < deadline) {
    const client = new Client({ connectionString });
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      return;
    } catch (e) {
      lastErr = e;
      try {
        await client.end();
      } catch (_e2) {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw lastErr || new Error('Postgres-containeren startede ikke i tide.');
}

async function startDockerPg() {
  const name = 'spil-api-test-pg-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
  const port = 40000 + Math.floor(Math.random() * 15000);
  execSync(
    `docker run -d --rm --name ${name} -e POSTGRES_PASSWORD=test -e POSTGRES_DB=spiltest -p 127.0.0.1:${port}:5432 postgres:16`,
    { stdio: 'ignore' }
  );
  const connectionString = `postgres://postgres:test@127.0.0.1:${port}/spiltest`;
  try {
    await waitForPg(connectionString, 45000);
  } catch (e) {
    try {
      execSync(`docker rm -f ${name}`, { stdio: 'ignore' });
    } catch (_e2) {
      /* ignore */
    }
    throw e;
  }
  return {
    connectionString,
    async stop() {
      try {
        execSync(`docker rm -f ${name}`, { stdio: 'ignore' });
      } catch (_e) {
        /* ignore */
      }
    },
  };
}

async function setupPgMem() {
  // eslint-disable-next-line global-require
  const { newDb, DataType } = require('pg-mem');
  const mem = newDb({ autoCreateForeignKeyIndices: true });
  // pg-mem har en indbygget `citext`-DATATYPE, men ingen forudregistreret
  // "extension" af samme navn — registrér den som no-op, så
  // `CREATE EXTENSION IF NOT EXISTS citext` (fra 001_init.sql) ikke fejler.
  mem.registerExtension('citext', () => {});
  // pg-mem understøtter ikke det indbyggede `jsonb_set` (bruges af
  // 003_packrush.sql til at opdatere perDay i den eksisterende config-række
  // uden at røre resten af jsonb'en) — registrér en simpel, kun-til-test
  // stub der dækker vores brug (single-key path). Ægte Postgres (produktion
  // og Docker-testene) bruger sin egen native, fulde implementering.
  mem.public.registerFunction({
    name: 'jsonb_set',
    args: [DataType.jsonb, DataType.text, DataType.jsonb],
    returns: DataType.jsonb,
    implementation: (target, pathText, newVal) => {
      const path = String(pathText)
        .replace(/^\{|\}$/g, '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const obj = JSON.parse(JSON.stringify(target || {}));
      let cur = obj;
      for (let i = 0; i < path.length - 1; i++) {
        if (typeof cur[path[i]] !== 'object' || cur[path[i]] === null) cur[path[i]] = {};
        cur = cur[path[i]];
      }
      if (path.length) cur[path[path.length - 1]] = newVal;
      return obj;
    },
  });
  const adapter = mem.adapters.createPg();
  const pool = new adapter.Pool();
  await migrate(pool);
  return { pool, backend: 'pg-mem', async teardown() {} };
}

async function setupTestDb() {
  if (dockerAvailable()) {
    const { connectionString, stop } = await startDockerPg();
    const pool = new Pool({ connectionString });
    await migrate(pool);
    return {
      pool,
      backend: 'docker',
      async teardown() {
        await pool.end();
        await stop();
      },
    };
  }
  return setupPgMem();
}

module.exports = { setupTestDb, dockerAvailable };
