'use strict';

const { loadOffentligCfg } = require('../cfgLoad');

const express = require('express');
const { firmKey } = require('../rules/firmKey');
const { lifeState, setSubsPure, setTicksPure, todayStr, samtykkeTekstFor } = require('../rules/life');
const { SAMTYKKE_VERSION } = require('../partners');
const { randomPublicId, randomCode, hashPassword, verifyPassword } = require('../crypto');
const { issueToken } = require('../spillerToken');
const { clientIp } = require('../middleware/clientIp');
const { createRateLimiter } = require('../middleware/rateLimit');
const { invalidateStateCache } = require('../publicState');
const { resolveSessionRole } = require('../middleware/adminAuth');

const MAKS_NAVN = 22;
const MAKS_FIRMA = 40;
const MAKS_KODE = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^[0-9]{4}$/;
// Spærring efter for mange forkerte pinkoder (pr. spiller, se 010_pinkode.sql).
// BEVIDST KORT (15 min.) og ESKALERER ALDRIG: pin_fejl nulstilles til 0 i
// SAMME skrivning som udløser spærringen (se nedenfor), så en ny spærring
// igen kræver PIN_MAKS_FEJL friske forkerte forsøg EFTER at den forrige er
// udløbet — spærringen kan altså ikke bruges som et effektivt, langvarigt
// udelåsningsværktøj mod en enkelt spiller (sikkerhedsgennemgang, M3).
const PIN_MAKS_FEJL = 5;
const PIN_SPAERRING_MS = 15 * 60 * 1000;
// M3 (sikkerhedsgennemgang): den pr.-spiller-spærring ovenfor beskytter IKKE
// mod (a) at en angriber, der kender mange emails, gætter 5 koder/kvarter på
// HVER af dem (statistisk ramte nogle, ~4,8%/konto/døgn ved 4-cifret pin),
// eller (b) at nogen bevidst låser en navngiven kollega ude ved at afprøve
// forkerte koder for DEN ene email igen og igen. Denne grænse er derfor
// IP-bred — i TILLÆG til, ikke i stedet for, spærringen ovenfor. Den tæller
// KUN mislykkede login-/pin-forsøg (hverken ny registrering eller et
// vellykket login forbruger et slot).
//
// S1 (opfølgende sikkerhedsgennemgang, merge-review): da klient-IP'en
// (src/middleware/clientIp.js) er CF-Connecting-IP, deler HELE messens
// Wi-Fi/NAT typisk ÉN IP — en ren IP-bred grænse PÅ TVÆRS AF SPILLERE låste
// derfor reelt HELE standen ude efter blot 10 forkerte forsøg FRA HVEM SOM
// HELST, mod HVILKEN SOM HELST konto. Grænsen er derfor nu TO LAG:
//
//  1) PIN_IP_MAKS_FORKERTE pr. (IP, email) — samme loft som hidtil, men
//     rammer nu KUN gentagne forsøg mod SAMME konto fra samme sted (to
//     kolleger der deler standens wifi rammer stadig ikke hinandens forsøg
//     på at logge ind rigtigt, og låser heller ikke hinanden ude af HVER
//     SIN konto).
//  2) PIN_IP_ALENE_MAKS_FORKERTE pr. IP ALENE, på tværs af ALLE emails — et
//     markant højere loft, der stadig fanger storskala-udtømningsforsøg
//     (mange forskellige emails afprøvet fra samme sted), uden at ramme
//     almindelig messetrafik. 300/10 min er ~30x det snævre pr.-konto-loft
//     og langt under den generelle skrive-rate-limit (1000/min/IP, se
//     app.js) — rigeligt til at rumme ægte fejltastninger spredt over en
//     hel stands mange enheder, men lavt nok til at stoppe et scan mod
//     mange konti.
const PIN_IP_VINDUE_MS = 10 * 60 * 1000;
const PIN_IP_MAKS_FORKERTE = 10;
const PIN_IP_ALENE_MAKS_FORKERTE = 300;

function normalizePhone(raw) {
  return String(raw || '').replace(/[^0-9]/g, '');
}

function last8(digits) {
  return digits.slice(-8);
}

// S1: nøglen for det snævre (IP, email)-lag. DELETE /me har ingen email i
// sin body (kun `pinkode`) — der bruges i stedet req.player.email, sat af
// auth-middlewaren (requirePlayer, se src/middleware/playerAuth.js) FØR
// routehandleren kører. POST /players har req.player ikke sat, og bruger i
// stedet email fra selve requestens body (samme normalisering — trim +
// lowercase — som den lokale `email`-variabel i login-/registreringsflowet
// nedenfor).
function emailNoegleFra(req) {
  if (req.player && req.player.email) return String(req.player.email).trim().toLowerCase();
  return String((req.body && req.body.email) || '').trim().toLowerCase();
}

// M3/S1: ÉN delt instans pr. app (ikke pr. request, og ikke pr. router) —
// bruges af BÅDE login (nedenfor) og DELETE /me's pinkode-bekræftelse
// (src/routes/me.js), så de to reelt deler SAMME to-lags-tæller (se
// src/app.js, som opretter én instans og sender den til begge routere). Et
// separat/dupliceret eksemplar pr. router ville stille en angriber flere
// selvstændige lofter i stedet for ét fælles pr. lag.
//
// S1 (opfølgende sikkerhedsgennemgang, 2. runde): det høje IP-ALENE-lag
// (PIN_IP_ALENE_MAKS_FORKERTE) gælder i dag for ALLE forbindelser på samme
// IP — også en standtablet med en i forvejen gyldig stand-/admin-session.
// Det betyder en angriber bevidst kan udtømme det delte IP-loft fra en
// ANDEN enhed på samme messe-wifi og dermed lukke standens eget, legitime
// login, selvom standens forbindelse aldrig selv har lavet et forkert
// forsøg. Kaldere der allerede ved at DENNE forbindelse bærer en gyldig
// stand-/admin-session (samme resolveSessionRole()-tjek som ellers bruges
// til at afgøre fulde-navne-privilegie, se src/middleware/adminAuth.js) kan
// derfor sende `{ standPrivilegeret: true }` som andet argument til BÅDE
// check() og consume() — det springer UDELUKKENDE IP-ALENE-laget over for
// dét kald. Det snævre pr.-(IP, email)-lag (prEmailLimiter) er UPÅVIRKET af
// flaget: det beskytter én enkelt konto mod gentagne gæt, ikke standen som
// helhed, og skal blive ved med at ramme uanset session.
//
// Rollen slås op ASYNKRONT (DB-opslag) af kalderen (POST /players, DELETE
// /me) FØR check()/consume() kaldes — selve limiteren her forbliver
// synkron/ren, så den stadig kan testes direkte uden pool/DB (se
// test/players.test.js' S1-tests).
//
// Returnerer et objekt med samme `.check(req, opts)`/`.consume(req, opts)`-
// grænseflade som en almindelig createRateLimiter()-middleware (se
// src/middleware/rateLimit.js) — men sammensat af DE TO lag beskrevet ved
// PIN_IP_VINDUE_MS ovenfor. `check` blokerer hvis ENTEN laget rammes (og
// `standPrivilegeret` ikke er sat); `consume` forbruger ET slot i prEmail-
// laget ALTID, og i ip-alene-laget KUN når `standPrivilegeret` ikke er sat.
function createIpLoginLimiter() {
  const prEmailLimiter = createRateLimiter({
    windowMs: PIN_IP_VINDUE_MS,
    max: PIN_IP_MAKS_FORKERTE,
    keyFn: (req) => `${clientIp(req)}:${emailNoegleFra(req)}`,
    besked: 'For mange mislykkede loginforsøg fra denne forbindelse. Prøv igen senere, eller kom forbi standen.',
  });
  const ipAleneLimiter = createRateLimiter({
    windowMs: PIN_IP_VINDUE_MS,
    max: PIN_IP_ALENE_MAKS_FORKERTE,
    keyFn: (req) => clientIp(req),
    besked: 'For mange mislykkede loginforsøg fra denne forbindelse. Prøv igen senere, eller kom forbi standen.',
  });

  function check(req, opts) {
    const standPrivilegeret = !!(opts && opts.standPrivilegeret);
    const emailRetry = prEmailLimiter.check(req);
    const aleneRetry = standPrivilegeret ? null : ipAleneLimiter.check(req);
    if (emailRetry === null && aleneRetry === null) return null;
    return Math.max(emailRetry || 0, aleneRetry || 0);
  }

  function consume(req, opts) {
    const standPrivilegeret = !!(opts && opts.standPrivilegeret);
    prEmailLimiter.consume(req);
    if (!standPrivilegeret) ipAleneLimiter.consume(req);
  }

  return { check, consume };
}

// M4 (opfølgende sikkerhedsgennemgang): pr.-spiller pin-spærringen
// (pin_fejl/pin_spaerret_til) var hidtil kun skrevet inline i login-flowet
// nedenfor. DELETE /me's pinkode-bekræftelse (src/routes/me.js) skal bruge
// SAMME tæller — ikke en dupliceret, parallel én, der reelt ville give en
// angriber to uafhængige kvoter af forkerte gæt mod den samme konto. Disse
// tre funktioner er derfor den ENE autoritative kilde til "er spilleren
// laast?"/"registrér et forkert forsøg"/"ryd op efter et korrekt forsøg",
// delt mellem de to endpoints.
function pinLaast(row, nu) {
  return !!(row.pin_spaerret_til && new Date(row.pin_spaerret_til).getTime() > nu.getTime());
}

async function registrerPinFejl(client, row, nu) {
  const fejl = (row.pin_fejl || 0) + 1;
  const spaerret = fejl >= PIN_MAKS_FEJL ? new Date(nu.getTime() + PIN_SPAERRING_MS) : null;
  await client.query('UPDATE spiller SET pin_fejl = $1, pin_spaerret_til = $2 WHERE id = $3', [
    spaerret ? 0 : fejl,
    spaerret,
    row.id,
  ]);
}

async function ryddPinFejl(client, row) {
  if (row.pin_fejl || row.pin_spaerret_til) {
    await client.query('UPDATE spiller SET pin_fejl = 0, pin_spaerret_til = NULL WHERE id = $1', [row.id]);
  }
}

async function getCfg(pool) {
  return loadOffentligCfg(pool);
}

async function generateUniqueVennekode(client) {
  for (let i = 0; i < 20; i++) {
    const code = randomCode(4);
    const { rows } = await client.query('SELECT 1 FROM spiller WHERE vennekode = $1', [code]);
    if (!rows.length) return code;
  }
  throw new Error('Kunne ikke generere unik vennekode.');
}

function playersRouter(pool, ws, opts) {
  opts = opts || {};
  const router = express.Router();

  // M3/M4: injiceres fra src/app.js, som opretter ÉN instans og deler den
  // med meRouter (DELETE /me) — se createIpLoginLimiter() ovenfor. Falder
  // tilbage til sin egen instans hvis routeren undtagelsesvis bygges alene
  // (fx et fremtidigt script), men createApp() sender altid den delte ind.
  const ipLoginLimiter = opts.ipLoginLimiter || createIpLoginLimiter();

  router.post('/players', async (req, res, next) => {
    const body = req.body || {};
    // Kun tekst/tal i tekstfelterne og en liste af tekster i tilmeldinger —
    // et objekt med egen toString ville ellers kaste i String() herunder,
    // FØR try-blokken, og tage hele processen ned.
    const erSkalar = (v) =>
      v === undefined || v === null || (typeof v === 'string' && v.length <= 500) ||
      (typeof v === 'number' && Number.isFinite(v));
    const tekstFelter = ['email', 'navn', 'telefon', 'pin', 'firma', 'vennekode', 'udfordringskode'];
    if (
      typeof body !== 'object' || Array.isArray(body) ||
      !tekstFelter.every((k) => erSkalar(body[k])) ||
      (body.tilmeldinger !== undefined && body.tilmeldinger !== null &&
        (!Array.isArray(body.tilmeldinger) || body.tilmeldinger.length > 30 ||
          !body.tilmeldinger.every((x) => typeof x === 'string' && x.length <= 100)))
    ) {
      return res.status(400).json({ fejl: 'Ugyldigt input.', kode: 'ugyldigt_input' });
    }
    const email = String(body.email || '').trim().toLowerCase();
    const navn = String(body.navn || '').trim();
    // Telefon er igen VALGFRIT (brugerens beslutning, telefon-opfølgningen):
    // bruges dels til legacy-login (spillere oprettet før pinkoden, se
    // godkendt-tjekket nedenfor), dels — hvis angivet — gemt ved selve
    // registreringen (se "--- REGISTRERING ---" nedenfor, hvor det også
    // valideres/tjekkes for unikhed). telefonInput er den RÅ, utrimmede
    // tekst — bruges KUN til at afgøre om feltet overhovedet blev udfyldt
    // (en tom/udeladt værdi er OK; en udfyldt værdi, der normaliserer til
    // under 8 cifre, er det ikke, se registreringsblokken).
    const telefonInput = String(body.telefon || '').trim();
    const telefon = normalizePhone(telefonInput);
    const pin = String(body.pin || '').trim();
    const firma = String(body.firma || '').trim();
    const vennekode = String(body.vennekode || '').trim().toUpperCase().slice(0, MAKS_KODE);
    const udfordringskode = String(body.udfordringskode || '').trim().toUpperCase().slice(0, MAKS_KODE);
    const tilmeldinger = Array.isArray(body.tilmeldinger) ? body.tilmeldinger.map(String) : [];

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ fejl: 'Ugyldig emailadresse.', kode: 'ugyldig_email' });
    }
    if (!PIN_RE.test(pin) && telefon.length < 8) {
      return res.status(400).json({ fejl: 'Pinkoden skal være 4 cifre.', kode: 'ugyldig_pin' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT * FROM spiller WHERE email = $1 FOR UPDATE', [email]);

      if (existing.rows.length) {
        // --- LOGIN ---
        const p = existing.rows[0];
        const nu = new Date();

        // S1: slår DENNE forbindelses session-rolle op FØR IP-tjekket — en
        // gyldig stand-/admin-session (samme tjek som maskedName/
        // resolveSessionRole bruges til andre steder, se
        // src/middleware/adminAuth.js) skal IKKE kunne blokeres af at en
        // angriber har udtømt det delte IP-ALENE-loft fra en anden enhed på
        // samme IP. Det snævre pr.-(IP, email)-lag er UPÅVIRKET (se
        // createIpLoginLimiter() ovenfor) — det beskytter stadig DENNE ene
        // konto, uanset standPrivilegeret.
        const rolle = await resolveSessionRole(pool, req);
        const standPrivilegeret = rolle === 'stand' || rolle === 'admin';

        // M3: IP-grænsen tjekkes FØRST (før vi overhovedet ser på DENNE
        // spillers pinkode/spærring) — en IP der allerede har brugt sine 10
        // forsøg op afvises ens, uanset hvilken spillers email den herefter
        // prøver.
        const ipRetryAfterSec = ipLoginLimiter.check(req, { standPrivilegeret });
        if (ipRetryAfterSec !== null) {
          await client.query('ROLLBACK');
          res.set('Retry-After', String(ipRetryAfterSec));
          return res.status(429).json({
            fejl: 'For mange mislykkede loginforsøg fra denne forbindelse. Prøv igen senere, eller kom forbi standen.',
            kode: 'ip_login_spaerret',
          });
        }

        if (pinLaast(p, nu)) {
          await client.query('ROLLBACK');
          // Tæller også med i IP-grænsen — ellers kunne en angriber "gemme"
          // ubegrænsede forsøg bag en allerede-spærret konto uden selv at
          // bruge af sit IP-loft.
          ipLoginLimiter.consume(req, { standPrivilegeret });
          return res.status(429).json({
            fejl: 'For mange forkerte pinkoder. Prøv igen om et kvarter, eller kom forbi standen.',
            kode: 'pin_spaerret',
          });
        }
        let godkendt;
        if (p.pin_hash) {
          godkendt = PIN_RE.test(pin) && verifyPassword(pin, p.pin_hash);
        } else {
          // Spiller oprettet før pinkoden: login med telefonnummeret som hidtil.
          godkendt = telefon.length >= 8 && !!p.telefon && last8(normalizePhone(p.telefon)) === last8(telefon);
        }
        if (!godkendt) {
          // M4: samme delte tæller som DELETE /me's pinkode-bekræftelse
          // bruger, se registrerPinFejl() ovenfor.
          await registrerPinFejl(client, p, nu);
          await client.query('COMMIT');
          // M3: ét mislykket forsøg — tæller mod IP-grænsen uanset hvilken af
          // de to fejlkoder nedenfor der svares (begge er "forkert login").
          ipLoginLimiter.consume(req, { standPrivilegeret });
          if (!p.pin_hash) {
            return res.status(400).json({
              fejl: 'Din profil er oprettet før pinkoderne. Kom forbi standen, så nulstiller vi den.',
              kode: 'mangler_pin',
            });
          }
          return res.status(400).json({
            fejl: 'Pinkoden passer ikke til denne e-mail.',
            kode: 'pin_matcher_ikke',
          });
        }
        await ryddPinFejl(client, p);

        let chFromUpdate = p.ekstra_02;
        if (udfordringskode) {
          const cfg = await getCfg(pool);
          const chal = await client.query(
            'SELECT id, navn FROM spiller WHERE vennekode = $1 AND id != $2',
            [udfordringskode, p.id]
          );
          if (chal.rows.length) {
            chFromUpdate = JSON.stringify({
              kode: udfordringskode,
              fra_spiller_id: chal.rows[0].id,
              fra_navn: chal.rows[0].navn,
              dag: todayStr(new Date()),
            });
          }
        }

        // Opgave C: login OPRETTER en ny token-række — det OVERSKRIVER/
        // tilbagekalder IKKE spillerens øvrige tokens (flere samtidige
        // enheder er nu tilladt, fx telefon + standtablet). Se
        // src/spillerToken.js og API.md.
        const token = await issueToken(client, p.id);
        await client.query('UPDATE spiller SET ekstra_02 = $1 WHERE id = $2', [chFromUpdate, p.id]);
        await client.query('COMMIT');

        return res.json({
          token,
          type: 'login',
          spiller: { pid: p.public_id, navn: p.navn, firma: p.firma, vennekode: p.vennekode },
        });
      }

      // --- REGISTRERING ---
      if (!navn || navn.length > MAKS_NAVN) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: `Navn skal være mellem 1 og ${MAKS_NAVN} tegn.`, kode: 'ugyldigt_navn' });
      }
      // Packrush-opfølgning: firma er nu VALGFRIT (0–40 tegn) — se PATCH /me
      // for hvordan en spiller sætter/retter det bagefter, og API.md/
      // "Packrush-ændringer" for hvorfor spillere uden firma ikke tæller
      // med i firmakampen (companyKey er tom for dem, se src/publicState.js).
      if (firma.length > MAKS_FIRMA) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: `Firmanavn må højst være ${MAKS_FIRMA} tegn.`, kode: 'ugyldigt_firma' });
      }
      if (body.accepterer_betingelser !== true) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: 'Du skal acceptere betingelserne for at oprette en spiller.', kode: 'mangler_accept' });
      }

      if (!PIN_RE.test(pin)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Vælg en pinkode på 4 cifre.', kode: 'ugyldig_pin' });
      }

      // Telefon-opfølgning (brugerens beslutning): valgfrit ved
      // registrering, men SKAL normalisere til mindst 8 cifre når det rent
      // faktisk er udfyldt (tomt/udeladt er OK, se telefonInput ovenfor).
      // telefonForDb gemmes som NULL (ikke ''), når feltet er udeladt — det
      // eksisterende unikke indeks spiller_telefon_unik (001_init.sql, aldrig
      // fjernet) er en almindelig UNIQUE INDEX på en nullable kolonne, og
      // Postgres behandler hvert NULL som forskelligt fra alle andre dér, så
      // flere spillere uden telefon er allerede OK uden ny migration — kun
      // to spillere med SAMME satte nummer kolliderer (tjekkes eksplicit
      // nedenfor for en pæn fejlbesked i stedet for en rå DB-fejl).
      if (telefonInput && telefon.length < 8) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: 'Telefonnummeret skal have mindst 8 cifre.', kode: 'ugyldigt_telefon' });
      }
      const telefonForDb = telefon.length >= 8 ? telefon : null;
      if (telefonForDb) {
        const telefonFindes = await client.query('SELECT 1 FROM spiller WHERE telefon = $1', [telefonForDb]);
        if (telefonFindes.rows.length) {
          await client.query('ROLLBACK');
          return res
            .status(400)
            .json({ fejl: 'Telefonnummeret er allerede i brug af en anden spiller.', kode: 'telefon_i_brug' });
        }
      }
      // Sikkerhedsgennemgang (telefon-opfølgning): sms kræver et
      // telefonnummer — SAMME regel som PUT /me/subs og PUT /me/ticks i
      // src/routes/me.js, ellers kunne kravet omgås ved at sætte
      // sms-fluebenet allerede her i stedet for bagefter via de endpoints.
      if (tilmeldinger.includes('sms') && !telefonForDb) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: 'Du skal angive et telefonnummer for at tilmelde dig sms.', kode: 'telefon_kraeves' });
      }

      const cfg = await getCfg(pool);

      let refSpillerId = null;
      if (vennekode) {
        const ref = await client.query('SELECT id FROM spiller WHERE vennekode = $1', [vennekode]);
        if (ref.rows.length) refSpillerId = ref.rows[0].id;
      }

      let chFrom = null;
      if (udfordringskode && udfordringskode !== vennekode) {
        const chal = await client.query('SELECT id, navn FROM spiller WHERE vennekode = $1', [udfordringskode]);
        if (chal.rows.length) {
          chFrom = JSON.stringify({
            kode: udfordringskode,
            fra_spiller_id: chal.rows[0].id,
            fra_navn: chal.rows[0].navn,
            dag: todayStr(new Date()),
          });
        }
      }

      const nyVennekode = await generateUniqueVennekode(client);
      const publicId = randomPublicId();
      const now = new Date();

      // Initialisér dagens liv (ingen tilmeldinger/flueben endnu -> 0 bonus).
      const tomSpiller = { marketing: false, mailTo: [], notify: false, tick: null };
      const initialBag = lifeState({ day: null, n: 0, t: null, g: [] }, tomSpiller, cfg, now, 0);

      // De valgte tilmeldinger ved oprettelse tæller BÅDE som en varig
      // bekræftelse (setSubsPure — logges i samtykke nedenfor) OG som dagens
      // flueben (setTicksPure — giver friske liv med det samme). Se API.md,
      // "Packrush-ændringer", for hvorfor: uden dette ville en nyoprettet
      // spiller der vælger sms/partner-tilmeldinger ved oprettelse ikke få
      // deres bonusliv før de selv rammer PUT /me/ticks.
      const subResult = setSubsPure(tomSpiller, tilmeldinger, cfg, now);
      const tickResult = setTicksPure(subResult.p, tilmeldinger, cfg, initialBag, now);
      const nyP = tickResult.p;
      const bag = tickResult.bag;

      const ins = await client.query(
        `INSERT INTO spiller (
           public_id, email, navn, telefon, pin_hash, firma, firma_noegle, vennekode,
           ref_spiller_id, marketing, mail_to, notify,
           liv_dag, liv_n, liv_t, chl, badges, ekstra_01, ekstra_02, tick_dag, tick_keys
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'{}'::jsonb,'[]'::jsonb,$16,$17,$18,$19)
         RETURNING id, oprettet`,
        [
          publicId, email, navn, telefonForDb, hashPassword(pin), firma, firmKey(firma), nyVennekode,
          refSpillerId, nyP.marketing, JSON.stringify(nyP.mailTo), nyP.notify,
          bag.day, bag.n, new Date(bag.t), JSON.stringify(bag.g), chFrom, nyP.tick.day, JSON.stringify(nyP.tick.keys),
        ]
      );
      const spillerId = ins.rows[0].id;
      // Opgave C: ny registrering OPRETTER (ligesom login) blot en ny
      // token-række — der er intet "gammelt" token at overskrive her, men
      // samme fælles funktion bruges for konsistens.
      const token = await issueToken(client, spillerId);

      const nowIso = new Date();
      for (const key of subResult.added) {
        const liste = key === 'sp' ? 'smartpack' : key === 'sms' ? 'sms' : 'partner:' + key.slice(2);
        const tekst = samtykkeTekstFor(cfg, key);
        await client.query(
          `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst, tekst_version, kilde, ip, user_agent, type)
           VALUES ($1,$2,$3,$4,$5,'registrering',$6,$7,'bekraeftet')`,
          [spillerId, liste, nowIso, tekst, tekst ? SAMTYKKE_VERSION : 1, clientIp(req), req.headers['user-agent'] || null]
        );
      }

      await client.query('COMMIT');
      invalidateStateCache();
      // Opgave E: state.changed broadcastes nu også ved ny registrering (en
      // ny spiller optræder i GET /state's players-liste) — ikke kun efter
      // et godkendt finish(). Login ændrer intet i state, så det broadcaster
      // ikke.
      if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();

      return res.status(201).json({
        token,
        type: 'ny',
        spiller: { pid: publicId, navn, firma, vennekode: nyVennekode },
      });
    } catch (e) {
      await client.query('ROLLBACK');
      // Hærdning mod en race mellem to samtidige registreringer med SAMME
      // telefonnummer (tjekket ovenfor er ikke låst) — se tilsvarende
      // begrundelse i PATCH /me (src/routes/me.js).
      if (e && e.code === '23505' && e.constraint === 'spiller_telefon_unik') {
        return res
          .status(400)
          .json({ fejl: 'Telefonnummeret er allerede i brug af en anden spiller.', kode: 'telefon_i_brug' });
      }
      next(e);
    } finally {
      client.release();
    }
  });

  return router;
}

// M4: last8, createIpLoginLimiter, pinLaast, registrerPinFejl og ryddPinFejl
// genbruges af DELETE /me (src/routes/me.js) — SAMME telefon-matchningsregel
// (sidste 8 cifre) og SAMME pin-spærringstæller/IP-tæller som login ovenfor,
// ikke dupliserede/separate udgaver (se begrundelserne ved funktionerne).
module.exports = {
  playersRouter,
  normalizePhone,
  last8,
  MAKS_NAVN,
  MAKS_FIRMA,
  PIN_RE,
  createIpLoginLimiter,
  pinLaast,
  registrerPinFejl,
  ryddPinFejl,
};
