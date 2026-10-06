-- 035_sandhed_vaerdi.sql
-- Sandhed: 10 x 6 måneders adgang til ca. 18.000 kr. i alt = 1.800 kr. pr. adgang
-- (Martin, 6. okt. 2026). Én adgang i den store pulje; resten er timepræmier (vilkår pkt. 9).

UPDATE partner
   SET praemie_vaerdi = 1800,
       praemie_vaerdi_type = 'fast',
       praemie_moms = 'ekskl',
       praemie_indloesning = 'Vinderen kontakter Sandhed på hello@sandhed.com og får sin adgang sat op.',
       praemie_ikke_med = 'Hardware som sensorer og tags er ikke med.',
       praemie_sidste_frist = DATE '2027-03-31',
       opdateret = now()
 WHERE slug = 'sandhed';
