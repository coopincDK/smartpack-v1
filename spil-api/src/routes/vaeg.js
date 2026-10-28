'use strict';

const express = require('express');

// Vægstyring til standen.
//
// En messegæst scanner en QR på bordskærmen. Telefonen lander på
// GET /vaeg/vis?case=<id>, som lægger ønsket i en kø og viser hvornår
// det bliver dets tur. Vægskærmen henter GET /vaeg/naeste, men KUN når
// den er ledig — så en case bliver aldrig afbrudt af den næste scanning.
//
// Køen ligger med vilje i hukommelsen: et ønske er kun relevant i få
// minutter, og en genstart må gerne rydde den. Ingen database, ingen
// migration, ingen berøring af spillets data.

const GYLDIG_MS = 5 * 60 * 1000;   // et ønske dør efter fem minutter i kø
const PR_CASE_MS = 120 * 1000;     // groft skøn pr. case foran dig
const MAKS_KOE = 12;

function sanitiser(s) {
  return typeof s === 'string' && /^[a-z0-9-]{1,40}$/.test(s) ? s : null;
}

const CASENAVNE = {
  danfilter: 'Danfilter',
  sygeplejebutikken: 'Sygeplejebutikken',
  'skagen-clothing': 'Skagen Clothing',
  'uniq-perler': 'Uniq Perler',
  luksushund: 'Luksushund',
  firstgrade: 'FirstGrade',
  vinhuset: 'Vinhuset.dk',
  create2stay: 'create2STAY',
  totteland: 'Totteland.dk',
  littleunbox: 'LittleUnBox',
  'den-sidste-flaske': 'Den Sidste Flaske',
  'jule-sweaters': 'Jule-Sweaters',
  billigfitness: 'Billigfitness',
  'banger-dit-lager': 'Dit Lager Part II',
  'banger-halloween': 'Halloween er død',
  'banger-hero': 'Your Warehouse Hero',
};

// Teksten ved nyhedsbrevsfluebenet skal vaere praecis den samme som paa
// hjemmesidens formular - serveren gemmer den som samtykke.
const NYHEDSBREV_TEKST = 'Ja tak til praktiske tips om lager og logistik';

function chipgruppe(felt, titel, valg, multi) {
  const knapper = valg.map((v) => `<button type="button" data-v="${v}">${v}</button>`).join('');
  return `<div class="gruppe"><span class="lbl">${titel}</span>` +
         `<div class="chips" data-felt="${felt}"${multi ? ' data-multi="1"' : ''}>${knapper}</div></div>`;
}

function side(overskrift, tekst, gron, caseId) {
  const farve = gron ? '#3ECF8E' : '#F97316';
  const setCase = (caseId && CASENAVNE[caseId]) || '';
  return `<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>SmartPack</title>
<style>html,body{margin:0;background:#010E22;color:#F1F5F9;
font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;-webkit-font-smoothing:antialiased}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
padding:28px 20px 40px;box-sizing:border-box}
.ark{width:100%;max-width:460px}
h1{font-size:32px;margin:0 0 12px;color:${farve};letter-spacing:-.02em;
line-height:1.15;text-align:center}
.led{font-size:18px;line-height:1.5;color:#94A3B8;margin:0;text-align:center}
.kort{margin-top:34px;background:#161C24;border:1px solid rgba(241,245,249,.08);
border-radius:18px;padding:24px 22px}
.kort h2{font-size:21px;margin:0 0 8px;color:#F1F5F9;letter-spacing:-.01em}
.und{font-size:15px;line-height:1.5;color:#94A3B8;margin:0 0 20px}
label{display:block;margin-bottom:14px;font-size:14px;color:#94A3B8}
label .kr{color:#3ECF8E}
input,textarea{display:block;width:100%;box-sizing:border-box;margin-top:6px;
background:#0B1220;border:1.5px solid rgba(241,245,249,.12);border-radius:10px;
color:#F1F5F9;font-family:inherit;font-size:16px;padding:13px 14px;outline:none}
input:focus,textarea:focus{border-color:#3ECF8E}
input.gal{border-color:#F97316}
textarea{resize:vertical;min-height:62px}
.gruppe{margin-bottom:16px}
.gruppe .lbl{display:block;font-size:14px;color:#94A3B8;margin-bottom:8px}
.valgfri{color:#64748B;font-size:12px;margin-left:6px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips button{background:#0B1220;border:1.5px solid rgba(241,245,249,.12);
border-radius:999px;color:#94A3B8;font-family:inherit;font-size:14px;
padding:9px 14px;cursor:pointer}
.chips button.valgt{border-color:#3ECF8E;color:#F1F5F9;background:rgba(62,207,142,.12)}
.nyhed{display:flex;align-items:flex-start;gap:11px;margin:4px 0 18px;
font-size:14px;line-height:1.45;color:#94A3B8;cursor:pointer}
.nyhed input{width:20px;height:20px;flex:0 0 auto;margin:1px 0 0;accent-color:#3ECF8E;padding:0}
.hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.knap{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;
background:#3ECF8E;color:#010E22;font-family:inherit;font-size:17px;font-weight:600;
padding:16px;margin-top:4px;cursor:pointer}
.knap:disabled{opacity:.6}
.knap:active{transform:translateY(1px)}
.fejl{display:none;font-size:14px;line-height:1.5;color:#F97316;margin:14px 0 0}
.fejl a{color:#F97316}
.andet{font-size:14px;color:#94A3B8;margin:18px 0 0;text-align:center}
.andet a{color:#3ECF8E;text-decoration:none}
.tak h2{margin-bottom:10px}
.tak p{font-size:16px;line-height:1.5;color:#94A3B8;margin:0}</style></head>
<body><div class="ark">
<h1>${overskrift}</h1><p class="led">${tekst}</p>
<div class="kort" id="kort">
<h2>Book en gennemgang</h2>
<p class="und">Vi kigger på jeres setup sammen og finder flaskehalsene. Cirka 20 minutter, helt uforpligtende.</p>
<form id="f" novalidate autocomplete="on">
<label>Navn <span class="kr">*</span><input name="name" autocomplete="name"></label>
<label>Virksomhed <span class="kr">*</span><input name="company" autocomplete="organization"></label>
<label>E-mail <span class="kr">*</span><input name="email" type="email" inputmode="email" autocomplete="email"></label>
<label>Telefon<input name="phone" type="tel" inputmode="tel" autocomplete="tel"></label>
${chipgruppe('orders', 'Ordrer pr. dag', ['Under 50', '50-200', '200-1.000', 'Over 1.000'], false)}
${chipgruppe('shops', 'Webshop<span class="valgfri">vælg gerne flere</span>', ['Shopify', 'WooCommerce', 'Magento', 'DanDomain', 'PrestaShop', 'Andet'], true)}
${chipgruppe('erp', 'ERP og regnskab<span class="valgfri">vælg gerne flere</span>', ['e-conomic', 'Business Central', 'Uniconta', 'Billy', 'SAP', 'Andet'], true)}
${chipgruppe('carriers_dk', 'Fragt<span class="valgfri">vælg gerne flere</span>', ['GLS', 'PostNord', 'DAO', 'Bring', 'Shipmondo', 'Andet'], true)}
<label>Noget vi skal vide på forhånd?<textarea name="comment" rows="2"></textarea></label>
<label class="nyhed"><input type="checkbox" id="nyhed"><span>${NYHEDSBREV_TEKST}</span></label>
<input class="hp" name="_hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="knap" type="submit" id="send">Book en gennemgang</button>
<p class="fejl" id="fejl"></p>
</form>
<p class="andet">Andet spørgsmål? <a href="#" id="andet">Skriv til os</a></p>
</div></div>
<script>
var SET_CASE = ${JSON.stringify(setCase)};
var SET_ID = ${JSON.stringify(caseId || '')};
var f = document.getElementById('f');
var valgt = {};
[].slice.call(document.querySelectorAll('.chips')).forEach(function(g){
  var felt = g.dataset.felt, multi = g.dataset.multi === '1';
  valgt[felt] = multi ? [] : '';
  g.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var v = b.dataset.v;
    if (multi){
      var i = valgt[felt].indexOf(v);
      if (i === -1){ valgt[felt].push(v); b.classList.add('valgt'); }
      else { valgt[felt].splice(i,1); b.classList.remove('valgt'); }
      return;
    }
    var alle = g.querySelectorAll('button');
    for (var k=0;k<alle.length;k++) alle[k].classList.remove('valgt');
    if (valgt[felt] === v){ valgt[felt] = ''; return; }
    valgt[felt] = v; b.classList.add('valgt');
  });
});
function v(n){ return (f.elements[n].value || '').trim(); }
function visFejl(h){ var e = document.getElementById('fejl'); e.innerHTML = h; e.style.display = 'block'; }
f.addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('fejl').style.display = 'none';
  var gale = [];
  ['name','company','email'].forEach(function(n){
    var el = f.elements[n], ok = !!el.value.trim();
    if (n === 'email') ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(el.value.trim());
    el.classList.toggle('gal', !ok); if (!ok) gale.push(el);
  });
  if (gale.length){
    visFejl('Udfyld navn, virksomhed og en gyldig e-mail.');
    gale[0].focus(); return;
  }
  var knap = document.getElementById('send');
  knap.disabled = true; knap.textContent = 'Sender...';
  var noter = [];
  if (SET_CASE) noter.push('Så casen om ' + SET_CASE + ' på standen.');
  noter.push('Vil gerne booke en gennemgang.');
  if (v('comment')) noter.push(v('comment'));
  fetch('/api/spil/hjemmeside/kontakt', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      type: 'learn', name: v('name'), company: v('company'), email: v('email'),
      phone: v('phone'), orders: valgt.orders, shops: valgt.shops,
      erp: valgt.erp, carriers_dk: valgt.carriers_dk,
      comment: noter.join('\\n\\n'), source: 'Messestand', page: location.href,
      newsletter: document.getElementById('nyhed').checked, _hp: v('_hp')
    })
  }).then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function(){
      /* tael den med i messestatistikken - maa aldrig kunne vaelte kvitteringen */
      try { fetch('/api/spil/vaeg/lead?case=' + encodeURIComponent(SET_ID), {cache:'no-store'}).catch(function(){}); } catch(e){}
      var fornavn = v('name').split(' ')[0];
      document.getElementById('kort').innerHTML =
        '<div class="tak"><h2>Tak, ' + fornavn.replace(/[<>&]/g,'') + '.</h2>' +
        '<p>Vi vender tilbage inden for en hverdag og finder et tidspunkt.</p></div>';
      window.scrollTo(0,0);
    })
    .catch(function(){
      knap.disabled = false; knap.textContent = 'Book en gennemgang';
      visFejl('Det ville ikke sende lige nu. Prøv igen, eller skriv til ' +
        '<a href="mailto:bundlinjeboost@smartpack.dk">bundlinjeboost@smartpack.dk</a>.');
    });
});
window._spcovBase = 'https://smartpack.dk';
var forsoeg = 0;
function aabenForm(){
  if (window.spcov) { window.spcov.open(); return; }
  if (forsoeg++ < 25) { setTimeout(aabenForm, 200); return; }
  location.href = 'https://smartpack.dk/kontakt';
}
document.getElementById('andet').addEventListener('click', function(e){ e.preventDefault(); aabenForm(); });
</script>
<script src="https://smartpack.dk/js/contact-form.js" defer></script>
</body></html>`;
}

// Koden til messestyringen. Saettes med MESSE_KODE paa serveren; staar den
// ikke, bruges den her. Siden er ikke hemmelig - den skal bare ikke kunne
// aabnes af en tilfaeldig gaest der gaetter adressen.
const MESSE_KODE = process.env.MESSE_KODE || 'S61607478s!';

function vaegRouter(pool) {
  const router = express.Router();

  // Tael en haendelse. Fire-and-forget: statistik maa aldrig kunne
  // forsinke eller vaelte et scan.
  function tael(slags, caseId) {
    if (!pool) return;
    pool
      .query('INSERT INTO messe_haendelse (slags, case_id) VALUES ($1, $2)', [slags, caseId || null])
      .catch((e) => console.error('[messe] kunne ikke taelle', slags, e.message));
  }

  // Ordrer fra messestyringen. De gaar UDEN OM koen: en ordre afbryder
  // med det samme, mens koen aldrig afbryder noget.
  let ordre = null;   // { spil: '<id>' } eller { stop: true }

  function kodeOk(req) {
    const k = req.get('x-messe-kode') || req.query.kode || (req.body && req.body.kode);
    return typeof k === 'string' && k === MESSE_KODE;
  }
  function kraevKode(req, res, next) {
    if (kodeOk(req)) return next();
    res.set('Cache-Control', 'no-store');
    return res.status(401).json({ fejl: 'Forkert kode.' });
  }
  let koe = [];
  let taeller = 0;
  let sidst = null;   // den case vaeggen senest fik udleveret
  let spiller = null; // det vaeggen viser lige nu, meldt ind af vaeggen selv

  function ryd() {
    const nu = Date.now();
    koe = koe.filter((x) => nu - x.tid < GYLDIG_MS);
  }

  // Telefonen lander her efter et scan.
  router.get('/vaeg/vis', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const id = sanitiser(req.query.case);
    if (!id) {
      return res.status(400).send(side('Koden kunne ikke læses',
        'Prøv en af de andre koder på bordet.', false));
    }
    ryd();

    // Er den samme case allerede bestilt, skal den ikke i kø igen.
    // To gaester der scanner den samme kode staar i den samme plads.
    const iKoe = koe.findIndex((x) => x.id === id);
    if (iKoe === 0) {
      return res.send(side('Den er lige på vej', 'Kig op på væggen bag bordet.', true, id));
    }
    if (iKoe > 0) {
      const vent = Math.max(1, Math.round((iKoe * PR_CASE_MS) / 60000));
      return res.send(side('Den er allerede bestilt',
        `Den kommer om cirka ${vent} minut${vent === 1 ? '' : 'ter'}. Bliv stående — den starter af sig selv.`, true, id));
    }
    if (sidst && sidst.id === id && Date.now() - sidst.tid < PR_CASE_MS) {
      return res.send(side('Den kører lige nu', 'Kig op på væggen bag bordet.', true, id));
    }

    if (koe.length >= MAKS_KOE) {
      return res.status(429).send(side('Der er run på lige nu',
        'Prøv igen om et øjeblik — køen er fuld.', false));
    }
    taeller += 1;
    tael('scan', id);
    koe.push({ id, tid: Date.now(), nr: taeller });
    const plads = koe.length;
    if (plads === 1) {
      return res.send(side('Den starter nu', 'Kig op på væggen bag bordet.', true, id));
    }
    const min = Math.max(1, Math.round(((plads - 1) * PR_CASE_MS) / 60000));
    return res.send(side(`Du er nummer ${plads}`,
      `Den kommer om cirka ${min} minut${min === 1 ? '' : 'ter'}. Bliv stående — den starter af sig selv.`, true, id));
  });

  // Vægskærmen henter her, men kun når den er ledig.
  // At hente ÉT ønske fjerner det fra køen.
  router.get('/vaeg/naeste', (req, res) => {
    res.set('Cache-Control', 'no-store');
    ryd();
    const naeste = koe.shift();
    if (!naeste) return res.json({ case: null, nr: 0, koe: 0 });
    sidst = { id: naeste.id, tid: Date.now() };
    return res.json({ case: naeste.id, nr: naeste.nr, koe: koe.length });
  });

  // Vaeggen melder selv ind hvad den viser, og banker paa hvert 10. sekund
  // mens den spiller. Uden et bank i 25 sekunder regnes muren for ledig igen,
  // saa bordet ikke staar og paastaar at noget spiller efter en genstart.
  router.get('/vaeg/spiller', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const id = sanitiser(req.query.case);
    spiller = id ? { id, tid: Date.now() } : null;
    return res.json({ ok: true });
  });

  // Bordet spoerger her: hvad koerer der lige nu paa muren?
  router.get('/vaeg/nu', (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (spiller && Date.now() - spiller.tid < 25000) {
      return res.json({ case: spiller.id, navn: CASENAVNE[spiller.id] || '' });
    }
    return res.json({ case: null, navn: '' });
  });

  // Vaeggen spoerger her hele tiden - ogsaa mens den spiller. En ordre fra
  // messestyringen afbryder derfor med det samme.
  router.get('/vaeg/ordre', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const o = ordre;
    ordre = null;
    return res.json(o || {});
  });

  // ---- messestyring ----
  router.post('/messe/ordre', kraevKode, (req, res) => {
    res.set('Cache-Control', 'no-store');
    const b = req.body || {};
    if (b.stop) { ordre = { stop: true }; tael('ordre', null); return res.json({ ok: true, ordre }); }
    const id = sanitiser(b.case);
    if (!id) return res.status(400).json({ fejl: 'Ukendt case.' });
    ordre = { spil: id };
    tael('ordre', id);
    return res.json({ ok: true, ordre });
  });

  // Hvad er tilstanden lige nu - til styringens forside.
  router.get('/messe/nu', kraevKode, (req, res) => {
    res.set('Cache-Control', 'no-store');
    ryd();
    const koerer = spiller && Date.now() - spiller.tid < 25000 ? spiller.id : null;
    return res.json({
      spiller: koerer,
      navn: koerer ? CASENAVNE[koerer] || '' : '',
      koe: koe.map((x) => ({ case: x.id, navn: CASENAVNE[x.id] || '' })),
      venter: ordre || null,
    });
  });

  // Tal. 'i_dag' regnes i dansk tid, saa en messedag er en messedag.
  router.get('/messe/stat', kraevKode, async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!pool) return res.json({ scan: [], lead: 0, lead_i_dag: 0, scan_i_alt: 0, scan_i_dag: 0 });
    try {
      const q = await pool.query(
        `SELECT slags, case_id,
                count(*) AS i_alt,
                count(*) FILTER (
                  WHERE (tid AT TIME ZONE 'Europe/Copenhagen')::date
                      = (now() AT TIME ZONE 'Europe/Copenhagen')::date
                ) AS i_dag
           FROM messe_haendelse
          WHERE slags IN ('scan','lead')
          GROUP BY slags, case_id`
      );
      const scan = [];
      let lead = 0, lead_i_dag = 0, scan_i_alt = 0, scan_i_dag = 0;
      for (const r of q.rows) {
        const ia = Number(r.i_alt), id_ = Number(r.i_dag);
        if (r.slags === 'lead') { lead += ia; lead_i_dag += id_; continue; }
        scan_i_alt += ia; scan_i_dag += id_;
        scan.push({ case: r.case_id, navn: CASENAVNE[r.case_id] || r.case_id, i_alt: ia, i_dag: id_ });
      }
      scan.sort((a, b) => b.i_alt - a.i_alt);
      return res.json({ scan, lead, lead_i_dag, scan_i_alt, scan_i_dag });
    } catch (e) { return next(e); }
  });

  // Booking-formularen melder selv ind naar den er sendt.
  router.get('/vaeg/lead', (req, res) => {
    res.set('Cache-Control', 'no-store');
    tael('lead', sanitiser(req.query.case));
    return res.json({ ok: true });
  });

  // Kun til at kigge med — ændrer ingenting.
  router.get('/vaeg/koe', (req, res) => {
    res.set('Cache-Control', 'no-store');
    ryd();
    return res.json({ koe: koe.map((x) => ({ case: x.id, nr: x.nr })) });
  });

  return router;
}

module.exports = { vaegRouter };
