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
  // Første BOGSTAV i efternavnet (ikke charAt(0)): et efternavn, der starter med en emoji eller et
  // andet tegn uden for BMP, gav ellers et halvt tegn, som vises som "�" på toplisten og skærmen.
  const m = parts[parts.length - 1].match(/\p{L}/u);
  return m ? `${first} ${m[0].toUpperCase()}.` : first;
}

// Sentinel-værdien src/playerDeletion.js skriver ind i stedet for en slettet
// spillers navn (notifikation.data.by/.fra, forsoeg.duel.vs). Skal ALDRIG
// selv maskeres videre af shortName() — "Slettet spiller" ville ellers blive
// forvansket til det vildledende "Slettet s.".
const SLETTET_SPILLER = 'Slettet spiller';

// Fælles maskeringsregel til ALT navnevisning uden for GET /state (denne
// runde: GET /me's notifikationer, se src/routes/me.js) — samme regel som
// GET /state allerede bruger (src/publicState.js#toPublicView): fuldt navn
// kun ved en gyldig admin/stand-session (`privileged`), ellers `shortName()`.
// Sentinel-værdien ovenfor undtages altid fra maskering, uanset privilegie.
function maskedName(navn, privileged) {
  if (navn === SLETTET_SPILLER) return SLETTET_SPILLER;
  return privileged ? navn : shortName(navn);
}

module.exports = { shortName, maskedName, SLETTET_SPILLER };
