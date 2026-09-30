'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { startHarness } = require('./helpers/appHarness');
const { todayStr } = require('../src/rules/tzDate');
const { todayLeaderboard } = require('../src/gameQueries');

test('todayStr(): "dag" regnes i Europe/Copenhagen, ikke UTC (vintertid)', () => {
  // 1. januar kl. 23:30 UTC = 2. januar kl. 00:30 i København (vintertid,
  // UTC+1) — en anden dag end UTC.
  assert.equal(todayStr(new Date('2026-01-01T23:30:00Z')), '2026-01-02');
});

test('todayStr(): "dag" regnes i Europe/Copenhagen, ikke UTC (sommertid)', () => {
  // 15. juni kl. 22:30 UTC = 16. juni kl. 00:30 i København (sommertid,
  // UTC+2) — en anden dag end UTC.
  assert.equal(todayStr(new Date('2026-06-15T22:30:00Z')), '2026-06-16');
});

async function mkSpiller(pool, oprettet) {
  const unik = crypto.randomBytes(6).toString('hex');
  const { rows } = await pool.query(
    `INSERT INTO spiller (public_id, email, navn, telefon, firma, firma_noegle, oprettet)
     VALUES ($1,$2,'Test Testesen',$3,'Firma','firma',$4) RETURNING id`,
    [unik, unik + '@example.dk', '2' + unik.slice(0, 7), oprettet]
  );
  return rows[0].id;
}

test('SQL-siden (cphDateExpr via todayLeaderboard) grupperer forsøg på den KØBENHAVNSKE dag, ikke UTC-dagen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  // Samme tidspunkt som i den rene JS-test ovenfor: 22:30 UTC den 15. juni
  // er allerede 16. juni i København.
  const instant = new Date('2026-06-15T22:30:00Z');
  const cphDag = todayStr(instant);
  assert.equal(cphDag, '2026-06-16');
  const utcDag = instant.toISOString().slice(0, 10);
  assert.equal(utcDag, '2026-06-15');

  const spillerId = await mkSpiller(h.pool, instant);
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, samlet, oprettet)
     VALUES ($1,$2,$3,'godkendt',500,$3)`,
    [spillerId, crypto.randomUUID(), instant]
  );

  const client = await h.pool.connect();
  try {
    const boardCph = await todayLeaderboard(client, cphDag);
    assert.ok(
      boardCph.some((r) => r.spillerId === spillerId),
      'forsøget skal tælle med på den KØBENHAVNSKE dag'
    );

    const boardUtc = await todayLeaderboard(client, utcDag);
    assert.ok(
      !boardUtc.some((r) => r.spillerId === spillerId),
      'forsøget må IKKE tælle med på den (forkerte) UTC-dag'
    );
  } finally {
    client.release();
  }
});
