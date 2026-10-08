-- 054_partner_telefoner.sql
-- Kendte mobilnumre på partnernes kontakter (Martin 7/10 2026), så "Glemt koden" og login-sms virker.
-- Kontakttelefonen udfyldes kun, hvor den er tom; brugerens eget nummer kun, hvor det mangler.
UPDATE partner SET kontakt_telefon = '+45 53 81 07 19', opdateret = now() WHERE slug = 'herodesk' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4553810719' WHERE lower(email) = 'jv@herodesk.com' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '22 79 29 14', opdateret = now() WHERE slug = 'clarefy' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4522792914' WHERE lower(email) = 'pls@clarefy.ai' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '22 25 93 02', opdateret = now() WHERE slug = 'ehandelsdagen' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4522252902' WHERE lower(email) = 'info@ehandelsdagen.dk' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '24 47 25 02', opdateret = now() WHERE slug = 'rielands' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4524472502' WHERE lower(email) = 'm@rielands.dk' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '30 22 31 24', opdateret = now() WHERE slug = 'kangaroo-robotics' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4530223124' WHERE lower(email) = 'andreas@kangaroo-robotics.com' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '+45 40 44 35 89', opdateret = now() WHERE slug = 'sandhed' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4540443589' WHERE lower(email) = 'hello@sandhed.com' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '26 31 44 44', opdateret = now() WHERE slug = 'sitesage' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4526314444' WHERE lower(email) = 'en@sitesage.ai' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '42 36 05 04', opdateret = now() WHERE slug = 'activepromotion' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4542360504' WHERE lower(email) = 'victor@activepromotion.dk' AND telefon IS NULL;
UPDATE partner SET kontakt_telefon = '61 33 02 61', opdateret = now() WHERE slug = 'revershero' AND COALESCE(kontakt_telefon, '') = '';
UPDATE partner_bruger SET telefon = '4561330261' WHERE lower(email) = 'jakob@reversio.io' AND telefon IS NULL;
-- SkanCode: Jens Peder Bach Jensens mobil (fra hans mailsignatur) i stedet for firmaets hovednummer.
UPDATE partner_bruger SET telefon = '4522221070' WHERE lower(email) = 'jp@skancode.dk';
-- The Boardroom: Morten Larsens mobil (fra hans mailsignatur).
UPDATE partner SET kontakt_telefon = '+45 28 87 85 00', opdateret = now() WHERE slug = 'the-boardroom' AND COALESCE(kontakt_telefon, '') = '';
