-- 007_token_ttl.sql
-- Fjerde opfølgende ændringsrunde (afsluttende review), N9 — se API.md.
--
-- Bearer-tokens (spiller_token) udløb hidtil ALDRIG: et token der én gang
-- var udstedt, var gyldigt for evigt, og der fandtes intet spiller-logout-
-- endpoint. Rettet i applikationskoden (ingen nye KOLONNER nødvendige —
-- `sidst_brugt`/`tilbagekaldt` fandtes allerede, se
-- migrations/005_opfoelgning2.sql):
--   - src/spillerToken.js#loadPlayerByToken afviser nu et token der ikke
--     har været BRUGT inden for TTL'en (config.playerTokenTtlMs, default 30
--     dage), ikke kun et allerede tilbagekaldt.
--   - POST /me/logout (src/routes/me.js) tilbagekalder ÉT enkelt token.
--   - Det eksisterende natlige job (scripts/retention-job.js) rydder
--     (markerer tilbagekaldt) tokens der er udløbet, se
--     src/retention.js#revokeExpiredTokens.
--
-- Denne migration tilføjer KUN et understøttende index: både TTL-tjekket
-- ved hver eneste autentificering OG den natlige oprydning filtrerer på
-- "ikke allerede tilbagekaldt" + "sidst_brugt", som ellers ville kræve et
-- fuldt scan af spiller_token efterhånden som tabellen vokser. Et PARTIELT
-- index (kun uafsluttede/ikke-tilbagekaldte tokens) holder det lille og
-- relevant for netop de forespørgsler.
CREATE INDEX spiller_token_aktiv_sidst_brugt_idx
  ON spiller_token (sidst_brugt)
  WHERE tilbagekaldt IS NULL;
