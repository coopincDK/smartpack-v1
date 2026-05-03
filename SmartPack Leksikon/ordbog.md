# SmartPack Ordbog — A til Å

> Alle begreber der bruges i SmartPack og lagerlogistik. Hvert begreb er sin egen artikel.

---

## ABC-analyse

**Hvad:** Lagerstyringsmetode der kategoriserer varer baseret på omsætningsværdi.

| Kategori | Definition | Standard |
|----------|-----------|---------|
| **A-varer** | Øverste X% af omsætningsværdi | Øverste 5% |
| **B-varer** | Næste X% | Næste 10% |
| **C-varer** | Næste X% | Næste 15% |
| **D-varer** | Resten | Alt øvrigt |

**Bruges til:** Indkøbsprioritering, lagerplacering, forecasting.

→ Se: Forecasting og ABC-analyse (admin.md)

---

## AI (Application Identifier)

**Hvad:** GS1-koder i kantede parenteser der identificerer typen af data i en GS1-stregkode.

| AI | Data |
|----|------|
| (01) | GTIN / varenummer |
| (10) | Batchnummer |
| (11) | Produktionsdato |
| (17) | Udløbsdato |

→ Se: Newland — Special stregkode (terminal.md)

---

## API (Application Programming Interface)

**Hvad:** Teknisk grænse der giver udviklere programmatisk adgang til SmartPack-data og funktioner.

**Bruges til:** Egne integrationer, automatisering, dataudtræk.

→ Se: API-adgang (admin.md)

---

## Batch picking

**Hvad:** Plukning til flere ordrer simultant på én plukliste — øger effektiviteten.

→ Se: Plukstrategi — Multipluks (terminal.md)

---

## Batchnummer / Lotnummer

**Hvad:** Unikt identifikationsnummer for et specifikt produktionsparti. Muliggør tilbagekald og kvalitetssporing.

**Synonymer:** LOT-nummer, batchnummer, partinummer.

→ Se: Ankomst — Batch/LOT-sporing (terminal.md)
→ Se: Batchsporing (admin.md)

---

## Batch/LOT

**Hvad:** Et specifikt lagerparti med ét batch-nummer. Følger varen fra modtagelse til forsendelse.

---

## BOM (Bill of Materials)

**Hvad:** Stykliste — liste over alle komponenter der indgår i samling af et produkt.

→ Se: Produkttyper — Kollektions (admin.md)

---

## Bundle

**Hvad:** En kombination af eksisterende produkter der sælges som ét samlet produkt. Systemet beregner lagertilgængelighed ud fra komponenternes individuelle beholdning.

→ Se: Produkttyper — Bundle (admin.md)

---

## Cloudbaseret WMS

**Hvad:** Lagerstyringssystem der kører i cloud — ingen lokal serverinstallation kræves.

---

## Cross docking

**Hvad:** Varer losses fra indkommende transport og lægges direkte over i udgående transport uden at passere lageret.

---

## Cut-off tid

**Hvad:** Seneste frist for ordremodtagelse for at nå dagens afsendelse.

→ Se: Sorteringszoner (admin.md)

---

## Demand planning

**Hvad:** Forudsigelse af fremtidig kundeefterspørgsel til optimal lagerstyring.

→ Se: Forecasting og ABC-analyse (admin.md)

---

## Dropshipping

**Hvad:** Varer sendes direkte fra leverandøren til slutkunden — ingen eget lager håndterer varen.

→ Se: Dropshipping — To metoder (admin.md)

---

## EAN (European Article Number)

**Hvad:** Stregkodestandard — bruges til at identificere varer unikt.

**Synonymer:** GTIN, varestregkode.

---

## End-of-day

**Hvad:** Daglig afslutningsprocedure hvor waybill-liste genereres til transportøren.

→ Se: Afsendelse og Waybill (admin.md)

---

## ERP (Enterprise Resource Planning)

**Hvad:** Virksomhedssystem der integrerer økonomi, lager, salg og indkøb. SmartPack integrerer med Business Central og e-conomic.

---

## FEFO (First Expired First Out)

**Hvad:** Lagerstyringsmetode der prioriterer forsendelse af varer med tidligst udløbsdato.

→ Se: Produktflags (admin.md)
→ Se: Lagerrevision — LOT/Batch håndtering (terminal.md)

---

## FIFO (First In First Out)

**Hvad:** Lagerstyringsmetode der sikrer at ældste varer sendes/sælges først.

→ Se: Produktflags (admin.md)

---

## Forsendelse

**Hvad:** Den fysiske afsendelse af pakker til kunden — fra label genereret til pakke afhentet af transportør.

---

## Fragtlabel

**Hvad:** Stregkode-label der printes og klistres på pakken. Indeholder modtageradresse, sporingsnummer og transportørinformation.

→ Se: Labelprint (terminal.md)

---

## Full Sync

**Hvad:** Fuld synkronisering af alle data fra en integration (Shopify, BC) til SmartPack.

**Bruges til:** Genopbygning af data efter fejl eller opsætningsændringer.

---

## Genopfyldning / Refill

**Hvad:** Påfyldning af plukpladser fra reservelager/baglagerpladser.

→ Se: Flyt Lager (terminal.md)
→ Se: Refill-lokationer (admin.md)

---

## GS1

**Hvad:** Global standard for stregkoder. Bruges i SmartPack til automatisk udfyldelse af batch, dato og LOT ved scanning.

→ Se: Ankomst — GS1 stregkoder (terminal.md)

---

## GTIN (Global Trade Item Number)

**Hvad:** Det globale varenummer — bruges interchangeably med EAN.

---

## Håndterminal

**Hvad:** Mobil enhed (tablet/scanner) til udførelse af lageropgaver. SmartPack anbefaler Newland MT9084.

→ Se: Anbefalet hardware (terminal.md)

---

## Intrastat

**Hvad:** Obligatorisk EU-rapportering af varebevægelser mellem EU-lande.

---

## IOSS (Import One Stop Shop)

**Hvad:** EU-momsordning der forenkler momsafregning ved salg til EU-kunder.

---

## Just-In-Time (JIT)

**Hvad:** Varer modtages præcis når de bruges — minimerer lagerhold.

---

## Karantæne

**Hvad:** Markering af et lagerparti som utilgængeligt for pluk uden at fjerne det fra lageret.

→ Se: Lagerrevision — Karantæne (terminal.md)

---

## Kitting

**Hvad:** Samling af komponenter til et færdigt produkt — udføres via Produktions-appen.

→ Se: Produktion (terminal.md)
→ Se: Produkttyper — Kollektions (admin.md)

---

## KPI (Key Performance Indicators)

**Hvad:** Målbare nøgletal til at vurdere effektivitet.

→ Se: Lager-KPI'er og benchmarks (admin.md)
→ Se: Employee Performance Dashboard (admin.md)

---

## Kostpris

**Hvad:** Hvad det koster virksomheden at købe/producere en vare. Synkroniseres fra e-handelsplatform.

→ Se: Kostpris vs. Lageromkostning (admin.md)

---

## Lagerkostpris

**Hvad:** Beregnet gennemsnitlig kostpris inkl. fragt, told og finansiering.

→ Se: Kostpris vs. Lageromkostning (admin.md)

---

## Lageromstætning

**Hvad:** Hastighed for salg og udskiftning af lager over en periode. Mål: 4–8 gange/år.

---

## Lageroptælling / Revision

**Hvad:** Fysisk tælling og verificering af lagerantal.

→ Se: Lagerrevision (terminal.md)
→ Se: Placeringsrevision (terminal.md)
→ Se: Løbende optælling (terminal.md)

---

## Lagerprincip: Gennemsnitskost

**Hvad:** Lagerværdi beregnes som: total kostpris ÷ total enheder = gennemsnitlig enhedspris.

---

## LabelOnly

**Hvad:** En ordretype i SmartPack der genererer en fragtlabel uden at der er varer tilknyttet.

→ Se: Opret label uden ordre (admin.md)

---

## LOT

**Hvad:** Lotnummer = batchnummer for et specifikt produktparti.

→ Se: Batchnummer / Lotnummer

---

## Mikrofulfillment

**Hvad:** Små lokale lagre tæt på kunder til ultra-hurtig levering.

---

## Minimumslager

**Hvad:** Laveste acceptable lagerantal — bestillingspunkt der udløser genopfyldning.

→ Se: Produktdata — Refill limit (admin.md)

---

## Method key

**Hvad:** Den tekniske nøgle der identificerer en leveringsmetode i SmartPack og matcher med webshoppens leveringsmetode.

**Eksempel:** `gls_private_droppoint`, `postnord_business_delivery`

→ Se: Leveringsmetoder — Opsætning (admin.md)

---

## OTD-rate (On Time Delivery)

**Hvad:** Andel af ordrer der leveres til aftalt tid. Mål: > 95%.

---

## Ordrestyring

**Hvad:** Hele forløbet fra ordremodtagelse til levering.

---

## Pakning

**Hvad:** Forberedelse af varer til forsendelse inkl. emballage og fragtlabel.

→ Se: Pakningsprocessen (terminal.md)

---

## Pick & Pack

**Hvad:** Integreret pluk og pak — ordrer plukkes og pakkes direkte.

---

## PIM (Product Information Management)

**Hvad:** Central styring af produktdata.

→ Se: Produktoversigt (admin.md)

---

## Plukning

**Hvad:** Udvælgelse og samling af varer fra hylderne til en kundeordre.

→ Se: Pluk Ordrer (terminal.md)

---

## Plukprofil

**Hvad:** Skabelon der bestemmer hvordan pluklister genereres.

→ Se: Introduktion til plukkeprofiler (admin.md)

---

## Pre-pack

**Hvad:** Forpakning af populære varer inden ordrer indkommer.

---

## Presell / Forudsalg

**Hvad:** Salg af varer der endnu ikke er modtaget på lageret.

→ Se: Presell (admin.md)

---

## Printservice

**Hvad:** Windows-program der fungerer som bro mellem SmartPack og fysiske printere.

→ Se: Printservice — Opsætning (terminal.md)

---

## Re-commerce

**Hvad:** Videresalg af returnerede eller brugte varer.

---

## Returflow

**Hvad:** Hele processen for håndtering af returnerede varer fra modtagelse til lagerføring.

→ Se: Retur (terminal.md)
→ Se: Returportal (admin.md)

---

## Reverse Logistics

**Hvad:** Håndtering af varestrømme fra kunde retur til lager.

---

## RMA (Return Merchandise Authorization)

**Hvad:** Returregistrering — autorisation til at returnere en vare.

---

## ROI (Return on Investment)

**Hvad:** Afkast på investering.

---

## Same-day delivery

**Hvad:** Levering samme dag som ordren afgives.

---

## SCM (Supply Chain Management)

**Hvad:** Styring af hele forsyningskæden fra råmaterialer til færdige produkter.

---

## Serienummer

**Hvad:** Unikt nummer per enkelt enhed af et produkt — til sporbarhed på enhedsniveau.

→ Se: Produktflags (admin.md)
→ Se: Serienummersporing (admin.md)

---

## SignalR

**Hvad:** Teknologi der muliggør realtidsopdateringer fra server til klient.

→ Se: Realtidsopdateringer (terminal.md)

---

## SKU (Stock Keeping Unit)

**Hvad:** Unikt varenummer der identificerer én specifik vare/variant i systemet.

**Eksempel:** En blå t-shirt i størrelse M har ét SKU. Størrelse L har et andet SKU.

---

## SLA (Service Level Agreement)

**Hvad:** Aftalt serviceniveau og svartider.

---

## Sofia

**Hvad:** SmartPacks AI-supportassistent i supportchatten. Svarer øjeblikkeligt 24/7.

→ Se: Supportchat (admin.md)

---

## Sorteringszone

**Hvad:** Logisk gruppe af pakker til samme transportør/destination.

→ Se: Sorteringszoner (admin.md)

---

## Stregkode

**Hvad:** Maskinlæsbar kode der indeholder produktdata.

→ Se: Stregkoder på produkter (admin.md)
→ Se: Stregkodepræfikser (terminal.md)

---

## Tote

**Hvad:** Fysisk plukkasse brugt under ordrepluk til at sortere varer per ordre.

→ Se: Totes og plukkekasser (admin.md)
→ Se: Aktiv plukning — Vogn og tote (terminal.md)

---

## Transfer ordre

**Hvad:** Intern overførsel af varer fra én SmartPack-lokation til en anden.

→ Se: Transfer ordre (admin.md)

---

## TSM / TSP

**Hvad:** Travelling Salesman Problem — optimeringsalgoritme der beregner korteste mulige rute mellem alle plukpunkter.

→ Se: Pluk Ordrer — Generer plukliste (terminal.md)

---

## Udløbsdato

**Hvad:** Seneste dato for optimal kvalitet og sikkerhed.

→ Se: Ankomst — Ekstrafelter (terminal.md)
→ Se: Produktflags (admin.md)

---

## UOM (Unit of Measure)

**Hvad:** Standardiseret måleenhed for varer på lager (stk., ltr., meter).

→ Se: Enhedstyper (admin.md)

---

## Varemodtagelse / Ankomst

**Hvad:** Modtagelse, kontrol og registrering af indkommende varer på lageret.

→ Se: Ankomst (terminal.md)

---

## Waybill

**Hvad:** Fragtbrev — transportdokument der medfølger forsendelsen.

→ Se: Afsendelse og Waybill (admin.md)

---

## Wave picking

**Hvad:** Pluk i bølger baseret på deadlines og fragtafgange.

→ Se: Sorteringszoner (admin.md)

---

## WEEE

**Hvad:** Waste Electrical and Electronic Equipment — lovpligtig håndtering af elektronikaffald i EU.

---

## Webhook

**Hvad:** Automatisk HTTP-notifikation fra ét system til et andet ved specifikke hændelser.

→ Se: Business Central (integrationer.md)
→ Se: Shopify (integrationer.md)

---

## WMS (Warehouse Management System)

**Hvad:** Lagerstyringssystem — software der optimerer alle aspekter af lagerdrift.

**SmartPack er et cloudbaseret WMS.**

---

*SmartPack Ordbog · A til Å · v1.34.0.0*

---

## 5S-metoden

**Hvad:** Japansk arbejdspladsorganiserings-metode: Sortér · Systematisér · Shine · Standardisér · Skab vaner.

→ Se: 5S-metoden på lageret (lagerhåndbog.md)

---

## CE-mærkning

**Hvad:** Mærkning der dokumenterer at et produkt overholder europæiske sikkerhedsstandarder.

**Krav:** Synligt på produkt og/eller emballage. Teknisk dokumentation skal kunne fremvises.

→ Se: Compliance og lovkrav (lagerhåndbog.md)

---

## ESG (Environment, Social, Governance)

**Hvad:** Ramme for bæredygtighed, sociale forhold og ansvarlig ledelse. Kunder og partnere efterspørger dokumentation.

→ Se: Compliance og lovkrav (lagerhåndbog.md)

---

## First Touch Resolution

**Hvad:** Andel af kundeservice-henvendelser løst ved første kontakt — uden opfølgende henvendelser nødvendige.

**Mål:** > 70%

→ Se: Avanceret skalering (lagerhåndbog.md)

---

## GDPR (General Data Protection Regulation)

**Hvad:** Europæisk persondataforordning. Ordredata og returdata er persondata — kræver databehandleraftaler med alle systemleverandører.

→ Se: Compliance og lovkrav (lagerhåndbog.md)

---

## Golden Zone

**Hvad:** Hylde-højden fra knæ til bryst — lettest og hurtigst at arbejde fra. A-varer placeres altid her.

→ Se: Golden Zone (lagerhåndbog.md)

---

## IOSS (Import One Stop Shop)

**Hvad:** EU-momsordning der forenkler momsafregning ved salg til EU-kunder. Kunden betaler moms ved kassen frem for ved levering.

**Gælder:** Varer under 150 EUR til EU-kunder udenfor sælgers hjemland.

→ Se: Compliance og lovkrav (lagerhåndbog.md)

---

## Multi-carrier setup

**Hvad:** System der automatisk vælger billigste transportør per ordre baseret på pakke-karakteristika.

**Kræver:** TA-platform eller godt WMS.

→ Se: Fragtfælder (lagerhåndbog.md)

---

## Multi-location picking

**Hvad:** Samme SKU er placeret i flere plukkeområder simultant for at eliminere flaskehalse ved bestsellers.

→ Se: Multi-location picking (lagerhåndbog.md)

---

## Multi-warehouse

**Hvad:** Drift med flere fysiske lagerlokationer geografisk fordelt.

→ Se: Avanceret skalering (lagerhåndbog.md)
→ Se: Lokationer (admin.md)

---

## NPS (Net Promoter Score)

**Hvad:** Kundeloyalitets-måling — sandsynlighed for at kunden anbefaler virksomheden til andre (skala 0–10).

**Formel:** % Promoters (9–10) − % Detractors (0–6)

---

## PIM-system (Product Information Management)

**Hvad:** Centralt system til håndtering af produktdata — billeder, tekster, specs — til mange SKU'er og multi-kanal salg.

→ Se: Avanceret skalering (lagerhåndbog.md)
→ Se: Produktoversigt (admin.md)

---

## Pre-pack / Forpakning

**Hvad:** Strategisk forpakning af populære varer inden ordrer indkommer — reducerer behandlingstid under kampagner.

→ Se: Pre-pack og Forpakning (lagerhåndbog.md)

---

## Re-commerce

**Hvad:** Videresalg af returnerede eller brugte varer via outlet, B2B eller re-commerce platforme.

**Sortering:** "Som ny" · "Reparerbar" · "Ikke-salgbar"

→ Se: Returzone og returflow (lagerhåndbog.md)

---

## RMA (Return Merchandise Authorization)

**Hvad:** Returregistrering — autorisation til at returnere en vare. RMA-placeringer per leverandør giver overblik ved claim og lagerværdier.

→ Se: Returlokation som plukprioritet (lagerhåndbog.md)

---

## SLA (Service Level Agreement)

**Hvad:** Aftalt serviceniveau med definerede mål for svartider, leveringstid og fejlrate.

→ Se: Avanceret skalering (lagerhåndbog.md)
→ Se: 3PL — Aftal klare rammer (lagerhåndbog.md)

---

## TA (Transport Administration)

**Hvad:** System til administration af forsendelser og fragtaftaler med transportører — fx udskrivning af fragtlabels, sporbarhed og multi-carrier valg.

**Eksempler:** Shipmondo, Webshipper, Unifaun.

---

## Volumevægt

**Hvad:** Beregnet "fragtmæssig vægt" baseret på pakkedimensioner i stedet for reel vægt. Bruges af transportører når kassen "vejer" mere som luft end som produkt.

**Formel:** L × B × H (cm) ÷ 5.000 = volumevægt i kg

**Eksempel:** 50 × 40 × 30 cm = 12 kg volumevægt — faktureres som 12 kg selvom varen vejer 2 kg.

→ Se: Fragtfælder (lagerhåndbog.md)

---

## Wave picking

**Hvad:** Pluk i bølger baseret på forsendelsesdeadlines og cut-off-tider. Ordrer grupperes i "bølger" der afvikles inden specifikke afgangstidspunkter.

**Fordel:** Sikrer at ekspresordrer behandles inden standard-ordrer.

→ Se: Sorteringszoner (admin.md)
→ Se: Plukkestrategi (lagerhåndbog.md)

---

*Ordbog opdateret med supplement fra Lager- og Logistik Cheat Sheet*

---

## Tarifkode (HS-kode, CN-kode, TARIC)

**Hvad:** Numerisk kode der klassificerer et produkt til international handel og toldbehandling.

| Format | Cifre | Bruges |
|--------|-------|--------|
| HS-kode | 6 | Globalt (200+ lande) |
| CN-kode | 8 | EU (eksport) |
| TARIC | 10 | EU (import) |
| UK Commodity Code | 10 | UK (post-Brexit) |
| HTS | 10 | USA |

→ Se: Tarifkode — komplet guide (generel-logistik.md)
→ Se: Produktdata — Tarifkode-felt (admin.md)

---

## Lande-tarifkoder (Country Tariff Codes)

**Hvad:** Landespecifikke udvidelser af HS-koden der angiver præcis klassificering for det pågældende land. I SmartPack et separat felt på produktkortet under Eksportdata.

→ Se: Tarifkode — komplet guide (generel-logistik.md)

---

## TARIC

**Hvad:** EU's integrerede toldtarif — 10-cifret kode (CN 8 + 2 TARIC-cifre) der bruges ved import til EU og angiver toldsatser, kvoter og anti-dumping.

→ Se: Tarifkode — komplet guide (generel-logistik.md)

---

## CN-kode (Kombineret Nomenklatur / Combined Nomenclature)

**Hvad:** EU's 8-cifrede varekode (HS 6 + 2 EU-cifre). Bruges på tolddeklarationer ved eksport fra EU.

→ Se: Tarifkode — komplet guide (generel-logistik.md)


---

## EUR-palle (Europalle)

**Hvad:** Standardiseret europæisk transportpalle. Mål: 1200 × 800 × 144 mm. Vægt: 22–25 kg. Bæreevne: 1.000 kg (transport) / 1.500 kg (statisk). Godkendt efter EPAL-standard.

→ Se: Pallestandarder (generel-logistik.md)

---

## EPAL

**Hvad:** European Pallet Association — standardiseringsorganisation for EUR-paller. EPAL-mærket er kvalitetsgarantien på godkendte EUR-paller.

→ Se: Pallestandarder (generel-logistik.md)

---

## ISPM 15

**Hvad:** International standard for varmebehandling af træpakkeringsmateriale ved eksport. Kræves ved eksport af træpaller til lande udenfor EU.

→ Se: Pallestandarder (generel-logistik.md)

---

## EU Batteriforordning 2023/1542

**Hvad:** EU-forordning der regulerer batterier fra produktion til bortskaffelse. Gælder fra 18. februar 2024 i alle EU-lande. Krav til mærkning (2026), QR/batteripas (2027), genanvendt indhold (2028+).

**Berørt:** Alle der sælger batterier eller produkter med batterier i EU.

→ Se: EU Batteriforordning (generel-logistik.md)

---

## Batteripas

**Hvad:** Digitalt produktpas for batterier — obligatorisk fra 2027. Indeholder fremstillingssted, kapacitet, forventet levetid og sikkerhedsinformation. Tilgås via QR-kode.

→ Se: EU Batteriforordning (generel-logistik.md)

---

## AOV (Average Order Value)

**Hvad:** Gennemsnitlig ordreværdi. Beregnes: Total omsætning ÷ Antal ordrer.

→ Se: Fragtpris-kalkulation (generel-logistik.md)

---

## Break-even fragtpris

**Hvad:** Det ordrebeløb hvor dækningsbidraget præcis dækker fragtomkostningen. Udgangspunkt for beregning af fri-fragt grænse.

**Formel:** Fragtomkostning ÷ (DB% ÷ 100)

→ Se: Fragtpris-kalkulation (generel-logistik.md)

