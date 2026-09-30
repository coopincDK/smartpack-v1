# API.md — "Packrush" spil-api (tidligere "Pluk. Pak. Send.")

Fuld kontrakt for den autoritative backend til messespillet. Serveren er
autoritativ: den bestemmer og skriver alt spillerdata. Klienter (inkl. andre
spilleres browsere og standvæggens skærm) må KUN læse et offentligt,
PII-frit udtræk via `GET /state`.

Alle fejlsvar er JSON på formen `{"fejl": "<dansk besked>", "kode": "<maskinlæsbar_kode>"}`.
Alle tidsangivelser er ISO 8601 / timestamptz. Dage (`day`, `dag`) er
`YYYY-MM-DD` i **UTC** — se afsnittet "Dage og tidszoner" nedenfor.

Mounting: alle ruter i dette dokument er relative til Express-appens rod
(`app.use(...)` uden præfiks). Fase 2's nginx forventes at proxye
`/api/spil/*` → dette API'ets rod (dvs. nginx strippe `/api/spil`-præfikset
før videresendelse). Det er en pragmatisk beslutning: serveren selv kender
ikke til noget præfiks, så den kan testes og køres identisk lokalt og i
produktion — kun nginx's `proxy_pass`-regel adskiller dem.

---

## Autentifikation

- **Spillere:** `Authorization: Bearer <token>` — 64 tegn hex, udstedt af
  `POST /players` (kun ved oprettelse/login). Serveren gemmer kun
  `sha256(token)` i `spiller.token_hash`.
- **Admin:** HttpOnly+Secure+SameSite=Strict cookie `spil_admin_session`,
  sat af `POST /admin/login`. Session-tokens gemmes hashet i `admin_session`.

## Klient-IP

Serveren læser **udelukkende** `X-Client-IP` (sat af host-nginx i fase 2 ud
fra Cloudflares `CF-Connecting-IP`). Den stoler ALDRIG på klientens egen
`X-Forwarded-For`, og `app.set('trust proxy', ...)` bruges ikke. Mangler
`X-Client-IP` (fx lokale tests), falder den tilbage til
`req.socket.remoteAddress`. Se `src/middleware/clientIp.js`.

## Dage og tidszoner

Alle "dags"-begreber (liv-reset, dagens rangliste, dagens rekord, beaten-
notifikationer) bruger **UTC-dato** (`Date.toISOString().slice(0,10)`), ikke
spillerens lokale tid. Messen kører fra én fysisk stand med én server — en
enkelt, konsistent tidszone er tilstrækkeligt, og UTC undgår problemer med
sommertids-spring midt i en messedag. Hvis fase 2 ønsker at dagsskiftet skal
ske ved fx kl. 00:00 dansk tid i stedet, er det en lille, isoleret ændring i
`src/rules/life.js#todayStr` og `src/gameQueries.js#todayStr`.

---

## Offentlige endpoints

### `GET /health`
Ingen auth. `200 { "ok": true }`.

### `GET /state`
Ingen auth KRÆVET, men svaret afhænger af en evt. session-cookie (se
"Packrush-ændringer" nedenfor): som udgangspunkt vises kun `"Fornavn E."`
(fornavn + efternavns-forbogstav) i `name` og `duel.vs` — en gyldig admin-
eller stand-session-cookie giver de FULDE navne. Cachet 2 sekunder i
hukommelse (`src/publicState.js`), på den fulde/interne udgave — selve
navne-maskeringen sker billigt pr. request ovenpå cachen.

```json
{
  "cfg": { "perDay": 5, "bf": true, "mission": "total", "...": "..." },
  "players": [
    {
      "pid": "AbCdEfGhI2",
      "name": "Anna Andersen",
      "company": "Smartpack ApS",
      "companyKey": "smartpack",
      "created": "2026-09-30T08:00:00.000Z",
      "badges": ["fejlfri", "bf"],
      "attempts": [
        {
          "score": 410,
          "rounds": [120, 150, 140],
          "s": { "orders": 6, "errors": 0, "fast": 1.8, "...": "..." },
          "day": "2026-09-30",
          "at": "2026-09-30T10:00:00.000Z",
          "end": "2026-09-30T10:01:35.000Z",
          "bf": false,
          "duel": { "vs": "Bo Hansen" }
        }
      ]
    }
  ]
}
```

`cfg` er **offentlig**-delen af config-tabellen — `pin` er ALDRIG med, hverken
her eller nogetsteds i et offentligt svar. Kun `status='godkendt'`-forsøg
optræder i `attempts`. Der findes intet felt for email/telefon/samtykker/
vennekode/ref — hverken direkte eller indirekte (heller ikke i `duel`, som
kun får lov at bære et sanitiseret `{vs: <navn, maks 40 tegn>}` — se
`src/publicState.js#sanitizeDuel`).

### `POST /players`
Registrering ELLER login, afgjort af om emailen findes.

**Request:**
```json
{
  "navn": "Anna Andersen",
  "email": "anna@firma.dk",
  "telefon": "20304050",
  "firma": "Smartpack ApS",
  "vennekode": "AB3D",
  "udfordringskode": "",
  "tilmeldinger": ["sp", "m:Sprii", "sms"],
  "accepterer_betingelser": true
}
```
- `navn`: 1–22 tegn. `firma`: 1–40 tegn. `telefon`: normaliseres til kun
  cifre, skal have mindst 8 cifre. `vennekode`/`udfordringskode`: maks 5 tegn,
  case-insensitive.
- `tilmeldinger`: liste af nøgler fra `subOptions()` (`sp`, `m:<partner>`,
  `sms`).

**201 (ny spiller):**
```json
{ "token": "64-tegns-hex-bearer-token", "type": "ny",
  "spiller": { "pid": "AbCdEfGhI2", "navn": "Anna Andersen", "firma": "Smartpack ApS", "vennekode": "K7M2" } }
```
**200 (login — email fandtes, telefon matchede):**
```json
{ "token": "nyt-64-tegns-hex-bearer-token", "type": "login",
  "spiller": { "pid": "...", "navn": "...", "firma": "...", "vennekode": "..." } }
```
Bemærk: token **roteres** ved hvert login (nyt token udstedes, det gamle
holder op med at virke) — det er sådan en spiller uden lokal token kan logge
ind igen.

**Fejl:**
| Status | kode | Betydning |
|---|---|---|
| 400 | `ugyldig_email` | Emailformat er ugyldigt |
| 400 | `ugyldigt_telefon` | Telefon har under 8 cifre |
| 400 | `telefon_matcher_ikke` | Login: de sidste 8 cifre matcher ikke — intet overskrives |
| 400 | `ugyldigt_navn` / `ugyldigt_firma` | Længde uden for 1–22 / 1–40 tegn |
| 400 | `mangler_accept` | `accepterer_betingelser` ikke `true` ved ny spiller |
| 400 | `telefon_optaget` | Telefonnummeret er allerede knyttet til en anden spiller |

### `GET /me` (bearer)
```json
{
  "pid": "AbCdEfGhI2", "navn": "...", "email": "...", "telefon": "...", "firma": "...",
  "vennekode": "K7M2", "badges": ["fejlfri"],
  "abonnementer": [{ "key": "sp", "label": "SmartPack nyheder", "life": false }, "..."],
  "mine_noegler": ["sp", "sms"],
  "mine_flueben": ["sms"],
  "samtykker": [
    {
      "liste": "sms",
      "aktiv": true,
      "foerste_bekraeftelse": "2026-09-29T08:00:00.000Z",
      "seneste_haendelse": { "type": "bekraeftet", "tidspunkt": "2026-09-30T09:00:00.000Z" },
      "tekst_version": 1
    }
  ],
  "liv": { "n": 3, "next_regen_ms": 900000 },
  "notifikationer": [{ "id": 12, "type": "beaten", "data": {"...": "..."}, "oprettet": "...", "seen": false }],
  "tickets": 4
}
```
`mine_noegler` er den VARIGE tilmelding, `mine_flueben` er DAGENS flueben —
se "Packrush-ændringer" for forskellen. `samtykker` er nu afledt af
hændelsesloggen (`aktiv` = seneste hændelse for listen er `bekraeftet`).

### `POST /me/seen` (bearer)
Body `{ "ids": [12, 13] }` (valgfri — udelades for at markere ALT som set).
`200 { "ok": true }`.

### `POST /me/challenge` (bearer)
Body `{ "code": "K7M2" }`. Sætter `p.chFrom` server-side (bruges af
`finish()`-flowet til at give udfordreren +1 liv, når DENNE spiller
gennemfører et forsøg i dag).
`200 { "ok": true, "udfordrer": "Bo Hansen" }` eller
`400 { "fejl": "Ukendt udfordringskode.", "kode": "ukendt_kode" }`.

### `PUT /me/subs` (bearer) — VARIG af-/tilmelding
Body `{ "keys": ["sp", "sms"] }` — det ØNSKEDE fulde, VARIGE sæt.
`200 { "ok": true, "liv": {...}, "mine_noegler": [...] }`.

**Siden Packrush giver dette endpoint IKKE længere liv** (se
"Packrush-ændringer" — det gør kun `PUT /me/ticks`). Det sætter/afmelder den
varige tilmelding: en tilføjet nøgle logges som en `bekraeftet`-hændelse i
samtykke, en fjernet nøgle logges som `trukket_tilbage`. En liste der
afmeldes varigt her, fjernes samtidig fra DAGENS flueben (`mine_flueben`),
hvis den var tikket af.

### `PUT /me/ticks` (bearer) — DAGENS flueben
Body `{ "keys": ["sms"] }` — det ØNSKEDE fulde sæt af DAGENS
fluebens-nøgler (nulstilles hver dag).
`200 { "ok": true, "friske_liv": 1, "liv": {...}, "mine_noegler": [...], "mine_flueben": [...] }`.

Dette er stedet der GIVER liv (kun for lister med `life: true`, og kun
lister der ikke allerede har givet liv i dag — "friske_liv"). Et NYT
flueben er samtidig en ny, VARIG bekræftelse: nøglen logges som
`bekraeftet` i samtykke, og vokser `mine_noegler` (marketing/mailTo/notify)
— ALDRIG krympende. At fjerne et flueben er KUN for i dag og rører IKKE den
varige tilmelding (brug `PUT /me/subs` eller `DELETE /me/subs/:liste` for
det). Bemærk: gentikker man en liste flere gange samme dag (fjern, sæt,
fjern, sæt...), logges en NY `bekraeftet`-hændelse hver gang (svarer 1:1 til
klientens reference-implementering), men der gives kun liv FØRSTE gang.

### `DELETE /me/subs/:liste` (bearer) — ægte, varig afmelding af ÉN liste
`:liste` er en tilmeldings-NØGLE (`sp`, `m:<partner>`, `sms` — samme format
som `keys` ovenfor), IKKE samtykke-tabellens listenavn
(`smartpack`/`partner:X`/`sms`). Sætter varig status til `trukket_tilbage`
(logger hændelsen), fjerner listen fra dagens flueben hvis den er der, og
opdaterer `marketing`/`mailTo`/`notify` tilsvarende. Idempotent: at slette
en liste der ikke er tilmeldt, fejler ikke.
`200 { "ok": true, "mine_noegler": [...] }`.
Findes endnu ikke i spillets UI (`spil/index.html`) — tilføjes i en kommende
ombygning, men kontrakten er klar nu.

### `POST /me/boost` (bearer)
Indløser dagens sms-boostkode (svarer til klientens `useCode()`). Body
`{ "code": "K7M2" }`. Kræver aktiv sms-tilmelding (`notify=true`), at koden
matcher `boostCode(idag, cfg.hemmelig.pin)`, og at spilleren ikke allerede
har brugt dagens boost. Giver `cfg.boostLives` (default 2) ekstra liv.

`200 { "ok": true, "liv": { "n": 6, "next_regen_ms": null } }`.

Fejl: `mangler_kode`, `boost_ikke_aktiv` (`cfg.smsBoost===false`),
`ikke_tilmeldt_sms`, `allerede_brugt`, `forkert_kode`. PIN'en koden er
udledt af forlader ALDRIG serveren her — kun spillerens gæt sammenlignes
mod et server-udregnet facit (`src/rules/boostCode.js`).

### `POST /runs` (bearer)
Starter et forsøg. Bruger ét liv. Rate-limit: 1 kald / 20 sek. / spiller.

`201`:
```json
{ "runde_id": "5b1...uuid", "start_server": "2026-09-30T10:00:00.000Z", "liv": { "n": 4, "next_regen_ms": null } }
```
Har spilleren allerede et aktivt (< 15 min. gammelt) forsøg, returneres DET
uden at bruge endnu et liv: `200 { "runde_id": "...", "start_server": "...", "genoptaget": true }`.

`400 { "fejl": "Du har ikke flere liv lige nu.", "kode": "ingen_liv" }`.

Bane-seed (TRACK): **ikke implementeret i fase 1.** Klientens rundeindhold
(hvilke varer, hvornår powerups spawner) er i dag deterministisk pr. runde
via en lokal seedet RNG (`trackRng('pluk')` osv. i spillets kildekode), men
serveren stoler IKKE på klientens rå spilforløb — kun på de indsendte
runde-scorer + stats, valideret mod snydegrænserne nedenfor. At synkronisere
et server-udstedt seed ville gøre det muligt at genafspille/verificere hele
forløbet, men er ikke nødvendigt for MVP'ets trusselsmodel (vi accepterer
generøse, men endelige, øvre grænser i stedet). Overvej det i en senere
iteration hvis snyd bliver et reelt problem.

### `POST /runs/:runde_id/finish` (bearer)
Body:
```json
{
  "rounds": [120, 150, 140],
  "s": { "orders": 6, "errors": 0, "fast": 1.8, "packed": 7, "perfects": 3, "streak": 3, "tower": 6, "turbos": 1, "sent": 12, "rets": 3, "strikes": 0, "pus": 2, "partners": 1 },
  "bf": false,
  "duel": null,
  "spilletid_klient_ms": 92000
}
```
**IDEMPOTENT:** samme `runde_id` (og samme ejer) igen ⇒ samme svar,
INGEN bivirkninger køres igen (tjekket via `forsoeg.status !== 'aktiv'`,
og selve svaret er cachet i `forsoeg.resultat` — se "Afvigelser" nedenfor).

**200 (godkendt):**
```json
{
  "godkendt": true,
  "forsoeg": { "runde_id": "...", "rounds": [120,150,140], "samlet": 410, "s": {...}, "bf": false, "spilletid_server_ms": 92300 },
  "maerker": ["fejlfri"],
  "feats": [{ "metric": "orders", "type": "dagens_rekord", "vaerdi": 6 }],
  "rang": { "rank": 2, "others": 5, "days": 3 },
  "liv": { "n": 4, "next_regen_ms": null },
  "tickets": 4
}
```
**400 (afvist):**
```json
{ "godkendt": false, "aarsag": "urealistisk_score", "besked": "Runde 2's score (25000) overstiger det maksimalt mulige og kan ikke godkendes." }
```
Livet er stadig brugt (det blev brugt ved `POST /runs`) — afvisning giver
det ikke tilbage. `404` hvis `runde_id` ikke findes eller ikke tilhører den
autentificerede spiller. `409` hvis forsøget er `udloebet`/allerede afsluttet
uden et cachet resultat (bør reelt aldrig ske i praksis).

Afvisningskoder: `ugyldigt_format`, `urealistisk_score`, `ugyldig_tid`,
`for_kort_spilletid`, `for_lang_spilletid`, `tid_mismatch`,
`ustats_konsistens` — se "Snydegrænser" nedenfor.

---

## WebSocket `/ws`

Simpelt JSON-besked-protokol, rum-baseret (svarer til klientens tidligere
`claude.use('room')`). Maks. 4 KB pr. besked, maks. 10 beskeder/sek. pr.
forbindelse.

| Besked (klient → server) | Krav | Effekt |
|---|---|---|
| `{"type":"hello","token":"..."}` | — | Autentificerer forbindelsen (valgfrit — uden token forbliver den anonym/lytte-kun). Svar: `{"type":"hello.ok","authenticated":true\|false}` |
| `{"type":"join","room":"..."}` | — | Lyt-adgang til et rum (fx standvæggen). Svar: `{"type":"joined","room":"...","users":[...]}` |
| `{"type":"presence","room":"...","name":"..."}` | spiller-token | Sæt synligt navn i rummet. Broadcaster `{"type":"presence","room":"...","users":[{"id":.., "name":".."}]}` til alle i rummet |
| `{"type":"emit","room":"...","event":"duel.go"\|"duel.s","data":{...}}` | spiller-token | Relayer `{"type":"event","room":"...","event":"...","data":{...},"from":{...}}` til alle ANDRE i rummet |

Server → alle forbindelser: `{"type":"state.changed"}` når spillerdata/
config ændres (efter enhver skrivning der rører `GET /state`-udtrækket).

Uden gyldigt spiller-token afvises `presence`/`emit` med
`{"type":"error","message":"..."}` — anonyme forbindelser (standvæggen) kan
KUN `join` og lytte.

**Navnevisning (siden Packrush):** `presence`- og `event`-beskeder
(`users[].name`, `from.name`) er PERSONALISEREDE pr. modtagende forbindelse
— ikke én delt besked. En forbindelse med en gyldig admin- eller
stand-session (læst fra samme sessionscookie som HTTP-adminpanelet, sendt
automatisk af browseren ved selve WS-håndtrykket) ser det FULDE navn; alle
andre forbindelser (anonyme standvægs-lyttere, almindelige spilleres egne
telefoner) ser `"Fornavn E."`. Se "Packrush-ændringer".

---

## Admin (`/admin/*`, cookie-session)

| Metode + sti | Beskrivelse |
|---|---|
| `POST /admin/login` `{password}` | 5 forsøg/min/IP. Sætter admin-sessionscookie (`rolle='admin'`). |
| `POST /admin/logout` | Sletter sessionen (både cookie og DB-række). |
| `GET /admin/spillere` | Fuld spillerliste (PII + tickets) til adminpanelet. |
| `GET /admin/eksport/spillere.csv` | Alle spillere (navn, email, telefon, firma, vennekode, oprettet, skjult). |
| `GET /admin/eksport/samtykke/:liste.csv` | Samtykke-hændelseslog for én liste, opsummeret pr. spiller: FØRSTE + SENESTE bekræftelse + `aktiv`-status (`:liste` valideres mod `^[a-z0-9:_.-]+$`). |
| `GET /admin/eksport/sms.csv` | Spillere med aktiv (`bekraeftet`) sms-status lige nu. |
| `GET /admin/eksport/revanche.csv` | Sms-tilmeldte (aktiv status) der er blevet overhalet i dag, inkl. sms-tekst-skabelon (se "Afvigelser"). |
| `POST /admin/lodtraekning` `{kort_navn}` | Vægtet tilfældig lodtrækning ud fra `tickets()`, logger i `raffle_draws`. |
| `GET /admin/config` / `PUT /admin/config` | Hent/gem hele config (inkl. `hemmelig.pin`). |
| `GET /admin/boostkode` | Dagens sms-boostkode (KUN her — aldrig i noget offentligt svar). |
| `POST /admin/spillere/:pid/skjul` `{skjult}` | Skjul/vis en spiller i `GET /state`. |
| `DELETE /admin/spillere/:pid` | RIGTIG GDPR-sletning (spiller + alle forsøg/samtykker/notifikationer). |
| `POST /admin/stand-login-kode` | **Kræver `rolle='admin'`** (ikke `stand`). Udsteder en ét-gangs-kode til standtablet-login, se "Stand-login-flow". |

Alle ovenstående (undtagen `/admin/login`) kræver `rolle='admin'` —
en `stand`-session giver **403 `{"kode":"kraever_admin"}`** på ethvert af
dem. Se "Stand-login-flow" for hvad en `stand`-session KAN.

### `POST /stand-login` (offentligt — intet admin-krav)
Body `{ "kode": "AB12CD" }`. Se "Stand-login-flow" nedenfor.
`200 { "ok": true }` (sætter en langtlevende `rolle='stand'`-sessionscookie)
eller `400 { "fejl": "Ugyldig eller udløbet kode.", "kode": "ugyldig_kode" }`.

---

## Klientfunktion → endpoint-mapping

| Klientfunktion (spil/index.html) | Erstattes/leveres nu af |
|---|---|
| `rank(k, filt)` | `GET /state` (klienten genudregner selv ud fra `players[].attempts`); server bruger samme logik internt til `rang`-feltet i finish-svaret og til badge-konteksten |
| `firms(filt)` | `GET /state` — klienten grupperer selv pr. `companyKey` |
| `hourWinners()` / `hourBoard()` | Ikke porteret server-side i fase 1 — kan udledes klient-side af `players[].attempts[].at/end` på samme måde som i dag. Nævnt her som kendt hul, se "Afvigelser". |
| `pval(p)` (lifeState/dailyStart) | `GET /me`'s `liv`-felt (`n`, `next_regen_ms`), udregnet server-side af `src/rules/life.js` |
| `tickets(p)` | `GET /me`'s `tickets`-felt, og `POST /runs/:id/finish`'s `tickets`-felt |
| `badgeEl(...)` | `spiller.badges` (i `GET /state` og `GET /me`) + `maerker` i finish-svaret |
| `showResult(...)` | Hele `POST /runs/:id/finish`-svaret (`godkendt`, `feats`, `rang`, `liv`, `tickets`, `maerker`) |
| `useCode()` (sms-boost) | `POST /me/boost` |
| `revList()` | `GET /admin/eksport/revanche.csv` |

---

## Snydegrænser

Disse er **bevidst generøse lofter** (plausibelt maks × ~1.5–1.8 margin),
ikke et forsøg på at balancere spillet — de skal kun fange forfalskede eller
fysisk umulige indsendelser. Se `src/rules/scoring.js`.

### Runde 1 — Pluk (`ROUND_MAX[1] = 12000`)
- Point pr. korrekt tryk: `10 + comboBonus(≤5) + robotbonus(5)` ⇒ maks 20/tryk.
- Antaget urealistisk hurtig, men "fysisk mulig" tryktakt: 6 tryk/sek. i alle
  30 sek. = 180 tryk (ingen reel spiller kan holde dette i 30 sek. inkl.
  at finde det rigtige felt blandt 9 og reagere på nye ordrer).
- ~40 fuldførte ordrer (gennemsnit 4,5 vare/ordre) × maks ordre-bonus
  (`10 + 5·need.length + quick`, quick op til ~48 ved 5-vares-ordre) ≈ 83/ordre.
- Rå maks ≈ 180×20 + 40×83 ≈ 6920. × margin 1,75 ⇒ **12000**.

### Runde 2 — Pak (`ROUND_MAX[2] = 21000`)
- Antaget maks. kassetakt: 1 kasse / 0,75 sek. = 40 kasser på 30 sek.
- Værste tilfælde: ALLE 40 er perfekte, streak vokser lineært, og Turbo
  (×2) er aktiv hele tiden (i praksis umuligt — Turbo kræver 3 rene kasser
  i træk og varer kun 6 sek. ad gangen, men vi regner det ekstremt for at
  have god margin): kasse k giver `(10+k) + (10+5k)` point, ×2 for turbo.
  Sum for k=1..40 ⇒ 11440. Plus tårnbonus hver 5. niveau fra 10 (11
  milestones × `level·5·2`) ⇒ 1750. Rå maks ≈ 13190. × margin 1,6 ⇒ **21000**.

### Runde 3 — Send (`ROUND_MAX[3] = 12000`)
- Antaget op til ~5 nye ordrer/sek. i sum ~24 sek. med aktive partner-
  boosts (urealistisk højt overlap af alle boosts samtidig, men generøst
  antaget for margin) + normal takt i de resterende 6 sek. ≈ 124 ordrer.
- Blanding af 20/30/40-points ordrer (generøst sat til gennemsnit 40) +
  op til ~9 powerup-samlinger (`+25` hver) + op til 3× Sprii-bonus (`+100`)
  + op til ~20 reddede returer i Revershero-vindue (`+30` hver, dobbelt)
  + leftover lager (`stock·3`, lagt til EFTER BF-multiplikation).
- Rå maks ≈ 124×40 + 9×25 + 3×100 + 20×30 + 150 ≈ 6235. × margin 1,8 ⇒ **~11200**, rundet op til **12000**.

Alle tre lofter regnes som den **endelige, indsendte** rundescore — dvs.
Black Friday's ×2-multiplikation og 1,35× hastighed er allerede indregnet i
udledningen ovenfor (vi har regnet "værste tænkelige tilfælde under BF" ind
i selve estimatet, ikke som et separat tillæg).

### Spilletid
- `MIN_SPILLETID_MS = 70000` (3×30 sek. minus generøs margin til tidlig
  rundeafslutning, fx Send der stopper ved 3 strikes, ELLER Pak's
  "overtime"-forlængelse — vi tillader begge retninger ved kun at sætte et
  loft, ikke et gulv, på afvigelsen).
- `MAX_SPILLETID_MS = 150000` (3×30 sek. + 60 sek. UI/netværks-slack).
- `SPILLETID_TOLERANCE_MS = 20000`: server- og klienttid skal ligge inden
  for 20 sek. af hinanden.
- Både servertid (`slut_server - start_server`) OG klientens
  `spilletid_klient_ms` skal individuelt være ≥ `MIN_SPILLETID_MS`.

### Stats-konsistens (billige, løse tjek)
- `packed ≥ tower`, `perfects ≤ packed`, `streak ≤ packed`.
- `fast > 0 ⇒ orders ≥ 1`.

---

## Packrush-ændringer

Denne opfølgende ændringsrunde porterer de regelændringer der fulgte med
klientens omdøbning fra "Pluk. Pak. Send." til "Packrush" (commit `ec81ec6e1`
i `spil/index.html`). Kort opsummeret hvad der ændrede sig og hvorfor:

### A) Liv: nyt loft + dagens flueben vs. varig tilmelding

- **`perDay`** (dagligt grundtal af liv) sænket fra `5` til `3` — både i
  `DEFAULT_CFG` (`src/rules/constants.js`) og i den allerede seedede
  config-række (migration `003_packrush.sql` opdaterer `offentlig.perDay`
  med `jsonb_set`, uden at røre andre admin-tilpassede felter).
- **`MAX_LIVES = 7`** — nyt hårdt loft. Al liv-tildeling (dagligt grundtal,
  dagens-flueben-bonus, sms-boost, udfordrings-/vennekode-gaveliv) klemmes
  nu til `Math.min(n, MAX_LIVES)`.
- **Dagens flueben (`p.tick` / DB: `spiller.tick_dag`, `spiller.tick_keys`)
  er nu det der afgør DAGLIG liv-bonus** — IKKE længere den varige
  tilmelding. En spiller der er varigt tilmeldt sms/en partnerliste, men
  ikke har tikket af i dag, får ALTSÅ ingen bonusliv den dag. Se
  `src/rules/life.js#lifeKeys/dailyStart/subsCount`, som nu tager `now` og
  læser `todayTickKeys(p, now)` i stedet for `subKeys(p)`.
- **To adskilte endpoints:**
  - `PUT /me/subs` = den VARIGE af-/tilmelding (`setSubsPure`). Giver IKKE
    længere liv. Logger `bekraeftet`/`trukket_tilbage` i samtykke.
  - `PUT /me/ticks` = DAGENS flueben (`setTicksPure`). Giver friske liv
    (højst én gang pr. liste pr. dag, husket i `spiller.ekstra_01`/`L.g` —
    genbrugt uændret fra fase 1, ikke en ny kolonne). Et NYT flueben er
    SAMTIDIG en ny, varig bekræftelse (vokser `marketing`/`mail_to`/`notify`
    — ALDRIG krympende). Fjernelse af et flueben er KUN for i dag.
  - `DELETE /me/subs/:liste` = ægte, varig afmelding af ÉN liste (ny — findes
    endnu ikke i spillets UI, men kontrakten er klar til den kommende
    ombygning af `spil/index.html`).
- **Antagelse/afvigelse:** ved `POST /players` (registrering) tæller de
  valgte `tilmeldinger` BÅDE som en varig bekræftelse OG som dagens flueben
  (kalder både `setSubsPure` og `setTicksPure`), så en nyoprettet spiller
  får sit bonusliv med det samme. Dette står ikke eksplicit i briefen, men
  uden det ville en ny spiller der vælger sms ved oprettelse ikke få
  bonuslivet før de selv rammer `PUT /me/ticks`.

### B) Navnevisning: fuldt navn kun for admin/stand

- `GET /state` og alle WS-broadcasts (`presence`, `event`/duel) viser som
  udgangspunkt kun `"Fornavn E."` (`src/rules/nameDisplay.js#shortName`).
  Fulde navne kræver en gyldig `admin`- eller `stand`-sessionscookie.
- **Ny sessionstype `stand`** (`admin_session.rolle`): langtlevende (3 dage,
  `STAND_SESSION_TTL_MS`), giver KUN ret til fulde navne — ingen andre
  admin-rettigheder (`requireAdmin` afviser en `stand`-session med
  `403 kraever_admin` på ALLE `/admin/*`-endpoints undtagen selve
  login-kode-udstedelsen, som i sig selv kræver `rolle='admin'`).
- **Stand-login-flow:**
  1. En admin (fuld session) kalder `POST /admin/stand-login-kode` →
     genererer en 6-tegns, tilfældig, ét-gangs-kode (`stand_login_kode`-
     tabellen), gyldig 5 minutter.
  2. En medarbejder taster koden ind på standtablettens EGEN browser via
     `POST /stand-login {kode}` (intet admin-krav — koden ER
     adgangsbeviset). Ved match markeres koden `brugt` og en `stand`-session
     udstedes KUN til DEN forbindelse (samme cookie-navn/mekanisme som
     admin).
  3. WS-forbindelser autentificerer sig som admin/stand AUTOMATISK ved selve
     håndtrykket (browseren sender sessionscookien med opgraderings-
     requesten) — ingen eksplicit token-besked nødvendig.
- **WS-personalisering:** `src/ws.js` beregner presence-/event-payloads PR.
  MODTAGENDE forbindelse (ikke længere én delt besked) — se
  `isPrivileged()`/`displayName()` i filen.

### C) Natlig GDPR-oprydning

- `src/retention.js#findRetentionCandidates` (ren, testbar funktion) finder
  spillere UDEN nogen liste med aktiv (`bekraeftet`) status OG ≥12 måneder
  siden seneste aktivitet (seneste `forsoeg.oprettet`, ellers spillerens
  egen `oprettet`). `deleteInactivePlayers` udfører selve cascade-sletningen
  (samme rækkefølge som `DELETE /admin/spillere/:pid`).
  `scripts/retention-job.js` er den natlige cron-indgang — se README.md for
  drift/skemalægning. Kører IKKE automatisk endnu (kun kode/migration/cron-
  DOKUMENTATION i denne runde).
- **Bemærk (portabilitets-workaround):** `findRetentionCandidates` og de to
  admin-CSV'er der filtrerer på "aktiv liste lige nu" (`sms.csv`,
  `revanche.csv`, samtykke-CSV'en) undgår BEVIDST at filtrere/joine SQL-side
  på en afledt DISTINCT ON-kolonne (fx `samtykke_status.seneste_type` i en
  `JOIN ... ON`/`WHERE`) — et par lokale eksperimenter viste at pg-mem
  (testsuitens fallback uden Docker, se README.md) kan skubbe et sådant
  filter NED FØR selve DISTINCT ON'en og dermed ophæve dedupliceringen,
  hvilket giver forkerte svar (kun i testfallbacket — ægte Postgres rammes
  ikke). Vi henter derfor `samtykke_status`/rå samtykke-hændelser HELT
  UFILTRERET og afgør status i JS, hvilket er lige så hurtigt på en messes
  datamængde og virker identisk begge steder.

### D) `cfg.lifeBonus`

Bekræftet uændret og testet (`test/life.test.js`): `cfg.lifeBonus === false`
gør `lifeKeys(p, cfg, now)` tom (ingen liv fra tilmeldinger/flueben), og
`PUT /admin/config` kunne allerede sætte feltet (generisk passthrough) —
ingen kodeændring nødvendig ud over selve testen.

### Skemaændringer (migration `003_packrush.sql`)

- `spiller`: nye kolonner `tick_dag date`, `tick_keys jsonb`. (`ekstra_01`
  genbruges uændret til `L.g`, se ovenfor.)
- `samtykke`: omlagt fra "én række pr. abonnement, med et evt.
  `trukket_tilbage`-tidspunkt" til en ren hændelseslog: `givet` → omdøbt til
  `tidspunkt`; `trukket_tilbage`-kolonnen fjernet; ny `type`-kolonne
  (`'bekraeftet' | 'trukket_tilbage'`). Historiske afmeldte rækker
  (`trukket_tilbage IS NOT NULL`) splittes robust til to hændelsesrækker
  ved migrering, selvom der reelt ikke er substantiel data at bevare.
- Nyt view `samtykke_status`: `DISTINCT ON (spiller_id, liste)` — den
  afledte, VARIGE status pr. (spiller, liste). Se portabilitets-noten under
  opgave C for hvordan den bruges sikkert.
- `admin_session`: ny kolonne `rolle` (`'admin' | 'stand'`, default
  `'admin'`).
- Ny tabel `stand_login_kode`: ét-gangs-koder til stand-login-flowet.

---

## Afvigelser fra briefen / kendte huller (fase 1)

1. **`forsoeg.resultat` (jsonb, ny kolonne)** — ikke nævnt i den oprindelige
   datamodel-liste. Tilføjet for at gøre `POST /runs/:id/finish` ægte
   idempotent uden at genudregne badges/feats/notifikationer (som er
   engangs-bivirkninger) ved gentagne kald. Se `migrations/001_init.sql`.
2. **`hourWinners()`/`hourBoard()`** (timens boss) er IKKE porteret
   server-side i fase 1 — `GET /state` giver nok rådata (`attempts[].at`)
   til at klienten kan udlede det selv, ligesom i dag, men der er intet
   dedikeret endpoint eller server-side badge/notifikation for det. Kan
   tilføjes i en opfølgning uden skemaændring.
3. **Bane-seed (TRACK)** — bevidst IKKE implementeret, se begrundelse under
   `POST /runs` ovenfor.
4. **Send-rundens præcise stats-feltnavne** — briefen var usikker på de
   eksakte navne ud over `sent/rets/strikes/pus/partners`. Vi har valgt at
   acceptere ETHVERT talfelt klienten sender i `s` (op til 40 felter, kun
   number/boolean-værdier, resten forkastes stille) og gemmer dem alle i
   `forsoeg.stats`. Badges/feats bruger kun de eksplicit navngivne felter.
5. **`revList()`/revanche-CSV'ens sms-teksts nøjagtige ordlyd** er ikke
   kendt fra briefen — vi har digtet en plausibel, kort dansk skabelon
   (se `src/routes/admin.js`). Bør godkendes af en marketingansvarlig før
   den bruges til at sende rigtige sms'er.
6. **`vennekode` vs. `udfordringskode`** antages at dele samme kodenavnerum
   (spillerens ene `vennekode`-kolonne) — vennekode-feltet bruges til at
   sætte `ref_spiller_id` (kun ved NY registrering), udfordringskode-feltet
   bruges til at sætte `chFrom` (både ved registrering og login). Dette er
   en fortolkning, ikke en bekræftet detalje fra den oprindelige klientkode.
7. **`GET /admin/spillere`** har ingen paginering — fint til en messes
   skala (formentlig hundreder, ikke millioner, af spillere), men bør
   pagineres hvis spillet genbruges til noget større.
8. Rate-limiteren er **in-memory, pr. proces** — fint til fase 1/2 (én
   Node-proces), men skal erstattes af en delt store (Redis e.l.) hvis
   API'et nogensinde skaleres til flere instanser.
