'use strict';

const { loadOffentligCfg } = require('../cfgLoad');

const express = require('express');
const { firmKey } = require('../rules/firmKey');
const { lifeState, setSubsPure, setTicksPure, todayStr, samtykkeTekstFor } = require('../rules/life');
const { SAMTYKKE_VERSION } = require('../partners');
const { randomPublicId, randomCode, hashPassword, verifyPassword } = require('../crypto');
const { issueToken } = require('../spillerToken');
const { clientIp } = require('../middleware/clientIp');
const { invalidateStateCache } = require('../publicState');

const MAKS_NAVN = 22;
const MAKS_FIRMA = 40;
const MAKS_KODE = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^[0-9]{4}$/;
// Spærring efter for mange forkerte pinkoder (pr. spiller, se 010_pinkode.sql).
const PIN_MAKS_FEJL = 5;
const PIN_SPAERRING_MS = 15 * 60 * 1000;

function normalizePhone(raw) {
  return String(raw || '').replace(/[^0-9]/g, '');
}

function last8(digits) {
  return digits.slice(-8);
}

async function getCfg(pool) {
  return loadOffentligCfg(pool);
}

async function generateUniqueVennekode(client) {
  for (let i = 0; i < 20; i++) {
    const code = randomCode(4);
    const { rows } = await client.query('SELECT 1 FROM spiller WHERE vennekode = $1', [code]);
    if (!rows.length) return code;
  }
  throw new Error('Kunne ikke generere unik vennekode.');
}

function playersRouter(pool, ws) {
  const router = express.Router();

  router.post('/players', async (req, res, next) => {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const navn = String(body.navn || '').trim();
    // Telefon indsamles ikke længere (vilkår pkt. 4). Feltet læses KUN for at
    // lade spillere oprettet før pinkoden logge ind som hidtil.
    const telefon = normalizePhone(String(body.telefon || '').trim());
    const pin = String(body.pin || '').trim();
    const firma = String(body.firma || '').trim();
    const vennekode = String(body.vennekode || '').trim().toUpperCase().slice(0, MAKS_KODE);
    const udfordringskode = String(body.udfordringskode || '').trim().toUpperCase().slice(0, MAKS_KODE);
    const tilmeldinger = Array.isArray(body.tilmeldinger) ? body.tilmeldinger.map(String) : [];

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ fejl: 'Ugyldig emailadresse.', kode: 'ugyldig_email' });
    }
    if (!PIN_RE.test(pin) && telefon.length < 8) {
      return res.status(400).json({ fejl: 'Pinkoden skal være 4 cifre.', kode: 'ugyldig_pin' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT * FROM spiller WHERE email = $1 FOR UPDATE', [email]);

      if (existing.rows.length) {
        // --- LOGIN ---
        const p = existing.rows[0];
        const nu = new Date();
        if (p.pin_spaerret_til && new Date(p.pin_spaerret_til).getTime() > nu.getTime()) {
          await client.query('ROLLBACK');
          return res.status(429).json({
            fejl: 'For mange forkerte pinkoder. Prøv igen om et kvarter, eller kom forbi standen.',
            kode: 'pin_spaerret',
          });
        }
        let godkendt;
        if (p.pin_hash) {
          godkendt = PIN_RE.test(pin) && verifyPassword(pin, p.pin_hash);
        } else {
          // Spiller oprettet før pinkoden: login med telefonnummeret som hidtil.
          godkendt = telefon.length >= 8 && !!p.telefon && last8(normalizePhone(p.telefon)) === last8(telefon);
        }
        if (!godkendt) {
          const fejl = (p.pin_fejl || 0) + 1;
          const spaerret = fejl >= PIN_MAKS_FEJL ? new Date(nu.getTime() + PIN_SPAERRING_MS) : null;
          await client.query('UPDATE spiller SET pin_fejl = $1, pin_spaerret_til = $2 WHERE id = $3', [
            spaerret ? 0 : fejl,
            spaerret,
            p.id,
          ]);
          await client.query('COMMIT');
          if (!p.pin_hash) {
            return res.status(400).json({
              fejl: 'Din profil er oprettet før pinkoderne. Kom forbi standen, så nulstiller vi den.',
              kode: 'mangler_pin',
            });
          }
          return res.status(400).json({
            fejl: 'Pinkoden passer ikke til denne e-mail.',
            kode: 'pin_matcher_ikke',
          });
        }
        if (p.pin_fejl || p.pin_spaerret_til) {
          await client.query('UPDATE spiller SET pin_fejl = 0, pin_spaerret_til = NULL WHERE id = $1', [p.id]);
        }

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
              dag: todayStr(new Date()),
            });
          }
        }

        // Opgave C: login OPRETTER en ny token-række — det OVERSKRIVER/
        // tilbagekalder IKKE spillerens øvrige tokens (flere samtidige
        // enheder er nu tilladt, fx telefon + standtablet). Se
        // src/spillerToken.js og API.md.
        const token = await issueToken(client, p.id);
        await client.query('UPDATE spiller SET ekstra_02 = $1 WHERE id = $2', [chFromUpdate, p.id]);
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
      // Packrush-opfølgning: firma er nu VALGFRIT (0–40 tegn) — se PATCH /me
      // for hvordan en spiller sætter/retter det bagefter, og API.md/
      // "Packrush-ændringer" for hvorfor spillere uden firma ikke tæller
      // med i firmakampen (companyKey er tom for dem, se src/publicState.js).
      if (firma.length > MAKS_FIRMA) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: `Firmanavn må højst være ${MAKS_FIRMA} tegn.`, kode: 'ugyldigt_firma' });
      }
      if (body.accepterer_betingelser !== true) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ fejl: 'Du skal acceptere betingelserne for at oprette en spiller.', kode: 'mangler_accept' });
      }

      if (!PIN_RE.test(pin)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ fejl: 'Vælg en pinkode på 4 cifre.', kode: 'ugyldig_pin' });
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
            dag: todayStr(new Date()),
          });
        }
      }

      const nyVennekode = await generateUniqueVennekode(client);
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
           public_id, email, navn, pin_hash, firma, firma_noegle, vennekode,
           ref_spiller_id, marketing, mail_to, notify,
           liv_dag, liv_n, liv_t, chl, badges, ekstra_01, ekstra_02, tick_dag, tick_keys
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'{}'::jsonb,'[]'::jsonb,$15,$16,$17,$18)
         RETURNING id, oprettet`,
        [
          publicId, email, navn, hashPassword(pin), firma, firmKey(firma), nyVennekode,
          refSpillerId, nyP.marketing, JSON.stringify(nyP.mailTo), nyP.notify,
          bag.day, bag.n, new Date(bag.t), JSON.stringify(bag.g), chFrom, nyP.tick.day, JSON.stringify(nyP.tick.keys),
        ]
      );
      const spillerId = ins.rows[0].id;
      // Opgave C: ny registrering OPRETTER (ligesom login) blot en ny
      // token-række — der er intet "gammelt" token at overskrive her, men
      // samme fælles funktion bruges for konsistens.
      const token = await issueToken(client, spillerId);

      const nowIso = new Date();
      for (const key of subResult.added) {
        const liste = key === 'sp' ? 'smartpack' : key === 'sms' ? 'sms' : 'partner:' + key.slice(2);
        const tekst = samtykkeTekstFor(cfg, key);
        await client.query(
          `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst, tekst_version, kilde, ip, user_agent, type)
           VALUES ($1,$2,$3,$4,$5,'registrering',$6,$7,'bekraeftet')`,
          [spillerId, liste, nowIso, tekst, tekst ? SAMTYKKE_VERSION : 1, clientIp(req), req.headers['user-agent'] || null]
        );
      }

      await client.query('COMMIT');
      invalidateStateCache();
      // Opgave E: state.changed broadcastes nu også ved ny registrering (en
      // ny spiller optræder i GET /state's players-liste) — ikke kun efter
      // et godkendt finish(). Login ændrer intet i state, så det broadcaster
      // ikke.
      if (ws && ws.broadcastStateChanged) ws.broadcastStateChanged();

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

module.exports = { playersRouter, normalizePhone, MAKS_NAVN, MAKS_FIRMA, PIN_RE };
