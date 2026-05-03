---
primary_keyword: FEFO lagerstyring
secondary_keywords: first expired first out, holdbarhedsdato, udløbsdato pluk, FEFO metode
cluster: 01-Fundamentals
---

# Hvad er FEFO?

Kunden modtager yoghurt.
Udløber om 2 dage.
Du har yoghurt med 14 dages holdbarhed på lageret.

Du plukkede forkert.
Kunden returnerer.
Du kasserer.

FEFO er ikke best practice.
Det er lovkrav.
**60.000 kr./år i svind** ved 2% forkert rotation — plus bøder.

## Hvad er FEFO?

FEFO (First Expired, First Out) er en lagerrotationsmetode, der prioriterer varer baseret på udløbsdato frem for modtagelsesdato. Produktet med den nærmeste udløbsdato plukkes altid først — uanset hvornår det ankom til lageret.

**Forskellen fra FIFO:**
- **FIFO** = ældste varer (modtagelsesdato) plukkes først
- **FEFO** = korteste restlevetid (udløbsdato) plukkes først

Et produkt kan modtages sent men have en kortere udløbsdato end et ældre produkt på lageret. FEFO håndterer dette korrekt — FIFO gør ikke.

FEFO er relevant for: fødevarer, drikkevarer, kosttilskud, medicin, kemikalier, skønhedsprodukter og alle produkter med trykt holdbarhedsdato.

## Hvornår er det et problem?

- Kunder klager over at modtage varer tæt på udløbsdato
- Svind opstår fordi udløbne varer opdages under cycle counting
- Plukkere ser ikke udløbsdato og vælger tilfældigt
- Systemet registrerer kun modtagelsesdato, ikke udløbsdato
- Retur stiger pga. udløbsdatoproblemer

## Hvorfor er FEFO vigtigt? (tal og kr.)

I Danmark og EU er FEFO-overholdelse lovpligtigt for fødevarer og medicin. Manglende overholdelse kan medføre:

- **Bøder og tilbagekaldelse** — produkttilbagekald koster typisk 50.000–500.000 kr. afhængigt af omfang
- **Tab af certificering** — ISO 22000 og BRC-certificering kræver dokumenteret FEFO-kontrol
- **Kundesvind** — en undersøgelse viser, at 67 % af forbrugere ikke genkøber efter at modtage et produkt tæt på udløb

Udover compliance: et lager med 3 mio. kr. i datofølsomt varelager og 2 % svind pga. forkert rotation taber **60.000 kr./år** i direkte kassation.

## Hvordan fungerer FEFO i praksis?

1. **Udløbsdatoregistrering** — alle indgående batches registreres med udløbsdato (ikke kun modtagelsesdato)
2. **Batch- eller lot-tracking** — systemet knytter udløbsdato til specifik batchnummer
3. **FEFO-sorteret plukliste** — WMS genererer pluklister, der altid peger på batch med korteste udløbsdato
4. **Modtagekontrol** — mindste acceptable restlevetid defineres pr. produktkategori
5. **Karantænezonering** — varer inden for X dage af udløb flyttes til karantæne og stoppes for pluk

**Minimum restlevetid (MRL):** Definer hvad der er acceptabelt for dine kunder. Eksempel: Kunder kræver minimum 30 dages restlevetid ved levering → systemet stopper automatisk pluk ved under 30 dage.

## Typiske fejl

1. **Udløbsdato registreres ikke** — systemet kan ikke gennemtvinge FEFO uden denne data
2. **FIFO bruges i stedet for FEFO** — modtagelsesdato og udløbsdato er ikke altid korrelerede
3. **Ingen MRL-definition** — hvornår er en vare for gammel til at sende? Mangler klar grænse
4. **Batch-adskillelse ignoreres** — to batches med forskellig udløbsdato blandes på samme pluklokation
5. **Manuelt pluk uden scanning** — plukkere ser ikke udløbsdato og følger ikke FEFO

## Sådan gør du det rigtigt

1. **Registrer udløbsdato ved alle indgående datofølsomme varer** — dette er baseline
2. **Definer MRL pr. produktkategori** og lad systemet blokere for pluk under grænsen
3. **Adskil fysisk batches med forskellig udløbsdato** — aldrig bland på samme lokation
4. **Konfigurér karantæneflow** for varer tæt på udløb — til donering, rabatsalg eller kassation
5. **Auditér FEFO-overholdelse månedligt** som del af cycle counting

## Brug denne artikel

**Tjekliste — FEFO under kontrol?**
- [ ] Udløbsdato registreres ved alle relevante indgående varer
- [ ] WMS peger pluklister på batch med korteste udløbsdato
- [ ] MRL er defineret og aktiveret i systemet
- [ ] Batches med forskellig dato er adskilt fysisk
- [ ] Karantæneflow er konfigureret

**Formel — svindreduktion ved FEFO:**
`Svindbesparelse (kr./år) = varelager (kr.) × svind% (FIFO) − svind% (FEFO) × lagerbinding`

**Næste skridt:**
1. Identificer alle produktkategorier med udløbsdato i dit sortiment
2. Tjek om dit WMS registrerer udløbsdato vs. kun modtagelsesdato
3. Definer MRL pr. kategori

## SmartPack understøttelse

SmartPack understøtter FEFO med fuldt batch- og lot-tracking. Systemet registrerer udløbsdato ved varemodtagelse og genererer pluklister, der altid prioriterer batch med korteste udløbsdato. Konfigurér MRL pr. produktkategori, og systemet blokerer automatisk pluk under din definerede grænse. Aktivér FEFO pr. produktkategori under Indstillinger → Lagerstyring → Rotationsmetode → FEFO.

## FAQ

**Hvad er forskellen på FEFO og FIFO?**
FIFO plukker baseret på modtagelsesdato (ældste ind = ældste ud). FEFO plukker baseret på udløbsdato (korteste restlevetid ud først). Brug FEFO for alle produkter med udløbsdato.

**Er FEFO lovpligtigt i Danmark?**
Ja — for fødevarer og medicin er FEFO/FIFO-overholdelse lovpligtig under EU-forordning 852/2004 og lægemiddellovgivningen. Manglende dokumentation kan medføre bøder.

**Hvad er minimum restlevetid (MRL)?**
MRL er den mindste acceptable restlevetid på en vare ved levering til kunden. Eksempel: 30 dage. Systemet stopper pluk af varer under MRL automatisk.

**Kan FEFO og FIFO bruges side om side?**
Ja. SmartPack og de fleste WMS-systemer tillader opsætning pr. produktkategori. Tørvarer kan køre FIFO, mens mejeriprodukter kører FEFO.

**Hvad sker der med varer, der nærmer sig udløb?**
Best practice er en karantænezone: varer under X dage flyttes automatisk og stoppes for normal pluk. De kan derefter håndteres via rabatsalg, donation eller kassation med fuld sporbarhed.

