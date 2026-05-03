---
primary_keyword: wms vs erp
secondary_keywords: [forskel wms erp, warehouse management system, erp lagerstyring, wms eller erp]
cluster: 06-Tech
---

# WMS vs. ERP – hvad er forskellen, og hvornår skal du have begge?

Mandag morgen kl. 08:34. 220 ordrer/dag. Kun ERP (Business Central). Ingen WMS. Plukker får papirliste fra BC. Linje 47: "Vare 8472B, hylde 7C". Går til 7C. Varen er ikke der. Spørger kollega. "Den er vist flyttet til 9A." Finder den. 8 minutter spildt. Sker 12 gange/dag. 96 min/dag × 200 kr./time = 320 kr./dag = 80.000 kr./år i spildt gangtid.

## Hvad er WMS og ERP?

**WMS (Warehouse Management System)** styrer det fysiske lager. Det handler om, hvad der sker inde i lagerbygningen: modtagelse af varer, placering, plukoptimering, batch picking, pakning og afsendelse. Et WMS ved, hvem der plukkede hvad, hvornår – og via hvilken rute.

**ERP (Enterprise Resource Planning)** styrer forretningen og økonomien. Ordrer, fakturaer, indkøb, leverandørforhold, bogføring og rapportering. ERP'et ser lagret som tal i et regneark – antal på lager, kostpris, reserverede enheder.

Forskellen er fundamental: ERP håndterer *data om* lageret. WMS håndterer *operationerne på* lageret.

## Hvad koster det IKKE at have WMS?

| Scenarie | Hyppighed (ved 200 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Fejlpluk (ERP-styret: 3% vs. WMS: 0,5%) | 2,5% forskel = 5 fejl/dag | 5 × 350 kr. = 1.750 kr./dag | 5 × 2.400 = 12.000 kr./dag | **5.018.750 kr./år** |
| Ineffektiv gangtid (ingen plukoptimering) | 20-35% spildt tid | 4 plukkere × 35% × 420.000 kr. = 588.000 kr./år | N/A | **588.000 kr./år** |
| Ingen sporbarhed (hvem plukkede hvad?) | 10% af fejl kan ikke spores | Fejlfinding: 2 timer/uge × 200 kr. = 20.800 kr./år | Gentagne fejl: ~50.000 kr./år | **70.800 kr./år** |

**Konklusion:** Fejlpluk er den dyreste omkostning. Ineffektiv gangtid er den næststørste.

## Hvornår er det et problem ikke at have begge?

Virksomheder klarer sig typisk fint med kun ERP op til et vist volumen. Men der er klare tegn på, at et WMS er nødvendigt:

- **Over 200 ordrer om dagen**: På dette niveau er manuel ordrehåndtering direkte ineffektiv. Fejlprocenten stiger, og pick-hastighed bliver en flaskehals.
- **Flere lagermedarbejdere**: Uden WMS har du ingen sporbarhed på, hvem der plukkede hvad. Det gør fejlfinding til gætværk.
- **Kompleks lagertopologi**: Mehrlagersystemer, pick-zoner, bulk-lokationer og pakningstationer kræver styring, som ERP ikke kan levere.
- **Returnering og sporbarhed**: Lot-/serienummerstyring og returnering med lokationsregistrering er WMS-domæne.

ERP uden WMS ved 200+ ordrer/dag er som at køre en restaurant med kun et kasseapparat og ingen køkkenordresystem.

## Hvorfor det er vigtigt – hvad koster forskellen?

Fejlpluk koster. En fejllevering koster i gennemsnit 5-15x mere end en korrekt levering – du har porto begge veje, håndteringstid, returbehandling og kundeservice. Med 1% fejlrate på 300 daglige ordrer er det 3 fejl om dagen, 60+ om måneden.

WMS-systemer reducerer typisk fejlrate med 40-70% sammenlignet med manuel eller ERP-styret pluk, ifølge branchemålinger. Det er direkte bundlinjeeffekt.

Plukoptimering alene – det vil sige at beregne den korteste rute gennem lageret – kan reducere gangtid med 20-35%. For et team på 4 plukkere svarer det til næsten en hel medarbejders kapacitet frigjort.

## Hvordan fungerer det i praksis?

### Typisk arbejdsdeling WMS/ERP:

**ERP modtager ordren** → sender den til WMS via integration.

**WMS behandler ordren**:
1. Ordren opdeles i plukliste
2. TSP-optimeret rute beregnes (Travelling Salesman Problem)
3. Plukker får opgave på håndterminal
4. Varer scannes ved pluk (stregkode/QR)
5. Pakkes og vejes ved pakkestation
6. Fragtlabel genereres og printes

**WMS sender status tilbage til ERP**: ordren er afsendt, tracking-nummer, eventuelle mangler eller substitutioner.

ERP opdaterer lagertal, bogfører evt. salget og sender fakturaen.

### Dataudveksling sker typisk via:
- REST API (pull: ERP henter ordrer, WMS henter beholdning)
- Webhooks (push: WMS sender afsendelsesbekræftelse til ERP)
- Filintegration (ældre systemer: CSV/XML-filer på FTP)

## Typiske fejl

**1. Antager at ERP'et "klarer det"**
ERP-leverandører markedsfører ofte lagermoduler. De kan holde styr på beholdning, men mangler plukoptimering, batch picking, medarbejder-tracking og kompleks lokationsstyring. Det er ikke det samme.

**2. Implementerer WMS men springer integrationen over**
Hvis WMS og ERP ikke taler samme sprog i realtid, opstår dobbelt-registrering og synkroniseringsfejl. Mange implementerer WMS som en ø – det giver ikke fuld effekt.

**3. Overser masterdata-problemet**
WMS og ERP skal have identiske varenumre, stregkoder og enheder. Uoverensstemmelser i masterdata er den hyppigste årsag til fejl i de første måneder efter integration.

## Sådan gør du det rigtigt

**1. Definer ejerskab klart**: ERP ejer ordredata og økonomi. WMS ejer lokationer og lageroperationer. Definer, hvem der er "master" for beholdningsdata – og synkronisér ét vej, ikke begge.

**2. Prioritér realtidsintegration**: Lagerstatus bør aldrig være mere end minutter forsinket. Batchkørsler fra nat til nat skaber oversalg og fejl i pluklister.

**3. Test med reelle ordrescenarier**: Integration skal testes med faktiske ordretyper: enkeltlinje, multilinje, restordre, returordre. Ikke kun happy path.

## Tjekliste og næste skridt

- [ ] Tæl daglige ordrer – er du over 100? Over 200?
- [ ] Er fejlrate over 0,5%? Undersøg årsagen – pluk eller data?
- [ ] Har du lokationsstyring på lageret i dag?
- [ ] Taler dit ERP og WMS i realtid – eller er der manuelle steps?
- [ ] Er masterdata (varenumre, enheder, stregkoder) synkroniseret?

**Næste skridt**: Kortlæg præcist, hvilke lageroperationer dit ERP ikke håndterer. Det er udgangspunktet for en WMS-kravspec.

## SmartPack understøttelse

SmartPack er et WMS bygget til e-handel. Det integrerer direkte med ERP-systemer som Business Central og e-conomic via API og webhooks. Ordrer hentes automatisk, behandles i pluk/pak-flow med TSP-optimerede ruter, og afsendelsesstatus sendes tilbage til ERP i realtid. Lagertal opdateres via SignalR, så ERP altid ser aktuelle tal – ingen batches, ingen forsinkelse.

## FAQ

**Kan mit ERP erstatte et WMS?**
Til simple lageroperationer: ja. Over 100-200 ordrer/dag med pluk på tværs af lokationer: nej. ERP mangler plukoptimering, batch picking og medarbejder-tracking.

**Hvad koster det ikke at have WMS?**
Primært via fejlpluk (5-15x ekstraomkostning pr. fejlordre) og ineffektiv gangtid. Sekundært via manglende sporbarhed og svær skalerbarhed.

**Kan WMS og ERP have forskellig beholdning?**
Det sker, hvis integrationen ikke er realtids, eller hvis der er manuelle korrektioner i ét system. Det bør aktivere alarm – det er symptom på integrationsproblemer.

**Hvornår bør jeg implementere begge?**
Senest ved 150-200 daglige ordrer eller ved første gang, en lagermedarbejder ikke kan finde en vare på hylden. Begge er tidlige faresignaler.

**Hvad er forskellen på batch picking og normal pluk?**
Batch picking samler pluk fra flere ordrer i én lagerrunde. Det reducerer gangtid dramatisk, men kræver WMS til at styre sortering og fordeling – ERP kan ikke dette.
