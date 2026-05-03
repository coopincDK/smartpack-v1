---
primary_keyword: stregkoder lager korrekt brug
secondary_keywords: [barcode lager, stregkode scanning, ean kode lager, stregkode system]
cluster: 03-Operations
---

# Stregkoder korrekt brug på lager: Implementering der reducerer fejl med 83%

Stregkoder er fundamentet for præcis lagerstyring. Brugt korrekt reducerer de fejlraten fra 3% til 0,5% – en forskel på 83%. Brugt forkert skaber de falsk tryghed. Denne guide viser dig præcis, hvad korrekt brug af stregkoder kræver.

## Hvad er korrekt brug af stregkoder på lager?

Korrekt brug af stregkoder betyder, at alle relevante objekter på dit lager er mærket og skannes på de rigtige tidspunkter i de rigtige processer. Det inkluderer:
- Alle produkter (SKU'er) har scannable stregkoder
- Alle lagerlokationer har lokations-stregkoder
- Scanning sker ved modtagelse, pluk, pakning og afsendelse
- Systemet validerer alle scans og afviser fejl

## Hvornår er det et problem?

Stregkodehåndtering er et problem, når:
- Visse produkter mangler stregkoder eller har ulæselige labels
- Scanning springes over "for at spare tid" – typisk ved enkle ordrer
- Lokationer ikke er mærket med maskinlæsbare koder
- Systemet accepterer fejlscans uden validation

## Hvorfor er det vigtigt? (tal)

- Manuel plukning uden scanning: ~**3% fejlrate**
- Plukning med scanning: ~**0,5% fejlrate** – en **reduktion på 83%**
- Ved 500 ordrer/dag og 3% fejlrate = 15 fejl/dag × 350 kr. = **5.250 kr./dag i direkte fejlomkostning**
- Med scanning (0,5% fejlrate) = 2,5 fejl/dag × 350 kr. = **875 kr./dag** – besparelse: **4.375 kr./dag**

## Trin-for-trin: Implementér korrekt stregkodebrug

### Trin 1: Kortlæg alle objekter der skal mærkes
Lav en komplet liste:
- Alle SKU'er (hvert enkelt produkt i sortimentet)
- Alle lagerlokationer (hylde-reoler, bins, zoner)
- Totes og plukkekasser
- Forsendelsesemballage (ved scanningsbekræftelse ved afsendelse)

### Trin 2: Vælg stregkodestandard
For produkter: EAN-13 (standard detailhandel), Code 128 (intern logistik) eller QR-kode (kan indeholde mere info).
For lokationer: brug dit WMS' lokationskodeformat – typisk alfanumerisk med zone, gang, hylde og bin.

### Trin 3: Print og placer stregkoder korrekt
Krav til placering:
- Fronten af produktet – ikke bagpå, ikke på toppen
- Synlig uden at flytte varen
- Ikke blokeret af prismærke eller emballage
- Lokations-stregkoder på kanten af hylden i øjenhøjde

Krav til print-kvalitet:
- Minimum 300 DPI
- Tilstrækkelig kontrast (sort kode, hvid baggrund)
- Robust materiale – lamineret ved hyppig berøring eller fugtige miljøer

### Trin 4: Test scannabilitet
Scan 100% af nyoprettede labels inden de placeres. En label der ikke kan scannes, er ikke en label.

### Trin 5: Integrer scanning i alle processer som systemkrav
Scanning skal være en obligatorisk del af:
- Varemodtagelse: scan-til-system
- Pluk: scan-inden-pluk
- Sortering: scan-til-tote
- Pakning: scan-bekræftelse
- Afsendelse: scan-til-afsendt

Systemet må ikke tillade fremgang uden korrekt scan.

### Trin 6: Vedligehold labels løbende
Beskadigede eller slidte labels opdages ved daglig plukaktivitet. Etabler en procedure: medarbejder opdager ulæsbar label → indrapporterer → ny label printes og påsættes inden næste pluk.

## Typiske fejl

**Fejl 1: Labels på bagsiden eller toppen af produktet**
Plukkere spild tid på at vende varen. Labels skal altid vende frem.

**Fejl 2: Dårlig printerkvalitet**
Billige labels og lavopløsningsprint skaber ulæsbare koder der tvinger manuel override. Invester i godkendt termisk printer.

**Fejl 3: Scanning er valgfri**
Hvis systemet tillader at springe scanning over, gøres det under pres. Scanning skal være systemkrav, ikke anbefaling.

**Fejl 4: Ingen procedurer for beskadigede labels**
En beskadiget label opdaget under pluk forsinker og kan forårsage fejl. Hav altid en klar procedure.

## Sådan gør du det rigtigt

**1. Dobbelt-label ved fragile SKU'er**
Sæt to labels på varer der hyppigt håndteres – én på fronten, én øverst. Redukcerer risiko ved slidte labels.

**2. Brug lokations-stregkoder på begge sider af gangen**
Plukkere bør aldrig behøve at vende sig for at scanne en hylde-location. Labels på begge sider.

**3. Validér label-kvalitet ved modtagelse af nye varer**
Leverandørers stregkoder er ikke altid scannbare. Test ved modtagelse – og overs-print med egne labels ved behov.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Kortlæg alle objekter der kræver stregkode
- [ ] Vælg og standardisér kode-format
- [ ] Print og placer labels korrekt på alle SKU'er og lokationer
- [ ] Test scannabilitet på 100% af labels
- [ ] Integrer scanning som systemkrav i alle processer
- [ ] Etabler procedure for beskadigede labels

**Næste skridt**: Læs guiderne om datahygiejne og håndtering af plukfejl for at bygge videre på scanning-fundamentet.

## SmartPack understøttelse

SmartPack kræver scanning som systemstandard i alle procesmoduler – ingen fremgang uden valid scan. Systemet logger alle scannede hændelser med tidspunkt og bruger. Du kan se, hvilke SKU'er der hyppigst giver scan-fejl og håndtere dem proaktivt.

## FAQ

**Hvilken stregkodestandard skal jeg bruge?**
EAN-13 til produkter der handles i detailhandlen. Code 128 eller QR til interne lokations- og logistik-formål. Konsultér dit WMS for anbefalet format.

**Hvad er den kritiske forskel på 3% og 0,5% fejlrate?**
3% = 15 fejl per 500 ordrer/dag = ca. 5.250 kr./dag. 0,5% = 2,5 fejl = 875 kr./dag. Scanning er forskellen.

**Kan alle stregkoder scanned med en smartphone?**
Nej – smartphone-kameraer er langsomme og ustabile i et lagermiljø. Brug dedikerede håndscannere med laserscanning.

**Hvad gør jeg, hvis en leverandørs stregkode ikke kan scannes?**
Print og påsæt din egen label med EAN eller intern kode ved modtagelse. Informer leverandøren.

**Hvornår er det okay at springe scanning over?**
Aldrig. Scanning er et systemkrav, ikke en anbefaling. Undtagelser giver fejl.

