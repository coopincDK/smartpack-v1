---
primary_keyword: refill strategi lager
secondary_keywords: [genopfyldning lager, refill lager regler, lager buffer beregning, opfyldning hylder]
cluster: 03-Operations
article_type: beslutning
---

# Refill-strategi: Sæt den rigtige grænse og undgå at løbe tør

Et lager der løber tør for en vare midt i pluktiden er en stoppet produktion. En refill-strategi definerer præcis, hvornår og hvordan hylderne genopfyldes – og den vigtigste regel er: refill limit = dagligt salg × leveringstid × buffer.

## Kort svar

Refill-strategien definerer minimum-grænsen og standard-mængden for genopfyldning af plukhylder. Formålet er at forhindre tomme hylder midt i pluktiden med formlen: refill limit = dagligt salg × leveringstid × buffer.

## Hvad er refill-strategi?

En refill-strategi er et system af regler og tærskelværdier, der styrer genopfyldning af plukhylder. Det definerer:
- Hvornår en hylde skal genopfyldes (minimum-grænse)
- Hvor meget der fyldes op (standard-mængde)
- Hvem der udfører genopfyldning og hvornår

Uden en refill-strategi er genopfyldning reaktiv og tilfældig – og tomme hylder stopper plukflow.

## Hvornår er det et problem?

Refill-strategi mangler eller er forkert, når:
- Plukkere opdager tomme hylder under aktiv plukrunde
- Genopfyldning sker tilfældigt uden plan
- Overopfyldning af hylder giver flow-problemer (varer falder ud, blokerer gang)
- A-varer løber tør fordi refill-grænsen er for lav

## Det opdager de fleste for sent

- **Refill limit sat uden buffer:** SKU med 20 daglige salg, 3 dages leveringstid → refill sat til 60 stk. (ingen buffer). Første forsinkelse fra leverandør → stockout → 12 stoppede ordrer.
- **Morgengenopfyldning ikke planlagt:** Refill sker ad-hoc midt i pluktid → plukkere og refill-personale krydser hinanden → plukketid stiger 18%.
- **Ingen alert ved refill limit:** A-vare når refill limit fredag eftermiddag – opdages mandag morgen når hylden er tom. Weekend-ordrer forsinket.

## Hvorfor er det vigtigt? (tal)

| Scenarie | Uden refill-strategi | Med korrekt strategi | Besparelse/år |
|----------|----------------------|----------------------|---------------|
| A-vare stockout (5 episoder/uge) | 5 × 12 ordrer × 350 kr. = 21.000 kr./uge | 0 kr. (forebygget) | **~1.000.000 kr.** |
| Refill midt i pluktid (tidstab) | 45 min./dag × 280 kr./time | 0 min. (morgenrefill) | **~53.000 kr.** |
| Overopfyldning → varespild | 12 enheder/måned × 180 kr. | 1 enhed/måned | **~24.000 kr.** |

- En tom A-varehylde stopper flow på den hyppigst plukkede SKU
- Tidsforbruget ved manglende refill-planlægning: 5-10 minutter per incident per medarbejder
- Korrekt buffer reducerer risiko for "stockout" til under 1% af arbejdsdage
- Formlen **refill limit = dagligt salg × leveringstid × buffer** sikrer korrekt minimumsberegning

## Konkret case: 200 ordrer/dag, 3 dages leveringstid

**Scenarie:** Webshop med 200 ordrer/dag. Bestseller-SKU (A-vare) indgår i 35% af ordrer = 70 enheder/dag. Leveringstid fra leverandør: 3 arbejdsdage. Bufferfaktor: 1,5 (moderat sikkerhed).

**Beregning:**
- Dagligt salg: 70 enheder
- Leveringstid: 3 dage
- Buffer: 1,5
- **Refill limit = 70 × 3 × 1,5 = 315 enheder**

**Konsekvens:** Når lagerbeholdningen falder til 315 enheder, udløses automatisk refill-alert. Genopfyldning sker næste morgen. Selv ved 1 dags leveringsforsinkelse er der stadig 105 enheder buffer (1,5 dages salg).

**Uden strategi:** Refill sat til "når det ser tomt ud" → opdages ved 20 enheder tilbage → når ikke at genbestille inden stockout → 2 dages produktionstop.

## Trin-for-trin: Byg din refill-strategi

### Trin 1: Beregn refill limit per SKU
For hver SKU beregn:

**Refill limit = dagligt salg × leveringstid (dage) × bufferfaktor**

Eksempel: SKU med 20 daglige salg, 3 dages leveringstid, bufferfaktor 1,5:
Refill limit = 20 × 3 × 1,5 = **90 enheder**

Bufferfaktoren sættes til 1,3-2,0 afhængig af leveringspålidelighed og acceptabel servicegrad.

### Trin 2: Definer standard opfyldningsmængde
Standard opfyldningsmængde er, hvor meget du fylder op når refill-grænsen rammes. Typisk:
- Maks. hvad hylden kan rumme
- Eller: dagligt salg × 2 (to dages buffer på hylden)

### Trin 3: Prioritér refill for A-varer
A-varers refill limit er vigtigst. Indbyg et automatisk alert, når A-varers lagerantal falder til refill limit. B-varer kan have daglig batch-refill, C-varer ugentlig.

### Trin 4: Konfigurér alerts i systemet
SmartPacks "Lager alerts" dashboard tile viser løbende, hvilke SKU'er der er ved at nå refill limit. Planlæg genopfyldning, inden grænsen rammes.

### Trin 5: Definer refill-tidspunkt
Refill udføres ideelt:
- Inden pluktiden starter (morgengenopfyldning)
- I lavtrafik-perioder
- Aldrig midt i en aktiv pluk-runde, medmindre det er kritisk

### Trin 6: Dokumentér og standardisér
Skriv refill-proceduren op: hvem gør det, hvornår, hvilke SKU'er prioriteres og hvad sker der ved manglende bulklager. Alle medarbejdere skal kende proceduren.

### Trin 7: Justér grænser kvartalsvis
Refill limits skal opdateres ved salgsvolumenændringer, sæsoner og nye produkter. Gennemfør en kvartalsvis gennemgang.

## Typiske fejl

**Fejl 1: Refill limit er sat for lavt**
En grænse på 5 enheder for en SKU der sælger 30 om dagen er ubrugelig. Beregn korrekt med formlen.

**Fejl 2: Refill sker midt i plukperioden**
Genopfyldning midt i travl pluktid forstyrrer flow og kan blokere gangen. Planlæg morgengenopfyldning som standard.

**Fejl 3: Ingen alert til lagerpersonalet**
Uden automatisk alert opdages tomme hylder kun af plukkere der støder på dem – for sent.

**Fejl 4: Overopfyldning af hylder**
For meget på hylden skaber rod og besværliggør scanning og pluk. Definer en maksimum-grænse per hylde.

## Sådan gør du det rigtigt

**1. Brug formlen konsekvent på alle A- og B-varer**
Refill limit = dagligt salg × leveringstid × buffer. Brug samme formel på tværs af sortimentet for konsistens.

**2. Automatisér alerts for A-varer**
A-varer skal aldrig tomme uden forudgående advarsel. Automatiske alerts er ikke luxury – de er nødvendige.

**3. Kombiner morgengenopfyldning med cycle counting**
Når medarbejderen udfører morgengenopfyldning, er det oplagt at kombinere med en hurtig optælling af de berørte hylder.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Beregn refill limit for alle A-varer med formlen
- [ ] Definer standard opfyldningsmængde per hylde
- [ ] Konfigurér automatiske alerts i SmartPack
- [ ] Definér refill-tidspunkt (morgen) og ansvarsfordeling
- [ ] Dokumentér og kommunikér refill-procedure
- [ ] Planlæg kvartalsvis opdatering af grænser

**Næste skridt**: Læs guiderne om lageralerts og cycle counting for at forbinde refill-strategien med løbende overvågning.

## SmartPack understøttelse

SmartPacks "Lager alerts" dashboard tile viser løbende refill-behov og sender automatiske notifikationer, når SKU'er nærmer sig refill limit. Systemet beregner refill limit ud fra konfigurerede salgsnormer, leveringstider og bufferfaktorer – og genererer en prioriteret refill-liste til morgengenopfyldning.

## FAQ

**Hvad er refill limit?**
Den minimums-beholdning på en hylde der udløser genopfyldning. Beregnes som: dagligt salg × leveringstid × bufferfaktor.

**Hvad er en god bufferfaktor?**
1,3-1,5 for pålidelige leverandører med fast leveringstid. Op til 2,0 ved uforudsigelige leverancer eller kritiske A-varer.

**Hvornår skal jeg fylde hylderne op?**
Ideelt inden pluktiden starter – morgengenopfyldning baseret på alerts fra forgående dag.

**Hvad sker der, hvis der ikke er nok på bulklageret til refill?**
Systemet bør advare om dette i god tid. Kombinér refill limit med minimum sikkerhedslager på bulklageret.

**Kan jeg automatisere refill-planlægning fuldstændigt?**
Ja – med korrekt konfigurerede alerts og refill-regler i SmartPack genereres en prioriteret refill-liste automatisk. Mennesket udfører den fysiske opfyldning.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Tomme hylder midt i pluktiden](/viden/problemer/tomme-hylder-pluktid)

