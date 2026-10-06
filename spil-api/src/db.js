'use strict';

const fs = require('fs');
const path = require('path');
const { Pool, types } = require('pg');

// `liv_dag`/`tick_dag` er Postgres `date`-kolonner (ingen tidspunkt/
// tidszone). node-pg's standard-typeparser (pakken `postgres-date`)
// konstruerer et JS Date-objekt i PROCESSENS LOKALE tidszone og runder
// derved dagen forkert, hvis man senere konverterer det med
// .toISOString().slice(0,10) og processens TZ ikke er UTC (afhænger af
// server/dev-maskine/CI's miljø — upålideligt). Ved i stedet at levere den
// rå 'YYYY-MM-DD'-tekststreng direkte (OID 1082 = `date`) undgår vi hele
// den tvetydighed, uafhængigt af hvor processen kører — se
// src/rules/tzDate.js for hvor "dag" ELLERS regnes (Europe/Copenhagen for
// alt der udledes af en timestamptz/Date, fx liv-reset og dagens flueben).
types.setTypeParser(1082, (val) => val);

function createPool(connectionString) {
  // Max 30 forbindelser (DB_POOL_MAX) og en timeout på at få en forbindelse, så en
  // overbelastning giver fejl i stedet for en API, der hænger for altid. Kode, der
  // holder en transaktion åben, skal bruge SIN client til alle queries (ellers beder
  // hver anmodning om to forbindelser, og poolen kan køre fast).
  const max = Number(process.env.DB_POOL_MAX);
  return new Pool({
    connectionString: connectionString || process.env.DATABASE_URL,
    max: Number.isFinite(max) && max > 0 ? Math.floor(max) : 30,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
}

// Simpelt migrationssystem: kører nummererede .sql-filer i rækkefølge,
// sporer kørte filer i `_migrations`. Se README.md.
async function migrate(pool, migrationsDir) {
  await pool.query(`CREATE TABLE IF NOT EXISTS _migrations (
    filnavn text PRIMARY KEY,
    koert timestamptz NOT NULL DEFAULT now()
  )`);

  const dir = migrationsDir || path.join(__dirname, '..', 'migrations');
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const { rows } = await pool.query('SELECT 1 FROM _migrations WHERE filnavn = $1', [file]);
    if (rows.length) continue;

    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filnavn) VALUES ($1)', [file]);
      await client.query('COMMIT');
      // eslint-disable-next-line no-console
      console.log(`[migrate] koerte ${file}`);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

module.exports = { createPool, migrate };
