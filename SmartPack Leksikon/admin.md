# SmartPack Admin — Komplet Leksikon

> **Format:** Hvert emne er en selvstændig artikel med fuldt format. Brug Ctrl+F til at søge.
> **Kilde:** Live system · support.smartpack.dk · Word-kvikguider · Domæneviden
> **Version:** SmartPack v1.34.0.0

---

## Indholdsfortegnelse

**DEL 1 — LOGIN OG ADGANG**
- Login (Admin)
- Glemt kodeord
- Opret / Rediger medarbejder
- Roller og rettigheder
- Supportchat — adgang

**DEL 2 — DASHBOARD**
- Dashboard — oversigt og KPI-tiles
- Dashboard Builder
- Employee Performance Dashboard

**DEL 3 — ORDRER**
- Ordreliste — oversigt og søgning
- Ordredetaljer — alle felter og tidslinje
- Opret manuel ordre
- Klon / Gensend ordre
- Opret label uden ordre (LabelOnly)
- Sæt ordrelinjer on hold
- Opdel ordre (Tillad Delvis Levering)
- Gensend afsendelsesmail
- Genudskriv følgeseddel
- Genudskriv fragtlabel (pakket ordre)
- Dropshipping — to metoder
- Annullér ordre
- Prioritering og pause af ordrer
- Afsendelse og Waybill / End-of-day

**DEL 4 — PRODUKTER**
- Produktoversigt
- Produkttyper — Normal
- Produkttyper — Normal + Ekstra pluk
- Produkttyper — Kollektions
- Produkttyper — Virtuel
- Produkttyper — Bundle
- Produktdata — alle felter
- Stregkoder på produkter
- Kolli-stregkoder
- Produktflags (FIFO, batch, serienr, farliggods m.fl.)
- Foretrukken placering (Preferred Placement)
- Warehouse Weight (lager-specifik vægt)
- Lagerhistorik på produkt
- Kostpris vs. Lageromkostning

**DEL 5 — INDKØB**
- Indkøbsordrer — kladde, åbne, afsluttede
- Leverandøroversigt og prislister
- Forecasting og ABC-analyse
- Presell (forudsalg)

**DEL 6 — LAGER**
- Lager — Status og reguleringer
- Revisionszoner og løbende optælling
- Lager økonomi-oversigt

**DEL 7 — LAGERDESIGNER**
- Lagerdesigner — introduktion
- Optegning af lager (trin-for-trin)
- Reol og placeringsstruktur
- Refill-lokationer og sektioner
- Test af historiske plukkeruter
- Lagertegning er blank (fejl)

**DEL 8 — PLUKKEPROFILER**
- Introduktion til plukkeprofiler
- Generelle indstillinger
- Rute og listeindstillinger
- Pakkeindstillinger
- Produktprioritet
- Ordrefiltrering
- Postnummer, lande og kundenummer
- Produktfiltrering
- Kunder / Shops
- Leveringsmetoder
- Lokationer og lagersektioner
- Ekskluder profiler
- Eksklusive plukkeprofiler
- Plukkeprofil til transfer ordre
- Eget lagerflyt

**DEL 9 — SORTERINGSZONER**
- Sorteringszoner — komplet guide

**DEL 10 — LEVERINGSMETODER**
- Leveringsmetoder — opsætning
- Leveringspris konfiguration
- Shop Checkout konfiguration

**DEL 11 — MEDARBEJDERE**
- Medarbejderadministration
- Arbejdsplaner

**DEL 12 — KUNDER (3PL)**
- Kundeoversigt
- Valutakurs — overstyring
- 3PL Prissætning

**DEL 13 — RAPPORTER**
- Lagerrapporter og historikvisninger
- Batchsporing
- Serienummersporing

**DEL 14 — STAMDATA**
- Totes og plukkekasser
- Emballage og pakketyper
- Vogne
- Printere
- Enhedstyper

**DEL 15 — RETURPORTAL**
- Returportal — opsætning
- Alternativ returadresse
- Returårsager og -handlinger

**DEL 16 — WORKFLOWS**
- Workflows — komplet guide

**DEL 17 — E-MAILS OG SKABELONER**
- Email-skabeloner — komplet opsætning
- Følgeseddel-skabeloner
- Stregkode-/labelskabeloner
- SMTP-opsætning

**DEL 18 — SYSTEMINDSTILLINGER**
- Systemindstillinger — oversigt
- Genstart SmartPack
- Lokationer
- CSV-separator (CultureInfo)
- Flush DNS
- API-adgang
- WooCommerce integration
- POS / Kasse Flow

**DEL 19 — ANKOMST (ADMIN)**
- Ankomstoversigt og afsendelse

**DEL 20 — FORECASTING**
- Forecasting og ABC-analyse (komplet)

---

# DEL 1 — LOGIN OG ADGANG

---

## Login (Admin)

### Hvad er det
Login til SmartPack Admin-panelet.

### Adgang
Browser → `https://ditlager.smartpack.dk/Admin`

### Anbefalede browsere
- Google Chrome (PC + Mac) — anbefalet
- Microsoft Edge (PC) — anbefalet
- Safari (Mac) — understøttet

### Bemærk om Lagerdesigner
Lagerdesigneren virker **ikke** i Chrome på Windows 8 eller ældre. Brug Edge eller Windows 10+.

### Relaterede emner
→ Se: Opret / Rediger medarbejder
→ Se: Glemt kodeord

---

## Glemt kodeord

### Hvad er det
Procedure for nulstilling af kodeord til SmartPack Admin eller Terminal.

### Trin-for-trin (Admin)

1. Admin → Medarbejdere
2. Find medarbejderen
3. Tryk **Rediger** (blyantikon)
4. Feltet **Kode** → skriv ny kode
5. Gem

### Trin-for-trin (Terminal)
1. Medarbejder er låst ude: Admin → Medarbejdere → rediger → ny kode
2. Alternativ: Send medarbejder en ny QR-kode

### Relaterede emner
→ Se: Opret / Rediger medarbejder

---

## Opret / Rediger medarbejder

### Hvad er det
Administration af medarbejderkonti i SmartPack.

### Sti
Admin → Medarbejdere → Tilføj medarbejder / Rediger (blyantikon)

### Alle felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Fornavn** | Medarbejderens fornavn | Tekst |
| **Efternavn** | Medarbejderens efternavn | Tekst |
| **Brugernavn** | Unikt login-navn | Tekst |
| **Kode** | Adgangskode (vises ikke) | Tekst |
| **QR-kode** | Print QR-kode til hurtig login | Knap |
| **Billede** | Profilbillede til identifikation | Upload |
| **Email** | Email-adresse — kræves til supportchat | Email |
| **Superbruger** | Giver adgang til supportchat | ✅ / ☐ |
| **Rolle** | Terminal / Admin / Begge | Valgmenu |
| **Aktiv** | Om konto er aktiv | ✅ / ☐ |
| **Max vægt** | Skånehensyn: max løftevægt per pluk | kg |
| **Max plukke-højde** | Skånehensyn: max hyldehøjde | m |
| **Tilladt IP** | Begræns login til specifikke IP-adresser | IP-liste |
| **Arbejdsplan** | Tilknyt arbejdsplan | Valgmenu |
| **Lager** | Begræns til specifikt lager (3PL) | Valgmenu |

### QR-kode
Print medarbejderens QR-kode → medarbejderen scanner den for hurtig login.

### Relaterede emner
→ Se: Roller og rettigheder
→ Se: Supportchat — adgang

---

## Roller og rettigheder

### Hvad er det
System til at styre hvad medarbejdere kan se og gøre i SmartPack.

### Roller

| Rolle | Adgang |
|-------|--------|
| **Terminal** | Kun terminal-apps |
| **Admin** | Kun admin-panelet |
| **Begge** | Terminal + Admin |
| **Superbruger** | Admin + supportchat + udvidede rettigheder |

### Granulær adgangsstyring

Inden for Admin kan der konfigureres rettigheder per modul:

| Modul | Kan indstilles til |
|-------|-------------------|
| Ordrer | Vis / Rediger / Annullér |
| Produkter | Vis / Rediger / Opret |
| Lager | Vis / Regulér |
| Indstillinger | Ingen / Læs / Skriv |
| Rapporter | Vis / Eksportér |
| Medarbejdere | Vis / Administrér |

### Skånehensyn
- **Max vægt**: Medarbejdere med begrænsning tildeles kun pluk under grænsen
- **Max plukke-højde**: Medarbejdere med begrænsning tildeles ikke pluk over grænsen

### Relaterede emner
→ Se: Opret / Rediger medarbejder

---

## Supportchat — adgang

### Hvad er det
SmartPack har en integreret supportchat i Admin-panelet. Chat-ikonet vises i Admin.

### Krav for adgang
1. Medarbejderens **email** er udfyldt korrekt i brugerindstillingerne
2. Medarbejderen er markeret som **Superbruger**
   - Håndteres af SmartPack-teamet ved anmodning
   - Anmod: send email til support@smartpack.dk

### Vigtig info
- Teamet svarer hurtigst muligt — ikke øjeblikkeligt
- **Sofia** (SmartPack AI) er tilgængelig 24/7 og svarer øjeblikkeligt på de fleste spørgsmål
- Sofia er trænet på SmartPack-dokumentation

### Relaterede emner
→ Se: Opret / Rediger medarbejder
→ Se: Support (kontakt)

---

# DEL 2 — DASHBOARD

---

## Dashboard — Oversigt og KPI-tiles

### Hvad er det
Dashboard er Admin-forsidens kontrolcenter. Det viser realtids-KPI'er, aktivitetsgrafer og systemstatus.

### Sti
Admin → Dashboard

### KPI-tiles (øverste række)

| Tile | Viser | Periode |
|------|-------|---------|
| **Ordrer i dag** | Antal ordrer modtaget | Dags dato |
| **Ordrer i gang** | Ordrer under behandling | Live |
| **Pakkede** | Pakket og klar til afsendelse | Dags dato |
| **Afsendte** | Afsendte forsendelser | Dags dato |
| **Til pluk** | Ordrer der afventer pluk | Live |
| **Retur** | Returordrer til behandling | Live |
| **Lager alerts** | Varer under min.-beholdning | Live |

### Grafer

| Graf | Viser |
|------|-------|
| **Ordreflow** | Ordrer per time/dag/uge |
| **Plukhastighed** | Pluk per medarbejder per time |
| **Leveringspunktlighed** | OTD-procent |
| **Lagerbeholdning** | Total lagerværdi og enheder |

### Relaterede emner
→ Se: Dashboard Builder
→ Se: Employee Performance Dashboard

---

## Dashboard Builder

### Hvad er det
Tilpasseligt dashboard-system der lader dig sammensætte din egen oversigt med widgets.

### Sti
Admin → `/Admin/dashboardBuilder`

### Tilgængelige widgets

| Widget | Beskrivelse |
|--------|-------------|
| **Ordretæller** | Antal ordrer i valgt status/periode |
| **Varetæller** | Antal varelinjer/enheder |
| **Returtæller** | Antal returordrer |
| **Periodeliste** | Tabelvisning af ordrer/varer over periode |
| **Stablet søjlediagram** | Visuel sammenligning over tid |
| **Seneste varer** | Live feed af senest modtagne/afsendte varer |
| **Indkøbsordreliste** | Åbne og kommende indkøbsordrer |
| **Ur** | Analogt/digitalt ur (til storskærm) |
| **Billede** | Indsæt logo eller grafik |
| **Brugerdefineret kode** | Tilpasningsbar HTML/widget |
| **Medarbejderpræstation** | Performance-data per medarbejder |

### ⚠️ KRITISK: Layout gemmes ikke automatisk
Klik **diskette-ikonet ("Gem grid")** efter arrangering af widgets.
Glemmer du at gemme: layout mistes ved næste login.

### Live mode
Præsentationsvisning uden admin-navigation. Opdaterer hvert minut. Egnet til storskærm på lageret.

### Relaterede emner
→ Se: Employee Performance Dashboard
→ Se: Dashboard — Oversigt

---

## Employee Performance Dashboard

### Hvad er det
Detaljeret produktivitetsanalyse per medarbejder med benchmarks og sammenligning.

### Sti
Admin → Employee Performance

### Hvad vises

| Metric | Beskrivelse | Benchmark |
|--------|-------------|----------|
| **Pakker per time** | Antal pakker pakket | 40/time |
| **Pluk per time** | Antal varelinjer plukket | 110/time |
| **Modtagelser per time** | Antal varer modtaget | 100/time |
| **Flytninger per time** | Antal lagerbevægelser | 50/time |
| **Revisioner per time** | Antal lagerrevisioner | 100/time |
| **Palle-scans per time** | Antal pakker scannet til palle | 100/time |
| **Fejlrate** | Andel af fejlplukkede/forkert pakkede | < 0,5% |

### Filtre

| Filter | Muligheder |
|--------|-----------|
| **Medarbejder** | Alle / Specifik medarbejder |
| **Periode** | Dato-interval, skifttype |
| **Aktivitetstype** | Pluk / Pak / Modtagelse / Flytning |

### Relaterede emner
→ Se: Dashboard Builder


---

# DEL 3 — ORDRER

---

## Ordreliste — Oversigt og søgning

### Hvad er det
Admin-ordrelisten er det centrale sted for at overvåge og administrere alle ordrer. Den viser alle indkomne ordrer med status, filtre og søgning.

### Sti
Admin → Kunder → Ordrer

### Kolonner i ordrelisten

| Kolonne | Beskrivelse |
|---------|-------------|
| **Ordrenummer** | Unikt identifikator — klikbart |
| **Shop** | Hvilken webshop/kilde ordren kommer fra |
| **Status** | Aktuelt stadie |
| **Ordredato** | Hvornår ordren kom ind |
| **Leveringsmetode** | Transportør og service |
| **Modtager** | Kundenavn |
| **Antal varelinjer** | Antal produkter i ordren |
| **Ikoner** | Advarsler og notater |

### Ordrestatusser

| Status | Beskrivelse |
|--------|-------------|
| **Modtaget** | Ordren er importeret til SmartPack |
| **Til pluk** | Klar til pluk |
| **Under pluk** | En plukliste er aktiv |
| **Plukket** | Alt plukket, afventer pakning |
| **Pakket** | Pakket og label printet |
| **Afsendt** | Label skannet til transportør |
| **On Hold** | Ordren afventer manuelt |
| **Missing Items** | Varer mangler på lager |
| **Problem** | Manuel håndtering kræves |
| **Annulleret** | Ordren er annulleret |

### Søg og filtrer

| Filter | Muligheder |
|--------|-----------|
| **Fritekst** | Ordrenummer, modtager, SKU |
| **Status** | Alle statusser ovenfor |
| **Dato** | Fra / Til |
| **Shop** | Alle / Specifik shop |
| **Leveringsmetode** | Alle / Specifik metode |
| **Tags** | Brugerdefinerede tags |

### Relaterede emner
→ Se: Ordredetaljer

---

## Ordredetaljer — Alle felter og tidslinje

### Hvad er det
Den komplette visning af én ordre inkl. alle data, tidslinje og tilgængelige handlinger.

### Åbn ordredetaljer
Klik på ordrenummeret i ordrelisten.

### Sektioner

**Ordrehoved:**

| Felt | Beskrivelse |
|------|-------------|
| Ordrenummer | Unikt ID |
| Ekstern ordre-ID | ID fra webshop |
| Ordredato | Dato og tid for modtagelse |
| Status | Aktuelt stadie |
| Leveringsmetode | Transportør og service |
| Shop / Kilde | Hvilken integration ordren kom fra |
| Afsendernavn | Bruges ved ERP/DanDomain med flere afsendere |

**Modtagerdata:**

| Felt | Beskrivelse |
|------|-------------|
| Navn | Fuldt navn |
| Adresse linje 1 | Gadenavn og husnummer |
| Adresse linje 2 | Etage, lejlighed (valgfrit) |
| By | |
| Postnummer | |
| Land | Alpha-2 kode (DK, DE, SE...) |
| Email | Til afsendelsesmail og returportal |
| Telefon | Kræves af visse transportører |
| Leveringsinstrukser | Kundens besked til leverandøren |

**Varelinjer:**

| Kolonne | Beskrivelse |
|---------|-------------|
| SKU | Varenummer |
| Navn | Produktnavn |
| Antal | Bestilt antal |
| Leveret | Faktisk leveret antal |
| Pris | Enhedspris |
| On Hold | Sæt linje i venteposition |

**Forsendelseskasse:**

| Element | Beskrivelse |
|---------|-------------|
| Tracking | Track & trace nummer |
| Label | Download PDF |
| Resend mail | Send afsendelsesmail igen |
| PDF-knap (lilla) | Genudskriv følgeseddel |

**Tidslinje:**
Viser alle hændelser kronologisk: importeret → plukket → pakket → afsendt med bruger, tidsstempel og data.

### Relaterede emner
→ Se: Ordreliste
→ Se: Gensend afsendelsesmail

---

## Opret manuel ordre

### Hvad er det
Oprettelse af en ordre direkte i SmartPack uden at den importeres fra en webshop.

### Sti
Admin → Kunder → Ordrer → **Opret ordre**

### Felter

| Felt | Beskrivelse | Påkrævet |
|------|-------------|---------|
| **Modtagernavn** | Fuldt navn | ✅ |
| **Adresse** | Fuld leveringsadresse | ✅ |
| **Email** | Modtagerens email | Anbefalet |
| **Telefon** | Modtagerens telefon | Anbefalet |
| **Leveringsmetode** | Vælg transportør og service | ✅ |
| **Varelinjer** | Søg og tilføj produkter | ✅ |
| **Antal** | Antal per varelinje | ✅ |
| **Pris** | Pris per enhed | Valgfrit |
| **Ordrenote** | Intern note | Valgfrit |
| **Kundernote** | Note til kunden | Valgfrit |
| **Tags** | Brugerdefinerede tags | Valgfrit |

### Relaterede emner
→ Se: Opret label uden ordre (LabelOnly)
→ Se: Klon / Gensend ordre

---

## Klon / Gensend ordre

### Hvad er det
Mulighed for at skabe en kopi af en eksisterende ordre — typisk brugt ved bortkomne forsendelser.

### Hvornår bruges det
Kunden har ikke modtaget sin pakke og den er bortkommet hos transportøren.

### Trin-for-trin

1. Find den originale ordre
2. Tryk **Clone**
3. En ny ordre oprettes med samme varer og modtagerdata
4. Behandl den nye ordre normalt (pluk, pak, afsend)
5. **Håndter original ordre:** Brug "Hurtig retur" med årsagen **"Bortkommet"**

### Systemlogik
Klonning kopierer alle ordrelinjer og modtagerdata. Ordrenummeret er nyt. Klon-ordren er uafhængig af originalen.

### Relaterede emner
→ Se: Opret manuel ordre
→ Se: Retur — Modtagelse (Terminal)

---

## Opret label uden ordre (LabelOnly)

### Hvad er det
Mulighed for at generere en fragtlabel uden at der er varer tilknyttet — typisk til returlabels eller emballageforsendelser.

### Hvornår bruges det
- Opret returlabel til en kunde
- Send en tom pakke med specifik label
- Intern forsendelse uden ordrelinjer

### Trin-for-trin

1. Admin → Kunder → Ordrer → **Opret ordre**
2. Udfyld afsender- og modtageradresser
3. Lad **ordrelinjerne stå tomme**
4. Sæt ordretype til **`LabelOnly`** → gem
5. Fra ordrelisten: tryk **Etiketter/Labels**
6. Angiv vægt
7. Vælg fragtmetode
8. Tryk **"Opret etiket"**

### Systemlogik
LabelOnly-ordrer genererer en label men udløser ikke noget pluk-flow. De afvikles helt uden om normale lagerprocesser.

### Relaterede emner
→ Se: Opret manuel ordre

---

## Sæt ordrelinjer on hold

### Hvad er det
Mulighed for at sætte individuelle ordrelinjer i venteposition mens resten af ordren behandles normalt.

### Hvornår bruges det
Én vare på en ordre er udsolgt men resten er tilgængeligt — send det tilgængelige nu, rest-linjen afventer.

### Trin-for-trin

1. Admin → Kunder → Ordrer → find ordren
2. Tryk **Rediger** (blyantikonet)
3. Find den ønskede varelinje
4. I kolonnen **On Hold**: sæt flueben
5. Tryk **Gem**
6. I ordrelisten vises ⚠️-ikonet (gult trekant) = **"Lines on Hold"**

### Systemlogik
Ordren som helhed behandles normalt. Kun de markerede linjer springes over i pluk og pakning. Systemet plukker og pakker de linjer der ikke er on hold.

### Shopify V2
On Hold synkroniseres automatisk fra Shopify-admin — behøver ikke indstilles manuelt her.

### Relaterede emner
→ Se: Opdel ordre (Tillad Delvis Levering)

---

## Opdel ordre (Tillad Delvis Levering)

### Hvad er det
Mulighed for at sende tilgængelige varer nu mens resten afventer lager.

### Hvornår bruges det
En ordre indeholder varer der ikke er på lager endnu — kunden vil gerne modtage det der er tilgængeligt med det samme.

### Trin-for-trin

1. Admin → Kunder → Ordrer → rediger ordren (blyantikon)
2. Aktivér **"Allow Partial Delivery / Tillad Delvis levering"**
3. Tryk **Gem**
4. Kun varer på lager plukkes — varer der mangler forbliver på ordren
5. Betaling hæves **kun** når alle varer er afsendt

### Systemlogik
Delvis levering opretter ikke automatisk en ny ordre. Den originale ordre bevares med de resterende varelinjer til de er på lager.

### Relaterede emner
→ Se: Sæt ordrelinjer on hold
→ Se: Presell (forudsalg)

---

## Gensend afsendelsesmail

### Hvad er det
Genfremsendelse af afsendelsesmail (med tracking) til kunden.

### Trin-for-trin

1. Admin → Kunder → Ordrer → find ordren
2. Rul til **Shipments**-boksen
3. Tryk **"Resend mail"**

### Edge cases
DanDomain-integration: fakturamail kan **kun sendes én gang** — verificér email-adresse inden afsendelse.

### Relaterede emner
→ Se: Ordredetaljer
→ Se: Email-skabeloner — komplet opsætning

---

## Genudskriv følgeseddel

### Hvad er det
Genudskrivning af en eksisterende følgeseddel for en ordre.

### Trin-for-trin

1. Åbn ordren
2. Scroll til forsendelseskassen
3. Tryk den **lilla knap** (PDF-ikon)
4. Følgesedlen sendes til den valgte A4-printer

### Relaterede emner
→ Se: Ordredetaljer
→ Se: Genudskriv fragtlabel

---

## Genudskriv fragtlabel (pakket ordre)

### Hvad er det
Genudskrivning af fragtlabel for en ordre der allerede er pakket og afsluttet.

### ⚠️ KRITISK FORSKEL

| Knap | Effekt |
|------|--------|
| **"Udskriv igen"** | Genbruger original label — samme sporingsnummer |
| **Grøn Print-knap** | Genererer **NY** label med nyt sporingsnummer |

**Brug normalt "Udskriv igen"** — transportøren forventer det originale nummer.

### Trin-for-trin (fra Admin)

1. Admin → Kunder → Ordrer
2. Find ordren
3. Tryk **Labels/Etiketter**
4. Tryk **"Udskriv igen"**

### Trin-for-trin (fra Terminal)

1. Pak Ordrer → ur-ikon (historik)
2. Find ordren
3. Tryk **"Udskriv igen"**

### Relaterede emner
→ Se: Labelprint — Fejl og løsninger (Terminal)

---

## Dropshipping — To metoder

### Hvad er det
Håndtering af varer der sendes direkte fra leverandøren til slutkunden uden at passere dit lager.

### Metode 1 — Udenom SmartPack (anbefales ved ren dropshipping)

1. Sæt varetype til **`DontImport`** → importeres ikke til SmartPack
2. Slå **"Manage External Stock"** fra

⚠️ Begrænsning: Returvarer fra dropshipping kan **ikke** lagerføres i SmartPack med denne metode.

### Metode 2 — Via SmartPack (manuel håndtering)

1. Markér vare med **"Tillad dropshipping"** i produktindstillinger
2. Når varen ikke er på lager → markeres til dropshipping (blå bar i ordrelisten)
3. Tryk **"Create Dropshipping"** i ordren
4. Vælg: indsæt trackingnummer **ELLER** generér label til leverandør

### Systemlogik
Dropshipping-ordrer følger ikke det normale pluk/pak-flow. De markeres og behandles separat.

### Relaterede emner
→ Se: Produktflags
→ Se: Email-skabeloner (Dropshipping-type)

---

## Annullér ordre

### Hvad er det
Procedure for at annullere en ordre der er kommet ind i SmartPack.

### Situationer

| Situation | Handling |
|-----------|---------|
| Annulleret i shop men ikke i SmartPack | Kør pakkeprocessen baglæns (→ Se Terminal artikel) |
| Annullér fra Admin | Admin → Ordren → Annullér |

### Systemlogik
Ordren kan kun annulleres hvis den ikke er under aktiv pakning. Er pakning påbegyndt: kør baglæns-procedure fra terminalen.

→ Se: Fejlhåndtering — Ordre annulleret i shop (Terminal)

---

## Afsendelse og Waybill / End-of-day

### Hvad er det
Afslutning af arbejdsdagen — generering af waybill-lister til transportøren og End-of-day rapporter.

### Sti
Admin → Afsendelse

### Waybill-liste

| Trin | Handling |
|------|---------|
| 1 | Admin → Afsendelse |
| 2 | Vælg transportør |
| 3 | Vælg dato |
| 4 | Tryk **"Generér waybill"** |
| 5 | PDF genereres |
| 6 | Print og medsend chaufføren |

### End-of-day
Visse transportører kræver End-of-day scanning. SmartPack genererer den nødvendige fil/rapport automatisk.

### Relaterede emner
→ Se: Scan til Palle (Terminal)


---

# DEL 4 — PRODUKTER

---

## Produktoversigt

### Hvad er det
Den centrale liste over alle produkter i SmartPack med søgning, filtrering og eksport.

### Sti
Admin → Produkter

### Kolonner i oversigten

| Kolonne | Beskrivelse |
|---------|-------------|
| **SKU** | Varenummer |
| **Type** | Produkttype (Normal, Bundle, Virtuel m.fl.) |
| **Producent** | Fabrikant |
| **Stregkode** | Primær EAN/GTIN |
| **Vægt** | Gram |
| **Lagerantal** | Fysisk lager |
| **Reserveret** | Reserveret til aktive ordrer |
| **På vej hjem** | På indkøbsordre |
| **Tilgængelig** | Lager − Reserveret |
| **Lagerkostpris** | Beregnet gennemsnitlig kostpris |
| **Total værdi** | Lagerantal × Lagerkostpris |

### Handlinger fra oversigten

| Handling | Beskrivelse |
|----------|-------------|
| **Eksportér CSV** | Download produktliste |
| **Importér CSV** | Masseopdatering via CSV |
| **Tilføj produkt** | Opret ny vare manuelt |
| **Søg** | Filtrer på SKU, navn, stregkode |

### Relaterede emner
→ Se: Produkttyper
→ Se: Produktdata — alle felter

---

## Produkttyper — Normal

### Hvad er det
Standard enkelt-vare. Den mest brugte produkttype.

### Hvornår bruges det
Alle ordinære fysiske varer der ikke er bundter, virtuelle eller samlede produkter.

### Nøglefunktioner
- FIFO-styring
- Batch/LOT-sporing
- Serienummersporing
- Farliggods-flag
- Udløbsdatostyring

### Relaterede emner
→ Se: Produktdata — alle felter
→ Se: Produktflags

---

## Produkttyper — Normal + Ekstra pluk

### Hvad er det
En Normal vare med tilknyttede ekstra produkter der automatisk inkluderes ved plukning.

### Hvornår bruges det
Varer der altid pakkes med medfølgende produkter.

**Eksempel:** En stol sælges altid med stoleben → stol-SKU oprettes med stoleben som ekstra plukpunkt.

### Konfiguration
Admin → Produkt → Type: Normal + Ekstra pluk → tilføj ekstra plukpunkter i sektionen herunder.

### Systemlogik
Plukkeren ser det primære produkt + alle ekstra plukpunkter i listen. Alt registreres som del af samme ordre.

### Relaterede emner
→ Se: Produkttyper — Normal

---

## Produkttyper — Kollektions

### Hvad er det
Et produkt der bruges til produktionsordrer og/eller kolli-salg. Består af komponentvarer.

### Hvornår bruges det
- Kitting og produktionsordrer (saml X komponenter til ét produkt)
- Kolli-salg (sæt af varer sælges som ét produkt)

### Nøgleindstillinger

| Indstilling | Beskrivelse |
|-------------|-------------|
| **Tillad samling** | Komponentvarer kan samles til kollektions-produktet |
| **Tillad adskillelse** | Færdigt produkt kan adskilles til komponenter |
| **Inkluder indhold i lager** | Komponenterne tæller med i samlet lagersaldo |

### Relaterede emner
→ Se: Produktion (Terminal)
→ Se: Produkttyper — Bundle

---

## Produkttyper — Virtuel

### Hvad er det
Et ikke-fysisk produkt — service, abonnement, downloadbart indhold.

### Hvornår bruges det
Salg af services der ikke kræver lagerføring, pluk eller pakning.

### Nøgleindstillinger — Opfyldning

| Indstilling | Effekt |
|-------------|--------|
| **Opfyld straks** | Ordren markeres som opfyldt øjeblikkeligt ved modtagelse |
| **Opfyld med første** | Opfyldes med første fysiske forsendelse i ordren |
| **Opfyld med sidste** | Opfyldes med den sidste fysiske forsendelse i ordren |

### Systemlogik
Virtuelle produkter kræver ikke pluk, pak eller lager. Systemet markerer dem automatisk som opfyldt.

---

## Produkttyper — Bundle

### Hvad er det
En kombination af eksisterende produkter der sælges som ét samlet produkt.

### Hvornår bruges det
Salgspakker der ikke produceres fysisk — systemet beregner tilgængelighed ud fra komponenternes individuelle lagerbeholdning.

### Nøgleindstillinger

| Indstilling | Beskrivelse |
|-------------|-------------|
| **Tilføj enheder** | Vælg komponenter og antal per bundle |
| **Håndtering ved manglende lager** | Hvad sker der hvis en komponent mangler |

### Håndteringsmuligheder ved manglende lager

| Indstilling | Beskrivelse |
|-------------|-------------|
| **Ignorer men fullfill med første** | Send bundlen med de tilgængelige varer |
| **Ignorer men fullfill med sidste** | Vent til alle er klar, send derefter |
| **Ignorer men fullfill straks** | Fullfill øjeblikkeligt uanset lager |
| **Importer ikke** | Importer ikke denne bundle fra shop |

### Systemlogik
Bundle-lager = laveste fællesnævner af komponenternes lagerantal.

**Eksempel:** Bundle = 2× SKU-A + 1× SKU-B. Lager: A=10, B=3 → Max bundle = 3 (begrænset af B).

### ⚠️ KRITISK REGEL
Modtag **aldrig** bundle-SKU'en direkte ved ankomst — modtag altid komponenterne.

→ Se: Ankomst — Bundles (Terminal)

---

## Produktdata — Alle felter

### Hvad er det
Komplet liste over alle felter der kan udfyldes på et produkt i SmartPack.

### Identifikation

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **SKU** | Unikt varenummer | Tekst |
| **Eksternt ID** | Varens ID i den tilsluttede webshop/ERP | Tekst |
| **Produktnavn** | Fuldt produktnavn | Tekst |
| **Variant** | Variantbeskrivelse (størrelse, farve) | Tekst |
| **Billedesti** | URL til produktbillede | URL |
| **Tags** | Brugerdefinerede søgekategorier | Tekst-liste |
| **Fabrikant** | Producent/mærke | Tekst |
| **Leverandøre** | Tilknyttede leverandører | Liste |
| **Leverandørnummer** | Leverandørens varenummer | Tekst |
| **Modelnr.** | Modelidentifikator | Tekst |
| **UN nr.** | FN-varenummer for farligt gods | Tal |
| **Gruppering / Selection / Style** | Variantgruppe-ID | Tekst |
| **Produkt identitet** | Intern klassifikation | Tekst |
| **Gruppe navn** | Visningsnavn for gruppen | Tekst |
| **Gruppe identitet** | Gruppe-ID | Tekst |

### Fysiske mål

| Felt | Beskrivelse | Enhed |
|------|-------------|-------|
| **Vægt** | Nettovægt | Gram |
| **Vægt inkl. emballage** | Bruttovægt | Gram |
| **Bredde** | Bredde | mm |
| **Højde** | Højde | mm |
| **Dybde** | Dybde | mm |
| **Warehouse Weight** | Lager-specifik vægt (overskriver normal vægt) | Gram |

### Stregkoder

| Felt | Beskrivelse |
|------|-------------|
| **Primær stregkode** | Hoved-EAN/GTIN |
| **Tilføj flere stregkoder** | Alle alternative EAN-koder for varen |
| **Kolli-stregkoder** | Stregkode der registrerer X antal ved scanning |

### Priser

| Felt | Beskrivelse |
|------|-------------|
| **Normal pris** | Vejledende udsalgspris |
| **Udsalgspris** | Aktiv kampagnepris |
| **Kostpris** | Indkøbspris (synkroniseret fra integration) |
| **Lagerkostpris** | Beregnet gennemsnitskostpris inkl. fragt og told |

### Genopfyldning

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Refill limit** | Minimumsgrænse der udløser genopfyldning | Tal |
| **Max refill** | Maksimal genopfyldningsmængde | Tal |
| **Max forskellige placeringer** | Max antal lagerpladser for denne vare | Tal |

### Enhedstype

| Enhedstype | Beskrivelse |
|------------|-------------|
| **Stk** | Salges i hele antal (standard) |
| **Ltr** | Kan sælges i 0,1-intervaller |
| **Meter** | Kan sælges i 0,1-intervaller |

### Underretninger

| Felt | Hvornår vises |
|------|--------------|
| **Underretning til plukker** | Vises på terminalen under plukning |
| **Underretning til pakker** | Vises på terminalen under pakning |

### Logistik flags (se separat artikel)
→ Se: Produktflags

### Eksportdata

| Felt | Beskrivelse |
|------|-------------|
| **Oprindelsesland** | Produktionsland (Alpha-2) |
| **Tarifkode** | Toldtarifnummer |
| **Lande-tarifkoder** | Landespecifikke tarifkoder |
| **Kategorier** | Produktkategorier til eksport |

### Placeringsindstillinger

| Felt | Beskrivelse |
|------|-------------|
| **Importer placeringsnavne** | Importer placeringer fra ekstern kilde |
| **Foretrukken placering** | Sæt ikke / Sæt ved første modtagelse / Flyt til seneste modtagelse |

### Relaterede emner
→ Se: Produktflags
→ Se: Foretrukken placering
→ Se: Warehouse Weight

---

## Stregkoder på produkter

### Hvad er det
Administration af alle stregkoder tilknyttet et produkt.

### Typer

| Type | Beskrivelse |
|------|-------------|
| **Primær stregkode** | Hoved-EAN — bruges ved alle scans |
| **Sekundær stregkoder** | Ældre eller alternative EAN-koder — genkendes alle |
| **Kolli-stregkode** | Registrerer X antal ved én scan |

### Tilføj stregkode
Admin → Produkt → Stregkoder → **Tilføj stregkode** → scan eller skriv EAN → gem.

Eller direkte fra terminalen: Produktinfo → scan ny stregkode → tilknyttes automatisk.

### Relaterede emner
→ Se: Kolli-stregkoder

---

## Kolli-stregkoder

### Hvad er det
En stregkode der repræsenterer et bestemt antal enheder. Én scan registrerer automatisk X stk.

### Eksempel
Kolli-stregkode på 12-pak øl = 12 stk. per scan. Modtageren scanner kassen én gang — systemet registrerer 12 stk.

### Opret kolli-stregkode
Admin → Produkt → Stregkoder → Tilføj kolli-stregkode → angiv EAN + antal per scan.

### Relaterede emner
→ Se: Stregkoder på produkter
→ Se: Produktinfo (Terminal)

---

## Produktflags

### Hvad er det
Boolske indstillinger der aktiverer særlig håndtering af en vare.

### Oversigt over alle flags

| Flag | Beskrivelse | Effekt i system |
|------|-------------|----------------|
| **Tillad dropshipment** | Varen kan sendes direkte fra leverandør | Aktiverer dropshipping-flow |
| **Skrøbelig** | Markér som skrøbelig | Advarsel vises under pakning |
| **Farliggods** | Særlig håndtering kræves | Særlig dokumentation ved forsendelse; kræver UN nr. |
| **Udløbsdato** | Varen er udløbsfølsom | Kræver dato ved modtagelse; FEFO aktiv |
| **Tving FIFO** | FIFO håndhæves strengt | Kan ikke plukkes fra nyere partier hvis ældre er tilgængelige |
| **Registrer serie nr** | Serienummer registreres | Kræver scan af serienummer under pakning |
| **Brug batch nr** | Batchnummer påkrævet | Kræver batchnummer ved modtagelse og pluk |
| **Tillad blanding af batch nr** | Blanding af batches i placering | Ellers: én batch per placering |
| **Administrer eksternt lager** | Ekstern lagerstyring | Lager styres udenfor SmartPack |

### Relaterede emner
→ Se: Ankomst — Batch/LOT-sporing (Terminal)
→ Se: Lagerrevision — LOT/Batch håndtering (Terminal)

---

## Foretrukken placering (Preferred Placement)

### Hvad er det
Indstilling der definerer hvilken hyldeplads en vare foretrækkes placeret på ved genopfyldning.

### Opsætning

| Indstilling | Effekt |
|-------------|--------|
| **Don't set** | Ingen foretrukken placering — angiv manuelt |
| **First Arrival** | Sæt ved første modtagelse (ændres ikke herefter) |
| **Last Arrival** | Opdatér til seneste modtagelsesplacering |

### Prioriteringsrækkefølge ved genopfyldning

1. Foretrukken placering
2. Eksisterende placeringer med varen
3. Tomme placeringer
4. Frie placeringer

### Troubleshooting — foretrukken placering bruges ikke

| Tjek | Detalje |
|------|---------|
| **FreeCm3** | Er der volumen-plads på placeringen? |
| **MaxItemsPrLocation** | Er max antal SKU'er nået for placeringen? |

### Via API
Feltet hedder `PreferredStockPlacementId`.

### Begrænsning
Foretrukken placering gælder **ikke** for totes eller refill-zoner — kun faste hyldeplaceringer.

### Relaterede emner
→ Se: Flyt Lager — Genopfyldningsliste (Terminal)
→ Se: Lagerdesigner

---

## Warehouse Weight (Lager-specifik vægt)

### Hvad er det
En separat vægt per produkt der bruges til interne lager- og forsendelsesfunktioner — uafhængigt af den normale produktvægt.

### Regler

| Regel | Beskrivelse |
|-------|-------------|
| Warehouse Weight > 0 | Bruges frem for normal produktvægt |
| Warehouse Weight = 0 | Systemet bruger normal produktvægt |
| Enhed | Angives i **gram** |
| Import | Via CSV |

### Hvornår bruges det
- Produkter med speciel emballage der ændrer vægten på lageret
- Varer der vejer forskelligt under transport vs. på lager

### Relaterede emner
→ Se: Produktdata — alle felter

---

## Lagerhistorik på produkt

### Hvad er det
Komplet historik over alle lagerændringer for ét specifikt produkt.

### Adgang
Admin → Produkter → Klik på et produkt → fanen **Historik**

### Hvad vises

| Data | Beskrivelse |
|------|-------------|
| **Tidsstempel** | Dato og tid for ændringen |
| **Årsag** | Årsagskode (pluk, ankomst, revision...) |
| **Antal** | Ændring i antal (+ eller −) |
| **Placering** | Hvilken hyldeplads |
| **Bruger** | Hvem foretog handlingen |
| **Ordre** | Tilknyttet ordrenummer hvis relevant |

### Andre faner på produktkortet

| Fane | Indhold |
|------|---------|
| **Placeringer** | Alle hyldepladser med antal, LOT, udløbsdato |
| **Lagre** | Oversigt per lager/lokation |
| **Ordreflyt** | Alle ordrebevægelser |
| **Reservationer** | Aktive reservationer og mangler |

### Relaterede emner
→ Se: Produktoversigt
→ Se: Batchsporing (Rapporter)

---

## Kostpris vs. Lageromkostning

### Hvad er det
To separate priskoncepter der bruges til forskellige formål i systemet.

### Sammenligning

| | **Kostpris** | **Lageromkostning** |
|---|---|---|
| **Kilde** | Synkroniseret fra e-handelsplatform | Beregnet fra indkøbsordrer |
| **Opdatering** | Synkroniseret fra integration | Automatisk, vægtet gennemsnit |
| **Inkluderer** | Ren indkøbspris | Indkøbspris + fragt + told + finansiering |
| **Primær brug** | Fallback ved ankomst uden PO | Lagerværdi og snapshots |

### Kostpris bruges som fallback ved

1. Ankomst uden tilknyttet indkøbsordre
2. Varelinje med pris 0 kr. på indkøbsordren

### ⚠️ Tip til gratis varer
Brug `0,01 kr.` på gratis varer i indkøbsordren hvis korrekt lagerværdi skal registreres.

### Relaterede emner
→ Se: Lager økonomi-oversigt
→ Se: Indkøbsordrer


---

# DEL 5 — INDKØB

---

## Indkøbsordrer — Kladde, åbne, afsluttede

### Hvad er det
SmartPacks indkøbsmodul til oprettelse og administration af indkøbsordrer til leverandører.

### Sti
Admin → Indkøb

### Sektioner

| Sektion | Beskrivelse |
|---------|-------------|
| **Kladde-ordrer** | Ordrer under udarbejdelse — ikke sendt |
| **Åbne ordrer** | Sendte ordrer der afventer levering |
| **Afsluttede ordrer** | Fuldt modtagne ordrer |

### Opret indkøbsordre

Alle felter i en indkøbsordre:

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Varer** | Søg og tilføj varer | Liste |
| **Leverandør** | Vælg eller opret leverandør | Valgmenu |
| **Modtager lokation** | Hvilken lagerlokation modtager varerne | Valgmenu |
| **Reference** | Internt referencenummer | Tekst |
| **Valuta** | Valgfri valuta per ordre | Valgmenu |
| **Ordredato** | Dato for ordreafgivelse | Dato |
| **Forventet levering** | Forventet ankomstdato | Dato |
| **Tillad underlevering** | Acceptér færre varer end bestilt | ✅ / ☐ |
| **Tillad overlevering** | Acceptér flere varer end bestilt | ✅ / ☐ |
| **Kostpris pr. produkt** | Angiv kostpris for denne ordre | Tal per linje |
| **Toldsats** | Toldsats for toldberegning | Procent |
| **Leveringsomkostninger** | Fragtomkostninger | Beløb |
| **Notat** | Intern note | Tekst |
| **Tillad forudsalg** | Varerne kan sælges allerede nu (presell) | ✅ / ☐ |

### Presell-aktivering
Sæt flueben i **"Tillad forudsalg"** per linje → tilgængeligt antal på shoppen inkluderer det bestilte antal.

→ Se: Presell (forudsalg)

### Relaterede emner
→ Se: Leverandøroversigt
→ Se: Ankomst — Opret ny (tilknyt indkøbsordre) (Terminal)

---

## Leverandøroversigt og prislister

### Hvad er det
Administration af leverandørdata og prislister i SmartPack.

### Sti
Admin → Indkøb → Leverandører

### Leverandørdata

| Felt | Beskrivelse |
|------|-------------|
| **Navn** | Leverandørens navn |
| **Kontaktoplysninger** | Adresse, email, telefon |
| **Forventet levering** | Standard leveringstid (dage) |
| **Minimum bestilling** | Minimumsordrestørrelse |
| **Valuta** | Faktureringsvaluta |

### Prisliste-import
Admin → Indkøb → Leverandører → **Upload prisliste**
Importer leverandørens prisliste i CSV-format. SmartPack matcher SKU og opdaterer kostpriser.

### Relaterede emner
→ Se: Indkøbsordrer
→ Se: Forecasting og ABC-analyse

---

## Forecasting og ABC-analyse

### Hvad er det
Indkøbsforslaget er et prognose- og optimeringsværktøj der hjælper med at beslutte hvad og hvornår der skal købes ind.

### Sti
Admin → Indkøb → Indkøbsforslag

### Indkøbsforslagets kolonner

| Kolonne | Beskrivelse |
|---------|-------------|
| **Status** | Udsolgt / Lav beholdning / OK / For meget på lager |
| **Lager** | Nuværende lagerantal |
| **Tilgængelig** | Fri lagerbeholdning + på vej hjem − reserveret |
| **Anbefalet lager** | Optimalt niveau ift. bindingsperiode |
| **Potentielt tab af omsætning** | Estimeret tabt salg ved udsolgt |
| **Potentielt tab af indtjening** | Estimeret tabt profit |
| **Anbefalet indkøb** | Foreslået antal at bestille |

### Filtre

| Filter | Muligheder |
|--------|-----------|
| **Kategori** | Filtrer til produktkategori |
| **Producent** | Filtrer til mærke |
| **Leverandør** | Filtrer til specifik leverandør |
| **ABC-kategori** | A / B / C |

### Forecasting-indstillinger

| Indstilling | Beskrivelse |
|-------------|-------------|
| **Analyseperiode** | Antal dage bagud der analyseres |
| **Analyse af historik fra året før** | Sæsonkorrektion — sammenlign med samme periode sidste år |
| **Ønsket lager-bindingsperiode** | Antal dage lager ønskes dækket |
| **OBS ved over X dages lagerbindingsperiode** | Advarselstærskel |
| **ABC fordeling i %** | Definer A/B/C grænser (standard: A=5%, B=10%, C=15%) |
| **Offset ift. vækst og tilbagegang** | Juster forecast op/ned med procent |

### ABC-analyse definition

| Kategori | Definition | Standard |
|----------|-----------|---------|
| **A-varer** | Bedste X% af omsætningsværdi | Øverste 5% |
| **B-varer** | Næste X% | Næste 10% |
| **C-varer** | Næste X% | Næste 15% |
| **D-varer** | Resten | Alt øvrigt |

### Planlagte funktioner (roadmap)
- Tag højde for udsolgte perioder i historikanalysen
- Separat analyse af B2B og B2C salg

### Relaterede emner
→ Se: Indkøbsordrer
→ Se: Presell (forudsalg)

---

## Presell (forudsalg)

### Hvad er det
Mulighed for at sælge varer der endnu ikke er ankommet til lageret. Det bestilte antal fra en indkøbsordre indgår i det tilgængelige antal på shoppen.

### Aktivering
Indkøbsordre → per varelinje: sæt flueben i **"Tillad forudsalg"**

### Effekt
`Tilgængeligt antal = Fri lagerbeholdning + Presell-antal`

### Ordrestatusser ved presell

| Status | Beskrivelse |
|--------|-------------|
| **Missing Items** | Varer mangler endnu — ikke på lager |
| **Purchased** | Indkøbsordre oprettet, varer på vej |
| **Purchased Delayed** | Forventet leveringsdato er overskredet |
| **Ready for Packing** | Alle varer modtaget — klar til pak |

### Shopify — leveringsdatoer som metafields
Leveringsdatoer kan sendes til Shopify via:
`smartpack.next_po_deliverydate_{location}`

### Relaterede emner
→ Se: Indkøbsordrer
→ Se: Forecasting og ABC-analyse

---

# DEL 6 — LAGER

---

## Lager — Status og reguleringer

### Hvad er det
Oversigt over og godkendelse af alle manuelle lagerreguleringer.

### Sti
Admin → Lager / Status → Reguleringer

### Kolonner i reguleringsoversigten

| Kolonne | Beskrivelse |
|---------|-------------|
| **Tid** | Hvornår reguleringen fandt sted |
| **Årsag** | Årsagskode |
| **Beskrivelse** | Tekstbeskrivelse |
| **Placering** | Hvilken hyldeplads |
| **Før** | Antal inden regulering |
| **Efter** | Antal efter regulering |
| **Bruger** | Hvem foretog reguleringen |
| **Rettelse** | Hvad der rettedes |

### Handlinger

| Handling | Beskrivelse |
|----------|-------------|
| **Godkend** | Godkend afventende regulering |
| **Se godkendte** | Historik over godkendte reguleringer |

### Konfiguration
Kræver reguleringer godkendelse af admin? → indstilles under Systemindstillinger.

### Relaterede emner
→ Se: Lagerrevision (Terminal)
→ Se: Revisionszoner og løbende optælling

---

## Revisionszoner og løbende optælling

### Hvad er det
Konfiguration af automatisk løbende optælling — regler der udløser optælling under pluk.

### Sti
Admin → Lager / Status → Revisionszoner → **Tilføj**

### Alle indstillingsfelter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Regelens navn til intern identifikation | Tekst |
| **Tæl alder fra dato** | Starttidspunkt for alderberegning | Dato |
| **Inkluder refill lager** | Medtag genopfyldningsplaceringer | ✅ / ☐ |
| **Åben automatisk status job** | Kør automatisk på skema | ✅ / ☐ |
| **Trigger dato ved gennemsnittsalder over** | Udløs revision når gns. lagersalder overskrider X dage | Tal |
| **Udløsningsregel** | Antal der udløser popup under pluk | Tal |
| **Udløser i alt lagermængde** | Kun udløs ved total lager-total, ikke per placering | ✅ / ☐ |
| **Max revisionsalder** | Minimumsinterval mellem revisioner (dage) | Tal |
| **Medarbejder cooldown** | Min. pause per medarbejder (minutter) | Tal |
| **Sektioner/Haller** | Inkluder/Ekskluder specifikke lagerafsnit | Liste |
| **Aktiv** | Er reglen aktiv | ✅ / ☐ |

### Relaterede emner
→ Se: Løbende optælling (Terminal)
→ Se: Lager — Status og reguleringer

---

## Lager økonomi-oversigt

### Hvad er det
Finansielle oversigter over lagerets samlede værdi og bevægelser.

### Sti
Admin → Produkter → Lager økonomi

### Visninger

| Visning | Beskrivelse |
|---------|-------------|
| **Samlet lagerværdi** | Total værdi af hele lageret |
| **Oversigt pr. dato** | Salgsomkostninger, indkøb, lagerværdireguleringer, revisioner, reserveret, lagerværdi |
| **Inventar og lagerplads** | Enheder, placeringer, total M², tomme placeringer (%), frie placeringer, frie M² |

### Relaterede emner
→ Se: Kostpris vs. Lageromkostning
→ Se: Lagerrapporter (Rapporter)


---

# DEL 7 — LAGERDESIGNER

---

## Lagerdesigner — Introduktion

### Hvad er det
Et visuelt kortlægningsværktøj der giver SmartPack et præcist kort over dit lagerlayout. Grundlag for ruteoptimering via A*-algoritmen.

### Sti
Admin → Lagerdesigner

### ⚠️ Browser-krav
Lagerdesigneren virker **ikke** i Chrome på Windows 8 eller ældre. Brug Microsoft Edge eller Windows 10+.

### Hvad defineres i designeren

| Element | Beskrivelse |
|---------|-------------|
| **Haller/Sektioner** | Overordnede zoner i lageret |
| **Gangveje** | Passager mellem reolrækker |
| **Reolrader** | Rækker af reoler |
| **Placeringer** | Individuelle hyldepladser |
| **Refill-lokationer** | Baglagerpladser til genopfyldning |
| **Blokeringer** | Vægge, søjler, forhindringer |

### Relaterede emner
→ Se: Optegning af lager (trin-for-trin)
→ Se: Reol og placeringsstruktur

---

## Optegning af lager (Trin-for-trin)

### Hvad er det
Komplet guide til at tegne lageret op i Lagerdesigneren.

### Trin-for-trin

1. Admin → Lagerdesigner
2. Tryk **Ny hal** → angiv navn og dimensioner
3. Tegn **ydervægge** ved at klikke og trække
4. Placer **gangveje** — definerer plukkeveje
5. Tilføj **reolrader** — drag-and-drop
6. Definer **placeringer** per reol:
   - Kolonnenavn (A, B, C...)
   - Rækkens navn (01, 02, 03...)
   - Niveau/etage (01=bund, 02=midterste, 03=top)
7. Sæt **dimensioner** per placering (bredde × højde × dybde cm)
8. Sæt **Max items per placering** (max antal SKU'er)
9. Gem designet
10. Test med **"Test historiske plukkeruter"**

### Video-guide
https://www.youtube.com/watch?v=GVhC5Y9kmVU

### Relaterede emner
→ Se: Reol og placeringsstruktur
→ Se: Test af historiske plukkeruter

---

## Reol og placeringsstruktur

### Hvad er det
Navngivningskonvention og strukturen for placeringer i lagerdesigneren.

### Navngivning

Et placeringsnavne bygges op som: `[Hal]-[Reol]-[Kolonne]-[Niveau]`

Eksempel: `A-01-01` = Hal A, Reol 1, Niveau 01 (bund)

### Niveauer
Niveau 01 = bund (lettest at plukke fra)
Niveau 02 = midterste
Niveau 03 = top

### Attributter per placering

| Attribut | Beskrivelse | Type |
|----------|-------------|------|
| **Navn** | Unikt placeringsid | Tekst |
| **Bredde** | cm | Tal |
| **Højde** | cm | Tal |
| **Dybde** | cm | Tal |
| **Max Items** | Max antal SKU'er på placeringen | Tal |
| **Max Cm3** | Maksimal volumen | Tal |
| **Refill** | Er dette en genopfyldningsplacering | ✅ / ☐ |
| **Sektion** | Tilhørende lagersektion | Tekst |

### Relaterede emner
→ Se: Lagerdesigner — Introduktion

---

## Refill-lokationer og sektioner

### Hvad er det
Specielle placeringer der fungerer som baglagerpladser — fyldes op og bruges til at genopfylde aktive plukpladser.

### Opsætning
Admin → Lagerdesigner → Placering → sæt **Refill = ✅**

### Sektioner
Sektioner er logiske grupper af placeringer (fx "Hal A", "Frys", "Køl"). Bruges til at filtrere plukkeprofiler.

### Relaterede emner
→ Se: Reol og placeringsstruktur
→ Se: Flyt Lager (Terminal)

---

## Test af historiske plukkeruter

### Hvad er det
Funktion i Lagerdesigneren til at simulere og visualisere plukkeveje baseret på historiske ordrer.

### Hvornår bruges det
- Validér at lagerdesignet er korrekt optegnet
- Optimer reol-layout for at minimere gangtid
- Fejlfinding ved uoptimale ruter

### Trin-for-trin
1. Admin → Lagerdesigner
2. Tryk **"Test historiske plukkeruter"**
3. Vælg datointerval for analysen
4. Systemet visualiserer ruternes faktiske længder

### Relaterede emner
→ Se: Lagerdesigner — Introduktion
→ Se: Pluk Ordrer — Generer plukliste (Terminal)

---

## Lagertegning er blank (Fejl)

### Hvad er det
En fejlsituation hvor Lagerdesigneren åbner men viser en tom/blank skærm.

### Årsag
Typisk browserproblem — ikke en serverfejl.

### Løsning

1. Ryd browser-cache (Ctrl+Shift+Del i Chrome/Edge)
2. Prøv en anden browser (Edge anbefales)
3. Kontrollér at Windows-version er 10 eller nyere

### Relaterede emner
→ Se: Lagerdesigner — Introduktion
→ Se: Browser-kompatibilitet

---

# DEL 8 — PLUKKEPROFILER

---

## Introduktion til plukkeprofiler

### Hvad er det
Plukkeprofiler er skabeloner der bestemmer hvordan pluklisterne genereres — hvilke ordrer der medtages, hvilken rute der beregnes, hvor mange ordrer der plukkes ad gangen, og meget mere.

### Sti
Admin → Plukkeprofiler → **Tilføj profil**

### Hvornår bruges det
Hver gang der genereres en plukliste vælger medarbejderen en profil. Systemet bruger profilens indstillinger til at udvælge og sortere ordrer.

### Eksempler på profiler

| Profil | Typisk opsætning |
|--------|-----------------|
| **Multipluks Ordre** | Op til 16 ordrer, totes, TSP-rute |
| **Runner** | 1-linje ordrer, ingen totes |
| **Masseprint** | Identiske ordrer, batch-print |
| **Priority** | Hasteliste, max prioritet |
| **Pickup** | Afhentningsordrer |
| **Transfer** | Interne overførsler |
| **3PL-Kunde A** | Eksklusiv profil for specifik 3PL-kunde |

### Profil-sektioner (fanerne)

| Fane | Indhold |
|------|---------|
| **Generelle indstillinger** | Navn, lager, prioritet, eksklusivitet |
| **Rute og liste** | Algoritme, max ordrer, totes |
| **Pakkeindstillinger** | Auto-print, følgeseddel, mål |
| **Produktprioritet** | Sortér pluk efter produkt-attributter |
| **Ordrefiltrering** | Filtrer ordrer der indgår |
| **Postnummer** | Filtrer på destination |
| **Produktfiltrering** | Filtrer på specifikke varer |
| **Kunder / Shops** | Filtrer på webshop/kilde |
| **Leveringsmetoder** | Filtrer på transportør |
| **Lokationer** | Filtrer på lagersektioner |
| **Ekskluder** | Ekskluder andre profiler |

### Relaterede emner
→ Se: Eksklusive plukkeprofiler

---

## Plukkeprofil — Generelle indstillinger

### Hvad er det
Grundlæggende indstillinger for profilen — navn, prioritet og eksklusivitet.

### Alle felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Synligt navn på terminalen | Tekst |
| **Aktiv** | Er profilen tilgængelig | ✅ / ☐ |
| **Lager** | Tilknyttet lagerlokation | Valgmenu |
| **Prioritet** | Rækkefølge ved automatisk tildeling | Tal |
| **Eksklusiv** | Fanger ordrer der matches — ses ikke på andre profiler | ✅ / ☐ |
| **Ordretype** | Standard / TransferOrder / POS | Valgmenu |
| **Tillad genopfyldningspluk** | Inkluder genopfyldningsvarer | ✅ / ☐ |
| **Prime plukliste** | Markér som høj prioritet i UI | ✅ / ☐ |
| **Manuel filter** | Medarbejder vælger specifikke ordrer | ✅ / ☐ |
| **Automatisk generering** | Generer automatisk på skema | ✅ / ☐ |
| **Notifikation** | Send notifikation ved specifikke hændelser | ✅ / ☐ |

### Relaterede emner
→ Se: Eksklusive plukkeprofiler
→ Se: Plukkeprofil til transfer ordre

---

## Plukkeprofil — Rute og listeindstillinger

### Hvad er det
Indstillinger der styrer ruteberegning og listeopbygning.

### Alle felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Plukkealoritme** | Punkter / Slange / TSM (Shortest Path) | Valgmenu |
| **Max ordrer per liste** | Maximalt antal forsendelser per plukliste | Tal |
| **Max varer per liste** | Max antal plukpunkter | Tal |
| **Max vægt** | Begrænset af medarbejder-max eller konfigureret grænse | Gram |
| **Max kubik** | Volumbegrænsning | Cm³ |
| **Max højde** | Max plukke-højde | Cm |
| **Brug totes** | Aktiver tote-scanning under pluk | ✅ / ☐ |
| **Max totes** | Max antal totes per liste | Tal |
| **Tillad delte totes** | Tillad at én tote bruges til flere ordrer | ✅ / ☐ |
| **Prioritér ordrer** | Sorteringsregler for ordreudvælgelse | Valgmenu |
| **Deadlines** | Tag hensyn til leverings-deadlines | ✅ / ☐ |
| **Prioritér gamle ordrer** | Ældste ordrer vælges først | ✅ / ☐ |

### Plukkealgoritmer

| Algoritme | Beskrivelse |
|-----------|-------------|
| **Punkter** | Besøg hvert plukpunkt i fast rækkefølge |
| **Slange** | Gå frem og tilbage ad rækkerne (slange-mønster) |
| **TSM (Shortest Path)** | Optimal rute beregnet via TSP-algoritme — kortest mulig vej |

### Relaterede emner
→ Se: Pluk Ordrer — Generer plukliste (Terminal)

---

## Plukkeprofil — Pakkeindstillinger

### Hvad er det
Indstillinger der styrer hvad der sker i pakningsprocessen for ordrer fra denne profil.

### Alle felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Auto-print label** | Print fragtlabel automatisk | ✅ / ☐ |
| **Auto-print følgeseddel** | Print følgeseddel automatisk | ✅ / ☐ |
| **Kræv dimensioner** | Mål skal indtastes | ✅ / ☐ |
| **Kræv vægt** | Vægt skal indtastes | ✅ / ☐ |
| **Fast Pack** | Aktivér Fast Pack-modus | ✅ / ☐ |
| **Afslut pakke (forsinkelse)** | Sekunder inden auto-afslutning | 0–5 sek. |
| **Pakkestation** | Tilknyt til specifik pakkestation | Valgmenu |
| **Scanbekræftelse** | Kræv scan af vare ved pakning | ✅ / ☐ |

### Relaterede emner
→ Se: Pakningsprocessen (Terminal)

---

## Plukkeprofil — Produktprioritet

### Hvad er det
Indstillinger der styrer i hvilken rækkefølge produkter plukkes — fx FIFO, udløbsdato eller brugerdefineret.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Produktprioritet** | Sortér pluk: Ingen / Udløbsdato / Ankomstdato / Brugerdefineret |
| **Prioritét-attribut** | Specificér attribut ved brugerdefineret sortering |

### Relaterede emner
→ Se: Ankomst — Batch/LOT-sporing (Terminal)

---

## Plukkeprofil — Ordrefiltrering

### Hvad er det
Regler der bestemmer hvilke ordrer der indgår i pluklister fra denne profil.

### Filtreringsregler

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Ordretyper** | Standard / POS / Transfer | Flervalg |
| **Minimum ordrealder** | Ordren skal være X timer gammel | Timer |
| **Maximum ordrealder** | Ordren må ikke være ældre end X timer | Timer |
| **Minimum antal linjer** | Ordren skal have mindst X linjer | Tal |
| **Maximum antal linjer** | Ordren må ikke have mere end X linjer | Tal |
| **Minimum antal enheder** | Totalt minimum antal produkter | Tal |
| **Maximum antal enheder** | Totalt maximum antal produkter | Tal |
| **Inkluder tags** | Ordren skal have dette tag | Tekst |
| **Ekskluder tags** | Ordren må ikke have dette tag | Tekst |
| **Trigger udtryk** | C# Lambda-filter på ordredata | C# Kode |

### Relaterede emner
→ Se: Plukkeprofil — Produktfiltrering

---

## Plukkeprofil — Postnummer, lande og kundenummer

### Hvad er det
Geografiske og kunderelaterede filtre.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Inkluder postnumre** | Komma-separeret liste af postnumre |
| **Ekskluder postnumre** | Postnumre der aldrig medtages |
| **Inkluder lande** | Alpha-2 landekoder |
| **Ekskluder lande** | Lande der ikke medtages |
| **Inkluder kundenumre** | Specifikke kundenumre |
| **Ekskluder kundenumre** | Kundenumre der ikke medtages |

### Eksempler

```
# Kun til Danmark og Sverige
Inkluder lande: DK, SE

# Kun til butik
Inkluder kundenumre: BUTIK

# Alle undtagen business-kunder
Ekskluder tags: B2B
```

### Relaterede emner
→ Se: Plukkeprofil — Ordrefiltrering

---

## Plukkeprofil — Produktfiltrering

### Hvad er det
Filtre der bestemmer hvilke produkter der inkluderes eller ekskluderes.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Inkluder SKU'er** | Kun ordrer med disse produkter |
| **Ekskluder SKU'er** | Ordrer med disse produkter medtages ikke |
| **Inkluder tags** | Produkter med disse tags |
| **Ekskluder tags** | Produkter med disse tags ekskluderes |
| **Inkluder kategorier** | Produktkategorier der medtages |

### Relaterede emner
→ Se: Plukkeprofil — Ordrefiltrering

---

## Plukkeprofil — Kunder / Shops

### Hvad er det
Filtrer pluklisten til specifikke webshops eller 3PL-kunder.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Inkluder shops** | Kun ordrer fra disse shops |
| **Ekskluder shops** | Ordrer fra disse shops medtages ikke |

### Typisk brug (3PL)
Opret én profil per 3PL-kunde med kundens shop som eksklusivt filter.

### Relaterede emner
→ Se: Eksklusive plukkeprofiler

---

## Plukkeprofil — Leveringsmetoder

### Hvad er det
Filtrer pluklisten til specifikke transportører og services.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Inkluder leveringsmetoder** | Kun ordrer med disse metoder |
| **Ekskluder leveringsmetoder** | Ordrer med disse metoder medtages ikke |

### Eksempel
En profil til udelukkende GLS pakkeshop-ordrer:
`Inkluder leveringsmetoder: gls_private_droppoint`

### Relaterede emner
→ Se: Leveringsmetoder — opsætning

---

## Plukkeprofil — Lokationer og lagersektioner

### Hvad er det
Begræns pluk til specifikke lagersektioner eller haller.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Inkluder sektioner** | Pluk kun fra disse sektioner |
| **Ekskluder sektioner** | Pluk aldrig fra disse sektioner |
| **Inkluder lokationer** | Specifikke placeringer |
| **Ekskluder lokationer** | Placeringer der aldrig plukkes fra |

### Relaterede emner
→ Se: Lagerdesigner — Refill-lokationer og sektioner

---

## Plukkeprofil — Ekskluder profiler

### Hvad er det
Angiv andre profiler der ikke må indeholde de samme ordrer som denne profil.

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Ekskluder profiler** | Liste af profiler der ekskluderer ordrer der er i denne profil |

### Bemærk
Brug **Eksklusive plukkeprofiler** frem for denne mekanisme — det er den anbefalede tilgang.

### Relaterede emner
→ Se: Eksklusive plukkeprofiler

---

## Eksklusive plukkeprofiler

### Hvad er det
System hvor profiler evalueres i prioritetsrækkefølge og "fanger" matchende ordrer — disse ses ikke på profiler med lavere prioritet.

### Systemlogik

1. Alle eksklusive profiler sorteres: **højeste prioritet øverst**
2. Én ordre evalueres mod profil med højeste prioritet
3. Matcher: ordren **fanges** — vises kun på denne profil
4. Matcher ikke: evalueres mod næste profil
5. Profiler uden eksklusivitet viser altid alle ikke-fangede ordrer

### Opsætning
Admin → Plukkeprofil → Generelle indstillinger → **Eksklusiv = ✅**

### Eksempel

| Profil | Prioritet | Eksklusiv | Resultat |
|--------|-----------|-----------|---------|
| Singlelines (max 1 linje) | 90 | ✅ | Fanger 70 af 100 ordrer |
| Alle ordrer | 0 | Nej | Viser de resterende 30 |

### Best practice
Brug eksklusive profiler frem for manuelle ekskluderinger — lettere at vedligeholde og mere forudsigeligt.

### Relaterede emner
→ Se: Introduktion til plukkeprofiler
→ Se: Plukstrategi — Eksklusive profiler (Terminal)

---

## Plukkeprofil til transfer ordre

### Hvad er det
En særlig plukkeprofil konfigureret specifikt til interne lageroverførsler.

### Konfiguration

| Felt | Værdi |
|------|-------|
| **Ordretype** | TransferOrder |
| **Kildelokation** | Vælg kildelokation |
| **Destinationslokation** | Vælg modtagerlokation |

### Relaterede emner
→ Se: Transfer ordre — komplet guide
→ Se: Eget lagerflyt

---

## Eget lagerflyt

### Hvad er det
Opsætning af en leveringsmetode til interne lagerflytninger.

### Opsætning (kræves én gang)

1. Opret leveringsmetode:
   - Udbyder: `template`
   - Nøgle: `Eget Lagerflyt`
2. Opret plukkeprofil med ordretype **TransferOrder** og kildelokation

### Relaterede emner
→ Se: Transfer ordre — komplet guide
→ Se: Leveringsmetoder — opsætning


---

# DEL 9 — SORTERINGSZONER

---

## Sorteringszoner — Komplet guide

### Hvad er det
Sorteringszoner automatiserer sortering af pakker til rigtig transportør/afhentningszone baseret på regler. En pakke evalueres mod regler og tildeles en zone.

### Sti
Admin → Indstillinger → Sorteringszoner

### Hvad en sorteringszone indeholder

| Element | Beskrivelse |
|---------|-------------|
| **Zonenavn** | Visningsnavn (vises på terminal) |
| **Prioritet** | Evalueringsrækkefølge (lavest = højest prioritet) |
| **Regler** | Betingelser der skal opfyldes for tildeling |
| **Deadline** | Seneste tidspunkt for afsendelse fra zonen |
| **Cut-off** | Seneste tidspunkt for modtagelse af ordrer til zonen |

### Regler — alle typer

| Regeltype | Beskrivelse | Eksempel |
|-----------|-------------|---------|
| **Leveringsmetode** | Match på transportør/service | `gls_private_droppoint` |
| **Land** | Modtagerland (Alpha-2) | `DK`, `SE`, `DE` |
| **Postnummer** | Specifikt postnummer eller interval | `2300`, `1000-1999` |
| **Varevægt** | Ordrevægt over/under grænse | `< 5000g` |
| **Tag** | Ordretag | `B2B` |
| **Tidspunkt** | Ordren modtaget inden/efter klokkeslæt | `< 14:00` |
| **Ordretype** | Standard / POS / Transfer | `Standard` |

### Regelevaluering
Reglerne evalueres med **AND-logik** inden for en zone: ALLE regler skal matche.
Flere zoner evalueres i **prioritetsrækkefølge** — første match vinder.

### Deadlines og cut-off

| Begreb | Beskrivelse |
|--------|-------------|
| **Deadline** | Seneste afsendelsestidspunkt fra zonen (fx 14:30) |
| **Cut-off** | Seneste ordremodtagelse til at nå deadline (fx 14:00) |
| **Over deadline** | Ordren markeres — bør håndteres manuelt |

### Eksempel: Komplet sorteringszoneopsætning

```
Zone: GLS Pakkeshop DK
  Prioritet: 10
  Regler:
    - Leveringsmetode = gls_private_droppoint
    - Land = DK
  Deadline: 14:30
  Cut-off: 14:00

Zone: GLS Erhverv DK
  Prioritet: 20
  Regler:
    - Leveringsmetode = gls_business_delivery
    - Land = DK
  Deadline: 15:00
  Cut-off: 14:30

Zone: International
  Prioritet: 99
  Regler:
    - Land != DK (alle lande undtagen DK)
  Deadline: 13:00
  Cut-off: 12:30
```

### Best practice
- Hold prioritetsnumre med god afstand (10, 20, 30) — let at indsætte nye zoner
- Opret altid en "fang alle" zone med højest prioritetsnummer
- Dokumentér cut-off-tider og kommunikér dem til lagerteamet

### Relaterede emner
→ Se: Scan til Palle (Terminal)
→ Se: End-of-day / Waybill (Admin)

---

# DEL 10 — LEVERINGSMETODER

---

## Leveringsmetoder — Opsætning

### Hvad er det
Opsætning af fragtintegrationer og leveringsmetoder i SmartPack.

### Sti
Admin → Leveringsmetoder

### Opret leveringsmetode

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Visningsnavn | Tekst |
| **Udbyder** | Fragtfirma (gls, postnord, bring, template...) | Valgmenu |
| **Method key** | Teknisk nøgle der matches med webshop | Tekst |
| **Aktiv** | Er metoden aktiv | ✅ / ☐ |
| **Test-tilstand** | Brug testmiljø | ✅ / ☐ |
| **API-nøgler** | Fragtfirmaets loginoplysninger | Felter per udbyder |
| **Tracking URL** | URL-skabelon til tracking | URL-template |
| **Addons** | Tilvalg fra fragtfirmaet | Per udbyder |

### Method keys — vigtige eksempler

| Transportør | Service | Method Key |
|-------------|---------|-----------|
| GLS | Erhvervslevering | `gls_business_delivery` |
| GLS | Hjemmelevering | `gls_private_delivery` |
| GLS | FlexDelivery | `gls_flex_delivery` |
| GLS | Forced Deposit | `gls_private_delivery_deposit` |
| GLS | Pakkeshop | `gls_private_droppoint` |
| GLS | ShopReturn | `gls_shop_return` |
| GLS | ShopReturn QR | `gls_shop_return_qr` |
| GLS | Return Pickup | `gls_return_pickup` |
| PostNord | Erhvervslevering | `postnord_business_delivery` |
| Intern flyt | Eget lager | `Eget Lagerflyt` |
| Afhentning | Pickup | `shopify_custom_dk` (standard) |

### Relaterede emner
→ Se: GLS (integrationer.md)
→ Se: PostNord (integrationer.md)
→ Se: Shop Checkout konfiguration

---

## Leveringspris konfiguration

### Hvad er det
Definition af prisniveauer for forsendelse baseret på vægt og mål.

### Sti
Admin → Leveringsmetoder → Leveringspriser

### Alle felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Prisniveauets navn | Tekst |
| **Land** | Gælder for dette land | Alpha-2 |
| **Max længde** | Maks. pakkelængde | mm |
| **Max længde + omkreds** | Maks. samlet mål (L + 2×B + 2×H) | mm |
| **Max vægt** | Maks. pakkevægt | Gram |
| **Pris** | Fragtpris for dette interval | Beløb |

### Relaterede emner
→ Se: Leveringsmetoder — Opsætning

---

## Shop Checkout konfiguration

### Hvad er det
Konfiguration af hvilke leveringsmetoder der præsenteres for kunder i webshoppens checkout.

### Sti
Admin → Shop Checkout

### Opret checkout-mulighed — alle felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Visningsnavn i checkout | Tekst |
| **Beskrivelse** | Vist under navn på shoppen | Tekst |
| **Sortering** | Rækkefølge i checkout | Tal |
| **Leveringsmetode** | Tilknyt SmartPack-leveringsmetode | Valgmenu |
| **Max resultater** | Maks. pakkeshops/drop points vist | Tal |
| **Inkluder lande** | Geografisk tilgængelighed | Alpha-2 liste |
| **Ekskluder lande** | Lande der ekskluderes | Alpha-2 liste |
| **Pris** | Pris vist til kunden | Beløb |
| **Valutakode** | Valuta for prisen | ISO 4217 |

### Formel til betinget pris

Brug formler til dynamisk prissætning i checkout:

```
# Gratis fragt ved køb over 500 kr. og under 35 kg
price >= 500 and weight < 35000

# Kun til specifikke postnumre
recipient.zipcode in '2300', '2500' and not recipient.email like '@company.com'

# Ordrer med over 10 varer, alle over 100 kr.
items.count > 10 and items all price > 100
```

### Relaterede emner
→ Se: Leveringsmetoder — Opsætning

---

# DEL 11 — MEDARBEJDERE

---

## Medarbejderadministration

### Hvad er det
Komplet oversigt over alle medarbejdere med mulighed for oprettelse, redigering og deaktivering.

### Sti
Admin → Medarbejdere

→ Se: Opret / Rediger medarbejder (Del 1)
→ Se: Roller og rettigheder (Del 1)

---

## Arbejdsplaner

### Hvad er det
Konfiguration af medarbejdernes arbejdstider til rapportering og kapacitetsplanlægning.

### Sti
Admin → Medarbejdere → Arbejdsplaner

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Plansnavn** | Navn på arbejdsplanen |
| **Dage** | Mandag–Søndag |
| **Start** | Starttidspunkt per dag |
| **Slut** | Sluttidspunkt per dag |
| **Pause** | Pausetid i minutter |

### Relaterede emner
→ Se: Employee Performance Dashboard

---

# DEL 12 — KUNDER (3PL)

---

## Kundeoversigt

### Hvad er det
Administration af 3PL-kunder — virksomheder der bruger dit lager til deres eget varesortiment.

### Sti
Admin → Kunder

### Kundedata

| Felt | Beskrivelse |
|------|-------------|
| **Firmanavn** | Kundens officielle navn |
| **Adresse** | Firmaadresse |
| **CVR** | Registreringsnummer |
| **Kontaktperson** | Primær kontakt |
| **Email** | Fakturering og kommunikation |
| **Telefon** | Kontaktnummer |
| **Lager** | Tilknyttet lager (delt/eget) |
| **Webhooks** | URL til webhook-notifikationer |
| **HMAC Secret** | Sikkerhedsnøgle til webhook-signering |

### Lagertyper

| Type | Beskrivelse |
|------|-------------|
| **Fælles lager** | Kundens varer er på samme lager som andre kunder |
| **Delt lager** | Kundens varer er adskilt i separate sektioner |
| **Eget lager** | Kunden har dedikeret lager |

### Relaterede emner
→ Se: 3PL Prissætning
→ Se: Valutakurs — overstyring

---

## Valutakurs — Overstyring

### Hvad er det
Mulighed for at oversætte priser til en anden valuta per 3PL-kunde.

### Hvornår bruges det
3PL-kunder der faktureres i en anden valuta end systemets basisvaluta.

### Opsætning
Admin → Kunder → vælg kunde → **Valutakurse** → tilføj overstyring.

### Relaterede emner
→ Se: 3PL Prissætning

---

## 3PL Prissætning

### Hvad er det
Konfiguration af faktureringsgrundlag for 3PL-kunder. Alt prissættes per kundelager.

### Sti
Admin → Lager/Kunde → Prissætning

### Prisstrukturer — alle felter

| Pris | Beskrivelse | Type |
|------|-------------|------|
| **Valuta** | Faktureringsvaluta | ISO 4217 |
| **Moms** | Momssats | Procent |
| **Ad hoc timepris** | Timepris for ekstra arbejde | Beløb |
| **Fakturagebyr** | Fast gebyr per faktura | Beløb |
| **Ordrepris** | Fast pris per behandlet ordre | Beløb |
| **Pakkepris** | Fast pris per pakket forsendelse | Beløb |
| **Plukkepris** | Pris per plukket varelinje | Beløb |
| **Plukprisregel** | Differentierede plukkeprisregler | Regler |

### Lagerpladspriser

| Indstilling | Beskrivelse | Type |
|-------------|-------------|------|
| **M² pris** | Pris per kvadratmeter lagerplads | Beløb |
| **Rabat M² pris** | Rabateret M²-pris ved volumen | Beløb |
| **Låst M²** | Garanteret antal M² uanset faktisk brug | Tal |
| **Autotrim luft** | Fjerner automatisk "luftpladser" i M²-opgørelse | ✅ / ☐ |

### Interne kostpriser

| Post | Beskrivelse | Type |
|------|-------------|------|
| **Lønomkostninger** | Intern timeomkostning | Beløb/time |
| **Lagerleje kostpris** | Intern lagerleje per M² | Beløb/M² |
| **Pakke kostpris** | Intern pakkeomkostning | Beløb |

### Relaterede emner
→ Se: Kundeoversigt


---

# DEL 13 — RAPPORTER

---

## Lagerrapporter og historikvisninger

### Hvad er det
SmartPack tilbyder seks typer lagerhistorik-rapporter til revision, analyse og eksport.

### Sti
Admin → Rapporter

### De seks rapporttyper

| Rapport | Beskrivelse |
|---------|-------------|
| **Lagerhistorik** | Alle lagerbevægelser i perioden (ind/ud/regulering) |
| **Ordrehistorik** | Alle behandlede ordrer med detaljer |
| **Ankomsthistorik** | Alle varemodtagelser |
| **Plukhistorik** | Alle plukkede ordrer per medarbejder |
| **Pakkehistorik** | Alle pakkede forsendelser |
| **Reguleringshistorik** | Alle manuelle lagerreguleringer |

### Fælles filtreringsmuligheder

| Filter | Muligheder |
|--------|-----------|
| **Dato** | Fra / Til |
| **Lager** | Alle / Specifikt |
| **Bruger** | Alle / Specifik medarbejder |
| **SKU** | Specifik vare |
| **Shop** | Alle / Specifik shop |

### CSV-eksport
Alle rapporter kan eksporteres til CSV.

⚠️ CSV-format afhænger af CultureInfo-indstilling:
- `da-DK`: semikolon som separator
- `en-US`: komma som separator

→ Se: CSV-separator (CultureInfo)

### Relaterede emner
→ Se: Batchsporing
→ Se: Serienummersporing

---

## Batchsporing

### Hvad er det
Sporingsværktøj der viser hele rejsen for et specifikt batchnummer — fra modtagelse til forsendelse til slutkunde.

### Sti
Admin → Kunder → Batchsporing

### Søg på

| Søgetype | Eksempel |
|----------|---------|
| **Batchnummer / Lotnummer** | `LOT-2024-001` |
| **SKU** | `SKU-001` |
| **Datointerval** | `01-01-2024 – 31-03-2024` |

### Hvad vises

| Data | Beskrivelse |
|------|-------------|
| **Ankomstdato** | Hvornår batchen kom ind |
| **Antal modtaget** | Antal enheder i batchen |
| **Placeringer** | Alle hyldepladser batchen har været på |
| **Ordrelinjer** | Alle ordrer der har plukket fra batchen |
| **Forsendelsesdata** | Track & trace, afsendelsesdato, modtager |

### Relaterede emner
→ Se: Ankomst — Batch/LOT-sporing (Terminal)
→ Se: Lagerrevision — LOT/Batch håndtering (Terminal)

---

## Serienummersporing

### Hvad er det
Sporingsværktøj der finder hvilken ordre et specifikt serienummer er afsendt med.

### Sti
Admin → Rapporter → Serienummersporing

### Søg på
Serienummeret (præcis match eller delvist match).

### Hvad vises

| Data | Beskrivelse |
|------|-------------|
| **Serienummer** | Det eftersøgte serienummer |
| **SKU** | Tilhørende produkt |
| **Ordrenummer** | Ordren det blev afsendt med |
| **Afsendelsesdato** | Hvornår det forlod lageret |
| **Modtager** | Kundens navn og adresse |
| **Track & trace** | Forsendelseslink |

### Relaterede emner
→ Se: Produktflags (Registrer serie nr)
→ Se: Pakningsprocessen — Fast Pack (Terminal)

---

# DEL 14 — STAMDATA

---

## Totes og plukkekasser

### Hvad er det
Administration af totes (plukkekasser) der bruges under pluk.

### Sti
Admin → Stamdata → Totes

### Felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Tote-ID** | Unikt ID (bruges i `t_`-stregkoden) | Tekst |
| **Navn** | Visningsnavn | Tekst |
| **Maksimal vægt** | Begrænser hvad der lægges i toten | Gram |
| **Maksimal volumen** | Volumbegrænsning | Cm³ |
| **Aktiv** | Om toten er i drift | ✅ / ☐ |

### QR-koder til totes
Video: https://www.youtube.com/watch?v=Z_JamyxxxLI

### Relaterede emner
→ Se: Aktiv plukning — Vogn og tote (Terminal)

---

## Emballage og pakketyper

### Hvad er det
Registrering af de emballagetyper der bruges til forsendelse.

### Sti
Admin → Stamdata → Emballage

### Felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Emballage-navn | Tekst |
| **Bredde** | Indre bredde | mm |
| **Længde** | Indre længde | mm |
| **Højde** | Indre højde | mm |
| **Egenvægt** | Emballagens vægt | Gram |
| **Standard** | Bruges som default | ✅ / ☐ |

### Emballagedata (compliance)
SmartPack registrerer emballagemængde til brug ved emballage-lovgivningsrapportering (DE, FR og andre lande med krav).

### Relaterede emner
→ Se: Pakningsprocessen (Terminal)

---

## Vogne

### Hvad er det
Registrering af rullevogne til brug under plukning.

### Sti
Admin → Stamdata → Vogne

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Vogn-ID** | Unikt ID (`tr_`-stregkoden) |
| **Navn** | Visningsnavn |
| **Max totes** | Antal totes vognen rummer |

### Relaterede emner
→ Se: Aktiv plukning — Vogn og tote (Terminal)

---

## Printere

### Hvad er det
Oversigt over alle printere der er registreret via Printservice.

### Sti
Admin → Stamdata → Printere

### Hvad vises

| Kolonne | Beskrivelse |
|---------|-------------|
| **Navn** | Printerens visningsnavn |
| **Status** | Online / Offline |
| **Type** | Label / Etiket / A4 |
| **Sidst set** | Seneste online-tidspunkt |

### Relaterede emner
→ Se: Printservice — Opsætning (Windows) (Terminal)
→ Se: Printerindstillinger (Terminal)

---

## Enhedstyper

### Hvad er det
Konfiguration af målenheder der bruges for produkter.

### Sti
Admin → Stamdata → Enhedstyper

### Standardtyper

| Enhed | Beskrivelse |
|-------|-------------|
| **Stk** | Hel enhed — kan ikke sælges i decimaler |
| **Ltr** | Liter — kan sælges i 0,1 |
| **Meter** | Meter — kan sælges i 0,1 |

---

# DEL 15 — RETURPORTAL

---

## Returportal — Opsætning

### Hvad er det
SmartPacks selvbetjenings-returportal hvor kunder kan initiere returer uden at kontakte kundeservice.

### Sti
Admin → Indstillinger → Returportal

### Status
Beta — tilgængelig til Shopify-integration.

### Opsætningsfelter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Aktiv** | Er returportalen aktiv | ✅ / ☐ |
| **Returportal URL** | Den offentlige URL kunder tilgår | Tekst |
| **Returneres til** | Standardlager for returvarer | Valgmenu |
| **Logo** | Upload logo til returportal | Upload |
| **Primærfarve** | Brandfarve | Hexkode |
| **Returperiode** | Antal dage fra køb (returret) | Tal |
| **Automatisk kreditering** | Kreditér automatisk ved Shopify | ✅ / ☐ |

### Integrationer
- **Shopify V2**: fuld integration — returer synkroniseres to-vejs

### Relaterede emner
→ Se: Alternativ returadresse
→ Se: Returårsager og -handlinger

---

## Alternativ returadresse

### Hvad er det
Mulighed for at definere en anden adresse end lageradressen som returadresse for kunder.

### Opsætning
Admin → Indstillinger → Returportal → **Alternativ returadresse**

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Firmanavn** | Alternativt firmanavn |
| **Adresse** | Fuld returadresse |
| **Postnummer** | |
| **By** | |
| **Land** | Alpha-2 |

### Relaterede emner
→ Se: Returportal — Opsætning

---

## Returårsager og -handlinger

### Hvad er det
Konfiguration af de returnationsårsager og handlinger kunden kan vælge i returportalen.

### Returårsager (eksempler)

| Årsag | Beskrivelse |
|-------|-------------|
| Forkert størrelse | Kunden vil have anden størrelse |
| Defekt vare | Varen er beskadiget |
| Fortryder købet | Fortrydelsesret |
| Forkert vare modtaget | Fejlplukning |
| Anden årsag | Fritekst |

### Returhandlinger

| Handling | Beskrivelse |
|----------|-------------|
| **Refusion** | Pengene tilbage til betalingsmetoden |
| **Butikkredit** | Kredit til brug i butikken |
| **Gavekort** | Gavekort af tilsvarende beløb |
| **Ombytning** | Ombyt til anden variant/størrelse |

### Fejl: Kunde kan ikke vælge anden variant
**Årsag:** External ID-mismatch mellem SmartPack og Shopify.
**Løsning:** Slet External ID på produktet → genstart SmartPack → kør Full Sync.

### Relaterede emner
→ Se: Retur — Returtyper (Terminal)
→ Se: Retur — Modtagelse af returpakke (Terminal)

---

# DEL 16 — WORKFLOWS

---

## Workflows — Komplet guide

### Hvad er det
Et JavaScript-baseret automatiseringsmodul der lader dig manipulere ordredata **inden** de oprettes eller opdateres i SmartPack.

### Sti
Admin → Indstillinger → Workflows

### Hvornår bruges det
- Tving bestemt fragtmetode på ordrer med specifikt ordrenummer
- Fjern eller tilføj produkter automatisk
- Ændr leveringsadresse baseret på regler
- Sæt kommentarer automatisk

### Workflow-indstillinger

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Workflowets interne navn | Tekst |
| **Index** | Kørselsrækkefølge (0 køres først) | Tal |
| **Aktiv** | Er workflowet aktiveret | ✅ / ☐ |
| **Trigger** | Hvornår workflowet kører | Valgmenu |
| **Trigger Expression** | C# Lambda der bestemmer HVILKE ordrer der matches | C# |
| **JavaScript kode** | Den faktiske manipulation | JavaScript |

### Triggers

| Trigger | Hvornår |
|---------|---------|
| **Før ordren oprettes** | Inden SmartPack gemmer den nye ordre |
| **Før ordren opdateres** | Inden SmartPack gemmer en opdatering |
| **Efter ordren oprettes** | Direkte efter oprettelse |
| **Efter ordren opdateres** | Direkte efter opdatering |

### Trigger Expression (C# Lambda)
Bruges til at begrænse hvilke ordrer der køres igennem workflowet.

```csharp
// Kør kun på ordrer med "B2B" i ordrenummeret
order.orderNo.Contains("B2B")

// Kør kun på ordrer med kundekommentar
customerComment != ""

// Kør kun på ordrer til Danmark
order.deliveryAddress.country == "DK"
```

### JavaScript-kode
Den faktiske manipulation af ordren skrives som JavaScript.

```javascript
// Tving PostNord erhvervslevering på B2B-ordrer
if (order.orderNo.includes("B2B")) {
  order.deliveryMethod = "postnord_business_delivery";
}

// Sæt PNDK hvis leveringsmetode er "none"
if (order.deliveryMethod === "none") {
  order.deliveryMethod = "PNDK";
}
```

### Preview-URL
Test dit workflow på en specifik ordre:
`https://ditlager.smartpack.dk/Admin/Workflows?preview=ORDERID`

### Index-rækkefølge
Workflows køres i stigende index-rækkefølge:
`0 → 1 → 2 → 10` osv.

### Hvad kan ændres
- Leveringsmetode
- Produkter (tilføj/fjern)
- Antal
- Modtageradresse
- Kommentarer
- Tags

### Best practice
- Brug altid **Trigger Expression** for at begrænse ressourceforbrug
- Test med preview-URL inden aktivering
- Hold index-numre med god afstand

### AI-assisteret kode
SmartPack understøtter AI-konvertering af beskrivelse til JavaScript — beskriv hvad workflowet skal gøre i tekst, og systemet foreslår koden.

### Relaterede emner
→ Se: Plukkeprofil — Ordrefiltrering
→ Se: POS / Kasse Flow


---

# DEL 17 — E-MAILS OG SKABELONER

---

## Email-skabeloner — Komplet opsætning

### Hvad er det
Opsætning og administration af automatiske emails der sendes til kunder ved forsendelse, retur og dropshipping.

### Sti
Admin → E-mails → **Tilføj e-mailskabelon**

### Skabelontyper

| Type | Hvornår brugt |
|------|--------------|
| **Forsendelse** | Afsendelsesbekræftelse med track & trace |
| **Dropshipping** | Send fragtlabel til leverandør, eller bekræftelse til kunde |
| **Retur** | Send returlabel til kunden |

### Alle indstillingsfelter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Skabelonnavn** | Internt genkendeligt navn | Tekst |
| **Type** | Forsendelse / Dropshipping / Retur | Valgmenu |
| **Aktiv** | Skabelonen evalueres | ✅ — skal være markeret |
| **I brug** | Skabelonen sender emails | ✅ — skal **også** være markeret |
| **Prioritet** | Evalueringsrækkefølge ved overlappende filtre | Tal (højest = first) |
| **Afsendernavn match** | Filter: kun ordrer med dette afsendernavn | Tekst |
| **Trigger udtryk** | C# Lambda-filter (fx specifik SKU) | C# |
| **Modtagere (kopi)** | BCC-modtagere separeret med semikolon | Email-liste |
| **Ignorer primær modtager** | Send KUN til BCC — ikke til kunden | ✅ / ☐ |

### ⚠️ KRITISK: Begge flueben skal være markeret
**Aktiv** + **I brug** skal begge være markeret for at mailen sendes.
Kun "Aktiv" = evalueres men sendes ikke.

### Leveringsmetode- og landefiltre
- Filtrer på specifik leveringsmetode (fx kun PostNord-ordrer)
- Filtrer på land (Alpha-2 koder)
- Kombinér filtre for skræddersyede flows per land og transportør

### Labels og følgesedler i emails
- PDF-labels kan vedhæftes automatisk
- Følgesedler kan vedhæftes
- Skabelonerne bruger Liquid template-sprog til dynamiske variabler

### BCC-brug
Modtagere i kopifeltet modtager mailen som BCC. Bruges til:
- Trustpilot-invitationer
- Email-marketing flows
- Interne notifikationer

### Eksempel: Send kun til leverandør, ikke kunden
1. Opret Dropshipping-skabelon
2. Udfyld leverandørens email i **Modtagere (kopi)**
3. Aktivér **Ignorer primær modtager**

### Relaterede emner
→ Se: SMTP-opsætning
→ Se: Gensend afsendelsesmail

---

## Følgeseddel-skabeloner

### Hvad er det
Opsætning af automatiske følgesedler der printes ved pakning.

### Sti
Admin → Følgesedler

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Navn** | Skabelonens navn |
| **Aktiv** | Er skabelonen aktiv |
| **Trigger** | Hvornår printes følgesedlen |
| **Printer** | Vælg printer (A4) |
| **Papirtype** | A4 / Tilpasset |
| **Indhold** | Konfigurér via model-data (variabler) |

### Relaterede emner
→ Se: Stregkode-/labelskabeloner

---

## Stregkode-/labelskabeloner

### Hvad er det
Opsætning af stregkode-labels og vareetiketter med tilpasset design.

### Sti
Admin → Stregkoder

### Felter

| Felt | Beskrivelse |
|------|-------------|
| **Navn** | Skabelonens navn |
| **Printer** | Vælg etiketprinter |
| **Papirstørrelse** | Dymo S0722370 / Tilpasset størrelse |
| **Indhold** | Konfigurér via model-data |
| **Trigger** | Hvornår printes labelen |

### Relaterede emner
→ Se: Printservice — Opsætning (Windows) (Terminal)

---

## SMTP-opsætning

### Hvad er det
Konfiguration af den mailserver SmartPack bruger til at sende emails.

### Sti
Admin → Indstillinger → SMTP

### Krav

| Felt | Eksempel |
|------|---------|
| **SMTP Server** | `smtp.gmail.com` |
| **Port** | `587` (TLS) eller `465` (SSL) |
| **Brugernavn** | `afsender@dinvirksomhed.dk` |
| **Adgangskode** | App-adgangskode (ikke normal kodeord) |
| **Fra-navn** | `Webshop Navn` |
| **Fra-email** | `ordre@dinvirksomhed.dk` |
| **Kryptering** | TLS / SSL |

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Emails sendes ikke | Kontrollér port + kryptering |
| Auth-fejl | Brug app-adgangskode (Gmail: 2FA kræves) |
| Timeout | Tjek firewall ikke blokerer SMTP-porten |

### Relaterede emner
→ Se: Email-skabeloner — komplet opsætning

---

# DEL 18 — SYSTEMINDSTILLINGER

---

## Systemindstillinger — Oversigt

### Hvad er det
Global konfiguration af SmartPack-installationen.

### Sti
Admin → Indstillinger → Systemindstillinger

### Nøgleindstillinger

| Indstilling | Beskrivelse | Type |
|-------------|-------------|------|
| **Firmanavn** | Vises i emails og dokumenter | Tekst |
| **Standardvaluta** | Systemets basisvaluta | ISO 4217 |
| **Tidzone** | Systemets tidszone | Valgmenu |
| **Sprog** | Admin-interface sprog | Valgmenu |
| **CultureInfo CSV** | CSV-separator (da-DK = `;` / en-US = `,`) | Valgmenu |
| **Kræv regulering godkendelse** | Admin skal godkende reguleringer | ✅ / ☐ |
| **Aktive terminal-apps** | Hvilke apps vises på terminalen | Flervalg |
| **Restart Application** | Genstart SmartPack-applikationen | Knap |

### Relaterede emner
→ Se: Genstart SmartPack
→ Se: CSV-separator (CultureInfo)

---

## Genstart SmartPack

### Hvad er det
Funktion til at genstarte SmartPack-applikationen uden at kontakte hosting.

### Hvornår bruges det
- Efter ændring af systemindstillinger der kræver genstart
- Ved vedvarende systemfejl eller baglås

### Sti
Admin → Indstillinger → Systemindstillinger → **Restart Application**

### ⚠️ Bemærk
Genstart afbryder alle aktive sessioner kortvarigt. Planlæg til lav-aktivitetsperiode.

### Typiske fejl
| Fejl | Løsning |
|------|---------|
| Systemet reagerer slet ikke | Kontakt support: support@smartpack.dk |

### Relaterede emner
→ Se: Terminal lader eller fryser (Terminal)

---

## Lokationer

### Hvad er det
Administration af de fysiske lagerlokationer SmartPack arbejder med.

### Sti
Admin → Indstillinger → Lokationer

### Felter

| Felt | Beskrivelse | Type |
|------|-------------|------|
| **Navn** | Lokationens navn | Tekst |
| **Adresse** | Fuld adresse | Adresse |
| **Lagertype** | Primær / Sekundær / Transfer | Valgmenu |
| **Aktiv** | Er lokationen aktiv | ✅ / ☐ |

### ⚠️ Vigtigt: Adresse skal udfyldes
Fejl **OrderFromLocationAddressIsEmpty** opstår hvis afsenderlokationen mangler adresse.
Løsning: Admin → Indstillinger → Lokationer → udfyld adresse.

### Relaterede emner
→ Se: Transfer ordre — komplet guide

---

## CSV-separator (CultureInfo)

### Hvad er det
Indstilling der bestemmer om CSV-filer bruger komma eller semikolon som kolonneseparator.

### Sti
Admin → Indstillinger → Systemindstillinger → **CultureInfo CSV**

### Muligheder

| Indstilling | Separator | Decimalseparator | Bruges i |
|-------------|-----------|-----------------|---------|
| `da-DK` | `;` (semikolon) | `,` (komma) | Danmark — åbn direkte i Excel |
| `en-US` | `,` (komma) | `.` (punktum) | Internationalt format |

### Hvorfor det betyder noget
Excel forventer det format der matcher computerens region. Åbner du en komma-separeret CSV på en dansk computer, tolker Excel kommaer som decimaler — alle data havner i én kolonne.

### Løsning ved forkert format
1. Admin → Indstillinger → Systemindstillinger
2. Skift CultureInfo CSV til `da-DK`
3. Klik **Restart Application**
4. Eksportér CSV igen

### Relaterede emner
→ Se: Lagerrapporter og historikvisninger
→ Se: Genstart SmartPack

---

## Flush DNS

### Hvad er det
Nulstilling af DNS-cachen på computere med Printservice — løser printfejl der skyldes forældet netværksadresse.

### Symptom
Printer fejler med udskrift uagtet at den er online og konfigureret korrekt.

### Løsning

1. Åbn **CMD / Kommando-prompt** på Windows
2. Skriv: `ipconfig /flushdns`
3. Tryk Enter
4. Følgende besked vises: *"Flushing the DNS Resolver Cache"*
5. Gentag på **alle computere** der kører Printservice

### ⚠️ Vigtigt
Flush DNS skal køres på **ALLE** computere med Printservice — ikke kun én.

### Relaterede emner
→ Se: Printservice — Opsætning (Windows) (Terminal)
→ Se: Labelprint — Fejl og løsninger (Terminal)

---

## API-adgang

### Hvad er det
Opsætning af API-adgang til SmartPack for ekstern integration.

### Sti
Admin → Indstillinger → Apps/Integrationer → **Tilføj private app**

### Hvad genereres

| Element | Beskrivelse |
|---------|-------------|
| **AppId** | Unikt app-identifikator |
| **AccessToken** | Hemmeligt token — gem sikkert |

### Dokumentation
https://demo.smartpack.dk/

### Changelog
https://demo.smartpack.dk/

### Relaterede emner
→ Se: WooCommerce integration

---

## WooCommerce integration

### Hvad er det
Opsætning af forbindelsen mellem WooCommerce og SmartPack via API-nøgler.

### Sti
Admin → Indstillinger → Apps → WooCommerce

### Nødvendige data fra WooCommerce

| Data | Hvorfra |
|------|---------|
| **Consumer Key** | WooCommerce → Indstillinger → Avanceret → REST API → Tilføj nøgle |
| **Consumer Secret** | Samme sted |
| **Store URL** | Din WooCommerce-butiksadresse |

### Rettigheder til API-nøglen
Nøglen skal have **Læse/Skrive** rettigheder til ordrer og produkter.

### Relaterede emner
→ Se: API-adgang

---

## POS / Kasse Flow

### Hvad er det
Konfiguration af kassebetjening direkte fra SmartPack.

### Sti
Admin → POS

### Alle indstillinger

| Indstilling | Beskrivelse | Type |
|-------------|-------------|------|
| **Tillad pluk udenfor flow** | Pluk kan ske uden om standard kasseflow | ✅ / ☐ |
| **Giv besked ved pluk udenfor flow** | Notifikation til ansvarlig | ✅ / ☐ |
| **Giv besked ved flere lokationer** | Advar hvis varen er på flere placeringer | ✅ / ☐ |
| **Giv besked ved manglende lager** | Advar ved lagermangel | ✅ / ☐ |

### Relaterede emner
→ Se: Workflows
→ Se: Plukstrategi — Pickup (Terminal)

---

# DEL 19 — ANKOMST (ADMIN)

---

## Ankomstoversigt og afsendelse

### Hvad er det
Admin-visning af alle aktive og afsluttede ankomster samt afsendelser.

### Sti
Admin → Ankomst

### Oversigten viser

| Kolonne | Beskrivelse |
|---------|-------------|
| **Ankomstnummer** | Unikt ID |
| **Type** | Standard / Retur / Intern retur |
| **Lager** | Modtagerlager |
| **Afsender** | Leverandørnavn |
| **Reference** | Referencenummer |
| **Status** | Aktiv / Afsluttet |
| **Modtaget** | Antal enheder modtaget |
| **Forventet** | Antal enheder forventet |
| **Dato** | Oprettelsesdato |

### Relaterede emner
→ Se: Ankomst (Terminal — DEL 4)

---

# DEL 20 — FORECASTING

---

## Transfer ordre — Komplet guide

### Hvad er det
Transfer-ordrer er interne overførsler af varer fra én SmartPack-lokation til en anden.

### Opsætning (kræves én gang)

1. Opret leveringsmetode:
   - Udbyder: `template`
   - Nøgle: `Eget Lagerflyt`
   → Se: Eget lagerflyt
2. Opret plukkeprofil med ordretype **TransferOrder** og kildelokation
   → Se: Plukkeprofil til transfer ordre

### Opret manuel transfer

Admin → Ordrer → **"Opret manuel overførsel"**

| Felt | Beskrivelse |
|------|-------------|
| **Varer** | Produkter der overføres |
| **Afsenderlokation** | Fra-lager |
| **Modtagerlokation** | Til-lager |
| **Forventet leveringsdato** | Estimeret ankomstdato |

### Automatisk transfer — Generer overførsler

**Knappen "Generer overførsler"** findes nederst til højre på ordresiden.

Klik → systemet genererer én samlet transfer-ordre med alle varer der mangler på primærlokationen men er tilgængelige på en anden lokation (fx Hal 3).

Kræver opsat Transfer Order-plukkeprofil.

### Pluk og afsendelse

1. Plukkeprofil til transfer udvælger varerne
2. Pluk og pak som normal ordre
3. Generér waybill

### Modtagelse i butik/anden lokation

Terminal → Ankomster → **"Modtag overførselspakke"** → scan QR-koden på pakken

### Fejl: OrderFromLocationAddressIsEmpty
Afsenderlokation mangler adresse.
Løsning: Admin → Indstillinger → Lokationer → udfyld adresse.

### Relaterede emner
→ Se: Modtag Transfer (Terminal)
→ Se: Nedlæg plukliste (Terminal)

---

## Lager-KPI'er og benchmarks

### Hvad er det
Nøgletal til løbende driftsstyring og performancemåling.

### SmartPack-benchmarks (standard)

| Aktivitet | Benchmark |
|-----------|----------|
| **Pakker** | 40 pakker/time |
| **Pluk** | 110 picks/time |
| **Lagermodtagelser** | 100/time |
| **Flytninger/Genopfyld** | 50/time |
| **Revisioner** | 100/time |
| **Palle-scans** | 100/time |

### Branchemæssige nøgletal

| KPI | Målværdi |
|-----|---------|
| **Plukpræcision** | > 99,5% |
| **Lageromstætning** | 4–8 gange/år |
| **Lagerudnyttelse** | > 85% |
| **Returhåndteringstid** | < 48 timer |
| **Pakke/pluktid pr. ordre** | 3–6 min. |
| **OTD-rate (On Time Delivery)** | > 95% |
| **Returrate** | 5–25% afhænger af branche |

### Relaterede emner
→ Se: Employee Performance Dashboard

---

*SmartPack Admin Leksikon · Komplet · Alle detaljer bevaret · v1.34.0.0*
