---
primary_keyword: shopify lagerstyring begrænsninger
secondary_keywords: [shopify wms integration, shopify lager problemer, shopify vs wms, shopify inventory]
cluster: 02-Problemer
---

# Shopify er ikke nok – hvornår webshop-platformen ikke kan håndtere lageret

Du kører Shopify. Det fungerer fint til salg. Men lageret? Det er kaos.

Shopify viser "på lager". Plukker går til hylden. Varen er udsolgt. Sidste enhed blev solgt for 2 timer siden. Shopify opdaterede ikke.

Kunde får "beklager, udsolgt". Skriver 1-stjernet anmeldelse. Cost: 680 kr. tabt ordre + 3 tabte konverteringer fra anmeldelse = 2.720 kr.

Ved 80 ordrer/dag og 2% oversalg: 1,6 oversalg/dag × 2.720 kr. = 4.352 kr./dag = 1.088.000 kr./år.

Denne artikel viser præcis hvornår Shopify knækker – og hvad alternativet koster.

## Hvad mener vi med "Shopify er ikke nok"?

Shopify er en webshop-platform. Den håndterer:
- Produktvisning
- Checkout
- Betalinger
- Ordremodtagelse

Shopify er IKKE et WMS. Den håndterer ikke:
- Multi-lokation inden for samme lager
- Plukruter optimering
- Batch picking
- Scanning-validering
- Realtids lageropdatering ved høj trafik

## Præcise breakpoints: Hvornår Shopify knækker

### Under 30 ordrer/dag
**Shopify er fint.**
- Lagerstyring i Shopify admin
- Manuel opdatering acceptabel
- Oversalg sjældent

### 30-80 ordrer/dag
**Shopify begynder at fejle.**
- Forsinkelse i lageropdatering ved høj trafik
- Oversalg 1-2 gange/måned
- **Cost: 2 × 450 kr. × 12 = 10.800 kr./år**

### Over 80 ordrer/dag
**Shopify er aktivt farligt.**
- Oversalg ugentligt under kampagner
- Ingen lokationsstyring
- Plukfejl 2-3%
- **Cost: 280.000+ kr./år**

**Konklusion:** Implementer WMS senest ved 80 ordrer/dag.

## Hvornår er det et problem?

Shopify-lagerstyring er et strukturelt problem når:
- Du har over 80 ordrer/dag
- Du har flere lokationer for samme SKU
- Du bruger batch picking
- Du har haft oversalg mere end 1 gang/måned
- Plukfejl overstiger 1,5%
- Black Friday volumen er 4x+ normal

## Regnestykket: Shopify vs. Shopify + WMS

**Scenarie: 200 ordrer/dag, kun Shopify**

**Oversalg:**
- Oversalg-rate: 2%
- Oversalg/dag: 200 × 2% = 4
- Cost per oversalg: 680 kr. (ordre) + 2.040 kr. (LTV-tab) = 2.720 kr.
- **Daglig: 10.880 kr.**
- **Årlig: 2.720.000 kr.**

**Plukfejl:**
- Fejlrate uden WMS: 2,5%
- Fejl/dag: 200 × 2,5% = 5
- Cost: 5 × 450 kr. = 2.250 kr./dag
- **Årlig: 562.500 kr.**

**Total cost: 3.282.500 kr./år**

**Med Shopify + SmartPack:**
- Oversalg: 0,1% = 50.000 kr./år
- Plukfejl: 0,6% = 135.000 kr./år
- SmartPack cost: 60.000 kr./år
- **Total: 245.000 kr./år**

**Besparelse: 3.037.500 kr./år**

## Hvad sker der i praksis

Black Friday. 6x normal volumen. Shopify håndterer checkout fint. Men lageropdatering? Forsinkelse på 5-15 minutter.

Resultat: 30 oversalg på én dag. 30 × 2.720 kr. = 81.600 kr. tabt på én dag.

Plus: 15 kundeservice-timer til at håndtere klager. Plus: 8 negative anmeldelser.

## SmartPack: Hvornår JA, hvornår NEJ

**JA til SmartPack hvis:**
- Over 50 ordrer/dag + Shopify som webshop → Integration inkluderet, oversalg elimineres
- Planlægger Black Friday → 6× volumen kræver WMS, ikke Shopify-apps
- Fejlrate over 1,5% → Scanning reducerer til 0,6%

**NEJ til SmartPack hvis:**
- Under 30 ordrer/dag + simpelt sortiment → Shopify er billigere
- Bruger Shopify POS + fysisk butik primært → Shopify-økosystem er nok

**Konkret kr.-konsekvens:**
| Scenarie | Shopify alene | Shopify + SmartPack | Forskel |
|----------|---------------|---------------------|----------|
| 200 ordrer/dag, 3% fejl | 270.000 kr./år fejl | 45.000 kr./år fejl | **225.000 kr. spart** |
| Black Friday (1.200 ordrer) | 15-30 oversalg = 13.500 kr. | 0 oversalg | **13.500 kr. spart** |

## Typiske fejl

**1. Tro at Shopify-apps løser WMS-behovet**
Shopify-apps forbedrer Shopify. De erstatter ikke et WMS.

**2. Vente til Black Friday fejler**
Implementer WMS 2 måneder før Black Friday. Ikke 2 uger før.

**3. Bruge Shopify-lokationer som WMS**
Shopify-lokationer er designet til flere butikker/lagre. Ikke til hylder inden for samme lager.

**4. Ignorere scanning**
Shopify har ingen scanning-validering. Det er derfor fejlraten er høj.

## Sådan gør du det rigtigt

**1. Integrer Shopify + WMS**
Shopify håndterer salg. WMS håndterer lager. Integration synkroniserer realtid.

**2. Behold Shopify til det den er god til**
Webshop, checkout, marketing. Flyt IKKE til anden platform.

**3. Implementer WMS til det Shopify ikke kan**
Plukruter, scanning, multi-lokation, batch picking.

**4. Test integration før peak**
Kør parallel i 2 uger. Tjek at lageropdatering virker realtid.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Tæl daglige ordrer sidste 30 dage
- [ ] Tjek oversalg sidste 3 måneder
- [ ] Beregn plukfejl-rate
- [ ] Hvis over 50 ordrer/dag: Planlæg WMS-integration
- [ ] Hvis Black Friday nærmer sig: Implementer NU

**Næste skridt:** Læs "Excel bryder sammen" og "For mange systemer" for fuld systemforståelse.

## SmartPack understøttelse

SmartPack integrerer direkte med Shopify. Ordre fra Shopify → SmartPack WMS → Pluk med scanning → Lageropdatering tilbage til Shopify realtid. Oversalg elimineres. Plukfejl reduceres til 0,6%. Shopify forbliver jeres webshop. SmartPack bliver jeres lager.

## FAQ

**Skal vi forlade Shopify?**
Nej. Behold Shopify til webshop. Tilføj WMS til lager.

**Hvad med Shopify POS?**
Shopify POS er fint til fysisk butik. Men hvis webshop er primær: WMS er nødvendigt.

**Kan Shopify-apps erstatte WMS?**
Nej. Apps forbedrer Shopify. De tilføjer ikke scanning, plukruter eller batch picking.

**Hvornår er Shopify nok?**
Under 30 ordrer/dag + simpelt sortiment + ingen Black Friday.

**Hvad koster integration?**
SmartPack-integration til Shopify er inkluderet. Ingen ekstra cost.
