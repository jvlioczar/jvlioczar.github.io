/* ============================================================================
   BiblioVerse — barra das bibliotecas (botão "Bibliotecas")
   https://biblioverse.org/assets/libbar.js

   Compartilhada pelas 23 bibliotecas. Primeira linha do cabeçalho:
   logo do BiblioVerse · nome da biblioteca · [Bibliotecas ▾] · tema/idioma/info.
   Segunda linha: busca e categorias (layout na seção 4b de library.css).

   A lista vem da superbar (window.BiblioVerseBar: libs, groups, text), só com os
   grupos de bibliotecas: projetos especiais (projects: true) ficam de fora.
   Os links abrem na mesma aba, para o app instalado não sair para o navegador.

   Uso, no <head> de cada biblioteca, depois da superbar:
   <script src="/assets/libbar.js" defer></script>
   ========================================================================== */
(function () {
  'use strict';
  if (window.BVLibBar) return;
  window.BVLibBar = { version: 1 };

  var HOME = 'https://biblioverse.org';

  function langOf() {
    return (document.documentElement.getAttribute('lang') || 'pt').toLowerCase().split('-')[0];
  }
  function tr(obj, l) { return obj ? (obj[l] || obj.en || obj.pt || '') : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Links do próprio biblioverse.org viram caminhos: funcionam no site, no app e em teste local
  function localUrl(url) { return url.indexOf(HOME + '/') === 0 ? url.slice(HOME.length) : url; }

  var ICON_GRID = '<svg aria-hidden="true" class="libswitch-ico" viewBox="0 0 24 24" width="16" height="16"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>';
  var ICON_CARET = '<svg aria-hidden="true" class="libswitch-caret" viewBox="0 0 24 24" width="14" height="14"><path d="M7 10l5 5 5-5"/></svg>';

  function init(api) {
    var header = document.querySelector('.site-header');
    var wrap = header && header.querySelector('.brand-wrap');
    if (!wrap || wrap.querySelector('.libswitch')) return;

    var nav = document.getElementById('bvbar');
    var current = nav ? (nav.getAttribute('data-current') || '') : '';
    var groups = api.groups.filter(function (g) { return !g.projects; });
    var libs = api.libs.filter(function (l) {
      return !l.soon && groups.some(function (g) { return g.key === l.group; });
    });

    var box = document.createElement('div');
    box.className = 'libswitch';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'libswitch-btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'libswitchPanel');
    var panel = document.createElement('div');
    panel.className = 'libswitch-panel';
    panel.id = 'libswitchPanel';
    panel.hidden = true;
    box.appendChild(btn);
    box.appendChild(panel);
    wrap.appendChild(box);

    function render() {
      var l = langOf();
      var T = api.text[l] || api.text.en;
      var label = T.libs;
      btn.innerHTML = ICON_GRID + '<span class="libswitch-label">' + esc(label) + '</span>' + ICON_CARET;
      btn.setAttribute('aria-label', label);
      btn.title = label;

      var html = '<div class="libswitch-head"><span class="libswitch-title">' + esc(label) +
        '</span><span class="libswitch-count">' + libs.length + '</span></div>';
      groups.forEach(function (g) {
        var items = libs.filter(function (x) { return x.group === g.key; });
        if (!items.length) return;
        items.sort(function (a, b) { return tr(a.name, l).localeCompare(tr(b.name, l), l, { sensitivity: 'base' }); });
        html += '<div class="libswitch-group"><p class="libswitch-group-title">' + esc(tr(g.name, l)) + '</p><div class="libswitch-grid">';
        items.forEach(function (x) {
          var here = x.key === current;
          html += '<a class="libswitch-item' + (here ? ' is-here' : '') + '" href="' + esc(localUrl(x.url)) + '"' +
            (here ? ' aria-current="page" title="' + esc(T.here) + '"' : '') + '>' +
            '<span aria-hidden="true" class="libswitch-item-ico">' + x.icon + '</span>' +
            '<span class="libswitch-item-name">' + esc(tr(x.name, l)) + '</span></a>';
        });
        html += '</div></div>';
      });
      html += '<a class="libswitch-home" href="/">' + esc(T.all) + ' <span aria-hidden="true">→</span></a>';
      panel.innerHTML = html;
    }

    function isOpen() { return !panel.hidden; }
    function open() {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      box.classList.add('open');
      // No desktop o painel abre alinhado ao botão; se passar da tela, desliza para a esquerda
      panel.style.left = '';
      if (getComputedStyle(box).position === 'relative') {
        var over = panel.getBoundingClientRect().right - (document.documentElement.clientWidth - 16);
        if (over > 0) panel.style.left = (-over) + 'px';
      }
      var here = panel.querySelector('.is-here') || panel.querySelector('.libswitch-item');
      if (here && here.scrollIntoView) here.scrollIntoView({ block: 'nearest' });
    }
    function close(focusBtn) {
      if (!isOpen()) return;
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      box.classList.remove('open');
      if (focusBtn) btn.focus();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen()) close(false); else open();
    });
    document.addEventListener('click', function (e) { if (isOpen() && !box.contains(e.target)) close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(true); });

    render();
    // Acompanha a troca de idioma das bibliotecas (atributo lang do <html>)
    var last = langOf();
    new MutationObserver(function () { if (langOf() !== last) { last = langOf(); render(); } })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // Altura do cabeçalho em CSS, para as âncoras das categorias pararem logo abaixo dele
    function measure() { document.documentElement.style.setProperty('--lib-header-h', header.offsetHeight + 'px'); }
    measure();
    if (window.ResizeObserver) new ResizeObserver(measure).observe(header);
    else window.addEventListener('resize', measure);
  }

  // A superbar (carregada antes, também com defer) expõe a lista; espera um pouco se ainda não chegou
  var tries = 0;
  function start() {
    if (window.BiblioVerseBar && window.BiblioVerseBar.libs) return init(window.BiblioVerseBar);
    if (++tries < 40) setTimeout(start, 50);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
