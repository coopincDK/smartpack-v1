-- 013_admin_kode.sql
-- Admin kan selv skifte adgangskoden (POST /admin/skift-kode). Den nye kode
-- gemmes som scrypt-hash her og har forrang for ADMIN_PASSWORD_HASH i .env.
-- Findes der ingen række, bruges .env som hidtil. Vil man tilbage til .env-
-- koden (fx glemt kode), sletter man rækken direkte i databasen.
CREATE TABLE admin_kode (
  id            integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  password_hash text NOT NULL,
  opdateret     timestamptz NOT NULL DEFAULT now()
);
