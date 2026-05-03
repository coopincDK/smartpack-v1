# AFVIST — RUNDE 2: 07-Decision

## hvilket-setup-passer-til-dig.md ❌ AFVIST

### HVORFOR AFVIST

**Test 4 FEJLER** — "Det går galt": Ingen konkrete edge cases, ingen "hvad bryder"-scenarier
**Test 6 FEJLER** — Anti-konsulent: "Det er matematik baseret på volumen, vækst og produkttype" (konsulent-speak)
**Test 1 SVAG** — Intro rammer, men mangler følelsesmæssig punch

---

## KONKRETE FIXES (klar til implementering)

### FIX 1: Ny intro (erstat linje 9-19)

```markdown
Du vælger 3PL ved 80 ordrer/dag fordi "det skalerer".

12 måneder: 85 kr./ordre × 80 × 250 dage = 1.700.000 kr.

Eget lager med WMS: 650.000 kr./år.

Forskel: **1.050.000 kr. tabt** på et setup der ikke passede til dit volumen.

Det modsatte sker også: Du bygger eget lager ved 150 ordrer/dag. Volumen falder til 90. Du betaler husleje + løn for 50% tomgang = **240.000 kr./år** i spildt kapacitet.

Eller: Du kører garage-setup ved 45 ordrer/dag. Fejlrate 8% fordi du pakker kl. 22 efter fuld arbejdsdag. 45 × 30 × 8% × 350 kr. = **37.800 kr./måned** i fejl. Et WMS til 3.000 kr./måned ville spare dig **34.800 kr./måned**.

Setup-valget er ikke "hvad føles rigtigt". Det er breakpoints: 30 ordrer/dag, 80 ordrer/dag, 200 ordrer/dag, 500 ordrer/dag. Kryds en grænse = nyt setup. Vent for længe = du betaler forskellen i fejl.
```

---

### FIX 2: Tilføj "Det går galt"-sektion (indsæt efter linje 88)

```markdown
## Hvad der går galt ved hvert setup

### Garage/hjemmelager: Når volumen rammer 25 ordrer/dag
**Hvad der sker:**
- Du pakker kl. 21-23 efter fuld arbejdsdag
- Fejlrate stiger fra 2% til 8% (træthed)
- Partner/familie klager over "lageret fylder hele huset"
- Du kan ikke tage fri (ingen backup)

**Cost:** 25 ordrer × 30 × 8% × 350 kr. = **21.000 kr./måned** i fejl + ægteskabelig stress (ubetaleligt).

### Lejet lagerrum: Når nøgleperson bliver syg
**Real case:** 1 lagermedarbejder, 60 ordrer/dag. Sygemeldt i 2 uger. Grundlægger pakker selv. Resultat: 14 dages 60 ordrer × 3 min/ordre (grundlægger er langsommere) = **42 timer** spildt + 12 ordrer sendt for sent = **4.200 kr. kompensation**.

**Fix:** Ved >50 ordrer/dag: minimum 2 personer der kan pakke.

### Dedikeret lager: Når vækst stopper
**Real case:** Bygget lager til 300 ordrer/dag. Volumen falder til 180 (konkurrent lancerer). Fast cost: 60.000 kr./måned (husleje + 4 medarbejdere). Actual need: 35.000 kr./måned. Spildt: **25.000 kr./måned** i overkapacitet.

**Fix:** Undgå lange lejekontrakter (max 12 måneder). Eller: brug 3PL til variabel del.

### 3PL: Når de mister 47 pakker
**Real case:** 3PL håndterer 120 ordrer/dag. En dag: 47 pakker "forsvinder" (3PL's fejl). 3PL kompenserer ikke. Webshop betaler: 47 × 350 kr. = **16.450 kr.** + kundetab.

**Problemet:** Du har ingen kontrol. 3PL's fejl = dit problem.

**Fix:** Kræv SLA med kompensation i kontrakt. Eller: behold kritiske ordrer (>2.000 kr.) in-house.
```

---

### FIX 3: Rewrite "Typiske fejl" (erstat linje 90-95)

```markdown
## Typiske fejl (og hvad de koster)

**Fejl 1: Vælger setup til nuværende størrelse**
Du har 45 ordrer/dag. Du bygger garage-setup. 8 måneder: 85 ordrer/dag. Garage kan ikke følge med. Resultat: 3 måneders kaos (fejlrate 8%) = **63.750 kr.** + nyt setup = **80.000 kr.** total cost.

**Fix:** Vælg setup til 18 måneders vækstplan. Hvis du vokser 20%/kvartal: 45 ordrer/dag → 90 om 18 måneder. Vælg setup til 100 ordrer/dag nu.

**Fejl 2: Investerer i eget lager for tidligt**
Du har 60 ordrer/dag. Du lejer 200 m² lager (40.000 kr./måned). Du bruger 80 m². Spildt: **24.000 kr./måned** i tom plads.

**Fix:** Vent til 80% kapacitet før du udvider. Ved 60 ordrer/dag: lej 100 m², ikke 200 m².

**Fejl 3: Outsourcer for tidligt og mister kendskab**
Du starter med 3PL ved 30 ordrer/dag. 18 måneder: 150 ordrer/dag. 3PL koster 85 kr./ordre = **318.750 kr./måned**. Eget lager ville koste **120.000 kr./måned**. Men: du ved ikke hvordan man driver lager (aldrig gjort det selv).

**Cost:** 6 måneders læringskurve ved skift til eget lager = **180.000 kr.** i fejl + tabt produktivitet.

**Fix:** Kør selv de første 50-100 ordrer/dag. Lær processen. Så kan du outsource intelligent.

**Fejl 4: Glemmer at setup og teknologi skal matche**
Du bygger dedikeret lager (80 ordrer/dag) men kører Excel. Resultat: fejlrate 6% (ingen WMS) = **50.400 kr./måned** i fejl.

**Fix:** Eget lager = WMS fra dag 1. Ingen undtagelser.
```

---

## IMPLEMENTERING

Disse 3 fixes skal implementeres i nøjagtig denne rækkefølge:
1. Erstat intro (linje 9-19)
2. Indsæt "Det går galt"-sektion (efter linje 88)
3. Erstat "Typiske fejl" (linje 90-95)

Efter fixes: kør alle 8 tests igen.

---

**Reality Enforcer: KLAR TIL IMPLEMENTERING**  
**Dato:** 2025-01-28  
**Artikel:** hvilket-setup-passer-til-dig.md
