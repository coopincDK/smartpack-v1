# Billed-brief: 145 fotos til artikler uden billede

Kort udgave: **145 artikler mangler et foto. Der skal laves ét billede til hver. 145 filer i alt.**

Vi har 246 artikler i viden-sektionen. 87 havde et billede, 159 havde ikke. 14 af dem er siden lavet
som animerede tegninger og ligger på sitet nu, så der mangler 145. De bruger alle ét enkelt billede
øverst i artiklen, og det er den samme opskrift her: ét billede pr. artikel, ikke flere.

## Sådan skal filerne se ud

| | |
|---|---|
| Format | JPG |
| Størrelse | 2752 x 1536 pixels (16:9) |
| Filstørrelse | Gerne under 400 kB pr. fil. Vi komprimerer selv hvis de bliver større |
| Filnavn | Præcis som i tabellerne nedenfor. Kun a-z, 0-9 og bindestreg. Ingen æ, ø, å, ingen mellemrum, ingen store bogstaver |
| Levering | Én mappe med alle filerne. Filnavnet er det eneste der kobler billede og artikel, så det skal passe præcist |

Numrene følger den samlede række fra 21 til 179. De numre der springes over i tabellerne, er dem der allerede er lavet.

## Stil

Fotorealistisk. Dansk/nordeuropæisk lager i normal størrelse, ikke en amerikansk mega-hal. Dagslys eller neutralt hallys, let afdæmpede farver. Tingene skal se brugte ud, ikke som et showroom. Kamera i øjenhøjde eller let ovenfra. Ingen tekst nogen steder i billedet. Ingen firmanavne, varemærker eller læsbare labels. Ingen genkendelige ansigter, folk ses bagfra, fra siden eller beskåret. Bredformat 16:9.

De 20 vi allerede har ligger i `assets/viden/artikel_billeder/` og er facit på stilen.
Se særligt `01-pakkebord-setup.jpg` og `09-dead-stock-stoevede-varer.jpg`.

**Vigtigt om tekst i billedet:** ét af vores eksisterende billeder, `15-webhook-flowdiagram.jpg`,
har tekst i selve billedet, og den tekst ligger hen over ikonerne så det ser forkert ud.
Derfor står der ingen tekst i stilbeskrivelsen ovenfor. Skal der stå noget på et billede,
laver vi det som rigtig grafik bagefter.

## Tabellerne

**Prompt** er beskrivelsen af motivet. Stilafsnittet ovenfor gælder for dem alle, så det skal
sættes foran hver enkelt prompt. **Alt-tekst** er til hjemmesiden og skal ikke bruges til at
lave billedet. CSV-filen ved siden af har stil og prompt sat sammen i én kolonne, klar til at køre.

### Tech (37 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 21 | `21-ai-prognose-skaerm.jpg` | AI på lageret 2026: hvad virker, hvad er hype og hvad koster det | En skærm på en rullebord midt i en lagergang viser en simpel prognosekurve. Reoler og kasser ude af fokus bagved. Køligt dagslys. | Skærm med prognosekurve midt i en lagergang |
| 22 | `22-api-dataforbindelse-server.jpg` | API i lagerstyring, sådan henter og sender dit WMS data | Nærbillede af et lille netværksskab med blinkende lysdioder på en lagervæg, kabler samlet i bøjle, reoler sløret i baggrunden. | Netværksskab på en lagervæg |
| 23 | `23-lotnummer-etiket-paa-kasse.jpg` | Batch- og lotnumre: sådan finder du partiet igen | Nærbillede af en hånd der holder en scanner op mod en etiket med partinummer på en papkasse på en pallereol. | Scanner holdes op mod partinummer på en kasse |
| 24 | `24-batch-pluk-vogn-med-toter.jpg` | Batch picking teknologi: sådan plukker du 3x flere ordrer med samme mandskab | Plukkevogn med seks nummererede plastkasser i to etager midt i en lagergang, en plukker lægger en vare i den tredje kasse. | Plukkevogn med seks toter i en lagergang |
| 25 | `25-erp-skaerm-kontor-ved-lager.jpg` | Business Central integration med WMS, hvad du skal kende inden opsætning | Kontorplads med en stor skærm der viser et regnskabssystem, vindue ud til lagerhallen bagved. | Kontorskærm med udsigt til lagerhallen |
| 27 | `27-fakturakladde-paa-pakkestation.jpg` | e-conomic integration med WMS, ordrer, fakturaer og Grant Token | Pakkebord med en skærm der viser en faktura i kladde, en halvpakket kasse ved siden af. | Skærm med fakturakladde på en pakkestation |
| 28 | `28-b2b-palle-med-foelgeseddel.jpg` | EDI-integrationer på lageret: hvad er det og hvornår er det nødvendigt? | Wrappet palle klar til afhentning med en følgeseddellomme på siden, port åben i baggrunden. | Wrappet B2B-palle med følgeseddellomme |
| 29 | `29-flyt-vare-mellem-pladser.jpg` | Flyt varer på lageret uden at miste sporet | Lagermedarbejder løfter en kasse fra en reolplads over i en anden, terminal i den anden hånd. | Medarbejder flytter en kasse mellem to reolpladser |
| 30 | `30-fragtlabels-tre-transportoerer.jpg` | Fragtintegrationer forklaret, GLS, PostNord, Bring og hvad der skiller dem | Tre pakker side om side på et bord, hver med sin fragtlabel, set skråt oppefra. Ingen læsbare firmanavne. | Tre pakker med hver sin fragtlabel |
| 31 | `31-tracking-bekraeftet-paa-skaerm.jpg` | Fulfillment sync, fra plukket ordre til bekræftet forsendelse | Færdig pakke på vejen ved siden af en skærm med et grønt markeret flueben i en ordreliste. | Pakke på vægt ved siden af skærm med bekræftet ordre |
| 32 | `32-genopfyldning-fra-tote-til-hylde.jpg` | Genopfyldning fra tote: sådan finder systemet selv pladsen | Medarbejder tømmer en blå tote over i en plukhylde i øjenhøjde, tom plads til højre i hylden. | Medarbejder fylder varer fra tote op i en plukhylde |
| 33 | `33-kundeservice-med-lager-i-baggrund.jpg` | Herodesk + SmartPack: kundeservice der styrer lageret | Kundeservicemedarbejder med headset ved en skærm, glasvæg med lagerhal bagved. | Kundeservicemedarbejder med headset foran en lagerhal |
| 35 | `35-api-opsaetning-paa-skaerm.jpg` | Lager API-integration: hvad det er, hvornår du har brug for det og hvad det koster | Udvikler-arbejdsplads ved kanten af et lager, to skærme, den ene med en dataliste, lagerreoler ude af fokus. | Arbejdsplads med to skærme i udkanten af et lager |
| 36 | `36-automatiseret-lager-transportbaand.jpg` | Lager-automatisering: teknologierne, priserne og hvornår de faktisk giver mening | Langt transportbånd med kasser i bevægelse gennem en moderne lagerhal, ingen mennesker i billedet. | Transportbånd med kasser i en automatiseret lagerhal |
| 37 | `37-systemvalg-tre-tilbud-paa-bord.jpg` | Valg af lagersoftware: de 7 kriterier der afgør om du vælger rigtigt | Mødebord med tre udprintede tilbudsmapper og en kop kaffe, lagerhal svagt synlig gennem glasvæg. | Tre tilbudsmapper på et mødebord |
| 38 | `38-varemodtagelse-med-foelgeseddel.jpg` | Leverandørstyring i WMS: hvad ligger hvor? | Medarbejder ved en åben port tjekker en palle af mod en følgeseddel på et clipboard. | Medarbejder tjekker en palle mod en følgeseddel |
| 39 | `39-haandholdt-terminal-i-haand.jpg` | Mobile scanning og enheder: hvad skal du bruge og hvad koster det? | Nærbillede af en robust håndholdt lagerterminal i en handske-hånd, reol ude af fokus bagved. | Håndholdt lagerterminal i en handske-hånd |
| 40 | `40-samme-lager-flere-salgskanaler.jpg` | Multi-channel lager: håndter salg fra webshop, marketplace og B2B i ét system | Tre pakker med hver sin forskellige emballagetype på samme rullebane, ingen læsbare mærker. | Tre forskellige pakketyper på samme rullebane |
| 41 | `41-tom-plukplads-i-reol.jpg` | Når varen ikke står på hylden: hvad plukkeren gør ved det | Tom plukplads i en ellers fyldt reol, en hånd med terminal holdt op foran den tomme plads. | Tom plukplads i en fyldt reol |
| 42 | `42-ordre-stoppet-inden-pluk.jpg` | Ordreændringer: hvad kundeservice selv kan klare, og hvad der er for sent | Pluksedel der bliver taget af en vogn igen, vognen halvt fyldt, medarbejder i bevægelse. | Pluksedel tages af en halvfyldt plukkevogn |
| 43 | `43-pick-by-light-lys-i-reol.jpg` | Pick-by-light: lysets rolle i fejlfri pluk | Reolfront med små displays hvor ét felt lyser grønt, resten er slukket. Halvmørk lagergang. | Reol med ét lysende pick-by-light-felt |
| 44 | `44-produktdata-vs-lagerplads.jpg` | PIM vs. WMS: hvad er forskellen og hvornår har du brug for begge? | To skærme ved siden af hinanden på samme bord: den ene med produktbilleder, den anden med en pladsoversigt. | To skærme med produktdata og lagerpladser |
| 45 | `45-plukliste-paa-terminal.jpg` | Plukprofiler: sådan styrer du hvilke ordrer der bliver plukket hvordan | Nærbillede af en terminalskærm med en kort plukliste, holdt op foran en reolgang. | Terminalskærm med plukliste foran en reolgang |
| 46 | `46-live-lagertal-paa-skaerm.jpg` | Real-time beholdning: hvorfor forsinket lagerdata koster dig ordrer og penge | Væghængt skærm i lagerhallen med et stort tal og en simpel kurve, medarbejder går forbi i uskarphed. | Væghængt skærm med live lagertal |
| 47 | `47-dashboard-paa-vaegskaerm.jpg` | Realtidstal på lageret: to slags dashboard | Stor vægskærm for enden af en lagerhal med fire simple tælleflader, hallen i dybden. | Stor vægskærm for enden af en lagerhal |
| 48 | `48-rfid-tag-paa-vare.jpg` | RFID på lageret: hvornår giver det mening og hvad koster det? | Nærbillede af et tyndt RFID-mærkat på bagsiden af en vare, en håndlæser ført henover. | RFID-mærkat på en vare med håndlæser |
| 49 | `49-webshop-ordre-til-lager.jpg` | Shopify integration med WMS: komplet opsætningsguide | Bærbar med en ordreoversigt stående på et pakkebord, pakket kasse og tapepistol ved siden af. | Bærbar med ordreoversigt på et pakkebord |
| 50 | `50-udvikler-bygger-paa-lager.jpg` | 10 vilde ting du kan bygge med SmartPack API | Udvikler med bærbar siddende på en palle midt i lagerhallen, kode ude af fokus på skærmen. | Udvikler med bærbar siddende på en palle |
| 51 | `51-stregkode-scannes-paa-vare.jpg` | Stregkode-scanning på lageret: den billigste fejlreduktion du kan købe | Nærbillede af en scanners rode streg hen over en stregkode på en æske. | Stregkode scannes på en æske |
| 52 | `52-eksport-af-data-til-regneark.jpg` | Træk tal ud af dit WMS: sådan finder du eksporten | Skærm med en tabel og en åben eksportknap, kop kaffe og notesblok ved siden af, lager bagved. | Skærm med datatabel og eksportknap |
| 53 | `53-fejlet-ordre-paa-skaerm.jpg` | Typiske integrationsfejl i lagerstyring: og hvordan du undgår dem | Skærm med en ordreliste hvor én række er markeret rod, medarbejder læner sig ind for at kigge. | Ordreliste med én række markeret rod |
| 54 | `54-voice-picking-headset-paa-plukker.jpg` | Voice picking: hvad det er, hvad det koster og hvornår det virker | Plukker med let headset og mikrofon der tager en vare fra en hylde, hænderne fri. | Plukker med headset tager en vare fra hylden |
| 56 | `56-to-systemer-samme-bord.jpg` | WMS og ERP integration: sådan får du de to systemer til at tale sammen | Mødebord med to bærbare åbnet mod hinanden, lagerhal gennem glasvæg bagved. | To bærbare åbnet mod hinanden på et mødebord |
| 57 | `57-ordre-fra-webshop-paa-lager.jpg` | WMS-integration med webshop: fundamentet for fejlfri ordrebehandling | Printet pluksedel der lige er kørt ud af en printer på lageret, reoler bagved. | Pluksedel på vej ud af en printer på lageret |
| 59 | `59-regneark-paa-papir-i-lagergang.jpg` | WMS vs. Excel: hvornår er et regneark ikke nok? | Krollet udprintet regneark på en palle i en lagergang, kuglepenrettelser på arket. | Udprintet regneark med håndskrevne rettelser på en palle |
| 60 | `60-webshop-modul-paa-skaerm.jpg` | WMS vs. Shopify: kan Shopify styre dit lager? | Bærbar på et højt bord i lagerhallen med en simpel lageroversigt på skærmen. | Bærbar med lageroversigt på et højt bord i lagerhallen |
| 61 | `61-webshop-opsaetning-paa-lagerkontor.jpg` | WooCommerce integration med WMS: opsætning og gotchas | Lille lagerkontor med to skærme og en kasse med varer på bordet, hal gennem vinduet. | Lagerkontor med to skærme og en vareæske |

### Hardware (24 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 62 | `62-anti-traethedsmaatte-ved-pakkebord.jpg` | Anti-træthedsmatter på lager: hvad de gør, hvad de koster og hvornår de er det værd | Nærbillede skråt nedefra af en sort skummåtte foran et pakkebord, et par arbejdssko stående på den. | Anti-træthedsmåtte med arbejdssko foran et pakkebord |
| 63 | `63-haevesaenkebord-i-to-hoejder.jpg` | Arbejdshøjde pakkebord: hvad der er korrekt og hvad forkert højde koster dig | Pakkebord med hævesænkesøjler, en medarbejder står oprejst med albuer i ret vinkel over bordpladen. | Medarbejder ved et hævesænke-pakkebord |
| 64 | `64-tung-loeft-fra-nederste-hylde.jpg` | Ergonomi og fejlrate på lageret: sammenhængen der koster dig penge | Medarbejder der bøjer sig helt ned efter en kasse på nederste reolhylde, ryggen krum. | Medarbejder bøjer sig efter en kasse på nederste hylde |
| 65 | `65-god-arbejdsstilling-ved-pluk.jpg` | Ergonomi på lageret: hvad det koster ikke at prioritere det | Plukker der tager en vare fra en hylde i hoftehøjde med rank ryg, vogn tæt på. | Plukker med rank ryg tager en vare i hoftehøjde |
| 66 | `66-labelprinter-ved-pakkestation.jpg` | Fragtlabel-setup: printer, placering og det der går galt | Nærbillede af en termisk labelprinter der lige har kørt en fragtlabel ud, pakke klar ved siden af. | Termisk labelprinter med en fragtlabel på vej ud |
| 67 | `67-fire-slags-fyldmateriale.jpg` | Fyldmateriale til pakning: hvad der virker, hvad der koster for meget og hvad der er overflødigt | Fire åbne kasser side om side med hver sit fyldmateriale: luftpuder, papir, skum og chips. | Fire kasser med forskelligt fyldmateriale |
| 68 | `68-udstyr-og-skaerm-paa-samme-bord.jpg` | Hardware vs. system: hvad giver mest effekt først? | Pakkebord hvor værktøj og scanner ligger i venstre side og en skærm står i højre side. | Pakkebord med værktøj i den ene side og skærm i den anden |
| 69 | `69-nyt-udstyr-stadig-i-kasse.jpg` | Hvornår skal du investere i udstyr vs. software? | Uåbnet kasse med nyt lagerudstyr stående ubenyttet op ad en reol, stov på toppen. | Uåbnet kasse med nyt udstyr op ad en reol |
| 70 | `70-manuel-og-elektrisk-pallelofter.jpg` | Manuel vs elektrisk palleløfter: hvornår skal du opgradere? | Manuel palleløfter og elektrisk palleløfter stående ved siden af hinanden i en lagergang. | Manuel og elektrisk palleløfter side om side |
| 71 | `71-stor-kasse-lille-vare.jpg` | Overemballering og dens omkostning: hvad du betaler for luft | Stor papkasse åbnet med én lille vare i bunden og en masse luft omkring. | Stor kasse med én lille vare i bunden |
| 72 | `72-rodet-hjoerne-paa-lager.jpg` | De 10 mest oversete ting på et lager (der koster dig penge hver dag) | Overset hjørne af et lager: tom palle, lose kabler, en kost og et par kasser uden mærkning. | Rodet hjørne af et lager med tom palle og lose kabler |
| 73 | `73-koe-af-kasser-ved-pakkebord.jpg` | Pakkebordet er din flaskehals (du ved det bare ikke) | Pakkebord med en lang kø af halvfærdige ordrer opmarcheret på rullebanen ved siden af. | Kø af ordrer på rullebanen ved et pakkebord |
| 74 | `74-velindrettet-pakkestation.jpg` | Pakkestation setup: sådan indretter du et effektivt pakkebord | Ryddelig pakkestation set lige forfra: tape, kasser, fyld og printer inden for rækkevidde, intet overflødigt. | Ryddelig pakkestation med alt inden for rækkevidde |
| 75 | `75-plukkevogn-fuld-i-gang.jpg` | Plukkevognen bestemmer dit tempo: sådan vælger du rigtigt | Fuldt lastet plukkevogn parkeret midt i en smal reolgang, plukker på vej tilbage til den. | Fuldt lastet plukkevogn i en smal reolgang |
| 76 | `76-printer-i-armslaengde.jpg` | Printer-placering på pakkestation: de 8 sekunder der går tabt per pakke | Pakkebord set fra siden hvor printeren står i armslængde fra pakkerens højre hånd. | Printer placeret i armslængde ved pakkebordet |
| 77 | `77-rullebane-mellem-pluk-og-pak.jpg` | Rullebaner på lager: hvornår de er pengene værd og hvornår de ikke er | Kort rullebane med tre kasser på vej fra plukområdet mod pakkestationen. | Rullebane med kasser mellem pluk og pak |
| 78 | `78-enkelt-og-flerordrevogn.jpg` | Single-order vs multi-order plukkevogn: hvornår skifter du? | To plukkevogne ved siden af hinanden: én med en stor åben kurv, én med seks små opdelte rum. | Enkeltordrevogn og flerordrevogn side om side |
| 79 | `79-lang-lagergang-set-i-perspektiv.jpg` | Skridt per plukker som KPI: hvad det måler og hvad det ikke måler | Meget lang lagergang set fra gulvhøjde i perspektiv, en plukker langt væk som lille silhuet. | Lang lagergang med en plukker langt væk |
| 80 | `80-smaa-aendringer-paa-pakkebord.jpg` | Små forbedringer der sparer timer hver uge på lageret | Pakkebord hvor tape, saks og labels lige er flyttet tættere på, gamle pladser markeret med lyse felter. | Pakkebord hvor værktøjet er flyttet tættere på |
| 81 | `81-standardkasser-og-specialkasse.jpg` | Standard vs. specialkasser: hvornår kan det betale sig | Stak af ens brune standardkasser ved siden af én speciallavet kasse i afvigende format. | Stak standardkasser ved siden af en specialkasse |
| 82 | `82-tapepistol-lukker-kasse.jpg` | Tape-pistolers effekt på pakketiden: valg og vedligehold | Nærbillede af en tapepistol der trekker tape hen over en kasseflap i én bevægelse. | Tapepistol lukker en kasse |
| 83 | `83-tape-inden-for-raekkevidde.jpg` | Tape-placering på pakkebordet: sådan sparer du sekunder per pakke | Pakkebord set lige oppefra hvor tapepistolen ligger i højre hånds naturlige hvileposition. | Tapepistol placeret hvor hånden naturligt hviler |
| 84 | `84-tre-slags-tape-ruller.jpg` | Tape-valg til lager: PP, PVC, papirtape og hvad der faktisk virker | Tre taperuller side om side på et pakkebord: klar plast, brun plast og brun papirtape. | Tre forskellige taperuller på et pakkebord |
| 85 | `85-kassestoerrelser-i-raekke.jpg` | Valg af kasser til forsendelse: hvad koster det at vælge forkert | Fem papkasser i stigende størrelse stillet op på række på et pakkebord. | Fem papkasser i stigende størrelse |

### Fundamentals (12 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 88 | `88-optaelling-af-en-enkelt-hylde.jpg` | Hvad er cycle counting? Løbende lagerrevision forklaret | Medarbejder der tæller varer på én hylde med terminal i hånden, resten af reolen urørt. | Medarbejder tæller varer på én enkelt hylde |
| 89 | `89-pakke-sendt-uden-om-lageret.jpg` | Hvad er dropshipping? Fordele, ulemper og hvornår det giver mening | Tom lagerhylde i forgrunden og en leveringsbil set gennem en åben port i baggrunden. | Tom lagerhylde med en leveringsbil i baggrunden |
| 91 | `91-fra-ordre-til-faerdig-pakke.jpg` | Hvad er fulfillment? Fra ordre til pakke forklaret | Pakkebord set oppefra med pluksedel, åben kasse og færdig taped pakke i en række fra venstre mod højre. | Pluksedel, åben kasse og færdig pakke i række |
| 92 | `92-taelling-mod-systemtal.jpg` | Hvad er lagernøjagtighed (inventory accuracy)? Sådan måler og forbedrer du den | Hånd med terminal holdt op mod en reolplads hvor der tydeligvis står færre kasser end der er plads til. | Terminal holdes op mod en halvtom reolplads |
| 94 | `94-overblik-over-lagerhal.jpg` | Hvad er lagerstyring? Den komplette forklaring | Lagerhal set fra en højere position: reoler, pakkeområde og porte i samme billede. | Lagerhal set oppefra med reoler og pakkeområde |
| 95 | `95-ventende-palle-ved-porten.jpg` | Hvad er lead time? Leveringstid på lageret forklaret | Enkelt wrappet palle der står alene ved en lukket port, resten af hallen tom. | Enkelt palle der venter ved en lukket port |
| 96 | `96-plukker-og-pakker-i-samme-hal.jpg` | Hvad er pluk og pak? Sådan fungerer det på lageret | To medarbejdere i samme billede: én plukker i reolgangen, én pakker ved bordet i forgrunden. | Plukker i reolgangen og pakker ved bordet |
| 98 | `98-bufferlager-bag-plukpladsen.jpg` | Hvad er safety stock? Sikkerhedslager forklaret | Plukplads i forgrunden og en reserve af samme vare stablet på pallereolen ovenover. | Plukplads med reservelager på reolen ovenover |
| 100 | `100-varenummer-paa-hyldekant.jpg` | Hvad er en SKU? Forklaring og eksempler fra lageret | Nærbillede af et hyldekantsskilt med stregkode og varenummer på en reol. | Hyldekantsskilt med stregkode og varenummer |
| 101 | `101-lagerplan-paa-vaeg.jpg` | Warehouse layout: sådan indretter du et lager der virker | Udprintet plantegning af et lager hængt på en væg i hallen, reoler synlige bagved. | Plantegning af lageret hængt på en væg |
| 102 | `102-wms-skaerm-midt-i-hallen.jpg` | Hvad er et WMS? Den komplette introduktion | Skærm på en rullestander midt i lagerhallen med en enkel ordreoversigt. | Skærm på rullestander midt i lagerhallen |
| 104 | `104-hurtig-vare-placeret-forkert.jpg` | Slotting: hvad koster det ikke at placere varer rigtigt? | Palle med en tydeligt hyppigt brugt vare placeret yderst i den fjerneste ende af hallen. | Hyppigt brugt vare placeret yderst i hallen |

### Vækst (14 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 105 | `105-kampagnevarer-klargjort-paa-paller.jpg` | Håndtering af kampagner på lageret, fra panik til system | Række af forberedte paller med ens varer stående klar langs en væg før en kampagne. | Forberedte kampagnepaller langs en lagervæg |
| 106 | `106-manuelt-og-automatisk-side-om-side.jpg` | Hvornår giver automatisering mening på dit lager? | Lagerhal hvor et transportbånd løber i den ene side og manuel pakning foregår i den anden. | Transportbånd og manuel pakning i samme hal |
| 107 | `107-for-mange-toter-paa-vogn.jpg` | Hvornår holder batch picking op med at virke? | Overfyldt plukkevogn med toter stablet for højt og varer på vej til at vælte. | Overfyldt plukkevogn med for mange toter |
| 108 | `108-to-lagre-paa-danmarkskort.jpg` | Hvornår skal du have flere lagerlokationer? | To ens lagerhaller fotograferet udefra i samme billede, den ene tættere på, den anden langt væk. | To lagerhaller set udefra i samme billede |
| 109 | `109-reoler-flyttes-i-hallen.jpg` | Hvornår skal dit lagerlayout ændres? | Lagerhal midt i en omrokering: en reolsektion står tom og afmonteret, markeringer på gulvet. | Lagerhal under omrokering med en tom reolsektion |
| 110 | `110-kasser-i-gangen-pladsmangel.jpg` | Hvornår knækker dit lager-setup? | Lagergang delvist blokeret af kasser der er sat på gulvet fordi reolerne er fulde. | Lagergang blokeret af kasser på gulvet |
| 111 | `111-en-medarbejder-alene-i-hal.jpg` | Hvornår skal du ansætte på lageret? | Én medarbejder alene i en stor lagerhal med tydeligt mere arbejde end én person kan nå. | Én medarbejder alene i en stor lagerhal |
| 112 | `112-papirsedler-paa-lagerbord.jpg` | Hvornår skal du have et WMS? | Bunke håndskrevne plukseddel-lapper på et bord i lagerhallen, en kuglepen ovenpå. | Bunke håndskrevne pluksedler på et bord |
| 113 | `113-abc-zoner-set-fra-enden.jpg` | Hvornår skal dit lager opdeles i zoner? | Lagerhal set fra pakkeområdet ned gennem gangene, de nærmeste reoler tydeligt mest brugte. | Lagerhal set fra pakkeområdet ned gennem gangene |
| 114 | `114-hal-fyldt-til-loftet.jpg` | Hvornår vokser du fra dit lager? | Lagerhal hvor der er stablet varer helt op under loftet og ud i gangene. | Lagerhal fyldt med varer helt op under loftet |
| 115 | `115-fuld-udgangsrampe.jpg` | Kapacitetsgrænser på lageret, kend dem før du rammer dem | Udgangsrampe helt fyldt med færdige pakker der venter på afhentning, ingen plads tilbage. | Udgangsrampe helt fyldt med færdige pakker |
| 116 | `116-lagerhal-med-aaben-port-mod-lyset.jpg` | Lagerets rolle i din vækst, motor eller håndbrems? | Lagerhal indefra med en stor åben port mod dagslyset, paller på vej ud. | Lagerhal med åben port og paller på vej ud |
| 117 | `117-to-plukkere-forskelligt-tempo.jpg` | Ordrer pr. medarbejder, nøgletallet de fleste lagre aldrig måler | To plukkere i samme gang, den ene med fuld vogn, den anden med næsten tom. | To plukkere i samme gang med forskelligt fyldte vogne |
| 118 | `118-opmarkeret-hal-med-faste-pladser.jpg` | Skalering uden kaos, sådan vækster du dit lager planmæssigt | Ryddelig lagerhal med tydelige gulvmarkeringer, ens toter og faste pladser til alt. | Ryddelig lagerhal med tydelige gulvmarkeringer |

### Retur (12 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 119 | `119-beskadiget-vare-fra-retur.jpg` | Beskadigede returvarer: hvad du gør når varen ikke kan sælges igen | Åbnet returpakke på et bord med en tydeligt beskadiget vare og krollet emballage ved siden af. | Åbnet returpakke med en beskadiget vare |
| 120 | `120-returaarsager-paa-skaerm.jpg` | Forebyg returner med bedre data: hvad siger tallene | Skærm med en simpel søjlegraf ved siden af en stak returvarer på et bord. | Skærm med søjlegraf ved siden af returvarer |
| 121 | `121-returkontrol-med-tjekliste.jpg` | Kontrol af returvarer: hvad tjekker du og hvordan | Medarbejder der efterser en returneret vare under god belysning med en tjekliste ved siden af. | Medarbejder efterser en returneret vare |
| 122 | `122-genlukkelig-returpose.jpg` | Returemballage: sådan pakker du så returer går glat | Nærbillede af en pakke med dobbeltklæbende returlukning, fingeren på strimlen. | Pakke med dobbeltklæbende returlukning |
| 123 | `123-udenlandsk-returpakke-med-toldpapir.jpg` | Returner fra udlandet: regler, logistik og økonomi | Returpakke med toldmærkat og udenlandsk adresselabel på et modtagebord. Ingen læsbare navne. | Returpakke med toldmærkat på et modtagebord |
| 124 | `124-kunde-pakker-retur-derhjemme.jpg` | Retur og kundetilfredshed: sammenhængen de fleste overser | Personens hænder der lukker en returpakke ved et køkkenbord, ansigt ikke synligt. | Hænder der lukker en returpakke ved et bord |
| 125 | `125-returlabel-paa-telefon.jpg` | Returportalen: sådan beholder du flere af pengene i din egen forretning | Telefon med en fragtlabel-QR på skærmen holdt op over en klar returpakke. | Telefon med returlabel holdt over en pakke |
| 126 | `126-samme-vare-to-stoerrelser.jpg` | Retur vs. ombytning: hvornår er hvad bedst for din webshop | To ens varer i forskellig størrelse ved siden af hinanden på et returbord. | To ens varer i forskellig størrelse på et returbord |
| 127 | `127-returomraade-paa-lager.jpg` | Returhåndtering for webshops: Sådan styrer du returvarer | Fast returområde på lageret med mærkede bakker til godkendt, tjek og kasseret. | Returområde med mærkede bakker |
| 128 | `128-b-varer-klar-til-gensalg.jpg` | Returlogistik: fra tab til neutral, sådan minimerer du returomkostningerne | Hylde med ryddeligt opstillede B-varer klar til gensalg, hver med et lille mærkat. | Hylde med B-varer klar til gensalg |
| 130 | `130-returbakker-fra-flere-varegrupper.jpg` | Returrate benchmarks: hvad er normalt i din branche? | Tre returbakker med tydeligt forskellige varetyper: tøj, elektronik og små hverdagsvarer. | Tre returbakker med forskellige varetyper |
| 131 | `131-retur-scannes-ind.jpg` | WMS og returhåndtering: sådan automatiserer du din returproces | Medarbejder der scanner en returneret vare ind ved et modtagebord, skærm ved siden af. | Medarbejder scanner en returneret vare ind |

### Beslutning (11 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 132 | `132-eget-lager-eller-lagerhotel.jpg` | 3PL eller eget lager? Sådan regner du på det | To lagerhaller set udefra i samme billede: en lille egen hal og en stor fælleshal. | Lille egen lagerhal og stor fælleshal set udefra |
| 133 | `133-systemvalg-med-notesblok.jpg` | Bedste WMS til webshop: hvad du skal kigge efter | Notesblok med håndskrevne krav-punkter på et bord ved siden af en bærbar, lager bagved. | Notesblok med krav-punkter ved siden af en bærbar |
| 134 | `134-serverskab-og-skyloesning.jpg` | Cloud eller on-premise WMS? Sådan vælger du | Gammelt serverskab i et hjørne af lageret ved siden af en moderne bærbar på en palle. | Gammelt serverskab ved siden af en bærbar |
| 135 | `135-stopur-og-plukkevogn.jpg` | Hvad er god nok plukkehastighed? Benchmarks og hvornår du skal gøre noget | Nærbillede af en telefon med stopur i hånden foran en plukkevogn i en gang. | Stopur på en telefon foran en plukkevogn |
| 136 | `136-fyldt-lager-bundet-kapital.jpg` | Hvornår er lager en omkostning og hvornår er det en investering? | Højlager helt fyldt med ens paller set i perspektiv, ingen mennesker. | Højlager helt fyldt med ens paller |
| 137 | `137-regnskabssystem-paa-lagerkontor.jpg` | Hvornår er dit ERP's lagermodul ikke nok? | Ældre kontorskærm med et regnskabssystem stående i et lille rum lige ved lagerhallen. | Regnskabssystem på en skærm i et lagerkontor |
| 138 | `138-regneark-med-fejl-paa-skaerm.jpg` | Hvornår fejler Excel som lagerstyring? | Skærm med et stort uoverskueligt regneark, en hånd peger på en celle. | Stort uoverskueligt regneark på en skærm |
| 139 | `139-gammelt-udstyr-erstattes.jpg` | Hvornår skal du skifte system? 7 klare tegn | Gammel slidt lagerterminal liggende ved siden af en ny og ubrugt, begge på samme bord. | Gammel og ny lagerterminal på samme bord |
| 140 | `140-udvikling-paa-whiteboard.jpg` | Skal du bygge dit eget WMS? Her er sandheden | Whiteboard med en simpel kasse-og-pil-skitse i et møderum, ingen læsbar tekst. | Whiteboard med en kasse-og-pil-skitse |
| 141 | `141-tjekliste-paa-clipboard.jpg` | Tjekliste: er I klar til et WMS? | Clipboard med en afkrydsningsliste holdt op foran en lagerhal, flere felter endnu tomme. | Afkrydsningsliste på clipboard foran en lagerhal |
| 142 | `142-pristilbud-paa-moedebord.jpg` | Hvad koster et WMS? Priser og hvad du betaler for | Udprintet tilbud med tal og en lommeregner på et mødebord, lager gennem glasvæggen. | Udprintet tilbud og lommeregner på et mødebord |

### Økonomi (8 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 143 | `143-varer-der-staar-stille.jpg` | Hvad er beholdningsomkostninger? Det koster at have varer på lager | Reol med varer der tydeligt har stået længe, tyndt lag stov, ingen aktivitet omkring. | Reol med varer der har stået længe |
| 145 | `145-halvtom-lagerhal.jpg` | Lagerhusleje optimering: hvad betaler du for meget for og hvad du gør ved det | Stor lagerhal hvor halvdelen af gulvarealet står helt tomt, reoler kun i den ene ende. | Lagerhal hvor halvdelen af gulvet står tomt |
| 146 | `146-en-vare-paa-sin-plads.jpg` | Lageromkostninger pr. SKU: hvad koster det reelt at have en vare på lager? | Nærbillede af én enkelt vare på sin reolplads med luft omkring, hyldekantsskilt nedenunder. | Én enkelt vare på sin reolplads |
| 147 | `147-varer-ud-og-ind-samme-dag.jpg` | Lageromsætningshastighed: hvad det er og hvad det koster dig ikke at kende den | Modtageområde og afsendelsesområde i samme billede, begge med aktivitet. | Modtage- og afsendelsesområde i samme billede |
| 148 | `148-to-forskellige-taellinger.jpg` | Måltal på lageret: hvorfor ét tal ikke rækker | To whiteboards ved siden af hinanden i lagerhallen med hver sin simple optælling. | To whiteboards med hver sin optælling |
| 149 | `149-maskine-koert-i-stilling.jpg` | Økonomi i lagerautomatisering: hvornår er det en god investering og hvornår er det ikke? | Nyinstalleret transportbåndsektion der endnu ikke er sat i drift, afdækning delvist fjernet. | Nyinstalleret transportbånd der endnu ikke er i drift |
| 150 | `150-lagermedarbejder-paa-arbejde.jpg` | Personaleomkostninger på lageret: hvad koster en lagermedarbejder reelt? | Lagermedarbejder i arbejdstøj midt i en almindelig arbejdsdag i reolgangen, set bagfra. | Lagermedarbejder i arbejdstøj i reolgangen |
| 151 | `151-forkert-vare-i-kassen.jpg` | Hvad koster plukkefejl reelt? Regnestykket de fleste glemmer | Åbnet pakke på et bord hvor varen tydeligvis ikke matcher pluksedlen ved siden af. | Åbnet pakke med forkert vare ved siden af pluksedlen |

### Problemer (8 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 152 | `152-en-person-kender-alt.jpg` | Afhængighed af nøglemedarbejdere: hvad sker der når den vigtige person siger op? | Én medarbejder stående midt i lagerhallen mens alle andre arbejdspladser står tomme. | Én medarbejder alene midt i lagerhallen |
| 153 | `153-ny-medarbejder-staar-og-kigger.jpg` | Dårlig onboarding af lagermedarbejdere: hvorfor det koster dig mere end du tror | Ny medarbejder der står rådvild i en reolgang med en seddel i hånden, ingen andre i nærheden. | Ny medarbejder står rådvild i en reolgang |
| 154 | `154-regneark-vokset-ud-over-skaermen.jpg` | Når Excel ikke er nok: tegn på at du har vokset fra dit lagersystem | Skærm med et regneark der fortsætter langt ud over kanten, papirudprint stablet ved siden af. | Regneark på skærm med stakke af papirudprint |
| 155 | `155-tre-forskellige-arbejdsmaader.jpg` | Ingen standarder på lageret, når hver dag er forskellig | Tre pakkestationer ved siden af hinanden indrettet helt forskelligt, samme opgave på alle tre. | Tre pakkestationer indrettet helt forskelligt |
| 156 | `156-lange-omveje-i-hallen.jpg` | Lageret er indrettet forkert: tegn, konsekvenser og løsninger | Lagerhal hvor gangene ikke hænger sammen og en plukker må gå udenom en blokeret række. | Plukker går udenom en blokeret række |
| 157 | `157-ordrer-hober-sig-op.jpg` | Lageret kan ikke følge med væksten: tegnene og hvad du gør | Bord med færdigplukkede ordrer der hober sig op og fylder mere end der er plads til. | Færdigplukkede ordrer der hober sig op |
| 158 | `158-returvarer-uden-system.jpg` | Når returprocessen er kaos: hvad det koster og hvordan du stopper det | Hjørne af lageret med returpakker liggende usorteret på gulv og bord mellem hinanden. | Usorterede returpakker på gulv og bord |
| 159 | `159-plukker-gaar-frem-og-tilbage.jpg` | Vi bruger for meget tid på pluk: årsager, konsekvenser og hvad du gør | Lang reolgang hvor samme plukker ses gå i én retning, motion blur der antyder mange ture. | Plukker på vej gennem en lang reolgang |

### Personale (7 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 160 | `160-jobsamtale-ved-lageret.jpg` | Ansættelse af lagerchef: hvad du skal kigge efter og hvad der går galt | To personer i samtale ved et bord i et lille møderum med lagerhallen synlig gennem vinduet. | Samtale ved et bord med lagerhallen i baggrunden |
| 161 | `161-sikkerhedsudstyr-paa-lager.jpg` | HSE og sikkerhed på lageret: hvad loven kræver og hvad der faktisk virker | Sikkerhedsvest, høreværn og sikkerhedssko hængende på en knagerække ved indgangen til hallen. | Sikkerhedsudstyr hængende ved indgangen til hallen |
| 162 | `162-oplaering-ved-reolen.jpg` | Uddannelse af lagermedarbejdere: hvad virker | Erfaren medarbejder der viser en ny hvordan en vare tages fra hylden, begge med terminal. | Erfaren medarbejder lærer en ny op ved reolen |
| 163 | `163-team-paa-lageret-i-arbejde.jpg` | Motivation af lagermedarbejdere: hvad virker og hvad er spild af tid | Tre lagermedarbejdere i almindeligt arbejde i samme område, afslappet stemning, dagslys. | Tre lagermedarbejdere i arbejde i samme område |
| 164 | `164-foerste-pluk-med-terminal.jpg` | Onboarding af lagermedarbejdere: 15 minutter til selvstændighed | Ny medarbejder der gennemfører sit første pluk med terminal, en kollega står ved siden af. | Ny medarbejder gennemfører sit første pluk |
| 165 | `165-ekstra-folk-i-hoejsaeson.jpg` | Sæsonansatte på lageret: sådan får du dem produktive hurtigt | Flere medarbejdere end normalt i gang ved pakkestationerne, travlhed men orden. | Flere medarbejdere end normalt ved pakkestationerne |
| 166 | `166-ung-medarbejder-ved-pakkebord.jpg` | Ungarbejdere på lageret: regler, begrænsninger og hvad du skal vide | Ung medarbejder i arbejdstøj i gang med lette pakkeopgaver ved et bord, ingen maskiner i nærheden. | Ung medarbejder ved lette pakkeopgaver |

### Realworld (6 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 167 | `167-velkoert-lager-i-drift.jpg` | Hvad gør de bedste anderledes? 10 observationer fra top-performende webshops | Velorganiseret lagerhal i fuld drift: markeringer, ens toter, ingen ting på gulvet. | Velorganiseret lagerhal i fuld drift |
| 168 | `168-orden-og-rod-side-om-side.jpg` | Hvordan undgår du at skalere kaos? 5 principper der adskiller orden fra eksplosion | Lagerhal hvor den ene halvdel er ryddelig og opmarkeret og den anden halvdel rodet. | Lagerhal med ryddelig og rodet halvdel |
| 169 | `169-black-friday-travlhed.jpg` | Kampagner vs. drift: Hvordan overlever du Black Friday på lageret? | Pakkeområde i hård peak-drift med mange pakker, paller og folk i bevægelse. | Pakkeområde i hård peak-drift |
| 170 | `170-lager-og-kontor-samme-virksomhed.jpg` | Lager vs. marketing: Hvad gælder det mest at investere i? | Kontorplads med skærmgraf i forgrunden og lagerhallen synlig gennem en glasvæg bagved. | Kontorplads med lagerhallen bag glasvæggen |
| 171 | `171-systemer-bag-kulissen.jpg` | Sådan arbejder top-webshops: De 8 ting de IKKE fortæller dig | Teknikrum på et lager med netværksudstyr og en skærm, hallen anet gennem døråbningen. | Teknikrum på et lager med netværksudstyr |
| 172 | `172-lagerhotel-med-flere-kunder.jpg` | SmartPack til 3PL-lagre: den fulde guide | Stor fælleshal hvor forskellige områder tydeligt hører til forskellige kunder, neutrale mærkninger. | Fælleshal med adskilte kundeområder |

### Bæredygtighed (4 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 174 | `174-papirfyld-i-kasse.jpg` | Bæredygtigt fyldmateriale: hvad virker og hvad er greenwashing? | Nærbillede af sammenkrollet brunt papirfyld i en åben kasse omkring en vare. | Brunt papirfyld i en åben kasse |
| 175 | `175-fragtdata-paa-skaerm.jpg` | CO2-rapportering på fragt: hvad du skal måle og hvad det kræver | Skærm med en simpel kurve ved siden af en stak færdige pakker på afsendelsesbordet. | Skærm med kurve ved siden af færdige pakker |
| 176 | `176-kasse-fyldt-helt-op.jpg` | Fill rate optimering: fyld kasserne bedre og spar fragt og emballage | Åben kasse fyldt præcis til kanten uden luft, låget klar til at lukke. | Kasse fyldt præcis til kanten uden luft |
| 177 | `177-varebil-ved-rampen.jpg` | Grøn fragt og greenwashing: hvad er reelt og hvad er markedsføring | Neutral varebil holdende ved en læsserampe i dagslys, ingen læsbare firmanavne. | Neutral varebil ved en læsserampe |

### Drift (2 billeder)

| Nr | Filnavn | Artikel | Prompt | Alt-tekst |
|---|---|---|---|---|
| 178 | `178-dokumentation-af-pakke-foer-afsendelse.jpg` | Når kunden snyder med en reklamation | Pakkebord hvor en åben pakke bliver fotograferet ovenfra med en telefon inden lukning. | Åben pakke fotograferes inden den lukkes |
| 179 | `179-scanning-registrerer-hver-bevaegelse.jpg` | Sporbarhed på lageret: hvem rørte varen? | Nærbillede af en scanner der læser en lokationsstregkode på en reolstolpe. | Scanner læser en lokationsstregkode på en reolstolpe |

## De 14 der allerede er lavet

De her artikler forklarer et forløb eller en formel. De er lavet som animerede tegninger i stedet for
fotos, og de ligger på sitet nu. De skal ikke med i Manus:

- Dataflow i e-handel, fra ordre til forsendelse trin for trin
- Integrationer forklaret: sådan taler dine systemer sammen
- Webhooks forklaret: realtidsnotifikationer til dit lagersystem
- WMS vs. ERP: hvad er forskellen, og hvornår skal du have begge?
- ABC-analyse af sortiment: find dine vigtigste varer
- Hvad er cross-docking? Når varer ikke skal på lager
- Hvad er FIFO? Forklaring og eksempler fra lageret
- Hvad er lagerflow? Sådan bevæger varer sig på lageret
- Hvad er reorder point? Beregning og eksempler
- Hvad er sikkerhedslager? Formel, beregning og hvornår det er for meget
- Hvad er zone picking? Sådan opdeler du lageret for færre fejl
- Hvad koster en retur? De rigtige tal
- De fem nøgletal du kan begynde at følge i næste uge
- Den typiske lager-evolution for en voksende webshop

## Hvad der sker bagefter

Når filerne ligger i `assets/viden/artikel_billeder/` sætter jeg dem selv ind i de 145 artikler
med den rigtige alt-tekst og samme opsætning som de 87 der allerede har et billede. Det er ét
samlet job, ikke 159, så du skal ikke røre HTML.