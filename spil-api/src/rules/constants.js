'use strict';

// Portering af konstanterne fra spil/index.html (klientens "facitliste").
// RØR IKKE disse tal uden at opdatere API.md's "Snydegrænser"-afsnit.

const ROUND_T = 30; // sekunder pr. runde
const REGEN_MS = 30 * 60000; // 30 min pr. naturligt regenereret liv
const REGEN_CAP = 3; // maks. liv naturlig regen kan nå op til
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ingen 0/1/I/O

const DEFAULT_CFG = {
  perDay: 5,
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
};

module.exports = { ROUND_T, REGEN_MS, REGEN_CAP, CODE_ABC, DEFAULT_CFG };
