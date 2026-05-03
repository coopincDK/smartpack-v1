---
primary_keyword: lageralerts opsætning SmartPack
secondary_keywords: [lager alerts, lager notifikationer, smartpack alerts, lager overvågning alerts]
cluster: 03-Operations
article_type: beslutning
---

# Lageralerts opsætning i SmartPack: Reagér proaktivt, inden problemet opstår

Én forkert alert-konfiguration → tomme A-varehylder opdages for sent → 12 stoppede ordrer → 4.200 kr. tabt samme dag. Et lager der reagerer på problemer, er et lager der altid er bagud. Et lager med korrekt opsatte alerts er et lager der forebygger. Denne guide viser dig, præcis hvordan du opsætter lageralerts i SmartPack – og hvilke alerts du altid bør have aktive.

## Kort svar

Lageralerts konfigureres med tærskelværdier per ABC-klasse, udløbsdatoer og negative lagerantal. Formålet er at skifte fra reaktiv til proaktiv lagerstyring, inden problemet opstår.

## Hvad er lageralerts i SmartPack?

Lageralerts er automatiske notifikationer der udløses, når en foruddefineret betingelse opstår i dit lager. De vises primært i SmartPacks **Dashboard tile "Lager alerts"** med en **løbende optælling popup**, der opdateres i realtid.

Alerts kan notificere om:
- Lagerantal der nærmer sig refill limit
- Negative lagerantal
- LOT'er der nærmer sig udløbsdato
- Afvigelser ved cycle counting
- Åbne transferordrer der overskrider transit-SLA
- Plukkefejlrate der overskrider tærskelværdi
- Pakkekapacitet der er ved at blive flaskehals

## Hvornår er alerts et problem?

Alerts er ikke opsatte eller er ineffektive, når:
- Medarbejdere opdager tomme hylder først under aktiv plukaktivitet
- Negative lagerantal opdages ved tilfældig kontrol
- Udløbne varer opdages ved fysisk inspektion – ikke systemadvarsel
- Ingen reagerer på alerts fordi der er for mange (alert fatigue)

## Det opdager de fleste for sent

- **Refill-alerts sat for lavt:** A-varer når refill limit kl. 14 – men alert først kl. 16 når plukkeren står med tom hylde. Genopfyldning når ikke at ske inden arbejdsdagens slutning.
- **Alert fatigue ignoreret:** 47 alerts dagligt → medarbejdere lærer at ignorere dem alle → den ene kritiske alert drukner i støj.
- **Ingen ansvarlig per alert-type:** Alle alerts går til alle → ingen føler ejerskab → reaktionstid 4+ timer i stedet for 20 minutter.

## Hvorfor er det vigtigt? (tal)

| Scenarie | Uden alerts | Med alerts | Besparelse/år |
|----------|-------------|------------|---------------|
| A-vare stockout (12 ordrer stoppet/dag) | 4.200 kr./dag | 0 kr. (forebygget) | **~900.000 kr.** |
| Udløbsvarer opdaget for sent (kassation) | 8.500 kr./måned | 400 kr./måned | **~97.000 kr.** |
| Negativ lagerantal → oversalg | 6 episoder/måned × 450 kr. | 0,5 episoder/måned | **~30.000 kr.** |

- Proaktiv alerts forhindrer stockouts, der stopper flow og giver pakkefejl til ~350 kr. direkte
- Tidlig advarsel om udløbsvarer forhindrer varespild
- Et system med korrekt kalibrerede alerts reducerer manuel overvågning markant
- SmartPacks løbende optællings-popup kombinerer cycle counting med real-time alerts for A-varer

## Trin-for-trin: Opsæt lageralerts i SmartPack

### Trin 1: Åbn Dashboard og aktivér Lager alerts-tile
I SmartPacks dashboard: aktiver "Lager alerts" tile. Tilen viser en løbende tæller over aktive alerts og giver øjeblikkelig adgang til detaljer.

### Trin 2: Konfigurér refill-alerts per SKU-klasse
Indstil refill alerts baseret på ABC-klasse:
- **A-varer**: alert ved beholdning under refill limit (dagligt salg × leveringstid × buffer)
- **B-varer**: alert ved beholdning under 50% af refill limit
- **C-varer**: alert ved beholdning under 30% af refill limit

For alle tre: benyt formlen: alert limit = dagligt salg × leveringstid × bufferfaktor.

### Trin 3: Konfigurér udløbs-alerts for LOT-varer
For alle SKU'er med udløbsdatoer:
- **30-dages alert**: LOT udløber inden for 30 dage – tid til proaktiv handling (tilbud, prioriteret pluk)
- **7-dages alert**: LOT udløber inden for 7 dage – urgent handling krævet

### Trin 4: Konfigurér negativ-lagerantal-alert
Negativ-alert: aktivér øjeblikkeligt notifikation ved ethvert negativt lagerantal. Negativ = systemfejl eller uregistreret bevægelse – skal altid undersøges.

### Trin 5: Konfigurér transferordre-timeout-alert
Transferordrer der er åbne i mere end din definerede SLA (fx 2 arbejdsdage) genererer automatisk en alert.

### Trin 6: Konfigurér cycle counting alerts
SmartPacks løbende optællings-popup guider medarbejdere til planlagte optællings-SKU'er. Aktivér popup for:
- A-varer: daglig optællings-reminder
- B-varer: ugentlig reminder
- Alert ved afvigelse over en tærskel (fx 5% uoverensstemmelse)

### Trin 7: Kalibrér alert-volumen for at undgå alert fatigue
For mange alerts = ingen reagerer. Kalibrér:
- Sæt tærskelværdier realistisk (ikke for konservative)
- Prioritér alerts: kritisk (rød), vigtig (gul), info (blå)
- Gennemgå alert-historik månedligt og justér tærskler

### Trin 8: Tildel alerts til ansvarlige
Definér hvem der modtager hvilke alerts:
- Refill-alerts → lageransvarlig og plukleder
- Udløbs-alerts → indkøb og lageransvarlig
- Negativ-alerts → IT/data-ansvarlig og lageransvarlig
- Fejlrate-alerts → kvalitetsansvarlig

## Typiske fejl

**Fejl 1: Alle alerts går til alle**
Resultatet er alert fatigue: alle ignorerer alt. Specificér modtagere per alert-type.

**Fejl 2: Tærskelværdier ikke kalibreret til faktisk drift**
For konservative tærskler giver false positives dagligt. For løse tærskler advarer for sent.

**Fejl 3: Alerts aktiveres men ingen processer er defineret for reaktion**
En alert er kun værdifuld, hvis der er en klar reaktionsproces knyttet til den.

**Fejl 4: Alert-konfiguration aldrig revideret**
Sortiment, volumen og leveringstider ændrer sig. Alerts der ikke opdateres mister relevans.

## Sådan gør du det rigtigt

**1. Definer en reaktionsprotokol per alert-type**
For refill-alert: hvem gør hvad, inden for hvor lang tid? Dokumentér og hæng det op.

**2. Gennemgå alert-historik månedligt**
Hvilke alerts fyrer hyppigst? Er det ægte problemer eller for konservative tærskler? Justér.

**3. Kombiner alerts med løbende optællings-popup**
SmartPacks popup-funktion for cycle counting og alerts arbejder bedst i kombination: popup guider til optælling, alert reagerer på afvigelse.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Aktivér "Lager alerts" dashboard tile
- [ ] Konfigurér refill alerts per ABC-klasse med korrekte tærskler
- [ ] Aktivér 30-dages og 7-dages udløbs-alerts for LOT-varer
- [ ] Aktivér negativ-lagerantal alert (øjeblikkelig)
- [ ] Konfigurér transferordre-timeout-alert
- [ ] Aktiver løbende optællings-popup for cycle counting
- [ ] Tildel alerts til specifikke ansvarlige
- [ ] Planlæg månedlig alert-kalibrering

**Næste skridt**: Læs guiderne om cycle counting, refill-strategi og LOT-håndtering for at forbinde alert-systemet med de underliggende processer.

## SmartPack understøttelse

SmartPacks "Lager alerts" dashboard tile er hjørnestenen i proaktiv lagerovervågning. Tilen viser løbende antal aktive alerts med prioriteringsniveau og detalje-popup. Løbende optællings-popup guider medarbejdere til planlagte cycle count-opgaver. Alle alerts er konfigurerbare med individuelle tærskler, modtagere og reaktionsfrister.

## FAQ

**Hvad er "Lager alerts" i SmartPack?**
En dashboard-tile med løbende popup der viser alle aktive alerts i realtid – refill behov, udløbsvarer, negative lagerantal og cycle counting-opgaver.

**Hvad er alert fatigue?**
Når der er så mange alerts at medarbejdere begynder at ignorere dem alle. Forebygges ved præcis kalibrering af tærskler og specificering af modtagere.

**Hvornår bør jeg reagere på en refill-alert?**
Helst inden for den arbejdsdag, alerten er genereret. Morgengenopfyldning er idealet: alerts fra forgående dag behandles ved arbejdsdagens start.

**Hvad gør en negativ-lagerantal alert?**
Det er et symptom på en uregistreret bevægelse eller fejlmodtagelse. Undersøg øjeblikkeligt – korriger aldrig blindt.

**Kan jeg have alerts på tværs af flere lagerlokationer?**
Ja – SmartPacks alerts kan konfigureres per lokation og på tværs af alle lokationer. Transferordre-alerts er automatisk multi-lokations.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Stockout på A-varer](/viden/problemer/stockout-a-varer)

