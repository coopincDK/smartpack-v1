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
const { deleteInactivePlayers, revokeExpiredTokens } = require('../src/retention');
const config = require('../src/config');

async function main() {
  const pool = createPool();
  try {
    const antal = await deleteInactivePlayers(pool, new Date());
    // Log KUN antallet — aldrig navne/emails/id'er, se README.md.
    // eslint-disable-next-line no-console
    console.log(
      `[retention] ${new Date().toISOString()} slettede ${antal} spiller(e) (GDPR: ingen aktiv tilmelding, >12 mdr. inaktiv).`
    );

    // N9: samme natlige job rydder nu også op i udløbne spiller-bearer-
    // tokens (se src/retention.js#revokeExpiredTokens) — genbruger denne
    // eksisterende kørsel i stedet for en ny, separat cron-mekanisme.
    const antalTokens = await revokeExpiredTokens(pool, new Date());
    const ttlDage = Math.round(config.playerTokenTtlMs / (24 * 3600 * 1000));
    // eslint-disable-next-line no-console
    console.log(
      `[retention] ${new Date().toISOString()} tilbagekaldte ${antalTokens} udløbet(e) spiller-token(s) (TTL: ${ttlDage} dage siden sidste brug).`
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
