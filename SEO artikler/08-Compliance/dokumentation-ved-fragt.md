---
primary_keyword: dokumentation ved fragt
secondary_keywords: fragtdokumenter krav, CMR fragtbrev, tolddokumenter forsendelse, dokumentation eksport
cluster: 08-Compliance
---

# Dokumentation ved fragt: Hvilke papirer skal følge din forsendelse?

Du sender til UK første gang. Pakken stoppes i tolden. Handelsfaktura mangler HS-kode. Pakken tilbageholdes i 5 dage. Kunden annullerer ordren. Du har tabt: 1.200 kr. i fragt + 800 kr. i varer + kunden.

Forkert eller manglende dokumentation er en af de hyppigste årsager til forsinkede forsendelser, tilbageholdte pakker og bøder ved grænseovergange.

**Konsekvensen ved manglende dokumentation:**
- UK-forsendelse uden korrekt handelsfaktura: 3–5 dages forsinkelse + 150–300 kr. i tillægsgebyr
- EU B2B-forsendelse uden CMR-fragtbrev: ansvarsproblem ved skade = 5.000–25.000 kr.
- Farligt gods uden DGD: bøde 5.000–15.000 kr. + forsendelse returneres

## Hvad koster manglende dokumentation?

| Scenario | Konsekvens | Kr./hændelse (estimat) |
|----------|-----------|------------------------|
| UK-forsendelse uden HS-kode på handelsfaktura | Pakke tilbageholdt 3–5 dage + kunde returnerer | 1.200–3.000 kr. |
| B2B-forsendelse til Tyskland uden CMR-fragtbrev | Ansvarsproblem ved skade, ingen forsikringsdækning | 5.000–25.000 kr. |
| Farligt gods uden Dangerous Goods Declaration | Bøde + forsendelse returneres | 5.000–15.000 kr. |

**Real cost:** For en webshop med 50 internationale forsendelser/måned = 15.000–40.000 kr./år i risiko ved manglende dokumentation.

## Basisdokumentation: Alle indenrigsforsendelser

For normale indenrigs B2C-pakker (ingen farligt gods):
- **Fragtlabel**: Genereres af dit WMS/fragtportal med modtageradresse, afsenderadresse, stregkode
- **Ingen yderligere dokumentation** kræves

Det er minimummet. Men tilføjer du elementer (farligt gods, høj værdi, international) stiger kravene.

## EU-intern handel (B2B)

For B2B-forsendelser inden for EU:
- **Handelsfaktura** (commercial invoice): Varer, antal, priser, modtager, afsender
- **Pakkeliste** (packing list): Detaljeret over indhold per kollo
- **CMR-fragtbrev** (ved landevejstransport): Kontrakt mellem afsender og fragtfører

For B2C i EU: CMR er normalt ikke krævet, men handelsfaktura anbefales.

## Export udenfor EU (UK, USA, osv.)

For alle forsendelser til lande uden for EU:
- **Handelsfaktura** (commercial invoice): Obligatorisk. Skal indeholde:
  - Beskrivelse af varerne
  - HS/CN-varekode
  - Antal og enhed
  - Enhedspris og totalværdi
  - Valuta
  - Afsender og modtager
  - Leveringsbetingelse (Incoterms)
  - Oprindelsesland

- **Pakkeliste**: Anbefales stærkt, kræves i visse lande
- **EUR.1-certifikat** (ved præferencetold): Hvis varerne har EU-oprindelse og skal nyde godt af handelsaftaler
- **Oprindelsescertifikat**: Kræves til visse destinationer

## UK Post-Brexit

UK kræver siden Brexit 2021:
- **10-cifret UK Commodity Code** (UK version af TARIC)
- **Handelsfaktura** med alle krævede felter
- **Toldangivelse** for forsendelser over 135 GBP
- **EORI-nummer** (UK EORI hvis du importerer til UK)

Grænsen på 135 GBP: Under dette kan du bruge forenklet procedure.

## Farligt gods-dokumentation

Afhænger af klassifikation (se ADR-artikel), men kan inkludere:
- **Dangerous Goods Declaration (DGD)**
- **Multi-modal Dangerous Goods Form**
- **Emergency Response Information**

For LQ-forsendelser: Normalt ingen særskilt dokumentation – kun korrekt mærkning.

## Medicin og regulerede produkter

Farmaceutisk eksport kræver:
- **Eksporttilladelse** (visse produkter)
- **Sundhedscertifikat**
- **Certificate of Analysis**
- **GDP-dokumentation**

## Det opdager de fleste for sent

1. **Første UK-forsendelse i uge 12** — du sender 10 pakker til UK-kunder. Alle 10 stoppes i tolden fordi HS-kode mangler på handelsfaktura. 8 kunder annullerer ordren. Du taber: 12.000 kr. i salg + 3.500 kr. i fragt.

2. **B2B-forsendelse til Tyskland i uge 28** — du sender 50.000 kr. i varer uden CMR-fragtbrev. Fragten beskadiges under transport. Fragtleverandøren afviser ansvar fordi CMR mangler. Du taber: 50.000 kr.

3. **Ny medarbejder starter i uge 5** — hun genererer 30 internationale fakturaer med forkert valuta (DKK i stedet for EUR). Alle 30 pakker forsinkes 3–5 dage. 12 kunder klager. Du mister 8.000 kr. i kompensation.

## Dokumentation i dit WMS

Dit WMS bør understøtte:
- Automatisk generering af handelsfaktura
- Pakkeliste-generering
- Korrekt inkludering af HS-koder på dokumentation
- Arkivering af dokumentation per forsendelse

## Arkiveringskrav

Tolddokumenter og handelsfakturaer skal typisk gemmes:
- **DK**: 5 år (regnskabsloven)
- **EU-export**: 3–5 år (varierer per land)
- **Farligt gods**: 3 måneder minimum (transportdokumentation)

## Typiske fejl

- Manglende HS-koder på eksport-dokumentation
- Forkert valuta eller beløb på handelsfaktura
- Glemmer CMR-fragtbrev til B2B-transport
- Manglende oprindelsescertifikat til lande med handelsaftale
- Fejl i modtageradresse

## Gør det rigtigt nu

1. **Konfigurér dit WMS til automatisk at generere korrekt dokumentation** — gør det inden uge 18
2. **Implementér HS-koder på alle produkter i dit system** — brug Toldst.dk's TARIC-database
3. **Test dokumentationsflow med en testforsendelse til hvert nyt marked** — send til dig selv først
4. **Arkivér alle forsendelsesdokumenter systematisk** — opret digital mappe per måned
5. **Hold dig opdateret på krav per destinationsland** — UK ændrer regler kvartalsvis

## SmartPack og fragtdokumentation: Hvornår giver det mening?

**JA, hvis:**
- Du sender 50+ internationale forsendelser/måned
- Du sender til 3+ lande uden for EU
- Du har haft 2+ dokumentationsfejl i de sidste 6 måneder

**NEJ, hvis:**
- Du sender under 20 internationale forsendelser/måned → manuel skabelon er billigere

**Alternativet koster:**
- Manuel dokumentation per forsendelse: 10–15 min. = 80–120 kr./forsendelse i lønomkostning
- Fejl ved manuel proces: 3 hændelser/år = 9.000–15.000 kr.

**SmartPack-fordel:** Genererer automatisk de korrekte dokumenter baseret på forsendelsesdestination og produktklassificering – fra simpel fragtlabel til handelsfaktura med HS-koder.

## FAQ

**Hvad er Incoterms?**
Standardiserede leveringsbetingelser (DAP, DDP, EXW, osv.) der definerer ansvar og risiko ved forsendelse. DDP (Delivered Duty Paid) er typisk bedst for B2C.

**Skal jeg have EORI-nummer?**
For EU-intern handel: nej. For export til lande uden for EU: ja. Registrér via Toldst.dk.

**Hvad er et EUR.1-certifikat?**
Et oprindelsescertifikat der giver toldpræference under handelsaftaler. Relevant fx for DK-eksport til mange lande.

**Hvad sker der ved forkert dokumentation ved UK-toldgrænse?**
Pakken tilbageholdes – typisk 2–5 dages forsinkelse + mulige tillægsomkostninger.

**Er elektroniske dokumenter accepteret?**
Ja, for de fleste typer. Men visse lande kræver stadig papirdokumenter til bestemte produkter.
