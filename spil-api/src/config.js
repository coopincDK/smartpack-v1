'use strict';

require('dotenv').config();

// Bruges i stedet for `parseInt(x) || fallback`, da 0 er en gyldig,
// meningsfuld værdi for fx runsStartRateLimitMs (bruges i tests).
function intEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

module.exports = {
  port: intEnv('PORT', 3000),
  databaseUrl: process.env.DATABASE_URL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  adminSessionTtlMs: intEnv('ADMIN_SESSION_TTL_MS', 12 * 3600 * 1000),
  // Stand-sessioner (kun ret til at se fulde navne, se API.md) er
  // langtlevende — en messestand er typisk sat op i flere dage ad gangen.
  standSessionTtlMs: intEnv('STAND_SESSION_TTL_MS', 3 * 24 * 3600 * 1000),
  cookieSecure: process.env.COOKIE_SECURE !== 'false',
  nodeEnv: process.env.NODE_ENV || 'development',
  // Kun til tests: sænk/slå fra rate-limit på POST /runs (default 20 sek./spiller).
  runsStartRateLimitMs: intEnv('RUNS_START_RATE_LIMIT_MS', 20 * 1000),
  // N9 (fjerde opfølgende runde, afsluttende review): et spiller-bearer-
  // token (spiller_token) udløb hidtil ALDRIG — udstedt én gang, gyldigt for
  // evigt. Et token der ikke har været BRUGT (ikke kun udstedt) inden for
  // denne TTL, afvises nu ved selve autentificeringen (se
  // src/spillerToken.js#loadPlayerByToken) og ryddes af det eksisterende
  // natlige GDPR-oprydningsjob (se src/retention.js#revokeExpiredTokens).
  // Default 30 dage — en messe/event varer typisk langt under det, så dette
  // er reelt en sikkerhedsnet-grænse, ikke noget spillere forventes at ramme
  // midt i en session.
  playerTokenTtlMs: intEnv('PLAYER_TOKEN_TTL_MS', 30 * 24 * 3600 * 1000),
};
