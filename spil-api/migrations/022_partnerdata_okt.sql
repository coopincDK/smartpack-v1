-- 022_partnerdata_okt.sql
-- Partnerdata lagt ind via koden i stedet for partneradmin (5. okt. 2026):
-- 1) UNI-TROLL EUROPE: partnerfordel (10 % på alle vogne til og med 18/12-2026).
-- 2) De otte nye power-ups fra commit 4bf0e92c tildeles deres partner.
-- Rører kun felter, der er tomme, så noget, der allerede er rettet i admin,
-- ikke bliver overskrevet. Partnere findes på navn (som i admin).

UPDATE partner
   SET fordel_ydelse = 'Alle UNI-TROLL-vogne',
       fordel_rabat = '10 % rabat',
       fordel_koebskrav = 'Gælder køb af alle UNI-TROLL-vogne.',
       fordel_gyldig_til = DATE '2026-12-18',
       opdateret = now()
 WHERE lower(navn) IN ('uni-troll europe', 'uni-troll')
   AND fordel_rabat = '';

UPDATE partner p
   SET powerup = v.pu, opdateret = now()
  FROM (VALUES
    ('skancode', 'skancode'),
    ('smartpack', 'smartpack'),
    ('uni-troll europe', 'unitroll'),
    ('uni-troll', 'unitroll'),
    ('rielands', 'rielands'),
    ('sitesage', 'sitesage'),
    ('poetype', 'poetype'),
    ('zignifikant', 'zignifikant'),
    ('the boardroom', 'boardroom')
  ) AS v(navn, pu)
 WHERE lower(p.navn) = v.navn
   AND (p.powerup IS NULL OR p.powerup = '')
   AND NOT EXISTS (SELECT 1 FROM partner q WHERE q.powerup = v.pu);
