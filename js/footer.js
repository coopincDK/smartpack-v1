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
      '          <h4>Produkt</h4>',
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
      '          <h4>Virksomhed</h4>',
      '          <ul>',
      '            <li><a href="' + url('/om-os.html') + '">Om os</a></li>',
      '            <li><a href="https://www.tiktok.com/@smartpackwms" target="_blank" rel="noopener">TikTok</a></li>',
      '            <li><a href="https://www.youtube.com/@SmartPackWMS">YouTube</a></li>',
      '            <li><a href="https://dk.linkedin.com/company/smartpackwms">LinkedIn</a></li>',
      '          </ul>',
      '        </div>',
      '        <div class="footer__nav-col">',
      '          <h4>Support</h4>',
      '          <ul>',
      '            <li><a href="' + url('/faq.html') + '">FAQ</a></li>',
      '            <li><a href="mailto:support@smartpack.dk">support@smartpack.dk</a></li>',
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

      // dot farver
      var G = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3ecf8e;margin-right:5px;vertical-align:middle"></span>';
      var Y = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f0b429;margin-right:5px;vertical-align:middle"></span>';
      var R = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#e53e3e;margin-right:5px;vertical-align:middle"></span>';

      var dot, label, msg;
      var erWeekend = (day === 0 || day === 6);

      if (erWeekend) {
        // Weekend (lor+son)
        if (h >= 0 && h < 8)  { dot=R; label='Weekend'; msg='KUN driftstop &ndash; tast 9. Vi sover. Mandag &aring;bner normal support igen.'; }
        else if (h < 16)      { dot=Y; label='Weekend'; msg='KUN ved reel driftstop &ndash; tast 9. Ellers ses vi mandag igen.'; }
        else if (h < 20)      { dot=R; label='Weekend'; msg='Akut? Tast 9. KUN ved reel driftstop. Vi holder weekend.'; }
        else                  { dot=R; label='Weekend'; msg='KUN driftstop &ndash; tast 9. Vi sover. Mandag &aring;bner normal support igen.'; }
      } else {
        // Hverdag (man-fre)
        if (h >= 0 && h < 6)  { dot=R; label='Vi sover';     msg='KUN driftstop &ndash; tast 9. Vi sover. Overvej om det kan vente til kl.&nbsp;9.'; }
        else if (h < 9)       { dot=Y; label='&Aring;bner kl. 9'; msg='KUN driftstop: tast 9. Ellers er vi klar om lidt.'; }
        else if (h < 16)      { dot=G; label='Support &aring;ben'; msg='Ring til os &ndash; vi tager telefonen nu. &middot; Tast 2'; }
        else if (h < 20)      { dot=Y; label='Ulvetimen';    msg='Akut? Tast 9. KUN ved reel driftstop &ndash; vi har gang i ulvetimen.'; }
        else if (h < 23)      { dot=R; label='Sent';         msg='Akut? Tast 9. KUN driftstop &ndash; vi sover muligvis, hav t&aring;lmodighed.'; }
        else                  { dot=R; label='Vi sover';     msg='KUN driftstop &ndash; tast 9. Vi sover. Overvej om det kan vente til kl.&nbsp;9.'; }
      }

      // Ved aaben support: link er tast-2, ellers tast-9
      var href = (label === 'Support &aring;ben') ? 'tel:+4588202019' : 'tel:+4588202019';
      phoneEl.innerHTML = dot + '<strong style="color:var(--text-1)">' + label + '</strong> &middot; <a href="' + href + '" style="color:inherit">' + msg + '</a>';
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
