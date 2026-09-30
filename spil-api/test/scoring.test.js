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
  MAX_AKTIV_SPILLETID_MS,
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

test('validateSpilletid kræver et realistisk minimum for klientens AKTIVE spilletid', () => {
  assert.equal(validateSpilletid(MIN_SPILLETID_MS + 1000, MIN_SPILLETID_MS + 1000).ok, true);
  const forKort = validateSpilletid(5000, 5000);
  assert.equal(forKort.ok, false);
  assert.equal(forKort.kode, 'for_kort_spilletid');
});

test('validateSpilletid (opfølgning, opgave A): server_elapsed kan være vilkårligt meget LÆNGERE end klientMs (offline-kø) uden afvisning', () => {
  const enDagServerside = 24 * 3600 * 1000;
  const res = validateSpilletid(enDagServerside, MIN_SPILLETID_MS + 1000);
  assert.equal(res.ok, true, 'et forsøg synket længe efter det blev startet skal stadig kunne godkendes');
});

test('validateSpilletid (opfølgning, opgave A): tid_mismatch KUN når klienten påstår MERE aktiv tid end der er gået', () => {
  // Klienten hævder 10 sek. mere aktiv tid end der reelt er gået (ud over
  // 5 sek. clock-skew-tolerance) -> afvist.
  const forMeget = validateSpilletid(MIN_SPILLETID_MS, MIN_SPILLETID_MS + 10000);
  assert.equal(forMeget.ok, false);
  assert.equal(forMeget.kode, 'tid_mismatch');

  // Inden for 5 sek. clock-skew -> godkendt.
  const indenforSkew = validateSpilletid(MIN_SPILLETID_MS, MIN_SPILLETID_MS + 4000);
  assert.equal(indenforSkew.ok, true);
});

test('validateSpilletid (opfølgning, opgave A): MAX_AKTIV afviser urealistisk høj påstået aktiv spilletid', () => {
  const forLangt = validateSpilletid(MAX_AKTIV_SPILLETID_MS + 10000, MAX_AKTIV_SPILLETID_MS + 1000);
  assert.equal(forLangt.ok, false);
  assert.equal(forLangt.kode, 'for_lang_spilletid');
});

test('validateSpilletid (opfølgning, opgave A): MIN/MAX er config-drevne (kan overstyres uden redeploy)', () => {
  const cfg = { minAktivSpilletidMs: 10000, maxAktivSpilletidMs: 20000 };
  assert.equal(validateSpilletid(15000, 15000, cfg).ok, true);
  const forKortMedCfg = validateSpilletid(5000, 5000, cfg);
  assert.equal(forKortMedCfg.ok, false);
  assert.equal(forKortMedCfg.kode, 'for_kort_spilletid');
  const forLangtMedCfg = validateSpilletid(25000, 25000, cfg);
  assert.equal(forLangtMedCfg.ok, false);
  assert.equal(forLangtMedCfg.kode, 'for_lang_spilletid');
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
