'use strict';

// Fælles regler for partnere: felter, validering, "er profilen færdig",
// offentlig visning og power-up-kataloget. Bruges af src/routes/partners.js.

// Power-up-typer, som findes i spillet (se spil/index.html, PARTNERS og
// Element Logic i Pluk). En partner kan kun knyttes til en type herfra; en
// helt ny effekt kræver ny kode i spillet.
const POWERUPS = {
  herodesk: { runde: 'Send', effekt: 'AI-agent, der løser ordrer af sig selv i 10 sek.' },
  reverse: { runde: 'Send', effekt: 'Returpakker bliver til ombytninger og giver dobbelt point i 8 sek.' },
  promo: { runde: 'Send', effekt: 'Kampagne: flere ordrer, og hver ordre er dobbelt så meget værd i 8 sek.' },
  // Nøglen hedder stadig 'sprii', men power-uppen er fra okt. 2026 InMobiles sms-kampagne.
  sprii: { runde: 'Send', effekt: 'Sms-kampagne: svarene bliver til ordrer i 8 sek.' },
  elementlogic: { runde: 'Pluk', effekt: 'Lagerrobot, der hjælper med plukket.' },
  // Ekstra power-ups (okt. 2026), se XPU i spil/index.html
  skancode: { runde: 'Pluk', effekt: 'Scanner: fejlpluk koster ingenting i 8 sek.' },
  smartpack: { runde: 'Pluk', effekt: 'Optimeret plukrute: +50 % point i 8 sek.' },
  unitroll: { runde: 'Pak', effekt: 'Rullevogn: dobbelt point i 8 sek.' },
  rielands: { runde: 'Pak', effekt: 'Frigjort tid: +10 sek. på uret.' },
  sitesage: { runde: 'Send', effekt: 'Kunderne venter: uret står stille i 5 sek.' },
  poetype: { runde: 'Send', effekt: 'Nyhedsbrev: genkøb giver +50 % point i 8 sek.' },
  zignifikant: { runde: 'Send', effekt: 'Bundlinje-bonus: +10 % af rundens point.' },
  boardroom: { runde: 'Send', effekt: 'Rådgiveren: din næste fejl bliver tilgivet.' },
};

const STATUSSER = ['ansoegt', 'aktiv', 'afvist', 'arkiveret'];

// Tekstfelter og deres maks-længde. Fælles for admin og partner.
const TEKSTFELTER = {
  firmanavn: 200,
  cvr: 20,
  adresse: 300,
  hjemmeside: 300,
  kort_beskrivelse: 400,
  beskrivelse: 4000,
  kontakt_navn: 200,
  kontakt_email: 200,
  kontakt_telefon: 50,
  praemie_titel: 200,
  praemie_beskrivelse: 4000,
  praemie_udbytte: 2000,
  praemie_betingelser: 2000,
  praemie_indloesning: 2000,
  produktkategori: 60,
  privatlivspolitik: 300,
  afmeld_email: 200,
  levering_navn: 200,
  levering_email: 200,
  praemie_ikke_med: 2000,
  fordel_ydelse: 300,
  fordel_rabat: 300,
  fordel_koebskrav: 1000,
};

// Datofelter (YYYY-MM-DD eller tom).
const DATOFELTER = ['praemie_sidste_frist', 'fordel_gyldig_til'];

// Version af partnervilkårene (/spil/partnervilkaar/), som partneren
// accepterer i portalen. Hæves, når vilkårene ændres.
const PARTNERVILKAAR_VERSION = '1 (2026-10-02)';

// De syv erklæringer i partnerportalen (packrush-tekster.md, afsnit 4E).
// Nøglerne gemmes i partner_accept.erklaeringer.
const ERKLAERINGER = [
  { key: 'oplysninger', tekst: 'Oplysningerne om os er korrekte.' },
  { key: 'gave', tekst: 'Gaven er beskrevet præcist, og værdien er retvisende.' },
  { key: 'levering', tekst: 'Vi kan levere gaven som beskrevet og inden for fristen.' },
  { key: 'leads', tekst: 'Vi bruger kun leads fra vores eget login og kun til det, spilleren har sagt ja til.' },
  { key: 'deling', tekst: 'Vi deler hverken spil eller præmie før 8. oktober, og præmien omtales kun på messen.' },
  { key: 'fejl', tekst: 'Kommer noget ud ved en fejl, giver vi straks SmartPack besked.' },
  { key: 'vilkaar', tekst: 'Vi accepterer partnervilkårene.' },
];

// Felter, partneren selv må rette. Navn (visningsnavnet i spillet), status,
// "vist i spil" og power-up styrer kun admin.
const PARTNER_REDIGERBARE = [
  ...Object.keys(TEKSTFELTER),
  ...DATOFELTER,
  'praemie_flyt',
  'giver_praemie',
  'praemie_vaerdi',
  'praemie_vaerdi_type',
  'praemie_moms',
  'privatliv_standard',
];

// Packrush' standardprivatlivspolitik for partnere uden egen. Siden bygges
// af partnerens oplysninger (se spil/partnerprivatliv/ og GET
// /partnere/:slug/privatliv). Kræver en mail til afmelding/persondata.
const STANDARD_PRIVATLIV_URL = 'https://smartpack.dk/spil/partnerprivatliv/';
function standardPrivatlivUrl(slug) {
  return STANDARD_PRIVATLIV_URL + '?p=' + encodeURIComponent(slug);
}
function privatlivMail(p) {
  return p.afmeld_email || p.kontakt_email || '';
}

const ADMIN_REDIGERBARE = [...PARTNER_REDIGERBARE, 'navn', 'status', 'vist_i_spil', 'powerup', 'ansoegning_besked'];

class Valideringsfejl extends Error {
  constructor(besked, felt) {
    super(besked);
    this.felt = felt;
  }
}

function renTekst(v, max) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/\u0000/g, '').trim().slice(0, max);
}

// Kun http(s)-adresser. Mangler protokollen, sættes https:// foran.
function renHjemmeside(v, felt) {
  felt = felt || 'hjemmeside';
  const navn = felt === 'hjemmeside' ? 'Hjemmesiden' : 'Linket';
  let s = renTekst(v, TEKSTFELTER[felt] || 300);
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try {
    u = new URL(s);
  } catch (e) {
    throw new Valideringsfejl(`${navn} er ikke en gyldig adresse.`, felt);
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Valideringsfejl(`${navn} skal starte med http:// eller https://.`, felt);
  }
  return u.toString();
}

function renEmail(v, felt) {
  const s = renTekst(v, 200).toLowerCase();
  if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
    throw new Valideringsfejl('E-mailadressen er ikke gyldig.', felt || 'email');
  }
  return s;
}

// Lav et objekt med kun de tilladte, rensede felter fra `input`.
function renFelter(input, tilladte) {
  input = input || {};
  const ud = {};
  for (const k of tilladte) {
    if (!(k in input)) continue;
    const v = input[k];
    if (k === 'hjemmeside') ud[k] = renHjemmeside(v);
    else if (k === 'privatlivspolitik') ud[k] = renHjemmeside(v, 'privatlivspolitik');
    else if (k === 'kontakt_email' || k === 'afmeld_email' || k === 'levering_email') ud[k] = renEmail(v, k);
    else if (k === 'cvr') {
      const c = renTekst(v, TEKSTFELTER.cvr).replace(/[\s-]/g, '').replace(/^DK/i, '');
      if (c && !/^[0-9]{8}$/.test(c)) throw new Valideringsfejl('CVR-nummeret skal være 8 cifre.', 'cvr');
      ud[k] = c;
    } else if (DATOFELTER.includes(k)) {
      const d = renTekst(v, 10);
      if (d && (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d)))) {
        throw new Valideringsfejl('Datoen skal skrives som ÅÅÅÅ-MM-DD.', k);
      }
      ud[k] = d || null;
    } else if (k === 'praemie_flyt') ud[k] = ['ja', 'nej'].includes(v) ? v : 'spoerg';
    else if (k in TEKSTFELTER) ud[k] = renTekst(v, TEKSTFELTER[k]);
    else if (k === 'navn') {
      ud[k] = renTekst(v, 80);
      if (!ud[k]) throw new Valideringsfejl('Partneren skal have et navn.', 'navn');
    } else if (k === 'giver_praemie' || k === 'vist_i_spil' || k === 'privatliv_standard') ud[k] = v === true || v === 'true';
    else if (k === 'praemie_vaerdi') {
      if (v === '' || v === null || v === undefined) ud[k] = null;
      else {
        const n = Math.round(Number(String(v).replace(/[.\s]/g, '').replace(',', '.')));
        if (!Number.isFinite(n) || n < 0 || n > 100000000) {
          throw new Valideringsfejl('Værdien skal være et helt beløb i kroner.', 'praemie_vaerdi');
        }
        ud[k] = n;
      }
    } else if (k === 'praemie_vaerdi_type') ud[k] = v === 'op_til' ? 'op_til' : 'fast';
    else if (k === 'praemie_moms') ud[k] = v === 'inkl' ? 'inkl' : 'ekskl';
    else if (k === 'status') {
      if (!STATUSSER.includes(v)) throw new Valideringsfejl('Ukendt status.', 'status');
      ud[k] = v;
    } else if (k === 'powerup') {
      if (v === '' || v === null || v === undefined) ud[k] = null;
      else if (!POWERUPS[v]) throw new Valideringsfejl('Ukendt power-up.', 'powerup');
      else ud[k] = v;
    } else if (k === 'ansoegning_besked') ud[k] = renTekst(v, 4000);
  }
  return ud;
}

// Hvad mangler, før partneren kan vises i spillet, og før præmien kan vises
// på præmieoversigten. Tom liste = færdig.
function erUdenlandsk(adresse) {
  const a = String(adresse || '').trim();
  if (!a) return false;
  if (/danmark|denmark|\b\d{4}\b/i.test(a)) return false; // dansk postnummer eller land
  return /,\s*[A-ZÆØÅ][A-Za-zÆØÅæøå .'-]{2,}$/.test(a); // slutter med et land, fx ", Malta"
}

function manglerProfil(p) {
  const m = [];
  if (!p.navn) m.push('navn');
  if (!p.firmanavn) m.push('firmanavn');
  if (!p.hjemmeside) m.push('hjemmeside');
  if (!p.kort_beskrivelse) m.push('kort_beskrivelse');
  // Partnervilkår: samtykket skal kunne navngive firma, CVR og produkt, og
  // spilleren skal kunne læse partnerens privatlivspolitik.
  // Udenlandske firmaer har intet dansk CVR. De må undværes, når adressen tydeligt
  // ligger uden for Danmark (fx 'Gzira, Malta'); samtykket navngiver så firma og land.
  if (!p.cvr && !erUdenlandsk(p.adresse)) m.push('cvr');
  if (!p.produktkategori) m.push('produktkategori');
  if (!p.privatlivspolitik) m.push('privatlivspolitik');
  return m;
}

function manglerPraemie(p) {
  if (!p.giver_praemie) return [];
  const m = [];
  if (!p.praemie_titel) m.push('praemie_titel');
  if (p.praemie_vaerdi === null || p.praemie_vaerdi === undefined) m.push('praemie_vaerdi');
  if (!p.praemie_beskrivelse) m.push('praemie_beskrivelse');
  if (p.praemie_vaerdi_type === 'op_til' && !p.praemie_betingelser) m.push('praemie_betingelser');
  if (!p.praemie_indloesning) m.push('praemie_indloesning');
  if (!p.praemie_sidste_frist) m.push('praemie_sidste_frist');
  return m;
}

// Vises partneren offentligt (partnerside, power-up i spillet)?
function erSynlig(p) {
  return p.status === 'aktiv' && p.vist_i_spil === true && manglerProfil(p).length === 0;
}

function logoUrl(p) {
  return p.har_logo || p.logo ? `/partnere/${encodeURIComponent(p.slug)}/logo?v=${new Date(p.opdateret).getTime()}` : null;
}

function offentligPraemie(p) {
  if (!p.giver_praemie || manglerPraemie(p).length) return null;
  return {
    titel: p.praemie_titel,
    vaerdi: p.praemie_vaerdi,
    vaerdi_type: p.praemie_vaerdi_type,
    moms: p.praemie_moms,
    beskrivelse: p.praemie_beskrivelse,
    udbytte: p.praemie_udbytte,
    betingelser: p.praemie_betingelser,
    indloesning: p.praemie_indloesning,
    ikke_med: p.praemie_ikke_med,
    sidste_frist: p.praemie_sidste_frist ? isoDato(p.praemie_sidste_frist) : null,
  };
}

function isoDato(d) {
  if (d instanceof Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  return String(d).slice(0, 10);
}

// Partnerfordel ved køb (D1-D4) vises for sig og tæller ikke i præmiepuljen.
function offentligFordel(p) {
  if (!p.fordel_ydelse || !p.fordel_rabat) return null;
  return {
    ydelse: p.fordel_ydelse,
    rabat: p.fordel_rabat,
    koebskrav: p.fordel_koebskrav,
    gyldig_til: p.fordel_gyldig_til ? isoDato(p.fordel_gyldig_til) : null,
  };
}

// Den faste samtykketekst for én partner (packrush-tekster.md, afsnit 2).
// Bygges altid af partnerens egne felter; partneren kan ikke skrive den frit.
const SAMTYKKE_VERSION = 2;
function samtykkeTekst(p) {
  const firma = p.firmanavn || p.navn;
  const cvr = p.cvr ? `, CVR ${p.cvr}` : '';
  const kat = p.produktkategori || 'sine produkter';
  return (
    `Ja tak, ${firma}${cvr} må sende mig mails om ${kat}. ` +
    `${p.navn} får mit navn, min arbejdsmail og min virksomhed. ` +
    'Jeg kan altid afmelde mig igen. Det påvirker ikke mine chancer for at vinde.'
  );
}

function offentligPartner(p) {
  return {
    slug: p.slug,
    navn: p.navn,
    firmanavn: p.firmanavn,
    hjemmeside: p.hjemmeside,
    kort_beskrivelse: p.kort_beskrivelse,
    beskrivelse: p.beskrivelse,
    powerup: p.powerup,
    powerup_effekt: p.powerup && POWERUPS[p.powerup] ? POWERUPS[p.powerup].effekt : null,
    logo_url: logoUrl(p),
    praemie: offentligPraemie(p),
    fordel: offentligFordel(p),
    privatlivspolitik: p.privatlivspolitik,
    privatliv_standard: !!p.privatliv_standard,
    samtykke_tekst: samtykkeTekst(p),
  };
}

// Fuld visning til admin og til partneren selv (aldrig logo-bytes).
function fuldPartner(p) {
  const { logo, ...rest } = p;
  return {
    ...rest,
    har_logo: !!(p.har_logo || logo),
    logo_url: logoUrl(p),
    mangler_profil: manglerProfil(p),
    mangler_praemie: manglerPraemie(p),
    synlig: erSynlig(p),
    samtykke_tekst: samtykkeTekst(p),
    // Alt er udfyldt, men admin har ikke valgt en power-up. Kun admin
    // vælger power-up (partneren kan ikke), så det vises som en advarsel.
    advarsel_powerup: p.status === 'aktiv' && manglerProfil(p).length === 0 && !p.powerup,
  };
}

function slugFra(navn) {
  const s = String(navn || '')
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || 'partner';
}

module.exports = {
  POWERUPS,
  STATUSSER,
  PARTNER_REDIGERBARE,
  ADMIN_REDIGERBARE,
  standardPrivatlivUrl,
  privatlivMail,
  STANDARD_PRIVATLIV_URL,
  Valideringsfejl,
  renFelter,
  renEmail,
  renTekst,
  manglerProfil,
  manglerPraemie,
  erSynlig,
  offentligPartner,
  fuldPartner,
  slugFra,
  samtykkeTekst,
  SAMTYKKE_VERSION,
  ERKLAERINGER,
  PARTNERVILKAAR_VERSION,
  isoDato,
};
