-- 036_inmobile_gave.sql
-- inMobiles gave til præmiepuljen (6. okt. 2026): 12 måneders adgang og 5.000 sms'er, værdi 4.913 kr.

UPDATE partner
   SET giver_praemie = true,
       praemie_titel = '12 måneders inMobile og 5.000 sms''er',
       praemie_beskrivelse = 'Vinderen får 12 måneders adgang til inMobile, platformen til sms-markedsføring og kundebeskeder, og 5.000 sms''er at sende med.',
       praemie_vaerdi = 4913,
       praemie_vaerdi_type = 'fast',
       praemie_moms = 'ekskl',
       praemie_indloesning = 'Vinderen kontakter inMobile på sales@inmobile.com og får sin konto sat op.',
       praemie_sidste_frist = DATE '2027-03-31',
       opdateret = now()
 WHERE lower(navn) = 'inmobile';
