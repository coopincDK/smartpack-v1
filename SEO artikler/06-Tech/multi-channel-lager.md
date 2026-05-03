---
primary_keyword: multi-channel lagerstyring
secondary_keywords: [multi-channel wms, lager flere kanaler, shopify woocommerce samlet lager, omnichannel lagerstyring]
cluster: 06-Tech
---

# Multi-channel lagerstyring – ét lager, mange salgskanaler

Du sælger på Shopify. Og på WooCommerce. Og måske via e-conomic til B2B-kunder. Og til næste år overvejer du Amazon. Det er multi-channel e-handel – og det er en administrativ mareridt, hvis du ikke har det rigtige lager-setup fra starten. Samme varer. Samme fysiske lager. Men ordrer fra fem forskellige steder.

## Hvad er multi-channel lagerstyring?

Multi-channel lagerstyring er evnen til at modtage ordrer fra flere salgskanaler, behandle dem i ét samlet WMS og opdatere lagertal synkront på alle kanaler. Kanaler kan være:

- **Webshops**: Shopify, WooCommerce, Magento, PrestaShop
- **Markedspladser**: Amazon, Zalando, MENY, Miinto
- **B2B-portaler**: e-conomic ordrer, EDI-ordrer fra detailkæder
- **Fysiske butikker**: kasseintegration (POS)
- **Telefonordrer**: manuelt oprettede ordrer i WMS

Det centrale princip: der er ét lager. Beholdning er ikke opdelt pr. kanal. En vare solgt på Shopify trækker fra samme beholdning som en vare solgt via WooCommerce.

## Hvornår er det et problem?

Uden samlet multi-channel styring opstår disse klassiske problemer:

**Oversalg**: Shopify og WooCommerce har begge 3 enheder på lager. Sælges 2 i Shopify, opdateres WooCommerce ikke. Begge sælger de resterende 3. Du har solgt 5 af det, der er 3 på lager.

**Suboptimal prioritering**: Uden fælles WMS behandler du ordrer i den rækkefølge, de kommer ind i hvert separat system. Du kan ikke prioritere på tværs – f.eks. "B2B-ordrer med ekspressfragt first".

**Rapporteringsfragmentering**: Lagerbeholdning, omsætning og fejlrate for hvert system rapporteres separat. Det er umuligt at få et samlet billede.

**Manuel synkronisering**: Du opdaterer lagertal i hvert system manuelt eller via halvautomatiske scripts. Det er tidskrævende, fejlbehæftet og skaleringsblokerende.

## Arkitekturen bag multi-channel WMS

Et korrekt multi-channel setup ser sådan ud:

```
Shopify ────────┐
WooCommerce ────┤──→ WMS (single source of truth) ──→ Fragtmand
e-conomic ──────┤           ↓
Manuelt ────────┘    Lager-opdatering (alle kanaler)
```

WMS er den centrale hub. Den:
1. Modtager ordrer fra alle kanaler via dedikerede integrationer
2. Behandler alle ordrer i ét samlet flow (pluk, pak, forsend)
3. Opdaterer beholdning på alle kanaler efter hvert salg

### Kanal-identifikation
Hvert ordre tagges med kanalidentifikator:
- `channel: shopify_dk`
- `channel: woocommerce_de`
- `channel: economic_b2b`

Det bruges til rapportering, prioritering og evt. kanalspecifik behandling (f.eks. eget emballage til B2B).

## Realtidslager på tværs af kanaler

Lageroppdatering pr. salg er ikke tilstrækkeligt. Du har brug for reserveret lager:

- Ordre modtaget på Shopify → 1 enhed reserveres straks (ikke trukket fra lager, men reserveret)
- Shopify viser nu 2 tilgængelige (3 minus 1 reserveret)
- WooCommerce opdateres inden for sekunder: 2 tilgængelige
- Trukket fra lager sker ved pakning/afsendelse

Uden reservationsstyring kan to ordrer fra to kanaler race-condition: begge ordres den samme vare inden beholdningen opdateres.

SmartPack bruger SignalR til at sende realtidsopdateringer – badge-tællere (lagerantal) opdateres øjeblikkeligt på tværs af alle tilknyttede systemer.

## Typiske fejl

**1. Ikke reservere lager ved ordremodtagelse**
Lager trækkes kun ved afsendelse. I mellemtiden kan oversalg opstå på travle dage, særligt ved kampagner. Implementér reservation ved ordre-modtagelse.

**2. Behandle kanaler som separate lagre**
Opdele 100 enheder i "50 til Shopify, 50 til WooCommerce" er et antipattern. Det fører til, at Shopify løber tør, mens WooCommerce har 47 enheder stående. Ét fælles lager med kanalprioritering er korrekt.

**3. Glemme kanalspecifik fragtlogik**
GLS fungerer til Shopify, men Shopify DE-ordrer kræver DHL. WooCommerce-ordrer til Norden kræver PostNord. Fragtlogik varierer pr. kanal og destination.

## Sådan gør du det rigtigt

**1. Definer kanalprioritet**: Hvornår der er mangel på varer, hvilken kanal prioriteres? B2B-ordrer? Express-ordrer? Definer det i WMS-konfigurationen.

**2. Test synkronisering under belastning**: Kør et loadtest: 50 samtidige ordrer på tværs af 3 kanaler. Måler du race-conditions på lager? Det er her multi-channel-problemer opstår.

**3. Opsæt kanal-specifik rapportering**: Omsætning, fejlrate og behandlingstid pr. kanal. Det giver grundlag for at investere rigtigt og fejlfinde kanal-specifikt.

## Tjekliste

- [ ] Er alle salgskanaler integreret til ét WMS?
- [ ] Reserveres lager ved ordremodtagelse (ikke kun ved afsendelse)?
- [ ] Opdateres alle kanaler inden for 60 sekunder efter et salg?
- [ ] Er kanalprioritet defineret ved lagermangel?
- [ ] Rapporteres fejlrate og behandlingstid pr. kanal?

## SmartPack understøttelse

SmartPack er bygget til multi-channel fra grunden. Shopify, WooCommerce og e-conomic integreres til ét samlet ordreflow. Lagertal opdateres via SignalR til alle kanaler i realtid. Kanalidentifikation er indbygget – hvert ordre tagges med kanalref. Rapportering kan filtreres pr. kanal.

## FAQ

**Hvad er multi-channel lagerstyring?**
Evnen til at modtage ordrer fra flere salgskanaler (Shopify, WooCommerce, B2B) og behandle dem i ét samlet WMS med fælles lagerbeholdning.

**Kan jeg have separate lagre til separate kanaler?**
Teknisk ja – men det er et antipattern. Det fører til utilstrækkelig udnyttelse af beholdning og kompleks administration. Ét fælles lager med prioriteringsstyring er bedre.

**Hvad er en race-condition i lagerstyring?**
Når to ordrer fra to kanaler behandles simultant for den samme vare, og begge ser tilgængeligt lager – men kun én vare er faktisk på lager. Løses med øjeblikkelig reservation og database-niveau locking.

**Hvad er SignalR i lagersammenhæng?**
En teknologi til realtidskommunikation. I SmartPack bruges SignalR til at sende opdaterede lagertal til alle tilsluttede webshops og WMS-skærme øjeblikkeligt, uden polling.

**Kan jeg tilføje nye kanaler efterfølgende?**
Ja, forudsat WMS har færdigbyggede integrationer til platformen. Typisk en konfigurations-opgave, ikke en kodeændring.

