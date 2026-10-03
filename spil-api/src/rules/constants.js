'use strict';

// Portering af konstanterne fra spil/index.html (klientens "facitliste").
// RØR IKKE disse tal uden at opdatere API.md's "Snydegrænser"-afsnit.

const ROUND_T = 30; // sekunder pr. runde
// Liv (Martins regler 3. okt. 2026, se API.md "Liv"): man starter dagen med
// cfg.perDay liv (1). Når de er brugt, kommer der ét nyt pr. REGEN_MS (en
// time), op til REGEN_CAP (= cfg.perDay, dvs. 1) — uanset flueben. Hvert
// flueben ved SmartPack/en partner giver +1 liv med det samme, én gang pr.
// liste pr. dag. Bonusliv regenereres ikke, de bruges bare.
const REGEN_MS = 60 * 60000; // 1 time pr. naturligt regenereret liv
const REGEN_CAP = 1; // standardloft for naturlig regen (overstyres af cfg.perDay)
function regenCap(cfg) {
  const n = cfg && cfg.perDay != null ? Number(cfg.perDay) : REGEN_CAP;
  return Number.isFinite(n) && n > 0 ? n : REGEN_CAP;
}
// Packrush (commit ec81ec6e1 i spil/index.html): øvre loft for ALT liv en
// spiller kan have ad gangen — dagligt grundtal, dagens-flueben-bonus,
// sms-boost og gaveliv (udfordring/vennekode) klemmes alle til dette loft.
const MAX_LIVES = 12;
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ingen 0/1/I/O

const DEFAULT_CFG = {
  // Packrush: 1 liv i start, nyt liv hver time, +1 pr. flueben (se API.md, "Liv").
  perDay: 1,
  bf: true,
  crownOn: true,
  crownTime: '16:00',
  mission: 'total',
  goal: 0,
  periodName: 'Hele messen',
  periodStart: '2000-01-01',
  teams: true,
  raffle: true,
  eventName: '',
  pin: '8500',
  partners: true,
  prize: '',
  smsSponsor: 'InMobile',
  smsOn: false,
  mailPartners: 'Herodesk, Revershero, Active Promotion, Sprii, Element Logic',
  lifeBonus: true,
  referral: true,
  fixed: true,
  hourly: true,
  hourPrize: '',
  duel: true,
  smsBoost: false,
  boostLives: 2,
  shareUrl: '',
  // Opfølgning: MIN/MAX for klientens PÅSTÅEDE aktive spilletid ved
  // POST /runs/:id/finish — config-drevne (kan ændres uden redeploy), se
  // src/rules/scoring.js#validateSpilletid og API.md, "Snydegrænser".
  minAktivSpilletidMs: 70000,
  maxAktivSpilletidMs: 240000,
};

module.exports = { ROUND_T, REGEN_MS, REGEN_CAP, regenCap, MAX_LIVES, CODE_ABC, DEFAULT_CFG };
