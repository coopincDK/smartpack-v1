/* Fælles hjælpere til partnersiderne (admin, partnerlogin og præmieoversigt). */
(function () {
  'use strict';
  var API = '/api/spil';

  function api(path, opts) {
    opts = opts || {};
    var headers = {};
    var body = opts.body;
    if (body !== undefined && !(body instanceof Blob)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    } else if (body instanceof Blob) {
      headers['Content-Type'] = body.type;
    }
    return fetch(API + path, { method: opts.method || 'GET', headers: headers, body: body, credentials: 'same-origin' })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = null;
          try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!r.ok) {
            var err = new Error((j && j.fejl) || 'Noget gik galt (' + r.status + ').');
            err.status = r.status; err.kode = j && j.kode; err.felt = j && j.felt;
            throw err;
          }
          return j;
        });
      });
  }

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] === true) e.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (k) { if (k != null) e.append(k); });
    return e;
  }

  function kr(n) {
    if (n === null || n === undefined || n === '') return '';
    return Number(n).toLocaleString('da-DK') + ' kr.';
  }

  function vaerdiTekst(pr) {
    if (!pr || pr.vaerdi === null || pr.vaerdi === undefined) return '';
    return (pr.vaerdi_type === 'op_til' ? 'Op til ' : '') + kr(pr.vaerdi) + (pr.moms === 'inkl' ? ' inkl. moms' : ' ekskl. moms');
  }

  // Feltskema til profil- og præmieformularen. Bruges både af admin og partner.
  var FELTER = {
    virksomhed: [
      { k: 'firmanavn', l: 'Firmanavn', req: true },
      { k: 'cvr', l: 'CVR-nummer', req: true, small: '8 cifre. Står i samtykket, spillerne giver til jer.' },
      { k: 'adresse', l: 'Adresse' },
      { k: 'hjemmeside', l: 'Hjemmeside', req: true, t: 'url', ph: 'https://' },
      { k: 'kort_beskrivelse', l: 'Kort beskrivelse', req: true, area: true, small: 'Én til to sætninger om, hvad I kan hjælpe en ejerleder eller onlinevirksomhed med. Vises ved jeres power-up i spillet.' },
      { k: 'beskrivelse', l: 'Om jer', area: true, small: 'Længere tekst til jeres partnerside: hvem I er, og hvad I tilbyder webshops.' },
    ],
    kontakt: [
      { k: 'kontakt_navn', l: 'Kontaktperson' },
      { k: 'kontakt_email', l: 'E-mail', t: 'email' },
      { k: 'kontakt_telefon', l: 'Telefon', t: 'tel' },
      { k: 'levering_navn', l: 'Ansvarlig for at levere gaven', small: 'Kan være den samme som kontaktpersonen.' },
      { k: 'levering_email', l: 'Mail til den ansvarlige', t: 'email' },
      { k: 'afmeld_email', l: 'Mail til afmeldinger og persondata', t: 'email' },
    ],
    samtykke: [
      { k: 'produktkategori', l: 'Hvad sender I mails om?', req: true, ph: 'Fx "kundeservice-software"', small: 'Kort, højst 60 tegn. Står i samtykket: "… må sende mig mails om [det her]".' },
      { k: 'privatlivspolitik', l: 'Link til jeres privatlivspolitik', req: true, t: 'url', ph: 'https://' },
    ],
    praemie: [
      { k: 'praemie_titel', l: 'Overskrift på gaven', req: true, ph: 'Fx "Et års onlinekursus i e-mailmarketing"' },
      { k: 'praemie_vaerdi', l: 'Værdi i kroner', req: true, t: 'number', small: 'Kun tal, fx 24000.' },
      { k: 'praemie_vaerdi_type', l: 'Er værdien fast eller "op til"?', sel: [['fast', 'Fast værdi'], ['op_til', 'Op til (afhænger af valg eller forløb)']] },
      { k: 'praemie_moms', l: 'Moms', sel: [['ekskl', 'Ekskl. moms'], ['inkl', 'Inkl. moms']] },
      { k: 'praemie_beskrivelse', l: 'Hvad er gaven præcist?', req: true, area: true },
      { k: 'praemie_udbytte', l: 'Hvad får vinderen ud af at bruge den?', area: true },
      { k: 'praemie_betingelser', l: 'Betingelser', area: true, small: 'Påkrævet ved "op til". Skriv tydeligt, hvordan man får hele værdien, fx: "2.000 kr. pr. måned i op til et år. Stopper forløbet før, betales resten ikke." eller "Frit valg af to plukkevogne, op til 12.000 kr. i alt."' },
      { k: 'praemie_indloesning', l: 'Sådan indløses gaven', req: true, area: true, small: 'Hvem kontakter hvem?' },
      { k: 'praemie_ikke_med', l: 'Hvad er ikke med?', area: true, small: 'Fx transport, opsætning eller ekstra moduler. Skriv "intet", hvis alt er med.' },
      { k: 'praemie_sidste_frist', l: 'Sidste frist for at bruge gaven', req: true, t: 'date' },
      { k: 'praemie_flyt', l: 'Svarer vinderen ikke inden 14 dage: må gaven flyttes med til Ehandelsdagen 11. februar 2027?', sel: [['spoerg', 'Spørg os først'], ['ja', 'Ja'], ['nej', 'Nej']] },
    ],
    fordel: [
      { k: 'fordel_ydelse', l: 'Produkt eller ydelse' },
      { k: 'fordel_rabat', l: 'Rabat', ph: 'Fx "20 % de første 6 måneder, højst 6.000 kr."' },
      { k: 'fordel_koebskrav', l: 'Hvad skal man købe for at få den?', area: true },
      { k: 'fordel_gyldig_til', l: 'Gyldig til', t: 'date' },
    ],
  };

  function felt(def, v) {
    var id = 'f-' + def.k;
    var input;
    if (def.sel) {
      input = el('select', { id: id, name: def.k }, def.sel.map(function (o) { return el('option', { value: o[0], text: o[1] }); }));
      input.value = v || def.sel[0][0];
    } else if (def.area) {
      input = el('textarea', { id: id, name: def.k });
      input.value = v || '';
    } else {
      input = el('input', { id: id, name: def.k, type: def.t || 'text', placeholder: def.ph || null, min: def.t === 'number' ? '0' : null, step: def.t === 'number' ? '1' : null });
      input.value = v === null || v === undefined ? '' : v;
    }
    return el('label', { class: 'f', for: id }, [
      document.createTextNode(def.l + (def.req ? ' *' : '')),
      def.small ? el('small', { text: def.small }) : null,
      input,
    ]);
  }

  // Byg profil- og præmieformularen ind i `mount` ud fra partner-objektet `p`.
  function bygFormular(mount, p) {
    mount.replaceChildren();
    var fsV = el('fieldset', null, [el('legend', { text: 'Virksomhed' })]);
    FELTER.virksomhed.forEach(function (d) { fsV.append(felt(d, p[d.k])); });
    var fsK = el('fieldset', null, [el('legend', { text: 'Kontakt (vises ikke offentligt)' }), el('div', { class: 'grid2' }, FELTER.kontakt.map(function (d) { return felt(d, p[d.k]); }))]);
    var cb = el('input', { type: 'checkbox', id: 'f-giver_praemie', name: 'giver_praemie' });
    cb.checked = !!p.giver_praemie;
    var praemieFelter = el('div', { class: 'grid2' }, FELTER.praemie.map(function (d) { return felt(d, p[d.k]); }));
    praemieFelter.hidden = !cb.checked;
    cb.addEventListener('change', function () { praemieFelter.hidden = !cb.checked; });
    var fsS = el('fieldset', null, [el('legend', { text: 'Samtykke fra spillerne' }),
      el('p', { class: 'muted small', text: 'Spillerne sætter selv flueben ved jer. Teksten bygges af jeres firmanavn, CVR og feltet herunder, og I kan ikke skrive den frit.' })]);
    FELTER.samtykke.forEach(function (d) { fsS.append(felt(d, p[d.k])); });
    // Ingen egen privatlivspolitik? Så kan partneren bruge Packrush' standard (bygges af firmanavn, CVR og afmeldingsmail).
    var std = el('input', { type: 'checkbox', id: 'f-privatliv_standard', name: 'privatliv_standard' });
    std.checked = !!p.privatliv_standard;
    var stdBoks = el('div', { class: 'std-privatliv' }, [
      el('label', { class: 'check' }, [std, document.createTextNode('Vi har ikke et link til en egen privatlivspolitik og bruger Packrush\' standard')]),
      el('div', { class: 'small muted', id: 'std-tekst' }, [
        el('p', null, [document.createTextNode('Standarden fortæller spilleren, at I er dataansvarlige, hvad I har fået (navn, arbejdsmail, virksomhed), at I kun sender mails om det, der stod i samtykket, at man kan afmelde sig i hver mail eller på jeres mail til persondata, og at afmeldte slettes senest 30 dage efter. '), el('a', { href: '/spil/partnerprivatliv/?p=' + encodeURIComponent(p.slug || ''), text: 'Se standardpolitikken' }), document.createTextNode('.')]),
        el('p', null, [el('strong', { text: 'Ved at vælge standarden bekræfter I, at I efterlever den.' }), document.createTextNode(' Det kræver, at feltet "Mail til afmeldinger og persondata" er udfyldt. Linket udfyldes automatisk, når I gemmer.')]),
      ]),
    ]);
    var urlFelt = fsS.querySelector('#f-privatlivspolitik');
    function visStd() {
      var on = std.checked;
      stdBoks.querySelector('#std-tekst').hidden = !on;
      if (urlFelt) { var lab = urlFelt.closest('label'); if (lab) lab.hidden = on; }
    }
    std.addEventListener('change', visStd);
    fsS.append(stdBoks);
    visStd();
    if (p.samtykke_tekst) fsS.append(el('p', { class: 'small', text: 'Sådan ser den ud nu: ' + p.samtykke_tekst }));
    var fsF = el('fieldset', null, [el('legend', { text: 'Partnerfordel ved køb (valgfri)' }),
      el('p', { class: 'muted small', text: 'En rabat er ikke en gave. Den vises for sig og tæller ikke med i præmiepuljens værdi.' }),
      el('div', { class: 'grid2' }, FELTER.fordel.map(function (d) { return felt(d, p[d.k]); }))]);
    fsF.querySelectorAll('textarea').forEach(function (t) { t.closest('label').style.gridColumn = '1 / -1'; });
    var fsP = el('fieldset', null, [
      el('legend', { text: 'Gave til konkurrencen' }),
      el('label', { class: 'check' }, [cb, document.createTextNode('Ja tak, vi vil gerne give en gave til konkurrencen')]),
      el('p', { class: 'muted small' }, [document.createTextNode('Gaven gives på '), el('a', { href: '/spil/partnervilkaar/', text: 'vilkårene for partnere' }), document.createTextNode(', blandt andet om levering, frist og flytning til Ehandelsdagen.')]),
      praemieFelter,
    ]);
    // Lange tekstfelter fylder hele bredden.
    praemieFelter.querySelectorAll('textarea').forEach(function (t) { t.closest('label').style.gridColumn = '1 / -1'; });
    var flyt = praemieFelter.querySelector('#f-praemie_flyt'); if (flyt) flyt.closest('label').style.gridColumn = '1 / -1';
    mount.append(fsV, fsS, fsK, fsP, fsF);
  }

  function laesFormular(mount) {
    var ud = {};
    mount.querySelectorAll('input[name],select[name],textarea[name]').forEach(function (i) {
      ud[i.name] = i.type === 'checkbox' ? i.checked : i.value;
    });
    return ud;
  }

  var FELTNAVN = {};
  Object.keys(FELTER).forEach(function (g) { FELTER[g].forEach(function (d) { FELTNAVN[d.k] = d.l; }); });
  FELTNAVN.navn = 'Navn';

  function manglerTekst(liste) {
    return (liste || []).map(function (k) { return FELTNAVN[k] || k; }).join(', ');
  }

  function besked(mount, tekst, type) {
    mount.replaceChildren();
    if (!tekst) return;
    mount.append(el('div', { class: 'msg ' + (type || 'info'), role: type === 'err' ? 'alert' : 'status', text: tekst }));
  }

  window.SP = { api: api, el: el, kr: kr, vaerdiTekst: vaerdiTekst, bygFormular: bygFormular, laesFormular: laesFormular, manglerTekst: manglerTekst, besked: besked, API: API };
})();
