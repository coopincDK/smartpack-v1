/* ============================================================
   SmartPack Contact Overlay v2 — lys tema, clean design
   ============================================================ */
(function () {
  'use strict';
  if (document.getElementById('spcov-root')) return;

  var _base = window._spcovBase || '';

  /* ─── CSS ────────────────────────────────────────────────────────── */
  var css = [
    '@keyframes spcov-in{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
    '@keyframes spcov-fade{from{opacity:0}to{opacity:1}}',
    '.spcov-overlay{--a:#10b981;--a2:#059669;--red:#ef4444;--t:#0f172a;--t2:#374151;--t3:#6b7280;--modal-bg:#ffffff;--surf:#f8fafc;--card-bg:#ffffff;--border:#e2e8f0;--div:#f1f5f9;--dot:#cbd5e1;--sect-col:#94a3b8;--font:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:none;position:fixed;inset:0;z-index:9999;background:rgba(11,18,32,.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:1rem;}',
    '.spcov-overlay.active{display:flex;animation:spcov-fade .18s ease}',
    '[data-theme="dark"] .spcov-overlay{--t:#f8fafc;--t2:#cbd5e1;--t3:#94a3b8;--modal-bg:#111827;--surf:#1e293b;--card-bg:#1e293b;--border:#334155;--div:rgba(255,255,255,.07);--dot:#334155;--sect-col:#6b7280;}',
    '',
    '.spcov-overlay .sp-modal{background:var(--modal-bg);border-radius:1.25rem;box-shadow:0 32px 80px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.2);width:100%;max-width:520px;max-height:92vh;overflow-y:auto;font-family:var(--font);color:var(--t);animation:spcov-in .28s cubic-bezier(.22,1,.36,1);scrollbar-width:thin;scrollbar-color:var(--border) transparent;}',
    '.spcov-overlay .sp-topbar{display:flex;align-items:center;justify-content:space-between;padding:1.125rem 1.375rem;border-bottom:1px solid var(--div);background:var(--modal-bg);border-radius:1.25rem 1.25rem 0 0;}',
    '.spcov-overlay .sp-brand{display:flex;align-items:center;gap:.5rem;}',
    '.spcov-overlay .sp-brand-logo{width:28px;height:28px;border-radius:.4rem;object-fit:contain;}',
    '.spcov-overlay .sp-brand-name{font-size:.9375rem;font-weight:700;color:var(--t);}',
    '.spcov-overlay .sp-close{background:none;border:none;cursor:pointer;width:2rem;height:2rem;border-radius:.5rem;display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:1rem;transition:background .15s,color .15s;}',
    '.spcov-overlay .sp-close:hover{background:var(--surf);color:var(--t);}',
    '.spcov-overlay .sp-body{padding:1.5rem 1.375rem;background:var(--modal-bg);}',
    '.spcov-overlay .sp-heading{margin-bottom:1.25rem;}',
    '.spcov-overlay .sp-title{font-size:1.25rem;font-weight:800;color:var(--t);margin:0 0 .25rem;}',
    '.spcov-overlay .sp-sub{font-size:.875rem;color:var(--t3);margin:0;line-height:1.5;}',
    '.spcov-overlay .sp-steps{display:flex;align-items:center;gap:.5rem;margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--div);}',
    '.spcov-overlay .sp-dot{width:8px;height:8px;border-radius:50%;background:var(--dot);transition:all .2s;}',
    '.spcov-overlay .sp-dot.active{background:var(--a);transform:scale(1.3);}',
    '.spcov-overlay .sp-dot.done{background:var(--a);opacity:.45;}',
    '.spcov-overlay .sp-step-lbl{font-size:.75rem;color:var(--t3);margin-left:auto;}',
    '.spcov-overlay .step{display:none;}',
    '.spcov-overlay .step.active{display:block;animation:spcov-in .2s ease;}',
    '.spcov-overlay .sp-sect-lbl{font-size:.6875rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--sect-col);margin:0 0 .75rem;}',
    '.spcov-overlay .sp-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}',
    '.spcov-overlay .sp-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.75rem;}',
    '.spcov-overlay .sp-field:last-child{margin-bottom:0;}',
    '.spcov-overlay .sp-field label{font-size:.8125rem;font-weight:500;color:var(--t2);}',
    '.spcov-overlay .sp-field .req{color:var(--a);}',
    '.spcov-overlay .sp-field input,.spcov-overlay .sp-field textarea,.spcov-overlay .sp-field select{padding:.625rem .875rem;border-radius:.5rem;border:1.5px solid var(--border);background:var(--surf);color:var(--t);font-family:var(--font);font-size:.875rem;outline:none;transition:border-color .15s,box-shadow .15s;width:100%;box-sizing:border-box;}',
    '.spcov-overlay .sp-field input:focus,.spcov-overlay .sp-field textarea:focus{border-color:var(--a);box-shadow:0 0 0 3px rgba(16,185,129,.12);}',
    '.spcov-overlay .sp-field input::placeholder,.spcov-overlay .sp-field textarea::placeholder{color:var(--t3);}',
    '.spcov-overlay .sp-field textarea{resize:vertical;min-height:80px;}',
    '.spcov-overlay .sp-type-btn{display:flex;align-items:center;gap:.875rem;padding:.875rem 1rem;margin-bottom:.5rem;background:var(--card-bg);border:1.5px solid var(--border);border-radius:.75rem;cursor:pointer;text-align:left;width:100%;transition:all .15s;}',
    '.spcov-overlay .sp-type-btn:last-child{margin-bottom:0;}',
    '.spcov-overlay .sp-type-btn:hover{border-color:var(--a);background:var(--surf);}',
    '.spcov-overlay .sp-type-btn.selected{border-color:var(--a);background:rgba(16,185,129,.08);}',
    '.spcov-overlay .sp-type-icon{font-size:1.375rem;flex-shrink:0;width:2.25rem;text-align:center;}',
    '.spcov-overlay .sp-type-text{flex:1;}',
    '.spcov-overlay .sp-type-title{font-size:.9375rem;font-weight:600;color:var(--t);display:block;}',
    '.spcov-overlay .sp-type-desc{font-size:.8125rem;color:var(--t3);margin-top:.1rem;}',
    '.spcov-overlay .sp-type-arrow{color:var(--t3);font-size:.875rem;margin-left:auto;flex-shrink:0;transition:color .15s,transform .15s;}',
    '.spcov-overlay .sp-type-btn:hover .sp-type-arrow{color:var(--a);transform:translateX(3px);}',
    '.spcov-overlay .sp-back{background:none;border:none;cursor:pointer;font-family:var(--font);font-size:.8125rem;color:var(--t3);padding:0 0 1.125rem;display:flex;align-items:center;gap:.3rem;transition:color .15s;}',
    '.spcov-overlay .sp-back:hover{color:var(--t);}',
    '.spcov-overlay .sp-section{margin-bottom:1.25rem;}',
    '.spcov-overlay .sp-section-title{font-size:.8125rem;font-weight:600;color:var(--t);display:flex;align-items:center;gap:.4rem;margin-bottom:.625rem;}',
    '.spcov-overlay .badge-opt{font-size:.7rem;background:var(--surf);color:var(--t3);border-radius:.25rem;padding:.1rem .35rem;font-weight:400;}',
    '.spcov-overlay .sp-stepper{display:flex;align-items:center;gap:.5rem;}',
    '.spcov-overlay .sp-stepper button{width:2rem;height:2rem;border-radius:.375rem;border:1.5px solid var(--border);background:var(--surf);color:var(--t);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .15s;flex-shrink:0;}',
    '.spcov-overlay .sp-stepper button:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-stepper input{width:5rem;text-align:center;padding:.5rem;border-radius:.5rem;border:1.5px solid var(--border);background:var(--surf);color:var(--t);font-family:var(--font);font-size:.875rem;outline:none;box-sizing:border-box;}',
    '.spcov-overlay .sp-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:.375rem;}',
    '.spcov-overlay .sp-check-item{display:flex;align-items:center;gap:.5rem;padding:.5rem .625rem;background:var(--surf);border:1.5px solid var(--border);border-radius:.5rem;cursor:pointer;font-size:.8125rem;color:var(--t2);transition:all .15s;}',
    '.spcov-overlay .sp-check-item:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-check-item.checked{border-color:var(--a);background:rgba(16,185,129,.08);color:var(--t);}',
    '.spcov-overlay .sp-check-item input[type=checkbox]{accent-color:var(--a);cursor:pointer;flex-shrink:0;}',
    '.spcov-overlay .sp-urgency-row{display:flex;gap:.375rem;flex-wrap:wrap;}',
    '.spcov-overlay .sp-urgency-btn{flex:1;min-width:3rem;padding:.625rem .375rem;border-radius:.625rem;border:1.5px solid var(--border);background:var(--surf);color:var(--t3);font-size:.8125rem;font-family:var(--font);cursor:pointer;text-align:center;transition:all .15s;line-height:1.4;}',
    '.spcov-overlay .sp-urgency-btn span{font-size:.75rem;display:block;}',
    '.spcov-overlay .sp-urgency-btn:hover{border-color:var(--a);color:var(--t);}',
    '.spcov-overlay .sp-urgency-btn.selected{border-color:var(--a);background:rgba(16,185,129,.1);color:var(--t);font-weight:600;}',
    '.spcov-overlay .sp-chip-group{display:flex;flex-wrap:wrap;gap:.375rem;}',
    '.spcov-overlay .sp-chip{padding:.4rem .75rem;border-radius:2rem;border:1.5px solid var(--border);background:var(--surf);color:var(--t2);font-size:.8125rem;cursor:pointer;transition:all .15s;user-select:none;}',
    '.spcov-overlay .sp-chip input{position:absolute;opacity:0;pointer-events:none;}',
    '.spcov-overlay .sp-chip:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-chip.selected{border-color:var(--a);background:rgba(16,185,129,.1);color:var(--t);font-weight:500;}',
    '.spcov-overlay .sp-ql{display:flex;align-items:center;gap:.875rem;padding:.875rem 1rem;background:var(--surf);border:1.5px solid var(--border);border-radius:.75rem;text-decoration:none;margin-bottom:1rem;transition:border-color .15s;}',
    '.spcov-overlay .sp-ql:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-ql-icon{font-size:1.25rem;}',
    '.spcov-overlay .sp-ql-title{font-size:.875rem;font-weight:600;color:var(--t);display:block;}',
    '.spcov-overlay .sp-ql-desc{font-size:.8rem;color:var(--t3);}',
    '.spcov-overlay .sp-ql-arrow{margin-left:auto;color:var(--t3);}',
    '.spcov-overlay .sp-callout{display:flex;gap:.625rem;padding:.75rem 1rem;background:rgba(251,191,36,.08);border-radius:.625rem;border:1px solid rgba(251,191,36,.2);margin-bottom:1rem;font-size:.8125rem;color:var(--t2);line-height:1.5;}',
    '.spcov-overlay .sp-nl-check{display:flex;align-items:flex-start;gap:.5rem;margin:.75rem 0;font-size:.8125rem;color:var(--t2);cursor:pointer;line-height:1.4;}',
    '.spcov-overlay .sp-nl-check input[type=checkbox]{margin-top:.15rem;accent-color:var(--a);cursor:pointer;flex-shrink:0;}',
    '.spcov-overlay .sp-btn{width:100%;padding:.8125rem 1.5rem;border-radius:.625rem;border:none;cursor:pointer;background:var(--a);color:#fff;font-family:var(--font);font-size:.9375rem;font-weight:600;transition:background .15s,transform .1s;margin-top:1.25rem;}',
    '.spcov-overlay .sp-btn:hover{background:var(--a2);}',
    '.spcov-overlay .sp-btn:active{transform:scale(.99);}',
    '.spcov-overlay .sp-btn:disabled{opacity:.5;cursor:not-allowed;}',
    '.spcov-overlay .sp-err{font-size:.8125rem;color:var(--red);padding:.5rem .75rem;background:rgba(239,68,68,.08);border-radius:.375rem;border:1px solid rgba(239,68,68,.2);margin-top:.75rem;display:none;}',
    '.spcov-overlay .sp-success{text-align:center;padding:2.5rem 1rem;}',
    '.spcov-overlay .sp-success-icon{width:3.5rem;height:3.5rem;border-radius:50%;background:rgba(16,185,129,.1);border:2px solid var(--a);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--a);margin:0 auto 1rem;}',
    '.spcov-overlay .sp-success-title{font-size:1.125rem;font-weight:700;color:var(--t);margin-bottom:.5rem;}',
    '.spcov-overlay .sp-success-text{font-size:.875rem;color:var(--t3);margin-bottom:1.5rem;line-height:1.6;}',
    '.spcov-overlay .sp-hr{border:none;border-top:1px solid var(--div);margin:1rem 0;}',
    '@media(max-width:480px){.spcov-overlay .sp-row,.spcov-overlay .sp-check-grid{grid-template-columns:1fr;}.spcov-overlay .sp-body{padding:1.25rem 1rem;}.spcov-overlay .sp-modal{border-radius:1rem;}}'
  ].join('')

  var styleEl = document.createElement('style');
  styleEl.id = 'spcov-css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ─── HTML ─────────────────────────────────────────────────────────── */
  var logoSrc = _base + '/assets/cropped-favicon-smartpack.png';

  var root = document.createElement('div');
  root.id = 'spcov-root';
  root.innerHTML = [
    '<div class="spcov-overlay" id="spcov-overlay">',
    '<div class="sp-modal" id="spcov-modal">',

    /* top bar: logo + close */
    '<div class="sp-topbar">',
    '  <div class="sp-brand">',
    '    <img class="sp-brand-logo" src="' + logoSrc + '" alt="SmartPack">',
    '    <span class="sp-brand-name">SmartPack</span>',
    '  </div>',
    '  <button class="sp-close" onclick="spcov.close()" aria-label="Luk">&#x2715;</button>',
    '</div>',

    /* body */
    '<div class="sp-body">',

    /* ── Step 1 ── */
    '<div class="step active" id="spcov-s1">',
    '  <div class="sp-heading">',
    '    <h2 class="sp-title">Hvad kan vi hjælpe med?</h2>',
    '    <p class="sp-sub">Udfyld dine oplysninger og vælg emne. Vi kommer normalt retur inden for en hverdag.</p>',
    '  </div>',
    '  <div class="sp-steps" id="spcov-step-ind">',
    '    <div class="sp-dot active" id="spcov-dot-1"></div>',
    '    <div class="sp-dot" id="spcov-dot-2"></div>',
    '    <span class="sp-step-lbl" id="spcov-step-lbl">Trin 1 af 2</span>',
    '  </div>',
    '  <div class="sp-row">',
    '    <div class="sp-field"><label for="spcov-name">Navn <span class="req">*</span></label><input type="text" id="spcov-name" placeholder="Mikkel Hansen" autocomplete="name"></div>',
    '    <div class="sp-field"><label for="spcov-company">Virksomhed <span class="req">*</span></label><input type="text" id="spcov-company" placeholder="Webshop ApS" autocomplete="organization"></div>',
    '  </div>',
    '  <div class="sp-field"><label for="spcov-email">E-mail <span class="req">*</span></label><input type="email" id="spcov-email" placeholder="mikkel@firma.dk" autocomplete="email"></div>',
    '  <div id="spcov-s1-error" class="sp-err">Udfyld venligst navn, virksomhed og en gyldig e-mail.</div>',
    '  <hr class="sp-hr">',
    '  <div class="sp-sect-lbl">Hvad handler det om?</div>',
    '  <button class="sp-type-btn" onclick="spcov.chooseType(this,\'learn\')">',
    '    <span class="sp-type-icon">&#x1F4E6;</span>',
    '    <span class="sp-type-text"><span class="sp-type-title">Hør mere om SmartPack</span><span class="sp-type-desc">Vi ser på jeres setup og finder flaskehalsene</span></span>',
    '    <span class="sp-type-arrow">&#8594;</span>',
    '  </button>',
    '  <button class="sp-type-btn" onclick="spcov.chooseType(this,\'general\')">',
    '    <span class="sp-type-icon">&#x1F4AC;</span>',
    '    <span class="sp-type-text"><span class="sp-type-title">Generel henvendelse</span><span class="sp-type-desc">Spørgsmål, samarbejde eller andet</span></span>',
    '    <span class="sp-type-arrow">&#8594;</span>',
    '  </button>',
    '  <button class="sp-type-btn" onclick="spcov.chooseType(this,\'support\')">',
    '    <span class="sp-type-icon">&#x1F6E0;</span>',
    '    <span class="sp-type-text"><span class="sp-type-title">Support</span><span class="sp-type-desc">Eksisterende kunde med et teknisk spørgsmål</span></span>',
    '    <span class="sp-type-arrow">&#8594;</span>',
    '  </button>',
    '</div>',

    /* ── Step 2a: Learn ── */
    '<div class="step" id="spcov-s2-learn">',
    '  <button class="sp-back" onclick="spcov.goBack()">&#8592; Tilbage</button>',
    '  <div class="sp-steps" id="spcov-step-ind-2">',
    '    <div class="sp-dot done"></div>',
    '    <div class="sp-dot active"></div>',
    '    <span class="sp-step-lbl">Trin 2 af 2</span>',
    '  </div>',
    '  <div class="sp-section">',
    '    <div class="sp-row">',
    '      <div class="sp-field"><label for="spcov-orders">Ordrer pr. dag</label>',
    '        <div class="sp-stepper"><button type="button" onclick="spcov.step(\'spcov-orders\',-10)">-</button><input type="number" id="spcov-orders" value="50" min="1"><button type="button" onclick="spcov.step(\'spcov-orders\',10)">+</button></div>',
    '      </div>',
    '      <div class="sp-field"><label for="spcov-empl">Medarbejdere på lager</label>',
    '        <div class="sp-stepper"><button type="button" onclick="spcov.step(\'spcov-empl\',-1)">-</button><input type="number" id="spcov-empl" value="3" min="1"><button type="button" onclick="spcov.step(\'spcov-empl\',1)">+</button></div>',
    '      </div>',
    '    </div>',
    '  </div>',

    /* shops */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">Webshop platform</div>',
    '    <div class="sp-check-grid">',
    '      <label class="sp-check-item"><input type="checkbox" name="shop" value="Shopify"><span>Shopify</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="shop" value="WooCommerce"><span>WooCommerce</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="shop" value="Magento"><span>Magento</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="shop" value="Dandomain"><span>Dandomain</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="shop" value="PrestaShop"><span>PrestaShop</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="shop" value="andet" onchange="spcov.toggleWrap(\'spcov-shop-andet-wrap\',this)"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-shop-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="sp-field"><input type="text" id="spcov-shop-andet" placeholder="Hvilken platform?"></div>',
    '    </div>',
    '  </div>',

    /* ERP */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">ERP / regnskab <span class="badge-opt">valgfrit</span></div>',
    '    <div class="sp-check-grid">',
    '      <label class="sp-check-item"><input type="checkbox" name="erp" value="e-conomic"><span>e-conomic</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="erp" value="Business Central"><span>Business Central</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="erp" value="Uniconta"><span>Uniconta</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="erp" value="Billy"><span>Billy</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="erp" value="SAP"><span>SAP</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="erp" value="andet" onchange="spcov.toggleWrap(\'spcov-erp-andet-wrap\',this)"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-erp-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="sp-field"><input type="text" id="spcov-erp-andet" placeholder="Hvilket system?"></div>',
    '    </div>',
    '  </div>',

    /* carriers */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">Fragtpartnere · Danmark <span class="badge-opt">valgfrit</span></div>',
    '    <div class="sp-check-grid">',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="GLS"><span>GLS</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="DAO"><span>DAO</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="PostNord"><span>PostNord</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Bring"><span>Bring</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Budbee"><span>Budbee</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Instabox"><span>Instabox</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="CoolRunner"><span>CoolRunner</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Shipmondo"><span>Shipmondo</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Airmee"><span>Airmee</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Leman"><span>Leman</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Freja Transport"><span>Freja Transport</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Xpressen"><span>Xpressen</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Danske Fragtmænd"><span>Danske Fragtmænd</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Cargoflux"><span>Cargoflux</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="Burd"><span>Burd</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_dk" value="anden_dk" onchange="spcov.toggleWrap(\'spcov-dk-andet-wrap\',this)"><span>Anden</span></label>',
    '    </div>',
    '    <div id="spcov-dk-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="sp-field"><input type="text" id="spcov-dk-andet" placeholder="Hvilken fragtpartner?"></div>',
    '    </div>',
    '  </div>',

    /* carriers INT */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">Fragtpartnere · International <span class="badge-opt">valgfrit</span></div>',
    '    <div class="sp-check-grid">',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="DHL Parcel"><span>DHL Parcel</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="DHL Express"><span>DHL Express</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="DHL eCommerce"><span>DHL eCommerce</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="DHL Freight"><span>DHL Freight</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="UPS"><span>UPS</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="Sendcloud"><span>Sendcloud</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="Webshipper"><span>Webshipper</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="WebrinQ"><span>WebrinQ</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="Blue Water"><span>Blue Water</span></label>',
    '      <label class="sp-check-item"><input type="checkbox" name="carrier_int" value="anden_int" onchange="spcov.toggleWrap(\'spcov-int-andet-wrap\',this)"><span>Anden</span></label>',
    '    </div>',
    '    <div id="spcov-int-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="sp-field"><input type="text" id="spcov-int-andet" placeholder="Hvilken fragtpartner?"></div>',
    '    </div>',
    '  </div>',

    /* urgency */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">Hvornår vil I gerne i gang?</div>',
    '    <div class="sp-urgency-row">',
    '      <button type="button" class="sp-urgency-btn" data-u="1" onclick="spcov.setUrgency(1)">&#x1F50D;<br><span>Afsøger inspiration</span></button>',
    '      <button type="button" class="sp-urgency-btn" data-u="2" onclick="spcov.setUrgency(2)">&#x1F4AC;<br><span>Overvejer seriøst</span></button>',
    '      <button type="button" class="sp-urgency-btn selected" data-u="3" onclick="spcov.setUrgency(3)">&#x1F4CB;<br><span>Aktivt på udkig</span></button>',
    '      <button type="button" class="sp-urgency-btn" data-u="4" onclick="spcov.setUrgency(4)">&#x26A1;<br><span>Klar til at gå i gang</span></button>',
    '      <button type="button" class="sp-urgency-btn" data-u="5" onclick="spcov.setUrgency(5)">&#x1F525;<br><span>Hellere i går end i dag</span></button>',
    '    </div>',
    '    <input type="hidden" id="spcov-urgency" value="3">',
    '  </div>',

    /* contact info */
    '  <div class="sp-section">',
    '    <div class="sp-row">',
    '      <div class="sp-field"><label for="spcov-phone">Telefon <span class="badge-opt">valgfrit</span></label><input type="tel" id="spcov-phone" placeholder="+45 12 34 56 78" autocomplete="tel"></div>',
    '      <div class="sp-field"><label for="spcov-cvr">CVR-nummer <span class="badge-opt">valgfrit</span></label><input type="text" id="spcov-cvr" placeholder="12345678" maxlength="8"></div>',
    '    </div>',
    '  </div>',

    /* source */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">Hvor har I hørt om SmartPack? <span class="badge-opt">valgfrit</span></div>',
    '    <div class="sp-chip-group">',
    '      <label class="sp-chip"><input type="radio" name="source" value="LinkedIn"><span>LinkedIn</span></label>',
    '      <label class="sp-chip"><input type="radio" name="source" value="Google"><span>Google</span></label>',
    '      <label class="sp-chip"><input type="radio" name="source" value="YouTube"><span>YouTube</span></label>',
    '      <label class="sp-chip"><input type="radio" name="source" value="TikTok"><span>TikTok</span></label>',
    '      <label class="sp-chip"><input type="radio" name="source" value="Anbefaling"><span>Anbefaling</span></label>',
    '      <label class="sp-chip"><input type="radio" name="source" value="AI"><span>AI / ChatGPT</span></label>',
    '      <label class="sp-chip"><input type="radio" name="source" value="Event"><span>Event / messe</span></label>',
    '      <label class="sp-chip" id="spcov-chip-andet"><input type="radio" name="source" value="Andet"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-source-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="sp-field"><input type="text" id="spcov-source-andet" placeholder="Fx podcast, artikel, kollega..."></div>',
    '    </div>',
    '  </div>',

    /* comment */
    '  <div class="sp-section">',
    '    <div class="sp-section-title">Er der mere vi skal vide? <span class="badge-opt">valgfrit</span></div>',
    '    <div class="sp-field"><textarea id="spcov-comment" placeholder="Fx særlige krav, nuværende udfordringer..."></textarea></div>',
    '  </div>',

    '  <label class="sp-nl-check"><input type="checkbox" id="spcov-newsletter"> <span>Ja tak til praktiske tips om lager og logistik</span></label>',
    '  <div id="spcov-learn-error" class="sp-err">Noget gik galt. Prøv igen eller skriv direkte til os.</div>',
    '  <button class="sp-btn" id="spcov-learn-btn" onclick="spcov.submit()">Send forespørgsel &#8594;</button>',
    '</div>',

    /* ── Step 2b: General ── */
    '<div class="step" id="spcov-s2-general">',
    '  <button class="sp-back" onclick="spcov.goBack()">&#8592; Tilbage</button>',
    '  <div class="sp-steps">',
    '    <div class="sp-dot done"></div>',
    '    <div class="sp-dot active"></div>',
    '    <span class="sp-step-lbl">Trin 2 af 2</span>',
    '  </div>',
    '  <div class="sp-field"><label for="spcov-gen-subject">Emne <span class="req">*</span></label><input type="text" id="spcov-gen-subject" placeholder="Fx samarbejde, presse..."></div>',
    '  <div class="sp-field"><label for="spcov-gen-msg">Din besked <span class="req">*</span></label><textarea id="spcov-gen-msg" placeholder="Skriv hvad du har på hjerte..."></textarea></div>',
    '  <label class="sp-nl-check"><input type="checkbox" id="spcov-newsletter"> <span>Ja tak til praktiske tips om lager og logistik</span></label>',
    '  <div id="spcov-general-error" class="sp-err">Noget gik galt. Prøv igen eller skriv direkte til os.</div>',
    '  <button class="sp-btn" id="spcov-general-btn" onclick="spcov.submit()">Send besked &#8594;</button>',
    '</div>',

    /* ── Step 2c: Support ── */
    '<div class="step" id="spcov-s2-support">',
    '  <button class="sp-back" onclick="spcov.goBack()">&#8592; Tilbage</button>',
    '  <div class="sp-steps">',
    '    <div class="sp-dot done"></div>',
    '    <div class="sp-dot active"></div>',
    '    <span class="sp-step-lbl">Trin 2 af 2</span>',
    '  </div>',
    '  <a class="sp-ql" href="https://support.smartpack.dk/" target="_blank" rel="noopener">',
    '    <span class="sp-ql-icon">&#x26A1;</span>',
    '    <div><span class="sp-ql-title">Få svar med det samme</span><span class="sp-ql-desc">support.smartpack.dk - artikler, guides og chat</span></div>',
    '    <span class="sp-ql-arrow">&#x2197;</span>',
    '  </a>',
    '  <div class="sp-callout"><span>&#x1F4DE;</span>&nbsp;<span>Akut problem? <strong>Ring til os direkte</strong> - superbrugere har fri telefon 24/7.</span></div>',
    '  <div class="sp-field"><label for="spcov-sup-subject">Emne <span class="req">*</span></label><input type="text" id="spcov-sup-subject" placeholder="Fx Scanner virker ikke..."></div>',
    '  <div class="sp-field"><label for="spcov-sup-msg">Beskriv problemet <span class="req">*</span></label><textarea id="spcov-sup-msg" placeholder="Hvad sker der? Hvornår startede det?"></textarea></div>',
    '  <label class="sp-nl-check"><input type="checkbox" id="spcov-newsletter"> <span>Ja tak til praktiske tips om lager og logistik</span></label>',
    '  <div id="spcov-support-error" class="sp-err">Noget gik galt. Prøv igen eller skriv direkte til os.</div>',
    '  <button class="sp-btn" id="spcov-support-btn" onclick="spcov.submit()">Send support-sag &#8594;</button>',
    '</div>',

    /* ── Step 3: Success ── */
    '<div class="step" id="spcov-s3">',
    '  <div class="sp-success">',
    '    <div class="sp-success-icon">&#x2713;</div>',
    '    <div class="sp-success-title" id="spcov-ok-title">Modtaget!</div>',
    '    <p class="sp-success-text" id="spcov-ok-text">Vi kommer normalt retur inden for en hverdag.</p>',
    '    <button class="sp-btn" onclick="spcov.close()" style="max-width:200px;margin:0 auto">Luk &#8594;</button>',
    '  </div>',
    '</div>',

    '</div>', /* /sp-body */
    '</div>', /* /sp-modal */
    '</div>'  /* /spcov-overlay */
  ].join('');

  document.body.appendChild(root);

  /* ─── Helpers ─────────────────────────────────────────────────────── */
  var selectedType = null;
  var g = function (id) { return document.getElementById(id); };

  function showStep(id) {
    root.querySelectorAll('.step').forEach(function (s) { s.classList.remove('active'); });
    var el = g(id); if (el) el.classList.add('active');
    g('spcov-modal').scrollTop = 0;
  }

  function validateStep1() {
    var n = g('spcov-name').value.trim();
    var c = g('spcov-company').value.trim();
    var e = g('spcov-email').value.trim();
    return n && c && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function collectData() {
    var d = {
      type: selectedType,
      name: g('spcov-name').value.trim(),
      company: g('spcov-company').value.trim(),
      email: g('spcov-email').value.trim()
    };
    if (selectedType === 'learn') {
      d.orders = g('spcov-orders').value;
      d.employees = g('spcov-empl').value;
      d.shops = Array.from(root.querySelectorAll('[name="shop"]:checked')).map(function (el) { return el.value; });
      d.shop_andet = (g('spcov-shop-andet') || {}).value || '';
      d.erp = Array.from(root.querySelectorAll('[name="erp"]:checked')).map(function (el) { return el.value; });
      d.erp_andet = (g('spcov-erp-andet') || {}).value || '';
      d.carriers_dk = Array.from(root.querySelectorAll('[name="carrier_dk"]:checked')).map(function (el) { return el.value; });
      d.carriers_dk_andet = (g('spcov-dk-andet') || {}).value || '';
      d.carriers_int = Array.from(root.querySelectorAll('[name="carrier_int"]:checked')).map(function (el) { return el.value; });
      d.carriers_int_andet = (g('spcov-int-andet') || {}).value || '';
      d.urgency = g('spcov-urgency').value;
      d.phone = (g('spcov-phone') || {}).value || '';
      d.cvr = (g('spcov-cvr') || {}).value || '';
      var src = root.querySelector('[name="source"]:checked');
      d.source = src ? src.value : '';
      d.source_andet = (g('spcov-source-andet') || {}).value || '';
      d.comment = (g('spcov-comment') || {}).value || '';
      d.newsletter = (g('spcov-newsletter') || {}).checked ? 'Ja' : 'Nej';
    } else if (selectedType === 'general') {
      d.subject = g('spcov-gen-subject').value.trim();
      d.message = g('spcov-gen-msg').value.trim();
      d.newsletter = (g('spcov-newsletter') || {}).checked ? 'Ja' : 'Nej';
    } else if (selectedType === 'support') {
      d.subject = g('spcov-sup-subject').value.trim();
      d.message = g('spcov-sup-msg').value.trim();
      d.newsletter = (g('spcov-newsletter') || {}).checked ? 'Ja' : 'Nej';
    }
    return d;
  }

  function showErr(id) { var el = g(id); if (el) el.style.display = 'block'; }
  function hideErr(id) { var el = g(id); if (el) el.style.display = 'none'; }

  /* ─── Public API ──────────────────────────────────────────────────── */
  window.spcov = {
    open: function () {
      g('spcov-overlay').classList.add('active');
      document.body.style.overflow = 'hidden';

    },
    close: function () {
      g('spcov-overlay').classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function () { window.spcov.reset(); }, 350);
    },
    reset: function () {
      selectedType = null;
      root.querySelectorAll('.sp-type-btn,.sp-chip,.sp-urgency-btn').forEach(function (el) { el.classList.remove('selected'); });
      root.querySelectorAll('input:not([type="number"]),textarea').forEach(function (el) {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
        else el.value = '';
      });
      if (g('spcov-orders')) g('spcov-orders').value = 50;
      if (g('spcov-empl'))   g('spcov-empl').value   = 3;
      if (g('spcov-urgency')) g('spcov-urgency').value = 3;
      var defU = root.querySelector('.sp-urgency-btn[data-u="3"]');
      if (defU) defU.classList.add('selected');
      ['spcov-shop-andet-wrap','spcov-erp-andet-wrap','spcov-dk-andet-wrap','spcov-source-andet-wrap'].forEach(function (id) {
        var el = g(id); if (el) el.style.display = 'none';
      });
      ['spcov-s1-error','spcov-learn-error','spcov-general-error','spcov-support-error'].forEach(hideErr);
      root.querySelectorAll('.sp-check-item').forEach(function (el) { el.classList.remove('checked'); });
      root.querySelectorAll('[style*="borderColor"]').forEach(function (el) { el.style.borderColor = ''; });
      root.querySelectorAll('.sp-btn').forEach(function (btn) { btn.disabled = false; });
      showStep('spcov-s1');
    },
    chooseType: function (btn, type) {
      if (!validateStep1()) {
        showErr('spcov-s1-error');
        ['spcov-name','spcov-company','spcov-email'].forEach(function (id) {
          var el = g(id);
          var bad = !el.value.trim() || (id === 'spcov-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
          if (bad) { el.style.borderColor = 'var(--red)'; el.focus(); }
        });
        return;
      }
      hideErr('spcov-s1-error');
      root.querySelectorAll('.sp-type-btn').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedType = type;
      var steps = { learn: 'spcov-s2-learn', general: 'spcov-s2-general', support: 'spcov-s2-support' };
      showStep(steps[type]);
    },
    goBack: function () { showStep('spcov-s1'); },
    step: function (id, delta) {
      var el = g(id); if (!el) return;
      el.value = Math.max(1, (parseInt(el.value) || 1) + delta);
    },
    setUrgency: function (val) {
      if (g('spcov-urgency')) g('spcov-urgency').value = val;
      root.querySelectorAll('.sp-urgency-btn').forEach(function (b) {
        b.classList.toggle('selected', parseInt(b.dataset.u) === val);
      });
    },
    toggleWrap: function (wrapId, cb) {
      var el = g(wrapId); if (el) el.style.display = cb.checked ? 'block' : 'none';
    },
    submit: async function () {
      var errId = { learn: 'spcov-learn-error', general: 'spcov-general-error', support: 'spcov-support-error' }[selectedType];
      var btnId = { learn: 'spcov-learn-btn', general: 'spcov-general-btn', support: 'spcov-support-btn' }[selectedType];
      var btn = g(btnId);
      hideErr(errId);

      if (selectedType === 'general') {
        if (!g('spcov-gen-subject').value.trim() || !g('spcov-gen-msg').value.trim()) { showErr(errId); return; }
      } else if (selectedType === 'support') {
        if (!g('spcov-sup-subject').value.trim() || !g('spcov-sup-msg').value.trim()) { showErr(errId); return; }
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sender...'; }
      var data = collectData();

      function openMailto() {
        var to = selectedType === 'learn' ? 'bundlinjeboost@smartpack.dk' : 'support@smartpack.dk';
        var typeLabels = { learn: '[Lead]', general: '[Generel]', support: '[Support]' };
        var subj = encodeURIComponent((typeLabels[selectedType] || '') + ' ' + data.name + ' - ' + data.company);
        var body = encodeURIComponent('Navn: ' + data.name + '\nEmail: ' + data.email + '\n\n' + buildMessage(data));
        window.open('mailto:' + to + '?subject=' + subj + '&body=' + body);
        g('spcov-ok-title').textContent = data.name.split(' ')[0] + ', vi har sendt dig et udkast!';
        g('spcov-ok-text').textContent = 'Din email-klient er åbnet. Send den afsted og vi vender tilbage.';
        showStep('spcov-s3');
      }

      /* Sørg for EmailJS er loaded og initialiseret */
      if (typeof emailjs === 'undefined') {
        await new Promise(function (resolve, reject) {
          var s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
          s.onload = function () { emailjs.init({ publicKey: 'aF4PLh0ndPGtWwSLx' }); resolve(); };
          s.onerror = reject;
          document.head.appendChild(s);
        });
      } else if (!window._ejsInited) {
        emailjs.init({ publicKey: 'aF4PLh0ndPGtWwSLx' });
        window._ejsInited = true;
      }

      var urgencyLabels = {'1':'Afsøger inspiration','2':'Overvejer seriøst','3':'Aktivt på udkig','4':'Klar til at gå i gang','5':'Hellere i går end i dag'};

      function buildMessage(d) {
        var lines = [];
        var add = function(label, val) { if (val) lines.push(label + ': ' + val); };
        add('Virksomhed', d.company);
        if (d.type === 'learn') {
          add('Ordrer pr. dag', d.orders);
          add('Medarbejdere', d.employees);
          add('Webshop platform', (d.shops || []).join(', ') + (d.shop_andet ? ' (' + d.shop_andet + ')' : ''));
          add('ERP', (d.erp || []).join(', ') + (d.erp_andet ? ' (' + d.erp_andet + ')' : ''));
          add('Fragtpartner DK', (d.carriers_dk || []).join(', ') + (d.carriers_dk_andet ? ' (' + d.carriers_dk_andet + ')' : ''));
          add('Fragtpartner INT', (d.carriers_int || []).join(', ') + (d.carriers_int_andet ? ' (' + d.carriers_int_andet + ')' : ''));
          add('Hastegrad', urgencyLabels[String(d.urgency)] || d.urgency);
          add('Telefon', d.phone);
          add('CVR', d.cvr);
          add('Hørt via', (d.source || '') + (d.source_andet ? ' (' + d.source_andet + ')' : ''));
          add('Kommentar', d.comment);
          add('Nyhedsbrev', d.newsletter === 'Ja' ? 'Ja (' + d.email + ')' : 'Nej');
        } else {
          add('Emne', d.subject);
          add('Besked', d.message);
          add('Nyhedsbrev', d.newsletter === 'Ja' ? 'Ja (' + d.email + ')' : 'Nej');
        }
        return lines.join('\n');
      }

      var typeLabels = { learn: '[Lead]', general: '[Generel]', support: '[Support]' };
      var toEmail = data.type === 'learn' ? 'bundlinjeboost@smartpack.dk' : 'support@smartpack.dk';
      var params = {
        to_email: toEmail,
        subject:  (typeLabels[data.type] || '') + ' ' + data.name + ' - ' + data.company,
        name:     data.name,
        email:    data.email,
        message:  buildMessage(data)
      };

      try {
        await emailjs.send('service_otu5dlt', 'template_rbiz8zh', params);
        // Gem nyhedsbrev tilmelding i Supabase hvis afkrydset
        if (data.newsletter === 'Ja') {
          try {
            var nlBody = { email: data.email.toLowerCase().trim() };
            if (data.name)    nlBody.name    = data.name.trim();
            if (data.company) nlBody.company = data.company.trim();
            fetch('https://midtkaplyhxhrdtujmda.supabase.co/rest/v1/newsletter_subscribers', {
              method: 'POST',
              headers: {
                'Content-Type':  'application/json',
                'apikey':        'sb_publishable_TMt9jbZhbV8KzrvDUA7kuA_RXZW4mwE',
                'Authorization': 'Bearer sb_publishable_TMt9jbZhbV8KzrvDUA7kuA_RXZW4mwE',
                'Prefer':        'return=minimal'
              },
              body: JSON.stringify(nlBody)
            }); // fire-and-forget, 409 = allerede tilmeldt er OK
          } catch (nlErr) { /* ignorer - emailjs var OK */ }
        }
        var sent = true;
        if (sent) {
          var titles = { learn: 'Vi gl\u00e6der os til en snak!', general: 'Tak for din besked!', support: 'Support-sag modtaget!' };
          var texts = { learn: 'Vi kigger p\u00e5 jeres setup og vender tilbage inden for 24 timer. Ingen salgspitch.', general: 'Vi kommer normalt retur inden for en hverdag.', support: 'Vi kigger p\u00e5 det hurtigst muligt. Br\u00e6nder det? Ring direkte.' };
          g('spcov-ok-title').textContent = data.name.split(' ')[0] + ', ' + (titles[selectedType] || 'tak!');
          g('spcov-ok-text').textContent  = texts[selectedType] || '';
          showStep('spcov-s3');
        } else { openMailto(); }
      } catch (e) { openMailto(); }
      finally { if (btn) btn.disabled = false; }
    }
  };

  /* chip delegation */
  root.addEventListener('click', function (e) {
    var chip = e.target.closest('.sp-chip');
    if (!chip) return;
    var inp = chip.querySelector('input[type="radio"]');
    if (!inp) return;
    root.querySelectorAll('[name="' + inp.name + '"]').forEach(function (r) { r.closest('.sp-chip').classList.remove('selected'); });
    chip.classList.add('selected'); inp.checked = true;
    if (inp.name === 'source') {
      var w = g('spcov-source-andet-wrap');
      if (w) w.style.display = inp.value === 'Andet' ? 'block' : 'none';
    }
  });

  /* checkbox visual */
  root.addEventListener('change', function (e) {
    if (e.target.type === 'checkbox') {
      var item = e.target.closest('.sp-check-item');
      if (item) item.classList.toggle('checked', e.target.checked);
    }
  });

  /* clear error borders */
  ['spcov-name','spcov-company','spcov-email'].forEach(function (id) {
    var el = g(id); if (!el) return;
    el.addEventListener('input', function () {
      el.style.borderColor = '';
      if (validateStep1()) hideErr('spcov-s1-error');
    });
  });

  /* ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && g('spcov-overlay').classList.contains('active')) spcov.close();
  });

  /* backdrop-luk: kun hvis både mousedown og mouseup sker på backdrop (ikke ved drag/copy-paste) */
  var _bdDown = false;
  g('spcov-overlay').addEventListener('mousedown', function (e) {
    _bdDown = e.target === g('spcov-overlay');
  });
  g('spcov-overlay').addEventListener('mouseup', function (e) {
    if (_bdDown && e.target === g('spcov-overlay')) spcov.close();
    _bdDown = false;
  });

  /* intercept kontakt-links */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/kontakt/.test(href) || /bundlinjeboost@smartpack\.dk/.test(href) || href === '#cta' || a.hasAttribute('data-spcov')) {
      e.preventDefault(); spcov.open();
    }
  }, true);

})();
