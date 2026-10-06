-- 041_var.sql
-- VAR-tjek: et spil, der ser automatiseret ud (fx 52 perfekte kasser i træk eller
-- pluk på under et sekund), får status 'var' i stedet for at komme på tavlen.
-- Spilleren kan anmode om et VAR-tjek, og arrangøren godkender eller afviser.
ALTER TABLE forsoeg DROP CONSTRAINT IF EXISTS forsoeg_status_check;
ALTER TABLE forsoeg ADD CONSTRAINT forsoeg_status_check
  CHECK (status IN ('aktiv', 'godkendt', 'afvist', 'udloebet', 'opgivet', 'var'));
ALTER TABLE forsoeg ADD COLUMN IF NOT EXISTS var_grunde text;
ALTER TABLE forsoeg ADD COLUMN IF NOT EXISTS var_status text;   -- flag | anmodet | godkendt | afvist
ALTER TABLE forsoeg ADD COLUMN IF NOT EXISTS var_besked text;
ALTER TABLE forsoeg ADD COLUMN IF NOT EXISTS var_anmodet timestamptz;
ALTER TABLE forsoeg ADD COLUMN IF NOT EXISTS var_afgjort timestamptz;
