(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle  = document.getElementById('langToggle');
  const libFilter   = document.getElementById('libFilter');
  const curators    = document.getElementById('curators');
  const libGrid     = document.querySelector('.lib-grid');

  // ===== Dictionaries =====
  const I18N = {
    pt: {
      'meta.description': 'BiblioVerse — A Biblioteca de Tudo. Portal central para acessar as bibliotecas temáticas e conhecer o projeto e seus curadores.',
      'brand.name': 'BiblioVerse',
      'footer.lead': '<strong class="proj-name">BiblioVerse</strong> é um projeto colaborativo para organizar e facilitar o acesso a bibliotecas úteis em diferentes temas.',
      'brand.beta': 'BETA',
      'brand.byline.prefix': 'A biblioteca de tudo',
      'hero.logoAlt': 'Logo do BiblioVerse',
      'section.libs.aria': 'Acesso rápido às bibliotecas',
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
      'section.about.aria': 'Sobre o projeto',
      'section.about.title': 'Sobre o BiblioVerse',
      'section.about.p1': 'O BiblioVerse é um hub de bibliotecas temáticas com curadoria humana. A missão é simples: <em>acesso rápido, claro e verificado</em> ao melhor conteúdo, em uma interface mínima e veloz. Código aberto, espírito colaborativo.',
      'section.about.p2': 'Foco em três pilares: utilidade, transparência e performance. Se um link não ajuda, ele não entra. Se ajuda, entra polido — com contexto, ícone e tradução quando couber.',
      'section.curators.aria': 'Curadores',
      'section.curators.title': 'Curadores',
      'section.curators.filterLabel': 'Filtrar por biblioteca',
      'section.curators.all': 'Todas as bibliotecas',
      'curators.julio.desc': 'Designer e idealizador do BiblioVerse. Curadoria em todas as bibliotecas.',
      'curators.roney.desc': 'Revisor do projeto e curador nas bibliotecas de IA e Programação.',
      'curators.aline.desc': 'Curadora na biblioteca de Idiomas.',
      'links.linkedin': 'LinkedIn',
      'links.instagram': 'Instagram',
      'footer.count': 'Portal central do <strong class="proj-name">BiblioVerse</strong> — Última atualização: Setembro/2026',
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
      'brand.byline.prefix': 'The library of everything',
      'brand.byline.suffix': '',
      'hero.logoAlt': 'BiblioVerse logo',
      'section.libs.aria': 'Quick access to libraries',
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
      'section.about.aria': 'About the project',
      'section.about.title': 'About BiblioVerse',
      'section.about.p1': 'BiblioVerse is a hub of themed libraries curated by humans. The mission is simple: <em>fast, clear, verified access</em> to the best content, in a minimal and fast interface. Open-source, collaborative spirit.',
      'section.about.p2': 'We focus on three pillars: usefulness, transparency, and performance. If a link doesn\'t help, it\'s out. If it helps, it comes polished — with context, icon and translation when relevant.',
      'section.curators.aria': 'Curators',
      'section.curators.title': 'Curators',
      'section.curators.filterLabel': 'Filter by library',
      'section.curators.all': 'All libraries',
      'curators.julio.desc': 'Designer and creator of BiblioVerse. Curates all libraries.',
      'curators.roney.desc': 'Project reviewer and curator in the AI and Programming libraries.',
      'curators.aline.desc': 'Curator in the Languages library.',
      'links.linkedin': 'LinkedIn',
      'links.instagram': 'Instagram',
      'footer.count': 'Central hub of <strong class="proj-name">BiblioVerse</strong> — Last update: September/2026',
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
    langToggle.textContent = (lang === 'en') ? '🇧🇷' : '🇦🇺';
    langToggle.setAttribute('title', lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês');
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês');
  }
  function setThemeIcon(theme){ if(!themeToggle) return; themeToggle.textContent = (theme === 'light') ? '🌙' : '☀️'; }

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

  // ===== Sorting: library cards =====
  function sortLibCards(lang){
    if(!libGrid) return;
    const cards = Array.from(libGrid.querySelectorAll('.lib-card'));
    cards.sort((a,b)=>{
      // Ordena pelo nome curto do tema (ignora "Biblioteca da/de")
      const shortOf = el => { const k = el.getAttribute('data-i18n') + '.short'; return (I18N[lang] && I18N[lang][k]) || getI18nText(el, lang); };
      const aText = shortOf(a.querySelector('.lib-name'));
      const bText = shortOf(b.querySelector('.lib-name'));
      return aText.localeCompare(bText, lang === 'en' ? 'en' : 'pt-BR', {sensitivity:'base'});
    });
    const frag = document.createDocumentFragment();
    cards.forEach(c => frag.appendChild(c));
    libGrid.appendChild(frag);
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
    document.querySelectorAll('section[data-i18n-attr*="section.about.aria"] .section-title, #curators .section-title').forEach(e=>e.classList.add('gradient-title'));

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

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
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

  // ===== Bootstrap =====
  document.addEventListener('DOMContentLoaded', () => {
    setupShare();
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
