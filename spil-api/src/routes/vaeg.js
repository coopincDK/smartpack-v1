'use strict';

const express = require('express');

// Vaegstyring til standen.
//
// En messegaest scanner en QR paa bordskaermen. Telefonen lander paa
// GET /vaeg/vis?case=<id>, som noterer oensket og viser en kvittering.
// Vaegskaermen spoerger GET /vaeg/aktuel et par gange i sekundet og
// skifter til den case.
//
// Tilstanden ligger MED VILJE i hukommelsen: et oenske er kun relevant i
// faa sekunder, og en genstart maa gerne nulstille det. Ingen database,
// ingen migration, ingen beroering af spillets data.

const GYLDIG_MS = 90 * 1000;

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
div{padding:32px;max-width:460px}h1{font-size:34px;margin:0 0 14px;color:${farve}}
p{font-size:19px;line-height:1.5;color:#94A3B8;margin:0}</style></head>
<body><div><h1>${overskrift}</h1><p>${tekst}</p></div></body></html>`;
}

function vaegRouter() {
  const router = express.Router();
  let oenske = null;
  let taeller = 0;

  // Telefonen lander her efter et scan.
  router.get('/vaeg/vis', (req, res) => {
    const id = sanitiser(req.query.case);
    res.set('Cache-Control', 'no-store');
    if (!id) {
      return res.status(400).send(side('Koden kunne ikke laeses', 'Proev en af de andre koder paa bordet.', false));
    }
    taeller += 1;
    oenske = { id, tid: Date.now(), nr: taeller };
    return res.send(side('Den starter nu', 'Kig op paa vaeggen bag bordet.', true));
  });

  // Vaegskaermen spoerger her.
  router.get('/vaeg/aktuel', (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!oenske || Date.now() - oenske.tid > GYLDIG_MS) return res.json({ case: null, nr: 0 });
    return res.json({ case: oenske.id, nr: oenske.nr });
  });

  return router;
}

module.exports = { vaegRouter };
