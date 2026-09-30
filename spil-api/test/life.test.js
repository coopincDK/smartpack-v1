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
} = require('../src/rules/life');
const { REGEN_MS, REGEN_CAP, MAX_LIVES, DEFAULT_CFG } = require('../src/rules/constants');

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

  // Tikket af i dag ('sp' giver aldrig liv, Herodesk + sms giver liv) -> perDay + 2.
  const tiketIDag = med(['sp', 'm:Herodesk', 'sms'], '2026-01-02');
  assert.equal(dailyStart(tiketIDag, cfg, idag), cfg.perDay + 2);
  assert.equal(lifeKeys(tiketIDag, cfg, idag).length, 2);
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

test('lifeState regenererer liv over tid, med cap', () => {
  const p = med(['m:Herodesk'], '2026-01-02');
  const t0 = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-02', n: 0, t: t0.getTime(), g: [] };
  const senere = new Date(t0.getTime() + REGEN_MS * 2.5);
  const bag1 = lifeState(bag0, p, cfg, senere, 0);
  assert.equal(bag1.n, 2); // 2 fulde ticks, ikke ved cap endnu
  const meget_senere = new Date(t0.getTime() + REGEN_MS * 10);
  const bag2 = lifeState(bag0, p, cfg, meget_senere, 0);
  assert.equal(bag2.n, REGEN_CAP); // capper ved 3
});

test('lifeState regenererer IKKE uden dagens flueben på en liv-liste', () => {
  const p = med([], '2026-01-02');
  const t0 = new Date('2026-01-02T09:00:00Z');
  const bag0 = { day: '2026-01-02', n: 0, t: t0.getTime(), g: [] };
  const senere = new Date(t0.getTime() + REGEN_MS * 10);
  const bag1 = lifeState(bag0, p, cfg, senere, 0);
  assert.equal(bag1.n, 0);
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
  const brugt = useLife({ n: REGEN_CAP, t: 123, g: [] });
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

test('setTicksPure giver kun liv for FRISKE lister (ikke allerede givet i dag)', () => {
  const p = { marketing: false, mailTo: [], notify: false, tick: null };
  const now = new Date('2026-01-02T09:00:00Z');
  const bag = { day: '2026-01-02', n: 5, t: 0, g: [] };

  const r1 = setTicksPure(p, ['sp', 'm:Herodesk'], cfg, bag, now);
  assert.equal(r1.fresh, 1); // kun Herodesk giver liv, 'sp' gør ikke
  assert.equal(r1.bag.n, 6);
  assert.deepEqual(new Set(r1.bag.g), new Set(['m:Herodesk']));
  assert.deepEqual(r1.added, ['sp', 'm:Herodesk']); // begge er NYE i dag (bekræftelser)

  // Gentikning samme dag af samme liste giver IKKE liv igen (bag.g husker
  // det, uafhængigt af om fluebenet siden er fjernet) — men tælles STADIG
  // som en ny bekræftelse pr. gentikning (svarer 1:1 til klientens
  // reference-implementering: hvert nyt flueben er en ny, varig
  // bekræftelse, uanset om samme liste blev tikket af tidligere i dag).
  const r1b = setTicksPure(r1.p, [], cfg, r1.bag, now); // fjerner fluebenet igen
  assert.deepEqual(r1b.p.tick.keys, []);
  const r2 = setTicksPure(r1b.p, ['sp', 'm:Herodesk', 'sms'], cfg, r1b.bag, now);
  assert.equal(r2.fresh, 1); // kun 'sms' er ny i dag; Herodesk stod allerede i bag.g -> intet ekstra liv
  assert.equal(r2.bag.n, 7);
  assert.deepEqual(r2.added, ['sp', 'm:Herodesk', 'sms']); // alle tre logges som nye bekræftelser
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
