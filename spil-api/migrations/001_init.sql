-- 001_init.sql
-- Grundlæggende skema for "Pluk. Pak. Send." — den autoritative spil-backend.
-- Alle tabeller er tomme efter denne migration; se 002_seed_config.sql for standardkonfiguration.

CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------------
-- spiller: én række pr. spiller. Email/telefon/samtykker/vennekode er PII og
-- må ALDRIG lække til andre spilleres klienter (se GET /state, som kun læser
-- fra et separat, PII-frit udtræk).
-- ---------------------------------------------------------------------------
CREATE TABLE spiller (
  id              bigserial PRIMARY KEY,
  public_id       text NOT NULL UNIQUE,
  email           citext NOT NULL UNIQUE,
  navn            text NOT NULL,
  telefon         text NOT NULL,
  firma           text NOT NULL,
  firma_noegle    text NOT NULL,
  vennekode       text UNIQUE,
  ref_spiller_id  bigint REFERENCES spiller(id),
  ref_betalt      boolean NOT NULL DEFAULT false,
  token_hash      text NOT NULL UNIQUE,
  skjult          boolean NOT NULL DEFAULT false,
  oprettet        timestamptz NOT NULL DEFAULT now(),

  -- tilmeldinger (bruges af subOptions/subKeys/lifeKeys, se src/rules/life.js)
  marketing       boolean NOT NULL DEFAULT false,
  mail_to         jsonb NOT NULL DEFAULT '[]'::jsonb,
  notify          boolean NOT NULL DEFAULT false,

  -- liv-tilstand (lifeState/useLife/refill, se src/rules/life.js)
  liv_dag         date,
  liv_n           integer NOT NULL DEFAULT 0,
  liv_t           timestamptz,

  -- udfordrings-liv-spærre: chl[modstander_id] = tidspunkt for sidste tildelte liv
  chl             jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- opnåede mærker (badge-navne, se src/rules/scoring.js)
  badges          jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- 20 fritekstfelter til fremtidigt/uforudset brug — se tabellen `ekstrafelt`
  -- for hvad hvert felt bruges til. Undgå at tilføje nye kolonner for hver
  -- lille detalje; brug disse i stedet og dokumentér i ekstrafelt.
  ekstra_01 text, ekstra_02 text, ekstra_03 text, ekstra_04 text, ekstra_05 text,
  ekstra_06 text, ekstra_07 text, ekstra_08 text, ekstra_09 text, ekstra_10 text,
  ekstra_11 text, ekstra_12 text, ekstra_13 text, ekstra_14 text, ekstra_15 text,
  ekstra_16 text, ekstra_17 text, ekstra_18 text, ekstra_19 text, ekstra_20 text
);

CREATE UNIQUE INDEX spiller_telefon_unik ON spiller (telefon);
CREATE INDEX spiller_firma_noegle_idx ON spiller (firma_noegle);
CREATE INDEX spiller_skjult_idx ON spiller (skjult);

CREATE TABLE ekstrafelt (
  felt          text PRIMARY KEY,
  betydning     text,
  taget_i_brug  boolean NOT NULL DEFAULT false
);

INSERT INTO ekstrafelt (felt, betydning, taget_i_brug) VALUES
  ('ekstra_01', 'liv_g: JSON-array af tilmeldingsnøgler (subKeys) der allerede har udløst friskt liv i dag — svarer til klientens L.g i lifeState(). Bruges af setSubs til at undgå dobbelt liv ved gentilmelding samme dag.', true),
  ('ekstra_02', 'ch_from: JSON-objekt {"kode","fra_spiller_id","fra_navn","dag"} — den vennekode-udfordring spilleren p.t. er kommet ind på (svarer til klientens p.chFrom). Ryddes (NULL) når finish() har uddelt udfordrings-liv.', true),
  ('ekstra_03', 'boost_dag: dato (YYYY-MM-DD) for sidste dag spillerens sms-boostkode blev indløst (svarer til klientens p.boostDay). Forhindrer at samme kode giver liv to gange samme dag.', true),
  ('ekstra_04', NULL, false),
  ('ekstra_05', NULL, false),
  ('ekstra_06', NULL, false),
  ('ekstra_07', NULL, false),
  ('ekstra_08', NULL, false),
  ('ekstra_09', NULL, false),
  ('ekstra_10', NULL, false),
  ('ekstra_11', NULL, false),
  ('ekstra_12', NULL, false),
  ('ekstra_13', NULL, false),
  ('ekstra_14', NULL, false),
  ('ekstra_15', NULL, false),
  ('ekstra_16', NULL, false),
  ('ekstra_17', NULL, false),
  ('ekstra_18', NULL, false),
  ('ekstra_19', NULL, false),
  ('ekstra_20', NULL, false);

-- ---------------------------------------------------------------------------
-- samtykke: fuld samtykkehistorik. Et aktivt samtykke har trukket_tilbage IS NULL.
-- Afmelding sætter trukket_tilbage; ny tilmelding opretter en NY aktiv række
-- (historikken bevares, intet overskrives).
-- ---------------------------------------------------------------------------
CREATE TABLE samtykke (
  id                bigserial PRIMARY KEY,
  spiller_id        bigint NOT NULL REFERENCES spiller(id),
  liste             text NOT NULL,           -- fx 'smartpack', 'partner:Herodesk', 'sms'
  givet             timestamptz NOT NULL DEFAULT now(),
  trukket_tilbage   timestamptz,
  tekst             text,
  tekst_version     integer NOT NULL DEFAULT 1,
  kilde             text,
  ip                inet,
  user_agent        text
);

CREATE UNIQUE INDEX samtykke_aktiv_unik ON samtykke (spiller_id, liste) WHERE trukket_tilbage IS NULL;
CREATE INDEX samtykke_liste_idx ON samtykke (liste);
CREATE INDEX samtykke_spiller_idx ON samtykke (spiller_id);

-- ---------------------------------------------------------------------------
-- notifikation: "beaten" (blev overhalet) og "gift" (fik gaveliv) beskeder.
-- ---------------------------------------------------------------------------
CREATE TABLE notifikation (
  id          bigserial PRIMARY KEY,
  spiller_id  bigint NOT NULL REFERENCES spiller(id),
  type        text NOT NULL CHECK (type IN ('beaten', 'gift')),
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,
  oprettet    timestamptz NOT NULL DEFAULT now(),
  set         boolean NOT NULL DEFAULT false
);

CREATE INDEX notifikation_spiller_idx ON notifikation (spiller_id, set);

-- ---------------------------------------------------------------------------
-- config: én række (id=1). `offentlig` er det klienten må se (uden pin).
-- `hemmelig` indeholder kun {"pin": "..."} lige nu — bruges KUN server-side
-- til at udlede dagens sms-boostkode, og eksponeres aldrig til klienter.
-- ---------------------------------------------------------------------------
CREATE TABLE config (
  id         integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  offentlig  jsonb NOT NULL DEFAULT '{}'::jsonb,
  hemmelig   jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- forsoeg: ét spilforsøg (3 runder). `resultat` er en TILFØJELSE ift. briefen
-- — se API.md, afsnit "Afvigelser" — som cacher hele finish()-svaret, så
-- POST /runs/:id/finish er ægte idempotent uden at genudregne badges/feats.
-- ---------------------------------------------------------------------------
CREATE TABLE forsoeg (
  id                    bigserial PRIMARY KEY,
  spiller_id            bigint NOT NULL REFERENCES spiller(id),
  runde_id              uuid NOT NULL UNIQUE,
  start_server          timestamptz NOT NULL,
  slut_server           timestamptz,
  runde1                integer,
  runde2                integer,
  runde3                integer,
  samlet                integer,
  stats                 jsonb,
  bf                    boolean NOT NULL DEFAULT false,
  duel                  jsonb,
  spilletid_klient_ms   integer,
  spilletid_server_ms   integer,
  status                text NOT NULL DEFAULT 'aktiv' CHECK (status IN ('aktiv', 'godkendt', 'afvist', 'udloebet')),
  afvist_aarsag         text,
  spilversion           text,
  ip                    inet,
  oprettet              timestamptz NOT NULL DEFAULT now(),
  resultat              jsonb
);

CREATE INDEX forsoeg_spiller_idx ON forsoeg (spiller_id);
CREATE INDEX forsoeg_status_idx ON forsoeg (status);
CREATE INDEX forsoeg_oprettet_idx ON forsoeg (oprettet);

-- ---------------------------------------------------------------------------
-- raffle_draws: log over lodtrækninger (admin-udtrukne vindere).
-- ---------------------------------------------------------------------------
CREATE TABLE raffle_draws (
  id                      bigserial PRIMARY KEY,
  kort_navn               text NOT NULL,
  spiller_id              bigint REFERENCES spiller(id),
  spiller_navn_snapshot   text,
  email_snapshot          text,
  tidspunkt               timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- admin_session: server-side admin-sessioner (HttpOnly-cookie -> token_hash).
-- ---------------------------------------------------------------------------
CREATE TABLE admin_session (
  id            uuid PRIMARY KEY,
  token_hash    text NOT NULL UNIQUE,
  oprettet      timestamptz NOT NULL DEFAULT now(),
  udloeber      timestamptz NOT NULL,
  sidst_brugt   timestamptz NOT NULL DEFAULT now()
);
