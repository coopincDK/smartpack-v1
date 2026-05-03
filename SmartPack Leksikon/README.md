# SmartPack — Komplet Leksikon og Opslagsværk

> **Version:** SmartPack v1.34.0.0
> **Format:** Lossless transformation — 100% af original viden bevaret og struktureret
> **Datakilder:** Live system · support.smartpack.dk (61 artikler) · Word-kvikguider · GitHub-side · Domæneviden

---

## Filstruktur

| Fil | Størrelse | Indhold |
|-----|-----------|---------|
| **terminal.md** | ~84 KB | Alt til lagermedarbejderen på terminalen |
| **admin.md** | ~88 KB | Alt til superbrugeren/lederen i Admin-panelet |
| **integrationer.md** | ~10 KB | Alle integrationer: BC, Shopify, e-conomic, GLS, PostNord m.fl. |
| **fejlkoder.md** | ~7 KB | Alle fejlkoder med årsag og løsning |
| **ordbog.md** | ~11 KB | Alle begreber A til Å |

| **lagerhåndbog.md** | ~59 KB | Lagerhåndbog for den voksende webshop |

| **generel-logistik.md** | ~34 KB | Farliggods, kølekæde, WiFi, B2B, QC, årsafslutning, sæson, nedbrud, WMS ROI, Intrastat, IOSS, WEEE, CE, GDPR, emballagelovgivning |

| **smartpack-avanceret.md** | ~15 KB | Onboarding-guide, Refill limit, Lageralerts, CSV-import, Webhooks |

| **lager-strategi.md** | ~35 KB | CEO-niveau: CPO, kapacitetsgrænser, fejltaksonomi, retur-økonomi, datahygiejne, layout-evolution, medarbejder, integration-failure, hvornår skifte |

**Samlet:** ~440 KB leksikon-indhold

---

## Hvem bruger hvad

### Lagermedarbejder → terminal.md

| Emne | Dækker |
|------|--------|
| Hardware og opsætning | Newland, Zebra, Printservice, browser |
| Login og navigation | QR-login, hjemknap, baglås |
| Ankomst | Modtagelse, bundles, batch, GS1 |
| Retur | Returtyper, returflow |
| Pluk | Alle strategier, fejlhåndtering |
| Pak | Labelprint, genudskriv, fejl |
| Flyt lager | Genopfyldning, direkte flytning |
| Revision | Stock audit, LOT/batch, karantæne |
| Andre apps | Ordreinfo, Produktinfo, Produktion |
| Indstillinger | Printer, stemme, automatisering |

### Superbruger / Leder → admin.md

| Emne | Dækker |
|------|--------|
| Dashboard | KPI-tiles, Dashboard Builder, Employee Performance |
| Ordrer | Alle ordrehandlinger, dropshipping, klon, LabelOnly |
| Produkter | Alle 5 typer, alle felter, stregkoder, flags |
| Indkøb | Indkøbsordrer, leverandører, forecasting, presell |
| Lager | Reguleringer, revisionszoner |
| Lagerdesigner | Optegning, placeringer, sektioner |
| Plukkeprofiler | Alle 10 faner, eksklusive profiler |
| Sorteringszoner | Regler, deadlines, cut-off |
| Leveringsmetoder | Opsætning, priser, checkout |
| Rapporter | 6 rapporttyper, batchsporing, serienummer |
| E-mails | Alle 3 typer, filtre, BCC |
| Systemindstillinger | CSV, DNS, API, Genstart |

### Alle med lager → lagerhåndbog.md

| Emne | Dækker |
|------|--------|
| ABC-analyse | Placering efter salgsfrekvens, trin-for-trin |
| Lagerindretning | Tre zoner, flow, pakkebordet |
| Plukkestrategi | Batch, single-line, multi-line |
| Hardware | Plukkevogne, ROI-beregning |
| Min/Max og rød streg | Lagerstyring uden system |
| Pakkefejl | Dobbelttjek, fejllog, mønsteranalyse |
| Returer | Returzone, returflow, returlog |
| Svind | Tre typer, rullende optælling |
| Nøgletal | De 5 vigtigste, implementering |
| Fragt | Optimering, regler i shoppen |
| Emballage | Tre niveauer, wow-faktor |
| Kampagnedage | Forberedelse, eksekvering, oprydning |
| 3PL | Hvornår, fordele, faldgruber, exit-plan |

### Tekniker / Integrator → integrationer.md

| Integration | Dækker |
|------------|--------|
| Business Central | Opsætning, client secret, fejl |
| Shopify | Manuel ordre gotcha, fejl |
| e-conomic | Grant token, synkfrekvens, fejl |
| GLS | Alle services, method keys, addons, fejl |
| PostNord | MISKOS-nummer |
| Bring | Telefonnummer-krav |
| BFT, DanDomain, Herodesk | Specifik opsætning |

---

## Hurtig reference

### Support

| Kanal | Detalje |
|-------|---------|
| **Dokumentation** | https://support.smartpack.dk/da/ |
| **Telefon** | +45 88 20 20 19 · Tast 2 (support) · Tast 9 (akut) |
| **Email** | support@smartpack.dk |
| **In-app chat** | Kræver superbruger + email på profil — Sofia AI svarer øjeblikkeligt |
| **Quicksupport Windows** | https://coopincdk.github.io/smartpack-v1/#quicksupport-windows |
| **Quicksupport Mac** | https://coopincdk.github.io/smartpack-v1/#quicksupport-mac |
| **YouTube** | https://www.youtube.com/@SmartPackWMS |
| **API + Changelog** | https://demo.smartpack.dk/ |
| **Integrationer** | https://smartpack.dk/integrationer/ |

### Vigtigste gotchas

| Gotcha | Artikel |
|--------|---------|
| Modtag ALDRIG en bundle-SKU ved ankomst | terminal.md — Ankomst — Bundles |
| Printservice: klik ALDRIG på X | terminal.md — Printservice |
| Valg af printer: tryk UDENFOR dropdown for at gemme | terminal.md — Printerindstillinger |
| "Udskriv igen" vs. grøn Print-knap: FORSKELLIG effekt | terminal.md — Labelprint Genudskriv |
| Email-skabelon: BEGGE flueben skal markeres | admin.md — Email-skabeloner |
| Flush DNS: køres på ALLE Printservice-computere | terminal.md — Flush DNS |
| BC client secret udløber efter 2 år | integrationer.md — BC |
| Shopify manuel ordre: brug "Shipping rates" ikke "Custom shipping" | integrationer.md — Shopify |
| DanDomain: fakturamail kan kun sendes én gang | integrationer.md — DanDomain |

---

*SmartPack Leksikon · Genereret April/Maj 2026 · Komplet lossless transformation*
