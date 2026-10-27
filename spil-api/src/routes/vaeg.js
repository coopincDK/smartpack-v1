'use strict';

const express = require('express');

// Vægstyring til standen.
//
// En messegæst scanner en QR på bordskærmen. Telefonen lander på
// GET /vaeg/vis?case=<id>, som lægger ønsket i en kø og viser hvornår
// det bliver dets tur. Vægskærmen henter GET /vaeg/naeste, men KUN når
// den er ledig — så en case bliver aldrig afbrudt af den næste scanning.
//
// Køen ligger med vilje i hukommelsen: et ønske er kun relevant i få
// minutter, og en genstart må gerne rydde den. Ingen database, ingen
// migration, ingen berøring af spillets data.

const GYLDIG_MS = 5 * 60 * 1000;   // et ønske dør efter fem minutter i kø
const PR_CASE_MS = 120 * 1000;     // groft skøn pr. case foran dig
const MAKS_KOE = 12;

function sanitiser(s) {
  return typeof s === 'string' && /^[a-z0-9-]{1,40}$/.test(s) ? s : null;
}

function side(overskrift, tekst, gron) {
  const farve = gron ? '#3ECF8E' : '#F97316';
  return `<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>SmartPack</title>
<style>html,body{margin:0;min-height:100%;background:#010E22;color:#F1F5F9;
font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;-webkit-font-smoothing:antialiased}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px 20px;box-sizing:border-box}
.ark{width:100%;max-width:460px;text-align:center}
h1{font-size:34px;margin:0 0 14px;color:${farve};letter-spacing:-.02em;line-height:1.15}
.led{font-size:19px;line-height:1.5;color:#94A3B8;margin:0}
.kort{margin-top:36px;background:#161C24;border:1px solid rgba(241,245,249,.08);
border-radius:18px;padding:24px 22px;text-align:left}
.kort h2{font-size:19px;margin:0 0 8px;color:#F1F5F9;letter-spacing:-.01em}
.kort p{font-size:15px;line-height:1.5;color:#94A3B8;margin:0 0 18px}
.knap{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;
background:#3ECF8E;color:#010E22;font-family:inherit;font-size:17px;font-weight:600;
padding:16px;cursor:pointer}
.knap:active{transform:translateY(1px)}</style></head>
<body><div class="ark">
<h1>${overskrift}</h1><p class="led">${tekst}</p>
<div class="kort">
<h2>Hvad kan vi hjælpe med?</h2>
<p>Udfyld dine oplysninger og vælg emne. Vi kommer normalt retur inden for en hverdag.</p>
<button class="knap" type="button" onclick="aabenForm()">Skriv til os</button>
</div></div>
<script>window._spcovBase='https://smartpack.dk';
var forsoeg=0;
function aabenForm(){
  if (window.spcov) { window.spcov.open(); return; }
  if (forsoeg++ < 25) { setTimeout(aabenForm, 200); return; }
  location.href = 'https://smartpack.dk/kontakt';
}</script>
<script src="https://smartpack.dk/js/contact-form.js" defer></script>
</body></html>`;
}

function vaegRouter() {
  const router = express.Router();
  let koe = [];
  let taeller = 0;

  function ryd() {
    const nu = Date.now();
    koe = koe.filter((x) => nu - x.tid < GYLDIG_MS);
  }

  // Telefonen lander her efter et scan.
  router.get('/vaeg/vis', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const id = sanitiser(req.query.case);
    if (!id) {
      return res.status(400).send(side('Koden kunne ikke læses',
        'Prøv en af de andre koder på bordet.', false));
    }
    ryd();
    if (koe.length >= MAKS_KOE) {
      return res.status(429).send(side('Der er run på lige nu',
        'Prøv igen om et øjeblik — køen er fuld.', false));
    }
    taeller += 1;
    koe.push({ id, tid: Date.now(), nr: taeller });
    const plads = koe.length;
    if (plads === 1) {
      return res.send(side('Den starter nu', 'Kig op på væggen bag bordet.', true));
    }
    const min = Math.max(1, Math.round(((plads - 1) * PR_CASE_MS) / 60000));
    return res.send(side(`Du er nummer ${plads}`,
      `Den kommer om cirka ${min} minut${min === 1 ? '' : 'ter'}. Bliv stående — den starter af sig selv.`, true));
  });

  // Vægskærmen henter her, men kun når den er ledig.
  // At hente ÉT ønske fjerner det fra køen.
  router.get('/vaeg/naeste', (req, res) => {
    res.set('Cache-Control', 'no-store');
    ryd();
    const naeste = koe.shift();
    if (!naeste) return res.json({ case: null, nr: 0, koe: 0 });
    return res.json({ case: naeste.id, nr: naeste.nr, koe: koe.length });
  });

  // Kun til at kigge med — ændrer ingenting.
  router.get('/vaeg/koe', (req, res) => {
    res.set('Cache-Control', 'no-store');
    ryd();
    return res.json({ koe: koe.map((x) => ({ case: x.id, nr: x.nr })) });
  });

  return router;
}

module.exports = { vaegRouter };
