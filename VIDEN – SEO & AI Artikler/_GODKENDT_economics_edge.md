# GODKENDTE ARTIKLER – Economics & EdgeCases

## ECONOMICS (5/14 godkendt)

### ✅ cost-per-ordre.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10
**Hvorfor godkendt:** Konkret kr./år regnestykke (3,5 mio. kr. spild), scenarier med 300 ordrer/dag, edge case (CPO stiger ved vækst), SmartPack JA/NEJ sektion.
**Micro improvements:**
- Tilføj: "Hvis din CPO er 60 kr. og konkurrentens 3PL tilbyder 25 kr., taber du 3,5 mio. kr./år ved 300 ordrer/dag."
- Skærp intro: "Du kender din omsætning. Men kender du din cost per ordre? Det er problemet."

---

### ✅ plukkefejl-koster-penge.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 9/10
**Hvorfor godkendt:** Konkret 350-850 kr./fejl, regnestykke ved 500 ordrer/dag (2,9 mio. kr./år ved 2% fejlrate), edge case (fejl du aldrig hører om), SmartPack JA/NEJ.
**Micro improvements:**
- Tilføj: "60% af fejl bliver aldrig reklameret. Kunden køber bare aldrig igen. LTV-tab: 480 kr. per tavs kunde."

---

### ✅ roi-paa-wms.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10
**Hvorfor godkendt:** Konkret 700.000 kr./år besparelse ved 500 ordrer/dag, break-even 4-5 måneder, edge cases (implementation koster dobbelt, gevinst udebliver hvis processer ikke ændres).
**Micro improvements:**
- Tilføj: "WMS er ikke magisk. Hvis I plukker som før, får I ikke gevinsten."

---

### ✅ beholdningsomkostninger.md
**Score:** Troværdighed 8/10 | Praktisk 8/10 | AI-egnethed 8/10 | Konvertering 7/10
**Hvorfor godkendt:** Konkret 500.000 kr./år ved 2 mio. kr. varelager, carrying cost 20-30%, regnestykke per 100.000 kr. reduktion.
**Micro improvements:**
- Tilføj edge case: "Slow movers akkumulerer carrying cost per dag. Beslut cutoff og liquidér."

---

### ✅ lageromkostninger-beregning.md
**Score:** Troværdighed 8/10 | Praktisk 8/10 | AI-egnethed 8/10 | Konvertering 7/10
**Hvorfor godkendt:** Komplet oversigt med 5 kategorier, konkret eksempel (188.000 kr./md ved 200 ordrer/dag), CPO 42,7 kr./ordre.
**Micro improvements:**
- Tilføj: "De fleste kender huslejeposen. Færre kender det samlede tal. Og det samlede tal er typisk 40-60% højere."

---

## EDGE CASES (8/15 godkendt)

### ✅ forkert-label.md
**Score:** Troværdighed 10/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 10/10
**Hvorfor godkendt:** PERFEKT. Konkret 1.295-1.615 kr./fejl, edge case ("Udskriv igen" IKKE grøn Print-knap), scenarier (labels printer i bunke, gammel label ikke fjernet), SmartPack JA/NEJ med alternativ-tabel.
**Micro improvements:** Ingen. Dette er benchmark.

---

### ✅ integration-stopper.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10
**Hvorfor godkendt:** Konkret 64.500-258.000 kr. per hændelse, edge cases (integration fejler kl. 10, opdages kl. 16:30; API-token udløber kl. 03:00), fallback til fragtportal direkte, SmartPack alternativ-tabel.
**Micro improvements:**
- Tilføj: "Ved 3 integration-stops/år (gennemsnit 4 timer): 387.000 kr./år."

---

### ✅ data-korruption.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 7/10
**Hvorfor godkendt:** Konkret edge case (direkte database-ændringer omgår validering), scenarier (negativ saldo, ordrelinjer uden produkt-ID), forebyggelse (daglig backup, ingen direkte DB-adgang).
**Micro improvements:**
- Tilføj økonomi: "Data-korruption opdaget for sent: 2 dages ordrer (800 stk.) skal håndteres manuelt = 150.000 kr. i ekstra arbejde."

---

### ✅ dobbeltpluk.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 7/10
**Hvorfor godkendt:** Edge case (samme plukjob frigivet to gange, to plukkere på samme placering), konkret håndtering (stop plukkerne, cycle count, prioriter ordre), forebyggelse (job-locking, atomic reservation).
**Micro improvements:**
- Tilføj økonomi: "Dobbeltpluk = 2 ordrer påvirket. Ordre A får varen, ordre B mangler den. Omkostning: 350 kr. + LTV-tab."

---

### ✅ forkert-retur.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 8/10 | Konvertering 7/10
**Hvorfor godkendt:** Edge cases (kunden sender forkert vare, beskadiget vare lagt på aktivt lager, returnering ikke registreret), konkret procedure (QC før lagerindsætning, refusion efter QC).
**Micro improvements:**
- Tilføj økonomi: "Beskadiget vare på aktivt lager → plukkes til næste ordre → ny fejl → 350-850 kr./fejl."

---

### ✅ lager-går-ned.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 7/10
**Hvorfor godkendt:** Edge case (WMS nede, fragtafhentning om 3 timer), konkret fallback (eksport fra webshop, print labels fra fragtportal), scenarier (4 timers nedbrud = 17 ordrer mislykkes).
**Micro improvements:**
- Tilføj: "4 timers nedbrud ved 100 ordrer/dag = 17 ordrer × 150 kr. = 2.500 kr. + tab af kundetillid."

---

### ✅ ordre-annulleret-midt-i-pluk.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 8/10 | Konvertering 7/10
**Hvorfor godkendt:** Edge case (ordre annulleret mens plukkeren er halvvejs), konkret procedure (stop pluk, return-to-shelf med scan, WMS opdaterer saldo), scenarier (pakken allerede sendt → recall).
**Micro improvements:**
- Tilføj: "Annulleret ordre sendt alligevel = gratis pakke + fragt = 90-180 kr. tabt."

---

### ✅ oversolgte-varer.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10
**Hvorfor godkendt:** Edge case (50 ordrer på vare med saldo 12), konkret håndtering (stop salg inden 10 min, FIFO-prioritering, kommunikér straks), forebyggelse (realtids-synkronisering, buffer-saldo).
**Micro improvements:**
- Tilføj: "Oversalg opdaget for sent: 38 kunder skal refunderes × 350 kr. kundeservice = 13.300 kr. + LTV-tab."

---

## TOTAL: 13/29 GODKENDT (45%)
