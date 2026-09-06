// Integrationssider: FAQ-accordion.
// Bruges af siderne under /integrationer der koerer v2-standarden.
function toggleFaq(el) {
  var item = el.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.sp-faq-item').forEach(function(i){ i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}
