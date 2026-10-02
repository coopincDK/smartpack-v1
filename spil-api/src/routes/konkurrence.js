'use strict';

// Admin-endpoints til præmiekonkurrencen: deltagerliste, lodder og
// lodtrækning. Se src/konkurrence.js og deltagervilkårene (/spil/vilkaar/).

const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const K = require('../konkurrence');

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

  return router;
}

module.exports = { konkurrenceRouter };
