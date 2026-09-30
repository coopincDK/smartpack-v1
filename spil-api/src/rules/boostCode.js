'use strict';

const { CODE_ABC } = require('./constants');

// Eksakt port af hashStr(s) fra spil/index.html. Brug IKKE Number-aritmetik
// her — Math.imul/>>>/<< skal bruges præcis som i klientens JS, ellers
// matcher dagens boostkode ikke det spillerne får vist/sms'et.
function hashStr(s) {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

// Eksakt port af boostCode(day) fra spil/index.html. `pin` er cfg.pin
// (arrangør-PIN'en, hemmeligt config-felt — se config.hemmelig.pin).
function boostCode(day, pin) {
  let h = hashStr('liv:' + day + ':' + pin);
  let c = '';
  for (let i = 0; i < 4; i++) {
    c += CODE_ABC[h % CODE_ABC.length];
    h = (Math.floor(h / CODE_ABC.length) ^ hashStr(c)) >>> 0;
  }
  return c;
}

module.exports = { hashStr, boostCode };
