'use strict';

// Packrush Efterårsferieudfordring 2026 (vilkår: /spil/efteraar/).
// Åben, gratis konkurrence, ADSKILT fra messe-turneringen:
//  - ét lod pr. person pr. dansk kalenderdag med mindst ét godkendt spil i perioden
//  - spillere fra firmaer på konferencens deltagerliste (eller udelukkede firmaer,
//    fx SmartPack) får først lodder for spil afsluttet efter messe-turneringen
//    (KONF_SLUT); deres spil i turneringen tæller aldrig her
//  - flere spil, vennekoder, ekstra liv, power-ups og samtykker giver ingen ekstra lodder
//  - topscoren (bedste godkendte spil i perioden, samme regel) vinder 2 flasker
//  - lodtrækningen: 1 vinder + 2 reserver blandt alle lodder
// Påvirker aldrig messe-turneringens lodder (src/konkurrence.js).

const crypto = require('crypto');
const { matchNoegle } = require('./konkurrence');

const START = new Date('2026-10-06T00:00:00+02:00');
const KONF_SLUT = new Date('2026-10-08T16:30:00+02:00');
const SLUT = new Date('2026-10-18T23:59:59+02:00');

async function messeNoegler(db) {
  const { rows } = await db.query('SELECT firma_noegle FROM deltagerliste_firma');
  const s = new Set(rows.map((r) => r.firma_noegle));
  const { rows: k } = await db.query('SELECT udelukkede_firmaer FROM konkurrence WHERE id = 1');
  String((k[0] && k[0].udelukkede_firmaer) || '')
    .split(',')
    .map((x) => matchNoegle(x))
    .filter(Boolean)
    .forEach((n) => s.add(n));
  return s;
}

async function beregn(db) {
  const messe = await messeNoegler(db);
  const { rows } = await db.query(
    `SELECT s.id AS spiller_id, s.navn, s.email, s.firma, f.samlet,
            COALESCE(f.slut_server, f.oprettet) AS tid,
            (COALESCE(f.slut_server, f.oprettet) AT TIME ZONE 'Europe/Copenhagen')::date::text AS dag
       FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
      WHERE f.status = 'godkendt' AND f.samlet IS NOT NULL AND s.skjult = false
        AND COALESCE(f.slut_server, f.oprettet) >= $1 AND COALESCE(f.slut_server, f.oprettet) <= $2`,
    [START, SLUT]
  );
  const pr = new Map();
  for (const r of rows) {
    const noegle = matchNoegle(r.firma);
    const erMesse = noegle && messe.has(noegle);
    if (erMesse && new Date(r.tid) <= KONF_SLUT) continue; // messe-spillere: først efter turneringen
    const id = String(r.spiller_id);
    let p = pr.get(id);
    if (!p) { p = { spiller_id: id, navn: r.navn, email: r.email, firma: r.firma, dage: new Set(), bedste: 0, bedste_tid: null }; pr.set(id, p); }
    p.dage.add(r.dag);
    if (r.samlet > p.bedste || (r.samlet === p.bedste && new Date(r.tid) < new Date(p.bedste_tid))) { p.bedste = r.samlet; p.bedste_tid = r.tid; }
  }
  const spillere = [...pr.values()].map((p) => ({ ...p, lodder: p.dage.size, dage: [...p.dage].sort() }))
    .sort((a, b) => b.lodder - a.lodder || a.spiller_id.localeCompare(b.spiller_id));
  const top = [...spillere].sort((a, b) => b.bedste - a.bedste || new Date(a.bedste_tid) - new Date(b.bedste_tid));
  const nu = new Date();
  return {
    start: START, konf_slut: KONF_SLUT, slut: SLUT,
    periode: nu < START ? 'foer' : nu > SLUT ? 'efter' : 'nu',
    spillere, top: top.slice(0, 10),
    lodder_i_alt: spillere.reduce((a, p) => a + p.lodder, 0),
  };
}

// Trækning: type 'lod' = tilfældig blandt lodder (1 vinder + 2 reserver),
// type 'top' = bedste score (ingen tilfældighed). Gemmes altid med grundlag.
async function traek(pool, type, adminSessionId) {
  const g = await beregn(pool);
  if (!g.spillere.length) return null;
  let vinder = null, tal = null;
  const reserver = [];
  if (type === 'top') {
    vinder = g.top[0];
    g.top.slice(1, 3).forEach((p) => reserver.push({ spiller_id: p.spiller_id, navn: p.navn, email: p.email, bedste: p.bedste }));
  } else {
    let pulje = g.spillere.slice();
    const vaelg = () => {
      const total = pulje.reduce((a, p) => a + p.lodder, 0);
      if (!total) return null;
      let x = crypto.randomInt(0, total);
      const t = x;
      for (const p of pulje) { if (x < p.lodder) { pulje = pulje.filter((q) => q !== p); return { p, t }; } x -= p.lodder; }
      return null;
    };
    const v = vaelg(); vinder = v.p; tal = v.t;
    for (let i = 0; i < 2; i++) { const r = vaelg(); if (r) reserver.push({ spiller_id: r.p.spiller_id, navn: r.p.navn, email: r.p.email, lodder: r.p.lodder }); }
  }
  const grundlag = type === 'top'
    ? g.top.map((p) => ({ spiller_id: p.spiller_id, bedste: p.bedste, tid: p.bedste_tid }))
    : g.spillere.map((p) => ({ spiller_id: p.spiller_id, lodder: p.lodder, dage: p.dage }));
  const { rows } = await pool.query(
    `INSERT INTO efteraar_traekning (type, admin_session_id, grundlag, lodder_i_alt, tilfaeldigt_tal, vinder_spiller_id, vinder_navn, vinder_email, reserver)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, tidspunkt`,
    [type, adminSessionId || null, JSON.stringify(grundlag), g.lodder_i_alt, tal, vinder.spiller_id, vinder.navn, vinder.email, JSON.stringify(reserver)]
  );
  return { id: String(rows[0].id), tidspunkt: rows[0].tidspunkt, type, vinder: { navn: vinder.navn, email: vinder.email, firma: vinder.firma, lodder: vinder.lodder, bedste: vinder.bedste }, reserver, lodder_i_alt: g.lodder_i_alt };
}

module.exports = { beregn, traek, START, KONF_SLUT, SLUT };
