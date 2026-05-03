---
primary_keyword: batch lot håndtering lager
secondary_keywords: [lot nummer lager, batch tracking, fifo fefo lager, batch kontrol]
cluster: 03-Operations
---

# Batch/LOT-håndtering: FIFO, FEFO og korrekt sporbarhed på dit lager

LOT- og batch-håndtering er kritisk for virksomheder med udløbsdatoer, serienumre eller lovkrav til sporbarhed. Denne guide viser dig, hvad batch-håndtering er, hvornår du behøver det, og præcis hvordan du implementerer det korrekt.

## Hvad er batch/LOT-håndtering?

Et LOT eller batch er en gruppe af produkter fremstillet eller modtaget under samme vilkår og identificeret med et fælles nummer (LOT-nummer). LOT-håndtering betyder, at dit system sporer, hvilke specifikke LOT'er der er modtaget, på lager og afsendt.

To primære udsorteringsregler:
- **FIFO** (First In, First Out): det ældste LOT plukkes altid først
- **FEFO** (First Expired, First Out): LOT'et med den nærmeste udløbsdato plukkes altid først

FEFO bruges til varer med udløbsdato. FIFO til varer uden udløbsdato, men med rotation-krav.

## Hvornår er batch/LOT-håndtering nødvendigt?

LOT-håndtering er nødvendigt, når:
- Dine produkter har udløbsdatoer (fødevarer, kosmetik, medicin, kemikalier)
- Lovkrav kræver fuld sporbarhed (ISO-certificeringer, EU-regler, medicinsk udstyr)
- En recall af et specifikt batch er teoretisk nødvendig
- Kvalitetsafvigelser skal sporest til specifikke produktionspartier

## Hvorfor er det vigtigt? (tal)

- En produktrecall uden LOT-sporbarhed kræver tilbagekaldelse af alle enheder af en SKU – ikke kun de fejlramte
- FEFO-fejl (forkert LOT plukket) kan sende produkter med overskredet udløbsdato til kunder
- Compliance-brud i regulerede brancher kan føre til bøder og lukninger
- Med korrekt LOT-håndtering kan en recall begrænses til præcise enheder – typisk 10-20x færre enheder

## Trin-for-trin: Implementér batch/LOT-håndtering

### Trin 1: Vurder om du har LOT-krav
Er dine produkter underlagt udløbsdatoer, serienummerring eller lovkrav til sporbarhed? Ja → LOT-håndtering er obligatorisk. Nej → vurder om FIFO stadig giver fordele (produktkvalitet, rotation).

### Trin 2: Registrér LOT ved modtagelse
Ved hver varemodtagelse:
- Scan produktet og angiv LOT-nummer (fra leverandørens label)
- Registrér produktionsdato og/eller udløbsdato
- Systemet tildeler automatisk FIFO- eller FEFO-position

**Aldrig** modtag en LOT-batch uden at registrere LOT-nummeret.

### Trin 3: Adskil LOT'er fysisk
Varer fra to LOT'er af samme SKU må ikke blandes fysisk på samme hylde-bin. Enten:
- To separate bins per SKU (LOT 001 og LOT 002)
- Eller: FIFO-opbevaring på én hylde med tydelig front-til-bag rækkefølge (ældste foran)

### Trin 4: Konfigurér FIFO eller FEFO per SKU i systemet
For hver SKU med LOT-krav, konfigurér i SmartPack:
- FIFO: systemet foreslår altid ældste LOT til næste pluk
- FEFO: systemet foreslår altid LOT med nærmest udløbsdato

### Trin 5: Plukkeren scanner LOT ved pluk
Plukkeren scanner ikke bare varen – men det specifikke LOT, der er anvist af systemet. Systemet afviser et forkert LOT-nummer.

### Trin 6: Registrér LOT på ordren
Hver afsendt ordre registrerer præcist, hvilke LOT-numre der indgik. Dette er fundamentet for en recall – du kan nu identificere præcis hvilke kunder der modtog et specifikt LOT.

### Trin 7: Overvåg udløbsdatoer løbende
SmartPack's "Lager alerts" advarer om LOT'er, der nærmer sig udløb (konfigurér fx 30-dages advarsel). Reagér proaktivt: tilbud på nærmerkommende udløb eller returnering til leverandør.

## Typiske fejl

**Fejl 1: LOT-registrering springes over ved modtagelse**
Et LOT der ikke registreres eksisterer ikke sporingsmæssigt. Scanning af LOT ved modtagelse er ikke valgfri.

**Fejl 2: To LOT'er blandes på samme hylde-bin**
Plukkere kan ikke se forskel, og FIFO/FEFO kan ikke håndhæves fysisk.

**Fejl 3: Plukkere vælger frit LOT**
Uden systemkrav om specificeret LOT-scan, vælger plukkere det nærmeste – ikke det korrekte.

**Fejl 4: Ingen advarsler om nærtstående udløbsdatoer**
Varer der udløber på lageret er direkte spild og tab.

## Sådan gør du det rigtigt

**1. Brug FEFO som standard for alle varer med udløbsdato**
Hellere en streng regel for alle end at glemme det for én SKU.

**2. Opsæt 30-dages og 7-dages udløbs-alerts**
To advarselniveauer giver mulighed for proaktiv handling (tilbud/retur) inden varen er tabt.

**3. Test recall-procedure kvartalsvis**
"Hvilke kunder har fået LOT 20240115 af SKU X?" – du skal kunne svare inden for 5 minutter. Test det.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Identificér alle SKU'er med LOT/udløbsdato-krav
- [ ] Konfigurér FIFO eller FEFO per SKU i SmartPack
- [ ] Etablér obligatorisk LOT-scanning ved modtagelse og pluk
- [ ] Adskil LOT'er fysisk på separate bins
- [ ] Opsæt udløbs-alerts (30 dage og 7 dage)
- [ ] Test recall-procedure kvartalsvis

**Næste skridt**: Læs guiderne om serienummer-tracking og varemodtagelse for at udbygge sporbarheden.

## SmartPack understøttelse

SmartPack understøtter fuld LOT/batch-håndtering med FIFO og FEFO-konfiguration per SKU. Systemet tvinger LOT-scanning ved pluk og registrerer LOT-numre på alle ordrer. "Lager alerts" advarer automatisk om nærtstående udløbsdatoer med konfigurerbart varselstidspunkt.

## FAQ

**Hvad er forskellen på FIFO og FEFO?**
FIFO (First In, First Out): ældst plukkes først. FEFO (First Expired, First Out): nærmeste udløbsdato plukkes først. Brug FEFO ved varer med udløbsdatoer.

**Hvornår er LOT-håndtering lovpligtig?**
I regulerede brancher: medicin, fødevarer, kosmetik og kemikalier. Tjek branchespecifikke regler. Anbefales i alle brancher, hvor et recall kan blive nødvendigt.

**Hvad er et LOT-nummer?**
En unik identifikator for et produktionsparti. Bruges til at spore alle enheder fremstillet under de samme betingelser.

**Kan jeg have FIFO og FEFO på samme lager?**
Ja – konfigureres per SKU. SKU'er med udløbsdato bruger FEFO, øvrige bruger FIFO.

**Hvad koster et recall uden LOT-sporbarhed?**
Potentielt et total-tilbagekald af al beholdning af SKU'et – selv de ikke-fejlramte enheder. Med LOT-sporbarhed begrænses recall til præcise enheder, typisk 10-20x færre.

