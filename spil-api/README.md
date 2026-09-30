# spil-api

Autoritativ backend til messespillet **"Packrush"** (tidligere
**"Pluk. Pak. Send."** — omdøbt i klienten, se API.md, "Packrush-ændringer").
Dette er en
**FASE 1**-leverance: al kode, migrationer og tests er klar og kører lokalt.
Server-udrulning (fase 2) er IKKE en del af denne leverance — se dog
`docker-compose.yml`/`Dockerfile`/`deploy.sh`, som er forberedt til den dag.

Se **`API.md`** for den fulde endpoint-kontrakt, snydegrænser og kendte
afvigelser/huller. Dette dokument dækker kun udviklerdrift: hvordan man
kører migrationer, serveren og testene lokalt.

## Forudsætninger

- Node.js ≥ 20
- PostgreSQL 16 (lokalt, eller via Docker — se nedenfor)
- Docker (valgfrit, men anbefalet — bruges af testene, se "Tests")

## Kom i gang lokalt

```bash
cd spil-api
npm install
cp .env.example .env
# ... udfyld DATABASE_URL i .env med en lokal Postgres 16-instans
```

Generér et admin-adgangskode-hash til `.env`:
```bash
node scripts/hash-password.js "din-adgangskode"
# indsæt outputtet som ADMIN_PASSWORD_HASH i .env
```

Start serveren (kører migrationerne automatisk ved opstart):
```bash
npm start
```
Serveren lytter på `PORT` (default 3000). `GET /health` bør give
`{"ok":true}`.

### Med Docker Compose (lokal Postgres, ingen udrulning)

```bash
docker compose up --build
```
Bemærk: `docker-compose.yml` publicerer bevidst INGEN porte (det er en
forberedelse til fase 2's nginx-opsætning) — til lokal udforskning uden
nginx kan du enten tilføje en midlertidig `ports:`-linje selv, eller køre
`api`-servicen via `npm start` mod en Postgres startet separat.

## Migrationer

Simpelt, hjemmerullet system: nummererede `.sql`-filer i `migrations/`,
kørt i rækkefølge ved serverens opstart (`src/db.js#migrate`). Kørte filer
spores i tabellen `_migrations` (oprettes automatisk hvis den ikke findes).
Ingen ned-migrationer — tilføj altid en NY nummereret fil for ændringer,
rediger aldrig en allerede-kørt fil.

## Tests

```bash
npm test
```

**Teststrategi:** testene bruger en RIGTIG Postgres, ikke mocks.
`test/helpers/testDb.js` tjekker om `docker` er tilgængeligt lokalt:

- **Er Docker tilgængeligt:** hver test-fil spinner sin egen
  engangs-`postgres:16`-container op (tilfældig værtsport), kører
  migrationerne mod den, og fjerner containeren igen ved test-ophør
  (`docker run --rm ...` + `docker rm -f` i teardown). Dette er den
  **anbefalede og fuldt afprøvede** vej.
- **Er Docker IKKE tilgængeligt:** falder tilbage til
  [`pg-mem`](https://github.com/oguimbal/pg-mem), en in-memory
  Postgres-emulator. Dette er et **best-effort fallback** — pg-mem
  understøtter ikke 100% af Postgres (vi har måttet registrere en no-op
  `citext`-extension-stub, se `test/helpers/testDb.js`, for at få
  `CREATE EXTENSION IF NOT EXISTS citext` til at gå igennem). Brug Docker
  hvis du kan.

Hvert testfil kører som sin egen Node `--test`-fil (se `package.json`s
`test`-script: `node --test test/*.test.js`); node:test kører hver fil i
egen proces, så hver får sin egen ende-til-ende-database og kan sætte
egne miljøvariabler (fx `ADMIN_PASSWORD_HASH`, `RUNS_START_RATE_LIMIT_MS`)
uden at påvirke andre testfiler.

**Testdækning** (se `test/*.test.js`):
- `life.test.js` — hele liv-reglen EFTER Packrush (dagens flueben vs. varig
  tilmelding, `dailyStart`/`lifeKeys` ud fra `todayTickKeys`, dags-skift,
  regen+cap, `MAX_LIVES`-klemning, `useLife`, `refill`, `setSubsPure` (varig,
  giver ikke liv), `setTicksPure` (dagens flueben, giver friske liv højst én
  gang pr. liste pr. dag)) som rene funktionstests, ingen DB.
- `nameDisplay.test.js` — `shortName()` ("Fornavn E."): flere ord, ét ord,
  mellemnavne, ekstra mellemrum, tomt/manglende navn, danske bogstaver.
- `retention.test.js` — GDPR-oprydningens `findRetentionCandidates`/
  `deleteInactivePlayers` (`src/retention.js`) mod syntetiske spillere:
  aktivt samtykke beholdes uanset alder, nyligt spillet uden samtykke
  beholdes, inaktiv uden samtykke slettes (både med og uden spilhistorik),
  cascade rammer kun de rette spilleres forsøg/notifikationer/samtykke;
  `cutoffDate()`s skudårsklemning; TOCTOU-genkontrollen
  (`stillQualifiesForDeletion`) afviser sletning af en kandidat der har
  fået nyt aktivt samtykke siden udvælgelsen; anonymisering af
  rest-referencer (raffle_draws-snapshot, notifikation.data.by/fra,
  forsoeg.duel.vs) i andre spilleres data.
- `tzDate.test.js` — Europe/Copenhagen-dagsberegningen
  (`src/rules/tzDate.js`), både JS-siden (`todayStr`, med et tidspunkt der
  er FORSKELLIG dag i UTC vs. København) og SQL-siden (`cphDateExpr` via
  `todayLeaderboard`).
- `boostCode.test.js` — den porterede hash/boostkode-algoritme.
- `scoring.test.js` — snydegrænser (rundescore-lofter, spilletid,
  stats-konsistens) og badge-evaluering.
- `state-privacy.test.js` — `GET /state` lækker ALDRIG PII, selv efter
  forsøg på at "lække" data via andre endpoints; state-cache;
  navnevisning forkortet uden session, fuldt med admin/stand-session.
- `players.test.js` — registrering/login, telefon-match-krav ved login,
  unikt telefonnummer, `PUT /me/subs` (varig, ingen liv) vs. `PUT /me/ticks`
  (dagens flueben, friske liv), `DELETE /me/subs/:liste`, sms-boost-indløsning;
  firma er valgfrit ved registrering + `PATCH /me` sætter/retter det bagefter
  og gør spilleren tællende i firmakampen (companyKey).
- `runs.test.js` — liv-forbrug ved `POST /runs`, idempotent `finish`,
  afvisning ved urealistisk score/for kort spilletid/tid-mismatch,
  ejerskabstjek.
- `admin.test.js` — admin-endpoints kræver session; login/logout;
  stand-login-flow (ét-gangs-kode → stand-session) og at en stand-session
  får 403 på rigtige admin-only endpoints; `POST /admin/afmeld`
  (fundet/ikke-fundet, kræver admin ikke stand); `POST /admin/nulstil`
  (kræver præcis bekræftelsesstrengen, tager backup FØR sletning og
  afbrydes helt hvis backuppen fejler, sletter alt, logger en audit-række).
- `ws.test.js` — WS duel-events (`presence`/`emit`) kræver spiller-token;
  anonyme forbindelser kan kun lytte; broadcasts personaliseres pr.
  forbindelse (stand-session ser fulde navne, andre ser forkortede);
  en admin/stand-session der forsvinder MENS forbindelsen er åben mister
  privilegiet, både via det periodiske sweep og den friske pr.-besked-tjek.

**pg-mem-forbehold:** testfallbacket uden Docker (se ovenfor) har en kendt
begrænsning med `DISTINCT ON` kombineret med et efterfølgende SQL-side
JOIN/WHERE-filter på en afledt kolonne (bruges af `samtykke_status`-viewet,
se `migrations/003_packrush.sql`) — filtret kan blive skubbet ned FØR selve
dedupliceringen og give forkerte svar, KUN under pg-mem. `src/retention.js`
og de berørte admin-CSV-endpoints (`src/routes/admin.js`) omgår dette
bevidst ved at hente data ufiltreret og filtrere i JS — se API.md,
"Packrush-ændringer", opgave C, for detaljen. Hold dig til dette mønster
hvis du udvider disse forespørgsler.

## Drift/deploy/backup — **udestår fase 2**

Dette afsnit er bevidst tomt. `Dockerfile`, `docker-compose.yml` og
`deploy.sh` er skrevet og klar, men **ikke afprøvet** mod en rigtig server
endnu. Fase 2 dækker: binding til `127.0.0.1:8004`, host-nginx +
Cloudflare-opsætning, `X-Client-IP`-headeren, TLS/certbot, backup-strategi
for Postgres-volumet, og selve røgtesten af udrulningen.

### Drift: GDPR-oprydning (natligt job)

Se API.md, "Packrush-ændringer", opgave C, for selve reglen (hvem
kvalificerer til sletning). Driftsmæssigt:

- **Kørsel:** `scripts/retention-job.js` er den natlige indgang — et lille,
  selvstændigt Node-script (samme mønster som `scripts/hash-password.js`),
  IKKE noget der køres automatisk ved `npm start`/container-opstart.
  Tilføj en linje til serverens crontab (uden for dette repo), fx:
  ```
  10 3 * * * cd /var/www/spil-api && docker compose exec -T api node scripts/retention-job.js >> /var/log/spil-retention.log 2>&1
  ```
  (juster stien til `/var/log/spil-retention.log`, eller lad den gå til
  `docker compose logs` i stedet, alt efter hvad der allerede er sat op for
  backup-cron'en på serveren.)
### Drift: `POST /admin/nulstil`s pg_dump-sikkerhedsnet

`POST /admin/nulstil` (se API.md) tager FØRST en `pg_dump` som
sikkerhedsnet, FØR den sletter alle spillere. Dette FORUDSÆTTER:

- `pg_dump`-klienten (Postgres 16, pakken `postgresql16-client` på Alpine)
  er installeret i api-imaget — se `Dockerfile`. Kørt in-process (via
  `DATABASE_URL`), IKKE via `docker compose exec db pg_dump` (det natlige
  `backup.sh`s mekanisme) — api-containeren har hverken docker-socketen
  eller docker-CLI'en til rådighed.
- `/var/backups/spil-api` er mountet fra hosten ind i api-containeren — se
  `docker-compose.yml`s `volumes:` under `api`-servicen. Dette er SAMME
  host-sti som det natlige backup.sh allerede skriver til (så alt samles ét
  sted), men filerne navngives `nulstil-<tidsstempel>.sql` (IKKE
  `spilapi-*.sql.gz`), så backup.sh's 14-dages-rotation aldrig rammer dem.

Fejler `pg_dump` (fx pga. manglende disk, forkert `DATABASE_URL`, eller
disse forudsætninger ikke er opfyldt på serveren), afbrydes nulstillingen
HELT — ingen spillere slettes. Se `src/backup.js`.

- **Hvor man ser antallet af slettede:** stdout, som én linje pr. kørsel:
  `[retention] <tidspunkt> slettede <antal> spiller(e) (...)`. ALDRIG
  navne/emails — kun antallet. Send output til samme sted som
  backup-cron'ens log, hvis I allerede har en fast placering for den slags.
- **Denne leverance sætter IKKE jobbet til at køre automatisk** — hverken
  ved deploy eller på et fast klokkeslæt endnu. Selve den første rigtige
  kørsel sker først når crontab-linjen ovenfor rent faktisk tilføjes på
  serveren (uden for dette repos scope i denne omgang), og først derefter
  ved næste skemalagte tidspunkt.

## Arkitekturnoter

- **Ingen ORM** — rene parameteriserede `pg`-queries overalt.
- **Ingen `trust proxy`, ingen CORS** — se `API.md`, afsnit "Klient-IP".
- **WebSocket-relay** (`src/ws.js`) er rum-baseret og kræver spiller-token
  for at sende presence/events — se `API.md`.
- **Rate-limits** er in-memory pr. Node-proces (`src/middleware/rateLimit.js`)
  — fint til én instans, skal erstattes af en delt store hvis der nogensinde
  køres flere API-instanser parallelt.
