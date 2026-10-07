-- 049_partner_glemt_kode.sql
-- Selvbetjent nulstilling af partnerkode (Martin 7/10 2026): partneren skriver sit
-- mobilnummer og får et engangslink på sms (gyldigt i 30 min.). Kun linkets SHA-256 gemmes.
ALTER TABLE partner_bruger ADD COLUMN IF NOT EXISTS telefon text;
ALTER TABLE partner_bruger ADD COLUMN IF NOT EXISTS nulstil_hash text;
ALTER TABLE partner_bruger ADD COLUMN IF NOT EXISTS nulstil_udloeber timestamptz;
CREATE INDEX IF NOT EXISTS partner_bruger_telefon_idx ON partner_bruger (telefon);
