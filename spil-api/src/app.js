'use strict';

const express = require('express');
const { healthRouter } = require('./routes/health');
const { stateRouter } = require('./routes/state');
const { playersRouter } = require('./routes/players');
const { meRouter } = require('./routes/me');
const { runsRouter } = require('./routes/runs');
const { adminRouter } = require('./routes/admin');
const { createRateLimiter } = require('./middleware/rateLimit');

// Bygger Express-appen. `ws` (fra src/ws.js) er valgfri — bruges til at
// broadcaste state.changed når spillerdata/config ændres via API'et.
// `opts.adminRouterOpts` videresendes til adminRouter() — bruges KUN af
// tests til at injicere en stub for POST /admin/nulstil's pg_dump-kald (se
// src/backup.js), så testsuiten ikke kræver en rigtig pg_dump-klient.
function createApp(pool, ws, opts) {
  opts = opts || {};
  const app = express();
  app.disable('x-powered-by');
  // Ingen CORS-headers (same-origin). Ingen app.set('trust proxy', ...) —
  // se src/middleware/clientIp.js og API.md for begrundelsen.
  app.use(express.json({ limit: '64kb' }));

  // Generøs skrive-rate-limit pr. IP (GET/HEAD er undtaget, de har deres
  // egne specifikke limits hvor det er nødvendigt, fx admin-login).
  // Opgave D: hævet markant (120 -> 1000/min/IP) — messe-wifi bag NAT deler
  // ofte ÉN offentlig IP mellem hundredvis af enheder, og 120/min var reelt
  // en delt grænse for HELE standen. Spiller-specifikke grænser (fx 1
  // forsøg-start/20 sek./spiller, se runsStartRateLimitMs) og admin-login
  // (5/min/IP) er UÆNDREDE — de rammer allerede pr. spiller/handling, ikke
  // pr. delt IP.
  const writeLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 1000 });
  app.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') return next();
    return writeLimiter(req, res, next);
  });

  app.use(healthRouter());
  app.use(stateRouter(pool));
  app.use(playersRouter(pool, ws));
  app.use(meRouter(pool, ws));
  app.use(runsRouter(pool, ws));
  app.use(adminRouter(pool, ws, opts.adminRouterOpts));

  app.use((req, res) => {
    res.status(404).json({ fejl: 'Ukendt endpoint.', kode: 'ikke_fundet' });
  });

  // Fejl-handler (dansk, ingen stack-traces til klienten).
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    if (res.headersSent) return;
    res.status(500).json({ fejl: 'Der skete en uventet serverfejl.', kode: 'serverfejl' });
  });

  return app;
}

module.exports = { createApp };
