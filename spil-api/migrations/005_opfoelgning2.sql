-- 005_opfoelgning2.sql
-- Anden opfølgende ændringsrunde, bestilt af agenten der bygger spillets NYE
-- frontend (branch `spil-api-klient`) — se API.md, afsnittet med samme navn
-- som denne fil, for den fulde begrundelse bag hvert punkt (A-I).

-- ---------------------------------------------------------------------------
-- A) Tidsvalidering ved forsøgs-afslutning: MIN/MAX for klientens PÅSTÅEDE
-- aktive spilletid skal kunne ændres uden redeploy (ligesom øvrige
-- snydegrænser bør være det) — tidligere hardkodede konstanter
-- (MIN_SPILLETID_MS/MAX_SPILLETID_MS i src/rules/scoring.js). Ikke hemmelige
-- tal, så de lægges i `offentlig` (samme sted som fx `perDay`). 3-args
-- jsonb_set opretter selv nøglen hvis den mangler (create_missing default
-- true) — samme mønster som migration 003's perDay-opdatering.
-- ---------------------------------------------------------------------------
UPDATE config SET offentlig = jsonb_set(
  jsonb_set(offentlig, '{minAktivSpilletidMs}', '70000'::jsonb),
  '{maxAktivSpilletidMs}', '240000'::jsonb
) WHERE id = 1;

-- Et forsøg kan nu opgives eksplicit (POST /runs {ny:true} med et allerede
-- aktivt forsøg samme dag) — livet der blev brugt til det, refunderes IKKE.
-- Adskilt fra 'udloebet' (som sker passivt ved dagsskifte eller det gamle
-- 15-minutters-vindue), så de to årsager kan skelnes i data.
ALTER TABLE forsoeg DROP CONSTRAINT IF EXISTS forsoeg_status_check;
ALTER TABLE forsoeg ADD CONSTRAINT forsoeg_status_check
  CHECK (status IN ('aktiv', 'godkendt', 'afvist', 'udloebet', 'opgivet'));

-- ---------------------------------------------------------------------------
-- C) Flere samtidige tokens pr. spiller — en spiller kan nu være logget ind
-- på flere enheder samtidig (fx telefon + standtablet). POST /players
-- (login OG ny registrering) OPRETTER altid en ny token-række og rører ALDRIG
-- spillerens øvrige tokens. Al bearer-token-autentificering slår nu op her
-- (se src/middleware/playerAuth.js) i stedet for spiller.token_hash.
-- ---------------------------------------------------------------------------
CREATE TABLE spiller_token (
  id            bigserial PRIMARY KEY,
  spiller_id    bigint NOT NULL REFERENCES spiller(id),
  token_hash    text NOT NULL UNIQUE,
  oprettet      timestamptz NOT NULL DEFAULT now(),
  sidst_brugt   timestamptz NOT NULL DEFAULT now(),
  tilbagekaldt  timestamptz
);

CREATE INDEX spiller_token_spiller_idx ON spiller_token (spiller_id);

-- Migrér evt. eksisterende spiller.token_hash-data ind i den nye tabel FØR
-- kolonnen droppes (robusthed — sandsynligvis ingen rigtige spillere endnu
-- ud over testdata, se API.md).
INSERT INTO spiller_token (spiller_id, token_hash, oprettet)
SELECT id, token_hash, oprettet FROM spiller WHERE token_hash IS NOT NULL;

ALTER TABLE spiller DROP COLUMN token_hash;

-- ---------------------------------------------------------------------------
-- Bonus (fra README/API.md "Afvigelser" — bundlet ind i denne runde for at
-- undgå endnu en redeploy): deletePlayerFully()'s anonymisering af
-- rest-referencer matchede tidligere KUN på navnetekst (kan fejle ved
-- navnesammenfald mellem spillere). Nye, nullable id-referencer ved siden af
-- navnefelterne — sat ved SKRIVETIDSPUNKTET (finish-flowet, se
-- src/routes/runs.js), brugt af src/playerDeletion.js i stedet for
-- navnematch når de findes (navnematch er fortsat et FALDBACK for ældre
-- rækker skrevet før denne migration). Ingen nye KOLONNER nødvendige her —
-- begge felter ligger i eksisterende jsonb-kolonner (notifikation.data,
-- forsoeg.duel), så det er en ren applikationskode-ændring; denne migration
-- indeholder derfor ikke selv noget skema-DDL for dem. raffle_draws har
-- allerede en rigtig spiller_id-kolonne og brugte den allerede.
-- ---------------------------------------------------------------------------
