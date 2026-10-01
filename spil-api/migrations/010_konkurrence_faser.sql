-- 010_konkurrence_faser.sql
-- Konkurrencen styrer sig selv ud fra datoerne:
--   før start = kommende, start til lodtrækning = aktiv, efter = afsluttet.
-- Spillet viser kun vinder-, præmie- og lodtekster, mens konkurrencen er aktiv.
ALTER TABLE konkurrence ADD COLUMN start timestamptz;

-- En trukket vinder skal godkendes, før den vises. Afviste spillere kan ikke
-- trækkes igen i samme konkurrence.
ALTER TABLE raffle_draws
  ADD COLUMN status  text NOT NULL DEFAULT 'afventer' CHECK (status IN ('afventer', 'godkendt', 'afvist')),
  ADD COLUMN tickets integer;

-- Tidligere trækninger var endelige.
UPDATE raffle_draws SET status = 'godkendt';
