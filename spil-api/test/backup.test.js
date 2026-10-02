'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// S4 (merge-review): disse tests kører det RIGTIGE scripts/backup.sh — ikke
// en gentolkning/reimplementering af dets logik. Kun selve `docker
// compose exec`-kaldet stubbes (en fake `docker`-eksekverbar forrest i
// PATH), fordi der hverken er en rigtig docker-compose-opsætning eller en
// kørende Postgres-container til rådighed i testmiljøet (test/helpers/
// testDb.js bruger en almindelig pg-pool, ikke docker — og CI'ens
// Postgres-service, se .github/workflows/deploy-spil-api.yml, er heller
// ikke en docker-compose-container, scriptet kunne køre `exec` mod).
// SPIL_API_BACKUP_DIR peger på en midlertidig mappe pr. test, så testene
// aldrig rører den rigtige /var/backups/spil-api.

const BACKUP_SCRIPT = path.join(__dirname, '..', 'scripts', 'backup.sh');

// Skriver en fake `docker`, der — uanset argumenter — efterligner `docker
// compose exec -T db sh -c '...pg_dump...'` ved blot at skrive
// `dumpOutput` til stdout. Det er den ENESTE ting backup.sh bruger `docker`
// til, så det er tilstrækkeligt til at drive hele resten af det rigtige
// script (gzip, komplethedstjek, mv/chmod, rotation).
function lavFakeDockerBin(dir, dumpOutput) {
  const dockerPath = path.join(dir, 'docker');
  fs.writeFileSync(dockerPath, `#!/usr/bin/env bash\ncat <<'SPIL_API_TEST_DUMP'\n${dumpOutput}\nSPIL_API_TEST_DUMP\n`);
  fs.chmodSync(dockerPath, 0o755);
  return dockerPath;
}

function koerBackup(dumpOutput, backupDir) {
  const binDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spil-backup-bin-'));
  try {
    lavFakeDockerBin(binDir, dumpOutput);
    const env = Object.assign({}, process.env, {
      PATH: `${binDir}${path.delimiter}${process.env.PATH}`,
      SPIL_API_BACKUP_DIR: backupDir,
    });
    return spawnSync('bash', [BACKUP_SCRIPT], { env, encoding: 'utf8' });
  } finally {
    fs.rmSync(binDir, { recursive: true, force: true });
  }
}

function sqlGzFiler(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.sql.gz'));
}

test('S4: en TOM dump (fx en pg_dump der fejlede helt) gzipper stadig til en lille, gyldig fil — men scriptet fejler nu (ikke-nul exit) i stedet for at gemme den', async (t) => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spil-backup-out-'));
  t.after(() => fs.rmSync(backupDir, { recursive: true, force: true }));

  const res = koerBackup('', backupDir);

  assert.notEqual(res.status, 0, `scriptet skal fejle på en tom dump (stderr: ${res.stderr})`);
  assert.match(res.stderr, /ufuldstændig|korrupt/i);
  assert.equal(sqlGzFiler(backupDir).length, 0, 'en tom/ufuldstændig dump må IKKE efterlade en .sql.gz-fil');
});

test('S4: en dump klippet midt i (uden "PostgreSQL database dump complete") rammer samme tjek, selvom den ikke er tom', async (t) => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spil-backup-out-'));
  t.after(() => fs.rmSync(backupDir, { recursive: true, force: true }));

  const afbrudtDump = ['-- PostgreSQL database dump', 'CREATE TABLE spiller (id integer);', 'COPY spiller (id) FROM stdin;', '1'].join(
    '\n'
  );
  const res = koerBackup(afbrudtDump, backupDir);

  assert.notEqual(res.status, 0, `scriptet skal fejle på en afbrudt dump (stderr: ${res.stderr})`);
  assert.match(res.stderr, /ufuldstændig|korrupt/i);
  assert.equal(sqlGzFiler(backupDir).length, 0);
});

test('S4 (kontrol): en KOMPLET dump (med afslutningslinjen) gemmes stadig normalt (exit 0, én .sql.gz-fil)', async (t) => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spil-backup-out-'));
  t.after(() => fs.rmSync(backupDir, { recursive: true, force: true }));

  const komplettDump = [
    '-- PostgreSQL database dump',
    'CREATE TABLE spiller (id integer);',
    '-- PostgreSQL database dump complete',
  ].join('\n');
  const res = koerBackup(komplettDump, backupDir);

  assert.equal(res.status, 0, `en komplet dump skal stadig lykkes (stderr: ${res.stderr})`);
  assert.equal(sqlGzFiler(backupDir).length, 1, 'en komplet dump skal gemmes som ÉN .sql.gz-fil');
});
