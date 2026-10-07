'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { lifeState, nextRegenMs, regenFor, useLife } = require('../src/rules/life');

const cfg = { perDay: 1, mailPartners: 'a,b,c', partnerLister: [], smsOn: false };
const nu = new Date('2026-10-08T10:00:00+02:00');
const dag = '2026-10-08';
const spiller = (keys) => ({ tick: { day: dag, keys } });

test('turbo-liv: med 3 af dagens flueben kommer der 3 liv i timen (op til 3)', () => {
  const p = spiller(['sp', 'm:a', 'm:b']);
  assert.equal(regenFor(p, cfg, nu).turbo, true);
  const bag = { day: dag, n: 0, t: new Date(nu.getTime() - 60 * 60000), g: [] };
  const ud = lifeState(bag, p, cfg, nu, 0);
  assert.equal(ud.n, 3, 'tre liv efter en time');
  const efter20 = lifeState({ day: dag, n: 0, t: new Date(nu.getTime() - 20 * 60000), g: [] }, p, cfg, nu, 0);
  assert.equal(efter20.n, 1, 'ét liv efter 20 min');
  assert.ok(nextRegenMs({ day: dag, n: 0, t: nu }, p, cfg, nu) <= 20 * 60000);
});

test('turbo-liv: med færre end 3 flueben er det stadig ét liv i timen (op til 1)', () => {
  const p = spiller(['sp', 'm:a']);
  assert.equal(regenFor(p, cfg, nu).turbo, false);
  const ud = lifeState({ day: dag, n: 0, t: new Date(nu.getTime() - 3 * 60 * 60000), g: [] }, p, cfg, nu, 0);
  assert.equal(ud.n, 1);
  const brugt = useLife({ day: dag, n: 1, t: nu }, cfg, p, nu);
  assert.equal(brugt.n, 0);
});
