'use strict';

// Admin: VAR-tjek af spil, der er sat på pause (status 'var'). Godkend = spillet
// kommer på tavlen og tæller i lodderne; afvis = spillet bliver afvist.
const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');

function varRouter(pool) {
  const router = express.Router();
  const admin = requireAdmin(pool);

  router.get('/admin/var', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT f.id, f.slut_server, f.samlet, f.runde1, f.runde2, f.runde3, f.stats, f.bf, f.spilletid_server_ms,
                f.var_grunde, f.var_status, f.var_besked, f.var_anmodet, f.var_afgjort,
                s.navn, s.email, s.firma
           FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
          WHERE f.var_status IS NOT NULL
          ORDER BY (f.var_status = 'anmodet') DESC, (f.var_status = 'flag') DESC, f.slut_server DESC
          LIMIT 200`
      );
      res.set('Cache-Control', 'no-store');
      res.json({ var: rows.map((r) => ({ ...r, id: String(r.id) })) });
    } catch (e) { next(e); }
  });

  router.post('/admin/var/:id', admin, async (req, res, next) => {
    try {
      const godkend = !!(req.body && req.body.godkend);
      const r = await pool.query(
        godkend
          ? `UPDATE forsoeg SET status = 'godkendt', afvist_aarsag = NULL, var_status = 'godkendt', var_afgjort = now() WHERE id = $1 AND status = 'var' RETURNING id`
          : `UPDATE forsoeg SET status = 'afvist', afvist_aarsag = 'var_afvist', var_status = 'afvist', var_afgjort = now() WHERE id = $1 AND status = 'var' RETURNING id`,
        [req.params.id]
      );
      if (!r.rowCount) return res.status(404).json({ fejl: 'Spillet findes ikke eller er allerede vurderet.', kode: 'ikke_fundet' });
      await pool.query(
        `INSERT INTO admin_audit_log (admin_session_id, handling, detaljer) VALUES ($1, $2, $3)`,
        [(req.adminSession && req.adminSession.id) || null, godkend ? 'var_godkendt' : 'var_afvist', JSON.stringify({ forsoeg_id: req.params.id })]
      );
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return router;
}

module.exports = { varRouter };
