---
primary_keyword: wifi lager opsaetning
secondary_keywords: [wifi access points lager, traadles lager, wlan lager, wifi dekning lager]
cluster: 06-Tech
article_type: beslutning
---

# WiFi på lager – dækning, access points og hvad dårlig WiFi koster

## Kort svar

Et lager på 1.000 m² behøver typisk 3-6 enterprise WiFi-access points (Ubiquiti UniFi eller Cisco Meraki) til pålidelig scanning-dækning. Dårlig WiFi er den hyppigste årsag til scanner-problemer og WMS-nedbrud. Budget: 1.500-5.000 kr. per access point.

## Hvad er kravet til WiFi på et lager?

Et WMS kører realtids-kommunikation: hvert scan sender og modtager data inden for 200-500 ms. Krav til lager-WiFi:

- **Signal styrke**: -70 dBm eller bedre i alle zoner (ikke -80 dBm som er consumer-grade minimum)
- **Latency**: under 50 ms fra scanner til WMS-server
- **Kapacitet**: 1 forbundet enhed per 3-5 m² (scanner-tunge zoner)
- **Roaming**: håndterminaler skal seamlessly roame mellem access points
- **Interference**: industri-lager med metal-reoler kaster WiFi-signal rundt. Kræver enterprise AP med beamforming

Forskellen på enterprise og consumer WiFi:
- **Consumer (TP-Link, D-Link hjemmerouter)**: 1 AP dækker "godt nok" til 150 m². Forbindelser droppes under belastning. Ingen roaming.
- **Enterprise (Ubiquiti UniFi, Cisco Meraki, Aruba)**: Designet til mange samtidige enheder, roaming, central management. 1 AP dækker 200-500 m² afhængig af layout.

## Hvornår er WiFi et problem?

- **Scannere "freezer" i bestemte zoner**: WiFi-døde plet. AP placeret forkert eller signal blokeret af metal.
- **WMS tænker for længe når scanninger bekræftes**: latency-problem. Mulig årsag: overbelastet router, dårlig backbone.
- **Scannere kobler fra ved roaming**: consumer-grade AP håndterer ikke seamless roaming. Scanner død i 5-10 sek. ved overgang.
- **Alle scannere langsom ved peak**: for få AP'er til antallet af samtidige enheder.

## Hvad dårlig WiFi koster

Hvis WMS-scanner dropper forbindelsen 3 gange pr. vagt à 30 sekunders genopbygning:
- 3 × 30 sek. = 1,5 min per plukker per dag
- 5 plukkere = 7,5 min/dag = 37,5 timer/år
- **37,5 timer × 250 kr./time = 9.375 kr./år**

Et enterprise WiFi-setup (5 access points, switch, installation) koster typisk 25.000-50.000 kr. Tilbagbetalingstid: 2-5 år i rød produktivitet – reelt hurtigere når fejlscanning og frustrationer regnes med.

## Lager-WiFi setup: guide

### Trin 1: WiFi-survey
Før køb: lav en WiFi-survey med en app (NetSpot gratis version) for at finde nuværende signal-svage områder. Marker lagerplanen.

### Trin 2: AP-placering
Regler:
- Monteres i loft (ikke vægge) for at undgå reoler som signal-blokeringer
- Max 15-20 meter mellem access points i åbent lager
- Tættest AP-dækning i pakke- og plukzoner (højeste aktivitet)
- Ekstra AP ved kølerum (metal og temperatur dæmper signal)

### Trin 3: Enterprise AP (anbefalet modeller)

| Model | Pris | Dækning | Bedst til |
|-------|------|---------|----------|
| Ubiquiti UniFi U6 Lite | 1.500 kr. | 300 m² | Lille lager |
| Ubiquiti UniFi U6 Pro | 3.000 kr. | 500 m² | Medium lager |
| Cisco Meraki MR36 | 4.500 kr. | 400 m² | Managed, enterprise |
| Aruba AP-515 | 5.500 kr. | 600 m² | Stort lager, høj densitet |

**Ubiquiti UniFi** er standardvalget for danske SMV-lagre: rimelig pris, god software (UniFi controller), stabil roaming, ingen løbende licensomkostning.

### Trin 4: Separat VLAN til scannere
Isolerer scanner-trafik fra kontornetværk. Giver bedre sikkerhed og QoS-prioritering af WMS-trafik.

## Typiske fejl

**1. Bruge hjemmerouter på lager**
Dårlig roaming, ingen central management, falder ned under belastning. Kostbar fejl der opdages når det er for sent.

**2. Montere AP på vægg i stedet for loft**
Metal-reoler blokerer signal. Loft-montering giver 360-graders dækning.

**3. Ikke teste med aktive scannere**
Test altid med de faktiske enheder under belastning (alle scannere aktive) – ikke bare med telefon.

## SmartPack understøttelse

SmartPack kører via HTTPS i browser på alle WiFi-enheder. Anbefalet minimum: -65 dBm signal og under 30 ms latency. SmartPack's pakkestations-flow er designet til at genoptage session ved kortvarig WiFi-drop (under 30 sek.) uden datatab.

## FAQ

**Hvor mange access points behøver jeg?**
Hovedregl: 1 enterprise AP per 200-400 m² åbent lager. Tilføj ekstra AP ved høj scanner-densitet (over 5 samtidige enheder per 100 m²).

**Kan jeg bruge 5 GHz bånd til scannere?**
Ja, og anbefalet. 5 GHz er hurtigere og mindre overfyldt end 2,4 GHz. Kontrollér at dine scannere understøtter 5 GHz (de fleste enterprise-scannere gør det).

**Hvad er Ubiquiti UniFi?**
Et netværksøkosystem (switches, access points, routere) designet til SMV. Central management via UniFi controller-software (gratis). Standard i danske SMV-lagre.

**Kan en scanner virke uden WiFi?**
Nej, når den er tilsluttet WMS. Lokal buffering (scan offline, sync når WiFi er tilbage) er mulig i visse WMS-setups men ikke standard.

## Læs også

- [Håndterminal til lager – valg](/viden/tech/haandterminal-valg)
- [Scanner-typer til lager](/viden/tech/scanner-typer-sammenligning)
- [Real-time inventory](/viden/tech/real-time-inventory)
- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
