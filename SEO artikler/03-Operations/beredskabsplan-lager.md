---
primary_keyword: beredskabsplan lager
secondary_keywords: [nødplan lager, lager kontinuitet, kriseberedskab lager, lager backup plan]
cluster: 03-Operations
---

# Beredskabsplan for lager: Hvad gør du, når systemet, folk eller varer svigter?

Et lager uden en beredskabsplan stopper, når noget uventet sker. En planlægger, der er syg. Et system der er nede. En leverandør der ikke leverer. Denne guide viser dig, hvordan du bygger en beredskabsplan, der holder driften kørende under afvigelser.

## Hvad er en beredskabsplan for lager?

En beredskabsplan er en dokumenteret samling af procedurer for, hvad der sker, når de normale driftsforudsætninger ændres. Den dækker:
- IT-systemnedfall (WMS, scanner, internet)
- Personalemangel (sygdom, fravær, turnover)
- Forsyningsproblemer (leverandørforsinkelse, stockout)
- Fysiske hændelser (brand, vandskade, indbrud)
- Fejl i ordresystemet (forkerte ordrer, duplikater)

## Hvornår er det et problem?

Beredskab mangler, når:
- Ingen ved, hvad der skal ske ved systemnedfall
- Én nøglemedarbejders fravær stopper en hel proces
- Ingen backup-procedure eksisterer for scanning
- Kritiske leverandørers kontaktinformation ikke er dokumenteret

## Hvorfor er det vigtigt? (tal)

- En times WMS-nedetid ved 300 ordrer/dag = ca. 40 mistede pakker per time × 40 kr. ordrebehandlingsomkostning = 1.600 kr./time direkte tab
- Systemnedetid der fører til forsinkede leverancer koster ~350 kr. per fejlordre + LTV-tab
- Virksomheder med dokumenterede beredskabsplaner genvinder drift **3-5x hurtigere** end dem uden

## Trin-for-trin: Byg din beredskabsplan

### Trin 1: Kortlæg kritiske afhængigheder
Identificér alle processer og hvad de er afhængige af:
- WMS-system
- Internetforbindelse
- Scannere og hardware
- Specifikke nøglemedarbejdere
- Leverandører af A-varer
- Fragtfirmaer

### Trin 2: Definer beredskab per afhængighed

**WMS-nedetid**:
- Manuel plukliste procedure (udskriv de 20 mest frekvente ordrer til papirformat)
- Offline scanning-protokol
- Kontakt til SmartPack support med prioriteringsnummer

**Scannere defekte**:
- Reservescannere på lager (minimum 1 per 3 aktive)
- Nødprocedure for manuel picking med check-liste

**Internetnedfall**:
- Offline-mode i SmartPack aktiveres automatisk
- Synkronisering ved genoprettet forbindelse

**Personalemangel**:
- Vikar-kontaktliste opdateret og tilgængelig
- Prioriteret ordreliste: hasteleverancer og A-ordrer først
- Krydsoplæring: minimum 2 medarbejdere kan udføre alle kritiske processer

**Leverandørforsinkelse**:
- Alternative leverandører kortlagt for alle A-varer
- Sikkerhedslager for kritiske SKU'er

### Trin 3: Dokumentér alle kontaktpersoner
Samlet kontaktliste med:
- IT-support (WMS, internet, hardware)
- Fragtfirmaer (primær og backup)
- Nøgle-leverandører
- Vikarbureauer
- Lageransvarlig og backup-lageransvarlig

### Trin 4: Test beredskabsplanerne
Gennemfør mindst én bordsøvelse halvårligt: "WMS er nede i 2 timer – hvad gør vi?" Involver teamet. Identificér huller i planen.

### Trin 5: Opbevar planen fysisk og digitalt
Beredskabsplanen skal:
- Være trykt og tilgængeligt i lagerkontoret
- Ikke kun eksistere i det system der er nede

## Typiske fejl

**Fejl 1: Beredskabsplan eksisterer kun digitalt i det system der fejler**
Hvis WMS er nede og beredskabsplanen kun er i WMS, har du ingen plan.

**Fejl 2: Ingen krydsoplæring**
Én person kender ét system. Når de er syge, er processen stoppet. Krydsoplæring er ikke luxury.

**Fejl 3: Planen opdateres ikke**
En beredskabsplan fra 2021 med kontakter der er holdt op, er ikke brugbar.

**Fejl 4: Aldrig testet**
En utestet plan har ukendte huller. Test afslører problemer, inden de opstår i virkeligheden.

## Sådan gør du det rigtigt

**1. Prioritér ordrer i krisescenarier**
Når kapaciteten er reduceret: prioritér hasteleverancer og de mest profitable/loyale kunder. Definér prioriteringskriterierne på forhånd.

**2. Kommunikér proaktivt ved forsinkelse**
En kunde der modtager en forsinkelsesadvarsel inden den forventede leveringsdato er langt mere tilgivende end en der ikke hører noget.

**3. Brug SmartPack's offline-mode**
SmartPack's offline-kapabilitet sikrer, at scanning og ordreregistrering fortsætter ved internetnedfall med automatisk synkronisering.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Kortlæg alle kritiske afhængigheder
- [ ] Skriv beredskabsprocedure for WMS, scanner, internet og personalemangel
- [ ] Dokumentér alle nøgle-kontakter
- [ ] Sikr krydsoplæring på alle kritiske processer
- [ ] Test planen halvårligt med bordsøvelse
- [ ] Opbevar planen trykt i lagerkontoret

**Næste skridt**: Læs guiderne om standardisering og onboarding for at minimere sårbarhed over for personalemangel.

## SmartPack understøttelse

SmartPack indeholder offline-mode der automatisk aktiveres ved internetnedfall. Systemet synkroniserer ved genoprettet forbindelse. Support-prioritetsnummer og live driftsstatus er tilgængeligt direkte i dashboardet. "Lager alerts" advarer proaktivt ved systemanomalier.

## FAQ

**Hvad skal en beredskabsplan for lager indeholde?**
Procedurer for WMS-nedetid, personalemangel, leverandørforsinkelse og fysiske hændelser – plus kontaktlister og prioriteringsregler for reduceret kapacitet.

**Hvad gør jeg, hvis WMS er nede?**
Aktivér manuel plukliste-procedure, brug offline scanning-protokol og kontakt support. Hav en udskrevet manual plukliste klar som nødberedskab.

**Hvornår bør beredskabsplanen testes?**
Minimum halvårligt med en bordsøvelse. Vigtigst: inden den travle sæson.

**Hvad er krydsoplæring?**
At oplære minimum to medarbejdere i hver kritisk proces, så fraværet af én person ikke stopper en hel funktion.

**Kan jeg stole på, at SmartPack aldrig har nedetid?**
SmartPack er designet til høj tilgængelighed, men ingen systemer er 100% fejlfrie. Offline-mode og manuel nødprocedure er altid tilgængelige som backup.

