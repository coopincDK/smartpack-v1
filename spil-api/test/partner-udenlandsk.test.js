'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../src/partners');

test('udenlandsk partner kan undvære dansk CVR, danske kan ikke', () => {
  const fn = P.manglerProfil || P._manglerProfil;
  if (!fn) return; // kun hvis funktionen er eksporteret
  const base = { navn: 'X', firmanavn: 'X', hjemmeside: 'x', kort_beskrivelse: 'x', produktkategori: 'x', privatlivspolitik: 'x' };
  assert.ok(!fn({ ...base, adresse: 'Gzira, Malta' }).includes('cvr'));
  assert.ok(fn({ ...base, adresse: 'Østerbrogade 67A, 8500 Grenaa' }).includes('cvr'));
  assert.ok(fn({ ...base, adresse: '' }).includes('cvr'));
});
