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
  sprii: { runde: 'Send', effekt: 'Live-salg: kommentarerne bliver til ordrer i 8 sek.' },
  elementlogic: { runde: 'Pluk', effekt: 'Lagerrobot, der hjælper med plukket.' },
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
};

// Felter, partneren selv må rette. Navn (visningsnavnet i spillet), status,
// "vist i spil" og power-up styrer kun admin.
const PARTNER_REDIGERBARE = [
  ...Object.keys(TEKSTFELTER),
  'giver_praemie',
  'praemie_vaerdi',
  'praemie_vaerdi_type',
  'praemie_moms',
];

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
function renHjemmeside(v) {
  let s = renTekst(v, TEKSTFELTER.hjemmeside);
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try {
    u = new URL(s);
  } catch (e) {
    throw new Valideringsfejl('Hjemmesiden er ikke en gyldig adresse.', 'hjemmeside');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Valideringsfejl('Hjemmesiden skal starte med http:// eller https://.', 'hjemmeside');
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
    else if (k === 'kontakt_email') ud[k] = renEmail(v, 'kontakt_email');
    else if (k in TEKSTFELTER) ud[k] = renTekst(v, TEKSTFELTER[k]);
    else if (k === 'navn') {
      ud[k] = renTekst(v, 80);
      if (!ud[k]) throw new Valideringsfejl('Partneren skal have et navn.', 'navn');
    } else if (k === 'giver_praemie' || k === 'vist_i_spil') ud[k] = v === true || v === 'true';
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
function manglerProfil(p) {
  const m = [];
  if (!p.navn) m.push('navn');
  if (!p.firmanavn) m.push('firmanavn');
  if (!p.hjemmeside) m.push('hjemmeside');
  if (!p.kort_beskrivelse) m.push('kort_beskrivelse');
  return m;
}

function manglerPraemie(p) {
  if (!p.giver_praemie) return [];
  const m = [];
  if (!p.praemie_titel) m.push('praemie_titel');
  if (p.praemie_vaerdi === null || p.praemie_vaerdi === undefined) m.push('praemie_vaerdi');
  if (!p.praemie_beskrivelse) m.push('praemie_beskrivelse');
  if (p.praemie_vaerdi_type === 'op_til' && !p.praemie_betingelser) m.push('praemie_betingelser');
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
  };
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
};
