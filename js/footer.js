/* ============================================================
   SmartPack — Centraliseret footer
   Virker på alle domæner og subdirectory-deployments.
   ============================================================ */
(function () {
  var _src  = (document.currentScript || {}).src || '';
  var _base = _src ? _src.replace(/\/js\/footer\.js.*$/, '') : '';
  function url(path) { return _base + path; }

  function injectFooter() {
    // Telefon-placeholder: tekst sættes dynamisk efter DOM-indsættelse
    var phoneHtml = '            <li id="footer-phone-ctx"><a href="tel:+4588202019" style="color:inherit">+45 88 20 20 19</a></li>';
    var placeholder = document.getElementById('sp-footer');
    if (!placeholder) return;

    var html = [
      '<footer class="footer">',
      '  <div class="container">',
      '    <div class="footer__top">',
      '      <div class="footer__brand">',
      '        <a href="' + url('/') + '" class="footer__logo">',
      '          <img src="' + url('/assets/cropped-favicon-smartpack.png') + '" alt="SmartPack" class="footer__logo-img">',
      '          <span>SmartPack</span>',
      '        </a>',
      '        <p class="footer__tagline">Bygget af e-k&oslash;bm&aelig;nd.<br>Til dig der er tr&aelig;t af lagerb&oslash;vl.</p>',
      '        <p class="footer__sub">Har du styr p&aring; lageret?</p>',
      '        <a href="' + url('/kontakt.html') + '" class="footer__cta-btn">Lad os kigge p&aring; det sammen &rarr;</a>',
      '        <div class="footer__newsletter" style="margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.1)">',
      '          <p style="font-weight:600;font-size:0.85rem;color:#e2e8f0;margin:0 0 0.25rem">F&aring; tips om lagerdrift</p>',
      '          <p style="font-size:0.78rem;color:#94a3b8;margin:0 0 0.75rem">Vi sender af og til praktiske tips om lager, logistik og e-handel.</p>',
      '          <form id="footer-nl-form" style="display:flex;flex-direction:column;gap:0.5rem">',
      '            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">',
      '              <input id="footer-nl-name" type="text" placeholder="Dit navn" style="padding:0.55rem 0.75rem;border-radius:0.4rem;border:1px solid #475569;background:#1e293b;color:#e2e8f0;font-size:0.85rem;outline:none;width:100%;box-sizing:border-box">',
      '              <input id="footer-nl-company" type="text" placeholder="Firma" style="padding:0.55rem 0.75rem;border-radius:0.4rem;border:1px solid #475569;background:#1e293b;color:#e2e8f0;font-size:0.85rem;outline:none;width:100%;box-sizing:border-box">',
      '            </div>',
      '            <input id="footer-nl-email" type="email" placeholder="navn@firma.dk" required style="padding:0.55rem 0.75rem;border-radius:0.4rem;border:1px solid #475569;background:#1e293b;color:#e2e8f0;font-size:0.85rem;outline:none;width:100%;box-sizing:border-box">',
      '            <label style="display:flex;gap:0.5rem;align-items:flex-start;cursor:pointer">',
      '              <input id="footer-nl-consent" type="checkbox" style="margin-top:3px;flex-shrink:0;accent-color:#22c55e">',
      '              <span style="font-size:0.75rem;color:#94a3b8;line-height:1.4">Jeg accepterer at modtage nyhedsmail fra SmartPack. Du kan <a href="' + url('/SmartPackUpdate/afmeld') + '" style="color:#4ade80">afmelde dig</a> igen n&aring;r som helst.</span>',
      '            </label>',
      '            <button id="footer-nl-btn" type="submit" style="padding:0.55rem 1rem;border-radius:0.4rem;background:#2D5A3D;color:#fff;font-weight:600;font-size:0.85rem;border:none;cursor:pointer;transition:background 0.15s">Tilmeld &rarr;</button>',
      '            <p id="footer-nl-msg" style="font-size:0.78rem;margin:0;min-height:1.2em"></p>',
      '          </form>',
      '        </div>',
      '      </div>',
      '      <div class="footer__nav">',
      '        <div class="footer__nav-col">',
      '          <p class="footer__nav-heading">Produkt</p>',
      '          <ul>',
      '            <li><a href="' + url('/funktioner.html') + '">Funktioner</a></li>',
      '            <li><a href="' + url('/integrationer.html') + '">Integrationer</a></li>',
      '            <li><a href="' + url('/cases.html') + '">Kundecases</a></li>',
      '            <li><a href="' + url('/priser.html') + '">Priser</a></li>',
      '            <li><a href="' + url('/viden/') + '">Vidensdatabase</a></li>',
      '            <li><a href="' + url('/3pl.html') + '">3PL &amp; Lagerhoteller</a></li>',
      '          </ul>',
      '        </div>',
      '        <div class="footer__nav-col">',
      '          <p class="footer__nav-heading">Virksomhed</p>',
      '          <ul>',
      '            <li><a href="' + url('/om-os.html') + '">Om os</a></li>',
      '            <li><a href="https://www.tiktok.com/@smartpackwms" target="_blank" rel="noopener">TikTok</a></li>',
      '            <li><a href="https://www.youtube.com/@SmartPackWMS" target="_blank" rel="noopener">YouTube</a></li>',
      '            <li><a href="https://dk.linkedin.com/company/smartpackwms" target="_blank" rel="noopener">LinkedIn</a></li>',
      '          </ul>',
      '        </div>',
      '        <div class="footer__nav-col">',
      '          <p class="footer__nav-heading">Support</p>',
      '          <ul>',
      '            <li><a href="' + url('/faq.html') + '">FAQ</a></li>',
      '            <li><a href="mailto:support@smartpack.dk">support@smartpack.dk</a></li>',
      '            <li><a href="https://support.smartpack.dk" target="_blank" rel="noopener">Helpdesk &amp; tickets</a></li>',
      '            <li><a href="' + url('/driftinformation.html') + '">Driftinformation</a></li>',
      phoneHtml,
      '          </ul>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    <div class="footer__bottom">',
      '      <p>&copy; <span id="copy-year"></span> SmartPack ApS &middot; CVR 42007617 &middot; Østerbrogade 67A, 8500 Grenaa</p>',
      '      <div class="footer__badges">',
      '        <span class="footer__badge">E-handel siden 2005</span>',
      '        <span class="footer__badge">Medlem af Dansk Erhverv</span>',
      '        <span class="footer__badge">Bygget til lageret</span>',
      '      </div>',
      '      <div class="footer__quicksupport">',
      '        <a href="' + url('/vilkaar.html') + '">Vilk&aring;r</a> &middot; Fjernsupport:',
      '        <a href="https://download.teamviewer.com/download/TeamViewerQS.exe" target="_blank" rel="noopener">QuickSupport PC</a> &middot;',
      '        <a href="https://download.teamviewer.com/download/TeamViewerQS.dmg" target="_blank" rel="noopener">QuickSupport Mac</a> &middot;',
      '        <a href="https://download.teamviewer.com/download/TeamViewerQS.apk" target="_blank" rel="noopener">QuickSupport Android</a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</footer>'
    ].join('\n');

    placeholder.insertAdjacentHTML('beforebegin', html);
    placeholder.parentNode.removeChild(placeholder);

    var y = document.getElementById('copy-year');
    if (y) y.textContent = new Date().getFullYear();

    // Nyhedsbrev signup i footer
    (function() {
      var form      = document.getElementById('footer-nl-form');
      var emailEl   = document.getElementById('footer-nl-email');
      var nameEl    = document.getElementById('footer-nl-name');
      var companyEl = document.getElementById('footer-nl-company');
      var consent   = document.getElementById('footer-nl-consent');
      var btn       = document.getElementById('footer-nl-btn');
      var msg       = document.getElementById('footer-nl-msg');
      if (!form) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!emailEl.value || !consent.checked) return;
        btn.disabled = true;
        btn.textContent = 'Tilmelder...';
        msg.style.color = '#94a3b8';
        msg.textContent = '';

        fetch('https://midtkaplyhxhrdtujmda.supabase.co/rest/v1/newsletter_subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'sb_publishable_TMt9jbZhbV8KzrvDUA7kuA_RXZW4mwE',
            'Authorization': 'Bearer sb_publishable_TMt9jbZhbV8KzrvDUA7kuA_RXZW4mwE',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(Object.assign(
            { email: emailEl.value.toLowerCase().trim() },
            nameEl.value.trim()    ? { name: nameEl.value.trim() }       : {},
            companyEl.value.trim() ? { company: companyEl.value.trim() } : {}
          ))
        })
        .then(function(r) {
          if (r.status === 201 || r.status === 409) {
            msg.style.color = '#4ade80';
            msg.textContent = 'Tak - du er tilmeldt!';
            form.reset();
          } else {
            msg.style.color = '#f87171';
            msg.textContent = 'Noget gik galt. Pr\u00f8v igen.';
          }
          btn.disabled = false;
          btn.textContent = 'Tilmeld \u2192';
        })
        .catch(function() {
          msg.style.color = '#f87171';
          msg.textContent = 'Noget gik galt. Pr\u00f8v igen.';
          btn.disabled = false;
          btn.textContent = 'Tilmeld \u2192';
        });
      });
    })();

    // Tidsstyret support-status i footer (fuld tidsplan)
    (function() {
      var now  = new Date();
      var day  = now.getDay();   // 0=son, 1=man...6=lor
      var h    = now.getHours();
      var phoneEl = document.getElementById('footer-phone-ctx');
      if (!phoneEl) return;

      // Dot-farver (3 tilstande)
      var CLR_G = '#22c55e';
      var CLR_Y = '#f59e0b';
      var CLR_R = '#e53935';
      function makeDot(clr) {
        return '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + clr + ';margin-right:5px;vertical-align:middle"></span>';
      }

      // --- Helligdagsberegning ---
      function paaskedag(aar) {
        // Anonym Gregoriansk algoritme
        var a = aar % 19, b = Math.floor(aar/100), c = aar % 100;
        var d = Math.floor(b/4), e = b % 4, f = Math.floor((b+8)/25);
        var g = Math.floor((b-f+1)/3), h = (19*a+b-d-g+15) % 30;
        var i = Math.floor(c/4), k = c % 4;
        var l = (32+2*e+2*i-h-k) % 7;
        var m = Math.floor((a+11*h+22*l)/451);
        var maaned = Math.floor((h+l-7*m+114)/31); // 1-baseret
        var dag = ((h+l-7*m+114) % 31) + 1;
        return new Date(aar, maaned-1, dag);
      }
      function erHelligdag(dato) {
        var aar = dato.getFullYear();
        var md  = (dato.getMonth()+1)*100 + dato.getDate(); // MMDD
        // Faste helligdage
        var faste = [101, 605, 1224, 1225, 1226, 1231];
        for (var i=0; i<faste.length; i++) if (md === faste[i]) return true;
        // Bevægelige (påskebaserede)
        var p0 = paaskedag(aar).getTime();
        var dag = dato.getTime();
        var D  = 86400000;
        return [
          -3*D, // Skærtorsdag
          -2*D, // Langfredag
           0,   // Påskedag
          +1*D, // 2. Påskedag
         +39*D, // Kristi Himmelfartsdag
         +49*D, // 1. Pinsedag
         +50*D, // 2. Pinsedag
        ].some(function(off){ return p0+off === dag; });
      }
      // Brug kun dato (ingen tid) til helligdagscheck
      var idag = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var erHelligdagIdag = erHelligdag(idag);

      var color, dot, label, msg;
      var erWeekend = (day === 0 || day === 6);

      if (erHelligdagIdag) {
        // 🔴 Rød: helligdag
        color = CLR_R;
        label = 'Helligdag - lukket';
        msg   = 'Support er lukket på alle danske helligdage samt Grundlovsdag (5. juni), Juleaftensdag (24. december) og Nytårsaftensdag (31. december).';
      } else if (erWeekend) {
        // 🔴 Rød: hele weekenden
        color = CLR_R;
        label = 'Weekendlukket';
        msg   = 'KUN driftstop: ring 88&nbsp;20&nbsp;20&nbsp;19 - tast 9. &Aring;bner igen mandag.';
      } else {
        // Hverdag (man-fre)
        if (h >= 9 && h < 16) {
          // 🟢 Grøn: 09-16
          color = CLR_G;
          label = 'Support &aring;ben';
          msg   = 'Ring 88&nbsp;20&nbsp;20&nbsp;19 - vi tager telefonen. Tast 2.';
        } else if ((h >= 6 && h < 9) || (h >= 16 && h < 22)) {
          // 🟡 Gul: 06-09 + 16-22
          color = CLR_Y;
          label = 'Begr&aelig;nset support - ring 88&nbsp;20&nbsp;20&nbsp;19';
          msg   = 'KUN ved akut driftstop - tast 9.';
        } else {
          // 🔴 Rød: 22-06
          color = CLR_R;
          label = 'Nattevagt';
          msg   = 'KUN ved akut driftstop - tast 9. &Aring;bner igen kl.&nbsp;9.';
        }
      }

      // --- Find næste lukkeblokt inden for 7 dage ---
      var MAANEDER = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
      var DAGE_DK  = ['s\u00f8ndag','mandag','tirsdag','onsdag','torsdag','fredag','l\u00f8rdag'];
      var D = 86400000;

      function erLukket(dato) {
        return erHelligdag(dato) || dato.getDay() === 0 || dato.getDay() === 6;
      }
      function fmtDato(dato) {
        return DAGE_DK[dato.getDay()] + ' d.&nbsp;' + dato.getDate() + '.&nbsp;' + MAANEDER[dato.getMonth()];
      }

      // Find første helligdag (ikke bare weekend) inden for 7 hverdage
      var bloekStart = null;
      for (var off2 = 1; off2 <= 7; off2++) {
        var tjek2 = new Date(idag.getTime() + off2 * D);
        if (erHelligdag(tjek2)) { bloekStart = tjek2; break; }
      }

      var notits = '';
      if (bloekStart && !erHelligdagIdag && !erWeekend) {
        // Udvid blokken fremad: find sidste dag i den sammehængende lukkeperiode
        var bloekSlut = new Date(bloekStart.getTime());
        for (var ext = 1; ext <= 10; ext++) {
          var naeste = new Date(bloekStart.getTime() + ext * D);
          if (erLukket(naeste)) { bloekSlut = naeste; } else { break; }
        }
        var erSammedag = bloekStart.getTime() === bloekSlut.getTime();
        var tekst;
        if (erSammedag) {
          tekst = 'support holder lukket ' + fmtDato(bloekStart);
        } else {
          tekst = 'support holder lukket fra ' + fmtDato(bloekStart) + ' til og med ' + fmtDato(bloekSlut);
        }
        notits = '<br><span style="color:#f59e0b;font-size:0.88em">'
               + '\u26a0\ufe0f Bem\u00e6rk: ' + tekst
               + '. Akut support er stadig tilg\u00e6ngelig p\u00e5 88&nbsp;20&nbsp;20&nbsp;19 - tast 9.</span>';
      }

      dot = makeDot(color);
      var href = 'tel:+4588202019';
      phoneEl.innerHTML = dot
        + '<strong style="color:' + color + '">' + label + '</strong>'
        + ' &middot; ' + msg + notits;
    })();

    /* ============================================================
       TRACKING — indsæt scripts her
       ============================================================ */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
