---
primary_keyword: en dag på et lager
secondary_keywords: [lagerdag beskrivelse, hvad sker der på et lager, lagermedarbejder hverdag, lager flow]
cluster: 12-RealWorld
---

# En dag på et lager: Fra morgenmmødet til fragtleverandørens afhentning

Kl. 07:52. Plukkeren scanner hylde 7C. Systemet siger 8 stk. Fysisk: 3 stk.

Missing pick. Ordren stopper. Kunden venter.

Det opdages nu – ikke når pakken er lukket. Det er forskellen mellem en god dag og en dyr dag.

Her er hvad der rent faktisk sker på et webshop-lager en tirsdag – fra morgenmødet kl. 07:00 til GLS henter kl. 16:30. Med de rigtige tidspunkter. De rigtige fejl. Og de beslutninger der holder cut-off.

## 07:00 – Morgen-briefing og dagsoverblik

Lagerchefen starter med at åbne WMS-dashboardet. Hurtig gennemgang:
- Ordrer modtaget i går aftes og natten over: 47 ordrer klar til pluk
- Kritiske backordre: 2 (kunder der har ventet over 3 dage)
- Lageroptmælling planlagt: 5 SKU'er i cycle count-planen for i dag
- Varer på vej fra leverandør: 2 leverancer forventet før kl. 12

**Prioritering for dagen:**
1. Backordre-ordrer først
2. Modtag og registrer leverancer så snart de ankommer
3. Pluk alle dagens ordrer inden cut-off (15:00)
4. Pakke og klar til afhentning 16:00

## 07:30 – Pluk-runden starter

Et team på to plukkere starter med dagens plukjobs. WMS har oprettet batch-picks: 12 ordrer samles på første runde, 10 på anden.

Plukkerens håndholdte scanner viser ruten: systemet har optimeret gangtiden. Det er ikke den tur køberen valgte – det er den tur der minimerer gangtid.

**Lille problem kl. 07:52**: Plukkeren scanner hylde 7C. Systemet siger 8 stk. Fysisk: 3 stk. Missing pick. Registreres i systemet. Cycle count trigges automatisk. Ordren sættes midlertidigt på hold.

## 09:15 – Leverance ankommer

Den første leverance fra leverandøren ankommer med 4 paller. Modtagelsesflo w:
1. Chauffør klårer ind med afhentningstidspunkt
2. Palleoplyst mod PO-numm er i WMS
3. Scan hvert kolliantal vs. PO: discrepancy på én SKU (15 stk. leveret, 20 stk. bestilt)
4. Registrer discrepancy i WMS – trigger notifikation til indkløb
5. Godkend modtagelse og indsæt på lager-lokationer med scan

Resultat: de 15 stk. tilgængelige på lager. Leverandøren skal følge op på de 5 resterende.

## 11:00 – Pakkestationen er i fuld sving

Når pluk er afsluttet, går varerne til pakkestationen. Her sker:
1. Scanner bekræfter at plukket svarer til ordren
2. Kassen vælges (system foreslår den optimale størrelse)
3. Varer pakkes med korrekt beskyttelse
4. Vægt registreres
5. Label printer
6. Label scannes mod pakken – match bekræftes
7. Pakken flyttes til afgangs-området

**Kl. 11:23**: Printe ren stopper. Papirstop. Procedure aktiveres: rens printer, genstart. 4 minutter forsinket. Buffer holder.

## 13:00 – Cycle count og korrektioner

De 5 planlagte SKU'er tælles. Plus den ene der trigge de missing pick tidligt på morgenen.

Resultat:
- 4 SKU'er: OK – saldo matcher
- 1 SKU: 3 stk. diskrepancy – korrekteres og root-cause undersinges
- Missing-pick SKU: 3 stk. fundet på naboplacering (forkert indsætning). Registrering rettes.

## 15:00 – Cut-off nærmer sig

Cut-off er 15:00 (intern). Fragtleverandørens afhentning er 16:30.

Status kl. 14:45: 43 ordrer afsendt-klar. 4 ordrer i gæng. 1 backorder stadig på hold.

Rush: de 4 ordrer prioriteres. Backorder: kunden notificeres proaktivt om forsinkelse.

## 16:30 – GLS henter

Chauføren ankommer. Afstemning:
- Antal pakker i systemet: 43
- Antal pakker fysisk på pallen: 43 ✓
- Scanningskv ittering modtages fra chaufør

Fragtleverandøren kører. Dagens afsendelse er afsluttet.

## 17:00 – Afslutning

**Dags-rapport:**
- 43 ordrer afsendt (100% af målet)
- 1 backorder communicated til kunde
- 1 leverance modtaget med discrepancy dokumenteret
- Inventory accuracy: 99,2% (5 af 6 SKU'er korrekte)
- Printer-nedbrud: 4 min – ingen konsekvens for cut-off

**Overordnet**: en god dag. Systemet fangede fejl før de ramte kunden. Processerne holdt.

## Hvad en god dag vs. en dårlig dag adskiller

| God dag | Dårlig dag |
|---|---|
| Missing pick opdages ved pluk, ikke ved pakning | Missing pick opdages når pakken er lukket |
| Printer-fejl løst på 4 min med procedure | Printer-fejl giver 30 min kaos |
| Leverance-discrepancy registreret | Leverance modtaget uden optmælning |
| Backorder kommunikeret proaktivt | Kunden klager selv |
| Fragtafstemning på stedet | Pakker "forsvinder" |

## SmartPack understmøttelse

SmartPack's dashboard viser den daglige status fra morgen-briefing til afslutning. Alle de hændelser der er beskrevet her – missing picks, cycle counts, leverance-modtagelse, fragtafstemning – er integrerede workflows i systemet.

## FAQ

**Hvord an mange ordrer håndterer et lille lager per dag?**
Typisk 20–200 ordrer per dag med 1–3 medarbejdere. Det afhænger af ordrenes kompleksitet og pakkestørrelse.

**Hvord an længe tager det at pakke en ordre?**
Gennemsnitlig: 2–5 minutter per ordre ved scan-baseret flow med ordentlig workstation-opsætning.

**Er det nødvendigt med daglig cycle count?**
Ikke fuld optmælning dagligt – men de 5–10 SKU'er der er i planen for dagen er best practice.

**Hvord an ved man at fragtleverandøren har hæntet det rigtige antal?**
Fragtafstemning: antal scannet ud af WMS skal matche antal overleveret til fragtleverandør. Kvittering er dokumentation.
