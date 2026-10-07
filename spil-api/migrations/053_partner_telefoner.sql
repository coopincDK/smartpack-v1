-- 053_partner_telefoner.sql
-- Kontaktpersonens telefon (7. okt. 2026), så login-sms'en til alle partnere
-- også når dem. Skrives KUN, hvor feltet er tomt, så numre rettet i
-- partneradmin bevares. Navne matches uden mellemrum og tegn
-- ("E-handelsdagen" = "ehandelsdagen").
UPDATE partner p
   SET kontakt_telefon = v.tlf, opdateret = now()
  FROM (VALUES
    ('theboardroom',     '+45 28 87 85 00'),
    ('herodesk',         '+45 53 81 07 19'),
    ('clarefy',          '22 79 29 14'),
    ('ehandelsdagen',    '22 25 93 02'),
    ('rielands',         '24 47 25 02'),
    ('kangaroorobotics', '30 22 31 24'),
    ('activepromotion',  '42 36 05 04'),
    ('revershero',       '61 33 02 61'),
    ('smartpack',        '23 24 75 08')
  ) AS v(noegle, tlf)
 WHERE regexp_replace(lower(p.navn), '[^a-z0-9æøå]', '', 'g') = v.noegle
   AND btrim(p.kontakt_telefon) = '';
