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
  cookieSecure: process.env.COOKIE_SECURE !== 'false',
  nodeEnv: process.env.NODE_ENV || 'development',
  // Kun til tests: sænk/slå fra rate-limit på POST /runs (default 20 sek./spiller).
  runsStartRateLimitMs: intEnv('RUNS_START_RATE_LIMIT_MS', 20 * 1000),
};
