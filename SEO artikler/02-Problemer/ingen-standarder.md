---
primary_keyword: ingen standarder lager
secondary_keywords: [lager standardisering, kvalitetssikring lager, lager procedurer, konsistens lager]
cluster: 02-Problemer
---

# Ingen standarder på lageret – når hver dag er forskellig

Mandag: Plukker A scanner alle varer. Fejlrate: 0,4%.
Tirsdag: Plukker B scanner kun ved tvivl. Fejlrate: 1,8%.
Onsdag: Plukker C scanner aldrig. Fejlrate: 4,2%.

Ingen standard. Ingen ved hvem der gør det rigtigt.

Ny medarbejder starter torsdag. Følger Plukker C. Lærer forkert metode. Fejlrate: 4,5%.

Cost: 200 ordrer/dag × 4,5% fejl × 450 kr. = 4.050 kr./dag = 1.012.500 kr./år.

Dette er prisen for ingen standarder.

## Hvad mener vi med "ingen standarder"?

Ingen standarder betyder:
- Ingen skreven procedure for pluk
- Ingen kvalitetskrav
- Ingen mål for picks/time
- Hver medarbejder gør det på sin måde
- "Sådan gør vi det her" eksisterer kun mundtligt

## Hvornår er det et problem?

Ingen standarder er et problem når:
- Fejlrate varierer 5x mellem medarbejdere
- Picks/time varierer 3x mellem medarbejdere
- Nye medarbejdere lærer forskellige metoder
- Du ikke kan svare: "Hvad er vores standard?"
- Kvalitet afhænger af hvem der arbejder

## De 5 kritiske standarder (prioriteret)

### 1. Plukstandard (implementer DAG 1)
**Standard:**
1. Modtag plukliste fra WMS
2. Scan hver vare
3. Placer i tote med ordrenummer
4. Afslut batch ved pakkestation
5. Scan afslutning

**Mål:** Fejlrate under 1%. Picks/time over 90.

### 2. Pakkestandard (implementer UGE 1)
**Standard:**
1. Tjek ordre mod plukliste
2. Scan hver vare
3. Emballage baseret på størrelse
4. Scan forsendelseslabel
5. Placer ved afsendelse

**Mål:** Pakkefejl under 0,5%.

### 3. Modtagelsesstandard (implementer UGE 2)
**Standard:**
1. Tjek leverance mod indkøbsordre
2. Scan hver vare ind
3. Tjek for skader
4. Placer på tildelt lokation
5. Opdater system

**Mål:** Modtagelsesfejl under 1%.

### 4. Returstandard (implementer UGE 3)
**Standard:**
1. Modtag retur
2. Tjek tilstand (A/B/C)
3. Scan ind hvis genindlæsning
4. Registrer årsag
5. Trigger refundering

**Mål:** Retur håndteret inden for 24 timer.

### 5. Kvalitetsstandard (implementer UGE 4)
**Standard:**
- Fejlrate under 1%
- Picks/time over 90
- Pakkefejl under 0,5%
- Cutoff-overholdelse 98%+

**Mål:** Alle medarbejdere opfylder standard.

## Regnestykket: Hvad koster ingen standarder?

**Scenarie: 200 ordrer/dag, ingen standarder**

**Fejlomkostning:**
- Gennemsnitlig fejlrate: 2,8% (varierer 0,4%-4,5%)
- Fejl/dag: 200 × 2,8% = 5,6
- Cost: 5,6 × 450 kr. = **2.520 kr./dag**
- **Årlig: 630.000 kr.**

**Ineffektivitet:**
- Gennemsnitlig picks/time: 75 (varierer 60-95)
- Optimal picks/time med standard: 95
- Ekstra tid: (1.250 picks / 75) - (1.250 / 95) = 3,5 timer/dag
- Cost: 3,5 timer × 200 kr. = **700 kr./dag**
- **Årlig: 175.000 kr.**

**Total cost: 805.000 kr./år**

**Med standarder:**
- Fejlrate: 0,8%
- Picks/time: 95
- Cost: 160.000 kr./år

**Besparelse: 645.000 kr./år**

## Hvad sker der i praksis

Tre plukkere. Tre metoder. Ingen standard.

Plukker A: Erfaren. Scanner alt. Fejlrate 0,4%. Picks/time 95.
Plukker B: Mellem. Scanner ved tvivl. Fejlrate 1,8%. Picks/time 82.
Plukker C: Ny. Scanner aldrig. Fejlrate 4,2%. Picks/time 68.

Ingen ved hvem der gør det rigtigt. Ingen standard at måle imod.

Ny medarbejder følger Plukker C. Lærer forkert metode. Problemet forværres.

## Typiske fejl

**1. "Vi er for små til standarder"**
3 medarbejdere behøver standarder mere end 30. Mindre team = større effekt af én persons fejl.

**2. Skrive 50-siders manual**
Standarder skal være én A4 per proces. Lamineret. På væggen.

**3. Lave standarder uden at håndhæve**
Standard på væggen hjælper ikke hvis ingen følger den.

**4. Aldrig opdatere standarder**
Standarder skal opdateres når de ikke virker. Kvartalsvis gennemgang.

## Sådan gør du det rigtigt

**1. Skriv plukstandard (dag 1)**
- Én A4 med 5 trin
- Laminer
- Hæng ved pakkestation
- Alle skal følge fra i morgen

**2. Definer mål (dag 1)**
- Fejlrate: Under 1%
- Picks/time: Over 90
- Pakkefejl: Under 0,5%

**3. Mål dagligt (fra dag 1)**
- Fejlrate per medarbejder
- Picks/time per medarbejder
- Hvem opfylder standard?

**4. Håndhæv (fra dag 1)**
- Medarbejder scanner ikke? Ret det samme dag.
- Fejlrate over 2%? Find årsag, træn.

**5. Opdater kvartalsvis**
Spørg: Virker standarden? Hvad skal ændres?

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Skriv plukstandard på én A4
- [ ] Definer mål (fejlrate, picks/time)
- [ ] Laminer og hæng ved pakkestation
- [ ] Mål fejlrate per medarbejder dagligt
- [ ] Håndhæv standard fra dag 1
- [ ] Opdater kvartalsvis

**Næste skridt:** Læs "Manglende processer" og "Dårlig onboarding" for fuld implementering.

## SmartPack understøttelse

SmartPack bygger standarder ind i systemet:
- Plukker SKAL scanne (kan ikke afslutte uden)
- Systemet viser: Fejlrate per medarbejder realtid
- Dashboard: Hvem opfylder standard?
- Alarm hvis fejlrate > 2%

Resultat: Standard håndhæves automatisk.

## FAQ

**Hvor lange skal standarder være?**
Én A4. 5-10 trin. Hvis længere: Opdel i to standarder.

**Hvad hvis medarbejdere ikke følger standard?**
Spørg hvorfor. Hvis standard er dårlig: Ret den. Hvis medarbejder ignorerer: Håndhæv.

**Skal vi dokumentere ALT?**
Nej. Start med de 5 kritiske. Resten kan vente.

**Hvordan måler vi om standarder virker?**
Fejlrate per medarbejder. Hvis alle har samme lave fejlrate: Standarden virker.

**Hvad hvis standarder bremser os?**
Gode standarder øger hastighed. Hvis standard sænker: Den er forkert designet.
