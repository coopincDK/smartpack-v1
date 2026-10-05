'use strict';

// De offentlige formular-endpoints (kontaktformularen og kampagnetilmeldingen)
// skal kun kaldes fra smartpack.dk. Browsere sender altid Origin på en POST;
// Referer bruges, hvis Origin mangler. Det stopper ikke et bevidst script (som
// kan skrive headeren selv), men fjerner de simple bots og tilfældige curl-kald.
// SPIL_TILLADTE_ORIGINS (kommasepareret) kan udvide listen, fx til en teststage.

const STANDARD = ['https://smartpack.dk', 'https://www.smartpack.dk'];

function tilladte() {
  const extra = (process.env.SPIL_TILLADTE_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return STANDARD.concat(extra);
}

function kraevSmartpackOrigin(req, res, next) {
  let origin = req.get('origin');
  if (!origin) {
    const ref = req.get('referer');
    if (ref) {
      try {
        origin = new URL(ref).origin;
      } catch (e) {
        origin = null;
      }
    }
  }
  if (origin && tilladte().includes(origin)) return next();
  return res.status(403).json({ fejl: 'Forespørgslen kom ikke fra smartpack.dk.', kode: 'forkert_origin' });
}

module.exports = { kraevSmartpackOrigin };
