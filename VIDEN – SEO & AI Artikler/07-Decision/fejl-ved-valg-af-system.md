---
primary_keyword: fejl ved valg af WMS system
secondary_keywords: WMS valg fejl, lagersystem forkert valg, WMS faldgruber, undgå fejl WMS
cluster: 07-Decision
article_type: beslutning
---

# 9 typiske fejl ved valg af WMS – og hvad de koster dig

En webshop med 180 ordrer/dag valgte WMS baseret på en imponerende demo. 4 måneder senere: fragtintegrationen virker kun 60% af tiden, medarbejderne hader systemet, og fejlraten er steget fra 2% til 8%. Regnestykket: 180 ordrer × 30 dage × 8% fejl × 350 kr./fejl = **151.200 kr./måned** i direkte fejlomkostninger. Plus 3 måneders implementering spildt. Plus ny leverandør-evaluering.

Her er de 9 fejl der koster flest penge — og hvordan du undgår dem.

## Kort svar

> De fleste vælger WMS baseret på demo og pris – og betaler 450.000–880.000 kr. ekstra over 12 måneder for det forkerte valg. Test 3 systemer med reelle ordrer, beregn TCO over 36 måneder, og ring til egne referencer inden du skriver under.

## Fejl 1: Valgte det billigste

Et WMS til 1.200 kr./måned ser billigt ud. Men:
- Fragtintegration mangler → manuel booking koster 8 min/ordre × 180 ordrer × 400 kr./time = **14.400 kr./måned** i spildt tid
- Support er email-only → 24-48 timers responstid når systemet fejler
- Ingen API → kan ikke automatisere returhåndtering

**Real cost over 12 måneder:**

| Post | Billigt WMS | Rigtigt WMS | Forskel |
|------|-------------|-------------|----------|
| Abonnement | 14.400 kr. | 36.000 kr. | +21.600 kr. |
| Spildt tid (manuel fragt) | 172.800 kr. | 0 kr. | -172.800 kr. |
| Fejlomkostninger (6% vs 2%) | 453.600 kr. | 151.200 kr. | -302.400 kr. |
| **Total** | **640.800 kr.** | **187.200 kr.** | **-453.600 kr.** |

**Fix:** Beregn total cost inkl. spildt tid og fejl. Det billigste abonnement er sjældent billigst.

## Fejl 2: Fokuserede kun på features

Systemet havde 247 features. Lagermedarbejderne bruger 11 af dem. De 11 fungerer dårligt.

**Hvad der faktisk sker:** En feature-liste på 200+ punkter betyder ofte:
- Kompleks brugergrænseflade (5-7 klik for at printe en label)
- Langsom performance (systemet loader 200 features du aldrig bruger)
- Dyr licens (du betaler for features du ikke kender)

**Fix:** Test systemet med 100 reelle ordrer over 2 uger. Mål:
- Gennemsnitlig tid fra ordre til label printet
- Antal klik per pakke
- Antal gange medarbejdere spørger "hvordan gør jeg..."

Hvis gennemsnitstid > 3 min/ordre eller > 8 klik → systemet er for komplekst.

## Fejl 3: Involverede ikke medarbejderne

IT-chef valgte system baseret på teknisk arkitektur. Lagermedarbejderne fik det 3 dage før go-live.

**Hvad der skete:**
- Uge 1: Produktivitet faldt 60% (medarbejderne lærte systemet)
- Uge 4: 2 af 5 medarbejdere sagde op ("det her system er lort")
- Måned 3: Stadig 30% langsommere end før

**Cost:** 2 opsigelser × 40.000 kr. rekruttering = 80.000 kr. + 3 måneders tabt produktivitet = **180.000 kr.**

**Fix:** Lad 2 lagermedarbejdere teste systemet i pilotfasen. Deres veto vejer tungere end IT-chefens godkendelse.

## Fejl 4: Ignorerede onboarding-kompleksiteten

Leverandøren sagde: "Onboarding tager 1 uge". Virkeligheden:
- Uge 1-2: Datamigration fra Excel (produktdata var rodet)
- Uge 3-4: Fragtintegration virkede ikke med GLS Business
- Uge 5-8: Medarbejdertræning og fejlretning
- Måned 3: Stadig ikke 100% live

**Cost:** 3 måneders parallel drift (gammelt + nyt system) = **90.000 kr.** i ekstra arbejdstimer.

**Fix:** Spørg: "Hvad er jeres **90. percentil** implementeringstid for virksomheder som os?" (ikke gennemsnit — det skjuler de lange cases).

## Fejl 5: Valgte on-premise

On-premise WMS krævede:
- Windows Server licens: 15.000 kr./år
- IT-konsulent til setup: 25.000 kr.
- Månedlig backup og vedligeholdelse: 3.000 kr./måned
- Manuel opdatering hver 6. måned: 8.000 kr./gang

**Total over 3 år:** 15.000 × 3 + 25.000 + 3.000 × 36 + 8.000 × 6 = **241.000 kr.**

Cloud-alternativ: 0 kr. (inkluderet i abonnement).

**Fix:** Vælg cloud. Der er ingen god grund til on-premise i 2025 for en webshop under 2.000 ordrer/dag.

## Fejl 6: Glemte integrationerne

Systemet så perfekt ud. Men:
- GLS-integration virkede kun med private labels (ikke GLS Business)
- Shopify-integration synkroniserede lager hver 15. minut (ikke realtid)
- Ingen integration til økonomisystem → manuel fakturering

**Hvad der skete:** 3 måneders udvikling af custom integration = **120.000 kr.** ekstra.

**Fix:** Test **alle** integrationer i pilotfasen med reelle ordrer. Ikke demo-data. Spørg: "Kan jeg se en live ordre fra Shopify blive til en GLS Business label på under 2 minutter?"

## Fejl 7: Sprang referencetjekket over

Leverandøren gav 3 referencer. Alle var positive. Problemet: leverandøren valgte dem.

**Hvad egne referencer afslørede:**
- Support er langsom efter kl. 15
- Systemet crasher ved > 500 ordrer/dag
- Prismodel ændrede sig efter 12 måneder (skjult i kontrakt)

**Fix:** Find 2-3 egne referencer via LinkedIn, branchegrupper eller netværk. Stil hårde spørgsmål:
- "Hvad ville I gøre anderledes?"
- "Hvad er den værste uge I har haft med systemet?"
- "Hvad kostede implementeringen REELT (ikke hvad de sagde)?"

## Fejl 8: Valgte til nutidig størrelse

Webshop havde 100 ordrer/dag. Systemet var perfekt til 100 ordrer/dag.

12 måneder senere: 380 ordrer/dag. Systemet:
- Blev 3× dyrere (prismodel var per ordre over 200/dag)
- Kunne ikke håndtere 2 samtidige brugere
- Crashede hver Black Friday

**Cost:** Nyt system efter 18 måneder = 80.000 kr. implementering + 6 måneders tabt produktivitet = **180.000 kr.**

**Fix:** Beregn pris ved 3× dit nuværende volumen. Spørg: "Hvad koster systemet ved 300 ordrer/dag? Ved 500?" Hvis prisen mere end fordobles → forkert prismodel.

## Fejl 9: Undlod at definere succeskriterier

Der var ingen definition på "hvornår er vi live?". Resultat: 6 måneders "implementering" uden klart mål.

**Fix:** Definer inden go-live:
- Fejlrate < 2% (mål dagligt i 2 uger)
- Gennemsnitlig pakketid < 2 min/ordre
- Lageroptælling afviger < 1%
- Support-responstid < 4 timer

Hvis ikke opfyldt efter 4 uger → aktiver exit-klausul.

## Det opdager de fleste for sent

1. **Prismodellen ændrer sig ved vækst** — "per ordre"-modeller ser billige ud ved 50 ordrer/dag. Ved 400 ordrer/dag koster de 4× mere end "per bruger"-modeller.

2. **Support er kun god i salgsfasen** — responstid i demofasen: 2 timer. Responstid efter kontrakt: 24-48 timer. Tjek support **før** du køber: ring med et teknisk spørgsmål som potentiel kunde.

3. **Systemet kan ikke håndtere spidsbelastning** — virker fint til 180 ordrer/dag. Black Friday med 600 ordrer? Crasher kl. 11. Test: send 3× normalt volumen i pilotfasen.

## Konsekvenserne af at vælge forkert

| Konsekvens | Cost (12 måneder) |
|------------|-------------------|
| Implementering spildt | 50.000-120.000 kr. |
| Højere fejlrate (6% vs 2%) | 302.400 kr. (ved 180 ordrer/dag) |
| Spildt medarbejdertid | 80.000-200.000 kr. |
| Medarbejder-opsigelser | 40.000-80.000 kr. per person |
| Nyt valgforløb | 30.000-60.000 kr. |
| Ny implementering | 50.000-120.000 kr. |
| **Total** | **552.400-882.400 kr.** |

Ved 180 ordrer/dag = **3.068-4.902 kr. per ordre** over 12 måneder.

## Best practice: Sådan vælger du rigtigt

**Før første demo:**
1. Skriv 10 konkrete use cases (ikke "vi skal kunne håndtere ordrer" — "vi skal kunne håndtere en ordre med 3 produkter, 2 er samme SKU, 1 er gave-indpakning, sendes med GLS Business til erhvervsadresse")
2. Definer max acceptable fejlrate (fx 2%)
3. Definer max acceptable tid per ordre (fx 2 min)

**Under evaluering:**
4. Test 3 systemer med 100 reelle ordrer over 2 uger
5. Lad 2 lagermedarbejdere score hvert system (1-10) på brugervenlighed
6. Ring til 2 egne referencer per system
7. Beregn TCO over 36 måneder ved 1×, 2× og 3× nuværende volumen

**Før kontrakt:**
8. Test alle integrationer med reelle ordrer
9. Test support: ring med teknisk spørgsmål, mål responstid
10. Læs kontrakt for: bindingsperiode, opsigelsesvarsel, prisændringer, dataejerskab, exit-klausul

**Gør IKKE:**
- Vælg baseret på demo (demos er scripted)
- Vælg baseret på features-liste (90% bruger du aldrig)
- Vælg det billigste (du betaler forskellen i fejl)
- Vælg uden at teste med reelle ordrer

## SmartPack: Hvornår giver det mening?

**SmartPack passer til dig hvis:**
- Du har 50-800 ordrer/dag
- Du bruger GLS, PostNord, Bring, DAO eller Burd
- Du er på Shopify, WooCommerce eller Magento
- Du vil have 1 uges onboarding (ikke 3 måneder)
- Du vil have transparent pris (per label, ikke per ordre)

**SmartPack passer IKKE hvis:**
- Du har < 30 ordrer/dag (Excel er billigere)
- Du har > 1.000 ordrer/dag (du har brug for enterprise-features)
- Du har komplekse krav (serienumre, batch-tracking, multi-warehouse)
- Du vil have on-premise (SmartPack er cloud-only)

**Real cost-sammenligning (180 ordrer/dag):**

| Post | Uden WMS | SmartPack | Enterprise WMS |
|------|----------|-----------|----------------|
| Abonnement (12 mdr) | 0 kr. | 36.000 kr. | 120.000 kr. |
| Implementering | 0 kr. | 0 kr. (inkl.) | 150.000 kr. |
| Spildt tid (manuel) | 172.800 kr. | 0 kr. | 0 kr. |
| Fejlomkostninger | 453.600 kr. | 151.200 kr. | 151.200 kr. |
| **Total (12 mdr)** | **626.400 kr.** | **187.200 kr.** | **421.200 kr.** |
| **Besparelse vs ingen WMS** | — | **439.200 kr.** | **205.200 kr.** |

Breakeven: måned 2.

## Brug denne artikel
- [ ] Gennemgå de 9 fejl — sæt kryds ved dem du er i risiko for
- [ ] Beregn din fejlomkostning: ordrer/dag × 30 × fejl% × 350 kr. = kr./måned
- [ ] Hvis > 100.000 kr./år → book demo med 3 systemer denne uge
- [ ] Hvis du allerede har valgt forkert → beregn cost of staying vs cost of switching

## FAQ

**Hvad er den hyppigste fejl?**
At vælge til nutidig størrelse frem for vækstplan. 60% skifter system inden 18 måneder fordi prismodellen ikke skalerer.

**Hvad koster det at skifte WMS bagefter?**
50.000-120.000 kr. i implementering + 2-4 måneders tabt produktivitet (30-50% langsommere under overgang) = **150.000-300.000 kr.** total cost.

**Kan jeg fortryde kontrakten?**
Kun hvis der er en exit-klausul. Læs kontrakt for: bindingsperiode (typisk 12-36 måneder), opsigelsesvarsel (typisk 3-6 måneder), dataejerskab (kan du eksportere alt?), performance-garanti (hvad sker der hvis systemet ikke lever op til løfter?).

**Er dyre systemer bedre?**
Nej. Pris afspejler ofte markedspositionering og salgsinvestering — ikke produktkvalitet. Et system til 10.000 kr./måned kan være dårligere end et til 3.000 kr./måned. Test selv.

**Hvad er den bedste kilde til ærlige anmeldelser?**
Egne referencer via LinkedIn (søg "[system navn] user" og kontakt dem direkte). Capterra/G2 er OK, men ofte incentiveret ("skriv en anmeldelse, få 3 måneders rabat").

**Hvornår skal jeg handle?**
Nu, hvis:
- Din fejlrate er > 3%
- Du bruger > 2 min per ordre
- Medarbejderne klager over systemet ugentligt
- Du vokser > 20% per kvartal (dit system skalerer ikke)

Hver måned du venter koster dig 350 kr. × ordrer/dag × 30 × fejl% i direkte tab.

## Læs også

- [Hvornår skal du skifte system?](hvornår-skifte-system.md)
- [Cost per ordre](../05-Economics/cost-per-ordre.md)
- [Tjekliste før WMS-implementering](tjekliste-før-wms.md)
- [Book en gratis SmartPack-demo](https://smartpack.dk/demo)
