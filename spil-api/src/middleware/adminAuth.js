'use strict';

const crypto = require('crypto');
const { sha256Hex } = require('../crypto');

const COOKIE_NAME = 'spil_admin_session';

function parseCookies(req) {
  const header = req.headers['cookie'];
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

// Path=/ (ikke "/admin"): browserens cookie-path-matching bruger den
// FAKTISKE offentlige sti klienten ramte (fx "/api/spil/admin/login" bag
// fase 2's nginx-præfiksstrip), ikke Express-appens interne route-sti. Med
// Path=/admin sendte browseren aldrig cookien tilbage i produktion, og
// hele admin-loginet var reelt dødt. Se API.md/nginx-opsætningen.
function setSessionCookie(res, token, cookieSecure, maxAgeMs) {
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
  ];
  if (cookieSecure) attrs.push('Secure');
  res.set('Set-Cookie', attrs.join('; '));
}

function clearSessionCookie(res, cookieSecure) {
  const attrs = [`${COOKIE_NAME}=`, 'HttpOnly', 'SameSite=Strict', 'Path=/', 'Max-Age=0'];
  if (cookieSecure) attrs.push('Secure');
  res.set('Set-Cookie', attrs.join('; '));
}

// rolle: 'admin' (fuld adgang) eller 'stand' (kun ret til at se fulde navne,
// se POST /stand-login og API.md, afsnit "Stand-login-flow").
async function createSession(pool, ttlMs, rolle) {
  rolle = rolle === 'stand' ? 'stand' : 'admin';
  const token = crypto.randomBytes(32).toString('hex');
  const id = crypto.randomUUID();
  const tokenHash = sha256Hex(token);
  const udloeber = new Date(Date.now() + ttlMs);
  await pool.query(
    'INSERT INTO admin_session (id, token_hash, udloeber, rolle) VALUES ($1, $2, $3, $4)',
    [id, tokenHash, udloeber, rolle]
  );
  return token;
}

async function destroySession(pool, token) {
  if (!token) return;
  await pool.query('DELETE FROM admin_session WHERE token_hash = $1', [sha256Hex(token)]);
}

// Slår sessionens ROLLE op ud fra et RÅT session-token (ikke en request) —
// den fælles implementering bag resolveSessionRole() nedenfor. Bruges også
// direkte af src/ws.js til at GENvalidere en allerede-åben WS-forbindelses
// rolle (periodisk + lige før enhver besked der ville afsløre fulde navne),
// da en WS-forbindelse ikke har en frisk request/cookie-header at slå op på
// efter selve håndtrykket — kun det token den fangede ved forbindelses-
// tidspunktet.
async function resolveRoleForToken(pool, token) {
  if (!token) return null;
  try {
    const { rows } = await pool.query(
      'SELECT rolle FROM admin_session WHERE token_hash = $1 AND udloeber > now()',
      [sha256Hex(token)]
    );
    return rows.length ? rows[0].rolle : null;
  } catch (e) {
    return null;
  }
}

// Slår sessionens ROLLE op ud fra en request's cookie, uden at afvise/kaste
// hvis der ingen er (i modsætning til requireAdmin nedenfor) — bruges af
// GET /state og WS-håndtrykket til at afgøre om fulde navne må vises.
// Virker både på et Express-req og på et rå http.IncomingMessage (WS-
// upgrade-requesten har ikke Express' request-udvidelser).
async function resolveSessionRole(pool, req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  return resolveRoleForToken(pool, token);
}

// Kræver en gyldig, ikke-udløbet admin-session-cookie MED rolle='admin'.
// En 'stand'-session (kun navne-visning) afvises her med 403 — den har
// bevidst INGEN andre admin-rettigheder (ingen CSV, config, sletning,
// lodtrækning), se API.md.
function requireAdmin(pool) {
  return async function (req, res, next) {
    const cookies = parseCookies(req);
    const token = cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ fejl: 'Ikke logget ind som admin.', kode: 'ingen_session' });
    }
    try {
      const tokenHash = sha256Hex(token);
      const { rows } = await pool.query(
        'SELECT * FROM admin_session WHERE token_hash = $1 AND udloeber > now()',
        [tokenHash]
      );
      if (!rows.length) {
        return res.status(401).json({ fejl: 'Admin-session er udløbet eller ugyldig.', kode: 'udloebet_session' });
      }
      if (rows[0].rolle !== 'admin') {
        return res
          .status(403)
          .json({ fejl: 'Denne handling kræver fuld admin-adgang.', kode: 'kraever_admin' });
      }
      // Personligt admin-login (014_admin_brugere.sql): brugeren skal være
      // aktiv, og startkoden skal skiftes, før andet end kodeskift er tilladt.
      if (rows[0].bruger_id) {
        const b = await pool.query('SELECT id, email, navn, aktiv, skal_skifte_kode FROM admin_bruger WHERE id = $1', [
          rows[0].bruger_id,
        ]);
        const bruger = b.rows[0];
        if (!bruger || !bruger.aktiv) {
          return res.status(401).json({ fejl: 'Dit admin-login er lukket.', kode: 'udloebet_session' });
        }
        const tilladt = req.path === '/admin/skift-kode' || req.path === '/admin/mig' || req.path === '/admin/logout';
        if (bruger.skal_skifte_kode && !tilladt) {
          return res.status(403).json({ fejl: 'Vælg din egen kode først.', kode: 'skal_skifte_kode' });
        }
        req.adminBruger = bruger;
      }
      await pool.query('UPDATE admin_session SET sidst_brugt = now() WHERE id = $1', [rows[0].id]);
      req.adminSession = rows[0];
      next();
    } catch (e) {
      next(e);
    }
  };
}

// Afviser ALDRIG (i modsætning til requireAdmin) — sætter blot
// req.viewerPrivileged, til brug af GET /state (se src/routes/state.js).
function attachViewerRole(pool) {
  return async function (req, res, next) {
    const rolle = await resolveSessionRole(pool, req);
    req.viewerPrivileged = rolle === 'admin' || rolle === 'stand';
    next();
  };
}

module.exports = {
  COOKIE_NAME,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  createSession,
  destroySession,
  resolveSessionRole,
  resolveRoleForToken,
  requireAdmin,
  attachViewerRole,
};
