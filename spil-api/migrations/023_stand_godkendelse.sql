-- 023_stand_godkendelse.sql
-- Log over hver godkendelse via standens QR-kode (POST /me/stand), så SmartPack
-- kan dokumentere, hvem der blev godkendt, hvornår og fra hvilken enhed, og
-- gennemgå godkendelserne før lodtrækningen (GET /admin/konkurrence/stand-godkendelser).

CREATE TABLE IF NOT EXISTS stand_godkendelse (
  id          bigserial PRIMARY KEY,
  tidspunkt   timestamptz NOT NULL DEFAULT now(),
  spiller_id  bigint REFERENCES spiller(id) ON DELETE SET NULL,
  firma       text NOT NULL,
  firma_noegle text NOT NULL,
  ny_paa_listen boolean NOT NULL,
  ip          text,
  user_agent  text
);
CREATE INDEX IF NOT EXISTS stand_godkendelse_tid_idx ON stand_godkendelse (tidspunkt DESC);
