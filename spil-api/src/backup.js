'use strict';

// Sikkerhedsnet for POST /admin/nulstil (se src/routes/admin.js og API.md):
// tager en pg_dump FØR spillerne slettes. Samme grundmekanisme (pg_dump) som
// det natlige backup.sh på serveren (se README.md, "Drift"), men kørt
// IN-PROCESS via DATABASE_URL i stedet for `docker compose exec db pg_dump`
// — api-containeren har hverken docker-socketen eller docker-CLI'en til
// rådighed, kun netværksadgang til db-servicen. Kræver derfor at
// `pg_dump`-klienten (matchende Postgres 16) er installeret i api-imaget
// (se Dockerfile) og at BACKUP_DIR er mountet ind fra hosten (se
// docker-compose.yml) — begge dele er en del af DENNE leverance.
//
// Output lægges med præfikset "nulstil-" (IKKE "spilapi-", som det natlige
// backup.sh's 14-dages-oprydning matcher på), så en nulstillings-backup
// ALDRIG bliver rullet væk af den natlige rotation.

const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const BACKUP_DIR = process.env.NULSTIL_BACKUP_DIR || '/var/backups/spil-api';

function timestampForFilename(now) {
  return (now || new Date()).toISOString().replace(/[:.]/g, '-');
}

// runBackup(databaseUrl?): kører pg_dump mod databasen og returnerer den
// fulde sti til dump-filen. Kaster ved fejl (tom fil, manglende pg_dump,
// forbindelsesfejl osv.) — kalderen (POST /admin/nulstil) skal IKKE
// fortsætte til selve sletningen hvis dette fejler.
async function runBackup(databaseUrl) {
  const url = databaseUrl || config.databaseUrl;
  if (!url) {
    throw new Error('DATABASE_URL mangler — kan ikke tage sikkerhedskopi før nulstilling.');
  }

  await fs.promises.mkdir(BACKUP_DIR, { recursive: true });
  const out = path.join(BACKUP_DIR, `nulstil-${timestampForFilename(new Date())}.sql`);

  await new Promise((resolve, reject) => {
    execFile('pg_dump', [url, '--no-owner', '--no-acl', '-f', out], (err, stdout, stderr) => {
      if (err) return reject(new Error(`pg_dump fejlede: ${stderr || err.message}`));
      resolve();
    });
  });

  const stat = await fs.promises.stat(out);
  if (!stat.size) {
    throw new Error('pg_dump gav en tom fil — afbryder nulstillingen.');
  }
  return out;
}

module.exports = { runBackup, BACKUP_DIR };
