---
primary_keyword: forkert label på pakke
secondary_keywords: [label fejl forsendelse, forkert adresse label, label mismatch, pakke sendt til forkert modtager]
cluster: 11-EdgeCases
---

# Forkert label: Når pakken når den forkerte modtager

To pakker på bordet.
To labels printer.
De byttes.

Køge får Aalborgs ordre.
Aalborg får Køges.

Begge kunder ringer.
Begge skal have ny pakke.
Og en af dem har set en andens adresse — GDPR-brud.

En forkert label koster 1.300 kr.
Ved 2 fejl/uge: 135.000 kr./år.

## Hvad er en forkert label?

Forkert label-fejl opstår i tre varianter:
1. **Swapped labels**: to pakker får hinandens labels – begge går til forkert modtager
2. **Forkert kunde på korrekt adresse**: label printer med forkert kundenavn men korrekt adresse (sjældent problem)
3. **Gammel label ikke fjernet**: en tidligere labels stregkode scannes i stedet for den nye

## Konsekvenser – i hårde tal

| Omkostningspost | Estimat |
|-----------------|----------|
| 2 erstatningsforsendelser | 90-180 kr. |
| 2 returneringer (prepaid labels) | 80-160 kr. |
| Kundeservice (2 kunder × 45 min) | 375 kr. |
| GDPR-vurdering og dokumentation | 150-300 kr. |
| LTV-tab (estimat 25% churn på begge) | 600 kr. |
| **Total per label-fejl** | **1.295-1.615 kr.** |

**Ved 2 label-fejl/uge: 134.000-168.000 kr./år**

Og det er før GDPR-bøde, hvis Datatilsynet vurderer det som alvorligt databrud.

- To kunder er berørt – ingen får det rigtige
- En af dem modtager en andens ordre – potentiel GDPR-brud (de ser en andens adresse)
- Begge kunder kontakter kundeservice
- To erstatningsforsendelser kræves – og du må håbe at køberen vil returnere den forkerte ordre

## Det opdager de fleste for sent

1. **Forkert label = IKKE grøn Print-knap** – Plukkeren ser en forkert label. Tror løsningen er at trykke “Print” igen. FORKERT. Grøn Print-knap genererer en NY label til SAMME pakke. Nu har du 2 labels til samme ordre. Korrekt procedure: **“Udskriv igen”** (re-printer eksisterende label). Forskellen koster 450 kr./fejl.

2. **Labels printer i bunke om morgenen** – “Vi printer alle dagens labels kl. 08:00, så er de klar.” Bunken blandes. Labels byttes. 3-5 fejl/dag. Opdagelsen: når kundeservice får 6 klager samme dag. Autoprint ved pakkeafslutning eliminerer dette – men I har ikke implementeret det.

3. **Gammel label ikke fjernet fra genbrugt kasse** – Fragtmanden scanner den gamle stregkode. Pakken går til forkert adresse. I opdager det aldrig, fordi tracking viser “levet”. Kunden klager aldrig (tror det er en gave). Men I har sendt en gratis pakke til en fremmed.

## Forebyggelse: Scan-bekræftelse er nøglen

### Scan-and-verify ved labelpåsætning
Den sikreste metode: efter labelprinting, scan pakken OG labelen inden de klistres på.

**Flow:**
1. Ordre plukket og pakket
2. Label printer med pakke-ID
3. Scan pakke-ID (eller ordre-barcode på pakke)
4. Scan label
5. WMS bekræfter: de matcher → sæt label på

Ingen match: WMS alarmerer. Plukkeren gælder ikke label på.

### Autoprint ved pakkeafslutning
Print label først når pakken er lukket og klar. Ingen forudprintede labels der venter. Ingen label-bunke der kan blandes.

### Én pakke ad gangen
Klarens én pakke fuldt færdigt (label klistret på) inden næste startes. Ingen to &åbne" pakker på bordet samtidigt.

### Fjern gamle labels
Alle gamle forsendelseslabels SKAL fjernes fra kassen ved genbrug. Ellers scanner fragtmanden den gamle.

## Når fejlen er sket: hvad gør du?

### Trin 1: Identificer begge påvirkede kunder
Tjek: hvilke to ordrer er berørt? Find dem i WMS via tidsstempel og pakkestation.

### Trin 2: Kontakt BEGGE kunder straks
En modtager forkert vare, en modtager forkert (og måske intet). Begge skal have beklage lse og information inden de klager.

**Til kunden der modtog forkert vare:**
- Undskyld, forklar – bød dem at sende den forkerte vare retur (betalt)
- Bekræft at korrekt ordre sendes straks

**Til kunden der ikke har modtaget noget:**
- Undskyld, forklar – bekræft at korrekt ordre sendes straks

### Trin 3: Send erstatningsforsendelser
Sæt høj prioritet på begge erstatningsordrer.

### Trin 4: GDPR-vurdering
Er den forkert modtagne ordre et persondata-brud? Kunden har set en andens name og adresse. Vurder om det er indberetningspligtigt til Datatilsynet (72-timers grmænse).

## Typiske fejl

- **Labels forudprintet i bunke** – kan blandes når plukkeren ikke er opmærksom
- **Ingen scan-verify** – label sidereset uden konfirm ation
- **Flere åbne pakker på bordet** – labels kan bytters
- **Gammel label ikke fjernet fra genbrugt kasse** – fragtm and scanner gammel kode
- **Ingen procedure når fejl opdages** – kundeservice ved ikke hvem der skal kontaktes

## Sådan gør du det rigtigt

- Autoprint ved lukket pakke (ikke før)
- Scan-and-verify på alle pakstationer
- Én pakke ad gangen på arbejdsbordet
- Procedure for fejl dokumenteret på stationen
- GDPR-procedure inkluderer label-fejl som potentielt databrud

## Brug denne artikel: tjekliste

- [ ] Autoprint ved pakkeafslutning (ikke før)
- [ ] Scan-and-verify implementeret på pakstationer
- [ ] Rutine: kun én åben pakke ad gangen
- [ ] Procedure for label-fejl dokumenteret inkl. GDPR-vurdering
- [ ] Procedure for bortskaffelse af gammel label ved kassegenbrug

**Næste skridt:** Test din pakstation i dag: klistrer en plukkeren labelen på uden scan-bekræftelse? Implementer scan-verify denne uge.

## SmartPack: JA eller NEJ?

**JA, hvis:**
- Du har over 100 ordrer/dag
- Du oplever label-fejl (selv sjældent – 1 fejl/måned koster 15.000 kr./år)
- Du printer labels i bunke eller forud
- Ingen scan-verify ved pakkestation

**NEJ, hvis:**
- Under 30 ordrer/dag med én pakkestation og fuld kontrol
- Allerede har scan-verify implementeret i eksisterende system

**Hvad koster alternativet?**

| Alternativ | Label-fejl/år | Årlig omkostning | Forskel vs. SmartPack (0 fejl) |
|------------|---------------|------------------|-------------------------------|
| Forudprintede labels, ingen verify | 104 (2/uge) | 134.000-168.000 kr. | **+134.000-168.000 kr./år** |
| Autoprint, ingen verify | 26 (0,5/uge) | 33.500-42.000 kr. | **+33.500-42.000 kr./år** |
| Autoprint + manuel verify | 12 (1/måned) | 15.500-19.500 kr. | **+15.500-19.500 kr./år** |
| SmartPack (autoprint + scan-verify) | 0-2 | 0-3.000 kr. | — |

**SmartPack's pakstation-flow kræver scan-verify** af label mod pakke før pakken frigives til afsendelse. Autoprint er standard – ingen forudprintede label-bunker. System alarmerer ved label-mismatch og logger fejl til QA-dashboard. **“Udskriv igen”-funktion** (IKKE grøn Print-knap) sikrer korrekt re-print.

## FAQ

**Er en forkert label et GDPR-brud?**
Muligvis. Kunden har set en andens persondata (navn, adresse). Vurder om det er et databrud med risiko for de registrerede og evt. indberettningspligt til Datatilsynet (72 timer).

**Hvad gør man når kunden allerede har åbnet pakken med forkert indhold?**
De beholder typisk åbnet pakke (du kan ikke sende den til rætte køber). Send korrekt vare til begge. Bed dem sende den forkerte retur betalt.

**Hvad koster en label-fejl samlet?**
Typisk 4 ekstra forsendelser (2 erstatninger + 2 returneringer) = 100–250 kr. i fragtomkostning + 2–3 timer kundeservice + potentiel GDPR-vurdering.

**Hvord an forhindrer man label-bytning på travle dage?**
Autoprint + scan-verify + én pakke ad gangen på bordet. Ingen shortcuts på travle dage.

**Hvad er scan-and-verify?**
En WMS-funktion der kræver scan af både pakke og label inden pakken frigives. Systemet bekræfter at de matcher.

