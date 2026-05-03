# GODKENDTE ARTIKLER – 01-Fundamentals

## ✅ hvad-er-3pl.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- Konkret break-even: 400-600 ordrer/dag med fulde omkostningseksempler
- "Det går galt" test: vendor lock-in, ingen visibilitet, for tidlig outsourcing
- Økonomi: 85.000 kr./md eget lager vs. variable 3PL-omkostninger
- Handling: 5-trins implementering med SLA-krav
- SmartPack-afsnit: tydeligt hvornår det IKKE giver mening

**Micro improvements:**
- Intro kunne skærpe "shit det er os" med konkret scenarie ("Du har 450 ordrer/dag...")
- FAQ kunne tilføje "Hvad er den største fejl ved 3PL-valg?"

---

## ✅ hvad-er-batch-picking.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret benchmark: 110 linjer/time (SmartPack) vs. 102 (industri 2025)
- Økonomi: 62.500 kr./år per plukker i besparelse
- Edge case: "Blanding af FEFO og batch kræver særlig håndtering"
- Handling: 8-16 ordrer optimal batch-størrelse med begrundelse
- Anti-konsulent: ingen "det afhænger af" – klare tal og grænser

**Micro improvements:**
- Kunne tilføje konkret eksempel på vogn-setup ("12-bakke vogn med farvekodning")

---

## ✅ hvad-er-cross-docking.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- Konkret: 500 forsendelser × 5-8 min besparelse = 40-65 timer/dag
- "Det går galt": én forsinket levering stopper hele flowet
- Handling: 4-8 timers max opholdstid på docking-zone
- SmartPack-afsnit: tydeligt hvornår cross docking giver/ikke giver mening

**Micro improvements:**
- Intro kunne være mere konkret ("Du distribuerer til 47 butikker...")
- Kunne tilføje konkret case: "Dagligvarekæde med 12 filialer"

---

## ✅ hvad-er-cycle-counting.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- **FUNDAMENTALS-KRAV OPFYLDT:** A månedligt/B kvartalsvis/C årligt eksplicit nævnt (linje 54-56)
- Konkret: 360.000 kr. tabt output ved 2 dages lukkeopgørelse
- "Det går galt": count med system-tallene synlige = finder ingen fejl
- Økonomi: 16.000 kr. løn + 360.000 kr. tabt output vs. 125 timer fordelt
- Handling: blind count, fast tidspunkt, årsagsregistrering

**Micro improvements:**
- Kunne tilføje konkret eksempel på årsagsfordeling ("42% plukfejl, 28% modtagelsesfejl...")

---

## ✅ hvad-er-demand-planning.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- **FUNDAMENTALS-KRAV OPFYLDT:** ABC-analyse med 20% SKU = 80% salg eksplicit nævnt (linje 58, 74)
- Konkret: 500.000 kr. overbeholdning × 6% = 30.000 kr./år tabt
- "Det går galt": forecast baseret på årsgennemsnit – ikke sæson → udsolgt dag 3
- Handling: 13 måneders historik, MAPE under 20%, kampagnekalender
- Edge case: lead time indregnes ikke → udsolgt i 2 uger

**Micro improvements:**
- Intro kunne skærpe med konkret scenarie ("Uge 48: du har 47 stk. i systemet...")

---

## ✅ hvad-er-dropshipping.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- Konkret: 200 ordrer × 3% fejl = 2.100 kr./dag i tab
- Margin: 20-35% dropship vs. 40-60% lagerbaseret
- "Det går galt": ingen realtids-synk → sælger udsolgte varer
- Handling: API-integration minimum, 2-4 primære leverandører, test månedligt
- SmartPack: hybridmodel tydeligt forklaret

**Micro improvements:**
- Kunne tilføje konkret case: "Webshop med 180 ordrer/dag, 3 leverandører"

---

## ✅ hvad-er-fefo.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- **FUNDAMENTALS-KRAV OPFYLDT:** Konkret scenarie med udløbsdato/holdbarhed (linje 13-19)
- Konkret: 3 mio. kr. lager × 2% svind = 60.000 kr./år kassation
- "Det går galt": 67% genkøber ikke efter produkt tæt på udløb
- Lovkrav: ISO 22000, BRC, EU-forordning 852/2004
- Handling: MRL pr. kategori, batch-adskillelse, karantænezone

**Micro improvements:**
- Intro perfekt – kunne ikke forbedres

---

## ✅ hvad-er-fifo.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- **FUNDAMENTALS-KRAV OPFYLDT:** Konkret scenarie med modtagelsesdato vs. udløbsdato (linje 17-21)
- Konkret: 2 mio. kr. lager × 5% svind = 100.000 kr./år
- "Det går galt": plukkere tager lettest tilgængelige – ikke ældste
- Handling: flowreoler, WMS-tvang, cycle counting-verifikation
- Edge case: FIFO og FEFO forveksles

**Micro improvements:**
- Kunne tilføje konkret case: "Elektronik-webshop med 850 SKU'er"

---

## ✅ hvad-er-fulfillment.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: pakkefejl ~350 kr. direkte, ~450-850 kr. inkl. LTV
- "Det går galt": manuel ordreoverførsel, ingen tracking på interne fejl
- Økonomi: 2 timer/dag manuel indtastning = 2.500 kr./uge
- Handling: automatiser 100%, mål order-to-ship dagligt, returneringszone
- Real scenario: Uge 47 kampagne → 10.350 kr. tab på én dag

**Micro improvements:**
- Kunne tilføje konkret benchmark: "Order-to-ship under 4 timer = god"

---

## ✅ hvad-er-inventory-accuracy.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: 500 ordrer × 2% fejl = 875.000 kr./år
- "Det går galt": plukkere finder ingen vare, oversalg, ukendt lager
- Handling: cycle counting, blind count, scan ALT, ugentlig KPI
- Edge case: returnerede varer lægges uden scanning
- Formel: (korrekte linjer / totale linjer) × 100

**Micro improvements:**
- Perfekt – ingen væsentlige forbedringer

---

## ✅ hvad-er-lagerflow.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- Konkret: 20-30% ekstra gangdistance = 300.000 kr./år (3 medarbejdere)
- "Det går galt": modtagelse og afsendelse konkurrerer om samme areal
- Handling: U-flow vs. I-flow, envejstrafik, A-varer nær pakstation
- Edge case: samme port for modtagelse og afsendelse → tidsvinduer

**Micro improvements:**
- Intro kunne være mere konkret ("Dit lager har én port...")
- Kunne tilføje konkret case: "500 m² lager med 4 plukkere"

---

## ✅ hvad-er-lagerstyring.md
**Score:** Troværdighed 10/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 10/10

**Hvorfor godkendt:**
- **FUNDAMENTALS-KRAV OPFYLDT:** ABC med 20% SKU = 80% omsætning eksplicit (linje 74)
- Konkret: 781.500 kr./år total tab (detaljeret tabel)
- "Det går galt": Uge 48 scenarie, måned 11 nedskrivning, Black Friday kaos
- Real scenario: 180 ordrer/dag → 10.350 kr. tab på én dag
- Handling: rens stamdata, ét sandhedssystem, mål månedligt, dynamiske ROP
- SmartPack: tydeligt hvornår det IKKE giver mening (under 30 ordrer/dag)

**Micro improvements:**
- Perfekt – benchmark for Fundamentals-artikler

---

## ✅ hvad-er-lead-time.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: 20 stk./dag × 7 dage × 150 kr. = 21.000 kr. tabt margin
- "Det går galt": bruger leverandørens estimat – ikke målt faktisk tid
- Handling: mål faktisk lead time, brug variation i safety stock, revider kvartalsvis
- Edge case: modtagelsestid regnes ikke med → 4 ekstra dage
- Formel: total lead time = ordrebehandling + transport + modtagelse

**Micro improvements:**
- Kunne tilføje konkret case: "Kinesisk leverandør: 35 dage vs. lovet 21"

---

## ✅ hvad-er-pluk-og-pak.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: 60 vs. 110 linjer/time = 400 linjer tabt/dag per medarbejder
- "Det går galt": ingen scanning, tilfældig plukrute, pakstation flaskehals
- Økonomi: ~350 kr. direkte per pakkefejl, ~450-850 kr. inkl. LTV
- Handling: scan alt, 4-6 standardkasser, batch picking, adskil pluk/pak
- Edge case: emballage vælges frit → for store kasser = dyrere fragt

**Micro improvements:**
- Kunne tilføje konkret benchmark: "Fejlrate under 0,5% = god"

---

## ✅ hvad-er-reorder-point.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: 3 dages stockout = 10.800 kr. tabt + 1.680 kr. ekspresordre
- Formel: ROP = (dagligt salg × lead time) + safety stock
- "Det går galt": ROP ikke defineret, safety stock = 0, aldrig opdateret
- Handling: ROP per SKU, automatisk alarm, differentiér ordremængde, juster sæsonmæssigt
- Edge case: ét ROP for alle varianter → størrelse L løber tør

**Micro improvements:**
- Perfekt – ingen væsentlige forbedringer

---

## ✅ hvad-er-safety-stock.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: 5 stockouts/måned = 45.000 kr./måned tabt margin
- Formel: Z × stdev(dagligt salg) × sqrt(lead time)
- "Det går galt": samme safety stock hele året, beregnes på gennemsnit ikke variation
- Handling: beregn ikke gæt, differentier servicegrad per ABC, juster for sæson
- Edge case: for høj servicegrad på C-varer = dyrt og unyttigt

**Micro improvements:**
- Kunne tilføje konkret case: "A-vare med 95% servicegrad vs. C-vare med 85%"

---

## ✅ hvad-er-sku.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- Konkret: 8-12% af aktive SKU'er er ghost-SKU'er
- "Det går galt": dobbelt-SKU'er, ingen navnekonvention, slettes i stedet for arkiveres
- Handling: definer navnekonvention, én SKU = én lagerenhed, arkiver ikke slet
- Edge case: variant-attributter mangler i SKU → fejlpluk
- Formel: Aktiv SKU-ratio = aktive / totale × 100 (mål: over 85%)

**Micro improvements:**
- Intro kunne være mere konkret ("Du har 850 SKU'er, men kun 720 er aktive...")
- Kunne tilføje konkret navnekonvention-eksempel med før/efter

---

## ✅ hvad-er-warehouse-layout.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Hvorfor godkendt:**
- Konkret: 20% ekstra gangdistance = 400.000 kr./år (4 plukkere)
- "Det går galt": A-varer på historisk position, Golden Zone til tunge varer
- Handling: Golden Zone 80-160 cm, ABC-placering, envejstrafik, revider halvårligt
- Edge case: for smalle gangrækker → plukkere må side-steppe
- Konkret princip: A-varer nær pakstation, C-varer længst væk

**Micro improvements:**
- Kunne tilføje konkret case: "1.200 m² lager redesign → 35% gangdistance-reduktion"

---

## ✅ hvad-er-wms.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 10/10

**Hvorfor godkendt:**
- **FUNDAMENTALS-KRAV OPFYLDT:** Konkret WMS-definition med eksempel (modtagelse → placering → pluk)
- Konkret: 200 ordrer × 2% fejl = 500.000 kr./år
- "Det går galt": forkerte saldi, plukkefejl, ukendt placering, manuel afstemning
- Handling: rens stamdata, placeringssystem dag 1, scanning ikke valgfrit, cycle counting
- SmartPack: A* pathfinding, TSP-algoritmer, 1-2 dages opsætning
- Tydeligt hvornår det IKKE giver mening (under 20-30 ordrer/dag)

**Micro improvements:**
- Perfekt – benchmark for WMS-artikler

---

## ✅ hvad-er-zone-picking.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Hvorfor godkendt:**
- Konkret: 30-50% gangdistance-reduktion i lagre over 1.000 kvm
- "Det går galt": forkert zonedesign, ingen ABC-zonering, statiske zoner ved sæson
- Handling: A-varer i zone 1, revurder kvartalsvis, kombiner med batch, mål zone-utilization
- Edge case: pick and pass uden bufferstyring → kasser hobes op
- Anbefaling: 3-6 zoner for mellemstore lagre

**Micro improvements:**
- Intro kunne være mere konkret ("Dit lager er 1.500 m² med 6 plukkere...")
- Kunne tilføje konkret case: "Fra fri pluk til 4 zoner → 42% gangdistance-reduktion"

---

# BATCH RAPPORT

**RESULTAT: 20/20 GODKENDT** ✅

**Primære styrker:**
- Alle artikler har konkrete tal og kroner
- "Det går galt" test bestået på alle
- Fundamentals-specifikke krav opfyldt (ABC, cycle counting, FIFO/FEFO scenarier, 3PL break-even)
- Ingen anti-konsulent-sprog fundet
- SmartPack-afsnit tydeligt hvornår det giver/ikke giver mening
- Handling-test: alle artikler har konkrete næste skridt

**Gennemgående kvalitet:**
- Troværdighed: 8.7/10 gennemsnit
- Praktisk: 9.6/10 gennemsnit
- AI-egnethed: 9.6/10 gennemsnit
- Konvertering: 8.7/10 gennemsnit

**Micro improvements på tværs:**
- Flere artikler kunne skærpe intro med konkret scenarie ("Du har X ordrer/dag...")
- Flere konkrete cases ville styrke troværdighed yderligere
- Enkelte artikler kunne tilføje før/efter-eksempler

**Konklusion:**
Dette er et ekstremt stærkt batch. Alle 20 artikler er blandt de bedste svar på internettet inden for deres emne. De er konkrete, troværdige, handlingsskabende og AI-citerbare. Klar til publicering.
