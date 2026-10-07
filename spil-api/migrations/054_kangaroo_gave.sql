-- 054_kangaroo_gave.sql
-- Kangaroo Robotics' gave (Andreas Stensig, bekræftet på sms 7. okt. 2026 kl. 22.52): de første
-- måneders robotabonnement gratis, op til 25.000 kr. ekskl. moms, modregnet fra første måned.
-- Alternativt som rabat i købsprisen. Fordel til alle andre: 10 % rabat på et robotabonnement.
-- Sidste frist (30.06.2027) er sat som for de øvrige gaver og skal bekræftes med Kangaroo.
UPDATE partner
   SET giver_praemie = true,
       praemie_titel = 'Robotabonnement hos Kangaroo Robotics gratis, op til 25.000 kr.',
       praemie_beskrivelse = 'Vinderen får de første måneders robotabonnement hos Kangaroo Robotics gratis, op til 25.000 kr. ekskl. moms. Robotterne automatiserer pluk og intern transport på lageret.',
       praemie_vaerdi = 25000,
       praemie_vaerdi_type = 'op_til',
       praemie_moms = 'ekskl',
       praemie_betingelser = 'Op til 25.000 kr. ekskl. moms, som modregnes i abonnementet fra første måned, indtil beløbet er brugt. Køber vinderen robotterne i stedet, gives beløbet som rabat i købsprisen. Kan ikke udbetales kontant.',
       praemie_indloesning = 'Vinderen kontakter Andreas Stensig fra Kangaroo Robotics på 30 22 31 24.',
       praemie_sidste_frist = DATE '2027-06-30',
       kontakt_navn = CASE WHEN kontakt_navn = '' THEN 'Andreas Stensig' ELSE kontakt_navn END,
       fordel_rabat = '10 % rabat',
       fordel_ydelse = 'Robotabonnement fra Kangaroo Robotics',
       fordel_koebskrav = 'Tegn et robotabonnement hos Kangaroo Robotics.',
       opdateret = now()
 WHERE regexp_replace(lower(navn), '[^a-z0-9æøå]', '', 'g') = 'kangaroorobotics';
