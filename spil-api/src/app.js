'use strict';

const express = require('express');
const { healthRouter } = require('./routes/health');
const { stateRouter } = require('./routes/state');
const { playersRouter, createIpLoginLimiter, createSmsIpLimiter } = require('./routes/players');
const { meRouter } = require('./routes/me');
const { runsRouter } = require('./routes/runs');
const { adminRouter } = require('./routes/admin');
const { partnersRouter } = require('./routes/partners');
const { konkurrenceRouter } = require('./routes/konkurrence');
const { kampagneRouter } = require('./routes/kampagne');
const { efteraarRouter } = require('./routes/efteraar');
const { smsRouter } = require('./routes/sms');
const { lodlisteRouter } = require('./routes/lodliste');
const { varRouter } = require('./routes/var');
const { hjemmesideRouter } = require('./routes/hjemmeside');
const { createRateLimiter } = require('./middleware/rateLimit');
const { paalaegAsyncFejlhaandtering } = require('./middleware/asyncFejl');

// Bygger Express-appen. `ws` (fra src/ws.js) er valgfri — bruges til at
// broadcaste state.changed når spillerdata/config ændres via API'et.
// `opts.adminRouterOpts` videresendes til adminRouter() — bruges KUN af
// tests til at injicere en stub for POST /admin/nulstil's pg_dump-kald (se
// src/backup.js), så testsuiten ikke kræver en rigtig pg_dump-klient.
function createApp(pool, ws, opts) {
  opts = opts || {};
  // Async-fejl i en handler må aldrig nå process-niveau (se middleware/asyncFejl.js).
  paalaegAsyncFejlhaandtering();
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

  // M3/M4: ÉN delt instans — IP-bred pin-/sletningsgrænse, nøjagtig samme
  // tæller for POST /players' login OG DELETE /me's pinkode-bekræftelse (se
  // src/routes/players.js#createIpLoginLimiter og API.md's "M4"-afsnit for
  // begrundelsen: et separat eksemplar pr. router ville omgå den fælles
  // beskyttelse).
  const ipLoginLimiter = createIpLoginLimiter();
  // Samme princip for sms-tilmeldinger pr. IP: ÉN delt instans til registrering og flueben.
  const smsIpLimiter = createSmsIpLimiter();

  app.use(healthRouter());
  app.use(stateRouter(pool));
  app.use(playersRouter(pool, ws, { ipLoginLimiter, smsIpLimiter }));
  app.use(meRouter(pool, ws, { ipLoginLimiter, smsIpLimiter }));
  app.use(runsRouter(pool, ws));
  app.use(adminRouter(pool, ws, opts.adminRouterOpts));
  app.use(partnersRouter(pool));
  app.use(konkurrenceRouter(pool));
  app.use(kampagneRouter(pool));
  app.use(efteraarRouter(pool));
  app.use(smsRouter(pool));
  app.use(lodlisteRouter(pool));
  app.use(varRouter(pool));
  app.use(hjemmesideRouter());

  app.use((req, res) => {
    res.status(404).json({ fejl: 'Ukendt endpoint.', kode: 'ikke_fundet' });
  });

  // Fejl-handler (dansk, ingen stack-traces til klienten).
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    // Klientfejl fra body-parseren (ugyldig JSON, for stor body) er 4xx, ikke 500.
    const klientFejl = err && Number.isInteger(err.status) && err.status >= 400 && err.status < 500;
    if (!klientFejl) console.error(err);
    if (res.headersSent) return;
    if (klientFejl) {
      return res.status(err.status).json({
        fejl: err.status === 413 ? 'Forespørgslen er for stor.' : 'Ugyldig forespørgsel.',
        kode: err.status === 413 ? 'for_stor' : 'ugyldigt_input',
      });
    }
    res.status(500).json({ fejl: 'Der skete en uventet serverfejl.', kode: 'serverfejl' });
  });

  return app;
}

module.exports = { createApp };
