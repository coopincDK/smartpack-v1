-- 018_kampagne_crm.sql
-- Kampagnetilmeldinger sendes videre til SmartPacks CRM
-- (POST https://crm.smartpack.dk/api/v1/newsletter). Kolonnerne holder styr
-- på, om rækken er nået frem, så manglende kan sendes igen fra admin.

ALTER TABLE kampagne_tilmelding ADD COLUMN IF NOT EXISTS crm_sendt timestamptz;
ALTER TABLE kampagne_tilmelding ADD COLUMN IF NOT EXISTS crm_fejl text;
