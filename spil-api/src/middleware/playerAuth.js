'use strict';

const { loadPlayerByToken } = require('../spillerToken');

function bearerToken(req) {
  const h = req.headers['authorization'];
  if (!h || typeof h !== 'string') return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

// Kræver et gyldigt spiller-bearer-token. Sætter req.player = spiller-række.
// Opgave C: slår op i spiller_token (flere samtidige tokens pr. spiller er
// tilladt), ikke længere et enkelt felt på spiller — se src/spillerToken.js.
function requirePlayer(pool) {
  return async function (req, res, next) {
    const token = bearerToken(req);
    if (!token) {
      return res.status(401).json({ fejl: 'Mangler adgangstoken.', kode: 'ingen_token' });
    }
    try {
      const row = await loadPlayerByToken(pool, token);
      if (!row) {
        return res.status(401).json({ fejl: 'Ugyldigt adgangstoken.', kode: 'ugyldigt_token' });
      }
      req.player = row;
      next();
    } catch (e) {
      next(e);
    }
  };
}

// Valgfri variant: sætter req.player hvis token er gyldigt, ellers null (bruges af WS).
async function tryLoadPlayer(pool, token) {
  try {
    return await loadPlayerByToken(pool, token);
  } catch (e) {
    return null;
  }
}

module.exports = { requirePlayer, bearerToken, tryLoadPlayer };
