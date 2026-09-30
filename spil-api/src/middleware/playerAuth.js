'use strict';

const { sha256Hex } = require('../crypto');

function bearerToken(req) {
  const h = req.headers['authorization'];
  if (!h || typeof h !== 'string') return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

// Kræver et gyldigt spiller-bearer-token. Sætter req.player = spiller-række.
function requirePlayer(pool) {
  return async function (req, res, next) {
    const token = bearerToken(req);
    if (!token) {
      return res.status(401).json({ fejl: 'Mangler adgangstoken.', kode: 'ingen_token' });
    }
    try {
      const tokenHash = sha256Hex(token);
      const { rows } = await pool.query('SELECT * FROM spiller WHERE token_hash = $1', [tokenHash]);
      if (!rows.length || rows[0].skjult) {
        return res.status(401).json({ fejl: 'Ugyldigt adgangstoken.', kode: 'ugyldigt_token' });
      }
      req.player = rows[0];
      next();
    } catch (e) {
      next(e);
    }
  };
}

// Valgfri variant: sætter req.player hvis token er gyldigt, ellers null (bruges af WS).
async function tryLoadPlayer(pool, token) {
  if (!token) return null;
  const tokenHash = sha256Hex(token);
  const { rows } = await pool.query('SELECT * FROM spiller WHERE token_hash = $1', [tokenHash]);
  if (!rows.length || rows[0].skjult) return null;
  return rows[0];
}

module.exports = { requirePlayer, bearerToken, tryLoadPlayer };
