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

// Den præcise tekst ved fluebenet i kontaktformularen.
const KONTAKT_NYHEDSBREV_TEKST = 'Ja tak til praktiske tips om lager og logistik';
const TYPER = { learn: 'Lead', general: 'Generel', support: 'Support' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const t = (v, max = 2000) => {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) v = v.filter(Boolean).join(', ');
  return String(v).trim().slice(0, max);
};

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

  router.post('/hjemmeside/kontakt', limiter, async (req, res) => {
    const b = req.body || {};
    const email = t(b.email, 200);
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ fejl: 'Skriv en gyldig e-mail.', kode: 'ugyldig_email' });
    }
    if (!t(b.name)) return res.status(400).json({ fejl: 'Skriv dit navn.', kode: 'mangler_navn' });
    const r = await sendTilCrm(kontaktTilCrm(b), crmKontaktUrl());
    if (!r.ok) console.error('[crm] kontaktformular', email, r.fejl);
    // Formularen har sin egen mail-afsendelse, så svaret er altid ok; crm fortæller om kopien kom frem.
    res.json({ ok: true, crm: r.ok });
  });

  return router;
}

module.exports = { hjemmesideRouter, kontaktTilCrm, KONTAKT_NYHEDSBREV_TEKST };
