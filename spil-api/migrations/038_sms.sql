-- 038_sms.sql
-- Sms via inMobile (afsender "Packrush" i prøveperioden). Kun til spillere med
-- telefonnummer OG aktivt sms-samtykke. Hver sms logges; (type, noegle) er unik,
-- så samme besked aldrig sendes to gange. time_vinder gemmer timens boss pr. time
-- på konferencedagen (én time pr. spiller pr. dag).

CREATE TABLE IF NOT EXISTS sms_log (
  id          bigserial PRIMARY KEY,
  tidspunkt   timestamptz NOT NULL DEFAULT now(),
  type        text NOT NULL,
  noegle      text NOT NULL,
  spiller_id  bigint REFERENCES spiller(id) ON DELETE SET NULL,
  til         text NOT NULL,
  tekst       text NOT NULL,
  status      text NOT NULL DEFAULT 'afventer',
  fejl        text
);
CREATE UNIQUE INDEX IF NOT EXISTS sms_log_unik ON sms_log (type, noegle);
CREATE INDEX IF NOT EXISTS sms_log_tid ON sms_log (tidspunkt DESC);

CREATE TABLE IF NOT EXISTS time_vinder (
  dag         date NOT NULL,
  time        integer NOT NULL,
  spiller_id  bigint REFERENCES spiller(id) ON DELETE SET NULL,
  navn        text,
  score       integer,
  oprettet    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (dag, time)
);
