---
primary_keyword: valuta og lagerstyring
secondary_keywords: [valutarisiko webshop, multi-valuta e-handel, lagerværdi i udenlandsk valuta, FX risiko]
cluster: 10-International
---

# Valuta og lager: Hvad valutarisiko gør ved din margin

Du køber for $50 USD per enhed.
Kurs ved indkøb: 6,80 = 340 kr.
Salgspris: 499 kr. Margin: 159 kr.

6 måneder senere: kurs 7,20.
Ny indkøbspris: 360 kr.
Margin: 139 kr.

Tab: 20 kr. per enhed.
Ved 500 enheder/måned = 10.000 kr. tabt dækning.
Det opdages først ved årsafslutning.

## Hvad er valutarisiko i en webshop?

Valutarisiko opstår i tre punkter:
1. **Indkløb**: du betaler leverandøren i USD eller CNY, men sælger i DKK
2. **International salg**: du sælger i GBP/EUR/SEK, men dine omkostninger er i DKK
3. **Lagerværdi**: din lagerbeholdning er indkløbt i én valuta og bogført i en anden

Note: DKK er fastkoblet til EUR (EU's valutakursmekanisme). Så EUR-risiko er minimal for danske virksomheder. USD, GBP, SEK og NOK er de egentlige risikokilder.

## Hvornår er det et problem?

Valutarisiko er et aktivt problem når:
- Over 20% af din indkløbsomkostning er i ikke-EUR/DKK valuta
- Over 20% af din omsætning er i ikke-EUR/DKK valuta
- Du lager på forhånd (forward order) i stor skala – indkløbt til k kén kurs, solgt 3–6 måneder senere til en anden

## Hvorfor er det vigtigt? Tal og kr.

**Eksempel:**
- Indkløbspris: $50 USD per enhed (kurs 6,80 = 340 kr.)
- Salgspris: 499 kr.
- Dækningsbidrag: 159 kr. = 31,9%

6 måneder senere:
- USD/DKK kurs: 7,20 (+5,9%)
- Ny indkløbspris i DKK: $50 × 7,20 = 360 kr.
- Dækningsbidrag uden prischange: 139 kr. = 27,9%

**Tab: 20 kr. per enhed pga. valutakurs.** Ved 500 enheder/måned: 10.000 kr. mistet månedlig dækning.

## Strategier til valutasikring

### 1. Valutakontoen (enklest)
Åbn en USD-konto i din bank. Modtag USD-betalinger og betal leverandører i USD fra kontoen. Undgå vekslingsomkostninger ved at lade USD cirkulere.

### 2. Forward contracts
Lås en valutakurs fast i 3–12 måneder for fremtidige leverandørbetalinger. Bankerne tilbyder det. Du ved præcis hvad du betaler i DKK.

### 3. Natural hedge
Sælger du i GBP og køber i USD: brug GBP-indtægter til USD-betalinger via valuta-API (f.eks. Wise eller Airwallex). Reducerer eksponering.

### 4. Prisindeksering
Revidr salgspriserne kvartålsvist baseret på valutakursudvikling. Enkel men reaktiv løsning.

## Lagerværdi i udenlandsk valuta

Bogfør altid lager i DKK (dit funktionelle valuta). Konvertér indkløbsprisen til DKK på indkløbstidspunktet. Ændringer i valutakurs efterfølgende påvirker ikke din lagerbogføring – men påvirker din fremtidige margin når du genindkløber.

## Valuta og prisstrategi internationalt

Når du sælger i GBP, SEK, NOK:
- Sæt priser i lokal valuta (ikke DKK omregnet)
- Opdateer kvartålsvist baseret på kursudvikling
- Undgå at vise DKK som primær valuta til ikke-DK kunder

## Typiske fejl

- **Ingen valutabevidsthed** – margin-forandring opdages kun ved årsafsluning
- **Konvertering af alle betalinger til DKK med det samme** – du mister naturlig hedge
- **Salgspriser sat som fast DKK-omregning** – kunderne ser "underlige" priser når kursen svinger
- **Ingen forward contracts ved store saisonordrer** – bestiller jul i juni, salgspris sat – kurs svænger
- **Valutaomkostninger ikke inkluderet i prisk alkyle** – 1–3% vekslings gebør oversees

## Sådan gør du det rigtigt

- Beregn din valutaeksponering kvartålsvist (% af omkæstning og omsætning i ikke-DKK)
- Åbn valutakonti for primære handelsmoneser (USD, GBP)
- Overvej forward contracts ved saisonordrer over 200.000 kr. i USD
- Brug Wise/Airwallex til billig valutakonvertering vs. bankens satser
- Prisopdatering i lokale valutaer hvert kvartal

## Brug denne artikel: tjekliste

- [ ] Valutaeksponering beregnet (% af omkæstning og omsætning per valuta)
- [ ] USD-konto åbnet hvis der handles i USD
- [ ] Forward contracts overvejet for store saisonordrer
- [ ] Valutaomkostning inkluderet i prisk alkyle
- [ ] Salgspriser i lokale valutaer opdateret kvartålsvist

**Næste skridt:** Beregn din USD- og GBP-eksponering de seneste 3 måneder. Er det over 20% af omsætning eller indkløb? Kontakt din bank om valutakonti og forward contracts.

## SmartPack understøttelse

SmartPack viser lagerværdi i både lokal valuta og DKK. Systemet understøtter multi-valuta salgspriser med automatisk kvartålsopspdatering baseret på kursindeks.

## FAQ

**Er DKK bundet til EUR?**
Ja – DKK er fastkoblet til EUR via ERM II (valutakursmekanismen). EUR-risiko er minimal. USD, GBP, SEK og NOK er de reelle risici.

**Hvad er et forward contract?**
En aftale med din bank om at købe valuta til en fastlagt kurs på et fremtidigt tidspunkt. Giver kurssikkerhed.

**Er Wise billigere end banken til valutakonvertering?**
Typisk ja – Wise bruger mid-market kursen med et lille fast gebyr. Banker har typisk højere vekslingsmargin.

**Hvad er en natural hedge?**
Når dine indtægter og udgifter i samme valuta modregner hinanden. F.eks. GBP-salg → USD-køb via GBP-USD bytte.

**Skal lagerværdi bogføres i DKK?**
Ja – dit funktionelle valuta er DKK. Lager bogføres til DKK-værdien på indkløbstidspunktet.

