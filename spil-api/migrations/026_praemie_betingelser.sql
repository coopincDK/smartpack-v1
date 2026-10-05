-- 026_praemie_betingelser.sql
-- Gennemgang af gavernes tekster før konferencen (5. okt. 2026):
-- - Ehandelsdagen: gaven er 1 billet, så "Tag gerne en kollega med" fjernes.
-- - "Op til"-gaver skal angive det faste maksimum og hvordan hele værdien opnås (vilkår pkt. 8).
-- - "Det er ikke med" må ikke beskrive noget, der ER med; fragt flyttes til betingelser.

UPDATE partner SET praemie_beskrivelse = 'En billet til Ehandelsdagen 11. februar 2027 i Skive, som fejrer 10 års fødselsdag.', opdateret = now()
 WHERE lower(navn) = 'ehandelsdagen';

UPDATE partner SET praemie_betingelser = 'Op til 30.000 kr. ekskl. moms. Værdien afhænger af det Herodesk-abonnement, vinderen vælger; hele værdien opnås med det største abonnement i 6 måneder.', opdateret = now()
 WHERE lower(navn) = 'herodesk';

UPDATE partner SET praemie_betingelser = 'Op til 10.000 kr. ekskl. moms i alt. Vinderen vælger selv to vogne med 4 hylder hver inden for beløbet. Levering til vinderen er med.',
                   praemie_ikke_med = 'Vogne og tilbehør ud over de to vogne med 4 hylder hver.', opdateret = now()
 WHERE lower(navn) IN ('uni-troll europe', 'uni-troll');

UPDATE partner SET praemie_betingelser = 'Leveres direkte til vinderen. Fragt er med, og der er ingen skjulte omkostninger.',
                   praemie_ikke_med = 'Intet ud over det beskrevne.', opdateret = now()
 WHERE lower(navn) = 'skancode';
