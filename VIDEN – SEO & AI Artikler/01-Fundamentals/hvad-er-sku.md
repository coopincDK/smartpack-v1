---
primary_keyword: SKU lagerstyring
secondary_keywords: stock keeping unit, varenummer, SKU definition, lagerenheder
cluster: 01-Fundamentals
---

# Hvad er en SKU — og hvorfor koster dine "ghost-SKU'er" dig 180.000 kr./år?

En dansk webshop med 4.200 aktive SKU'er i systemet. De kører en analyse: 520 SKU'er (12%) har haft 0 salg i 18 måneder. 340 SKU'er er duplikater — samme vare, to koder. 89 SKU'er eksisterer i systemet men ikke fysisk. Konsekvens: lageroptælling tager 3× længere tid. Indkøb bestiller dobbelt. Rapporter er ubrugelige. Estimeret årlig omkostning: **~180.000 kr.** i spildt tid, fejlindkøb og phantom inventory.

SKU — Stock Keeping Unit — er den unikke identifikator for én specifik lagervare. Ingen professionel lagerstyring fungerer uden det. Forstår du ikke SKU-strukturen, kan du ikke spore, tælle, plukke eller rapportere præcist. Her er den komplette guide.

---

## Hvad er en SKU?

En SKU (Stock Keeping Unit, udtales "skju") er en unik kode, der identificerer én specifik variant af en vare i dit lager. En SKU er ikke bare et produktnavn — det er den mindste lagerenhed, der kan håndteres selvstændigt.

**Eksempel:**
- Produkt: T-shirt, mærke X
- SKU 1: TX-TSHIRT-S-RØD (small, rød)
- SKU 2: TX-TSHIRT-M-RØD (medium, rød)
- SKU 3: TX-TSHIRT-M-BLÅ (medium, blå)

Hver variant med forskellig størrelse, farve, pakningsstørrelse eller konfiguration er en separat SKU — selvom det er "samme produkt".

**SKU vs. andre identifikatorer:**
- **SKU** = intern kode, defineret af din virksomhed, bruges i WMS og lager
- **EAN/stregkode** = ekstern standardkode, bruges på emballage og ved handel
- **Varenummer** = kan svare til SKU, men er ikke altid unikt pr. variant

---

## Det opdager de fleste for sent

### 1. Duplikat-SKU'er opdages først ved årsopgørelsen
Du har TX-SHIRT-M-BLK og TXSHIRT-M-BLACK. Begge er aktive. Begge har beholdning. Indkøb bestiller begge. Lageret har dobbelt så mange som systemet viser. **Opdages typisk 8-14 måneder efter oprettelse** — når nogen spørger "hvorfor har vi så mange sorte t-shirts?"

### 2. Ghost-SKU'er forurener alt
12-18% af aktive SKU'er i gennemsnittet SMV-lager er "ghost-SKU'er": ingen salg i 12+ måneder, ingen beholdning, men stadig aktive. De dukker op i:
- Lageroptælling (skal tælles, selvom de ikke findes)
- Rapporter (forvrider ABC-analyse)
- Indkøbslister ("skal vi bestille?")
- Webshop-synkronisering (vises som "udsolgt" i stedet for skjult)

### 3. Ingen SKU-navnekonvention = kaos efter 6 måneder
Første medarbejder: TX-SHIRT-M-BLK. Anden medarbejder: TSHIRT-BLACK-M. Tredje medarbejder: T-SHIRT-SORT-M. Alle tre er samme vare. Ingen kan søge. Ingen kan filtrere. Ingen kan rapportere.

### 4. Slettede SKU'er = tabt historik
En SKU med 2 års salgshistorik slettes fordi "vi fører den ikke længere". 6 måneder senere: "hvad solgte vi af den vare sidste år?" Data er væk. Kan ikke genopbygges.

---

## Hvornår er det et problem?

- Samme fysiske vare har to SKU'er i systemet → dobbelt optælling, fejlindkøb
- En variant (f.eks. en farve) mangler SKU → kan ikke spores korrekt
- SKU-navngivning er inkonsistent → rapportering og filtrering fejler
- SKU-vækst er ukontrolleret → over 20.000 aktive SKU'er uden rydning
- Over 10% af SKU'er er inaktive (ingen salg/bevægelse i 12+ måneder)

---

## Hvorfor er SKU-styring vigtigt? (tal og kr.)

### Direkte omkostninger ved dårlig SKU-styring:

| Problem | Konsekvens | Estimeret omkostning |
|---------|------------|---------------------|
| Duplikat-SKU'er (5% af katalog) | Dobbeltindkøb, forvirring | ~60.000 kr./år |
| Ghost-SKU'er (12% af katalog) | Spildt optællingstid, forvreden rapportering | ~40.000 kr./år |
| Phantom inventory (SKU i system, ikke fysisk) | Tabte salg, ekspresordrer | ~80.000 kr./år |
| **Total** | | **~180.000 kr./år** |

**Regnestykke — phantom inventory:**
- 1 A-vare vises som "på lager" i systemet, men er fysisk udsolgt
- 3 dages stockout × 15 stk./dag × 200 kr. margin = **9.000 kr. tabt**
- Ved 8-10 phantom inventory-hændelser/år = **~80.000 kr./år**

**Regnestykke — lageroptælling med ghost-SKU'er:**
- 4.200 SKU'er i systemet, 520 er ghost-SKU'er (12%)
- Årlig optælling: 4.200 SKU'er × 30 sek./SKU = 35 timer
- Uden ghost-SKU'er: 3.680 SKU'er × 30 sek./SKU = 30,7 timer
- Forskel: 4,3 timer × 250 kr./time = **~1.100 kr./optælling**
- Plus: forvirring, fejl, frustrerede medarbejdere

---

## Hvordan fungerer SKU-styring i praksis?

1. **SKU-navnekonvention** — definer en struktur: BRAND-KATEGORI-VARIANT-STØRRELSE
2. **Unikt pr. variant** — hver kombination af attributter (farve, størrelse, smag) = én SKU
3. **EAN-tilknytning** — knyt EAN/stregkode til SKU for scanning
4. **Aktiv/inaktiv status** — arkivér SKU'er frem for at slette dem (bevar historik)
5. **SKU-ejerskab** — én person eller funktion er ansvarlig for SKU-oprettelse og navngivning

**SKU-navnestruktur (anbefalet):**
`[BRAND]-[KAT]-[FARVE]-[STR]` — eksempel: `NK-SHOE-BLK-42`

Undgå mellemrum, specialtegn og store/små bogstav-variation i SKU-koder.

---

## Typiske fejl

1. **Ingen navnekonvention** — SKU'er oprettes ad hoc, inkonsistente og svære at søge i
2. **Dobbelt-SKU'er** — samme variant oprettes to gange med forskellig kode
3. **SKU slettes i stedet for arkiveres** — historikdata mistes, rapporter brydes
4. **Variant-attributter mangler i SKU** — SKU skelner ikke mellem farver → fejlpluk
5. **Ukontrolleret SKU-vækst** — sortimentet vokser uden periodisk SKU-rydning
6. **Ingen duplikat-detektion** — systemet tillader oprettelse af SKU med identisk EAN

---

## Sådan gør du det rigtigt

**1. Definer en SKU-navnekonvention** inden første varelinje oprettes — svær at ændre bagefter

**2. Én SKU = én lagerbar enhed** — aldrig grupperér varianter under samme kode

**3. Arkivér, slet ikke** — bevar historik for alle udgåede SKU'er

**4. Auditér SKU-kataloget halvårligt** — identificér duplikater og ghost-SKU'er

**5. Knyt EAN til alle SKU'er** for at understøtte scanning ved modtagelse og pluk

**6. Én person ejer SKU-oprettelse** — ikke "alle kan oprette"

---

## Brug denne artikel

**Tjekliste — SKU-styring under kontrol?**
- [ ] Du har en dokumenteret SKU-navnekonvention
- [ ] Alle aktive SKU'er har tilknyttet EAN/stregkode
- [ ] Ingen duplikat-SKU'er eksisterer i systemet
- [ ] Inaktive SKU'er er arkiverede, ikke slettet
- [ ] En person/funktion ejer SKU-oprettelsesprocessen
- [ ] Under 10% af SKU'er er ghost-SKU'er (ingen aktivitet 12+ måneder)

**Formel — SKU-effektivitet:**
`Aktiv SKU-ratio = aktive SKU'er med salg seneste 12 md / totale aktive SKU'er × 100`

Mål: over 85% aktive SKU'er. Under 70% indikerer oprydningsbehov.

**Næste skridt:**
1. Eksportér dit komplette SKU-katalog
2. Identificér SKU'er uden salg/bevægelse de seneste 12 måneder
3. Identificér duplikater (samme EAN, forskellige SKU-koder)
4. Arkivér inaktive og dedupliker duplikater

---

## SmartPack: JA eller NEJ?

**JA til SmartPack, hvis:**
- Du vil have duplikat-detektering ved SKU-oprettelse
- Du vil have automatisk EAN-tilknytning og scanning
- Du vil have ét klik-arkivering med bevarelse af historik
- Du vil have SKU-aktivitetsrapporter (ghost-SKU-detektion)

**NEJ til SmartPack, hvis:**
- Du har under 50 SKU'er og kan styre det i Excel
- Du allerede har et WMS med fuld SKU-styring

SmartPack understøtter ubegrænset antal SKU'er med fuld variantstruktur. Systemet knytter automatisk EAN-kode til SKU og understøtter scanning ved alle lageraktiviteter. Duplikat-detektering advarer ved oprettelse af SKU'er med identisk EAN. Arkivér udgåede SKU'er med ét klik under Varestyring → Arkivér — al historik bevares.

---

## FAQ

**Hvad er forskellen på en SKU og en EAN-kode?**
SKU er din interne varekode — defineret af dig, bruges i dit WMS. EAN (European Article Number) er en global standardkode printet på emballagen. En SKU kan have én eller flere EAN-koder tilknyttet (f.eks. enkelt og multipak).

**Hvor mange SKU'er er for mange?**
Det afhænger af virksomhedstype. En webshop med bredt sortiment kan have 50.000+ SKU'er. Problemet opstår ikke ved antal, men ved kontrol: over 15% inaktive eller duplikerede SKU'er er et signal om rydningsbehov.

**Hvad sker der, hvis jeg sletter en SKU?**
Du mister historiske lager- og salgsdata tilknyttet koden. Arkivér altid frem for at slette — arkiverede SKU'er vises ikke i aktive lister men bevarer al historik.

**Kan samme produkt have flere SKU'er?**
Ja, og det er korrekt praksis: én SKU pr. unik kombination af attributter. Et produkt i 3 størrelser og 4 farver har 12 SKU'er.

**Hvad er et ghost-SKU?**
En SKU i systemet, der ingen fysisk beholdning har og ingen aktivitet har haft i 12+ måneder. Ghost-SKU'er forurener lageroptælling, rapporter og indkøbslister. De bør arkiveres.
