'use strict';

// Opgave C: en spiller kan nu være logget ind på FLERE enheder samtidig (fx
// telefon + standtablet) — login/registrering OVERSKRIVER ikke længere et
// enkelt token_hash-felt på spiller, men OPRETTER altid en ny række her.
// Al bearer-token-autentificering slår op i denne tabel (se
// src/middleware/playerAuth.js) i stedet for spiller.token_hash (droppet,
// se migrations/005_opfoelgning2.sql).

const { randomBearerToken, sha256Hex } = require('./crypto');
const config = require('./config');

// N9 (fjerde opfølgende runde, afsluttende review): kun én DB-skrivning pr.
// token pr. minut for `sidst_brugt` — WS-forbindelser og hyppig polling
// ville ellers give en UPDATE ved praktisk talt hvert eneste API-kald.
// Se touchSidstBrugt() nedenfor.
const SIDST_BRUGT_THROTTLE_MS = 60 * 1000;

// Udsteder et NYT bearer-token til en spiller. Kaldes af BÅDE login og ny
// registrering (src/routes/players.js) — rører ALDRIG spillerens øvrige,
// evt. aktive tokens (de forbliver gyldige).
async function issueToken(client, spillerId) {
  const token = randomBearerToken();
  const tokenHash = sha256Hex(token);
  await client.query('INSERT INTO spiller_token (spiller_id, token_hash) VALUES ($1, $2)', [spillerId, tokenHash]);
  return token;
}

// Opdaterer `sidst_brugt` til nu — men KUN hvis den ikke allerede er
// opdateret inden for det seneste minut (se SIDST_BRUGT_THROTTLE_MS).
// WHERE-betingelsen gør springet atomisk og race-fri (i stedet for en
// separat SELECT-så-UPDATE, der ville kunne stødte sammen med en anden
// samtidig forespørgsel på samme token): matcher betingelsen ikke, opdaterer
// UPDATE'en simpelthen 0 rækker — ingen ekstra skrivestøj.
async function touchSidstBrugt(pool, tokenId) {
  await pool.query(
    `UPDATE spiller_token SET sidst_brugt = now()
     WHERE id = $1 AND sidst_brugt < now() - make_interval(secs => $2::double precision)`,
    [tokenId, SIDST_BRUGT_THROTTLE_MS / 1000]
  );
}

// Slår en spiller op ud fra et RÅT bearer-token — kræver at token-rækken
// findes, ikke er tilbagekaldt (tilbagekaldt IS NULL), OG har været brugt
// inden for TTL'en (config.playerTokenTtlMs — se N9, "Bearer-tokens udløber
// aldrig"). Et token der ikke har været brugt i mere end TTL'en, tælles som
// udløbet og afvises HER, ved selve brugen — ikke kun ved den natlige
// oprydning (src/retention.js#revokeExpiredTokens), som blot rydder op i det
// der allerede er ugyldigt. Opdaterer `sidst_brugt` ved brug (throttlet, se
// touchSidstBrugt() ovenfor). Returnerer null hvis token er ugyldigt/
// tilbagekaldt/udløbet, eller spilleren er skjult (samme opførsel som
// hidtil).
async function loadPlayerByToken(pool, token) {
  if (!token) return null;
  const tokenHash = sha256Hex(token);
  const { rows } = await pool.query(
    `SELECT s.*, t.id AS token_id
     FROM spiller s
     JOIN spiller_token t ON t.spiller_id = s.id
     WHERE t.token_hash = $1 AND t.tilbagekaldt IS NULL
       AND t.sidst_brugt > now() - make_interval(secs => $2::double precision)`,
    [tokenHash, config.playerTokenTtlMs / 1000]
  );
  if (!rows.length || rows[0].skjult) return null;
  await touchSidstBrugt(pool, rows[0].token_id);
  return rows[0];
}

module.exports = { issueToken, loadPlayerByToken, touchSidstBrugt, SIDST_BRUGT_THROTTLE_MS };
