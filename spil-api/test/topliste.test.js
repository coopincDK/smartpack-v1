'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

test('topliste til bordskærmen: dagens bedste pr. spiller, maskerede navne, uden skjulte og VAR', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const opret = async (navn, email) => {
    const { body } = registrerSpiller(h.baseUrl, { navn, email });
    assert.equal((await api(h.baseUrl, 'POST', '/players', { body })).status, 201);
    return (await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email])).rows[0].id;
  };
  const a = await opret('Anna Andersen', 'a@x.dk');
  const b = await opret('Bo Bendtsen', 'b@x.dk');
  const c = await opret('Skjult Spiller', 'c@x.dk');
  const spil = (id, samlet, status = 'godkendt', tid = 'now()') => h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), ${tid}, ${tid}, $2, $3, ${tid})`, [id, samlet, status]);
  await spil(a, 5000); await spil(a, 7000); await spil(b, 6000); await spil(b, 23000, 'var'); await spil(c, 9000);
  await spil(b, 99999, 'godkendt', "now() - interval '3 days'");
  await h.pool.query('UPDATE spiller SET skjult = true WHERE id = $1', [c]);
  const r = await api(h.baseUrl, 'GET', '/topliste?limit=6');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.topliste.map((x) => x.point), [7000, 6000]);
  assert.ok(!JSON.stringify(r.body).includes('Andersen'), 'efternavn maskeret');
  assert.ok(!JSON.stringify(r.body).includes('@'), 'ingen mails');
});
