-- 046_active_promotion_gave.sql
-- Active Promotions gave (Victor Ellegaard Klitmøller, 7. okt. 2026): 5 bøtter Pure Greens og
-- 5 bøtter Pure Sleep, værdi 3.540 kr. ekskl. moms. Lægges i præmiepuljen som én gave til det vindende firma.
-- Fordel til alle spillere: 25 % med koden E-Konferencen25 til og med 11/10-2026 kl. 23.59.
UPDATE partner
   SET giver_praemie = true,
       praemie_titel = '5 Pure Greens og 5 Pure Sleep',
       praemie_beskrivelse = 'Vinderen får 5 bøtter Pure Greens, der giver mere energi til hverdagen, og 5 bøtter Pure Sleep for bedre søvn om natten. Nok til at dele ud til kollegerne.',
       praemie_vaerdi = 3540,
       praemie_vaerdi_type = 'fast',
       praemie_moms = 'ekskl',
       praemie_indloesning = 'Vinderen skriver til vek@rebuiltperformance.dk.',
       praemie_sidste_frist = DATE '2026-12-31',
       kontakt_navn = CASE WHEN kontakt_navn = '' OR kontakt_navn ILIKE 'victor%' THEN 'Victor Ellegaard Klitmøller' ELSE kontakt_navn END,
       fordel_rabat = '25 % rabat',
       fordel_ydelse = 'Pure Greens, Pure Sleep og resten af sortimentet hos Rebuilt Performance (rebuiltperformance.dk).',
       fordel_koebskrav = 'Brug rabatkoden E-Konferencen25. Gælder til og med søndag 11. oktober 2026 kl. 23.59.',
       fordel_gyldig_til = DATE '2026-10-11',
       opdateret = now()
 WHERE lower(navn) = 'active promotion';
