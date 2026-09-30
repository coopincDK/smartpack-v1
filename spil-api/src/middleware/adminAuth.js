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

async function createSession(pool, ttlMs) {
  const token = crypto.randomBytes(32).toString('hex');
  const id = crypto.randomUUID();
  const tokenHash = sha256Hex(token);
  const udloeber = new Date(Date.now() + ttlMs);
  await pool.query(
    'INSERT INTO admin_session (id, token_hash, udloeber) VALUES ($1, $2, $3)',
    [id, tokenHash, udloeber]
  );
  return token;
}

async function destroySession(pool, token) {
  if (!token) return;
  await pool.query('DELETE FROM admin_session WHERE token_hash = $1', [sha256Hex(token)]);
}

// Kræver en gyldig, ikke-udløbet admin-session-cookie.
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
      await pool.query('UPDATE admin_session SET sidst_brugt = now() WHERE id = $1', [rows[0].id]);
      req.adminSession = rows[0];
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports = {
  COOKIE_NAME,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  createSession,
  destroySession,
  requireAdmin,
};
