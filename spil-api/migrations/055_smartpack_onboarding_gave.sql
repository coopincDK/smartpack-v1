-- 055_smartpack_onboarding_gave.sql
-- SmartPacks ekstra gave til præmiepuljen (Martin, 7. okt. 2026), som en ekstra partner, så
-- SmartPack står to gange: den eksisterende SmartPack-partner (uændret) og "SmartPack Onboarding".
-- Gave: standard-onboarding til op til 60.000 kr. ekskl. moms inkl. minimum 4 dage onsite og
-- fri support til 2 superbrugere. Særligt komplekse opsætninger kan koste ekstra.
-- Profil, kontakt og logo kopieres fra SmartPack-partneren. Ingen power-up og ingen
-- nyhedsliste (samtykkelisten styres af config.mailPartners og ændres ikke).
-- Sidste frist (30.06.2027) er sat som for de øvrige gaver.
INSERT INTO partner (id, slug, status, vist_i_spil, navn, firmanavn, cvr, adresse, hjemmeside,
                     kort_beskrivelse, produktkategori, privatlivspolitik, afmeld_email,
                     kontakt_navn, kontakt_email, kontakt_telefon, levering_navn, levering_email,
                     giver_praemie, praemie_titel, praemie_beskrivelse, praemie_vaerdi, praemie_vaerdi_type, praemie_moms,
                     praemie_betingelser, praemie_ikke_med, praemie_indloesning, praemie_sidste_frist, praemie_flyt,
                     logo, logo_type)
SELECT gen_random_uuid(), 'smartpack-onboarding', 'aktiv', true, 'SmartPack Onboarding', s.firmanavn, s.cvr, s.adresse, s.hjemmeside,
       'Onboarding på SmartPack WMS med integrationer, onsite-dage og support til jeres superbrugere.',
       s.produktkategori, s.privatlivspolitik, s.afmeld_email,
       'Martin René Mortensen', 'mrm@smartpack.dk', '23 24 75 08', 'Martin René Mortensen', 'mrm@smartpack.dk',
       true, 'SmartPack-onboarding, værdi op til 60.000 kr.',
       'Vinderen får en standard-onboarding på SmartPack WMS med de integrationer, vi tilbyder (se smartpack.dk/integrationer), inkl. minimum 4 dage onsite hos jer og fri support til 2 superbrugere.',
       60000, 'op_til', 'ekskl',
       'Op til 60.000 kr. ekskl. moms, som dækker onboardingen inkl. minimum 4 dage onsite og fri support til 2 superbrugere. Vinderen får hele værdien ved en fuld standard-onboarding. Kan ikke udbetales kontant.',
       'Gaven dækker en standard-opsætning. Særligt komplekse opsætninger, fx flere fysiske lagre, flere fysiske butikker eller anden kompleksitet ud over det normale, kan koste ekstra efter aftale.',
       'Vinderen kontakter Martin René Mortensen på mrm@smartpack.dk eller 23 24 75 08.',
       DATE '2027-06-30', 'nej',
       s.logo, s.logo_type
  FROM partner s
 WHERE (s.slug = 'smartpack' OR lower(s.navn) = 'smartpack')
   AND NOT EXISTS (SELECT 1 FROM partner p WHERE p.slug = 'smartpack-onboarding')
 LIMIT 1;
