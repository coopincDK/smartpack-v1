'use strict';
const express    = require('express');
const nodemailer = require('nodemailer');
const app        = express();

app.use(express.json({ limit: '64kb' }));

/* ─── SMTP transport ──────────────────────────────────────────── */
const transport = nodemailer.createTransport({
  host:   'smtp.heysender.com',
  port:   587,
  secure: false,
  auth:   { user: 'noreply@smartpack.dk', pass: process.env.SMTP_PASS },
  requireTLS: true
});

/* ─── Helpers ──────────────────────────────────────────────────── */
const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const row = (label, val) => val
  ? `<tr><td style="padding:.4rem .8rem;color:#94a3b8;font-size:.8125rem;white-space:nowrap">${esc(label)}</td><td style="padding:.4rem .8rem;color:#f1f5f9;font-size:.875rem">${esc(val)}</td></tr>`
  : '';

const section = (title, rows) => rows.trim()
  ? `<tr><td colspan="2" style="padding:.75rem .8rem .25rem;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b">${title}</td></tr>${rows}`
  : '';

const urgencyLabel = (v) => ({
  '1':'Afsøger inspiration','2':'Overvejer seriøst','3':'Aktivt på udkig','4':'Klar til at gå i gang','5':'Hellere i går end i dag'
})[String(v)] || v;

function buildHtml(data) {
  const { type, name, company, email } = data;
  let body = '';

  if (type === 'learn') {
    const shops  = [].concat(data.shops  || []).filter(v => v !== 'andet').join(', ') + (data.shop_andet  ? ` (${data.shop_andet})` : '');
    const erp    = [].concat(data.erp    || []).filter(v => v !== 'andet').join(', ') + (data.erp_andet   ? ` (${data.erp_andet})`  : '');
    const cdn_dk = [].concat(data.carriers_dk || []).filter(v => v !== 'andet').join(', ') + (data.carriers_dk_andet ? ` (${data.carriers_dk_andet})` : '');
    const source = data.source + (data.source_andet ? ` (${data.source_andet})` : '');

    body = [
      section('Lager & volumen',
        row('Ordrer pr. dag', data.orders) +
        row('Medarbejdere',   data.employees)
      ),
      section('Systemer',
        row('Webshop platform', shops  || 'Ikke angivet') +
        row('ERP / regnskab',   erp    || '')
      ),
      section('Fragt',
        row('Fragtpartner DK', cdn_dk || '')
      ),
      section('Kontakt & timing',
        row('Hastegrad',   urgencyLabel(data.urgency)) +
        row('Telefon',     data.phone) +
        row('CVR',         data.cvr)
      ),
      section('Kildeinfo',
        row('Hort om SmartPack via', source || '') +
        row('Kommentar', data.comment)
      )
    ].join('');

  } else if (type === 'general') {
    body = row('Emne', data.subject) + row('Besked', data.message);
  } else if (type === 'support') {
    body = row('Emne', data.subject) + row('Beskrivelse', data.message);
  }

  const typeLabels = { learn: 'Forespørgsel: Hør mere om SmartPack', general: 'Generel henvendelse', support: 'Support-sag' };
  const title = typeLabels[type] || 'Henvendelse';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:2rem">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:.75rem;border:1px solid #334155;max-width:580px;margin:0 auto">
    <tr><td style="padding:1.5rem;border-bottom:1px solid #334155">
      <div style="font-size:1.125rem;font-weight:700;color:#f1f5f9">${esc(title)}</div>
      <div style="font-size:.875rem;color:#94a3b8;margin-top:.25rem">Fra: <strong style="color:#f1f5f9">${esc(name)}</strong> &bull; ${esc(company)}</div>
    </td></tr>
    <tr><td style="padding:.5rem 0">
      <table width="100%" cellpadding="0" cellspacing="0">${body}</table>
    </td></tr>
    <tr><td style="padding:1rem 1.5rem;border-top:1px solid #334155">
      <div style="font-size:.75rem;color:#475569">Sendt via smartpack.dk/kontakt &bull; Svar direkte pa denne mail for at nabryde kunden</div>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

function buildSubject(data) {
  const prefix = { learn: '[Lead]', general: '[Generel]', support: '[Support]' }[data.type] || '[Henvendelse]';
  return `${prefix} ${data.name} - ${data.company}`;
}

/* ─── Route ────────────────────────────────────────────────────────── */
app.post('/api/contact', async (req, res) => {
  const { type, name, company, email } = req.body || {};

  if (!type || !name || !company || !email) {
    return res.status(400).json({ ok: false, error: 'Manglende felter' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Ugyldig email' });
  }

  const to = type === 'learn' ? 'bundlinjeboost@smartpack.dk' : 'support@smartpack.dk';

  try {
    await transport.sendMail({
      from:    '"SmartPack.dk" <noreply@smartpack.dk>',
      replyTo: `"${name}" <${email}>`,
      to,
      subject: buildSubject(req.body),
      html:    buildHtml(req.body)
    });
    console.log(`[contact] ${type} fra ${email} -> ${to}`);
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] SMTP fejl:', err.message);
    res.status(500).json({ ok: false });
  }
});

app.get('/health', (_req, res) => res.send('ok'));

app.listen(3000, '0.0.0.0', () => console.log('SmartPack Contact API klar paa port 3000'));
