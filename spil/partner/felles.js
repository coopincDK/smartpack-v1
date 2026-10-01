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
      { k: 'cvr', l: 'CVR-nummer' },
      { k: 'adresse', l: 'Adresse' },
      { k: 'hjemmeside', l: 'Hjemmeside', req: true, t: 'url', ph: 'https://' },
      { k: 'kort_beskrivelse', l: 'Kort beskrivelse', req: true, area: true, small: 'Én til to sætninger om, hvad I kan hjælpe en ejerleder eller onlinevirksomhed med. Vises ved jeres power-up i spillet.' },
      { k: 'beskrivelse', l: 'Om jer', area: true, small: 'Længere tekst til jeres partnerside: hvem I er, og hvad I tilbyder webshops.' },
    ],
    kontakt: [
      { k: 'kontakt_navn', l: 'Kontaktperson' },
      { k: 'kontakt_email', l: 'E-mail', t: 'email' },
      { k: 'kontakt_telefon', l: 'Telefon', t: 'tel' },
    ],
    praemie: [
      { k: 'praemie_titel', l: 'Overskrift på gaven', req: true, ph: 'Fx "Et års onlinekursus i e-mailmarketing"' },
      { k: 'praemie_vaerdi', l: 'Værdi i kroner', req: true, t: 'number', small: 'Kun tal, fx 24000.' },
      { k: 'praemie_vaerdi_type', l: 'Er værdien fast eller "op til"?', sel: [['fast', 'Fast værdi'], ['op_til', 'Op til (afhænger af valg eller forløb)']] },
      { k: 'praemie_moms', l: 'Moms', sel: [['ekskl', 'Ekskl. moms'], ['inkl', 'Inkl. moms']] },
      { k: 'praemie_beskrivelse', l: 'Hvad er gaven præcist?', req: true, area: true },
      { k: 'praemie_udbytte', l: 'Hvad får vinderen ud af at bruge den?', area: true },
      { k: 'praemie_betingelser', l: 'Betingelser', area: true, small: 'Påkrævet ved "op til". Skriv tydeligt, hvordan man får hele værdien, fx: "2.000 kr. pr. måned i op til et år. Stopper forløbet før, betales resten ikke." eller "Frit valg af to plukkevogne, op til 12.000 kr. i alt."' },
      { k: 'praemie_indloesning', l: 'Sådan indløses gaven', area: true, small: 'Hvem kontakter hvem, og hvornår skal den senest bruges?' },
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
    var fsP = el('fieldset', null, [
      el('legend', { text: 'Gave til konkurrencen' }),
      el('label', { class: 'check' }, [cb, document.createTextNode('Ja tak, vi vil gerne give en gave til konkurrencen')]),
      praemieFelter,
    ]);
    // Lange tekstfelter fylder hele bredden.
    praemieFelter.querySelectorAll('textarea').forEach(function (t) { t.closest('label').style.gridColumn = '1 / -1'; });
    mount.append(fsV, fsK, fsP);
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
