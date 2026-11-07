(function(){
  if(!('serviceWorker' in navigator)) return;
  // Um service worker só para biblioverse.org inteiro (hub e bibliotecas), registrado da raiz
  function register(){
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .catch(function(e){ console.warn('[SW] skipped:', e && e.message ? e.message : e); });
  }
  window.addEventListener('load', function(){
    if('requestIdleCallback' in window){ requestIdleCallback(register, { timeout: 5000 }); }
    else { setTimeout(register, 1200); }
  });
})();
