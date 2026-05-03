---
primary_keyword: sorteringszoner lager
secondary_keywords: [sorteringszone forklaret, lager sortering, order sorting, and-logik zone]
cluster: 03-Operations
---

# Sorteringszoner forklaret: AND-logik, prioritetsrækkefølge og korrekt opsætning

Sorteringszoner er hjertet i et velordnet lager ved højt ordrevolumet. De afgør, hvilken kurv, tote eller transportør en vare ender i – og en forkert opsætning kan sende pakker til de forkerte kunder. Denne guide forklarer logikken bag sorteringszoner og viser dig, hvordan du opsætter dem korrekt.

## Hvad er sorteringszoner?

Sorteringszoner er logiske regler i dit WMS, der bestemmer, hvortil en plukket vare sorteres: i hvilken tote, til hvilken pakkestation, til hvilket forsendelsesområde eller fragtfirma. En zone defineres ved et sæt betingelser, og **AND-logik** bruges: en vare tilhører en zone, kun hvis ALLE betingelser er opfyldte.

Eksempel: Zone "Ekspress": betingelse 1 = forsendelsestype er ekspress OG betingelse 2 = destination er DK. Begge skal være sande.

## Hvornår er det et problem?

Sorteringszoner er et problem, når:
- Varer sorteres tilfældigt og ordrer samles manuelt
- Ekspresleverancer blandes med standardleverancer i samme sorteringsflow
- B2B- og D2C-ordrer behandles identisk selvom de kræver forskellig emballage
- Fejlsortering opdages først ved pakning – for sent

## Hvorfor er det vigtigt? (tal)

- En fejlsorteret ordre er enten en forsinket ordre eller en fejlordre – begge koster ~350 kr. direkte
- Korrekt sorteringszoneopbygning er forudsætning for effektiv zone picking og batch picking ved >200 ordrer/dag
- AND-logik eliminerer dobbelttilhørsforhold og prioritetskonflikter

## Trin-for-trin: Opsæt sorteringszoner korrekt

### Trin 1: Identificér dine sorteringsdimensioner
Hvad styrer, hvordan en ordre skal sorteres? Typiske dimensioner:
- Forsendelsestype (standard, ekspress, same-day)
- Destination (indland, udland, zone)
- Fragtfirma (PostNord, GLS, DHL)
- Ordretype (D2C, B2B, abonnement)
- Særlig håndtering (fragil, køl, oversized)

### Trin 2: Definer zoner med AND-logik
For hver zone, skriv alle betingelser op som AND-udtryk:

Zone "A – Ekspress DK":
- Forsendelsestype = Ekspress AND
- Destination = Danmark AND
- Fragil = Nej

Zone "B – Standard DK":
- Forsendelsestype = Standard AND
- Destination = Danmark

Alle betingelser i en zone skal være opfyldt for at varen tilhører zonen.

### Trin 3: Definér prioritetsrækkefølge
Hvad sker der, hvis en vare kan tilhøre to zoner? Prioritetsrækkefølgen afgør det:
1. Ekspress-zoner har altid højeste prioritet
2. Fragil-zoner prioriteres over standard
3. Udlandszoner prioriteres over indlandszoner (pga. toldpapirer)

Sæt prioritetsrækkefølgen eksplicit i systemet.

### Trin 4: Tildel fysiske sorteringspladser
Hver zone skal have en tydelig fysisk sorteringsplads:
- Farve-kodet tote eller kurv
- Zone-label synlig fra begge sider
- Placeret logisk i pakkeareans flow

### Trin 5: Konfigurér i SmartPack
Opret zoner i SmartPack's sorteringsmodul med de definerede AND-betingelser og prioritetsrækkefølge. Test med 20-30 ordrer inden fuld udrulning.

### Trin 6: Træn medarbejderne
Alle plukkere og pakkemedarbejdere skal forstå zone-logikken:
- Hvilke farver svarer til hvilke zoner
- Hvad sker ved tvivl om zonestilhørsforhold
- Hvem kontaktes ved fejlsortering

## Typiske fejl

**Fejl 1: OR-logik brugt frem for AND-logik**
Hvis en vare tilhører en zone, hvis EN af betingelserne er sand, opstår massivt overlapsproblem. Brug altid AND.

**Fejl 2: Ingen prioritetsrækkefølge**
Zoner uden prioritet skaber konflikter, der kan resultere i tilfældig sortering.

**Fejl 3: For mange zoner**
10+ sorteringszoner er næsten umulige at administrere manuelt og forvirrer medarbejderne. Start med 3-5 klart definerede zoner.

**Fejl 4: Fysiske sorteringspladser er ikke markerede**
Et perfekt logisk system der kollapser, fordi medarbejderne ikke ved, hvilken kurv der er hvilken zone.

## Sådan gør du det rigtigt

**1. Start simpelt og tilføj zoner ved behov**
3 zoner (ekspress, standard, udland) dækker de fleste simple lagre. Tilføj kun kompleksitet, når du har et specifikt problem at løse.

**2. Test nye zoner med 30 ordrer inden udrulning**
Fejl i zone-logik er svære at opdage uden test. 30 testsordrer afslører de fleste kantcases.

**3. Publicér zoneoversigt til alle medarbejdere**
En lamineret zoneoversigt ved pakkebordet og plukkestarten sikrer, at alle kan arbejde med systemet.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Identificér dine sorteringsdimensioner
- [ ] Definer zoner med AND-logik og eksplicitte betingelser
- [ ] Fastlæg prioritetsrækkefølge
- [ ] Tildel fysiske sorteringspladser og markér dem tydeligt
- [ ] Konfigurér i SmartPack og test med 30 ordrer
- [ ] Træn alle relevante medarbejdere

**Næste skridt**: Læs guiderne om zoneopdeling og plukkeprofiler for at forbinde sorteringszoner med den bredere lagerstruktur.

## SmartPack understøttelse

SmartPack's sorteringsmodul understøtter AND-logik med eksplicitte betingelsessæt og prioritetsrækkefølge. Systemet validerer zone-tilhørsforhold ved scanning og advarer ved konflikt. Zoner kan konfigureres, testes og justeres direkte i dashboardet.

## FAQ

**Hvad er AND-logik i sorteringszoner?**
En vare tilhører en zone, kun hvis ALLE definerede betingelser for zonen er opfyldt – ingen af, mindst én af.

**Hvad sker der, hvis en ordre matcher to zoner?**
Prioritetsrækkefølgen afgør, hvilken zone der bruges. Prioritet skal eksplicit defineres i systemet.

**Hvor mange sorteringszoner bør jeg have?**
Typisk 3-5 for de fleste operationer. Over 7-8 zoner øger kompleksiteten markant uden proportional gevinst.

**Kan sorteringszoner bruges til fragtfirma-routing?**
Ja – zone-betingelser kan inkludere fragtfirma-kode, så ordrer automatisk sorteres til korrekt fragtfirma-tote.

**Hvad gør jeg, hvis en ordre ikke matcher nogen zone?**
Definer en "default"-zone der fanger alle ordrer uden specifik zone-match. Analyser disse ordrer for at forbedre zone-dækning.

