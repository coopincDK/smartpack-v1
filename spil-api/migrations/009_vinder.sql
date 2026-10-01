-- 009_vinder.sql
-- Vinderen af konkurrencen kan vises på præmieoversigten (/spil/praemier/).
-- Udfyldes af admin i partneradmin under "Konkurrence og tekster".
-- Vises kun, når vinder_navn er udfyldt.
ALTER TABLE konkurrence
  ADD COLUMN vinder_navn  text NOT NULL DEFAULT '',
  ADD COLUMN vinder_firma text NOT NULL DEFAULT '',
  ADD COLUMN vinder_dato  date,
  ADD COLUMN vinder_tekst text NOT NULL DEFAULT '';
