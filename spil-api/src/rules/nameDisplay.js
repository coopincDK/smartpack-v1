'use strict';

// Packrush, opgave B: fornavn + efternavns-forbogstav til IKKE-privilegerede
// visninger (GET /state som udgangspunkt, WS-presence/duel-events). Fulde
// navne vises kun til forbindelser med en gyldig admin- eller
// stand-session — se src/middleware/adminAuth.js#resolveSessionRole og
// API.md, "Packrush-ændringer".
function shortName(navn) {
  const parts = String(navn || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const sidsteInitial = parts[parts.length - 1].charAt(0);
  return sidsteInitial ? `${first} ${sidsteInitial}.` : first;
}

module.exports = { shortName };
