'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateRoundScores,
  validateSpilletid,
  validateStatsKonsistens,
  evaluateBadges,
  ROUND_MAX,
  MIN_SPILLETID_MS,
} = require('../src/rules/scoring');

test('validateRoundScores godkender gyldige, generøse scorer', () => {
  assert.equal(validateRoundScores([100, 200, 300]).ok, true);
  assert.equal(validateRoundScores([0, 0, 0]).ok, true);
});

test('validateRoundScores afviser urealistiske scorer', () => {
  const r = validateRoundScores([ROUND_MAX[1] + 1, 0, 0]);
  assert.equal(r.ok, false);
  assert.equal(r.kode, 'urealistisk_score');
});

test('validateRoundScores afviser forkert antal runder / ugyldige tal', () => {
  assert.equal(validateRoundScores([1, 2]).ok, false);
  assert.equal(validateRoundScores([1, 2, 'x']).ok, false);
  assert.equal(validateRoundScores([1, -2, 3]).ok, false);
});

test('validateSpilletid kræver et realistisk minimum og server/klient-enighed', () => {
  assert.equal(validateSpilletid(MIN_SPILLETID_MS + 1000, MIN_SPILLETID_MS + 1000).ok, true);
  assert.equal(validateSpilletid(5000, 5000).ok, false); // for kort
  assert.equal(validateSpilletid(MIN_SPILLETID_MS + 1000, 1000).ok, false); // mismatch
});

test('validateStatsKonsistens fanger interne modsigelser', () => {
  assert.equal(validateStatsKonsistens({ packed: 5, tower: 3 }).ok, true);
  assert.equal(validateStatsKonsistens({ packed: 2, tower: 5 }).ok, false);
  assert.equal(validateStatsKonsistens({ fast: 1.5, orders: 0 }).ok, false);
});

test('evaluateBadges giver kun NYE mærker spilleren ikke allerede har', () => {
  const a = { samlet: 500, bf: true, s: { orders: 6, errors: 0, fast: 1.5 } };
  const c = { rank: 1, others: 3, days: 4 };
  const nye = evaluateBadges(a, c, ['fejlfri']);
  assert.ok(nye.includes('lyn'));
  assert.ok(nye.includes('bf'));
  assert.ok(nye.includes('podie'));
  assert.ok(nye.includes('boss'));
  assert.ok(nye.includes('stamkunde'));
  assert.ok(!nye.includes('fejlfri')); // allerede haft
});
