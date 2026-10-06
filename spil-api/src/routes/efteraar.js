'use strict';

// Efterårsferieudfordringen: offentlig oversigt (uden navne/mails) og admin.
const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const E = require('../efteraar');

function efteraarRouter(pool) {
  const router = express.Router();
  const admin = requireAdmin(pool);

  router.get('/efteraar', async (req, res, next) => {
    try {
      const g = await E.beregn(pool);
      res.set('Cache-Control', 'no-store');
      res.json({ start: g.start, konf_slut: g.konf_slut, slut: g.slut, periode: g.periode, spillere: g.spillere.length, lodder_i_alt: g.lodder_i_alt, topscore: g.top[0] ? g.top[0].bedste : null });
    } catch (e) { next(e); }
  });

  router.get('/admin/efteraar', admin, async (req, res, next) => {
    try {
      const g = await E.beregn(pool);
      const { rows } = await pool.query('SELECT id, tidspunkt, type, lodder_i_alt, tilfaeldigt_tal, vinder_navn, vinder_email, reserver FROM efteraar_traekning ORDER BY tidspunkt DESC');
      res.set('Cache-Control', 'no-store');
      res.json({ ...g, spillere: g.spillere.map(({ dage, ...p }) => ({ ...p, dage })), traekninger: rows });
    } catch (e) { next(e); }
  });

  router.post('/admin/efteraar/traek', admin, async (req, res, next) => {
    try {
      const type = req.body && req.body.type === 'top' ? 'top' : 'lod';
      const r = await E.traek(pool, type, req.adminSession && req.adminSession.id);
      if (!r) return res.status(400).json({ fejl: 'Ingen gyldige spillere endnu.', kode: 'ingen_lodder' });
      res.json(r);
    } catch (e) { next(e); }
  });

  return router;
}

module.exports = { efteraarRouter };
