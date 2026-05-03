ï»¿---
primary_keyword: ABC analyse lager
secondary_keywords: [ABC-analyse sortiment, A-varer B-varer C-varer, vareplacering ABC, lager optimering ABC]
cluster: 03-Operations
---

# SÃƒÂ¥dan laver du en ABC-analyse til dit lager

I har 500 SKU'er.
100 af dem driver 70-80% af jeres pluk.

De ligger spredt over hele lageret.
Plukkerne går 200 meter ekstra per time.

Fordi ingen har analyseret hvilke varer der plukkes mest.

ABC-analyse tager 2-3 timer.
Ingen specialsoftware. Kun data fra WMS.

Resultat: flyt 100 A-varer til Golden Zone.
Plukketid ned 20-30%.

Ved 300 ordrer/dag:
102 picks/time → 110 picks/time.
45 minutter sparet per dag.

25-40% kapacitetsforbedring.
Uden ekstra personale.

## Hvad er en ABC-analyse?

En ABC-analyse opdeler dit sortiment i tre kategorier baseret pÃƒÂ¥ plukhyppighed (eller omsÃƒÂ¦tning):

- **A-varer:** De 10Ã¢â‚¬â€œ20% af SKU'erne der udgÃƒÂ¸r 70Ã¢â‚¬â€œ80% af alle pluk
- **B-varer:** De nÃƒÂ¦ste 30% af SKU'erne der udgÃƒÂ¸r ca. 15Ã¢â‚¬â€œ20% af pluk
- **C-varer:** De resterende 50Ã¢â‚¬â€œ60% der tilsammen udgÃƒÂ¸r 5Ã¢â‚¬â€œ10% af pluk

Det er en anvendelse af Pareto-princippet: 20% af varerne styr 80% af aktiviteten. SpÃƒÂ¸rgsmÃƒÂ¥let er: er de 20% placeret optimalt?

## HvornÃƒÂ¥r er ABC-analyse nÃƒÂ¸dvendig?

GennefÃƒÂ¸r en ABC-analyse nÃƒÂ¥r:
- Du aldrig har lavet en (basisbehov)
- Picks/time er under 90 og du ikke kender ÃƒÂ¥rsagen
- Sortimentet er vokset med mere end 30% siden sidste review
- Du har ÃƒÂ¦ndret lagerl ayout eller rykket til nyt lager
- Det er mere end 6 mÃƒÂ¥neder siden forrige analyse

## Hvad sker der uden ABC-optimering (tal)?

Ved 500 daglige ordrer med 2 picks per ordre: en A-vare placeret 30 meter fra pakkebordet vs. 5 meter = 50 meters ekstra gang per pluk Ãƒâ€” 80 daglige pluk = 4.000 meters spildgang per dag. PÃƒÂ¥ ÃƒÂ¥rsbasis: over 1.000 kilometers gang du kan spare.

Industristandard: 102 picks/time. SmartPack-optimerede lagre: 110 picks/time. Uoptimerede lagre med forkert vareplacering: 70Ã¢â‚¬â€œ102 picks/time (industri 2025). Gevinst ved optimering: 25Ã¢â‚¬â€œ40% kapacitetsforbedring.

## Trin-for-trin: GennemfÃƒÂ¸r en ABC-analyse

### Trin 1: Hent plukhyppighedsdata
TrÃƒÂ¦k data fra dit WMS eller ordrehistorik for de seneste 90 dage:
- SKU-nummer
- Antal pluk/kÃƒÂ¸b i perioden
- NuvÃƒÂ¦rende lokation i lageret

Brug 90 dage Ã¢â‚¬â€ ikke 12 mÃƒÂ¥neder. SÃƒÂ¦sonvarer forvrider ÃƒÂ¥rsdata.

### Trin 2: Sorter og kategoriser
Sorter SKU'erne efter plukhyppighed (hÃƒÂ¸jest fÃƒÂ¸rst). Beregn kumulativt:
- A-kategori: SKU'er der tilsammen udgÃƒÂ¸r de fÃƒÂ¸rste 70% af total pluk
- B-kategori: nÃƒÂ¦ste 20% af total pluk
- C-kategori: de resterende 10%

Eksempel: Har du 500 SKU'er, vil A typisk vÃƒÂ¦re 50Ã¢â‚¬â€œ100 SKU'er. B: 100Ã¢â‚¬â€œ150. C: 250Ã¢â‚¬â€œ300.

### Trin 3: KortlÃƒÂ¦g nuvÃƒÂ¦rende placering
For hvert A-vare: hvad er afstanden til pakkebordet? Er de i Golden Zone (knÃƒÂ¦- til brysthÃƒÂ¸jde, under 20 meter)?

Lav en simpel tabel:
| SKU | Kategori | Nuv. afstand | Golden Zone? |
|-----|----------|-------------|-------------|
| ... | A | 35m | Nej |

### Trin 4: Identificer flytninger
A-varer der ikke er i Golden Zone Ã¢â‚¬â€ disse er dine fÃƒÂ¸rste prioriteter.
B-varer der er i Golden Zone Ã¢â‚¬â€ disse skal flyttes til sekvensÃƒÂ¦lt placering.
C-varer i Golden Zone Ã¢â‚¬â€ flyt dem til perifer placering.

Start med de 20 A-varer der sidder lÃƒÂ¦ngst fra pakkebordet. Det giver 80% af den mÃƒÂ¸jelige gevinst.

### Trin 5: Flyt og opdater WMS
FÃƒÂ¸r flytning: opdater lokation i WMS. SÃƒÂ¥ kan plukkerne navigere korrekt fra dag ÃƒÂ©t.
Efter flytning: verificer at WMS-lokation matcher fysisk placering.

### Trin 6: MÃƒÂ¥l effekten
MÃƒÂ¥l picks/time fÃƒÂ¸r og efter. Typisk stigning: 15Ã¢â‚¬â€œ25% inden for fÃƒÂ¸rste uge. Dokumenter ÃƒÂ¦ndringen.

## Typiske fejl

**1. Bruge omsÃƒÂ¦tning i stedet for plukhyppighed**
En dyr vare sÃƒÂ¦lges sjeldent men er hÃƒÂ¸jeste omsÃƒÂ¦tning. Den er C-vare i en plukoptimering. Brug antal pluk, ikke kr.-vÃƒÂ¦rdi.

**2. Glemme sÃƒÂ¦sonvariationer**
En julekalender er A-vare i november og C-vare i februar. KÃƒÂ¸r analyse hvert kvartal Ã¢â‚¬â€ og hÃƒÂ¦nsyntag til salgssaisonerne.

**3. Flytte varer uden at opdatere WMS**
Fysisk flytning uden WMS-opdatering medfÃƒÂ¸rer at plukkere navigerer til forkert lokation.

**4. Optimere en gang og aldrig revidere**
Sortiment ÃƒÂ¦ndrer sig. ABC-analysen er ikke en ÃƒÂ©ngangsopgave Ã¢â‚¬â€ det er en kvartalsvis rutine.

## SÃ¥dan gÃ¸r du det rigtigt

**1. Kombiner ABC med xy-analyse**
XY-analyse inddeler varer efter forudsigelig efterspÃƒÂ¸rgsel (X = jÃƒÂ¦vn, Y = periodisk, Z = uregulmÃƒÂ¦ssig). AX-varer (hÃƒÂ¸j frekvens, jÃƒÂ¦vn demand) er dine hÃƒÂ¸jeste prioriteter for optimal placering.

**2. Marker zoner visuelt**
Farvelabels eller gulvmÃƒÂ¦rkning: grÃƒÂ¸n = A-zone, gul = B-zone, rÃƒÂ¸d = C-zone. Alle Ã¢â‚¬â€ inkl. vikarer Ã¢â‚¬â€ forstÃƒÂ¥r systemet.

**3. SamsÃƒÂ¦lgende SKU-par: placÃƒÂ©r som naboer**
Varer der hyppigt bestilles i samme ordre reducerer gangtid, nÃƒÂ¥r de er placeret ved siden af hinanden. SmartPack identificerer samsÃƒÂ¦lgende par automatisk.

**4. Kvartalsvis review som fast punkt**
SÃƒÂ¦t det i kalenderen: hver 1. mandag i marts, juni, september og december. 2Ã¢â‚¬â€œ3 timers analyse. Resultater implementeres samme uge.

## Brug denne artikel: Tjekliste og nÃƒÂ¦ste skridt

- [ ] Hent plukhyppighedsdata for seneste 90 dage
- [ ] Kategoriser alle SKU'er som A, B eller C
- [ ] KortlÃƒÂ¦g om A-varer er i Golden Zone
- [ ] Identificer de 20 A-varer der sidder lÃƒÂ¦ngst fra pakkebordet
- [ ] Planlg flytning og opdatering af WMS
- [ ] MÃƒÂ¥l picks/time fÃƒÂ¸r og efter

**Formel:** Gangtidsgevinst per SKU = (Nuv. afstand Ã¢Ë†â€™ Optimal afstand) Ãƒâ€” Daglige pluk Ãƒâ€” 2 / Gangfart (1,2 m/s)

**NÃƒÂ¦ste skridt:** LÃƒÂ¦s "SÃƒÂ¥dan reducerer du plukketid" for implementering af batch picking og TSP-ruteoptimering.

## SmartPack understÃƒÂ¸ttelse

SmartPack genererer ABC-analysen automatisk fra plukhist orik. Et klik viser hvilke SKU'er der bÃƒÂ¸r flyttes og forventet gangtidsgevinst. Systemet opdaterer plukruterne automatisk nÃƒÂ¥r lokationer ÃƒÂ¦ndres.

## FAQ

**Kan jeg lave ABC-analyse uden WMS?**
Ja Ã¢â‚¬â€ du behÃƒÂ¸ver kun ordrehistorik (kan exporteres fra webshop eller Excel). Det tager lÃƒÂ¦ngere, men er muligt manuelt.

**Hvad er Golden Zone?**
Hylde pÃƒÂ¥ knÃƒÂ¦- til brysthÃƒÂ¸jde (50Ã¢â‚¬â€œ150 cm), maksimalt 20 meter fra pakkebordet. Ergonomisk og tidsmmÃƒÂ¦ssigt optimal zone for hÃƒÂ¸jfrekvens-varer.

**Hvad hvis mine A-varer er sÃƒÂ¦sonstyrede?**
KÃƒÂ¸r analysen inden hver sÃƒÂ¦son og replaer varer i Golden Zone derefter. Ja, det krÃƒÂ¦ver flytning Ã¢â‚¬â€ det er investeringen vÃƒÂ¦rd.

**Hvor mange SKU'er er typisk A-varer?**
Ved 500 SKU'er: typisk 50Ã¢â‚¬â€œ100 A-varer (10Ã¢â‚¬â€œ20%). Disse udgÃƒÂ¸r 70Ã¢â‚¬â€œ80% af al plukaktivitet.

**TSP-algoritmer Ã¢â‚¬â€ hvad er det?**
Travelling Salesman Problem-algoritmer beregner den korteste rute der dÃƒÂ¦kker alle plukpunkter. SmartPack anvender disse til ruteoptimering. ABC-analyse bestemmer, hvad der er pÃƒÂ¥ ruten Ã¢â‚¬â€ TSP bestemmer, hvornÃƒÂ¥r du samler det.



