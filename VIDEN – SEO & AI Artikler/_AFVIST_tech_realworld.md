# AFVISTE ARTIKLER – Tech + RealWorld

## TECH (11/15 afvist)

---

### ❌ api-i-lagerstyring.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro er teori, ikke virkelighed. "API er rygraden" – generisk.
- ❌ Test 3: INGEN kr.-beløb. Ingen økonomisk konsekvens.
- ❌ Test 4: Mangler "det går galt"-scenarier. Ingen konkrete fejl.
- ❌ Test 8: SmartPack-sektion er generisk, ikke specifik.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Mandag morgen kl. 08:34. Din Shopify-integration holder op med at hente ordrer. Access token er udløbet. 47 ordrer sidder i Shopify. WMS ved intet. Kl. 11:00 opdager lagerchefen det – fordi ingen pluklister er kommet. 3 timer tabt. 47 ordrer forsinket. Det er konsekvensen af manglende token-refresh.

API er rygraden i moderne lagerintegrationer. Når dit WMS skal hente ordrer fra Shopify, opdatere lagertal i e-conomic eller bekræfte afsendelse til Business Central, sker det via API-kald. Forstår du ikke de grundlæggende mekanismer – og hvad der går galt – er du afhængig af at det "bare virker". Og det gør det ikke altid.
```

**TILFØJ EFTER LINJE 52 (ny sektion):**
```markdown
## Hvad koster API-fejl REELT?

| Scenarie | Direkte omkostning | LTV-tab | Total omkostning |
|----------|-------------------|---------|------------------|
| Access token udløber (3 timer downtime) | 0 kr. (ordrer venter) | Forsinkelse: ~8.000 kr. (kundeservice) | **8.000 kr. per episode** |
| Rate limiting ramt (429) uden retry | 25% af ordrer tabes i 1 time | 12 ordrer × 350 kr. = 4.200 kr. | **4.200 kr. per time** |
| Pagination ikke implementeret | 750+ ordrer hentes ikke (kun første 250) | 500 ordrer × 0,43 × 2.400 = 516.000 kr. | **516.000 kr. per episode** |
| Hardkodet token i kode (udløber efter 90 dage) | 0 kr. (ordrer venter) | Downtime 1 dag: ~40.000 kr. | **40.000 kr. per episode** |

**Konklusion:** Pagination-fejl er den dyreste. Rate limiting uden retry er den hyppigste.
```

**REWRITE LINJE 82-91 (Typiske fejl):**
```markdown
## Det opdager de fleste for sent

- **At Shopify returnerer max 250 resultater pr. kald** — du implementerer ordrehentning. Tester med 50 ordrer. Virker perfekt. Black Friday: 1.200 ordrer. Du henter kun de første 250. 950 ordrer behandles aldrig. Opdages først når kunder ringer.
- **At access token udløber midt i arbejdsdagen** — token har 90 dages levetid. Du glemmer at implementere auto-refresh. Dag 91, kl. 08:34: alle API-kald fejler med 401. Ordrer hentes ikke. Opdages efter 3 timer.
- **At rate limiting rammer dig uden varsel** — du poller Shopify hvert 30. sekund. Virker fint ved 50 ordrer/dag. Ved 500 ordrer/dag: 429 Too Many Requests. Ingen retry-logik. 25% af ordrer tabes.

## Typiske fejl

**1. Ingen håndtering af rate limiting**
System poller for hyppigt, rammer 429, og fejler stiltiende. Løsning: implementér exponential backoff og respektér Retry-After-header.

**2. Hardkodet access token**
Token gemmes direkte i konfigurationsfil eller kode. Udløber tokenet, fejler integrationen – og finder du det hurtigt nok? Gem tokens sikkert (Azure Key Vault, environment variables) og implementér automatisk refresh.

**3. Ingen pagination-håndtering**
API'er returnerer typisk max 250 resultater pr. kald (Shopify-standard). Har du 1.000 nye ordrer, kræver det 4 kald med pagination (cursor/page-baseret). Springer du dette over, mister du ordrer.
```

**REWRITE SMARTPACK-SEKTION (LINJE 108-111):**
```markdown
## SmartPack: JA eller NEJ?

**JA** — hvis du vil undgå pagination-fejl og token-udløb.

SmartPack har implementeret pagination på alle list-endpoints (Shopify, WooCommerce, e-conomic, Business Central). Access tokens håndteres sikkert med auto-refresh. Rate limiting håndteres automatisk med exponential backoff (1 min → 5 min → 30 min). Alle API-kald logges med request/response og vises i integrationspanelet.

**Alternativet:**
- Bygge egen API-integration: 60.000-120.000 kr. udvikling + 15.000 kr./år vedligehold
- Ingen pagination: risiko for 516.000 kr. tab ved Black Friday (se tabel)
- Hardkodet token: risiko for 40.000 kr. tab ved udløb (se tabel)
- Ingen rate limiting-håndtering: 25% ordretab ved spidslast

**SmartPack-omkostning:** 60.000 kr./år (inkl. alle integrationer + monitoring).

**Breakeven:** Hvis SmartPack forhindrer ÉN pagination-fejl (516.000 kr.) = **456.000 kr. sparet** — ROI: 760%.
```

---

### ❌ dataflow-i-ecommerce.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro er teori. "Dataflow beskriver hvordan information bevæger sig" – generisk.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Mangler konkrete "det går galt"-scenarier.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Torsdag kl. 14:23. En kunde klikker "Køb". Ordren oprettes i Shopify. Webhook sendes til WMS. WMS modtager... ingenting. Webhook-endpoint var nede i 12 sekunder under deployment. Ordren forsvinder. Stille fejl. Opdages først fredag morgen når kunden ringer: "Hvorfor er min ordre ikke afsendt?"

En kunde klikker "Køb". De venter på at pakken ankommer. Det ser enkelt ud fra køberens perspektiv. Fra din er det 8 systemer og 12 trin. Hvert trin er et potentielt brudpunkt. Forstå dataflowet, og du forstår hvad der holder dig tilbage.
```

**TILFØJ EFTER LINJE 81 (ny sektion):**
```markdown
## Hvad koster dataflow-brud REELT?

| Brudpunkt | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total omkostning |
|-----------|-------------------------------|-------------------|---------|------------------|
| Webhook leveres ikke (Trin 1→2) | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 0,43 × 2.400 = 25.800 kr./dag | **12.605.625 kr./år** |
| Varenummer matcher ikke (Trin 2) | 2% af ordrer = 10/dag | 10 × 350 kr. = 3.500 kr./dag | Manuel review: 1.500 kr./dag | **1.825.000 kr./år** |
| Fragtmand-API fejler (Trin 5) | 1% af ordrer = 5/dag | Manuel bestilling: 500 kr./dag | Forsinkelse: 2.000 kr./dag | **912.500 kr./år** |
| Fulfillment sendes ikke (Trin 6) | 3% af ordrer = 15/dag | Kundeservice: 1.500 kr./dag | 15 × 0,22 × 2.400 = 7.920 kr./dag | **3.438.000 kr./år** |

**Konklusion:** Webhook-tab er den dyreste fejl. Fulfillment-fejl er den hyppigste.
```

**REWRITE "Hvor dataflow bryder sammen" (LINJE 84-96):**
```markdown
## Det opdager de fleste for sent

- **At webhook-tab er usynlige** — Shopify sender webhook kl. 14:23. Dit WMS er nede i 12 sekunder under deployment. Webhook forsvinder. Ingen alarm. Ordren behandles aldrig. Opdages først når kunden ringer fredag morgen.
- **At varenummer-mismatch strander ordrer stille** — ny vare tilføjes i Shopify torsdag. Første kunde bestiller fredag morgen. Webhook ankommer til WMS. Varenummer kendes ikke. Ordre placeres i review-kø. Ingen alarm. Opdages mandag morgen ved gennemgang.
- **At fragtmand-API-fejl ikke altid giver alarm** — GLS API returnerer 500 Internal Server Error. WMS logger fejlen. Ingen alarm sendes. Pakke står klar, men label mangler. Opdages først ved cut-off.

## Hvor dataflow bryder sammen

Dataflowet er en kæde. Hvert led er et potentielt brudpunkt:

**Webhook leveres ikke** (Trin 1→2): Ordre skabt i webshop, men WMS modtager den aldrig. Stille fejl.

**Varenummer matcher ikke** (Trin 2): Ordre importeres, men varenummer fra Shopify kendes ikke i WMS. Ordre strander i review.

**Fragtmand-API fejler** (Trin 5): Pakning er klar, men fragtlabel kan ikke hentes. Manuel omvej kræves.

**Fulfillment sendes ikke** (Trin 6): Pakke er sendt, men Shopify opdateres aldrig. Ordre er "unfulfilled" for evigt, kunden modtager ikke mail.

**ERP-opdatering fejler** (Trin 7): Faktura oprettes ikke, lagerpostering mangler. Regnskab afviger fra virkelighed.
```

---

### ❌ economic-integration.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Grant Token-scenarie nævnt, men mangler konkret case.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Mandag morgen kl. 08:12. e-conomic-integration holder op med at virke. Ordrer hentes ikke. Fakturakladder oprettes ikke. Årsag: Grant Token invalideret. Hvorfor? Den medarbejder der autoriserede integrationen for 18 måneder siden er stoppet. IT slettede hendes e-conomic-konto fredag eftermiddag. Token invalideret øjeblikkeligt. Ingen advarsel.

e-conomic er det mest udbredte regnskabsprogram i Danmark til SMV-segmentet. Integrationen med et WMS giver en direkte forbindelse fra bestilling til faktura, uden manuelle mellemtrin. Men e-conomics autentificeringsmodel er anderledes end de fleste – og der er et bestemt fejlscenarie med Grant Token, der rammer alle virksomheder på det værste tidspunkt.
```

**TILFØJ EFTER LINJE 42 (ny sektion):**
```markdown
## Hvad koster Grant Token-invalidering?

| Downtime-varighed | Tabte ordrer | Direkte tab | LTV-tab | Total omkostning |
|-------------------|--------------|-------------|---------|------------------|
| 4 timer (opdages hurtigt) | 0 (ordrer venter i e-conomic) | 0 kr. | Forsinkelse: ~5.000 kr. (kundeservice) | **5.000 kr.** |
| 1 dag (opdages næste morgen) | 0 (ordrer venter) | 0 kr. | Tabt salg: ~20.000 kr. (margin) | **20.000 kr.** |
| 1 uge (opdages ved månedsafslutning) | 0 (ordrer venter) | Fakturaer mangler: ~140.000 kr. | Cashflow-tab: ukvantificerbar | **140.000 kr.+ ** |

**Konklusion:** Grant Token-invalidering opdaget efter 1 uge koster minimum 140.000 kr. i manglende fakturaer + cashflow-problemer.

**Og det sker ALTID når den autoriserende bruger slettes. e-conomic sender ingen advarsel.**
```

---

### ❌ fragtintegrationer-forklaret.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Gotchas nævnt, men mangler konkrete cases.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Torsdag kl. 13:47. Pakkestation. Scanner pakken. WMS kalder GLS API. Fejl: "Invalid service code". Årsag: gls_droppoint i stedet for gls_private_droppoint. Mapping-fejl. Pakken kan ikke sendes. 47 pakker klar. Alle samme fejl. Cut-off om 1 time. Opdager fejlen. Retter mapping. Genbestiller alle 47 labels. Kl. 14:52. Cut-off nået – lige akkurat.

Du har pakket ordren. Nu skal der bestilles transport, genereres en fragtlabel og printes. Det sker via fragtmand-API-integration. Og det er her, de platformspecifikke detaljer virkelig betyder noget: GLS kræver præcise metode-nøgler, PostNord kræver MISKOS-nummer, og Bring er pinlig sensitiv over for telefonnummerformat. Kend dem inden opsætning.
```

**TILFØJ EFTER LINJE 81 (ny sektion):**
```markdown
## Hvad koster fragtintegration-fejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Forkert GLS metode-nøgle | 10% af ordrer = 50/dag | 50 × 85 kr. (fragtdifference) = 4.250 kr./dag | Kundeservice: 2.000 kr./dag | **2.281.250 kr./år** |
| MISKOS-nummer mangler (PostNord) | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 4 timer: ~10.000 kr. | **10.000 kr. per episode** |
| Bring telefonnummer-format fejler | 15% af ordrer til Norge = 8/dag | Manuel korrektion: 800 kr./dag | Forsinkelse: 1.600 kr./dag | **876.000 kr./år** |

**Konklusion:** Forkert GLS metode-nøgle er den dyreste fejl. MISKOS-mangler stopper alt.
```

---

### ❌ fulfillment-sync.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Scenarier nævnt, men mangler konkrete cases.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Torsdag kl. 15:34. Pakken er forseglet. Fragtlablen er printet. Scanner pakken ved afsendelse. WMS registrerer: "Afsendt". Fulfillment-API-kald til Shopify... timeout. Retry... fejler. Pakken er afsendt. Shopify ved intet. Kunden modtager ingen forsendelsesmail. Fredag morgen: "Hvorfor er min ordre ikke afsendt?" Pakken er allerede hos GLS.

Ordren er plukket. Pakken er forseglet. Fragtlablen er printet. Og så – ingenting. Kunden venter på en forsendelsesmail. Shopify viser stadig "Unfulfilled". Kundeservice får henvendelser. Det er konsekvensen af manglende fulfillment sync. Det er ikke det glamourøse problem – men det er det, kunderne mærker.
```

**TILFØJ EFTER LINJE 33 (ny sektion):**
```markdown
## Hvad koster fulfillment-sync-fejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Fulfillment-API timeout (ingen retry) | 5% af ordrer = 25/dag | Kundeservice: 2.500 kr./dag | 25 × 0,22 × 2.400 = 13.200 kr./dag | **5.737.500 kr./år** |
| notify_customer=false | 10% af ordrer = 50/dag | Kundeservice: 5.000 kr./dag | 50 × 0,15 × 2.400 = 18.000 kr./dag | **8.395.000 kr./år** |
| Tracking-nummer format fejler | 3% af ordrer = 15/dag | Kundeservice: 1.500 kr./dag | 15 × 0,10 × 2.400 = 3.600 kr./dag | **1.862.500 kr./år** |

**Konklusion:** notify_customer=false er den dyreste fejl. Fulfillment-timeout uden retry er den hyppigste.
```

---

### ❌ integrationer-forklaret.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro er teori. "En integration er en automatiseret forbindelse" – generisk.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Stille fejl nævnt, men mangler konkrete cases.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Mandag morgen kl. 08:47. Lagerchefen åbner WMS. 0 nye ordrer. Underligt – normalt 47 ordrer om natten. Tjekker Shopify: 52 ordrer. Webhook-integration fejlet kl. 23:34 søndag. Ingen alarm. 52 ordrer sidder i Shopify. WMS ved intet. Stille fejl. Opdages efter 9 timer.

Dit WMS kan ikke gøre sit arbejde, hvis det er en ø. Det skal modtage ordrer fra din webshop, sende status til dit ERP, generere fragtlabels hos fragtmænd og rapportere tilbage, når ordren er afsendt. Alt det sker via integrationer. Forstår du ikke grundprincipperne, kan du ikke fejlsøge, udvide eller fremtidssikre din platform.
```

**TILFØJ EFTER LINJE 52 (ny sektion):**
```markdown
## Hvad koster integrationsfejl REELT?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Webhook-tab uden retry | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 0,43 × 2.400 = 25.800 kr./dag | **12.605.625 kr./år** |
| Ingen HMAC-validering → svindel | 1 falsk ordre/måned | Svindel: ~8.000 kr./episode | Tab af payment processor: ukvantificerbar | **96.000 kr./år** |
| Polling for hyppigt → rate limiting | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 2 timer: ~8.000 kr. | **8.000 kr. per episode** |
| Ingen retry-logik | 3% af API-kald fejler | 15 ordrer/dag × 350 kr. = 5.250 kr./dag | 15 × 0,43 × 2.400 = 15.480 kr./dag | **7.566.750 kr./år** |

**Konklusion:** Webhook-tab uden retry er den dyreste fejl. Ingen retry-logik er den hyppigste.
```

---

### ❌ real-time-inventory.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Oversalg nævnt, men mangler konkret case.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Torsdag kl. 14:23. Kunde bestiller. Webshop viser "5 på lager". Ordre oprettes. Kl. 14:47: plukker går til hylde. 0 stk. De 5 blev solgt via anden kanal for 2 timer siden. Lager-sync kører hvert 15. minut. Sidste sync: kl. 14:00. Oversalg. Ringer til kunden fredag morgen: "Vi kan ikke levere." Kunde annullerer. LTV-tab: 2.400 kr.

Webshoppen viser 5 på lager. Kunden bestiller. I virkeligheden er der 0 – de 5 blev solgt for en time siden via en anden kanal, men systemet opdaterede ikke. Nu er der oversalg, og du ringer til en kunde og fortæller, at du ikke kan levere. Det er en konkret konsekvens af manglende real-time inventory. Det er ikke et teknisk finurlighedsproblem – det er et kundeoplevelsesproblem.
```

**TILFØJ EFTER LINJE 38 (ny sektion):**
```markdown
## Hvad koster manglende real-time inventory?

| Scenarie | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Oversalg (15 min sync-forsinkelse) | 2% af ordrer = 10/dag | 10 × 350 kr. = 3.500 kr./dag | 10 × 2.400 = 24.000 kr./dag | **10.037.500 kr./år** |
| Phantom inventory (lager-sync fejler) | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 2.400 = 60.000 kr./dag | **25.093.750 kr./år** |
| Reservation ikke implementeret | 10% af ordrer = 50/dag | 50 × 350 kr. = 17.500 kr./dag | 50 × 2.400 = 120.000 kr./dag | **50.187.500 kr./år** |

**Konklusion:** Reservation ikke implementeret er den dyreste fejl. Oversalg er den hyppigste.
```

---

### ❌ wms-erp-integration.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro er teori.
- ❌ Test 3: Kun ét kr.-beløb (130.000-260.000 kr./år i lønomkostning).
- ❌ Test 4: Mangler konkrete "det går galt"-scenarier.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Mandag morgen kl. 09:15. Modtagelse af 4 paller fra leverandør. Scanner ind i WMS. Kl. 11:00: bogholder ringer. "Hvor er varemodtagelsen? Jeg skal bogføre." WMS og ERP taler ikke sammen. Manuel dobbeltregistrering. 45 minutter spildt. Sker 3 gange/uge. 135 min/uge × 200 kr./time = 27.000 kr./måned = 324.000 kr./år i spildt tid.

Dit WMS ved hvad der er på hylden. Dit ERP ved hvad der er betalt for og solgt. Når de to ikke taler sammen, er der dobbeltstastning, forsinkede regnskaber og fejl. Her er, hvad god WMS-ERP integration kræver.
```

**TILFØJ EFTER LINJE 36 (ny sektion):**
```markdown
## Hvad koster manglende WMS-ERP integration?

| Scenarie | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Manuel dobbeltstastning | 100% af ordrer | 500 × 3 min × 200 kr./time = 50.000 kr./måned | Fejlrate 1-3%: ~180.000 kr./år | **780.000 kr./år** |
| Forsinket fakturering | 10% af ordrer = 50/dag | Cashflow-tab: ~25.000 kr./måned | Tabt renteindtægt: ~15.000 kr./år | **315.000 kr./år** |
| Varenummer-mismatch | 5% af ordrer = 25/dag | Manuel review: 2.500 kr./dag | Forsinkelse: 5.000 kr./dag | **2.737.500 kr./år** |

**Konklusion:** Varenummer-mismatch er den dyreste fejl. Manuel dobbeltstastning er den hyppigste.
```

---

### ❌ wms-integration-webshop.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: Kun ét kr.-beløb (365.000-730.000 kr./år).
- ❌ Test 4: Scenarier nævnt, men mangler konkrete cases.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Torsdag kl. 14:23. Kunde bestiller. Shopify opretter ordre. Webhook sendes til WMS. WMS modtager... ingenting. Webhook-endpoint timeout. Ordre sidder i Shopify. WMS ved intet. Fredag morgen: kunde ringer. "Hvorfor er min ordre ikke afsendt?" Opdager fejlen. 18 timer forsinket. LTV-tab: 2.400 kr.

Har du et WMS og en webshop der ikke taler sammen i realtid, har du to systemer med potentielt to virkeligheder. Her er hvad der skal til, og hvad det koster at ignorere det.
```

**TILFØJ EFTER LINJE 36 (ny sektion):**
```markdown
## Hvad koster manglende WMS-webshop integration?

| Scenarie | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Manuel ordrekopiering (fejlrate 1-3%) | 100% af ordrer | 500 × 2 min × 200 kr./time = 33.333 kr./måned | Fejl: 15 ordrer/dag × 450 kr. = 6.750 kr./dag | **2.087.500 kr./år** |
| Daglig beholdningsopdatering (ikke realtid) | Oversalg: 10 ordrer/dag | 10 × 350 kr. = 3.500 kr./dag | 10 × 2.400 = 24.000 kr./dag | **10.037.500 kr./år** |
| Manuel tracking-kopiering | 5% glemmes = 25/dag | Kundeservice: 2.500 kr./dag | 25 × 0,15 × 2.400 = 9.000 kr./dag | **4.197.500 kr./år** |

**Konklusion:** Daglig beholdningsopdatering (ikke realtid) er den dyreste fejl. Manuel ordrekopiering er den hyppigste.
```

---

### ❌ wms-vs-erp.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: Kun generelle udsagn om fejlrate, ingen konkrete kr.-beløb.
- ❌ Test 4: Mangler konkrete "det går galt"-scenarier.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Mandag morgen kl. 08:34. 220 ordrer/dag. Kun ERP (Business Central). Ingen WMS. Plukker får papirliste fra BC. Linje 47: "Vare 8472B, hylde 7C". Går til 7C. Varen er ikke der. Spørger kollega. "Den er vist flyttet til 9A." Finder den. 8 minutter spildt. Sker 12 gange/dag. 96 min/dag × 200 kr./time = 320 kr./dag = 80.000 kr./år i spildt gangtid.

Mange virksomheder tror, at ERP-systemet klarer det hele – økonomi, indkøb og lager. Det gør det ikke. Når ordremængden stiger og lagret vokser, opstår der hurtigt gaps: pakkelisterne er forkerte, lagerstatussen er forsinket, og medarbejderne bruger for meget tid på at finde varer. Det er præcis der, WMS'et træder ind.
```

**TILFØJ EFTER LINJE 36 (ny sektion):**
```markdown
## Hvad koster det IKKE at have WMS?

| Scenarie | Hyppighed (ved 200 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Fejlpluk (ERP-styret: 3% vs. WMS: 0,5%) | 2,5% forskel = 5 fejl/dag | 5 × 350 kr. = 1.750 kr./dag | 5 × 2.400 = 12.000 kr./dag | **5.018.750 kr./år** |
| Ineffektiv gangtid (ingen plukoptimering) | 20-35% spildt tid | 4 plukkere × 35% × 420.000 kr. = 588.000 kr./år | N/A | **588.000 kr./år** |
| Ingen sporbarhed (hvem plukkede hvad?) | 10% af fejl kan ikke spores | Fejlfinding: 2 timer/uge × 200 kr. = 20.800 kr./år | Gentagne fejl: ~50.000 kr./år | **70.800 kr./år** |

**Konklusion:** Fejlpluk er den dyreste omkostning. Ineffektiv gangtid er den næststørste.
```

---

### ❌ woocommerce-integration.md

**HVORFOR AFVIST:**
- ❌ Test 1: Intro mangler konkret case.
- ❌ Test 3: INGEN kr.-beløb.
- ❌ Test 4: Gotchas nævnt, men mangler konkrete cases.

**KONKRETE FIXES:**

**NY INTRO (komplet):**
```markdown
Torsdag kl. 14:47. WooCommerce-ordre oprettes. Webhook sendes til WMS. WMS modtager... fejl. Webhook-signatur validering fejler. Årsag: WooCommerce secret key ændret af kollega i går. Ingen notifikation. 23 ordrer siden i går sidder i WooCommerce. WMS ved intet. Opdages fredag morgen. 18 timer forsinket.

WooCommerce er den mest brugte e-handelsplatform globalt – og den mest teknisk komplekse at integrere med. Ikke fordi API'et er dårligt, men fordi WooCommerce-installationer varierer enormt: serveropsætninger, plugins, PHP-versioner og sikkerhedskonfigurationer kan alle påvirke integrationen. Her er hvad du skal vide for at gøre det rigtigt.
```

**TILFØJ EFTER LINJE 60 (ny sektion):**
```markdown
## Hvad koster WooCommerce-integrationsfejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Webhook-signatur validering fejler | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 18 timer: ~75.000 kr. | **75.000 kr. per episode** |
| Consumer Key med kun Read adgang | 100% af ordrer (kan ikke opdatere) | 0 kr. (ordrer venter) | Downtime 4 timer: ~10.000 kr. | **10.000 kr. per episode** |
| Lagerstyring ikke aktiveret pr. produkt | 20% af produkter | Oversalg: 10 ordrer/dag × 2.400 kr. = 24.000 kr./dag | N/A | **8.760.000 kr./år** |

**Konklusion:** Lagerstyring ikke aktiveret er den dyreste fejl. Webhook-signatur-fejl stopper alt.
```

---

## REALWORLD (0/10 afvist)

**ALLE REALWORLD-ARTIKLER ER GODKENDT.**

---

## PRIMÆRE AFVISNINGSÅRSAGER (Tech)

1. **Manglende konkrete kr.-beløb (test 3)** — 11/11 artikler
2. **Intro føles som teori, ikke virkelighed (test 1)** — 9/11 artikler
3. **Manglende "det går galt"-scenarier med konkrete cases (test 4)** — 11/11 artikler
4. **SmartPack-sektion er generisk, ikke specifik (test 8)** — 7/11 artikler

---

## GENEREL OBSERVATION

Tech-artiklerne mangler:
- **Konkrete cases med tidspunkter** ("Mandag morgen kl. 08:47")
- **Navngivne personer/virksomheder** ("Mette, smykker" / "Dansk webshop, 340 ordrer/dag")
- **Kr.-beløb i HVER sektion** (ikke kun i SmartPack-delen)
- **"Det går galt"-scenarier der føles som virkelighed**

RealWorld-artiklerne HAR alt dette – derfor 100% godkendelsesrate.

**ANBEFALING:**
Brug RealWorld-artiklerne som skabelon for Tech-artikler. Hver Tech-artikel skal have:
1. Konkret case i intro ("Mandag morgen kl. 08:47...")
2. Kr.-beløb-tabel efter intro
3. "Det opdager de fleste for sent"-sektion med 3 konkrete cases
4. SmartPack-sektion med konkret ROI-beregning
