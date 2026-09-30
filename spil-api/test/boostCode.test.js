'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashStr, boostCode } = require('../src/rules/boostCode');
const { CODE_ABC } = require('../src/rules/constants');

test('hashStr er deterministisk og giver et 32-bit unsigned tal', () => {
  const a = hashStr('liv:2026-09-30:8500');
  const b = hashStr('liv:2026-09-30:8500');
  assert.equal(a, b);
  assert.ok(a >= 0 && a <= 0xffffffff);
});

test('boostCode giver 4 tegn fra CODE_ABC og er stabil for samme input', () => {
  const kode = boostCode('2026-09-30', '8500');
  assert.equal(kode.length, 4);
  for (const ch of kode) assert.ok(CODE_ABC.includes(ch));
  assert.equal(kode, boostCode('2026-09-30', '8500'));
});

test('boostCode ændrer sig med dagen eller pin', () => {
  const a = boostCode('2026-09-30', '8500');
  const b = boostCode('2026-10-01', '8500');
  const c = boostCode('2026-09-30', '1234');
  assert.notEqual(a, b);
  assert.notEqual(a, c);
});
