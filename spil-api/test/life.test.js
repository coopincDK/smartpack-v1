'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  lifeState,
  useLife,
  refill,
  setSubsPure,
  setTicksPure,
  subKeys,
  todayTickKeys,
  lifeKeys,
  dailyStart,
  NEJ_TAK,
  VALG_LIV,
} = require('../src/rules/life');
const { REGEN_MS, REGEN_CAP, regenCap, MAX_LIVES, DEFAULT_CFG } = require('../src/rules/constants');

const cfg = { ...DEFAULT_CFG, mailPartners: 'Herodesk, Sprii', smsOn: true, smsSponsor: 'InMobile' };

function med(keys, dag) {
  return { marketing: false, mailTo: [], notify: false, tick: { day: dag, keys } };
}

test('dailyStart tæller KUN dagens flueben med (kun dem der giver liv) — ikke den varige tilmelding', () => {
  const idag = new Date('2026-01-02T09:00:00Z');
  // Varigt tilmeldt (marketing/mailTo/notify) men IKKE tikket i dag -> ingen bonus.
  const varigtTilmeldt = { marketing: true, mailTo: ['Herodesk'], notify: true, tick: null };
  assert.equal(dailyStart(varigtTilmeldt, cfg, idag), cfg.perDay);
  assert.equal(subKeys(varigtTilmeldt).length, 3); // varig status upåvirket
  assert.equal(lifeKeys(varigtTilmeldt, cfg, idag).length, 0);

  // Tikket af i dag: alle tre flueben giver liv (3/10 2026) -> perDay + 3.
  const tiketIDag = med(['sp', 'm:Herodesk', 'sms'], '2026-01-02');
  assert.equal(dailyStart(tiketIDag, cfg, idag), cfg.perDay + 3);
  assert.equal(lifeKeys(tiketIDag, cfg, idag).length, 3);
});

test('todayTickKeys er tom hvis fluebenet er fra en anden dag', () => {
  const p = med(['sms'], '2026-01-01');
  assert.deepEqual(todayTickKeys(p, new Date('2026-01-02T09:00:00Z')), []);
  assert.deepEqual(todayTickKeys(p, new Date('2026-01-01T20:00:00Z')), ['sms']);
});

test('lifeKeys er tom når cfg.lifeBonus er false, uanset dagens flueben', () => {
  const p = med(['m:Herodesk', 'sms'], '2026-01-02');
  const idag = new Date('2026-01-02T09:00:00Z');
  assert.equal(lifeKeys(p, { ...cfg, lifeBonus: false }, idag).length, 0);
  assert.ok(lifeKeys(p, cfg, idag).length > 0);
});

test('lifeState nulstiller ved dags-skift til dailyStart minus dagens forsøg', () => {
  const p = med(['m:Herodesk'], '2026-01-02');
  const igaar = new Date('2026-01-01T10:00:00Z');
  const idag = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-01', n: 0, t: igaar.getTime(), g: [] };
  const bag1 = lifeState(bag0, p, cfg, idag, 0);
  assert.equal(bag1.day, '2026-01-02');
  assert.equal(bag1.n, dailyStart(p, cfg, idag)); // perDay + 1 (Herodesk tikket i dag)
});

test('lifeState regenererer ét liv i timen op til grundtallet (cfg.perDay), med 3 som grundtal', () => {
  const p = med([], '2026-01-02'); // uden dagens valg (et valg giver turbo-regen, se turbo-liv.test.js)
  const c3 = { ...cfg, perDay: 3 };
  const t0 = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-02', n: 0, t: t0.getTime(), g: [] };
  const senere = new Date(t0.getTime() + REGEN_MS * 2.5);
  const bag1 = lifeState(bag0, p, c3, senere, 0);
  assert.equal(bag1.n, 2); // 2 fulde ticks, ikke ved cap endnu
  const meget_senere = new Date(t0.getTime() + REGEN_MS * 10);
  const bag2 = lifeState(bag0, p, c3, meget_senere, 0);
  assert.equal(bag2.n, 3); // capper ved grundtallet
});

test('lifeState regenererer også uden flueben: 1 liv efter en time med standardopsætningen', () => {
  const p = med([], '2026-01-02');
  const t0 = new Date('2026-01-02T09:00:00Z');
  assert.equal(regenCap(cfg), 1);
  const bag0 = { day: '2026-01-02', n: 0, t: t0.getTime(), g: [] };
  assert.equal(lifeState(bag0, p, cfg, new Date(t0.getTime() + REGEN_MS - 1), 0).n, 0);
  assert.equal(lifeState(bag0, p, cfg, new Date(t0.getTime() + REGEN_MS), 0).n, 1);
  assert.equal(lifeState(bag0, p, cfg, new Date(t0.getTime() + REGEN_MS * 10), 0).n, 1, 'aldrig over grundtallet');
  // Bonusliv (fra flueben) regenereres ikke: 3 liv forbliver 3, og ankeret flyttes.
  const bagBonus = { day: '2026-01-02', n: 3, t: t0.getTime(), g: ['m:Herodesk', 'sp'] };
  const b = lifeState(bagBonus, p, cfg, new Date(t0.getTime() + REGEN_MS * 5), 0);
  assert.equal(b.n, 3);
});

test('lifeState klemmer n til MAX_LIVES, uanset hvor højt regen/dailyStart ville nå', () => {
  const p = med(['m:Herodesk', 'sms'], '2026-01-02');
  const t0 = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-01', n: MAX_LIVES, t: t0.getTime(), g: [] };
  const bag1 = lifeState(bag0, p, cfg, t0, 0);
  assert.ok(bag1.n <= MAX_LIVES);
});

test('useLife fejler ved 0 liv, ellers trækker 1 fra', () => {
  assert.equal(useLife({ n: 0, t: Date.now(), g: [] }), null);
  const brugt = useLife({ n: 2, t: 123, g: [] });
  assert.equal(brugt.n, 1);
});

test('useLife nulstiller regen-anker når man bruger fra fuld cap', () => {
  const brugt = useLife({ n: REGEN_CAP, t: 123, g: [] }, cfg);
  assert.equal(brugt.n, REGEN_CAP - 1);
  assert.ok(brugt.t > 123);
});

test('refill fylder op til mindst dailyStart, klemt til MAX_LIVES, og nulstiller anker', () => {
  const p = med([], '2026-01-02');
  const now = new Date('2026-01-02T09:00:00Z');
  const bag = refill({ n: 1, t: 0, g: [] }, p, cfg, now);
  assert.equal(bag.n, dailyStart(p, cfg, now));
  assert.equal(bag.t, now.getTime());

  const fuldP = med(['m:Herodesk', 'sms'], '2026-01-02'); // dailyStart højere end MAX_LIVES i teorien
  const bagFuld = refill({ n: MAX_LIVES, t: 0, g: [] }, fuldP, cfg, now);
  assert.ok(bagFuld.n <= MAX_LIVES);
});

test('setSubsPure (varig af-/tilmelding) giver IKKE liv, men rapporterer added/removed', () => {
  const p = { marketing: true, mailTo: ['Herodesk'], notify: false, tick: null };
  const now = new Date('2026-01-02T09:00:00Z');
  const r = setSubsPure(p, ['sp', 'sms'], cfg, now);
  assert.deepEqual(r.added, ['sms']);
  assert.deepEqual(r.removed, ['m:Herodesk']);
  assert.equal(r.p.notify, true);
  assert.equal(r.p.mailTo.length, 0);
  assert.equal(r.bag, undefined); // ingen liv-bivirkning
});

test('setSubsPure klipper dagens flueben ned til fællesmængden med det nye ønskede sæt', () => {
  const now = new Date('2026-01-02T09:00:00Z');
  const p = {
    marketing: false,
    mailTo: ['Herodesk'],
    notify: true,
    tick: { day: '2026-01-02', keys: ['m:Herodesk', 'sms'] },
  };
  const r = setSubsPure(p, ['sms'], cfg, now); // afmelder Herodesk varigt, beholder sms
  assert.deepEqual(r.removed, ['m:Herodesk']);
  assert.deepEqual(r.p.tick.keys, ['sms']); // Herodesk kan ikke længere være tikket af i dag
});

test('setTicksPure giver VALG_LIV liv én gang om dagen for at tage stilling, uanset ja eller nej', () => {
  const p = { marketing: false, mailTo: [], notify: false, tick: null };
  const now = new Date('2026-01-02T09:00:00Z');
  const bag = { day: '2026-01-02', n: 5, t: 0, g: [] };

  // Ét flueben giver det samme som alle: VALG_LIV liv.
  const r1 = setTicksPure(p, ['sp'], cfg, bag, now);
  assert.equal(r1.fresh, VALG_LIV);
  assert.equal(r1.bag.n, 5 + VALG_LIV);
  assert.deepEqual(r1.added, ['sp']);

  // Flere flueben, fjernet og sat igen samme dag: ingen nye liv, men stadig nye bekræftelser.
  const r1b = setTicksPure(r1.p, [], cfg, r1.bag, now);
  assert.deepEqual(r1b.p.tick.keys, []);
  const r2 = setTicksPure(r1b.p, ['sp', 'm:Herodesk', 'sms'], cfg, r1b.bag, now);
  assert.equal(r2.fresh, 0);
  assert.equal(r2.bag.n, 5 + VALG_LIV);
  assert.deepEqual(r2.added, ['sp', 'm:Herodesk', 'sms']);

  // "Nej tak" giver præcis det samme som at sige ja, og logger intet samtykke.
  const n1 = setTicksPure(p, [NEJ_TAK], cfg, bag, now);
  assert.equal(n1.fresh, VALG_LIV);
  assert.deepEqual(n1.added, []);
  assert.deepEqual(n1.p.tick.keys, [NEJ_TAK]);
  assert.equal(n1.p.marketing, false);
  // "Nej tak" sammen med et flueben: fluebenet vinder, "Nej tak" droppes.
  const n2 = setTicksPure(p, ['sp', NEJ_TAK], cfg, bag, now);
  assert.deepEqual(n2.p.tick.keys, ['sp']);
  // Ukendte nøgler tæller ikke som et valg.
  assert.equal(setTicksPure(p, ['m:Ukendt'], cfg, bag, now).fresh, 0);
});

test('setTicksPure: liv givet tidligere i dag efter den gamle regel trækkes fra', () => {
  const p = { marketing: false, mailTo: [], notify: false, tick: null };
  const now = new Date('2026-01-02T09:00:00Z');
  const r = setTicksPure(p, ['sp'], cfg, { day: '2026-01-02', n: 2, t: 0, g: ['m:Herodesk'] }, now);
  assert.equal(r.fresh, VALG_LIV - 1);
  const r2 = setTicksPure(p, ['sp'], cfg, { day: '2026-01-02', n: 2, t: 0, g: ['a', 'b', 'c', 'd'] }, now);
  assert.equal(r2.fresh, 0);
});

test('setTicksPure klemmer til MAX_LIVES og vokser (aldrig krymper) marketing/mailTo/notify', () => {
  const p = { marketing: false, mailTo: [], notify: false, tick: null };
  const now = new Date('2026-01-02T09:00:00Z');
  const bag = { day: '2026-01-02', n: MAX_LIVES - 1, t: 0, g: [] };
  const r = setTicksPure(p, ['sp', 'm:Herodesk', 'sms'], cfg, bag, now);
  assert.ok(r.bag.n <= MAX_LIVES);
  assert.equal(r.p.marketing, true);
  assert.deepEqual(r.p.mailTo, ['Herodesk']);
  assert.equal(r.p.notify, true);

  // Fjernelse af fluebenet i dag rører IKKE den varige status.
  const r2 = setTicksPure(r.p, [], cfg, r.bag, now);
  assert.equal(r2.p.marketing, true);
  assert.deepEqual(r2.p.mailTo, ['Herodesk']);
  assert.equal(r2.p.notify, true);
  assert.deepEqual(r2.p.tick.keys, []);
});

test('lifeBonus=false gør lifeKeys tom (opgave D)', () => {
  const p = med(['m:Herodesk', 'sms'], '2026-01-02');
  const idag = new Date('2026-01-02T09:00:00Z');
  assert.deepEqual(lifeKeys(p, { ...cfg, lifeBonus: false }, idag), []);
  assert.notDeepEqual(lifeKeys(p, { ...cfg, lifeBonus: true }, idag), []);
});
