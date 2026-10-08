'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api } = require('./helpers/appHarness');
const { testkontoGrund } = require('../src/routes/admin');

test('testkontoGrund: genkender åbenlyse tests og lader rigtige spillere være', () => {
  assert.ok(testkontoGrund({ navn: 'Wollapyk', email: 'x@firma.dk' }));
  assert.ok(testkontoGrund({ navn: 'Anna', email: 'vullepyg@firma.dk' }));
  assert.ok(testkontoGrund({ navn: 'Anna', email: 'anna@example.com' }));
  assert.ok(testkontoGrund({ navn: 'Anna', email: 'test2@firma.dk' }));
  assert.ok(testkontoGrund({ navn: 'Test Testesen', email: 'tt@firma.dk' }));
  assert.equal(testkontoGrund({ navn: 'Anna Testrup', email: 'anna.testrup@firma.dk' }), null);
  assert.equal(testkontoGrund({ navn: 'Bo Hansen', email: 'bo@contest.dk' }), null);
  assert.equal(testkontoGrund({ navn: 'Martin', email: 'mrm@smartpack.dk' }), null);
});

test('GET /admin/testkonti: kun admin, kun synlige konti, ændrer intet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const mk = async (navn, email, skjult) => {
    const u = crypto.randomUUID().slice(0, 8);
    await h.pool.query(
      `INSERT INTO spiller (public_id, email, navn, firma, firma_noegle, skjult) VALUES ($1,$2,$3,'Firma','firma',$4)`,
      ['tk-' + u, email, navn, !!skjult]
    );
    return 'tk-' + u;
  };
  const test1 = await mk('Wollapyk', 'w' + Date.now() + '@firma.dk');
  await mk('Rigtig Person', 'rp' + Date.now() + '@firma.dk');
  await mk('Wollapyk Skjult', 'ws' + Date.now() + '@firma.dk', true);

  assert.equal((await api(h.baseUrl, 'GET', '/admin/testkonti')).status, 401);
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = login.headers.get('set-cookie').split(';')[0];
  const r = await api(h.baseUrl, 'GET', '/admin/testkonti', { adminCookie: ac });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.konti.map((k) => k.public_id), [test1]);
  const { rows } = await h.pool.query('SELECT skjult FROM spiller WHERE public_id = $1', [test1]);
  assert.equal(rows[0].skjult, false);
});
