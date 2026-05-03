# GODKENDT — 03-OPERATIONS
**Dato:** 2025-01-XX  
**Analyseret:** 20 artikler  
**Godkendt:** 12/20 (60%)

---

## ✅ GODKENDTE ARTIKLER

### 1. abc-analyse-trin-for-trin.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Konkret: 110 picks/time, 20% SKU = 80% salg, 90 dages data
- Økonomi: 48 picks frigjort = 30 min/dag
- Cycle counting: A månedligt, B kvartalsvis, C årligt ✓
- Handling: 7-trins tjekliste, formel for refill limit

**Micro improvements:**
- Tilføj konkret eksempel: "Lager med 500 SKU'er, 300 ordrer/dag: flyt 20 A-varer = 2 timer/uge sparet"
- Udvid Golden Zone definition med foto/diagram reference

---

### 2. batch-picking-guide.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI 10/10 | Konvertering 9/10

**Styrker:**
- Konkret: 110 picks/time (SmartPack), 102 (industri), TSP-algoritmer
- Økonomi: 26.000 kr./år per medarbejder, ROI under 12 måneder
- Edge cases: Scenarie 1-4 med konkrete fejl
- Handling: Batchstørrelse per volumen, 8-16 ordrer

**Micro improvements:**
- Tilføj tabel: batchstørrelse vs. ordrekompleksitet
- Præciser: "TSP reducerer gangtid 40-60% vs. usorteret liste"

---

### 3. bundles-håndtering.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Bundle-regel: ALDRIG modtag bundle-SKU direkte — modtag komponenter ✓
- Konkret: BOM-definition, virtuel vs. fysisk kit
- Økonomi: 350 kr. per fejlordre
- Handling: 6-trins tjekliste, klar opdeling

**Micro improvements:**
- Tilføj konkret eksempel: "Startpakke (A+B+C): modtag 50× A, 50× B, 50× C — IKKE 50× bundle-SKU"
- Udvid med edge case: "Hvad sker der hvis komponent A løber tør men B+C er på lager?"

---

### 4. cycle-counting-guide.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Cycle counting: A månedligt, B kvartalsvis, C årligt ✓
- Konkret: 3-4 SKU'er/dag, 99%+ nøjagtighed
- Økonomi: 350 kr. per fejl
- Handling: 7-trins implementering

**Micro improvements:**
- Tilføj konkret eksempel: "200 SKU'er: 40 A (2/dag), 60 B (1/dag), 100 C (0,4/dag) = 3-4 SKU'er/dag"
- Præciser: "Afvigelse over 5% = obligatorisk årsagsundersøgelse"

---

### 5. håndtering-af-plukfejl.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Konkret: 3 scenarier, 0,5% fejlrate med scanning
- Økonomi: 350 kr. direkte, 450-850 kr. inkl. LTV
- Edge: Opdagelse ved pluk/pakning/kunde — forskellige omkostninger
- Handling: 3 scenarier med reaktion

**Micro improvements:**
- Tilføj: "Top 3 fejl-SKU'er = 60% af alle fejl — fix disse først"
- Udvid scenarie 3 med konkret kundeservice-script

---

### 6. optimer-pakkebord.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI 8/10 | Konvertering 8/10

**Styrker:**
- Pakker/time: 40 (pak-benchmark) ✓
- Konkret: Alt inden for rækkevidde, 5S-metodologi
- Økonomi: 350 kr. per pakkefejl
- Handling: 7-trins optimering

**Micro improvements:**
- Tilføj konkret layout-diagram reference
- Præciser: "Emballagehentning 1-2 min × 20 ordrer/dag = 40 min spildt"

---

### 7. plukkeprofiler-korrekt-opsat.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Picks/time: 110 (SmartPack), 102 (industri) ✓
- Konkret: Batchstørrelse per volumen, TSP-algoritmer
- Handling: Profil per ordretype, automatisk valg

**Micro improvements:**
- Tilføj tabel: ordretype → anbefalet profil
- Præciser: "Hasteoordre i standardbatch = 45 min forsinkelse"

---

### 8. reducer-gangtid.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Picks/time: 110 (SmartPack), 102 (industri 2025) ✓
- Konkret: 50-60% af plukketid, TSP reducerer 20-35%
- Handling: 7-trins reduktion, S-form vs. U-form

**Micro improvements:**
- Tilføj konkret eksempel: "A-vare flyttet fra 20m til 5m = 30 sek/pick × 80 picks/dag = 40 min sparet"
- Diagram: S-form vs. U-form rute

---

### 9. serienummer-tracking.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI 9/10 | Konvertering 7/10

**Styrker:**
- Konkret: Under 2 min look-up, scanning ved modtagelse + pluk
- Økonomi: 1.000-5.000 kr. for højværdi-fejl
- Handling: 6-trins implementering

**Micro improvements:**
- Tilføj konkret use case: "Elektronik-lager med 500 enheder/måned: serienummer-tracking = 12 timer/måned sparet i garantihåndtering"
- Præciser: "Batch-scan ved modtagelse: 50 enheder på 10 min"

---

### 10. sådan-laver-du-abc-analyse.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 8/10

**Styrker:**
- Picks/time: 110 (SmartPack), 70-102 (uoptimeret) ✓
- Konkret: 90 dages data, 20% SKU = 70-80% pluk
- Økonomi: 25-40% kapacitetsforbedring
- Handling: 6-trins gennemførelse

**Micro improvements:**
- Tilføj konkret eksempel: "500 SKU'er → 50-100 A-varer, 100-150 B-varer, 250-300 C-varer"
- Præciser: "Flyt top 20 A-varer = 80% af gevinsten"

---

### 11. sådan-reducerer-du-plukketid.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI 9/10 | Konvertering 9/10

**Styrker:**
- Picks/time: 110 (SmartPack), 102 (industri 2025) ✓
- Konkret: 8% kapacitetsgevinst, TSP-algoritmer
- Økonomi: 350 kr. per fejl, 850 kr. inkl. LTV
- Handling: 7-trins reduktion

**Micro improvements:**
- Tilføj konkret eksempel: "300 ordrer/dag, 2 picks/ordre = 600 picks. 102 → 110 picks/time = 45 min/dag sparet"
- Præciser: "Gangtid = 50-60% af total plukketid — optimer her først"

---

### 12. sådan-undgår-du-pakkefejl.md
**Score:** Troværdighed 10/10 | Praktisk 10/10 | AI 10/10 | Konvertering 10/10

**Styrker:**
- Pakker/time: implicit via 40 pakker/time reference
- Konkret: 3% → 0,5% fejlrate, 83% reduktion
- Økonomi: 350 kr. direkte, 7,57 mio. kr./år ved 500 ordrer/dag
- Edge: Scenarie 1-3 med konkrete fejl, vikarer 5-8× højere fejlrate
- Handling: 7-trins eliminering, dobbelt scanning

**Micro improvements:**
- Perfekt artikel — ingen kritiske ændringer
- Overvej: tilføj video-reference til scanning-procedure

---

## FÆLLES STYRKER PÅ TVÆRS

✅ **Konkrete tal:** Alle artikler har picks/time, pakker/time eller cycle counting-frekvens  
✅ **Økonomi:** Alle har kr./fejl eller kr./år  
✅ **Handling:** Alle har tjekliste eller trin-for-trin  
✅ **Edge cases:** De fleste har scenarier hvor det går galt  
✅ **SmartPack-specifikt:** Alle nævner SmartPack-tal (110 picks/time, 40 pakker/time)

---

## NÆSTE SKRIDT

1. Implementer micro improvements på godkendte artikler
2. Gennemgå afviste artikler med Reality Enforcer
3. Publicer godkendte artikler
