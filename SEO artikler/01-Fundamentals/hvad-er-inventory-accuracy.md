---
primary_keyword: inventory accuracy
secondary_keywords: lagerrnøjagtighed, lagertal korrekte, lagersaldo nøjagtighed, fysisk vs system lager
cluster: 01-Fundamentals
---

# Hvad er inventory accuracy — og hvad koster det, når tallene ikke stemmer?

Systemet viser 47 stk.
Kunden bestiller.
Plukkeren finder 3 stk.

Du refunderer.
Kunden er sur.
Det sker 10 gange om dagen.

10 × 350 kr. = **3.500 kr./dag**.
**875.000 kr./år** — fordi tallene ikke stemmer.

---

## Hvad er inventory accuracy?

**Inventory accuracy** (lagernøjagtighed) er målet for, hvor præcist systemets registrerede beholdning matcher den faktiske, fysiske beholdning på lageret.

Formlen er simpel:
> **Inventory accuracy (%) = (korrekte linjer / totale linjer tællet) x 100**

Eksempel: Du tæller 100 tilfældige SKU'er. 94 stemmer med systemet, 6 afviger. Inventory accuracy = 94%.

Branchen anser **98%+ som acceptabelt**, og de bedst drevne lagre når 99,5%+.

---

## Hvornår er det et problem?

Under 98% er et handlingspunkt. Men inventory accuracy er et problem, når:
- Kunder bestiller varer, der ikke er på lager — selvom systemet siger de er
- Plukkere ankommer til en hylde og varen er der ikke
- Du finder varer på steder, de ikke burde være — ukendt lager
- Periodiske opgørelser afslører store afvigelser
- Genbestillinger er for tidlige eller for sene — baseret på forkert saldo

---

## Hvorfor det er vigtigt — i kroner

**Scenario: 500 daglige ordrer, 2% forkerte saldi**
= 10 ordrer per dag, der er problematiske

- Oversalg (udsolgt vare solgt): kundeafvisning, refundering, omdømmetab
- Plukker finder ingen vare: mistet pluktid, ny søgning, forsinkelse
- Hver problematisk ordre: ~350 kr. direkte i håndteringsomkostning
- 10 x 350 kr. = **3.500 kr./dag = ~875.000 kr./år**

Og det er kun de ordrer, der rammer fejlen. Derudover bruges medarbejdertid på at finde ukendt lager og rette systemet.

---

## Hvordan fungerer inventory accuracy-måling i praksis?

### Metode 1: Cycle counting (løbende)
Del lageret op og tæl en delmenge dagligt. A-varer ugentligt, B-varer månedligt, C-varer kvartalsvis. Registrér afvigelser og ret straks.

### Metode 2: Blind count
Medarbejder tæller uden at se systemets forventede tal først. Eliminerer confirmation bias, hvor tælleren tæller til systemets tal.

### Metode 3: ABC-prioriteret spot check
Tæl de 20 SKU'er med højest omsætning ugentligt. Fejl her er dyrere end fejl på slow-movers.

### Beregn accuracy per årsag
Når en afvigelse opdages — hvad var årsagen?
- Modtagelsesfejl (vare registreret forkert antal)
- Plukfejl (vare taget uden scanning)
- Returneringsfejl (returneret vare lagt forkert)
- Tyveri
- Systemfejl (integration droppede en transaktion)

Kendte årsager kan fikses. Ukendte kan ikke.

---

## Typiske fejl

**1. Inventory accuracy måles kun ved årsopgørelse**
Du opdager afvigelserne én gang om året. I mellemtiden koster de penge hver dag.

**2. Medarbejdere retter systemet uden at finde årsagen**
"Systemet siger 50, vi har 47 — jeg ændrer til 47." Afvigelsen er rettet, årsagen lever videre.

**3. Ingen scanning ved alle lagerbevægelser**
Vare tages til fremvisning, test, eller intern brug. Ingen registrering. Systemet er forkert fra da af.

**4. Returnerede varer lægges på lager uden scanning**
Kunden returnerer 3 stk. Medarbejder lægger dem på hylden. Systemet ved intet. Inventory accuracy falder.

**5. Accuracy-rapport køres aldrig**
Mange WMS kan generere en accuracy-rapport. Få gider. De fleste opdager inventory-problemer fra kundeklager.

---

## Sådan gør du det rigtigt

**1. Cycle counting — aldrig årsopgørelse**
Løbende optælling holder accuracy over 98% uden produktionsstop. Årsopgørelse er et symptom på manglende løbende kontrol.

**2. Blind count — altid**
Tælleren ser ikke systemets tal før optællingen er afsluttet. Hindrer systematisk "runding" mod systemværdien.

**3. Registrér årsag ved hver afvigelse**
Opretter du en justeringspost i systemet, skal du også skrive årsagen. Over tid afslører mønstrene, hvad der systemisk skal fikses.

**4. Scan ALT — også interne bevægelser**
Vare til demo, vare til fotografering, vare til test: alt registreres. Ingen undtagelser.

**5. KPI-rapportering ugentligt**
Inventory accuracy er en ugentlig KPI — ikke en årlig begivenhed. Teamet bør kende tallene.

---

## Hvornår du skal handle

- Inventory accuracy er under 98%
- Du har ikke målt inventory accuracy de seneste 30 dage
- Plukkere har jævnligt "manglende vare" på pluklisten
- Kunder har reklameret over udsolgte varer, der var vist på webshop
- Du laver årlig lukkeopgørelse og er i gang med at flytte til løbende kontrol

---

## Sådan understøtter SmartPack det

SmartPack understøtter cycle counting direkte på håndterminal med blind count-tilstand. Systemet registrerer alle lagerbevægelser med tidsstempel og bruger-ID. Inventory accuracy beregnes automatisk på baggrund af tælleresultater og vises per SKU, zone og værdikategori i KPI-dashboardet.

---

## Brug denne artikel
- [ ] Tæl 20 tilfældige SKU'er i dag — blind count — og beregn din nuværende accuracy
- [ ] Beregn årlig omkostning: (1 minus accuracy%) x daglige ordrer x 350 kr. x 250 dage
- [ ] Identificer, om alle lagerbevægelser scannes i dag (inkl. interne)
- [ ] Næste skridt: Opsæt ugentlig cycle count-rutine for dine top-20 SKU'er

---

## FAQ

**Hvad er inventory accuracy?**
Inventory accuracy er målet for, hvor nøjagtigt systemets registrerede lagersaldo matcher den faktiske, fysiske beholdning. Måles i procent.

**Hvad er en acceptabel inventory accuracy?**
98%+ er minimumstandard. De bedst drevne lagre når 99,5%. Under 95% er kritisk og kræver akut handling.

**Hvordan beregner jeg inventory accuracy?**
Tæl X antal SKU'er (blind count). Del antal korrekte med total tællet og gang med 100. Eksempel: 94 korrekte ud af 100 = 94% accuracy.

**Hvornår skal jeg tælle lageret?**
Løbende (cycle counting) frem for én stor årlig optælling. A-varer ugentligt, B-varer månedligt, C-varer kvartalsvis.

**Hvad er den hurtigste måde at øge inventory accuracy på?**
Scan alle lagerbevægelser — inkl. modtagelse, returnering og interne flytninger. De fleste accuracy-problemer stammer fra ikke-scannede bevægelser.

