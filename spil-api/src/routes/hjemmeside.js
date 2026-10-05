'use strict';

// Hjemmesidens kontaktformular (js/contact-form.js på smartpack.dk) sender en
// kopi hertil, og serveren sender den videre til CRM'ets indbakke
// (POST https://crm.smartpack.dk/api/v1/contact-form) med nøglen fra
// SMARTPACK_CRM_KEY. Nøglen kommer derfor aldrig i browseren.
//
// Har personen sat flueben ved nyhedsmails, kommer de også på listen i CRM'et
// (newsletter: true + den præcise tekst ved fluebenet).
//
// Intet gemmes i Packrush' egen database.

const express = require('express');
const { createRateLimiter } = require('../middleware/rateLimit');
const { sendTilCrm, crmKontaktUrl } = require('../crm');

// Footerens nyhedsbrevstilmelding (js/footer.js), den præcise tekst ved fluebenet.
const FOOTER_NYHEDSBREV_TEKST = 'Jeg accepterer at modtage nyhedsmail fra SmartPack. Du kan afmelde dig igen når som helst.';
const nlUrl = () => process.env.SMARTPACK_CRM_URL || 'https://crm.smartpack.dk/api/v1/newsletter';
const kunTekst = (b, felter) => felter.every((k) => b[k] === undefined || b[k] === null || (typeof b[k] === 'string' && b[k].length <= 500));

// Den præcise tekst ved fluebenet i kontaktformularen.
const KONTAKT_NYHEDSBREV_TEKST = 'Ja tak til praktiske tips om lager og logistik';
const TYPER = { learn: 'Lead', general: 'Generel', support: 'Support' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const t = (v, max = 2000) => {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) v = v.filter(Boolean).join(', ');
  return String(v).trim().slice(0, max);
};

// Felter, der kun må være tekst (eller tal), og felter, der også må være en
// liste af tekster (afkrydsningsfelter). Alt andet — objekter, nested arrays,
// booleans, for lange tekster — afvises med 400 FØR t() kalder String(), så et
// objekt med egen toString ikke kan kaste inde i handleren.
const MAKS_FELT = 5000;
const MAKS_LISTE = 30;
const TEKST_FELTER = [
  'type', 'name', 'email', 'phone', 'company', 'comment', 'subject', 'message', 'page', 'cvr', 'orders',
  'employees', 'urgency', 'shop_andet', 'erp_andet', 'carriers_dk_andet', 'carriers_int_andet',
  'source_andet', '_hp', 'newsletter',
];
const LISTE_FELTER = ['shops', 'erp', 'carriers_dk', 'carriers_int', 'source'];

const erTekst = (v) =>
  typeof v === 'string' ? v.length <= MAKS_FELT : typeof v === 'number' && Number.isFinite(v);

// Returnerer navnet på det første felt med ugyldig type, ellers null.
function ugyldigtFelt(b) {
  for (const k of TEKST_FELTER) {
    const v = b[k];
    if (v === undefined || v === null) continue;
    if (k === 'newsletter' && typeof v === 'boolean') continue;
    if (!erTekst(v)) return k;
  }
  for (const k of LISTE_FELTER) {
    const v = b[k];
    if (v === undefined || v === null || erTekst(v)) continue;
    if (!Array.isArray(v) || v.length > MAKS_LISTE || !v.every(erTekst)) return k;
  }
  return null;
}

function kontaktTilCrm(b) {
  const type = TYPER[b.type] ? b.type : 'general';
  const message =
    type === 'learn'
      ? t(b.comment) || 'Vil gerne høre mere om SmartPack.'
      : [t(b.subject, 200), t(b.message)].filter(Boolean).join('\n\n');
  const body = {
    name: t(b.name, 120),
    email: t(b.email, 200),
    phone: t(b.phone, 40),
    company: t(b.company, 160),
    message,
    page: t(b.page, 500),
    type: TYPER[type],
  };
  const ekstra = {
    cvr: t(b.cvr, 20),
    ordrer_pr_dag: t(b.orders, 40),
    medarbejdere: t(b.employees, 40),
    webshop: [t(b.shops), t(b.shop_andet, 120)].filter(Boolean).join(' · '),
    erp: [t(b.erp), t(b.erp_andet, 120)].filter(Boolean).join(' · '),
    fragt_dk: [t(b.carriers_dk), t(b.carriers_dk_andet, 120)].filter(Boolean).join(' · '),
    fragt_int: [t(b.carriers_int), t(b.carriers_int_andet, 120)].filter(Boolean).join(' · '),
    hastegrad: t(b.urgency, 40),
    hoert_via: [t(b.source, 80), t(b.source_andet, 120)].filter(Boolean).join(' · '),
    emne: type === 'learn' ? '' : t(b.subject, 200),
  };
  for (const [k, v] of Object.entries(ekstra)) if (v) body[k] = v;
  for (const k of Object.keys(body)) if (body[k] === '') delete body[k];
  const nyhedsbrev = b.newsletter === true || b.newsletter === 'Ja';
  if (nyhedsbrev) {
    body.newsletter = true;
    body.consentText = KONTAKT_NYHEDSBREV_TEKST;
  }
  if (b._hp) body._hp = t(b._hp, 200);
  return body;
}

function hjemmesideRouter() {
  const router = express.Router();
  const limiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 20,
    besked: 'For mange henvendelser lige nu. Prøv igen om et øjeblik.',
  });

  router.post('/hjemmeside/kontakt', limiter, async (req, res, next) => {
    try {
      const b = req.body || {};
      if (typeof b !== 'object' || Array.isArray(b) || ugyldigtFelt(b)) {
        return res.status(400).json({ fejl: 'Formularen indeholder ugyldige felter.', kode: 'ugyldigt_input' });
      }
      const email = t(b.email, 200);
      if (!email || !EMAIL_RE.test(email)) {
        return res.status(400).json({ fejl: 'Skriv en gyldig e-mail.', kode: 'ugyldig_email' });
      }
      if (!t(b.name)) return res.status(400).json({ fejl: 'Skriv dit navn.', kode: 'mangler_navn' });
      const r = await sendTilCrm(kontaktTilCrm(b), crmKontaktUrl());
      if (!r.ok) console.error('[crm] kontaktformular', email, r.fejl);
      // Formularen har sin egen mail-afsendelse, så svaret er altid ok; crm fortæller om kopien kom frem.
      res.json({ ok: true, crm: r.ok });
    } catch (e) {
      next(e);
    }
  });

  // Footerens nyhedsbrev: { email, name?, company?, page?, _hp? }. Kræver at fluebenet
  // er sat i browseren (consent: true); teksten ved fluebenet sendes med som samtykke.
  router.post('/hjemmeside/nyhedsbrev', limiter, async (req, res, next) => {
    try {
      const b = req.body || {};
      if (typeof b !== 'object' || Array.isArray(b) || !kunTekst(b, ['email', 'name', 'company', 'page', '_hp'])) {
        return res.status(400).json({ fejl: 'Formularen indeholder ugyldige felter.', kode: 'ugyldigt_input' });
      }
      const email = t(b.email, 200);
      if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ fejl: 'Skriv en gyldig e-mail.', kode: 'ugyldig_email' });
      if (b.consent !== true) return res.status(400).json({ fejl: 'Sæt flueben for at tilmelde dig.', kode: 'mangler_samtykke' });
      const body = { email, source: 'hjemmeside', newsletter: true, consentText: FOOTER_NYHEDSBREV_TEKST, notes: { formular: 'Nyhedsbrev i footeren' } };
      if (t(b.name, 120)) body.name = t(b.name, 120);
      if (t(b.company, 160)) body.company = t(b.company, 160);
      if (t(b.page, 500)) body.notes.side = t(b.page, 500);
      if (b._hp) body._hp = t(b._hp, 200);
      const r = await sendTilCrm(body, nlUrl());
      if (!r.ok) console.error('[crm] nyhedsbrev', email, r.fejl);
      res.json({ ok: true, crm: r.ok });
    } catch (e) {
      next(e);
    }
  });

  // Afmelding fra footerens "afmeld"-vindue: { email }.
  router.post('/hjemmeside/afmeld', limiter, async (req, res, next) => {
    try {
      const b = req.body || {};
      if (typeof b !== 'object' || Array.isArray(b) || !kunTekst(b, ['email'])) {
        return res.status(400).json({ fejl: 'Ugyldige felter.', kode: 'ugyldigt_input' });
      }
      const email = t(b.email, 200);
      if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ fejl: 'Skriv en gyldig e-mail.', kode: 'ugyldig_email' });
      const r = await sendTilCrm({ email, source: 'hjemmeside' }, nlUrl() + '/unsubscribe');
      if (!r.ok) console.error('[crm] afmeld', email, r.fejl);
      res.json({ ok: true, crm: r.ok });
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = { hjemmesideRouter, kontaktTilCrm, KONTAKT_NYHEDSBREV_TEKST, FOOTER_NYHEDSBREV_TEKST };
