-- 057_nej_tak.sql
-- Log over "Nej tak" i tilmeldingsboksen (Martin 8/10 2026). Valget står kun i dagens flueben
-- (spiller.tick_keys), som nulstilles hver dag, så hver dag med "Nej tak" gemmes her til
-- tilmeldingsoversigten (i dag og i alt). Det er ikke et samtykke og logges ikke i samtykke.
CREATE TABLE IF NOT EXISTS nej_tak (
  spiller_id bigint NOT NULL REFERENCES spiller(id) ON DELETE CASCADE,
  dag        text NOT NULL,
  tidspunkt  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (spiller_id, dag)
);
