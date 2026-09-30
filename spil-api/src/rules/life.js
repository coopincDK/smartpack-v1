'use strict';

const { REGEN_MS, REGEN_CAP } = require('./constants');

// Dags-nøgle brugt overalt i liv-reglen. Vi bruger UTC-dato (server-tid),
// ikke spillerens lokale tidszone — se API.md, afsnit "Dage og tidszoner",
// for begrundelsen (messen kører fra én fysisk stand, én server-tidszone
// er nok, og UTC undgår DST-spring midt i en messedag).
function todayStr(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().slice(0, 10);
}

function mailPartnersList(cfg) {
  return String((cfg && cfg.mailPartners) || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// subOptions(cfg): liste over tilmeldingsmuligheder. 'sp' giver ALDRIG liv,
// mail-partnere og evt. sms giver liv.
function subOptions(cfg) {
  const opts = [{ key: 'sp', label: 'SmartPack nyheder', life: false }];
  for (const navn of mailPartnersList(cfg)) {
    opts.push({ key: 'm:' + navn, label: navn, life: true });
  }
  if (cfg.smsOn !== false && cfg.smsSponsor) {
    opts.push({ key: 'sms', label: cfg.smsSponsor, life: true });
  }
  return opts;
}

// subKeys(p): hvilke nøgler er spilleren p.t. tilmeldt (ud fra p.marketing/mailTo/notify).
function subKeys(p) {
  const keys = [];
  if (p.marketing) keys.push('sp');
  for (const m of p.mailTo || []) keys.push('m:' + m);
  if (p.notify) keys.push('sms');
  return keys;
}

// lifeKeys(p,cfg): subKeys filtreret til dem der faktisk giver liv (life:true).
function lifeKeys(p, cfg) {
  if (cfg.lifeBonus === false) return [];
  const liveOpts = new Set(
    subOptions(cfg)
      .filter((o) => o.life)
      .map((o) => o.key)
  );
  return subKeys(p).filter((k) => liveOpts.has(k));
}

function subsCount(p, cfg) {
  return lifeKeys(p, cfg).length;
}

function dailyStart(p, cfg) {
  return (cfg.perDay == null ? 5 : cfg.perDay) + subsCount(p, cfg);
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
    n = Math.max(0, dailyStart(p, cfg) - attemptsToday);
    t = now.getTime();
    g = lifeKeys(p, cfg);
    day = today;
  }
  const subsN = subsCount(p, cfg);
  if (subsN > 0 && n < REGEN_CAP) {
    const ticks = Math.floor((now.getTime() - t) / REGEN_MS);
    if (ticks > 0) {
      const add = Math.min(ticks, REGEN_CAP - n);
      n += add;
      t += add * REGEN_MS;
    }
  }
  return { day, n, t, g };
}

// Hvor lang tid (ms) til næste naturlige regen — null hvis der ikke regenereres
// (ingen liv-abonnementer, eller allerede ved cap).
function nextRegenMs(bag, p, cfg, now) {
  const subsN = subsCount(p, cfg);
  if (subsN <= 0 || bag.n >= REGEN_CAP) return null;
  const t = bag.t instanceof Date ? bag.t.getTime() : bag.t;
  const elapsed = now.getTime() - t;
  return Math.max(0, REGEN_MS - (elapsed % REGEN_MS));
}

// useLife(bag): null hvis intet liv tilbage. Ellers: hvis n var ved cap,
// nulstil regen-ankeret til nu (undgår at "banke" regen-tid op mens man er fuld).
function useLife(bag) {
  if (bag.n <= 0) return null;
  const t = bag.n >= REGEN_CAP ? Date.now() : bag.t;
  return { ...bag, n: bag.n - 1, t };
}

// refill(bag,p,cfg,now): fyld op til mindst dailyStart, nulstil regen-anker.
// Bruges ved vennekode-første-forsøg-bonus (finish-flow trin 6).
function refill(bag, p, cfg, now) {
  return { ...bag, n: Math.max(bag.n, dailyStart(p, cfg)), t: now.getTime() };
}

function listNameFor(key) {
  if (key === 'sp') return 'smartpack';
  if (key === 'sms') return 'sms';
  if (key.startsWith('m:')) return 'partner:' + key.slice(2);
  return key;
}

/**
 * Ren funktion (ingen DB-kald): udregner ny spiller-tilstand + ny liv-bag +
 * hvor mange friske liv der skal gives + hvilke samtykke-lister der skal
 * hhv. oprettes (added) og trækkes tilbage (removed).
 *
 * keys: det ØNSKEDE fulde sæt af tilmeldingsnøgler fra klienten (fx ['sp','m:Sprii']).
 */
function setSubsPure(p, keys, cfg, bag) {
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

  const g = new Set(bag.g || []);
  let fresh = 0;
  for (const k of added) {
    const o = opts.get(k);
    if (o && o.life && !g.has(k)) {
      fresh++;
      g.add(k);
    }
  }
  const newBag = { ...bag, g: [...g], n: bag.n + fresh };

  return { p: newP, bag: newBag, fresh, added, removed };
}

module.exports = {
  todayStr,
  mailPartnersList,
  subOptions,
  subKeys,
  lifeKeys,
  subsCount,
  dailyStart,
  lifeState,
  nextRegenMs,
  useLife,
  refill,
  listNameFor,
  setSubsPure,
};
