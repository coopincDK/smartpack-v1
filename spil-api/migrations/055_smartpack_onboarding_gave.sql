-- 055_smartpack_onboarding_gave.sql
-- SmartPacks egen gave til præmiepuljen (Martin, 7. okt. 2026): standard-onboarding til
-- op til 60.000 kr. ekskl. moms inkl. minimum 4 dage onsite og fri support til 2 superbrugere.
-- Særligt komplekse opsætninger kan koste ekstra. Sidste frist (30.06.2027) er sat som for
-- de øvrige gaver.
UPDATE partner
   SET giver_praemie = true,
       praemie_titel = 'SmartPack-onboarding, værdi op til 60.000 kr.',
       praemie_beskrivelse = 'Vinderen får en standard-onboarding på SmartPack WMS med de integrationer, vi tilbyder (se smartpack.dk/integrationer), inkl. minimum 4 dage onsite hos jer og fri support til 2 superbrugere.',
       praemie_vaerdi = 60000,
       praemie_vaerdi_type = 'op_til',
       praemie_moms = 'ekskl',
       praemie_betingelser = 'Op til 60.000 kr. ekskl. moms, som dækker onboardingen inkl. minimum 4 dage onsite og fri support til 2 superbrugere. Vinderen får hele værdien ved en fuld standard-onboarding. Kan ikke udbetales kontant.',
       praemie_ikke_med = 'Gaven dækker en standard-opsætning. Særligt komplekse opsætninger, fx flere fysiske lagre, flere fysiske butikker eller anden kompleksitet ud over det normale, kan koste ekstra efter aftale.',
       praemie_indloesning = 'Vinderen kontakter Martin René Mortensen på mrm@smartpack.dk eller 23 24 75 08.',
       praemie_sidste_frist = DATE '2027-06-30',
       opdateret = now()
 WHERE slug = 'smartpack' OR lower(navn) = 'smartpack';
