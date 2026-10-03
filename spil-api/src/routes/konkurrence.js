'use strict';

// Admin-endpoints til præmiekonkurrencen: deltagerliste, lodder og
// lodtrækning. Se src/konkurrence.js og deltagervilkårene (/spil/vilkaar/).

const express = require('express');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { requireAdmin } = require('../middleware/adminAuth');
const { requirePlayer } = require('../middleware/playerAuth');
const K = require('../konkurrence');

// Standens QR-kode: en fast, hemmelig kode i et link til spillet. Scanner en
// spiller den på standen, godkendes spillerens firma til konkurrencen (lægges
// på deltagerlisten med kilde 'stand'), selv om firmaet har stavet sig
// anderledes end på Dansk Erhvervs liste. Koden virker kun på messedagen.
const STAND_URL = 'https://smartpack.dk/spil/';
async function hentStandKode(pool) {
  const { rows } = await pool.query('SELECT hemmelig FROM config WHERE id = 1');
  const hem = (rows[0] && rows[0].hemmelig) || {};
  if (hem.standKode) return hem.standKode;
  const kode = crypto.randomBytes(9).toString('base64url').replace(/[-_]/g, 'x').slice(0, 12);
  await pool.query("UPDATE config SET hemmelig = COALESCE(hemmelig, '{}'::jsonb) || jsonb_build_object('standKode', $1::text) WHERE id = 1", [kode]);
  return kode;
}
function standLink(kode) {
  return STAND_URL + '?stand=' + encodeURIComponent(kode);
}

function konkurrenceRouter(pool) {
  const router = express.Router();
  const admin = requireAdmin(pool);

  // Deltagerlisten: antal firmaer + navnene (kun firmanavne, ingen personer).
  router.get('/admin/deltagerliste', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        'SELECT firma, firma_noegle, kilde, oprettet FROM deltagerliste_firma ORDER BY firma ASC'
      );
      res.json({ antal: rows.length, firmaer: rows });
    } catch (e) {
      next(e);
    }
  });

  // Indlæs deltagerlisten. `tilstand: "erstat"` (standard) erstatter hele
  // listen med den nye udgave fra Dansk Erhverv; `"tilfoej"` lægger firmaer
  // til (fx et firma, der har stavet sit navn anderledes i spillet).
  router.post('/admin/deltagerliste', admin, async (req, res, next) => {
    const body = req.body || {};
    const tilstand = body.tilstand === 'tilfoej' ? 'tilfoej' : 'erstat';
    const kolonne = Math.max(0, Math.min(50, parseInt(body.kolonne, 10) || 0));
    const firmaer = K.parseDeltagerliste(body.tekst, kolonne);
    if (!firmaer.size) return res.status(400).json({ fejl: 'Listen er tom.', kode: 'tom_liste' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      if (tilstand === 'erstat') await client.query("DELETE FROM deltagerliste_firma WHERE kilde = 'import'");
      let nye = 0;
      for (const [noegle, firma] of firmaer) {
        const r = await client.query(
          `INSERT INTO deltagerliste_firma (firma, firma_noegle, kilde) VALUES ($1, $2, $3)
           ON CONFLICT (firma_noegle) DO NOTHING`,
          [firma, noegle, tilstand === 'tilfoej' ? 'manuel' : 'import']
        );
        nye += r.rowCount;
      }
      const { rows } = await client.query('SELECT count(*)::int AS n FROM deltagerliste_firma');
      await client.query('COMMIT');
      res.json({ ok: true, tilstand, indlaest: firmaer.size, nye, antal: rows[0].n });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  // Lodderne lige nu: alle firmaer, der har spillet i perioden, og om de kan
  // vinde. Bruges til at tjekke før trækningen.
  router.get('/admin/konkurrence/lodder', admin, async (req, res, next) => {
    try {
      const g = await K.beregnLodder(pool);
      res.json({
        spil_start: g.konkurrence && g.konkurrence.spil_start,
        spil_slut: g.konkurrence && g.konkurrence.spil_slut,
        lodtraekning: g.konkurrence && g.konkurrence.lodtraekning,
        point_pr_lod: g.konkurrence && g.konkurrence.point_pr_lod,
        deltagerliste_antal: g.deltagerliste_antal,
        lodder_i_alt: g.lodder_i_alt,
        firmaer: g.firmaer.map((f) => ({
          firma: f.firma,
          firma_noegle: f.firma_noegle,
          bedste: f.bedste,
          lodder: f.lodder,
          paa_deltagerliste: f.paa_deltagerliste,
          udelukket: f.udelukket,
          kan_vinde: f.kan_vinde,
        })),
      });
    } catch (e) {
      next(e);
    }
  });

  // Tjekliste: alt der mangler før konkurrencen.
  router.get('/admin/konkurrence/status', admin, async (req, res, next) => {
    try {
      res.json(await K.konkurrenceStatus(pool));
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/konkurrence/traek', admin, async (req, res, next) => {
    try {
      const r = await K.traekVinder(pool, req.adminSession && req.adminSession.id);
      if (!r) return res.status(400).json({ fejl: 'Ingen firmaer kan vinde endnu.', kode: 'ingen_lodder' });
      res.json(r);
    } catch (e) {
      next(e);
    }
  });

  // Alle trækninger (dokumentation).
  router.get('/admin/konkurrence/traekninger', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, tidspunkt, spil_start, spil_slut, point_pr_lod, deltagerliste_antal, grundlag,
                lodder_i_alt, tilfaeldigt_tal, vinder_firma, vinder_navn_snapshot, vinder_email_snapshot
         FROM konkurrence_traekning ORDER BY tidspunkt DESC`
      );
      res.json({ traekninger: rows });
    } catch (e) {
      next(e);
    }
  });

  // --- Standens QR-kode ---
  router.get('/admin/standkode', admin, async (req, res, next) => {
    try {
      const kode = await hentStandKode(pool);
      const { rows } = await pool.query("SELECT firma, oprettet FROM deltagerliste_firma WHERE kilde = 'stand' ORDER BY oprettet DESC");
      res.json({ kode, url: standLink(kode), godkendt_paa_standen: rows });
    } catch (e) {
      next(e);
    }
  });

  router.get('/admin/standkode.svg', admin, async (req, res, next) => {
    try {
      const kode = await hentStandKode(pool);
      const svg = await QRCode.toString(standLink(kode), { type: 'svg', errorCorrectionLevel: 'M', margin: 2, width: 1024 });
      res.set('Content-Type', 'image/svg+xml');
      res.set('Cache-Control', 'no-store');
      res.send(svg);
    } catch (e) {
      next(e);
    }
  });

  // Spilleren har scannet QR-koden på standen: godkend firmaet til konkurrencen.
  const spiller = requirePlayer(pool);
  router.post('/me/stand', spiller, async (req, res, next) => {
    try {
      const kode = String((req.body && req.body.kode) || '').trim();
      const rigtig = await hentStandKode(pool);
      if (!kode || kode.length !== rigtig.length || !crypto.timingSafeEqual(Buffer.from(kode), Buffer.from(rigtig))) {
        return res.status(400).json({ fejl: 'Koden er ikke gyldig. Scan QR-koden på SmartPacks stand igen.', kode: 'ugyldig_standkode' });
      }
      const k = await K.hentKonkurrence(pool);
      const nu = new Date();
      if (!k || !k.spil_start || !k.spil_slut) return res.status(400).json({ fejl: 'Konkurrencen er ikke sat op endnu.', kode: 'ingen_konkurrence' });
      const fra = new Date(new Date(k.spil_start).getTime() - 12 * 3600 * 1000);
      if (nu < fra || nu > new Date(k.spil_slut)) {
        return res.status(400).json({ fejl: 'QR-koden virker kun på messedagen, indtil spilperioden slutter.', kode: 'uden_for_perioden' });
      }
      const firma = String(req.player.firma || '').trim();
      const noegle = K.matchNoegle(firma);
      if (!noegle) return res.status(400).json({ fejl: 'Skriv først, hvilket firma du spiller for.', kode: 'firma_mangler' });
      await pool.query(
        `INSERT INTO deltagerliste_firma (firma, firma_noegle, kilde) VALUES ($1, $2, 'stand') ON CONFLICT (firma_noegle) DO NOTHING`,
        [firma.slice(0, 200), noegle]
      );
      res.json({ ok: true, konkurrence: await K.firmaStatus(pool, firma, nu) });
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = { konkurrenceRouter, hentStandKode };
