-- 048_sandhed_adresse.sql
-- Ret: Sandheds adresse indeholdt postnummeret "GZR 1401". Et frit 4-cifret tal tolkes som et
-- dansk postnummer, så partneren blev regnet som dansk uden CVR og skjult. Adressen skrives nu,
-- så den slutter med landet og ikke har et frit 4-cifret tal.
UPDATE partner
   SET adresse = 'Sandhed Group Ltd (reg.nr. C116249, VAT MT33018730), Unit S140, SOHO The Strand, Fawwara Building, Triq L-Imsida, Gzira GZR1401, Malta',
       opdateret = now()
 WHERE slug = 'sandhed';
