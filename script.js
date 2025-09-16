
// === Superbar <-> Sidebar width sync ===
(function(){
  try{
    const root = document.documentElement;
    const side = document.querySelector('.sidepush, #sidepush, .sidebar, #sidebar');
    const setW = () => {
      const w = side ? side.offsetWidth : 0;
      root.style.setProperty('--sidepush-w', w + 'px');
    };
    setW();
    // Track live changes (collapse/expand)
    if (window.ResizeObserver){
      const ro = new ResizeObserver(setW);
      if (side) ro.observe(side);
      window.addEventListener('resize', setW, {passive:true});
    }else{
      window.addEventListener('resize', setW, {passive:true});
    }
  }catch(e){
    // fail silently; layout still works with full width
  }
})();


// Helper: update arrow direction and labels
function updateMenuToggleUi(){
  var btn = document.getElementById('menuToggle'); if(!btn) return;
  var open = document.body.classList.contains('side-open');
  // Right arrow to expand, left arrow to collapse
  btn.textContent = open ? '◀' : '▶';
  var lang = (typeof getLang==='function') ? getLang() : 'pt';
  var lblOpen = (lang==='en') ? 'Collapse menu' : 'Recolher menu';
  var lblClosed = (lang==='en') ? 'Expand menu' : 'Expandir menu';
  btn.setAttribute('aria-label', open ? lblOpen : lblClosed);
  btn.setAttribute('title', open ? lblOpen : lblClosed);
}


function slug(str){return (str||'Outros').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
function groupBy(a,k){return a.reduce((acc,it)=>{const key=(it[k]||'Outros').trim()||'Outros';(acc[key]=acc[key]||[]).push(it);return acc;},{});}
function clear(el){while(el.firstChild){el.removeChild(el.firstChild);}}
function sortAlpha(a){return [...a].sort((x,y)=>x.name.localeCompare(y.name,undefined,{sensitivity:'base'}));}

function parseCompanyItem(name){
  const patterns=[/\s+—\s+/,/\s+-\s+/,/\s*:\s*/];
  for(const p of patterns){
    if(p.test(name)){ const parts=name.split(p); if(parts.length>=2){ return {company:parts[0].trim(), item:parts.slice(1) ? parts.slice(1).join(' ').trim() : parts[1].trim()}; } }
  }
  // fix: simpler split
  const dash = name.split(' - '); if(dash.length>=2) return {company:dash[0].trim(), item:dash.slice(1).join(' ').trim()};
  const colon = name.split(': '); if(colon.length>=2) return {company:colon[0].trim(), item:colon.slice(1).join(' ').trim()};
  return {company:'', item:(name||'').toString().trim()};
}

// Category i18n mapping (keys are PT)
const CAT_I18N = {
"Agentes de IA": "AI agents",
"Apresentações com IA": "AI presentations",
"Automação com IA": "AI automation",
"Avatar com IA": "AI avatars",
"Áudio com IA": "AI audio",
"Banco de imagens com IA": "AI stock images",
"Benchmarks de IA": "AI benchmarks",
"Bibliotecas de IAs": "AI libraries",
"Chat com IA": "AI chatbots",
"Currículo com IA": "AI resumes",
"Design com IA": "AI design",
"Detetive com IA": "AI detective",
"Divulgadores de IAs": "AI curators",
"Educação com IA": "AI education",
"Escrita com IA": "AI writing",
"Fala com IA": "AI speech",
"Figuras-chave da IA": "AI leaders",
"Finanças com IA": "AI finances",
"Gerenciamento com IA": "AI management",
"Grandes empresas de IA": "AI big techs",
"IA de uso geral": "General-purpose AIs",
"Idiomas com IA": "AI language learning",
"Imagem com IA": "AI image",
"Laboratórios de IA": "AI labs",
"Marketing com IA": "AI marketing",
"Matemática com IA": "AI math learning",
"Navegador com IA": "AI browsers",
"Pacotes de IAs": "AI bundles",
"Pesquisa com IA": "AI research tools",
"Plataforma de serviços com IA": "AI service platforms",
"Programação com IA": "AI coding",
"Prompting para IA": "AI prompting",
"Retratos com IA": "AI portraits",
"Saúde com IA": "AI healthcare",
"Sintografistas de IA": "AI synthographers",
"Termos de IA": "AI glossary",
"Tradução com IA": "AI translation",
"Transcrição com IA": "AI transcription",
"Vídeo com IA": "AI video"


};

// Category icon mapping (keys are PT)
const CAT_ICON = {
  "Agentes de IA": "🤖",
  "Apresentações com IA": "📊",
  "Automação com IA": "⚙️",
  "Avatar com IA": "🧑‍🚀",
  "Áudio com IA": "🎧",
  "Banco de imagens com IA": "🌌",
  "Benchmarks de IA": "📈",
  "Bibliotecas de IAs": "📌",
  "Chat com IA": "💬",
  "Currículo com IA": "📄",
  "Design com IA": "🎨",
  "Detetive com IA": "🕵️",
  "Divulgadores de IAs": "🚀",
  "Educação com IA": "🎓",
  "Escrita com IA": "✍️",
  "Fala com IA": "🗣️",
  "Figuras-chave da IA": "🌟",
  "Finanças com IA": "💹",
  "Gerenciamento com IA": "🗂️",
  "Grandes empresas de IA": "🏢",
  "IA de uso geral": "🧠",
  "Idiomas com IA": "📘",
  "Imagem com IA": "🖼️",
  "Laboratórios de IA": "🧪",
  "Marketing com IA": "📣",
  "Matemática com IA": "➗",
  "Navegador com IA": "🌐",
  "Pacotes de IAs": "📦",
  "Pesquisa com IA": "🔬",
  "Plataforma de serviços com IA": "🧰",
  "Programação com IA": "💻",
  "Prompting para IA": "🖥",
  "Retratos com IA": "🧑‍🦰",
  "Saúde com IA": "🩺",
  "Tradução com IA": "🌍",
  "Transcrição com IA": "📝",
  "Vídeo com IA": "🎬",
  "Sintografistas de IA": "📷",
  "Termos de IA": "📖"

};
function catIcon(cat){ return CAT_ICON[cat] || "📦"; }
function catIconEl(cat){
  const span = document.createElement('span');
  span.className = 'cat-ico';
  span.textContent = catIcon(cat);
  span.setAttribute('aria-hidden','true');
  return span;
}


function isFeatured(it){
  if(!it) return false;
  if(it.featured === true) return true;
  try{
    if(typeof it.featured === 'string' && it.featured.toLowerCase()==='true') return true;
    if(Array.isArray(it.tags)){
      for(var i=0;i<it.tags.length;i++){
        var t = String(it.tags[i]||'').toLowerCase();
        if(t==='featured' || t==='destaque' || t==='star' || t==='⭐' || t==='highlight') return true;
      }
    }else if(typeof it.tags === 'string'){
      var s = it.tags.toLowerCase();
      if(s.includes('featured') || s.includes('destaque') || s.includes('star') || s.includes('highlight')) return true;
    }
  }catch(e){}
  return false;
}
function sortFeaturedAlpha(items){
  var arr = (items||[]).slice();
  arr.sort(function(a,b){
    var pa = isFeatured(a) ? 0 : 1;
    var pb = isFeatured(b) ? 0 : 1;
    if (pa !== pb) return pa - pb; // featured first
    var an = (a && a.name) ? String(a.name) : '';
    var bn = (b && b.name) ? String(b.name) : '';
    return an.localeCompare(bn);
  });
  return arr;
}

function catLabel(cat){ return (getLang()==='en' ? (CAT_I18N[cat] || cat) : cat); }
function catSlugFor(cat){ return slug(getLang()==='en' ? (CAT_I18N[cat] || cat) : cat); }




function compareCats(a,b){
  try{
    const la = (typeof catLabel === 'function') ? String(catLabel(a)||'') : String(a||'');
    const lb = (typeof catLabel === 'function') ? String(catLabel(b)||'') : String(b||'');
    return la.localeCompare(lb, undefined, {sensitivity:'base'});
  }catch(e){
    return String(a||'').localeCompare(String(b||''), undefined, {sensitivity:'base'});
  }
}
const I18N = {
  pt: {
    brand:"A Biblioteca de IAs",
    by:"por",
    search:"Buscar por nome",
    allCats:"Todas as categorias",
    visit:"Acesse",
    total:"Total",
    items:"itens",
    noResults:"Nenhum resultado.",
    footerLeadPre:"",
    projectName:"A Biblioteca de IAs",
    footerLeadPost:"foi idealizada por Julio Cesar Prava, construída com ajuda de IA e checada por Roney Amorim.",
    bookmarkShare:"Salve esse projeto nos seus favoritos e compartilhe!",
    thanks:"Obrigado pela visita!",
    lastUpdate:"Última atualização: Setembro/2025",
    share:"Compartilhar",
    copied:"Link copiado!",
    favHelp:"Use Ctrl+D (Windows) ou Cmd+D (Mac) para favoritar esta página.",
    kbdTitle:
"Atalhos de teclado\n/ – Ativa a barra de busca\nT – Alterna cor do tema\nL – Alterna idioma\n\n★ – Destaque"
  },
  en: {
    brand:"The AI Library",
    by:"by",
    search:"Search by name",
    allCats:"All categories",
    visit:"Visit",
    total:"Total",
    items:"items",
    noResults:"No results.",
    footerLeadPre:"",
    projectName:"The AI Library",
    footerLeadPost:"project was conceived by Julio Cesar Prava, developed with the help of AI and reviewed by Roney Amorim.",
    bookmarkShare:"Bookmark this project and share it!",
    thanks:"Thanks for visiting!",
    lastUpdate:"Last update: September/2025",
    share:"Share",
    copied:"Link copied!",
    favHelp:"Use Ctrl+D (Windows) or Cmd+D (Mac) to bookmark this page.",
    kbdTitle:
"Keyboard shortcuts\n/ – Focus the search bar\nT – Toggle theme color\nL – Toggle language\n\n★ – Featured"
  }
};

function getLang(){ try{ return localStorage.getItem('libia-lang') || 'pt'; }catch(e){ return 'pt'; } }
function setLang(lang){
  const dict = I18N[lang] || I18N.pt;
  try{ localStorage.setItem('libia-lang', lang); }catch(e){}
  document.querySelectorAll('.i18n-brand').forEach(el=>el.textContent=dict.brand);
  const search = document.getElementById('search'); if(search) search.placeholder = dict.search;
  const catSel = document.getElementById('categoryFilter');
  if(catSel && catSel.options.length) catSel.options[0].textContent = dict.allCats;
  // visit buttons removed; no-op
  const totalEl = document.querySelector('.i18n-total'); if(totalEl) totalEl.textContent = dict.total;
  const itemsEl = document.querySelector('.i18n-items'); if(itemsEl) itemsEl.textContent = dict.items;
  const byEl = document.querySelector('.i18n-by'); if(byEl) byEl.textContent = dict.by;

  const leadPre = document.querySelector('.i18n-footer-lead-pre'); if(leadPre) leadPre.textContent = dict.footerLeadPre;
  const proj = document.querySelector('.i18n-project-name'); if(proj) proj.textContent = dict.projectName;
  const leadPost = document.querySelector('.i18n-footer-lead-post'); if(leadPost) leadPost.textContent = dict.footerLeadPost;

  const fNote = document.querySelector('.i18n-bookmarkShare'); if(fNote) fNote.textContent = dict.bookmarkShare;
  const lastUp = document.querySelector('.i18n-lastupdate'); if(lastUp) lastUp.textContent = dict.lastUpdate;

  const fThanks = document.querySelector('.i18n-thanks'); if(fThanks) fThanks.textContent = dict.thanks;
  const shareBtn = document.getElementById('shareBtn'); if(shareBtn) shareBtn.querySelector('.i18n-share').textContent = dict.share;

  const tip = document.getElementById('infoTip'); if(tip) tip.textContent = dict.kbdTitle;

  document.documentElement.setAttribute('lang', lang==='en' ? 'en' : 'pt-br');
  const langBtn=document.getElementById('langToggle'); if(langBtn){ langBtn.textContent = (lang==='en' ? '🇧🇷' : '🇦🇺'); }

  // Localize tooltips / aria-labels for toggle buttons and select title
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){ themeBtn.setAttribute('aria-label', lang==='en' ? 'Toggle theme' : 'Alternar tema'); }
  const langBtn2 = document.getElementById('langToggle');
  if(langBtn2){ langBtn2.setAttribute('aria-label', lang==='en' ? 'Toggle language' : 'Alternar idioma'); }
  const infoBtn2 = document.getElementById('infoBtn');
  if(infoBtn2){ infoBtn2.setAttribute('aria-label', lang==='en' ? 'Information' : 'Informações'); }
  const catSel2 = document.getElementById('categoryFilter');
  if(catSel2){ catSel2.setAttribute('title', lang==='en' ? 'Filter by category' : 'Filtrar por categoria'); }
}


// --- Favicons (fast-first with smart fallbacks) ---
const FAVICON_CACHE = new Map();

function domainFromUrl(url){
  if(!url) return '';
  try{ return new URL(url).hostname; }catch(e){
    try{ return new URL('https://' + url).hostname; }catch(e2){ return ''; }
  }
}

function faviconUrlFor(host, provider){
  if(!host) return '';
  switch(provider){
    case 'google': return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64';
    case 'clearbit':    return 'https://icons.duckduckgo.com/ip3/' + host + '.ico';
    case 'direct': return 'https://' + host + '/favicon.ico';
    default: return '';
  }
}

/**
 * Heuristic for "bad" icons:
 * - broken load (onerror)
 * - intrinsic size <= 16x16 (generic globe / low-res)
 */
function isLowResFavicon(img){
  try{
    const w = img.naturalWidth||0, h = img.naturalHeight||0;
    return (w <= 16 || h <= 16);
  }catch(e){ return false; }
}

function createFaviconEl(url, name){
  const span = document.createElement('span');
  span.className = 'favicon';

  const host = domainFromUrl(url);
  if(!host){
    span.classList.add('fallback');
    span.textContent = (name||'?').trim().charAt(0).toUpperCase() || '?';
    return span;
  }

  const img = document.createElement('img');
  img.alt = ''; 
  img.referrerPolicy = 'no-referrer';
  img.decoding = 'async';
  img.loading = 'lazy';

  const providers = ['google','clearbit','direct'];
  let step = 0;

  // If we already discovered a good provider for this host, use it first.
  if(FAVICON_CACHE.has(host)){
    const cached = FAVICON_CACHE.get(host);
    const idx = providers.indexOf(cached);
    if(idx > 0){ providers.splice(idx,1); providers.unshift(cached); }
  }

  function tryNextProvider(){
    if(step >= providers.length){
      // Final fallback: text initial
      span.classList.add('fallback');
      span.textContent = (name||'?').trim().charAt(0).toUpperCase() || '?';
      if(img.parentNode) img.remove();
      return;
    }
    const prov = providers[step++];
    img.dataset.provider = prov;
    img.src = faviconUrlFor(host, prov);
  }

  img.addEventListener('error', ()=>{
    tryNextProvider();
  });

  img.addEventListener('load', ()=>{
    if(isLowResFavicon(img) && img.dataset.provider !== 'direct'){
      // 16x16 from Google or DDG is likely generic; try a different source
      tryNextProvider();
      return;
    }
    // Good icon: remember and keep
    FAVICON_CACHE.set(host, img.dataset.provider || 'google');
  });

  span.appendChild(img);
  tryNextProvider();
  return span;
}


function createCard(item){
  // Make the whole card a clickable link (like the old "Acesse" button)
  const d = document.createElement('a');
  d.className = 'card card-link';
  d.href = item.url || '#';
  if (item.url){
    d.target = '_blank';
    d.rel = 'noopener noreferrer';
    d.setAttribute('aria-label', (parseCompanyItem(item.name).item || item.name) + ' — abrir site');
  }else{
    d.setAttribute('aria-disabled','true');
    d.addEventListener('click', (e)=> e.preventDefault());
    d.title = (getLang()==='en'?'No link available':'Sem link disponível');
  }

  const parsed = parseCompanyItem(item.name);

  // Title with favicon
  const title = document.createElement('p'); title.className='title-line';
  const ico = createFaviconEl(item.url, parsed.item); title.appendChild(ico);
  const m = parsed.item.match(/^(.*?)(\s*\(.*\)\s*)$/);
  if(m){
    title.appendChild(document.createTextNode(' '+m[1].trim()));
    const par=document.createElement('span'); par.className='paren'; par.textContent=m[2]; title.appendChild(par);
  }else{
    title.appendChild(document.createTextNode(' '+parsed.item));
  }
  if(isFeatured(item)){
    var star=document.createElement('span');
    star.className='featured-star';
    star.title=(getLang && getLang()==='en'?'Featured':'Destaque');
    star.textContent='★';
    title.appendChild(star);
  }
  d.appendChild(title);

  // Subtitle: company (smaller)
  if(parsed.company){
    const sub=document.createElement('p'); sub.className='subtitle'; sub.textContent=parsed.company; d.appendChild(sub);
  }

  // No actions/visit button anymore — the card itself is the link
  return d;
}


function buildCategory(name, items){
  const sec=document.createElement('section');sec.className='category';sec.id=catSlugFor(name);

  const h2=document.createElement('h2');
  const icoEl = catIconEl(name);
  const titleSpan=document.createElement('span');
  titleSpan.className='cat-title';
  titleSpan.textContent=catLabel(name);

  const anchor=document.createElement('a');
  anchor.className='cat-anchor';
  anchor.href = '#' + catSlugFor(name);
  anchor.setAttribute('aria-label', (getLang()==='en' ? 'Copy link to category' : 'Copiar link da categoria'));
  anchor.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.59 13.41a1 1 0 0 0 1.41 1.41l4.24-4.24a3 3 0 0 0-4.24-4.24l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-4.24 4.24Zm2.82-2.82a1 1 0 0 0-1.41-1.41L7.35 13.4a3 3 0 1 0 4.24 4.24l1.06-1.06a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41l4.24-4.24Z"/>
    </svg>
  `;

  anchor.addEventListener('click', async (e)=>{
    e.preventDefault();
    const id = catSlugFor(name);
    // update hash
    if(history.replaceState){ history.replaceState(null, '', '#'+id); } else { location.hash = id; }
    // scroll
    const sec = document.getElementById(id); if(sec){ smoothScrollToId(sec.id); }
    // copy full URL
    try{
      await navigator.clipboard.writeText(location.origin + location.pathname + '#' + id);
      showToast(getLang()==='en' ? I18N.en.copied : I18N.pt.copied);
    }catch(err){ /* ignore */ }
  });

  h2.appendChild(icoEl);
  h2.appendChild(titleSpan);
  h2.appendChild(anchor);
  sec.appendChild(h2);

  const grid=document.createElement('div');grid.className='grid';
  sortFeaturedAlpha(items).forEach((it,i)=>{ const c=createCard(it); c.style.animationDelay=(i*30)+'ms'; grid.appendChild(c); });
  sec.appendChild(grid);
  return sec;
}


function populateSelect(categories){
  const sel=document.querySelector('#categoryFilter');clear(sel);
  const all=document.createElement('option');all.value='all';all.textContent=(getLang()==='en'?I18N.en.allCats:I18N.pt.allCats);sel.appendChild(all);
  Object.keys(categories).sort(compareCats).forEach(cat=>{
    const op=document.createElement('option'); op.value=catSlugFor(cat); op.textContent=catLabel(cat); sel.appendChild(op);
  });
}


function applyFilters(data){
  const q=document.getElementById('search').value.trim().toLowerCase();
  const catSlug=document.getElementById('categoryFilter').value;
  const root=document.getElementById('root');clear(root);
  const cats=groupBy(data.filter(item=>{
    const hay=(item.name+' '+(item.category||'')).toLowerCase();
    const okQ=q===''||hay.includes(q);
    const okC=catSlug==='all'||catSlugFor(item.category)===catSlug;
    return okQ && okC;
  }),'category');
  const names=Object.keys(cats).sort(compareCats);
  // Update footer counter with the number of items currently visible (search + category)
  const totalCount = Object.values(cats).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const countEl = document.getElementById('count'); if(countEl) countEl.textContent = totalCount;

  if(names.length===0){const p=document.createElement('p');p.className='no-results';p.textContent=(getLang()==='en'?I18N.en.noResults:I18N.pt.noResults);root.appendChild(p);return;}
  names.forEach(n=>root.appendChild(buildCategory(n,cats[n])));
}

function setTheme(theme){
  const html=document.documentElement;
  html.setAttribute('data-theme', theme);
  try{ localStorage.setItem('libia-theme', theme); }catch(e){}
  const btn=document.getElementById('themeToggle');
  if(btn){ btn.textContent = theme==='light' ? '🌙' : '☀️'; }
}

function initTheme(){
  let theme='dark';
  try{
    const saved=localStorage.getItem('libia-theme');
    if(saved==='light' || saved==='dark'){ theme=saved; }
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){ theme='light'; }
  }catch(e){}
  setTheme(theme);
}


function ensureToastContainer(){
  let t=document.getElementById('toast');
  if(!t){
    t=document.createElement('div'); t.id='toast'; document.body.appendChild(t);
  }
  return t;
}
function showToast(msg){
  const t=ensureToastContainer();
  t.textContent=msg;
  t.classList.remove('show');
  void t.offsetWidth; // reflow
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 1600);
}

function getHeaderOffset(){
  const h=document.querySelector('.site-header');
  return (h ? h.offsetHeight : 0) + 12; // small breathing space
}
function smoothScrollToId(id){
  const el=document.getElementById(id);
  if(!el) return;
  const off=getHeaderOffset();
  const rect=el.getBoundingClientRect();
  const y=window.scrollY + rect.top - off;
  window.scrollTo({top: Math.max(0,y), behavior:'smooth'});
}

function ensureTopButton(){
  let b=document.getElementById('toTopBtn');
  if(!b){
    b=document.createElement('button');
    b.id='toTopBtn';
    b.setAttribute('title', getLang()==='en' ? 'Back to top' : 'Voltar ao topo');
    b.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-7 7h4v9h6v-9h4z"/></svg>`;
    document.body.appendChild(b);
    b.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }
  return b;
}
function updateDocTitleAndMeta(){
  const lang=getLang();
  const name = lang==='en' ? 'The AI Library' : 'A Biblioteca de IAs';
  const desc = lang==='en' ? 'Searchable catalog of the best AI tools by category' : 'Catálogo pesquisável das melhores ferramentas de IA por categoria';
  document.title = name + ' — ' + desc;
  const meta=document.querySelector('meta[name="description"]'); if(meta){ meta.setAttribute('content', desc); }
}


function setupShare(){
  const shareBtn = document.getElementById('shareBtn');
  const url = location.href;
  const text = document.title;
  shareBtn.addEventListener('click', async () => {
    if(navigator.share){
      try{ await navigator.share({ title: document.title, text, url }); return; }catch(e){ /* ignore */ }
    }
    try{ await navigator.clipboard.writeText(url); alert((getLang()==='en'?I18N.en.copied:I18N.pt.copied)); }catch(e){}
  });
}

function setupFavorite(){
  const favBtn = document.getElementById('favBtn');
  favBtn.addEventListener('click', () => {
    if(window.external && 'AddFavorite' in window.external){
      try{ window.external.AddFavorite(location.href, document.title); return; }catch(e){}
    }
    alert((getLang()==='en'?I18N.en.favHelp:I18N.pt.favHelp));
  });
}

function setupInfo(){
  const infoBtn = document.getElementById('infoBtn');
  const tip = document.getElementById('infoTip');
  if(!infoBtn || !tip) return;
  // initial content
  tip.textContent = (getLang()==='en' ? I18N.en.kbdTitle : I18N.pt.kbdTitle);
  // show on hover/focus
  const show = ()=> tip.setAttribute('aria-hidden','false');
  const hide = ()=> tip.setAttribute('aria-hidden','true');
  infoBtn.addEventListener('mouseenter', show);
  infoBtn.addEventListener('focus', show);
  infoBtn.addEventListener('mouseleave', hide);
  infoBtn.addEventListener('blur', hide);
}

(function init(){
  initTheme();
  const savedLang = getLang(); setLang(savedLang);

  // Data
  let data=[]; const preload=document.getElementById('preloaded-data'); if(preload&&preload.textContent.trim()){ try{ data=JSON.parse(preload.textContent); }catch(e){} }
  document.getElementById('count').textContent=data.length;

  // Build UI
  
  // Build UI
  const cats=groupBy(data,'category'); populateSelect(cats);
  const sel=document.getElementById('categoryFilter');

  // initial selection based on hash or default
  const initialHash = (location.hash||'').replace(/^#/, '');
  const defaultCat = (window.DEFAULT_CATEGORY==='__ALL__') ? 'all' : slug(window.DEFAULT_CATEGORY||'');
  if(initialHash && document.getElementById(initialHash)){
    sel.value = initialHash;
  }else{
    sel.value = defaultCat || 'all';
  }
  applyFilters(data);
  // extras: toast + top button + dynamic title/meta
  ensureToastContainer();
  const toTop=ensureTopButton();
  updateDocTitleAndMeta();
      // Scroll main page to top and reset sidebar scroll as if 'back to top' was clicked
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var sideScroll = document.getElementById('sideScroll');
      if (sideScroll) { try { sideScroll.scrollTo({ top: 0, behavior: 'auto' }); } catch(e) { sideScroll.scrollTop = 0; } }

  window.addEventListener('scroll', ()=>{
    const y = window.scrollY||document.documentElement.scrollTop;
    if(y>200){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
  });

  if(initialHash){ setTimeout(()=>{ const sec=document.getElementById(initialHash); if(sec){ smoothScrollToId(sec.id); } },0); }
// Events
  document.getElementById('search').addEventListener('input',()=>applyFilters(data));
  
  sel.addEventListener('change',()=>{
    const v = sel.value;
    applyFilters(data);
    if(v==='all'){
      if(history.replaceState){ history.replaceState(null,'',location.pathname + location.search); } else { location.hash=''; }
      window.scrollTo({top:0, behavior:'smooth'});
    }else{
      const newHash = '#'+v;
      if(newHash!==location.hash){
        if(history.replaceState){ history.replaceState(null,'',newHash); } else { location.hash=newHash; }
      }
      const sec=document.getElementById(v); if(sec){ smoothScrollToId(sec.id); }
    }
  try{ if(typeof window.__rebuildSideMenu==='function'){ window.__rebuildSideMenu(); } }catch(e){}
    });

  document.getElementById('themeToggle').addEventListener('click',()=>{
    const html=document.documentElement;
    const now=html.getAttribute('data-theme')==='light'?'dark':'light';
    setTheme(now);
  });
  const langBtn = document.getElementById('langToggle');
  if(langBtn){
    langBtn.textContent = (getLang()==='en' ? '🇧🇷' : '🇦🇺');
    langBtn.addEventListener('click', ()=>{
      const next = (getLang()==='en') ? 'pt' : 'en';
      setLang(next);
      // rebuild categories/select with language-specific slugs
      const cats2=groupBy(data,'category'); populateSelect(cats2);
      sel.value = 'all';
      applyFilters(data);
      // clear hash and update title/meta
      if(history.replaceState){ history.replaceState(null,'',location.pathname + location.search); } else { location.hash=''; }
      updateDocTitleAndMeta();
      // Scroll main page to top and reset sidebar scroll as if 'back to top' was clicked
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var sideScroll = document.getElementById('sideScroll');
      if (sideScroll) { try { sideScroll.scrollTo({ top: 0, behavior: 'auto' }); } catch(e) { sideScroll.scrollTop = 0; } }

    });
  }

  
  // hash navigation sync
  window.addEventListener('hashchange', ()=>{
    const h=(location.hash||'').replace(/^#/, '');
    if(h && sel.value!==h){
      sel.value=h; applyFilters(data);
      const sec=document.getElementById(h); if(sec){ smoothScrollToId(sec.id); }
    }
    if(!h && sel.value!=='all'){
      sel.value='all'; applyFilters(data); window.scrollTo({top:0, behavior:'smooth'});
    }
  });

  setupShare();

  setupFavorite();
  setupInfo();

  document.addEventListener('keydown',(e)=>{
    const inField = e.target.matches('input,textarea,[contenteditable="true"]');
    if(e.key==='/'&&!inField){ e.preventDefault(); document.querySelector('#search').focus(); }
    if(!inField && e.key && e.key.toLowerCase()==='t'){ e.preventDefault(); const html=document.documentElement; const now=html.getAttribute('data-theme')==='light'?'dark':'light'; setTheme(now); }
    if(!inField && e.key && e.key.toLowerCase()==='l'){ e.preventDefault(); const next=(getLang()==='en')?'pt':'en'; setLang(next); const cats3=groupBy(data,'category'); populateSelect(cats3); document.getElementById('categoryFilter').value = document.getElementById('categoryFilter').value || defaultCat; applyFilters(data); }
  });
})();


// ===== Side Push Sidebar Logic =====
(function(){
  function ensureSmoothScroll(){
    if(typeof window.smoothScrollToId === 'function') return;
    window.smoothScrollToId = function(id){
      var el = (typeof id === 'string') ? document.getElementById(id) : id;
      if(!el) return;
      var y = el.getBoundingClientRect().top + window.scrollY - 70; // offset from sticky header
      window.scrollTo({top:y, behavior:'smooth'});
    };
  }

  
  // Emoji icons for categories (clean + consistent)
const ICONS = {
  // Home
  'home': '🏠',
  'default': '🏠',

  // Agents
  'ai-agents': '🤖',
  'agentes-de-ia': '🤖',

  // Presentations
  'ai-presentations': '📊',
  'apresentacoes-com-ia': '📊',

  // Automation
  'ai-automation': '⚙️',
  'automacao-com-ia': '⚙️',

  // Avatars
  'ai-avatars': '🧑‍🚀',
  'avatar-com-ia': '🧑‍🚀',

  // Audio (music tools)
  'ai-audio': '🎧',
  'audio-com-ia': '🎧',

  // Stock images (databases)
  'ai-stock-images': '🌌',
  'banco-de-imagens-com-ia': '🌌',

  // Benchmarks / leaderboards
  'ai-benchmarks': '📈',
  'benchmarks-de-ia': '📈',

  // Libraries/directories
  'ai-libraries': '📌',
  'bibliotecas-de-ias': '📌',

  // Chat
  'ai-chatbots': '💬',
  'chat-com-ia': '💬',

  // Resumes
  'ai-resumes': '📄',
  'curriculo-com-ia': '📄',

  // Design / image creation suites
  'ai-design': '🎨',
  'design-com-ia': '🎨',

  // Detective / OSINT-like
  'ai-detective': '🕵️',
  'detetive-com-ia': '🕵️',

  // Curators / promoters
  'ai-curators': '🚀',
  'divulgadores-de-ias': '🚀',

  // Education
  'ai-education': '🎓',
  'educacao-com-ia': '🎓',

  // Writing
  'ai-writing': '✍️',
  'escrita-com-ia': '✍️',

  // Speech / TTS / voice
  'ai-speech': '🗣️',
  'fala-com-ia': '🗣️',

  // Leaders / key figures
  'ai-leaders': '🌟',
  'figuras-chave-da-ia': '🌟',

  // Management / organization
  'ai-management': '🗂️',
  'gerenciamento-com-ia': '🗂️',

  // Big tech companies
  'ai-big-techs': '🏢',
  'grandes-empresas-de-ia': '🏢',

  // General-purpose
  'general-purpose-ais': '🧠',
  'ia-de-uso-geral': '🧠',

  // Language learning
  'ai-language-learning': '📘',
  'idiomas-com-ia': '📘',

  // Image (creation/editing)
  'ai-image': '🖌️',
  'imagem-com-ia': '🖌️',

  // Labs
  'ai-labs': '🧪',
  'laboratorios-de-ia': '🧪',

  // Marketing
  'ai-marketing': '📣',
  'marketing-com-ia': '📣',

  // Math
  'ai-math-learning': '➗',
  'matematica-com-ia': '➗',

  // Browsers
  'ai-browsers': '🌐',
  'navegador-com-ia': '🌐',

  // Bundles
  'ai-bundles': '📦',
  'pacotes-de-ias': '📦',

  // Research tools
  'ai-research-tools': '🔬',
  'pesquisa-com-ia': '🔬',

  // Service platforms
  'ai-service-platforms': '🧰',
  'plataforma-de-servicos-com-ia': '🧰',

  // Coding
  'ai-coding': '💻',
  'programacao-com-ia': '💻',

  // Prompting
  'ai-prompting': '🖥',
  'prompting-para-ia': '🖥',

  // Portraits
  'ai-portraits': '🧑‍🦰',
  'retratos-com-ia': '🧑‍🦰',

  // Healthcare
  'ai-healthcare': '🩺',
  'saude-com-ia': '🩺',

  // Translation
  'ai-translation': '🌍',
  'traducao-com-ia': '🌍',

  // Transcription
  'ai-transcription': '📝',
  'transcricao-com-ia': '📝',

  // Video
  'ai-video': '🎬',
  'video-com-ia': '🎬',

// Synthographers
'ai-synthographers': '📷',
'sintografistas-de-ia': '📷',

// AI glossary
'ai-glossary': '📖',
'termos-de-ia': '📖',

// AI finances
'ai-finances': '💹',
'financas-com-ia': '💹'
};

function iconFor(slug){
  var s = String(slug||'').toLowerCase();
  if(ICONS[s]) return ICONS[s];
  // Heuristics as a safety net
  if(s.includes('leader') || s.includes('figuras')) return '👑';
  if(s.includes('research') || s.includes('pesquisa') || s.includes('lab')) return '🔬';
  if(s.includes('audio') || s.includes('music')) return '🎧';
  if(s.includes('speech') || s.includes('voice') || s.includes('tts') || s.includes('fala')) return '🗣️';
  if(s.includes('image') || s.includes('imagem') || s.includes('design')) return '🖌️';
  if(s.includes('video')) return '🎬';
  if(s.includes('agent')) return '🤖';
  if(s.includes('chat')) return '💬';
  if(s.includes('write') || s.includes('escrita')) return '✍️';
  if(s.includes('bench')) return '📈';
  if(s.includes('browser') || s.includes('navegador')) return '🌐';
  if(s.includes('market')) return '📣';
  if(s.includes('resume') || s.includes('curriculo')) return '📄';
  if(s.includes('translate') || s.includes('traducao')) return '🌍';
  if(s.includes('transcri')) return '📝';
  if(s.includes('auto')) return '⚙️';
  if(s.includes('code') || s.includes('prog')) return '💻';
  if(s.includes('health') || s.includes('saude')) return '🩺';
  if(s.includes('manage') || s.includes('gerenc')) return '🗂️';
  return ICONS['default'];
}

function collectCategories(){
  // Prefer the select options so the sidebar always lists ALL categories,
  // even when the main content is filtered down to one.
  var sel = document.getElementById('categoryFilter');
  if(sel && sel.options && sel.options.length){
    var arr = [];
    for(var i=0;i<sel.options.length;i++){
      var op = sel.options[i];
      if(!op || op.value === 'all') continue;
      arr.push({ id: op.value, label: op.textContent.trim() });
    }
    return arr;
  }
  // Fallback: read from DOM if select is unavailable
  var sections = Array.from(document.querySelectorAll('section.category')) || [];
  return sections.map(function(sec){
    var id = sec.id || '';
    var labelEl = sec.querySelector('.cat-title') || sec.querySelector('h2');
    var label = labelEl ? labelEl.textContent.trim() : id;
    return { id, label };
  });
}

function buildSideMenu(){
    ensureSmoothScroll();
    var ul = document.getElementById('sideMenu'); if(!ul) return;
    ul.innerHTML = '';
    var cats = collectCategories();
// Active detection by hash
var hash = (location.hash||'').replace('#','');

// Add 'All categories' home item at top
(function(){
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = '#';
  a.className = 'sidepush-item';
  a.innerHTML = '<span class="ico">'+iconFor('home')+'</span><span class="label">'+(getLang()==='en'?I18N.en.allCats:I18N.pt.allCats)+'</span>';
  a.addEventListener('click', function(ev){
    ev.preventDefault();
    // expand menu on icon click to reveal labels
    document.body.classList.add('side-open');
    updateMenuToggleUi();
    // clear active
    document.querySelectorAll('.sidepush-item.active').forEach(function(el){ el.classList.remove('active'); });
    a.classList.add('active');
    // set select to all and trigger change
    var sel = document.getElementById('categoryFilter');
    if(sel){ sel.value = 'all'; sel.dispatchEvent(new Event('change')); }
    // close on small
    if(window.innerWidth < 900){ document.body.classList.remove('side-open'); }
  });
  li.appendChild(a); ul.appendChild(li);
  // Mark as active by default when no specific category is selected
  try{
    var hashNow = (location.hash||'').replace('#','');
    var selNow = document.getElementById('categoryFilter');
    var isAll = !hashNow && (selNow ? (selNow.value==='all' || !selNow.value) : true);
    if(isAll){ a.classList.add('active'); }
  }catch(e){}
})();cats.forEach(function(c){
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + c.id;
      a.className = 'sidepush-item';
      a.innerHTML = '<span class="ico">'+iconFor(c.id)+'</span><span class="label">'+c.label+'</span>';
      if(hash && hash === c.id) a.classList.add('active');
      a.addEventListener('click', function(ev){
        ev.preventDefault();
        // expand menu on icon click to reveal labels
        document.body.classList.add('side-open');
        updateMenuToggleUi();
        // update active state
        document.querySelectorAll('.sidepush-item.active').forEach(function(el){ el.classList.remove('active'); });
        a.classList.add('active');
        // update hash & smooth scroll
        if(history.replaceState){ history.replaceState(null, '', '#'+c.id); } else { location.hash = c.id; }
        var sel = document.getElementById('categoryFilter'); if(sel){ sel.value = c.id; sel.dispatchEvent(new Event('change')); }
        // On small screens, close after click
        if(window.innerWidth < 900){ document.body.classList.remove('side-open'); }
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  // Toggle button
  function initToggle(){
    var btn = document.getElementById('menuToggle'); if(!btn) return;
    // Initial UI
    updateMenuToggleUi();
    btn.addEventListener('click', function(){
      document.body.classList.toggle('side-open');
      // Recompute active item visibility
      setTimeout(buildSideMenu, 10);
      updateMenuToggleUi();
    });
  }

  // Hook into language changes to re-render labels
  if(typeof window.setLang === 'function'){
    var _setLang = window.setLang;
    window.setLang = function(lang){
      _setLang(lang);
      // delay to let main content rebuild translations if any
      setTimeout(buildSideMenu, 50);
      var title = document.querySelector('.sidepush-title.i18n-brand');
      if(title){
        title.textContent = (lang==='en' ? (I18N.en.brand) : (I18N.pt.brand));
      }
      var hb = document.getElementById('menuToggle');
      if(hb){
        updateMenuToggleUi();
      }
    };
  }

  window.addEventListener('hashchange', function(){ 
    // keep active state in sync
    var hash = (location.hash||'').replace('#','');
    var items = document.querySelectorAll('.sidepush-item');
    items.forEach(function(a){
      var href = a.getAttribute('href') || '';
      var id = (href.startsWith('#') ? href.slice(1) : href);
      a.classList.toggle('active', id===hash);
    });
    if(!hash){
      // Ensure 'Home / All categories' shows as active when no hash
      var home = document.querySelector('.sidepush-item[href="#"]') || document.querySelector('.sidepush-item');
      if(home){ items.forEach(function(a){a.classList.remove('active');}); home.classList.add('active'); }
    }
  });

  // Build after main content is mounted
  document.addEventListener('DOMContentLoaded', function(){
    initToggle();
    // slight delay to ensure categories are rendered by existing script
    setTimeout(function(){ buildSideMenu(); updateMenuToggleUi(); }, 80);
  });

  // Expose for manual rebuilds if needed
  window.__rebuildSideMenu = buildSideMenu;
})();


// Keep toggle label in sync on resize (no layout change)
if (typeof updateMenuToggleUi === 'function') {
  window.addEventListener('resize', updateMenuToggleUi);
}


// === 2025-09-10: Mobile overlay behavior for sidebar ===
(function(){
  function isOverlayMode(){ return window.matchMedia('(max-width: 768px), (max-width: 1024px) and (orientation: portrait)').matches; }

  // Create scrim once
  var scrim = document.querySelector('.side-scrim');
  if(!scrim){
    scrim = document.createElement('div');
    scrim.className = 'side-scrim';
    document.body.appendChild(scrim);
  }
  scrim.addEventListener('click', function(){
    document.body.classList.remove('side-open');
  }, { passive: true });

  // Close on Escape
  window.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape'){
      document.body.classList.remove('side-open');
    }
  });

  // Lock/unlock body scroll on state/resize
  function syncScrollLock(){
    if (document.body.classList.contains('side-open') && isOverlayMode()){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Hook into potential existing toggle function
  var origToggle = window.toggleSidebar;
  window.toggleSidebar = function(force){
    var willOpen;
    if(typeof force === 'boolean'){
      willOpen = force;
    } else {
      willOpen = !document.body.classList.contains('side-open');
    }
    document.body.classList.toggle('side-open', willOpen);
    if (typeof window.updateMenuToggleUi === 'function') {
      window.updateMenuToggleUi();
    }
    syncScrollLock();
  };

  // Keep in sync with resizes
  window.addEventListener('resize', syncScrollLock);
  // Initial sync in case markup starts open or at small viewport
  syncScrollLock();
})();


// --- Scroll control to avoid starting scrolled down after filter/category changes ---
(function(){
  function scrollToTopAfterRender(){
    // Ensure it runs after layout & any async favicon loads kick in
    requestAnimationFrame(function(){
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  // Hook category <select> changes
  document.addEventListener('DOMContentLoaded', function(){
    try{
      var sel = document.getElementById('categoryFilter');
      if(sel && !sel.dataset._scrollHooked){
        sel.addEventListener('change', function(){
          scrollToTopAfterRender();
        }, { passive: true });
        sel.dataset._scrollHooked = '1';
      }
    }catch(e){}

    // Hook side menu clicks (delegate)
    try{
      var side = document.getElementById('sideMenu');
      if(side && !side.dataset._scrollHooked){
        side.addEventListener('click', function(ev){
          var t = ev.target;
          // if a link or button inside the menu triggers a filter/anchor change, scroll to top
          if(t && (t.tagName === 'A' || t.closest('a'))){
            scrollToTopAfterRender();
          }
        }, { passive: true });
        side.dataset._scrollHooked = '1';
      }
    }catch(e){}

    // When URL hash changes to a category anchor, ensure top (then smooth to the section)
    window.addEventListener('hashchange', function(){
      scrollToTopAfterRender();
    }, { passive: true });

  });
})();

/* PWA: Service Worker registration + Add to Home Screen prompt */
(function(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/service-worker.js').catch(console.error);
    });
  }
  var deferredPrompt = null;
  var btn = document.getElementById('btnInstall');
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    if (btn) { btn.hidden = false; }
  });
  if (btn) {
    btn.addEventListener('click', async function(){
      btn.disabled = true;
      try {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          // hide button regardless of outcome
          btn.hidden = true;
          deferredPrompt = null;
        }
      } finally {
        btn.disabled = false;
      }
    });
  }
})();


// Superbar mobile toggle
document.addEventListener('DOMContentLoaded', function(){
  const superbar = document.querySelector('.superbar');
  const toggle = document.querySelector('.superbar-toggle');
  if(toggle){
    toggle.addEventListener('click', () => {
      superbar.classList.toggle('open');
    });
  }
});


// ===== Superbar compact toggle & current label =====
(function(){
  const nav = document.querySelector('.superbar');
  if(!nav) return;
  const toggle = nav.querySelector('.superbar-toggle');
  const list = nav.querySelector('.superbar-list');
  const current = nav.querySelector('.superbar-current');

  // Set current label from active item
  const active = list.querySelector('.superbar-item.active a') || list.querySelector('.superbar-item a');
  if (active && current) current.textContent = active.textContent.trim();

  if (toggle){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Close on link click (small screens)
  list.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if(!a) return;
    if (window.matchMedia('(max-width: 720px)').matches){
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (current) current.textContent = a.textContent.trim();
    }
  });
})();
