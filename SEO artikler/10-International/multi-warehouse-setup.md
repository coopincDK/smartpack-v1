---
primary_keyword: multi-warehouse setup
secondary_keywords: [multi-lager opsætning, warehouse management international, lagerstrategi EU, distribueret lager]
cluster: 10-International
---

# Multi-warehouse setup: Den tekniske og operationelle guide

Multi-warehouse er når du aktivt arbejder med beholdning fordelt på to eller flere fysiske lokationer. Det er fundamentalt anderledes end ét lager – og kræver anderledes processer, teknologi og beslutningslogik.

Konkret: en webshop har 100 stk. af en vare – 50 på DK-lager, 50 på DE-lager. To ordrer modtages samtidigt, begge til tyske kunder. WMS'et router begge til DE-lager. Men systemet synkroniserer ikke i realtid. Begge ordrer godkendes. Resultat: oversalg. Én kunde får "udsolgt"-besked 2 dage senere. Kunden annullerer. Tab: 450 kr. ordre + 200 kr. goodwill-kompensation = 650 kr. Ved 5 oversalg/måned: 39.000 kr./år.

## Hvad er multi-warehouse setup?

Et multi-warehouse setup består af:
1. **Fysiske lagerlokationer**: eget lager, 3PL, FBA, ekstra lager i samme land
2. **Lagerdata i realtid**: WMS der synkroniserer beholdning på tværs af lokationer
3. **Routing-regler**: logik der bestemmer hvilken ordre sendes fra hvilken lokation
4. **Genopfyldningslogik**: hvornår og hvordan fylder du op på hvert lager

## Triggers for multi-warehouse

**Overvej multi-warehouse når:**
- Kapacitetsudnyttelse på primært lager overstiger **85%**
- OTD falder under **95%** på udvalgte destinationer
- Fragtomkostning overstiger **8% af AOV** til specifikke markeder
- Du skalerer til nye geografiske markeder med høje leveringstidsforventninger

## Routing-logik: Det centrale beslutningssystem

Routing-logikken er hjertet i multi-warehouse. Den besvarer for hver ordre: *fra hvilken lagerlokation sendes denne?*

### Prioriteringshierarki (typisk)
1. **Lagertilgængelighed**: er varen på lager på det nærmeste lager?
2. **Geografi**: hvilket lager er tættest på kunden (lavest fragtomkostning/hurtigst)?
3. **Fragtomkostning**: når geografi er ens, vælg billigste fragt
4. **Kapacitet**: er det primære lager overbelastet? Rout til sekundært

### Eksempel på routing-regler
- Dansk kunde → DK-lager (altid, hvis på lager)
- Tysk kunde → DE-3PL (hvis på lager der), ellers DK-lager
- Norsk kunde → DK-lager med Bring
- Britisk kunde → UK-lager (post-Brexit compliance)

## Lagersaldo-synkronisering

Den tekniske hjørnesten: WMS skal synkronisere saldi på tværs af lokationer i nær-realtid.

**Problemet**: Du har 100 stk. af en vare – 50 på DK-lager, 50 på DE-lager. En ordre modtages. Saldi reduceres på korrekt lokation. To ordrer modtages simultant. Begge peger på DE-lager. Du har kun 50 stk. der – men systemet godkender begge? Resultat: oversalg.

**Løsning**: Atomic inventory operations i WMS – reserver lager ved ordremodtagelse, ikke ved afsendelse.

## Hvad oversalg koster

**Scenarie: Multi-warehouse uden atomic reservation**

**Direkte omkostning per oversalg:**
- Tabt ordre: 400-600 kr. (gennemsnitlig AOV)
- Goodwill-kompensation: 100-200 kr. (rabatkupon til næste køb)
- Kundeservice-tid: 50 kr. (15 min à 200 kr./time)
- **Total: 550-850 kr. per oversalg**

**Typisk oversalg-rate uden atomic reservation:**
- 2-5% af ordrer ved multi-warehouse setup
- 500 ordrer/måned × 3% = 15 oversalg/måned
- 15 × 700 kr. = 10.500 kr./måned = **126.000 kr./år**

**Med atomic reservation:**
- Oversalg-rate: <0,1%
- Besparelse: **120.000+ kr./år**

## Det opdager de fleste for sent

1. **WMS understøtter ikke multi-location = kaos**
   - Du styrer DK-lager i WMS, DE-lager i Excel
   - Saldi synkroniserer ikke
   - Oversalg hver uge
   - Omkostning: 15 oversalg/måned × 700 kr. = 126.000 kr./år

2. **Genopfyldning glemmes = eksternt lager går tomt**
   - DE-lager har 30 dages lager
   - Ingen automatisk genopfyldningsordre
   - Dag 31: DE-lager tomt
   - Alle tyske ordrer sendes fra DK (dyrere, langsommere)
   - Ekstra omkostning: 25 kr./ordre × 400 ordrer = 10.000 kr./måned

3. **Moms og compliance ignoreret = salgsstop**
   - Du åbner DE-lager uden tysk momsregistrering
   - Tysk myndighed opdager det
   - Bøde: 5.000-15.000 EUR
   - Plus: efterbetaling af moms på alt salg

## Genopfyldningslogik

Hvert eksternt lager kræver en genopfyldningsstrategi:
- **Min-max**: send ny batch når saldo falder under minimum
- **Forecast-baseret**: send baseret på forventet salg næste 30 dage
- **Pull-baseret**: send kun hvad der er solgt (JIT for høj-rotation)

Vigtigt: genopfyldningsordrer til EU-lagre er Intrastat-udførsler (hvis over tærsklen). Til UK er det eksport.

## Returneringslogik

Når kunder returnerer, går varen til det nærmeste relevante lager. Du skal beslutte:
- Genlægges varen på lokalt lager (enklest for kunden)
- Sendes den tilbage til central? (enklest for lager-management)

De fleste små webshops centraliserer returneringer til ét lager.

## WMS-krav til multi-warehouse

Dit WMS skal understøtte:
- [ ] Multi-location inventory i realtid
- [ ] Konfigurerbare routing-regler
- [ ] Automatisk genopfyldningsordrer
- [ ] Returneringshåndtering per lokation
- [ ] Rapportering per lagerlokation
- [ ] Intrastat-data-eksport (for EU-lagerflytninger)

## Typiske fejl

- **WMS understøtter ikke multi-location** – du styrer to lager i to systemer = kaos
- **Ingen routing-regler** – ordrer sendes fra forkert lager
- **Oversalg** – saldi ikke synkroniseret i realtid
- **Genopfyldning glemmes** – eksternt lager går tomt
- **Moms og compliance ignoreret** – lager i nyt EU-land udløser forpligtelser

## Sådan gør du det rigtigt

- Start med to lagerlokationer, mæstr det før tre
- Atomic inventory-reservation ved ordremodtagelse
- Routing-regler dokumenteret og testet med edge cases
- Daglig saldo-afstemning på tværs af lokationer
- Compliance-tjekliste per nyt land (moms, LUCID, Intrastat)

## Brug denne artikel: tjekliste

- [ ] WMS kan håndtere multi-location inventory i realtid
- [ ] Routing-regler defineret og testet
- [ ] Genopfyldningsstrategi dokumenteret per sekundær lokation
- [ ] Oversalg-protection (atomic reservation) aktiv
- [ ] Compliance-krav per land (moms, LUCID, Intrastat) afklaret

**Næste skridt:** Tegn dit ideelle routing-hierarki på et stykke papir. Verificer om dit WMS kan implementere det. Hvis ikke – identificer håndteringsgabet.

## SmartPack understøttelse

SmartPack er bygget til multi-warehouse fra grunden: realtids-saldo på tværs af lokationer, konfigurerbar routing-logik, automatisk genopfyldningsadvarsler og Intrastat-dataeksport. Atomic inventory-reservation er standard.

## FAQ

**Hvad er den største risiko ved multi-warehouse?**
Oversalg pga. usynchroniserede saldi. Krav: WMS med realtids-synkronisering og atomic reservation.

**Hvad er atomic inventory reservation?**
Når en ordre modtages, reserveres lageret med det samme – så to samtidige ordrer ikke både godkendes mod det samme lager.

**Kan man starte multi-warehouse med et regneark?**
Kort svar: nej. Selv ved lav volumen er realtids-synkronisering nødvendig for at undgå oversalg.

**Hvad koster en 3PL i Europa?**
Varierer: typisk 2-6 EUR per pick-and-pack + lagerplads (0,5-2 EUR per palle per uge) + fragtomkostning. Indhent mindst 3 tilbud.

**Hvad er forskellen på multi-warehouse og multi-channel?**
Multi-warehouse er om fysiske lagerlokationer. Multi-channel er om salgskanaler (webshop, Amazon, fysisk butik). De kan kombineres.
