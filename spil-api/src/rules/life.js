'use strict';

const { REGEN_MS, regenCap, MAX_LIVES } = require('./constants');
const { todayStr } = require('./tzDate');
const { iTurnering } = require('./turnering');
const { SAMTYKKE_VERSION } = require('../partners');

// Dags-nøgle brugt overalt i liv-reglen — 'YYYY-MM-DD' i Europe/Copenhagen
// (IKKE UTC siden denne opfølgningsrunde), se src/rules/tzDate.js og API.md,
// afsnit "Dage og tidszoner", for den fulde begrundelse.

function mailPartnersList(cfg) {
  return String((cfg && cfg.mailPartners) || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// subOptions(cfg): liste over tilmeldingsmuligheder. Alle flueben giver liv (Martin 3/10 2026),
// mail-partnere og evt. sms giver liv.
function subOptions(cfg) {
  const opts = [{ key: 'sp', label: 'SmartPack nyheder', life: true }];
  const info = new Map(((cfg && cfg.partnerLister) || []).map((l) => [l.slug, l]));
  for (const navn of mailPartnersList(cfg)) {
    const l = info.get(navn);
    opts.push({ key: 'm:' + navn, label: l ? l.navn : navn, tekst: l ? l.tekst : null, life: true });
  }
  if (cfg.smsOn !== false && cfg.smsSponsor) {
    opts.push({ key: 'sms', label: cfg.smsSponsor, tekst: SMS_SAMTYKKE_TEKST, life: true });
  }
  return opts;
}

// subKeys(p): den VARIGE tilmeldingsstatus (p.marketing/mailTo/notify) —
// bruges af GET /me (mine_noegler), CSV-eksport og setSubsPure (den rigtige,
// varige af-/tilmelding). Giver IKKE liv i sig selv siden Packrush — se
// lifeKeys() nedenfor og API.md, afsnit "Packrush-ændringer".
function subKeys(p) {
  const keys = [];
  if (p.marketing) keys.push('sp');
  for (const m of p.mailTo || []) keys.push('m:' + m);
  if (p.notify) keys.push('sms');
  return keys;
}

// todayTickKeys(p, now): DAGENS FLUEBEN (p.tick = {day, keys}) — adskilt fra
// den varige tilmelding, nulstilles hver dag. Svarer til klientens
// todayKeys(p) i Packrush-versionen af spil/index.html.
function todayTickKeys(p, now) {
  const today = todayStr(now);
  return p && p.tick && p.tick.day === today ? p.tick.keys.slice() : [];
}

// Bonusliv for at TAGE STILLING (Martin 8/10 2026): samtykke må ikke give en fordel i spillet
// (GDPR art. 7 og vilkår pkt. 12), så bonussen gives for at have valgt, ikke for at have sagt ja.
// Man har valgt i dag, når man har sat mindst ét flueben ELLER valgt "Nej tak" (NEJ_TAK), og alle
// får det samme: VALG_LIV ekstra liv én gang om dagen og (uden for turneringen) turbo-regen.
const NEJ_TAK = 'nej';
const VALG_LIV = 3;

function harValgt(p, cfg, now) {
  const opts = new Set(subOptions(cfg).map((o) => o.key));
  return todayTickKeys(p, now).some((k) => k === NEJ_TAK || opts.has(k));
}

// lifeKeys(p, cfg, now): de bonusliv-enheder, dagens valg giver (VALG_LIV stk., ens for alle).
function lifeKeys(p, cfg, now) {
  if (cfg.lifeBonus === false) return [];
  if (!harValgt(p, cfg, now)) return [];
  return Array.from({ length: VALG_LIV }, (_, i) => 'valg:' + (i + 1));
}

function subsCount(p, cfg, now) {
  return lifeKeys(p, cfg, now).length;
}

// Turbo-regen (Martin 6/10 2026): har spilleren taget stilling i dag (lifeKeys giver VALG_LIV >=
// TURBO_MIN, Martin 8/10) og er vi uden for den lukkede turnering (Martin 7/10),
// kommer der TURBO_PR_TIME liv pr. time (ét pr. REGEN_MS / TURBO_PR_TIME) op til
// TURBO_PR_TIME liv, i stedet for ét liv i timen.
const TURBO_MIN = 3;
const TURBO_PR_TIME = 3;
function regenFor(p, cfg, now) {
  const turbo = !!(p && now && subsCount(p, cfg, now) >= TURBO_MIN && !iTurnering(cfg, now));
  return turbo
    ? { ms: Math.round(REGEN_MS / TURBO_PR_TIME), cap: Math.max(regenCap(cfg), TURBO_PR_TIME), turbo: true }
    : { ms: REGEN_MS, cap: regenCap(cfg), turbo: false };
}

function dailyStart(p, cfg, now) {
  return (cfg.perDay == null ? 3 : cfg.perDay) + subsCount(p, cfg, now);
}

/**
 * bag: { day, n, t, g } — dagens liv-tilstand (fra spiller.liv_dag/liv_n/liv_t/ekstra_01).
 * now: Date (server-tid, brug altid server-uret, aldrig klientens).
 * attemptsToday: antal forsøg spilleren allerede har oprettet i dag (bruges
 * KUN ved dags-skift, til at udregne startkapaciteten minus evt. allerede
 * brugte forsøg — i praksis altid 0 ved det allerførste kald en ny dag).
 */
function lifeState(bag, p, cfg, now, attemptsToday) {
  attemptsToday = attemptsToday || 0;
  const today = todayStr(now);
  let { day, n, t, g } = bag;
  t = t ? (t instanceof Date ? t.getTime() : new Date(t).getTime()) : now.getTime();
  g = g || [];
  if (day !== today) {
    n = Math.max(0, dailyStart(p, cfg, now) - attemptsToday);
    t = now.getTime();
    g = lifeKeys(p, cfg, now);
    day = today;
  }
  // Naturlig regen: ét liv pr. REGEN_MS op til grundtallet (cfg.perDay); med mindst
  // TURBO_MIN af dagens flueben går det TURBO_PR_TIME gange hurtigere op til TURBO_PR_TIME liv.
  const { ms: regenMs, cap } = regenFor(p, cfg, now);
  if (n < cap) {
    const ticks = Math.floor((now.getTime() - t) / regenMs);
    if (ticks > 0) {
      const add = Math.min(ticks, cap - n);
      n += add;
      t += add * regenMs;
    }
  } else if (n > cap) {
    // Over grundtallet (bonusliv): ankeret følger med, så regen først tæller fra det øjeblik, man er under.
    t = now.getTime();
  }
  // Packrush: MAX_LIVES er et hårdt loft over ALT liv, uanset kilde.
  n = Math.min(n, MAX_LIVES);
  return { day, n, t, g };
}

// Hvor lang tid (ms) til næste naturlige regen — null hvis der ikke regenereres
// (ingen dagens-flueben-abonnementer, eller allerede ved cap).
function nextRegenMs(bag, p, cfg, now) {
  const { ms: regenMs, cap } = regenFor(p, cfg, now);
  if (bag.n >= cap) return null;
  const t = bag.t instanceof Date ? bag.t.getTime() : bag.t;
  const elapsed = now.getTime() - t;
  return Math.max(0, regenMs - (elapsed % regenMs));
}

// useLife(bag): null hvis intet liv tilbage. Ellers: hvis n var ved cap,
// nulstil regen-ankeret til nu (undgår at "banke" regen-tid op mens man er fuld).
function useLife(bag, cfg, p, now) {
  if (bag.n <= 0) return null;
  const cap = p ? regenFor(p, cfg, now || new Date()).cap : regenCap(cfg);
  const t = bag.n >= cap ? Date.now() : bag.t;
  return { ...bag, n: bag.n - 1, t };
}

// refill(bag,p,cfg,now): fyld op til mindst dailyStart (klemt til MAX_LIVES),
// nulstil regen-anker. Bruges ved vennekode-første-forsøg-bonus (finish-flow
// trin 6) og udfordrings-gaveliv (samme MAX_LIVES-loft som al anden tildeling).
function refill(bag, p, cfg, now) {
  return { ...bag, n: Math.min(MAX_LIVES, Math.max(bag.n, dailyStart(p, cfg, now))), t: now.getTime() };
}

// Den tekst, spilleren så ved fluebenet, gemmes i samtykke.tekst. Partnernes
// tekst bygges af partner-tabellen (firma, CVR, produkt), se src/partners.js.
const SP_SAMTYKKE_TEKST = 'Ja tak, SmartPack må sende mig nyheder på mail. Jeg kan altid afmelde mig igen.';
// Sms-samtykket: serveren ejer teksten, så den altid gemmes på samtykke-rækken og passer
// til det, der faktisk sker (afsender Packrush/SmartPack via inMobile, afmelding i spillet).
// Ændres teksten, skal SMS_SAMTYKKE_VERSION hæves.
const SMS_SAMTYKKE_VERSION = 3;
const SMS_SAMTYKKE_TEKST =
  "Ja tak, SmartPack må sende mig sms'er om Packrush, fx at turneringen er åben, eller at jeg er timens boss eller har vundet. " +
  "Sms'erne sendes af SmartPack (afsender Packrush) via inMobile. Jeg kan altid afmelde mig igen under Mine tilmeldinger i spillet på smartpack.dk/spil.";
function samtykkeVersionFor(key) {
  return key === 'sms' ? SMS_SAMTYKKE_VERSION : SAMTYKKE_VERSION;
}
function samtykkeTekstFor(cfg, key) {
  if (key === 'sp') return SP_SAMTYKKE_TEKST;
  if (key === 'sms') return SMS_SAMTYKKE_TEKST;
  const o = subOptions(cfg || {}).find((x) => x.key === key);
  return (o && o.tekst) || null;
}

function listNameFor(key) {
  if (key === 'sp') return 'smartpack';
  if (key === 'sms') return 'sms';
  if (key.startsWith('m:')) return 'partner:' + key.slice(2);
  return key;
}

/**
 * Ren funktion (ingen DB-kald): den VARIGE af-/tilmelding (setSubs fra den
 * nye klient). Giver IKKE liv i sig selv (det gør kun setTicksPure/dagens
 * flueben siden Packrush) — men rapporterer added/removed til
 * samtykke-hændelsesloggen, og klipper dagens flueben ned til fællesmængden
 * med det nye ønskede sæt (man kan ikke have et dagens-flueben for en liste
 * man lige har afmeldt varigt).
 *
 * keys: det ØNSKEDE fulde sæt af tilmeldingsnøgler fra klienten (fx ['sp','m:Sprii']).
 */
function setSubsPure(p, keys, cfg, now) {
  const desired = new Set(keys);
  const before = new Set(subKeys(p));
  const opts = new Map(subOptions(cfg).map((o) => [o.key, o]));

  const added = [...desired].filter((k) => !before.has(k) && opts.has(k));
  const removed = [...before].filter((k) => !desired.has(k));

  const newP = {
    ...p,
    marketing: desired.has('sp'),
    mailTo: mailPartnersList(cfg).filter((navn) => desired.has('m:' + navn)),
    notify: desired.has('sms'),
  };
  const todayTicks = todayTickKeys(p, now);
  newP.tick = { day: todayStr(now), keys: todayTicks.filter((k) => desired.has(k)) };

  return { p: newP, added, removed };
}

/**
 * Ren funktion (ingen DB-kald): DAGENS FLUEBEN (setTicks fra den nye
 * klient). Et NYT flueben er en ny, VARIG bekræftelse (voksende
 * marketing/mailTo/notify, ALDRIG krympende — det gør kun setSubsPure).
 * Fjernelse af et flueben er KUN for i dag. Liv gives højst én gang pr.
 * liste pr. dag: bag.g husker hvilke lister der allerede har givet liv i
 * dag, uafhængigt af om fluebenet siden er fjernet og sat igen samme dag.
 *
 * keys: det ØNSKEDE fulde sæt af DAGENS fluebens-nøgler.
 */
function setTicksPure(p, keys, cfg, bag, now) {
  const opts = new Map(subOptions(cfg).map((o) => [o.key, o]));
  const raw = (Array.isArray(keys) ? keys : []).map(String);
  const validKeys = raw.filter((k) => opts.has(k));
  const had = todayTickKeys(p, now);
  const added = validKeys.filter((k) => !had.includes(k));
  // "Nej tak" gælder kun, når der ikke er sat et eneste flueben (de udelukker hinanden).
  const tickKeys = validKeys.length ? validKeys : raw.includes(NEJ_TAK) ? [NEJ_TAK] : [];

  const newP = { ...p, tick: { day: todayStr(now), keys: tickKeys } };
  if (added.includes('sp')) newP.marketing = true;
  if (added.some((k) => k.startsWith('m:'))) {
    const mt = new Set(newP.mailTo || []);
    for (const k of added) {
      if (k.startsWith('m:')) mt.add(k.slice(2));
    }
    newP.mailTo = mailPartnersList(cfg).filter((navn) => mt.has(navn));
  }
  if (added.includes('sms')) newP.notify = true;

  // Bonusliv højst VALG_LIV om dagen i alt: liv, der allerede er givet i dag (også efter den
  // gamle regel med ét liv pr. flueben), trækkes fra, og at skifte valg giver ikke nye liv.
  const before = (bag.g || []).slice();
  const newLifeKeys = lifeKeys(newP, cfg, now);
  const fresh = newLifeKeys.filter((k) => !before.includes(k)).slice(0, Math.max(0, newLifeKeys.length - before.length));
  const newBag = { ...bag, g: before.concat(fresh), n: Math.min(MAX_LIVES, bag.n + fresh.length) };

  return { p: newP, bag: newBag, fresh: fresh.length, added };
}

module.exports = {
  NEJ_TAK,
  VALG_LIV,
  harValgt,
  todayStr,
  mailPartnersList,
  subOptions,
  subKeys,
  todayTickKeys,
  lifeKeys,
  subsCount,
  dailyStart,
  lifeState,
  nextRegenMs,
  regenFor,
  TURBO_MIN,
  TURBO_PR_TIME,
  useLife,
  refill,
  listNameFor,
  samtykkeTekstFor,
  samtykkeVersionFor,
  SMS_SAMTYKKE_TEKST,
  setSubsPure,
  setTicksPure,
};
