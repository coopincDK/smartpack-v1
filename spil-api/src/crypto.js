'use strict';

const crypto = require('crypto');
const { CODE_ABC } = require('./rules/constants');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input), 'utf8').digest('hex');
}

// 32-byte bearer-token til spillere (kun token_hash gemmes i DB).
function randomBearerToken() {
  return crypto.randomBytes(32).toString('hex');
}

function randomCode(len, alphabet) {
  alphabet = alphabet || CODE_ABC;
  const bytes = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function randomPublicId() {
  return crypto.randomBytes(9).toString('base64url');
}

// --- admin-adgangskode-hashing (scrypt, indbygget i Node, ingen ekstra afhængighed) ---
function hashPassword(plain) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(plain), salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function verifyPassword(plain, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  const actual = crypto.scryptSync(String(plain), salt, expected.length);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

module.exports = {
  sha256Hex,
  randomBearerToken,
  randomCode,
  randomPublicId,
  hashPassword,
  verifyPassword,
};
