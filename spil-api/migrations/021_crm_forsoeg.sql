-- 021_crm_forsoeg.sql
-- Forsøgstæller pr. række, så en række, som CRM'et afviser, aldrig kan holde
-- synkroniseringen fast: efter 3 forsøg (med pause imellem) springes den over, og
-- gyldige rækker bagved sendes videre. crm_synk.pause_til er en pause for hele
-- jobbet, når mange rækker afvises i samme kørsel (sandsynligvis opsætningen).
-- Sikker på en DB med data: kun nullable kolonner uden default.

ALTER TABLE samtykke ADD COLUMN IF NOT EXISTS crm_forsoeg integer;
ALTER TABLE samtykke ADD COLUMN IF NOT EXISTS crm_naeste_forsoeg timestamptz;
ALTER TABLE crm_udbakke ADD COLUMN IF NOT EXISTS crm_forsoeg integer;
ALTER TABLE crm_udbakke ADD COLUMN IF NOT EXISTS crm_naeste_forsoeg timestamptz;
ALTER TABLE crm_synk ADD COLUMN IF NOT EXISTS pause_til timestamptz;
