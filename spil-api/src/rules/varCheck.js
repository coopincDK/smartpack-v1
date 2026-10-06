'use strict';

// VAR: tegn på et automatiseret spil. Grænserne ligger et godt stykke over, hvad
// et menneske på en telefon kan (typisk: 1-3 perfekte i træk, hurtigste pluk ~2 sek.,
// 6-8 ordrer). Et spil, der rammer én af dem, kommer ikke på tavlen, før arrangøren
// har kigget på det; spilleren kan anmode om et VAR-tjek.
const GRAENSER = {
  perfekteITraek: 20, // Pak: perfekte kasser i træk
  hurtigstePlukSek: 0.8, // Pluk: hurtigste ordre under dette
  ordrer: 18, // Pluk: ordrer på 30 sek.
  taarn: 35, // Pak: tårnhøjde
  kombo: 60, // Pluk: kombo
  pakPoint: 12000, // Pak-rundens point
};

function mistaenkt(s, rounds) {
  const g = [];
  s = s || {};
  if ((s.streak || 0) >= GRAENSER.perfekteITraek) g.push(`${s.streak} perfekte kasser i træk`);
  if (s.fast && s.fast > 0 && s.fast < GRAENSER.hurtigstePlukSek) g.push(`pluk på ${s.fast} sek.`);
  if ((s.orders || 0) >= GRAENSER.ordrer) g.push(`${s.orders} ordrer i Pluk`);
  if ((s.tower || 0) >= GRAENSER.taarn) g.push(`tårn på ${s.tower} kasser`);
  if ((s.combo || 0) >= GRAENSER.kombo) g.push(`kombo på ${s.combo}`);
  if (rounds && (rounds[1] || 0) >= GRAENSER.pakPoint) g.push(`${rounds[1]} point i Pak`);
  return g;
}

module.exports = { mistaenkt, GRAENSER };
