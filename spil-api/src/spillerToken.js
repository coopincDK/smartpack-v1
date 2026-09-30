'use strict';

// Opgave C: en spiller kan nu være logget ind på FLERE enheder samtidig (fx
// telefon + standtablet) — login/registrering OVERSKRIVER ikke længere et
// enkelt token_hash-felt på spiller, men OPRETTER altid en ny række her.
// Al bearer-token-autentificering slår op i denne tabel (se
// src/middleware/playerAuth.js) i stedet for spiller.token_hash (droppet,
// se migrations/005_opfoelgning2.sql).

const { randomBearerToken, sha256Hex } = require('./crypto');

// Udsteder et NYT bearer-token til en spiller. Kaldes af BÅDE login og ny
// registrering (src/routes/players.js) — rører ALDRIG spillerens øvrige,
// evt. aktive tokens (de forbliver gyldige).
async function issueToken(client, spillerId) {
  const token = randomBearerToken();
  const tokenHash = sha256Hex(token);
  await client.query('INSERT INTO spiller_token (spiller_id, token_hash) VALUES ($1, $2)', [spillerId, tokenHash]);
  return token;
}

// Slår en spiller op ud fra et RÅT bearer-token — kræver at token-rækken
// findes OG ikke er tilbagekaldt (tilbagekaldt IS NULL). Opdaterer
// sidst_brugt ved brug (hygiejne, ikke kritisk for korrekthed). Returnerer
// null hvis token er ugyldigt/tilbagekaldt, eller spilleren er skjult
// (samme opførsel som hidtil).
async function loadPlayerByToken(pool, token) {
  if (!token) return null;
  const tokenHash = sha256Hex(token);
  const { rows } = await pool.query(
    `SELECT s.*, t.id AS token_id
     FROM spiller s
     JOIN spiller_token t ON t.spiller_id = s.id
     WHERE t.token_hash = $1 AND t.tilbagekaldt IS NULL`,
    [tokenHash]
  );
  if (!rows.length || rows[0].skjult) return null;
  await pool.query('UPDATE spiller_token SET sidst_brugt = now() WHERE id = $1', [rows[0].token_id]);
  return rows[0];
}

module.exports = { issueToken, loadPlayerByToken };
