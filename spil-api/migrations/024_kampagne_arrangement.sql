-- 024_kampagne_arrangement.sql
-- Lukkede arrangementer: hvert arrangement (E-handelskonferencen, Digi Day,
-- Ehandelsdagen ...) får sin egen hemmelige QR-kode til smartpack.dk/messe?a=<kode>.
-- En tilmelding med en gyldig kode inden for arrangementets tidsrum markeres som
-- bekræftet deltager på netop det arrangement (arrangement_id + verificeret_tid).
-- Tilmeldinger uden gyldig kode gemmes stadig, men er ikke bekræftede.

CREATE TABLE IF NOT EXISTS kampagne_arrangement (
  id          bigserial PRIMARY KEY,
  kampagne    text NOT NULL,
  navn        text NOT NULL,
  kilde       text NOT NULL,
  kode        text NOT NULL UNIQUE,
  gyldig_fra  timestamptz NOT NULL,
  gyldig_til  timestamptz NOT NULL,
  oprettet    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kampagne_tilmelding ADD COLUMN IF NOT EXISTS arrangement_id bigint REFERENCES kampagne_arrangement(id);
ALTER TABLE kampagne_tilmelding ADD COLUMN IF NOT EXISTS verificeret_tid timestamptz;

-- De to kendte arrangementer (hele dagen, dansk tid). Digi Day oprettes i admin,
-- når datoen er fastlagt.
INSERT INTO kampagne_arrangement (kampagne, navn, kilde, kode, gyldig_fra, gyldig_til)
SELECT 'ehandelsdagen-2027', 'E-handelskonferencen 2026', 'ehandelskonferencen', substr(md5(random()::text || clock_timestamp()::text), 1, 16),
       TIMESTAMPTZ '2026-10-08 00:00 Europe/Copenhagen', TIMESTAMPTZ '2026-10-08 23:59 Europe/Copenhagen'
WHERE NOT EXISTS (SELECT 1 FROM kampagne_arrangement WHERE kilde = 'ehandelskonferencen');

INSERT INTO kampagne_arrangement (kampagne, navn, kilde, kode, gyldig_fra, gyldig_til)
SELECT 'ehandelsdagen-2027', 'Ehandelsdagen 2027', 'ehandelsdagen', substr(md5(random()::text || clock_timestamp()::text), 1, 16),
       TIMESTAMPTZ '2027-02-11 00:00 Europe/Copenhagen', TIMESTAMPTZ '2027-02-11 23:59 Europe/Copenhagen'
WHERE NOT EXISTS (SELECT 1 FROM kampagne_arrangement WHERE kilde = 'ehandelsdagen');
