# AFVISTE ARTIKLER – Economics & EdgeCases

## ECONOMICS (9/14 afvist)

---

### ❌ break-even-lager.md
HVORFOR: Mangler konkret kr./år regnestykke. "3-8 måneder break-even" er for bredt. Ingen edge case.

KONKRETE FIXES:
**Ny intro:**
"Nyt WMS koster 150.000 kr. Hvornår tjener du det hjem? Ved 500 ordrer/dag: 3 måneder. Ved 100 ordrer/dag: aldrig. Her er regnestykket."

**Tilføj edge case (linje 64):**
"**Det opdager de fleste for sent:** Implementation koster dobbelt så meget som budgetteret. Du budgetterer 150.000 kr. til WMS. Men du glemmer: datatransfer, integration til ERP, konsulentdage, medarbejder-onboarding og 3 ugers reduceret produktivitet. Reel omkostning: 280.000 kr. ROI-beregningen var forkert fra dag 1."

**Tilføj konkret økonomi (efter linje 38):**
"**Ved 500 ordrer/dag:** Besparelse 700.000 kr./år. Break-even: 3 måneder. **Ved 100 ordrer/dag:** Besparelse 180.000 kr./år. Break-even: 10 måneder."

---

### ❌ budget-til-lager.md
HVORFOR: Mangler konkret kr./år total. "1,2-2 mio. kr./år" er for bredt. Ingen edge case.

KONKRETE FIXES:
**Ny intro:**
"Et lagerbudget er ikke kun husleje og løn. De virksomheder der kun budgetterer det synlige, er altid overraskede. Her er den komplette budgetstruktur – og de 5 poster du glemmer."

**Tilføj edge case (efter linje 41):**
"**Det opdager de fleste for sent:** Rekruttering og turnover. 43% turnover × 30-50.000 kr./hoved = 85.000-215.000 kr./år for et team på 5 medarbejdere. Det er IKKE i budgettet. Men det er en reel omkostning."

**Tilføj konkret total (efter linje 33):**
"**Samlet årligt budget ved 200 ordrer/dag:** 960.000 kr. (fast) + 730.000 kr. (variabelt) = **1.690.000 kr./år ekskl. forsendelse**. Inkl. forsendelse (40 kr. × 200 × 365): **4.610.000 kr./år**."

---

### ❌ emballagekostnader.md
HVORFOR: Mangler konkret kr./år ved specifik volumen. "365.000 kr./år" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 60):**
"**Det opdager de fleste for sent:** Dimensionsvægt-fælde. En kasse for stor udløser næste prisklasse. 40×30×30 cm kasse = 7,2 kg dimensionsvægt. Faktisk vægt: 2 kg vare. Fragt beregnes på 7,2 kg. Optimering til 30×20×15 cm kasse = 1,8 kg dimensionsvægt = lavere prisklasse = 15-30 kr. sparet per ordre. Ved 500 ordrer/dag: 2,7-5,5 mio. kr./år."

---

### ❌ forsendelsesomkostninger.md
HVORFOR: Mangler konkret kr./år regnestykke. "1.594.375 kr./år" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 46):**
"**Det opdager de fleste for sent:** Brændstoftillæg varierer. Det er typisk 12-18% oven i fragtprisen. Du forhandler en pris på 35 kr./pakke. Men brændstoftillæg er 15% = 5,25 kr. ekstra. Reel pris: 40,25 kr. Ved 500 pakker/dag: 957.000 kr./år i brændstoftillæg alene."

---

### ❌ lagerhusleje-optimering.md
HVORFOR: Mangler konkret kr./år ved specifik scenarie. "120.000 kr./år sparet" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 34):**
"**Det opdager de fleste for sent:** I køber mere areal i stedet for at optimere. 1.000 m² lager ved 60% udnyttelse = 400 m² ubrugt. 400 m² × 600 kr./år = 240.000 kr./år i spildt husleje. Optimer til 85% udnyttelse først – så undgår du at udvide."

---

### ❌ personaleomkostninger-lager.md
HVORFOR: Mangler konkret kr./år total. "420.000-600.000 kr. per medarbejder/år" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 31):**
"**Det opdager de fleste for sent:** Turnover-omkostning er usynlig. Et team på 5 medarbejdere: 2,15 medarbejdere forlader per år. 2 × 40.000 kr. (rekruttering) + 2 × 20.000 kr. (onboarding-tab) = **120.000 kr./år i ren turnover-omkostning**. Og det er det konservative estimat."

**Tilføj konkret total (efter linje 24):**
"**Team på 5 medarbejdere:** 5 × 500.000 kr. = 2.500.000 kr./år. Plus turnover: 120.000 kr./år. **Total: 2.620.000 kr./år**."

---

### ❌ returomkostninger.md
HVORFOR: Mangler konkret kr./år. "2.956.500 kr./år" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 54):**
"**Det opdager de fleste for sent:** 60-70% af returner er potentielt reducerbare. Bedre produktbeskrivelse og billeder reducerer typisk returrate med 3-8 procentpoint. Ved 300 ordrer/dag og 18% returrate: 3 procentpoint reduktion = 11 færre returner/dag × 150 kr. = 602.000 kr./år sparet."

---

### ❌ skjulte-lageromkostninger.md
HVORFOR: Mangler konkret kr./år total. "300.000-800.000 kr./år" er for bredt. Ingen edge case.

KONKRETE FIXES:
**Ny intro:**
"Husleje og løn er nemme at se. Men de skjulte lageromkostninger – spild, fejl, bundet kapital, ineffektive processer – kan koste mere end de synlige. Her er de 4 kategorier du ignorerer."

**Tilføj konkret scenarie (efter linje 55):**
"**Konkret eksempel ved 200 ordrer/dag:** Dead stock (200.000 kr. × 6% kapitalomkostning) = 12.000 kr./år. Procesudstedelse (20% uproduktiv gangtid × 3 medarbejdere × 35.000 kr./md × 12) = 252.000 kr./år. Beholdningsafvigelse (2% × 2 mio. kr. varelager) = 40.000 kr./år. **Total: 304.000 kr./år i skjulte omkostninger**."

**Tilføj edge case (efter linje 62):**
"**Det opdager de fleste for sent:** Dead stock vokser stille. 10% dead stock i dag. 15% om 6 måneder. 20% om 12 måneder. Adressér det kvartalsvist – ikke ved næste nedskrivning."

---

### ❌ økonomi-i-automatisering.md
HVORFOR: Mangler konkret kr./år ved specifik volumen. "25.900 > 18.333" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 39):**
"**Det opdager de fleste for sent:** I automatiserer for tidligt. Under 200 ordrer/dag er der ikke skalamæssigt grundlag for de fleste auto-investeringer. AMR-robot ved 150 ordrer/dag: break-even 5+ år. Ved 300 ordrer/dag: break-even 2 år. Vent til volumen er der."

**Tilføj konkret total (efter linje 64):**
"**Ved 300 ordrer/dag:** AMR-robot erstatter 0,7 medarbejder = 25.900 kr./md besparelse. Omkostning: 18.333 kr./md. **Netto: 7.567 kr./md = 90.800 kr./år**."

---

## EDGE CASES (7/15 afvist)

---

### ❌ batch-mangler.md
HVORFOR: Mangler konkret økonomi. Ingen kr./år regnestykke. Edge case er der (batch løber tom), men mangler konsekvens i kroner.

KONKRETE FIXES:
**Tilføj økonomi (efter linje 28):**
"**Konsekvens:** Batch på 10 ordrer. En vare mangler. 10 ordrer påvirket. Delordre til alle 10 = 10 × 90 kr. ekstra fragt = 900 kr. per batch-fejl. Ved 2 batch-fejl/uge: 93.600 kr./år."

**Tilføj edge case (efter linje 53):**
"**Det opdager de fleste for sent:** Batch-størrelse skaleret til kapacitet, ikke til saldo. Batch på 20 ordrer der alle inkluderer en SKU med saldo 15. Batchen frigives. Plukkeren når til hylden: kun 15 stk. 5 ordrer kan ikke fuldføres. Opdagelse: når kundeservice får 5 klager samme dag."

---

### ❌ forkert-lagerantal.md
HVORFOR: Mangler konkret kr./år. "5.000-15.000 kr./md" er der, men mangler edge case.

KONKRETE FIXES:
**Tilføj edge case (efter linje 38):**
"**Det opdager de fleste for sent:** Phantom inventory opdages først ved oversalg. WMS viser 50 stk. Fysisk: 37 stk. Forskellen: 13 stk. Du sælger 13 ordrer du ikke kan levere. 13 × 350 kr. kundeservice + LTV-tab = 4.550 kr. + 6.240 kr. = **10.790 kr. per uopdaget mismatch**."

**Tilføj konkret total (efter linje 38):**
"**Ved 5% inventory inaccuracy og 200 SKU'er:** 10 SKU'er med forkert saldo. Halvt for høj (oversalg): 5 SKU'er × 2 oversalg/md = 10 kundeklager × 350 kr. = 3.500 kr./md. Halvt for lav (tabt salg): 5 SKU'er × 3 tabte ordrer/md = 15 × 350 kr. = 5.250 kr./md. **Total: 8.750 kr./md = 105.000 kr./år**."

---

### ❌ lager-mismatch.md
HVORFOR: Mangler konkret økonomi. Ingen kr./år regnestykke. Edge case er implicit, men ikke eksplicit.

KONKRETE FIXES:
**Tilføj økonomi (efter linje 20):**
"**Konsekvens:** Phantom inventory (for høj saldo) = oversalg = 350 kr./fejl + LTV-tab. Shadow inventory (for lav saldo) = tabt salg = 350 kr./tabt ordre. Ved 3% mismatch og 200 SKU'er: 6 SKU'er påvirket × 3 fejl/md = 18 fejl/md × 400 kr. = **86.400 kr./år**."

**Tilføj edge case (efter linje 32):**
"**Det opdager de fleste for sent:** Mismatch akkumulerer. 1% i dag. 2% om 3 måneder. 5% om 12 måneder. Kun årlig optælling = fejl akkumulerer i 12 måneder inden korrektion. Cycle count ugentligt på A-varer stopper akkumuleringen."

---

### ❌ pluk-uden-lager.md
HVORFOR: Mangler konkret økonomi. Ingen kr./år regnestykke. Edge case er der (negativ saldo), men mangler konsekvens i kroner.

KONKRETE FIXES:
**Tilføj økonomi (efter linje 31):**
"**Konsekvens:** Pluk på tom hylde = ordre kan ikke fuldføres = backorder eller refund. Backorder: 90 kr. ekstra fragt + kundeservice. Refund: 350 kr. kundeservice + LTV-tab. Ved 5 pluk-uden-lager/uge: 260 × 400 kr. = **104.000 kr./år**."

**Tilføj edge case (efter linje 26):**
"**Det opdager de fleste for sent:** Negativ saldo ignoreret. WMS viser -3 stk. Det er ALTID en fejl. Men ingen reagerer. 3 ordrer allokeres til varer der ikke eksisterer. 3 kunder venter. Opdagelse: når kundeservice får 3 klager samme dag."

---

### ❌ serienummer-mangler.md
HVORFOR: Mangler konkret økonomi. "10-50x højere omkostning" er for vagt. Ingen edge case.

KONKRETE FIXES:
**Tilføj konkret scenarie (efter linje 35):**
"**Konkret eksempel:** Leverandør annoncerer recall på serienumre #10000-10500. Du har solgt 80 enheder fra denne batch men ved ikke hvem. **Valg 1:** Kontakt alle 200+ kunder der har købt produktet de seneste 6 måneder. 200 × 15 min kundeservice × 250 kr./time = 12.500 kr. + kundeirritiation. **Valg 2:** Identificer de 80 kunder med serienummer-tracking. 80 × 10 min × 250 kr./time = 3.333 kr. **Forskel: 9.167 kr. per recall-hændelse**."

**Tilføj edge case (efter linje 28):**
"**Det opdager de fleste for sent:** En kunde reklamerer. Du ved ikke om det er din levering eller en de selv har købt. Uden serienummer: du refunderer uden at kunne verificere. Med serienummer: du verificerer straks om det er din levering. Forskel: 1.200 kr. (produktværdi) + 350 kr. (kundeservice) = 1.550 kr. per uberettiget reklamation."

---

### ❌ systemfejl-under-pak.md
HVORFOR: Mangler konkret økonomi. Ingen kr./år regnestykke. Edge case er der (label-printer fejl), men mangler konsekvens i kroner.

KONKRETE FIXES:
**Tilføj økonomi (efter linje 19):**
"**Konsekvens:** Label-printer nede i 30 minutter. 10 pakker står klar uden label. Fragtafhentning om 10 minutter. 10 ordrer mislykkes levering = 10 × 90 kr. ekstra fragt + kundeservice = 1.400 kr. per hændelse. Ved 2 printer-fejl/md: **33.600 kr./år**."

**Tilføj edge case (efter linje 50):**
"**Det opdager de fleste for sent:** Fragtleverandørens API svarer ikke. I har ingen fallback. 47 pakker står klar. Fragtafhentning om 10 minutter. Ingen labels. Opdagelse: når fragtmanden ankommer og afviser alle pakker."

---

### ❌ vare-kan-ikke-findes.md
HVORFOR: Mangler konkret økonomi. Ingen kr./år regnestykke. Edge case er der (phantom inventory), men mangler konsekvens i kroner.

KONKRETE FIXES:
**Tilføj økonomi (efter linje 19):**
"**Konsekvens:** Vare ikke fundet = ordre kan ikke fuldføres = backorder eller refund. Backorder: 90 kr. ekstra fragt + 15 min kundeservice = 152 kr. Refund: 350 kr. kundeservice + LTV-tab (480 kr.) = 830 kr. Ved 10 "ikke fundet"/uge: 520 × 400 kr. = **208.000 kr./år**."

**Tilføj edge case (efter linje 17):**
"**Det opdager de fleste for sent:** Phantom inventory akkumulerer. WMS viser 50 stk. Fysisk: 37 stk. Forskellen: 13 stk. Du opdager det først når du oversælger. 13 kunder har betalt. 13 kunder skal refunderes. 13 × 830 kr. = **10.790 kr. per uopdaget phantom inventory**."

---

## PRIMÆRE AFVISNINGSÅRSAGER:
1. **Mangler konkret kr./år regnestykke** (12 artikler)
2. **Mangler edge case** (9 artikler)
3. **For brede intervaller** ("300.000-800.000 kr./år" i stedet for konkret scenarie)
4. **Mangler "Det opdager de fleste for sent"-sektion** (7 artikler)

## NÆSTE SKRIDT:
Afviste artikler sendes til Reality Enforcer med ovenstående fix-liste.
