# Julekalender status, 7. november 2026

Kampagne: "Venner af e-handel", julespillet Pakkepanik. Side: smartpack.dk/julekalender

## Hvor vi står
- Grenen `julekalender` findes ikke på GitHub. Det tidligere arbejde ligger kun på Martins Asus og er ikke pushet.
- Derfor er siden bygget forfra i skyen ud fra artifactet "Venner af e-handel" (claude.ai/artifact/UyUgLnHzesjiFxz2xk2sod) og playbooken "Julekalender 2026, fælles playbook".
- Commit: "feat: julekalender-side for Venner af e-handel" på grenen `julekalender` (lavet fra main `26387f2`), pushet til GitHub efter Martins OK d. 14/11. Ikke merget til main, så siden er ikke live.
- Når Asus'en er tilbage, skal Asus-versionen flettes med denne gren (ikke force-pushes), så intet går tabt.

## Lavet i dag
- `julekalender/index.html`: hele kampagnesiden i én fil (hero, Pakkepanik, 24 låger, partnerkort, "Book en snak", julehandelstips, tilmelding til spillet).
- noindex, nofollow. theme-toggle.js i head. Lyst og mørkt tema virker, og der er en knap til at skifte.
- Kun ASCII i filnavne, relative stier, eksterne links med target="_blank" rel="noopener noreferrer". Ingen <img> på siden (kun inline SVG).
- Ingen tankestreger i synlig tekst.
- Formularerne sender og gemmer intet. De viser "Tilmeldingen er ikke åben endnu".
- Lågerne åbner efter dato. `?demo` i adressen viser dem, som om det er 24. december.
- Testet med Playwright på 390 px og 1280 px, lyst og mørkt: ingen JS-fejl, ingen vandret scroll.

## Mangler (pladsholdere i [klammer] på siden)
- Modtager af tilmeldinger til "Book en snak" og til julespillet (hvor skal de hen?)
- Link til Pakkepanik
- Præmier: dagens præmie, præmie til samlet highscore, fordeling af dage mellem partnere
- Én linje, logo og bookinglink fra BFT, UniTroll, Zignifikant, Sprii, Kendskab, ProfitMetrics, Stok og Clarefy.ai
- Julehandelstip fra de samme otte partnere
- SmartPacks linje og tip er fra artifact-udkastet: skal godkendes af Martin
- Dataansvarlig, fælles afsender, kontaktperson og privatlivslink
- Endelig partnerliste: de otte er "interesseret", ikke endeligt med. Brancher markeret "bekræftes" i playbooken er gæt (Sprii, ProfitMetrics, Stok)
- Beskrivelsen af spillet er fra playbooken ("Den flyvende julepakke"). Passer den stadig til Pakkepanik?
- Leaderboard vises først, når spillet kører
- GDPR-tjek af tilmelding som betingelse for at vinde (se playbooken)
