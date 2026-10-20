/*!
 * BiblioVerse Superbar v3 · https://biblioverse.org/superbar.js
 * Barra universal de todas as bibliotecas do BiblioVerse e do site principal.
 *
 * ── COMO ACRESCENTAR UMA BIBLIOTECA NOVA ─────────────────────────────────────
 * 1. Copie uma linha de BV_LIBS (mais abaixo) e troque key, group, icon, url e name.
 *    Em "name" só pt e en são obrigatórios; os outros idiomas caem no inglês.
 * 2. Publique este arquivo no repositório do biblioverse.org. Pronto: a barra de
 *    TODAS as bibliotecas se atualiza sozinha, sem mexer em nenhum outro site.
 *
 * ── COMO INSTALAR EM UM SITE (uma vez só) ────────────────────────────────────
 *   Logo após <body>:
 *   <nav id="bvbar" class="bvbar" data-current="CHAVE" aria-label="BiblioVerse"
 *        style="position:fixed;top:0;left:0;right:0;height:44px;z-index:9000;background:linear-gradient(90deg,#4f7cff,#7a5cff)">
 *     <a href="https://biblioverse.org" style="color:#fff;line-height:44px;padding:0 14px;font-weight:700;text-decoration:none">BiblioVerse</a>
 *   </nav>
 *   No <head>:
 *   <script src="https://biblioverse.org/superbar.js" defer></script>
 *
 *   data-current = chave da biblioteca (ex.: "web3"). No site principal use data-current="".
 *   Opcionais: data-logo="url do ícone", data-lang="es" (força um idioma), data-offset="none"
 *   (não empurra o conteúdo para baixo; use se o site já reservar o espaço da barra).
 *
 * ── IDIOMA ───────────────────────────────────────────────────────────────────
 *   A barra lê o atributo lang do <html> (pt, pt-BR, en, es, fr, de, it...) e se
 *   retraduz sozinha sempre que ele muda. Se o site troca de idioma sem mudar esse
 *   atributo, chame: window.BiblioVerseBar.setLang('es')
 *   Idiomas sem tradução aqui usam o inglês.
 */
(function () {
  'use strict';
  if (window.BiblioVerseBar) return;

  var HOME = 'https://biblioverse.org';
  var DEFAULT_LOGO = 'https://biblioverse.org/images/icon.svg';
  var FALLBACK_LANG = 'en';

  // ── Grupos (ordem de exibição no painel) ──────────────────────────────────
  var BV_GROUPS = [
    { key: 'tech',      name: { pt: 'Tecnologia',      en: 'Technology',        es: 'Tecnología',       fr: 'Technologie',        de: 'Technologie',      it: 'Tecnologia' } },
    { key: 'creative',  name: { pt: 'Criatividade',    en: 'Creativity',        es: 'Creatividad',      fr: 'Créativité',         de: 'Kreativität',      it: 'Creatività' } },
    { key: 'culture',   name: { pt: 'Cultura e lazer', en: 'Culture & Leisure', es: 'Cultura y ocio',   fr: 'Culture et loisirs', de: 'Kultur & Freizeit', it: 'Cultura e tempo libero' } },
    { key: 'knowledge', name: { pt: 'Conhecimento',    en: 'Knowledge',         es: 'Conocimiento',     fr: 'Connaissance',       de: 'Wissen',           it: 'Conoscenza' } },
    { key: 'life',      name: { pt: 'Vida prática',    en: 'Everyday Life',     es: 'Vida práctica',    fr: 'Vie pratique',       de: 'Alltag',           it: 'Vita pratica' } }
  ];

  // ── Bibliotecas ───────────────────────────────────────────────────────────
  // key: chave usada em data-current | group: chave de BV_GROUPS | soon: true = "em breve"
  // tags: palavras extras para a busca (sem acento, em qualquer idioma)
  var BV_LIBS = [
    { key: 'ai',          group: 'tech',      icon: '🤖', url: 'https://ai.biblioverse.org',          name: { pt: 'IA', en: 'AI', es: 'IA', fr: 'IA', de: 'KI', it: 'IA' }, tags: 'inteligencia artificial artificial intelligence chatgpt' },
    { key: 'coding',      group: 'tech',      icon: '💻', url: 'https://code.biblioverse.org',        name: { pt: 'Programação', en: 'Coding', es: 'Programación', fr: 'Programmation', de: 'Programmierung', it: 'Programmazione' }, tags: 'programming code codigo desenvolvimento software dev' },
    { key: 'data',        group: 'tech',      icon: '📊', url: 'https://data.biblioverse.org',        name: { pt: 'Dados', en: 'Data', es: 'Datos', fr: 'Données', de: 'Daten', it: 'Dati' }, tags: 'estatistica statistics analytics planilhas' },
    { key: 'web3',        group: 'tech',      icon: '🔗', url: 'https://web3.biblioverse.org',        name: { pt: 'Web3', en: 'Web3' }, tags: 'blockchain cripto crypto bitcoin ethereum defi nft' },
    { key: 'design',      group: 'creative',  icon: '🎨', url: 'https://design.biblioverse.org',      name: { pt: 'Design', en: 'Design', es: 'Diseño', fr: 'Design', de: 'Design', it: 'Design' }, tags: 'grafico graphic ux ui tipografia typography' },
    { key: 'photography', group: 'creative',  icon: '📷', url: 'https://photography.biblioverse.org', name: { pt: 'Fotografia', en: 'Photography', es: 'Fotografía', fr: 'Photographie', de: 'Fotografie', it: 'Fotografia' }, tags: 'foto photo camera' },
    { key: 'print',       group: 'creative',  icon: '📰', url: 'https://print.biblioverse.org',       name: { pt: 'Mídia Impressa', en: 'Print Media', es: 'Medios impresos', fr: 'Presse écrite', de: 'Printmedien', it: 'Stampa' }, tags: 'jornal revista impressao grafica magazine newspaper' },
    { key: 'games',       group: 'culture',   icon: '🎮', url: 'https://games.biblioverse.org',       name: { pt: 'Games', en: 'Games', es: 'Videojuegos', fr: 'Jeux vidéo', de: 'Games', it: 'Videogiochi' }, tags: 'jogos videogame esports' },
    { key: 'list',        group: 'culture',   icon: '📋', url: 'https://list.biblioverse.org',        name: { pt: 'Listas', en: 'Lists', es: 'Listas', fr: 'Listes', de: 'Listen', it: 'Liste' }, tags: 'rankings top' },
    { key: 'music',       group: 'culture',   icon: '🎵', url: 'https://music.biblioverse.org',       name: { pt: 'Música', en: 'Music', es: 'Música', fr: 'Musique', de: 'Musik', it: 'Musica' }, tags: 'musica songs bandas' },
    { key: 'philosophy',  group: 'knowledge', icon: '🦉', url: 'https://philosophy.biblioverse.org',  name: { pt: 'Filosofia', en: 'Philosophy', es: 'Filosofía', fr: 'Philosophie', de: 'Philosophie', it: 'Filosofia' }, tags: 'etica ethics filosofos' },
    { key: 'language',    group: 'knowledge', icon: '🗣️', url: 'https://language.biblioverse.org',    name: { pt: 'Idiomas', en: 'Languages', es: 'Idiomas', fr: 'Langues', de: 'Sprachen', it: 'Lingue' }, tags: 'linguas ingles english estudo' },
    { key: 'thinking',    group: 'knowledge', icon: '🧠', url: 'https://thinking.biblioverse.org',    name: { pt: 'Racionalidade', en: 'Rationality', es: 'Racionalidad', fr: 'Rationalité', de: 'Rationalität', it: 'Razionalità' }, tags: 'pensamento critico critical thinking evidencias' },
    { key: 'job',         group: 'life',      icon: '💼', url: 'https://job.biblioverse.org',         name: { pt: 'Emprego', en: 'Jobs', es: 'Empleo', fr: 'Emploi', de: 'Jobs', it: 'Lavoro' }, tags: 'carreira career vagas trabalho work' },
    { key: 'management',  group: 'life',      icon: '🗂️', url: 'https://management.biblioverse.org',  name: { pt: 'Organização', en: 'Organization', es: 'Organización', fr: 'Organisation', de: 'Organisation', it: 'Organizzazione' }, tags: 'produtividade productivity gestao' },
    { key: 'social',      group: 'life',      icon: '🗺', url: 'https://social.biblioverse.org',      name: { pt: 'Redes Sociais', en: 'Social', es: 'Redes sociales', fr: 'Réseaux sociaux', de: 'Soziale Netzwerke', it: 'Social network' }, tags: 'social media' },
    { key: 'travel',      group: 'life',      icon: '✈️', url: 'https://travel.biblioverse.org',      name: { pt: 'Viagem', en: 'Travel', es: 'Viajes', fr: 'Voyage', de: 'Reisen', it: 'Viaggi' }, tags: 'viajar turismo trip' }
  ];

  // ── Textos da interface ───────────────────────────────────────────────────
  var BV_TEXT = {
    pt: { libs: 'Bibliotecas', search: 'Buscar biblioteca…', close: 'Fechar', home: 'Página inicial do BiblioVerse', here: 'você está aqui', none: 'Nenhuma biblioteca encontrada.', all: 'Conhecer o BiblioVerse', soon: 'em breve', open: 'Abrir lista de bibliotecas' },
    en: { libs: 'Libraries', search: 'Search libraries…', close: 'Close', home: 'BiblioVerse home page', here: 'you are here', none: 'No library found.', all: 'Visit BiblioVerse', soon: 'soon', open: 'Open library list' },
    es: { libs: 'Bibliotecas', search: 'Buscar biblioteca…', close: 'Cerrar', home: 'Página de inicio de BiblioVerse', here: 'estás aquí', none: 'No se encontró ninguna biblioteca.', all: 'Conocer BiblioVerse', soon: 'pronto', open: 'Abrir lista de bibliotecas' },
    fr: { libs: 'Bibliothèques', search: 'Rechercher une bibliothèque…', close: 'Fermer', home: "Page d'accueil de BiblioVerse", here: 'vous êtes ici', none: 'Aucune bibliothèque trouvée.', all: 'Découvrir BiblioVerse', soon: 'bientôt', open: 'Ouvrir la liste des bibliothèques' },
    de: { libs: 'Bibliotheken', search: 'Bibliothek suchen…', close: 'Schließen', home: 'BiblioVerse-Startseite', here: 'Sie sind hier', none: 'Keine Bibliothek gefunden.', all: 'BiblioVerse entdecken', soon: 'bald', open: 'Bibliotheksliste öffnen' },
    it: { libs: 'Biblioteche', search: 'Cerca biblioteca…', close: 'Chiudi', home: 'Pagina iniziale di BiblioVerse', here: 'sei qui', none: 'Nessuna biblioteca trovata.', all: 'Scopri BiblioVerse', soon: 'presto', open: "Apri l'elenco delle biblioteche" }
  };

  // ── Estilos ───────────────────────────────────────────────────────────────
  var FONT = '"TASA Explorer",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
  var CSS = [
    ':root:root{--bvbar-h:44px;--superbar-h:var(--bvbar-h);}',
    'html.bvbar-on body{padding-top:var(--bvbar-h)!important;}',
    'html.bvbar-on{scroll-padding-top:calc(var(--bvbar-h) + 12px);}',
    '.bvbar{position:fixed;top:0;left:0;right:0;height:var(--bvbar-h);z-index:9000;display:flex;align-items:center;gap:8px;',
    ' padding:0 max(12px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));margin:0;',
    ' background:linear-gradient(90deg,var(--accent1,#4f7cff),var(--accent2,#7a5cff));color:#fff;font-family:' + FONT + ';font-size:14px;line-height:1;box-sizing:border-box;}',
    '.bvbar *,.bvbar-panel *{box-sizing:border-box;}',
    '.bvbar a,.bvbar button{color:#fff;font:inherit;margin:0;}',
    '.bvbar button{-webkit-tap-highlight-color:transparent;}',
    '.bvbar-home{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;white-space:nowrap;flex:none;min-height:36px;}',
    // ícone sobre um chip branco: o logo em gradiente azul/roxo some contra a barra da mesma cor
    '.bvbar-home img{width:28px;height:28px;display:block;padding:3px;border-radius:8px;background:#fff;object-fit:contain;box-shadow:0 1px 3px rgba(5,8,15,.3);flex:none;}',
    '.bvbar-sep{opacity:.6;flex:none;}',
    '.bvbar-pill{display:inline-flex;align-items:center;gap:6px;border:0;background:rgba(255,255,255,.16);height:32px;padding:0 12px;border-radius:999px;cursor:pointer;white-space:nowrap;transition:background .15s;}',
    '.bvbar-pill:hover{background:rgba(255,255,255,.28);}',
    '.bvbar-pill:focus-visible,.bvbar-home:focus-visible{outline:2px solid #fff;outline-offset:2px;}',
    '.bvbar-current{font-weight:700;min-width:0;max-width:min(46vw,320px);}',
    '.bvbar-current .nm{overflow:hidden;text-overflow:ellipsis;min-width:0;}',
    '.bvbar-caret{font-size:9px;opacity:.85;transition:transform .15s;flex:none;}',
    '.bvbar.is-open .bvbar-caret{transform:rotate(180deg);}',
    '.bvbar-spacer{flex:1;min-width:4px;}',
    '.bvbar-menu{flex:none;}',
    '.bvbar-burger{display:block;width:18px;height:14px;flex:none;}',
    '.bvbar-count{background:rgba(255,255,255,.92);color:var(--accent2,#7a5cff);border-radius:999px;padding:0 7px;font-size:12px;font-weight:700;line-height:18px;}',
    '.bvbar-backdrop{position:fixed;inset:0;background:rgba(5,8,15,.45);z-index:8999;opacity:0;pointer-events:none;transition:opacity .15s;}',
    '.bvbar-backdrop.is-open{opacity:1;pointer-events:auto;}',
    // painel: cores próprias, claro/escuro
    '.bvbar-panel{--p-bg:#0f131b;--p-soft:#171c27;--p-text:#e6edf3;--p-muted:#a3adbd;--p-border:#262e3f;}',
    'html[data-theme="light"] .bvbar-panel{--p-bg:#ffffff;--p-soft:#f2f5fa;--p-text:#0b1220;--p-muted:#55607a;--p-border:#dde4ef;}',
    '@media (prefers-color-scheme:light){html:not([data-theme]) .bvbar-panel{--p-bg:#ffffff;--p-soft:#f2f5fa;--p-text:#0b1220;--p-muted:#55607a;--p-border:#dde4ef;}}',
    '.bvbar-panel{position:fixed;top:calc(var(--bvbar-h) + 8px);right:max(12px,env(safe-area-inset-right));width:min(780px,calc(100vw - 24px));',
    ' max-height:calc(100vh - var(--bvbar-h) - 24px);max-height:calc(100dvh - var(--bvbar-h) - 24px);overflow:auto;overscroll-behavior:contain;z-index:9001;',
    ' background:var(--p-bg);color:var(--p-text);border:1px solid var(--p-border);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.35);padding:14px;',
    ' font-family:' + FONT + ';font-size:14px;line-height:1.25;display:none;text-align:left;}',
    '.bvbar-panel.is-open{display:block;}',
    '.bvbar-top{display:flex;gap:8px;align-items:center;position:sticky;top:-14px;margin:-14px -14px 4px;padding:14px 14px 8px;background:var(--p-bg);z-index:1;}',
    '.bvbar-search{flex:1;min-width:0;height:42px;border-radius:12px;border:1px solid var(--p-border);background:var(--p-soft);color:var(--p-text);padding:0 12px;font:inherit;font-size:16px;outline:none;-webkit-appearance:none;appearance:none;}',
    '.bvbar-search:focus{border-color:var(--accent1,#4f7cff);box-shadow:0 0 0 3px rgba(79,124,255,.25);}',
    '.bvbar-close{flex:none;height:42px;width:42px;border-radius:12px;border:1px solid var(--p-border);background:var(--p-soft);color:var(--p-text);cursor:pointer;font-size:16px;font-family:inherit;}',
    '.bvbar-group{margin:10px 0 2px;}',
    '.bvbar-gtitle{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--p-muted);margin:0 0 6px 2px;font-weight:700;font-family:inherit;}',
    '.bvbar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px;}',
    '.bvbar-item{display:flex;align-items:center;gap:10px;min-height:44px;padding:8px 10px;border-radius:12px;text-decoration:none;color:var(--p-text);border:1px solid transparent;background:var(--p-soft);font-size:13.5px;}',
    '.bvbar-item:hover,.bvbar-item:focus-visible{border-color:var(--accent1,#4f7cff);outline:none;}',
    '.bvbar-item .ico{font-size:18px;width:24px;text-align:center;flex:none;}',
    '.bvbar-item .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;}',
    '.bvbar-item .tag{font-size:10.5px;color:var(--p-muted);white-space:nowrap;flex:none;}',
    '.bvbar-item.is-current{border-color:var(--accent2,#7a5cff);background:rgba(122,92,255,.16);}',
    '.bvbar-item.is-soon{opacity:.55;}',
    '.bvbar-none{padding:18px 4px;color:var(--p-muted);display:none;}',
    '.bvbar-foot{display:flex;justify-content:flex-end;margin-top:12px;padding-top:10px;border-top:1px solid var(--p-border);font-size:12.5px;}',
    '.bvbar-foot a{color:var(--accent1,#4f7cff);text-decoration:none;font-weight:700;padding:6px 2px;}',
    'html.bvbar-lock,html.bvbar-lock body{overflow:hidden;}',
    // responsivo
    '@media (max-width:720px){',
    ' .bvbar-home .txt,.bvbar-menu .lbl{display:none;}',
    ' .bvbar-panel{top:var(--bvbar-h);left:0;right:0;bottom:0;width:auto;max-height:none;border-radius:0;border:0;border-top:1px solid var(--p-border);',
    '   padding:14px max(14px,env(safe-area-inset-right)) max(18px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));}',
    ' .bvbar-grid{grid-template-columns:repeat(2,minmax(0,1fr));}',
    ' .bvbar-item.is-current .tag{display:none;}',
    '}',
    '@media (max-width:380px){',
    ' .bvbar{gap:6px;}',
    ' .bvbar-pill{padding:0 10px;}',
    ' .bvbar-count{display:none;}',
    ' .bvbar-current{max-width:52vw;}',
    '}',
    '@media (max-width:340px){.bvbar-grid{grid-template-columns:1fr;}}',
    '@media (prefers-reduced-motion:reduce){.bvbar-caret,.bvbar-backdrop,.bvbar-pill{transition:none;}}',
    '@media print{.bvbar,.bvbar-panel,.bvbar-backdrop{display:none!important;}html.bvbar-on body{padding-top:0!important;}}'
  ].join('\n');

  var BURGER = '<svg class="bvbar-burger" viewBox="0 0 18 14" aria-hidden="true" focusable="false">' +
    '<rect y="0" width="18" height="2" rx="1" fill="currentColor"/><rect y="6" width="18" height="2" rx="1" fill="currentColor"/>' +
    '<rect y="12" width="18" height="2" rx="1" fill="currentColor"/></svg>';

  // ── Utilitários ───────────────────────────────────────────────────────────
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pick(obj, L) { return (obj && (obj[L] || obj[FALLBACK_LANG] || obj.pt)) || ''; }
  function allNames(obj) { var out = []; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) out.push(obj[k]); return out.join(' '); }

  var forcedLang = null;
  function resolveLang(nav) {
    var raw = forcedLang || (nav && nav.getAttribute('data-lang')) || document.documentElement.getAttribute('lang') || 'pt';
    raw = String(raw).toLowerCase().replace('_', '-');
    if (BV_TEXT[raw]) return raw;
    var base = raw.split('-')[0];
    return BV_TEXT[base] ? base : (base || FALLBACK_LANG);
  }

  function init() {
    var nav = document.getElementById('bvbar');
    if (!nav) return;
    var libs = BV_LIBS.slice(), groups = BV_GROUPS;
    var currentKey = nav.getAttribute('data-current') || '';
    var current = libs.filter(function (l) { return l.key === currentKey; })[0] || null;

    var st = el('style'); st.id = 'bvbar-style'; st.textContent = CSS; document.head.appendChild(st);
    if (nav.getAttribute('data-offset') !== 'none') document.documentElement.classList.add('bvbar-on');

    // Barra
    nav.removeAttribute('style');
    nav.innerHTML = '';
    nav.classList.add('bvbar');
    var home = el('a', 'bvbar-home'); home.href = HOME;
    var img = el('img'); img.src = nav.getAttribute('data-logo') || DEFAULT_LOGO; img.alt = ''; img.width = 28; img.height = 28;
    img.onerror = function () { img.style.display = 'none'; };
    home.appendChild(img); home.appendChild(el('span', 'txt', 'BiblioVerse'));
    nav.appendChild(home);

    var curBtn = null, curName = null;
    if (current) {
      nav.appendChild(el('span', 'bvbar-sep', '/'));
      curBtn = el('button', 'bvbar-pill bvbar-current'); curBtn.type = 'button';
      curBtn.setAttribute('aria-haspopup', 'dialog'); curBtn.setAttribute('aria-expanded', 'false'); curBtn.setAttribute('aria-controls', 'bvbar-panel');
      curBtn.appendChild(el('span', 'ico', current.icon));
      curName = el('span', 'nm'); curBtn.appendChild(curName);
      curBtn.appendChild(el('span', 'bvbar-caret', '▼'));
      nav.appendChild(curBtn);
    }
    nav.appendChild(el('span', 'bvbar-spacer'));
    var btn = el('button', 'bvbar-pill bvbar-menu'); btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'bvbar-panel');
    btn.setAttribute('aria-keyshortcuts', 'B');
    btn.innerHTML = BURGER;
    var btnLbl = el('span', 'lbl'); btn.appendChild(btnLbl);
    btn.appendChild(el('span', 'bvbar-count', String(libs.filter(function (l) { return !l.soon; }).length)));
    nav.appendChild(btn);

    // Painel
    var backdrop = el('div', 'bvbar-backdrop');
    var panel = el('div', 'bvbar-panel'); panel.id = 'bvbar-panel';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    var top = el('div', 'bvbar-top');
    var search = el('input', 'bvbar-search'); search.type = 'search'; search.autocomplete = 'off'; search.spellcheck = false;
    var close = el('button', 'bvbar-close', '✕'); close.type = 'button';
    top.appendChild(search); top.appendChild(close); panel.appendChild(top);
    var body = el('div', 'bvbar-body'); panel.appendChild(body);
    var none = el('div', 'bvbar-none'); panel.appendChild(none);
    var foot = el('div', 'bvbar-foot'); var allLink = el('a'); allLink.href = HOME; foot.appendChild(allLink); panel.appendChild(foot);
    document.body.appendChild(backdrop); document.body.appendChild(panel);

    var items = [], lastLang = null;
    function render() {
      var L = resolveLang(nav), t = BV_TEXT[L] || BV_TEXT[FALLBACK_LANG];
      lastLang = L;
      nav.setAttribute('aria-label', 'BiblioVerse');
      home.title = t.home; home.setAttribute('aria-label', t.home);
      if (curBtn) { curName.textContent = pick(current.name, L); curBtn.title = t.open; curBtn.setAttribute('aria-label', pick(current.name, L) + ' · ' + t.open); }
      btnLbl.textContent = t.libs; btn.title = t.open; btn.setAttribute('aria-label', t.open);
      search.placeholder = t.search; search.setAttribute('aria-label', t.search);
      close.title = t.close; close.setAttribute('aria-label', t.close);
      none.textContent = t.none; allLink.textContent = t.all + ' →';
      panel.setAttribute('aria-label', t.libs);
      body.innerHTML = ''; items = [];
      groups.forEach(function (g) {
        var list = libs.filter(function (l) { return l.group === g.key; })
          .sort(function (a, b) { return pick(a.name, L).localeCompare(pick(b.name, L), L, { sensitivity: 'base' }); });
        if (!list.length) return;
        var sec = el('section', 'bvbar-group'); sec.appendChild(el('h2', 'bvbar-gtitle', pick(g.name, L)));
        var grid = el('div', 'bvbar-grid');
        list.forEach(function (l) {
          var a = el('a', 'bvbar-item'); a.href = l.url;
          a.appendChild(el('span', 'ico', l.icon)); a.appendChild(el('span', 'nm', pick(l.name, L)));
          if (l.key === currentKey) { a.classList.add('is-current'); a.setAttribute('aria-current', 'page'); a.appendChild(el('span', 'tag', t.here)); }
          else if (l.soon) { a.classList.add('is-soon'); a.appendChild(el('span', 'tag', t.soon)); }
          a._bvText = norm([allNames(l.name), l.key, l.tags || '', allNames(g.name)].join(' '));
          grid.appendChild(a); items.push(a);
        });
        sec.appendChild(grid); body.appendChild(sec);
      });
      filter();
    }
    function filter() {
      var q = norm(search.value.trim()), words = q ? q.split(/\s+/) : [], any = false;
      body.querySelectorAll('.bvbar-group').forEach(function (sec) {
        var vis = 0;
        sec.querySelectorAll('.bvbar-item').forEach(function (a) {
          var ok = words.every(function (w) { return a._bvText.indexOf(w) > -1; });
          a.style.display = ok ? '' : 'none'; if (ok) vis++;
        });
        sec.style.display = vis ? '' : 'none'; if (vis) any = true;
      });
      none.style.display = any ? 'none' : 'block';
    }
    function visibleItems() { return items.filter(function (a) { return a.style.display !== 'none' && a.parentNode.parentNode.style.display !== 'none'; }); }
    function isOpen() { return panel.classList.contains('is-open'); }
    var lastFocus = null;
    function setExpanded(v) { btn.setAttribute('aria-expanded', v); if (curBtn) curBtn.setAttribute('aria-expanded', v); }
    function open() {
      if (isOpen()) return;
      lastFocus = document.activeElement;
      if (resolveLang(nav) !== lastLang) render();
      panel.classList.add('is-open'); backdrop.classList.add('is-open'); nav.classList.add('is-open'); setExpanded('true');
      if (window.matchMedia('(max-width:720px)').matches) document.documentElement.classList.add('bvbar-lock');
      search.value = ''; filter(); panel.scrollTop = 0;
      setTimeout(function () { try { search.focus({ preventScroll: true }); } catch (e) { search.focus(); } }, 0);
    }
    function shut() {
      if (!isOpen()) return;
      panel.classList.remove('is-open'); backdrop.classList.remove('is-open'); nav.classList.remove('is-open'); setExpanded('false');
      document.documentElement.classList.remove('bvbar-lock');
      if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }
    function toggle() { isOpen() ? shut() : open(); }

    btn.addEventListener('click', toggle);
    if (curBtn) curBtn.addEventListener('click', toggle);
    close.addEventListener('click', shut);
    backdrop.addEventListener('click', shut);
    search.addEventListener('input', filter);
    search.addEventListener('keydown', function (e) {
      var v = visibleItems();
      if (e.key === 'Enter' && v.length) { e.preventDefault(); location.href = v[0].href; }
      if (e.key === 'ArrowDown' && v.length) { e.preventDefault(); v[0].focus(); }
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); shut(); return; }
      if (e.key === 'Tab') { // mantém o foco dentro do painel
        var f = [search, close].concat(visibleItems(), [allLink]);
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        return;
      }
      var a = document.activeElement; if (!a || !a.classList || !a.classList.contains('bvbar-item')) return;
      var v = visibleItems(), k = v.indexOf(a);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); (v[k + 1] || v[0]).focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); if (k <= 0) search.focus(); else v[k - 1].focus(); }
    });
    // Atalho de teclado: B abre/fecha (ignorado enquanto se digita em campos)
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      var tg = e.target;
      var typing = tg && (tg.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName));
      if (!typing && (e.key === 'b' || e.key === 'B')) { e.preventDefault(); toggle(); }
    });
    window.addEventListener('resize', function () {
      if (isOpen() && !window.matchMedia('(max-width:720px)').matches) document.documentElement.classList.remove('bvbar-lock');
    });
    // Retraduz quando o site muda o idioma (atributo lang do <html> ou data-lang da barra)
    var mo = new MutationObserver(function () { if (resolveLang(nav) !== lastLang) render(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    mo.observe(nav, { attributes: true, attributeFilter: ['data-lang'] });

    api.setLang = function (code) { forcedLang = code || null; render(); };
    api.open = open; api.close = shut; api.refresh = render;
    render();
  }

  var api = { version: 3, libs: BV_LIBS, groups: BV_GROUPS, text: BV_TEXT,
    setLang: function (code) { forcedLang = code || null; }, open: function () {}, close: function () {}, refresh: function () {} };
  window.BiblioVerseBar = api;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
