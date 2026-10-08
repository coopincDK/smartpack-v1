'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api } = require('./helpers/appHarness');

let seq = 0;
async function mkSpiller(pool, skjult) {
  seq++;
  const u = 'mo' + seq + '-' + crypto.randomUUID().slice(0, 8);
  const { rows } = await pool.query(
    `INSERT INTO spiller (public_id, email, navn, telefon, firma, firma_noegle, skjult)
     VALUES ($1,$2,'Test Testesen',$3,'Firma','firma',$4) RETURNING id`,
    [u, u + '@example.dk', '3000' + String(seq).padStart(4, '0'), !!skjult]
  );
  return rows[0].id;
}
async function mkSamtykke(pool, id, liste, type, tid) {
  await pool.query('INSERT INTO samtykke (spiller_id, liste, tidspunkt, type) VALUES ($1,$2,$3,$4)', [id, liste, tid || new Date(), type]);
}

test('mail-oversigt: samlet antal, SmartPack-nyheder og aktive samtykker pr. partner', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = login.headers.get('set-cookie').split(';')[0];

  const uden = await api(h.baseUrl, 'GET', '/admin/mail-oversigt');
  assert.equal(uden.status, 401);

  const p = await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Mailpartner' } });
  const slug = p.body.partner.slug;
  const a = await mkSpiller(h.pool), b = await mkSpiller(h.pool), c = await mkSpiller(h.pool), skjult = await mkSpiller(h.pool, true);
  const foer = new Date(Date.now() - 60000);
  await mkSamtykke(h.pool, a, 'partner:' + slug, 'bekraeftet');
  await mkSamtykke(h.pool, a, 'smartpack', 'bekraeftet');
  await mkSamtykke(h.pool, b, 'partner:' + slug, 'bekraeftet', foer);
  await mkSamtykke(h.pool, b, 'partner:' + slug, 'trukket_tilbage'); // afmeldt igen
  await mkSamtykke(h.pool, c, 'smartpack', 'bekraeftet');
  await mkSamtykke(h.pool, skjult, 'partner:' + slug, 'bekraeftet'); // skjulte spillere tæller ikke

  const r = await api(h.baseUrl, 'GET', '/admin/mail-oversigt', { adminCookie: ac });
  assert.equal(r.status, 200);
  assert.equal(r.body.spillere, 3);
  assert.equal(r.body.smartpack, 2);
  assert.equal(r.body.mindst_en_partner, 1);
  const mp = r.body.partnere.find((x) => x.slug === slug);
  assert.equal(mp.antal, 1);
});
