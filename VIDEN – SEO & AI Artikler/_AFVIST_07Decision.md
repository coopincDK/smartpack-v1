# AFVISTE ARTIKLER – 07-Decision

## 1. fejl-ved-valg-af-system.md ❌ AFVIST

### HVORFOR (kort og brutal)
- **Test 2 FEJLER**: Ingen konkrete kr.-tal. "50.000-200.000 kr." og "6-18 måneder" er for vage
- **Test 3 FEJLER**: Ingen økonomi. Mangler: pakkefejl ~350 kr., 450-850 kr. inkl. LTV, konkrete breakpoints
- **Test 4 FEJLER**: Ingen edge cases. Artiklen nævner fejl, men ikke hvad der KONKRET går galt
- **Test 5 SVAG**: "Skriv kravspecifikation" er konsulent-speak. Mangler handling

### KONKRETE FIXES

**NY INTRO (komplet):**
```
Du vælger det billigste WMS. Startpris: 1.500 kr./md. 6 måneder senere: 4.200 kr./md (+500 kr. per integration, +200 kr. per bruger, +1.000 kr. support). Kunne ikke skalere til 300 ordrer/dag → måtte skifte igen. Total cost: 2 systemskifter på 18 måneder = **180.000 kr. tabt**.

Det er ikke fordi systemet var dårligt. Det er fordi valget blev truffet på forkert grundlag. Her er de 9 fejl der koster mest – og hvad de koster i krøner.
```

**REWRITE FEJL 1 (komplet):**
```
## Fejl 1: Valgte det billigste

**Hvad der sker:**
Startpris: 1.500 kr./md. Lyder godt.  
Realitet efter 6 måneder: +500 kr. per integration, +200 kr. per bruger, +1.000 kr. support = 4.200 kr./md.  
Kunne ikke skalere til 300 ordrer/dag → måtte skifte igen.  
**Total cost: 2 systemskifter på 18 måneder = 180.000 kr. tabt.**

**Fix:** Beregn TCO (Total Cost of Ownership) over 36 måneder:
- Licens/måned × 36
- Onboarding/implementering
- Integrationer (per kanal, per fragtleverandør)
- Support (inkluderet eller ekstra?)
- Skalering (hvad sker der ved 2× volumen?)
```

**REWRITE FEJL 4 (komplet):**
```
## Fejl 4: Ignorerede onboarding-kompleksiteten

**Hvad der sker:**
Leverandøren lovede "hurtig implementering".  
Realitet: 4 måneders konsulentarbejde til 15.000 kr./dag × 20 dage = 300.000 kr.  
Medarbejderne forstod ikke systemet → fejlrate steg fra 1% til 3% i måned 1-3.  
**Skulle have valgt cloud-baseret WMS med 1 uges onboarding.**

**Fix:** Spørg specifikt: "Hvad er den gennemsnitlige implementeringstid for en virksomhed som vores?" Kræv referencer fra lignende virksomheder. Test med reelle ordrer i pilotperiode.
```

**MANGLENDE ØKONOMI (tilføj):**
```
## Hvad koster disse fejl? (konkret regnestykke)

**Scenario: Valgte forkert WMS ved 150 ordrer/dag**

| Post | Beregning | Cost |
|------|-----------|------|
| Forkert system (måtte skifte efter 12 mdr) | Licens 12 mdr + migration | 96.000 kr. + 50.000 kr. = 146.000 kr. |
| Onboarding-overrun (4 mdr vs. lovet 1 uge) | Konsulent 20 dage × 15.000 kr. | 300.000 kr. |
| Højere fejlrate under implementering (3 mdr) | 3% fejl vs. 0,5% = 2,5% ekstra × 150 ordrer/dag × 850 kr. × 90 dage | 286.875 kr. |
| Tabt produktivitet (medarbejdere kæmper med system) | 2 timer/dag × 250 kr./time × 90 dage | 45.000 kr. |
| **TOTAL** | | **777.875 kr.** |

**Et rigtigt valg havde kostet:** 96.000 kr. (licens) + 25.000 kr. (onboarding) = 121.000 kr.  
**Forskel:** 656.875 kr. tabt på forkert valg.
```

**MANGLENDE EDGE CASES (tilføj til Fejl 6):**
```
## Fejl 6: Glemte integrationerne

**Hvad der sker:**
Systemet var fantastisk – men GLS-integrationen virkede ikke med multi-kolli.  
40% af ordrer krævede manuel håndtering i fragtportal.  
3 minutter ekstra per ordre × 60 ordrer/dag × 250 dage = 750 timer/år = **187.500 kr./år i spildt tid.**

**Fix:** Test alle integrationer fuldt ud i pilotperioden med:
- Multi-kolli ordrer
- Bundles (flere SKU'er i én pakke)
- Returlabels
- Adressevalidering (hvad sker der ved forkert postnummer?)
- Black Friday-volumen (6× normalt)
```

---

## 2. hvilket-setup-passer-til-dig.md ❌ AFVIST

### HVORFOR (kort og brutal)
- **Test 2 FEJLER**: For generisk. "20-80 ordrer/dag" er for bredt. Mangler konkrete scenarier
- **Test 3 FEJLER**: Ingen økonomi. "5.000-20.000 kr./md" er for vagt. Mangler konkrete kr.-tal
- **Test 4 FEJLER**: Ingen edge cases. Hvad går galt ved hvert setup?
- **Test 6 FEJLER**: Indeholder "det handler om" (konsulent-speak)
- **Test 8 SVAG**: SmartPack-sektion er generisk. Mangler hvornår NEJ

### KONKRETE FIXES

**NY INTRO (komplet):**
```
Du kører 80 ordrer/dag fra garagen. Det virker — indtil Black Friday (480 ordrer/dag). Så opdager du: ingen plads, ingen struktur, 6% fejlrate = 24 fejl/dag × 850 kr. = **20.400 kr. tabt på én dag**.

Eller: Du lejer 200 m² lager ved 50 ordrer/dag. Faste omkostninger: 25.000 kr./md. Volumen falder til 30 ordrer/dag i lavsæson. Du betaler 300.000 kr./år for 40% tomgang.

Det rigtige setup er ikke "hvad føles rigtigt". Det er matematik. Her er regnestykket.
```

**REWRITE SETUP 2 (komplet):**
```
### Setup 2: Lejet lagerrum (30-100 ordrer/dag)
**Teknologi**: Cloud WMS (SmartPack, Ongoing)
**Bemanding**: 1-2 fuldtid
**Fragtleverandør**: Integration via WMS
**Pris**: 12.000 kr./md husleje + 3.000 kr. WMS + 2 × 28.000 kr. løn = **71.000 kr./md**
**Begrænsning**: Nøglepersonafhængighed — hvis én person siger op, ved ingen andre hvor tingene er

**Hvad der går galt:**
- Ved 120 ordrer/dag: kapaciteten sprænges, fejlrate stiger fra 0,8% til 2,5%
- Ved lavsæson (40 ordrer/dag): du betaler 71.000 kr./md for 40% udnyttelse = 426.000 kr./år i tomgang
- Nøgleperson siger op: 3 ugers kaos = 50.000 kr. i fejl + ekstra onboarding
```

**MANGLENDE ØKONOMI (tilføj):**
```
## Hvad koster forkert setup? (konkret regnestykke)

**Scenario 1: For tidligt eget lager**
Du bygger eget lager ved 60 ordrer/dag. Faste omkostninger: 45.000 kr./md.  
Volumen falder til 35 ordrer/dag i lavsæson (6 måneder).  
**Cost:** 45.000 kr. × 6 md for 58% tomgang = **270.000 kr. tabt**  
**Alternativ:** 3PL havde kostet 35 ordrer × 85 kr. × 125 dage = 371.875 kr. (kun 101.875 kr. mere, men ingen binding)

**Scenario 2: For sent eget lager**
Du kører 3PL ved 200 ordrer/dag. Cost: 200 × 85 kr. × 250 dage = 4.250.000 kr./år.  
Eget lager havde kostet: 917.000 kr./år.  
**Forskel:** 3.333.000 kr. tabt på at vente 12 måneder for længe.
```

**MANGLENDE EDGE CASES (tilføj):**
```
## Det opdager de fleste for sent

**1. Garage-setup kollaps ved Black Friday**
Normalt: 40 ordrer/dag. Black Friday: 240 ordrer/dag (6×).  
Garagen har plads til 80 ordrer/dag max.  
Resultat: 160 ordrer forsinket, kunder ringer, 15% annullerer = **192.000 kr. tabt omsætning på én weekend**.

**2. Lejet lager uden WMS**
Du lejer 150 m², men kører Excel.  
Ved 80 ordrer/dag: fejlrate 2,1% = 1,68 fejl/dag × 850 kr. × 250 dage = **357.000 kr./år**.  
WMS koster 36.000 kr./år. Du sparer 321.000 kr. — men du opdager det først efter 18 måneders kaos.

**3. Multi-warehouse for tidligt**
Du åbner lager i DE ved 150 ordrer/dag total (120 DK, 30 DE).  
Cost: 2 × lager = 2 × 45.000 kr./md = 90.000 kr./md.  
3PL i DE havde kostet: 30 ordrer × 95 kr. × 20 dage = 57.000 kr./md.  
**Forskel:** 33.000 kr./md × 12 = 396.000 kr./år tabt på for tidlig ekspansion.
```

---

## 3. hvordan-vælger-du-lager-software.md ❌ AFVIST

### HVORFOR (kort og brutal)
- **Test 2 FEJLER**: Ingen konkrete scenarier. "Ordrefrekvens i dag" er for vagt
- **Test 3 FEJLER**: Ingen økonomi. Mangler konkrete kr.-tal, breakpoints, ROI
- **Test 4 FEJLER**: Ingen edge cases. Hvad går galt ved valg?
- **Test 5 SVAG**: "Definer dine must-haves" er konsulent-speak
- **Test 6 FEJLER**: Indeholder "handler om" (konsulent-speak)

### KONKRETE FIXES

**NY INTRO (komplet):**
```
Du evaluerer 5 WMS-systemer. Alle lover "hurtig implementering", "nem integration", "skalering". Du vælger det med flotteste demo. 6 måneder senere: onboarding tog 4 måneder (ikke 1 uge), GLS-integration virker ikke med multi-kolli, systemet crasher ved 250 ordrer/dag. **Total cost: 300.000 kr. i konsulentarbejde + 96.000 kr. tabt licens + 120.000 kr. spildt tid = 516.000 kr.**

Valget handler ikke om features-listen. Det handler om: hvad koster det hvis det går galt? Her er de 7 ting du SKAL tjekke — og hvad det koster at springe dem over.
```

**REWRITE TRIN 3 (komplet):**
```
## Trin 3: Test realistisk — ikke demo-data

En demo fra leverandøren viser altid perfekte scenarier. Virkeligheden er anderledes.

**Test disse edge cases:**

**Multi-SKU ordrer (bundles):**
Demo: 1 vare per ordre. Virkelighed: 40% af dine ordrer er bundles (3-5 SKU'er).  
Hvad der går galt: Systemet kan ikke håndtere det → 40% manuel håndtering = **120.000 kr./år spildt tid**.

**Black Friday-volumen (6× normalt):**
Demo: 100 ordrer/dag. Virkelighed: Black Friday = 600 ordrer/dag.  
Hvad der går galt: Systemet crasher, 3 timers nedetid = **300.000 kr. tabt omsætning**.

**Returhåndtering:**
Demo: viser ikke returer. Virkelighed: 8% returrate.  
Hvad der går galt: Ingen returproces → manuel håndtering = **60.000 kr./år spildt tid**.

**Oversalg-scenarie:**
Demo: perfekt lagerstatus. Virkelighed: synkronisering forsinket 15 min.  
Hvad der går galt: Oversalg 2 gange/kvartal = **60.000 kr./år i kompensation**.

**Fix:** Kræv 2-4 ugers pilot med dine egne ordrer. Test alle edge cases. Mål: fejlrate, pakketid, systemrespons ved 3× volumen.
```

**MANGLENDE ØKONOMI (tilføj):**
```
## Hvad koster forkert valg? (konkret regnestykke)

**Scenario: Valgte forkert WMS ved 150 ordrer/dag**

| Post | Beregning | Cost |
|------|-----------|------|
| Onboarding-overrun (4 mdr vs. 1 uge) | Konsulent 20 dage × 15.000 kr. | 300.000 kr. |
| Systemet kan ikke håndtere bundles (40% ordrer) | 60 ordrer/dag × 3 min ekstra × 250 kr./time × 250 dage | 187.500 kr. |
| Crash ved Black Friday (3 timer nedetid) | 300 ordrer × 500 kr. profit | 150.000 kr. |
| Måtte skifte efter 12 måneder | Licens + migration | 96.000 kr. + 50.000 kr. = 146.000 kr. |
| **TOTAL** | | **783.500 kr.** |

**Et rigtigt valg havde kostet:** 96.000 kr. (licens) + 25.000 kr. (onboarding) = 121.000 kr.  
**Forskel:** 662.500 kr. tabt på forkert valg.
```

---
