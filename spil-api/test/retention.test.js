'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { startHarness } = require('./helpers/appHarness');
const {
  findRetentionCandidates,
  stillQualifiesForDeletion,
  deleteInactivePlayers,
  cutoffDate,
  revokeExpiredTokens,
} = require('../src/retention');
const config = require('../src/config');

let telefonSeq = 20000000;
async function mkSpiller(pool, oprettet, navn) {
  const unik = crypto.randomBytes(6).toString('hex');
  telefonSeq++;
  const { rows } = await pool.query(
    `INSERT INTO spiller (public_id, email, navn, telefon, firma, firma_noegle, oprettet)
     VALUES ($1,$2,$3,$4,'Firma','firma',$5) RETURNING id`,
    [unik, unik + '@example.dk', navn || 'Test Testesen', String(telefonSeq), oprettet]
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

// N9 (fjerde opfølgende runde, afsluttende review): opretter en
// spiller_token-række direkte, uden om selve udstedelses-endpointet, så vi
// kan sætte en vilkårlig `sidst_brugt`/`tilbagekaldt`-tilstand til brug for
// revokeExpiredTokens()-testene nedenfor.
async function mkToken(pool, spillerId, sidstBrugt, tilbagekaldt) {
  const tokenHash = crypto.randomBytes(16).toString('hex');
  const { rows } = await pool.query(
    `INSERT INTO spiller_token (spiller_id, token_hash, sidst_brugt, tilbagekaldt)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    [spillerId, tokenHash, sidstBrugt, tilbagekaldt || null]
  );
  return rows[0].id;
}

test('cutoffDate regner præcis 12 måneder tilbage', () => {
  const now = new Date('2026-09-30T12:00:00Z');
  const cutoff = cutoffDate(now);
  assert.equal(cutoff.toISOString().slice(0, 10), '2025-09-30');
});

test('cutoffDate klemmer konservativt til sidste dag i februar over en skudårskant (aldrig for tidligt)', () => {
  // 29. februar 2028 (skudår) minus 12 måneder findes ikke i 2027 (ikke
  // skudår) — klemmes til 28. februar 2027, IKKE rullet videre til 1. marts
  // (som ville gøre cutoff nyere, dvs. gøre det NEMMERE at kvalificere til
  // sletning end præcis 12 måneder tilsiger).
  const now = new Date('2028-02-29T00:00:00Z');
  const cutoff = cutoffDate(now);
  assert.equal(cutoff.toISOString().slice(0, 10), '2027-02-28');
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

test('TOCTOU: genkontrollen afviser sletning hvis kandidaten er blevet kvalificeret ud siden findRetentionCandidates()', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const now = new Date('2026-09-30T00:00:00Z');
  const forGammel = new Date('2020-01-01T00:00:00Z');

  const c = await mkSpiller(h.pool, forGammel);
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, oprettet) VALUES ($1,$2,$3,'godkendt',$3)`,
    [c, crypto.randomUUID(), forGammel]
  );

  // Kvalificerer til sletning LIGE NU (ingen aktivt samtykke, >12 mdr. inaktiv).
  const kandidater = await findRetentionCandidates(h.pool, now);
  assert.ok(kandidater.includes(c));

  // ...men en anden proces/kald bekræfter et NYT samtykke for spilleren
  // MELLEM den (uden lås) udvælgelse og selve sletningen.
  await h.pool.query(`INSERT INTO samtykke (spiller_id, liste, tidspunkt, type) VALUES ($1,'sms',now(),$2)`, [
    c,
    'bekraeftet',
  ]);

  // Selve genkontrol-funktionen skal nu afvise sletning af netop denne kandidat.
  const client = await h.pool.connect();
  try {
    const stadig = await stillQualifiesForDeletion(client, c, forGammel, now);
    assert.equal(stadig, false, 'et nyt aktivt samtykke skal afvise sletning ved genkontrollen');
  } finally {
    client.release();
  }

  // ...og selve deleteInactivePlayers() (scan + genkontrol i træk) sletter
  // derfor IKKE spilleren, selvom den unikke, ikke-låste scanning ovenfor
  // fandt den som kandidat.
  const antal = await deleteInactivePlayers(h.pool, now);
  assert.equal(antal, 0);
  const tilbage = await h.pool.query('SELECT id FROM spiller WHERE id = $1', [c]);
  assert.equal(tilbage.rows.length, 1, 'spilleren skal stadig eksistere');
});

test('sletning anonymiserer rest-referencer i andre spilleres data (raffle_draws-snapshot, notifikation.data.by/fra, forsoeg.duel.vs)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const now = new Date('2026-09-30T00:00:00Z');
  const forGammel = new Date('2020-01-01T00:00:00Z');

  // Spilleren der skal slettes af retention-jobbet.
  const sletId = await mkSpiller(h.pool, forGammel, 'Slettes Snart');
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, oprettet) VALUES ($1,$2,$3,'godkendt',$3)`,
    [sletId, crypto.randomUUID(), forGammel]
  );
  await h.pool.query(
    `INSERT INTO raffle_draws (kort_navn, spiller_id, spiller_navn_snapshot, email_snapshot)
     VALUES ('test-draw', $1, 'Slettes Snart', 'slettes@example.dk')`,
    [sletId]
  );

  // En ANDEN, overlevende spiller (nyligt aktiv) med rest-referencer til
  // den slettede spillers navn i sine egne rækker.
  const overleverId = await mkSpiller(h.pool, now, 'Overlever Olsen');
  await h.pool.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'beaten', $2::jsonb)`, [
    overleverId,
    JSON.stringify({ by: 'Slettes Snart', score: 500 }),
  ]);
  await h.pool.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'gift', $2::jsonb)`, [
    overleverId,
    JSON.stringify({ type: 'vennekode_refill', fra: 'Slettes Snart' }),
  ]);
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, samlet, oprettet, duel)
     VALUES ($1,$2,$3,'godkendt',300,$3,$4::jsonb)`,
    [overleverId, crypto.randomUUID(), now, JSON.stringify({ vs: 'Slettes Snart' })]
  );

  const antal = await deleteInactivePlayers(h.pool, now);
  assert.equal(antal, 1);

  const raffle = await h.pool.query(
    'SELECT spiller_id, spiller_navn_snapshot, email_snapshot FROM raffle_draws WHERE kort_navn = $1',
    ['test-draw']
  );
  assert.equal(raffle.rows[0].spiller_id, null);
  assert.equal(raffle.rows[0].spiller_navn_snapshot, 'Slettet spiller');
  assert.equal(raffle.rows[0].email_snapshot, null);

  const notifs = await h.pool.query('SELECT type, data FROM notifikation WHERE spiller_id = $1 ORDER BY type', [
    overleverId,
  ]);
  const beaten = notifs.rows.find((r) => r.type === 'beaten');
  const gift = notifs.rows.find((r) => r.type === 'gift');
  assert.equal(beaten.data.by, 'Slettet spiller');
  assert.equal(gift.data.fra, 'Slettet spiller');

  const forsoegRow = await h.pool.query('SELECT duel FROM forsoeg WHERE spiller_id = $1 AND samlet = 300', [
    overleverId,
  ]);
  assert.equal(forsoegRow.rows[0].duel.vs, 'Slettet spiller');
});

test('N9: revokeExpiredTokens markerer KUN tokens der er udløbet (sidst_brugt > TTL siden), og ALDRIG allerede-tilbagekaldte tokens igen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const now = new Date('2026-09-30T12:00:00Z');
  const ttlMs = config.playerTokenTtlMs;
  const spillerId = await mkSpiller(h.pool, now);

  const udloebet = await mkToken(h.pool, spillerId, new Date(now.getTime() - ttlMs - 3600 * 1000)); // > TTL siden
  const friskt = await mkToken(h.pool, spillerId, new Date(now.getTime() - 3600 * 1000)); // 1 time siden, godt inden for TTL
  const alleredeTilbagekaldtTidspunkt = new Date(now.getTime() - ttlMs - 7200 * 1000);
  const alleredeTilbagekaldt = await mkToken(
    h.pool,
    spillerId,
    new Date(now.getTime() - ttlMs - 7200 * 1000),
    alleredeTilbagekaldtTidspunkt // allerede tilbagekaldt FØR jobbet kører
  );

  const antal = await revokeExpiredTokens(h.pool, now);
  assert.equal(antal, 1, 'kun det ene reelt udløbne, endnu-ikke-tilbagekaldte token skal tælles/ryddes');

  const raa = await h.pool.query(
    'SELECT id, tilbagekaldt FROM spiller_token WHERE id = ANY($1::bigint[])',
    [[udloebet, friskt, alleredeTilbagekaldt]]
  );
  const map = new Map(raa.rows.map((r) => [String(r.id), r.tilbagekaldt]));
  assert.ok(map.get(String(udloebet)), 'det udløbne token skal nu være markeret tilbagekaldt');
  assert.equal(map.get(String(friskt)), null, 'det friske token skal STADIG være gyldigt (ikke tilbagekaldt)');
  assert.equal(
    new Date(map.get(String(alleredeTilbagekaldt))).getTime(),
    alleredeTilbagekaldtTidspunkt.getTime(),
    'et allerede tilbagekaldt token må ikke røres/overskrives igen'
  );
});
