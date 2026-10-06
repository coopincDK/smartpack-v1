-- 030_efteraar.sql
-- Packrush Efterårsferieudfordring 2026: åben, gratis konkurrence, helt adskilt fra
-- messe-turneringen (egne lodder, egen vinder, egen log). Se src/efteraar.js og
-- /spil/efteraar/. Hver trækning gemmes med grundlag, tilfældigt tal og reserver.

CREATE TABLE IF NOT EXISTS efteraar_traekning (
  id               bigserial PRIMARY KEY,
  tidspunkt        timestamptz NOT NULL DEFAULT now(),
  type             text NOT NULL CHECK (type IN ('lod', 'top')),
  admin_session_id text,
  grundlag         jsonb NOT NULL,
  lodder_i_alt     integer NOT NULL,
  tilfaeldigt_tal  integer,
  vinder_spiller_id bigint,
  vinder_navn      text,
  vinder_email     text,
  reserver         jsonb NOT NULL DEFAULT '[]'::jsonb
);
