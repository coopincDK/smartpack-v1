'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { shortName } = require('../src/rules/nameDisplay');

test('shortName: to ord -> fornavn + efternavns-forbogstav', () => {
  assert.equal(shortName('Martin Rasmussen'), 'Martin R.');
  assert.equal(shortName('Anna Andersen'), 'Anna A.');
});

test('shortName: ét ord vises alene, uden punktum', () => {
  assert.equal(shortName('Cher'), 'Cher');
});

test('shortName: flere mellemnavne -> fornavn + SIDSTE ords forbogstav', () => {
  assert.equal(shortName('Anna Marie Andersen'), 'Anna A.');
});

test('shortName: håndterer ekstra/dobbelt mellemrum', () => {
  assert.equal(shortName('  Anna    Andersen  '), 'Anna A.');
});

test('shortName: tomt/manglende navn er defensivt (tom streng)', () => {
  assert.equal(shortName(''), '');
  assert.equal(shortName(null), '');
  assert.equal(shortName(undefined), '');
  assert.equal(shortName('   '), '');
});

test('shortName: bevarer specialtegn/danske bogstaver', () => {
  assert.equal(shortName('Åse Østergård'), 'Åse Ø.');
});

test('shortName: efternavn der starter med emoji eller småt bogstav giver et helt bogstav', () => {
  assert.equal(shortName('Niels 🦄Hansen'), 'Niels H.');
  assert.equal(shortName('Niels 🦄'), 'Niels');
  assert.equal(shortName('Niels østergaard'), 'Niels Ø.');
});
