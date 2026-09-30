'use strict';

const express = require('express');
const { firmKey } = require('../rules/firmKey');
const { lifeState, setSubsPure, setTicksPure } = require('../rules/life');
const { randomPublicId, randomBearerToken, randomCode, sha256Hex } = require('../crypto');
const { clientIp } = require('../middleware/clientIp');
const { invalidateStateCache } = require('../publicState');

const MAKS_NAVN = 22;
const MAKS_FIRMA = 40;
const MAKS_KODE = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(raw) {
  return String(raw || '').replace(/[^0-9]/g, '');
}

function last8(digits) {
  return digits.slice(-8);
}

async function getCfg(pool) {
  const { rows } = await pool.query('SELECT offentlig FROM config WHERE id = 1');
  return (rows[0] && rows[0].offentlig) || {};
}

async function generateUniqueVennekode(client) {
  for (let i = 0; i < 20; i++) {
    const code = randomCode(4);
    const { rows } = await client.query('SELECT 1 FROM spiller WHERE vennekode = $1', [code]);
    if (!rows.length) return code;
  }
  throw new Error('Kunne ikke generere unik vennekode.');
}

function playersRouter(pool) {
  const router = express.Router();

  router.post('/players', async (req, res, next) => {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const navn = String(body.navn || '').trim();
    const telefonRaw = String(body.telefon || '').trim();
    const firma = String(body.firma || '').trim();
    const telefon = normalizePhone(telefonRaw);
    const vennekode = String(body.vennekode || '').trim().toUpperCase().slice(0, MAKS_KODE);
    const udfordringskode = String(body.udfordringskode || '').trim().toUpperCase().slice(0, MAKS_KODE);
    const tilmeldinger = Array.isArray(body.tilmeldinger) ? body.tilmeldinger.map(String) : [];

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ fejl: 'Ugyldig emailadresse.', kode: 'ugyldig_email' });
    }
    if (telefon.length < 8) {
      return res.status(400).json({ fejl: 'Ugyldigt telefonnummer.', kode: 'ugyldigt_telefon' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT * FROM spiller WHERE email = $1 FOR UPDATE', [email]);

      if (existing.rows.length) {
        // --- LOGIN ---
        const p = existing.rows[0];
        if (last8(normalizePhone(p.telefon)) !== last8(telefon)) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            fejl: 'Telefonnummeret matcher ikke vores oplysninger for denne email.',
            kode: 'telefon_matcher_ikke',
          });
        }

        const token = randomBearerToken();
        const tokenHash = sha256Hex(token);
        let chFromUpdate = p.ekstra_02;
        if (udfordringskode) {
          const cfg = await getCfg(pool);
          const chal = await client.query(
            'SELECT id, navn FROM spiller WHERE vennekode = $1 AND id != $2',
            [udfordringskode, p.id]
          );
          if (chal.rows.length) {
            chFromUpdate = JSON.stringify({
              kode: udfordringskode,
              fra_spiller_id: chal.rows[0].id,
              fra_navn: chal.rows[0].navn,
              dag: new Date().toISOString().slice(0, 10),
            });
          }
        }

        await client.query(
          'UPDATE spiller SET token_hash = $1, ekstra_02 = $2 WHERE id = $3',
          [tokenHash, chFromUpdate, p.id]
        );
        await client.query('COMMIT');

        return res.json({
          token,
          type: 'login',
          spiller: { pid: p.public_id, navn: p.navn, firma: p.firma, vennekode: p.vennekode },
        });
      }

      // --- REGISTRERING ---
      if (!navn || navn.length > MAKS_NAVN) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: `Navn skal være mellem 1 og ${MAKS_NAVN} tegn.`, kode: 'ugyldigt_navn' });
      }
      if (!firma || firma.length > MAKS_FIRMA) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: `Firmanavn skal være mellem 1 og ${MAKS_FIRMA} tegn.`, kode: 'ugyldigt_firma' });
      }
      if (body.accepterer_betingelser !== true) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: 'Du skal acceptere betingelserne for at oprette en spiller.', kode: 'mangler_accept' });
      }

      const telefonKonflikt = await client.query('SELECT 1 FROM spiller WHERE telefon = $1', [telefon]);
      if (telefonKonflikt.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          fejl: 'Der findes allerede en spiller med dette telefonnummer.',
          kode: 'telefon_optaget',
        });
      }

      const cfg = await getCfg(pool);

      let refSpillerId = null;
      if (vennekode) {
        const ref = await client.query('SELECT id FROM spiller WHERE vennekode = $1', [vennekode]);
        if (ref.rows.length) refSpillerId = ref.rows[0].id;
      }

      let chFrom = null;
      if (udfordringskode && udfordringskode !== vennekode) {
        const chal = await client.query('SELECT id, navn FROM spiller WHERE vennekode = $1', [udfordringskode]);
        if (chal.rows.length) {
          chFrom = JSON.stringify({
            kode: udfordringskode,
            fra_spiller_id: chal.rows[0].id,
            fra_navn: chal.rows[0].navn,
            dag: new Date().toISOString().slice(0, 10),
          });
        }
      }

      const nyVennekode = await generateUniqueVennekode(client);
      const token = randomBearerToken();
      const tokenHash = sha256Hex(token);
      const publicId = randomPublicId();
      const now = new Date();

      // Initialisér dagens liv (ingen tilmeldinger/flueben endnu -> 0 bonus).
      const tomSpiller = { marketing: false, mailTo: [], notify: false, tick: null };
      const initialBag = lifeState({ day: null, n: 0, t: null, g: [] }, tomSpiller, cfg, now, 0);

      // De valgte tilmeldinger ved oprettelse tæller BÅDE som en varig
      // bekræftelse (setSubsPure — logges i samtykke nedenfor) OG som dagens
      // flueben (setTicksPure — giver friske liv med det samme). Se API.md,
      // "Packrush-ændringer", for hvorfor: uden dette ville en nyoprettet
      // spiller der vælger sms/partner-tilmeldinger ved oprettelse ikke få
      // deres bonusliv før de selv rammer PUT /me/ticks.
      const subResult = setSubsPure(tomSpiller, tilmeldinger, cfg, now);
      const tickResult = setTicksPure(subResult.p, tilmeldinger, cfg, initialBag, now);
      const nyP = tickResult.p;
      const bag = tickResult.bag;

      const ins = await client.query(
        `INSERT INTO spiller (
           public_id, email, navn, telefon, firma, firma_noegle, vennekode,
           ref_spiller_id, token_hash, marketing, mail_to, notify,
           liv_dag, liv_n, liv_t, chl, badges, ekstra_01, ekstra_02, tick_dag, tick_keys
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'{}'::jsonb,'[]'::jsonb,$16,$17,$18,$19)
         RETURNING id, oprettet`,
        [
          publicId, email, navn, telefon, firma, firmKey(firma), nyVennekode,
          refSpillerId, tokenHash, nyP.marketing, JSON.stringify(nyP.mailTo), nyP.notify,
          bag.day, bag.n, new Date(bag.t), JSON.stringify(bag.g), chFrom, nyP.tick.day, JSON.stringify(nyP.tick.keys),
        ]
      );
      const spillerId = ins.rows[0].id;

      const nowIso = new Date();
      for (const key of subResult.added) {
        const liste = key === 'sp' ? 'smartpack' : key === 'sms' ? 'sms' : 'partner:' + key.slice(2);
        await client.query(
          `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst_version, kilde, ip, user_agent, type)
           VALUES ($1,$2,$3,1,'registrering',$4,$5,'bekraeftet')`,
          [spillerId, liste, nowIso, clientIp(req), req.headers['user-agent'] || null]
        );
      }

      await client.query('COMMIT');
      invalidateStateCache();

      return res.status(201).json({
        token,
        type: 'ny',
        spiller: { pid: publicId, navn, firma, vennekode: nyVennekode },
      });
    } catch (e) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  });

  return router;
}

module.exports = { playersRouter, normalizePhone, MAKS_NAVN, MAKS_FIRMA };
