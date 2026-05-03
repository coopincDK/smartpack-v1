---
primary_keyword: hasteordrer lager prioritering
secondary_keywords: [ordre prioritering, express levering lager, cutoff tid, premium kunder]
cluster: 02-Problemer
---

# For mange hasteordrer – når manglende prioritering koster LTV

Kl. 14:00: Premiumkunde (abonnement, 12.000 kr./år LTV) bestiller. Skal sendes samme dag for at nå levering i morgen.

Kl. 14:30: Standardkunde (første ordre, 680 kr.) bestiller.

Jeres plukker tager dem i rækkefølge de kom ind. Standardkunde plukkes først. Premiumkunde plukkes kl. 15:45. Cutoff var 15:30.

Premiumkunde får levering 1 dag forsinket. Ringer og klager. Opsiger abonnement.

**Cost: 12.000 kr. LTV tabt fordi I ikke prioriterede.**

Ved 5% af premiumkunder der oplever dette = 60.000 kr./år tabt.

## Hvad mener vi med "for mange hasteordrer"?

For mange hasteordrer betyder:
- Alle ordrer behandles ens (FIFO)
- Ingen prioritering baseret på kundetype
- Ingen prioritering baseret på cutoff-tid
- Express-ordrer blandes med standard
- Premiumkunder venter lige så længe som nye kunder

Resultat: Højværdi-kunder får dårlig service.

## Prioriteringsmatrix: Hvilke ordrer først?

### Prioritet 1 (pluk FØRST)
- Premiumfragt (betalt ekstra for hurtig levering)
- Abonnementskunder (høj LTV)
- B2B-kontrakter (store ordrer, faste kunder)
- Ordrer tæt på cutoff

### Prioritet 2 (pluk NORMAL)
- Standardordrer inden for normal leveringstid
- Første-gangs-kunder (vigtige for LTV)

### Prioritet 3 (pluk SIDST)
- Ordrer med lang leveringstid
- Gratis fragt (ingen hastelevering)

**Implementering:**
WMS tildeler automatisk prioritet baseret på:
1. Kundetype (premium/standard)
2. Fragtype (express/normal)
3. Ordretidspunkt (cutoff-afstand)

**Resultat:** Premiumkunder får ALTID levering til tiden. LTV-tab elimineres.

## Regnestykket: Hvad koster manglende prioritering?

**Scenarie: 200 ordrer/dag, 10% premiumkunder, ingen prioritering**

**Premiumkunder der misser cutoff:**
- 20 premiumordrer/dag
- 5% misser cutoff pga. manglende prioritering = 1 ordre/dag
- LTV per premiumkunde: 12.000 kr.
- 30% opsiger ved forsinket levering
- **Cost: 1 × 0,3 × 12.000 kr. = 3.600 kr./dag**
- **Årlig: 900.000 kr.**

**Med prioritering:**
- Premiumordrer plukkes først
- 0,2% misser cutoff (kun ved ekstrem belastning)
- **Cost: 18.000 kr./år**

**Besparelse: 882.000 kr./år**

## Hvornår er det et problem?

Manglende prioritering er et problem når:
- Premiumkunder klager over forsinkelser
- Cutoff overskrides dagligt
- Alle ordrer behandles FIFO
- Du ikke kan svare: "Hvilke ordrer er vigtigst?"
- Express-ordrer sendes næste dag i stedet for samme dag

## Hvad sker der i praksis

200 ordrer i kø. Plukker starter kl. 08:00. Tager ordre 1, 2, 3... i rækkefølge.

Ordre 47: Premiumkunde, express, cutoff 15:30.
Ordre 48-200: Standard.

Kl. 15:15: Plukker når ordre 42. Ordre 47 plukkes kl. 16:20. For sent.

Premiumkunde ringer: "Jeg betalte for express!" Opsiger abonnement.

## Typiske fejl

**1. "Først til mølle"**
FIFO er fair. Men ikke smart. Premiumkunder skal prioriteres.

**2. Manuel prioritering**
Lagerchefen kigger listen igennem og siger: "Tag den først". Ikke skalerbart.

**3. Ingen cutoff-tracking**
Ingen ved hvilke ordrer SKAL sendes i dag.

**4. Alle ordrer er "hasteordrer"**
Hvis alt er hastende, er intet hastende. Definer klare prioriteter.

## Sådan gør du det rigtigt

**1. Definer prioritetsklasser (dag 1)**
- Prioritet 1: Premium + express + cutoff < 4 timer
- Prioritet 2: Standard inden for leveringstid
- Prioritet 3: Lang leveringstid

**2. Marker ordrer i system (dag 1)**
- Tag premiumkunder i Shopify/WMS
- Tag express-fragt
- Beregn cutoff-afstand

**3. Pluk efter prioritet (fra dag 1)**
- Pluk ALLE prioritet 1 først
- Derefter prioritet 2
- Sidst prioritet 3

**4. Mål effekt (ugentligt)**
- Hvor mange premiumkunder misser cutoff?
- Mål: Under 1%

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Identificer premiumkunder i system
- [ ] Definer cutoff-tider
- [ ] Lav prioritetsmatrix (1/2/3)
- [ ] Implementer i WMS eller manuel liste
- [ ] Pluk efter prioritet fra i morgen
- [ ] Mål: Premiumkunder der misser cutoff

**Næste skridt:** Læs "Vi kan ikke håndtere peaks" og "For mange manuelle processer" for fuld systematisering.

## SmartPack understøttelse

SmartPack tildeler automatisk prioritet baseret på kundetype, fragtype og cutoff-tid. Plukliste vises sorteret efter prioritet. Premiumordrer øverst. Dashboard viser: Hvor mange prioritet 1-ordrer mangler? Hvor lang tid til cutoff?

## FAQ

**Skal vi altid prioritere premiumkunder?**
Ja. De betaler mere, køber oftere, har højere LTV. De fortjener bedre service.

**Hvad hvis alle ordrer er "hastende"?**
Definer klare kriterier. Kun express + premium + cutoff < 4 timer = prioritet 1.

**Hvordan identificerer vi premiumkunder?**
Abonnement, gentagne køb, høj LTV, betalt premium-fragt.

**Hvad med første-gangs-kunder?**
Prioritet 2. Vigtige for LTV, men ikke over premium.

**Hvordan måler vi effekten?**
Premiumkunde-retention. Klager over forsinkelser. Cutoff-overholdelse.
