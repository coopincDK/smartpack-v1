-- 014_admin_brugere.sql
-- Flere personlige admin-logins for SmartPack-medarbejdere (kun
-- @smartpack.dk). En admin opretter en anden med en startkode, som skal
-- skiftes ved første login (samme mønster som partner_bruger). Den fælles
-- admin-kode (admin_kode / ADMIN_PASSWORD_HASH) virker stadig som nødadgang.
CREATE TABLE admin_bruger (
  id               uuid PRIMARY KEY,
  email            text NOT NULL UNIQUE,      -- små bogstaver
  navn             text NOT NULL DEFAULT '',
  password_hash    text NOT NULL,
  skal_skifte_kode boolean NOT NULL DEFAULT true,
  aktiv            boolean NOT NULL DEFAULT true,
  pw_fejl          integer NOT NULL DEFAULT 0,
  spaerret_til     timestamptz,
  oprettet         timestamptz NOT NULL DEFAULT now(),
  sidst_login      timestamptz
);

ALTER TABLE admin_session ADD COLUMN bruger_id uuid REFERENCES admin_bruger(id) ON DELETE CASCADE;
