---
primary_keyword: serienummer mangler lager
secondary_keywords: [serial number tracking, serienummer registrering WMS, manglende serienummer forsendelse, serial tracking e-handel]
cluster: 11-EdgeCases
---

# Serienummer mangler: Når du ikke kan spore hvilken enhed du sendte

Du sælger elektronik med garanti. En kunde reklamerer. Du ved ikke hvilken specifik enhed du sendte dem. Var det fra batch med mulig defekt? Er det i garantiperioden? Serienummer-tracking er ikke luksus for elektroniksmælgere – det er grundlæggende kundeservice og compliance.

## Hvad er serienummer-tracking?

Serienummer-tracking er en WMS-funktion der registrerer hvilket specifikt serienummer der er knyttet til hvilken ordre. Det giver sporbarheden: «dette serienummer X blev sendt til kunden Y på dato Z fra vores lager.»

Det er nødvendigt for:
- Garantihåndtering
- Recall-håndtering
- B2B compliance (visse industrier)
- Forsikringsopgør
- Tyveri-dokumentation

## Hvornår er det et problem?

**Du mangler serienummer-tracking når:**
- En kunde reklamerer og du ved ikke om det er din levering eller en de selv har købt
- En leverandør annoncerer recall på en batch – du ved ikke om du har sendt den
- En vare må åbnes for garantireparation – du kan ikke verificere om den er ækta
- Tyveri af varer – du kan ikke identificere hvilke serienumre der er stjrlet

## Det opdager de fleste for sent

**En kunde reklamerer. Du ved ikke om det er din levering eller en de selv har købt.** Uden serienummer: du refunderer uden at kunne verificere. Med serienummer: du verificerer straks om det er din levering. Forskel: 1.200 kr. (produktværdi) + 350 kr. (kundeservice) = 1.550 kr. per uberettiget reklamation.

## Hvad koster det når det mangler?

**Konkret eksempel:** Leverandør annoncerer recall på serienumre #10000-10500. Du har solgt 80 enheder fra denne batch men ved ikke hvem.

| Scenarie | Omkostning | Beregning |
|----------|------------|----------|
| **Valg 1: Kontakt alle** | 12.500 kr. | 200+ kunder × 15 min kundeservice × 250 kr./time |
| **Valg 2: Identificer de 80** | 3.333 kr. | 80 kunder × 10 min × 250 kr./time |
| **Forskel** | **9.167 kr. per recall-hændelse** | |

Scenarie: Leverandør annoncerer recall på serienumre #10000–10500. Du har solgt 80 enheder fra denne batch men ved ikke hvem.
- Valg 1: Kontakt alle 200+ kunder der har købt produktet de seneste 6 måneder – unfødvendigt og dyrt
- Valg 2: Identificer de 80 kunder med serienummer-tracking – øjeblikkelig præcis recall

Omkostning for manglende tracking ved recall: 10-50x højere end nødvendigt.

## Sådan implementerer du serienummer-tracking

### Trin 1: Scan serienummer ved modtagelse
Når varer modtages, scans produktets serienummer og knyttes til PO-numm eret i WMS.

### Trin 2: Scan serienummer ved pluk
Ved pluk: scan serienummer af den specifikke enhed der plukkes. WMS knytter det til ordren.

### Trin 3: Registrer serienummer på ordre-bekræftelse
Serienummeret kan være synligt i ordredetaljer og packing slip. Kunden kan verificere.

### Trin 4: Gem i min. 5 år
Garantiperioder og produktansvarsk rav kræver sporbarhed i mår. 5 år er minimum. Tjek din branche.

## Serienummer vs. lotnummer

- **Serienummer**: unikt per enhed. Bruges til elektronik, mædikoudstyr, våben.
- **Lotnummer**: unikt per batch. Bruges til fødevarer, kosmetik, lægem idler. Tracking gælder for hele batchen.

Velg den der er relevant for din produktkategori.

## Typiske fejl

- **Serienummer kun registreret ved modtagelse, ikke ved pluk** – du ved hvad der er på lager men ikke hvem der fik hvad
- **Manuel registrering** – fejlt astninger og manglende registreringer
- **Tracking kun på udvalgte produkter** – inkonsistent = upvelideligt
- **Data gemt færre end garantiperioden** – slet ikke ved reklamation
- **Ingen recall-procedure** – du har dataen men ingen plan for at bruge den

## Best practice

- Scan-baseret serienummer-tracking ved både modtagelse og pluk
- Serienummer anført på packing slip og i ordre-bekræftelse
- Data opbevaret i min. 5 år (10 år ved produktansvarsk rav)
- Recall-procedure dokum enteret: hvord an identificerer du hvilke kunder der skal kontaktes?
- Lotnummer for batch-trackede produkter (fødevarer, kosmetik)

## Brug denne artikel: tjekliste

- [ ] Serienummer-scan ved modtagelse aktiveret
- [ ] Serienummer-scan ved pluk aktiveret
- [ ] Serienummer vist i ordre-bekræftelse og packing slip
- [ ] Data-opbevaringsperiode defineret (min. 5 år)
- [ ] Recall-procedure dokum enteret

**Næste skridt:** Tjek om dit WMS understøtter serial tracking. Test flowet: modtag en vare med serienummer-scan, pluk den, og verificer at serienummeret er på ordren.

## SmartPack understøttelse

SmartPack understøtter serial tracking med scan ved modtagelse og pluk. Serienummer vist på ordre, packing slip og i ordreoversigt. Recall-funktion: søg på serienummerinterval og se alle påvirkede kunder.

## FAQ

**Er serienummer-tracking obligatorisk?**
Nej for de fleste produktkategorier. Men det er et krav i visse brancher (mædikoudstyr, våben, lægem idler) og stmærkt anbefalet for elektronik og småel.

**Hvad er forskellen på serienummer og lotnummer?**
Serienummer: unikt per individuel enhed. Lotnummer: unikt per produktionsbatch (gmælder alle enheder i batchen).

**Hvord an håndterer man recall med serienummer-tracking?**
Søg på de påvirkede serienumre i WMS. Systemet viser hvilke ordrer og kunder der er påvirket. Kontakt disse kunder direkte.

**Hvord an langt tilbage skal serienummer-data opbevares?**
Minimum garantiperioden + 1 år. For produktansvarsk rav: op til 10 år i visse kategorier. Tjek din brance og forsikringskrav.

**Kan man tilføje serial tracking efterhånden?**
Ja – men kun for fremtidigt lager. Historiske varer kan kun trackes bagudrettet via leverandørens batch-dokumentation.
