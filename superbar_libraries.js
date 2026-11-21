/*!
 * BiblioVerse Superbar · Bibliotecas v1 · https://biblioverse.org/superbar_libraries.js
 * Barra das bibliotecas da BiblioVerse. Irmã de superbar_specials.js (projetos especiais).
 *
 * ── O QUE A BARRA MOSTRA ─────────────────────────────────────────────────────
 *   Esquerda: "Um projeto BiblioVerse" (só "BiblioVerse" em telas estreitas), link para o hub.
 *   Direita: "Outras bibliotecas" com o total de bibliotecas menos a atual.
 *   Painel: todas as bibliotecas, por tema, e um botão que sugere os projetos especiais.
 *
 * ── COR ──────────────────────────────────────────────────────────────────────
 *   Sempre a cor da BiblioVerse. Esta barra ignora as cores do site em que está.
 *
 * ── COMO ACRESCENTAR UMA BIBLIOTECA ──────────────────────────────────────────
 *   Copie uma linha de BV_LIBS e troque key, group, icon, url e name.
 *   Em "name" só pt e en são obrigatórios; os outros idiomas caem no inglês.
 *   Projetos especiais NÃO entram aqui: eles ficam em superbar_specials.js.
 *
 * ── COMO INSTALAR EM UMA BIBLIOTECA (uma vez só) ─────────────────────────────
 *   Logo após <body>:
 *   <nav id="bvbar" class="bvbar" data-current="CHAVE" aria-label="BiblioVerse"
 *        style="position:fixed;top:0;left:0;right:0;height:36px;z-index:9000;background:linear-gradient(90deg,#4f7cff,#7a5cff)">
 *     <a href="https://biblioverse.org" style="color:#fff;line-height:36px;padding:0 14px;font-weight:700;text-decoration:none">BiblioVerse</a>
 *   </nav>
 *   No <head>:
 *   <script src="/superbar_libraries.js" defer></script>
 *
 *   data-current = chave da biblioteca (ex.: "web3"); vazio em páginas sem biblioteca (404).
 *   Opcionais: data-lang="es" (força um idioma), data-offset="none"
 *   (não empurra o conteúdo para baixo; use se o site já reservar o espaço da barra).
 *   Cabeçalhos fixos devem ficar em top: var(--bvbar-h).
 *
 * ── IDIOMA ───────────────────────────────────────────────────────────────────
 *   A barra lê o atributo lang do <html> e se retraduz sozinha quando ele muda.
 *   Para forçar: window.BiblioVerseBar.setLang('es'). Idiomas sem tradução usam o inglês.
 *
 * ── API ──────────────────────────────────────────────────────────────────────
 *   window.BiblioVerseBar = { kind: 'libraries', version, libs, groups, text, open, close, ... }
 *   O seletor das bibliotecas (/assets/libbar.js) lê libs, groups e text daqui.
 */
(function () {
  'use strict';
  if (window.BiblioVerseBar) return;

  var HOME = 'https://biblioverse.org';
  var SPECIALS_URL = HOME + '/#projetos';
  var FALLBACK_LANG = 'en';
  // Cor fixa da BiblioVerse
  var C1 = '#4f7cff', C2 = '#7a5cff', C3 = '#b445ff';

  // ── Grupos temáticos ──────────────────────────────────────────────────────
  var BV_GROUPS = [
    { key: 'tech',      name: { pt: 'Tecnologia',      en: 'Technology',        es: 'Tecnología',       fr: 'Technologie',        de: 'Technologie',      it: 'Tecnologia' } },
    { key: 'creative',  name: { pt: 'Criatividade',    en: 'Creativity',        es: 'Creatividad',      fr: 'Créativité',         de: 'Kreativität',      it: 'Creatività' } },
    { key: 'culture',   name: { pt: 'Cultura e lazer', en: 'Culture & Leisure', es: 'Cultura y ocio',   fr: 'Culture et loisirs', de: 'Kultur & Freizeit', it: 'Cultura e tempo libero' } },
    { key: 'knowledge', name: { pt: 'Conhecimento',    en: 'Knowledge',         es: 'Conocimiento',     fr: 'Connaissance',       de: 'Wissen',           it: 'Conoscenza' } },
    { key: 'freethought', name: { pt: 'Pensamento Livre', en: 'Freethought', es: 'Librepensamiento', fr: 'Libre pensée', de: 'Freidenkertum', it: 'Libero pensiero' } },
    { key: 'life',      name: { pt: 'Vida prática',    en: 'Everyday Life',     es: 'Vida práctica',    fr: 'Vie pratique',       de: 'Alltag',           it: 'Vita pratica' } }
  ];

  // ── Bibliotecas ───────────────────────────────────────────────────────────
  // key: chave usada em data-current | group: chave de BV_GROUPS | soon: true = "em breve"
  var BV_LIBS = [
    { key: 'ai',          group: 'tech',      icon: '🤖', url: 'https://biblioverse.org/ai/',          name: { pt: 'IA', en: 'AI', es: 'IA', fr: 'IA', de: 'KI', it: 'IA' } },
    { key: 'coding',      group: 'tech',      icon: '💻', url: 'https://biblioverse.org/code/',        name: { pt: 'Programação', en: 'Coding', es: 'Programación', fr: 'Programmation', de: 'Programmierung', it: 'Programmazione' } },
    { key: 'data',        group: 'knowledge', icon: '📊', url: 'https://biblioverse.org/data/',        name: { pt: 'Dados', en: 'Data', es: 'Datos', fr: 'Données', de: 'Daten', it: 'Dati' } },
    { key: 'web3',        group: 'tech',      icon: '🔗', url: 'https://biblioverse.org/web3/',        name: { pt: 'Web3', en: 'Web3' } },
    { key: 'design',      group: 'creative',  icon: '🎨', url: 'https://biblioverse.org/design/',      name: { pt: 'Design', en: 'Design', es: 'Diseño', fr: 'Design', de: 'Design', it: 'Design' } },
    { key: 'photography', group: 'creative',  icon: '📷', url: 'https://biblioverse.org/photography/', name: { pt: 'Fotografia', en: 'Photography', es: 'Fotografía', fr: 'Photographie', de: 'Fotografie', it: 'Fotografia' } },
    { key: 'print',       group: 'creative',  icon: '📰', url: 'https://biblioverse.org/print/',       name: { pt: 'Mídia Impressa', en: 'Print Media', es: 'Medios impresos', fr: 'Presse écrite', de: 'Printmedien', it: 'Stampa' } },
    { key: 'art',         group: 'creative',  icon: '🖼️', url: 'https://biblioverse.org/art/',         name: { pt: 'Arte', en: 'Art', es: 'Arte', fr: 'Art', de: 'Kunst', it: 'Arte' } },
    { key: 'games',       group: 'culture',   icon: '🎮', url: 'https://biblioverse.org/games/',       name: { pt: 'Games', en: 'Games', es: 'Videojuegos', fr: 'Jeux vidéo', de: 'Games', it: 'Videogiochi' } },
    { key: 'list',        group: 'culture',   icon: '📋', url: 'https://biblioverse.org/list/',        name: { pt: 'Listas', en: 'Lists', es: 'Listas', fr: 'Listes', de: 'Listen', it: 'Liste' } },
    { key: 'music',       group: 'culture',   icon: '🎵', url: 'https://biblioverse.org/music/',       name: { pt: 'Música', en: 'Music', es: 'Música', fr: 'Musique', de: 'Musik', it: 'Musica' } },
    { key: 'philosophy',  group: 'freethought', icon: '🦉', url: 'https://biblioverse.org/philosophy/',  name: { pt: 'Filosofia', en: 'Philosophy', es: 'Filosofía', fr: 'Philosophie', de: 'Philosophie', it: 'Filosofia' } },
    { key: 'language',    group: 'knowledge', icon: '🗣️', url: 'https://biblioverse.org/language/',    name: { pt: 'Idiomas', en: 'Languages', es: 'Idiomas', fr: 'Langues', de: 'Sprachen', it: 'Lingue' } },
    { key: 'history',     group: 'knowledge', icon: '📜', url: 'https://biblioverse.org/history/',     name: { pt: 'História', en: 'History', es: 'Historia', fr: 'Histoire', de: 'Geschichte', it: 'Storia' } },
    { key: 'thinking',    group: 'freethought', icon: '🧠', url: 'https://biblioverse.org/thinking/',    name: { pt: 'Racionalidade', en: 'Rationality', es: 'Racionalidad', fr: 'Rationalité', de: 'Rationalität', it: 'Razionalità' } },
    { key: 'job',         group: 'life',      icon: '💼', url: 'https://biblioverse.org/job/',         name: { pt: 'Emprego', en: 'Jobs', es: 'Empleo', fr: 'Emploi', de: 'Jobs', it: 'Lavoro' } },
    { key: 'management',  group: 'life',      icon: '🗂️', url: 'https://biblioverse.org/management/',  name: { pt: 'Organização', en: 'Organization', es: 'Organización', fr: 'Organisation', de: 'Organisation', it: 'Organizzazione' } },
    { key: 'social',      group: 'tech',      icon: '🗺', url: 'https://biblioverse.org/social/',      name: { pt: 'Redes Sociais', en: 'Social', es: 'Redes sociales', fr: 'Réseaux sociaux', de: 'Soziale Netzwerke', it: 'Social network' } },
    { key: 'travel',      group: 'life',      icon: '✈️', url: 'https://biblioverse.org/travel/',      name: { pt: 'Viagem', en: 'Travel', es: 'Viajes', fr: 'Voyage', de: 'Reisen', it: 'Viaggi' } },
    { key: 'antiscam',    group: 'life',      icon: '🛡️', url: 'https://biblioverse.org/antiscam/',    name: { pt: 'Antigolpe', en: 'Anti-Scam', es: 'Antiestafas', fr: 'Anti-arnaques', de: 'Betrugsschutz', it: 'Antitruffa' } },
    { key: 'conspiracy',  group: 'freethought', icon: '🕵️', url: 'https://biblioverse.org/conspiracy/', name: { pt: 'Conspirações', en: 'Conspiracies', es: 'Conspiraciones', fr: 'Conspirations', de: 'Verschwörungen', it: 'Cospirazioni' } },
    { key: 'truecrime',   group: 'culture',   icon: '🔍', url: 'https://biblioverse.org/truecrime/',   name: { pt: 'True Crime', en: 'True Crime', es: 'True crime', fr: 'True crime', de: 'True Crime', it: 'True crime' } },
    { key: 'esports',     group: 'culture',   icon: '🕹️', url: 'https://biblioverse.org/esports/',     name: { pt: 'eSports', en: 'eSports', es: 'eSports', fr: 'eSport', de: 'E-Sport', it: 'eSports' } }
  ];

  // ── Textos da interface ───────────────────────────────────────────────────
  // tagline: {b} é substituído pela marca "BiblioVerse" em negrito.
  // ctaTitle / ctaText: botão do painel que sugere os projetos especiais.
  var BV_TEXT = {
    pt: { tagline: 'Um projeto {b}', others: 'Outras bibliotecas', libs: 'Bibliotecas', panel: 'Bibliotecas BiblioVerse', ctaTitle: 'Conheça os projetos especiais', ctaText: 'Guias e sites sobre ética, IA, música, cultura e esportes.', close: 'Fechar', home: 'Página inicial da BiblioVerse', here: 'você está aqui', all: 'Conhecer a BiblioVerse', soon: 'em breve', open: 'Abrir a lista de bibliotecas', by: 'Criado por' },
    en: { tagline: 'A {b} project', others: 'Other libraries', libs: 'Libraries', panel: 'BiblioVerse libraries', ctaTitle: 'Discover the special projects', ctaText: 'Guides and sites on ethics, AI, music, culture and sports.', close: 'Close', home: 'BiblioVerse home page', here: 'you are here', all: 'Visit BiblioVerse', soon: 'soon', open: 'Open the library list', by: 'Created by' },
    es: { tagline: 'Un proyecto {b}', others: 'Otras bibliotecas', libs: 'Bibliotecas', panel: 'Bibliotecas BiblioVerse', ctaTitle: 'Conoce los proyectos especiales', ctaText: 'Guías y sitios sobre ética, IA, música, cultura y deportes.', close: 'Cerrar', home: 'Página de inicio de BiblioVerse', here: 'estás aquí', all: 'Conocer BiblioVerse', soon: 'pronto', open: 'Abrir la lista de bibliotecas', by: 'Creado por' },
    fr: { tagline: 'Un projet {b}', others: 'Autres bibliothèques', libs: 'Bibliothèques', panel: 'Bibliothèques BiblioVerse', ctaTitle: 'Découvrez les projets spéciaux', ctaText: 'Guides et sites sur l’éthique, l’IA, la musique, la culture et le sport.', close: 'Fermer', home: "Page d'accueil de BiblioVerse", here: 'vous êtes ici', all: 'Découvrir BiblioVerse', soon: 'bientôt', open: 'Ouvrir la liste des bibliothèques', by: 'Créé par' },
    de: { tagline: 'Ein {b}-Projekt', others: 'Weitere Bibliotheken', libs: 'Bibliotheken', panel: 'BiblioVerse-Bibliotheken', ctaTitle: 'Entdecke die Sonderprojekte', ctaText: 'Guides und Websites zu Ethik, KI, Musik, Kultur und Sport.', close: 'Schließen', home: 'BiblioVerse-Startseite', here: 'Sie sind hier', all: 'BiblioVerse entdecken', soon: 'bald', open: 'Bibliotheksliste öffnen', by: 'Erstellt von' },
    it: { tagline: 'Un progetto {b}', others: 'Altre biblioteche', libs: 'Biblioteche', panel: 'Biblioteche BiblioVerse', ctaTitle: 'Scopri i progetti speciali', ctaText: 'Guide e siti su etica, IA, musica, cultura e sport.', close: 'Chiudi', home: 'Pagina iniziale di BiblioVerse', here: 'sei qui', all: 'Scopri BiblioVerse', soon: 'presto', open: "Apri l'elenco delle biblioteche", by: 'Creato da' }
  };

  // ── Estilos ───────────────────────────────────────────────────────────────
  var FONT = '"TASA Explorer",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=TASA+Explorer:wght@400;600;700&display=swap';
  var GRAD = 'linear-gradient(90deg,' + C1 + ',' + C2 + ')';
  var CSS = [
    ':root:root{--bvbar-h:36px;--superbar-h:var(--bvbar-h);}',
    'html.bvbar-on body{padding-top:var(--bvbar-h)!important;}',
    'html.bvbar-on{scroll-padding-top:calc(var(--bvbar-h) + 12px);}',
    '.bvbar{position:fixed;top:0;left:0;right:0;height:var(--bvbar-h);z-index:9000;display:flex;align-items:center;gap:8px;',
    ' padding:0 max(10px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));margin:0;',
    ' background:' + GRAD + ';color:#fff;font-family:' + FONT + ';font-size:13px;line-height:1;box-sizing:border-box;}',
    '.bvbar *,.bvbar-panel *{box-sizing:border-box;}',
    // mesma fonte em todas as bibliotecas
    '.bvbar,.bvbar *,.bvbar-panel,.bvbar-panel *{font-family:' + FONT + '!important;}',
    '.bvbar a,.bvbar button{color:#fff;font:inherit;margin:0;}',
    '.bvbar button{-webkit-tap-highlight-color:transparent;}',
    '.bvbar-home{display:inline-flex;align-items:center;gap:0;text-decoration:none;white-space:nowrap;flex:none;min-height:30px;font-weight:400;}',
    '.bvbar-home .bvbar-brand{font-weight:700;}',
    '.bvbar-home .bvbar-tag{white-space:pre;}',
    '.bvbar-pill{display:inline-flex;align-items:center;gap:6px;border:0;background:rgba(255,255,255,.16);height:26px;padding:0 10px;border-radius:999px;cursor:pointer;white-space:nowrap;transition:background .15s;}',
    '.bvbar-pill:hover{background:rgba(255,255,255,.28);}',
    '.bvbar-pill:focus-visible,.bvbar-home:focus-visible{outline:2px solid #fff;outline-offset:2px;}',
    '.bvbar-spacer{flex:1;min-width:4px;}',
    '.bvbar-menu{flex:none;}',
    '.bvbar-burger{display:block;width:16px;height:12px;flex:none;}',
    '.bvbar-count{background:rgba(255,255,255,.92);color:' + C2 + ';border-radius:999px;padding:0 6px;font-size:11px;font-weight:700;line-height:16px;}',
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
    // rolagem do painel com o gradiente da marca
    '.bvbar-panel::-webkit-scrollbar{width:10px;}',
    '.bvbar-panel::-webkit-scrollbar-track{background:transparent;margin:14px 0;}',
    '.bvbar-panel::-webkit-scrollbar-thumb{background:linear-gradient(180deg,' + C1 + ',' + C2 + ',' + C3 + ');border:2px solid var(--p-bg);background-clip:padding-box;border-radius:999px;}',
    '@supports not selector(::-webkit-scrollbar){.bvbar-panel{scrollbar-width:thin;scrollbar-color:' + C2 + ' transparent;}}',
    '.bvbar-top{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:-14px;margin:-14px -14px 0;padding:14px 14px 8px;background:var(--p-bg);z-index:1;}',
    // títulos do painel: cor própria, imunes aos estilos de h2/h3 de cada site
    '.bvbar-panel h2,.bvbar-panel h3{color:var(--p-text);background:none;-webkit-text-fill-color:currentColor;letter-spacing:normal;line-height:1.25;text-transform:none;}',
    '.bvbar-ptitle{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;margin:0;padding-left:2px;color:var(--p-text);}',
    '.bvbar-chip{background:var(--p-soft);border:1px solid var(--p-border);color:var(--p-muted);border-radius:999px;padding:1px 8px;font-size:11.5px;font-weight:700;line-height:1.4;}',
    '.bvbar-close{flex:none;height:42px;width:42px;border-radius:12px;border:1px solid var(--p-border);background:var(--p-soft);color:var(--p-text);cursor:pointer;font-size:16px;font-family:inherit;}',
    // grupos temáticos
    '.bvbar-group{margin:12px 0 2px;}',
    '.bvbar-group:first-child{margin-top:4px;}',
    '.bvbar-panel .bvbar-gtitle{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--p-muted);margin:0 0 6px 2px;font-weight:700;font-family:inherit;}',
    '.bvbar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px;}',
    '.bvbar-item{display:flex;align-items:center;gap:10px;min-height:44px;padding:8px 10px;border-radius:12px;text-decoration:none;color:var(--p-text);border:1px solid transparent;background:var(--p-soft);font-size:13.5px;}',
    '.bvbar-item:hover,.bvbar-item:focus-visible{border-color:' + C1 + ';outline:none;}',
    '.bvbar-item .ico{font-size:18px;width:24px;text-align:center;flex:none;}',
    '.bvbar-item .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;}',
    '.bvbar-item .tag{font-size:10.5px;color:var(--p-muted);white-space:nowrap;flex:none;}',
    // Itens com etiqueta ("você está aqui", "em breve") levam a etiqueta para a segunda linha
    '.bvbar-item:has(.tag){flex-wrap:wrap;row-gap:0;}',
    '.bvbar-item:has(.tag) .tag{flex-basis:100%;padding-left:34px;line-height:1.3;}',
    '.bvbar-item.is-current{border-color:' + C2 + ';background:rgba(122,92,255,.16);}',
    '.bvbar-item.is-soon{opacity:.55;}',
    // botão que sugere os projetos especiais
    '.bvbar-cta{display:flex;align-items:center;gap:12px;margin-top:16px;padding:12px 14px;border-radius:12px;text-decoration:none;background:' + GRAD + ';color:#fff;border:1px solid transparent;}',
    '.bvbar-cta:hover,.bvbar-cta:focus-visible{border-color:#fff;outline:none;}',
    '.bvbar-cta .cx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}',
    '.bvbar-cta .ct{font-size:13.5px;font-weight:700;color:#fff;}',
    '.bvbar-cta .cd{font-size:12px;font-weight:400;color:rgba(255,255,255,.88);}',
    '.bvbar-cta .ca{flex:none;font-size:16px;font-weight:700;color:#fff;}',
    '.bvbar-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;padding-top:10px;border-top:1px solid var(--p-border);font-size:12.5px;}',
    '.bvbar-foot a{color:' + C1 + ';text-decoration:none;font-weight:700;padding:6px 2px;}',
    '.bvbar-credit{color:var(--p-muted);}',
    '.bvbar-credit a{font-weight:600;}',
    'html.bvbar-lock,html.bvbar-lock body{overflow:hidden;}',
    // responsivo: abaixo de 720px só a marca à esquerda; abaixo de 400px só o ícone e o número à direita
    '@media (max-width:720px){',
    ' .bvbar-home .bvbar-tag{display:none;}',
    ' .bvbar-panel{top:var(--bvbar-h);left:0;right:0;bottom:0;width:auto;max-height:none;border-radius:0;border:0;border-top:1px solid var(--p-border);',
    '   padding:14px max(14px,env(safe-area-inset-right)) max(18px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));}',
    ' .bvbar-grid{grid-template-columns:repeat(2,minmax(0,1fr));}',
    ' .bvbar-item.is-current .tag{display:none;}',
    '}',
    '@media (max-width:400px){',
    ' .bvbar{gap:6px;}',
    ' .bvbar-menu .lbl{display:none;}',
    '}',
    '@media (max-width:340px){.bvbar-grid{grid-template-columns:1fr;}}',
    '@media (prefers-reduced-motion:reduce){.bvbar-backdrop,.bvbar-pill{transition:none;}}',
    '@media print{.bvbar,.bvbar-panel,.bvbar-backdrop{display:none!important;}html.bvbar-on body{padding-top:0!important;}}'
  ].join('\n');

  var BURGER = '<svg class="bvbar-burger" viewBox="0 0 18 14" aria-hidden="true" focusable="false">' +
    '<rect y="0" width="18" height="2" rx="1" fill="currentColor"/><rect y="6" width="18" height="2" rx="1" fill="currentColor"/>' +
    '<rect y="12" width="18" height="2" rx="1" fill="currentColor"/></svg>';

  // ── Utilitários ───────────────────────────────────────────────────────────
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pick(obj, L) { return (obj && (obj[L] || obj[FALLBACK_LANG] || obj.pt)) || ''; }

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
    var libs = BV_LIBS.slice();
    var currentKey = nav.getAttribute('data-current') || '';
    var current = null;
    function isCur(l) { return l.key === currentKey || (l.alias || []).indexOf(currentKey) >= 0; }
    libs.forEach(function (l) { if (isCur(l)) current = l; });
    var total = libs.filter(function (l) { return !l.soon; }).length;
    var others = total - (current && !current.soon ? 1 : 0);

    // A barra carrega a própria fonte
    var fontLink = el('link'); fontLink.id = 'bvbar-font'; fontLink.rel = 'stylesheet'; fontLink.href = FONT_URL; document.head.appendChild(fontLink);
    var st = el('style'); st.id = 'bvbar-style'; st.textContent = CSS; document.head.appendChild(st);
    if (nav.getAttribute('data-offset') !== 'none') document.documentElement.classList.add('bvbar-on');

    // Barra
    nav.removeAttribute('style');
    nav.innerHTML = '';
    nav.classList.add('bvbar');
    nav.setAttribute('data-bar', 'libraries');
    var home = el('a', 'bvbar-home'); home.href = HOME;
    var tagPre = el('span', 'bvbar-tag'), brand = el('span', 'bvbar-brand', 'BiblioVerse'), tagPos = el('span', 'bvbar-tag');
    home.appendChild(tagPre); home.appendChild(brand); home.appendChild(tagPos);
    nav.appendChild(home);

    nav.appendChild(el('span', 'bvbar-spacer'));
    var btn = el('button', 'bvbar-pill bvbar-menu'); btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'bvbar-panel');
    btn.setAttribute('aria-keyshortcuts', 'B');
    btn.innerHTML = BURGER;
    var btnLbl = el('span', 'lbl'); btn.appendChild(btnLbl);
    btn.appendChild(el('span', 'bvbar-count', String(others)));
    nav.appendChild(btn);

    // Painel
    var backdrop = el('div', 'bvbar-backdrop');
    var panel = el('div', 'bvbar-panel'); panel.id = 'bvbar-panel';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    var top = el('div', 'bvbar-top');
    var ptitle = el('h2', 'bvbar-ptitle'); var ptitleTxt = el('span'); ptitle.appendChild(ptitleTxt); ptitle.appendChild(el('span', 'bvbar-chip', String(total)));
    var close = el('button', 'bvbar-close', '✕'); close.type = 'button';
    top.appendChild(ptitle); top.appendChild(close); panel.appendChild(top);
    var body = el('div', 'bvbar-body'); panel.appendChild(body);
    // botão que sugere os projetos especiais
    var cta = el('a', 'bvbar-cta'); cta.href = SPECIALS_URL;
    var ctaBox = el('span', 'cx'), ctaTitle = el('span', 'ct'), ctaText = el('span', 'cd');
    ctaBox.appendChild(ctaTitle); ctaBox.appendChild(ctaText); cta.appendChild(ctaBox);
    var ctaArrow = el('span', 'ca', '→'); ctaArrow.setAttribute('aria-hidden', 'true'); cta.appendChild(ctaArrow);
    panel.appendChild(cta);
    var foot = el('div', 'bvbar-foot');
    var credit = el('span', 'bvbar-credit'); var creditBy = document.createTextNode(''); var creditLink = el('a');
    creditLink.href = 'https://www.linkedin.com/in/juliocesarprava'; creditLink.target = '_blank'; creditLink.rel = 'noopener';
    creditLink.textContent = 'Julio Cesar Prava'; credit.appendChild(creditBy); credit.appendChild(creditLink); foot.appendChild(credit);
    var allLink = el('a'); allLink.href = HOME; foot.appendChild(allLink); panel.appendChild(foot);
    document.body.appendChild(backdrop); document.body.appendChild(panel);

    var items = [], lastLang = null;
    function render() {
      var L = resolveLang(nav), t = BV_TEXT[L] || BV_TEXT[FALLBACK_LANG];
      lastLang = L;
      nav.setAttribute('aria-label', 'BiblioVerse');
      home.title = t.home; home.setAttribute('aria-label', t.home);
      var tag = (t.tagline || '{b}').split('{b}');
      tagPre.textContent = tag[0] || ''; tagPos.textContent = tag[1] || '';
      btnLbl.textContent = current ? t.others : t.libs; btn.title = t.open; btn.setAttribute('aria-label', t.open + ' (' + others + ')');
      close.title = t.close; close.setAttribute('aria-label', t.close);
      creditBy.nodeValue = t.by + ' '; allLink.textContent = t.all + ' →';
      ptitleTxt.textContent = t.panel;
      ctaTitle.textContent = t.ctaTitle; ctaText.textContent = t.ctaText;
      panel.setAttribute('aria-label', t.panel);
      body.innerHTML = ''; items = [];

      BV_GROUPS.forEach(function (g) {
        var list = libs.filter(function (l) { return l.group === g.key; });
        if (!list.length) return;
        var wrap = el('section', 'bvbar-group'); wrap.appendChild(el('h3', 'bvbar-gtitle', pick(g.name, L)));
        var grid = el('div', 'bvbar-grid');
        list.sort(function (a, b) { return pick(a.name, L).localeCompare(pick(b.name, L), L, { sensitivity: 'base' }); })
          .forEach(function (l) {
            var a = el('a', 'bvbar-item'); a.href = typeof l.url === 'string' ? l.url : pick(l.url, L);
            a.appendChild(el('span', 'ico', l.icon)); a.appendChild(el('span', 'nm', pick(l.name, L)));
            if (isCur(l)) { a.classList.add('is-current'); a.setAttribute('aria-current', 'page'); a.appendChild(el('span', 'tag', t.here)); }
            else if (l.soon) { a.classList.add('is-soon'); a.appendChild(el('span', 'tag', t.soon)); }
            grid.appendChild(a); items.push(a);
          });
        wrap.appendChild(grid); body.appendChild(wrap);
      });
    }
    function isOpen() { return panel.classList.contains('is-open'); }
    var lastFocus = null;
    function setExpanded(v) { btn.setAttribute('aria-expanded', v); }
    function open() {
      if (isOpen()) return;
      lastFocus = document.activeElement;
      if (resolveLang(nav) !== lastLang) render();
      panel.classList.add('is-open'); backdrop.classList.add('is-open'); nav.classList.add('is-open'); setExpanded('true');
      if (window.matchMedia('(max-width:720px)').matches) document.documentElement.classList.add('bvbar-lock');
      panel.scrollTop = 0;
      setTimeout(function () { try { close.focus({ preventScroll: true }); } catch (e) { close.focus(); } }, 0);
    }
    function shut() {
      if (!isOpen()) return;
      panel.classList.remove('is-open'); backdrop.classList.remove('is-open'); nav.classList.remove('is-open'); setExpanded('false');
      document.documentElement.classList.remove('bvbar-lock');
      if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }
    function toggle() { isOpen() ? shut() : open(); }

    btn.addEventListener('click', toggle);
    close.addEventListener('click', shut);
    backdrop.addEventListener('click', shut);
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); shut(); return; }
      if (e.key === 'Tab') { // mantém o foco dentro do painel
        var f = [close].concat(items, [cta, creditLink, allLink]);
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        return;
      }
      var a = document.activeElement; if (!a || !a.classList || !a.classList.contains('bvbar-item')) return;
      var k = items.indexOf(a);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); (items[k + 1] || cta).focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); if (k <= 0) close.focus(); else items[k - 1].focus(); }
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
    api.total = total; api.others = others;
    render();
  }

  var api = { kind: 'libraries', version: 1, libs: BV_LIBS, groups: BV_GROUPS, text: BV_TEXT,
    setLang: function (code) { forcedLang = code || null; }, open: function () {}, close: function () {}, refresh: function () {} };
  window.BiblioVerseBar = api;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
