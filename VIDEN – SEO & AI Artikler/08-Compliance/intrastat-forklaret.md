---
primary_keyword: Intrastat forklaret
secondary_keywords: Intrastat indberetning, EU handel statistik, Intrastat grænse 2025, varehandel EU
cluster: 08-Compliance
---

# Intrastat forklaret: EU-handelsstatistik for webshops

Du rammer 12 mio. kr. i EU-eksport. Tillykke.

3 måneder senere: Danmarks Statistik sender påkrav. "Manglende Intrastat-indberetning. Bøde: 18.700 kr. + 5.000 kr. per manglende måned."

Du vidste ikke at der var en indberetningspligt. Systemet registrerede ikke at du krydsede tærsklen.

Total bøde: **33.700 kr.** for noget der tager 15 minutter/måned at indberette.

Intrastat er obligatorisk ved >11,3 mio. kr. EU-eksport. Ingen advarsler. Ingen påmindelser.

Her er hvad du skal vide – før du krydser tærsklen.

## Hvad er Intrastat?

Intrastat (Intra-Community Statistics) er et statistisk indberetningssystem for virksomheder der handler med varer inden for EU. Det erstatter toldangivelser for EU-intern handel (der ikke eksisterer for EU-lande).

Systemet administreres i Danmark af Danmarks Statistik (DST).

## Hvornår er du forpligtet til at indberette?

Der er tærskler for hvornår Intrastat-indberetning er obligatorisk:

**Danmark 2025:**
- **Eksport til EU-lande**: Over 11,3 mio. kr. per år
- **Import fra EU-lande**: Over 41 mio. kr. per år

Krydser du disse grænser: Du SKAL indberette Intrastat månedligt.

Bemærk: Disse grænser ændres løbende. Tjek altid Danmarks Statistiks aktuelle grænser.

## Hvornår er det et problem?

Det er et problem når:

**Scenarie 1: Vækst til Tyskland**  
Du sælger til tyske B2B-kunder. Januar–december 2024: 14,2 mio. kr. i salg til DE. Du opdager Intrastat-pligten i marts 2025. Danmarks Statistik kræver bagudrettet indberetning for 15 måneder. Din bogholder bruger 22 timer på at indhente data. Cost: 22 × 850 kr. = **18.700 kr.** + bøde 8.000 kr. = **26.700 kr.**

**Scenarie 2: Amazon FBA i Polen**  
Du sender varer til Amazon-lager i Polen. Det er udførsel til EU-land. Du troede det var "intern logistik". Det er Intrastat-pligtigt. 11 måneders manglende indberetning. Danmarks Statistik sender påkrav. Bøde: **12.000 kr.**

**Scenarie 3: Forkerte CN-koder**  
Du indberetter med 6-cifret HS-kode (fra leverandør). Intrastat kræver 8-cifret CN-kode. Danmarks Statistik afviser indberetningen. Du skal rette og genindberette. 8 timers arbejde = **6.800 kr.**

## Hvad koster manglende Intrastat-compliance?

**Scenarie: Opdager pligten 11 måneder for sent**

| Post | Beregning | Cost |
|------|-----------|------|
| Bagudrettet dataindsamling | 18 timer bogholder × 850 kr. | 15.300 kr. |
| Bøde fra Danmarks Statistik | Førstegangsovertrædelse | 8.000 kr. |
| Revisor-assistance | 6 timer × 1.200 kr. | 7.200 kr. |
| **TOTAL** | | **30.500 kr.** |

**Løsning:**
- Sæt alarm i regnskabssystem ved 80% af tærskel: 0 kr. (10 min setup)
- Gem CN-koder i varesystem: 0 kr. (inkluderet i SmartPack)
- Kvartalsvis tjek: 15 min × 4 = 1 time/år = 850 kr.

**ROI: 30.500 kr. undgået / 850 kr. investeret = 3.588% ROI**

## Hvad skal indberettes?

Per sending skal du indberette:
- **Varekode** (8-cifret CN-kode)
- **Transaktionstype** (salg, retur, leasing, osv.)
- **Oprindelsesland**
- **Bestemmelsesland**
- **Statistisk værdi** (forsendelsens handelværdi)
- **Nettovægt** (i kg)
- **Supplerende enhed** (for visse produktkategorier)

## Frister

Intrastat indberettes månedligt, typisk med deadline den 10.–20. i måneden efter. Tjek DST's aktuelle frister.

## Tarifkode vs. Intrastat-kode

Intrastat bruger CN-koder (8-cifret kombineret nomenklatur). Disse relaterer sig til:
- **HS-kode**: 6-cifret (international standard)
- **CN-kode**: 8-cifret (EU-specifik udvidelse)
- **TARIC-kode**: 10-cifret (EU-import)

For Intrastat bruges CN-koden. Det er vigtigt at bruge den korrekte kode – forkert kode er stadig en fejl.

## Hvem indberetter?

Typisk økonomiafdelingen eller regnskabskontoret. Men logistikafdelingen er nødvendig kilde til data: hvilke varer er sendt, til hvilke lande, i hvilke mængder?

Dit WMS bør kunne eksportere de nødvendige data til Intrastat-indberetning.

## Digital indberetning

Intrastat indberettes digitalt via Danmarks Statistiks portal (virk.dk/statistikindberetning). Systemet accepterer CSV-upload for store mængder.

## Typiske fejl

- **Ikke at registrere sig hos DST, når tærsklen krydses** – Opdager det 11 måneder for sent = 30.500 kr.
- **Indberetter med forsinkelse** – Bøde 8.000–15.000 kr.
- **Bruger forkerte varekoder (CN-koder)** – Afvist indberetning = 8 timers ekstra arbejde
- **Glemmer at indberetning gælder begge veje** – Import OG eksport skal indberettes separat
- **Tror at Intrastat kun gælder store virksomheder** – Ingen minimumstærskel for pligt

## Sådan gør du det rigtigt

1. **Sæt en automatisk alert når din EU-handel nærmer sig 80% af tærsklen** – 9,0 mio. kr. for eksport
2. **Sørg for at dit WMS/ERP kan generere Intrastat-rapporter automatisk** – SmartPack kan
3. **Tjek tærskler hvert år** – De ændres (senest opdateret: januar 2025)
4. **Implementér korrekte CN-koder i dit produktkatalog** – Gør det nu, ikke når pligten rammer
5. **Hav klar intern procedure** for hvem der indberetter og hvornår (deadline: 10. i måneden)

## SmartPack og Intrastat

SmartPack kan eksportere forsendelsesdata i format der understøtter Intrastat-indberetning, inkl. varekoder, mængder og destinationslande. Systemet kan sættes op til at advare når du nærmer dig tærsklen.

## FAQ

**Gælder Intrastat for B2B og B2C?**
Ja – begge typer EU-intern handel er inkluderet.

**Hvad med returvarer?**
Returvarer skal typisk indberettes som en separat transaktion (transaktionskode 21).

**Er der forskel på Intrastat for eksport og import?**
Ja – forskellige varekoder og krav. Import indberettes fra modtager, eksport fra afsender.

**Gælder Intrastat for UK efter Brexit?**
Nej – UK er ikke EU. UK-handel indberettes via toldangivelse, ikke Intrastat.

**Hvad med dropshipping til EU?**
Afhænger af setup. Konsultér din revisor for korrekt Intrastat-forpligtelse ved dropshipping-modeller.

