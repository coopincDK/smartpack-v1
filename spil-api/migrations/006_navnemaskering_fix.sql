-- 006_navnemaskering_fix.sql
-- Tredje opfølgende ændringsrunde — se API.md, afsnittet med samme navn.
--
-- forsoeg.duel.vs var hidtil ren klient-fritekst uden nogen serverside-
-- verifikation mod den faktiske modstander (kun `vs_spiller_id`, hvis sat,
-- var autoritativ — udelukkende brugt ved GDPR-anonymisering, aldrig ved
-- selve visningen). En spiller kunne dermed indsende et vilkårligt navn her.
--
-- Denne engangs-datarettelse retter EKSISTERENDE rækker, hvor vi allerede
-- kender den faktiske modstander (`vs_spiller_id` peger på en spiller der
-- stadig findes), så snapshottet (`duel.vs`) matcher spillerens RIGTIGE navn
-- — samme regel som src/routes/runs.js nu håndhæver for NYE forsøg.
-- Idempotent: kører man den igen, er WHERE-betingelsen allerede falsk for de
-- rækker den lige har rettet.
--
-- Rører IKKE rækker uden `vs_spiller_id` (intet at verificere imod — det
-- kendte, accepterede navnematch-faldback for netop DEM er uændret, se
-- API.md, "Sletning og anonymisering").
UPDATE forsoeg f
SET duel = jsonb_set(f.duel, '{vs}', to_jsonb(s.navn))
FROM spiller s
WHERE f.duel ? 'vs_spiller_id'
  AND f.duel->>'vs_spiller_id' IS NOT NULL
  AND (f.duel->>'vs_spiller_id')::bigint = s.id
  AND f.duel->>'vs' IS DISTINCT FROM s.navn;
