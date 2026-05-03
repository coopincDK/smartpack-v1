---
primary_keyword: FIFO lagerstyring
secondary_keywords: first in first out, FIFO metode, lagerrotation, varehåndtering
cluster: 01-Fundamentals
---

# Hvad er FIFO?

Du modtager 50 stk. i januar.
Du modtager 50 stk. i marts.
Du plukker fra marts-batchen.

Januarvaren ligger.
Den forældes.
Du kasserer 50 stk.

FIFO er ikke teori.
Det er **100.000 kr./år i undgået svind** — ved 5% rotation-fejl.

## Hvad er FIFO?

FIFO (First In, First Out) er en lagerrotationsmetode, der sikrer, at varer modtaget tidligst også plukkes og afsendes tidligst. Det modsatte — LIFO (Last In, First Out) — er uacceptabelt for de fleste fysiske produkter, da nyeste varer ellers konstant plukkes, mens ældste varer forbliver på lageret og forældes.

FIFO er den lovpligtige standard for fødevarer, medicin og andre tidsfølsomme produkter, men er best practice for alle varetyper.

**Vigtig distinktion:**
- **FIFO** = ældste varer (tidligst modtaget) plukkes først — baseret på modtagelsesdato
- **FEFO** = varer med nærmest udløbsdato plukkes først — baseret på holdbarhedsdato

Brug FIFO, når produkterne ikke har udløbsdato, men stadig kan forældes (mode, elektronik, emballage). Brug FEFO, når udløbsdato er afgørende.

## Hvornår er det et problem?

- Plukkere tager den lettest tilgængelige vare — ikke den ældste
- Modtagelsesdatoer registreres ikke i systemet
- Lageropbygning giver adgang til nyeste varer forrest
- Regelmæssige beholdningsrevisioner afslører gamle varer af gammel dato

## Hvorfor er FIFO vigtigt? (tal og kr.)

Manglende FIFO-kontrol medfører direkte økonomiske tab:

- **Svind:** Varer med begrænset holdbarhed overskrider salgsdato og må kasseres
- **Nedskrivninger:** Modeprodukter og elektronik mister værdi hurtigt — gammel lagerbinding koster marginer
- **Reklamationer:** Kunder modtager gamle varer tæt på udløb → returneringer og tabt tillid

Et typisk detailvarelager med 5 % uidentificeret svind på 2 mio. kr. i varelagerbinding taber **100.000 kr./år** på manglende rotation — konservativt estimat.

## Hvordan fungerer FIFO i praksis?

1. **Modtagelsesregistrering** — alle indgående varer registreres med modtagelsesdato i WMS
2. **Lokationsbaseret FIFO** — samme SKU på to lokationer → ældste lokation aktiveres først
3. **Indlægning bagfra** — nye varer lægges bag eksisterende beholdning (flowreoler)
4. **Plukliste-sekvens** — WMS genererer pluklister, der altid peger på ældste lokation/batch
5. **Periodisk kontrol** — cycle counting verificerer at FIFO-rækkefølgen er opretholdt

**Flowreoler** (gravity flow racking) er den mest effektive fysiske implementering: varer skubbes ind bagfra og trækkes ud forfra automatisk.

## Typiske fejl

1. **Ingen registrering af modtagelsesdato** — systemet kan ikke gennemtvinge FIFO uden datostempling
2. **Plukker vælger frit** — uden WMS-styring tager plukkere den vare, der er lettest at nå
3. **Blanding af batches** — nye varer læsses ovenpå gamle i stedet for bagved/nedenunder
4. **Manglende FIFO-kontrol ved genoptankning** — genopfyldning af pluklokationer respekterer ikke rækkefølge
5. **FIFO og FEFO forveksles** — virksomheder med udløbsdato-produkter bruger modtagelsesdato i stedet for udløbsdato

## Sådan gør du det rigtigt

1. **Registrer modtagelsesdato ved alle indgående varer** — dette er minimumskravet for FIFO
2. **Brug flowreoler til høje omløbsvarer** — automatiserer FIFO fysisk uden afhængighed af plukkerdisciplin
3. **WMS skal tvinge FIFO** — system-genererede pluklister må ikke give plukkeren valg om lokation
4. **Adskil FIFO- og FEFO-produkter** tydeligt i systemet og fysisk på lageret
5. **Verificer ved cycle counting** — inkludér FIFO-kontrol (aldersfordeling) i din tællerutine

## Brug denne artikel

**Tjekliste — FIFO under kontrol?**
- [ ] Alle indgående varer registreres med modtagelsesdato
- [ ] WMS peger altid pluklister på ældste batch/lokation
- [ ] Lagerlayout understøtter FIFO fysisk (ikke blot systemmæssigt)
- [ ] Svind-rate måles og spores månedligt

**Formel — svindpåvirkning:**
`FIFO-svind (kr./år) = varelagerbinding (kr.) × svind% × forbedringsandel`

**Næste skridt:**
1. Gennemgå om dit WMS registrerer og tvinger modtagelsesdato
2. Kortlæg lokationer med blandede batches
3. Implementér flowreoler på top-10 hurtigtroterende SKU'er

## SmartPack understøttelse

SmartPack tvinger FIFO automatisk på alle pluklokationer. Systemet registrerer modtagelsesdato ved varemodtagelse og sekvenserer pluklister, så den ældste batch/lokation altid aktiveres først. Har du produkter med udløbsdato, kan du skifte til FEFO-mode pr. produktkategori under Indstillinger → Lagerstyring → Rotationsmetode.

## FAQ

**Hvad er forskellen på FIFO og FEFO?**
FIFO plukker ældste varer baseret på modtagelsesdato. FEFO plukker varer med nærmest udløbsdato. FEFO er relevant for produkter, der kan modtages i varieret rækkefølge men have forskellig restlevetid.

**Er FIFO lovpligtigt?**
For fødevarer og medicin er FIFO/FEFO lovpligtigt i Danmark og EU. For andre varetyper er det best practice.

**Hvad er flowreoler?**
Gravity flow racking er reoler med skrånende rullebaner: varer indlæses bagfra og triller automatisk frem. Det sikrer FIFO fysisk uden krav til plukker-disciplin.

**Kan man bruge FIFO uden WMS?**
Ja, men det kræver strik fysisk disciplin: altid indlæg bagved, aldrig tag fra bagenden. I praksis fungerer det sjældent konsekvent uden systemunderstøttelse.

**Hvornår giver LIFO mening?**
LIFO (Last In, First Out) giver sjældent mening for fysiske varer. I regnskabsmæssig sammenhæng bruges LIFO til lagerværdiberegning, men det er ikke tilladt efter IFRS.

