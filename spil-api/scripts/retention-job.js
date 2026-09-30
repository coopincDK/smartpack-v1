#!/usr/bin/env node
'use strict';

// Natligt GDPR-oprydningsjob — se README.md, afsnit "Drift: GDPR-oprydning
// (natligt job)", for cron-opsætningen (hvordan/hvornår dette script skal
// køres, og hvor man ser antallet af slettede spillere). Se src/retention.js
// for selve sletningslogikken.
//
// Kører IKKE automatisk ved deploy/opstart — kun når dette script kaldes
// eksplicit (fra en crontab-linje på serveren, se README.md).

const { createPool } = require('../src/db');
const { deleteInactivePlayers } = require('../src/retention');

async function main() {
  const pool = createPool();
  try {
    const antal = await deleteInactivePlayers(pool, new Date());
    // Log KUN antallet — aldrig navne/emails/id'er, se README.md.
    // eslint-disable-next-line no-console
    console.log(
      `[retention] ${new Date().toISOString()} slettede ${antal} spiller(e) (GDPR: ingen aktiv tilmelding, >12 mdr. inaktiv).`
    );
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[retention] jobbet fejlede:', e);
  process.exitCode = 1;
});
