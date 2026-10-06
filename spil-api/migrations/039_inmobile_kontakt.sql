-- 039_inmobile_kontakt.sql
-- InMobiles kontaktperson til Packrush (6. okt. 2026): Søren Guldager, sales@inmobile.com (intet mobilnummer).
UPDATE partner
   SET kontakt_navn = 'Søren Guldager',
       kontakt_email = 'sales@inmobile.com',
       levering_navn = 'Søren Guldager',
       levering_email = 'sales@inmobile.com',
       opdateret = now()
 WHERE lower(navn) = 'inmobile';

-- Sandheds kontaktperson (6. okt. 2026): Lasse Ran Carlsen (mail indtil videre hello@sandhed.com).
UPDATE partner
   SET kontakt_navn = 'Lasse Ran Carlsen',
       levering_navn = 'Lasse Ran Carlsen',
       opdateret = now()
 WHERE slug = 'sandhed';
