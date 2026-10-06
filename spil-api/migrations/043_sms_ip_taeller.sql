-- 043_sms_ip_taeller.sql
-- Sms-tilmeldinger pr. IP pr. time. Taelleren opdateres atomisk (INSERT ... ON CONFLICT
-- DO UPDATE ... WHERE antal < graense), saa samtidige kald ikke kan slippe forbi.
-- Ny tabel, roerer ingen eksisterende data.
CREATE TABLE IF NOT EXISTS sms_ip_taeller (
  ip      text NOT NULL,
  vindue  timestamptz NOT NULL,
  antal   integer NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, vindue)
);
