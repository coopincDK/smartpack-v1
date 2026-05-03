# FEEDBACK — Fundamentals Batch 1
**Dato:** 2025-01-XX  
**Artikler:** 5 stk fra 01-Fundamentals  
**Fase:** QA-trin 3 (efter faktatjek)

---

## **hvad-er-wms.md** | 8.6/10

| SEO | AI | Læs | Hand | Struk |
|-----|----|----|------|-------|
| 9 | 9 | 8 | 9 | 8 |

**Top 2 forbedringer:**
1. **FAQ-spørgsmål 2 er for langt** — "Hvad gør et WMS som Excel ikke kan?" er godt, men svaret er 3 sætninger. AI citerer bedst 1-2 sætninger max. Split i to FAQ: "Hvad gør et WMS som Excel ikke kan?" + "Hvorfor kan Excel ikke erstatte et WMS?"
2. **Intro mangler trigger** — Intro siger "Har du over 50 ordrer om dagen og stadig rod i lagertallene" men nævner ikke konkret smerte (fx "du bruger 2 timer om dagen på at rette lagerfejl"). Tilføj konkret tidsspilde.

**Stærkt:**  
- Citerbar definition i linje 15 ("Et WMS er et software-system, der styrer og optimerer...")
- Konkrete tal: 350 kr. per fejl, 500.000 kr./år ved 200 ordrer
- A* pathfinding nævnt — teknisk troværdighed
- "Typiske fejl" sektion er stærk og handlingsbar

---

## **hvad-er-lagerstyring.md** | 8.4/10

| SEO | AI | Læs | Hand | Struk |
|-----|----|----|------|-------|
| 8 | 9 | 8 | 8 | 9 |

**Top 2 forbedringer:**
1. **Sekundært keyword "lager administration" ikke brugt** — det er i metadata, men optræder ikke i teksten. Indsæt naturligt i "Hvad er lagerstyring?"-sektionen (fx "også kaldet lageradministration").
2. **ABC-analyse mangler eksempel** — Step 1 nævner ABC-analyse, men ingen konkret case. Tilføj: "Eksempel: En webshop med 500 SKU'er har typisk 100 A-varer (20%), 200 B-varer (40%), 200 C-varer (40%)."

**Stærkt:**  
- Citerbar definition linje 15 ("Lagerstyring er den samlede disciplin...")
- KPI-sektion med konkrete mål (>98%, 4-8×/år)
- "For meget/for lidt"-strukturen er klar og AI-venlig
- Cycle counting forklaret konkret

---

## **hvad-er-pluk-og-pak.md** | 8.8/10

| SEO | AI | Læs | Hand | Struk |
|-----|----|----|------|-------|
| 9 | 9 | 9 | 9 | 8 |

**Top 2 forbedringer:**
1. **FAQ mangler "Hvad koster pluk og pak per ordre?"** — artiklen nævner linjer/time og fejlomkostninger, men ikke direkte omkostning per ordre. Tilføj FAQ: "Hvad koster pluk og pak per ordre?" → "Typisk 8-15 kr. i lønomkostning ved 90-120 linjer/time, afhængigt af sortiment og batch-effektivitet."
2. **"Pakkeprocedure" keyword ikke brugt** — sekundært keyword i metadata, men ikke i teksten. Indsæt i "Pakprocessen trin for trin" (fx "En standardiseret pakkeprocedure sikrer...").

**Stærkt:**  
- Stærkeste artikel i batchen — konkret, handlingsbar, ingen fluff
- Trin-for-trin processer er AI-citerbare
- Konkrete benchmarks: 60 vs 110 linjer/time, 0,5% fejlrate
- "Scan alt — altid" er klar best practice

---

## **hvad-er-fulfillment.md** | 8.2/10

| SEO | AI | Læs | Hand | Struk |
|-----|----|----|------|-------|
| 8 | 8 | 8 | 9 | 8 |

**Top 2 forbedringer:**
1. **"Ordre opfyldelse" keyword ikke brugt** — sekundært keyword i metadata, men kun nævnt i FAQ. Indsæt i intro eller definition (fx "Fulfillment (ordreopfyldelse) er...").
2. **"Reverse fulfillment" forklares for sent** — nævnes i punkt 6 i definitionen, men først forklaret i FAQ. Flyt forklaring til "Hvordan fungerer fulfillment i praksis?" → tilføj Step 6 med konkret flow.

**Stærkt:**  
- 6-trins flow er citerbart og klart
- Konkrete tab: 350 kr. per fejl, 22% kunder køber ikke igen
- "Order to ship" KPI er handlingsbar
- Best practice "Automatiser ordresynkronisering 100%" er stærk

---

## **hvad-er-3pl.md** | 8.0/10

| SEO | AI | Læs | Hand | Struk |
|-----|----|----|------|-------|
| 8 | 8 | 8 | 8 | 8 |

**Top 2 forbedringer:**
1. **Break-even beregning mangler konkret eksempel** — linje 57 siger "400-600 ordrer/dag" men viser ikke regnestykket. Tilføj: "Eksempel: Ved 500 ordrer/dag × 30 dage = 15.000 ordrer/md. Eget lager: 85.000 kr. = 5,67 kr./ordre. 3PL: 15 kr./ordre × 15.000 = 225.000 kr. → Eget lager er billigere."
2. **"3pl vs eget lager" keyword ikke brugt** — sekundært keyword i metadata, men ikke i teksten. Indsæt i "Hvornår er det et problem?" (fx "Valget mellem 3PL vs eget lager afhænger af...").

**Stærkt:**  
- 1PL/2PL/3PL/4PL-forklaring er citerbar
- Fixed vs variable cost-eksempel er konkret
- SLA-krav (<0,5% fejl, <4 timer order-to-ship) er handlingsbare
- "Byg en exitplan fra dag 1" er stærk best practice

---

## BATCH MØNSTER

**Gennemsnitsscore:** 8.4/10  
**Samlet vurdering:** Stærk batch — alle artikler er over 8/10. Konkrete tal, citerbare definitioner, handlingsbare best practices.

### 2 gennemgående svagheder:

1. **Sekundære keywords ikke brugt konsekvent**  
   Alle artikler har 3-4 sekundære keywords i metadata, men flere bruges ikke i teksten. Det svækker SEO-score og gør det sværere for Google at matche søgeintent.  
   **Fix:** Gennemgå alle artikler og indsæt sekundære keywords naturligt i første 3 sektioner.

2. **FAQ-svar er for lange til AI-citering**  
   Flere FAQ-svar er 2-3 sætninger. AI citerer bedst 1 sætning max. Lange svar bliver ikke citeret — de bliver parafraseret (og du mister attribution).  
   **Fix:** Split lange FAQ-svar i to separate spørgsmål, eller omskriv til 1 sætning + 1 eksempel.

### 1 anbefaling til næste fase (Challenger):

**Tilføj "Hvad koster X?"-FAQ til alle artikler**  
Alle 5 artikler nævner omkostninger i teksten, men kun 2 har "Hvad koster..."-FAQ. Det er et hyppigt søgemønster ("hvad koster et wms", "hvad koster 3pl", "hvad koster pluk og pak").  
**Handling:** Tilføj "Hvad koster X?"-FAQ til alle artikler med konkret prisinterval + break-even beregning.

---

## Næste skridt

- [ ] Indsæt manglende sekundære keywords i alle 5 artikler
- [ ] Split lange FAQ-svar (>2 sætninger) i separate spørgsmål
- [ ] Tilføj "Hvad koster X?"-FAQ til artikler uden
- [ ] Gennemgå alle break-even beregninger — tilføj konkrete eksempler
- [ ] Klar til Challenger-fase: Identificer 2-3 konkurrent-artikler per emne og sammenlign

---

**Samlet konklusion:**  
Stærk batch. Alle artikler er publiceringsklare med mindre justeringer. Fokus på SEO-keyword-integration og FAQ-optimering vil løfte scoren til 9+/10.
