'use strict';

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function createPool(connectionString) {
  return new Pool({ connectionString: connectionString || process.env.DATABASE_URL });
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
