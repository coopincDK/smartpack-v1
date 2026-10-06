-- 034_smartpack_fordel.sql
-- SmartPacks fordel til alle spillere (6. okt. 2026): 2 håndterminaler med pistolgreb
-- og dockingstation med i onboardingen, når den aftales i resten af 2026.
-- Produkt: Håndterminal PDA Scanner 6.0 Android 13 inkl. pistolgreb og docking (2D),
-- 4.799,20 kr. ekskl. moms pr. stk. hos MundFrisk.dk.

UPDATE partner
   SET fordel_ydelse = 'SmartPack-onboarding: 2 håndterminaler (PDA-scanner 6.0, Android 13, inkl. pistolgreb og dockingstation) med i købet',
       fordel_rabat = '2 håndterminaler med pistolgreb, værdi 9.598 kr. ekskl. moms',
       fordel_koebskrav = 'Gælder nye onboardinger, der aftales i resten af 2026, ikke allerede aftalte. Nævn koden "2xpistol", når I taler med os.',
       fordel_gyldig_til = DATE '2026-12-31',
       opdateret = now()
 WHERE slug = 'smartpack' OR lower(navn) = 'smartpack';
