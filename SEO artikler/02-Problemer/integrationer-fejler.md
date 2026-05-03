---
primary_keyword: lager integrationer fejler
secondary_keywords: [shopify wms integration, api fejl lager, system integration, lager automation]
cluster: 02-Problemer
---

# Integrationer fejler – når systemer ikke taler sammen

Kl. 10:00: Integration mellem Shopify og WMS fejler. Ordrer stopper med at synkronisere.

Kl. 12:00: Kundeservice opdager problemet. 47 ordrer er ikke nået til WMS.

Kl. 14:00: IT-ansvarlig fikser integration. Ordrer synkroniserer. Men 47 ordrer er nu 4 timer forsinkede.

15 af dem skulle sendes samme dag (cutoff 15:30). De når det ikke.

**Cost:**
- 15 forsinkede ordrer × (680 kr. + 500 kr. kompensation) = 17.700 kr.
- Kundeservice: 3 timer × 250 kr. = 750 kr.
- IT-tid: 2 timer × 500 kr. = 1.000 kr.
- **Total: 19.450 kr. på én fejl**

Ved 2 integrationsfejl/måned: 466.800 kr./år.

Denne artikel viser hvordan du bygger robuste integrationer – og hvad du gør når de fejler.

## Hvad mener vi med "integrationer fejler"?

Integrationsfejl betyder:
- Shopify → WMS synkronisering stopper
- Lagerbeholdning opdateres ikke
- Ordrer forsvinder mellem systemer
- API-kald fejler uden alarm
- Ingen ved det før kunder klager

## Hvornår er det et problem?

Integrationsfejl er et problem når:
- Integration fejler mere end 1 gang/måned
- Ingen alarm når integration stopper
- Ordrer forsvinder mellem systemer
- Manuel gensynkronisering kræves
- Du opdager fejl først når kunder klager

## Regnestykket: Hvad koster integrationsfejl?

**Scenarie: 200 ordrer/dag, integration fejler 2 gange/måned**

**Per fejl:**
- Gennemsnitlig varighed: 4 timer
- Ordrer påvirket: 200 × (4/24) = 33 ordrer
- Forsinkede leveringer: 10 ordrer
- Cost per forsinket: 1.180 kr. (ordre + kompensation)
- **Cost per fejl: 11.800 kr.**

**Månedlig:**
- 2 fejl × 11.800 kr. = **23.600 kr./måned**
- **Årlig: 283.200 kr.**

**Plus indirekte:**
- IT-tid: 4 timer/måned × 500 kr. = 2.000 kr./måned
- Kundeservice: 6 timer/måned × 250 kr. = 1.500 kr./måned
- **Total indirekte: 42.000 kr./år**

**Total cost: 325.200 kr./år**

**Med robust integration + alarmer:**
- Fejl opdages inden for 5 minutter
- Automatisk retry
- Cost: 32.000 kr./år

**Besparelse: 293.200 kr./år**

## Hvad sker der i praksis

Shopify opdaterer API. Integration bruger gammel API-version. Fejler.

Ingen alarm. Ordrer synkroniserer ikke.

4 timer senere: Kundeservice opdager det. "Hvorfor er ordre #1247 ikke plukket?"

IT tjekker. Integration fejlet. Fikser. Men 33 ordrer er forsinkede.

## Typiske fejl

**1. Ingen monitoring**
Integration kører. Du antager den virker. Ingen tjekker.

**2. Ingen alarmer**
Integration fejler. Ingen ved det før kunder klager.

**3. Ingen retry-logik**
API-kald fejler. Integration stopper. Ingen automatisk retry.

**4. Ingen fallback**
Integration fejler. Ingen manuel proces som backup.

## Sådan gør du det rigtigt

**1. Implementer monitoring (dag 1)**
- Tjek hvert 5. minut: Synkroniserer ordrer?
- Tjek hvert 5. minut: Opdateres lagerbeholdning?
- Alarm hvis nej

**2. Implementer alarmer (dag 1)**
- SMS til IT-ansvarlig hvis integration fejler
- Email til lagerchefen hvis ordrer ikke synkroniserer
- Dashboard viser: Integration status (grøn/rød)

**3. Implementer retry-logik (uge 1)**
- API-kald fejler → Retry efter 30 sekunder
- Fejler igen → Retry efter 2 minutter
- Fejler 3 gange → Alarm

**4. Lav fallback-procedure (uge 1)**
- Integration fejler → Manuel eksport fra Shopify
- Import til WMS
- Midlertidig løsning mens integration fikses

**5. Test integration ugentligt**
- Send testordre
- Tjek: Synkroniserer den?
- Opdateres lagerbeholdning?

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Implementer monitoring (tjek hvert 5. minut)
- [ ] Sæt alarmer (SMS/email ved fejl)
- [ ] Implementer retry-logik
- [ ] Lav fallback-procedure
- [ ] Test integration ugentligt
- [ ] Dokumenter: Hvad gør vi når integration fejler?

**Næste skridt:** Læs "For mange systemer" og "Shopify er ikke nok" for fuld systemforståelse.

## SmartPack understøttelse

SmartPack-integration til Shopify:
- Monitoring hver 60 sekunder
- Automatisk retry ved fejl
- SMS-alarm til lagerchefen ved fejl
- Dashboard viser: Integration status realtid
- Fallback: Manuel import hvis integration fejler

Typisk uptime: 99,9%+

## FAQ

**Hvor ofte fejler integrationer?**
Uden monitoring: 1-3 gange/måned. Med monitoring + retry: 1-2 gange/år.

**Hvad gør vi når integration fejler?**
1. Tjek alarm. 2. Tjek logs. 3. Retry manuelt. 4. Kontakt support hvis det ikke virker.

**Skal vi have IT-ansvarlig 24/7?**
Nej. Men alarmer skal gå til nogen der kan handle. Lagerchefen kan køre fallback-procedure.

**Hvad med Shopify API-opdateringer?**
SmartPack opdaterer automatisk til ny API-version. Ingen manuel handling krævet.

**Hvordan tester vi integration?**
Send testordre ugentligt. Tjek: Synkroniserer den til WMS? Opdateres lagerbeholdning?
