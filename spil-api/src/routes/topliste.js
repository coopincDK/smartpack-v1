'use strict';

// Offentlig topliste til bordskærmen (smartpack.dk/bord): dagens bedste godkendte
// spil pr. spiller, med samme navnemaskering som den offentlige tavle. Skjulte
// spillere og spil til VAR-tjek er ikke med. Kort cache, da skærmen henter hvert 30. sek.
const express = require('express');
const { maskedName } = require('../rules/nameDisplay');

function toplisteRouter(pool) {
  const router = express.Router();
  let cache = { t: 0, key: '', body: null };

  router.get('/topliste', async (req, res, next) => {
    try {
      const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 6));
      const dag = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(new Date());
      const key = `${dag}:${limit}`;
      if (cache.body && cache.key === key && Date.now() - cache.t < 15000) {
        res.set('Cache-Control', 'public, max-age=15');
        return res.json(cache.body);
      }
      const { rows } = await pool.query(
        `SELECT s.navn, MAX(f.samlet) AS point, MIN(s.oprettet) AS oprettet
           FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
          WHERE f.status = 'godkendt' AND f.samlet IS NOT NULL AND s.skjult = false
            AND (f.oprettet AT TIME ZONE 'Europe/Copenhagen')::date = $1::date
          GROUP BY s.id, s.navn
          ORDER BY point DESC, oprettet ASC
          LIMIT $2`,
        [dag, limit]
      );
      const body = { dag, topliste: rows.map((r) => ({ navn: maskedName(r.navn, false), point: Number(r.point) })) };
      cache = { t: Date.now(), key, body };
      res.set('Cache-Control', 'public, max-age=15');
      res.json(body);
    } catch (e) { next(e); }
  });

  // Antal virksomheder, der nogensinde har spillet (godkendt spil, ikke skjult). Stiger kun over tid.
  let firmaCache = { t: 0, n: null };
  router.get('/virksomheder', async (req, res, next) => {
    try {
      if (firmaCache.n === null || Date.now() - firmaCache.t > 60000) {
        const { rows } = await pool.query(
          `SELECT count(DISTINCT s.firma_noegle)::int n FROM spiller s
            WHERE s.skjult = false AND s.firma_noegle <> ''
              AND EXISTS (SELECT 1 FROM forsoeg f WHERE f.spiller_id = s.id AND f.status = 'godkendt')`
        );
        firmaCache = { t: Date.now(), n: Math.max(firmaCache.n || 0, rows[0].n) };
      }
      res.set('Cache-Control', 'public, max-age=60');
      res.json({ virksomheder: firmaCache.n });
    } catch (e) { next(e); }
  });

  return router;
}

module.exports = { toplisteRouter };
