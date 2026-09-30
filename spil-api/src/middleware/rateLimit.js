'use strict';

const { clientIp } = require('./clientIp');

// Simpel in-memory rate-limiter (fixed window). Fase 1 kører som én proces,
// så in-memory er tilstrækkeligt — se README.md for note om skalering.
function createRateLimiter({ windowMs, max, keyFn, besked }) {
  const hits = new Map(); // key -> { count, reset }

  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, Math.min(windowMs, 60000)).unref();

  return function rateLimit(req, res, next) {
    const key = keyFn ? keyFn(req) : clientIp(req);
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count++;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      return res.status(429).json({
        fejl: besked || 'For mange forsøg. Prøv igen om lidt.',
        kode: 'for_mange_forsoeg',
      });
    }
    next();
  };
}

module.exports = { createRateLimiter };
