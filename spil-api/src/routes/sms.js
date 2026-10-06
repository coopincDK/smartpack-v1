'use strict';

// Admin: sms-log, timens boss-vindere og test-sms (til arrangørens eget nummer).
const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const { send, msisdn } = require('../sms');

function smsRouter(pool) {
  const router = express.Router();
  const admin = requireAdmin(pool);

  router.get('/admin/sms', admin, async (req, res, next) => {
    try {
      const log = await pool.query('SELECT tidspunkt, type, til, tekst, status, fejl FROM sms_log ORDER BY tidspunkt DESC LIMIT 200');
      const tv = await pool.query('SELECT dag, time, navn, score FROM time_vinder ORDER BY dag DESC, time DESC LIMIT 50');
      res.set('Cache-Control', 'no-store');
      res.json({ har_noegle: !!process.env.INMOBILE_API_KEY, afsender: 'Packrush', log: log.rows, timens_boss: tv.rows });
    } catch (e) { next(e); }
  });

  router.post('/admin/sms/test', admin, async (req, res, next) => {
    try {
      const til = String((req.body && req.body.telefon) || '');
      if (!msisdn(til)) return res.status(400).json({ fejl: 'Skriv et dansk mobilnummer med 8 cifre.', kode: 'ugyldigt_nummer' });
      const r = await send(pool, { type: 'test', noegle: `${Date.now()}`, til, tekst: 'Test fra Packrush: sms-opsætningen virker.', test: true, adminTest: true });
      res.status(r.ok ? 200 : 502).json(r);
    } catch (e) { next(e); }
  });

  return router;
}

module.exports = { smsRouter };
