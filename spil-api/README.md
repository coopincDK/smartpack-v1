# spil-api

Autoritativ backend til messespillet **"Pluk. Pak. Send."**. Dette er en
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
- `life.test.js` — hele liv-reglen (dailyStart, dags-skift, regen+cap,
  useLife, refill, setSubsPure og dens friske-liv/samtykke-bogføring) som
  rene funktionstests, ingen DB.
- `boostCode.test.js` — den porterede hash/boostkode-algoritme.
- `scoring.test.js` — snydegrænser (rundescore-lofter, spilletid,
  stats-konsistens) og badge-evaluering.
- `state-privacy.test.js` — `GET /state` lækker ALDRIG PII, selv efter
  forsøg på at "lække" data via andre endpoints; state-cache.
- `players.test.js` — registrering/login, telefon-match-krav ved login,
  unikt telefonnummer, samtykke-historik ved af-/gentilmelding,
  sms-boost-indløsning.
- `runs.test.js` — liv-forbrug ved `POST /runs`, idempotent `finish`,
  afvisning ved urealistisk score/for kort spilletid/tid-mismatch,
  ejerskabstjek.
- `admin.test.js` — admin-endpoints kræver session; login/logout.
- `ws.test.js` — WS duel-events (`presence`/`emit`) kræver spiller-token;
  anonyme forbindelser kan kun lytte.

## Drift/deploy/backup — **udestår fase 2**

Dette afsnit er bevidst tomt. `Dockerfile`, `docker-compose.yml` og
`deploy.sh` er skrevet og klar, men **ikke afprøvet** mod en rigtig server
endnu. Fase 2 dækker: binding til `127.0.0.1:8004`, host-nginx +
Cloudflare-opsætning, `X-Client-IP`-headeren, TLS/certbot, backup-strategi
for Postgres-volumet, og selve røgtesten af udrulningen.

## Arkitekturnoter

- **Ingen ORM** — rene parameteriserede `pg`-queries overalt.
- **Ingen `trust proxy`, ingen CORS** — se `API.md`, afsnit "Klient-IP".
- **WebSocket-relay** (`src/ws.js`) er rum-baseret og kræver spiller-token
  for at sende presence/events — se `API.md`.
- **Rate-limits** er in-memory pr. Node-proces (`src/middleware/rateLimit.js`)
  — fint til én instans, skal erstattes af en delt store hvis der nogensinde
  køres flere API-instanser parallelt.
