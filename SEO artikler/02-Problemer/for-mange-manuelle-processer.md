---
primary_keyword: manuelle processer lager
secondary_keywords: [automatisering lager, digitalisering lagerstyring, manuel fejl lager, lager effektivisering]
cluster: 02-Problemer
---

# Manglende processer – når hver medarbejder gør det på sin måde

Ny medarbejder starter. Du siger: "Pluk de ordrer der står på listen."

Han spørger: "Hvilken rækkefølge?"
Du: "Ligemeget."

Han spørger: "Hvad hvis varen ikke er der?"
Du: "Spørg mig."

Han spørger: "Scanner jeg?"
Du: "Hvis du vil."

Dag 3: Han har lavet 4 fejl. Det er ikke hans skyld. I har ingen processer.

Cost: 4 fejl × 450 kr. = 1.800 kr. på 3 dage. Ved 43% turnover gentager I det her hver 14. måned.

## Hvad mener vi med "manglende processer"?

Manglende processer betyder:
- Ingen skreven standard for hvordan pluk udføres
- Ingen tjekliste for modtagelse af varer
- Ingen procedure for fejlhåndtering
- Ingen dokumenteret rækkefølge for opgaver
- "Sådan gør vi det her" eksisterer kun mundtligt

Resultat: Hver medarbejder opfinder sin egen metode. Nogle metoder er gode. Nogle skaber fejl.

## Hvornår er det et problem?

Manglende processer er et strukturelt problem når:
- Fejlrate varierer markant mellem medarbejdere (0,5% vs. 3%)
- Nye medarbejdere lærer forskellige metoder afhængigt af hvem de følger
- Du ikke kan svare: "Hvad er vores standard for X?"
- Samme fejl sker gentagne gange
- Medarbejdere spørger dagligt: "Hvordan gør jeg...?"

## De 5 kritiske processer (prioriteret)

### 1. Plukproces (implementer DAG 1)
**Uden proces:**
- Plukker vælger selv rækkefølge
- Ingen scanning
- Fejlrate: 2,8%

**Med proces:**
1. Modtag plukliste fra WMS (sorteret efter lokation)
2. Scan hver vare
3. Systemet bekræfter korrekt vare
4. Placer i tote med ordrenummer
5. Afslut batch ved pakkestation

**Resultat:** Fejlrate 0,6%. Picks/time +25%.

### 2. Modtagelsesproces (implementer UGE 1)
1. Tjek leverance mod indkøbsordre
2. Scan hver vare ind
3. Tjek for skader
4. Placer på tildelt lokation
5. Opdater system

### 3. Returproces (implementer UGE 2)
1. Modtag retur
2. Tjek tilstand (A/B/C)
3. Beslut: Genindlæs/outlet/kassér
4. Scan ind hvis genindlæsning
5. Registrer årsag

### 4. Cycle counting (implementer UGE 3)
1. Vælg 10 SKU'er dagligt (rotation)
2. Fysisk optælling
3. Sammenlign med system
4. Ret afvigelser
5. Registrer årsag til afvigelse

### 5. Fejlhåndtering (implementer UGE 4)
1. Kunde rapporterer fejl
2. Find ordrenummer
3. Identificer årsag (forkert pluk/pak/scan)
4. Registrer i system
5. Send ny vare samme dag

**Kritisk:** Lav IKKE alle processer på én gang. Én proces per uge.

## Regnestykket: Hvad koster manglende processer?

**Scenarie: 200 ordrer/dag, ingen standardprocesser**

**Fejlomkostning:**
- Fejlrate uden proces: 2,8%
- Fejl/dag: 200 × 2,8% = 5,6 fejl
- Cost: 5,6 × 450 kr. = **2.520 kr./dag**
- **Årlig: 630.000 kr.**

**Med standardprocesser:**
- Fejlrate: 0,6%
- Fejl/dag: 200 × 0,6% = 1,2 fejl
- Cost: 1,2 × 450 kr. = **540 kr./dag**
- **Årlig: 135.000 kr.**

**Besparelse: 495.000 kr./år**

**Tid til at skrive processer: 8 timer = 1.600 kr.**
**ROI: 1,2 dage**

## Hvad sker der i praksis

Tre plukkere. Tre metoder:

**Plukker A:** Scanner hver vare. Fejlrate 0,4%.
**Plukker B:** Scanner kun ved tvivl. Fejlrate 1,8%.
**Plukker C:** Scanner aldrig. Fejlrate 4,2%.

Ingen standard. Ingen ved hvem der gør det rigtigt. Ny medarbejder følger Plukker C. Lærer forkert metode.

## Typiske fejl

**1. "Vi er for små til processer"**
3 medarbejdere behøver processer mere end 30. Mindre team = større effekt af én persons fejl.

**2. Skrive 50-siders manual**
Processer skal være én A4 per proces. Lamineret. På væggen. Ikke i en mappe.

**3. Lave processer uden at håndhæve dem**
Proces på væggen hjælper ikke hvis ingen følger den. Tjek dagligt: Følges processen?

**4. Aldrig opdatere processer**
Processer skal opdateres når de ikke virker. Kvartalsvis gennemgang.

## Sådan gør du det rigtigt

**1. Start med plukproces (dag 1)**
- Skriv 5 trin for hvordan en ordre plukkes
- Laminer A4
- Hæng ved pakkestation
- Alle skal følge den fra i morgen

**2. Tilføj én proces per uge**
Uge 1: Pluk. Uge 2: Modtagelse. Uge 3: Retur. Uge 4: Cycle count.

**3. Mål effekten**
Fejlrate før/efter. Picks/time før/efter.

**4. Involver medarbejdere**
Spørg: "Hvad virker? Hvad virker ikke?" Opdater processer baseret på feedback.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Identificer de 5 mest kritiske processer
- [ ] Skriv plukproces på én A4
- [ ] Laminer og hæng ved pakkestation
- [ ] Tjek dagligt: Følges processen?
- [ ] Mål fejlrate før/efter
- [ ] Tilføj næste proces næste uge

**Næste skridt:** Læs "Ingen standarder på lageret" og "Dårlig onboarding" for implementering.

## SmartPack understøttelse

SmartPack bygger processer ind i systemet. Plukker kan ikke afslutte ordre uden at scanne. Modtagelse kræver scanning. Returproces guider trin-for-trin. Systemet håndhæver processen – ikke lagerchefen.

## FAQ

**Hvor lange skal processer være?**
Én A4. 5-10 trin. Hvis længere: opdel i to processer.

**Hvad hvis medarbejdere ikke følger processerne?**
Spørg hvorfor. Hvis processen er dårlig: ret den. Hvis medarbejder ignorerer: håndhæv.

**Skal vi dokumentere ALT?**
Nej. Start med de 5 kritiske. Resten kan vente.

**Hvordan måler vi om processer virker?**
Fejlrate per medarbejder. Hvis alle har samme lave fejlrate: Processen virker.

**Hvad hvis processer bremser os?**
Gode processer øger hastighed. Hvis proces sænker: Den er forkert designet.
