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

    /* overlay backdrop */
    '.spcov-overlay{',
    '  --a:#1a8a5a;--a2:#16a065;--red:#dc2626;',
    '  --t:#0f172a;--t2:#374151;--t3:#6b7280;',
    '  --bg:#fff;--surf:#f8fafc;--border:#e2e8f0;',
    '  --font:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    '  display:none;position:fixed;inset:0;z-index:9999;',
    '  background:rgba(15,23,42,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
    '  align-items:center;justify-content:center;padding:1rem;',
    '}',
    '.spcov-overlay.active{display:flex;animation:spcov-fade .18s ease}',

    /* modal box */
    '.spcov-overlay .sp-modal{',
    '  background:#fff;border-radius:1.25rem;',
    '  box-shadow:0 32px 80px rgba(0,0,0,.18),0 8px 24px rgba(0,0,0,.08);',
    '  width:100%;max-width:520px;max-height:92vh;overflow-y:auto;',
    '  font-family:var(--font);color:var(--t);',
    '  animation:spcov-in .28s cubic-bezier(.22,1,.36,1);',
    '  scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent;',
    '}',

    /* modal top bar */
    '.spcov-overlay .sp-topbar{',
    '  display:flex;align-items:center;justify-content:space-between;',
    '  padding:1.125rem 1.375rem;border-bottom:1px solid #f1f5f9;',
    '}',
    '.spcov-overlay .sp-brand{display:flex;align-items:center;gap:.5rem;}',
    '.spcov-overlay .sp-brand-logo{width:28px;height:28px;border-radius:.4rem;object-fit:contain;}',
    '.spcov-overlay .sp-brand-name{font-size:.9375rem;font-weight:700;color:var(--t);}',
    '.spcov-overlay .sp-close{',
    '  background:none;border:none;cursor:pointer;',
    '  width:2rem;height:2rem;border-radius:.5rem;',
    '  display:flex;align-items:center;justify-content:center;',
    '  color:var(--t3);font-size:1rem;transition:background .15s,color .15s;',
    '}',
    '.spcov-overlay .sp-close:hover{background:#f1f5f9;color:var(--t);}',

    /* body padding */
    '.spcov-overlay .sp-body{padding:1.5rem 1.375rem;}',

    /* heading area */
    '.spcov-overlay .sp-heading{margin-bottom:1.25rem;}',
    '.spcov-overlay .sp-title{font-size:1.25rem;font-weight:800;color:var(--t);margin:0 0 .25rem;}',
    '.spcov-overlay .sp-sub{font-size:.875rem;color:var(--t3);margin:0;line-height:1.5;}',

    /* step indicator */
    '.spcov-overlay .sp-steps{',
    '  display:flex;align-items:center;gap:.5rem;margin-bottom:1.25rem;',
    '  padding-bottom:1.25rem;border-bottom:1px solid #f1f5f9;',
    '}',
    '.spcov-overlay .sp-dot{',
    '  width:8px;height:8px;border-radius:50%;background:#e2e8f0;transition:all .2s;',
    '}',
    '.spcov-overlay .sp-dot.active{background:var(--a);transform:scale(1.3);}',
    '.spcov-overlay .sp-dot.done{background:var(--a);opacity:.45;}',
    '.spcov-overlay .sp-step-lbl{font-size:.75rem;color:var(--t3);margin-left:auto;}',

    /* step panels */
    '.spcov-overlay .step{display:none;}',
    '.spcov-overlay .step.active{display:block;animation:spcov-in .2s ease;}',

    /* section label */
    '.spcov-overlay .sp-sect-lbl{',
    '  font-size:.6875rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;',
    '  color:var(--a);margin:0 0 .75rem;',
    '}',

    /* fields */
    '.spcov-overlay .sp-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}',
    '.spcov-overlay .sp-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.75rem;}',
    '.spcov-overlay .sp-field:last-child{margin-bottom:0;}',
    '.spcov-overlay .sp-field label{font-size:.8125rem;font-weight:500;color:var(--t2);}',
    '.spcov-overlay .sp-field .req{color:var(--a);}',
    '.spcov-overlay .sp-field input,.spcov-overlay .sp-field textarea,.spcov-overlay .sp-field select{',
    '  padding:.625rem .875rem;border-radius:.5rem;border:1.5px solid var(--border);',
    '  background:var(--surf);color:var(--t);font-family:var(--font);font-size:.875rem;',
    '  outline:none;transition:border-color .15s,box-shadow .15s;width:100%;box-sizing:border-box;',
    '}',
    '.spcov-overlay .sp-field input:focus,.spcov-overlay .sp-field textarea:focus{',
    '  border-color:var(--a);box-shadow:0 0 0 3px rgba(26,138,90,.1);',
    '}',
    '.spcov-overlay .sp-field input::placeholder,.spcov-overlay .sp-field textarea::placeholder{color:#9ca3af;}',
    '.spcov-overlay .sp-field textarea{resize:vertical;min-height:80px;}',

    /* type buttons */
    '.spcov-overlay .sp-type-btn{',
    '  display:flex;align-items:center;gap:.875rem;',
    '  padding:.875rem 1rem;margin-bottom:.5rem;',
    '  background:#fff;border:1.5px solid var(--border);border-radius:.75rem;',
    '  cursor:pointer;text-align:left;width:100%;transition:all .15s;',
    '}',
    '.spcov-overlay .sp-type-btn:last-child{margin-bottom:0;}',
    '.spcov-overlay .sp-type-btn:hover{border-color:var(--a);background:rgba(26,138,90,.04);}',
    '.spcov-overlay .sp-type-btn.selected{border-color:var(--a);background:rgba(26,138,90,.06);}',
    '.spcov-overlay .sp-type-icon{font-size:1.375rem;flex-shrink:0;width:2.25rem;text-align:center;}',
    '.spcov-overlay .sp-type-text{flex:1;}',
    '.spcov-overlay .sp-type-title{font-size:.9375rem;font-weight:600;color:var(--t);display:block;}',
    '.spcov-overlay .sp-type-desc{font-size:.8125rem;color:var(--t3);margin-top:.1rem;}',
    '.spcov-overlay .sp-type-arrow{color:#cbd5e1;font-size:.875rem;margin-left:auto;flex-shrink:0;transition:color .15s,transform .15s;}',
    '.spcov-overlay .sp-type-btn:hover .sp-type-arrow{color:var(--a);transform:translateX(3px);}',

    /* back btn */
    '.spcov-overlay .sp-back{',
    '  background:none;border:none;cursor:pointer;font-family:var(--font);',
    '  font-size:.8125rem;color:var(--t3);padding:0 0 1.125rem;',
    '  display:flex;align-items:center;gap:.3rem;transition:color .15s;',
    '}',
    '.spcov-overlay .sp-back:hover{color:var(--t);}',

    /* sections */
    '.spcov-overlay .sp-section{margin-bottom:1.25rem;}',
    '.spcov-overlay .sp-section-title{',
    '  font-size:.8125rem;font-weight:600;color:var(--t);',
    '  display:flex;align-items:center;gap:.4rem;margin-bottom:.625rem;',
    '}',
    '.spcov-overlay .badge-opt{font-size:.7rem;background:#f1f5f9;color:var(--t3);border-radius:.25rem;padding:.1rem .35rem;font-weight:400;}',

    /* stepper */
    '.spcov-overlay .sp-stepper{display:flex;align-items:center;gap:.5rem;}',
    '.spcov-overlay .sp-stepper button{',
    '  width:2rem;height:2rem;border-radius:.375rem;border:1.5px solid var(--border);',
    '  background:#fff;color:var(--t);font-size:1.1rem;cursor:pointer;',
    '  display:flex;align-items:center;justify-content:center;transition:border-color .15s;flex-shrink:0;',
    '}',
    '.spcov-overlay .sp-stepper button:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-stepper input{',
    '  width:5rem;text-align:center;padding:.5rem;',
    '  border-radius:.5rem;border:1.5px solid var(--border);',
    '  background:var(--surf);color:var(--t);font-family:var(--font);font-size:.875rem;',
    '  outline:none;box-sizing:border-box;',
    '}',

    /* checkboxes */
    '.spcov-overlay .sp-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:.375rem;}',
    '.spcov-overlay .sp-check-item{',
    '  display:flex;align-items:center;gap:.5rem;padding:.5rem .625rem;',
    '  background:var(--surf);border:1.5px solid var(--border);border-radius:.5rem;',
    '  cursor:pointer;font-size:.8125rem;color:var(--t2);transition:all .15s;',
    '}',
    '.spcov-overlay .sp-check-item:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-check-item.checked{border-color:var(--a);background:rgba(26,138,90,.06);color:var(--t);}',
    '.spcov-overlay .sp-check-item input[type=checkbox]{accent-color:var(--a);cursor:pointer;flex-shrink:0;}',

    /* urgency */
    '.spcov-overlay .sp-urgency-row{display:flex;gap:.375rem;flex-wrap:wrap;}',
    '.spcov-overlay .sp-urgency-btn{',
    '  flex:1;min-width:3rem;padding:.625rem .375rem;border-radius:.625rem;',
    '  border:1.5px solid var(--border);background:var(--surf);',
    '  color:var(--t3);font-size:.8125rem;font-family:var(--font);cursor:pointer;',
    '  text-align:center;transition:all .15s;line-height:1.4;',
    '}',
    '.spcov-overlay .sp-urgency-btn span{font-size:.75rem;display:block;}',
    '.spcov-overlay .sp-urgency-btn:hover{border-color:var(--a);color:var(--t);}',
    '.spcov-overlay .sp-urgency-btn.selected{border-color:var(--a);background:rgba(26,138,90,.1);color:var(--t);font-weight:600;}',

    /* chips */
    '.spcov-overlay .sp-chip-group{display:flex;flex-wrap:wrap;gap:.375rem;}',
    '.spcov-overlay .sp-chip{',
    '  padding:.4rem .75rem;border-radius:2rem;border:1.5px solid var(--border);',
    '  background:var(--surf);color:var(--t2);font-size:.8125rem;cursor:pointer;',
    '  transition:all .15s;user-select:none;',
    '}',
    '.spcov-overlay .sp-chip input{position:absolute;opacity:0;pointer-events:none;}',
    '.spcov-overlay .sp-chip:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-chip.selected{border-color:var(--a);background:rgba(26,138,90,.1);color:var(--t);font-weight:500;}',

    /* support quicklink */
    '.spcov-overlay .sp-ql{',
    '  display:flex;align-items:center;gap:.875rem;padding:.875rem 1rem;',
    '  background:var(--surf);border:1.5px solid var(--border);border-radius:.75rem;',
    '  text-decoration:none;margin-bottom:1rem;transition:border-color .15s;',
    '}',
    '.spcov-overlay .sp-ql:hover{border-color:var(--a);}',
    '.spcov-overlay .sp-ql-icon{font-size:1.25rem;}',
    '.spcov-overlay .sp-ql-title{font-size:.875rem;font-weight:600;color:var(--t);display:block;}',
    '.spcov-overlay .sp-ql-desc{font-size:.8rem;color:var(--t3);}',
    '.spcov-overlay .sp-ql-arrow{margin-left:auto;color:var(--t3);}',

    /* callout */
    '.spcov-overlay .sp-callout{',
    '  display:flex;gap:.625rem;padding:.75rem 1rem;background:#fffbeb;',
    '  border-radius:.625rem;border:1px solid #fde68a;margin-bottom:1rem;',
    '  font-size:.8125rem;color:#92400e;line-height:1.5;',
    '}',

    /* primary button */
    '.spcov-overlay .sp-btn{',
    '  width:100%;padding:.8125rem 1.5rem;border-radius:.625rem;border:none;cursor:pointer;',
    '  background:var(--a);color:#fff;font-family:var(--font);font-size:.9375rem;font-weight:600;',
    '  transition:background .15s,transform .1s;margin-top:1.25rem;',
    '}',
    '.spcov-overlay .sp-btn:hover{background:var(--a2);}',
    '.spcov-overlay .sp-btn:active{transform:scale(.99);}',
    '.spcov-overlay .sp-btn:disabled{opacity:.5;cursor:not-allowed;}',

    /* error */
    '.spcov-overlay .sp-err{',
    '  font-size:.8125rem;color:var(--red);padding:.5rem .75rem;',
    '  background:#fef2f2;border-radius:.375rem;border:1px solid #fecaca;',
    '  margin-top:.75rem;display:none;',
    '}',

    /* success */
    '.spcov-overlay .sp-success{text-align:center;padding:2.5rem 1rem;}',
    '.spcov-overlay .sp-success-icon{',
    '  width:3.5rem;height:3.5rem;border-radius:50%;',
    '  background:rgba(26,138,90,.1);border:2px solid var(--a);',
    '  display:flex;align-items:center;justify-content:center;',
    '  font-size:1.5rem;color:var(--a);margin:0 auto 1rem;',
    '}',
    '.spcov-overlay .sp-success-title{font-size:1.125rem;font-weight:700;color:var(--t);margin-bottom:.5rem;}',
    '.spcov-overlay .sp-success-text{font-size:.875rem;color:var(--t3);margin-bottom:1.5rem;line-height:1.6;}',

    /* divider */
    '.spcov-overlay .sp-hr{border:none;border-top:1px solid #f1f5f9;margin:1rem 0;}',

    /* mobile */
    '@media(max-width:480px){',
    '  .spcov-overlay .sp-row,.spcov-overlay .sp-check-grid{grid-template-columns:1fr;}',
    '  .spcov-overlay .sp-body{padding:1.25rem 1rem;}',
    '  .spcov-overlay .sp-modal{border-radius:1rem;}',
    '}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id = 'spcov-css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ─── HTML ─────────────────────────────────────────────────────────── */
  var logoSrc = _base + '/assets/cropped-favicon-smartpack.png';

  var root = document.createElement('div');
  root.id = 'spcov-root';
  root.innerHTML = [
    '<div class="spcov-overlay" id="spcov-overlay" onclick="if(event.target===this)spcov.close()">',
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
    '    <p class="sp-sub">Udfyld dine oplysninger og vælg emne — vi vender tilbage inden for 24 timer.</p>',
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
    '  <div id="spcov-support-error" class="sp-err">Noget gik galt. Prøv igen eller skriv direkte til os.</div>',
    '  <button class="sp-btn" id="spcov-support-btn" onclick="spcov.submit()">Send support-sag &#8594;</button>',
    '</div>',

    /* ── Step 3: Success ── */
    '<div class="step" id="spcov-s3">',
    '  <div class="sp-success">',
    '    <div class="sp-success-icon">&#x2713;</div>',
    '    <div class="sp-success-title" id="spcov-ok-title">Modtaget!</div>',
    '    <p class="sp-success-text" id="spcov-ok-text">Vi vender tilbage inden for 24 timer.</p>',
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
    } else if (selectedType === 'general') {
      d.subject = g('spcov-gen-subject').value.trim();
      d.message = g('spcov-gen-msg').value.trim();
    } else if (selectedType === 'support') {
      d.subject = g('spcov-sup-subject').value.trim();
      d.message = g('spcov-sup-msg').value.trim();
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
        var subj = encodeURIComponent((selectedType === 'learn' ? 'Foresp\u00f8rgsel' : selectedType === 'support' ? 'Support-sag' : 'Henvendelse') + ' fra ' + data.name + ' - ' + data.company);
        var body = encodeURIComponent('Navn: ' + data.name + '\nFirma: ' + data.company + '\nEmail: ' + data.email + (data.subject ? '\nEmne: ' + data.subject : '') + (data.message ? '\nBesked: ' + data.message : '') + (data.comment ? '\nKommentar: ' + data.comment : ''));
        window.open('mailto:' + to + '?subject=' + subj + '&body=' + body);
        g('spcov-ok-title').textContent = data.name.split(' ')[0] + ', vi har sendt dig et udkast!';
        g('spcov-ok-text').textContent = 'Din email-klient er \u00e5bnet. Send den afsted, s\u00e5 vender vi tilbage inden for 24 timer.';
        showStep('spcov-s3');
      }

      try {
        var resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (resp.ok) {
          var titles = { learn: 'Vi gl\u00e6der os til en snak!', general: 'Tak for din besked!', support: 'Support-sag modtaget!' };
          var texts = { learn: 'Vi kigger p\u00e5 jeres setup og vender tilbage inden for 24 timer. Ingen salgspitch.', general: 'Vi svarer inden for 24 timer.', support: 'Vi kigger p\u00e5 det hurtigst muligt. Br\u00e6nder det? Ring direkte.' };
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

  /* intercept kontakt-links */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/kontakt/.test(href) || /bundlinjeboost@smartpack\.dk/.test(href)) {
      e.preventDefault(); spcov.open();
    }
  }, true);

})();
