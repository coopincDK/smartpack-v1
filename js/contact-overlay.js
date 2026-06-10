/* ============================================================
   SmartPack Contact Overlay — selvstændig, scopet komponent
   Loades via header.js på alle sider.
   ============================================================ */
(function () {
  'use strict';
  if (document.getElementById('spcov-root')) return;

  /* ─── CSS ─────────────────────────────────────────────────────────── */
  var css = [
    '@keyframes spcov-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes spcov-fade{from{opacity:0}to{opacity:1}}',

    '.spcov-overlay{',
    '  --spcov-bg:#0f172a;--spcov-surf:#1e293b;--spcov-surf2:#243044;',
    '  --spcov-border:#334155;--spcov-text:#f1f5f9;--spcov-text2:#cbd5e1;--spcov-text3:#94a3b8;',
    '  --spcov-accent:#1a8a5a;--spcov-accent2:#16a065;--spcov-red:#e53e3e;',
    '  --spcov-r:.75rem;--spcov-font:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    '  display:none;position:fixed;inset:0;z-index:9999;',
    '  background:rgba(0,0,0,.65);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);',
    '  align-items:center;justify-content:center;padding:1rem;font-family:var(--spcov-font);',
    '}',
    '.spcov-overlay.active{display:flex;animation:spcov-fade .2s ease}',

    '.spcov-overlay .spcov-modal{',
    '  background:var(--spcov-bg);border:1px solid var(--spcov-border);border-radius:1.25rem;',
    '  width:100%;max-width:540px;max-height:90vh;overflow-y:auto;',
    '  display:flex;flex-direction:column;',
    '  animation:spcov-in .25s cubic-bezier(.22,1,.36,1);',
    '  scrollbar-width:thin;scrollbar-color:var(--spcov-border) transparent;',
    '}',

    '.spcov-overlay .spcov-modal-hdr{',
    '  display:flex;align-items:center;justify-content:space-between;gap:.75rem;',
    '  padding:1.25rem 1.5rem 1rem;border-bottom:1px solid var(--spcov-border);',
    '  position:sticky;top:0;background:var(--spcov-bg);z-index:1;border-radius:1.25rem 1.25rem 0 0;',
    '}',
    '.spcov-overlay .spcov-modal-title{',
    '  font-size:1.0625rem;font-weight:700;color:var(--spcov-text);margin:0;',
    '}',
    '.spcov-overlay .spcov-modal-sub{font-size:.8125rem;color:var(--spcov-text3);margin:.15rem 0 0;}',
    '.spcov-overlay .spcov-close{',
    '  background:none;border:none;cursor:pointer;color:var(--spcov-text3);',
    '  font-size:1.25rem;line-height:1;padding:.25rem;border-radius:.375rem;',
    '  transition:color .15s,background .15s;flex-shrink:0;',
    '}',
    '.spcov-overlay .spcov-close:hover{color:var(--spcov-text);background:var(--spcov-surf);}',

    '.spcov-overlay .spcov-step-ind{',
    '  display:flex;align-items:center;gap:.5rem;',
    '}',
    '.spcov-overlay .spcov-dot{',
    '  width:8px;height:8px;border-radius:50%;background:var(--spcov-border);transition:all .2s;',
    '}',
    '.spcov-overlay .spcov-dot.active{background:var(--spcov-accent);transform:scale(1.25);}',
    '.spcov-overlay .spcov-dot.done{background:var(--spcov-accent);opacity:.5;}',
    '.spcov-overlay .spcov-step-lbl{font-size:.75rem;color:var(--spcov-text3);}',

    '.spcov-overlay .spcov-body{padding:1.5rem;}',

    '.spcov-overlay .step{display:none;}',
    '.spcov-overlay .step.active{display:block;animation:spcov-in .2s ease;}',

    /* type buttons */
    '.spcov-overlay .type-grid{display:flex;flex-direction:column;gap:.625rem;margin-bottom:1.25rem;}',
    '.spcov-overlay .type-btn{',
    '  display:flex;align-items:center;gap:.875rem;padding:.875rem 1rem;',
    '  background:var(--spcov-surf);border:1.5px solid var(--spcov-border);border-radius:var(--spcov-r);',
    '  cursor:pointer;text-align:left;transition:border-color .15s,background .15s;width:100%;',
    '}',
    '.spcov-overlay .type-btn:hover{border-color:var(--spcov-accent);}',
    '.spcov-overlay .type-btn.selected{border-color:var(--spcov-accent);background:rgba(26,138,90,.08);}',
    '.spcov-overlay .type-btn-icon{font-size:1.375rem;flex-shrink:0;}',
    '.spcov-overlay .type-btn-title{font-size:.9375rem;font-weight:600;color:var(--spcov-text);}',
    '.spcov-overlay .type-btn-desc{font-size:.8125rem;color:var(--spcov-text3);margin-top:.1rem;}',

    /* fields */
    '.spcov-overlay .spcov-field-group{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}',
    '.spcov-overlay .spcov-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.75rem;}',
    '.spcov-overlay .spcov-field:last-child{margin-bottom:0;}',
    '.spcov-overlay .spcov-field label{font-size:.8125rem;font-weight:500;color:var(--spcov-text2);}',
    '.spcov-overlay .spcov-field .req{color:var(--spcov-accent);}',
    '.spcov-overlay .spcov-field input,.spcov-overlay .spcov-field textarea,.spcov-overlay .spcov-field select{',
    '  padding:.6rem .875rem;border-radius:.5rem;border:1.5px solid var(--spcov-border);',
    '  background:var(--spcov-surf);color:var(--spcov-text);font-family:var(--spcov-font);font-size:.875rem;',
    '  outline:none;transition:border-color .15s;width:100%;box-sizing:border-box;',
    '}',
    '.spcov-overlay .spcov-field input:focus,.spcov-overlay .spcov-field textarea:focus,.spcov-overlay .spcov-field select:focus{border-color:var(--spcov-accent);}',
    '.spcov-overlay .spcov-field input::placeholder,.spcov-overlay .spcov-field textarea::placeholder{color:var(--spcov-text3);}',
    '.spcov-overlay .spcov-field textarea{resize:vertical;min-height:80px;}',

    /* form sections */
    '.spcov-overlay .spcov-section{margin-bottom:1.25rem;}',
    '.spcov-overlay .spcov-section-title{',
    '  font-size:.875rem;font-weight:600;color:var(--spcov-text);margin-bottom:.625rem;',
    '  display:flex;align-items:center;gap:.4rem;',
    '}',
    '.spcov-overlay .badge-opt{font-size:.7rem;background:var(--spcov-surf2);color:var(--spcov-text3);border-radius:.25rem;padding:.1rem .35rem;font-weight:400;}',

    /* stepper */
    '.spcov-overlay .spcov-stepper{display:flex;align-items:center;gap:.5rem;}',
    '.spcov-overlay .spcov-stepper button{',
    '  width:2rem;height:2rem;border-radius:.375rem;border:1.5px solid var(--spcov-border);',
    '  background:var(--spcov-surf);color:var(--spcov-text);font-size:1rem;cursor:pointer;',
    '  display:flex;align-items:center;justify-content:center;transition:border-color .15s;flex-shrink:0;',
    '}',
    '.spcov-overlay .spcov-stepper button:hover{border-color:var(--spcov-accent);}',
    '.spcov-overlay .spcov-stepper input{',
    '  width:3.5rem;text-align:center;padding:.5rem .25rem;',
    '  border-radius:.5rem;border:1.5px solid var(--spcov-border);',
    '  background:var(--spcov-surf);color:var(--spcov-text);font-family:var(--spcov-font);font-size:.875rem;',
    '  outline:none;box-sizing:border-box;',
    '}',

    /* checkboxes */
    '.spcov-overlay .spcov-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:.375rem;}',
    '.spcov-overlay .spcov-check-item{',
    '  display:flex;align-items:center;gap:.5rem;padding:.5rem .625rem;',
    '  background:var(--spcov-surf);border:1.5px solid var(--spcov-border);border-radius:.5rem;',
    '  cursor:pointer;font-size:.8125rem;color:var(--spcov-text2);transition:border-color .15s;',
    '}',
    '.spcov-overlay .spcov-check-item:hover{border-color:var(--spcov-accent);}',
    '.spcov-overlay .spcov-check-item input[type=checkbox]{accent-color:var(--spcov-accent);cursor:pointer;flex-shrink:0;}',
    '.spcov-overlay .spcov-check-item.checked{border-color:var(--spcov-accent);background:rgba(26,138,90,.07);}',

    /* urgency buttons */
    '.spcov-overlay .urgency-row{display:flex;gap:.375rem;flex-wrap:wrap;}',
    '.spcov-overlay .urgency-btn{',
    '  flex:1;min-width:3rem;padding:.5rem .25rem;border-radius:.5rem;',
    '  border:1.5px solid var(--spcov-border);background:var(--spcov-surf);',
    '  color:var(--spcov-text3);font-size:.75rem;font-family:var(--spcov-font);cursor:pointer;',
    '  text-align:center;transition:all .15s;',
    '}',
    '.spcov-overlay .urgency-btn:hover{border-color:var(--spcov-accent);color:var(--spcov-text);}',
    '.spcov-overlay .urgency-btn.selected{border-color:var(--spcov-accent);background:rgba(26,138,90,.1);color:var(--spcov-text);}',

    /* chips */
    '.spcov-overlay .spcov-chip-group{display:flex;flex-wrap:wrap;gap:.375rem;}',
    '.spcov-overlay .spcov-chip{',
    '  padding:.4rem .75rem;border-radius:2rem;border:1.5px solid var(--spcov-border);',
    '  background:var(--spcov-surf);color:var(--spcov-text2);font-size:.8125rem;cursor:pointer;',
    '  transition:all .15s;user-select:none;',
    '}',
    '.spcov-overlay .spcov-chip input{position:absolute;opacity:0;pointer-events:none;}',
    '.spcov-overlay .spcov-chip:hover{border-color:var(--spcov-accent);}',
    '.spcov-overlay .spcov-chip.selected{border-color:var(--spcov-accent);background:rgba(26,138,90,.1);color:var(--spcov-text);}',

    /* back btn */
    '.spcov-overlay .spcov-back{',
    '  background:none;border:none;cursor:pointer;color:var(--spcov-text3);',
    '  font-size:.8125rem;padding:0 0 1rem;font-family:var(--spcov-font);',
    '  display:flex;align-items:center;gap:.25rem;transition:color .15s;',
    '}',
    '.spcov-overlay .spcov-back:hover{color:var(--spcov-text);}',

    /* support quicklink */
    '.spcov-overlay .support-ql{',
    '  display:flex;align-items:center;gap:.875rem;padding:.875rem 1rem;',
    '  background:var(--spcov-surf);border:1.5px solid var(--spcov-border);border-radius:var(--spcov-r);',
    '  text-decoration:none;margin-bottom:1rem;transition:border-color .15s;',
    '}',
    '.spcov-overlay .support-ql:hover{border-color:var(--spcov-accent);}',
    '.spcov-overlay .support-ql-icon{font-size:1.25rem;}',
    '.spcov-overlay .support-ql-title{font-size:.9rem;font-weight:600;color:var(--spcov-text);display:block;}',
    '.spcov-overlay .support-ql-desc{font-size:.8rem;color:var(--spcov-text3);}',
    '.spcov-overlay .support-ql-arrow{margin-left:auto;color:var(--spcov-text3);font-size:1.1rem;}',

    /* info callout */
    '.spcov-overlay .spcov-callout{',
    '  display:flex;gap:.625rem;padding:.75rem 1rem;background:var(--spcov-surf2);',
    '  border-radius:.625rem;border:1px solid var(--spcov-border);margin-bottom:1rem;',
    '  font-size:.8125rem;color:var(--spcov-text2);line-height:1.5;',
    '}',

    /* actions */
    '.spcov-overlay .spcov-actions{display:flex;gap:.75rem;justify-content:flex-end;margin-top:1.5rem;}',
    '.spcov-overlay .spcov-btn-primary{',
    '  padding:.7rem 1.5rem;border-radius:.625rem;border:none;cursor:pointer;',
    '  background:var(--spcov-accent);color:#fff;font-family:var(--spcov-font);font-size:.9375rem;font-weight:600;',
    '  transition:background .15s,opacity .15s;',
    '}',
    '.spcov-overlay .spcov-btn-primary:hover{background:var(--spcov-accent2);}',
    '.spcov-overlay .spcov-btn-primary:disabled{opacity:.5;cursor:not-allowed;}',

    /* error */
    '.spcov-overlay .spcov-error{',
    '  font-size:.8125rem;color:var(--spcov-red);padding:.5rem .75rem;',
    '  background:rgba(229,62,62,.08);border-radius:.375rem;border:1px solid rgba(229,62,62,.25);',
    '  margin-top:.75rem;display:none;',
    '}',

    /* success */
    '.spcov-overlay .spcov-success{text-align:center;padding:2rem 1rem;}',
    '.spcov-overlay .spcov-success-icon{',
    '  width:3.5rem;height:3.5rem;border-radius:50%;background:rgba(26,138,90,.15);',
    '  border:2px solid var(--spcov-accent);display:flex;align-items:center;justify-content:center;',
    '  font-size:1.5rem;color:var(--spcov-accent);margin:0 auto 1rem;',
    '}',
    '.spcov-overlay .spcov-success-title{font-size:1.125rem;font-weight:700;color:var(--spcov-text);margin-bottom:.5rem;}',
    '.spcov-overlay .spcov-success-text{font-size:.875rem;color:var(--spcov-text3);margin-bottom:1.5rem;line-height:1.6;}',

    /* divider */
    '.spcov-overlay .spcov-divider{border:none;border-top:1px solid var(--spcov-border);margin:1rem 0;}',

    /* mobile */
    '@media(max-width:480px){',
    '  .spcov-overlay .spcov-field-group,.spcov-overlay .spcov-check-grid{grid-template-columns:1fr;}',
    '  .spcov-overlay .spcov-body{padding:1.25rem;}',
    '}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id = 'spcov-css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ─── HTML ────────────────────────────────────────────────────────── */
  var root = document.createElement('div');
  root.id = 'spcov-root';
  root.innerHTML = [
    '<div class="spcov-overlay" id="spcov-overlay" onclick="if(event.target===this)spcov.close()">',
    '<div class="spcov-modal" id="spcov-modal">',

    /* header */
    '<div class="spcov-modal-hdr">',
    '  <div>',
    '    <div class="spcov-modal-title">Kontakt SmartPack</div>',
    '    <div class="spcov-modal-sub">Vi svarer inden for 24 timer</div>',
    '  </div>',
    '  <div style="display:flex;align-items:center;gap:.875rem">',
    '    <div class="spcov-step-ind" id="spcov-step-ind">',
    '      <div class="spcov-dot active" id="spcov-dot-1"></div>',
    '      <div class="spcov-dot" id="spcov-dot-2"></div>',
    '      <span class="spcov-step-lbl" id="spcov-step-lbl">Trin 1 af 2</span>',
    '    </div>',
    '    <button class="spcov-close" onclick="spcov.close()" aria-label="Luk">&#x2715;</button>',
    '  </div>',
    '</div>',

    /* body */
    '<div class="spcov-body">',

    /* ── Step 1 ── */
    '<div class="step active" id="spcov-s1">',
    '  <div class="spcov-section">',
    '    <div class="spcov-field-group">',
    '      <div class="spcov-field"><label for="spcov-name">Navn <span class="req">*</span></label><input type="text" id="spcov-name" name="name" placeholder="Mikkel Hansen" autocomplete="name"></div>',
    '      <div class="spcov-field"><label for="spcov-company">Virksomhed <span class="req">*</span></label><input type="text" id="spcov-company" name="company" placeholder="Webshop ApS" autocomplete="organization"></div>',
    '    </div>',
    '    <div class="spcov-field"><label for="spcov-email">E-mail <span class="req">*</span></label><input type="email" id="spcov-email" name="email" placeholder="mikkel@firma.dk" autocomplete="email"></div>',
    '  </div>',
    '  <div id="spcov-s1-error" class="spcov-error">Udfyld venligst navn, virksomhed og en gyldig e-mail.</div>',
    '  <hr class="spcov-divider">',
    '  <div class="spcov-section-title">Hvad kan vi hjælpe med?</div>',
    '  <div class="type-grid">',
    '    <button class="type-btn" onclick="spcov.chooseType(this,\'learn\')">',
    '      <span class="type-btn-icon">&#x1F4E6;</span>',
    '      <div><div class="type-btn-title">Hør mere om SmartPack</div><div class="type-btn-desc">Vi kigger på jeres setup og sender et konkret bud</div></div>',
    '    </button>',
    '    <button class="type-btn" onclick="spcov.chooseType(this,\'general\')">',
    '      <span class="type-btn-icon">&#x1F4AC;</span>',
    '      <div><div class="type-btn-title">Generel henvendelse</div><div class="type-btn-desc">Spørgsmål, presse, samarbejde eller andet</div></div>',
    '    </button>',
    '    <button class="type-btn" onclick="spcov.chooseType(this,\'support\')">',
    '      <span class="type-btn-icon">&#x1F6E0;</span>',
    '      <div><div class="type-btn-title">Support</div><div class="type-btn-desc">Du er allerede kunde og har et teknisk spørgsmål</div></div>',
    '    </button>',
    '  </div>',
    '</div>',

    /* ── Step 2a: Learn ── */
    '<div class="step" id="spcov-s2-learn">',
    '  <button class="spcov-back" onclick="spcov.goBack()">&#8592; Tilbage</button>',

    /* orders + employees */
    '  <div class="spcov-section">',
    '    <div class="spcov-field-group">',
    '      <div class="spcov-field"><label for="spcov-orders">Ordrer pr. dag</label>',
    '        <div class="spcov-stepper"><button type="button" onclick="spcov.step(\'spcov-orders\',-10)">-</button><input type="number" id="spcov-orders" value="50" min="1"><button type="button" onclick="spcov.step(\'spcov-orders\',10)">+</button></div>',
    '      </div>',
    '      <div class="spcov-field"><label for="spcov-empl">Medarbejdere på lager</label>',
    '        <div class="spcov-stepper"><button type="button" onclick="spcov.step(\'spcov-empl\',-1)">-</button><input type="number" id="spcov-empl" value="3" min="1"><button type="button" onclick="spcov.step(\'spcov-empl\',1)">+</button></div>',
    '      </div>',
    '    </div>',
    '  </div>',

    /* shops */
    '  <div class="spcov-section">',
    '    <div class="spcov-section-title">Webshop platform</div>',
    '    <div class="spcov-check-grid" id="spcov-shops">',
    '      <label class="spcov-check-item"><input type="checkbox" name="shop" value="Shopify"><span>Shopify</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="shop" value="WooCommerce"><span>WooCommerce</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="shop" value="Magento"><span>Magento</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="shop" value="Dandomain"><span>Dandomain</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="shop" value="PrestaShop"><span>PrestaShop</span></label>',
    '      <label class="spcov-check-item" id="spcov-chk-shop-andet"><input type="checkbox" name="shop" value="andet" onchange="spcov.toggleWrap(\'spcov-shop-andet-wrap\',this)"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-shop-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="spcov-field"><input type="text" id="spcov-shop-andet" placeholder="Hvilken platform?"></div>',
    '    </div>',
    '  </div>',

    /* ERP */
    '  <div class="spcov-section">',
    '    <div class="spcov-section-title">ERP / regnskab <span class="badge-opt">valgfrit</span></div>',
    '    <div class="spcov-check-grid">',
    '      <label class="spcov-check-item"><input type="checkbox" name="erp" value="e-conomic"><span>e-conomic</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="erp" value="Business Central"><span>Business Central</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="erp" value="Uniconta"><span>Uniconta</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="erp" value="Billy"><span>Billy</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="erp" value="SAP"><span>SAP</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="erp" value="andet" onchange="spcov.toggleWrap(\'spcov-erp-andet-wrap\',this)"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-erp-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="spcov-field"><input type="text" id="spcov-erp-andet" placeholder="Hvilket system?"></div>',
    '    </div>',
    '  </div>',

    /* carriers */
    '  <div class="spcov-section">',
    '    <div class="spcov-section-title">Fragtpartner DK <span class="badge-opt">valgfrit</span></div>',
    '    <div class="spcov-check-grid">',
    '      <label class="spcov-check-item"><input type="checkbox" name="carrier_dk" value="PostNord"><span>PostNord</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="carrier_dk" value="GLS"><span>GLS</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="carrier_dk" value="DAO"><span>DAO</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="carrier_dk" value="Bring"><span>Bring</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="carrier_dk" value="DHL"><span>DHL</span></label>',
    '      <label class="spcov-check-item"><input type="checkbox" name="carrier_dk" value="andet" onchange="spcov.toggleWrap(\'spcov-dk-andet-wrap\',this)"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-dk-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="spcov-field"><input type="text" id="spcov-dk-andet" placeholder="Hvilken fragtpartner?"></div>',
    '    </div>',
    '  </div>',

    /* urgency */
    '  <div class="spcov-section">',
    '    <div class="spcov-section-title">Hvor haster det?</div>',
    '    <div class="urgency-row">',
    '      <button type="button" class="urgency-btn" data-u="1" onclick="spcov.setUrgency(1)">Afsøger</button>',
    '      <button type="button" class="urgency-btn" data-u="2" onclick="spcov.setUrgency(2)">Overvejer</button>',
    '      <button type="button" class="urgency-btn selected" data-u="3" onclick="spcov.setUrgency(3)">Aktivt</button>',
    '      <button type="button" class="urgency-btn" data-u="4" onclick="spcov.setUrgency(4)">Klar</button>',
    '      <button type="button" class="urgency-btn" data-u="5" onclick="spcov.setUrgency(5)">Hellere i dag</button>',
    '    </div>',
    '    <input type="hidden" id="spcov-urgency" value="3">',
    '  </div>',

    /* contact info */
    '  <div class="spcov-section">',
    '    <div class="spcov-field-group">',
    '      <div class="spcov-field"><label for="spcov-phone">Telefon <span class="badge-opt">valgfrit</span></label><input type="tel" id="spcov-phone" placeholder="+45 12 34 56 78" autocomplete="tel"></div>',
    '      <div class="spcov-field"><label for="spcov-cvr">CVR-nummer <span class="badge-opt">valgfrit</span></label><input type="text" id="spcov-cvr" placeholder="12345678" maxlength="8"></div>',
    '    </div>',
    '  </div>',

    /* source */
    '  <div class="spcov-section">',
    '    <div class="spcov-section-title">Hvor har I hørt om SmartPack? <span class="badge-opt">valgfrit</span></div>',
    '    <div class="spcov-chip-group" id="spcov-sources">',
    '      <label class="spcov-chip"><input type="radio" name="source" value="LinkedIn"><span>LinkedIn</span></label>',
    '      <label class="spcov-chip"><input type="radio" name="source" value="Google"><span>Google</span></label>',
    '      <label class="spcov-chip"><input type="radio" name="source" value="YouTube"><span>YouTube</span></label>',
    '      <label class="spcov-chip"><input type="radio" name="source" value="TikTok"><span>TikTok</span></label>',
    '      <label class="spcov-chip"><input type="radio" name="source" value="Anbefaling"><span>Anbefaling</span></label>',
    '      <label class="spcov-chip"><input type="radio" name="source" value="AI"><span>AI / ChatGPT</span></label>',
    '      <label class="spcov-chip"><input type="radio" name="source" value="Event"><span>Event / messe</span></label>',
    '      <label class="spcov-chip" id="spcov-chip-andet"><input type="radio" name="source" value="Andet"><span>Andet</span></label>',
    '    </div>',
    '    <div id="spcov-source-andet-wrap" style="display:none;margin-top:.5rem">',
    '      <div class="spcov-field"><input type="text" id="spcov-source-andet" placeholder="Fx podcast, artikel, kollega..."></div>',
    '    </div>',
    '  </div>',

    /* comment */
    '  <div class="spcov-section">',
    '    <div class="spcov-section-title">Er der mere vi skal vide? <span class="badge-opt">valgfrit</span></div>',
    '    <div class="spcov-field"><textarea id="spcov-comment" name="comment" placeholder="Fx særlige krav, nuværende udfordringer..."></textarea></div>',
    '  </div>',

    '  <div id="spcov-learn-error" class="spcov-error">Noget gik galt. Prøv igen eller skriv til os direkte.</div>',
    '  <div class="spcov-actions"><button class="spcov-btn-primary" id="spcov-learn-btn" onclick="spcov.submit()">Send forespørgsel &#8594;</button></div>',
    '</div>',

    /* ── Step 2b: General ── */
    '<div class="step" id="spcov-s2-general">',
    '  <button class="spcov-back" onclick="spcov.goBack()">&#8592; Tilbage</button>',
    '  <div class="spcov-section-title" style="font-size:1rem;margin-bottom:.25rem">Hvad har du på hjerte?</div>',
    '  <p style="font-size:.875rem;color:var(--spcov-text3);margin:0 0 1.25rem">Spørgsmål, samarbejde, presse eller noget helt andet.</p>',
    '  <div class="spcov-field"><label for="spcov-gen-subject">Emne <span class="req">*</span></label><input type="text" id="spcov-gen-subject" placeholder="Fx samarbejde, presse..."></div>',
    '  <div class="spcov-field"><label for="spcov-gen-msg">Din besked <span class="req">*</span></label><textarea id="spcov-gen-msg" placeholder="Skriv hvad du har på hjerte..."></textarea></div>',
    '  <div id="spcov-general-error" class="spcov-error">Noget gik galt. Prøv igen eller skriv til os direkte.</div>',
    '  <div class="spcov-actions"><button class="spcov-btn-primary" id="spcov-general-btn" onclick="spcov.submit()">Send besked &#8594;</button></div>',
    '</div>',

    /* ── Step 2c: Support ── */
    '<div class="step" id="spcov-s2-support">',
    '  <button class="spcov-back" onclick="spcov.goBack()">&#8592; Tilbage</button>',
    '  <a class="support-ql" href="https://support.smartpack.dk/" target="_blank" rel="noopener">',
    '    <span class="support-ql-icon">&#x26A1;</span>',
    '    <div><span class="support-ql-title">Få svar med det samme</span><span class="support-ql-desc">support.smartpack.dk - artikler, guides og chat</span></div>',
    '    <span class="support-ql-arrow">&#x2197;</span>',
    '  </a>',
    '  <div class="spcov-callout"><span>&#x1F4DE;</span><span>Har du et akut problem? <strong>Ring til os</strong> - superbrugere har fri adgang til telefonisk SOS support 24/7. Her kan du sende en skriftlig sag.</span></div>',
    '  <div class="spcov-field"><label for="spcov-sup-subject">Emne <span class="req">*</span></label><input type="text" id="spcov-sup-subject" placeholder="Fx Scanner virker ikke..."></div>',
    '  <div class="spcov-field"><label for="spcov-sup-msg">Beskriv problemet <span class="req">*</span></label><textarea id="spcov-sup-msg" placeholder="Hvad sker der? Hvornår startede det? Hvad har I allerede prøvet?"></textarea></div>',
    '  <div id="spcov-support-error" class="spcov-error">Noget gik galt. Prøv igen eller skriv til os direkte.</div>',
    '  <div class="spcov-actions"><button class="spcov-btn-primary" id="spcov-support-btn" onclick="spcov.submit()">Send support-sag &#8594;</button></div>',
    '</div>',

    /* ── Step 3: Success ── */
    '<div class="step" id="spcov-s3">',
    '  <div class="spcov-success">',
    '    <div class="spcov-success-icon">&#x2713;</div>',
    '    <div class="spcov-success-title" id="spcov-ok-title">Modtaget - tak!</div>',
    '    <div class="spcov-success-text" id="spcov-ok-text">Vi kigger på det og vender tilbage inden for 24 timer.</div>',
    '    <button class="spcov-btn-primary" onclick="spcov.close()" style="max-width:200px;margin:0 auto;display:block">Luk &#8594;</button>',
    '  </div>',
    '</div>',

    '</div>', /* /spcov-body */
    '</div>', /* /spcov-modal */
    '</div>'  /* /spcov-overlay */
  ].join('');

  document.body.appendChild(root);

  /* ─── State & helpers ──────────────────────────────────────────────── */
  var selectedType = null;
  var g = function (id) { return document.getElementById(id); };

  function showStep(id) {
    root.querySelectorAll('.step').forEach(function (s) { s.classList.remove('active'); });
    var el = g(id); if (el) el.classList.add('active');
    g('spcov-modal').scrollTop = 0;
  }

  function setDots(step) {
    var d1 = g('spcov-dot-1'), d2 = g('spcov-dot-2'), ind = g('spcov-step-ind');
    d1.className = 'spcov-dot' + (step === 1 ? ' active' : ' done');
    d2.className = 'spcov-dot' + (step === 2 ? ' active' : '');
    if (step >= 3) { ind.style.display = 'none'; }
    else { ind.style.display = 'flex'; g('spcov-step-lbl').textContent = 'Trin ' + step + ' af 2'; }
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

  function showError(id) { var el = g(id); if (el) el.style.display = 'block'; }
  function hideError(id) { var el = g(id); if (el) el.style.display = 'none'; }

  /* ─── Public API on window.spcov ──────────────────────────────────── */
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
      root.querySelectorAll('.type-btn,.spcov-chip,.urgency-btn').forEach(function (el) { el.classList.remove('selected'); });
      root.querySelectorAll('input:not([type="number"]),textarea').forEach(function (el) {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
        else el.value = '';
      });
      g('spcov-orders').value = 50;
      g('spcov-empl').value = 3;
      g('spcov-urgency').value = 3;
      var defU = root.querySelector('.urgency-btn[data-u="3"]');
      if (defU) defU.classList.add('selected');
      ['spcov-shop-andet-wrap','spcov-erp-andet-wrap','spcov-dk-andet-wrap','spcov-source-andet-wrap'].forEach(function (id) {
        var el = g(id); if (el) el.style.display = 'none';
      });
      ['spcov-s1-error','spcov-learn-error','spcov-general-error','spcov-support-error'].forEach(hideError);
      root.querySelectorAll('.spcov-check-item').forEach(function (el) { el.classList.remove('checked'); });
      root.querySelectorAll('.spcov-btn-primary').forEach(function (btn) { btn.disabled = false; });
      setDots(1); showStep('spcov-s1');
      g('spcov-step-ind').style.display = 'flex';
    },

    chooseType: function (btn, type) {
      if (!validateStep1()) {
        showError('spcov-s1-error');
        ['spcov-name','spcov-company','spcov-email'].forEach(function (id) {
          var el = g(id);
          if (!el.value.trim() || (id === 'spcov-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()))) {
            el.style.borderColor = 'var(--spcov-red)'; el.focus();
          }
        });
        return;
      }
      hideError('spcov-s1-error');
      root.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedType = type;
      setDots(2);
      var steps = { learn: 'spcov-s2-learn', general: 'spcov-s2-general', support: 'spcov-s2-support' };
      showStep(steps[type]);
    },

    goBack: function () {
      setDots(1); showStep('spcov-s1');
    },

    step: function (id, delta) {
      var el = g(id); if (!el) return;
      var v = parseInt(el.value) || 1;
      el.value = Math.max(1, v + delta);
    },

    setUrgency: function (val) {
      g('spcov-urgency').value = val;
      root.querySelectorAll('.urgency-btn').forEach(function (b) {
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
      hideError(errId);

      /* basic step-2 validation */
      if (selectedType === 'general') {
        if (!g('spcov-gen-subject').value.trim() || !g('spcov-gen-msg').value.trim()) {
          showError(errId); return;
        }
      } else if (selectedType === 'support') {
        if (!g('spcov-sup-subject').value.trim() || !g('spcov-sup-msg').value.trim()) {
          showError(errId); return;
        }
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sender...'; }

      try {
        var resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(collectData())
        });
        if (resp.ok) {
          /* success */
          var titles = { learn: 'Vi glæder os til en snak!', general: 'Tak for din besked!', support: 'Support-sag modtaget!' };
          var texts  = {
            learn:   'Vi kigger på jeres setup og vender tilbage inden for 24 timer. Ingen salgspitch.',
            general: 'Vi har modtaget din henvendelse og svarer inden for 24 timer.',
            support: 'Vi har modtaget din sag og kigger på det hurtigst muligt. Brænder det? Ring direkte.'
          };
          g('spcov-ok-title').textContent = (g('spcov-name').value.trim().split(' ')[0] + ', ') + (titles[selectedType] || 'Tak!');
          g('spcov-ok-text').textContent  = texts[selectedType] || '';
          setDots(3); showStep('spcov-s3');
        } else {
          showError(errId);
          if (btn) { btn.disabled = false; btn.textContent = 'Prøv igen'; }
        }
      } catch (e) {
        showError(errId);
        if (btn) { btn.disabled = false; btn.textContent = 'Prøv igen'; }
      }
    }
  };

  /* ─── Chip radio click delegation ────────────────────────────────── */
  root.addEventListener('click', function (e) {
    var chip = e.target.closest('.spcov-chip');
    if (!chip) return;
    var inp = chip.querySelector('input[type="radio"]');
    if (!inp) return;
    root.querySelectorAll('[name="' + inp.name + '"]').forEach(function (r) {
      r.closest('.spcov-chip').classList.remove('selected');
    });
    chip.classList.add('selected');
    inp.checked = true;
    if (inp.name === 'source') {
      var wrap = g('spcov-source-andet-wrap');
      if (wrap) wrap.style.display = inp.value === 'Andet' ? 'block' : 'none';
    }
  });

  /* ─── Checkbox visual state ───────────────────────────────────────── */
  root.addEventListener('change', function (e) {
    if (e.target.type === 'checkbox') {
      var item = e.target.closest('.spcov-check-item');
      if (item) item.classList.toggle('checked', e.target.checked);
    }
  });

  /* ─── Clear error borders on input ───────────────────────────────── */
  ['spcov-name','spcov-company','spcov-email'].forEach(function (id) {
    var el = g(id); if (!el) return;
    el.addEventListener('input', function () {
      el.style.borderColor = '';
      if (validateStep1()) hideError('spcov-s1-error');
    });
  });

  /* ─── ESC to close ────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && g('spcov-overlay').classList.contains('active')) spcov.close();
  });

  /* ─── Intercept alle kontakt-links globalt ────────────────────────── */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/kontakt/.test(href) || /bundlinjeboost@smartpack\.dk/.test(href)) {
      e.preventDefault();
      spcov.open();
    }
  }, true);

})();
