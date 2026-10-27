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
<style>html,body{margin:0;height:100%;background:#010E22;color:#F1F5F9;
font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
display:flex;align-items:center;justify-content:center;text-align:center}
div{padding:32px;max-width:460px}h1{font-size:34px;margin:0 0 14px;color:${farve};
letter-spacing:-.02em;line-height:1.15}
p{font-size:19px;line-height:1.5;color:#94A3B8;margin:0}</style></head>
<body><div><h1>${overskrift}</h1><p>${tekst}</p></div></body></html>`;
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
