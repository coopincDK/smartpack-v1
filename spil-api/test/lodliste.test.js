'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');
const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { matchNoegle } = require('../src/konkurrence');

test('samlet lodliste som CSV: messe-lodder, efterårslodder og låst kopi', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await h.pool.query("UPDATE konkurrence SET spil_start = '2026-10-08T08:00:00+02:00', spil_slut = '2026-10-08T16:30:00+02:00' WHERE id = 1");
  await h.pool.query("INSERT INTO deltagerliste_firma (firma, firma_noegle, kilde) VALUES ('Messe Shop ApS', $1, 'test')", [matchNoegle('Messe Shop')]);
  const opret = async (email, firma) => {
    const { body } = registrerSpiller(h.baseUrl, { email, firma });
    assert.equal((await api(h.baseUrl, 'POST', '/players', { body })).status, 201);
    return (await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email])).rows[0].id;
  };
  const a = await opret('a@messe.dk', 'Messe Shop');
  const b = await opret('b@ude.dk', 'Ude ApS');
  const spil = (id, samlet, tid) => h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), $2::timestamptz - interval '2 minutes', $2, $3, 'godkendt', $2)`, [id, tid, samlet]);
  await spil(a, 2986, '2026-10-08T10:00:00+02:00');
  await spil(b, 5000, '2026-10-08T11:00:00+02:00');
  await spil(b, 800, '2026-10-09T11:00:00+02:00');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const r = await fetch(h.baseUrl + '/admin/lodliste.csv', { headers: { cookie: ac } });
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-disposition'), /packrush-lodliste-.*\.csv/);
  const csv = await r.text();
  assert.match(csv, /^\uFEFF?Konkurrence,Type,Firma/);
  assert.match(csv, /Messe-turnering 8\. okt\.,lodder,Messe Shop,[^,]*,a@messe\.dk,2986,6,0,5,/);
  assert.match(csv, /Ude ApS.*,0,,,"Ikke på deltagerlisten/);
  assert.match(csv, /Efterårsferieudfordring,lodder,Ude ApS/);
  const eks = (await h.pool.query('SELECT sha256, antal_raekker FROM lodliste_eksport')).rows;
  assert.equal(eks.length, 1);
  assert.equal(eks[0].sha256, r.headers.get('x-lodliste-sha256'));
  const uden = await fetch(h.baseUrl + '/admin/lodliste.csv');
  assert.equal(uden.status, 401);
});
