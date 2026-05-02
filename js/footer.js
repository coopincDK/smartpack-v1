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

    // Tidsstyret telefon i footer
    (function() {
      var now  = new Date();
      var day  = now.getDay();   // 0=son, 1=man...6=lor
      var hour = now.getHours(); // dansk lokal tid
      var erAabent = day >= 1 && day <= 5 && hour >= 8 && hour < 17;
      var phoneEl  = document.getElementById('footer-phone-ctx');
      if (!phoneEl) return;
      if (erAabent) {
        phoneEl.innerHTML = '<a href="tel:+4588202019" style="color:inherit">Ring til os nu &middot; +45 88 20 20 19 &middot; Tast 2</a>';
      } else {
        var erWeekend = day === 0 || day === 6;
        var label = erWeekend ? 'Weekend' : 'Aften';
        phoneEl.innerHTML = '<a href="tel:+4588202019" style="color:inherit">' + label + '? Tast 9 &middot; vi er p&aring; vagt</a>';
      }
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
