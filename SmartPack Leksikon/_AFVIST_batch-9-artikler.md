# AFVISTE ARTIKLER — Batch 9
## Komplet fix-liste klar til Reality Enforcer

---

## 3. ai-paa-lageret-2026.md ❌

### HVORFOR AFVIST:
- ANTI-KONSULENT TEST fejler: "Det er modent på tre områder" → for diplomatisk
- "DET GÅR GALT" TEST fejler: Ingen konkrete fejl-scenarier med AI-implementering
- KONKRET TEST svag: Mangler konkret case hvor AI gik galt
- SMARTPACK TEST fejler: Linje 78 nævner SmartPack men ikke hvornår det IKKE giver mening

### KONKRETE FIXES:

**NY INTRO (erstat linje 10):**
```markdown
Du har 150 daglige ordrer. En WMS-sælger viser dig "AI-powered demand forecasting" der lover 40% reduktion i stockouts. Prisen: 4.500 kr./måned. Du spørger: "Har I cases?" Han siger: "Vi har mange tilfredse kunder." Det er ikke et svar. Her er hvad der faktisk virker — og hvad der er spild af penge.
```

**TILFØJ EFTER LINJE 44 (ny sektion):**
```markdown
### Hvad der går galt med AI på lager

**Demand forecasting der ikke virker:**
En webshop med 400 SKU'er implementerede Inventory Planner. Efter 3 måneder: forecasting-nøjagtighed på 52%. Hvorfor? Ikke nok historisk data på 60% af SKU'erne. AI kræver minimum 12 måneders data per SKU. Nye produkter? AI gætter.

**Plukrute-optimering der gør det værre:**
Et lager implementerede AI-baseret plukrute-optimering uden at opdatere lokationskoder først. Resultatet: systemet optimerede ruter baseret på forkerte placeringer. Ekspeditionstid steg 15%. Problemet var ikke AI — det var data.

**Anomali-detektion der råber ulv:**
Et WMS med anomali-alerts sendte 40 notifikationer/dag. 38 var false positives. Efter 2 uger ignorerede alle dem. Da en reel fejl opstod (SKU placeret forkert), blev den overset.
```

**ERSTAT LINJE 78-79:**
```markdown
**Er SmartPack AI-baseret?**
SmartPack bruger algoritme-baseret plukrute-optimering (TSM) og real-time anomali-alerts. Det er ikke AI i marketing-forstand — det er veletableret operations research-matematik. Det virker fordi det er simpelt, deterministisk og ikke kræver machine learning-træning. SmartPack giver IKKE mening hvis du har under 30 daglige ordrer — gevinsten er for lille til at retfærdiggøre systemskift.
```

---

## 5. case-50-ordrer-dag.md ❌

### HVORFOR AFVIST:
- "DET GÅR GALT" TEST fejler: Mangler konkrete fejl-eksempler
- KONKRET TEST svag: "Fejlrate 1-2%" → hvad er den konkrete fejl?
- HANDLING TEST svag: "Skrevet SOP" → hvad står der i den?

### KONKRETE FIXES:

**ERSTAT LINJE 44-51 (Problem-sektionen):**
```markdown
## Hvad der går galt på dette niveau

**Fejl 1: Den forkerte pakke**
50 ordrer/dag uden scanning = 1-2 fejl/dag. Konkret: Kunde bestiller str. M, får str. L. Retur koster 80 kr. i fragt + 15 min håndtering = 142 kr. per fejl. 300 fejl/år = 42.600 kr.

**Fejl 2: Udsolgt uden at vide det**
Shopify siger 12 på lager. Der er 8. Fire kunder bestiller. Du kan ikke levere. Uden cycle counting opdager du det først når kunden klager. Løsning: ugentlig cycle count af top-20 SKU'er (15 min/uge).

**Fejl 3: Returvarer der forsvinder**
En retur ankommer. Den lægges i "retur-bunken". 3 dage senere: hvor blev den af? Den er ikke registreret, ikke krediteret, ikke genlagt. Kunden ringer. Du leder i 20 minutter. Løsning: fast returzone + daglig tømning.
```

**ERSTAT LINJE 63 (SOP):**
```markdown
**Investering 3: Skrevet SOP (0 kr.)**
Et A4-ark per kerneopgave:
- **Morgen-rutine:** Tjek ordrer → print labels → pluk A-varer først
- **Pluk-rutine:** Scan SKU → tjek antal → scan lokation → læg i kasse
- **Retur-rutine:** Scan ind → inspicer → godkendt? → genlæg + opdater lager
- **Modtagelse:** Scan leverance → tjek mod ordre → opdater lager → placer

En vikar skal kunne læse det og være produktiv på 2 timer.
```

---

## 8. pim-vs-wms.md ❌

### HVORFOR AFVIST:
- "SHIT DET ER OS" TEST fejler: Intro er for generisk
- "DET GÅR GALT" TEST svag: Linje 47 nævner problemet men ikke konsekvensen
- KONKRET TEST svag: Mangler konkret case
- ØKONOMI TEST fejler: Ingen kr./måned eller kr./år

### KONKRETE FIXES:

**NY INTRO (erstat linje 10):**
```markdown
Du opdaterer produktvægt i Shopify fra 450g til 380g (ny emballage). 3 måneder senere opdager du at fragtomkostningerne er 4.200 kr. højere end forventet. Hvorfor? Dit WMS bruger stadig 450g. Fragtsystemet beregner volumenvægt forkert. Du har betalt for 70g luft i 3 måneder på 2.400 pakker. Det er ikke en teknisk fejl. Det er manglende klarhed om hvem der ejer data.
```

**ERSTAT LINJE 47-49:**
```markdown
**Den mest almindelige fejl — og hvad det koster:**
Et produkt opdateres i PIM (ny vægt efter redesign af emballage: 450g → 380g). WMS opdateres ikke. Fragtpriser beregnes forkert.

**Konkret case:** 2.400 forsendelser over 3 måneder. Volumenvægt-beregning baseret på forkert vægt = 1,75 kr. for meget per pakke. Total tab: 4.200 kr. Opdaget først da nogen manuelt sammenlignede fakturaer.

**Løsning:** Ét system ejer produktmasterdata (typisk PIM eller ERP). WMS modtager ændringer via API inden for 24 timer. Manuel dobbelt-vedligeholdelse er ikke en løsning — det fejler altid.
```

**TILFØJ EFTER LINJE 64 (ny FAQ):**
```markdown
**Hvad koster et PIM?**
- **Shopify metafields:** 0 kr. (inkluderet)
- **Plytix (SMV-PIM):** fra 1.200 kr./måned
- **Akeneo (enterprise):** fra 15.000 kr./måned
- **Salsify:** fra 25.000 kr./måned

Under 500 SKU'er: brug Shopify. Over 1.000 SKU'er + markedspladser: invester i dedikeret PIM.
```
