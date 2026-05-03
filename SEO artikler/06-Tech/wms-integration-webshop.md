---
primary_keyword: WMS integration webshop
secondary_keywords: shopify wms integration, woocommerce lager system, wms ecommerce integration, lager webshop forbindelse
cluster: 06-Tech
---

# WMS-integration med webshop – fundamentet for fejlfri ordrebehandling

Torsdag kl. 14:23. Kunde bestiller. Shopify opretter ordre. Webhook sendes til WMS. WMS modtager... ingenting. Webhook-endpoint timeout. Ordre sidder i Shopify. WMS ved intet. Fredag morgen: kunde ringer. "Hvorfor er min ordre ikke afsendt?" Opdager fejlen. 18 timer forsinket. LTV-tab: 2.400 kr.

## Hvad er WMS-webshop integration?

Integration betyder, at din webshop og dit WMS udveksler data automatisk i realtid:

**Ordreflow (webshop → WMS):**
- Ny ordre i webshop oprettes automatisk i WMS inden for sekunder
- Ordrestatus (behandlet, pakket, sendt) opdateres i webshop automatisk
- Tracking-nummer sendes til kunden automatisk

**Beholdningsflow (WMS → webshop):**
- Beholdning opdateres i webshop ved pluk, modtagelse og retur
- Webshop viser aldrig varer på lager, som faktisk er udsolgt
- Oversalg elimineres

**Produktdata (opsætning):**
- Nye produkter registreres i WMS ved import fra webshop
- Stregkoder, dimensioner og vægter synkroniseres

## Hvad koster manglende WMS-webshop integration?

| Scenarie | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Manuel ordrekopiering (fejlrate 1-3%) | 100% af ordrer | 500 × 2 min × 200 kr./time = 33.333 kr./måned | Fejl: 15 ordrer/dag × 450 kr. = 6.750 kr./dag | **2.087.500 kr./år** |
| Daglig beholdningsopdatering (ikke realtid) | Oversalg: 10 ordrer/dag | 10 × 350 kr. = 3.500 kr./dag | 10 × 2.400 = 24.000 kr./dag | **10.037.500 kr./år** |
| Manuel tracking-kopiering | 5% glemmes = 25/dag | Kundeservice: 2.500 kr./dag | 25 × 0,15 × 2.400 = 9.000 kr./dag | **4.197.500 kr./år** |

**Konklusion:** Daglig beholdningsopdatering (ikke realtid) er den dyreste fejl. Manuel ordrekopiering er den hyppigste.

## Uden integration: Hvad sker der?

**Scenarie 1:** 200 ordrer/dag. Medarbejder kopierer ordrer manuelt fra webshop til WMS. 1-3% fejl i kopiering. 2-4 fejlordrer per dag × 500 kr. = 1.000-2.000 kr./dag = **365.000-730.000 kr./år**.

**Scenarie 2:** Webshop opdateres dagligt med beholdning. I løbet af dagen sælger WMS ned. Webshop viser stadig 5 på lager. Kunden bestiller. Varen er udsolgt. **Oversalg og kundefrustration.**

**Scenarie 3:** Tracking-numre kopieres manuelt. Ét glemmes. Kunden har ikke modtaget pakken men finder ikke tracking-info. Kontakter support. **Unødvendig support-håndtering: 30 min × 250 kr./time = 125 kr.**

## Standard webshop-platforme og integration

| Platform | Integrationsmetode | Kompleksitet |
|----------|-------------------|--------------|
| Shopify | Official API + App Store | Lav |
| WooCommerce | REST API + Plugin | Lav-medium |
| Magento/Adobe Commerce | API | Medium |
| Custom webshop | Custom API-integration | Høj |
| PrestaShop | API + modul | Medium |

## Hvad kræver en god integration?

**Teknisk:**
- Webhook-baseret ordreflow (ikke polling)
- To-vejs beholdningssynkronisering
- Error-handling og retry-logik
- Monitoring og alarm ved fejl

**Funktionelt:**
- Ordrestatus-opdatering (webshop ser behandlet, sendt, leveret)
- Automatisk tracking-deling med kunden
- Multi-kanal support (en webshop + en eller flere markedspladser)

## Typiske fejl

1. **Bruger ét-vejs integration** – Ordrer fra webshop til WMS, men beholdning opdateres ikke tilbage. Oversalg er uundgåeligt.

2. **Ingen error-handling** – En fejlet API-ordre havner ikke i WMS. Ingen alarm. Ordren behandles aldrig. Kunden klager.

3. **Tester ikke under spidsbelastning** – Integration der virker ved 50 ordrer/dag kan fejle ved 500.

## Sådan gør du det rigtigt

1. **Kræv webhook-baseret integration** – Real-time kommunikation, ikke polling hvert 15. minut.

2. **Implementér monitoring** – En alarm når en ordre fejler i API-kald er afgørende. Uden det opdager du det kun via kundeklager.

3. **Test med Black Friday-volumen** – Send 10× normal ordrervolumen i test. Det afslører kapacitetsproblemer i integrationen.

## SmartPack understøttelse

SmartPack har forudbyggede integrationer til Shopify, WooCommerce, Magento og de fleste andre gængse platforme. Integrationen er to-vejs, webhook-baseret og inkluderer automatisk tracking-deling. Opsætning typisk under 2 timer for standard-platforme.

## FAQ

**Hvad er forskellen på App og API-integration?**
App (fx Shopify App Store): Forudbygget, hurtig opsætning, begrænset tilpasning. API: Fuld fleksibilitet, kræver mere teknisk setup.

**Kan jeg integrere med Shopify og en B2B-platform simultant?**
Ja. Multi-channel integration er standard i moderne WMS. Alle ordrer samles og behandles i ét system.

**Hvad koster custom webshop-integration?**
50.000-200.000 kr. for en robust custom-integration. Det er en af de vigtigste grunde til at vælge standard-platforme.

**Hvad sker der med ordre, der fejler i API-kald?**
De bør havne i en fejlkø med alarm til operations-team. Uden dette er de usynlige – og kunden venter forgæves.

**Kan integration håndtere returns automatisk?**
Ja. Mange integrationer understøtter automatisk returregistrering: kunden logger retur på webshop, WMS modtager automatisk og opretter returordre.
