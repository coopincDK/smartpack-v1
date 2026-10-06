'use strict';

// Samlet lodliste som CSV til arrangøren: messe-turneringens lodder pr. firma,
// timens boss-vindere, efterårslodder pr. spiller og alle trækninger. Hver eksport
// gemmes som låst kopi med SHA-256 (lodliste_eksport), så den kan dokumenteres.
const crypto = require('crypto');
const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const { toCsv } = require('../csv');
const K = require('../konkurrence');
const E = require('../efteraar');

const fmtTid = (d) => (d ? new Date(d).toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' }) : '');

async function bygRaekker(pool) {
  const ud = [];
  const m = await K.beregnLodder(pool);
  let fra = 0;
  for (const f of m.firmaer) {
    const lod = f.kan_vinde ? f.lodder : 0;
    ud.push({
      konkurrence: 'Messe-turnering 8. okt.', type: 'lodder', navn: f.firma, spiller: f.spiller_navn, email: f.spiller_email,
      score: f.bedste, lodder: lod, lod_fra: lod ? fra : '', lod_til: lod ? fra + lod - 1 : '',
      note: f.udelukket ? 'Udelukket (arrangør)' : f.paa_deltagerliste ? `På deltagerlisten som ${f.deltagerliste_navn}` : 'Ikke på deltagerlisten, 0 lodder',
    });
    fra += lod;
  }
  const { rows: tv } = await pool.query('SELECT dag, time, navn, score FROM time_vinder ORDER BY dag, time');
  for (const t of tv) {
    const hh = String(t.time).padStart(4, '0');
    ud.push({ konkurrence: 'Timens boss', type: 'vinder', navn: t.navn || 'Ingen vinder', spiller: t.navn || '', email: '', score: t.score || '', lodder: '', lod_fra: '', lod_til: '', note: `Kåret ${new Date(t.dag).toISOString().slice(0, 10)} kl. ${hh.slice(0, 2)}.${hh.slice(2)}` });
  }
  const e = await E.beregn(pool);
  let efra = 0;
  for (const p of e.spillere) {
    ud.push({ konkurrence: 'Efterårsferieudfordring', type: 'lodder', navn: p.firma || '', spiller: p.navn, email: p.email, score: p.bedste, lodder: p.lodder, lod_fra: efra, lod_til: efra + p.lodder - 1, note: (p.dage || []).join(' | ') });
    efra += p.lodder;
  }
  const { rows: kt } = await pool.query('SELECT tidspunkt, vinder_firma, lodder_i_alt, tilfaeldigt_tal FROM konkurrence_traekning ORDER BY id');
  for (const t of kt) ud.push({ konkurrence: 'Messe-turnering 8. okt.', type: 'trækning', navn: t.vinder_firma, spiller: '', email: '', score: '', lodder: t.lodder_i_alt, lod_fra: t.tilfaeldigt_tal, lod_til: '', note: `Trukket ${fmtTid(t.tidspunkt)}` });
  const { rows: et } = await pool.query("SELECT tidspunkt, type, vinder_navn, vinder_email, lodder_i_alt, tilfaeldigt_tal FROM efteraar_traekning ORDER BY id");
  for (const t of et) ud.push({ konkurrence: 'Efterårsferieudfordring', type: 'trækning', navn: '', spiller: t.vinder_navn, email: t.vinder_email, score: '', lodder: t.lodder_i_alt, lod_fra: t.tilfaeldigt_tal ?? '', lod_til: '', note: `Trukket ${fmtTid(t.tidspunkt)}` });
  return ud;
}

const KOLONNER = [
  ['Konkurrence', 'konkurrence'], ['Type', 'type'], ['Firma', 'navn'], ['Spiller', 'spiller'], ['E-mail', 'email'],
  ['Bedste score', 'score'], ['Lodder', 'lodder'], ['Lod fra', 'lod_fra'], ['Lod til', 'lod_til'], ['Note', 'note'],
].map(([title, k]) => ({ title, value: (r) => r[k] }));

function lodlisteRouter(pool) {
  const router = express.Router();
  const admin = requireAdmin(pool);

  router.get('/admin/lodliste.csv', admin, async (req, res, next) => {
    try {
      const raekker = await bygRaekker(pool);
      const csv = '\uFEFF' + toCsv(raekker, KOLONNER);
      const sha = crypto.createHash('sha256').update(csv).digest('hex');
      await pool.query('INSERT INTO lodliste_eksport (admin_session_id, sha256, antal_raekker, csv) VALUES ($1,$2,$3,$4)', [
        (req.adminSession && req.adminSession.id) || null, sha, raekker.length, csv,
      ]);
      const stempel = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' }).replace(/[: ]/g, '-').slice(0, 16);
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="packrush-lodliste-${stempel}.csv"`);
      res.set('X-Lodliste-SHA256', sha);
      res.set('Cache-Control', 'no-store');
      res.send(csv);
    } catch (e) { next(e); }
  });

  router.get('/admin/lodliste/eksporter', admin, async (req, res, next) => {
    try {
      const { rows } = await pool.query('SELECT id, tidspunkt, sha256, antal_raekker FROM lodliste_eksport ORDER BY id DESC LIMIT 50');
      res.set('Cache-Control', 'no-store');
      res.json({ eksporter: rows });
    } catch (e) { next(e); }
  });

  return router;
}

module.exports = { lodlisteRouter, bygRaekker };
