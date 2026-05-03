---
primary_keyword: break even lager beregning
secondary_keywords: lager investering break even, hvornår tjener lager sig hjem, lager cost benefit, lager økonomi analyse
cluster: 05-Economics
---

# Break-even på lagerinvestering – hvornår tjener du det hjem?

Nyt WMS koster 150.000 kr. Hvornår tjener du det hjem? Ved 500 ordrer/dag: 3 måneder. Ved 100 ordrer/dag: aldrig. Her er regnestykket.

## Hvad er break-even i lager-kontekst?

Break-even er det punkt, hvor de kumulative besparelser fra en lager-investering er lig med investeringsomkostningen.

**Formel:**
`
Break-even (måneder) = Samlet investering ÷ Månedlig netto-gevinst

Månedlig netto-gevinst = Månedlig besparelse - Månedlig driftsomkostning
`

**Eksempel (WMS-implementation):**
- Investering: 150.000 kr. (implementation + hardware)
- Månedlig driftsomkostning: 8.000 kr. (licenser)
- Månedlig besparelse: 58.000 kr. (reducerede fejl + øget produktivitet)
- Månedlig netto-gevinst: 58.000 - 8.000 = 50.000 kr.
- **Break-even: 150.000 ÷ 50.000 = 3 måneder**

## Break-even ved forskellige volumener

| Ordrer/dag | Månedlig besparelse | Break-even |
|------------|---------------------|------------|
| 500 ordrer/dag | 58.000 kr. | 3 måneder |
| 300 ordrer/dag | 38.000 kr. | 5 måneder |
| 200 ordrer/dag | 25.000 kr. | 8 måneder |
| 100 ordrer/dag | 12.000 kr. | 15+ måneder |

**Ved 500 ordrer/dag:** Besparelse 700.000 kr./år. Break-even: 3 måneder.  
**Ved 100 ordrer/dag:** Besparelse 180.000 kr./år. Break-even: 10 måneder.

## Break-even for typiske lager-investeringer

| Investering | Typisk investering | Break-even |
|-------------|-------------------|------------|
| WMS (200 ordrer/dag) | 80.000-150.000 kr. | 3-8 måneder |
| Scanning-udstyr (5 enheder) | 15.000-30.000 kr. | 1-3 måneder |
| Layout-redesign | 20.000-50.000 kr. | 1-4 måneder |
| Batch picking implementering | 10.000-25.000 kr. | 1-2 måneder |
| 3PL-integration | 30.000-80.000 kr. | 4-12 måneder |
| Reoludvidelse | 50.000-200.000 kr. | 12-36 måneder |

## Hvornår er break-even-analyse vigtig?

Break-even er afgørende, når:
- Du evaluerer WMS-leverandører med forskellig prisstruktur
- Du skal prioritere mellem to investeringer med begrænset kapital
- Du skal overbevise ledelse eller investor
- Du planlægger phased implementation (hvad giver hurtigst ROI?)

## Besparelseskilder at inkludere

**Direkte:**
1. Reduceret fejlomkostning (fejlrate-fald × 350-850 kr./fejl)
2. Øget produktivitet (picks/time-forbedring × lønomkostning)
3. Reduceret overwork og overtid

**Indirekte (sværere at kvantificere):**
4. Lavere medarbejder-turnover (bedre arbejdsmiljø)
5. Reduceret kundeservice-load
6. Bedre kundeoplevelse → øget LTV

En konservativ break-even beregner kun punkt 1-3. En fuldstændig medtager 4-6.

## Det opdager de fleste for sent

**Implementation koster dobbelt så meget som budgetteret.** Du budgetterer 150.000 kr. til WMS. Men du glemmer: datatransfer, integration til ERP, konsulentdage, medarbejder-onboarding og 3 ugers reduceret produktivitet. Reel omkostning: 280.000 kr. ROI-beregningen var forkert fra dag 1.

## Typiske fejl

1. **Undervurderer implementeringsomkostninger** – Sofwarepris + konsulentdage + interne timer + onboarding. Samlet er det typisk 1,5-2× licensprisen.

2. **Beregner gevinst fra dag 1** – Realistisk er fuld gevinst nået 2-3 måneder efter go-live. Ny til 50% i første måned.

3. **Ignorerer driftsomkostning** – En cloud-WMS med 8.000 kr./md i licens er en permanent post. Medtag det i break-even.

## Sådan gør du det rigtigt

1. **Lav to break-even scenarier** – Konservativt (kun direkte gevinster) og optimistisk (inkl. indirekte). Sandhed er et sted imellem.

2. **Kræv break-even-garanti fra leverandøren** – Seriøse WMS-leverandører kan og bør levere en gabet break-even-kalkule.

3. **Mål faktisk vs. estimeret gevinst** – 6 måneder efter go-live: er du på kurs med break-even beregningen?

## SmartPack understøttelse

SmartPack leverer KPI-tracking fra dag 1 – fejlrate, picks/time, CPO – som dokumenterer din faktiske gevinst vs. estimeret. Det er grundlaget for at vise ledelsen at investeringen giver det lovede afkast og for at justere, hvis den ikke gør.

## FAQ

**Hvad er typisk break-even for WMS ved 500 ordrer/dag?**
4-6 måneder for en velforberedt implementation. Kan være under 3 måneder med høj udgangsfejlrate.

**Kan break-even beregnes på batch picking alene?**
Ja. Batch picking kræver minimal investering (proces + WMS-aktivering) og giver typisk break-even inden for 1-2 måneder.

**Hvad hvis break-even er over 24 måneder?**
Evaluer alternativerne. Enten er investeringen for stor, gevinsten for lille, eller du har undervurderet potentialet. Re-regn med mere konservative gevinst-estimater.

**Er der forskel på break-even for cloud vs. on-premise WMS?**
Ja. Cloud: lavere initial investering, hurtigere break-even. On-premise: højere initial, men ingen løbende licens. Over 5 år kan on-premise være billigere ved høj volumen.

**Hvad koster en dårlig WMS-investering?**
Fejlimplementation: 2-4× den planlagte investering + produktivitetstab under transition + potentielt turnover af nøglemedarbejdere.
