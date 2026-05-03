---
primary_keyword: fejl i plukning
secondary_keywords: [plukkefejl undgå, almindelige plukkefejl, plukfejl lager, pluk fejl webshop]
cluster: 03-Operations
article_type: guide
---

# De 7 mest almindelige fejl i plukning – og hvad de koster dig

Plukfejl er den dyreste fejl du laver på et lager. Ikke fordi én fejl er katastrofal, men fordi de går ubemærket hen — ind til kunden klager. På det tidspunkt har du allerede brugt emballage, fragt og arbejdstid. Og du betaler det hele igen. Denne artikel gennemgår de syv fejl der koster mest, og hvad du gør ved dem.

## Kort svar

De fleste plukfejl er ikke menneskelig fejl. De er systemfejl. Uklare lokationer, ingen scanning, for lang plukrute, for lidt lys, for lidt plads. Ret systemet, og fejlraten falder af sig selv.

---

## Hvad en plukfejl faktisk koster

Grundregning: en plukfejl koster gennemsnitligt **350 kr. i direkte omkostninger** (returnering, ny forsendelse, kundeservice). Med tabt LTV-værdi: 450-850 kr.

Ved 200 ordrer/dag og 2% fejlrate: 4 fejl/dag × 350 kr. = **1.400 kr./dag × 300 dage = 420.000 kr./år**.

Ved samme volumen med 0,3% fejlrate: 210 kr./dag = **63.000 kr./år**. **Besparelse: 357.000 kr./år**.

---

## Det opdager de fleste for sent

- **Fejlraten stiger med volumen:** 1% fejl ved 50 ordrer/dag = 1 fejl hver anden dag. Ved 200 ordrer/dag = 2 fejl/dag = 10/uge. Det skalerer ikke lineært i synlighed — men i kroner gør det.
- **Nye medarbejdere laver 3-5× flere fejl uden scanning.** Erfarne kompenserer med hukommelse. Nye kan ikke.
- **Scanning virker ikke retroaktivt.** Du kan ikke scanne dig ud af fejl der allerede er sendt. Kunden har pakken. Du betaler.
- **Trustpilot-scoren falder før du ser tallene.** De fleste opdager først fejlraten når returer og klager stiger — og der er allerede tabt 50.000-150.000 kr.

---

## Fejl 1: Ingen scanning ved pluk

**Hvad sker der:** Plukkeren finder varen, tror det er den rigtige og lægger den i kassen. Uden scanning er der ingen kontrol.

**Typisk fejlrate:** 2-3% uden scanning. Under 0,5% med scanning.

**Løsning:** Indfør scan-ved-pluk. Plukkeren scanner varen. Systemet bekræfter match. Ingen match = ingen videre. Det er den vigtigste enkeltinvestering du kan gøre på et lager.

---

## Fejl 2: Uklare eller manglende lokationskoder

**Hvad sker der:** Plukkeren er usikker på om det er hylde 3 eller 4. Vælger forkert. Plukt en forkert variant.

**Symptom:** Fejl er koncentreret på bestemte varer eller zoner. Nye medarbejdere laver flere fejl end erfarne.

**Løsning:** Tydelig skiltning på alle lokationer. Lokationskode på picklædsel. Kode på hylde. Ingen tvivl mulig.

---

## Fejl 3: Picklædsel sorteret forkert

**Hvad sker der:** Picklædslen er sorteret efter ordrenummer, ikke efter lagergang. Plukkeren går frem og tilbage i lageret. Koncentrationen falder. Fejl stiger.

**Konsekvens:** Unødige skridt + mental træthed = fejl. Specielt tydeligt efter middag og i travle perioder.

**Løsning:** Sorter altid picklædsler efter lokationsrækkefølge. Eller lad WMS'et generere en optimeret rute automatisk.

---

## Fejl 4: Ensartede varer for tæt på hinanden

**Hvad sker der:** Produktet i str. S og str. M ligger side om side. Uden at kigge nøje: forkert størrelse i kassen.

**Symptom:** Returneringsårsag: "forkert størrelse" eller "forkert farve" fremgår hyppigt i returdataen.

**Løsning:** Adskil ensartede varianter fysisk. Sæt dem i separate hylder, mærk hylderne tydeligt med farve-koding. Eller brug FIFO-bokse (First In First Out-boks: en lukket beholder hvor varer indlægges bagfra og plukkes forfra — så kun én variant er synlig ad gangen).

---

## Fejl 5: Manglende scan-ved-afsendelse

**Hvad sker der:** Varen er plukket korrekt, men der lander to varer i én kasse, eller en vare glemmes. Uden scan ved afsendelse er der ingen final check.

**Løsning:** Dobbelt-scanning: scan ved pluk og scan ved pak/afsendelse. Det fanger de fejl der sker mellem pluk og afsendelse.

---

## Fejl 6: Plukning fra bulk-lokation i stedet for plukzone

**Hvad sker der:** Plukzonen er tom. Plukkeren går til bulk-lageret og tager direkte derfra. Bulk-lokationen opdateres ikke. Lagertal divergerer.

**Konsekvens:** Oversalg. Manglende varer. Kunder der får besked om forsinkelse efter at have betalt.

**Løsning:** Definer klare regler for hvornår der må plukkes fra bulk, og hvem der er ansvarlig for at opdatere systemet. Ideelt: automatisk refill-alert når plukzone når under minimum.

---

## Fejl 7: For mange ordrer per plukrunde

**Hvad sker der:** Plukkeren bærer 15 ordrer på én gang. Jo flere ordrer, jo højere kognitivt load. Når det er travlt, lander varer i forkert kasse.

**Løsning:** Batch-picking med klar max-grænse per runde (typisk 5-8 ordrer for manuelle systemer). Eller zone-picking der opdeler lageret så ingen plukker alt.

---

## Rangering efter impact

| Fejl | Relativ impact | Svær at rette? | Årlig kost (200 ordrer/dag) |
|---|---|---|---|
| Ingen scanning | Meget høj | Lav | **210.000-350.000 kr.** |
| Picklædsel forkert sorteret | Høj | Meget lav | **75.000-150.000 kr.** (gangtid) |
| Ensartede varer tæt | Middel-høj | Lav | **35.000-70.000 kr.** |
| Uklare lokationskoder | Middel | Lav | **25.000-50.000 kr.** |
| Ingen scan-ved-afsendelse | Middel | Lav | **35.000-70.000 kr.** |
| Plukning fra bulk | Middel | Middel | **20.000-40.000 kr.** |
| For mange ordrer per runde | Lav-middel | Lav | **15.000-30.000 kr.** |

---

## Hvornår du skal handle

- Plukfejlrate er over 1%
- Returdata viser mønster i fejltype (forkert størrelse, forkert vare)
- Nye medarbejdere laver markant flere fejl end erfarne
- Du har ingen scanning på plukprocessen

---

## FAQ

**Hvad er en normal plukfejlrate?**
Under 0,5% er branchen-standard for et velfungerende lager med scanning. Over 1% er uacceptabelt og bør udløse handling.

**Koster scanning meget?**
En håndterminal starter fra 2.000-4.000 kr. Ved 200 daglige ordrer og 2% fejlrate er payback typisk under 30 dage.

**Hvilken fejl bør jeg rette først?**
Start med scanning ved pluk. Det er den enkeltforbedring der reducerer fejlraten mest, hurtigst.

## Læs også

- [Hvad koster en pakkefejl egentlig?](/viden/okonomi/plukkefejl-koster-penge)
- [Sådan reducerer du plukketid](/viden/drift/saadan-reducerer-du-plukketid)
- [Sådan undgår du pakkefejl](/viden/drift/saadan-undgaar-du-pakkefejl)
