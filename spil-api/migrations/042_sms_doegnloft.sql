-- 042_sms_doegnloft.sql
-- Noedloft paa sms pr. doegn (Europe/Copenhagen). Taelleren er en raekke pr. dag,
-- som send() opdaterer atomisk (INSERT ... ON CONFLICT DO UPDATE ... WHERE), saa to
-- parallelle jobs ikke kan overskride loftet. Ingen eksisterende data roeres.
CREATE TABLE IF NOT EXISTS sms_taeller (
  dag      date PRIMARY KEY,
  antal    integer NOT NULL DEFAULT 0,
  aabning  integer NOT NULL DEFAULT 0
);
