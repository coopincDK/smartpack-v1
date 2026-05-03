---
primary_keyword: hvordan vælger du lager software
secondary_keywords: vælg WMS, guide lager software, lager software kriterier, WMS udvælgelse
cluster: 07-Decision
---

# Hvordan vælger du det rigtige lager-software? (3 ting folk glemmer at tjekke)

En webshop med 180 ordrer/dag evaluerede 5 WMS-systemer. De valgte det med flest features (247 funktioner). 4 måneder og 120.000 kr. senere: fragtintegration til GLS Business virkede ikke, support svarede kun på email (24-48 timer), og systemet crashede ved > 400 ordrer/dag. Cost: 120.000 kr. implementering spildt + 6 måneders suboptimal drift (fejlrate 6% i stedet for 2%) = **420.000 kr. totalt tab**.

Problemet: de testede forkert. De så demoer, læste features-lister, sammenlignede priser. Men de glemte at tjekke:
1. Virker integrationen med **vores** fragtleverandør og **vores** aftale?
2. Hvad sker der når systemet går ned kl. 14 på en tirsdag?
3. Kan systemet håndtere 3× vores volumen?

Her er hvordan du vælger rigtigt — med konkrete tests, ikke demoer.

## De 3 ting folk glemmer at tjekke (og hvad det koster)

### 1. Integration virker i demo — men ikke med DIN aftale

**Hvad der sker:**
Leverandøren viser: "Vi integrerer med GLS". Det de ikke siger: "Vi integrerer med GLS Private, ikke GLS Business".

Du opdager det efter go-live. Nu skal du enten:
- Skifte til GLS Private (dårligere priser, ingen erhvervsleveringer)
- Betale for custom integration (60.000-150.000 kr.)
- Booke labels manuelt (8 min/ordre × 180 ordrer × 400 kr./time = 14.400 kr./måned spildt)

**Real case:**
Webshop med Shopify + SmartShip-aftale med PostNord. WMS sagde "PostNord-integration". Men: kun standard PostNord, ikke SmartShip. Resultat: 3 måneders manuel booking = **43.200 kr. spildt** + custom integration = **80.000 kr.**

**Hvordan du tjekker det:**
1. Send leverandøren din **eksakte** fragtaftale (GLS Business, PostNord SmartShip, Bring Parcel DK)
2. Kræv live test: "Jeg sender jer 10 testordrer. Jeg vil se labels printet med **min** aftale, **mine** priser, **mine** servicevalg (erhverv, weekend, levering til pakkeshop)"
3. Hvis de siger "det ordner vi efter go-live" → rødt flag

**Cost hvis du springer det over:** 80.000-150.000 kr. i custom integration + 3-6 måneders manuel workaround.

### 2. Support er god i salgsfasen — men dårlig efter kontrakt

**Hvad der sker:**
I demofasen: salgsteamet svarer på 5 minutter, hjælper med alt, er super-responsive.

Efter kontrakt: support er email-only, 24-48 timers responstid, "vi eskalerer til udvikling".

**Real case:**
WMS crashede kl. 14 på en tirsdag (Black Friday-uge, 420 ordrer skulle sendes samme dag). Support:
- Email sendt kl. 14:05
- Autosvar: "Vi svarer inden 24 timer"
- Svar kl. 10:30 næste dag: "Vi har eskaleret til udvikling"
- Fix kl. 16:00 næste dag (28 timer efter crash)

Resultat: 420 ordrer sendt 1 dag for sent = 420 × 150 kr. kompensation = **63.000 kr. tabt**.

**Hvordan du tjekker det:**
1. Ring til support **før** du køber (som potentiel kunde, ikke eksisterende kunde)
2. Stil et teknisk spørgsmål: "Hvad sker der hvis jeres API går ned midt i en ordre?"
3. Mål responstid og kvalitet
4. Spørg: "Hvad er jeres SLA? Hvad sker der hvis I ikke overholder den?"
5. Læs kontrakt: er der kompensation ved downtime?

**Red flags:**
- Support kun email (ingen telefon, ingen chat)
- Ingen SLA i kontrakt
- "Vi svarer inden 24-48 timer" (for langsomt til kritisk system)
- Support kun 9-17 (hvad hvis systemet crasher kl. 18?)

**Cost hvis du springer det over:** 50.000-200.000 kr./år i downtime og kompensation.

### 3. Systemet virker ved 180 ordrer/dag — men crasher ved 400

**Hvad der sker:**
Demo viser 50 ordrer. Pilot-test kører 2 uger med 180 ordrer/dag. Alt virker.

Black Friday: 420 ordrer på én dag. Systemet:
- Bliver langsomt (5 min loading-tid)
- Crasher kl. 11 (peak-tid)
- Mister 23 ordrer (de forsvinder fra systemet)

Resultat: 23 ordrer ikke sendt = **8.050 kr. direkte tab** + 6 timers ekstraarbejde med manuel håndtering = **12.000 kr. total cost**. Plus kundetab.

**Hvordan du tjekker det:**
1. Spørg: "Hvad er det højeste antal ordrer I har set en kunde håndtere på én dag?"
2. Kræv stress-test: "Jeg vil sende 3× mit normale volumen (540 ordrer) på én dag i pilot-test"
3. Mål: loading-tid, fejlrate, system-stabilitet
4. Spørg: "Hvad er jeres prismodel ved 2× og 5× mit volumen?"

**Red flags:**
- "De fleste kunder har 50-100 ordrer/dag" (du har 180 → du er edge case)
- Prismodel ændrer sig dramatisk ved højere volumen (2× ordrer = 4× pris)
- Ingen stress-test i pilot

**Cost hvis du springer det over:** 80.000-200.000 kr. i tabt salg + nyt system efter 12-18 måneder.

## Sådan vælger du rigtigt (konkret proces)

### Fase 1: Definer dine 10 kritiske use cases (ikke "behov")

Ikke: "Vi skal kunne håndtere ordrer".

Vel: 
1. Ordre fra Shopify med 3 produkter (2 samme SKU, 1 gave-indpakning) → GLS Business til erhvervsadresse → label printet på < 2 min
2. Retur: kunde sender produkt retur → modtag på lager → tjek kvalitet → refunder eller kassér → opdater lagerstatus
3. Black Friday: 400 ordrer på én dag → system skal håndtere uden crash
4. Lageroptælling: scan alle varer → sammenlign med system → afvigelse < 1%
5. Multi-carrier: samme ordre skal kunne sendes med GLS, PostNord eller Bring (afhænger af destination)
6. API: ordre fra Shopify skal være i WMS på < 30 sekunder
7. Serienummer: produkt med serienummer skal scannes ved modtagelse og ved afsendelse
8. Gave-indpakning: ordre med gave-flag skal printe speciel label + instruktion til pakker
9. Erhverv vs privat: system skal automatisk vælge GLS Business til erhverv, GLS Private til privat
10. Support: hvis system crasher, support skal svare på < 2 timer

**Hvorfor konkrete use cases:**
- Du kan teste dem direkte (ikke "kan systemet håndtere ordrer?" → "send mig use case 1, mål tid")
- Leverandøren kan ikke snakke sig udenom ("det kan vi" → "vis mig")
- Du opdager edge cases tidligt

### Fase 2: Evaluer 3 systemer (ikke 5, ikke 10)

For mange systemer = analyse-lammelse. For få = dårligt valg.

**Hvordan du finder 3 kandidater:**
1. Søg "WMS Danmark" + "[din platform]" (fx "WMS Danmark Shopify")
2. Spørg i branchegrupper: "Hvem bruger I?"
3. Tjek Capterra/G2 for reviews (men tag dem med salt — ofte incentiveret)
4. Vælg 3 der:
   - Integrerer med din platform
   - Har kunder i din størrelsesorden (100-300 ordrer/dag)
   - Har dansk support

**Evalueringstabel (udfyld for alle 3):**

| Kriterium | Vægt | System A | System B | System C |
|-----------|------|----------|----------|----------|
| **Integration (test med dine aftaler)** | 30% | 8/10 | 6/10 | 9/10 |
| **Support (test responstid + kvalitet)** | 25% | 7/10 | 9/10 | 6/10 |
| **Brugervenlighed (lagermedarbejder-score)** | 20% | 9/10 | 5/10 | 8/10 |
| **Skalerbarhed (test 3× volumen)** | 15% | 6/10 | 8/10 | 9/10 |
| **Pris/TCO (36 måneder)** | 10% | 7/10 | 6/10 | 8/10 |
| **Total (vægtet)** | 100% | **7.5** | **7.0** | **8.1** |

**Hvordan du scorer:**
- Integration: send 10 testordrer, mål succes-rate og tid
- Support: ring 3 gange, mål responstid og kvalitet
- Brugervenlighed: lad 2 lagermedarbejdere bruge systemet i 2 uger, bed dem score 1-10
- Skalerbarhed: send 3× volumen på én dag, mål performance
- Pris: beregn total cost over 36 måneder (se nedenfor)

### Fase 3: Pilot-test med reelle ordrer (2-4 uger)

En demo viser hvad systemet **kan**. En pilot viser hvad det **gør**.

**Krav til pilot:**
- Minimum 2 uger (helst 4)
- Minimum 100 reelle ordrer (ikke test-ordrer)
- Alle dine fragtleverandører
- Alle dine produkttyper (normale, gave-indpakning, serienummer)
- Minimum 1 stress-dag (3× volumen)
- Minimum 2 lagermedarbejdere bruger systemet

**Hvad du måler:**

| Metric | Target | System A | System B | System C |
|--------|--------|----------|----------|----------|
| Gennemsnitlig tid per ordre | < 2 min | 1:45 | 3:20 | 1:52 |
| Fejlrate | < 2% | 1,8% | 4,2% | 1,5% |
| System-downtime | 0 timer | 0 | 2 timer | 0 |
| Support-responstid | < 4 timer | 2 timer | 6 timer | 3 timer |
| Medarbejder-score (1-10) | > 7 | 8 | 5 | 9 |
| Antal klik per ordre | < 8 | 6 | 12 | 5 |

**Red flags i pilot:**
- Fejlrate > 3% (systemet er for komplekst eller buggy)
- Tid per ordre > 3 min (for mange klik eller langsom performance)
- Downtime > 1 time (ustabilt system)
- Support-responstid > 6 timer (for langsom support)
- Medarbejder-score < 6 (de hader systemet → lav adoption)

Hvis 2+ red flags → drop systemet.

### Fase 4: Beregn Total Cost of Ownership (36 måneder)

Prisen er ikke abonnementet. Prisen er alt hvad det koster at bruge systemet.

**TCO-beregning (eksempel: 180 ordrer/dag):**

| Post | System A | System B | System C |
|------|----------|----------|----------|
| **Abonnement (36 mdr × pris/md)** | 108.000 kr. | 180.000 kr. | 144.000 kr. |
| **Onboarding/implementering** | 0 kr. (inkl.) | 80.000 kr. | 25.000 kr. |
| **Hardware (scannere, printere)** | 15.000 kr. | 15.000 kr. | 15.000 kr. |
| **Custom integrationer** | 0 kr. | 120.000 kr. | 0 kr. |
| **Træning (medarbejdertid)** | 20.000 kr. | 60.000 kr. | 25.000 kr. |
| **Spildt tid (manuel workaround)** | 0 kr. | 172.800 kr./år | 0 kr. |
| **Fejlomkostning (over target)** | 0 kr. | 453.600 kr./år | 0 kr. |
| **Support (ekstra timer)** | 0 kr. | 40.000 kr./år | 0 kr. |
| **Total (36 mdr)** | **143.000 kr.** | **1.649.200 kr.** | **209.000 kr.** |
| **Per ordre** | 22 kr. | 254 kr. | 32 kr. |

**Hvorfor System B er dyrt:**
- Fragtintegration virker ikke → manuel booking = 172.800 kr./år
- Komplekst system → fejlrate 4,2% i stedet for 2% = 453.600 kr./år ekstra
- Dårlig support → ekstra konsulent-timer = 40.000 kr./år

**Konklusion:** System A eller C. System B koster 7-11× mere over 3 år.

### Fase 5: Reference-tjek (egne, ikke leverandørens)

Leverandørens referencer er cherry-picked. Find dine egne.

**Hvordan:**
1. LinkedIn: søg "[system navn] user" eller "[system navn] warehouse"
2. Branchegrupper: "Hvem bruger [system]? Kan jeg få jeres nummer?"
3. Capterra/G2: find negative reviews, kontakt dem direkte

**Spørgsmål til referencer:**
1. "Hvad ville I gøre anderledes i valg-processen?"
2. "Hvad er den værste uge I har haft med systemet?"
3. "Hvad kostede implementeringen REELT (ikke hvad de sagde)?"
4. "Hvor lang tid tog det før I var 100% live?"
5. "Hvad er jeres erfaring med support?"
6. "Hvis I skulle vælge igen i dag, ville I vælge samme system?"

**Red flags:**
- "Vi er stadig ikke 100% live" (efter > 6 måneder)
- "Support er langsom" (gentages af flere referencer)
- "Prismodellen ændrede sig" (skjulte omkostninger)
- "Vi overvejer at skifte" (efter < 2 år)

### Fase 6: Forhandl kontrakt (alt er forhandleligt)

**Hvad du forhandler:**

| Punkt | Standard | Forhandl til |
|-------|----------|---------------|
| Bindingsperiode | 36 måneder | 12 måneder (eller exit-klausul) |
| Opsigelsesvarsel | 6 måneder | 3 måneder |
| Pris | Listepris | 10-20% rabat (ved årlig betaling) |
| Onboarding | 40.000 kr. | Inkluderet |
| Support SLA | "Best effort" | < 4 timer responstid, kompensation ved downtime |
| Dataejerskab | Uklart | Fuld eksport-ret, ingen lock-in |
| Prisændringer | "Kan ændres" | Max 5%/år |

**Exit-klausul (KRITISK):**
"Hvis systemet ikke lever op til følgende KPIs efter 3 måneder, kan vi opsige uden omkostning:
- Fejlrate < 2%
- Gennemsnitlig tid per ordre < 2 min
- Support-responstid < 4 timer
- Uptime > 99%"

Hvis leverandøren ikke vil skrive det i kontrakt → de er ikke sikre på deres produkt.

## Det opdager de fleste for sent

1. **Prismodellen ændrer sig ved vækst** — "3.000 kr./måned" ser billigt ud. Men: kun op til 200 ordrer/måned. Ved 180 ordrer/dag (5.400/måned) = 14.500 kr./måned. Læs kontrakt: hvad koster det ved 2×, 5×, 10× volumen?

2. **"Inkluderet" betyder ikke "virker"** — "GLS-integration inkluderet". Men: kun GLS Private. GLS Business kræver custom integration = 80.000 kr. Tjek: hvilke **specifikke** aftaler er inkluderet?

3. **Dataejerskab er uklart** — du vil skifte system. Leverandøren siger: "Vi kan eksportere data". Virkeligheden: CSV med 40% af data, ingen historik, ingen serienumre. Læs kontrakt: ret til **fuld** dataeksport i **brugbart** format.

## Typiske fejl (og hvad de koster)

**Fejl 1: Vælger det system der vandt præsentationsrunden**
Demoer er scripted. De viser best-case. Test med worst-case.

**Fejl 2: Glemmer at involvere lagermedarbejderne**
IT-chef vælger baseret på teknisk arkitektur. Lagermedarbejderne hader systemet. Resultat: lav adoption, høj fejlrate, opsigelser.

**Fejl 3: Fokuserer for meget på features der sjældent bruges**
247 features, bruger 11. De 11 fungerer dårligt. Vælg system baseret på de 10 use cases du bruger dagligt.

**Fejl 4: Springer TCO-beregningen over**
System A: 3.000 kr./måned. System B: 5.000 kr./måned. Vælger A. Men: A kræver custom integration (120.000 kr.) + manuel workaround (172.800 kr./år). B er billigere over 3 år.

**Fejl 5: Lader et enkelt integrationsproblem blokere et ellers godt valg**
"Systemet er perfekt, men det integrerer ikke med vores økonomisystem". Cost of workaround: 2 timer/uge = 8.000 kr./år. Cost of forkert system: 400.000 kr./år. Vælg det gode system, lav workaround.

## Best practice: Tjekliste

**Før evaluering:**
- [ ] Skriv 10 konkrete use cases (ikke "behov")
- [ ] Definer max acceptable fejlrate (fx 2%)
- [ ] Definer max acceptable tid per ordre (fx 2 min)
- [ ] Find 3 kandidat-systemer

**Under evaluering:**
- [ ] Test integration med DINE aftaler (send 10 testordrer)
- [ ] Test support (ring 3 gange, mål responstid)
- [ ] Pilot 2-4 uger med 100+ reelle ordrer
- [ ] Lad 2 lagermedarbejdere score systemet (1-10)
- [ ] Stress-test med 3× volumen
- [ ] Beregn TCO over 36 måneder
- [ ] Ring til 2 egne referencer per system

**Før kontrakt:**
- [ ] Læs kontrakt: bindingsperiode, opsigelsesvarsel, prisændringer
- [ ] Forhandl exit-klausul (KPIs efter 3 måneder)
- [ ] Tjek dataejerskab (ret til fuld eksport)
- [ ] Tjek support SLA (responstid, kompensation)
- [ ] Beregn pris ved 2×, 5×, 10× volumen

**Gør IKKE:**
- [ ] Vælg baseret på demo (test selv)
- [ ] Vælg baseret på features-liste (test use cases)
- [ ] Vælg det billigste abonnement (beregn TCO)
- [ ] Spring pilot over (2 ugers test er minimum)
- [ ] Brug leverandørens referencer (find egne)

## SmartPack: Hvornår giver det mening?

**SmartPack passer til dig hvis:**
- Du har 50-800 ordrer/dag
- Du bruger GLS (Private + Business), PostNord (Standard + SmartShip), Bring, DAO, eller Burd
- Du er på Shopify, WooCommerce, Magento, eller WooCommerce
- Du vil have 1 uges onboarding (ikke 3 måneder)
- Du vil have transparent pris (per label, ikke skjulte gebyrer)
- Du vil have dansk support (telefon + email, < 4 timer responstid)

**SmartPack passer IKKE hvis:**
- Du har < 30 ordrer/dag (Excel er billigere — vent til 50 ordrer/dag)
- Du har > 1.000 ordrer/dag (du har brug for enterprise-features: multi-warehouse, advanced analytics, dedikeret account manager)
- Du har meget komplekse krav (batch-tracking med fuld sporbarhed, temperatur-logging, farligt gods-håndtering)
- Du vil have on-premise (SmartPack er cloud-only)
- Du bruger eksotiske fragtleverandører (vi understøtter de 5 største i DK)

**Real cost-sammenligning (180 ordrer/dag, 36 måneder):**

| Post | Uden WMS | SmartPack | Enterprise WMS |
|------|----------|-----------|----------------|
| Abonnement | 0 kr. | 108.000 kr. | 360.000 kr. |
| Implementering | 0 kr. | 0 kr. (inkl.) | 150.000 kr. |
| Custom integration | 0 kr. | 0 kr. (inkl.) | 120.000 kr. |
| Hardware | 0 kr. | 15.000 kr. | 15.000 kr. |
| Spildt tid (manuel) | 518.400 kr. | 0 kr. | 0 kr. |
| Fejlomkostning (6% vs 2%) | 1.360.800 kr. | 453.600 kr. | 453.600 kr. |
| **Total (36 mdr)** | **1.879.200 kr.** | **576.600 kr.** | **1.098.600 kr.** |
| **Per ordre** | 289 kr. | 89 kr. | 169 kr. |
| **Besparelse vs ingen WMS** | — | **1.302.600 kr.** | **780.600 kr.** |

**Breakeven:** Måned 2.

**Hvad du får:**
- 1 uges onboarding (ikke 3 måneder)
- Alle integrationer inkluderet (GLS, PostNord, Bring, DAO, Burd + Shopify, WooCommerce, Magento)
- Dansk support (telefon + email, < 4 timer responstid)
- Transparent pris (per label, ingen skjulte gebyrer)
- Ingen bindingsperiode (3 måneders opsigelse)
- Fuld dataejerskab (eksport når som helst)

**Hvad du IKKE får:**
- Multi-warehouse (kun single-location)
- Advanced analytics (basic rapportering inkluderet)
- Dedikeret account manager (standard support)
- Custom features (standard-setup)

## Brug denne artikel
- [ ] Skriv dine 10 kritiske use cases (brug skabelon ovenfor)
- [ ] Find 3 kandidat-systemer (søg, spørg i netværk, tjek reviews)
- [ ] Book demo med alle 3 (bed dem vise dine use cases, ikke deres script)
- [ ] Kræv pilot 2-4 uger med 100+ reelle ordrer
- [ ] Beregn TCO for alle 3 (brug skabelon ovenfor)
- [ ] Ring til 2 egne referencer per system
- [ ] Vælg baseret på vægtet score (ikke gut feeling)

## FAQ

**Hvad er den vigtigste single faktor?**
Integration til dine eksisterende fragtleverandører og webshop. Hvis den ikke virker 100%, er alt andet ligegyldigt. Du ender med manuel workaround = 172.800 kr./år spildt.

**Skal jeg vælge det dyreste?**
Nej. Pris er ikke en kvalitetsindikator. Test selv. Det billigste kan være bedst (hvis det virker). Det dyreste kan være dårligt (hvis det er komplekst).

**Hvem skal beslutte?**
Kombination:
- Driftsleder: kender processerne
- Lagermedarbejder: bruger systemet dagligt
- Økonomiansvarlig: kender TCO
- IT (hvis relevant): kender integrationer

Undgå at ét perspektiv dominerer. IT-chef vælger teknisk perfekt system som lagermedarbejderne hader = fejl.

**Kan jeg bede om en gratis pilot?**
Ja. Enhver seriøs leverandør tilbyder 2-4 ugers pilot. Hvis de siger nej → rødt flag (de er ikke sikre på deres produkt).

**Hvad hvis mit behov er specielt?**
Definer det præcist (use case) og test specifikt. Generiske demoer viser aldrig edge cases. Eksempel: "Vi har produkter med serienummer + gave-indpakning + GLS Business til erhverv". Test: send 10 ordrer med alle 3 krav, mål succes-rate.

**Hvor lang tid tager valg-processen?**
Realistisk:
- Uge 1-2: Definer use cases, find kandidater
- Uge 3-4: Demoer (3 systemer)
- Uge 5-8: Pilot (2-4 uger, 2 systemer)
- Uge 9-10: TCO-beregning, reference-tjek, beslutning
- Uge 11-12: Forhandling, kontrakt

Total: 10-12 uger. Hvis du forsøger at gøre det på 2 uger → du vælger forkert.

**Hvad koster det at vælge forkert?**
420.000 kr. over 12 måneder (real case fra intro). Plus: ny evaluering (30.000 kr. i tid) + ny implementering (50.000-120.000 kr.) = **500.000-570.000 kr. total cost**.

Invester 10-12 uger i at vælge rigtigt. Det sparer dig 500.000 kr.
