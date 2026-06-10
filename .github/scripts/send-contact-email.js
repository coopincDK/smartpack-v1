'use strict';
const nodemailer = require('nodemailer');

const e = (key) => process.env[key] || '';

const transport = nodemailer.createTransport({
  host:   e('SMTP_HOST'),
  port:   parseInt(e('SMTP_PORT') || '587'),
  secure: e('SMTP_SECURE') === 'true',
  auth:   { user: e('SMTP_USER'), pass: e('SMTP_PASS') },
  requireTLS: true
});

const MAIL_FROM    = e('MAIL_FROM')    || 'noreply@smartpack.dk';
const MAIL_LEAD    = e('MAIL_LEAD')    || 'bundlinjeboost@smartpack.dk';
const MAIL_SUPPORT = e('MAIL_SUPPORT') || 'support@smartpack.dk';

const type     = e('INPUT_TYPE');
const name     = e('INPUT_NAME');
const company  = e('INPUT_COMPANY');
const email    = e('INPUT_EMAIL');

const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const row = (label, val) => val
  ? `<tr><td style="padding:.35rem .8rem;color:#94a3b8;font-size:.8rem;white-space:nowrap">${esc(label)}</td>` +
    `<td style="padding:.35rem .8rem;color:#f1f5f9;font-size:.875rem">${esc(val)}</td></tr>`
  : '';

const section = (title, rows) => rows.trim()
  ? `<tr><td colspan="2" style="padding:.75rem .8rem .2rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b">${title}</td></tr>${rows}`
  : '';

const urgencyLabel = (v) => ({
  '1':'Afsøger inspiration','2':'Overvejer seriøst','3':'Aktivt på udkig',
  '4':'Klar til at gå i gang','5':'Hellere i går end i dag'
})[v] || v;

function buildBody() {
  if (type === 'learn') {
    return [
      section('Lager og volumen',
        row('Ordrer pr. dag', e('INPUT_ORDERS')) +
        row('Medarbejdere',   e('INPUT_EMPLOYEES'))
      ),
      section('Systemer',
        row('Webshop platform', e('INPUT_SHOPS')) +
        row('ERP / regnskab',   e('INPUT_ERP'))
      ),
      section('Fragt DK',  row('Fragtpartner DK',  e('INPUT_CARRIERS_DK'))),
      section('Fragt INT', row('Fragtpartner INT', e('INPUT_CARRIERS_INT'))),
      section('Kontakt og timing',
        row('Hastegrad', urgencyLabel(e('INPUT_URGENCY'))) +
        row('Telefon',   e('INPUT_PHONE')) +
        row('CVR',       e('INPUT_CVR'))
      ),
      section('Kildeinfo',
        row('Hørt om SmartPack via', e('INPUT_SOURCE')) +
        row('Kommentar', e('INPUT_COMMENT'))
      )
    ].join('');
  }
  if (type === 'general' || type === 'support') {
    return row('Emne', e('INPUT_SUBJECT')) + row('Besked', e('INPUT_MESSAGE'));
  }
  return '';
}

const prefix = { learn: '[Lead]', general: '[Generel]', support: '[Support]' }[type] || '[Henvendelse]';
const subject = `${prefix} ${name} - ${company}`;
const to = type === 'learn' ? MAIL_LEAD : MAIL_SUPPORT;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:2rem">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:.75rem;border:1px solid #334155;max-width:580px;margin:0 auto">
    <tr><td style="padding:1.5rem;border-bottom:1px solid #334155">
      <div style="font-size:1.1rem;font-weight:700;color:#f1f5f9">${esc(subject.replace(prefix + ' ',''))}</div>
      <div style="font-size:.875rem;color:#94a3b8;margin-top:.2rem">Fra: <strong style="color:#f1f5f9">${esc(name)}</strong> &bull; ${esc(company)} &bull; ${esc(email)}</div>
    </td></tr>
    <tr><td style="padding:.5rem 0">
      <table width="100%" cellpadding="0" cellspacing="0">${buildBody()}</table>
    </td></tr>
    <tr><td style="padding:1rem 1.5rem;border-top:1px solid #334155">
      <div style="font-size:.75rem;color:#475569">Sendt via smartpack.dk &bull; Svar direkte pa denne mail</div>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

(async () => {
  try {
    await transport.sendMail({
      from:    `"SmartPack.dk" <${MAIL_FROM}>`,
      replyTo: `"${name}" <${email}>`,
      to,
      subject,
      html
    });
    console.log(`Sent: ${subject} -> ${to}`);
  } catch (err) {
    console.error('SMTP error:', err.message);
    process.exit(1);
  }
})();
