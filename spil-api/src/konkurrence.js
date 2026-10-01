'use strict';

// Konkurrencen (tabellen `konkurrence`, én række) styrer sig selv ud fra
// datoerne — se API.md, afsnit "Partnere", "Konkurrencens faser":
//   ingen      = ingen lodtrækningsdato udfyldt
//   kommende   = start er udfyldt og ligger i fremtiden
//   aktiv      = (start er passeret eller ikke udfyldt) og lodtrækningen ligger i fremtiden
//   afsluttet  = lodtrækningen er passeret
// Spillet viser kun vinder-, præmie- og lodtekster i fasen "aktiv".

function ms(v) {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
}

function fase(k, nu) {
  const n = nu == null ? Date.now() : nu;
  const slut = ms(k && k.lodtraekning);
  if (slut === null) return 'ingen';
  const start = ms(k && k.start);
  if (start !== null && n < start) return 'kommende';
  if (n < slut) return 'aktiv';
  return 'afsluttet';
}

function iso(v) {
  const t = ms(v);
  return t === null ? null : new Date(t).toISOString();
}

// Offentlig visning (GET /praemier og /state).
function konkurrenceView(k, nu) {
  const f = fase(k, nu);
  const aktiv = f === 'aktiv';
  return {
    navn: k ? k.navn : '',
    start: iso(k && k.start),
    lodtraekning: iso(k && k.lodtraekning),
    fase: f,
    aktiv,
    tekst: aktiv || f === 'kommende' ? (k.tekst_aktiv || '') : (k ? k.tekst_slut : ''),
    vinder:
      k && k.vinder_navn
        ? { navn: k.vinder_navn, firma: k.vinder_firma || '', dato: k.vinder_dato || null, tekst: k.vinder_tekst || '' }
        : null,
  };
}

async function hentKonkurrence(pool) {
  const { rows } = await pool.query('SELECT * FROM konkurrence WHERE id = 1');
  return rows[0] || null;
}

// Tidsrummet, der giver lodder i konkurrencens lodtrækning: fra start (eller
// tidernes morgen) til lodtrækningen. null = ingen konkurrence udfyldt, så
// arrangør-opsætningens egen periode gælder.
function lodVindue(k) {
  if (!k || !k.lodtraekning) return null;
  return { fra: k.start ? iso(k.start) : null, til: iso(k.lodtraekning) };
}

module.exports = { fase, konkurrenceView, hentKonkurrence, lodVindue };
