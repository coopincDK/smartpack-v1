# AFVISTE ARTIKLER – 04-Growth

## ❌ AFVIST: hvornår-automatisering-giver-mening.md
**Hvorfor:** Encoding-problemer (Ã¥/Ã¸/Ã¦), breakpoints nævnt men ikke konsistent brugt, mangler Black Friday 6× reference, duplikeret indhold (punkt 1-3 gentages).

**Konkrete fixes:**

### NY INTRO (komplet):
```markdown
For tidlig automatisering binder 2-10 mio. kr. i udstyr der står stille halvdelen af året. For sen automatisering betyder du betaler 700.000 kr./år ekstra i lønomkostninger du kunne have automatiseret væk. Ved 200 ordrer/dag er WMS nok. Ved 500 ordrer/dag begynder hardware at give ROI. Ved Black Friday (6× volumen) er automatisering forskellen mellem 12 vikarer der laver fejl og et system der skalerer.
```

### REWRITE: "Hvorfor det er vigtigt – i kroner" (komplet):
```markdown
## Hvorfor det er vigtigt – i kroner

Automatisering giver ROI ved **konkrete volumen-breakpoints**:

**Ved 200 ordrer/dag:**
- Manuel drift: 3 plukkere × 200 kr./time × 2.000 timer/år = 1.200.000 kr./år
- WMS-optimering (niveau 1): Reducer til 2,2 plukkere = **320.000 kr./år spart**
- Hardware-automatisering: Investering 800.000 kr., ROI 2,5 år – **for tidligt**

**Ved 500 ordrer/dag:**
- Manuel drift: 7 plukkere = 8.400.000 kr./år
- Konveyorbånd + sortering: Investering 1.200.000 kr., reducer til 5 plukkere = **2.400.000 kr./år spart**, ROI 6 måneder
- Robotsystem: Investering 4.500.000 kr., reducer til 3 plukkere = **4.800.000 kr./år spart**, ROI 11 måneder

**Black Friday-trigger (6× volumen):**
Ved 500 ordrer/dag normal = 3.000 ordrer/dag Black Friday. Uden automatisering: rekrutter 30+ vikarer på 2 uger. Fejlrate stiger fra 0,8% til 3,2%. 3,2% × 3.000 ordrer × 5 dage × 450 kr. = **216.000 kr. tabt på Black Friday alene**. Automatisering eliminerer vikar-behovet.

**Hvis du venter 6 måneder med at automatisere ved 500 ordrer/dag:**
Tabt besparelse: 2.400.000 kr./år ÷ 2 = **1.200.000 kr.**
```

### MANGLENDE EDGE CASE (tilføj efter "Typiske fejl"):
```markdown
## Det her går galt i virkeligheden

**Edge case 1: Sæsonudsving dræber hardware-ROI**
Webshop automatiserer til peak (800 ordrer/dag i december). Resten af året: 120 ordrer/dag. Robotsystem koster 850.000 kr./år i vedligehold til 15% kapacitetsudnyttelse. **Løsning:** Brug 3PL til peak, automatiser kun baseline-volumen.

**Edge case 2: Sortiment ændrer sig – robot kan ikke følge med**
Investerer i pick-robot optimeret til 200 SKU'er. 18 måneder senere: 680 SKU'er. Robot kan ikke håndtere variationen. **Cost:** 3,2 mio. kr. investering bruges 40% af tiden. **Løsning:** Automatiser kun A-varer (stabil volumen), hold B/C manuelt.
```

---

## ❌ AFVIST: hvornår-flere-lokationer.md
**Hvorfor:** Mangler Black Friday 6× reference, breakpoints ikke konsistent (50/200/500), "det afhænger af" i FAQ.

**Konkrete fixes:**

### REWRITE: "Hvorfor det er vigtigt – i kroner" (tilføj Black Friday):
```markdown
**Black Friday-trigger (6× volumen):**
Ét lager ved 500 ordrer/dag = 3.000 ordrer/dag Black Friday. Kapacitet maxed. Med to lagre (Sjælland + Jylland): 1.500 ordrer/dag per lager = inden for kapacitet. Alternativ: Leje 3PL-overløb til 22 kr./ordre × 1.500 ordrer × 5 dage = **165.000 kr.** vs. permanent ekstra lager til 420.000 kr./år.

**Hvis du venter 6 måneder med at åbne andet lager:**
Unnødvendig fragtkostnad: 472.500 kr./år ÷ 2 = **236.250 kr. tabt**
```

### FIX FAQ (fjern "det afhænger af"):
```markdown
**Hvornår er to lagre bedre end ét?**
Når fragtomkostningen du sparer overstiger 420.000 kr./år (ekstra husleje + personale + WMS). Ved 500 ordrer/dag med 40% Jylland-kunder = 1.250.000 kr. spart i fragt – 420.000 kr. cost = **830.000 kr. netto-gevinst**. Under 300 ordrer/dag: Ét lager er billigere.
```

---

## ❌ AFVIST: hvornår-setup-knækker.md
**Hvorfor:** Mangler konkrete kr.-konsekvenser ved at vente 6 måneder, breakpoints nævnt men ikke gennemgående, mangler Black Friday 6× reference.

**Konkrete fixes:**

### NY INTRO (komplet):
```markdown
Vækst er godt. Men vækst afslører også alle de processer, du aldrig byggede ordentligt. De fleste lager-setups knækker ved 50, 200 eller 500 ordrer/dag – og du opdager det 3-6 måneder for sent. Ved 200 ordrer/dag uden WMS betaler du 700.000 kr./år for kaos. Ved Black Friday (6× volumen) knækker uoptimerede setups totalt: fejlrate 4,2%, backlog 5 dage, 420.000 kr. tabt på 3 uger. Her er tegnene på, at det sker for dig nu.
```

### TILFØJ: "Hvad koster det at vente 6 måneder?" (efter "Konsekvenser i kroner"):
```markdown
## Hvad koster det at vente 6 måneder?

Ved 500 ordrer/dag med 2% fejlrate og suboptimal plukeffektivitet:
- Fejlomkostninger: 73.500 kr./md × 6 = **441.000 kr.**
- Ekstra lønomkostning (45% mere personale): 47.000 kr./md × 6 = **282.000 kr.**
- **Total: 723.000 kr. tabt på 6 måneder**

WMS-investering: 180.000 kr., ROI 4 måneder.
**Forskel: 543.000 kr.**
```

---

## ❌ AFVIST: hvornår-skal-du-ansætte.md
**Hvorfor:** Mangler Black Friday 6× reference, breakpoints ikke konsistent, mangler konkret "hvad koster det at vente 6 måneder".

**Konkrete fixes:**

### TILFØJ: Black Friday-scenarie (efter "Beregn dit behov"):
```markdown
## Black Friday-trigger (6× volumen)

Ved 200 ordrer/dag normal = 1.200 ordrer/dag Black Friday.

**Uden forberedelse:**
- Skal rekruttere 12 vikarer akut (2 ugers onboarding)
- 8 af 12 laver kritiske fejl (kender ikke lageret)
- Fejlrate: 3,8% × 1.200 ordrer × 5 dage = 228 fejl × 450 kr. = **102.600 kr.**
- Rekruttering + onboarding: 12 × 3 uger × 37 timer × 180 kr. = **239.760 kr.**
- **Total: 342.360 kr. på 3 uger**

**Med WMS + optimering:**
- Eksisterende team (4 plukkere) håndterer 880 ordrer/dag (110 picks/time)
- Rekrutter 4 vikarer (ikke 12) med 1,5 dags onboarding (WMS-guided)
- Fejlrate: 0,8%
- **Cost: 89.000 kr.**
- **Forskel: 253.360 kr. spart**
```

---

## ❌ AFVIST: hvornår-skal-du-outsource-lager.md
**Hvorfor:** Mangler Black Friday 6× reference, breakpoints ikke konsistent, "det afhænger af" i FAQ.

**Konkrete fixes:**

### TILFØJ: Black Friday-scenarie (efter "Sammenligning i kroner"):
```markdown
## Black Friday-trigger: 3PL som overløb

Ved 200 ordrer/dag normal = 1.200 ordrer/dag Black Friday (6×).

**Eget lager alene:**
- Kapacitet: 280 ordrer/dag max
- Backlog: 920 ordrer/dag × 5 dage = 4.600 ordrer forsinket
- **Cost:** Fejl + forsinkelser + tabte kunder = 420.000 kr.

**Eget lager + 3PL-overløb:**
- Eget lager: 280 ordrer/dag
- 3PL: 920 ordrer/dag × 5 dage = 4.600 ordrer × 22 kr. = **101.200 kr.**
- Ingen forsinkelse, ingen fejl
- **Forskel: 318.800 kr. spart**

3PL er ikke enten/eller – det er en buffer til peak.
```

### FIX FAQ (fjern "det afhænger af"):
```markdown
**Er 22 kr. per ordre realistisk for 3PL?**
Ja – ved 500+ ordrer/dag hos effektive danske 3PL-operatører (2025). Under 200 ordrer/dag: 28-35 kr./ordre. Over 1.000 ordrer/dag: 18-22 kr./ordre. Din pris afhænger af volumen og sortiment – men 22 kr. er realistisk benchmark ved 500 ordrer/dag.
```

---

## ❌ AFVIST: hvornår-skal-lager-opdeles.md
**Hvorfor:** Mangler konkret kr.-konsekvens ved at vente 6 måneder, breakpoints ikke gennemgående, mangler Black Friday reference.

**Konkrete fixes:**

### TILFØJ: "Hvad koster det at vente 6 måneder?" (efter "Hvorfor det er vigtigt – i kroner"):
```markdown
## Hvad koster det at vente 6 måneder med zone-opdeling?

Ved 200 ordrer/dag uden ABC-zoner:
- Ekstra plukketid: 1,8 timer/dag × 200 kr. × 125 dage = **45.000 kr.**
- Kunne have implementeret zone-opdeling på 2 dage (cost: 8.000 kr.)
- **Forskel: 37.000 kr. tabt**

Ved 500 ordrer/dag:
- Ekstra plukketid: 90.000 kr./år × 0,5 = **45.000 kr. tabt på 6 måneder**
```

### TILFØJ: Black Friday-scenarie:
```markdown
**Black Friday uden zone-opdeling:**
Ved 500 ordrer/dag normal = 3.000 ordrer/dag Black Friday. A-varer (20% af sortiment, 80% af ordrer) er spredt tilfeldig. Plukkere krydser deres egne spor 8-12 gange per batch. Plukketid stiger 60%. Skal rekruttere 8 ekstra vikarer (i stedet for 4). **Ekstra cost: 180.000 kr. på 3 uger**.
```

---

## ❌ AFVIST: håndtering-af-kampagner.md
**Hvorfor:** Mangler konkrete breakpoints (50/200/500), mangler kr.-konsekvens ved at vente, mangler Black Friday 6× reference.

**Konkrete fixes:**

### NY INTRO (komplet):
```markdown
En kampagne uden lagerplan er ikke en kampagne – det er et brev til dine kunder om forsinkelse. Ved 200 ordrer/dag kan en 3× kampagne (600 ordrer/dag) koste 22.500 kr. i fejl på 3 dage. Ved Black Friday (6× volumen) uden forberedelse: 420.000 kr. tabt på 3 uger. Her er hvad der skal på plads, inden du trykker "Gå live".
```

### TILFØJ: Breakpoint-tabel (efter "Hvornår er det et problem?"):
```markdown
## Kampagne-kapacitet per breakpoint

| Normal volumen | Kampagne (3×) | Black Friday (6×) | Hvad skal på plads |
|----------------|---------------|-------------------|--------------------|
| 50 ordrer/dag | 150 ordrer/dag | 300 ordrer/dag | Pre-pick A-varer, 1 ekstra person |
| 200 ordrer/dag | 600 ordrer/dag | 1.200 ordrer/dag | WMS, batch picking, 3 vikarer |
| 500 ordrer/dag | 1.500 ordrer/dag | 3.000 ordrer/dag | Automatisering eller 3PL-overløb |
```

---

## ❌ AFVIST: ordrer-pr-medarbejder.md
**Hvorfor:** Mangler Black Friday 6× reference, mangler konkret "hvad koster det at vente 6 måneder", breakpoints ikke gennemgående.

**Konkrete fixes:**

### TILFØJ: Black Friday-scenarie (efter "Konsekvenser i kroner"):
```markdown
## Black Friday-test: Picks/time under pres

Ved 200 ordrer/dag normal (102 picks/time) = 1.200 ordrer/dag Black Friday (6×).

**Uden WMS:**
- Picks/time falder til 68 under pres (trætte medarbejdere, kaos)
- Skal rekruttere 12 vikarer (i stedet for 6)
- Fejlrate stiger fra 0,8% til 3,2%
- **Cost:** 342.000 kr. på 3 uger

**Med WMS:**
- Picks/time holder 102 (system guider, ingen kaos)
- Rekrutter 6 vikarer
- Fejlrate: 0,9%
- **Cost:** 98.000 kr.
- **Forskel: 244.000 kr. spart**
```

### TILFØJ: "Hvad koster det at vente 6 måneder?":
```markdown
## Hvad koster det at vente 6 måneder med at optimere?

Ved 500 ordrer/dag med 60 picks/time (i stedet for 102):
- Ekstra lønomkostning: 70.000 kr./md × 6 = **420.000 kr.**
- WMS-investering: 180.000 kr., ROI 4 måneder
- **Forskel: 240.000 kr. tabt**
```

---

## TOTAL: 8 artikler afvist
**Primære afvisningsårsager:**
1. Mangler Black Friday 6× reference (8/8)
2. Breakpoints ikke konsistent brugt (7/8)
3. Mangler "hvad koster det at vente 6 måneder" (6/8)
4. "Det afhænger af" i FAQ (2/8)
5. Encoding-problemer (1/8)
