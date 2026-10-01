'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { hashPassword } = require('../src/crypto');
const { fase } = require('../src/konkurrence');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api } = require('./helpers/appHarness');

const DAG = 24 * 3600 * 1000;
let seq = 0;

async function adminCookie(h) {
  const r = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  assert.equal(r.status, 200);
  return r.headers.get('set-cookie').split(';')[0];
}

async function mkSpiller(pool, navn) {
  seq++;
  const unik = 'k' + seq + '-' + crypto.randomUUID().slice(0, 8);
  const { rows } = await pool.query(
    `INSERT INTO spiller (public_id, email, navn, telefon, firma, firma_noegle)
     VALUES ($1,$2,$3,$4,'Webshop ApS','webshop aps') RETURNING id`,
    [unik, unik + '@example.dk', navn, '2000' + String(seq).padStart(4, '0')]
  );
  return rows[0].id;
}

async function mkForsoeg(pool, spillerId, tid, point) {
  await pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, status, oprettet, samlet) VALUES ($1,$2,$3,'godkendt',$3,$4)`,
    [spillerId, crypto.randomUUID(), tid, point]
  );
}

test('fase følger datoerne: ingen, kommende, aktiv, afsluttet', () => {
  const nu = Date.parse('2026-10-01T12:00:00Z');
  assert.equal(fase({ lodtraekning: null }, nu), 'ingen');
  assert.equal(fase({ start: '2026-10-05T08:00:00Z', lodtraekning: '2026-10-06T16:00:00Z' }, nu), 'kommende');
  assert.equal(fase({ start: '2026-09-30T08:00:00Z', lodtraekning: '2026-10-06T16:00:00Z' }, nu), 'aktiv');
  assert.equal(fase({ start: null, lodtraekning: '2026-10-06T16:00:00Z' }, nu), 'aktiv');
  assert.equal(fase({ start: '2026-09-20T08:00:00Z', lodtraekning: '2026-09-21T16:00:00Z' }, nu), 'afsluttet');
});

test('konkurrencen med start: fase i /praemier og /state, og start skal ligge før lodtrækningen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const start = new Date(Date.now() + 2 * DAG).toISOString();
  const slut = new Date(Date.now() + 3 * DAG).toISOString();
  const gem = await api(h.baseUrl, 'PUT', '/admin/konkurrence', {
    adminCookie: ac,
    body: { navn: 'E-handelskonferencen', start, lodtraekning: slut, tekst_aktiv: 'a', tekst_slut: 'b' },
  });
  assert.equal(gem.status, 200);
  assert.equal(gem.body.visning.fase, 'kommende');
  assert.equal(gem.body.visning.aktiv, false);

  const pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.konkurrence.fase, 'kommende');
  assert.equal(pr.body.konkurrence.start, start);

  const st = await api(h.baseUrl, 'GET', '/state');
  assert.equal(st.status, 200);
  assert.equal(st.body.konkurrence.navn, 'E-handelskonferencen');
  assert.equal(st.body.konkurrence.start, start);
  assert.equal(st.body.konkurrence.lodtraekning, slut);

  const forkert = await api(h.baseUrl, 'PUT', '/admin/konkurrence', {
    adminCookie: ac,
    body: { navn: 'x', start: slut, lodtraekning: start },
  });
  assert.equal(forkert.status, 400);
  const udenSlut = await api(h.baseUrl, 'PUT', '/admin/konkurrence', { adminCookie: ac, body: { navn: 'x', start } });
  assert.equal(udenSlut.status, 400);
});

test('lodtrækning: hvert point i konkurrencen er ét lod og lægges sammen, vinder skal godkendes, afvist kan ikke trækkes igen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const start = new Date(Date.now() - 3 * DAG);
  const slut = new Date(Date.now() - 1000);
  await api(h.baseUrl, 'PUT', '/admin/konkurrence', {
    adminCookie: ac,
    body: { navn: 'Messen', start: start.toISOString(), lodtraekning: slut.toISOString() },
  });

  // Vrøvl har spillet i konkurrencen; Før har kun spillet før den startede.
  const vroevl = await mkSpiller(h.pool, 'Asdf Qwerty');
  const foer = await mkSpiller(h.pool, 'Før Starten');
  const mette = await mkSpiller(h.pool, 'Mette Hansen');
  await mkForsoeg(h.pool, vroevl, new Date(start.getTime() + 3600 * 1000), 300);
  await mkForsoeg(h.pool, foer, new Date(start.getTime() - 2 * DAG), 5000);
  await mkForsoeg(h.pool, mette, new Date(start.getTime() + DAG), 150);
  await mkForsoeg(h.pool, mette, new Date(start.getTime() + DAG + 3600 * 1000), 50);
  // Spil efter lodtrækningen tæller ikke.
  await mkForsoeg(h.pool, mette, new Date(Date.now()), 9000);

  // Træk, til vrøvlenavnet kommer ud (300 mod Mettes 150 + 50 lodder). Trækninger, der
  // venter på godkendelse, udelukker ikke nogen.
  let d;
  for (let i = 0; i < 50; i++) {
    d = await api(h.baseUrl, 'POST', '/admin/lodtraekning', { adminCookie: ac, body: {} });
    assert.equal(d.status, 200);
    assert.notEqual(d.body.vinder.navn, 'Før Starten');
    assert.equal(d.body.status, 'afventer');
    assert.equal(d.body.tickets_total, 500);
    assert.equal(d.body.vinder.tickets, d.body.vinder.navn === 'Asdf Qwerty' ? 300 : 200);
    if (d.body.vinder.navn === 'Asdf Qwerty') break;
  }
  assert.equal(d.body.vinder.navn, 'Asdf Qwerty');

  // Ikke godkendt endnu: intet på præmiesiden.
  let pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.konkurrence.vinder, null);

  const afvis = await api(h.baseUrl, 'POST', `/admin/lodtraekning/${d.body.traekning_id}/afvis`, { adminCookie: ac });
  assert.equal(afvis.status, 200);
  const igen = await api(h.baseUrl, 'POST', `/admin/lodtraekning/${d.body.traekning_id}/godkend`, { adminCookie: ac });
  assert.equal(igen.status, 409);

  // Nu kan kun Mette trækkes.
  for (let i = 0; i < 5; i++) {
    const n = await api(h.baseUrl, 'POST', '/admin/lodtraekning', { adminCookie: ac, body: {} });
    assert.equal(n.body.vinder.navn, 'Mette Hansen');
    assert.equal(n.body.tickets_total, 200);
    d = n;
  }
  const ok = await api(h.baseUrl, 'POST', `/admin/lodtraekning/${d.body.traekning_id}/godkend`, { adminCookie: ac });
  assert.equal(ok.status, 200);
  pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.konkurrence.fase, 'afsluttet');
  assert.equal(pr.body.konkurrence.vinder.navn, 'Mette H.');
  assert.equal(pr.body.konkurrence.vinder.firma, 'Webshop ApS');

  const udenAdgang = await api(h.baseUrl, 'POST', `/admin/lodtraekning/${d.body.traekning_id}/godkend`);
  assert.equal(udenAdgang.status, 401);
});
