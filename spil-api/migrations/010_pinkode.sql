-- 010_pinkode.sql
-- Packrush-beslutning 2. okt. 2026: spillet indsamler ikke længere
-- telefonnummer (deltagervilkår pkt. 4 og 11). Telefonnummeret var hidtil
-- spillerens "anden faktor" ved login fra en ny enhed; det erstattes af en
-- 4-cifret pinkode, som spilleren selv vælger ved tilmelding.
--
--  - pin_hash: scrypt-hash af pinkoden (samme hash som admin-adgangskoden).
--    NULL for spillere oprettet før denne ændring; de kan stadig logge ind
--    med telefonnummeret, indtil standen nulstiller dem.
--  - pin_fejl / pin_spaerret_til: spærring pr. spiller efter 5 forkerte
--    pinkoder i træk (15 min.), så en 4-cifret kode ikke kan gættes.
--    Spærringen er pr. spiller og ikke pr. IP, fordi mange spillere logger
--    ind fra standens tablets på samme netværk.
--  - telefon bliver valgfri (NULL for nye spillere). Det unikke indeks
--    beholdes; Postgres tillader flere NULL'er i et UNIQUE-indeks.
--  - sms slås fra i den offentlige config (ingen sms-liste, ingen sms-boost).

ALTER TABLE spiller ADD COLUMN pin_hash text;
ALTER TABLE spiller ADD COLUMN pin_fejl integer NOT NULL DEFAULT 0;
ALTER TABLE spiller ADD COLUMN pin_spaerret_til timestamptz;
ALTER TABLE spiller ALTER COLUMN telefon DROP NOT NULL;

UPDATE config
SET offentlig = jsonb_set(jsonb_set(offentlig, '{smsOn}', 'false'::jsonb), '{smsBoost}', 'false'::jsonb)
WHERE id = 1;
