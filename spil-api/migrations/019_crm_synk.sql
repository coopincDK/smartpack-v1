-- 019_crm_synk.sql
-- Packrush-spillernes ja/nej til SmartPacks nyhedsmails (samtykke-listen
-- 'smartpack') sendes løbende til SmartPacks CRM af src/crmSynk.js.
-- crm_synk husker, hvor langt i samtykke-loggen vi er nået, så intet sendes
-- to gange, og intet går tabt, hvis CRM'et er nede. Starter på 0, så også
-- de spillere, der allerede har sagt ja, kommer med.

CREATE TABLE IF NOT EXISTS crm_synk (
  navn       text PRIMARY KEY,
  sidste_id  bigint NOT NULL DEFAULT 0,
  opdateret  timestamptz NOT NULL DEFAULT now(),
  seneste_fejl text
);

INSERT INTO crm_synk (navn) VALUES ('samtykke_smartpack') ON CONFLICT DO NOTHING;
