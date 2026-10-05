-- 027_zignifikant_gave.sql
-- Zignifikants gave til konferencens præmiepulje (Kristian Konradsen, 5. okt. 2026).
-- Følger ikke med til Ehandelsdagen; dér laver de en ny præmie.

UPDATE partner
   SET giver_praemie = true,
       praemie_titel = 'Gratis onboarding hos Zignifikant',
       praemie_beskrivelse = 'Zignifikant står for hele opstarten, så virksomheden ikke har nogen udgifter til Zignifikant ved at komme i gang.',
       praemie_vaerdi = 25000,
       praemie_vaerdi_type = 'op_til',
       praemie_moms = 'ekskl',
       praemie_betingelser = 'Op til 25.000 kr. ekskl. moms. Værdien afhænger af de timer, opstarten kræver. Zignifikant har de sidste år ikke haft en onboarding, der kostede mere end 25.000 kr., og vinderen betaler intet for opstarten, uanset hvad den koster.',
       praemie_indloesning = 'Vinderen henvender sig til Kristian Konradsen på kak@zignifikant.dk senest 14 dage efter at have fået besked.',
       praemie_ikke_med = '',
       praemie_sidste_frist = DATE '2026-10-22',
       praemie_flyt = 'nej',
       opdateret = now()
 WHERE lower(navn) = 'zignifikant';
