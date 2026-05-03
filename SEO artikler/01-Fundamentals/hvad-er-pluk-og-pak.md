---
primary_keyword: pluk og pak
secondary_keywords: pick and pack, pluk pak lager, plukning lager, pakkeprocedure
cluster: 01-Fundamentals
---

# Hvad er pluk og pak — og hvorfor er det det dyreste led i dit lager?

Plukkeren tager forkert vare.
Ingen scanning.
Ingen kontrol.
Pakken sendes.

Kunden modtager forkert.
Du sender ny pakke.
Du refunderer.

**350 kr. direkte tab** — per fejl.
Ved 0,5% fejlrate = **157.500 kr./år** i undgået tab ved scanning.

---

## Hvad er pluk og pak?

**Pluk og pak** (pick and pack) er processen, hvor en medarbejder finder de bestilte varer i lageret (pluk), og pakker dem klar til forsendelse (pak). Det er det fysiske led, der binder ordren i systemet til pakken på transportbåndet.

Processen opdeles typisk i:
- **Pluk**: Bevægelse gennem lageret, scanning og afhentning af varer
- **Pak**: Kontrol, emballagevalg, pakning og labeludskrivning

---

## Hvornår er det et problem?

Pluk og pak er et problem, når:
- Fejlraten er over 0,5% (1 fejl per 200 ordrer)
- Plukterne bruger mere tid på at finde varer end at plukke dem
- Der er ingen standardprocedure for pakningstype — medarbejderne beslutter selv
- Afsendelse er en flaskehals, der stopper flow
- Nye medarbejdere tager over en uge at lære processerne

---

## Hvorfor det er vigtigt — i kroner

En pakkefejl koster **~350 kr. direkte**: returfragt (~80 kr.), ny forsendelse (~80 kr.), genpakning og kontrol (~60 kr.), kundeservice-tid (~130 kr.). Regn du LTV-tab med, er det **~450-850 kr. per fejl**.

Lønomkostningen ved ineffektivt pluk er mindst ligeså stor. En plukker, der gennemsnitligt plukker 60 linjer/time i stedet for 110, koster ved 8 timers arbejde og 250 kr./time:
- 60 linjer/time × 8 timer = 480 linjer
- 110 linjer/time × 8 timer = 880 linjer
- **400 linjer tabt per medarbejder per dag** — eller alternativt en ekstra ansat for at nå samme output.

---

## Hvordan fungerer pluk og pak i praksis?

### Plukprocessen trin for trin

1. **Ordremodtagelse** — WMS modtager ordren og genererer en plukopgave
2. **Ruteberegning** — Systemet beregner optimal plukrute (A* pathfinding)
3. **Pluk** — Medarbejder scanner vare og bekræfter antal ved hvert stop
4. **Fejlhåndtering** — Hvis vare ikke er på plads: systemet eskalerer og foreslår alternativ
5. **Transport til pakkestation** — Tote/vogn med plukkede varer køres til pak

### Pakprocessen trin for trin

1. **Modtagelse fra pluk** — Scanner tote-ID og tilknytter ordren
2. **Emballagevalg** — System anbefaler korrekt æskestørrelse baseret på varens mål og vægt
3. **Indpakning** — Varer pakkes, filling-materiale tilsættes efter standard
4. **Scanning og kontrol** — Hver vare scannes ud igen for dobbelt-bekræftelse
5. **Labeludskrivning** — Fragtlabel udskrives og påsættes
6. **Afsendelse** — Pakke scannes ud af lageret

---

## Typiske fejl

**1. Ingen scanning ved pluk**
Medarbejderen plukker "efter hukommelse". Fungerer fine for erfarne medarbejdere — til den dag de tager fejl. Scanning er ikke kontrol, det er dokumentation.

**2. Plukruten er tilfældig**
Uden systemstyret rute kører plukkerne frem og tilbage i lageret. Undersøgelser viser 20-40% spildt gangdistance ved fri rute vs. optimeret rute.

**3. Pakkestationen er en flaskehals**
Hvis pakstationen ikke kan følge med plukket, hober ordrer sig op og flow stopper. Ratio er typisk 1 pakker per 2-3 plukkere afhængigt af sortiment.

**4. Emballage vælges frit**
For store kasser = dyrere fragt og spildt filling-materiale. For små kasser = beskadiget vare og returnering. Standardisér emballagestørrelser.

**5. Ingen kvalitetskontrol**
Pakken lukkes uden dobbeltkontrol. En simpel vej-kontrol (pakken vejer hvad den skal) fanger 60-80% af fejlpakningerne.

---

## Sådan gør du det rigtigt

**1. Scan alt — altid**
Alle varer scannes ved pluk og ved pak. Det giver sporbarhed, fanger fejl to gange og gør oplæring af nye medarbejdere langt nemmere.

**2. Standardiser emballagestørrelser til 4-6 kasser**
De fleste sortimenter kan dækkes med 4-6 standardstørrelser. WMS vælger kassen, medarbejderen pakker den.

**3. Brug batch picking til ordrer under 3 linjer**
Samle 5-10 ordrer i én tur sparer 60-70% af gangdistancen vs. enkeltordre-pluk. SmartPack benchmark: **110 linjer/time** ved batch picking.

**4. Adskil pluk og pak fysisk**
Separat pakkestation holder flow, giver bedre arbejdsstillinger og gør det nemt at måle KPI separat for pluk og pak.

**5. Mål linjer per time per medarbejder ugentligt**
Det er den vigtigste KPI i lagerets daglige drift. Det afslører træningsbehov, flaskehalse og layoutproblemer.

---

## Hvornår du skal handle

- Fejlraten er over 0,5%
- Linjer per time er under 70 (for sortiment uden mange specialkrav)
- Nye medarbejdere tager mere end 3 dage at nå acceptable hastigheder
- Pakstationen er flaskehals mere end 20% af dagene
- Du kan ikke spore, hvem der plukkede en fejlpakket ordre

---

## Sådan understøtter SmartPack det

SmartPack genererer systemstyrede plukruter via A* pathfinding og understøtter batch picking med totes. Systemet viser medarbejderen næste placering på håndterminalen, kræver scanning-bekræftelse ved hvert stop, og foreslår optimal emballage ved pakstationen. Linjer per time logges per medarbejder og vises i realtids KPI-dashboard.

---

## Brug denne artikel
- [ ] Mål din aktuelle fejlrate: fejl per uge ÷ total ordrer × 100 — er du over 0,5%?
- [ ] Tæl gennemsnitlige linjer per time for din bedste og dårligste plukker
- [ ] Identificér om pakstationen er flaskehals: er der ordrer i kø ved pak mens pluk er ledig?
- [ ] Næste skridt: Indfør scanning ved pluk inden for 30 dage og mål fejlraten igen

---

## FAQ

**Hvad er pick and pack på dansk?**
Pick and pack hedder pluk og pak på dansk — det er processen, hvor man finder varer på lageret og pakker dem til forsendelse.

**Hvad er en god linjer-per-time rate?**
For standardsortiment med batch picking er 90-120 linjer/time et godt benchmark. Under 60 linjer/time indikerer optimerings-potentiale i ruter, layout eller træning.

**Hvornår skal jeg skifte fra enkeltordre-pluk til batch picking?**
Når over 50% af dine ordrer har 1-3 ordrelinjer. Batch picking giver størst gevinst på høj-volumen, lavlinje-ordrer.

**Skal pakning og pluk gøres af samme medarbejder?**
Ikke nødvendigvis. Mange lagre adskiller rollerne for bedre flow og lettere KPI-måling. Ved lavt volumen er kombineret rolle OK.

**Hvad er den nemmeste måde at reducere plukkefejl på?**
Stregkodescanning ved pluk. Det er den single investering, der reducerer fejlraten mest, hurtigst — typisk fra 2-3% ned til under 0,5%.

