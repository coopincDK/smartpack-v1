-- 033_ehandelsdagen_2_billetter.sql
-- Ehandelsdagen giver nu 1 x 2 billetter (de har fået en ekstra), 6. okt. 2026.

UPDATE partner
   SET praemie_titel = '2 billetter til Ehandelsdagen 2027 i Skive',
       praemie_beskrivelse = 'To billetter til Ehandelsdagen 11. februar 2027 i Skive, som fejrer 10 års fødselsdag. Tag en kollega med.',
       praemie_vaerdi = 5398,
       praemie_vaerdi_type = 'fast',
       praemie_moms = 'ekskl',
       praemie_betingelser = 'Værdien er 2 x 2.699 kr. ekskl. moms (standardbillet).',
       opdateret = now()
 WHERE lower(navn) = 'ehandelsdagen';
