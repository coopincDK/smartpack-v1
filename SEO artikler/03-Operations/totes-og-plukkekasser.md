---
primary_keyword: totes og plukkekasser
secondary_keywords: [tote lager, plukkekasse, sorteringskasse lager, tote system pluk]
cluster: 03-Operations
---

# Totes og plukkekasser: Vælg rigtigt og undgå sorteringsfejl

Totes og plukkekasser er de fysiske beholdere, der holder dine plukket varer adskilt og sporbare under en plukreunde. Det er et simpelt emne – men forkert valg og forkert brug fører direkte til sorteringsfejl og fejlordrer. Denne guide viser dig, hvad du skal overveje.

## Hvad er totes og plukkekasser?

En tote er en genanvendelig kasse eller kurv, der bruges til at samle varer for én eller flere ordrer under plukning. Typer:
- **Engangstote**: én ordre per tote, smides væk ved pakning (sjælden på optimerede lagre)
- **Genanvendelig tote**: rengøres og genbruges per runde, merket med ordre-id
- **Divideret plukkekasse**: én kasse opdelt i fack, hvert fack én ordre. Bruges til batchpluk

Den rigtige tote-type afhænger af batchstørrelse, ordrekompleksitet og plukkemetode.

## Hvornår er det et problem?

Totes er et problem, når:
- Plukkere blander varer fra to ordrer i samme tote
- Totes er for store til at holde adskilt, eller for små til ordreindholdet
- Ingen scanningssystem for tote-til-ordre-mapping
- Totes er umulige at stable og fylder al gang-plads

## Hvorfor er det vigtigt? (tal)

- En forkert sorteret tote = én fejlordre = ~350 kr. direkte
- Batchpluk med 8-16 ordrer er umuligt uden systematisk tote-håndtering
- Sorteringsfejl ved batchpluk er typisk 5-10x hyppigere ved dårlig tote-praksis vs. god
- Et korrekt tote-system er forudsætningen for skalerbart batchpluk

## Trin-for-trin: Vælg og implementér korrekt tote-system

### Trin 1: Vurdér din batchstørrelse og ordrekompleksitet
- 1-4 ordrer per batch: standard tote per ordre, farve-kodet per zone
- 4-8 ordrer per batch: dividerede totes med 4-8 fack
- 8-16 ordrer per batch: tote-vogn med nummererede slots

### Trin 2: Vælg tote-type
Nøgle-faktorer:
- **Størrelse**: skal rumme den gennemsnitlige ordre med plads til emballage-sikkerhed
- **Stabilitet**: kan stables uden at vælte; vigtig ved tote-vogn-systemer
- **Scannabilitet**: toten skal have en synlig stregkode eller RFID-tag
- **Holdbarhed**: genanvendelige totes skal tåle 5-10 år daglig brug

### Trin 3: Implementér tote-til-ordre-scanning
Inden den første vare lægges i toten: scan toten → scan ordren → systemet mapper dem. Alle efterfølgende varer scannes mod ordren, ikke mod toten.

Ved fejl (forkert vare forsøgt lagt i tote): systemet stopper og advarer.

### Trin 4: Definer max-kapacitet per tote
Aldrig overfyld en tote. Definer max-kapacitet baseret på gennemsnitlig ordrestørrelse og standardiser det. Overfyldte totes skaber skader og sorteringsfejl.

### Trin 5: Etablér tote-reset-procedure
Efter pakning: tote tømmes, scannes som tom og returneres til plukkestationen. Ingen tote genbruges med rester fra foregående ordre.

### Trin 6: Vedligehold og rengør totes regelmæssigt
Beskadigede, snavsede eller ulæsbare totes skal identificeres og udskiftes. Ugentlig visuel inspektion.

## Typiske fejl

**Fejl 1: Ingen mapping af tote til ordre**
Plukkere husker selv, hvad der er hvad. Virker for 2 ordrer, kollapser totalt ved 12.

**Fejl 2: Alle ordrer i én stor tote "for at spare tid"**
Én stor tote med 8 ordres varer er en sorteringsnightmare ved pakkebordet.

**Fejl 3: For store totes til sortimentet**
Totes der er for store tillader varer at flytte rundt under transport – skaber skade og fejl.

**Fejl 4: Totes genbruges med rester**
En tote med én vare fra forrige ordre der ikke blev opdaget er en fejlordre under opbygning.

## Sådan gør du det rigtigt

**1. Farvekod totes til sorteringszoner**
Rød tote = ekspress, grøn tote = standard, gul tote = udland. Visuel sortering understøtter systemet.

**2. Scan altid tote ved start og slut**
Scan ved start (tote til ordre-mapping), scan ved aflevering til pakkebordet (bekræft at alle varer er modtaget). To scanpunkter = dobbelt kontrol.

**3. Hav 20-30% ekstra totes som buffer**
Totes skadet, reparation, misplacering – altid have 20-30% over teoretisk behov til rådighed.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Vælg tote-type baseret på batchstørrelse og ordrekompleksitet
- [ ] Implementér tote-til-ordre-scanning som systemkrav
- [ ] Definer max-kapacitet per tote
- [ ] Etablér tote-reset-procedure ved pakning
- [ ] Farvekod totes til sorteringszoner
- [ ] Planlæg ugentlig inspektion

**Næste skridt**: Læs guiderne om batch picking og sorteringszoner for at maksimere effekten af tote-systemet.

## SmartPack understøttelse

SmartPack's tote-modul mapper automatisk tote-id til ordre-id ved scanning. Systemet validerer, at alle ordrevarer er i toten inden den frigives til pakkebordet, og markerer toten som aktiv/ledig i realtid.

## FAQ

**Hvad er en tote?**
En genanvendelig kasse eller kurv der bruges til at samle og adskille varer per ordre under plukning.

**Hvornår bruger man dividerede totes?**
Ved batchpluk af 4-8 ordrer med 1-3 varer per ordre. Dividerede totes holder ordrer adskilt fysisk.

**Hvad sker der, hvis varer blandes fra to ordrer i en tote?**
Det er en fejlordre ved pakning, med risiko for forsendt fejlpakke. Tote-til-ordre-scanning forhindrer dette.

**Kan man bruge plastikposer frem for totes?**
Kun til meget lette, enkle ordrer. Poser kan ikke scannes og er ikke genanvendelige. Totes er standard ved ethvert volumen over 50 ordrer/dag.

**Hvad koster et tote-system?**
En genanvendelig tote koster 50-150 kr. pr. stk. Et lager med 50 aktive totes koster 2.500-7.500 kr. i initialtinvestering. Afkastet i reducerede sorteringsfejl er typisk under 1 uge.

