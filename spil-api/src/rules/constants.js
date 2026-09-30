'use strict';

// Portering af konstanterne fra spil/index.html (klientens "facitliste").
// RØR IKKE disse tal uden at opdatere API.md's "Snydegrænser"-afsnit.

const ROUND_T = 30; // sekunder pr. runde
const REGEN_MS = 30 * 60000; // 30 min pr. naturligt regenereret liv
const REGEN_CAP = 3; // maks. liv naturlig regen kan nå op til
// Packrush (commit ec81ec6e1 i spil/index.html): øvre loft for ALT liv en
// spiller kan have ad gangen — dagligt grundtal, dagens-flueben-bonus,
// sms-boost og gaveliv (udfordring/vennekode) klemmes alle til dette loft.
const MAX_LIVES = 7;
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ingen 0/1/I/O

const DEFAULT_CFG = {
  // Packrush: sænket fra 5 til 3 (se API.md, "Packrush-ændringer").
  perDay: 3,
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
  smsOn: true,
  mailPartners: 'Herodesk, Revershero, Active Promotion, Sprii, Element Logic',
  lifeBonus: true,
  referral: true,
  fixed: true,
  hourly: true,
  hourPrize: '',
  duel: true,
  smsBoost: true,
  boostLives: 2,
  shareUrl: '',
  // Opfølgning: MIN/MAX for klientens PÅSTÅEDE aktive spilletid ved
  // POST /runs/:id/finish — config-drevne (kan ændres uden redeploy), se
  // src/rules/scoring.js#validateSpilletid og API.md, "Snydegrænser".
  minAktivSpilletidMs: 70000,
  maxAktivSpilletidMs: 240000,
};

module.exports = { ROUND_T, REGEN_MS, REGEN_CAP, MAX_LIVES, CODE_ABC, DEFAULT_CFG };
