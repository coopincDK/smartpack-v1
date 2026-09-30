'use strict';

// Eksakt port af firmKey(s) fra spil/index.html.
function firmKey(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/\.(dk|com|se|no|de|eu|nu|shop|net|org|io)$/, '')
    .replace(/\b(aps|a\/s|ivs|i\/s)\b/g, '')
    .replace(/[^a-z0-9æøå]+/g, '');
}

module.exports = { firmKey };
