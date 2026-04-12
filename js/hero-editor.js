/**
 * SmartPack Hero Editor
 * Tryk E for at toggle panelet
 * Klik "Kopier CSS" for at få de endelige værdier
 */
(function () {
  const CONTROLS = [
    { label: 'Telefon – venstre (%)',  prop: '--ph-left',   min: 0,  max: 50, step: 1,  def: 2,  target: '.hero__phone',     css: 'left' },
    { label: 'Telefon – top (%)',      prop: '--ph-top',    min: 0,  max: 40, step: 1,  def: 4,  target: '.hero__phone',     css: 'top' },
    { label: 'Telefon – bredde (%)',   prop: '--ph-w',      min: 20, max: 60, step: 1,  def: 38, target: '.hero__phone',     css: 'width' },
    { label: 'GIF – højre (%)',        prop: '--db-right',  min: 0,  max: 30, step: 1,  def: 0,  target: '.hero__dashboard', css: 'right' },
    { label: 'GIF – bund (%)',         prop: '--db-bottom', min: 0,  max: 30, step: 1,  def: 0,  target: '.hero__dashboard', css: 'bottom' },
    { label: 'GIF – bredde (%)',       prop: '--db-w',      min: 40, max: 90, step: 1,  def: 70, target: '.hero__dashboard', css: 'width' },
    { label: 'Flow – venstre (%)',     prop: '--fl-left',   min: 0,  max: 70, step: 1,  def: 28, target: '.hero__flow-line', css: 'left' },
    { label: 'Flow – top (%)',         prop: '--fl-top',    min: 0,  max: 80, step: 1,  def: 42, target: '.hero__flow-line', css: 'top' },
    { label: 'Flow – opacity',         prop: '--fl-op',     min: 0,  max: 10, step: 1,  def: 8,  target: '.hero__flow-line', css: 'opacity', factor: 0.1 },
    { label: 'Badge 1 – top (%)',      prop: '--b1-top',    min: 0,  max: 40, step: 1,  def: 4,  target: '.hero__badge--1',  css: 'top' },
    { label: 'Badge 1 – venstre (%)', prop: '--b1-left',   min: 0,  max: 80, step: 1,  def: 30, target: '.hero__badge--1',  css: 'left' },
    { label: 'Badge 2 – top (%)',      prop: '--b2-top',    min: 0,  max: 80, step: 1,  def: 38, target: '.hero__badge--2',  css: 'top' },
    { label: 'Badge 2 – højre (%)',    prop: '--b2-right',  min: 0,  max: 60, step: 1,  def: 2,  target: '.hero__badge--2',  css: 'right' },
    { label: 'Badge 3 – bund (%)',     prop: '--b3-bottom', min: 0,  max: 60, step: 1,  def: 22, target: '.hero__badge--3',  css: 'bottom' },
    { label: 'Badge 3 – venstre (%)', prop: '--b3-left',   min: 0,  max: 80, step: 1,  def: 28, target: '.hero__badge--3',  css: 'left' },
    { label: 'Komposition – højde',    prop: '--comp-h',    min: 300,max: 700,step: 10, def: 540, target: '.hero__composition', css: 'height', unit: 'px' },
  ];

  // Panel HTML
  const panel = document.createElement('div');
  panel.id = 'hero-editor';
  panel.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px', 'z-index:99999',
    'background:#0a1410', 'border:1px solid rgba(62,207,142,.3)',
    'border-radius:12px', 'padding:16px', 'width:280px',
    'font-family:monospace', 'font-size:12px', 'color:#ccc',
    'box-shadow:0 8px 40px rgba(0,0,0,.6)', 'display:none',
    'max-height:90vh', 'overflow-y:auto'
  ].join(';');

  const state = {};

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
  html += '<strong style="color:#3ecf8e;font-size:13px">Hero Editor</strong>';
  html += '<span style="color:#555;font-size:10px">Tryk E for at lukke</span></div>';

  CONTROLS.forEach(c => {
    state[c.prop] = c.def;
    html += `<div style="margin-bottom:10px">`;
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:3px">`;
    html += `<span>${c.label}</span>`;
    html += `<span id="val-${c.prop}" style="color:#3ecf8e">${c.def}${c.unit || (c.factor ? '' : '%')}</span>`;
    html += `</div>`;
    html += `<input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.def}"`;
    html += ` data-prop="${c.prop}"`;
    html += ` style="width:100%;accent-color:#3ecf8e;cursor:pointer">`;
    html += `</div>`;
  });

  html += '<div style="margin-top:14px;display:flex;gap:8px">';
  html += '<button id="he-reset" style="flex:1;padding:7px;background:rgba(255,255,255,.06);border:1px solid #333;border-radius:6px;color:#ccc;cursor:pointer;font-size:11px">Reset</button>';
  html += '<button id="he-copy" style="flex:1;padding:7px;background:#3ecf8e;border:none;border-radius:6px;color:#06100a;font-weight:700;cursor:pointer;font-size:11px">Kopier CSS</button>';
  html += '</div>';
  html += '<div id="he-feedback" style="margin-top:8px;font-size:10px;color:#3ecf8e;text-align:center;min-height:14px"></div>';

  panel.innerHTML = html;
  document.body.appendChild(panel);

  function applyControl(c, val) {
    const el = document.querySelector(c.target);
    if (!el) return;
    const unit   = c.unit  || '%';
    const factor = c.factor || 1;
    el.style[c.css] = (val * factor) + unit;
  }

  function buildCSS() {
    const lines = [];
    const groups = {};
    CONTROLS.forEach(c => {
      if (!groups[c.target]) groups[c.target] = [];
      const unit   = c.unit  || '%';
      const factor = c.factor || 1;
      groups[c.target].push(`  ${c.css}: ${state[c.prop] * factor}${unit};`);
    });
    Object.entries(groups).forEach(([sel, props]) => {
      lines.push(`${sel} {`);
      lines.push(...props);
      lines.push('}');
      lines.push('');
    });
    return lines.join('\n');
  }

  // Sliders
  panel.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', () => {
      const prop = input.dataset.prop;
      const val  = parseFloat(input.value);
      state[prop] = val;
      const c    = CONTROLS.find(x => x.prop === prop);
      const unit = c.unit || (c.factor ? '' : '%');
      document.getElementById('val-' + prop).textContent = (val * (c.factor || 1)).toFixed(c.factor ? 1 : 0) + unit;
      applyControl(c, val);
    });
  });

  // Reset
  document.getElementById('he-reset').addEventListener('click', () => {
    CONTROLS.forEach(c => {
      state[c.prop] = c.def;
      panel.querySelector(`input[data-prop="${c.prop}"]`).value = c.def;
      document.getElementById('val-' + c.prop).textContent = c.def + (c.unit || (c.factor ? '' : '%'));
      applyControl(c, c.def);
    });
  });

  // Kopier CSS
  document.getElementById('he-copy').addEventListener('click', () => {
    const css = buildCSS();
    navigator.clipboard.writeText(css).then(() => {
      const fb = document.getElementById('he-feedback');
      fb.textContent = '✓ CSS kopieret – send til Eric';
      setTimeout(() => { fb.textContent = ''; }, 3000);
    });
  });

  // Toggle med E
  document.addEventListener('keydown', e => {
    if (e.key === 'e' || e.key === 'E') {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  });

  console.log('%c Hero Editor aktiv – tryk E for at åbne ', 'background:#3ecf8e;color:#06100a;font-weight:bold;padding:4px 8px;border-radius:4px');
})();
