/**
 * landing-security.js — Protección de diseño para la Landing Page
 * Bloquea la descarga y apertura de imágenes del Landing para proteger el diseño.
 */
(function() {
  function setupImageSecurity(img) {
    if (img.dataset.protected || img.closest('.img-security-wrapper')) return;

    const applyShield = () => {
      if (img.dataset.protected) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'img-security-wrapper';
      const overlay = document.createElement('div');
      
      const style = window.getComputedStyle(img);
      wrapper.style.position = 'relative';
      wrapper.style.display = style.display === 'block' ? 'block' : 'inline-block';
      wrapper.style.verticalAlign = 'middle';

      overlay.style.cssText = `
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 999;
        background: rgba(0,0,0,0);
        cursor: default;
        user-select: none;
        -webkit-touch-callout: none;
      `;
      
      img.dataset.protected = 'true';
      img.style.pointerEvents = 'none'; 
      
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      wrapper.appendChild(overlay);
    };

    if (img.complete) applyShield();
    else img.addEventListener('load', applyShield);
  }

  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.img-security-wrapper')) e.preventDefault();
  }, true);

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.img-security-wrapper')) e.preventDefault();
  }, true);

  const securityObserver = new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(node => {
      if (node.tagName === 'IMG') setupImageSecurity(node);
      else if (node.querySelectorAll) node.querySelectorAll('img').forEach(setupImageSecurity);
    }));
  });
  securityObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', () => document.querySelectorAll('img').forEach(setupImageSecurity));
})();