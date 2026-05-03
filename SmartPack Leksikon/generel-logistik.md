# Generel Logistik og Compliance — Komplet Leksikon

> **Kilde:** Generel viden, EU-lovgivning, offentlige myndigheder (Beredskabsstyrelsen, Danmarks Statistik, Færdselsstyrelsen)
> **Format:** Lossless leksikon — hvert emne er en selvstændig artikel

---

## Indholdsfortegnelse

- Farliggods — ADR (vejtransport)
- Farliggods — IMDG (søtransport) og IATA/DGR (lufttransport)
- Farliggods — De ni klasser
- Farliggods — Praktisk checkliste for webshops
- Kølekæde og temperaturkontrol
- WiFi og netværk til terminaler
- B2B ordreflow
- Quality Control (QC) ved modtagelse
- Årsafslutning og lageropgørelse
- Sæsonplanlægning og årshjul
- Systemnedbrud — beredskabsplan
- WMS — hvornår og ROI-beregning
- Compliance: Intrastat (Danmark 2025)
- Compliance: IOSS — Import One Stop Shop
- Compliance: WEEE
- Compliance: CE-mærkning
- Compliance: GDPR i lagerkontekst
- Compliance: Emballagelovgivning (DE/FR)

---

# FARLIGGODS

---

## Farliggods — ADR (vejtransport)

### Hvad er det
ADR (Accord européen relatif au transport international des marchandises Dangereuses par Route) er den europæiske konvention for international vejtransport af farligt gods. I Danmark er ADR implementeret via Færdselsstyrelsens bekendtgørelse om vejtransport af farligt gods (senest BEK nr. 915 af 26. juni 2025).

### Hvem er berørt
Alle der transporterer, afsender, klassificerer, mærker, emballerer, læsser eller aflæsser farligt gods i mængder over ADR's fritagelsesgrænser.

### Myndigheder i Danmark

| Myndighed | Ansvar |
|-----------|--------|
| **Færdselsstyrelsen** | Regeludstedende myndighed for vejtransport (fra 1. januar 2024) |
| **Beredskabsstyrelsen** | Vejledning i ADR's bestemmelser, klassificering |
| **Sundhedsstyrelsen** | Klassificering af visse medicinske farliggods |
| **Sikkerhedsstyrelsen** | Klassificering af fyrværkeri |

### Sikkerhedsrådgiver — hvornår kræves det
Virksomheder der transporterer farligt gods i mængder over ADR-fritagelserne **skal** udpege en sikkerhedsrådgiver. Fra 1. januar 2024 skal anmeldelse ske til **Færdselsstyrelsen** (ikke Beredskabsstyrelsen som tidligere).

Sikkerhedsrådgiverens opgaver:
- Verificere at ADR-reglerne overholdes
- Rådgive ved transport af farligt gods
- Udarbejde årsrapport til ledelsen
- Udarbejde rapport ved ulykker eller hændelser

### Transportdokument
Alle forsendelser med farligt gods over fritagelsesmængderne kræver et transportdokument med:
- UN-nummer
- Officiel betegnelse for farligt gods
- Klasse og emballagegruppe
- Antal og beskrivelse af kollierne
- Total mængde

### Fritagelsesmængder (frimængder)
ADR indeholder frimængder (underafsnit 1.1.3.6) hvor forenklet transport er tilladt. Mængderne afhænger af transportkategori (0–4). Kontakt Beredskabsstyrelsen for specifikke grænser for din varegruppe.

### Relaterede emner
→ Se: Farliggods — De ni klasser
→ Se: Farliggods — Praktisk checkliste
→ Se: Produktflags (admin.md)

---

## Farliggods — IMDG og IATA/DGR

### IMDG (søtransport)
International Maritime Dangerous Goods Code — den internationale standard for søtransport af farligt gods. Administreres af IMO (International Maritime Organization).

For Østersø-transport: Memorandum of Understanding tillader at gods der opfylder ADR/RID kan transporteres på ro/ro-skibe selvom IMDG-kodens fulde krav ikke er opfyldt.

### IATA DGR (lufttransport)
Dangerous Goods Regulations fra IATA (International Air Transport Association). Regulerer transport af farligt gods med fly. Generelt strengere restriktioner end ADR.

**Konsekvens for e-commerce:**
Lithium-batterier (UN 3480, UN 3481) er underlagt særlige IATA-restriktioner. Vær opmærksom ved forsendelse af elektronik med integrerede batterier med flyfragt.

### Relaterede emner
→ Se: Farliggods — ADR

---

## Farliggods — De ni klasser

### Klasseoversigt

| Klasse | Kategori | Eksempler |
|--------|---------|---------|
| **1** | Eksplosive stoffer og genstande | Fyrværkeri, ammunition |
| **2** | Gasser | Spraydåser, gasflasker, CO₂-patroner |
| **3** | Brandfarlige væsker | Alkohol, acetone, parfume, lak |
| **4.1** | Brandfarlige faste stoffer | Tændstikker, metalfilspåner |
| **4.2** | Selvantændende stoffer | Aktivt kul, metallisk natrium |
| **4.3** | Stoffer der ved kontakt med vand udvikler brandfarlige gasser | Metallisk lithium, calciumcarbid |
| **5.1** | Oxiderende stoffer | Brintoverilte, natriumnitrat |
| **5.2** | Organiske peroxider | Hærdere til lim og plastik |
| **6.1** | Giftige stoffer | Pesticider, methanol |
| **6.2** | Infektiøst materiale | Biologiske prøver, vacciner |
| **7** | Radioaktivt materiale | Medicinsk udstyr |
| **8** | Ætsende stoffer | Batterisyre, rengøringsmidler med syre |
| **9** | Diverse farlige stoffer og genstande | Lithium-batterier, asbest, tøris |

### Klasse 9 — Lithium-batterier (særligt relevant for e-commerce)

UN-numre:
- **UN 3480** — Lithium-ionbatterier (løse)
- **UN 3481** — Lithium-ionbatterier i udstyr
- **UN 3090** — Lithiummetalbatterier (løse)
- **UN 3091** — Lithiummetalbatterier i udstyr

Disse er underlagt særlige restriktioner ved luftfragt og kræver korrekt mærkning.

### SmartPack-opsætning
Admin → Produkter → flagset **Farliggods** → angiv **UN-nummer**.

→ Se: Produktflags (admin.md)

---

## Farliggods — Praktisk checkliste for webshops

### Hvad du skal gøre hvis du sælger farliggods

| Trin | Handling |
|------|---------|
| **1. Identificér** | Er varen farliggods? → Se de ni klasser og FN's Orange Book |
| **2. Klassificér** | Find UN-nummer (ADR Tabel A, kapitel 3.2) |
| **3. Emballagekrav** | Kontrollér krav til emballage for den pågældende klasse |
| **4. Mærkning** | Korrekte faresedler (labels) på emballagen |
| **5. Dokumentation** | Transportdokument ved forsendelse over frimængder |
| **6. Transportør** | Kontrollér at transportøren accepterer og er godkendt til klassen |
| **7. Sikkerhedsrådgiver** | Udpeg sikkerhedsrådgiver hvis nødvendigt |
| **8. System** | Markér som farliggods i SmartPack med korrekt UN-nummer |

### Typiske e-commerce farliggods-produkter

| Produkt | Klasse | UN-nr. |
|---------|--------|--------|
| Parfume / After Shave | 3 (brandfarlig væske) | 1266 |
| Neglelak / Neglelakfjerner | 3 | 1993 |
| Hårspray / Deodorant spray | 2 (aerosoler) | 1950 |
| Lithium-batteri-produkter | 9 | 3480/3481 |
| Rengøringsmidler (koncentrerede) | 8 (ætsende) | Varierer |
| Brintoverilte (>8%) | 5.1 | 2014 |

### Advarsler

> ⚠️ **Transportører afviser farliggods** der ikke er korrekt klassificeret og mærket. Tjek med din transportør inden du afgiver første forsendelse.

> ⚠️ **Luftfragt**: Kontakt IATA-certificeret luftfragtselskab for godkendelse. Mange varer er forbudt eller stærkt begrænset.

### Ressourcer
- Beredskabsstyrelsen: brs.dk
- ADR-konventionen (opdateres hvert 2. år): unece.org/trans/danger/publi/adr/adr2025/25ContentsE.html
- Dansk Kemidatabase: dansk-kemidatabase.dk

### Relaterede emner
→ Se: Farliggods — De ni klasser
→ Se: Farliggods — ADR

---

# KØLEKÆDE OG TEMPERATURKONTROL

---

## Kølekæde og temperaturkontrol

### Hvad er det
Kølekæden er den ubrudte kontrol af temperatur fra produktion til levering for produkter der kræver temperaturkontrol.

### Hvornår er det relevant
- Fødevarer (frisk, kølet, frosset)
- Medicin og farmaceutiske produkter
- Biologiske prøver
- Visse kemikalier og kosmetik

### Temperaturzoner

| Zone | Temperatur | Eksempler |
|------|-----------|---------|
| **Stuetemperatur** | 15–25°C | Tørre fødevarer, de fleste kosmetik |
| **Køl** | 2–8°C | Frisk mad, vacciner, visse medicin |
| **Frost** | Under -18°C | Frosne fødevarer |
| **Dyb frost** | Under -40°C | Biologiske prøver, visse vacciner |
| **Kontrolleret stuetemperatur (CRT)** | 15–25°C (kontrolleret) | Farmaceutiske produkter |

### Krav til kølekæden

| Krav | Beskrivelse |
|------|-------------|
| **Ubrudt kæde** | Temperaturkontrol må ikke brydes — ikke ved ompakning, håndtering eller transport |
| **Dokumentation** | Temperaturlogning er obligatorisk for farmaceutiske produkter (GDP-regler) |
| **Emballage** | Termisk emballage, køleelementer, vakuumisolering |
| **Transportørgodkendelse** | Særlige fragtaftaler med temperaturkontrollerede køretøjer |
| **Alarm ved afvigelse** | Systemer til at opdage og reagere på temperaturbrud |

### GDP (Good Distribution Practice)
EU-regulering for distribution af farmaceutiske produkter. Kræver:
- Temperaturmapping af lagerfaciliteter
- Validerede transportruter
- Uddannet personale
- Dokumentationsystem

### For 3PL med kølekæde
Sørg for at kontrakten specifikt adresserer:
- Maksimalt tilladte temperaturafvigelse
- Reaktionstid ved temperaturalarm
- Dokumentation og rapportering
- Ansvar ved brud på kølekæden

### Relaterede emner
→ Se: 3PL — Aftal klare rammer (lagerhåndbog.md)

---

# NETVÆRK OG TEKNOLOGI

---

## WiFi og netværk til terminaler

### Hvad er det
Anbefalinger til WiFi-infrastruktur for at sikre stabil drift af håndterminaler i lagermiljøet.

### Hvorfor det er kritisk
Terminaler kommunikerer i realtid med SmartPack via WiFi. Dårlig dækning = frosne terminaler, plukliste-låsninger og frustrerede medarbejdere.

→ Se: Terminal lader eller fryser (terminal.md)

### Typiske problemer på lageret

| Problem | Årsag | Konsekvens |
|---------|-------|-----------|
| **Dead spots** | Metalreoler, betonvægge absorberer signal | Terminal mister forbindelsen midt i pluk |
| **Interferens** | Mange terminaler + industriudstyr + nabonetværk | Ustabil forbindelse |
| **Roaming-problemer** | Terminal skifter langsomt fra ét access point til et andet | Kortvarige forbindelsestab ved bevægelse |
| **Overbelastet access point** | For mange enheder på ét access point | Langsom forbindelse, timeouts |

### Anbefalinger — WiFi-infrastruktur

| Anbefaling | Detalje |
|------------|---------|
| **Standarder** | WiFi 5 (802.11ac) minimum — WiFi 6 (802.11ax) anbefales til høj tæthed |
| **Frekvens** | 5 GHz foretrækkes til terminaler — mindre interferens end 2,4 GHz |
| **Placering af access points** | Monter i loftets højde for maksimal dækning — undgå at stille på hylder |
| **Antal access points** | Beregn: ca. 20–30 aktive terminaler per access point (5 GHz) |
| **Dækning** | Overlappende dækning på 20–30% sikrer problemfri roaming |
| **Industrial WiFi** | Overvej Cisco Meraki, Ubiquiti UniFi eller Aruba til professionelt lagerbrug |

### Test inden ibrugtagning
Brug en WiFi-analyseapp (fx WiFi Analyzer, Ekahau) til at kortlægge signalstyrke i hele lageret inden installation af terminaler. Find og eliminer dead spots proaktivt.

### Minimum signalstyrke
SmartPack (og de fleste web-apps) kræver stabilt signal. Som tommelfingerregel:
- RSSI bedre end **-70 dBm** for stabil drift
- Under -80 dBm → problemer sandsynlige
- Under -90 dBm → utilstabil

### Simultan brug
10 terminaler der plukker simultant er ikke 10 gange belastningen af én terminal — men plan for topbelastning (fx alle terminaler aktive under Black Friday).

### Datasimkort som backup
Overvej 4G/LTE-datasimkort som fallback ved WiFi-udfald. Under 10 GB/måned per terminal ved normal SmartPack-brug.

→ Se: Datasimkort (terminal.md)

### Relaterede emner
→ Se: Systemnedbrud — beredskabsplan

---

# ORDREFLOWS

---

## B2B ordreflow

### Hvad er det
B2B (Business-to-Business) ordrer adskiller sig fundamentalt fra B2C på en række punkter der påvirker lager, pluk, pak og administration.

### Nøgleforskelle: B2B vs. B2C

| Dimension | B2C | B2B |
|-----------|-----|-----|
| **Ordrestørrelse** | Typisk 1–5 stk. | Kan være hundredvis |
| **Leveringsadresse** | Privat/pakkeshop | Erhvervsadresse (kvitteret modtagelse) |
| **Betaling** | Forudbetalt | Kredit (EAN, faktura) |
| **Emballage** | Forbrugeremballage | Palle, kolli, handelsemballage |
| **Dokumentation** | Følgeseddel valgfrit | Leverandørfaktura, pakkeliste, CMR |
| **Leveringstid** | 1–3 hverdage | Aftalt leveringsvindue |
| **Fejlhåndtering** | Enkeltsag per ordre | Kreditnota, reklamationsflow, debitnota |
| **Fragtkrav** | Standard transportør | Evt. særlig pallet/budforsendelse |

### B2B-specifikke lagerbehov

**Palle-pakning:**
- B2B-ordrer på paller kræver speciel pakkestation og udstyr
- Palle-etiketter, fritstående pallerammer, stretchfilm
- Scan til Palle-funktionen i SmartPack er relevant
→ Se: Scan til Palle (terminal.md)

**Kolli-forsendelse:**
- Mange B2B-ordrer forskydes i kolli (hele kasser)
- Kolli-stregkoder i SmartPack giver korrekt registrering
→ Se: Kolli-stregkoder (admin.md)

**Collections til B2B:**
- Varer der sælges i mixed kolli til B2B (og udpakket til B2C) kan håndteres via Collections-produkttype
→ Se: Produkttyper — Kollektions (admin.md)

### EAN-fakturering (offentlig sektor)
Handel med offentlige institutioner i Danmark kræver EAN-fakturering via NemHandel. EAN-nummer = 13-cifret identifikationsnummer på institutionen.

### CMR-fragtbrev
International vejtransport af varer kræver CMR-fragtbrev (Convention relative au contrat de transport international de marchandises par Route). Udstedes af transportøren.

### Leveringsvindue og booking
Mange B2B-modtagere (butikker, grossister) kræver forudgående booking af leveringstidspunkt. Tjek transportørens booking-system eller kontakt modtager direkte.

### Relaterede emner
→ Se: Sorteringszoner (admin.md)
→ Se: Leveringsmetoder (admin.md)

---

## Quality Control (QC) ved modtagelse

### Hvad er det
Systematisk kontrol af indkommende varer inden de godkendes og registreres på lageret.

### Hvornår bruges det
- Ved alle leverancer fra nye leverandører (skærpet kontrol)
- Ved leverancer med known issues (defekthistorik)
- Stikprøvekontrol ved etablerede leverandører
- Altid ved udsolgte produkter der haster til ordreafvikling

### QC-niveauer

| Niveau | Beskrivelse | Hvornår |
|--------|-------------|---------|
| **100% kontrol** | Alle enheder kontrolleres | Nye leverandører, high-value, reklamationshistorik |
| **Stikprøve (AQL)** | Kontroller X% af leverancen | Etablerede leverandører |
| **Visuel inspektion** | Kasse og emballage-tjek | Minimum ved alle leverancer |
| **Ingen kontrol** | Direkte til lager | Kun kendte leverandører med perfekt track record |

### AQL (Acceptable Quality Level)
Statistisk metode til stikprøvekontrol:
- **AQL 1.0** = Streng kontrol (dyrt udstyr, medicin)
- **AQL 2.5** = Standard for de fleste forbrugsvarer
- **AQL 4.0** = Lempeligere (billige varer, lav reklamationsrisiko)

AQL-tabeller angiver hvor mange enheder der skal kontrolleres af en given leverancestørrelse.

### Tjekpunkter ved modtagelse

| Tjek | Beskrivelse |
|------|-------------|
| **Antal** | Stemmer leveret antal med bestilt antal? |
| **SKU/variant** | Er det de rigtige produkter og varianter? |
| **Emballage** | Er emballagen hel og ubeskadiget? |
| **Produktkvalitet** | Er produktet som forventet? Ingen defekter? |
| **Udløbsdato** | Er der tilstrækkelig holdbarhed? |
| **Stregkoder** | Er EAN-koder korrekte og scannbare? |
| **Dokumentation** | Er følgeseddel/pakkeliste korrekt? |

### Hvad gør du ved afvigelser

| Afvigelse | Handling |
|-----------|---------|
| Fejlleverance (forkert vare) | Afvis leverancen eller segregér — kontakt leverandøren |
| Underlevering | Modtag det leverede — åbn kreditnota-sag for resten |
| Defekte enheder | Segregér til RMA-zone — dokumentér med billeder |
| Forkert stregkode | Ret stregkode i SmartPack eller bed leverandøren om nyt |

### SmartPack-integration
- Brug ankomst-funktionen til at registrere modtaget antal
- Defekte varer registreres i karantæne (Lagerrevision → tandhjul → Sæt i karantæne)
- RMA-placeringer per leverandør til systematisk claim-håndtering

→ Se: Ankomst — Behandl (terminal.md)
→ Se: Lagerrevision — Karantæne (terminal.md)
→ Se: Returlokation som plukprioritet (lagerhåndbog.md)

### Relaterede emner
→ Se: Fragtforhandling (lagerhåndbog.md — leverandørdokumentation)


---

# DRIFT OG PLANLÆGNING

---

## Årsafslutning og lageropgørelse

### Hvad er det
Den periodiske (typisk årslige) opgørelse af hele lagerbeholdningens fysiske og regnskabsmæssige status.

### Hvornår og hvem
- **Årsregnskab**: Kræves af revisor/bogfører som grundlag for årsregnskabet
- **Skæringsdato**: Typisk 31. december (eller virksomhedens regnskabsår)
- **Periodisk**: Mange vælger halvårlig eller kvartalsvis opgørelse

### To metoder

| Metode | Beskrivelse | Fordel/Ulempe |
|--------|-------------|---------------|
| **Fuld lukkeopgørelse** | Lageret lukker, alt tælles i én operation | Præcis, men dyr og forstyrrende |
| **Rullende + snapshot** | Løbende optælling + snapshot på skæringsdato | Mindre forstyrrelse — kræver disciplin |

### Trin-for-trin — Årsopgørelse

**1–2 måneder før:**
- Ryd op i lageret — fjern kasserede varer, returvarer der ikke er behandlet
- Sikr at alle ankomster er afsluttede og registrerede
- Sikr at alle returer er behandlede og registrerede
- Kør ABC-analyse — prioritér høj-priorotets-varer til grundig optælling

**Ugen før:**
- Stop nye leverancer om muligt (eller planlæg streng staging)
- Minimer plukaktivitet på optællingsdagen
- Fordel tælleansvar på team-medlemmer per zone

**Optællingsdagen:**
1. Frys lagerudtræk fra systemet (SmartPack snapshot)
2. Tæl fysisk zone for zone — to-mands-metode anbefales (én tæller, én noterer)
3. Sammenlign fysisk antal med systemantal
4. Registrér alle afvigelser med årsagskode
5. Genudskriv tvivlstilfælde og gentæl

**Efter optælling:**
1. Indlæs reguleringer i SmartPack
2. Beregn lagerværdi: antal × kostpris per SKU
3. Lever opgørelse til revisor/bogfører
4. Analyser de største afvigelser — hvad kan forbedres til næste år?

### Lagerværdi-beregning

| Metode | Beskrivelse |
|--------|-------------|
| **FIFO-kostpris** | Ældste indkøbspris bruges til lagerværdi |
| **Gennemsnitskostpris (WAC)** | Vægtet gennemsnit af alle indkøbspriser |
| **NRV (Net Realisable Value)** | Salgspris minus forventede omkostninger |

SmartPack bruger **vægtet gennemsnitskostpris** (lagerkostpris).

→ Se: Kostpris vs. Lageromkostning (admin.md)

### Lageropgørelse i SmartPack
1. Admin → Rapporter → **Lagerhistorik** med dato = skæringsdato
2. Eksportér CSV
3. Sammenlign med fysisk optælling

### Typiske overraskelser ved årsopgørelse
- Kasserede varer der aldrig er registreret
- Returvarer der aldrig kom på lager igen
- Varer modtaget men ikke registreret i system
- Manko på fast-sælgende varer (svind akkumuleret)

### Relaterede emner
→ Se: Rullende lageroptælling (lagerhåndbog.md)
→ Se: Kasserede varer (lagerhåndbog.md)
→ Se: Lager — Status og reguleringer (admin.md)

---

## Sæsonplanlægning og årshjul

### Hvad er det
En struktureret planlægningscyklus der sikrer at lageret, indkøb, bemanding og systemer er klar til sæsonudsving i god tid.

### Årshjul — e-commerce lager

| Måned | Fokus |
|-------|-------|
| **Januar** | Årsafslutning afsluttet · Januarudsalg · Analysér Black Friday resultater |
| **Februar** | Revider ABC-analyse · Opdatér plukkeprofiler · Ryd op i lagerlayout |
| **Marts** | Forår/påske-forberedelse · Check leverandøraftaler |
| **April–Maj** | Sæsonvarer: sommer · Byg buffer-lager op |
| **Juni** | Mid-season vurdering · Forhandl fragtaftaler (lav-sæson = god forhandlingsposition) |
| **Juli** | Lav sæson → ideelt til lagerforbedringer, flytning, opsætning |
| **August** | Planlæg Black Friday: Bestil lager, book ekstra bemanding |
| **September** | Kør test-kampagner · Validér printere og terminaler |
| **Oktober** | **Sort fredag forberedelse**: tjekliste, lager, emballage, bemanding klar |
| **November** | **Black Friday/Singles Day** · Kør på fuldt setup |
| **December** | Juleudsalg · Bestil årsopgørelses-ressourcer |
| **December slut** | Lageropgørelse |

### Sæsonvarer — særlige hensyn

| Hensyn | Handling |
|--------|---------|
| **ABC-justeringer** | Sommervarer er A i juni, C i december — opdatér placeringer |
| **Buffer-lager** | Byg op 4–6 uger inden sæson |
| **Udgående sæsonvarer** | Planlæg udsalg/nedprisning — frigør plads og likviditet |
| **Leverandørfrister** | Mange leverandører har lange leadtider på sæsonvarer |

### Fragtforhandling — hvornår

**Optimal forhandlingstid:** Lav-sæson (juli–august)
- Transportørerne har kapacitet
- Du har data fra forrige sæson
- Tid til at skifte leverandør inden Black Friday

### Kapacitetsplanlægning

| Element | Hvornår planlægges |
|---------|-------------------|
| Ekstra medarbejdere | 3–4 uger inden peak |
| Ekstra emballage | 2–3 uger inden peak |
| Ekstra plukkevogne | 4–6 uger inden peak |
| Ekstra lagerplads | 6–8 uger inden peak |

### Relaterede emner
→ Se: Store kampagnedage — forberedelse (lagerhåndbog.md)
→ Se: ABC-analyse på lageret (lagerhåndbog.md)
→ Se: Fragtforhandling (lagerhåndbog.md)

---

## Systemnedbrud — Beredskabsplan

### Hvad er det
En plan for hvad lageret gør hvis SmartPack eller internet-forbindelsen er utilgængelig.

### Hvornår opstår systemnedbrud
- Servernedbrud (SmartPack-siden)
- Internetudfald på lageret
- Strømudfald
- DNS-problemer
- Browserproblem på terminaler

### Prioriteret fejlsøgning (before declaring nedbrud)

| Trin | Check |
|------|-------|
| 1 | Er det kun én terminal? → Genstart appen |
| 2 | Er det alle terminaler? → Tjek WiFi/internet |
| 3 | Kan admin-siden tilgås fra PC? |
| 4 | Er det SmartPack-siden? → Tjek status.smartpack.dk |
| 5 | Genstart SmartPack: Admin → Indstillinger → Restart Application |

→ Se: Genstart SmartPack (admin.md)

### Manuel nøddrift

**Niveau 1 — Kort udfald (< 2 timer):**
- Sæt pluk og pak på pause
- Marker ordrer til behandling når systemet er oppe
- Informér om eventuel forsinkelse

**Niveau 2 — Længere udfald:**

| Funktion | Manuel løsning |
|----------|---------------|
| **Pluk** | Print ordrelister fra email-backup eller shopsystem |
| **Pak** | Hav fragtlabels fra backup-printservice eller manuel fragtportal |
| **Modtagelse** | Papirliste med ankomstregistrering — indlæs i system bagefter |
| **Lagerstatus** | Brug seneste export som reference |

### Backup-printservice
De fleste fragtportaler (Shipmondo, Webshipper) har webbaseret adgang der er uafhængig af SmartPack. Hav login-credentials tilgængeligt.

### Kritisk information der bør ligge offline

| Information | Opbevaring |
|-------------|-----------|
| Login til fragtportal | Fysisk papir i pakkeriet |
| Adgang til shopsystem | Fysisk papir hos ansvarlig |
| Transportørs direkte kontakt | Opslaget ved pakkebordet |
| SmartPack support | +45 88 20 20 19 · Tast 9 (akut) |

### Kommunikation ved nedbrud
- Informér medarbejderne øjeblikkeligt
- Estimer varighed og kommunikér til kunder hvis forsinkelse er uundgåelig
- Dokumentér nedbrudstidspunkt og varighed

### Efter nedbrud
1. Synkronisér alt der er sket manuelt
2. Verificér at intet er mistet
3. Dokumentér årsag og reaktion til fremtidigt beredskab

### Relaterede emner
→ Se: Terminal lader eller fryser (terminal.md)
→ Se: Genstart SmartPack (admin.md)
→ Se: Support (terminal.md)

---

## WMS — Hvornår og ROI-beregning

### Hvad er det
En beslutningsguide og beregningsmodel for hvornår investering i et WMS giver mening.

### Signaler om at det er tid til WMS

| Signal | Hvad det fortæller |
|--------|-------------------|
| Pakkefejl over 1% | Manuel håndtering er upålidelig — scanning betaler sig |
| 50+ ordrer/dag | Manuelle processer begynder at knirke |
| Lageropgørelse umulig at holde à jour | System nødvendigt til sporbarhed |
| Medarbejdere bruger for lang tid på at finde varer | Lagernavigation og plukruter ikke optimerede |
| Oversalg sker jævnligt | Lagertal er ikke realtid |
| Kampagnedage er kaos | Systemet kan ikke skalere manuelt |

### ROI-beregningsmodel

**Typiske omkostninger der elimineres eller reduceres:**

| Omkostning | Beregning |
|-----------|-----------|
| **Pakkefejl** | Fejl/uge × 350 kr. × 52 uger |
| **Spildt pluk-tid** | (Manuel pluk-tid − Optimeret pluk-tid) × ordrer/dag × 250 kr./time × arbejdsdage |
| **Oversalg** | Tabt ordre-omsætning + kundeservice-tid |
| **Manuel lageropgørelse** | Timer × timeomkostning |
| **Unødige ansættelser** | Ekstra medarbejder-behov uden system |

**Eksempel-beregning:**

| Post | Beregning | Beløb/år |
|------|-----------|---------|
| 5 pakkefejl/uge × 350 kr. | × 52 = | 91.000 kr. |
| 20 min. spildt pluk/dag per medarbejder (2 mand) | × 250 kr. × 230 dage = | 38.300 kr. |
| 2 × 5 timer lageropgørelse × 4/år | × 250 kr. = | 10.000 kr. |
| **Total potentiel besparelse** | | **~139.000 kr./år** |

**SmartPacks pris:** Baseret på pakkelabels — for typisk 1.000 ordrer/måned: langt under besparelsen.

### Hvad WMS giver udover besparelser
- Realtids-lagerdata → kunder ser korrekt lager
- Sporbarhed (batch, LOT, serienummer)
- Grundlag for 3PL-samarbejde
- Skalerbarhed uden lineær personalevækst
- Data til forecasting og indkøbsoptimering

### Hvornår WMS er for tidligt
- Under 20–30 ordrer/dag med simpelt sortiment
- Hvis grundprocesserne (ABC, dobbelttjek, returzone) ikke er på plads
- Hvis lagerdata er for dårlige til at migrere

**Råd:** Styr på grundprocesserne + god datahygiejne INDEN WMS-implementering sparer 50% af onboarding-tid.

### Relaterede emner
→ Se: Afrunding (lagerhåndbog.md)
→ Se: Datahygiejne og SKU-navngivning (lagerhåndbog.md)


---

# COMPLIANCE OG LOVKRAV

---

## Intrastat (Danmark 2025)

### Hvad er det
<cite index="13-4">Intrastat er et system til indberetning og udarbejdelse af statistikker om handel med varer mellem EU's lande.</cite>

### Hvem skal indberette

<cite index="11-8,11-9,11-10">I Intrastat anvendes en statistisk tærskel, baseret på værdien af henholdsvis den årlige import og eksport til andre EU-lande. Denne tærskel kaldes fritagelsestærsklen. Virksomheder, hvis årlige EU-handel ligger under denne tærskel, er fritaget for at indberette oplysninger til Intrastat.</cite>

### Tærskelværdier 2025 (Danmark)

<cite index="11-12,11-13,11-14,11-15,11-16,11-17">I 2025 er fritagelsestærsklen sat så virksomheder med EU-eksport over 11,3 mio. kr. eller EU-import over 41,0 mio. kr. skal indberette hhv. eksport eller import til Intrastat.</cite>

| Type | Tærskel 2025 |
|------|-------------|
| **EU-eksport** | Over 11,3 mio. kr./år |
| **EU-import** | Over 41,0 mio. kr./år |
| **Forenklet eksport-indberetning** | 11,3 – 16,5 mio. kr. (frivilligt at indberette varekode m.m.) |

### Hvornår starter pligten

<cite index="13-6,13-7">Virksomheder, som er pligtige på baggrund af handel i 2025, skal indberette fra og med januar 2026. Virksomheder, der krydser en tærskel i løbet af 2026, skal indberette fra og med den måned, hvor tærsklen krydses.</cite>

### Indberetning

<cite index="13-14">Indberetningsfrist afhænger af niveau af virksomhedens Intrastat varehandel.</cite>

| Gruppe | Niveau | Frist |
|--------|--------|-------|
| **Gruppe 1** | Højt niveau (import > 41 mio. eller eksport > 16,5 mio.) | 10. hverdag efter måneden |
| **Gruppe 2** | Lavere niveau (eksport 11,3–16,5 mio.) | Samme frist som momsindberetning (~25. i måneden efter) |

<cite index="19-2,19-3">Du indberetter til Intrastat online via IDEP. Data kan indtastes manuelt, men der kan ofte spares tid ved at lade virksomhedens økonomisystem (C5, Navision, SAP, XAL, Visma m.fl.) danne filer, der kan importeres direkte til IDEP.</cite>

### Praktisk for e-commerce
De fleste SMV-webshops er **ikke** Intrastat-pligtige da tærsklen på 11,3 mio. kr. er relativ høj. Men vær opmærksom ved:
- Rapid vækst i EU-eksport
- Dropshipping til EU-kunder
- B2B-salg til EU-lande

### Ressource
Danmarks Statistik: dst.dk/intrastat

---

## IOSS — Import One Stop Shop

### Hvad er det
IOSS er en EU-momsordning der forenkler momsafregning ved salg af varer under 150 EUR til forbrugere i EU fra tredjelande.

### Hvornår er det relevant
Du er udenfor EU (fx UK, USA, Kina) og sælger til EU-forbrugere. Eller du er i EU og handler via platforme der bruger IOSS.

### Princippet
Uden IOSS: Kunden betaler told og moms ved levering → forsinker forsendelsen, frustrerer kunden.
Med IOSS: Sælger opkræver og afregner moms ved salg → pakken passerer told uden forsinkelse.

### Grænseværdi
**150 EUR per forsendelse.** Over 150 EUR gælder normale toldregler.

### Registrering
- Registrér dig i IOSS-systemet i ét EU-land → gælder i alle EU-lande
- Anvend IOSS-nummeret på forsendelsesdokumenter

### Relevans for store platforme
Amazon, Shopify Payments og andre store platforme håndterer ofte IOSS automatisk for varer solgt via deres marketplace.

### Ressource
Skat.dk: skat.dk/ioss

---

## WEEE (Waste Electrical and Electronic Equipment)

### Hvad er det
EU-direktiv om lovpligtig håndtering af elektronikaffald. Gælder for alle der sælger elektriske og elektroniske produkter i EU.

### Hvem er berørt
Alle der sælger:
- Elektronik (mobiler, computere, tablets)
- Husholdningsapparater
- Belysningsudstyr (LED-pærer m.m.)
- Legetøj med elektronik
- Værktøj med strøm/batteri
- Medicinsk udstyr med strøm

### Krav

| Krav | Beskrivelse |
|------|-------------|
| **Registrering** | Registrér i nationalt WEEE-register per land du sælger i |
| **Mærkning** | Papirkurv med kryds over (⛌) på produktet og/eller emballagen |
| **Indsamlingsbidrag** | Bidrag til indsamlingsordning (typisk via registreringsorganisation) |
| **Rapportering** | Rapportér mængden af solgte enheder til myndighederne |

### Nationale registre (eksempler)

| Land | Register |
|------|---------|
| **Danmark** | DPA-System: dpa-system.dk |
| **Sverige** | El-Kretsen: el-kretsen.se |
| **Norge** | Elretur: elretur.no |
| **Tyskland** | WEEE-Reg: ear-system.de |
| **UK (post-Brexit)** | Producer registration: gov.uk/electricalwaste |

### Konsekvens ved manglende registrering
Salgsstop i det pågældende land er muligt. Markedsovervågning i DE og FR er særligt aktiv.

### Ressource
Europa-Kommissionen: ec.europa.eu/environment/topics/waste-and-recycling/waste-electrical-and-electronic-equipment-weee

---

## CE-mærkning

### Hvad er det
CE-mærkning dokumenterer at et produkt opfylder relevante EU-direktiver og -forordninger for sikkerhed, sundhed og miljø.

### Hvem skal CE-mærke

CE-mærkning er **obligatorisk** for produkter der er dækket af et EU-harmoniseringsdirektiv, herunder:

| Produktkategori | Relevant direktiv |
|----------------|-----------------|
| Elektrisk udstyr (lav spænding) | LVD (2014/35/EU) |
| Elektronisk udstyr (EMC) | EMC-direktivet (2014/30/EU) |
| Legetøj | Legetøjsdirektivet (2009/48/EF) |
| Byggematerialer | CPR (305/2011/EU) |
| Medicinsk udstyr | MDR (2017/745/EU) |
| Personlige værnemidler | PPE-forordningen (2016/425/EU) |
| Maskiner | Maskindirektivet (2006/42/EF) |

### Hvad CE-mærkning indebærer

| Krav | Beskrivelse |
|------|-------------|
| **Risikovurdering** | Dokumentér at produktet er sikkert |
| **Teknisk dokumentation** | Samling af tests, tegninger, risikovurderinger |
| **EU-overensstemmelseserklæring** | Skriftlig erklæring fra producent/importør |
| **Synlig mærkning** | CE-logoet på produktet og/eller emballagen |
| **Notificeret organ** | Visse produkter kræver tredjeparts-certificering |

### Importørens ansvar
Importerer du produkter fra tredjelande til EU, **er du** (ikke producenten) ansvarlig for CE-mærkning. Du overtager producentens ansvar.

### Ressource
Erhvervsstyrelsen: erhvervsstyrelsen.dk/ce-maerkning

---

## GDPR i lagerkontekst

### Hvad er det
General Data Protection Regulation — EU's persondataforordning. Relevant for lagerdrift fordi ordre- og returdata er persondata.

### Persondata i lagerdriften

| Data | Klassifikation |
|------|---------------|
| Kundens navn, adresse, email | Personoplysninger |
| Ordrehistorik | Personoplysninger |
| Track & trace med navn | Personoplysninger |
| Medarbejderens aktivitetslog | Personoplysninger om medarbejder |
| Returdata med årsag | Personoplysninger |

### Krav der er relevante for lager

| Krav | Praktisk handling |
|------|-----------------|
| **Databehandleraftaler** | Alle systemer der håndterer kundedata (SmartPack, fragtleverandører, returportal) kræver en DPA |
| **Opbevaringstid** | Data må ikke opbevares længere end nødvendigt — regnskabsmæssig nødvendighed (typisk 5 år) |
| **Adgangsstyring** | Kun relevante medarbejdere har adgang til kundedata |
| **Sikkerhed** | Password-beskyttelse, adgangslog, kryptering ved overførsel |
| **Ret til sletning** | Kunder kan bede om sletning af deres data |

### Databehandleraftale med SmartPack
SmartPack behandler kundedata på dine vegne → Databehandleraftale er påkrævet.
Kontakt: support@smartpack.dk

### Opbevaringstid for ordre-/lagerdata
**Bogføringsloven** kræver at regnskabsmateriale opbevares i **5 år**. Ordredata der udgør regnskabsmateriale skal opbevares i mindst 5 år.

### Ressource
Datatilsynet: datatilsynet.dk

---

## Emballagelovgivning (DE og FR)

### Hvad er det
Krav om registrering og bidrag til indsamlingsordninger for emballage sat på markedet i visse EU-lande.

---

### Tyskland — Verpackungsgesetz (VerpackG)

**LUCID-registrering er obligatorisk** for alle der sætter emballage på det tyske marked — inkl. udenlandske webshops der sender til tyske forbrugere.

| Krav | Detalje |
|------|---------|
| **Registrering** | Stiftung Zentrale Stelle Verpackungsregister: verpackungsregister.org |
| **Systemtilmelding** | Tilmeld dig en godkendt dual-system organisation (fx Der Grüne Punkt) |
| **Indberetning** | Rapportér mængde emballage sat på markedet |
| **Konsekvens ved manglende** | Salgsforbud + bøde |

**Gælder for:** Primær emballage (rund om produktet), transportemballage (pap, kasser) og serviceemballage (poser, kuverter).

**Fritagelse:** Rene B2B-forsendelser til detailhandel er håndteret af detailhandleren selv — men direct-to-consumer er fuldt omfanget.

---

### Frankrig — REP (Responsabilité Élargie du Producteur)

**Obligatorisk** for alle der sætter emballerede produkter på det franske marked.

| Krav | Detalje |
|------|---------|
| **Registrering** | ADEME's SYDEREP system |
| **Eco-organisation** | Tilmeld dig fx Citeo |
| **Indberetning** | Mængde og type emballage |
| **Mærkning** | Triman-logo anbefales (frivilligt for ikke-franske virksomheder) |

---

### SmartPack og emballageregistrering
SmartPack registrerer emballagemængde ved pakning. Disse data kan eksporteres til brug ved lovpligtig emballage-rapportering.

→ Se: Emballage og pakketyper (admin.md)

### Ressourcer
- LUCID: verpackungsregister.org
- Citeo (Frankrig): citeo.com
- EU's overordnede emballagedirektiv: EUR-Lex 94/62/EF

---

*Generel Logistik og Compliance · Lossless transformation · Kilde: Offentlige myndigheder og EU-lovgivning*

---

# TARIFKODER (HS KODER)

---

## Tarifkode — Hvad er det og hvorfor er det vigtigt

### Hvad er det
<cite index="25-20">En tarifkode er den kode, der beskriver din vare, som du skal angive på dine toldpapirer — herunder tolddeklaration ved import og eksport.</cite>

<cite index="29-12,29-13,29-14">De fleste lande bruger det Harmoniserede System (HS), som er udviklet af Verdenstoldorganisationen. HS tildeler en 6-cifret kode til hver produkttype. Landene kan derefter tilføje flere cifre for endnu flere detaljer.</cite>

### Hvornår er det nødvendigt

| Situation | Krav |
|-----------|------|
| Eksport til lande udenfor EU | Obligatorisk på tolddeklaration |
| Import fra lande udenfor EU | Obligatorisk |
| Forsendelse til UK (post-Brexit) | Obligatorisk — 10-cifret UK commodity code |
| Forsendelse til USA | Obligatorisk — HTS kode |
| IOSS-forsendelser | Kræves for korrekt momsberegning |
| Intrastat-indberetning | Obligatorisk på EU-varekode-niveau |

### Konsekvenser af forkert kode

<cite index="29-17,29-18,29-19,29-20">Hvis du bruger den forkerte kode, kan din forsendelse blive forsinket, returneret eller endda konfiskeret. Toldkoden bestemmer, hvor meget importafgift eller -told du skal betale. Brug af den rigtige kode sikrer, at du ikke betaler for meget (eller for lidt, hvilket kan føre til bøder). Forkerte koder kan føre til juridiske problemer, bøder eller forbud mod forsendelse til bestemte lande.</cite>

---

## Tarifkodesystemets struktur — Fra HS til TARIC

### Overblik

<cite index="28-1">Opdelingerne i afsnit, kapitler, 4-cifrede hovedpositioner og 6-cifrede underpositioner samt de Almindelige tariferingsbestemmelser (ATB) kommer fra Det Harmoniserede Varebeskrivelses- og Varenomenklatursystem — i daglig tale Det Harmoniserede System, forkortet HS.</cite>

```
HS kode:      6 cifre  →  global standard (200+ lande)
CN kode:      8 cifre  →  EU standard (HS + 2 EU-cifre)
TARIC kode:  10 cifre  →  EU import (CN + 2 TARIC-cifre)
```

### Lagene forklaret

| Lag | Cifre | Navn | Dækning |
|-----|-------|------|---------|
| **HS** | 1–6 | Harmonized System | Global — alle lande der anvender HS |
| **CN** | 7–8 | Kombineret Nomenklatur | EU-specifik underopdeling |
| **TARIC** | 9–10 | Integrated Customs Tariff | EU-import: toldsatser, kvoter, anti-dumping |

### HS-kodens opbygning (6 cifre)

```
Eksempel: 6109.10.00

61       = Kapitel (Trikotage tøj, maskinstrikkede eller hæklede)
6109     = Position (T-shirts, undertrøjer og lignende)
6109.10  = Underposition (Af bomuld)
```

<cite index="22-2,22-3">HS-nomenklaturen er overvejende baseret på en inddeling af varerne efter det materiale, de er fremstillet af og består af ca. 5.000 varekoder på 6 cifre.</cite>

### CN-koden (8 cifre) — EU

<cite index="22-4,22-5,22-6">Inden for EU-landene anvendes en fælles told- og statistiknomenklatur (Den Kombinerede Nomenklatur — KN), som består af ca. 10.000 varekoder på 8 cifre. I KN er de første 6 cifre de samme som HS-nomenklaturen og de to sidste cifre er en underinddeling, der kun anvendes inden for EU-landene.</cite>

**Eksempel — T-shirt af bomuld:**
```
6109 10 00  (8-cifret CN)
^^^^ ^^  ^^
HS   EU  (ledig)
```

### TARIC (10 cifre) — EU import

<cite index="26-3,26-4,26-5">Hvis du importerer varer, skal du kende de to sidste cifre af varekoden. Disse to cifre kommer fra TARIC. Det er EU's integrerede toldtarif, og de bestemmer bl.a. om der er toldsuspensioner, muligheder for toldnedsættelser eller anti-dumpingtold ved import fra tredjelande.</cite>

---

## Landespecifikke tarifkoder (Country Tariff Codes)

### Hvad det er
<cite index="21-7">Trods landespecifikke tilpasninger forbliver de første seks cifre harmoniserede globalt, hvilket giver toldmyndigheder mulighed for nøjagtigt at identificere varer.</cite>

De første 6 HS-cifre er altid ens — men hvert land/område tilføjer egne cifre herefter.

### Lande-oversigt

| Land/Område | Kode | Cifre | Særlige krav |
|-------------|------|-------|-------------|
| **EU** | CN + TARIC | 8–10 | Standard for alt EU-handel |
| **UK** | UK Commodity Code | 10 | Post-Brexit eget system (baseret på CN) |
| **USA** | HTS (Harmonized Tariff Schedule) | 10 | Schedule B til eksport, HTS til import |
| **Canada** | HS + national | 8–10 | CBSA Schedule |
| **Australien** | ACS | 8 | HS + 2 Australian cifre |
| **Kina** | CIQ | 8–10 | HS + kinesisk underopdeling |
| **Norge** | Tolltariffen | 8 | Lig CN-baseret |
| **Schweiz** | Swiss Tariff | 8 | Lig CN-baseret |

### UK efter Brexit — særlig vigtig

UK er ikke længere i EU's toldsystem. Forsendelser til UK fra EU kræver:
- **10-cifret UK Commodity Code** (eksport fra UK) eller **Import Commodity Code**
- **Customs declaration** — CN22/CN23 eller fuld tolddeklaration
- Grænse: Forsendelser over **£135** kræver fuld importmoms-registrering i UK

Find UK koder: trade-tariff.service.gov.uk

---

## Tarifkoder i SmartPack

### To separate felter

SmartPack understøtter to separate tarifkode-felter på produktkortet:

| Felt | Beskrivelse | Typisk indhold |
|------|-------------|---------------|
| **Tarifkode** | Generel HS/CN-kode | 8-cifret CN-kode til EU-eksport |
| **Lande-tarifkoder** | Landespecifikke koder | UK = 10-cifret, USA = 10-cifret HTS osv. |

### Sti i SmartPack
Admin → Produkter → vælg produkt → fanen **Eksportdata**

### Hvornår bruges de i SmartPack
Tarifkoder trækkes automatisk ind på:
- Tolddokumentation ved international forsendelse
- CN22/CN23-erklæringer (pakker under/over 300 SDR)
- Kommercielle fakturaer til international forsendelse
- IOSS-beregning

### Opsætning — trin-for-trin

1. Find HS-koden for produktet (se ressourcer nedenfor)
2. Udvid til 8-cifret CN-kode for EU
3. Opdatér eventuelt til 10-cifret for UK og USA (Lande-tarifkoder)
4. Admin → Produktet → Eksportdata → udfyld feltene
5. Test med en forsendelse til det pågældende land

---

## Sådan finder du den rigtige tarifkode

### Metode 1 — Spørg leverandøren
<cite index="26-6,26-7">Typisk vil din leverandør levere tarif- eller HS-koderne for de produkter, du modtager. Du kan alternativt bede dem om at videresende koderne til dig.</cite>

### Metode 2 — EU's officielle værktøjer

| Værktøj | URL | Bruges til |
|---------|-----|-----------|
| **TARIC** (EU) | taxation-customs.ec.europa.eu/eu-customs-tariff-combined-nomenclature_en | Find CN/TARIC kode |
| **EBTI** (Bindende tariferingsoplysninger) | ec.europa.eu/taxation_customs/dds2/ebti | Se afgørelser for lignende varer |
| **Toldstyrelsen DK** | toldst.dk/erhverv/saadan-beregner-du-din-told/varekoder | Dansk vejledning |
| **Access2Markets** (EU) | trade.ec.europa.eu/access-to-markets | Find kode + toldsatser per land |

### Metode 3 — Bindende tariferingsoplysning (BTO)

<cite index="23-11,23-12">Du har mulighed for selv at søge om en bindende tariferingsoplysning (BTO). Det vil sige, at du får en bindende afgørelse af, hvilken varekode din vare hører under.</cite>

BTO er juridisk bindende for din virksomhed — den bedste sikring mod toldproblemer.

### Metode 4 — Toldagent / Speditør
Ved tvivl eller komplekse produkter: kontakt en toldagent. Prisen er lav sammenlignet med risikoen for forkert klassificering.

---

## HS Kapitler — Overblik (de 21 afsnit)

| Afsnit | Kapitler | Indhold |
|--------|---------|---------|
| I | 1–5 | Levende dyr og animalske produkter |
| II | 6–14 | Vegetabilske produkter |
| III | 15 | Animalske og vegetabilske fedtstoffer |
| IV | 16–24 | Fødevarer, drikkevarer, tobak |
| V | 25–27 | Mineralske produkter |
| VI | 28–38 | Kemiske produkter |
| VII | 39–40 | Plast og gummi |
| VIII | 41–43 | Huder, skind, læder |
| IX | 44–46 | Træ og trævarer |
| X | 47–49 | Papirmasse, papir, bøger |
| XI | 50–63 | Tekstiler og beklædning |
| XII | 64–67 | Fodtøj, hatte, paraplyer |
| XIII | 68–70 | Sten, cement, keramik, glas |
| XIV | 71 | Ædle metaller, smykker |
| XV | 72–83 | Uædle metaller |
| **XVI** | **84–85** | **Maskiner og elektronik ← meget brugt i e-commerce** |
| XVII | 86–89 | Transportmidler |
| XVIII | 90–92 | Optik, ure, instrumenter |
| XIX | 93 | Våben og ammunition |
| XX | 94–96 | Møbler, legetøj, diverse |
| XXI | 97–99 | Kunstgenstande |

### Hyppige e-commerce kapitler

| Kapitel | Indhold | Eksempel |
|---------|---------|---------|
| **61** | Trikotage tøj | T-shirts, sokker |
| **62** | Ikke-trikotage tøj | Jakker, bukser af vævet stof |
| **64** | Fodtøj | Sko, støvler |
| **84** | Maskiner, computere | Laptops, printere |
| **85** | Elektrisk udstyr | Mobiltelefoner, høretelefoner, batterier |
| **87** | Køretøjer | Cykler, løbehjul |
| **90** | Optik, medicin | Briller, måleudstyr |
| **94** | Møbler, lamper | Stole, senge, pendler |
| **95** | Legetøj, sport | Børnelegetøj, sportsgrej |

---

## Typiske fejl og faldgruber

| Fejl | Konsekvens | Løsning |
|------|-----------|---------|
| **Bruger 6-cifret HS i stedet for 8-cifret CN** | Ufuldstændig tolddeklaration | Udvid til 8 cifre for EU |
| **Gammel kode** | CN opdateres årligt — koder udgår | Verificér kode mod årets KN-liste |
| **Bundles med blandede koder** | Hvilken kode angives? | Brug koden for det dominerende produkt |
| **Sætter "0000" eller blank** | Toldforsinkelse eller afvisning | Obligatorisk for international forsendelse |
| **Kopierer leverandørens kode blindt** | Leverandørens land kan have en anden udvidelse | Verificér at det er CN-kode for EU |

### Bundles — særlig situation
<cite index="29-22,29-23,29-24">Hvis du sælger pakker (fx et gavesæt med et krus, te og småkager), skal du muligvis angive flere toldkoder eller bruge en kode, der bedst beskriver hovedvaren. Kontakt din fragtpartner eller toldklarator for at få vejledning.</cite>

---

## Best Practice

| Regel | Forklaring |
|-------|-----------|
| **Én kode per SKU** | Registrér koden direkte på produktkortet i SmartPack |
| **Verificér årligt** | CN-koder opdateres hvert år (januar) |
| **Brug leverandørens kode som udgangspunkt** | Men verificér at det er korrekt EU-format |
| **Gem documentation** | Gem begrundelsen for din tarif-klassificering |
| **BTO ved tvivl** | Søg bindende tariferingsoplysning ved dyre eller tvivlsomme produkter |

---

## Ressourcer

| Ressource | URL | Indhold |
|-----------|-----|---------|
| **EU TARIC** | taxation-customs.ec.europa.eu | Officiel EU-tarifsøgning |
| **Access2Markets** | trade.ec.europa.eu/access-to-markets | Toldsatser per land |
| **Toldstyrelsen DK** | toldst.dk/varekoder | Dansk vejledning, BTO-ansøgning |
| **UK Trade Tariff** | trade-tariff.service.gov.uk | UK commodity codes |
| **USA HTS** | hts.usitc.gov | Amerikansk HTS-søgning |
| **Danmarks Statistik KN** | dst.dk/intrastat | KN-liste 2025 og 2026 |

---

## Relaterede emner
→ Se: Produktdata — alle felter (admin.md) — feltene `Tarifkode` og `Lande-tarifkoder`
→ Se: Intrastat (generel-logistik.md)
→ Se: IOSS (generel-logistik.md)
→ Se: Compliance og lovkrav (lagerhåndbog.md)
→ Se: Farliggods — ADR (generel-logistik.md) — UN-nummer adskiller sig fra tarifkode


---

# PALLESTANDARDER

---

## Pallestandarder — Komplet guide

### Hvad er det
Paller er det fundamentale transportunderlag der muliggør effektiv håndtering med truck og palleløfter. Kendskab til standarder er nødvendigt ved B2B-forsendelse, lageropsætning og fragtaftaler.

### EUR-pallen (Europallen) — Standard

<cite index="41-10,41-11,41-12,41-13">En EUR-palle måler 1200 × 800 mm og vejer cirka 22–25 kg. Den kan bære op til 1500 kg i statisk belastning og op til 1000 kg under transport. EUR-paller er lavet af massivt træ og er godkendt efter en række kvalitetsstandarder, herunder ISPM 15 til eksport. De bruges bredt i detail, industri og fødevarelogistik — og genkendes på det brændemærkede EUR- eller EPAL-logo på klodserne.</cite>

### Palletypeoversigt

| Type | Mål | Bæreevne | Anvendelse |
|------|-----|---------|-----------|
| **EUR-palle (helpalle)** | 1200 × 800 mm | 1.000 kg (transport) / 1.500 kg (statisk) | Standard Europa — de fleste formål |
| **EUR-2 palle** | 1200 × 1000 mm | 1.000 kg | UK og visse industrisegmenter |
| **Halvpalle (DS-palle)** | 600 × 800 mm | ~500 kg | Detail, begrænset plads |
| **Kvartpalle** | 400 × 600 mm | ~200 kg | Kampagnevarer, shop display |
| **Amerikansk GMA** | 1219 × 1016 mm | 1.000 kg | USA og Latinamerika |
| **Asiatisk standard** | 1100 × 1100 mm | — | Asien og Afrika |

### EUR-pallens dimensioner (præcise)

<cite index="49-1,49-2">En standard europapalle måler 800 millimeter i bredden og 1200 millimeter i længden. Den er 144 millimeter høj og vejer normalt omkring 25 kg.</cite>

### Halvpalle og kvartpalle (Danmark)

<cite index="47-1">Målene er: Helpalle: 800 × 1200 mm (EUR-paller) · Halvpalle: 600 × 800 mm (DS-paller eller engangspaller) · Kvartpalle: 400 × 600 mm (engangspaller).</cite>

<cite index="47-6,47-7,47-8">DS-halvpallen (Dansk Standard) svarer til en halv EUR-palle. DS-halvpallen er en returpalle, som kun benyttes i Danmark. Den måler 600 × 800 mm, har samme trætykkelse som en EUR-palle og er også varmebehandlet.</cite>

### Returpalle vs. engangspalle

| Type | Beskrivelse | Håndtering |
|------|-------------|-----------|
| **EUR-palle (EPAL)** | Returpalle — byttes "palle for palle" | Kunden returnerer pallen til næste levering |
| **DS-halvpalle** | Returpalle — kun i Danmark | Returner til leverandør |
| **Engangspalle** | Kasseres efter brug | Ingen bytteforpligtelse |

<cite index="43-24">Europaller bliver leveret med pant, og skal opfylde visse standarder, hvorimod engangspaller må kasseres efter brug.</cite>

### Priser (vejledende)

<cite index="43-14,43-15">En ny EUR-palle koster 90–120 kr., mens en halvpalle koster omkring 75 kr. Brugte paller er typisk 25 procent billigere.</cite>

### ISPM 15 — krav til international eksport

Alle træpaller der eksporteres til lande udenfor EU **skal** være ISPM 15 godkendte — varmebehandlede (HT) eller røgfumigerede (MB, dog forbudt i EU).

**Mærket:** Et firkantet symbol med en kerne og to bogstaver:
- `HT` = varmebehandlet (godkendt)
- `MB` = methyl bromide (forbudt i EU ved eksport — kun tilladt ved visse undtagelser)

<cite index="49-10">Ved varmebehandlingen af EUR-paller opvarmes træets kerne til 56 grader i mindst en halv time.</cite>

### Lastbilkapacitet

<cite index="43-8,43-9,43-10">En 40 fods container kan som udgangspunkt rumme 25 europaller på 120 × 80 cm. Mellemstor lastbil (faste sider, op til 5 ton): 15 paller. Stor lastbil (faste sider, op til 10 ton): 20 paller.</cite>

### 2-vejs vs. 4-vejs paller

<cite index="48-26,48-27,48-28">To-vejs pallets og fire-vejs pallets refererer til, hvordan en gaffeltruck kan tilgå pallen. To-vejs pallets kan tilgås fra to modsatte sider, mens fire-vejs pallets kan tilgås fra alle fire sider, hvilket giver mere fleksibilitet.</cite>

### Plastpaller — hvornår

<cite index="46-4,46-5">Plastpaller er generelt mere hygiejniske end træpaller, da plastik er et mere sterilt materiale, hvor der ikke udvikler sig eller ophober sig bakterier på samme måde. Med plastpaller undgår du også søm, træsplinter eller fugtskader.</cite>

Bruges til: Fødevareindustri · Medicinal · Kemikalie · Gentagen brug (lang levetid)

### Genkendelsesskilt på EUR-paller

<cite index="44-2">Set fra langsiden har godkendte europaller et ovalt mærke på højre klods med bogstaverne "EUR" indeni, og på venstre klods navnet på et europæisk jernbaneselskab.</cite>

Nye EUR-paller er altid varmebehandlede og mærket med EPAL-mærket.

### Relaterede emner
→ Se: B2B ordreflow (generel-logistik.md)
→ Se: Scan til Palle (terminal.md)
→ Se: Farliggods (generel-logistik.md) — ISPM 15 krav

---

# EU BATTERIFORORDNING

---

## EU Batteriforordning 2023/1542

### Hvad er det
<cite index="34-3,34-4">Med EU's nye batteriforordning 2023/1542 får virksomheder, der gør batterier eller produkter med batterier tilgængelige på markedet, et udvidet ansvar. Forordningen regulerer batterier fra produktion til bortskaffelse og har som mål at øge indsamling, genanvendelse og sporbarhed.</cite>

### Ikrafttræden

<cite index="35-7,35-8">Forordningen trådte i kraft den 17. august 2023. Forordningen finder umiddelbart anvendelse i alle EU-lande, herunder Danmark, fra den 18. februar 2024, men mange af de individuelle forpligtelser finder først anvendelse løbende hen over det næste årti.</cite>

### Hvem er berørt

<cite index="35-9,35-10">Forordningen pålægger forskellige erhvervsdrivende aktører forpligtelser i henhold til deres rolle i batteriets livscyklus. Dette omfatter både fabrikanten, importøren og distributøren — som alle går under samlebetegnelsen "producent" — hvis de har gjort batterier tilgængelige på markedet.</cite>

**Relevant for e-commerce der sælger:**
- Elektronik med batterier (mobiltelefoner, tablets, laptops)
- Elcykler, elscootere, el-legetøj
- Løse batterier (AA, AAA, lithium)
- Trådløst udstyr med integrerede batterier

### Batterityper der er reguleret

| Batteritype | Beskrivelse |
|-------------|-------------|
| **Bærbare batterier** | Indkapslede batterier der kan holdes i hånden — inkl. AA/AAA, knapceller, laptop-batterier |
| **LMT-batterier** | Lette transportmidler — elcykler, elscootere, elknallerter |
| **EV-batterier** | Elektriske køretøjer |
| **Industribatterier** | Kommerciel og landbrugsmæssig brug |
| **Bilbatterier** | Tænding, start og belysning |

### Tidslinje — krav pr. dato

| Dato | Krav |
|------|------|
| **18. feb. 2024** | Forordningen gælder direkte i hele EU |
| **2024** | Batteriregistrering i producentregister kræves for EV, industribatterier og LMT |
| **2025** | CO₂-aftryk deklaration obligatorisk for visse batterityper |
| **2026** | Generelle mærkningskrav for alle batterier |
| **2027** | QR-kode og digitalt batteripas obligatorisk |
| **2028** | Minimumskrav til genanvendt indhold (kobolt, nikkel, lithium, bly) |

<cite index="31-5">Mærkningskravene finder anvendelse fra 2026 og QR-koden fra 2027.</cite>

### Batteripas (digitalt produktpas)

<cite index="33-1,33-2">Med forordningen stilles der også for første gang krav om et digitalt produktpas — et batteripas. Passet har til formål at styrke sporbarheden af batterier og indhold af materialer samt fremme genbrug og genanvendelse.</cite>

<cite index="34-13">Passet skal indeholde oplysninger som fremstillingssted, kapacitet, forventet levetid og sikkerhedsinformation.</cite>

### Krav til udskiftelighed (e-commerce relevant)

<cite index="36-7">I fremtiden skal bærbare batterier være aftagelige og udskiftelige.</cite>

Praktisk konsekvens: Elektronik med ikke-udskiftelige batterier vil fra 2026+ møde modstand på EU-markedet.

### Producentregistrering

<cite index="34-7,34-8">Producenter skal registreres i et producentregister og kan enten selv håndtere opgaverne eller gøre det via en producentansvarsorganisation. I Danmark er Miljøstyrelsen den kompetente myndighed.</cite>

**Registrering i Danmark:** Miljøstyrelsen — mst.dk

### Indsamlingsmål for bærbare batterier

<cite index="35-25,35-26">For bærbare batterier er målet 45% ved udgangen af 2023, 63% ved udgangen af 2027 og 73% ved udgangen af 2030. For batterier til lette transportmidler er målet 51% ved udgangen af 2028 og 61% ved udgangen af 2031.</cite>

### Due diligence — undtagelse for SMV'er

<cite index="36-23,36-24,36-25">Mindre virksomheder med en årlig omsætning på under 40 mio. EUR er ikke omfattet af due diligence-kravet vedrørende batterimineraler. Omsætningen opgøres på koncernniveau, ikke for et enkelt datterselskab.</cite>

### Overensstemmelseserklæring

<cite index="35-1,35-2">For hver batterimodel skal den erhvervsdrivende udarbejde en EU-overensstemmelseserklæring, hvoraf det fremgår, at batteriet overholder forordningens krav. Erklæringen skal opbevares i 10 år efter at det sidste batteri af modellen er bragt i omsætning.</cite>

### Praktisk tjekliste for webshops der sælger batteri-produkter

| Trin | Handling |
|------|---------|
| **1. Identificér** | Sælger du batterier eller produkter med batterier? |
| **2. Registrér** | Registrér i Danmarks producentregister (Miljøstyrelsen) |
| **3. Mærkning (2026)** | Planlæg mærkningskrav på produkterne |
| **4. QR-kode (2027)** | Planlæg digitalt batteripas og QR-kode |
| **5. Leverandørdialog** | Sikr at leverandøren overholder forordningen |
| **6. Overensstemmelseserklæring** | Udarbejd og opbevar i 10 år |

### ⚠️ Konsekvens ved manglende overholdelse
Salgsstop og bøder. Markedsovervågning i DE og andre store EU-lande er aktiv.

### Ressourcer — officielle kilder
- **Lovtekst:** EUR-Lex: eur-lex.europa.eu/eli/reg/2023/1542
- **Danmarks Statistik:** ds.dk — standarder for batterier
- **Miljøstyrelsen DK:** mst.dk — producentregistrering
- **Dansk Erhverv:** danskerhverv.dk — vejledning til virksomheder

### Relaterede emner
→ Se: WEEE (generel-logistik.md) — parallel lovgivning for elektronikaffald
→ Se: CE-mærkning (generel-logistik.md)
→ Se: Farliggods — De ni klasser: Klasse 9 lithium-batterier (generel-logistik.md)
→ Se: Produktflags (admin.md) — Farliggods-flag og UN-nummer


---

# FRAGTPRIS-KALKULATION

---

## Fragtpris-kalkulation — Sådan sætter du priserne rigtigt

### Hvad er det
En struktureret metode til at beregne og sætte fragtpriser i checkout — så du hverken betaler for meget for kunderne eller mister på marginen.

### Det centrale problem
De fleste webshops sætter "fri fragt over X kr." uden at have beregnet præcis hvad X skal være for at de stadig tjener penge. Resultatet er enten:
- For lav grænse → du betaler fragt for kunder der alligevel ikke er profitable
- For høj grænse → du mister konverteringer til kunder der gerne ville have fri fragt

### Trin 1 — Kend dine faktiske fragtomkostninger

Beregn din **gennemsnitlige fragtomkostning per ordre:**

```
Gennemsnitlig fragt pr. ordre = Samlet fragtomkostning (måned) ÷ Antal ordrer (måned)
```

**Eksempel:**
- Samlet fragtomkostning: 18.500 kr./md.
- Antal ordrer: 620/md.
- Gennemsnitlig fragt: 18.500 ÷ 620 = **29,84 kr./ordre**

### Trin 2 — Beregn fri-fragt grænsen

**Formel:**
```
Fri-fragt grænse = Fragtomkostning ÷ (Dækningsbidrag % ÷ 100)
```

**Eksempel:**
- Gennemsnitlig fragtomkostning: 30 kr.
- Dækningsbidrag (DB %): 40%
- Fri-fragt grænse: 30 ÷ 0,40 = **75 kr.**

Ved et køb på 75 kr. dækker de 40% i dækningsbidrag (= 30 kr.) præcis fragtomkostningen.

**Tilføj buffer:** Sæt grænsen 20–30% højere end break-even for at sikre profit selv ved lav DB-ordre.

**Endelig grænse:** 75 kr. × 1,25 = **~94 kr.** → Rund op til **99 kr.**

### Trin 3 — Prissæt leveringsmetoderne

| Leveringsmetode | Typisk pris til kunden | Hvornår |
|----------------|----------------------|---------|
| **Pakkeshop** | 0–29 kr. | Standard — billigst for transportøren |
| **Hjemmelevering** | 39–59 kr. | Tillæg ift. pakkeshop |
| **Ekspres** | 69–99 kr. | Kunden vælger det aktivt |
| **Fri fragt** | 0 kr. | Over grænsebeløbet |

### Trin 4 — Vurder fri fragt strategien

**Konverteringseffekt:**
Fri fragt er den mest konverteringsfremmende faktor i e-commerce checkout. Undersøgelser viser typisk 10–30% øget konverteringsrate ved fri fragt vs. fragtgebyr.

**ROI-spørgsmål:**
> Tjener jeg mere på øget konvertering og ordreværdi end jeg betaler ekstra i fragt?

**Eksempel:**
- Uden fri fragt: 100 ordrer/dag × gns. 180 kr. = 18.000 kr. omsætning
- Med fri fragt (10% vækst): 110 ordrer × gns. 195 kr. (AOV stiger) = 21.450 kr. omsætning
- Ekstra fragtomkostning: 10 ordrer × 30 kr. = 300 kr.
- **Nettogevinst: +3.150 kr./dag**

### Trin 5 — Differentierede fragtregler

**Tung/stor vare-tillæg:**
Varer over X kg eller Y liter volumen koster mere at sende. Indfør tillæg:
```
Normal fragt: 0–5 kg → standardpris
Tillæg: 5–15 kg → +20 kr.
Tillæg: 15+ kg → +60 kr. (eller skjult udsendelse)
```

**Geo-segmentering:**
- Lokalt (DK): standard pris
- Norden (SE, NO, FI): +X kr.
- EU: +Y kr.
- Øvrige: beregnes ved checkout

**Prioritets-tilvalg:**
Tilbyd "Prioriteret pluk og pak" til 10–15 kr. ekstra. Kunden betaler for at komme først i køen. Ren margin da du alligevel pakker ordren samme dag.

### SmartPack-opsætning

Fragtpris-reglerne implementeres i:

| Sted | Hvad |
|------|------|
| Admin → Shop Checkout | Betingede fragtpriser og formler |
| Admin → Leveringsmetoder → Leveringspriser | Vægt-baserede prisniveauer |
| Webshop | Fri fragt grænse sat i shoppen |

**Formel-eksempel i SmartPack Shop Checkout:**
```
# Fri fragt ved køb over 299 kr. og under 30 kg
price >= 299 and weight < 30000

# Kun til Danmark
price >= 299 and weight < 30000 and recipient.country == 'DK'
```

→ Se: Shop Checkout konfiguration (admin.md)

### Nøgletal at følge

| Metric | Beregning | Mål |
|--------|-----------|-----|
| **Fragt/omsætning ratio** | Fragtomkostning ÷ Omsætning | Under 5–8% |
| **AOV ved fri fragt** | Gns. ordreværdi for fri-fragt-ordrer | Over fri-fragt grænsen |
| **Konverteringsstigning** | Ordrer pr. session efter vs. før fri fragt | +10–30% |

### Best practice
- Opdatér grænsebeløbet halvårligt — fragtpriser ændrer sig
- A/B test 99 kr. vs. 149 kr. grænse i 4 uger og mål effekten
- Kommunikér grænsen tydeligt i headeren ("Fri fragt over 99 kr.")

### Relaterede emner
→ Se: Fragtforhandling (lagerhåndbog.md)
→ Se: Fragtfælder (lagerhåndbog.md)
→ Se: Leveringsmetoder — Opsætning (admin.md)

---

# SMARTPACK ORDREFLOW

---

## SmartPack Ordrestatus — Komplet flow og oversigt

### Hvad er det
En komplet oversigt over alle ordrestatusser i SmartPack, hvad de betyder, hvad der udløser dem, og hvad der kan gøres fra hver status.

### Komplet statusflow

```
                    ┌─────────────┐
Import fra shop ──► │  Modtaget   │
                    └──────┬──────┘
                           │ Alt lager tilgængeligt
                    ┌──────▼──────┐
                    │  Til pluk   │
                    └──────┬──────┘
                           │ Plukliste genereret
                    ┌──────▼──────┐
                    │ Under pluk  │
                    └──────┬──────┘
                           │ Alle varer plukket
                    ┌──────▼──────┐
                    │   Plukket   │ (Tote klar til pak)
                    └──────┬──────┘
                           │ Label printet
                    ┌──────▼──────┐
                    │   Pakket    │
                    └──────┬──────┘
                           │ Afsendt / scannet af transportør
                    ┌──────▼──────┐
                    │   Afsendt   │
                    └─────────────┘
```

### Alle statusser — komplet tabel

| Status | Hvad det betyder | Udløst af | Mulige handlinger |
|--------|-----------------|-----------|------------------|
| **Modtaget** | Importeret — afventer lager-check | Webshop-import eller manuel oprettelse | Rediger, Prioritér, Pause, Annullér |
| **Til pluk** | Alle varer tilgængelige — klar til plukliste | Automatisk efter lager-check | Generer plukliste, Prioritér |
| **Missing Items** | En eller flere varer mangler på lager | Automatisk ved lager-mangel | Afvent lager, Dellever, Presell |
| **Purchased** | Varer på indkøbsordre (Presell aktiv) | Presell-indkøbsordre oprettet | Afvent levering |
| **Purchased Delayed** | Indkøbsordre forsinket | Leverdato overskredet | Kontakt leverandør |
| **Under pluk** | Aktiv plukliste kører | Terminal starter plukliste | — |
| **Plukket** | Plukliste afsluttet — tote klar | Terminal afslutter plukliste | Pak, Rediger |
| **On Hold** | Manuel pause af hele ordren | Admin → Rediger → On Hold | Frigiv, Annullér |
| **Lines On Hold** | Én eller flere linjer pauset | Admin → Rediger ordrelinje → On Hold | Frigiv linje |
| **Pakket** | Label printet — klar til afsendelse | Pakketerminal afslutter | Genudskriv, Waybill |
| **Afsendt** | Transportøren har afhentet | Scanning eller manuel markering | — |
| **Annulleret** | Ordren er annulleret | Admin eller webshop-annullering | Reaktiver (ny ordre) |
| **Problem** | Manuel håndtering påkrævet | Fejl under pluk/pak | Løs manuelt |

### On Hold vs. Lines On Hold — forskel

| | On Hold (hel ordre) | Lines On Hold (enkeltlinje) |
|--|--------------------|-----------------------------|
| **Hvad** | Hele ordren pauset | Specifikke linjer pauset |
| **Resten af ordren** | Også på pause | Behandles normalt |
| **Typisk brug** | Afventende betaling, tvivlsom ordre | Udsolgt enkelt vare |
| **Sættes via** | Admin → Rediger ordre → On Hold | Admin → Rediger ordre → Linje-checkbox |
| **Vises i listen som** | 🔴 On Hold | ⚠️ Lines On Hold |

→ Se: Sæt ordrelinjer on hold (admin.md)

### Missing Items — hvad du gør

| Årsag | Løsning |
|-------|---------|
| Varen er midlertidigt udsolgt | Afvent indkøbsordre — ordren aktiveres automatisk ved modtagelse |
| Presell ikke aktivt | Aktivér presell på indkøbsordre |
| Dellever | Admin → Tillad Delvis Levering → send tilgængeligt nu |
| Oversalg | Regulér lager og kontakt kunden |

→ Se: Presell (admin.md)
→ Se: Opdel ordre (admin.md)

### Bestilling af plukliste — hvilke statusser kan plukkes
Kun ordrer med status **"Til pluk"** indgår i en ny plukliste. Missing Items, On Hold og Under pluk indgår ikke.

### Relaterede emner
→ Se: Ordreliste — oversigt og søgning (admin.md)
→ Se: Pluk Ordrer — Generer plukliste (terminal.md)
→ Se: Presell (admin.md)

---

*Tillæg: Pallestandarder · EU Batteriforordning · Fragtpris-kalkulation · Ordrestatus-flow*
*Kilde: Officielle EU-myndigheder, Danmarks Statistik, Beredskabsstyrelsen, EPAL*
