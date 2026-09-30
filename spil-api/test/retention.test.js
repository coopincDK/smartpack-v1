'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { startHarness } = require('./helpers/appHarness');
const { findRetentionCandidates, deleteInactivePlayers, cutoffDate } = require('../src/retention');

let telefonSeq = 20000000;
async function mkSpiller(pool, oprettet) {
  const unik = crypto.randomBytes(6).toString('hex');
  telefonSeq++;
  const { rows } = await pool.query(
    `INSERT INTO spiller (public_id, email, navn, telefon, firma, firma_noegle, token_hash, oprettet)
     VALUES ($1,$2,'Test Testesen',$3,'Firma','firma',$4,$5) RETURNING id`,
    [unik, unik + '@example.dk', String(telefonSeq), 'th' + unik, oprettet]
  );
  return rows[0].id;
}

async function mkForsoeg(pool, spillerId, oprettet) {
  await pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, oprettet)
     VALUES ($1,$2,$3,'godkendt',$3)`,
    [spillerId, crypto.randomUUID(), oprettet]
  );
}

async function mkSamtykke(pool, spillerId, liste, type, tidspunkt) {
  await pool.query(
    `INSERT INTO samtykke (spiller_id, liste, tidspunkt, type) VALUES ($1,$2,$3,$4)`,
    [spillerId, liste, tidspunkt, type]
  );
}

test('cutoffDate regner præcis 12 måneder tilbage', () => {
  const now = new Date('2026-09-30T12:00:00Z');
  const cutoff = cutoffDate(now);
  assert.equal(cutoff.toISOString().slice(0, 10), '2025-09-30');
});

test('GDPR-oprydning: kun spillere UDEN aktivt samtykke OG >12 mdr. inaktive kvalificerer', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const now = new Date('2026-09-30T00:00:00Z');
  const forGammel = new Date('2020-01-01T00:00:00Z');
  const nyligt = new Date('2026-09-01T00:00:00Z');

  // a) aktivt samtykke + gammel sidste-spil-dato -> IKKE slettet.
  const a = await mkSpiller(h.pool, forGammel);
  await mkSamtykke(h.pool, a, 'sms', 'bekraeftet', forGammel);
  await mkForsoeg(h.pool, a, forGammel);

  // b) uden aktivt samtykke, men sidst spillet for under 12 mdr. siden -> IKKE slettet.
  const b = await mkSpiller(h.pool, forGammel);
  await mkForsoeg(h.pool, b, nyligt);

  // c) uden aktivt samtykke, over 12 mdr. inaktiv -> SLETTES.
  const c = await mkSpiller(h.pool, forGammel);
  await mkForsoeg(h.pool, c, forGammel);

  // d) aldrig spillet, oprettet over 12 mdr. siden, uden samtykke -> SLETTES.
  const d = await mkSpiller(h.pool, forGammel);

  // e) samtykke trukket tilbage (ikke bare fraværende) + inaktiv -> SLETTES,
  //    og har forsøg/notifikation/samtykke der skal cascade-slettes.
  const e = await mkSpiller(h.pool, forGammel);
  await mkForsoeg(h.pool, e, forGammel);
  await mkSamtykke(h.pool, e, 'sms', 'bekraeftet', forGammel);
  await mkSamtykke(h.pool, e, 'sms', 'trukket_tilbage', new Date(forGammel.getTime() + 1000));
  await h.pool.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1,'beaten','{}'::jsonb)`, [e]);

  const kandidater = await findRetentionCandidates(h.pool, now);
  assert.deepEqual(new Set(kandidater), new Set([c, d, e]));

  const antal = await deleteInactivePlayers(h.pool, now);
  assert.equal(antal, 3);

  const tilbage = await h.pool.query('SELECT id FROM spiller ORDER BY id');
  assert.deepEqual(
    new Set(tilbage.rows.map((r) => r.id)),
    new Set([a, b])
  );

  // Cascade: forsøg/notifikationer/samtykke for e er væk.
  const forsoegE = await h.pool.query('SELECT COUNT(*) AS n FROM forsoeg WHERE spiller_id = $1', [e]);
  assert.equal(Number(forsoegE.rows[0].n), 0);
  const notifE = await h.pool.query('SELECT COUNT(*) AS n FROM notifikation WHERE spiller_id = $1', [e]);
  assert.equal(Number(notifE.rows[0].n), 0);
  const samtykkeE = await h.pool.query('SELECT COUNT(*) AS n FROM samtykke WHERE spiller_id = $1', [e]);
  assert.equal(Number(samtykkeE.rows[0].n), 0);

  // Andre spilleres data er urørt.
  const forsoegB = await h.pool.query('SELECT COUNT(*) AS n FROM forsoeg WHERE spiller_id = $1', [b]);
  assert.equal(Number(forsoegB.rows[0].n), 1);
  const samtykkeA = await h.pool.query('SELECT COUNT(*) AS n FROM samtykke WHERE spiller_id = $1', [a]);
  assert.equal(Number(samtykkeA.rows[0].n), 1);
});
