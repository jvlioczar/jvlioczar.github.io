/*!
 * BiblioVerse Superbar · Projetos especiais v1 · https://biblioverse.org/superbar_specials.js
 * Barra dos projetos especiais da BiblioVerse. Irmã de superbar_libraries.js (bibliotecas).
 *
 * ── O QUE A BARRA MOSTRA ─────────────────────────────────────────────────────
 *   Esquerda: "Um projeto BiblioVerse" (só "BiblioVerse" em telas estreitas), link para o hub.
 *   Direita: "Outros projetos" com o total de projetos especiais menos o atual.
 *   Painel: todos os projetos especiais (primeiro os do mesmo grupo do site atual)
 *   e um botão que sugere as bibliotecas.
 *
 * ── COR (só a cor muda; tipografia, tamanho e layout são sempre os mesmos) ───
 *   Sem configuração, a barra usa a cor da BiblioVerse. Cada projeto pode adaptar a cor
 *   ao seu tema de duas formas:
 *   1. No CSS do site (acompanha tema claro/escuro, se o site redefinir as variáveis):
 *        :root { --bvbar-bg: #0b3d2e; --bvbar-fg: #ffffff; --bvbar-accent: #1f9d6b; }
 *   2. Na própria tag da barra (tem prioridade sobre o CSS):
 *        <nav id="bvbar" ... data-bg="#0b3d2e" data-fg="#ffffff" data-accent="#1f9d6b">
 *   --bvbar-bg     fundo da barra e do botão das bibliotecas (cor ou gradiente)
 *   --bvbar-fg     texto e ícones sobre esse fundo
 *   --bvbar-accent destaques: número da pílula, item atual, bordas ao passar o mouse, rolagem.
 *                  Precisa contrastar com --bvbar-fg (o número da pílula usa as duas).
 *   Use no placeholder da barra o mesmo fundo de --bvbar-bg, para a cor não piscar ao carregar.
 *
 * ── COMO ACRESCENTAR UM PROJETO ESPECIAL ─────────────────────────────────────
 *   Copie uma linha de BV_PROJECTS e troque key, group, icon, url e name.
 *   Em "name" só pt e en são obrigatórios; os outros idiomas caem no inglês.
 *   Projeto com versões por idioma em domínios separados: url: { pt: ..., en: ... }
 *   e alias: ['chave-do-outro-site'] (ex.: pelosanimais / fortheanimals).
 *   Bibliotecas NÃO entram aqui: elas ficam em superbar_libraries.js.
 *
 * ── COMO INSTALAR EM UM PROJETO (uma vez só) ─────────────────────────────────
 *   Logo após <body>:
 *   <nav id="bvbar" class="bvbar" data-current="CHAVE" aria-label="BiblioVerse"
 *        style="position:fixed;top:0;left:0;right:0;height:36px;z-index:9000;background:linear-gradient(90deg,#4f7cff,#7a5cff)">
 *     <a href="https://biblioverse.org" style="color:#fff;line-height:36px;padding:0 14px;font-weight:700;text-decoration:none">BiblioVerse</a>
 *   </nav>
 *   No <head>:
 *   <script src="https://biblioverse.org/superbar_specials.js" defer></script>
 *
 *   data-current = chave do projeto (ex.: "typesofrock").
 *   Opcionais: data-lang="es" (força um idioma), data-offset="none"
 *   (não empurra o conteúdo para baixo; use se o site já reservar o espaço da barra).
 *   Sites com cabeçalho fixo devem posicioná-lo em top: var(--bvbar-h).
 *
 * ── IDIOMA ───────────────────────────────────────────────────────────────────
 *   A barra lê o atributo lang do <html> e se retraduz sozinha quando ele muda.
 *   Para forçar: window.BiblioVerseBar.setLang('es'). Idiomas sem tradução usam o inglês.
 *
 * ── API ──────────────────────────────────────────────────────────────────────
 *   window.BiblioVerseBar = { kind: 'specials', version, projects, groups, text, open, close, ... }
 */
(function () {
  'use strict';
  if (window.BiblioVerseBar) return;

  var HOME = 'https://biblioverse.org';
  var LIBRARIES_URL = HOME + '/#bibliotecas';
  var FALLBACK_LANG = 'en';
  // Cores padrão (BiblioVerse), usadas quando o projeto não define as suas
  var BG = 'var(--bvbar-bg,linear-gradient(90deg,#4f7cff,#7a5cff))';
  var FG = 'var(--bvbar-fg,#fff)';
  var ACCENT = 'var(--bvbar-accent,#7a5cff)';

  // ── Grupos de projetos especiais ──────────────────────────────────────────
  var BV_GROUPS = [
    { key: 'beginners', name: { pt: 'Para iniciantes', en: 'For Beginners', es: 'Para principiantes', fr: 'Pour débutants', de: 'Für Einsteiger', it: 'Per principianti' } },
    { key: 'animals', name: { pt: 'Ética animal', en: 'Animal Ethics', es: 'Ética animal', fr: 'Éthique animale', de: 'Tierethik', it: 'Etica animale' } },
    { key: 'ai', name: { pt: 'Inteligência Artificial', en: 'Artificial Intelligence', es: 'Inteligencia artificial', fr: 'Intelligence artificielle', de: 'Künstliche Intelligenz', it: 'Intelligenza artificiale' } },
    { key: 'music', name: { pt: 'Música', en: 'Music', es: 'Música', fr: 'Musique', de: 'Musik', it: 'Musica' } },
    { key: 'travel', name: { pt: 'Cultura e Viagem', en: 'Culture & Travel', es: 'Cultura y viajes', fr: 'Culture et voyage', de: 'Kultur & Reisen', it: 'Cultura e viaggi' } },
    { key: 'sports', name: { pt: 'Esportes', en: 'Sports', es: 'Deportes', fr: 'Sports', de: 'Sport', it: 'Sport' } },
    { key: 'humans', name: { pt: 'Direitos humanos', en: 'Human Rights', es: 'Derechos humanos', fr: 'Droits humains', de: 'Menschenrechte', it: 'Diritti umani' } },
    { key: 'relationships', name: { pt: 'Relacionamentos', en: 'Relationships', es: 'Relaciones', fr: 'Relations', de: 'Beziehungen', it: 'Relazioni' } }
  ];

  // ── Projetos especiais ────────────────────────────────────────────────────
  // key: chave usada em data-current | group: chave de BV_GROUPS | soon: true = "em breve"
  var BV_PROJECTS = [
    // Para iniciantes
    { key: 'politicaparainiciantes', group: 'beginners', icon: '🏛️', url: 'https://politicaparainiciantes.biblioverse.org', name: { pt: 'Política Para Iniciantes', en: 'Politics for Beginners', es: 'Política para principiantes', fr: 'La politique pour débutants', de: 'Politik für Einsteiger', it: 'Politica per principianti' } },
    { key: 'eticaparainiciantes', group: 'beginners', icon: '⚖️', url: 'https://eticaparainiciantes.biblioverse.org', name: { pt: 'Ética Para Iniciantes', en: 'Ethics for Beginners', es: 'Ética para principiantes', fr: 'L’éthique pour débutants', de: 'Ethik für Einsteiger', it: 'Etica per principianti' } },
    { key: 'cienciaparainiciantes', group: 'beginners', icon: '🔬', url: 'https://cienciaparainiciantes.biblioverse.org', name: { pt: 'Ciência Para Iniciantes', en: 'Science for Beginners', es: 'Ciencia para principiantes', fr: 'La science pour débutants', de: 'Wissenschaft für Einsteiger', it: 'Scienza per principianti' } },
    // Direitos humanos
    { key: 'peloshumanos', group: 'humans', icon: '🤝', url: 'https://peloshumanos.biblioverse.org', name: { pt: 'Guia de Argumentação Pelos Humanos', en: 'Guia de Argumentação Pelos Humanos', es: 'Guia de Argumentação Pelos Humanos', fr: 'Guia de Argumentação Pelos Humanos', de: 'Guia de Argumentação Pelos Humanos', it: 'Guia de Argumentação Pelos Humanos' } },
    // Ética animal
    { key: 'questaodeetica', group: 'animals', icon: '👁️', url: 'https://questaodeetica.biblioverse.org', name: { pt: 'Questão de Ética', en: 'Questão de Ética', es: 'Questão de Ética', fr: 'Questão de Ética', de: 'Questão de Ética', it: 'Questão de Ética' } },
    { key: 'pelosanimais', alias: ['fortheanimals'], group: 'animals', icon: '🐾', url: { pt: 'https://pelosanimais.biblioverse.org', en: 'https://fortheanimals.biblioverse.org' }, name: { pt: 'Guia de Argumentação Pelos Animais', en: 'For the Animals: An Argument Guide', es: 'Guía de argumentación por los animales', fr: 'Guide d’argumentation pour les animaux', de: 'Argumentationsleitfaden für die Tiere', it: 'Guida all’argomentazione per gli animali' } },
    { key: 'ethicalfood', group: 'animals', icon: '🥗', url: 'https://ethicalfood.biblioverse.org', name: { pt: 'Guia de Alimentos Éticos', en: 'Ethical Food Guide', es: 'Guía de Alimentos Éticos', fr: 'Guide des aliments éthiques', de: 'Leitfaden für ethische Lebensmittel', it: 'Guida agli alimenti etici' } },
    // Inteligência Artificial
    { key: 'aihistory', group: 'ai', icon: '⏳', url: 'https://aihistory.biblioverse.org', name: { pt: 'Linha do Tempo da História da IA', en: 'AI History Timeline', es: 'Cronología de la historia de la IA', fr: 'Chronologie de l’histoire de l’IA', de: 'Zeitleiste der KI-Geschichte', it: 'Cronologia della storia dell’IA' } },
    { key: 'curatedai', group: 'ai', icon: '🏛️', url: 'https://curatedai.biblioverse.org', name: { pt: 'Curated AI', en: 'Curated AI', es: 'Curated AI', fr: 'Curated AI', de: 'Curated AI', it: 'Curated AI' } },
    // Música
    { key: 'typesofrock', group: 'music', icon: '🎸', url: 'https://typesofrock.biblioverse.org', name: { pt: 'Tipos de Rock', en: 'Types of Rock', es: 'Tipos de rock', fr: 'Types de rock', de: 'Arten von Rock', it: 'Tipi di rock' } },
    { key: 'brazilianmusic', group: 'music', icon: '🎶', url: 'https://brazilianmusic.biblioverse.org', name: { pt: 'Música Brasileira', en: 'Brazilian Music', es: 'Música brasileña', fr: 'Musique brésilienne', de: 'Brasilianische Musik', it: 'Musica brasiliana' } },
    // Cultura e Viagem
    { key: 'brazilianculture', group: 'travel', icon: '🦜', url: 'https://brazilianculture.biblioverse.org', name: { pt: 'Cultura Brasileira', en: 'Brazilian Culture', es: 'Cultura brasileña', fr: 'Culture brésilienne', de: 'Brasilianische Kultur', it: 'Cultura brasiliana' } },
    { key: 'australianculture', group: 'travel', icon: '🪃', url: 'https://australianculture.biblioverse.org', name: { pt: 'Cultura Australiana', en: 'Australian Culture', es: 'Cultura australiana', fr: 'Culture australienne', de: 'Australische Kultur', it: 'Cultura australiana' } },
    { key: 'brasileirosnaaustralia', group: 'travel', icon: '🦘', url: 'https://brasileirosnaaustralia.biblioverse.org', name: { pt: 'Brasileiros na Austrália', en: 'Brazilians in Australia', es: 'Brasileños en Australia', fr: 'Brésiliens en Australie', de: 'Brasilianer in Australien', it: 'Brasiliani in Australia' } },
    { key: 'brisbaneveganguide', group: 'travel', icon: '🌱', url: 'https://brisbaneveganguide.com', name: { pt: 'Brisbane Vegan Guide', en: 'Brisbane Vegan Guide' } },
    { key: 'brissyopshops', group: 'travel', icon: '🛍️', url: 'https://brissyopshops.com', name: { pt: 'Brissy Op Shops', en: 'Brissy Op Shops' } },
    // Esportes
    { key: 'goats', group: 'sports', icon: '🐐', url: 'https://goat.biblioverse.org', name: { pt: 'GOATs', en: 'GOATs' } },
    { key: 'lfb', group: 'sports', icon: '⚽', url: 'https://lendasdofutebolbrasileiro.biblioverse.org', name: { pt: 'Lendas do Futebol Brasileiro', en: 'Brazilian Football Legends', es: 'Leyendas del fútbol brasileño', fr: 'Légendes du football brésilien', de: 'Brasilianische Fußballlegenden', it: 'Leggende del calcio brasiliano' } },
    { key: 'biggestclubs', group: 'sports', icon: '🏆', url: 'https://biggestclubs.biblioverse.org', name: { pt: 'Os Maiores Clubes do Futebol Mundial', en: 'The Biggest Clubs in World Football', es: 'Los clubes más grandes del fútbol mundial', fr: 'Les plus grands clubs du football mondial', de: 'Die größten Klubs im Weltfußball', it: 'I club più grandi del calcio mondiale' } },
    // Relacionamentos (PT em /pt/; a raiz é a versão em inglês)
    { key: 'lovetheory', alias: ['thelovetheory'], group: 'relationships', icon: '💗', url: { pt: 'https://lovetheory.biblioverse.org/pt/', en: 'https://lovetheory.biblioverse.org' }, name: { pt: 'The Love Theory', en: 'The Love Theory' } }
  ];

  // ── Textos da interface ───────────────────────────────────────────────────
  // tagline: {b} é substituído pela marca "BiblioVerse" em negrito. moreIn: {g} é o nome do grupo.
  // ctaTitle / ctaText: botão do painel que sugere as bibliotecas.
  var BV_TEXT = {
    pt: { tagline: 'Um projeto {b}', others: 'Outros projetos', special: 'Projetos especiais', panel: 'Projetos especiais', moreSpecial: 'Outros projetos especiais', moreIn: 'Mais em {g}', ctaTitle: 'Conheça as bibliotecas', ctaText: 'Bibliotecas temáticas com os melhores sites, apps e ferramentas.', close: 'Fechar', home: 'Página inicial da BiblioVerse', here: 'você está aqui', all: 'Conhecer a BiblioVerse', soon: 'em breve', open: 'Abrir a lista de projetos especiais', by: 'Criado por' },
    en: { tagline: 'A {b} project', others: 'Other projects', special: 'Special projects', panel: 'Special projects', moreSpecial: 'Other special projects', moreIn: 'More in {g}', ctaTitle: 'Discover the libraries', ctaText: 'Themed libraries with the best sites, apps and tools.', close: 'Close', home: 'BiblioVerse home page', here: 'you are here', all: 'Visit BiblioVerse', soon: 'soon', open: 'Open the special project list', by: 'Created by' },
    es: { tagline: 'Un proyecto {b}', others: 'Otros proyectos', special: 'Proyectos especiales', panel: 'Proyectos especiales', moreSpecial: 'Otros proyectos especiales', moreIn: 'Más en {g}', ctaTitle: 'Conoce las bibliotecas', ctaText: 'Bibliotecas temáticas con los mejores sitios, apps y herramientas.', close: 'Cerrar', home: 'Página de inicio de BiblioVerse', here: 'estás aquí', all: 'Conocer BiblioVerse', soon: 'pronto', open: 'Abrir la lista de proyectos especiales', by: 'Creado por' },
    fr: { tagline: 'Un projet {b}', others: 'Autres projets', special: 'Projets spéciaux', panel: 'Projets spéciaux', moreSpecial: 'Autres projets spéciaux', moreIn: 'Plus dans {g}', ctaTitle: 'Découvrez les bibliothèques', ctaText: 'Des bibliothèques thématiques avec les meilleurs sites, applis et outils.', close: 'Fermer', home: "Page d'accueil de BiblioVerse", here: 'vous êtes ici', all: 'Découvrir BiblioVerse', soon: 'bientôt', open: 'Ouvrir la liste des projets spéciaux', by: 'Créé par' },
    de: { tagline: 'Ein {b}-Projekt', others: 'Weitere Projekte', special: 'Sonderprojekte', panel: 'Sonderprojekte', moreSpecial: 'Weitere Sonderprojekte', moreIn: 'Mehr in {g}', ctaTitle: 'Entdecke die Bibliotheken', ctaText: 'Themenbibliotheken mit den besten Websites, Apps und Tools.', close: 'Schließen', home: 'BiblioVerse-Startseite', here: 'Sie sind hier', all: 'BiblioVerse entdecken', soon: 'bald', open: 'Liste der Sonderprojekte öffnen', by: 'Erstellt von' },
    it: { tagline: 'Un progetto {b}', others: 'Altri progetti', special: 'Progetti speciali', panel: 'Progetti speciali', moreSpecial: 'Altri progetti speciali', moreIn: 'Altro in {g}', ctaTitle: 'Scopri le biblioteche', ctaText: 'Biblioteche tematiche con i migliori siti, app e strumenti.', close: 'Chiudi', home: 'Pagina iniziale di BiblioVerse', here: 'sei qui', all: 'Scopri BiblioVerse', soon: 'presto', open: "Apri l'elenco dei progetti speciali", by: 'Creato da' }
  };

  // ── Estilos ───────────────────────────────────────────────────────────────
  // Só as cores passam por variáveis (BG, FG, ACCENT). Fonte, tamanhos e layout são fixos.
  var FONT = '"TASA Explorer",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=TASA+Explorer:wght@400;600;700&display=swap';
  var CSS = [
    ':root:root{--bvbar-h:36px;--superbar-h:var(--bvbar-h);}',
    'html.bvbar-on body{padding-top:var(--bvbar-h)!important;}',
    'html.bvbar-on{scroll-padding-top:calc(var(--bvbar-h) + 12px);}',
    '.bvbar{position:fixed;top:0;left:0;right:0;height:var(--bvbar-h);z-index:9000;display:flex;align-items:center;gap:8px;',
    ' padding:0 max(10px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));margin:0;',
    ' background:' + BG + ';color:' + FG + ';font-family:' + FONT + ';font-size:13px;line-height:1;box-sizing:border-box;}',
    '.bvbar *,.bvbar-panel *{box-sizing:border-box;}',
    // mesma fonte em todos os sites, seja qual for a fonte de cada projeto
    '.bvbar,.bvbar *,.bvbar-panel,.bvbar-panel *{font-family:' + FONT + '!important;}',
    '.bvbar a,.bvbar button{color:' + FG + ';font:inherit;margin:0;}',
    '.bvbar button{-webkit-tap-highlight-color:transparent;}',
    '.bvbar-home{display:inline-flex;align-items:center;gap:0;text-decoration:none;white-space:nowrap;flex:none;min-height:30px;font-weight:400;}',
    '.bvbar-home .bvbar-brand{font-weight:700;}',
    '.bvbar-home .bvbar-tag{white-space:pre;}',
    // a pílula clareia ou escurece o fundo a partir da cor do texto, para funcionar em barras claras e escuras
    '.bvbar-pill{display:inline-flex;align-items:center;gap:6px;border:0;background:rgba(255,255,255,.16);background:color-mix(in srgb,currentColor 16%,transparent);height:26px;padding:0 10px;border-radius:999px;cursor:pointer;white-space:nowrap;transition:background .15s;}',
    '.bvbar-pill:hover{background:rgba(255,255,255,.28);background:color-mix(in srgb,currentColor 28%,transparent);}',
    '.bvbar-pill:focus-visible,.bvbar-home:focus-visible{outline:2px solid currentColor;outline-offset:2px;}',
    '.bvbar-spacer{flex:1;min-width:4px;}',
    '.bvbar-menu{flex:none;}',
    '.bvbar-burger{display:block;width:16px;height:12px;flex:none;}',
    '.bvbar-count{background:' + FG + ';color:' + ACCENT + ';border-radius:999px;padding:0 6px;font-size:11px;font-weight:700;line-height:16px;}',
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
    // rolagem do painel na cor de destaque
    '.bvbar-panel::-webkit-scrollbar{width:10px;}',
    '.bvbar-panel::-webkit-scrollbar-track{background:transparent;margin:14px 0;}',
    '.bvbar-panel::-webkit-scrollbar-thumb{background:' + ACCENT + ';border:2px solid var(--p-bg);background-clip:padding-box;border-radius:999px;}',
    '@supports not selector(::-webkit-scrollbar){.bvbar-panel{scrollbar-width:thin;scrollbar-color:' + ACCENT + ' transparent;}}',
    '.bvbar-top{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:-14px;margin:-14px -14px 0;padding:14px 14px 8px;background:var(--p-bg);z-index:1;}',
    // títulos do painel: cor própria, imunes aos estilos de h2/h3/h4 de cada site
    '.bvbar-panel h2,.bvbar-panel h3,.bvbar-panel h4{color:var(--p-text);background:none;-webkit-text-fill-color:currentColor;letter-spacing:normal;line-height:1.25;text-transform:none;}',
    '.bvbar-ptitle{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;margin:0;padding-left:2px;color:var(--p-text);}',
    '.bvbar-chip{background:var(--p-soft);border:1px solid var(--p-border);color:var(--p-muted);border-radius:999px;padding:1px 8px;font-size:11.5px;font-weight:700;line-height:1.4;}',
    '.bvbar-close{flex:none;height:42px;width:42px;border-radius:12px;border:1px solid var(--p-border);background:var(--p-soft);color:var(--p-text);cursor:pointer;font-size:16px;font-family:inherit;}',
    // módulos (grupo do site atual primeiro) e grupos dentro deles
    '.bvbar-mod{margin:0;padding:16px 0 2px;}',
    '.bvbar-mod:first-child{padding-top:6px;}',
    '.bvbar-panel .bvbar-mtitle{font-size:13.5px;font-weight:700;margin:0 0 8px 2px;color:var(--p-text);font-family:inherit;}',
    '.bvbar-group{margin:8px 0 2px;}',
    '.bvbar-body > .bvbar-group{margin-top:12px;}',
    '.bvbar-body > .bvbar-group:first-child{margin-top:4px;}',
    '.bvbar-panel .bvbar-gtitle{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--p-muted);margin:0 0 6px 2px;font-weight:700;font-family:inherit;}',
    '.bvbar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px;}',
    '.bvbar-item{display:flex;align-items:center;gap:10px;min-height:44px;padding:8px 10px;border-radius:12px;text-decoration:none;color:var(--p-text);border:1px solid transparent;background:var(--p-soft);font-size:13.5px;}',
    '.bvbar-item:hover,.bvbar-item:focus-visible{border-color:' + ACCENT + ';outline:none;}',
    '.bvbar-item .ico{font-size:18px;width:24px;text-align:center;flex:none;}',
    '.bvbar-item .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;}',
    '.bvbar-item .tag{font-size:10.5px;color:var(--p-muted);white-space:nowrap;flex:none;}',
    // Itens com etiqueta ("você está aqui", "em breve") levam a etiqueta para a segunda linha
    '.bvbar-item:has(.tag){flex-wrap:wrap;row-gap:0;}',
    '.bvbar-item:has(.tag) .tag{flex-basis:100%;padding-left:34px;line-height:1.3;}',
    '.bvbar-item.is-current{border-color:' + ACCENT + ';background:rgba(122,92,255,.16);background:color-mix(in srgb,' + ACCENT + ' 16%,transparent);}',
    '.bvbar-item.is-soon{opacity:.55;}',
    // botão que sugere as bibliotecas: mesmas cores da barra
    '.bvbar-cta{display:flex;align-items:center;gap:12px;margin-top:16px;padding:12px 14px;border-radius:12px;text-decoration:none;background:' + BG + ';color:' + FG + ';border:1px solid transparent;}',
    '.bvbar-cta:hover,.bvbar-cta:focus-visible{border-color:' + FG + ';outline:none;}',
    '.bvbar-cta .cx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}',
    '.bvbar-cta .ct{font-size:13.5px;font-weight:700;color:' + FG + ';}',
    '.bvbar-cta .cd{font-size:12px;font-weight:400;color:' + FG + ';}',
    '.bvbar-cta .ca{flex:none;font-size:16px;font-weight:700;color:' + FG + ';}',
    '.bvbar-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;padding-top:10px;border-top:1px solid var(--p-border);font-size:12.5px;}',
    '.bvbar-foot a{color:var(--p-text);text-decoration:none;font-weight:700;padding:6px 2px;}',
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
    var projects = BV_PROJECTS.slice();
    var currentKey = nav.getAttribute('data-current') || '';
    var current = null;
    function isCur(l) { return l.key === currentKey || (l.alias || []).indexOf(currentKey) >= 0; }
    projects.forEach(function (l) { if (isCur(l)) current = l; });
    var currentGroup = null;
    if (current) BV_GROUPS.forEach(function (g) { if (g.key === current.group) currentGroup = g; });
    var total = projects.filter(function (l) { return !l.soon; }).length;
    var others = total - (current && !current.soon ? 1 : 0);

    // A barra carrega a própria fonte: nem todo projeto usa a TASA Explorer
    var fontLink = el('link'); fontLink.id = 'bvbar-font'; fontLink.rel = 'stylesheet'; fontLink.href = FONT_URL; document.head.appendChild(fontLink);
    var st = el('style'); st.id = 'bvbar-style'; st.textContent = CSS; document.head.appendChild(st);
    if (nav.getAttribute('data-offset') !== 'none') document.documentElement.classList.add('bvbar-on');

    // Barra
    nav.removeAttribute('style');
    nav.innerHTML = '';
    nav.classList.add('bvbar');
    nav.setAttribute('data-bar', 'specials');
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
    // botão que sugere as bibliotecas
    var cta = el('a', 'bvbar-cta'); cta.href = LIBRARIES_URL;
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

    // Cor do projeto: data-bg / data-fg / data-accent na tag da barra têm prioridade sobre o CSS do site.
    // Só cores: os valores viram variáveis de cor e nada mais.
    [['data-bg', '--bvbar-bg'], ['data-fg', '--bvbar-fg'], ['data-accent', '--bvbar-accent']].forEach(function (p) {
      var v = (nav.getAttribute(p[0]) || '').trim();
      if (!v) return;
      nav.style.setProperty(p[1], v); panel.style.setProperty(p[1], v);
    });

    var items = [], lastLang = null;
    function render() {
      var L = resolveLang(nav), t = BV_TEXT[L] || BV_TEXT[FALLBACK_LANG];
      lastLang = L;
      nav.setAttribute('aria-label', 'BiblioVerse');
      home.title = t.home; home.setAttribute('aria-label', t.home);
      var tag = (t.tagline || '{b}').split('{b}');
      tagPre.textContent = tag[0] || ''; tagPos.textContent = tag[1] || '';
      btnLbl.textContent = current ? t.others : t.special; btn.title = t.open; btn.setAttribute('aria-label', t.open + ' (' + others + ')');
      close.title = t.close; close.setAttribute('aria-label', t.close);
      creditBy.nodeValue = t.by + ' '; allLink.textContent = t.all + ' →';
      ptitleTxt.textContent = t.panel;
      ctaTitle.textContent = t.ctaTitle; ctaText.textContent = t.ctaText;
      panel.setAttribute('aria-label', t.panel);
      body.innerHTML = ''; items = [];

      function grid(list) {
        var g = el('div', 'bvbar-grid');
        list.slice().sort(function (a, b) { return pick(a.name, L).localeCompare(pick(b.name, L), L, { sensitivity: 'base' }); })
          .forEach(function (l) {
            var a = el('a', 'bvbar-item'); a.href = typeof l.url === 'string' ? l.url : pick(l.url, L);
            a.appendChild(el('span', 'ico', l.icon)); a.appendChild(el('span', 'nm', pick(l.name, L)));
            if (isCur(l)) { a.classList.add('is-current'); a.setAttribute('aria-current', 'page'); a.appendChild(el('span', 'tag', t.here)); }
            else if (l.soon) { a.classList.add('is-soon'); a.appendChild(el('span', 'tag', t.soon)); }
            g.appendChild(a); items.push(a);
          });
        return g;
      }
      function inGroup(g) { return projects.filter(function (l) { return l.group === g.key; }); }
      function groupsInto(parent, groupsList, tag) {
        groupsList.forEach(function (g) {
          var list = inGroup(g); if (!list.length) return;
          var wrap = el('div', 'bvbar-group'); wrap.appendChild(el(tag, 'bvbar-gtitle', pick(g.name, L)));
          wrap.appendChild(grid(list)); parent.appendChild(wrap);
        });
      }
      if (current && currentGroup) {
        // primeiro os projetos do mesmo grupo, depois os outros grupos
        var first = el('section', 'bvbar-mod'); first.appendChild(el('h3', 'bvbar-mtitle', t.moreIn.replace('{g}', pick(currentGroup.name, L))));
        first.appendChild(grid(inGroup(currentGroup))); body.appendChild(first);
        var rest = el('section', 'bvbar-mod'); rest.appendChild(el('h3', 'bvbar-mtitle', t.moreSpecial));
        groupsInto(rest, BV_GROUPS.filter(function (g) { return g !== currentGroup; }), 'h4');
        if (rest.childNodes.length > 1) body.appendChild(rest);
      } else {
        // chave desconhecida: todos os grupos
        groupsInto(body, BV_GROUPS, 'h3');
      }
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

  // libs é o mesmo que projects: mantido para quem lia a lista da barra antiga
  var api = { kind: 'specials', version: 1, projects: BV_PROJECTS, libs: BV_PROJECTS, groups: BV_GROUPS, text: BV_TEXT,
    setLang: function (code) { forcedLang = code || null; }, open: function () {}, close: function () {}, refresh: function () {} };
  window.BiblioVerseBar = api;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
