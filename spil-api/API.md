# API.md — "Packrush" spil-api (tidligere "Pluk. Pak. Send.")

Fuld kontrakt for den autoritative backend til messespillet. Serveren er
autoritativ: den bestemmer og skriver alt spillerdata. Klienter (inkl. andre
spilleres browsere og standvæggens skærm) må KUN læse et offentligt,
PII-frit udtræk via `GET /state`.

Alle fejlsvar er JSON på formen `{"fejl": "<dansk besked>", "kode": "<maskinlæsbar_kode>"}`.
Alle tidsangivelser er ISO 8601 / timestamptz. Dage (`day`, `dag`) er
`YYYY-MM-DD` i **Europe/Copenhagen** (siden denne opfølgningsrunde — se
afsnittet "Dage og tidszoner" nedenfor).

Mounting: alle ruter i dette dokument er relative til Express-appens rod
(`app.use(...)` uden præfiks). Fase 2's nginx forventes at proxye
`/api/spil/*` → dette API'ets rod (dvs. nginx strippe `/api/spil`-præfikset
før videresendelse). Det er en pragmatisk beslutning: serveren selv kender
ikke til noget præfiks, så den kan testes og køres identisk lokalt og i
produktion — kun nginx's `proxy_pass`-regel adskiller dem.

---

## Autentifikation

- **Spillere:** `Authorization: Bearer <token>` — 64 tegn hex, udstedt af
  `POST /players` (BÅDE ved oprettelse OG login). Serveren gemmer kun
  `sha256(token)`, i tabellen `spiller_token` (siden "Anden opfølgende
  ændringsrunde", opgave C) — IKKE længere et enkelt felt på `spiller`. En
  spiller kan være logget ind på FLERE enheder samtidig: hvert
  `POST /players`-kald (login eller ny registrering) OPRETTER en ny
  token-række og rører ALDRIG spillerens øvrige, evt. stadig gyldige tokens
  (`tilbagekaldt IS NULL`). Se "Flere samtidige tokens pr. spiller" nedenfor.
  **Siden "Fjerde opfølgende ændringsrunde" (N9) udløber et token nu OGSÅ**
  hvis det ikke har været BRUGT i `PLAYER_TOKEN_TTL_MS` (default 30 dage,
  tjekket mod `sidst_brugt`, ikke kun `oprettet`) — se
  `src/spillerToken.js#loadPlayerByToken` og `POST /me/logout` nedenfor.
- **Admin:** HttpOnly+Secure+SameSite=Strict cookie `spil_admin_session`,
  sat af `POST /admin/login`. Session-tokens gemmes hashet i `admin_session`.

## Klient-IP

Serveren læser **udelukkende** `X-Client-IP` (sat af host-nginx i fase 2 ud
fra Cloudflares `CF-Connecting-IP`). Den stoler ALDRIG på klientens egen
`X-Forwarded-For`, og `app.set('trust proxy', ...)` bruges ikke. Mangler
`X-Client-IP` (fx lokale tests), falder den tilbage til
`req.socket.remoteAddress`. Se `src/middleware/clientIp.js`.

## Dage og tidszoner

Alle "dags"-begreber (liv-reset, dagens flueben, dagens rangliste, dagens
rekord, beaten-notifikationer) bruger **Europe/Copenhagen**-dato, IKKE UTC.
Messen er dansk, og deltagere forventer at "i dag" skifter ved midnat dansk
tid — ikke kl. 01/02 dansk tid (UTC-midnat, afhængig af sommer-/vintertid).

Dette er konsolideret ét sted: `src/rules/tzDate.js`.

**Et aktivt forsøg (`status='aktiv'`) kan finish'es resten af den
(københavnske) dag det blev startet på** (siden "Anden opfølgende
ændringsrunde", opgave A) — ikke kun inden for et kort tidsvindue som
tidligere (den gamle `AKTIV_UDLOEB_MS`, 15 min.). Ved dagsskifte (dansk tid)
behandles et stadig-aktivt forsøg fra en TIDLIGERE dag som udløbet
(`status='udloebet'`) næste gang det stødes på — enten ved et nyt
`POST /runs`-kald (se dér) eller ved et `finish`-forsøg mod det (`409
forsoeg_udloebet`, se `POST /runs/:runde_id/finish`).

- **JS-siden** (`todayStr(d)`): bruger `Intl.DateTimeFormat` med en
  EKSPLICIT `timeZone: 'Europe/Copenhagen'` — uafhængig af processens egen
  `TZ`-miljøvariabel/lokale indstilling, så resultatet er identisk på
  serveren, en udviklers lokale maskine og i CI. `src/rules/life.js#todayStr`
  og `src/gameQueries.js#todayStr` re-eksporterer begge denne samme funktion.
- **DB-siden** (`cphDateExpr(col)`): et rå SQL-cast af en `timestamptz`-
  kolonne til `date` (`kolonne::date`) er IMPLICIT afhængigt af
  forbindelsens session-tidszone, som vi ikke stoler på er sat konsistent.
  `cphDateExpr('kolonne')` bygger i stedet et selvstændigt SQL-fragment
  (`(kolonne AT TIME ZONE 'Europe/Copenhagen')::date`) uden den afhængighed.
  Bruges af `src/gameQueries.js` (dagens rangliste/rekord, dage spillet) og
  `src/lifeBag.js` (dagens forsøgstæller ved dags-skift).
- **`liv_dag`/`tick_dag`** (Postgres `date`-kolonner) undgår helt JS Date-
  objekt-parsing på vej ud af databasen — `src/db.js` afregistrerer node-pg's
  standard-typeparser for `date` (OID 1082), så disse felter altid er rå
  `'YYYY-MM-DD'`-tekststrenge. Det undgår en anden, beslægtet tidszone-
  faldgrube (node-pg's standardparser konstruerer ellers et Date-objekt i
  PROCESSENS lokale tidszone).

**Timens boss** (`hourWinners()`/`hourBoard()`) er, som nævnt under
"Afvigelser" nedenfor, IKKE porteret server-side endnu — der er derfor ingen
server-side "time"-beregning at rette i denne omgang. Når/hvis den
implementeres, bør den bruge samme `Europe/Copenhagen`-tidszone, evt. med en
tilsvarende `cphHourExpr()`-udvidelse af `src/rules/tzDate.js`.

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
Registrering ELLER login, afgjort af om emailen findes. Login sker med
`email` + `pin` (4 cifre, se "Pinkode i stedet for telefon" nedenfor);
`telefon` spiller INGEN rolle ved login for spillere oprettet EFTER
010_pinkode.sql (kun legacy-spillere uden `pin_hash` kan logge ind med
`telefon`, se dér).

**Request:**
```json
{
  "navn": "Anna Andersen",
  "email": "anna@firma.dk",
  "pin": "4217",
  "telefon": "20304050",
  "firma": "Smartpack ApS",
  "vennekode": "AB3D",
  "udfordringskode": "",
  "tilmeldinger": ["sp", "m:Sprii", "sms"],
  "accepterer_betingelser": true
}
```
- `navn`: 1–22 tegn. `firma`: 0–40 tegn (**valgfrit** — se `PATCH /me` for at
  sætte/rette det bagefter, og "Packrush-ændringer" for hvorfor en spiller
  uden firma ikke tæller med i firmakampen).
- `pin`: 4 cifre, PÅKRÆVET ved ny registrering (spilleren vælger den selv).
- `telefon` (telefon-opfølgning, 2. okt. 2026): **igen VALGFRIT** —
  tomt/udeladt er OK. Når det ER angivet, normaliseres det til kun cifre og
  skal have mindst 8 cifre, ellers `400 ugyldigt_telefon`. Unikt PÅ TVÆRS AF
  SPILLERE når det er sat (`spiller_telefon_unik`, se 001_init.sql — en
  almindelig UNIQUE INDEX, hvor Postgres allerede behandler hvert NULL som
  forskelligt fra alle andre, så flere spillere uden telefon er altid OK);
  kolliderer det med en ANDEN spillers sat nummer: `400 telefon_i_brug`.
  Kan sættes/rettes bagefter med `PATCH /me { "telefon": "..." }`.
- `vennekode`/`udfordringskode`: maks 5 tegn, case-insensitive.
- `tilmeldinger`: liste af nøgler fra `subOptions()` (`sp`, `m:<partner>`,
  `sms`). **`sms` kræver et telefonnummer** (enten i DENNE request, eller
  allerede sat tidligere) — er `telefon` tomt/udeladt OG `tilmeldinger`
  indeholder `sms`: `400 telefon_kraeves`, intet oprettes. Samme regel
  gælder `PUT /me/subs` og `PUT /me/ticks` (se dér) — kravet kan ikke omgås
  ved at sætte sms-fluebenet et andet sted.

**201 (ny spiller):**
```json
{ "token": "64-tegns-hex-bearer-token", "type": "ny",
  "spiller": { "pid": "AbCdEfGhI2", "navn": "Anna Andersen", "firma": "Smartpack ApS", "vennekode": "K7M2" } }
```
**200 (login — email fandtes, pinkoden matchede):**
```json
{ "token": "nyt-64-tegns-hex-bearer-token", "type": "login",
  "spiller": { "pid": "...", "navn": "...", "firma": "...", "vennekode": "..." } }
```
Bemærk (ÆNDRET siden "Anden opfølgende ændringsrunde", opgave C): et login
OPRETTER et NYT token UDEN at rotere/tilbagekalde spillerens øvrige, evt.
allerede udstedte tokens — en spiller kan altså være logget ind på FLERE
enheder samtidig (fx sin telefon og en standtablet). Se "Flere samtidige
tokens pr. spiller" nedenfor.

**Fejl:**
| Status | kode | Betydning |
|---|---|---|
| 400 | `ugyldig_email` | Emailformat er ugyldigt |
| 400 | `ugyldig_pin` | Pinkoden er ikke 4 cifre (ny spiller) |
| 400 | `pin_matcher_ikke` | Login: pinkoden passer ikke til denne e-mail |
| 400 | `mangler_pin` | Login: spilleren er oprettet før pinkoden og har intet `pin_hash` — skal forbi standen |
| 400 | `ugyldigt_telefon` | `telefon` er angivet, men normaliserer til under 8 cifre |
| 400 | `telefon_i_brug` | `telefon` er allerede knyttet til en ANDEN spiller |
| 400 | `telefon_kraeves` | `tilmeldinger` indeholder `sms`, men intet telefonnummer er angivet/gemt |
| 400 | `ugyldigt_navn` / `ugyldigt_firma` | Længde uden for 1–22 / 1–40 tegn |
| 400 | `mangler_accept` | `accepterer_betingelser` ikke `true` ved ny spiller |
| 429 | `pin_spaerret` | DENNE spiller er spærret 15 min. efter 5 forkerte pinkoder i træk — se nedenfor. **Delt tæller** med `DELETE /me`s pinkode-bekræftelse (samme `pin_fejl`/`pin_spaerret_til`-kolonner, se dér) |
| 429 | `ip_login_spaerret` | M3/S1 (sikkerhedsgennemgang): denne klient-IP har ramt ét af de to IP-lag beskrevet nedenfor. **Delt tæller** med `DELETE /me` (samme `ipLoginLimiter`-instans, se `src/app.js`) |

**M3 (sikkerhedsgennemgang): IP-bred rate-limit på login-/pin-forsøg.** Den
pr.-spiller-spærring ovenfor (`pin_spaerret`) beskytter ikke mod (a) at en
angriber bevidst låser EN navngiven kollegas konto ude ved at afprøve
forkerte koder for netop DEN email, eller (b) at en angriber afprøver mange
KENDTE emails × 5 koder/kvarter og statistisk rammer nogle (4-cifret pin).
Derfor tæller serveren nu OGSÅ mislykkede login-/pin-forsøg PR. KLIENT-IP
(`X-Client-IP`, se "Klient-IP" — ALDRIG klientens egen IP-header). Dette er
i TILLÆG til, ikke i stedet for, den pr.-spiller-spærring. Tæller KUN
mislykkede forsøg (hverken en ny registrering eller et vellykket login
forbruger et slot).

**S1 (opfølgende sikkerhedsgennemgang, merge-review, 2. okt. 2026):** da
`X-Client-IP` i praksis er Cloudflares `CF-Connecting-IP`, deler HELE en
messestands Wi-Fi/NAT typisk ÉN IP. Den oprindelige M3-grænse var et ÉT,
fælles loft PÅ TVÆRS AF ALLE SPILLERES emails — det betød reelt at 10
forkerte forsøg FRA HVEM SOM HELST på standen, MOD HVILKEN SOM HELST konto,
blokerede login for HELE standen i op til 10 minutter. Grænsen er derfor nu
TO LAG, begge nøglet på `X-Client-IP`:
1. **Pr. (IP, email):** samme loft som hidtil (10 forkerte/10 min.), men nu
   kun på tværs af forsøg mod SAMME konto fra samme sted — to kolleger der
   deler standens wifi rammer derfor hverken hinandens forsøg på at logge
   ind RIGTIGT, eller låser hinanden ude af HVER SIN konto.
2. **Pr. IP ALENE, på tværs af ALLE emails:** et markant højere loft (300
   forkerte/10 min.) — fanger stadig storskala-udtømningsforsøg (mange
   forskellige emails afprøvet fra samme sted), uden at ramme almindelig
   messetrafik.

`check`/`consume` forbruger/tjekker BEGGE lag for hvert forsøg — rammes
ENTEN af det snævre pr.-konto-loft eller det høje IP-alene-loft, svares der
`429 ip_login_spaerret` (samme fejlkode som før, uændret for klienten). Se
`src/routes/players.js#createIpLoginLimiter`.

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

**`notifikationer[].data`s navnefelter (`by`/`fra`) er MASKEREDE (siden
"Tredje opfølgende ændringsrunde", se nedenfor)** — samme regel som
`GET /state`: fuldt navn kun hvis DENNE forbindelse har en gyldig
admin/stand-sessionscookie (uafhængigt af hvem spilleren selv er), ellers
`"Fornavn E."`. Peger notifikationen på en siden slettet spiller, vises
`"Slettet spiller"` uændret i begge tilfælde. De interne
`by_spiller_id`/`fra_spiller_id`-felter (kun til brug ved GDPR-
anonymisering, se `src/playerDeletion.js`) eksponeres ALDRIG her — samme
princip som `forsoeg.duel.vs_spiller_id`.

### `PATCH /me` (bearer) — sæt/ret firma og/eller telefon
Body kan indeholde ÉT eller BEGGE felter — hvert felt opdateres KUN hvis det
rent faktisk er med i requesten (ikke bare udeladt/falsy), så et kald der
kun sætter det ene ALDRIG nulstiller det andet:
```json
{ "firma": "Smartpack ApS", "telefon": "20304050" }
```
- `firma`: 0–40 tegn (tomt = ryd firmaet). Genberegner `firma_noegle` (samme
  algoritme som ved registrering). `400 ugyldigt_firma` hvis over 40 tegn.
- `telefon` (telefon-opfølgning, 2. okt. 2026): sætter ELLER retter
  telefonnummeret bagefter — samme normalisering/validering som `POST
  /players` (mindst 8 cifre når angivet, tomt = ryd nummeret igen). Unikt på
  tværs af spillere når det er sat: `400 telefon_i_brug` hvis et ANDET
  spiller allerede har nummeret, `400 ugyldigt_telefon` hvis under 8 cifre.

`200 { "ok": true, "firma": "...", "telefon": "..." }` — kun de(t) felt(er),
der rent faktisk blev opdateret, er med i svaret. `400 { "kode":
"intet_at_opdatere" }` hvis hverken `firma` eller `telefon` er med i
requesten.

En spiller UDEN firma (tomt `firma`/`firma_noegle`) tæller IKKE med i
firmakampen: `GET /state`'s `companyKey` er tom/falsy for dem, og klientens
`firms()`-gruppering springer allerede en falsy `companyKey` over
(`spil/index.html#firms`) — ingen særskilt server-side filtrering er
nødvendig ud over at lade `firma_noegle` forblive tom.

### `POST /me/logout` (bearer) — NY (Fjerde opfølgende ændringsrunde, N9)
Tilbagekalder KUN det ENE bearer-token der blev brugt til at kalde dette
endpoint (`tilbagekaldt = now()`) — spillerens ØVRIGE tokens (andre
enheder, se "Flere samtidige tokens pr. spiller") rører den ALDRIG. `200
{ "ok": true }`. Kald igen med samme (nu tilbagekaldte) token giver `401
{ "kode": "ugyldigt_token" }`, som al anden brug af et ugyldigt token.

### `POST /me/seen` (bearer)
Body `{ "ids": [12, 13] }` (valgfri — udelades for at markere ALT som set).
`200 { "ok": true }`.

### `POST /me/challenge` (bearer)
Body `{ "code": "K7M2" }`. Sætter `p.chFrom` server-side (bruges af
`finish()`-flowet til at give udfordreren +1 liv, når DENNE spiller
gennemfører et forsøg i dag).
`200 { "ok": true, "udfordrer": "Bo Hansen" }` eller
`400 { "fejl": "Ukendt udfordringskode.", "kode": "ukendt_kode" }`.

**`udfordrer` er MASKERET (siden "Tredje opfølgende ændringsrunde")** —
samme regel som `GET /me`s notifikationer og `GET /state`: fuldt navn kun
med en gyldig admin/stand-session for DENNE forbindelse, ellers
`"Fornavn E."` (`"Bo H."` i eksemplet ovenfor er den faktiske, ikke-
privilegerede værdi — dokumentationseksemplet ovenfor viser den
PRIVILEGEREDE variant for læsbarhedens skyld).

### `PUT /me/subs` (bearer) — VARIG af-/tilmelding
Body `{ "keys": ["sp", "sms"] }` — det ØNSKEDE fulde, VARIGE sæt.
`200 { "ok": true, "liv": {...}, "mine_noegler": [...] }`.

**Telefon-opfølgning:** indeholder `keys` `sms`, og spilleren har INTET
telefonnummer registreret (hverken fra før eller i dette kald — `PUT
/me/subs` sætter ikke selv telefon, se `PATCH /me`): `400 telefon_kraeves`,
intet ændres. Gælder KUN at (for)blive tilmeldt — at AFMELDE `sms` er altid
tilladt uden telefon.

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

**Telefon-opfølgning:** samme `telefon_kraeves`-regel og -begrundelse som
`PUT /me/subs` ovenfor, for DAGENS `sms`-flueben.

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

### `DELETE /me` (bearer) — M4: selvbetjent sletning
Vilkårene lover selvbetjent sletning ("Sletter du din profil, sletter vi
dine oplysninger"). Kræver, UD OVER et gyldigt bearer-token, en EKSTRA
bekræftelse i selve requesten — ellers kunne et alene stjålet/lækket token
slette kontoen.

**Request:**
```json
{ "pinkode": "1234" }
```
**ÆNDRET (telefon-opfølgning, 2. okt. 2026):** bekræftelsen er nu KUN
spillerens egen pinkode (4 cifre, SAMME hash som login, se `POST /players`)
— IKKE længere telefonnummeret. Telefon er blevet valgfrit igen og er derfor
ikke længere en pålidelig bekræftelsesfaktor for alle spillere. En spiller
UDEN pinkode (oprettet før 010_pinkode.sql, intet `pin_hash`) kan IKKE
længere slette sig selv via dette endpoint — kom forbi standen (samme
begrænsning som `mangler_pin` ved login).

**Delt rate-limit med login (BEVIDST — IKKE en separat/dupliceret tæller):**
en forkert `pinkode` her registreres i PRÆCIS de samme to lag som et forkert
login-forsøg i `POST /players`:
- **Pr.-spiller:** samme `pin_fejl`/`pin_spaerret_til`-kolonner på
  `spiller`-rækken (`429 pin_spaerret` efter 5 forkerte i træk, 15 min.,
  eskalerer aldrig — se "Pinkode i stedet for telefon" nedenfor). 5 forkerte
  DELETE-forsøg låser altså OGSÅ login ude, og omvendt.
- **IP-bredt (to lag, se S1 ovenfor):** samme `ipLoginLimiter`-instans som
  login (`429 ip_login_spaerret`, se M3/S1 og `src/app.js`, som opretter ÉN
  instans og deler den mellem `playersRouter` og `meRouter`). Her bruges
  spillerens EGEN email (fra `req.player`, sat af auth-middlewaren) som
  nøgle i det snævre (IP, email)-lag — IKKE en email fra body'en (DELETE
  /me's body indeholder kun `pinkode`).

Den tidligere version af dette endpoint havde sin EGEN, parallelle
in-memory-tæller (`sletBekraeftLimiter`, nøglet pr. spiller-id) — det var en
reel sikkerhedsbrist: forkerte sletningsforsøg talte ikke med i IP-grænsen,
og accepterede desuden telefon som et selvstændigt bekræftelsesmiddel. Begge
dele er rettet i denne omgang.

**200 (slettet):** `{ "ok": true }` — spilleren er væk (samme fælles
`deletePlayerFully()` som admin-slet/admin-nulstil/retention-jobbet, se
"Sletning og anonymisering": rest-referencer i ANDRE spilleres data
anonymiseres på samme måde). Loggen i `admin_audit_log` (`handling:
"selvbetjent_sletning"`) indeholder ALDRIG email/navn/telefon — kun
spillerens `public_id` og begrundelsen `"selvbetjent sletning"`.

**Fejl:**
| Status | kode | Betydning |
|---|---|---|
| 401 | `ingen_token` / `ugyldigt_token` | Mangler/ugyldigt bearer-token — intet slettes |
| 403 | `bekraeftelse_forkert` | `pinkode` matchede ikke (eller spilleren har intet `pin_hash`) — intet slettes |
| 429 | `pin_spaerret` | DENNE spiller er spærret 15 min. efter 5 forkerte pinkoder i træk — DELT tæller med login, se ovenfor |
| 429 | `ip_login_spaerret` | Samme to-lags IP-grænse som login (se S1 ovenfor) — DELT tæller med login |

### `POST /me/boost` (bearer)
Indløser dagens sms-boostkode (svarer til klientens `useCode()`). Body
`{ "code": "K7M2" }`. Kræver aktiv sms-tilmelding (`notify=true`), at koden
matcher `boostCode(idag, cfg.hemmelig.pin)`, og at spilleren ikke allerede
har brugt dagens boost. Giver `cfg.boostLives` (default 2) ekstra liv.

**Rækkefølge (ÆNDRET siden "Anden opfølgende ændringsrunde", opgave F):**
koden sammenlignes FØRST mod dagens facit (`boostCode(idag, pin)`), FØR
noget som helst tilmeldings-/brugstjek. Matcher koden IKKE, svares der ALTID
`400 { "fejl": "Ukendt kode.", "kode": "ukendt_kode" }` — uanset spillerens
tilmeldingsstatus — samme kode som `POST /me/challenge` bruger, for at
signalere til klienten at den i stedet bør prøve koden som en
udfordrings-/vennekode. Matcher koden, fortsættes med de eksisterende tjek i
uændret rækkefølge (er sms-boost aktiveret? er spilleren tilmeldt sms? har
den allerede brugt dagens boost?).

`200 { "ok": true, "liv": { "n": 6, "next_regen_ms": null } }`.

Fejl: `mangler_kode`, `ukendt_kode` (koden matcher ikke dagens facit — se
ovenfor; **erstatter** den tidligere `forkert_kode`), `boost_ikke_aktiv`
(`cfg.smsBoost===false`), `ikke_tilmeldt_sms`, `allerede_brugt`. PIN'en koden
er udledt af forlader ALDRIG serveren her — kun spillerens gæt sammenlignes
mod et server-udregnet facit (`src/rules/boostCode.js`).

### `POST /runs` (bearer)
Starter et forsøg. Bruger ét liv. Rate-limit: 1 kald / 20 sek. / spiller
(UÆNDRET — gælder for ALLE kald til dette endpoint, uanset `ny`, se nedenfor).

Body (valgfri): `{ "ny": true }` — se "Anden opfølgende ændringsrunde",
opgave B, for den fulde begrundelse.

`201`:
```json
{ "runde_id": "5b1...uuid", "start_server": "2026-09-30T10:00:00.000Z", "liv": { "n": 4, "next_regen_ms": null } }
```

**Uden `ny` (eller `ny: false`):** har spilleren allerede et aktivt forsøg
STARTET SAMME (københavnske) dag, returneres DET uden at bruge endnu et liv:
`200 { "runde_id": "...", "start_server": "...", "genoptaget": true }` — dette
er tiltænkt at lade klienten fortsætte samme forsøg efter fx en
app-genstart eller en offline-periode. Et aktivt forsøg fra en TIDLIGERE dag
behandles i stedet som udløbet (`status='udloebet'`), og et helt nyt forsøg
startes (bruger et nyt liv) — se "Dage og tidszoner".

**Med `{"ny": true}`:** et evt. eksisterende aktivt forsøg OPGIVES
(`status='opgivet'` — livet der blev brugt til det, refunderes IKKE), og der
startes et HELT NYT forsøg med normal `useLife`-logik (afvises med
`ingen_liv` hvis 0 liv).

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
`duel` (valgfrit) kan nu (siden "Anden opfølgende ændringsrunde") indeholde
et valgfrit `vsId` (modstanderens `pid`) ved siden af `vs`
(modstanderens navn) — bruges KUN server-side til at slå modstanderens
INTERNE spiller-id op og gemme det som `duel.vs_spiller_id`, til brug ved en
evt. senere GDPR-anonymisering (se "Sletning og anonymisering"). Eksponeres
ALDRIG i noget offentligt svar (`GET /state`s `sanitizeDuel` medtager kun
`vs`). Ukendt/manglende `vsId` er ikke en fejl — `duel.vs` gemmes som
hidtil, blot uden `vs_spiller_id` (anonymisering falder da tilbage til
navnematch for netop DEN forsøgs-række, samme som hidtil).

**IDEMPOTENT:** samme `runde_id` (og samme ejer) igen ⇒ samme svar,
INGEN bivirkninger køres igen (tjekket via `forsoeg.status !== 'aktiv'`,
og selve svaret er cachet i `forsoeg.resultat` — se "Afvigelser" nedenfor).

**Dagsskifte:** er forsøget stadig `status='aktiv'` men blev startet en
TIDLIGERE (københavnske) dag end i dag, markeres det `udloebet` og afvises
med `409 { "fejl": "Forsøget er udløbet (dagsskifte siden det blev startet).", "kode": "forsoeg_udloebet" }`
— se "Dage og tidszoner" og "Anden opfølgende ændringsrunde", opgave A.
**Dette gælder også et forsøg der er startet FØR midnat og først finish'es
EFTER midnat, SELVOM spilleren har været online hele tiden** (ikke kun ved
et offline-kø-scenarie) — livet der blev brugt til forsøget, refunderes
ikke. Dette er et BEVIDST designvalg (se "Anden opfølgende ændringsrunde",
opgave A), ikke en fejl.

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
autentificerede spiller. `409 { "kode": "ikke_aktivt" }` hvis forsøget er
`udloebet`/`opgivet`/allerede afsluttet uden et cachet resultat (bør reelt
aldrig ske i praksis). `409 { "kode": "forsoeg_udloebet" }` hvis forsøget
netop blev fundet at være fra en tidligere dag (se "Dagsskifte" ovenfor).

Afvisningskoder (i selve `{godkendt:false,...}`-svaret): `ugyldigt_format`,
`urealistisk_score`, `ugyldig_tid`, `for_kort_spilletid` (klientens påståede
aktive spilletid er under `cfg.minAktivSpilletidMs`), `for_lang_spilletid`
(over `cfg.maxAktivSpilletidMs` — IKKE længere om servertiden, se
"Snydegrænser"), `tid_mismatch` (klienten påstår MERE aktiv tid end der er
gået siden start), `ustats_konsistens` — se "Snydegrænser" nedenfor.

---

## WebSocket `/ws`

Simpelt JSON-besked-protokol, rum-baseret (svarer til klientens tidligere
`claude.use('room')`). Maks. 4 KB pr. besked, maks. 10 beskeder/sek. pr.
forbindelse.

| Besked (klient → server) | Krav | Effekt |
|---|---|---|
| `{"type":"hello","token":"..."}` | — | Autentificerer forbindelsen (valgfrit — uden token forbliver den anonym/lytte-kun). Svar: `{"type":"hello.ok","authenticated":true\|false}`. **Uden et gyldigt token nulstilles forbindelsens spiller/presence EKSPLICIT** (siden "Fjerde opfølgende ændringsrunde", N5 — fx "Næste spiller"/logout på en standtablet), og en opdateret presence-liste broadcastes med det samme, se nedenfor |
| `{"type":"join","room":"..."}` | — | Lyt-adgang til et rum (fx standvæggen). Svar: `{"type":"joined","room":"...","users":[...]}` |
| `{"type":"presence","room":"..."}` | spiller-token | Gør forbindelsen synlig i rummets presence-liste. Broadcaster `{"type":"presence","room":"...","users":[{"id":.., "name":".."}]}` til alle i rummet. Et evt. `name`-felt i selve beskeden IGNORERES HELT (siden "Fjerde opfølgende ændringsrunde", N6) — navnet er altid `spiller.navn` |
| `{"type":"emit","room":"...","event":"duel.go"\|"duel.s"\|"duel.waiting"\|"duel.idle","data":{...}}` | spiller-token | Relayer `{"type":"event","room":"...","event":"...","data":{...},"from":{...}}` til alle ANDRE i rummet |

`duel.waiting`/`duel.idle` (**NYE**, siden "Anden opfølgende
ændringsrunde") er tilføjet til den tilladte liste af duel-events — bruges
til ventelisten (hvem venter på en duel).

**Navne i `data` overskrives ALTID af serveren** (siden samme runde): et
afsendt duel-events `data.name`/`data.an` (kendte fritekstfelter i klientens
duel-protokol der bærer AFSENDERENS eget navn, se `src/ws.js`) overskrives
ALTID med serverens egen, korrekt maskerede visning af afsenderens navn —
nøjagtig samme regel og personalisering som `from.name` (fuldt navn kun til
en modtager med gyldig admin/stand-session). Klienten kan ALDRIG sætte
vilkårlig tekst som sit eget navn i et duel-event der relayes videre til
andre (fx standvæggen) — håndhæves for HVER besked, ikke kun ved selve
forbindelsen.

**Presence-teksten er IKKE længere en kilde til noget navn** (siden "Fjerde
opfølgende ændringsrunde", N6): `presence`-beskedens `name`-felt (op til 22
tegn klient-fritekst) blev hidtil gemt og siden relayet — kun maskeret, ALDRIG
erstattet — som både presence-listens `users[].name` OG som duel-events
afsendernavn. En spiller kunne dermed sætte en vilkårlig tekst som sin
presence og lade den vises priviligeret på standvæggen. Navnet slås nu
UDELUKKENDE op via den autentificerede forbindelses `spiller.navn` — `name`/
`presenceName` bruges ALDRIG til navnevisning noget sted, hverken i presence-
broadcastet eller i et duel-event.

**Selv-reference-feltet for `bn`-opslaget accepterer nu OGSÅ `data.tab`**
(siden samme runde, N4-bonus, se nedenfor) — ved siden af `data.a`, ikke i
stedet for.

**`duel.go`s `bn` (modstanderens navn) overskrives NU OGSÅ** (siden
"Tredje opfølgende ændringsrunde") — `bn` sættes af AFSENDEREN SELV når de
vælger hvem de vil duellere mod fra ventelisten og var derfor lige så
forfalskeligt som `an`/`name` var før forrige runde. Valgt løsning: (a)
overskriv `bn` server-side ud fra serverens egen viden om hvem der reelt
har den angivne modstander-reference (`data.b`) — IKKE (b) at fjerne
feltet, for ikke at ændre feltnavne/responsstruktur. Vi understøtter to
sandsynlige konventioner for `data.b` (se `src/ws.js`s toptekst for
detaljen): et forbindelses-id fra presence-listen (`users[].id`), eller et
selv-erklæret, tab-lignende strengfelt (`data.a` **eller `data.tab`**, siden
"Fjerde opfølgende ændringsrunde", N4-bonus — den FAKTISKE klient viste sig
kun at sende `tab`, ikke `a`, i `duel.waiting`/`duel.s`, se
`spil/index.html`; begge felter registreres og virker nu SAMTIDIG) fra en
tidligere besked fra samme afsender. Matcher ingen af delene en kendt
forbindelse i samme rum, ryddes `bn` til en tom streng — klientens indsendte
værdi bruges ALDRIG direkte.

Server → alle forbindelser: `{"type":"state.changed"}` når spillerdata/
config ændres. Siden "Anden opfølgende ændringsrunde" broadcastes dette ikke
kun efter et godkendt `POST /runs/:id/finish`, men også ved: ny registrering
(`POST /players` for en NY spiller — login broadcaster ikke, det ændrer intet
i state), firma-ændring (`PATCH /me`), admin-config-ændring
(`PUT /admin/config`), sletning af én spiller (`DELETE /admin/spillere/:pid`),
og `POST /admin/nulstil`.

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
| `GET /admin/spillere` | Fuld, KOMPLET organisatordata pr. spiller (PII, tickets, tilmeldinger, forsøg, liv, dagens beaten-notifikationer — se nedenfor) til adminpanelet. |
| `GET /admin/eksport/spillere.csv` | Alle spillere (navn, email, telefon, firma, vennekode, oprettet, skjult). |
| `GET /admin/eksport/samtykke/:liste.csv` | Samtykke-hændelseslog for én liste, opsummeret pr. spiller: FØRSTE + SENESTE bekræftelse + `aktiv`-status (`:liste` valideres mod `^[a-z0-9:_.-]+$`). |
| `GET /admin/eksport/sms.csv` | Spillere med aktiv (`bekraeftet`) sms-status lige nu OG et registreret telefonnummer (telefon-opfølgning: springer spillere uden telefon over — de kan jo ikke modtage en sms). |
| `GET /admin/eksport/revanche.csv` | Sms-tilmeldte (aktiv status, MED telefon, samme filtrering som sms.csv) der er blevet overhalet i dag, inkl. sms-tekst-skabelon (se "Afvigelser"). |
| `POST /admin/lodtraekning` `{kort_navn}` | Vægtet tilfældig lodtrækning ud fra `tickets()`, logger i `raffle_draws`. Svar, se nedenfor. |
| `GET /admin/config` / `PUT /admin/config` | Hent/gem hele config (inkl. `hemmelig.pin`). |
| `GET /admin/boostkode` | Dagens sms-boostkode (KUN her — aldrig i noget offentligt svar). |
| `POST /admin/spillere/:pid/skjul` `{skjult}` | Skjul/vis en spiller i `GET /state`. |
| `DELETE /admin/spillere/:pid` | RIGTIG GDPR-sletning (spiller + alle forsøg/samtykker/notifikationer + anonymisering af rest-referencer i andre spilleres data, se "Sletning og anonymisering"). |
| `POST /admin/afmeld` `{liste, emails}` | Bulk-afmelding, se nedenfor. |
| `POST /admin/nulstil` `{bekraeft}` | Fuld nulstilling af al spillerdata, se nedenfor. |
| `POST /admin/stand-login-kode` | **Kræver `rolle='admin'`** (ikke `stand`). Udsteder en ét-gangs-kode til standtablet-login, se "Stand-login-flow". |

Alle ovenstående (undtagen `/admin/login`) kræver `rolle='admin'` —
en `stand`-session giver **403 `{"kode":"kraever_admin"}`** på ethvert af
dem. Se "Stand-login-flow" for hvad en `stand`-session KAN.

### `GET /admin/spillere` — komplet organisatordata (opgave G)
`200 { "spillere": [...] }`. Hver spiller har mindst:

```json
{
  "pid": "AbCdEfGhI2",
  "navn": "Anna Andersen",
  "email": "anna@firma.dk",
  "telefon": "20304050",
  "firma": "Smartpack ApS",
  "firmaNoegle": "smartpack",
  "vennekode": "K7M2",
  "oprettet": "2026-09-28T08:00:00.000Z",
  "skjult": false,
  "badges": ["fejlfri"],
  "tickets": 3,
  "tilmeldinger": [
    {
      "liste": "sms",
      "aktiv": true,
      "foerste_bekraeftelse": "2026-09-28T08:00:00.000Z",
      "seneste_haendelse": { "type": "bekraeftet", "tidspunkt": "2026-09-29T09:00:00.000Z" },
      "tekst_version": 1
    }
  ],
  "beaten_i_dag": [
    { "by": "Bo Hansen", "by_spiller_id": 7, "firm": "Bo Byg ApS", "score": 620, "mine": 410, "at": "2026-09-30T10:15:00.000Z", "day": "2026-09-30", "lead": true, "colleague": false, "oprettet": "2026-09-30T10:15:00.000Z" }
  ],
  "forsoeg": [
    { "score": 410, "dag": "2026-09-30", "slut_server": "2026-09-30T10:01:35.000Z" }
  ],
  "liv": { "n": 4, "next_regen_ms": null }
}
```
- `navn`/`email`/`telefon`/`firma` er FULDE, UMASKEREDE (dette ER et
  admin-endpoint — ingen navnemaskering som i `GET /state`).
- `tilmeldinger`: samme form som `GET /me`s `samtykker` (varige, afledte
  samtykke-status pr. liste — `aktiv: true` for `liste:"sms"` betyder
  spilleren er varigt tilmeldt/notify, se `src/routes/me.js#samtykkerFor`).
- `beaten_i_dag`: rå `notifikation.data` for dagens `type='beaten'`-rækker
  (samme feltnavne som "Svareksempler: lodtrækning og notifikationstyper"
  nedenfor), plus `oprettet`.
- `forsoeg`: ét element pr. GODKENDT forsøg (`score`=`samlet`,
  `dag`=Europe/Copenhagen-dato forsøget blev spillet, `slut_server`=ISO
  8601-tidspunkt forsøget blev afsluttet, `null` hvis intet
  `slut_server` er sat).
- `liv`: samme form som `GET /me`s `liv`-felt (`n`, `next_regen_ms`).

Ingen paginering (se "Afvigelser fra briefen").

### `POST /stand-login` (offentligt — intet admin-krav)
Body `{ "kode": "AB12CD" }`. Se "Stand-login-flow" nedenfor.
`200 { "ok": true }` (sætter en langtlevende `rolle='stand'`-sessionscookie)
eller `400 { "fejl": "Ugyldig eller udløbet kode.", "kode": "ugyldig_kode" }`.

### `POST /admin/afmeld` — bulk-afmelding af en tilmeldings-liste
Body:
```json
{ "liste": "sms", "emails": ["anna@firma.dk", "20304050", "ukendt@firma.dk"] }
```
`liste` er en tilmeldings-**NØGLE** — samme format som `PUT /me/subs`'s
`keys` / `DELETE /me/subs/:liste` (`sp`, `m:<partner>`, `sms`), IKKE
samtykke-tabellens listenavn — **ELLER** (siden "Anden opfølgende
ændringsrunde", opgave H) den specielle værdi **`"alle"`**, som afmelder
spilleren fra ALLE lister vedkommende er varigt tilmeldt: der logges én
`trukket_tilbage`-hændelse PR. LISTE spilleren rent faktisk var aktivt
tilmeldt (ikke ubetinget for enhver mulig liste, i modsætning til en enkelt
navngiven liste, se nedenfor).

`emails`-arrayet (**ÆNDRET** samme runde) kan indeholde BÅDE emails OG
telefonnumre — matchet på henholdsvis eksakt email og de sidste 8 cifre
(samme matchning som login bruger, se `POST /players`). Et element afgøres
som email hvis det indeholder `@`, ellers behandles det som et
telefonnummer.

For hver modtager der FINDES: sætter varig status til `trukket_tilbage`
(samme effekt som `DELETE /me/subs/:liste`, inkl. opdatering af
`marketing`/`mail_to`/`notify` og fjernelse fra dagens flueben) for enten
DEN navngivne liste, eller (ved `"alle"`) samtlige lister spilleren var
aktivt tilmeldt. For en ENKELT navngiven liste logges
`trukket_tilbage`-hændelsen UBETINGET (også hvis spilleren allerede var
afmeldt — admin/afmeld er en audit-handling); ved `"alle"` logges den KUN
for de lister der rent faktisk var aktive.

`200`:
```json
{ "fundet": 1, "ikke_fundet": ["ukendt@firma.dk"] }
```
`400 { "kode": "mangler_liste" }` / `{ "kode": "mangler_emails" }` /
`{ "kode": "ukendt_liste" }` (ukendt tilmeldings-nøgle for den aktuelle
config — `"alle"` er altid gyldig).

### `POST /admin/nulstil` — fuld nulstilling (RYDDER AL SPILLERDATA)
Body: `{ "bekraeft": "NULSTIL" }` — kræver PRÆCIS denne streng, case-
sensitivt, ellers `400 { "kode": "mangler_bekraeftelse" }` (INGEN sletning
sker). Tiltænkt at rydde testdata efter en generalprøve.

Ved korrekt bekræftelse: tager FØRST en `pg_dump` (samme mekanisme som det
natlige backup-script, men in-process — se README.md, "Drift", og
`src/backup.js`) som sikkerhedsnet. **Fejler backuppen, afbrydes
nulstillingen HELT** (ingen spillere slettes). Lykkes den, slettes DEREFTER
ALLE spillere (+ deres forsøg/notifikationer/samtykker, via samme fælles
sletnings-/anonymiseringsfunktion som `DELETE /admin/spillere/:pid` og det
natlige GDPR-oprydningsjob — se "Sletning og anonymisering"). Uigenkaldeligt
efter bekræftelsen.

Logger en varig audit-række i `admin_audit_log` (tidspunkt, antal slettede,
og HVILKEN admin-session der udførte det — session-id, ALDRIG
adgangskoden), samt én linje på stdout (samme "ALDRIG navne/emails, kun
antal"-princip som retention-jobbet).

`200`:
```json
{ "ok": true, "antal_slettet": 3, "backup": "/var/backups/spil-api/nulstil-2026-09-30T12-00-00-000Z.sql" }
```
`400 { "kode": "mangler_bekraeftelse" }`. `500` hvis backuppen fejlede (fx
`pg_dump` ikke installeret/utilgængelig) — se README.md, "Drift", for
forudsætningerne.

---

## Sletning og anonymisering

Enhver RIGTIG sletning af en spiller (`DELETE /admin/spillere/:pid`, det
natlige GDPR-oprydningsjob, `POST /admin/nulstil`, og — siden M4,
sikkerhedsgennemgang — spillerens EGEN `DELETE /me`) går gennem samme
fælles funktion (`src/playerDeletion.js#deletePlayerFully`), som ud over
selve cascade-sletningen (forsøg/notifikationer/samtykker) også
**anonymiserer rest-referencer** til den slettede spiller i ANDRE spilleres
data (disse er friteksts-KOPIER taget på skrivetidspunktet, ikke
fremmednøgler, og overlever derfor ikke automatisk en cascade-DELETE):

- `raffle_draws.spiller_navn_snapshot` → `"Slettet spiller"`,
  `email_snapshot` → `NULL` (spillerens EGNE lodtræknings-rækker) —
  matchet på `raffle_draws.spiller_id` (en RIGTIG kolonne, ikke navnematch).
- Andre spilleres `notifikation.data.by` (beaten-notifikation) og
  `.data.fra` (gift-notifikation) → `"Slettet spiller"` (id-felterne
  `by_spiller_id`/`fra_spiller_id` sættes samtidig til `null`).
- Andre spilleres `forsoeg.duel.vs` → `"Slettet spiller"` (`vs_spiller_id`
  sættes samtidig til `null`).

**Matchning (opdateret i "Anden opfølgende ændringsrunde", anonymiserings-
id-fixet):** de tre punkter ovenfor matcher nu FØRST på et id-felt sat ved
siden af navnefeltet ved SKRIVETIDSPUNKTET (`by_spiller_id`/
`fra_spiller_id`/`vs_spiller_id` — se `src/routes/runs.js`s finish-flow, og
`duel.vsId` under `POST /runs/:runde_id/finish` for hvordan
`vs_spiller_id` sættes). Navnematch er kun et FALDBACK for rækker skrevet
FØR denne ændring (kendt, accepteret begrænsning for netop DEM: to spillere
med samme navn kunne i teorien krydse hinanden — ikke fikset for historiske
rækker, se README.md). Nye rækker er dermed IKKE længere sårbare over for
navnesammenfald mellem spillere.

Det natlige GDPR-oprydningsjob (`src/retention.js`) LÅSER desuden hver
kandidat (`SELECT ... FOR UPDATE`) og GENKONTROLLERER begge betingelser
(intet aktivt samtykke OG stadig ≥12 mdr. inaktiv) lige før selve
sletningen — en kandidat der siden en tidligere, ulåst udvælgelse har fået
et nyt aktivt samtykke eller spillet et nyt forsøg, sletes IKKE.

---

## Svareksempler: lodtrækning og notifikationstyper

Fulde JSON-eksempler til den agent der bygger spillets nye frontend (branch
`spil-api-klient`) — se `src/routes/admin.js#drawWinner` og
`src/routes/runs.js` (afsnittet "GODKENDT: kør hele finish()-flowet
atomisk") for kildekoden bag disse.

### `POST /admin/lodtraekning`
```json
{ "vinder": { "navn": "Anna Andersen", "email": "anna@firma.dk", "tickets": 4 } }
```
`400 { "fejl": "Ingen spillere er berettiget til lodtrækning.", "kode": "ingen_vinder" }`
hvis ingen spiller har `tickets() > 0`.

### `GET /me`'s `notifikationer[]` — alle typer

**`type: "beaten"`** — en anden spiller har overhalet dig i dag:
```json
{
  "id": 42,
  "type": "beaten",
  "data": {
    "by": "Bo Hansen",
    "firm": "Bo Byg ApS",
    "score": 620,
    "mine": 410,
    "at": "2026-09-30T10:15:00.000Z",
    "day": "2026-09-30",
    "lead": true,
    "colleague": false
  },
  "oprettet": "2026-09-30T10:15:00.000Z",
  "seen": false
}
```
- `mine`: DIN score på tidspunktet du blev overhalet.
- `lead`: `true` hvis overhaleren dermed også blev dagens nr. 1.
- `colleague`: `true` hvis I deler `firma_noegle` (samme firma) — `false`
  hvis en af jer (eller begge) ikke har et firma, se `PATCH /me`.

**`type: "gift"`, `data.type: "vennekode_refill"`** — din vennekode blev
brugt, og din ven gennemførte netop sit FØRSTE forsøg (giver dig et refill,
se `src/rules/life.js#refill`):
```json
{
  "id": 43,
  "type": "gift",
  "data": { "type": "vennekode_refill", "fra": "Ditte Dam", "at": "2026-09-30T11:00:00.000Z" },
  "oprettet": "2026-09-30T11:00:00.000Z",
  "seen": false
}
```

**`type: "gift"`, `data.type: "udfordring_liv"`** — nogen du udfordrede
(`POST /me/challenge`) gennemførte et forsøg i dag, og du får +1 liv (højst
1×/time/modstander):
```json
{
  "id": 44,
  "type": "gift",
  "data": { "type": "udfordring_liv", "fra": "Ejnar Elk", "score": 410, "at": "2026-09-30T11:30:00.000Z" },
  "oprettet": "2026-09-30T11:30:00.000Z",
  "seen": false
}
```
`data.score` (siden "Fjerde opfølgende ændringsrunde", N13) er
udfordrerens (`data.fra`s) SAMLEDE point fra netop det gennemførte
forsøg — manglede hidtil helt, hvilket fik klientens tekst til altid at
sige "fik 0 point" og aldrig vise "Slå den tilbage" (se
`spil/index.html`s giftS-visning, som sammenligner `data.score` mod
modtagerens egen dagens bedste).

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

### Spilletid (opdateret i den ANDEN opfølgende ændringsrunde, se afsnittet
### med samme navn nederst i dette dokument — offline-kø-understøttelse)

Klientens offline-kø (spiller offline, forsøget gemmes lokalt, synkes senere
samme (københavnske) dag) betyder at `server_elapsed`
(`slut_server - start_server`) kan være vilkårligt meget LÆNGERE end den tid
spilleren faktisk brugte AKTIVT på forsøget. Reglerne er derfor omlagt til
udelukkende at vurdere klientens PÅSTÅEDE AKTIVE spilletid
(`spilletid_klient_ms`) for sig selv, plus ét minimumskrav til forholdet
mellem de to:

- `cfg.minAktivSpilletidMs` (default `70000` — 3×30 sek. minus generøs margin
  til tidlig rundeafslutning, fx Send der stopper ved 3 strikes) og
  `cfg.maxAktivSpilletidMs` (default `240000`, **NYT**) er nu **config-drevne**
  felter i `config.offentlig` (ikke hemmelige, men skal kunne ændres uden
  redeploy, se `migrations/005_opfoelgning2.sql`) — IKKE længere hardkodede
  konstanter. `src/rules/scoring.js`s `MIN_SPILLETID_MS`/
  `MAX_AKTIV_SPILLETID_MS` er kun DEFAULT-værdier brugt hvis config-feltet
  mangler.
- `klientMs` (`spilletid_klient_ms`) skal ligge i intervallet
  `[minAktivSpilletidMs, maxAktivSpilletidMs]` — under giver
  `for_kort_spilletid`, over giver `for_lang_spilletid` (denne kode betyder nu
  "klientens PÅSTÅEDE aktive tid er urealistisk høj", IKKE længere "serveren
  målte forsøget som stående aktivt urealistisk længe" — det sidste er ikke
  længere en fejl i sig selv, se nedenfor).
- **Der er IKKE længere noget loft på `server_elapsed`** — et forsøg kan
  sagtens tage lang (server-)tid at blive færdigmeldt (offline-kø). Det
  eneste krav til forholdet mellem de to: `server_elapsed >= klientMs - 5000`
  (`CLOCK_SKEW_TOLERANCE_MS`, 5 sek. — klienten må ikke påstå at have spillet
  AKTIVT længere, end der reelt er gået siden forsøget blev startet).
- `tid_mismatch` bruges KUN når denne sidste betingelse fejler (klienten
  påstår MERE aktiv tid end der er gået) — IKKE længere en symmetrisk
  ±20-sekunders-tolerance (den gamle `SPILLETID_TOLERANCE_MS` er fjernet).

### Stats-konsistens (billige, løse tjek)
- `packed ≥ tower`, `perfects ≤ packed`, `streak ≤ packed`.
- `fast > 0 ⇒ orders ≥ 1`.

---

## Opfølgende ændringer (sikkerhedsgennemgang + 6 nye punkter)

En adversariel sikkerhedsgennemgang af Packrush-ændringerne (se afsnittet
nedenfor) gav tre vigtige fund, som ALLE er rettet og testdækket:

1. **TOCTOU i retention.js** — rettet med lås + genkontrol lige før
   sletning, se "Sletning og anonymisering" og `stillQualifiesForDeletion`.
2. **Rest-referencer lækkede slettede spilleres navn/email** — rettet med
   fælles anonymisering (`src/playerDeletion.js`), se "Sletning og
   anonymisering".
3. **WS genvaliderede aldrig admin/stand-rollen efter håndtrykket** —
   rettet med periodisk revalidering + frisk revalidering lige før hver
   besked, se "Packrush-ændringer, opgave B" og `src/ws.js`.

Desuden: `PUT /me/subs`/`PUT /me/ticks`'s `liv.next_regen_ms` brugte
tidligere den GAMLE spiller-række i stedet for resultatet EFTER selve
handlingen (gav et forældet tal lige efter en handling der selv ændrer
liv-grundlaget) — rettet, se `src/lifeBag.js#livView`. `cutoffDate()`s
skudårskant er også rettet (se "Packrush-ændringer", opgave C, nedenfor).

Og seks nye funktionskrav: firma er nu valgfrit (`PATCH /me`, se ovenfor),
`POST /admin/afmeld` (bulk-afmelding), `POST /admin/nulstil` (fuld
nulstilling), Europe/Copenhagen-dage (se "Dage og tidszoner"),
svareksempler for lodtrækning/notifikationer (se ovenfor), og en
nginx-oprydning på produktionsserveren (ingen ny nginx-regel var
nødvendig — alle nye endpoints ligger under det eksisterende
`/api/spil/`-præfiks).

## Packrush-ændringer

Denne opfølgende ændringsrunde porterer de regelændringer der fulgte med
klientens omdøbning fra "Pluk. Pak. Send." til "Packrush" (commit `ec81ec6e1`
i `spil/index.html`). Kort opsummeret hvad der ændrede sig og hvorfor:

### A) Liv: nyt loft + dagens flueben vs. varig tilmelding

> **Liv-regler pr. 3. okt. 2026 (gælder nu, erstatter tallene nedenfor):**
> grundtallet `perDay` er **1**. Når det er brugt, kommer der ét nyt pr.
> `REGEN_MS` = **60 min**, op til grundtallet (`regenCap(cfg)` =
> `cfg.perDay`) — **uanset flueben**. Hvert flueben (SmartPack, partner, sms)
> giver **+1 liv med det samme**, én gang pr. liste pr. dag (`bag.g`).
> Bonusliv regenereres ikke. `MAX_LIVES` = **12**. Klienten: Black
> Friday-vagter = 1 + antal afsluttede timer i dag, hvor man var i top 10
> (kun klient-håndhævet, som før). Afsnittet nedenfor beskriver de tidligere
> tal og er beholdt som historik.


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
  spillere UDEN nogen liste med aktiv (`bekraeftet`) status OG ≥24 måneder
  siden seneste aktivitet (det seneste af `forsoeg.oprettet`,
  `spiller_token.oprettet`/`sidst_brugt` (login) og spillerens egen
  `oprettet`). 24 måneder og "login tæller" svarer til deltagervilkårene,
  pkt. 11 (/spil/vilkaar/). `deleteInactivePlayers` LÅSER derefter hver kandidat
  (`SELECT ... FOR UPDATE`), GENKONTROLLERER begge betingelser lige før
  selve sletningen (se "Sletning og anonymisering" og
  `stillQualifiesForDeletion`), og udfører selve sletningen + anonymisering
  af rest-referencer via den fælles `src/playerDeletion.js` (samme funktion
  som `DELETE /admin/spillere/:pid` og `POST /admin/nulstil`).
  `scripts/retention-job.js` er den natlige cron-indgang — se README.md for
  drift/skemalægning. Kører IKKE automatisk endnu (kun kode/migration/cron-
  DOKUMENTATION i denne runde).
- `cutoffDate()` klemmer til den sidste gyldige dag i målmåneden i stedet
  for at lade en 29. februar rulle videre ind i marts over en skudårskant —
  BEVIDST konservativt (giver aldrig en yngre cutoff end præcis 24 måneder,
  i værste fald én dag ældre).
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

## Anden opfølgende ændringsrunde (spil-api-klient-fund)

Bestilt af agenten der bygger spillets NYE frontend (branch
`spil-api-klient`), som allerede kalder dette API og fandt ni ting der
krævede backend-ændringer, plus én bundlet anonymiserings-forbedring.
Migration: `migrations/005_opfoelgning2.sql`. Alle punkter er beskrevet
inline ovenfor de relevante endpoints — dette afsnit er et samlet overblik +
de tekniske detaljer der ikke passede naturligt ind noget andet sted.

- **A) Tidsvalidering ved finish** — se "Spilletid" under "Snydegrænser" og
  "Dage og tidszoner". `MIN_SPILLETID_MS`/`MAX_SPILLETID_MS` var FØR denne
  runde hardkodede konstanter i `src/rules/scoring.js` (IKKE config-drevne
  fra en tidligere runde) — nu `cfg.minAktivSpilletidMs`/
  `cfg.maxAktivSpilletidMs` i `config.offentlig`.
- **B) `POST /runs {ny:true}`** — se `POST /runs` ovenfor. Ny
  `forsoeg.status`-værdi: `'opgivet'` (CHECK-constraint udvidet i
  migrationen).
- **C) Flere samtidige tokens** — ny tabel `spiller_token` (se
  "Autentifikation" og `src/spillerToken.js`). `spiller.token_hash` er
  DROPPET (data migreret ind i den nye tabel FØR kolonnen fjernes). Der
  findes IKKE noget spiller-logout-endpoint endnu (kun admins
  `/admin/logout`) — ikke et krav i denne runde, men modellen
  (`tilbagekaldt`-kolonnen) er klar til det: et fremtidigt spiller-logout
  skal KUN sætte `tilbagekaldt = now()` på DEN token-række der blev brugt
  til at kalde det (identificeret ved token_hash), aldrig spillerens øvrige
  rækker.
- **D) Skrive-rate-limit** — hævet fra `120` til **`1000`/min/IP**
  (`src/app.js`). Valgt som et rundt, generøst tal for messe-Wi-Fi bag NAT
  (potentielt hundredvis af enheder pr. offentlig IP) uden at give reelt
  ubegrænset skrivning. Spiller-specifikke grænser (1 forsøg-start/20
  sek./spiller) og admin-login (5/min/IP) er UÆNDREDE, se `src/app.js`.
- **E) WS** — se "WebSocket `/ws`" ovenfor for begge dele (nye duel-events,
  navne-overskrivning, state.changed-triggere).
- **F) `POST /me/boost`-rækkefølge** — se sektionen ovenfor. `forkert_kode`
  er ERSTATTET af `ukendt_kode` (samme kode som `POST /me/challenge`
  allerede brugte for "ukendt kode").
- **G) `GET /admin/spillere`** — se sektionen ovenfor for de præcise
  feltnavne.
- **H) `POST /admin/afmeld`** — se sektionen ovenfor (`liste:"alle"` +
  email/telefon-matchning).
- **I) Firma valgfrit** — allerede implementeret i en tidligere runde,
  bekræftet uændret (ingen ny kode).
- **Anonymiserings-id-fix** — se "Sletning og anonymisering" ovenfor.
  `notifikation.data.by_spiller_id`/`.fra_spiller_id` og
  `forsoeg.duel.vs_spiller_id` er NYE, nullable felter i de eksisterende
  jsonb-kolonner (ingen ny DB-KOLONNE nødvendig, kun applikationskode + en
  kommentar i migrationen). `raffle_draws` brugte allerede sin rigtige
  `spiller_id`-kolonne.

### Fortolkninger / antagelser (ikke eksplicit i briefen)

1. **`duel.vsId`** (`POST /runs/:runde_id/finish`) er et HELT NYT,
   valgfrit felt vi selv har introduceret for at kunne sætte
   `duel.vs_spiller_id` pålideligt — modstanderens identitet indgik
   tidligere slet ikke server-side i duel-flowet (`duel` var, og er
   fortsat, ellers rent klient-leveret fritekst). Findes feltet ikke,
   gemmes `duel.vs` som hidtil, blot uden id (falder tilbage til
   navnematch ved en evt. anonymisering, samme risiko som hidtil for netop
   DEN forsøgs-række). Bør bekræftes/justeres når den nye frontends
   faktiske duel-payload er kendt.
2. **WS-navnefelter der overskrives** (opgave E) er begrænset til `name` og
   `an` (kendt fra det NUVÆRENDE klientkode-mønster i `spil/index.html`,
   som bruger et andet transportlag end selve `/ws`-protokollen dette
   dokument beskriver) — vi kender ikke den nye frontends præcise
   duel-data-skema. Hvis den bruger andre feltnavne til afsenderens navn,
   skal `AFSENDER_NAVN_FELTER` i `src/ws.js` udvides tilsvarende.
3. **`presence`-beskedens `name`-felt** er BEVIDST IKKE ændret i denne
   runde — briefen nævnte specifikt "duel-events", og presence-navnet var
   allerede client-leveret før denne runde. Samme klasse af
   tillidsproblem findes potentielt her (en spiller kunne i teorien sætte
   et vilkårligt presence-navn), men er uden for denne rundes scope — værd
   at kigge på i en senere sikkerhedsgennemgang hvis det bliver relevant.
4. **Rate-limit-tallet (1000/min/IP)** er et skøn, ikke et tal fra briefen
   ("fx 1000/min — vælg et fornuftigt konkret tal") — juster via
   `src/app.js` hvis messens faktiske NAT-belastning viser sig at kræve
   noget andet.
5. **`GET /admin/spillere`s `forsoeg[].slut_server`** navngivningen
   `slut_server` (fremfor blot `slut`) er valgt for at undgå forveksling
   med et evt. fremtidigt klient-sidet begreb om "hvornår så JEG
   resultatet" — det er entydigt server-tidspunktet fra
   `forsoeg.slut_server`.

---

## Tredje opfølgende ændringsrunde (navnemaskering-omgåelse + deploy-hygiejne)

En opfølgende sikkerhedsgennemgang fandt at id-referencerne fra forrige
runde (`by_spiller_id`/`fra_spiller_id`/`vs_spiller_id`) KUN blev brugt ved
GDPR-anonymisering — selve LÆSEVEJEN returnerede stadig det rå, ufaskerede
navn direkte, hvilket omgik hele navnemaskerings-designet. Rettet:

1. **`GET /me`'s `notifikationer[].data.by`/`.fra`** maskeres nu ved
   læsning, se "`GET /me`"-afsnittet ovenfor og `src/routes/me.js#maskNotifikation`.
   De interne id-felter eksponeres ikke længere i svaret.
2. **`forsoeg.duel.vs`** — write-side: `duel.vs` var hidtil ren
   klient-fritekst uden nogen serverside-verifikation mod den faktiske
   modstander. Nu `duel.vsId` resolves til en rigtig spiller, overskrives
   snapshottet med serverens egen kendte navn for netop DEN spiller (se
   `src/routes/runs.js`). Read-side: `GET /state`s maskering (uændret regel)
   bruger nu `maskedName()` i stedet for rå `shortName()`, så en allerede
   anonymiseret "Slettet spiller"-sentinel vises uændret i stedet for at
   blive forvansket til "Slettet s." (se `src/publicState.js`).
3. **WS `duel.go`s `bn`** (modstanderens navn, sat af afsenderen selv) — se
   "WebSocket `/ws`" ovenfor.
4. **`POST /me/challenge`s `udfordrer`** — fundet ved den afsluttende
   adversarielle gennemgang af selve denne rettelse (samme lækage-klasse,
   men ikke via en gemt/genlæst kolonne — direkte i selve svaret): kode-
   ejerens fulde navn blev returneret ufasket til en helt almindelig
   spiller. Maskeres nu efter samme regel, se "`POST /me/challenge`"
   ovenfor.

**Datamigrering:** `migrations/006_navnemaskering_fix.sql` retter
eksisterende `forsoeg.duel.vs`-rækker hvor `vs_spiller_id` allerede er kendt,
så snapshottet matcher den faktiske spillers navn (formentlig meget lidt
eller ingen reel data i produktion endnu).

**Deploy-hygiejne (uafhængigt punkt, samme runde):** `docker-compose.override.yml`
(server-lokal port-binding, `127.0.0.1:8004:3000`) er nu versionsstyret i
dette repo i stedet for kun at eksistere som en utracket fil på serveren —
en `rsync --delete`-baseret udrulning kunne (og gjorde, én gang) slette den
ved et uheld. Se README.md, "Udrulning fra Windows", for den opdaterede
`deploy.sh`-metode uden lokal `rsync`.

---

## Fjerde opfølgende ændringsrunde (afsluttende review)

En afsluttende review fandt fem konkrete rettelser (N5, N6, N9, N13, N17) +
én bonus i samme sårbarhedsklasse som N6 (N4-bonus, ikke i den oprindelige
liste, men billig at rette samtidig):

1. **N5 — WS `hello` uden token loggede ikke standens forbindelse ud.**
   `hello` UDEN et gyldigt token (fx "Næste spiller"/logout på en
   standtablet) nulstillede hidtil IKKE `ws.player`/`presenceName` på selve
   forbindelsen — den forblev logget ind som den FORRIGE spiller, og
   presence-listen viste stadig forrige spillers navn til andre. Nulstiller
   nu begge felter eksplicit og broadcaster en opdateret presence-liste med
   det samme, se "WebSocket `/ws`" ovenfor og `src/ws.js`.
2. **N6 — duel-afsendernavn kunne forfalskes via presence.** Afsendernavnet
   i duel-events (og presence-listens `users[].name`) blev beregnet som
   `ws.presenceName || ws.player.navn`, men `presenceName` var ren
   klient-fritekst (op til 22 tegn) sat via et separat `presence`-kald — en
   spiller kunne sætte et vilkårligt navn og starte en duel, og teksten blev
   vist ufiltreret (kun maskeret, aldrig erstattet) på standvæggen. Navnet
   hentes nu UDELUKKENDE fra den autoritative `ws.player.navn` — `presence`-
   beskedens `name`-felt ignoreres HELT, både ved selve presence-broadcastet
   og ved duel-afsendernavn/`bn`-opslaget. Se "WebSocket `/ws`" ovenfor.
3. **N4-bonus — tomt modstandernavn på standvæggen (samme sårbarhedsklasse,
   ikke i den oprindelige liste).** `bn`-opslaget (se "Tredje opfølgende
   ændringsrunde", punkt 3) matchede kun `data.a` som selv-reference — den
   FAKTISKE klient sender kun `data.tab`, ikke `data.a`, i
   `duel.waiting`/`duel.s`, så opslaget aldrig matchede, og `bn` endte
   konsekvent tom. `data.tab` registreres nu SOM ET EKSTRA selv-reference-
   felt, ved siden af `data.a` — begge virker samtidig.
4. **N9 — bearer-tokens udløb aldrig.** `spiller_token` havde ingen
   udløbstid, og der fandtes intet spiller-logout-endpoint. Tilføjet: (a)
   `POST /me/logout`, der tilbagekalder KUN det ene token det blev kaldt
   med; (b) en TTL (`PLAYER_TOKEN_TTL_MS`, default 30 dage) — et token der
   ikke har været BRUGT (`sidst_brugt`) inden for TTL'en, autentificerer
   ikke længere, tjekket ved HVER brug, ikke kun ved udstedelse; (c)
   `sidst_brugt` opdateres højst én gang i minuttet pr. token (skrivestøj);
   (d) det eksisterende natlige job (`scripts/retention-job.js`) rydder nu
   også udløbne tokens op (`src/retention.js#revokeExpiredTokens`), i
   stedet for en ny, separat cron-mekanisme. Se "Autentifikation" og
   `migrations/007_token_ttl.sql`.
5. **N13 — udfordrings-liv-gaven manglede point.** `udfordring_liv`-gaven
   (se "Svareksempler: lodtrækning og notifikationstyper") indeholdt ikke
   udfordrerens samlede point fra det gennemførte forsøg — klientens tekst
   endte altid med at sige "fik 0 point", og "Slå den tilbage" blev aldrig
   vist. Gavens `data` indeholder nu `score` (sat på skrivetidspunktet, se
   `src/routes/runs.js`s finish-flow, punkt 4).
6. **N17 — dagsskifte midt i et forsøg, dokumenteret (ren dokumentation,
   ingen kodeændring).** Et forsøg der starter FØR midnat (dansk tid) og
   først finish'es EFTER midnat, afvises med `409 forsoeg_udloebet`, og
   livet er tabt — også selvom spilleren var online hele tiden. Dette ER et
   bevidst designvalg fra "Anden opfølgende ændringsrunde", men var ikke
   tydeligt dokumenteret som sådan — se "Dage og tidszoner",
   `POST /runs/:runde_id/finish`, og README.md, "Drift: dagsskifte midt i
   et forsøg".

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

## Partnere (008_partnere.sql)

Partnere til power-ups og præmier. Sider: `/spil/partner/admin.html` (admin),
`/spil/partner/` (partnerlogin og ansøgning) og `/spil/praemier/` (offentlig
præmieoversigt og partnersider). Fælles regler i `src/partners.js`, endpoints i
`src/routes/partners.js`, tests i `test/partners.test.js`.

**Synlighed:** en partner vises offentligt (GET /partnere, power-up i spillet,
præmieoversigten) kun når `status='aktiv'`, `vist_i_spil=true` (sættes kun af
admin), og firmanavn, hjemmeside og kort beskrivelse er udfyldt. En præmie vises
kun, når titel, værdi og beskrivelse er udfyldt, og ved `op_til` også betingelser.

**Slet = arkivér:** `DELETE /admin/partnere/:id` sletter kun helt, hvis partneren
er `ansoegt`/`afvist` og ingen brugere har. Ellers arkiveres den, og dens brugere
logges ud. `slug` er partnerens faste id og ændres aldrig.

**Spillet:** `spil/index.html` henter `GET /partnere`. Når mindst én partner i
admin har en power-up, styrer admin listen (navn og hvilke power-ups der findes).
Ellers bruges den indbyggede standardliste. Nyhedsmail-listerne
(`config.mailPartners`) er stadig navnebaserede og kobles ikke automatisk.

| Metode + sti | Adgang | Beskrivelse |
|---|---|---|
| `GET /partnere` | offentlig | Synlige partnere + power-up-katalog |
| `GET /partnere/:slug/logo` | offentlig | Logo (PNG/JPG/WEBP/SVG, sandbox-CSP) |
| `GET /praemier` | offentlig | Præmier sorteret efter værdi, samlet værdi, konkurrence (`aktiv`, `tekst`) |
| `POST /partnere/ansoeg` | offentlig, 5/10 min/IP | Ansøgning → `status='ansoegt'` |
| `GET/POST /admin/partnere`, `GET/PUT/DELETE /admin/partnere/:id` | admin | Liste, opret, ret, slet/arkivér |
| `POST /admin/partnere/:id/godkend` | admin | ansoegt → aktiv |
| `PUT/DELETE /admin/partnere/:id/logo` | admin | Logo som rå billedbody, højst 600 KB |
| `POST /admin/partnere/:id/brugere` | admin | Ny partnerbruger med startkode (min. 10 tegn) |
| `POST /admin/partner-brugere/:bid/nulstil`, `DELETE /admin/partner-brugere/:bid` | admin | Ny startkode / slet bruger |
| `GET/PUT /admin/konkurrence` | admin | Navn, lodtrækning, tekst før/efter, vinder (navn, firma, dato, tekst; 009_vinder.sql) |
| `POST /partner/login`, `POST /partner/logout` | 5/min/IP | Cookie `spil_partner_session` (12 t) |
| `POST /partner/skift-kode` | partner | Påkrævet før alt andet, når `skal_skifte_kode` |
| `GET/PUT /partner/mig`, `PUT /partner/mig/logo` | partner | Egen profil og præmie (ikke navn, status, vist, power-up) |

## Partnervilkår og præmiekonkurrence (2. okt. 2026)

Beslutninger: projektdokumentet `packrush-beslutninger-vilkaar.md`. Vilkår:
`/spil/vilkaar/` (spillere) og `/spil/partnervilkaar/` (partnere).

### Pinkode i stedet for telefon (010_pinkode.sql)
- `POST /players` tager `pin` (4 cifre) i stedet for `telefon`. Telefon
  gemmes ikke længere. Ved login fra ny enhed: e-mail + pinkode.
- 5 forkerte pinkoder i træk spærrer spilleren i 15 min. (429
  `pin_spaerret`). Spærringen er pr. spiller, ikke pr. IP (standens tablets).
- Spillere oprettet før pinkoden (`pin_hash` NULL) kan stadig logge ind med
  `telefon`; ellers svar 400 `mangler_pin`.
- `POST /admin/nulstil-pin {email}` og `POST /admin/spillere/:pid/nulstil-pin`
  giver en ny tilfældig pinkode, som kun vises i svaret.
- Sms (sms-liste og sms-boost) er slået fra i config.

### Telefon er igen valgfrit, men påkrævet ved sms (brugerens beslutning, 2. okt. 2026)
- `POST /players` accepterer igen et VALGFRIT `telefon`-felt, og `PATCH /me
  { telefon }` kan sætte/rette det bagefter — se de to endpoints ovenfor for
  den fulde kontrakt (validering, `telefon_i_brug`, `telefon_kraeves`).
- `spiller_telefon_unik` (001_init.sql) blev ALDRIG fjernet, kun gjort
  nullable (010_pinkode.sql ovenfor) — ingen ny migration var nødvendig for
  "unik kun når sat": en almindelig UNIQUE INDEX behandler allerede hvert
  NULL som forskelligt fra alle andre i Postgres. Koden sørger blot for at
  gemme NULL (ikke `''`) når feltet er udeladt.
- `PUT /me/subs` og `PUT /me/ticks` afviser forsøg på at (for)blive tilmeldt
  `sms` uden et registreret telefonnummer (`400 telefon_kraeves`) — se de to
  endpoints ovenfor.
- `GET /admin/eksport/sms.csv` og `GET /admin/eksport/revanche.csv` SPRINGER
  spillere uden telefon over (de kan jo ikke modtage en sms) — se
  "Admin"-afsnittet nedenfor. Den generelle `GET /admin/spillere` og `GET
  /admin/eksport/spillere.csv` er UÆNDREDE og viser FORTSAT alle spillere
  (inkl. uden telefon) — de bruges til almindelig spilleradministration, ikke
  kun sms, og en udeladt telefon er der bare tom/`null`.

### Partnere som tilmeldingslister (src/cfgLoad.js)
- Aktive, synlige partnere (status `aktiv`, `vist_i_spil`, udfyldt profil inkl.
  CVR, produktkategori og privatlivspolitik) bliver tilmeldingslister på
  deres slug: nøgle `m:<slug>`, samtykkeliste `partner:<slug>`.
- `GET /state`'s `cfg.partnerLister` har navn, fast samtykketekst (med firma
  og CVR) og link til privatlivspolitik. Samtykketeksten gemmes i
  `samtykke.tekst` med `tekst_version = 2`.

### Partnerportal (011_partnervilkaar.sql)
- Nye partnerfelter: produktkategori, privatlivspolitik, afmeld_email,
  levering_navn/-email, praemie_ikke_med, praemie_sidste_frist, praemie_flyt
  (ja/nej/spoerg), fordel_* (partnerfordel ved køb, tæller ikke i puljen).
- `GET/POST /partner/vilkaar`: de 7 erklæringer; alle skal være sat.
  Gemmes i `partner_accept` med version, bruger og IP.
- `GET /partner/leads` (antal) og `GET /partner/leads.csv`: kun spillere,
  hvis seneste hændelse på `partner:<slug>` er en bekræftelse. Kræver accept.
  Hver download logges i `partner_lead_download`.
- `GET /admin/partnere/:id/log`: accepter og downloads.

### Præmiekonkurrencen (012_konkurrence_lodtraekning.sql, src/konkurrence.js)
- Deltagerlisten gemmes kun som firmanavne: `GET/POST /admin/deltagerliste`
  (`tekst`, `kolonne`, `tilstand` = `erstat`/`tilfoej`).
- `GET /admin/konkurrence/lodder`: firmaets bedste godkendte spil mellem
  `konkurrence.spil_start` og `spil_slut`, 1 lod pr. påbegyndte
  `point_pr_lod` point, kun firmaer på listen, `udelukkede_firmaer`
  (standard `smartpack`) kan ikke vinde.
- `POST /admin/konkurrence/traek`: trækker med `crypto.randomInt` og gemmer
  hele grundlaget i `konkurrence_traekning`. `GET /admin/konkurrence/traekninger`.
- Firmaer matches med `matchNoegle()` (som firmKey, men "A/S"/"I/S" fjernes
  først).

### Admin-kode (013_admin_kode.sql)
- `POST /admin/skift-kode {gammel, ny}` (admin-session): ny kode mindst 12
  tegn. Gemmes som hash i `admin_kode` og har forrang for
  `ADMIN_PASSWORD_HASH`. Alle andre admin-sessioner logges ud.
- Glemt kode: slet rækken i `admin_kode` på serveren, så gælder .env-koden igen.

### Personlige admin-logins (014_admin_brugere.sql)
- `POST /admin/login {email, password}`: personligt login for en
  @smartpack.dk-admin. Uden `email` bruges den fælles kode som før.
  Svaret har `skal_skifte_kode`; er den sand, afviser alle admin-endpoints
  med 403 `skal_skifte_kode`, undtagen `/admin/skift-kode`, `/admin/mig` og
  `/admin/logout`. 5 forkerte koder spærrer brugeren i 15 min.
- `GET /admin/mig`, `GET/POST /admin/brugere` (kun @smartpack.dk, startkode
  mindst 10 tegn), `POST /admin/brugere/:id/nulstil`, `DELETE /admin/brugere/:id`
  (lukker login og sessioner; man kan ikke lukke sig selv).

## Sikkerhedsgennemgang, branch `spil-api-backup` (H2/M3/M4, 2. okt. 2026)

Tre uafhængige fund fra et review af Martins nye pinkode-/partner-/
lodtrækningsarbejde og den nye auto-deploy-workflow:

### H2) Backup FØR auto-deploy, afbryd ved fejl
`.github/workflows/deploy-spil-api.yml` kører nu `scripts/backup.sh` på
serveren (over SSH) FØR selve `rsync`/`deploy.sh`/migrationerne. Fejler
backup-trinnet (ikke-nul exit), stopper HELE workflowet der — ingen deploy
eller migration uden en frisk, bekræftet backup lige inden. Se README.md,
"Drift: natlig backup", for bootstrap-forbeholdet (scriptet skal allerede
ligge på serveren fra en tidligere udrulning).

### M3) IP-bred rate-limit på pinkode-login
Se `POST /players` ovenfor (`ip_login_spaerret`, nøglet på `X-Client-IP`) —
i tillæg til den eksisterende pr.-spiller-spærring (`pin_spaerret`, 5
forsøg/15 min.), som blev VERIFICERET i denne omgang til at være kort og
ikke-eskalerende (`pin_fejl` nulstilles samtidig med at spærringen sættes,
så en ny spærring igen kræver 5 friske forkerte forsøg). **Oprindeligt ét
fælles loft PÅ TVÆRS AF SPILLERE — se S1 nedenfor for hvorfor og hvordan det
blev splittet i to lag.**

### M4) Selvbetjent sletning `DELETE /me`
Se `DELETE /me` ovenfor. Kræver bearer-token OG en ekstra bekræftelse
(pin ELLER telefon, samme regel som login) — et alene stjålet/lækket
token kan ikke slette kontoen. Genbruger `deletePlayerFully()`. Logger
`admin_audit_log` UDEN persondata (kun `public_id` + fast begrundelse).

## Opfølgende merge-review, branch `spil-api-backup` (S1/S2/S4, 2. okt. 2026)

Et merge-review af H2/M3/M4-ændringerne ovenfor blokerede merge pga. ét højt
fund (S1) og bad om to mindre rettelser (S2, S4):

### S1 (HØJT, blokerede merge): IP-grænsen ramte hele messens Wi-Fi
Den oprindelige M3-grænse (se ovenfor) var ÉT fælles loft PÅ TVÆRS AF ALLE
SPILLERES emails. Da `X-Client-IP` i praksis er Cloudflares
`CF-Connecting-IP`, deler hele messens Wi-Fi/NAT typisk ÉN IP — 10 forkerte
forsøg FRA HVEM SOM HELST på standen, MOD HVILKEN SOM HELST konto, blokerede
derfor reelt login for HELE standen i op til 10 minutter. Rettet ved at
splitte grænsen i to lag (se `POST /players`-afsnittets "S1"-boks og
`src/routes/players.js#createIpLoginLimiter` ovenfor): ét snævert
pr.-(IP, email)-lag (uændret 10/10 min., men nu kun pr. konto) og ét nyt,
højt pr.-IP-alene-lag (300/10 min., på tværs af alle emails). Begge lag
gælder stadig for BÅDE `POST /players` og `DELETE /me` via den delte
`ipLoginLimiter`-instans.

### S2 (MIDDEL): backup-kørsel robust mod manglende exec-bit
`.github/workflows/deploy-spil-api.yml` og den dokumenterede crontab-linje
(README.md, "Drift: natlig backup") kaldte scriptet direkte
(`/var/www/spil-api/scripts/backup.sh`), hvilket kræver at exec-biten er
sat — den mistes let ved kopiering/rsync fra Windows. Begge steder kalder nu
scriptet via `bash ...` i stedet, så exec-biten er irrelevant.

### S4 (LAVT): backup.sh's tomheds-tjek fangede ikke en tom dump
`scripts/backup.sh` tjekkede kun at output-filen ikke var tom (`[ -s ... ]`)
— men en fejlet/afbrudt `pg_dump` kan stadig producere en lille, GYLDIG
gzip-fil (fx af en tom stream, ~20 byte), der bestod det tjek uden at
indeholde en brugbar dump. Scriptet verificerer nu EKSPLICIT at indholdet
rent faktisk er en komplet dump: `zcat <fil> | tail -1` skal indeholde
strengen `"PostgreSQL database dump complete"` (standard-afslutningslinjen i
en succesfuld `pg_dump`). Fejler dette tjek, exitter scriptet med fejl og
logger tydeligt, PRÆCIS som ved enhver anden fejl i scriptet.

## Kampagnetilmeldinger (migration `017_kampagne_tilmelding.sql`, `src/routes/kampagne.js`)

Formularen på smartpack.dk/messe sender hertil. Én række pr. (kampagne, e-mail);
gentilmelding opdaterer rækken og samler `kilder` (messe, ehandelskonferencen,
digiday, andet). Kilden sættes i QR-linket, fx `smartpack.dk/messe?kilde=digiday`;
uden parameter bliver det `ehandelskonferencen` den 8/10-2026, ellers `messe`.

- `POST /kampagne/tilmeld` `{kampagne:'ehandelsdagen-2027', kilde, navn, klub, firma, email, telefon, ordrer, hvor, nyhedsbrev}` → 201. 60/min/IP. Samtykketeksten gemmes på rækken.
- `GET /admin/kampagne/:kampagne` (admin) → tilmeldinger med `lodder_basis` (10), `lodder_spil` (Packrush) og `lodder` (i alt).
- `GET /admin/kampagne/:kampagne.csv` (admin) → samme som CSV (semikolon, BOM).

Ehandelsdagen er den samlede lodtrækning: tilmeldingens 10 lodder + firmaets
Packrush-lodder fra konferencens periode (samme regel som `beregnLodder()`;
firmaet findes via spilleren med samme e-mail, ellers via firmanavnet).
Konferencens egen lodtrækning påvirkes ikke. Warehouse Warrior kobles på senere.
Admin-side: `spil/kampagne/`.

**CRM-kobling** (`src/crm.js`, migration `018_kampagne_crm.sql`): hver tilmelding
sendes efter svaret til `POST https://crm.smartpack.dk/api/v1/newsletter` med
`Authorization: Bearer $SMARTPACK_CRM_KEY` (kun i serverens `.env`, aldrig i
repoet). `source` = kilden (ehandelskonferencen sendes som `messe`), `newsletter`
+ `consentText` kun ved flueben, klub/ordrer/hvor i `notes`. Status gemmes i
`crm_sendt`/`crm_fejl`. `POST /admin/kampagne/:kampagne/crm-send` (admin)
sender alle rækker uden `crm_sendt`, højst 500 pr. kald.

## Hjemmesidens kontaktformular → CRM (`src/routes/hjemmeside.js`)

`js/contact-form.js` på smartpack.dk sender (ud over sin egen mail) en kopi til
`POST /api/spil/hjemmeside/kontakt`. Serveren sender den videre til
`https://crm.smartpack.dk/api/v1/contact-form` med `SMARTPACK_CRM_KEY`, så nøglen
aldrig er i browseren. Felter: name, email, phone, company, message (lead:
kommentaren; generel/support: emne + besked), page, type (Lead/Generel/Support)
og de øvrige svar (cvr, ordrer, webshop, erp, fragt, hastegrad, hørt via) som
ekstra felter, der havner i CRM-notatet. Flueben for nyhedsmails →
`newsletter: true` + `consentText: "Ja tak til praktiske tips om lager og
logistik"`. Honeypot-feltet `_hp` sendes med. Svaret er altid `{ok:true, crm}`
(20/min/IP); intet gemmes i Packrush' database.

## Packrush-spillere → CRM (`src/crmSynk.js`, migration `019_crm_synk.sql`)

Et baggrundsjob (startet i `server.js`, hvert minut) læser samtykke-loggen for
listen `smartpack` fra `crm_synk.sidste_id`: `bekraeftet` → `POST /newsletter`
(source `packrush`, newsletter true, spillerens præcise tekst og tidspunkt),
`trukket_tilbage` → `POST /newsletter/unsubscribe`. Uden `SMARTPACK_CRM_KEY`
sker intet; der fortsættes fra samme sted, når nøglen er lagt ind (også de
spillere, der allerede har sagt ja). Netværksfejl/5xx/429: stop og prøv igen;
øvrige 4xx: log og spring over. Kun spillere med ja til SmartPack sendes;
partnernes lister sendes aldrig til CRM'et.
