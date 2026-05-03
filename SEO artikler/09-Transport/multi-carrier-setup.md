---
primary_keyword: multi-carrier setup webshop
secondary_keywords: [multiple fragtleverandører, carrier mix, fragtredundans, multi-carrier integration]
cluster: 09-Transport
---

# Multi-carrier setup: Hvorfor du behøver mere end én fragtleverandør

Black Friday kl. 10:00.
GLS API går ned.
500 ordrer klar til afsendelse.

Du har ingen backup.
Ordrene venter til mandag.

10% afbestiller = 50 × 450 kr. = 22.500 kr. tabt.
Tabte genkøb: 50 × 1.200 kr. = 60.000 kr.
Total: 82.500 kr. på én dag.

## Hvad er multi-carrier?

Multi-carrier setup er når en webshop har aktive aftaler med og integrationer til to eller flere fragtleverandører, og bruger dem intelligent baseret på ordre-karakteristika.

De typiske grunde til multi-carrier:
1. **Redundans**: når GLS har nedbrud sendes med PostNord
2. **Prisoptimering**: GLS er billigst til pakkeshop, DHL bedst internationalt
3. **Dækningsoptimering**: ingen leverandør dækker alle postnumre perfekt
4. **Kapacitet**: ved spidslast (Black Friday) er flere leverandører nødvendigt

## Hvornår skal du skalere til multi-carrier?

Multi-warehouse triggers – lignende logik gælder for multi-carrier:
- Kapacitetsproblemer: din leverandør kan ikke hændtere spidslast
- OTD under 95% på din primære leverandør
- Fragtomkostning over 8% af AOV (der er billigere alternativer)
- Internationale salg vokser (behov for landsløsninger)

## Hvorfor er det vigtigt? Tal og kr.

### Scenarie: GLS nedbrud under Black Friday

| Situation | Én leverandør | To leverandører |
|-----------|----------------|------------------|
| Ordrer klar til afsendelse | 500 stk. | 500 stk. |
| Nedbrud opdages | Fredag 10:00 | Fredag 10:00 |
| Handling | Venter på fix | Skifter til PostNord (15 min) |
| Ordrer afsendt samme dag | 0 | 480 (96%) |
| Refunderinger (10% afbestiller) | 50 × 450 kr. = **22.500 kr.** | 2 × 450 kr. = **900 kr.** |
| Tabte genkøb (LTV-impact) | 50 × 1.200 kr. = **60.000 kr.** | 2 × 1.200 kr. = **2.400 kr.** |
| **Total tab** | **82.500 kr.** | **3.300 kr.** |

**Break-even:** Hvis multi-carrier koster 5.000 kr./år ekstra i integration og administration, betaler det sig efter én enkelt nedbrud.

### Reel Black Friday-risiko
Black Friday = 6× normal kapacitet. Fragtleverandører rammer loft. 2023: GLS havde forsinkelser i 4 dage. 2024: PostNord stoppede midlertidigt modtagelse.

## Opsyn af multi-carrier i praksis

### Trin 1: Skriv aftale med sekundær leverandør
Du behøver ikke sende alle ordrer med sekundæren. Selv 10% volumen giver dig aktiv aftale og klar integration.

### Trin 2: Integrér begge via WMS
Dit WMS (f.eks. SmartPack) skal kunne:
- Generere labels for alle aktive leverandører
- Route ordrer til korrekt leverandør baseret på regler
- Skifte routing manuelt ved behov

### Trin 3: Sæt routing-regler
Eksempler på intelligente routing-regler:
- Ordrer under 2 kg → GLS pakkeshop
- Ordrer over 15 kg → DHL erhverv
- Ordrer til NO/SE → Bring
- Adresser uden pakkeshop i 5 km → hjemlevering med PostNord
- Fredag sen ordrer (express-behov) → DHL Express

### Trin 4: Opsæt fallback
Definere hvilken leverandør der bruges ved primær-nedbrud. Test det – ikke kun i teorien.

### Trin 5: Performance-måling per leverandør
Mål OTD, reklamationsrate og realpris per leverandør månedligt. Brug data til at justere routing.

## Leverandør-mix: typiske kombinationer

| Kombination | Hvorfor |
|---|---|
| GLS + PostNord | GLS pakkeshop primræ, PostNord hjemlevering sekundmær |
| GLS + Bring | GLS Danmark, Bring til NO/SE |
| GLS + DHL | GLS indenrigs, DHL international |
| PostNord + DAO | PostNord erhverv, DAO privat/pakkeshop |

## Det opdager de fleste for sent

1. **Sekundær leverandør er ikke testet før krisen**
   - Du har aftalen, men integration er aldrig kørt i produktion
   - Opdages når primær går ned og labels ikke kan genereres
   - Konsekvens: 4–8 timers nedetid mens du troubleshooter — hundredvis af ordrer forsinket

2. **Routing-regler mangler og du sender forkert**
   - Tunge pakker (20+ kg) sendes med GLS (max 30 kg) i stedet for DHL
   - GLS afviser 15% af pakkerne ved afhentning
   - Konsekvens: Pakker returneret til lager, kunder venter ekstra 2 dage, 15 × 150 kr. = 2.250 kr. håndtering

3. **Du forhandler ikke fordi du "kun" bruger sekundær til 10%**
   - PostNord tilbyder 18% rabat ved 500+ pakker/måned
   - Du sender 50/måned med dem, 450 med GLS
   - Konsekvens: Hvis du konsoliderede til 300/300 split, sparer du 18% × 300 × 35 kr. = **22.680 kr./år**

## Typiske fejl

- **Sekundær leverandør kun på papiret** – ingen aktiv integration, ingen test
- **Ingen routing-regler** – multi-carrier uden regler er bare dobbelt arbejde
- **Performance ikke målt per leverandør** – du ved ikke hvilken der er bedst
- **Forhandler ikke begge** – multi-carrier giver dig forhandlingsstyrke du skal bruge
- **Kunden viser to leveringsformer uden forskel** – checkout-konfusion

## Sådan gør du det rigtigt

- To leverandører fra dag ét når du når 100+ forsendelser/måned
- Routing-regler baseret på data (vægt, destination, service)
- Fallback-routing dokumenteret og testet
- Månedlig performancerapport per leverandør
- Forhandl begge årligt – vis at du har alternativer

## Brug denne artikel: tjekliste

- [ ] Sekundmær fragtleverandør identificeret og aftale underskrevet
- [ ] Integration til sekundær leverandør aktiv og testet
- [ ] Routing-regler defineret i WMS
- [ ] Fallback-procedure dokumenteret
- [ ] Performance-måling per leverandør opsat

**Næste skridt:** Identificer din nærmeste sekundære leverandør. Kontakt dem i dag. Få en aftale på plads og integrér inden din næste spidssæson.

## SmartPack understøttelse

### Hvornår giver SmartPack mening?
**JA** hvis:
- Du har 100+ forsendelser/måned og vil bruge 2+ leverandører
- Du sender til flere lande (routing per destination)
- Du har varierende pakketyper (routing per vægt/størrelse)
- Black Friday eller spidsbelastning er kritisk for din omsætning

**NEJ** hvis:
- Under 50 forsendelser/måned — manuel routing er hurtigere
- Kun én pakkeform og ét marked — kompleksiteten giver ikke ROI

### Hvad det koster at IKKE have intelligent routing
- Manuel routing-beslutning: 30 sek/ordre × 500 ordrer = 4 timer/måned à 200 kr./time = **9.600 kr./år**
- Forkert leverandør valgt (10% af ordrer): 50 ordrer × 15 kr. ekstra fragt = **9.000 kr./år**
- Nedbrud uden fallback (1 gang/år): **80.000 kr. tab** (se tabel ovenfor)
- **Total: 98.600 kr./år**

SmartPack automatiserer routing, fallback og performance-måling per leverandør.

## FAQ

**Hvornår skal man skifte til multi-carrier?**
Når du når 100+ forsendelser/måned, eller tidligere hvis du sælger til udlandet.

**Er multi-carrier dyrt at opslytte?**
Integrationsomkostningen er minimal hvis du bruger et WMS med native multi-carrier support. Den primære investering er tid til at forhandle og opslytte routing-regler.

**Kan man forhandle bedre priser med multi-carrier?**
Ja – det faktum at du har en alternativ leverandør styrker din forhandlingsposition.

**Hvad er routing-regler?**
Forretningsregler der automatisk vælger leverandør baseret på ordre-karakteristika (vægt, destination, service-niveau).

**Skal kunderne vide hvilken leverandør der bruges?**
Ja – i checkout og ordrebekræftelse. Tracking-links og SMS kommer fra den faktiske leverandør.

