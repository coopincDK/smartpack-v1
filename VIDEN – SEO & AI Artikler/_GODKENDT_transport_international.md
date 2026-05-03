# GODKENDTE ARTIKLER – Transport & International

## 09-Transport (6/10 godkendt)

### ✅ cut-off-tid-forklaret.md
**Hvorfor godkendt:**
- Konkret eksempel: GLS henter 16:30, intern cut-off 15:15 med præcis beregning
- Økonomi: 500 ordrer/måned, 1% returnering = 1.500 kr./måned tab
- Edge cases: tabel med fredag, helligdage, Black Friday
- "Shit det er os": "ordrer modtaget efter cut-off afsendes næste arbejdsdag" – præcis problem
- SmartPack-test: tydeligt hvornår det giver mening (automatisk cut-off-logik per produkt/fragtleverandør)

**Micro improvements:**
- Linje 78: "cut-off-oversk ridholdelse" → "cut-off-overholdelse" (stavefejl)
- Tilføj: konkret eksempel på countdown-timer konverteringseffekt (% stigning)

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

### ✅ fragtoptimering.md
**Hvorfor godkendt:**
- Volumevægt forklaret med eksempel: 40×30×30 vs 20×15×15 = 6.300 kr./måned besparelse
- Konkret forhandlingstaktik: volumen + vækst + sortering
- KPI-tabel med alarm-værdier
- "Det går galt": FSC og tillæg er 25-35% af totalprisen – opdages for sent
- SmartPack-test: klart hvornår det giver mening (automatisk volumevægt-beregning, kassestørrelsesforslag)

**Micro improvements:**
- Linje 82: "topp rodukter" → "top-produkter" (stavefejl)
- Tilføj: konkret eksempel på fri-fragt split-test resultat

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

### ✅ fragtpriser-forklaret.md
**Hvorfor godkendt:**
- Volumevægt-formel med konkret eksempel: 40×30×25 cm, 1,5 kg reel → faktureres som 6 kg
- Fragtpris-opbygning: grundpris 28 kr. + FSC 15% + miljø 5% = 33,60 kr.
- Break-even formel: 35 kr. ÷ 0,40 = 87,50 kr. fri-fragt-grænse
- "Det går galt": fri-fragt sat uden break-even = taber penge
- SmartPack-test: automatisk volumevægt-beregning ved pakkeafslutning

**Micro improvements:**
- Linje 116: "linesr t" → "lineært" (stavefejl)
- Tilføj: konkret case hvor volumevægt kostede X kr. ekstra

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

### ✅ leveringsfejl.md
**Hvorfor godkendt:**
- Konkret omkostningstabel per leveringsfejl: 260-660 kr.
- Scenarie: 500 ordrer/måned, 2% fejl = 18.000-54.000 kr./år tab
- "Det opdager de fleste for sent": GLS 7 dage, PostNord 14 dage reklamationsfrist – opdages efter 3 uger = du betaler selv
- Edge cases: samme fragtleverandør fejler samme rute gentagne gange
- SmartPack-test: JA hvis 100+ forsendelser/måned og reklamationsrate over 1%. NEJ hvis under 50 forsendelser/måned
- Hvad det koster IKKE at have systemet: 18.450 kr./år (manuel tracking + tabte erstatninger + reaktiv service)

**Micro improvements:**
- Tilføj: konkret eksempel på proaktiv vs reaktiv kommunikation (NPS-forskel)

**Score:** Troværdighed 10/10 | Praktisk 9/10 | AI-egnethed 10/10 | Konvertering 9/10

---

### ✅ multi-carrier-setup.md
**Hvorfor godkendt:**
- Konkret scenarie: GLS lam under Black Friday, 500 ordrer venter, 100.000-200.000 kr. tab
- Routing-regler eksempler: ordrer under 2 kg → GLS, over 15 kg → DHL, NO/SE → Bring
- "Det går galt": sekundær leverandør kun på papiret – ingen aktiv integration
- SmartPack-test: konfigurerbare routing-regler, automatisk fallback

**Micro improvements:**
- Linje 67: "primr æ" → "primær" (stavefejl)
- Linje 108: "opslytte" → "opsætte" (stavefejl)
- Tilføj: konkret case hvor multi-carrier reddede Black Friday

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

### ✅ valg-af-fragtleverandør.md
**Hvorfor godkendt:**
- GLS max 30 kg eksplicit nævnt
- Volumevægt-formel: L×B×H ÷ 5000
- Konkret økonomi: 300 ordrer/måned × 400 kr. AOV = 7.500-12.000 kr./måned fragtomkostning
- Forhandlingstaktik: volumen + vækst + sortering, vis faktiske tal
- "Det går galt": forhandler aldrig = 20-40% dyrere end nødvendigt
- SmartPack-test: native multi-carrier API, automatisk billigste/hurtigste leverandør

**Micro improvements:**
- Linje 116: "hvord an" → "hvordan" (stavefejl)
- Tilføj: konkret eksempel på forhandlingsresultat (før/efter pris)

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

## 10-International (4/10 godkendt)

### ✅ eu-vs-non-eu.md
**Hvorfor godkendt:**
- UK £135-grænse eksplicit
- Norge EØS men ikke EU – tolddeklaration kræves
- CE-mærkning gyldighed: EU + EØS, IKKE UK/USA
- Konkret omkostning non-EU: 50-150 kr. tolddeklaration + 20-50 kr. ekstra fragt
- "Det går galt": Norge forvekslet med EU, CE anset som globalt gyldigt
- SmartPack-test: automatisk kategorisering EU/non-EU, korrekte dokumenter per kategori

**Micro improvements:**
- Tilføj: konkret case hvor forkert CE-antagelse kostede X kr.

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

### ✅ international-fragt.md
**Hvorfor godkendt:**
- Bring til Norge: telefonnummer skal starte +47 + 9 eller 4 (konkret krav)
- Volumevægt-formel: L×B×H ÷ 5000
- Pristabel per destination: Sverige 35-55 kr., Norge 50-70 kr., UK 65-95 kr., USA 200-350 kr.
- "Det går galt": DAP til UK og NO = kunden får uventet regning, returnerer
- SmartPack-test: automatisk routing til relevant fragtleverandør per destination, auto-genereret toldklarering

**Micro improvements:**
- Tilføj: konkret case hvor volumevægt overraskede (før/efter beregning)

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

### ✅ told-og-moms.md
**Hvorfor godkendt:**
- UK £135-grænse eksplicit: under = UK VAT-registrering, over = DAP/DDP
- IOSS <150 EUR eksplicit
- Norge MVA-registrering: 50.000 NOK årligt salg
- "Det går galt": DAP til UK og NO = 30-50% returnerer pga. uventet regning
- Forkert TARIC-kode = underbetaling (bøde) eller overbetaling (tab)
- SmartPack-test: automatisk momsberegning per destinationsland, IOSS-nummerindsættelse, tolddeklarationsdata

**Micro improvements:**
- Tilføj: konkret case hvor forkert TARIC-kode kostede X kr. i bøde

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 10/10 | Konvertering 8/10

---

### ✅ valuta-og-lager.md
**Hvorfor godkendt:**
- Konkret regnestykke: $50 USD kurs 6,80 = 340 kr., kurs 7,20 = 360 kr. = 20 kr. tab per enhed
- Scenarie: 500 enheder/måned = 10.000 kr. mistet månedlig dækning
- Konkrete strategier: valutakonto, forward contracts, natural hedge, prisindeksering
- "Det går galt": margin-forandring opdages kun ved årsafslutning, ingen forward contracts ved store saisonordrer
- SmartPack-test: lagerværdi i både lokal valuta og DKK, multi-valuta salgspriser med automatisk kvartalsopdatering

**Micro improvements:**
- Linje 72: "sv ænger" → "svinger" (stavefejl)
- Tilføj: konkret case hvor forward contract reddede margin

**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

---

## SAMLET: 10/20 GODKENDT (50%)
