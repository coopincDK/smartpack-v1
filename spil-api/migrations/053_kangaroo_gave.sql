-- 053_kangaroo_gave.sql
-- Kangaroo Robotics (7. okt. 2026): gratis robotabonnement op til 25.000 kr. til vinderfirmaet,
-- og 10 % rabat til alle andre spillere.
UPDATE partner
   SET giver_praemie = true,
       praemie_titel = 'Gratis robotabonnement fra Kangaroo, op til 25.000 kr.',
       praemie_beskrivelse = 'Vinderfirmaet får de første måneder af et robotabonnement hos Kangaroo Robotics gratis, op til 25.000 kr. ekskl. moms. Robotterne automatiserer pluk og intern transport på lageret.',
       praemie_vaerdi = 25000,
       praemie_vaerdi_type = 'op_til',
       praemie_moms = 'ekskl',
       praemie_betingelser = 'Op til 25.000 kr. ekskl. moms, som modregnes i abonnementet fra første måned, indtil beløbet er brugt. Kan ikke udbetales kontant.',
       praemie_indloesning = 'Vinderen kontakter Andreas Stensig på andreas@kangaroo-robotics.com.',
       praemie_sidste_frist = DATE '2027-06-30',
       fordel_rabat = '10 % rabat',
       fordel_ydelse = 'på et robotabonnement fra Kangaroo Robotics',
       fordel_koebskrav = 'Gælder alle spillere, der sætter flueben ved Kangaroo Robotics. Nævn Packrush, når I kontakter Kangaroo.',
       opdateret = now()
 WHERE slug = 'kangaroo-robotics' OR lower(navn) = 'kangaroo robotics';
