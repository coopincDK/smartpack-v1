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
      '      <p>&copy; <span id="copy-year"></span> SmartPack ApS &middot; CVR 42007617 &middot; Torvegade 3, 8963 Auning</p>',
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
        label = 'Helligdag &ndash; lukket';
        msg   = 'Support er lukket på alle danske helligdage samt Grundlovsdag (5. juni), Juleaftensdag (24. december) og Nytårsaftensdag (31. december).';
      } else if (erWeekend) {
        // 🔴 Rød: hele weekenden
        color = CLR_R;
        label = 'Weekendlukket';
        msg   = 'KUN driftstop: ring 88&nbsp;20&nbsp;20&nbsp;19 &ndash; tast 9. &Aring;bner igen mandag.';
      } else {
        // Hverdag (man-fre)
        if (h >= 9 && h < 16) {
          // 🟢 Grøn: 09-16
          color = CLR_G;
          label = 'Support &aring;ben';
          msg   = 'Ring 88&nbsp;20&nbsp;20&nbsp;19 &ndash; vi tager telefonen. Tast 2.';
        } else if ((h >= 6 && h < 9) || (h >= 16 && h < 22)) {
          // 🟡 Gul: 06-09 + 16-22
          color = CLR_Y;
          label = 'Begr&aelig;nset support &ndash; ring 88&nbsp;20&nbsp;20&nbsp;19';
          msg   = 'KUN ved akut driftstop &ndash; tast 9.';
        } else {
          // 🔴 Rød: 22-06
          color = CLR_R;
          label = 'Nattevagt';
          msg   = 'KUN ved akut driftstop &ndash; tast 9. &Aring;bner igen kl.&nbsp;9.';
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
        notits = ' &mdash; <span style="color:#f59e0b;font-size:0.88em">'
               + '\u26a0\ufe0f Bem\u00e6rk: ' + tekst
               + '. Akut support er stadig tilg\u00e6ngelig p\u00e5 88&nbsp;20&nbsp;20&nbsp;19 &ndash; tast 9.</span>';
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
