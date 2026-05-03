---
primary_keyword: sådan fungerer et lager
secondary_keywords: [moderne lager forklaret, hvordan fungerer et lager, lager webshop forklaring, lagerflow forklaret]
cluster: 01-Fundamentals
article_type: forklaring
---

# Sådan fungerer et moderne lager – forklaret simpelt

Et lager er ikke bare et rum med varer på hylder. Det er et flow. Varer ind, varer behandlet, varer ud. Når det flow går galt et sted, mærker kunden det i den anden ende. Denne artikel forklarer hvad der faktisk sker på et velfungerende lager — fra den dag en leverance ankommer til den dag kunden får sin pakke.

## Kort svar

Et moderne lager består af fem faser: modtagelse, indlagring, pluk, pakning og afsendelse. I hvert trin sker der en scanning, en validering og en opdatering af systemet. Det er den scanning — ikke selve det fysiske arbejde — der gør forskellen på et lager med 0,3% fejlrate og et med 3%.

---

## Fase 1: Modtagelse

En leverance ankommer. På et dårligt lager går varerne direkte på hylden. På et godt lager sker først:

1. **Optelling mod indkjøbsordre:** er der 48 enheder som bestilt, eller 46?
2. **Kvalitetstjek:** er der beskadigede varer, der skal reklameres?
3. **Registrering i system:** systemet ved nu at varerne eksisterer og kan sælges
4. **Pladsanvisning:** systemet anviser en konkret lokation. Medarbejderen placer varen der.

Før alt dette er gjort, eksisterer varen ikke. Systemet kan ikke sælge det, kunden kan ikke bestille det, plukkeren kan ikke finde det.

---

## Fase 2: Indlagring

Varerne er registreret og har fået en plads. Indlagringen behøver ikke være kompliceret — men den skal være konsekvent.

**ABC-princippet:** Højtroterende varer (A) placeres nærmest pakkebordet. Lavroterende (C) placeres længst væk. Det sparer tid ved hvert eneste pluk.

**Kapacitetsstyring:** Et system der ved, at lokation A-03-02 er fuld, sender ikke en medarbejder dertil med ny vare. Det lyder simpelt. De fleste gør det ikke.

---

## Fase 3: Pluk

En kunde afgiver en ordre i din webshop. Hvad sker der?

**Uden WMS:** En medarbejder printer en picklædsel og går rundt og leder. Hvis listen er sorteret efter ordrelinjer frem for lagergang, går medarbejderen frem og tilbage. Det er spildt tid.

**Med WMS:** Systemet opretter automatisk en plukopgave. Ruten er optimeret: medarbejderen går den korteste vej gennem lageret. Scanningen ved pluk bekræfter at den rigtige vare plukkes. Fejlraten falder fra 2-3% til under 0,5%.

For 500 ordrer om dagen er det forskellen på 10-15 fejl og 2-3 fejl. Hver fejl koster i gennemsnit **350 kr. i direkte omkostninger** (returnering: 89 kr., ny forsendelse: 45 kr., kundeservice 15 min: 125 kr., emballage + arbejdstid: 91 kr.).

---

## Fase 4: Pakning

Varen er plukket. Nu skal den pakkes og mærkes korrekt.

På et moderne pakkebord er alt håndgribeligt:
- Emballagemateriale i rækkefølge af forbrug
- Fragtlabel printet automatisk når plukopgaven er afsluttet
- Instruktion på skærm hvis varen kræver særlig pakning

En ekstra scanning her — scan-ved-afsendelse — er den sidste fejlkontrol. Systemet verificerer at det pakkes er det der er plukket og det der matcher ordren.

---

## Fase 5: Afsendelse

Pakken scanner ud af lageret. Det udløser automatisk:
- Opdatering af lagertal
- Fulfillment sendt til webshop (Shopify/WooCommerce opdaterer sig)
- Forsendelsesmail til kunden med tracking

Det er ikke en manuel proces. Det sker i det øjeblik pakken scanner ud. Kunden får sin mail før pakken er i bilen.

---

## Hvad der er anderledes i dag vs. for 10 år siden

| Gammel model | Moderne model |
|---|---|
| Papir-picklædsel | Digital plukopgave på scanner/skærm |
| Manuel lagertelling | Realtids lagerbeholdning via scanning |
| Batch-rapporter natten over | SignalR/webhook – opdatering i sekunder |
| 2-3% fejlrate | Under 0,5% med dobbelt-scanning |
| Medarbejder finder selv vej | TSM-optimeret plukrute |
| Forsendelsesmail dagen efter | Automatisk mail når pakken scanner ud |

---

## Det vigtigste du kan gøre i dag

Du behøver ikke implementere alt på én gang. Start med det der giver mest:

1. **Faste pladser til alle varer** — uden det er intet andet muligt
2. **Scanning ved pluk** — reducerer fejlrate med 80-90%
3. **Automatisk fulfillment til din webshop** — sparer tid og eliminerer forsinkede mails

Resten er optimering.

---

## Hvad SmartPack automatiserer i de 5 faser

| Fase | Uden SmartPack | Med SmartPack |
|---|---|---|
| Modtagelse | Manuel optelling, papir-registrering | Scanning + automatisk systemopdate­ring |
| Indlagring | Fri placering eller hukommelse | Systemanvist lokation, kapacitetsstyring |
| Pluk | Papir-picklædsel, fri rækkefølge | Optimeret plukrute, scan-bekræftelse |
| Pakning | Manuel fragtlabel-print | Automatisk label + scan-ved-afsendelse |
| Afsendelse | Manuel fulfillment-opdatering | Automatisk tracking til webshop og kunde |

---

## FAQ

**Er et moderne lager kun for store virksomheder?**
Nej. De principper der gør et lager moderne — faste pladser, scanning, automatisk fulfillment — gælder fra 20 ordrer om dagen. Systemerne er ikke dyrere end Excel, bare mere pålidelige.

**Hvad koster scanning-udstyr?**
En standard håndterminal starter fra 2.000-4.000 kr. Ved 100 daglige ordrer og 2% fejlrate (2 fejl/dag × 350 kr. = 700 kr./dag) er payback **under 6 arbejdsdage**. Resten af året er ren gevinst.

**Hvad er en TSM-algoritme?**
Travelling Salesman Method. Beregner den korteste rute gennem lageret for en given plukopgave. SmartPack gør det automatisk.

## Læs også

- [Hvad er lagerstyring?](/viden/fundamentals/hvad-er-lagerstyring)
- [Guide til lager for webshops](/viden/fundamentals/lager-guide-webshop)
- [De 7 mest almindelige fejl i plukning](/viden/drift/7-fejl-i-plukning)
