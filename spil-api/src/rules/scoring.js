'use strict';

// ---------------------------------------------------------------------------
// Snydegrænser — se API.md, afsnit "Snydegrænser", for den fulde udledning.
// Disse er BEVIDST generøse lofter (plausibelt maks × ~1.5-1.8 margin), ikke
// et forsøg på at balancere spillet. De skal kun fange forfalskede/umulige
// indsendelser, aldrig en ægte dygtig spiller.
// ---------------------------------------------------------------------------
const ROUND_MAX = {
  1: 12000, // Pluk
  2: 21000, // Pak
  3: 12000, // Send
};

// Opfølgning (offline-kø): MIN/MAX er nu DEFAULT-værdier, config-overridable
// via cfg.minAktivSpilletidMs/cfg.maxAktivSpilletidMs (se
// src/rules/constants.js#DEFAULT_CFG og migrations/005_opfoelgning2.sql) —
// samme tal som før (70 sek.), men kan nu ændres uden redeploy.
const MIN_SPILLETID_MS = 70 * 1000;
// NYT loft (opfølgning): øvre grænse for klientens PÅSTÅEDE AKTIVE spilletid
// (spilletid_klient_ms) — IKKE en grænse på server_elapsed, som nu kan være
// vilkårligt lang (klienten kan have en offline-kø: spiller offline, forsøget
// gemmes lokalt, synkes senere samme (københavnske) dag). Se API.md.
const MAX_AKTIV_SPILLETID_MS = 240 * 1000;
// Clock-skew-tolerance: klienten må ikke påstå at have spillet AKTIVT
// længere, end der reelt er gået siden forsøget blev startet (server_elapsed
// >= spilletid_klient_ms - denne tolerance). Erstatter den gamle, symmetriske
// SPILLETID_TOLERANCE_MS (20 sek., begge retninger) — der er ikke længere
// noget krav om at server_elapsed skal være TÆT PÅ klientens tid, kun at det
// mindst har varet så længe.
const CLOCK_SKEW_TOLERANCE_MS = 5 * 1000;

function validateRoundScores(rounds) {
  if (!Array.isArray(rounds) || rounds.length !== 3) {
    return { ok: false, kode: 'ugyldigt_format', besked: 'Der skal indsendes præcis 3 runde-scorer.' };
  }
  for (let i = 0; i < 3; i++) {
    const v = rounds[i];
    if (!Number.isFinite(v) || v < 0 || !Number.isInteger(v)) {
      return { ok: false, kode: 'ugyldigt_format', besked: `Runde ${i + 1}'s score er ikke et gyldigt tal.` };
    }
    if (v > ROUND_MAX[i + 1]) {
      return {
        ok: false,
        kode: 'urealistisk_score',
        besked: `Runde ${i + 1}'s score (${v}) overstiger det maksimalt mulige og kan ikke godkendes.`,
      };
    }
  }
  return { ok: true };
}

// serverMs: server_elapsed = slut_server - start_server (kan nu være
// vilkårligt langt — se begrundelsen ovenfor). klientMs: klientens PÅSTÅEDE
// aktive spilletid (ekskl. evt. offline-ventetid). cfg: bruges til at slå de
// config-drevne MIN/MAX op (falder tilbage til de hardkodede DEFAULT-tal
// ovenfor hvis cfg mangler feltet/er ugyldigt).
function validateSpilletid(serverMs, klientMs, cfg) {
  cfg = cfg || {};
  const minTid = Number.isFinite(cfg.minAktivSpilletidMs) ? cfg.minAktivSpilletidMs : MIN_SPILLETID_MS;
  const maxAktiv = Number.isFinite(cfg.maxAktivSpilletidMs) ? cfg.maxAktivSpilletidMs : MAX_AKTIV_SPILLETID_MS;

  if (!Number.isFinite(klientMs) || klientMs < 0) {
    return { ok: false, kode: 'ugyldig_tid', besked: 'Klientens spilletid mangler eller er ugyldig.' };
  }
  if (klientMs < minTid) {
    return {
      ok: false,
      kode: 'for_kort_spilletid',
      besked: `Forsøget varede for kort til at være gyldigt (aktiv spilletid skal være mindst ${Math.round(minTid / 1000)} sekunder).`,
    };
  }
  if (klientMs > maxAktiv) {
    return {
      ok: false,
      kode: 'for_lang_spilletid',
      besked: `Den påståede aktive spilletid overstiger det maksimalt mulige (${Math.round(maxAktiv / 1000)} sekunder).`,
    };
  }
  // tid_mismatch bruges KUN når klienten påstår MERE aktiv tid, end der
  // reelt er gået i alt siden forsøget blev startet (server_elapsed) — IKKE
  // længere når server_elapsed blot er meget STØRRE end klientMs (det er
  // netop den forventede, legitime offline-kø-situation).
  if (serverMs < klientMs - CLOCK_SKEW_TOLERANCE_MS) {
    return {
      ok: false,
      kode: 'tid_mismatch',
      besked: 'Klienten hævder at have spillet aktivt længere, end der reelt er gået siden forsøget blev startet.',
    };
  }
  return { ok: true };
}

// Billige stats-konsistens-tjek. Bevidst løse (skal ikke fange ægte spillere,
// kun stats der er internt umulige).
function validateStatsKonsistens(s) {
  s = s || {};
  if ((s.packed || 0) < (s.tower || 0)) {
    return { ok: false, kode: 'ustats_konsistens', besked: 'Tårnhøjde kan ikke overstige antal pakkede kasser.' };
  }
  if ((s.fast || 0) > 0 && (s.orders || 0) < 1) {
    return { ok: false, kode: 'ustats_konsistens', besked: 'Der er en hurtigste-ordre-tid uden nogen fuldførte ordrer.' };
  }
  if ((s.perfects || 0) > (s.packed || 0)) {
    return { ok: false, kode: 'ustats_konsistens', besked: 'Antal perfekte kasser kan ikke overstige antal pakkede kasser.' };
  }
  if ((s.streak || 0) > (s.packed || 0)) {
    return { ok: false, kode: 'ustats_konsistens', besked: 'Stak-streak kan ikke overstige antal pakkede kasser.' };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Mærker (BADGES) — eksakt regelsæt fra spil/index.html.
// a: det netop afsluttede forsøg { samlet, s, bf, rounds }.
// c: kontekst { rank, others, days } EFTER forsøget er gemt.
// already: array af badge-navne spilleren allerede har.
// ---------------------------------------------------------------------------
function evaluateBadges(a, c, already) {
  const s = a.s || {};
  const has = new Set(already || []);
  const candidates = [
    ['fejlfri', (s.orders || 0) >= 5 && (s.errors || 0) === 0],
    ['lyn', (s.fast || 0) > 0 && s.fast < 2],
    ['kombo', (s.combo || 0) >= 15],
    ['taarn', (s.tower || 0) >= 15],
    ['milli', (s.streak || 0) >= 5],
    ['retur', (s.rets || 0) >= 5],
    ['ingen', (s.strikes || 0) === 0 && (s.sent || 0) >= 10],
    ['overblik', (s.pus || 0) + (s.partners || 0) >= 3 || (s.pus || 0) >= 2],
    ['partner', (s.partners || 0) >= 2],
    ['bf', !!a.bf],
    ['podie', c.rank > 0 && c.rank <= 3],
    ['boss', c.rank === 1 && c.others > 0],
    ['stamkunde', c.days >= 3],
  ];
  const nye = [];
  for (const [navn, ok] of candidates) {
    if (ok && !has.has(navn)) nye.push(navn);
  }
  return nye;
}

// ---------------------------------------------------------------------------
// Metrikker (MET) — bruges til rank()/records()/feats. RECORDS er den
// delmængde der indgår i dagens/personlige rekord-feats.
// ---------------------------------------------------------------------------
const RECORDS = ['fast', 'orders', 'combo', 'tower', 'streak', 'sent', 'rets', 'r1', 'r2', 'r3'];

// low: lavere er bedre. zero: 0 er en gyldig værdi (ellers tæller kun >0).
const MET = {
  total: { low: false, zero: true },
  orders: { low: false, zero: false },
  fast: { low: true, zero: false },
  combo: { low: false, zero: false },
  tower: { low: false, zero: false },
  streak: { low: false, zero: false },
  sent: { low: false, zero: false },
  rets: { low: false, zero: false },
  r1: { low: false, zero: false },
  r2: { low: false, zero: false },
  r3: { low: false, zero: false },
};

// Udtræk en metrikværdi fra et forsøg { samlet, rounds:[r1,r2,r3], s:{...} }.
function metricValue(metricKey, a) {
  let v;
  if (metricKey === 'total') v = a.samlet;
  else if (metricKey === 'r1') v = a.rounds ? a.rounds[0] : undefined;
  else if (metricKey === 'r2') v = a.rounds ? a.rounds[1] : undefined;
  else if (metricKey === 'r3') v = a.rounds ? a.rounds[2] : undefined;
  else v = a.s ? a.s[metricKey] : undefined;

  if (v === undefined || v === null) return undefined;
  const m = MET[metricKey];
  if (m && !m.zero && v <= 0) return undefined;
  return v;
}

function isBetter(metricKey, a, b) {
  const m = MET[metricKey] || { low: false };
  return m.low ? a < b : a > b;
}

module.exports = {
  ROUND_MAX,
  MIN_SPILLETID_MS,
  MAX_AKTIV_SPILLETID_MS,
  CLOCK_SKEW_TOLERANCE_MS,
  validateRoundScores,
  validateSpilletid,
  validateStatsKonsistens,
  evaluateBadges,
  RECORDS,
  MET,
  metricValue,
  isBetter,
};
