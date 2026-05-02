/* ============================================================
   SmartPack — Centraliseret footer
   Rediger KUN denne fil for at opdatere footer på ALLE sider.
   Tilføj tracking-scripts i "TRACKING" sektionen nedenfor.
   ============================================================ */
(function () {
  var placeholder = document.getElementById('sp-footer');
  if (!placeholder) return;

  placeholder.outerHTML = [
    '<footer class="footer">',
    '  <div class="container">',
    '    <div class="footer__top">',
    '      <div class="footer__brand">',
    '        <a href="/" class="footer__logo">',
    '          <img src="/assets/cropped-favicon-smartpack.png" alt="SmartPack" class="footer__logo-img">',
    '          <span>SmartPack</span>',
    '        </a>',
    '        <p class="footer__tagline">Bygget af e-k&oslash;bm&aelig;nd.<br>Til dig der er tr&aelig;t af lagerb&oslash;vl.</p>',
    '        <p class="footer__sub">Har du styr p&aring; lageret?</p>',
    '        <a href="/kontakt.html" class="footer__cta-btn">Lad os kigge p&aring; det sammen &rarr;</a>',
    '      </div>',
    '      <div class="footer__nav">',
    '        <div class="footer__nav-col">',
    '          <h4>Produkt</h4>',
    '          <ul>',
    '            <li><a href="/funktioner.html">Funktioner</a></li>',
    '            <li><a href="/integrationer.html">Integrationer</a></li>',
    '            <li><a href="/cases.html">Kundecases</a></li>',
    '            <li><a href="/priser.html">Priser</a></li>',
    '            <li><a href="/viden/">Vidensdatabase</a></li>',
    '            <li><a href="/3pl.html">3PL &amp; Lagerhoteller</a></li>',
    '          </ul>',
    '        </div>',
    '        <div class="footer__nav-col">',
    '          <h4>Virksomhed</h4>',
    '          <ul>',
    '            <li><a href="/om-os.html">Om os</a></li>',
    '            <li><a href="https://www.tiktok.com/@smartpackwms" target="_blank" rel="noopener">TikTok</a></li>',
    '            <li><a href="https://www.youtube.com/@SmartPackWMS">YouTube</a></li>',
    '            <li><a href="https://dk.linkedin.com/company/smartpackwms">LinkedIn</a></li>',
    '          </ul>',
    '        </div>',
    '        <div class="footer__nav-col">',
    '          <h4>Support</h4>',
    '          <ul>',
    '            <li><a href="/faq.html">FAQ</a></li>',
    '            <li><a href="mailto:support@smartpack.dk">support@smartpack.dk</a></li>',
    '            <li><a href="tel:+4588202019">+45 88 20 20 19 &middot; Tast 2</a></li>',
    '            <li><a href="tel:+4588202019">Akut? Tast 9. Selv hvis vi sover.</a></li>',
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
    '        <a href="/vilkaar.html">Vilk&aring;r</a> &middot; Fjernsupport:',
    '        <a href="https://download.teamviewer.com/download/TeamViewerQS.exe" target="_blank" rel="noopener">QuickSupport PC</a> &middot;',
    '        <a href="https://download.teamviewer.com/download/TeamViewerQS.dmg" target="_blank" rel="noopener">QuickSupport Mac</a> &middot;',
    '        <a href="https://download.teamviewer.com/download/TeamViewerQS.apk" target="_blank" rel="noopener">QuickSupport Android</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  // Sæt årstal dynamisk
  var y = document.getElementById('copy-year');
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     TRACKING — indsæt scripts her, fx:
     var s = document.createElement('script');
     s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX';
     document.head.appendChild(s);
     ============================================================ */

})();
