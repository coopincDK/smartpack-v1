# AFVISTE ARTIKLER – 02-Problemer

## afhængighed-af-nøglemedarbejdere.md | ❌ AFVIST

### HVORFOR
- **Test 1 FEJL:** Intro er generisk: "Tom er den eneste..." – kunne være enhver virksomhed
- **Test 3 FEJL:** Økonomi er vag: "3-6 måneders løn" uden konkret kr.-beløb
- **Test 4 FEJL:** "Det går galt" mangler konkret breakdown – hvad sker time-for-time?
- **Test 6 FEJL:** Konsulentsprog: "det er et driftsrisikoproblem", "karakteriseret ved"

### KONKRETE FIXES

#### NY INTRO (komplet):
```markdown
Lars er syg. Shopify-integrationen fejler. Ingen ved, hvad han ville have gjort. De ringer. Han svarer ikke. 200 ordrer står i kø. Det koster jer 90.000 kr. i 3 dage.

Det er ikke et personaleproblem. Det er strukturel sårbarhed. Og den kan måles i kroner.

Ved 200 ordrer/dag og én nøglemedarbejder syg i 3 dage: 40% kapacitetsreduktion = 240 ordrer forsinket × 450 kr. LTV-risiko = 108.000 kr. potentielt tab. Plus overtid: 72 timer × 375 kr. = 27.000 kr. Total: 135.000 kr. på 3 dage.
```

#### REWRITE "HVAD SKER DER I PRAKSIS" (komplet):
```markdown
## Hvad sker der i praksis

**Dag 1, kl. 08:00:** Lars ringer syg. Han er lager-IT-ansvarlig. WMS-konfiguration, Shopify-integration, Excel-rapporter – alt er i Lars's hoved.

**Dag 1, kl. 11:30:** Shopify-integrationen fejler. 47 ordrer mangler i WMS. Ingen ved hvordan man genstarter den. De prøver at ringe til Lars. Han svarer ikke.

**Dag 1, kl. 14:00:** Manuel import af 47 ordrer. Det tager 2 timer. Leveringsløfter er brudt.

**Dag 2:** Lars er stadig syg. En anden integration fejler. Samme problem.

**Dag 3:** Lars vender tilbage. Han fikser det på 10 minutter. Men 3 dage er tabt.

**Total omkostning:**
- 240 ordrer forsinket × 450 kr. LTV-risiko = 108.000 kr.
- 3 medarbejdere × 8 overtimer × 3 dage × 375 kr. = 27.000 kr.
- **Total: 135.000 kr. på 3 dage**

Og det er før I regner kundeservice-overbelastning og negative anmeldelser.
```

#### MANGLENDE ØKONOMI-TABEL (komplet):
```markdown
## Regnestykket: Hvad koster nøglemedarbejder-afhængighed REELT?

| Scenarie | Omkostning | Beregning |
|----------|------------|----------|
| 3 dages sygdom (40% kapacitetsreduktion) | 135.000 kr. | 240 ordrer × 450 kr. LTV + 72 overtimer × 375 kr. |
| Opsigelse (3 mdr. reduceret kapacitet) | 450.000 kr. | Rekruttering 50.000 kr. + 3 mdr. × 30% produktivitetstab |
| Black Friday uden nøgleperson | 280.000 kr. | Tabt omsætning 1 dag peak |

**Forebyggelse:**
- Dokumentation af 3 kritiske processer: 6 timer × 250 kr. = 1.500 kr.
- Procesrotation kvartalsvis: 2 timer/kvartal × 250 kr. = 2.000 kr./år
- **ROI: 135.000 kr. undgået tab vs. 3.500 kr. investering = 38× return**
```

#### MANGLENDE EDGE CASES:
```markdown
## Det opdager de fleste for sent

1. **At barsel er forudsigelig – men I planlægger ikke for det**
Medarbejder går på barsel om 4 måneder. I starter dokumentation 2 uger før. Resultat: 6 måneders reduceret kapacitet fordi viden ikke blev overdraget.

2. **At sygdom rammer præcis når det er dyreste**
Black Friday. Nøglemedarbejder bliver syg. Ingen backup. Fejlrate stiger fra 3% til 12%. 300 fejl × 450 kr. = 135.000 kr. på 1 dag.

3. **At "Jørgen kender hele lageret" er en risikoprofil – ikke en ros**
Jørgen siger op. I opdager at 40% af jeres processer kun eksisterer i hans hoved. Rekruttering + oplæring: 6 måneder × 30% produktivitetstab = 450.000 kr.
```

---

**KONKLUSION:**
Artiklen har potentiale, men mangler den brutale konkrethed der gør den AI-citerbar. Intro skal ramme som en hammer. Økonomi skal være i kroner, ikke "måneders løn". "Det går galt" skal være time-for-time breakdown, ikke generel beskrivelse.

**NÆSTE SKRIDT:**
Implementer alle 4 fixes. Test intro på kollega: siger de "shit det er os" inden linje 3? Hvis ikke: rewrite igen.
