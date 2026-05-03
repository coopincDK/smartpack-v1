---
primary_keyword: valg af fragtleverandør webshop
secondary_keywords: [GLS vs PostNord, fragtaftale e-handel, fragtleverandør sammenligning, transportudbud]
cluster: 09-Transport
---

# Valg af fragtleverandør: Sådan træffer du det rigtige valg

Du vælger fragtleverandør på grundpris: 28 kr.
Du glemmer FSC (15%), miljø (5%), zonepris.
Reel pris: 38 kr.

Du forhandler aldrig.
Din konkurrent forhandler: 20% rabat = 30,40 kr.

Ved 300 ordrer/måned taber du 7,60 kr. × 300 = 2.280 kr./måned.
Årligt: 27.360 kr. – bare fordi du ikke spurgte.

## Hvad er de primære fragtleverandører i DK?

**GLS** er Danmarks mest udbredte erhvervsfragt til pakkeshops og privat levering. Maksvægt 30 kg. Centrale services:
- `gls_private_droppoint`: levering til privat pakkeshop
- `gls_business_delivery`: direkte erhvervslevering

**PostNord** er den traditionelle statsposttjeneste med bredt netværk. Kræver MISKOS-nummer (9-cifret) til integration. Stærk på brev og pakke under 2 kg til private.

**Bring (PostNord NO/SE)**: primmært relevant for forsendelser til Norge og Sverige. Telefonnummer i leveringsadressen skal starte **+47** + 9 eller 4 (mobil) for norske adresser.

**DAO**: dansk, god dækning af pakkeshops, stærk på privatlevering og lørdagsforsendelse.

**DHL / UPS / FedEx**: internationale udbydere, typisk benyttet ved B2B-forsendelser, tunge og/eller internationale.

## Hvornår er valget kritisk?

Fragtleverandørvalget bliver kritisk når:
- Din returnrate er over 5% (peger på leveringsproblemer)
- Din fragtomkostning overstiger 8% af AOV (Average Order Value)
- Du har OTD (On-Time Delivery) under 95%
- Du vokser ind i nye geografiske markeder
- Du rammer kapacitetsproblemer hos din nuværende leverandør (Black Friday, jul)

## Hvorfor er det vigtigt? Tal og kr.

Fragtoplevelsen er kundeservice. Analyser viser konsistent:
- 84% af forbrugere vil ikke købe igen efter én negativ leveringsoplevelse
- Forsinkede leverancer er årsag til 40–50% af negative anmeldelser
- Fri fragt øger konverteringsrate med gennemsnitlig 25–30%

For en webshop med 300 ordrer/måned til 400 kr. AOV er fragtomkostning typisk 25–40 kr./forsendelse. Det er 7.500–12.000 kr./måned – en post der er forhandlingsbar.

## Hvordan i praksis: evalueringskriterier

### 1. Dækning
- Dækker leverandøren alle dine kunders postnumre?
- Pakkeshop-dækning: antal udleveringspunkter inden for 5 km af dine kunder?
- International dækning hvis relevant

### 2. Priser og struktur
Fragtpriser er typisk baseret på:
- **Vægt** (reel vægt vs. volumevægt – højeste værdi anvendes)
- **Volumevægt**: L×B×H (cm) ÷ 5000 = kg
- **Postnummerzone**: pris varierer efter destination
- **Brsændstoftærskel og miljøtillæg**: typisk 10–20% på basisprisen

### 3. Integration
- API-tilkobling til din e-handelsplatform eller WMS?
- Understløtter de automatisk label-print?
- Tracking-feed til kundenotifikationer?

### 4. Kundeservice og fejlhåndtering
- Svartid på reklamationer?
- Erstatning ved tabt/beskadiget vare?
- Dedikeret kontaktperson ved større volumen?

### 5. SLA og performance
- OTD-garanti (typisk 95–98%)
- Maks. leveringstid (D+1, D+2, D+3?)

## Forhandling: sådan får du bedre priser

Fragtleverandører forhandler på tre parametre:
1. **Volumen**: vis dit faktiske antal forsendelser/måned og vækstprognose
2. **Vækst**: kommittér dig til at være hos dem i 12+ måneder hvis de giver rabat
3. **Sortering**: uniform pakkestørrelse og -vægt gør det billigere for dem – spørg om rabat

Vis altid **faktiske tal** – fragtleverandører reagerer ikke på potentiale, kun på dokumenteret volumen.

## Typiske fejl

- **Kun én leverandør** – ingen redundans ved nedbrud eller kapacitetsproblemer
- **Ikke kontrolleret volumevægt** – læt men stort produkt betaler du for m3, ikke kg
- **Forhandler ikke** – prislisten er udgangspunkt, ikke facit
- **Vælger pris frem for dækning** – billigst er dyrt når kunder ringer om manglende pakker
- **Ingen performanceovervvågning** – OTD måles ikke, problemer opdages for sent

## Sådan gør du det rigtigt

- Hav minimum to fragtleverandører aktive (primær + sekundær)
- Forhandle minimum én gang om året – vis væksttal
- Opsæt automatisk måling af OTD og reklamationsrate per leverandør
- Test ny leverandør med 10–20% af volumen før fuld overgang
- Kommuniker fragtleverandør-valg til kunder: pakkeshop vs. levering på døren

## Brug denne artikel: tjekliste

- [ ] Aktuelle fragtomkostninger som % af AOV beregnet
- [ ] OTD-rate målt per leverandør
- [ ] Minimum to fragtleverandører aktive
- [ ] Seneste forhandling: hvornår?
- [ ] Volumevægt beregnet for dine top-10 produkter
- [ ] Integration og label-print-automatisering på plads

**Næste skridt:** Hent de seneste 3 måneders fragtdata. Beregn OTD, gennemsnitspris og reklamationsrate per leverandør. Book møde med din fragtreppræsentant og vis tallene.

## SmartPack understøttelse

SmartPack integrerer med GLS, PostNord, Bring, DAO og internationale fragtleverandører via native API. Systemet vælger automatisk billigste eller hurtigste leverandør baseret på ordre-parametre og genererer labels uden manuel håndtering.

## FAQ

**Hvad er GLS's maksvægt?**
30 kg per kolli. Over det skal du bruge spærregods eller en anden leverandør.

**Hvad er volumevægt og hvord an beregnes den?**
L×B×H i cm divideret med 5000. Er volumevægten højere end realvægten, betaler du for volumevægten.

**Hvad koster det ikke at forhandle fragtpris?**
Typisk 20–40% mere end nødvendigt. Fragtleverandører forventer at forhandle.

**Hvad er et MISKOS-nummer?**
Et 9-cifret kundenummer krævet af PostNord til API-integration og fakturering.

**Hvornår skal jeg have to fragtleverandører?**
Fra dag ét anbefales det. I praksis er det kritisk når du når 100+ forsendelser/måned.

