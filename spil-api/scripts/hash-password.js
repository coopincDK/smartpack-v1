#!/usr/bin/env node
'use strict';

// Udviklerværktøj: generér et ADMIN_PASSWORD_HASH til .env ud fra en
// klartekst-adgangskode. Kør: node scripts/hash-password.js "min-adgangskode"

const { hashPassword } = require('../src/crypto');

const plain = process.argv[2];
if (!plain) {
  console.error('Brug: node scripts/hash-password.js "din-adgangskode"');
  process.exit(1);
}

console.log(hashPassword(plain));
