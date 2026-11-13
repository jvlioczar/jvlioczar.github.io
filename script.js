(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle  = document.getElementById('langToggle');
  const libFilter   = document.getElementById('libFilter');
  const curators    = document.getElementById('curators');
  const libGrids    = document.querySelectorAll('.lib-grid');

  // ===== Dictionaries =====
  const I18N = {
    pt: {
      'meta.description': 'BiblioVerse — A Biblioteca de Tudo. Portal central para acessar as bibliotecas temáticas e conhecer o projeto e seus curadores.',
      'brand.name': 'BiblioVerse',
      'footer.lead': '<strong class="proj-name">BiblioVerse</strong> é um projeto colaborativo para organizar e facilitar o acesso a bibliotecas úteis em diferentes temas.',
      'brand.beta': 'BETA',
      'hero.tagline': 'A biblioteca de tudo',
      'hero.lead': 'Bibliotecas temáticas e projetos especiais com curadoria humana: os melhores sites, apps e referências de cada área, em páginas mínimas e rápidas. Gratuito e sem anúncios.',
      'hero.libs': 'bibliotecas',
      'hero.special': 'projetos especiais',
      'hero.people': 'Escolhido por pessoas, não por algoritmo',
      'doors.label': 'Escolha o que você quer explorar',
      'doors.hint': 'toque em um dos blocos para filtrar',
      'filter.all': 'Tudo',
      'filter.special.short': 'Projetos',
      'doors.libs.desc': 'Diretórios curados com os melhores sites, apps e referências de cada tema.',
      'doors.libs.cta': 'Ver só as bibliotecas',
      'doors.special.desc': 'Sites autorais, cada um mergulhando fundo em um só tema, sempre com fontes.',
      'doors.special.cta': 'Ver só os projetos',
      'doors.all': 'Mostrar tudo',
      'mod.libs': 'Bibliotecas',
      'mod.libs.sub': 'Diretórios curados dos melhores sites, apps e referências de cada tema.',
      'mod.special': 'Projetos especiais',
      'mod.special.sub': 'Sites autorais, cada um dedicado a um só tema, sempre com fontes.',
      'desc.ai': 'As principais ferramentas de inteligência artificial, organizadas por uso.',
      'desc.coding': 'Linguagens, cursos e ferramentas para aprender a programar.',
      'desc.web3': 'Blockchain, carteiras e o ecossistema descentralizado.',
      'desc.social': 'Plataformas, ferramentas e recursos para criadores de conteúdo.',
      'desc.design': 'Sites e ferramentas úteis para designers.',
      'desc.photography': 'Recursos, apps e referências para fotografar melhor.',
      'desc.print': 'Revistas, jornais, gráficas e o universo do impresso.',
      'desc.art': 'Conceitos, técnicas, movimentos, artistas e museus.',
      'desc.games': 'Plataformas, jogos e o universo dos games.',
      'desc.list': 'As melhores listas e rankings da internet em um só lugar.',
      'desc.music': 'Apps, gêneros, gravadoras e conceitos fundamentais da música.',
      'desc.truecrime': 'Crimes reais, acidentes e desastres, e como preveni-los e denunciá-los.',
      'desc.esports': 'Jogos competitivos, campeonatos, equipes, lendas e transmissões.',
      'desc.language': 'Apps, canais e métodos para aprender idiomas.',
      'desc.data': 'Fontes de dados, visualização e análise.',
      'desc.history': 'Períodos, civilizações, fontes e referências para estudar história.',
      'desc.philosophy': 'Correntes, autores e referências da filosofia.',
      'desc.thinking': 'Livros e recursos sobre pensamento crítico e vieses cognitivos.',
      'desc.conspiracy': 'Teorias da conspiração, pseudociências e crenças falsas, e como desmenti-las.',
      'desc.job': 'Sites de vagas, currículo e carreira.',
      'desc.organization': 'Apps e métodos de produtividade e gestão.',
      'desc.travel': 'Ferramentas para planejar viagens e intercâmbio.',
      'desc.antiscam': 'Como identificar, verificar, denunciar e se proteger de golpes e fraudes.',
      'desc.cienciaparainiciantes': 'Guia de ciência em três níveis: método científico, evidência e como separar ciência de pseudociência.',
      'desc.eticaparainiciantes': 'Guia de ética em três níveis: teorias, círculo moral, grandes dilemas e filósofos, sempre com fontes.',
      'href.pelosanimais': 'https://pelosanimais.biblioverse.org',
      'desc.pelosanimais': 'Catálogo de 213 argumentos usados para justificar a exploração animal, cada um com resposta fundamentada.',
      'desc.politicaparainiciantes': 'Guia de política em três níveis, com ferramentas interativas e dossiês dos partidos brasileiros.',
      'desc.questaodeetica': 'Site-livro dos 12 volumes de Uma Jornada pela Ética Animal, de Luciano Carlos Cunha, com lições e testes.',
      'desc.curatedai': 'Catálogo dos melhores projetos feitos com inteligência artificial e curados por humanos.',
      'desc.aihistory': 'Museu gratuito da IA, de Ada Lovelace em 1843 até hoje, com cada marco apoiado em duas reportagens.',
      'desc.brasileirosnaaustralia': 'Criadores de conteúdo por cidade, comparador das capitais, agências, apps e guia de chegada.',
      'desc.brisbaneveganguide': 'Os melhores restaurantes, cafés, grupos e pessoas veganos de Brisbane, em um guia bilíngue.',
      'desc.brissyopshops': 'Guia das lojas de segunda mão de Brisbane: avaliações, horários, mapa e dicas.',
      'desc.australianculture': 'Geografia, 65 mil anos de história, quem é o povo e o jeito australiano de viver.',
      'desc.brazilianculture': 'Geografia, 13 mil anos de história, quem é o povo e o jeito brasileiro de viver.',
      'desc.goats': 'Os maiores atletas de todos os tempos em mais de 300 modalidades, com fontes.',
      'desc.lfb': 'As seleções de todos os tempos da Seleção Brasileira e de 74 clubes do Brasil.',
      'desc.biggestclubs': 'Ranking de 383 clubes de 16 países pelos títulos mundiais, continentais e nacionais.',
      'desc.ethicalfood': 'Diretório e mapa de quase 2.300 empresas de proteína alternativa em 71 países.',
      'desc.typesofrock': '97 gêneros de rock em uma árvore interativa, com história, som, genealogia e artistas.',
      'desc.brazilianmusic': 'O catálogo bilíngue da música do Brasil: 20 famílias de gêneros, 961 artistas, instrumentistas, músicas, discos, prêmios e realities.',
      'section.libs.aria': 'Acesso rápido às bibliotecas',
      'groups.tech': 'Tecnologia',
      'groups.creative': 'Criatividade',
      'groups.culture': 'Cultura e lazer',
      'groups.knowledge': 'Conhecimento',
      'groups.freethought': 'Pensamento Livre',
      'groups.life': 'Vida prática',
      'groups.beginners': 'Para iniciantes',
      'groups.animals': 'Ética animal',
      'groups.ai': 'Inteligência Artificial',
      'groups.music': 'Música',
      'groups.travel': 'Cultura e Viagem',
      'groups.sports': 'Esportes',
      'special.goats': 'GOATs',
      'special.lfb': 'Lendas do Futebol Brasileiro (LFB)',
      'special.biggestclubs': 'Os Maiores Clubes do Futebol Mundial',
      'special.brasileirosnaaustralia': 'Brasileiros na Austrália',
      'special.ethicalfood': 'Guia de Alimentos Éticos',
      'special.politicaparainiciantes': 'Política Para Iniciantes',
      'special.eticaparainiciantes': 'Ética Para Iniciantes',
      'special.cienciaparainiciantes': 'Ciência Para Iniciantes',
      'special.pelosanimais': 'Guia de Argumentação Pelos Animais',
      'special.aihistory': 'Linha do Tempo da História da IA',
      'special.brisbaneveganguide': 'Brisbane Vegan Guide',
      'special.brissyopshops': 'Brissy Op Shops',
      'special.questaodeetica': 'Questão de Ética',
      'special.curatedai': 'Curated AI',
      'special.australianculture': 'Cultura Australiana',
      'special.brazilianculture': 'Cultura Brasileira',
      'special.typesofrock': 'Tipos de Rock',
      'special.brazilianmusic': 'Música Brasileira',
      'libs.design': 'Biblioteca de Design',
      'libs.design.short': 'Design',
      'libs.language': 'Biblioteca de Estudo de Idiomas',
      'libs.language.short': 'Idiomas',
      'libs.games': 'Biblioteca de Games',
      'libs.games.short': 'Games',
      'libs.ai': 'Biblioteca de IAs',
      'libs.ai.short': 'IA',
      'libs.music': 'Biblioteca de Música',
      'libs.music.short': 'Música',
      'libs.coding': 'Biblioteca de Programação',
      'libs.coding.short': 'Programação',
      'libs.philosophy': 'Biblioteca de Filosofia',
      'libs.philosophy.short': 'Filosofia',
      'libs.thinking': 'Biblioteca de Racionalidade',
      'libs.thinking.short': 'Racionalidade',
      'libs.social': 'Biblioteca de Redes Sociais',
      'libs.social.short': 'Redes Sociais',
      'libs.organization': 'Biblioteca de Organização',
      'libs.organization.short': 'Organização',
      'libs.print': 'Biblioteca de Mídia Impressa',
      'libs.print.short': 'Mídia Impressa',
      'libs.art': 'Biblioteca de Arte',
      'libs.art.short': 'Arte',
      'libs.web3': 'Biblioteca de Web3',
      'libs.web3.short': 'Web3',
      'libs.list': 'Biblioteca de Listas',
      'libs.list.short': 'Listas',
      'libs.data': 'Biblioteca de Dados',
      'libs.data.short': 'Dados',
      'libs.history': 'Biblioteca de História',
      'libs.history.short': 'História',
      'libs.photography': 'Biblioteca de Fotografia',
      'libs.photography.short': 'Fotografia',
      'libs.job': 'Biblioteca de Emprego',
      'libs.job.short': 'Emprego',
      'libs.travel': 'Biblioteca de Viagem',
      'libs.travel.short': 'Viagem',
      'libs.antiscam': 'Biblioteca Antigolpe',
      'libs.antiscam.short': 'Antigolpe',
      'libs.conspiracy': 'Biblioteca de Conspirações',
      'libs.conspiracy.short': 'Conspirações',
      'libs.truecrime': 'Biblioteca de True Crime',
      'libs.truecrime.short': 'True Crime',
      'libs.esports': 'Biblioteca de eSports',
      'libs.esports.short': 'eSports',
      'section.about.aria': 'Sobre o projeto',
      'section.about.title': 'Sobre a BiblioVerse',
      'section.about.p1': 'A BiblioVerse tem bibliotecas temáticas com curadoria humana: os melhores sites, apps e referências de cada área, em páginas mínimas e rápidas. A missão é simples: <em>acesso rápido, claro e verificado</em> ao melhor conteúdo. Foco em três pilares: utilidade, transparência e performance. Se um link não ajuda, ele não entra. Tudo gratuito, sem anúncios e de código aberto.',
      'section.about.p2': 'Além disso, há projetos especiais que exploram um só tema em profundidade, de cultura, música e esportes a ética, ciência e política, em guias autorais com ferramentas interativas e sempre com fontes.',
      'section.creator.aria': 'Sobre o criador',
      'section.creator.title': 'Sobre o criador',
      'section.creator.p1': 'A BiblioVerse nasceu de um hábito antigo de Julio Cesar Prava, que há anos reúne em planilhas do Google os melhores sites, aplicativos, blogs e ferramentas para designers. Com a explosão da inteligência artificial, surgiu uma segunda biblioteca, dedicada às IAs, e, a partir dela, todas as outras ideias ganharam forma.',
      'section.creator.p2': 'Curador e organizador de informação por natureza, Julio tem como valores a busca pelo bem comum, a cooperação, a transparência, a informação livre, o acesso ao conhecimento, a inclusão digital e o pensamento crítico. É fã de projetos como a Wikipédia e o Software Livre, por organizarem e democratizarem o conhecimento.',
      'about.title': 'Sobre',
      'actions.about': 'Sobre',
      'actions.close': 'Fechar',
      'links.companyLinkedin': 'BiblioVerse no LinkedIn',
      'links.creatorLinkedin': 'LinkedIn do Julio',
      'links.creatorInstagram': 'Instagram do Julio',
      'section.curators.aria': 'Curadores',
      'section.curators.title': 'Outros curadores e colaboradores',
      'section.curators.filterLabel': 'Filtrar por biblioteca',
      'section.curators.all': 'Todas as bibliotecas',
      'curators.julio.desc': 'Designer e idealizador da BiblioVerse. Curadoria em todas as bibliotecas.',
      'curators.roney.desc': 'Revisor do projeto e curador nas bibliotecas de IA e Programação.',
      'curators.aline.desc': 'Curadora na biblioteca de Idiomas.',
      'curators.flavia.desc': 'Curadora na biblioteca de Web3.',
      'curators.taina.desc': 'Ilustradora em alguns projetos especiais da BiblioVerse.',
      'section.creator.role': 'Criador e curador da BiblioVerse',
      'links.linkedin': 'LinkedIn',
      'links.instagram': 'Instagram',
      'footer.count': 'Última atualização: novembro de 2026.',
      'footer.thanks': 'Obrigado pela visita!',
      'actions.share': 'Compartilhar',
      'actions.toTop': 'Voltar ao topo',
      'meta.last': 'Última'
    },
    en: {
      'meta.description': 'BiblioVerse — The Library of Everything. Central portal to access themed libraries and meet the project and its curators.',
      'brand.name': 'BiblioVerse',
      'footer.lead': '<strong class="proj-name">BiblioVerse</strong> is a collaborative project to organize and facilitate access to useful libraries across different topics.',
      'brand.beta': 'BETA',
      'hero.tagline': 'The library of everything',
      'hero.lead': 'Themed libraries and special projects curated by humans: the best websites, apps and references in each area, on minimal, fast pages. Free and ad-free.',
      'hero.libs': 'libraries',
      'hero.special': 'special projects',
      'hero.people': 'Picked by people, not by an algorithm',
      'doors.label': 'Choose what you want to explore',
      'doors.hint': 'tap a block to filter',
      'filter.all': 'All',
      'filter.special.short': 'Projects',
      'doors.libs.desc': 'Curated directories of the best websites, apps and references on each topic.',
      'doors.libs.cta': 'Show only libraries',
      'doors.special.desc': 'Standalone sites, each diving deep into a single topic, always with sources.',
      'doors.special.cta': 'Show only projects',
      'doors.all': 'Show everything',
      'mod.libs': 'Libraries',
      'mod.libs.sub': 'Curated directories of the best websites, apps and references on each topic.',
      'mod.special': 'Special projects',
      'mod.special.sub': 'Standalone sites, each devoted to a single topic, always with sources.',
      'desc.ai': 'The main artificial intelligence tools, organized by use.',
      'desc.coding': 'Languages, courses and tools to learn programming.',
      'desc.web3': 'Blockchain, wallets and the decentralized ecosystem.',
      'desc.social': 'Platforms, tools and resources for content creators.',
      'desc.design': 'Useful websites and tools for designers.',
      'desc.photography': 'Resources, apps and references to take better photos.',
      'desc.print': 'Magazines, newspapers, printers and the world of print.',
      'desc.art': 'Concepts, techniques, movements, artists and museums.',
      'desc.games': 'Platforms, games and the gaming universe.',
      'desc.list': 'The best lists and rankings on the internet in one place.',
      'desc.music': 'Apps, genres, labels and the fundamentals of music.',
      'desc.truecrime': 'Real crimes, accidents and disasters, and how to prevent and report them.',
      'desc.esports': 'Competitive games, tournaments, teams, legends and broadcasts.',
      'desc.language': 'Apps, channels and methods to learn languages.',
      'desc.data': 'Data sources, visualization and analysis.',
      'desc.history': 'Periods, civilizations, sources and references to study history.',
      'desc.philosophy': 'Schools, authors and references in philosophy.',
      'desc.thinking': 'Books and resources on critical thinking and cognitive biases.',
      'desc.conspiracy': 'Conspiracy theories, pseudoscience and false beliefs, and how to debunk them.',
      'desc.job': 'Job boards, résumé and career resources.',
      'desc.organization': 'Productivity and management apps and methods.',
      'desc.travel': 'Tools to plan trips and exchange programs.',
      'desc.antiscam': 'How to spot, verify, report and protect yourself from scams and fraud.',
      'desc.cienciaparainiciantes': 'A three-level guide to science: the scientific method, evidence and how to tell science from pseudoscience.',
      'desc.eticaparainiciantes': 'A three-level guide to ethics: theories, the moral circle, big dilemmas and philosophers, always with sources.',
      'href.pelosanimais': 'https://fortheanimals.biblioverse.org',
      'desc.pelosanimais': 'A catalogue of 213 arguments used to justify animal exploitation, each with a well-founded reply.',
      'desc.politicaparainiciantes': 'A three-level guide to politics, with interactive tools and dossiers on the Brazilian parties.',
      'desc.questaodeetica': 'The book-site of the 12 volumes of Uma Jornada pela Ética Animal, by Luciano Carlos Cunha, with lessons and quizzes.',
      'desc.curatedai': 'A catalogue of the best projects made with artificial intelligence and curated by humans.',
      'desc.aihistory': 'A free museum of AI, from Ada Lovelace in 1843 to today, every milestone backed by two press articles.',
      'desc.brasileirosnaaustralia': 'Content creators by city, a comparison of the capitals, agencies, apps and an arrival guide.',
      'desc.brisbaneveganguide': 'The best vegan restaurants, cafes, groups and people in Brisbane, in one bilingual guide.',
      'desc.brissyopshops': 'A guide to Greater Brisbane\'s op shops: ratings, opening hours, a map and tips.',
      'desc.australianculture': 'Geography, 65,000 years of history, who the people are and the Australian way of life.',
      'desc.brazilianculture': 'Geography, 13,000 years of history, who the people are and the Brazilian way of life.',
      'desc.goats': 'The greatest athletes of all time in more than 300 sports, with sources.',
      'desc.lfb': 'The all-time teams of the Brazilian national side and of 74 Brazilian clubs.',
      'desc.biggestclubs': 'A ranking of 383 clubs from 16 countries by their world, continental and national titles.',
      'desc.ethicalfood': 'A directory and map of nearly 2,300 alternative-protein companies in 71 countries.',
      'desc.typesofrock': '97 rock genres in an interactive tree, with history, sound, genealogy and artists.',
      'desc.brazilianmusic': 'The bilingual catalogue of Brazilian music: 20 genre families, 961 artists, musicians, songs, albums, awards and TV talent shows.',
      'section.libs.aria': 'Quick access to libraries',
      'groups.tech': 'Technology',
      'groups.creative': 'Creativity',
      'groups.culture': 'Culture & Leisure',
      'groups.knowledge': 'Knowledge',
      'groups.freethought': 'Freethought',
      'groups.life': 'Everyday Life',
      'groups.beginners': 'For Beginners',
      'groups.animals': 'Animal Ethics',
      'groups.ai': 'Artificial Intelligence',
      'groups.music': 'Music',
      'groups.travel': 'Culture & Travel',
      'groups.sports': 'Sports',
      'special.goats': 'GOATs',
      'special.lfb': 'Brazilian Football Legends (LFB)',
      'special.biggestclubs': 'The Biggest Clubs in World Football',
      'special.brasileirosnaaustralia': 'Brazilians in Australia',
      'special.ethicalfood': 'Ethical Food Guide',
      'special.politicaparainiciantes': 'Politics for Beginners',
      'special.eticaparainiciantes': 'Ethics for Beginners',
      'special.cienciaparainiciantes': 'Science for Beginners',
      'special.pelosanimais': 'For the Animals: An Argument Guide',
      'special.aihistory': 'AI History Timeline',
      'special.brisbaneveganguide': 'Brisbane Vegan Guide',
      'special.brissyopshops': 'Brissy Op Shops',
      'special.questaodeetica': 'Questão de Ética',
      'special.curatedai': 'Curated AI',
      'special.australianculture': 'Australian Culture',
      'special.brazilianculture': 'Brazilian Culture',
      'special.typesofrock': 'Types of Rock',
      'special.brazilianmusic': 'Brazilian Music',
      'libs.design': 'Design Library',
      'libs.design.short': 'Design',
      'libs.language': 'Language Study Library',
      'libs.language.short': 'Languages',
      'libs.games': 'Games Library',
      'libs.games.short': 'Games',
      'libs.ai': 'AI Library',
      'libs.ai.short': 'AI',
      'libs.music': 'Music Library',
      'libs.music.short': 'Music',
      'libs.coding': 'Programming Library',
      'libs.coding.short': 'Programming',
      'libs.philosophy': 'Philosophy Library',
      'libs.philosophy.short': 'Philosophy',
      'libs.thinking': 'Rationality Library',
      'libs.thinking.short': 'Rationality',
      'libs.social': 'Social Media Library',
      'libs.social.short': 'Social',
      'libs.organization': 'Organization Library',
      'libs.organization.short': 'Organization',
      'libs.print': 'Print Media Library',
      'libs.print.short': 'Print Media',
      'libs.art': 'Art Library',
      'libs.art.short': 'Art',
      'libs.web3': 'Web3 Library',
      'libs.web3.short': 'Web3',
      'libs.list': 'Lists Library',
      'libs.list.short': 'Lists',
      'libs.data': 'Data Library',
      'libs.data.short': 'Data',
      'libs.history': 'History Library',
      'libs.history.short': 'History',
      'libs.photography': 'Photography Library',
      'libs.photography.short': 'Photography',
      'libs.job': 'Jobs Library',
      'libs.job.short': 'Jobs',
      'libs.travel': 'Travel Library',
      'libs.travel.short': 'Travel',
      'libs.antiscam': 'Anti-Scam Library',
      'libs.antiscam.short': 'Anti-Scam',
      'libs.conspiracy': 'Conspiracy Library',
      'libs.conspiracy.short': 'Conspiracies',
      'libs.truecrime': 'True Crime Library',
      'libs.truecrime.short': 'True Crime',
      'libs.esports': 'eSports Library',
      'libs.esports.short': 'eSports',
      'section.about.aria': 'About the project',
      'section.about.title': 'About BiblioVerse',
      'section.about.p1': 'BiblioVerse has themed libraries curated by humans: the best websites, apps and references in each area, on minimal, fast pages. The mission is simple: <em>fast, clear, verified access</em> to the best content. We focus on three pillars: usefulness, transparency, and performance. If a link doesn\'t help, it\'s out. All free, ad-free and open source.',
      'section.about.p2': 'There are also special projects that explore a single topic in depth, from culture, music and sports to ethics, science and politics, in original guides with interactive tools and sources throughout.',
      'section.creator.aria': 'About the creator',
      'section.creator.title': 'About the creator',
      'section.creator.p1': 'BiblioVerse grew out of a long-standing habit of Julio Cesar Prava, who has spent years collecting the best websites, apps, blogs and tools for designers in Google Sheets. When the AI boom arrived, a second library, dedicated to AI tools, was born, and from there all the other ideas took shape.',
      'section.creator.p2': 'A curator and organizer of information by nature, Julio values the pursuit of the common good, cooperation, transparency, free information, access to knowledge, digital inclusion and critical thinking. He is a fan of projects like Wikipedia and Free Software, which organize and democratize knowledge.',
      'about.title': 'About',
      'actions.about': 'About',
      'actions.close': 'Close',
      'links.companyLinkedin': 'BiblioVerse on LinkedIn',
      'links.creatorLinkedin': "Julio's LinkedIn",
      'links.creatorInstagram': "Julio's Instagram",
      'section.curators.aria': 'Curators',
      'section.curators.title': 'Other curators and contributors',
      'section.curators.filterLabel': 'Filter by library',
      'section.curators.all': 'All libraries',
      'curators.julio.desc': 'Designer and creator of BiblioVerse. Curates all libraries.',
      'curators.roney.desc': 'Project reviewer and curator in the AI and Programming libraries.',
      'curators.aline.desc': 'Curator in the Languages library.',
      'curators.flavia.desc': 'Curator in the Web3 library.',
      'curators.taina.desc': 'Illustrator on some of the BiblioVerse special projects.',
      'section.creator.role': 'Creator and curator of BiblioVerse',
      'links.linkedin': 'LinkedIn',
      'links.instagram': 'Instagram',
      'footer.count': 'Last updated: November 2026.',
      'footer.thanks': 'Thanks for visiting!',
      'actions.share': 'Share',
      'actions.toTop': 'Back to top',
      'meta.last': 'Last'
    }
  };

  // ===== Browser language detection (first visit only) =====
  function detectBrowserLang(){
    try {
      const langs = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
      for(const l of langs){
        const code = l.toLowerCase().split('-')[0];
        if(code === 'en') return 'en';
        if(code === 'pt') return 'pt';
      }
    }catch(e){}
    return 'pt';
  }

  // ===== State =====
  // Use saved preference if available; otherwise detect from browser on first visit
  let curLang  = (function(){ try{ return localStorage.getItem('bv-lang') || detectBrowserLang(); }catch(e){ return 'pt'; } })();
  let curTheme = (function(){ try{ return localStorage.getItem('bv-theme') || (root.getAttribute('data-theme')||'light'); }catch(e){ return 'light'; } })();

  // ===== Helpers =====
  function setLangAttr(lang){ document.documentElement.lang = (lang === 'en') ? 'en' : 'pt-BR'; }
  function setLangToggleIcon(lang){
    if(!langToggle) return;
    langToggle.querySelectorAll('[data-l]').forEach(s => s.classList.toggle('on', s.getAttribute('data-l') === lang));
    langToggle.setAttribute('title', lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês');
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês');
  }
  function setThemeIcon(theme){
    if(!themeToggle) return;
    const label = (curLang === 'en')
      ? (theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme')
      : (theme === 'light' ? 'Mudar para o tema escuro' : 'Mudar para o tema claro');
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }

  // Text getter respecting i18n keys to guarantee consistent sorting in both languages
  function getI18nText(el, lang){
    const key = el.getAttribute('data-i18n');
    if(key && I18N[lang] && I18N[lang][key] != null){
      const tmp = I18N[lang][key].replace(/<[^>]*>/g, '');
      return tmp.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }
    const txt = el.textContent || '';
    return txt.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  // ===== Sorting: library cards (inside each group) =====
  function sortLibCards(lang){
    // Ordena pelo nome curto do tema (ignora "Biblioteca da/de")
    const shortOf = el => { const k = el.getAttribute('data-i18n') + '.short'; return (I18N[lang] && I18N[lang][k]) || getI18nText(el, lang); };
    libGrids.forEach(grid => {
      const cards = Array.from(grid.querySelectorAll('.lib-card'));
      cards.sort((a,b)=>{
        const aText = shortOf(a.querySelector('.lib-name'));
        const bText = shortOf(b.querySelector('.lib-name'));
        return aText.localeCompare(bText, lang === 'en' ? 'en' : 'pt-BR', {sensitivity:'base'});
      });
      const frag = document.createDocumentFragment();
      cards.forEach(c => frag.appendChild(c));
      grid.appendChild(frag);
    });
  }

  // ===== Sorting: filter select options =====
  function sortFilterOptions(lang){
    if(!libFilter) return;
    const opts  = Array.from(libFilter.querySelectorAll('option'));
    const first = opts.find(o => o.value === 'all');
    const rest  = opts.filter(o => o !== first);
    rest.sort((a,b)=>{
      const aText = getI18nText(a, lang);
      const bText = getI18nText(b, lang);
      return aText.localeCompare(bText, lang === 'en' ? 'en' : 'pt-BR', {sensitivity:'base'});
    });
    const frag = document.createDocumentFragment();
    if(first) frag.appendChild(first);
    rest.forEach(o => frag.appendChild(o));
    libFilter.appendChild(frag);
  }

  function resetFilterToAll(){
    if(!libFilter) return;
    libFilter.value = 'all';
  }

  function applyI18n(lang){
    document.title = (lang === 'en') ? 'BiblioVerse - The Library of Everything' : 'BiblioVerse - A Biblioteca de Tudo';

    const dict = (I18N && I18N[lang]) ? I18N[lang] : (I18N.pt || {});

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(key && dict[key] != null) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const def = el.getAttribute('data-i18n-attr') || '';
      def.split(';').forEach(pair => {
        const p = pair.trim();
        if(!p) return;
        const parts = p.split(':');
        const attr = (parts[0]||'').trim();
        const key  = (parts[1]||'').trim();
        if(attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    sortLibCards(lang);
    sortFilterOptions(lang);
    resetFilterToAll();
    filterCurators();
    setLangAttr(lang);
    setLangToggleIcon(lang);
    setThemeIcon(root.getAttribute('data-theme'));
    try{ localStorage.setItem('bv-lang', lang); }catch(e){}
  }

  function filterCurators(){
    const val = (libFilter?.value || 'all').trim();
    const cards = curators?.querySelectorAll('.cur-card') || [];
    cards.forEach(card => {
      const libs = (card.getAttribute('data-libs') || '').split(',').map(s=>s.trim());
      const show = (val==='all') || libs.includes(val);
      card.style.display = show ? '' : 'none';
    });
  }

  // Logos com versão própria para o tema escuro (ex.: Questão de Ética em branco)
  function swapThemeLogos(theme){
    document.querySelectorAll('img[data-src-dark]').forEach(img => {
      if(!img.hasAttribute('data-src-light')) img.setAttribute('data-src-light', img.getAttribute('src'));
      const want = img.getAttribute(theme === 'light' ? 'data-src-light' : 'data-src-dark');
      if(img.getAttribute('src') !== want) img.setAttribute('src', want);
    });
  }

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    swapThemeLogos(theme);
    setThemeIcon(theme);
    try{ localStorage.setItem('bv-theme', theme); }catch(e){}
  }

  // ===== Share button (Web Share API with clipboard fallback) =====
  function setupShare(){
    const shareBtn = document.getElementById('shareBtn') || document.querySelector('[data-action="share"]');
    if(!shareBtn) return;
    shareBtn.classList.add('btn-share-gradient');
    const shareData = {
      title: document.title || 'BiblioVerse',
      text: (I18N?.[curLang]?.['footer.lead'] ?
             I18N[curLang]['footer.lead'].replace(/<[^>]*>/g,'') :
             'BiblioVerse — portal central de bibliotecas.'),
      url: location.href
    };
    const doClipboardFallback = async () => {
      try {
        await navigator.clipboard.writeText(shareData.url);
        shareBtn.setAttribute('data-shared', '1');
        const prev = shareBtn.textContent;
        const okLabel = (curLang === 'en') ? 'Link copied!' : 'Link copiado!';
        shareBtn.textContent = '✓ ' + okLabel;
        setTimeout(()=>{
          shareBtn.textContent = prev;
          shareBtn.removeAttribute('data-shared');
        }, 1800);
      } catch (e) {
        alert((curLang === 'en') ? 'Copy failed. Please copy the URL manually.' : 'Falha ao copiar. Copie o link manualmente, por favor.');
      }
    };
    shareBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      try {
        if(navigator.share){
          await navigator.share(shareData);
        } else {
          await doClipboardFallback();
        }
      } catch(e){
        await doClipboardFallback();
      }
    }, { passive: false });
  }

  // ===== About modal (header "Sobre" button) =====
  function setupAbout(){
    const btn = document.getElementById('aboutToggle');
    const modal = document.getElementById('aboutModal');
    if(!btn || !modal) return;
    const sheet = modal.querySelector('.about-sheet');
    const closeBtn = document.getElementById('aboutClose');
    const open = () => {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      root.classList.add('about-open');
      sheet.scrollTop = 0;
      (closeBtn || sheet).focus();
    };
    const close = () => {
      if(modal.hidden) return;
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      root.classList.remove('about-open');
      btn.focus();
    };
    btn.addEventListener('click', () => modal.hidden ? open() : close());
    if(closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', ev => { if(ev.target === modal) close(); });
    document.addEventListener('keydown', ev => { if(ev.key === 'Escape') close(); });
  }

  // ===== Bootstrap =====
  // Contadores (hero e títulos dos módulos) calculados a partir dos cartões da página
  function updateCounts(){
    const n = { libs: document.querySelectorAll('#bibliotecas .lib-card').length,
                special: document.querySelectorAll('#projetos .lib-card').length };
    n.all = n.libs + n.special;
    document.querySelectorAll('[data-count]').forEach(el => { const k = el.getAttribute('data-count'); if(n[k] != null) el.textContent = n[k]; });
  }

  // ===== Hero: ícones em órbita e pilhas das portas, tirados dos próprios cartões =====
  function iconOf(card){
    const img = card.querySelector('.lib-logo');
    if(img){
      const i = document.createElement('img'); i.src = img.getAttribute('src'); i.alt = '';
      ['data-src-dark','data-src-light'].forEach(a => { if(img.hasAttribute(a)) i.setAttribute(a, img.getAttribute(a)); });
      return i;
    }
    return document.createTextNode((card.querySelector('.favicon')?.textContent || '').trim());
  }
  function buildHeroIcons(){
    const libs = Array.from(document.querySelectorAll('#bibliotecas .lib-card'));
    const special = Array.from(document.querySelectorAll('#projetos .lib-card'));
    const pick = (list, keys) => keys.map(k => list.find(c => c.getAttribute('data-key') === k)).filter(Boolean);
    // Pilhas das portas: alguns rostos de cada módulo + "+N"
    const stacks = {
      libs: pick(libs, ['ai','design','games','music','truecrime']),
      special: pick(special, ['questaodeetica','brazilianmusic','curatedai','cienciaparainiciantes','typesofrock'])
    };
    const totals = { libs: libs.length, special: special.length };
    document.querySelectorAll('[data-stack]').forEach(el => {
      const k = el.getAttribute('data-stack'); const items = stacks[k] || [];
      el.textContent = '';
      items.slice(0, 4).forEach(c => { const s = document.createElement('span'); s.appendChild(iconOf(c)); el.appendChild(s); });
      const rest = totals[k] - Math.min(items.length, 4);
      if(rest > 0){ const m = document.createElement('span'); m.className = 'more'; m.textContent = '+' + rest; el.appendChild(m); }
    });
    // Órbita: logos dos projetos especiais (um de cada grupo por volta, para variar);
    // emojis das bibliotecas só completam se faltarem logos
    const orbit = document.getElementById('heroOrbit');
    if(!orbit) return;
    const SLOTS = 10;
    const byGroup = Array.from(document.querySelectorAll('#projetos > .lib-group'))
      .map(g => Array.from(g.querySelectorAll('.lib-card')).filter(c => c.querySelector('.lib-logo')));
    const mix = [];
    for(let round = 0; mix.length < SLOTS && byGroup.some(g => g[round]); round++){
      byGroup.forEach(g => { if(g[round] && mix.length < SLOTS) mix.push(g[round]); });
    }
    const fill = pick(libs, ['ai','design','music','games','photography','truecrime','art','travel','code','history']);
    for(let i = 0; mix.length < SLOTS && i < fill.length; i++) mix.push(fill[i]);
    mix.forEach((c, i) => {
      const item = document.createElement('div');
      item.className = 'orbit-item';
      item.style.setProperty('--a', (i * 360 / mix.length) + 'deg');
      const s = document.createElement('span'); s.appendChild(iconOf(c)); item.appendChild(s);
      orbit.appendChild(item);
    });
  }

  // ===== Portas: filtrar entre bibliotecas e projetos especiais =====
  const MODS = { libs: 'bibliotecas', special: 'projetos' };
  let curShow = 'all';
  function applyShow(show, scroll){
    curShow = MODS[show] ? show : 'all';
    Object.keys(MODS).forEach(k => {
      const sec = document.getElementById(MODS[k]);
      if(sec){ sec.hidden = (curShow !== 'all' && curShow !== k); sec.classList.toggle('mod-first', curShow === k); }
    });
    document.querySelectorAll('.door, .seg-btn').forEach(d => d.setAttribute('aria-pressed', String(d.getAttribute('data-show') === curShow)));
    try{ history.replaceState(null, '', curShow === 'all' ? location.pathname + location.search : '#' + MODS[curShow]); }catch(e){}
    if(scroll && curShow !== 'all'){
      const sec = document.getElementById(MODS[curShow]);
      const doors = document.querySelector('.doors');
      // Só rola se o módulo escolhido estiver fora da tela (no celular, as portas ocupam quase toda a altura)
      if(sec && doors && doors.getBoundingClientRect().bottom > window.innerHeight * 0.6) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  function setupDoors(){
    document.querySelectorAll('.door').forEach(d => d.addEventListener('click', () => {
      const k = d.getAttribute('data-show');
      applyShow(curShow === k ? 'all' : k, true);
    }));
    // Barra fixa: troca o filtro; se já estiver grudada no topo, volta ao começo da lista
    document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
      applyShow(b.getAttribute('data-show'), false);
      const main = document.querySelector('main');
      if(main){ const y = main.getBoundingClientRect().top + window.scrollY; if(window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' }); }
    }));
    const fromHash = Object.keys(MODS).find(k => '#' + MODS[k] === location.hash);
    if(fromHash) applyShow(fromHash, false);
  }

  // Grupos de projetos especiais: do que tem mais projetos para o que tem menos (empate mantém a ordem do HTML)
  function sortSpecialGroups(){
    const sec = document.getElementById('projetos');
    if(!sec) return;
    const groups = Array.from(sec.querySelectorAll(':scope > .lib-group'));
    if(!groups.length) return;
    const after = groups[groups.length - 1].nextSibling;
    groups
      .map((g, i) => ({ g, i, n: g.querySelectorAll('.lib-card').length }))
      .sort((a, b) => (b.n - a.n) || (a.i - b.i))
      .forEach(({ g }) => sec.insertBefore(g, after));
  }

  document.addEventListener('DOMContentLoaded', () => {
    sortSpecialGroups();
    updateCounts();
    buildHeroIcons();
    setupDoors();
    setupShare();
    setupAbout();
    applyTheme(curTheme);
    applyI18n(curLang);

    if(langToggle) langToggle.addEventListener('click', () => {
      curLang = (curLang === 'pt') ? 'en' : 'pt';
      applyI18n(curLang);
    });

    if(themeToggle) themeToggle.addEventListener('click', () => {
      curTheme = (root.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
      applyTheme(curTheme);
    });

    if(libFilter) libFilter.addEventListener('change', filterCurators);

    resetFilterToAll();
    filterCurators();
  });

  window.addEventListener('load', () => {
    try{ resetFilterToAll(); filterCurators(); }catch(e){}
  });

})();
