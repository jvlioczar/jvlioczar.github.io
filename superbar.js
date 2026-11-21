/*!
 * BiblioVerse Superbar · carregador de compatibilidade · https://biblioverse.org/superbar.js
 *
 * A superbar agora são duas barras separadas:
 *   superbar_libraries.js  → bibliotecas (todas as bibliotecas + botão para os projetos especiais)
 *   superbar_specials.js   → projetos especiais (todos os projetos + botão para as bibliotecas)
 *
 * Este arquivo existe só para os sites que ainda apontam para superbar.js: ele carrega a barra certa.
 * Sites novos devem apontar direto para uma das duas.
 *
 * Como decide:
 *   1. data-bar="libraries" ou data-bar="specials" na tag <nav id="bvbar">, se existir;
 *   2. senão, páginas em biblioverse.org recebem a barra das bibliotecas;
 *   3. todo o resto recebe a barra dos projetos especiais.
 */
(function () {
  'use strict';
  if (window.BiblioVerseBar || window.__bvbarLoading) return;
  window.__bvbarLoading = true;

  var self = document.currentScript;
  var base = self && self.src ? self.src.replace(/[^\/]*(\?.*)?$/, '') : 'https://biblioverse.org/';

  function load() {
    var nav = document.getElementById('bvbar');
    if (!nav) return;
    var kind = (nav.getAttribute('data-bar') || '').toLowerCase();
    if (kind !== 'libraries' && kind !== 'specials') {
      var host = location.hostname.replace(/^www\./, '');
      kind = host === 'biblioverse.org' ? 'libraries' : 'specials';
    }
    var s = document.createElement('script');
    s.src = base + 'superbar_' + kind + '.js';
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})();
