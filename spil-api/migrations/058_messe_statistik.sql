-- Tael hvad der sker paa messestanden: hvert scan af en QR, og hver gang
-- nogen sender booking-formularen. Een raekke pr. haendelse, saa vi bagefter
-- kan dele op paa dag, case og slags uden at have besluttet det paa forhaand.
CREATE TABLE IF NOT EXISTS messe_haendelse (
  id       bigserial PRIMARY KEY,
  slags    text NOT NULL,            -- 'scan' | 'lead' | 'ordre'
  case_id  text,
  tid      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messe_haendelse_tid_idx   ON messe_haendelse (tid DESC);
CREATE INDEX IF NOT EXISTS messe_haendelse_slags_idx ON messe_haendelse (slags, case_id);
