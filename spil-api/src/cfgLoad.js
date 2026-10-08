'use strict';

// Indlæser den offentlige config og lægger de aktive partnere ind som
// tilmeldingslister. Fra partnervilkår v1 (2. okt. 2026) styres partnernes
// mail-lister af partner-tabellen (partnerportalen), ikke af fritekstfeltet
// `mailPartners` i config:
//  - cfg.mailPartners bliver en kommasepareret liste af partnernes faste id
//    (slug), så samtykket gemmes som 'partner:<slug>' og ikke afhænger af,
//    at partneren skifter navn.
//  - cfg.partnerLister har navn og den faste samtykketekst (inkl. firma og
//    CVR) pr. partner til spillets flueben.
// Findes der ingen synlige partnere endnu, bruges config'ens gamle
// `mailPartners` uændret (bagudkompatibelt).

const { erSynlig, samtykkeTekst } = require('./partners');
const { SMS_SAMTYKKE_TEKST } = require('./rules/life');

async function partnerLister(db) {
  const { rows } = await db.query(
    `SELECT * FROM partner WHERE status = 'aktiv' AND vist_i_spil = true AND samler_mails = true ORDER BY navn ASC`
  );
  return rows.filter(erSynlig).map((p) => ({
    slug: p.slug,
    navn: p.navn,
    tekst: samtykkeTekst(p),
    privatlivspolitik: p.privatlivspolitik,
  }));
}

function medPartnere(offentlig, lister) {
  const cfg = { ...(offentlig || {}) };
  // Sms-samtykketeksten ejes af serveren; klienten viser den (gemmes ikke i config).
  cfg.smsTekst = SMS_SAMTYKKE_TEKST;
  if (lister && lister.length) {
    cfg.mailPartners = lister.map((l) => l.slug).join(', ');
    cfg.partnerLister = lister;
  } else {
    delete cfg.partnerLister;
  }
  return cfg;
}

async function loadOffentligCfg(db) {
  const { rows } = await db.query('SELECT offentlig FROM config WHERE id = 1');
  const offentlig = (rows[0] && rows[0].offentlig) || {};
  return medPartnere(offentlig, await partnerLister(db));
}

module.exports = { loadOffentligCfg, medPartnere, partnerLister };
