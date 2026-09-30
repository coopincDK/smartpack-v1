'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  lifeState,
  useLife,
  refill,
  setSubsPure,
  subKeys,
  lifeKeys,
  dailyStart,
} = require('../src/rules/life');
const { REGEN_MS, REGEN_CAP, DEFAULT_CFG } = require('../src/rules/constants');

const cfg = { ...DEFAULT_CFG, mailPartners: 'Herodesk, Sprii', smsOn: true, smsSponsor: 'InMobile' };

test('dailyStart tæller abonnementer med (kun dem der giver liv)', () => {
  const p = { marketing: true, mailTo: ['Herodesk'], notify: true };
  // marketing ('sp') giver IKKE liv, Herodesk + sms giver liv -> perDay(5) + 2
  assert.equal(dailyStart(p, cfg), 7);
  assert.equal(subKeys(p).length, 3);
  assert.equal(lifeKeys(p, cfg).length, 2);
});

test('lifeState nulstiller ved dags-skift til dailyStart minus dagens forsøg', () => {
  const p = { marketing: false, mailTo: ['Herodesk'], notify: false };
  const igaar = new Date('2026-01-01T10:00:00Z');
  const idag = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-01', n: 0, t: igaar.getTime(), g: [] };
  const bag1 = lifeState(bag0, p, cfg, idag, 0);
  assert.equal(bag1.day, '2026-01-02');
  assert.equal(bag1.n, dailyStart(p, cfg)); // 5 + 1 (Herodesk)
});

test('lifeState regenererer liv over tid, med cap', () => {
  const p = { marketing: false, mailTo: ['Herodesk'], notify: false };
  const t0 = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-02', n: 0, t: t0.getTime(), g: [] };
  const senere = new Date(t0.getTime() + REGEN_MS * 2.5);
  const bag1 = lifeState(bag0, p, cfg, senere, 0);
  assert.equal(bag1.n, 2); // 2 fulde ticks, ikke ved cap endnu
  const meget_senere = new Date(t0.getTime() + REGEN_MS * 10);
  const bag2 = lifeState(bag0, p, cfg, meget_senere, 0);
  assert.equal(bag2.n, REGEN_CAP); // capper ved 3
});

test('lifeState regenererer IKKE uden liv-abonnementer', () => {
  const p = { marketing: false, mailTo: [], notify: false };
  const t0 = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-02', n: 0, t: t0.getTime(), g: [] };
  const senere = new Date(t0.getTime() + REGEN_MS * 10);
  const bag1 = lifeState(bag0, p, cfg, senere, 0);
  assert.equal(bag1.n, 0);
});

test('useLife fejler ved 0 liv, ellers trækker 1 fra', () => {
  assert.equal(useLife({ n: 0, t: Date.now(), g: [] }), null);
  const brugt = useLife({ n: 2, t: 123, g: [] });
  assert.equal(brugt.n, 1);
});

test('useLife nulstiller regen-anker når man bruger fra fuld cap', () => {
  const brugt = useLife({ n: REGEN_CAP, t: 123, g: [] });
  assert.equal(brugt.n, REGEN_CAP - 1);
  assert.ok(brugt.t > 123);
});

test('refill fylder op til mindst dailyStart og nulstiller anker', () => {
  const p = { marketing: false, mailTo: [], notify: false };
  const now = new Date('2026-01-02T09:00:00Z');
  const bag = refill({ n: 1, t: 0, g: [] }, p, cfg, now);
  assert.equal(bag.n, dailyStart(p, cfg));
  assert.equal(bag.t, now.getTime());
});

test('setSubsPure giver kun liv for FRISKE nøgler (ikke allerede givet i dag)', () => {
  const p = { marketing: false, mailTo: [], notify: false };
  const bag = { day: '2026-01-02', n: 5, t: 0, g: [] };
  const r1 = setSubsPure(p, ['sp', 'm:Herodesk'], cfg, bag);
  assert.equal(r1.fresh, 1); // kun Herodesk giver liv, 'sp' gør ikke
  assert.equal(r1.bag.n, 6);
  assert.deepEqual(new Set(r1.bag.g), new Set(['m:Herodesk']));

  // Gentilmelding samme dag til samme nøgle giver IKKE liv igen.
  const r2 = setSubsPure(r1.p, ['sp', 'm:Herodesk', 'sms'], cfg, r1.bag);
  assert.equal(r2.fresh, 1); // kun 'sms' er ny i dag
  assert.equal(r2.bag.n, 7);
});

test('setSubsPure rapporterer added/removed til samtykke-historik', () => {
  const p = { marketing: true, mailTo: ['Herodesk'], notify: false };
  const bag = { day: '2026-01-02', n: 5, t: 0, g: ['m:Herodesk'] };
  const r = setSubsPure(p, ['sp', 'sms'], cfg, bag);
  assert.deepEqual(r.added, ['sms']);
  assert.deepEqual(r.removed, ['m:Herodesk']);
  assert.equal(r.p.notify, true);
  assert.equal(r.p.mailTo.length, 0);
});
