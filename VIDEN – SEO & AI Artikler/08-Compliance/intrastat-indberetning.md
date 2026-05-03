---
primary_keyword: Intrastat indberetning guide
secondary_keywords: Intrastat IDEP, Intrastat Danmark 2025, Intrastat tærskelværdi, Intrastat frist
cluster: 08-Compliance
---

# Intrastat-indberetning: Step-by-step guide til IDEP 2025

Du har indberettet til IDEP i 8 måneder. Så opdager Danmarks Statistik en fejl i varekoden.

De kræver korrigering af alle 8 måneder. Manuelt. Frist: 14 dage.

Alternativ: 5.000 kr. i bøde per manglende måned.

Intrastat-indberetning er obligatorisk ved >11,3 mio. kr. EU-eksport. Men systemet er uforgivende: forkert varekode, forkert land, forkert værdi = bøde.

Her er step-by-step guiden til at gøre det rigtigt første gang.

## Hvad er Intrastat?

Intrastat erstatter den tolddeklaration, der tidligere fulgte EU-intern handel. Da varer frit kan bevæge sig inden for EU, indsamles statistik i stedet via virksomhedernes indberetninger. Der er to strømme:

- **Udførsel (eksport)**: Varer du sender fra Danmark til andre EU-lande
- **Indførsel (import)**: Varer du modtager i Danmark fra andre EU-lande

## Tærskelværdier 2025

Du er kun forpligtet til at indberette, hvis din handel overstiger følgende grænser:

| Strøm | Tærskel 2025 |
|-------|-------------|
| Udførsel (eksport til EU) | > 11,3 mio. kr./år |
| Indførsel (import fra EU) | > 41 mio. kr./år |

**Vigtigt**: Tærsklerne opgøres pr. kalenderår og gælder uanset antal transaktioner. Overskrider du grænsen, er du indberetningspligtig fra den måned, overskridelsen sker — og resten af det år + det følgende kalenderår.

## Frister: Gruppe 1 og Gruppe 2

Der er to grupper med forskellige frister:

| Gruppe | Hvem | Indberetningsfrist |
|--------|------|-------------------|
| Gruppe 1 | Store indberettere (Danmarks Statistik tildeler) | 10. hverdag i måneden efter referenceperioden |
| Gruppe 2 | Øvrige indberettere | Samme frist som momsindberetningen |

**Gruppe 2** indberetter typisk månedligt — fristen følger momsfristen, dvs. den 1. i den anden måned efter periodens udløb (ved månedlig moms) eller kvartalsvis.

Kontakt Danmarks Statistik for at få bekræftet din gruppetildeling hvis du er i tvivl.

## Hvad skal indberettes?

For hver transaktion skal du indberette:

1. **Referencemåned**: Den måned varerne afsendes/modtages
2. **Varekode (CN-kode)**: 8-cifret kombineret nomenklatur (se tarifkoder-forklaret)
3. **Partnerlandets ISO-kode**: Fx DE (Tyskland), SE (Sverige)
4. **Statistisk værdi**: Transaktionsværdi i DKK, inkl. forsikring og fragt til grænsen
5. **Nettovægt**: Varernes vægt i kg uden emballage
6. **Mængde i supplerende enhed**: Fx antal styk, liter, kvadratmeter (hvis krævet for varen)
7. **Transaktionskode**: 2-cifret kode for type af transaktion (fx 11 = køb/salg)

## Step-by-step: Indberetning via IDEP

### Trin 1: Opret adgang til IDEP
1. Gå til **idep.dst.dk**
2. Log ind med NemID/MitID erhverv
3. Første gang: registrer din virksomhed under "Opret bruger"
4. Vælg de strømme du skal indberette (udførsel og/eller indførsel)

### Trin 2: Forbered data fra dit system

Sammen dine fakturaer og forsendelsesdokumenter for referenceperioden. Du skal bruge:
- Fakturanummer og dato
- Varebeskrivelse og CN-kode
- Modtagerland (EU-land)
- Fakturabeløb i DKK
- Vægt i kg

**Tip**: Er dine varer registreret med korrekte CN-koder i dit WMS/ERP, kan du trække en rapport direkte. Har du SmartPack, er Tarifkode og Lande-tarifkoder to separate felter i produktdata — brug dem her.

### Trin 3: Vælg indberetningsmetode

IDEP tilbyder tre metoder:

**A) Manuel online-indberetning**
Egner sig til virksomheder med få transaktioner (<20 pr. måned). Udfyld direkte i IDEP's webformular.

**B) CSV/Excel-upload**
Egner sig til 20–500 transaktioner pr. måned. Download IDEP's skabelon, udfyld i Excel, upload som CSV-fil.

**C) XML-fil eller automatisk API**
Egner sig til store mængder. Eksporter XML fra dit ERP/WMS og upload eller send via API-integration.

### Trin 4: Udfyld og validér

1. Opret ny indberetning i IDEP
2. Vælg periode (år + måned)
3. Vælg strøm (udførsel eller indførsel)
4. Indtast eller upload data
5. Klik **Validér** — IDEP tjekker om CN-koder eksisterer og om felter er korrekt udfyldt
6. Ret eventuelle fejl

### Trin 5: Indsend

1. Klik **Send indberetning**
2. Du modtager en kvittering med sagsnummer
3. Gem kvitteringen (dokumentation for rettidig indberetning)

### Trin 6: Nulindberetning (hvis ingen handel)

Har du ingen transaktioner i referenceperioden, skal du stadig indberette — en **nulindberetning**. Dette gøres i IDEP ved at sende en tom periode.

## Typiske fejl

- **Forkerte CN-koder**: Brug TARIC-databasen (ec.europa.eu/taxation_customs/dds2/taric) for at verificere
- **Statistisk værdi vs. fakturabeløb**: Statistisk værdi inkluderer fragt og forsikring til dansk grænse
- **Glemmer nulindberetning**: Pligten ophører ikke, selvom du ikke har haft handel
- **Forkert transaktionskode**: Gratis prøver er kode 31, ikke 11
- **Bruger toldkode i stedet for CN-kode**: Intrastat bruger 8-cifret CN, ikke 10-cifret TARIC

## Sanktioner ved manglende indberetning

Manglende eller forsinket indberetning kan resultere i bøder fra Danmarks Statistik. Derudover kan gentagne forsømmelser trigge yderligere kontrol fra skattemyndighederne.

## SmartPack og Intrastat

SmartPack registrerer Tarifkode (CN/HS) og Lande-tarifkoder som separate felter på hvert produkt. Det gør det let at trække de nødvendige data til Intrastat-indberetningen.

**Hvornår SmartPack IKKE løser Intrastat alene**: SmartPack leverer produktdata og forsendelsesdata — men selve indberetningsprocessen til IDEP skal du eller din bogholder gennemføre manuelt. Overvej et specialiseret compliance-modul eller revisorbistand, hvis du har 200+ Intrastat-transaktioner per måned.

## Brug denne artikel
- [ ] Kontrollér om din virksomhed overskrider tærskelværdierne for 2025
- [ ] Bekræft din gruppe (1 eller 2) hos Danmarks Statistik
- [ ] Opret adgang til IDEP hvis ikke allerede gjort
- [ ] Tjek om dine produkter er registreret med korrekte CN-koder
- [ ] Sæt en kalenderpåmindelse for næste indberetningsfrist

## FAQ

**Hvad er forskellen på Intrastat og toldangivelse?**
Toldangivelse bruges ved handel med lande UDEN FOR EU (tredjelande). Intrastat er statistisk rapportering for handel inden for EU, hvor der ikke er toldgrænse.

**Skal jeg indberette for varer jeg sender til UK?**
Nej — UK er ikke længere EU. UK-forsendelser håndteres via toldangivelse. Se uk-compliance-post-brexit.

**Kan min revisor indberette på mine vegne?**
Ja — du kan give fuldmagt i IDEP til en ekstern part.

**Hvad sker der, hvis jeg opdager en fejl i en gammel indberetning?**
Du kan korrigere indberetninger i IDEP. Klik på den pågældende periode og vælg "Ret indberetning".

**Er der forskel på Intrastat og EU Salg uden moms (ESL)?**
Ja — ESL er en momsrapportering for ydelser og varesalg til momsregistrerede EU-kunder. Intrastat er statistisk rapportering for fysiske varer. Begge kan være relevante.
