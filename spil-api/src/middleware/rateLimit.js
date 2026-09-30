'use strict';

const { clientIp } = require('./clientIp');

// Simpel in-memory rate-limiter (fixed window). Fase 1 kører som én proces,
// så in-memory er tilstrækkeligt — se README.md for note om skalering.
//
// N12: ud over selve Express-middlewaren (der som hidtil tæller ETHVERT kald
// der passerer den, uanset hvad handleren derefter gør) eksponeres nu tre
// lav-niveau-metoder på den returnerede funktion: check/consume/reset. De
// bruges hvor det IKKE er selve HTTP-kaldet, men en specifik BIVIRKNING inde
// i handleren, der skal styre forbruget af et rate-limit-"slot" — se
// src/routes/runs.js (POST /runs), hvor slottet kun må forbruges når der
// rent faktisk oprettes et nyt forsøg, ikke ved et genoptaget-svar.
function createRateLimiter({ windowMs, max, keyFn, besked }) {
  const hits = new Map(); // key -> { count, reset }

  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, Math.min(windowMs, 60000)).unref();

  function keyFor(req) {
    return keyFn ? keyFn(req) : clientIp(req);
  }

  function entryFor(key) {
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    return entry;
  }

  // Tjekker om et forbrug lige nu ville overskride grænsen, UDEN selv at
  // forbruge noget. Returnerer antal sekunder til Retry-After hvis blokeret,
  // ellers null.
  function check(req) {
    const entry = entryFor(keyFor(req));
    if (entry.count >= max) {
      return Math.max(0, Math.ceil((entry.reset - Date.now()) / 1000));
    }
    return null;
  }

  // Forbruger ét slot. Kaldes KUN når den bivirkning sloten skal beskytte
  // rent faktisk indtræffer.
  function consume(req) {
    entryFor(keyFor(req)).count++;
  }

  // Rydder ethvert forbrug for nøglen. Bruges når et forudgående forbrug
  // viser sig ikke at burde have talt (se runs.js's genoptaget-svar).
  function reset(req) {
    hits.delete(keyFor(req));
  }

  const middleware = function rateLimit(req, res, next) {
    const retryAfterSec = check(req);
    if (retryAfterSec !== null) {
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        fejl: besked || 'For mange forsøg. Prøv igen om lidt.',
        kode: 'for_mange_forsoeg',
      });
    }
    consume(req);
    next();
  };

  middleware.check = check;
  middleware.consume = consume;
  middleware.reset = reset;

  return middleware;
}

module.exports = { createRateLimiter };
