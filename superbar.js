/*!
 * BiblioVerse Superbar v11 · https://biblioverse.org/superbar.js
 * Barra universal de todos os projetos do BiblioVerse e do site principal.
 *
 * ── O QUE A BARRA MOSTRA ─────────────────────────────────────────────────────
 *   Esquerda: "Um projeto BiblioVerse" (só "BiblioVerse" em telas estreitas), link para o hub, sem ícone.
 *   Direita: "Outros projetos" com o total de projetos (bibliotecas + especiais) menos o site atual.
 *   O painel muda conforme o site: numa biblioteca, primeiro as outras bibliotecas; num projeto
 *   especial, primeiro os projetos do mesmo grupo; no site principal, a lista completa.
 *
 * ── COMO ACRESCENTAR UM PROJETO NOVO ─────────────────────────────────────────
 * 1. Copie uma linha de BV_LIBS (mais abaixo) e troque key, group, icon, url e name.
 *    Em "name" só pt e en são obrigatórios; os outros idiomas caem no inglês.
 *    Bibliotecas usam os grupos temáticos de BV_GROUPS; projetos especiais usam um grupo
 *    marcado com projects: true (think, ai, travel, sports, data).
 * 2. Publique este arquivo no repositório do biblioverse.org. Pronto: a barra de
 *    TODOS os sites se atualiza sozinha, sem mexer em nenhum outro site.
 *
 * ── COMO INSTALAR EM UM SITE (uma vez só) ────────────────────────────────────
 *   Logo após <body>:
 *   <nav id="bvbar" class="bvbar" data-current="CHAVE" aria-label="BiblioVerse"
 *        style="position:fixed;top:0;left:0;right:0;height:36px;z-index:9000;background:linear-gradient(90deg,#4f7cff,#7a5cff)">
 *     <a href="https://biblioverse.org" style="color:#fff;line-height:36px;padding:0 14px;font-weight:700;text-decoration:none">BiblioVerse</a>
 *   </nav>
 *   No <head>:
 *   <script src="https://biblioverse.org/superbar.js" defer></script>
 *
 *   data-current = chave do projeto (ex.: "web3"). No site principal use data-current="".
 *   Opcionais: data-lang="es" (força um idioma), data-offset="none"
 *   (não empurra o conteúdo para baixo; use se o site já reservar o espaço da barra).
 *   Sites com cabeçalho fixo devem posicioná-lo em top: var(--bvbar-h).
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
  var FALLBACK_LANG = 'en';

  // ── Grupos ────────────────────────────────────────────────────────────────
  // Grupos temáticos das bibliotecas e, com projects: true, os grupos de projetos especiais.
  var BV_GROUPS = [
    { key: 'tech',      name: { pt: 'Tecnologia',      en: 'Technology',        es: 'Tecnología',       fr: 'Technologie',        de: 'Technologie',      it: 'Tecnologia' } },
    { key: 'creative',  name: { pt: 'Criatividade',    en: 'Creativity',        es: 'Creatividad',      fr: 'Créativité',         de: 'Kreativität',      it: 'Creatività' } },
    { key: 'culture',   name: { pt: 'Cultura e lazer', en: 'Culture & Leisure', es: 'Cultura y ocio',   fr: 'Culture et loisirs', de: 'Kultur & Freizeit', it: 'Cultura e tempo libero' } },
    { key: 'knowledge', name: { pt: 'Conhecimento',    en: 'Knowledge',         es: 'Conocimiento',     fr: 'Connaissance',       de: 'Wissen',           it: 'Conoscenza' } },
    { key: 'freethought', name: { pt: 'Pensamento Livre', en: 'Freethought', es: 'Librepensamiento', fr: 'Libre pensée', de: 'Freidenkertum', it: 'Libero pensiero' } },
    { key: 'life',      name: { pt: 'Vida prática',    en: 'Everyday Life',     es: 'Vida práctica',    fr: 'Vie pratique',       de: 'Alltag',           it: 'Vita pratica' } },
    // Projetos especiais (projects: true): fora da lista de bibliotecas, agrupados por natureza
    { key: 'think',  projects: true, name: { pt: 'Para pensar melhor', en: 'Think Better', es: 'Para pensar mejor', fr: 'Pour mieux penser', de: 'Besser denken', it: 'Per pensare meglio' } },
    { key: 'ai',     projects: true, name: { pt: 'Inteligência Artificial', en: 'Artificial Intelligence', es: 'Inteligencia artificial', fr: 'Intelligence artificielle', de: 'Künstliche Intelligenz', it: 'Intelligenza artificiale' } },
    { key: 'travel', projects: true, name: { pt: 'Cultura e Viagem', en: 'Culture & Travel', es: 'Cultura y viajes', fr: 'Culture et voyage', de: 'Kultur & Reisen', it: 'Cultura e viaggi' } },
    { key: 'sports', projects: true, name: { pt: 'Esportes', en: 'Sports', es: 'Deportes', fr: 'Sports', de: 'Sport', it: 'Sport' } },
    { key: 'data',   projects: true, name: { pt: 'Dados', en: 'Data', es: 'Datos', fr: 'Données', de: 'Daten', it: 'Dati' } }
  ];

  // ── Projetos ──────────────────────────────────────────────────────────────
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
    { key: 'conspiracy', group: 'freethought',   icon: '🕵️', url: 'https://biblioverse.org/conspiracy/', name: { pt: 'Conspirações', en: 'Conspiracies', es: 'Conspiraciones', fr: 'Conspirations', de: 'Verschwörungen', it: 'Cospirazioni' } },
    { key: 'truecrime', group: 'culture',   icon: '🔍', url: 'https://biblioverse.org/truecrime/', name: { pt: 'True Crime', en: 'True Crime', es: 'True crime', fr: 'True crime', de: 'True Crime', it: 'True crime' } },
    { key: 'esports', group: 'culture',   icon: '🕹️', url: 'https://biblioverse.org/esports/', name: { pt: 'eSports', en: 'eSports', es: 'eSports', fr: 'eSport', de: 'E-Sport', it: 'eSports' } },
    // Projetos especiais · Para pensar melhor
    { key: 'politicaparainiciantes', group: 'think', icon: '🏛️', url: 'https://politicaparainiciantes.biblioverse.org', name: { pt: 'Política Para Iniciantes', en: 'Politics for Beginners', es: 'Política para principiantes', fr: 'La politique pour débutants', de: 'Politik für Einsteiger', it: 'Politica per principianti' } },
    { key: 'eticaparainiciantes', group: 'think', icon: '⚖️', url: 'https://eticaparainiciantes.biblioverse.org', name: { pt: 'Ética Para Iniciantes', en: 'Ethics for Beginners', es: 'Ética para principiantes', fr: 'L’éthique pour débutants', de: 'Ethik für Einsteiger', it: 'Etica per principianti' } },
    { key: 'cienciaparainiciantes', group: 'think', icon: '🔬', url: 'https://cienciaparainiciantes.biblioverse.org', name: { pt: 'Ciência Para Iniciantes', en: 'Science for Beginners', es: 'Ciencia para principiantes', fr: 'La science pour débutants', de: 'Wissenschaft für Einsteiger', it: 'Scienza per principianti' } },
    { key: 'questaodeetica', group: 'think', icon: '👁️', url: 'https://questaodeetica.biblioverse.org', name: { pt: 'Questão de Ética', en: 'Questão de Ética', es: 'Questão de Ética', fr: 'Questão de Ética', de: 'Questão de Ética', it: 'Questão de Ética' } },
    { key: 'pelosanimais', group: 'think', icon: '🐾', url: 'https://pelosanimais.biblioverse.org', name: { pt: 'Guia de Argumentação Pelos Animais', en: 'Arguing for Animals Guide', es: 'Guía de argumentación por los animales', fr: 'Guide d’argumentation pour les animaux', de: 'Argumentationsleitfaden für die Tiere', it: 'Guida all’argomentazione per gli animali' } },
    // Projetos especiais · Inteligência Artificial
    { key: 'aihistory', group: 'ai', icon: '⏳', url: 'https://aihistory.biblioverse.org', name: { pt: 'Linha do Tempo da História da IA', en: 'AI History Timeline', es: 'Cronología de la historia de la IA', fr: 'Chronologie de l’histoire de l’IA', de: 'Zeitleiste der KI-Geschichte', it: 'Cronologia della storia dell’IA' } },
    { key: 'curatedai', group: 'ai', icon: '🏛️', url: 'https://curatedai.biblioverse.org', name: { pt: 'Curated AI', en: 'Curated AI', es: 'Curated AI', fr: 'Curated AI', de: 'Curated AI', it: 'Curated AI' } },
    // Projetos especiais · Cultura e Viagem
    { key: 'brazilianculture', group: 'travel', icon: '🦜', url: 'https://brazilianculture.biblioverse.org', name: { pt: 'Cultura Brasileira', en: 'Brazilian Culture', es: 'Cultura brasileña', fr: 'Culture brésilienne', de: 'Brasilianische Kultur', it: 'Cultura brasiliana' } },
    { key: 'australianculture', group: 'travel', icon: '🪃', url: 'https://australianculture.biblioverse.org', name: { pt: 'Cultura Australiana', en: 'Australian Culture', es: 'Cultura australiana', fr: 'Culture australienne', de: 'Australische Kultur', it: 'Cultura australiana' } },
    { key: 'brasileirosnaaustralia', group: 'travel', icon: '🦘', url: 'https://brasileirosnaaustralia.biblioverse.org', name: { pt: 'Brasileiros na Austrália', en: 'Brazilians in Australia', es: 'Brasileños en Australia', fr: 'Brésiliens en Australie', de: 'Brasilianer in Australien', it: 'Brasiliani in Australia' } },
    { key: 'brisbaneveganguide', group: 'travel', icon: '🌱', url: 'https://brisbaneveganguide.com', name: { pt: 'Brisbane Vegan Guide', en: 'Brisbane Vegan Guide' } },
    { key: 'brissyopshops', group: 'travel', icon: '🛍️', url: 'https://brissyopshops.com', name: { pt: 'Brissy Op Shops', en: 'Brissy Op Shops' } },
    // Projetos especiais · Esportes
    { key: 'goats',        group: 'sports', icon: '🐐', url: 'https://goat.biblioverse.org',                     name: { pt: 'GOATs', en: 'GOATs' } },
    { key: 'lfb',          group: 'sports', icon: '⚽', url: 'https://lendasdofutebolbrasileiro.biblioverse.org', name: { pt: 'Lendas do Futebol Brasileiro', en: 'Brazilian Football Legends', es: 'Leyendas del fútbol brasileño', fr: 'Légendes du football brésilien', de: 'Brasilianische Fußballlegenden', it: 'Leggende del calcio brasiliano' } },
    { key: 'biggestclubs', group: 'sports', icon: '🏆', url: 'https://biggestclubs.biblioverse.org',              name: { pt: 'Os Maiores Clubes do Futebol Mundial', en: 'The Biggest Clubs in World Football', es: 'Los clubes más grandes del fútbol mundial', fr: 'Les plus grands clubs du football mondial', de: 'Die größten Klubs im Weltfußball', it: 'I club più grandi del calcio mondiale' } },
    // Projetos especiais · Dados
    { key: 'ethicalfood',  group: 'data', icon: '🥗', url: 'https://ethicalfood.biblioverse.org',                name: { pt: 'Guia de Alimentos Éticos', en: 'Ethical Food Guide', es: 'Guía de Alimentos Éticos', fr: 'Guide des aliments éthiques', de: 'Leitfaden für ethische Lebensmittel', it: 'Guida agli alimenti etici' } },
    { key: 'typesofrock', group: 'data', icon: '🎸', url: 'https://typesofrock.biblioverse.org', name: { pt: 'Tipos de Rock', en: 'Types of Rock', es: 'Tipos de rock', fr: 'Types de rock', de: 'Arten von Rock', it: 'Tipi di rock' } }
  ];

  // ── Textos da interface ───────────────────────────────────────────────────
  // tagline: {b} é substituído pela marca "BiblioVerse" em negrito. moreIn: {g} é o nome do grupo.
  var BV_TEXT = {
    pt: { tagline: 'Um projeto {b}', others: 'Outros projetos', panel: 'Projetos BiblioVerse', libs: 'Bibliotecas', moreLibs: 'Mais bibliotecas', special: 'Projetos especiais', moreSpecial: 'Outros projetos especiais', moreIn: 'Mais em {g}', close: 'Fechar', home: 'Página inicial do BiblioVerse', here: 'você está aqui', all: 'Conhecer o BiblioVerse', soon: 'em breve', open: 'Abrir a lista de projetos', by: 'Criado por' },
    en: { tagline: 'A {b} project', others: 'Other projects', panel: 'BiblioVerse projects', libs: 'Libraries', moreLibs: 'More libraries', special: 'Special projects', moreSpecial: 'Other special projects', moreIn: 'More in {g}', close: 'Close', home: 'BiblioVerse home page', here: 'you are here', all: 'Visit BiblioVerse', soon: 'soon', open: 'Open the project list', by: 'Created by' },
    es: { tagline: 'Un proyecto {b}', others: 'Otros proyectos', panel: 'Proyectos BiblioVerse', libs: 'Bibliotecas', moreLibs: 'Más bibliotecas', special: 'Proyectos especiales', moreSpecial: 'Otros proyectos especiales', moreIn: 'Más en {g}', close: 'Cerrar', home: 'Página de inicio de BiblioVerse', here: 'estás aquí', all: 'Conocer BiblioVerse', soon: 'pronto', open: 'Abrir la lista de proyectos', by: 'Creado por' },
    fr: { tagline: 'Un projet {b}', others: 'Autres projets', panel: 'Projets BiblioVerse', libs: 'Bibliothèques', moreLibs: 'Plus de bibliothèques', special: 'Projets spéciaux', moreSpecial: 'Autres projets spéciaux', moreIn: 'Plus dans {g}', close: 'Fermer', home: "Page d'accueil de BiblioVerse", here: 'vous êtes ici', all: 'Découvrir BiblioVerse', soon: 'bientôt', open: 'Ouvrir la liste des projets', by: 'Créé par' },
    de: { tagline: 'Ein {b}-Projekt', others: 'Weitere Projekte', panel: 'BiblioVerse-Projekte', libs: 'Bibliotheken', moreLibs: 'Weitere Bibliotheken', special: 'Sonderprojekte', moreSpecial: 'Weitere Sonderprojekte', moreIn: 'Mehr in {g}', close: 'Schließen', home: 'BiblioVerse-Startseite', here: 'Sie sind hier', all: 'BiblioVerse entdecken', soon: 'bald', open: 'Projektliste öffnen', by: 'Erstellt von' },
    it: { tagline: 'Un progetto {b}', others: 'Altri progetti', panel: 'Progetti BiblioVerse', libs: 'Biblioteche', moreLibs: 'Altre biblioteche', special: 'Progetti speciali', moreSpecial: 'Altri progetti speciali', moreIn: 'Altro in {g}', close: 'Chiudi', home: 'Pagina iniziale di BiblioVerse', here: 'sei qui', all: 'Scopri BiblioVerse', soon: 'presto', open: "Apri l'elenco dei progetti", by: 'Creato da' }
  };

  // ── Estilos ───────────────────────────────────────────────────────────────
  var FONT = '"TASA Explorer",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
  var FONT_URL = 'https://fonts.googleapis.com/css2?family=TASA+Explorer:wght@400;600;700&display=swap';
  var CSS = [
    ':root:root{--bvbar-h:36px;--superbar-h:var(--bvbar-h);}',
    'html.bvbar-on body{padding-top:var(--bvbar-h)!important;}',
    'html.bvbar-on{scroll-padding-top:calc(var(--bvbar-h) + 12px);}',
    '.bvbar{position:fixed;top:0;left:0;right:0;height:var(--bvbar-h);z-index:9000;display:flex;align-items:center;gap:8px;',
    ' padding:0 max(10px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));margin:0;',
    ' background:linear-gradient(90deg,var(--accent1,#4f7cff),var(--accent2,#7a5cff));color:#fff;font-family:' + FONT + ';font-size:13px;line-height:1;box-sizing:border-box;}',
    '.bvbar *,.bvbar-panel *{box-sizing:border-box;}',
    // mesma fonte em todos os sites, seja qual for a fonte de cada projeto
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
    '.bvbar-count{background:rgba(255,255,255,.92);color:var(--accent2,#7a5cff);border-radius:999px;padding:0 6px;font-size:11px;font-weight:700;line-height:16px;}',
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
    '.bvbar-panel::-webkit-scrollbar-thumb{background:linear-gradient(180deg,var(--accent1,#4f7cff),var(--accent2,#7a5cff),var(--accent3,#b445ff));border:2px solid var(--p-bg);background-clip:padding-box;border-radius:999px;}',
    '@supports not selector(::-webkit-scrollbar){.bvbar-panel{scrollbar-width:thin;scrollbar-color:var(--accent2,#7a5cff) transparent;}}',
    '.bvbar-top{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:-14px;margin:-14px -14px 0;padding:14px 14px 8px;background:var(--p-bg);z-index:1;}',
    // títulos do painel: cor própria, imunes aos estilos de h2/h3/h4 de cada site
    '.bvbar-panel h2,.bvbar-panel h3,.bvbar-panel h4{color:var(--p-text);background:none;-webkit-text-fill-color:currentColor;letter-spacing:normal;line-height:1.25;text-transform:none;}',
    '.bvbar-ptitle{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;margin:0;padding-left:2px;color:var(--p-text);}',
    '.bvbar-chip{background:var(--p-soft);border:1px solid var(--p-border);color:var(--p-muted);border-radius:999px;padding:1px 8px;font-size:11.5px;font-weight:700;line-height:1.4;}',
    '.bvbar-close{flex:none;height:42px;width:42px;border-radius:12px;border:1px solid var(--p-border);background:var(--p-soft);color:var(--p-text);cursor:pointer;font-size:16px;font-family:inherit;}',
    // módulos (ordem muda conforme o site) e grupos dentro deles
    '.bvbar-mod{margin:0;padding:12px 0 2px;border-top:1px solid var(--p-border);}',
    '.bvbar-mod:first-child{border-top:0;padding-top:6px;}',
    '.bvbar-mtitle{font-size:13.5px;font-weight:700;margin:0 0 8px 2px;color:var(--p-text);font-family:inherit;}',
    '.bvbar-group{margin:8px 0 2px;}',
    '.bvbar-panel h4.bvbar-gtitle{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--p-muted);margin:0 0 6px 2px;font-weight:700;font-family:inherit;}',
    '.bvbar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px;}',
    '.bvbar-item{display:flex;align-items:center;gap:10px;min-height:44px;padding:8px 10px;border-radius:12px;text-decoration:none;color:var(--p-text);border:1px solid transparent;background:var(--p-soft);font-size:13.5px;}',
    '.bvbar-item:hover,.bvbar-item:focus-visible{border-color:var(--accent1,#4f7cff);outline:none;}',
    '.bvbar-item .ico{font-size:18px;width:24px;text-align:center;flex:none;}',
    '.bvbar-item .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;}',
    '.bvbar-item .tag{font-size:10.5px;color:var(--p-muted);white-space:nowrap;flex:none;}',
    // Items with a tag ("you are here", "soon") put it on a second line, so long names are not cut
    '.bvbar-item:has(.tag){flex-wrap:wrap;row-gap:0;}',
    '.bvbar-item:has(.tag) .tag{flex-basis:100%;padding-left:34px;line-height:1.3;}',
    '.bvbar-item.is-current{border-color:var(--accent2,#7a5cff);background:rgba(122,92,255,.16);}',
    '.bvbar-item.is-soon{opacity:.55;}',
    '.bvbar-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;padding-top:10px;border-top:1px solid var(--p-border);font-size:12.5px;}',
    '.bvbar-foot a{color:var(--accent1,#4f7cff);text-decoration:none;font-weight:700;padding:6px 2px;}',
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
    var isProj = function (g) { return !!g.projects; };
    var libGroups = BV_GROUPS.filter(function (g) { return !isProj(g); });
    var projGroups = BV_GROUPS.filter(isProj);
    var currentKey = nav.getAttribute('data-current') || '';
    var current = null;
    libs.forEach(function (l) { if (l.key === currentKey) current = l; });
    var currentGroup = null;
    if (current) BV_GROUPS.forEach(function (g) { if (g.key === current.group) currentGroup = g; });
    var total = libs.filter(function (l) { return !l.soon; }).length;
    var others = total - (current && !current.soon ? 1 : 0);

    // A barra carrega a própria fonte: nem todo projeto usa a TASA Explorer
    var fontLink = el('link'); fontLink.id = 'bvbar-font'; fontLink.rel = 'stylesheet'; fontLink.href = FONT_URL; document.head.appendChild(fontLink);
    var st = el('style'); st.id = 'bvbar-style'; st.textContent = CSS; document.head.appendChild(st);
    if (nav.getAttribute('data-offset') !== 'none') document.documentElement.classList.add('bvbar-on');

    // Barra
    nav.removeAttribute('style');
    nav.innerHTML = '';
    nav.classList.add('bvbar');
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
      btnLbl.textContent = t.others; btn.title = t.open; btn.setAttribute('aria-label', t.open + ' (' + others + ')');
      close.title = t.close; close.setAttribute('aria-label', t.close);
      creditBy.nodeValue = t.by + ' '; allLink.textContent = t.all + ' →';
      ptitleTxt.textContent = t.panel;
      panel.setAttribute('aria-label', t.panel);
      body.innerHTML = ''; items = [];

      function grid(list) {
        var g = el('div', 'bvbar-grid');
        list.slice().sort(function (a, b) { return pick(a.name, L).localeCompare(pick(b.name, L), L, { sensitivity: 'base' }); })
          .forEach(function (l) {
            var a = el('a', 'bvbar-item'); a.href = l.url;
            a.appendChild(el('span', 'ico', l.icon)); a.appendChild(el('span', 'nm', pick(l.name, L)));
            if (l.key === currentKey) { a.classList.add('is-current'); a.setAttribute('aria-current', 'page'); a.appendChild(el('span', 'tag', t.here)); }
            else if (l.soon) { a.classList.add('is-soon'); a.appendChild(el('span', 'tag', t.soon)); }
            g.appendChild(a); items.push(a);
          });
        return g;
      }
      function inGroup(g) { return libs.filter(function (l) { return l.group === g.key; }); }
      // módulo = título + (grade direta | grupos com subtítulo)
      function module(title, groupsList, flatGroup) {
        var sec = el('section', 'bvbar-mod'); sec.appendChild(el('h3', 'bvbar-mtitle', title));
        if (flatGroup) { sec.appendChild(grid(inGroup(flatGroup))); }
        else {
          groupsList.forEach(function (g) {
            var list = inGroup(g); if (!list.length) return;
            var wrap = el('div', 'bvbar-group'); wrap.appendChild(el('h4', 'bvbar-gtitle', pick(g.name, L)));
            wrap.appendChild(grid(list)); sec.appendChild(wrap);
          });
        }
        if (sec.childNodes.length > 1) body.appendChild(sec);
      }
      if (current && currentGroup && isProj(currentGroup)) {
        // projeto especial: primeiro os irmãos de grupo, depois os outros grupos especiais, depois as bibliotecas
        module(t.moreIn.replace('{g}', pick(currentGroup.name, L)), null, currentGroup);
        module(t.moreSpecial, projGroups.filter(function (g) { return g !== currentGroup; }));
        module(t.libs, libGroups);
      } else if (current) {
        // biblioteca: primeiro as outras bibliotecas, depois os projetos especiais
        module(t.moreLibs, libGroups);
        module(t.special, projGroups);
      } else {
        // site principal (ou chave desconhecida): lista completa
        module(t.libs, libGroups);
        module(t.special, projGroups);
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
        var f = [close].concat(items, [creditLink, allLink]);
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        return;
      }
      var a = document.activeElement; if (!a || !a.classList || !a.classList.contains('bvbar-item')) return;
      var k = items.indexOf(a);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); (items[k + 1] || items[0]).focus(); }
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

  var api = { version: 11, libs: BV_LIBS, groups: BV_GROUPS, text: BV_TEXT,
    setLang: function (code) { forcedLang = code || null; }, open: function () {}, close: function () {}, refresh: function () {} };
  window.BiblioVerseBar = api;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
