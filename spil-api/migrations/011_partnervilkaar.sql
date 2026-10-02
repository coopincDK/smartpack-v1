-- 011_partnervilkaar.sql
-- Partnervilkår v1 (2. okt. 2026, /spil/partnervilkaar/) og felterne i
-- partnerportalen (projektdokumentet packrush-tekster.md, afsnit 4).
--
-- Samtykke: spillerens samtykke til en partner gemmes fremover på listen
-- 'partner:<slug>' (partnerens faste id) i stedet for partnerens navn, og
-- med den fulde samtykketekst inkl. firmanavn og CVR i samtykke.tekst.

ALTER TABLE partner ADD COLUMN produktkategori      text NOT NULL DEFAULT '';  -- B1, fx "kundeservice-software"
ALTER TABLE partner ADD COLUMN privatlivspolitik    text NOT NULL DEFAULT '';  -- A12, https-link
ALTER TABLE partner ADD COLUMN afmeld_email         text NOT NULL DEFAULT '';  -- A11
ALTER TABLE partner ADD COLUMN levering_navn        text NOT NULL DEFAULT '';  -- A10
ALTER TABLE partner ADD COLUMN levering_email       text NOT NULL DEFAULT '';  -- A10
ALTER TABLE partner ADD COLUMN praemie_ikke_med     text NOT NULL DEFAULT '';  -- C7
ALTER TABLE partner ADD COLUMN praemie_sidste_frist date;                      -- C9
ALTER TABLE partner ADD COLUMN praemie_flyt         text NOT NULL DEFAULT 'spoerg'
  CHECK (praemie_flyt IN ('ja', 'nej', 'spoerg'));                              -- C12
ALTER TABLE partner ADD COLUMN fordel_ydelse        text NOT NULL DEFAULT '';  -- D1
ALTER TABLE partner ADD COLUMN fordel_rabat         text NOT NULL DEFAULT '';  -- D2
ALTER TABLE partner ADD COLUMN fordel_koebskrav     text NOT NULL DEFAULT '';  -- D3
ALTER TABLE partner ADD COLUMN fordel_gyldig_til    date;                      -- D4

-- E: partnerens accept af vilkår og erklæringer. Én række pr. accept, så
-- historikken bevares, hvis vilkårene kommer i en ny version.
CREATE TABLE partner_accept (
  id              bigserial PRIMARY KEY,
  partner_id      uuid NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
  bruger_id       uuid REFERENCES partner_bruger(id) ON DELETE SET NULL,
  bruger_email    text NOT NULL,
  vilkaar_version text NOT NULL,
  erklaeringer    jsonb NOT NULL,
  ip              text,
  tidspunkt       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_accept_partner_idx ON partner_accept (partner_id, tidspunkt DESC);

-- Log over hver CSV-download af leads (partnervilkår pkt. 7).
CREATE TABLE partner_lead_download (
  id           bigserial PRIMARY KEY,
  partner_id   uuid NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
  bruger_id    uuid REFERENCES partner_bruger(id) ON DELETE SET NULL,
  bruger_email text NOT NULL,
  antal        integer NOT NULL,
  fil_id       text NOT NULL,
  ip           text,
  tidspunkt    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_lead_download_partner_idx ON partner_lead_download (partner_id, tidspunkt DESC);
