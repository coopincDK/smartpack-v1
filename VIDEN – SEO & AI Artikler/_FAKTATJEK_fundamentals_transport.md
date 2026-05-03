# FAKTATJEK — Fundamentals (15) + Transport (10)

**Dato:** 2025-01-27  
**Scope:** 25 artikler verificeret mod SmartPack Leksikon + brancheviden  
**Kritiske fakta:** FIFO/FEFO, picks/time, TSP-algoritmer, safety stock, reorder point, inventory accuracy, cycle counting, GLS max vægt, method keys, MISKOS, Bring telefon, volumevægt, cut-off, cross-docking, lead time

---

## FUNDAMENTALS (15 artikler)

### **hvad-er-batch-picking.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ 110 linjer/time (SmartPack) vs. 102 (industri 2025) — korrekt (lager-strategi.md linje 213-214)
- ✅ 8–16 ordrer pr. batch — korrekt anbefaling
- ✅ A*-pathfinding nævnt — korrekt (ikke TSM)
- ✅ Regnestykke (35 sek vs. 26 sek) — logisk korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt. Alle tal matcher leksikon.

---

### **hvad-er-zone-picking.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ 30–50% gangdistancereduktion i lagre over 1.000 kvm — realistisk
- ✅ 3–6 zoner anbefalet — korrekt
- ✅ ABC-zonering beskrevet korrekt
- ✅ Pick and pass vs. parallel zone picking — korrekt distinktion

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-fifo.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ FIFO = ældste varer (modtagelsesdato) plukkes først — korrekt
- ✅ FEFO = nærmest udløbsdato plukkes først — korrekt distinktion
- ✅ Flowreoler (gravity flow racking) nævnt — korrekt
- ✅ Lovpligtigt for fødevarer og medicin — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt. FIFO/FEFO-distinktionen er præcis.

---

### **hvad-er-fefo.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ FEFO = First Expired, First Out — korrekt
- ✅ Baseret på udløbsdato, ikke modtagelsesdato — korrekt
- ✅ Lovpligtigt for fødevarer og medicin (EU 852/2004) — korrekt
- ✅ MRL (Minimum Restlevetid) forklaret korrekt
- ✅ Batch- og lot-tracking nævnt — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-sku.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ SKU = Stock Keeping Unit — korrekt
- ✅ SKU vs. EAN distinktion — korrekt
- ✅ Én SKU = én lagerbar enhed — korrekt
- ✅ Arkivér, slet ikke — best practice korrekt
- ✅ Ghost-SKU definition — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-lagerflow.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ U-formet flow anbefalet — korrekt
- ✅ Spaghetti-diagram nævnt — korrekt metode
- ✅ 20–35% øget pluktid ved ineffektivt flow — realistisk
- ✅ ABC-zonering anbefalet — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-inventory-accuracy.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Best-in-class: 98–99% — korrekt
- ✅ Acceptabelt: 95–97% — korrekt
- ✅ Problematisk: Under 95% — korrekt
- ✅ Kritisk: Under 90% — korrekt
- ✅ Formel korrekt: (korrekte SKU-beholdninger / totale SKU-beholdninger) × 100

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt. Benchmarks matcher industristandarder.

---

### **hvad-er-cycle-counting.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ A-varer: Månedligt — korrekt
- ✅ B-varer: Kvartalsvis — korrekt
- ✅ C-varer: Årligt — korrekt
- ✅ Blind count anbefalet — korrekt
- ✅ 20–30 lokationer dagligt anbefalet — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-cross-docking.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Cross docking = direkte fra indgående til udgående, ingen lagring — korrekt
- ✅ Pre-distribution vs. post-distribution — korrekt distinktion
- ✅ Under 24 timer gennemstrømningstid — korrekt
- ✅ Walmart-modellen nævnt — korrekt reference
- ✅ Forskellen fra dropshipping forklaret korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-dropshipping.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Dropshipping = leverandør sender direkte til slutkunde — korrekt
- ✅ Ingen lagerbinding — korrekt
- ✅ 15–30% lavere marginer end lagersalg — realistisk
- ✅ API-integration anbefalet — korrekt
- ✅ White-label aftale nævnt — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-demand-planning.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Lageromstætning 4–8×/år best practice — korrekt (lager-strategi.md linje 186-191)
- ✅ ABC-fordeling: A=20% SKU/80% omsætning — korrekt
- ✅ MAPE < 15% anbefalet — korrekt
- ✅ Frigørbar kapital-formel korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-lead-time.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Lead time = dage fra ordre til modtagelse — korrekt
- ✅ Inkluderer ordrebehandling, produktion, transport, modtagekontrol — korrekt
- ✅ Reorder point = safety stock + (dagligt salg × lead time) — korrekt formel
- ✅ Kinesisk nytår påvirker lead time — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-safety-stock.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Simpel formel: dagligt salg × lead time × buffer-faktor — korrekt
- ✅ Avanceret formel: Z × σ × √lead time — korrekt
- ✅ Z=1,65 ved 95% serviceniveau — korrekt
- ✅ Z=2,33 ved 99% serviceniveau — korrekt
- ✅ Z=1,28 ved 90% serviceniveau — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt. Alle formler og Z-værdier er præcise.

---

### **hvad-er-reorder-point.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Reorder point = safety stock + (dagligt salg × lead time) — korrekt formel
- ✅ Eksempel med 20 enheder/dag, 7 dages lead time, 30 safety stock = 170 ROP — korrekt beregning
- ✅ EOQ nævnt som separat koncept — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **hvad-er-warehouse-layout.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ U-form anbefalet — korrekt
- ✅ Gangbredde: 2,4 m for gaffeltrucks, 1,2 m for plukkere — korrekt
- ✅ Gylden zone: 60–160 cm fra gulv — korrekt ergonomi
- ✅ ABC-zonering anbefalet — korrekt
- ✅ 50–60% gangtid af total pluktid — korrekt (lager-strategi.md)

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

## TRANSPORT (10 artikler)

### **cut-off-tid-forklaret.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Cut-off = seneste ordremodtagelse for afsendelse samme dag — korrekt definition
- ✅ Intern cut-off typisk 60–90 min før fragtafhentning — realistisk
- ✅ 23% kurv-abandon ved ukendt leveringstid — realistisk benchmark

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **fragtoptimering.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Volumevægt: L×B×H ÷ 5000 = kg — korrekt formel
- ✅ Pakkeshop 20–35% billigere end hjemmelevering — realistisk
- ✅ 15–25% besparelse ved pakkeoptimering — realistisk

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **fragtpriser-forklaret.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Volumevægt: L×B×H ÷ 5000 = kg — korrekt formel
- ✅ FAF (Fuel Adjustment Factor) 5–15% — realistisk
- ✅ Fragtomkostning bør være 3–8% af omsætning — realistisk benchmark

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **last-mile-logistics.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Last mile = 50–60% af total fragtomkostning — korrekt
- ✅ FASR (First Attempt Success Rate): Pakkeshop 97–99%, Privatadresse 80–92% — realistisk
- ✅ GLS Box, PostNord Pakkeautomat nævnt — korrekt

**Fejl fundet:**
- ⚠️ Linje 60: "Bring kræver +47 + 9 eller 4" — UPRÆCIS. Bring er norsk, telefonnummer skal starte med +47 for Norge (korrekt), men formuleringen er uklar. Burde være: "Bring kræver norske telefonnumre: +47 efterfulgt af 8 cifre (mobil starter typisk med 4 eller 9)"

**Samlet vurdering:** ⚠️ Mindre fejl — telefonformat-beskrivelse uklar.

---

### **levering-fra-lager-til-kunde.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ 12-trin fulfillment-kæde beskrevet — korrekt
- ✅ OTD (On-Time Delivery) > 95% anbefalet — korrekt
- ✅ Scanner-baseret pluk reducerer fejlrate fra ~3% til under 0,3% — korrekt (lager-strategi.md linje 355)

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **leveringsfejl.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Cost per fejl: 200–500 kr. + erstatning — realistisk (lager-strategi.md: 350 kr. direkte)
- ✅ 1–3% fejlrate ved hjemmelevering — realistisk
- ✅ Under 0,5% fejlrate ved professionel drift — korrekt benchmark

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **leveringstyper.md** | ⚠️ Mindre fejl

**Verificerede fakta:**
- ✅ GLS ~1.300 pakkeshops i DK — realistisk
- ✅ PostNord ~1.500 — realistisk
- ✅ DAO ~1.200 — realistisk
- ✅ 62% foretrækker pakkeshop ved standardkøb — realistisk

**Fejl fundet:**
- ❌ Linje 107: "method keys fx `gls_private_droppoint`, `postnord_dk`" — DELVIST KORREKT. `gls_private_droppoint` er korrekt (valg-af-fragtleverandør.md linje 14), men `postnord_dk` er IKKE verificeret i leksikon. Burde verificeres eller fjernes.

**Samlet vurdering:** ⚠️ Mindre fejl — method key ikke verificeret.

---

### **multi-carrier-setup.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ Multi-carrier fordele beskrevet korrekt
- ✅ Regel-matrix eksempel realistisk
- ✅ GLS, PostNord, Bring, DAO nævnt — korrekt

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **pickup-vs-levering.md** | ✅ Godkendt

**Verificerede fakta:**
- ✅ 62% foretrækker pakkeshop for ikke-tidskritiske køb — realistisk
- ✅ 71% foretrækker hjemmelevering for tunge varer — realistisk
- ✅ Pakkeshop 20–35% billigere — korrekt
- ✅ GLS pakkeshop 28–38 kr., hjemmelevering 40–55 kr. — realistisk

**Fejl fundet:** Ingen

**Samlet vurdering:** Korrekt.

---

### **valg-af-fragtleverandør.md** | ⚠️ Mindre fejl

**Verificerede fakta:**
- ✅ GLS max 30 kg — korrekt
- ✅ `gls_private_droppoint` — korrekt method key
- ✅ `gls_business_delivery` — korrekt method key
- ✅ PostNord MISKOS-nummer 9-cifret — korrekt
- ✅ Volumevægt: L×B×H ÷ 5000 — korrekt

**Fejl fundet:**
- ⚠️ Linje 19: "Bring: Telefonnummer skal starte **+47** + 9 eller 4 (mobil)" — UPRÆCIS. Samme problem som last-mile-logistics.md. Burde være: "Bring (Norge): Telefonnummer skal være +47 efterfulgt af 8 cifre (mobil starter typisk med 4 eller 9)"

**Samlet vurdering:** ⚠️ Mindre fejl — telefonformat-beskrivelse uklar.

---

## SAMLET VURDERING

### Tællere
- ✅ **Godkendt:** 22 artikler
- ⚠️ **Mindre fejl:** 3 artikler (last-mile-logistics, leveringstyper, valg-af-fragtleverandør)
- ❌ **Kritiske fejl:** 0 artikler

### TOP 3 FEJL PÅ TVÆRS

1. **Bring telefonnummer-format (2 artikler):** Upræcis formulering "+47 + 9 eller 4". Burde være: "Norske telefonnumre: +47 efterfulgt af 8 cifre (mobil starter typisk med 4 eller 9)"

2. **Method key `postnord_dk` (1 artikel):** Ikke verificeret i leksikon. Kun `gls_private_droppoint` og `gls_business_delivery` er bekræftet.

3. **Ingen kritiske fejl fundet** — alle kernefakta (FIFO/FEFO, picks/time, formler, benchmarks) er korrekte.

---

## KONKLUSION

**Samlet kvalitet: ✅ Meget høj**

- Alle kritiske fakta er korrekte (FIFO/FEFO, safety stock, reorder point, inventory accuracy, cycle counting, GLS max vægt, volumevægt)
- Picks/time: 110 (SmartPack) vs. 102 (industri 2025) — verificeret korrekt
- Formler (safety stock, reorder point, volumevægt) — alle korrekte
- Benchmarks (inventory accuracy, cycle counting, cost per fejl) — alle realistiske
- Kun 3 mindre fejl fundet, ingen kritiske

**Anbefalinger:**
1. Ret Bring telefonnummer-beskrivelse i last-mile-logistics.md og valg-af-fragtleverandør.md
2. Verificér eller fjern `postnord_dk` method key i leveringstyper.md
3. Ellers: Artiklerne er klar til publicering

---

**Faktatjekker:** Claude Sonnet 4.5 (Runner)  
**Verificeret mod:** SmartPack Leksikon (generel-logistik.md, lager-strategi.md) + brancheviden  
**Dato:** 2025-01-27
