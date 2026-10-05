-- 017_kampagne_tilmelding.sql
-- Tilmeldinger fra kampagnesider uden for spillet, fx smartpack.dk/messe
-- (E-handelskonferencen og Digi Day). En tilmelding giver et fast antal
-- basislodder i en senere lodtrækning (fx Ehandelsdagen 2027), og lodder fra
-- Packrush lægges oveni via firmaet. Se src/routes/kampagne.js og API.md.
--
-- Én række pr. (kampagne, e-mail): tilmelder samme person sig igen, opdateres
-- rækken, og `kilder` samler alle de steder, personen har tilmeldt sig fra.

CREATE TABLE IF NOT EXISTS kampagne_tilmelding (
  id             bigserial PRIMARY KEY,
  kampagne       text NOT NULL,
  navn           text NOT NULL,
  klub           text,
  firma          text NOT NULL,
  firma_noegle   text,
  email          citext NOT NULL,
  telefon        text,
  ordrer         text,
  hvor           text,
  nyhedsbrev     boolean NOT NULL DEFAULT false,
  nyhedsbrev_tid timestamptz,
  samtykke_tekst text NOT NULL,
  kilde          text NOT NULL DEFAULT 'messe',
  kilder         text[] NOT NULL DEFAULT '{}',
  ip             inet,
  oprettet       timestamptz NOT NULL DEFAULT now(),
  opdateret      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kampagne, email)
);

CREATE INDEX IF NOT EXISTS kampagne_tilmelding_kampagne_idx ON kampagne_tilmelding (kampagne, oprettet DESC);
