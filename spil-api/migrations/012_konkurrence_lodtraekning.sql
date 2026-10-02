-- 012_konkurrence_lodtraekning.sql
-- Præmiekonkurrencen på E-handelskonferencen 8/10 2026, som beskrevet i
-- deltagervilkårene (/spil/vilkaar/, pkt. 2 og 5-7):
--  - kun firmaer på Dansk Erhvervs deltagerliste kan vinde
--  - kun spil gennemført i spilperioden tæller (8/10 kl. 8.00-16.30)
--  - firmaet får 1 lod pr. påbegyndte 500 point i firmaets BEDSTE spil
--  - vinderen trækkes tilfældigt blandt lodderne, og trækningen dokumenteres
--
-- Deltagerlisten gemmes KUN som firmanavne (ingen personer), og matches på
-- firmanøglen (src/rules/firmKey.js), samme nøgle som firmakampen bruger.

CREATE TABLE deltagerliste_firma (
  id           bigserial PRIMARY KEY,
  firma        text NOT NULL,
  firma_noegle text NOT NULL,
  kilde        text NOT NULL DEFAULT 'import',   -- 'import' eller 'manuel'
  oprettet     timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX deltagerliste_firma_noegle_unik ON deltagerliste_firma (firma_noegle);

ALTER TABLE konkurrence ADD COLUMN spil_start timestamptz;
ALTER TABLE konkurrence ADD COLUMN spil_slut timestamptz;
ALTER TABLE konkurrence ADD COLUMN point_pr_lod integer NOT NULL DEFAULT 500 CHECK (point_pr_lod > 0);
-- Firmanøgler, der aldrig kan vinde (arrangøren selv).
ALTER TABLE konkurrence ADD COLUMN udelukkede_firmaer text NOT NULL DEFAULT 'smartpack';

UPDATE konkurrence SET
  spil_start   = COALESCE(spil_start, '2026-10-08 08:00:00+02'),
  spil_slut    = COALESCE(spil_slut, '2026-10-08 16:30:00+02'),
  lodtraekning = COALESCE(lodtraekning, '2026-10-08 16:45:00+02')
WHERE id = 1;

-- Dokumentation af hver trækning: hele grundlaget (alle firmaer med lodder),
-- det tilfældige tal og resultatet, så trækningen kan genskabes og vises.
CREATE TABLE konkurrence_traekning (
  id                    bigserial PRIMARY KEY,
  tidspunkt             timestamptz NOT NULL DEFAULT now(),
  admin_session_id      text,
  spil_start            timestamptz NOT NULL,
  spil_slut             timestamptz NOT NULL,
  point_pr_lod          integer NOT NULL,
  deltagerliste_antal   integer NOT NULL,
  grundlag              jsonb NOT NULL,      -- [{firma, firma_noegle, bedste, lodder, fra, til}]
  lodder_i_alt          integer NOT NULL,
  tilfaeldigt_tal       integer NOT NULL,    -- 0 .. lodder_i_alt-1, fra crypto.randomInt
  vinder_firma          text NOT NULL,
  vinder_firma_noegle   text NOT NULL,
  vinder_spiller_id     bigint REFERENCES spiller(id) ON DELETE SET NULL,
  vinder_navn_snapshot  text,
  vinder_email_snapshot text
);
