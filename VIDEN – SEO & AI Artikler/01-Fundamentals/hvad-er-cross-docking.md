---
primary_keyword: cross docking
secondary_keywords: cross-docking lager, direkte omlaesning, cross dock logistik, transit lager
cluster: 01-Fundamentals
---

# Hvad er cross docking — og hvornår giver det mening at springe lageret over?

Varen ankommer kl. 08.
Den ligger på lageret i 11 dage.
Du betaler husleje, pluk, put-away.
Den sendes kl. 14 — dag 12.

Cross docking: varen ankommer kl. 08.
Den sendes kl. 11 — samme dag.
Ingen lager. Ingen put-away. Ingen pluk.

Det koster 5-8 min per kolli mindre.
Ved 500 kolli/dag = **40-65 timer sparet** — hver dag.

---

## Hvad er cross docking?

**Cross docking** (direkte omlaesning) er en logistikproces, hvor varer ankommer fra leverandør, sorteres og omlaesses direkte til udgående transporter — uden mellemplagring. Varerne passerer terminalen, ikke lageret.

Der er to primære varianter:
- **Pre-allocated cross docking**: Varer er allerede sorteret og mærket til specifikke destinationer ved ankomst. Minimalhåndtering.
- **Consolidation cross docking**: Varer fra flere leverandører samles og sendes konsolideret til modtager. Mere håndtering, men færre forsendelser.

---

## Hvornår er det et problem?

Cross docking forudsætter præcis timing og koordination. Det er et problem, når:
- Leverandørens leveringstid er uforudsigelig
- Kundernes ordremønster er usikkert
- Varerne kræver inspektion eller kvalitetskontrol
- Systemet ikke kan håndtere automatisk sortering ved ankomst
- Du har for få forsendelser til at belægge udgående transportkapaciteten

---

## Hvorfor det er vigtigt — i kroner

Cross docking er relevant når lageromkostninger er høje og varerne har høj gennemstrømning:

**Potentielle besparelser per forsendelse:**
- Elimineret put-away: 3-5 min per kolli
- Elimineret opbevaringstid: 0-2 dages lagerhusleje
- Elimineret pluk: 2-4 min per kolli
- Hurtigere leveringstid til slutkunde

For en virksomhed med 500 daglige forsendelser, der kan cross-dockes: besparelse på 5-8 min per kolli = 40-65 timers medarbejdertid/dag.

**Modsvarende risiko**: én forsinket levering fra leverandør stopper hele kædens udgående flow, når der intet bufferlager er.

---

## Hvordan fungerer cross docking i praksis?

### Trin 1: Forudgående ordresynkronisering
Salgssystem og WMS ved, hvad der skal leveres hvornår, og hvad der skal ud af huset hvornår. Systemet matcher indgående leverancer med udgående transportbehov.

### Trin 2: Ankomst og scanning
Varer ankommer og scannes ind. Systemet identificerer straks, om varen skal på lager eller i cross dock-flow.

### Trin 3: Sorteringszone
Cross dock-varer flyttes til docking-zone og sorteres pr. modtager/rute. Minimalt ophold — ideelt under 4 timer.

### Trin 4: Genmærkning og konsolidering
Eventuel om-labeling til udgående fragtlabel. Paller eller kolli samles per transportrute.

### Trin 5: Lastning og afsendelse
Udgående transport ankommer og læsser cross dock-godset. Systemet opdaterer status og sender tracking.

---

## Typiske fejl

**1. Cross docking indgøres uden præcis tidsplanlægning**
Udgående transport og indgående leverance er ikke koordineret. Gods venter i 24 timer på docking-zone. Det er bare et dårligt lager.

**2. Ingen systemsupport til matching**
Sorterings-beslutningen tages manuelt. Fejl opstår. Varer sendes til forkert destination.

**3. Alle varer cross-dockes — også dem der ikke hører til det**
Skrøbelige varer, varer der kræver kontrol, og varer med usikker aftagning hører hjemme på lager. Cross docking er ikke for alle varetyper.

**4. For lidt cross dock-areal**
Docking-zonen er for lille til den daglige volumen. Gods hober sig op og blandes.

**5. Leverandøren er ikke med**
Cross docking kræver tæt leverandørsamarbejde om leveringsvinduer og præ-allokering. Leverandør, der ikke er på board, sprenger hele konceptet.

---

## Sådan gør du det rigtigt

**1. Start med de rigtige varekategorier**
Høj gennemstrømning, lav lagertid, prædiktabel efterspørgsel. Dagligvarer, frisk produkt og direkte B2B-replenishment er klassiske cross dock-cases.

**2. Systemintegration er ikke-forhandlingsbar**
Leverandørens EDI eller API + WMS-matching er fundamentet. Manuelt cross docking skalerer ikke.

**3. Definér leveringsvinduer med leverandør**
Indgående levering kl. 06-08, udgående afhentning kl. 10-12. Ingen undtagelser uden aftale.

**4. Hold docking-zonen ren**
Gods på cross dock-zonen er aldrig lagervare. Maksimal opholdstid: 4-8 timer. Over det går varen på lager.

**5. Mål dwell time**
Tid på docking-zone er din primære KPI for cross docking. Skal være lav og forudsigelig.

---

## Hvornår du skal handle

- Du distribuerer fra et centrallager til mange butikker eller depoter
- Du håndterer dagligvarer eller friske produkter med kort holdbarhed
- Du har leverandører, der allerede præ-sorterer ordrer per modtager
- Din lagerhusleje er den dominerende logistikomkostning
- Du vil reducere leveringstid fra ordre til levering

---

## Sådan understøtter SmartPack det

SmartPack understøtter cross docking som en separat procestype. Indgående varer kan ved scanning automatisk routes til cross dock-flow eller lagerflow baseret på forudgående regler. Systemet matcher indgående levering med udgående ordrer og genererer sorteringsinstruktioner til medarbej-deren på håndterminalen.

---

## Brug denne artikel
- [ ] Identificer, om du har varekategorier med høj gennemstrømning og lav lagertid
- [ ] Beregn den gennemsnitlige lagerlevetid for dine top 10 SKU'er
- [ ] Vurdér, om dine primære leverandører kan overholde faste leveringsvinduer
- [ ] Næste skridt: Definér én varekategori som pilot-kandidat for cross docking

---

## FAQ

**Hvad er cross docking på dansk?**
Cross docking kaldes også direkte omlaesning eller transitlogistik. Det dækker processen, hvor varer losses direkte fra indgående transport til udgående transport uden mellemplagring.

**Hvornår er cross docking den rigtige løsning?**
Når varer har høj og forudsigelig efterspørgsel, lav lagerværdi per kubik og når leverandøren kan levere i præ-allokerede, tidsplanlagte vinduer.

**Hvad er forskellen på cross docking og dropshipping?**
Cross docking: du håndterer fysisk omlaesning via din terminal. Dropshipping: leverandøren sender direkte til slutkunden — du rører aldrig varen.

**Kræver cross docking specielt udstyr?**
Ikke nødvendigvis. Grundlag er en docking-zone, håndterminaler, systemintegration og præcis tidsplanlægning. Avanceret cross docking kan bruge automatiserede sorteringsbånd.

**Kan små e-commerce virksomheder bruge cross docking?**
Sjældent — det kræver volumen og forudsigelighed. Mest relevant for B2B-distribution, centrallagre med filialforsyning og kædehandel.

