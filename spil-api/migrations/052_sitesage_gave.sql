-- 052_sitesage_gave.sql
-- SiteSages gave (Emil Norup, 7. okt. 2026): AI-assistance til kundeservice med op til 100.000
-- tickets i op til 6 sammenhængende måneder, værdi op til 200.000 kr. ekskl. moms. Kun nye kunder.
UPDATE partner
   SET giver_praemie = true,
       praemie_titel = 'SiteSage AI-kundeservice: op til 100.000 tickets',
       praemie_beskrivelse = 'Vinderen får SiteSage AI-assistance til kundeservice, inkl. behandling af op til 100.000 kundeservice-tickets i en periode på op til 6 sammenhængende måneder.',
       praemie_vaerdi = 200000,
       praemie_vaerdi_type = 'op_til',
       praemie_moms = 'ekskl',
       praemie_betingelser = 'Op til 200.000 kr. ekskl. moms ved fuldt forbrug af 100.000 tickets. Opsætning og opstart senest 30.06.2027, og de op til 100.000 tickets bruges inden for én sammenhængende periode på højst 6 måneder fra opstart. Præmien udløber senest 31.12.2027, hvorefter resterende tickets bortfalder.',
       praemie_ikke_med = 'Gælder kun nye SiteSage-kunder og kun ticketsystemer, som SiteSage understøtter (fx Herodesk, Zendesk og Dixa). Øvrige ydelser, integrationer, specialudvikling og tilkøb er ikke med, medmindre andet aftales særskilt.',
       praemie_indloesning = 'Vinderen kontakter Emil Norup på en@sitesage.ai.',
       praemie_sidste_frist = DATE '2027-06-30',
       praemie_flyt = 'ja',
       kontakt_navn = 'Emil Norup',
       kontakt_email = 'en@sitesage.ai',
       kontakt_telefon = '26 31 44 44',
       levering_navn = 'Emil Norup',
       levering_email = 'en@sitesage.ai',
       opdateret = now()
 WHERE lower(navn) = 'sitesage';
