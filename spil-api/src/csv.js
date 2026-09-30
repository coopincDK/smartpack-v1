'use strict';

function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n;]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function toCsv(rows, columns) {
  const header = columns.map((c) => csvEscape(c.title)).join(',');
  const lines = rows.map((row) => columns.map((c) => csvEscape(c.value(row))).join(','));
  return [header, ...lines].join('\r\n') + '\r\n';
}

module.exports = { csvEscape, toCsv };
