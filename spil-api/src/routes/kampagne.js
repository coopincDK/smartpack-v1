'use strict';

// Kampagnetilmeldinger fra sider uden for spillet (smartpack.dk/messe).
//
// Offentligt:  POST /kampagne/tilmeld
// Admin:       GET  /admin/kampagne/:kampagne        (liste med lodder)
//              GET  /admin/kampagne/:kampagne.csv    (samme som CSV)
//
// Lodder = kampagnens basislodder (fx 10) + de lodder, personens firma fik i
// Packrush i konferencens spilperiode (samme regel som præmiekonkurrencen:
// 1 lod pr. påbegyndte point_pr_lod i firmaets bedste spil). Firmaet findes
// via spilleren med samme e-mail, ellers via firmanavnet i tilmeldingen.
// Ehandelsdagen er den samlede lodtrækning; konferencens egen lodtrækning
// påvirkes IKKE af tilmeldingerne her. Warehouse Warrior-lodder kobles på
// senere (spillet samler endnu ikke e-mails).

const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const { createRateLimiter } = require('../middleware/rateLimit');
const { clientIp } = require('../middleware/clientIp');
const { kraevSmartpackOrigin } = require('../middleware/origin');
const { csvEscape } = require('../csv');
const { beregnLodder, matchNoegle } = require('../konkurrence');
const { synkKampagneRaekke } = require('../crm');
const crypto = require('crypto');
const QRCode = require('qrcode');

// Link, som arrangementets QR-kode peger på (lukkede lodtrækninger, migration 024).
const arrLink = (kode) => 'https://smartpack.dk/messe?a=' + encodeURIComponent(kode);
const KODE_RE = /^[a-z0-9]{8,32}$/;

// Kendte kampagner. Ukendte kampagnenavne afvises, så siden ikke kan oprette
// tilfældige lister.
const KAMPAGNER = {
  'ehandelsdagen-2027': {
    navn: 'Ehandelsdagen 2027',
    basislodder: 10,
    lodtraekning: 'Ehandelsdagen i Skive, 11. februar 2027',
  },
};
const KILDER = new Set(['messe', 'ehandelskonferencen', 'digiday', 'ehandelsdagen', 'andet']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tekst = (v, max) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
};

function safeIp(req) {
  const ip = clientIp(req);
  return ip && /^[0-9a-fA-F:.]+$/.test(ip) ? ip : null;
}

function samtykkeTekst(k, nyhedsbrev) {
  let t =
    `Jeg deltager i lodtrækningen om en tur til Kattegat Cup på ${k.lodtraekning} med ${k.basislodder} lodder. ` +
    'SmartPack ApS, CVR 42007617, bruger mit navn, min klub, mit firma og mine kontaktoplysninger til lodtrækningen og til at kontakte vinderen.';
  if (nyhedsbrev) t += ' Ja tak til SmartPacks mailliste. Jeg kan afmelde mig igen via linket i hver mail.';
  return t;
}

async function hentListe(pool, kampagneId) {
  const k = KAMPAGNER[kampagneId];
  const { rows } = await pool.query(
    `SELECT t.*, s.firma AS spiller_firma, (s.id IS NOT NULL) AS har_profil, a.navn AS arrangement_navn
       FROM kampagne_tilmelding t
       LEFT JOIN spiller s ON lower(s.email) = lower(t.email)
       LEFT JOIN kampagne_arrangement a ON a.id = t.arrangement_id
      WHERE t.kampagne = $1
      ORDER BY t.oprettet DESC`,
    [kampagneId]
  );
  const g = await beregnLodder(pool);
  const spilLodder = new Map(g.firmaer.map((f) => [f.firma_noegle, f]));
  return rows.map((r) => {
    const noegle = matchNoegle(r.spiller_firma || r.firma);
    const f = noegle ? spilLodder.get(noegle) : null;
    const fraSpil = f ? f.lodder : 0;
    return {
      id: String(r.id),
      navn: r.navn,
      klub: r.klub,
      firma: r.firma,
      email: r.email,
      telefon: r.telefon,
      ordrer: r.ordrer,
      hvor: r.hvor,
      nyhedsbrev: r.nyhedsbrev,
      kilder: r.kilder,
      oprettet: r.oprettet,
      har_spillet: r.har_profil || !!f,
      spil_firma: f ? f.firma : null,
      lodder_basis: k.basislodder,
      lodder_spil: fraSpil,
      lodder: k.basislodder + fraSpil,
      crm_sendt: r.crm_sendt,
      crm_fejl: r.crm_fejl,
      bekraeftet: !!r.verificeret_tid,
      arrangement: r.arrangement_navn || null,
    };
  });
}

function kampagneRouter(pool, opts = {}) {
  const router = express.Router();
  const admin = requireAdmin(pool);
  // Messe-wifi deler ofte én IP mellem mange telefoner, så grænsen er pr. IP
  // men generøs.
  const tilmeldLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    besked: 'For mange tilmeldinger lige nu. Prøv igen om et øjeblik.',
  });

  router.post('/kampagne/tilmeld', tilmeldLimiter, kraevSmartpackOrigin, async (req, res, next) => {
    try {
      const b = req.body || {};
      const kampagneId = String(b.kampagne || 'ehandelsdagen-2027');
      const k = KAMPAGNER[kampagneId];
      if (!k) return res.status(400).json({ fejl: 'Ukendt kampagne.', kode: 'ukendt_kampagne' });
      // Honeypot (hvis formularen har ét): udfyldt = bot. Svar som normalt, men gem og send intet.
      if (tekst(b._hp, 10)) {
        return res.status(201).json({ ok: true, kampagne: k.navn, lodder_basis: k.basislodder, lodtraekning: k.lodtraekning });
      }
      const navn = tekst(b.navn, 120);
      const firma = tekst(b.firma, 120);
      const email = tekst(b.email, 200);
      if (!navn) return res.status(400).json({ fejl: 'Skriv dit navn.', kode: 'mangler_navn' });
      if (!firma) return res.status(400).json({ fejl: 'Skriv dit firma.', kode: 'mangler_firma' });
      if (!email || !EMAIL_RE.test(email)) {
        return res.status(400).json({ fejl: 'Skriv en gyldig e-mail.', kode: 'ugyldig_email' });
      }
      let kilde = KILDER.has(String(b.kilde || '')) ? String(b.kilde) : 'messe';
      // Arrangementets hemmelige QR-kode (?a=...): bekræfter deltagelse, hvis den er gyldig nu.
      let arr = null;
      const qr = String(b.qr || '').trim().toLowerCase();
      if (KODE_RE.test(qr)) {
        const { rows: ar } = await pool.query(
          'SELECT id, kilde, navn FROM kampagne_arrangement WHERE kode = $1 AND kampagne = $2 AND now() BETWEEN gyldig_fra AND gyldig_til',
          [qr, kampagneId]
        );
        if (ar.length) { arr = ar[0]; kilde = arr.kilde; }
      }
      const nyhedsbrev = b.nyhedsbrev === true || b.nyhedsbrev === 'ja';
      const samtykke = samtykkeTekst(k, nyhedsbrev);
      const ins = await pool.query(
        `INSERT INTO kampagne_tilmelding
           (kampagne, navn, klub, firma, firma_noegle, email, telefon, ordrer, hvor,
            nyhedsbrev, nyhedsbrev_tid, samtykke_tekst, kilde, kilder, ip, arrangement_id, verificeret_tid)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, CASE WHEN $10 THEN now() END, $11, $12, ARRAY[$12]::text[], $13,
                 $14::bigint, CASE WHEN $14::bigint IS NULL THEN NULL ELSE now() END)
         -- En fremmed med en andens e-mail må ikke overskrive tilmeldingen: kun tomme
         -- felter udfyldes. Mailliste-status, samtykketekst og CRM-status ændres kun af
         -- en indsendelse med flueben; en indsendelse uden flueben rører dem aldrig.
         ON CONFLICT (kampagne, email) DO UPDATE SET
           klub = COALESCE(kampagne_tilmelding.klub, EXCLUDED.klub),
           telefon = COALESCE(kampagne_tilmelding.telefon, EXCLUDED.telefon),
           ordrer = COALESCE(kampagne_tilmelding.ordrer, EXCLUDED.ordrer),
           hvor = COALESCE(kampagne_tilmelding.hvor, EXCLUDED.hvor),
           nyhedsbrev = kampagne_tilmelding.nyhedsbrev OR EXCLUDED.nyhedsbrev,
           nyhedsbrev_tid = CASE WHEN EXCLUDED.nyhedsbrev THEN now() ELSE kampagne_tilmelding.nyhedsbrev_tid END,
           samtykke_tekst = CASE WHEN EXCLUDED.nyhedsbrev THEN EXCLUDED.samtykke_tekst ELSE kampagne_tilmelding.samtykke_tekst END,
           kilde = CASE WHEN EXCLUDED.nyhedsbrev THEN EXCLUDED.kilde ELSE kampagne_tilmelding.kilde END,
           kilder = CASE WHEN EXCLUDED.kilde = ANY(kampagne_tilmelding.kilder) THEN kampagne_tilmelding.kilder
                         ELSE kampagne_tilmelding.kilder || EXCLUDED.kilde END,
           arrangement_id = COALESCE(kampagne_tilmelding.arrangement_id, EXCLUDED.arrangement_id),
           verificeret_tid = COALESCE(kampagne_tilmelding.verificeret_tid, EXCLUDED.verificeret_tid),
           opdateret = now(),
           crm_sendt = CASE WHEN EXCLUDED.nyhedsbrev THEN NULL ELSE kampagne_tilmelding.crm_sendt END
         RETURNING id`,
        [
          kampagneId,
          navn,
          tekst(b.klub, 120),
          firma,
          matchNoegle(firma) || null,
          email,
          tekst(b.telefon, 40),
          tekst(b.ordrer, 40),
          tekst(b.hvor, 80),
          nyhedsbrev,
          samtykke,
          kilde,
          safeIp(req),
          arr ? arr.id : null,
        ]
      );
      res.status(201).json({ ok: true, kampagne: k.navn, lodder_basis: k.basislodder, lodtraekning: k.lodtraekning, bekraeftet: !!arr, arrangement: arr ? arr.navn : null });
      // Kopi til CRM'et efter svaret, så en langsom CRM aldrig forsinker formularen.
      // Kun en indsendelse med flueben giver et CRM-kald.
      if (!opts.udenCrm && nyhedsbrev) {
        synkKampagneRaekke(pool, ins.rows[0].id, k.navn).catch((e) => console.error('[crm] kampagne', e.message));
      }
    } catch (e) {
      next(e);
    }
  });

  // Sender de tilmeldinger, der ikke er nået frem til CRM'et (fx fordi nøglen
  // manglede, eller CRM'et var nede). Højst 500 pr. kald.
  router.post('/admin/kampagne/:kampagne/crm-send', admin, async (req, res, next) => {
    try {
      const k = KAMPAGNER[req.params.kampagne];
      if (!k) return res.status(404).json({ fejl: 'Ukendt kampagne.', kode: 'ikke_fundet' });
      const { rows } = await pool.query(
        'SELECT id FROM kampagne_tilmelding WHERE kampagne = $1 AND nyhedsbrev AND crm_sendt IS NULL ORDER BY id LIMIT 500',
        [req.params.kampagne]
      );
      let sendt = 0;
      let fejl = null;
      for (const r of rows) {
        const x = await synkKampagneRaekke(pool, r.id, k.navn);
        if (x.ok) sendt++;
        else fejl = x.fejl;
      }
      res.json({ forsoegt: rows.length, sendt, seneste_fejl: fejl });
    } catch (e) {
      next(e);
    }
  });

  // Arrangementer med hver sin hemmelige QR-kode (lukkede lodtrækninger).
  router.get('/admin/kampagne/:kampagne/arrangementer', admin, async (req, res, next) => {
    try {
      if (!KAMPAGNER[req.params.kampagne]) return res.status(404).json({ fejl: 'Ukendt kampagne.', kode: 'ikke_fundet' });
      const { rows } = await pool.query(
        `SELECT a.*, (SELECT count(*)::int FROM kampagne_tilmelding t WHERE t.arrangement_id = a.id) AS antal
           FROM kampagne_arrangement a WHERE a.kampagne = $1 ORDER BY a.gyldig_fra`,
        [req.params.kampagne]
      );
      const ud = [];
      for (const a of rows) {
        const link = arrLink(a.kode);
        const svg = await QRCode.toString(link, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, width: 1024 });
        ud.push({ id: String(a.id), navn: a.navn, kilde: a.kilde, gyldig_fra: a.gyldig_fra, gyldig_til: a.gyldig_til, antal: a.antal, link, qr_svg: svg });
      }
      res.set('Cache-Control', 'no-store');
      res.json({ arrangementer: ud });
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/kampagne/:kampagne/arrangementer', admin, async (req, res, next) => {
    try {
      if (!KAMPAGNER[req.params.kampagne]) return res.status(404).json({ fejl: 'Ukendt kampagne.', kode: 'ikke_fundet' });
      const b = req.body || {};
      const navn = tekst(b.navn, 120);
      const kilde = String(b.kilde || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
      const dato = String(b.dato || '');
      if (!navn) return res.status(400).json({ fejl: 'Skriv arrangementets navn.', kode: 'mangler_navn' });
      if (!kilde) return res.status(400).json({ fejl: 'Skriv en kort kilde, fx digiday.', kode: 'mangler_kilde' });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dato)) return res.status(400).json({ fejl: 'Vælg datoen for arrangementet.', kode: 'mangler_dato' });
      const til = /^\d{4}-\d{2}-\d{2}$/.test(String(b.til || '')) ? String(b.til) : dato;
      const kode = crypto.randomBytes(8).toString('hex');
      await pool.query(
        `INSERT INTO kampagne_arrangement (kampagne, navn, kilde, kode, gyldig_fra, gyldig_til)
         VALUES ($1, $2, $3, $4, ($5 || ' 00:00')::timestamp AT TIME ZONE 'Europe/Copenhagen', ($6 || ' 23:59')::timestamp AT TIME ZONE 'Europe/Copenhagen')`,
        [req.params.kampagne, navn, kilde, kode, dato, til]
      );
      KILDER.add(kilde);
      res.status(201).json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/kampagne/:kampagne.csv', admin, async (req, res, next) => {
    try {
      if (!KAMPAGNER[req.params.kampagne]) return res.status(404).json({ fejl: 'Ukendt kampagne.', kode: 'ikke_fundet' });
      const liste = await hentListe(pool, req.params.kampagne);
      const dk = (d) => (d ? new Date(d).toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' }).slice(0, 16) : '');
      const kol = [
        ['navn', (r) => r.navn],
        ['klub', (r) => r.klub],
        ['firma', (r) => r.firma],
        ['email', (r) => r.email],
        ['telefon', (r) => r.telefon],
        ['ordrer_pr_md', (r) => r.ordrer],
        ['hvor_knaekker_det', (r) => r.hvor],
        ['mailliste', (r) => (r.nyhedsbrev ? 'ja' : 'nej')],
        ['tilmeldt_fra', (r) => (r.kilder || []).join(' + ')],
        ['bekraeftet_deltager', (r) => (r.bekraeftet ? 'ja' : 'nej')],
        ['arrangement', (r) => r.arrangement || ''],
        ['tilmeldt', (r) => dk(r.oprettet)],
        ['lodder_tilmelding', (r) => r.lodder_basis],
        ['lodder_packrush', (r) => r.lodder_spil],
        ['lodder_i_alt', (r) => r.lodder],
      ];
      const lines = [kol.map((c) => csvEscape(c[0])).join(';')];
      for (const r of liste) lines.push(kol.map((c) => csvEscape(c[1](r))).join(';'));
      res.set('Cache-Control', 'no-store');
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="kampagne-${req.params.kampagne}.csv"`);
      res.send('\ufeff' + lines.join('\r\n') + '\r\n');
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/kampagne/:kampagne', admin, async (req, res, next) => {
    try {
      const k = KAMPAGNER[req.params.kampagne];
      if (!k) return res.status(404).json({ fejl: 'Ukendt kampagne.', kode: 'ikke_fundet' });
      const liste = await hentListe(pool, req.params.kampagne);
      res.set('Cache-Control', 'no-store');
      res.json({
        kampagne: { id: req.params.kampagne, ...k },
        antal: liste.length,
        mailliste: liste.filter((r) => r.nyhedsbrev).length,
        bekraeftede: liste.filter((r) => r.bekraeftet).length,
        lodder_bekraeftede: liste.filter((r) => r.bekraeftet).reduce((a, r) => a + r.lodder, 0),
        crm_mangler: liste.filter((r) => r.nyhedsbrev && !r.crm_sendt).length,
        lodder_i_alt: liste.reduce((a, r) => a + r.lodder, 0),
        tilmeldinger: liste,
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = { kampagneRouter, KAMPAGNER };
