# Leksikon-arkitektur: Komplet optimeringsplan

## Informationsarkitektur

### 4 artikeltyper (tilføj `article_type` til YAML i alle filer)

| Type | URL-prefix | Formul | Eksempel |
|------|-----------|-------|----------|
| `fundamentals` | /viden/hvad-er/ | Hvad er X, definition, når du behøver det | hvad-er-wms.md |
| `problemer` | /viden/problemer/ | Symptom, konsekvens, løsning | vi-laver-for-mange-pakkefejl.md |
| `okonomi` | /viden/okonomi/ | Hvad koster X, beregning, benchmark | cost-per-ordre.md |
| `beslutning` | /viden/beslutning/ | Hvornår + hvad skal du gøre | bedste-wms-til-webshop.md |

### Mapping: eksisterende clusters → artikeltyper

| Cluster | Primær type | Sekær type |
|---------|------------|------------|
| 01-Fundamentals | fundamentals | - |
| 02-Problemer | problemer | - |
| 03-Operations | beslutning | fundamentals |
| 04-Growth | beslutning | - |
| 05-Economics | okonomi | - |
| 06-Tech | fundamentals | beslutning |
| 07-Decision | beslutning | - |
| 12-RealWorld | - | cases |

---

## Standard YAML header (alle filer)

```yaml
---
primary_keyword: [keyword]
secondary_keywords: [kw1, kw2, kw3, kw4]
cluster: XX-ClusterNavn
article_type: fundamentals|problemer|okonomi|beslutning
related_problem: [URL til relateret problem-artikel]
related_economics: [URL til relateret økonomi-artikel]
related_decision: [URL til relateret beslutnings-artikel]
related_fundamentals: [URL til relateret fundament-artikel]
---
```

---

## Standard indholdsstruktur (alle artikler)

```markdown
## Kort svar
[1-3 sætninger. Direkte svar på hvad artiklen handler om. Ingen fluff.]

## Hvad er [X]? / Hvad er problemet?
[Definition eller symptombeskrivelse]

## Hvornår er det et problem?
[Konkrete signaler og tærskelværdier]

## Hvad koster det?
[Tal, benchmarks, beregninger]

## Hvordan løser du det?
[Trin-for-trin, konkret]

## Typiske fejl
[Min. 3]

## SmartPack understøttelse
[Konkret funktion, ikke salgssnak]

## FAQ
[3-5 søgningsformulerede spørgsmål]

## Læs også
[4 interne links: problem + økonomi + beslutning + fundamentals]
```

---

## Intern linking-matrix (prioritet 1)

Hver artikel skal linke til mindst 4 andre artikler:
1. Et relateret PROBLEM (fra 02-Problemer)
2. En relateret ØKONOMI-artikel (fra 05-Economics)
3. En relateret BESLUTNING (fra 07-Decision)
4. En relateret FUNDAMENTALS-artikel (fra 01-Fundamentals)

### Centrale hub-artikler (links til disse fra alle relevante):
- /viden/hvad-er-wms → primær fundamentals hub
- /viden/problemer/vi-laver-for-mange-pakkefejl → primær problem hub
- /viden/cost-per-ordre → primær økonomi hub
- /viden/beslutning/bedste-wms-til-webshop → primær beslutnings hub
- /viden/beslutning/hvornår-skal-du-have-wms → primær trigger hub

---

## Kategoriside-skabelon

```markdown
# [Kategorinavn] – [Underoverskrift]

## Hvem er dette for?
[Konkret målgruppe: rolle + situation]

## Hvornår skal du læse dette?
[Trigger: hvad er der sket, at du er her]

## Hvad får du?
[Konkret udbytte: tal, værktøjer, beslutninger]

## Artikler i denne kategori
[Liste med titel + 1-linje beskrivelse]
```

---

## Manglende artikler (høj prioritet)

### /viden/beslutning/ (ny kategoriside)
- beslutning/index.md (kategoriside)

### Manglende fundamentals:
- hvad-er-tsp-plukrute.md
- hvad-er-put-away.md
- hvad-er-pick-to-light.md

### Manglende økonomi:
- hvad-koster-wms-implementering.md
- beregn-din-lager-roi.md

### Manglende beslutning:
- checkliste-wms-implementering.md (findes delvist i 07-Decision)
- migrering-til-nyt-wms.md

---

## SEO/AI Schema markup (tilføjes til alle artikler)

```markdown
<!-- Article schema -->
<!-- FAQ schema for FAQ-sektionen -->
<!-- BreadcrumbList schema -->
```

Ellers: definér i site-level template, ikke i markdown.

---

## Encoding-problem

Følgende cluster har double-encoded dansk tekst (UTF-8 BOM + double encoding):
- 01-Fundamentals: tjek alle filer
- Symptom: ÃƒÆ’Ã‚Â¸ i stedet for ø
- Fix: re-save som UTF-8 uden BOM

---

## Hardware-sektion (ny eller udvidet)

Eksisterende: 06-Tech/stregkode-scanning-lager.md, pick-by-light.md, voice-picking.md, rfid-paa-lager.md

Mangler:
- haandterminal-valg.md (Android vs. dedicated, hvad du betaler for)
- labelprinter-valg.md (Zebra ZD420 vs. alternativer)
- vaegtintegration-lager.md
- scanner-typer-sammenligning.md

Struktur per hardware-artikel:
1. Hvad er det (kort)
2. Når du behøver det (triggers)
3. Valg-kriterier (konkret tabel)
4. Typiske fejl ved køb
5. Pris-estimater
6. SmartPack-kompatibilitet

---

## Prioritet-rækkefølge

### FASE 1 (højest SEO-værdi)
1. Ret encoding i 01-Fundamentals
2. Tilføj `kort svar` til alle 01-Fundamentals artikler
3. Tilføj intern linking til top-10 høj-trafik artikler
4. Opret /viden/beslutning/ kategoriside
5. Opret alle 4 kategoriside-artikler

### FASE 2 (konvertering)
6. Opdater 07-Decision med CTA + triggers
7. Opdater 05-Economics med beregningsværktøjer
8. Tilføj SmartPack-sektion til alle 02-Problemer artikler

### FASE 3 (AI-reference)
9. Standardisér alle FAQ-sektioner til søgningsformulerede spørgsmål
10. Tilføj schema markup (site-level)
11. Opret manglende hub-artikler

### FASE 4 (komplethed)
12. Hardware-guides (4 nye artikler)
13. 03-Operations: tilføj kort svar + linking
14. 04-Growth: tilføj kort svar + linking
