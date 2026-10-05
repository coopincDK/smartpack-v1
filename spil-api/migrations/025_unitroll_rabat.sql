-- 025_unitroll_rabat.sql
-- UNI-TROLL har meldt 10 % rabat på alle vogne til og med 18. december 2026
-- (erstatter de 5 %, der stod før). Sættes direkte, da den gamle værdi ikke var tom.

UPDATE partner
   SET fordel_ydelse = 'Alle UNI-TROLL-vogne',
       fordel_rabat = '10 % rabat',
       fordel_koebskrav = 'Gælder køb af alle UNI-TROLL-vogne.',
       fordel_gyldig_til = DATE '2026-12-18',
       opdateret = now()
 WHERE lower(navn) IN ('uni-troll europe', 'uni-troll');
