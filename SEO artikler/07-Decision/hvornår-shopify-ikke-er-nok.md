---
primary_keyword: hvornår Shopify lager ikke er nok
secondary_keywords: Shopify lagerstyring begrænsninger, Shopify WMS, Shopify lager problemer, udover Shopify
cluster: 07-Decision
---

# Hvornår er Shopify's lagerfunktion ikke nok?

Du rammer 120 ordrer/dag. Shopify håndterer lagerbeholdning perfekt.

Men dine medarbejdere går tilfældigt rundt på lageret. Ingen plukrute. Ingen scanning. Ingen bekræftelse.

Resultat: 3,5% fejlrate. 120 ordrer × 250 dage × 3,5% × 350 kr. = **367.500 kr./år** i fejl.

Plus 12 minutter spildt tid per ordre på manuel fragtbooking = 360.000 kr./år.

Shopify viser dig hvad der er på lager. Det fortæller ikke dine medarbejdere hvordan de skal plukke det.

## Hvad kan Shopify's lager?

Shopify giver dig:
- Lagerbeholdning per varenummer og location
- Lagerhistorik
- Oversalgs-indstillinger
- Multi-location lager (Shopify Plus)
- Enkle overførsler mellem lokationer

Det er solidt til at holde styr på tal. Men det er ikke et WMS.

## Hvad kan Shopify's lager IKKE?

Her er de kritiske mangler:

**Ingen plukoptimering**: Shopify siger ikke, hvilken rækkefølge du skal plukke varer i. Dine medarbejdere går tilfældigt rundt på lageret.

**Ingen scanning og bekræftelse**: Shopify har ingen scan-og-bekræft flow. Du kan plukke forkerte varer uden at systemet reagerer.

**Ingen batch-picking**: Du kan ikke effektivt plukke 20 ordrer på én gang med Shopify's native funktioner.

**Ingen fragtlabel-integration**: Du skal manuelt gå til fragtleverandørens portal og generere labels – eller bruge en app.

**Ingen medarbejder-tracking**: Hvem plukkede hvad? Shopify ved det ikke.

**Ingen detaljeret lokationsstyring**: Shopify kender din "location" – ikke hyldebetegnelsen A-12-3.

## Hvornår rammer du grænsen?

| Trigger | Shopify klarer det | Shopify er utilstrækkelig |
|---------|-------------------|--------------------------|
| <30 ordrer/dag | ✓ | |
| >50 ordrer/dag | | ✓ |
| Batch-picking behov | | ✓ |
| Serienummer-krav | | ✓ |
| Multi-person lager | | ✓ |
| Fragtlabel direkte | | ✓ (kræver app) |
| Plukoptimering | | ✓ |

## Hvad koster Shopify-begrænsningerne?

- **Ingen plukoptimering**: +30–40% længere plukruter = 1–2 ekstra arbejdstimer/dag
- **Ingen scanning**: Fejlrate 2–4% vs. 0,2–0,5% med scanning
- **Manuel label-generering**: 1–3 minutter per ordre ekstra
- **Ingen batch-picking**: 3× langsommere ved høje ordremængder

Ved 100 ordrer/dag er den samlede spildtid 2–4 timer dagligt.

## Det opdager de fleste for sent

1. **Man køber Shopify Plus i håb om at løse lagerproblemet** — og opdager at de grundlæggende WMS-mangler (ingen scanning, ingen plukoptimering) er identiske i Plus; man har betalt 5x så meget uden at løse problemet
2. **Fejlraten stiger først synligt over 50 ordrer/dag** — ved 30 ordrer/dag er det overkommeligt manuelt; ved 80 ordrer/dag er 2–3% fejlrate pløtselig 17.000–25.000 kr./måned inkl. LTV-tab
3. **App-stakken fragmenterer data** — man installerer 4–6 Shopify-apps for at kompensere, og ender med inkonsistent data på tværs af systemer, hvilket er sværere at løse end at vælge et ordentligt WMS fra start

## Shopify-apps som supplement

Der er mange Shopify-apps der udvider lagerfunktionaliteten: ShipBob, Linnworks, Brightpearl, Deposco – og SmartPack. Disse apps integrerer med Shopify og tilføjer WMS-funktionalitet.

Men vær opmærksom på: apps tilbyder ikke altid den dybe integration. Test specifikt om app'en håndterer dine edge cases.

## Typiske fejl

- Tror Shopify Plus løser lagerproblemet (det gør det ikke – same limitations, more features)
- Installerer for mange apps og ender med et fragmenteret system
- Bruger Shopify lager til B2B og B2C fra samme lager uden differentiation
- Glemmer at Shopify's API har rate limits der kan bremse synkronisering

## Sådan gør du det rigtigt

1. Brug Shopify til det det er godt til: salg, marketing, kundeoplevelse
2. Tilkobl WMS til lageroperationerne
3. Sørg for realtids-synkronisering mellem WMS og Shopify (lagerstatus)
4. Test synkronisering under høj belastning (simulér Black Friday)

## SmartPack + Shopify

SmartPack integrerer direkte med Shopify. Ordrer trækkes automatisk, labels genereres, lagerstatus synkroniseres i realtid. Du beholder Shopify som din salgsplatform – SmartPack driver lageroperationen.

**Hvornår SmartPack IKKE giver mening**: Har du under 30 ordrer/dag med simple, ensartede produkter uden varianter eller bundter, er Shopify’s native lagerfunktion tilstrækkelig. Tilføj SmartPack når du krøber 50 ordrer/dag, begynder at have kompleksitet (varianter, multiperson-lager), eller når fejlraten synligt stiger. At investere i SmartPack ved 15 ordrer/dag giver ikke ROI på kort sigt.


## Brug denne artikel
- [ ] Gennemgå listen og sæt kryds ved det der passer på din situation
- [ ] Beregn din fejlomkostning: antal fejl/md × 350 kr. = din månedlige tab
- [ ] Book 30 min med dit team til at gennemgå "Hvornår du skal handle"
- [ ] Næste skridt: kontakt SmartPack for en gratis gennemgang af dit setup
## FAQ

**Er Shopify Fulfillment Network et alternativ?**
Det er Shopifys 3PL-tilbud, primært tilgængeligt i USA. I Danmark: ikke et reelt alternativ.

**Hvad med Shopify Plus?**
Plus giver mere API-kapacitet og multi-location. Men de grundlæggende WMS-mangler er de samme.

**Kan jeg bruge Shopify's barcode-funktion?**
Shopify har en simpel barcode-skanner integration – men det er ikke scanning med bekræftelse. Et WMS er anderledes.

**Hvornår anbefaler du at holde Shopify og ikke tilkøbe WMS?**
Under 30 ordrer/dag med simple, ensartede produkter. Ingen varianter, ingen serienumre, ingen bundter.

**Hvad koster Shopify + SmartPack sammenlignet med Shopify alene?**
SmartPack prissættes per label. Den ekstra omkostning er typisk tjent ind inden for 2–3 måneder via tidsbesparelse og fejlreduktion.


