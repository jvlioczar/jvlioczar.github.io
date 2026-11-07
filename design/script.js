function updateMenuToggleUi(){
  const btn=document.getElementById('menuToggle');if(!btn)return;
  const open=document.body.classList.contains('side-open');
  btn.textContent=open?'◀':'▶';
  const lang=typeof getLang==='function'?getLang():'pt';
  const lbl=open?(lang==='en'?'Collapse menu':'Recolher menu'):(lang==='en'?'Expand menu':'Expandir menu');
  btn.setAttribute('aria-label',lbl);btn.setAttribute('title',lbl);
}

function slug(s){return(s||'outros').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
function slugEn(s){return slug((s||'').replace(/&/g,'and'));}
function groupBy(a,k){return a.reduce((acc,it)=>{const key=((it[k]||'Conceitos Gerais').trim()||'Conceitos Gerais');(acc[key]=acc[key]||[]).push(it);return acc;},{});}

function parseCompanyItem(name){
  const pats=[/\s+—\s+/,/\s+-\s+/,/\s*:\s*/];
  for(const p of pats){if(p.test(name)){const pts=name.split(p);if(pts.length>=2)return{company:pts[0].trim(),item:pts.slice(1).join(' ').trim()};}}
  const d=name.split(' - ');if(d.length>=2)return{company:d[0].trim(),item:d.slice(1).join(' ').trim()};
  const c=name.split(': ');if(c.length>=2)return{company:c[0].trim(),item:c.slice(1).join(' ').trim()};
  return{company:'',item:(name||'').toString().trim()};
}

// ── Category translations ──────────────────────────────────────────────────
const CAT_I18N={
  "Ferramentas":"Tools","Recursos Gratuitos":"Free Resources","Recursos Pagos":"Paid Resources",
  "Blogs e Conteúdo":"Blogs & Content","Estúdios e Agências":"Studios & Agencies","Pessoas":"People",
  "Rankings e Listas":"Rankings & Lists","Bibliotecas":"Libraries","Termos":"Terms"
};

// ── Subcategory translations (EN) ──────────────────────────────────────────
const SUBCAT_I18N={
  // Ferramentas
  "Redes Sociais / Portfolios":                        "Social Networks & Portfolios",
  "Editor online de design":                           "Online Design Editor",
  "Editor online de mockups":                          "Online Mockup Editor",
  "Softwares para pintura digital":                    "Digital Painting Software",
  "Softwares para ilustração vetorial":                "Vector Illustration Software",
  "Software para 3D":                                  "3D Software",
  "Softwares para editoração":                         "Desktop Publishing Software",
  "Softwares para edição de fotografia":               "Photo Editing Software",
  "Softwares para edição de vídeo":                    "Video Editing Software",
  "Softwares para animação":                           "Animation Software",
  "Softwares para tipografia":                         "Type Design Software",
  "Softwares para design de interfaces e webdesign":   "UI & Web Design Software",
  "Softwares e apps para testar tipografia e logo":    "Typography & Logo Testing Apps",
  "Softwares e apps para design experimental":         "Experimental Design Tools",
  "Softwares e apps para testar fotografia":           "Camera & Photography Simulators",
  "Apps de cores e paletas":                           "Color & Palette Apps",
  "Pacotes de Softwares":                              "Software Bundles",
  // Recursos Gratuitos
  "Bancos de fotografias":                             "Stock Photos",
  "Bancos de ilustrações":                             "Stock Illustrations",
  "Bancos de ícones":                                  "Stock Icons",
  "Bancos de mockups":                                 "Stock Mockups",
  "Bancos de tipografias":                             "Stock Fonts",
  "Conversores":                                       "File Converters",
  "Upscalers":                                         "Image Upscalers",
  // Recursos Pagos
  "Recursos em geral":                                 "General Resources",
  "Bancos de imagens":                                 "Stock Images",
  "Bancos de padrões e texturas":                      "Stock Patterns & Textures",
  "Serviços de design":                                "Design Services",
  "Cursos de design":                                  "Design Courses",
  // Conteúdo
  "Inspiração":                                        "Inspiration",
  "Design em geral":                                   "General Design",
  "Branding":                                          "Branding",
  "Design de produto":                                 "Product Design",
  "Design editorial":                                  "Editorial Design",
  "Embalagem":                                         "Packaging Design",
  "Fotografia":                                        "Photography",
  "História do design":                                "Design History",
  "Infografia":                                        "Infographics",
  "Ilustração":                                        "Illustration",
  "Motion e 3D":                                       "Motion & 3D",
  "Tipografia":                                        "Typography",
  "Tutoriais":                                         "Tutorials",
  "UX/UI":                                             "UX/UI",
  "Exercícios de Design":                              "Design Exercises",
  // Estúdios e Agências
  "Foundries (Tipografia)":                            "Type Foundries",
  "Animação":                                          "Animation",
  // Pessoas
  "Artistas Tradicionais":                             "Traditional Artists",
  "Ilustradores Digitais":                             "Digital Illustrators",
  "Ilustradores Vetoriais":                            "Vector Illustrators",
  "Fotógrafos":                                        "Photographers",
  "Fotomanipuladores":                                 "Photomanipulators",
  "Designers de Identidade Visual":                    "Branding Designers",
  "Designers Editoriais":                              "Editorial Designers",
  "Tipógrafos":                                        "Typographers",
  "Motion Designers":                                  "Motion Designers",
  "Designers de UX/UI":                                "UX/UI Designers",
  "Designers de Produto":                              "Product Designers",
  "Designers de Informação":                           "Infodesigners",
  "Designers de Embalagem":                            "Packaging Designers",
  "AI Designers":                                      "AI Designers",
  "Designers de Jogos":                                "Game Designers",
  "YouTubers":                                         "YouTubers",
  // legado
  "Branding e IV":                                     "Branding & Visual Identity",
  "Editorial":                                         "Editorial",
  "Motion":                                            "Motion",
  "3D":                                                "3D",
  // Rankings
  "Pessoas":                                           "People",
  "Marcas":                                            "Brands",
  "Audiovisual":                                       "Audiovisual",
  "Premiações":                                        "Awards",
  // Bibliotecas
  "Agenciadores de criativos":                         "Creative Talent Platforms",
  "Bibliotecas":                                        "Libraries",
  // Termos
  "Advertising":                                       "Advertising",
  // Termos
  "Conceitos Gerais":                                  "General Concepts"
};

// ── Icons ──────────────────────────────────────────────────────────────────
const CAT_ICON={
  "Ferramentas":"🔧","Recursos Gratuitos":"🆓","Recursos Pagos":"💳","Blogs e Conteúdo":"📖",
  "Estúdios e Agências":"🏢","Pessoas":"👤","Rankings e Listas":"🏆","Bibliotecas":"📚","Termos":"🧩"
};
const SUBCAT_ICON={
  "Redes Sociais / Portfolios":"🖼️","Editor online de design":"🎨","Editor online de mockups":"📱",
  "Softwares para pintura digital":"🖌️","Softwares para ilustração vetorial":"✏️","Software para 3D":"🧊",
  "Softwares para editoração":"📰","Softwares para edição de fotografia":"📷","Softwares para edição de vídeo":"🎬",
  "Softwares para animação":"🎞️","Softwares para tipografia":"🔤",
  "Softwares para design de interfaces e webdesign":"💻",
  "Softwares e apps para testar tipografia e logo":"🔡",
  "Softwares e apps para design experimental":"⚗️",
  "Softwares e apps para testar fotografia":"📸",
  "Apps de cores e paletas":"🎨","Pacotes de Softwares":"📦",
  "Bancos de fotografias":"🏞️","Bancos de ilustrações":"🖼️","Bancos de ícones":"🔷",
  "Bancos de mockups":"📱","Bancos de tipografias":"🔤","Conversores":"🔄","Upscalers":"⬆️",
  "Recursos em geral":"🗂️","Bancos de imagens":"🌅","Bancos de padrões e texturas":"🧵",
  "Serviços de design":"💼","Cursos de design":"🎓",
  "Inspiração":"💡","Design em geral":"🎨","Branding":"🏷️","Design de produto":"📦",
  "Design editorial":"📰","Embalagem":"🛍️","Fotografia":"📷","História do design":"📜",
  "Infografia":"📊","Ilustração":"✏️","Motion e 3D":"🎞️","Tipografia":"🔤",
  "Tutoriais":"🎥","UX/UI":"🖥️","Exercícios de Design":"✍️",
  "Foundries (Tipografia)":"🔡","Animação":"🎞️",
  "Artistas Tradicionais":"🖊️","Ilustradores Digitais":"🎨","Ilustradores Vetoriais":"✏️","Fotógrafos":"📷","Fotomanipuladores":"🪄","Designers de Identidade Visual":"🏷️","Designers Editoriais":"📰","Tipógrafos":"🔤","Motion Designers":"🎞️","Designers de UX/UI":"🖥️","Designers de Produto":"📦","Designers de Informação":"📊","Designers de Embalagem":"🛍️","AI Designers":"🤖","Designers de Jogos":"🎮","YouTubers":"▶️",  // legado
  "Branding e IV":"🏷️","Editorial":"📰","Motion":"🎞️","3D":"🧊",
  "Pessoas":"👤","Marcas":"🏷️","Audiovisual":"🎬","Premiações":"🏅",
  "Agenciadores de criativos":"🤝","Bibliotecas":"📚","Advertising":"📣","Conceitos Gerais":"💡"
};

function catIcon(cat){return CAT_ICON[cat]||"📦";}
function subcatIcon(sub){return SUBCAT_ICON[sub]||"•";}
function isFeatured(it){if(!it)return false;if(it.featured===true)return true;try{if(typeof it.featured==='string'&&it.featured.toLowerCase()==='true')return true;}catch(e){}return false;}
function isEnded(it){if(!it)return false;try{if(it.ended===true)return true;if(typeof it.ended==='string'&&it.ended.toLowerCase()==='true')return true;}catch(e){}return false;}
function sortFeaturedAlpha(items){
  return(items||[]).slice().sort((a,b)=>{
    const rank=it=>isFeatured(it)?0:isEnded(it)?2:1;
    const d=rank(a)-rank(b);if(d)return d;
    return String(a.name||'').localeCompare(String(b.name||''),undefined,{sensitivity:'base'});
  });
}

function getLang(){
  try{
    const saved=localStorage.getItem('libia-lang');
    if(saved)return saved; // user already chose a language — respect it
    // First visit: detect from browser/OS language
    const nav=(navigator.language||navigator.userLanguage||'pt').toLowerCase();
    return nav.startsWith('pt')?'pt':'en';
  }catch(e){return'pt';}
}
function catLabel(cat){return getLang()==='en'?(CAT_I18N[cat]||cat):cat;}
function subcatLabel(sub){return getLang()==='en'?(SUBCAT_I18N[sub]||sub):sub;}
function catSlugFor(cat){if(getLang()==='en'){return slugEn(CAT_I18N[cat]||cat);}return slug(cat);}
function subcatSlugFor(cat,sub){if(getLang()==='en'){return slugEn(CAT_I18N[cat]||cat)+'--'+slugEn(SUBCAT_I18N[sub]||sub);}return slug(cat)+'--'+slug(sub);}

const CAT_ORDER=["Ferramentas","Recursos Gratuitos","Recursos Pagos","Blogs e Conteúdo","Estúdios e Agências","Pessoas","Rankings e Listas","Bibliotecas","Termos"];
function compareCats(a,b){
  // Order categories alphabetically by their localized label
  return catLabel(a).localeCompare(catLabel(b),undefined,{sensitivity:'base'});
}

// ── i18n ───────────────────────────────────────────────────────────────────
const I18N={
  pt:{brand:"A Biblioteca de Design",search:"Buscar por nome",allCats:"Todas as categorias",visit:"Acesse",total:"Total",items:"itens",noResults:"Nenhum resultado.",footerLeadPre:"O projeto",projectName:"A Biblioteca de Design",footerLeadPost:"foi idealizada por Julio Cesar Prava e construída com a ajuda de IA. O projeto reúne itens selecionados e revisados por curadores humanos.",bookmarkShare:"Salve esse projeto nos seus favoritos e compartilhe!",thanks:"Obrigado pela visita!",lastUpdate:"Última atualização: Outubro/2026",footernav:'Acesse as bibliotecas de outros temas úteis no <strong class="bverse-strong">BiblioVerse</strong>.',share:"Compartilhar",copied:"Link copiado!",favHelp:"Use Ctrl+D (Windows) ou Cmd+D (Mac) para favoritar esta página.",kbdTitle:"Atalhos de teclado\n/ – Ativa a barra de busca\nT – Alterna cor do tema\nL – Alterna idioma\nB – Abre o menu do BiblioVerse\n\n★ – Destaque"},
  en:{brand:"The Design Library",search:"Search by name",allCats:"All categories",visit:"Visit",total:"Total",items:"items",noResults:"No results.",footerLeadPre:"The project",projectName:"The Design Library",footerLeadPost:"was conceived by Julio Cesar Prava and built with the help of AI. The project showcases items selected and reviewed by human curators.",bookmarkShare:"Bookmark this project and share it!",thanks:"Thanks for visiting!",lastUpdate:"Last update: October/2026",footernav:'Access libraries on other useful topics at <strong class="bverse-strong">BiblioVerse</strong>.',share:"Share",copied:"Link copied!",favHelp:"Use Ctrl+D (Windows) or Cmd+D (Mac) to bookmark this page.",kbdTitle:"Keyboard shortcuts\n/ – Focus search\nT – Toggle theme\nL – Toggle language\nB – Open the BiblioVerse menu\n\n★ – Featured"}
};

function setLang(lang){
  const dict=I18N[lang]||I18N.pt;
  try{localStorage.setItem('libia-lang',lang);}catch(e){}
  document.querySelectorAll('.i18n-brand').forEach(el=>el.textContent=dict.brand);
  const srch=document.getElementById('search');if(srch)srch.placeholder=dict.search;
  const sel=document.getElementById('categoryFilter');if(sel&&sel.options.length)sel.options[0].textContent=dict.allCats;
  const totalEl=document.querySelector('.i18n-total');if(totalEl)totalEl.textContent=dict.total;
  const itemsEl=document.querySelector('.i18n-items');if(itemsEl)itemsEl.textContent=dict.items;
  const leadPre=document.querySelector('.i18n-footer-lead-pre');if(leadPre)leadPre.textContent=dict.footerLeadPre;
  const proj=document.querySelector('.i18n-project-name');if(proj)proj.textContent=dict.projectName;
  const leadPost=document.querySelector('.i18n-footer-lead-post');if(leadPost)leadPost.textContent=dict.footerLeadPost;
  const fNote=document.querySelector('.i18n-bookmarkShare');if(fNote)fNote.textContent=dict.bookmarkShare;
  const fNav=document.querySelector('.i18n-footernav');if(fNav)fNav.innerHTML=dict.footernav;
  const lastUp=document.querySelector('.i18n-lastupdate');if(lastUp)lastUp.textContent=dict.lastUpdate;
  const fThanks=document.querySelector('.i18n-thanks');if(fThanks)fThanks.textContent=dict.thanks;
  const shareBtn=document.getElementById('shareBtn');if(shareBtn){const s=shareBtn.querySelector('.i18n-share');if(s)s.textContent=dict.share;}
  const tip=document.getElementById('infoTip');if(tip)tip.textContent=dict.kbdTitle;
  // Update single subcategory nav hint block
  const hintEl=document.getElementById('subcatNavHint');
  if(hintEl){
    hintEl.textContent=lang==='en'
      ? '← To navigate subcategories, open the left sidebar. Click the title of a subcategory below to explore it. ↓'
      : '← Para navegar pelas subcategorias, abra o menu lateral esquerdo. Clique no título de uma subcategoria abaixo para explorá-la. ↓';
  }
  document.documentElement.setAttribute('lang',lang==='en'?'en':'pt-BR');
  const langBtn=document.getElementById('langToggle');if(langBtn)langBtn.textContent=lang==='en'?'🇧🇷':'🇦🇺';
  const themeBtn=document.getElementById('themeToggle');if(themeBtn)themeBtn.setAttribute('aria-label',lang==='en'?'Toggle theme':'Alternar tema');
  const catSel2=document.getElementById('categoryFilter');if(catSel2)catSel2.setAttribute('title',lang==='en'?'Filter by category':'Filtrar por categoria');
}

// ── Favicons ───────────────────────────────────────────────────────────────
const FAVICON_CACHE=new Map();
function domainFromUrl(url){if(!url)return'';try{return new URL(url).hostname;}catch(e){try{return new URL('https://'+url).hostname;}catch(e2){return'';}}}
function faviconUrlFor(host,provider){if(!host)return'';switch(provider){case'google':return'https://www.google.com/s2/favicons?domain='+encodeURIComponent(host)+'&sz=64';case'clearbit':return'https://icons.duckduckgo.com/ip3/'+host+'.ico';case'direct':return'https://'+host+'/favicon.ico';default:return'';}}
function isLowResFavicon(img){try{const w=img.naturalWidth||0,h=img.naturalHeight||0;return(w<=16||h<=16);}catch(e){return false;}}
function createFaviconEl(url,name){
  const span=document.createElement('span');span.className='favicon';
  const host=domainFromUrl(url);
  if(!host){span.classList.add('fallback');span.textContent=(name||'?').trim().charAt(0).toUpperCase()||'?';return span;}
  const img=document.createElement('img');img.alt='';img.referrerPolicy='no-referrer';img.decoding='async';img.loading='lazy';
  const providers=['google','clearbit','direct'];let step=0;
  if(FAVICON_CACHE.has(host)){const c=FAVICON_CACHE.get(host);const idx=providers.indexOf(c);if(idx>0){providers.splice(idx,1);providers.unshift(c);}}
  function tryNext(){if(step>=providers.length){span.classList.add('fallback');span.textContent=(name||'?').trim().charAt(0).toUpperCase()||'?';if(img.parentNode)img.remove();return;}const p=providers[step++];img.dataset.provider=p;img.src=faviconUrlFor(host,p);}
  img.addEventListener('error',()=>tryNext());
  img.addEventListener('load',()=>{if(isLowResFavicon(img)&&img.dataset.provider!=='direct'){tryNext();return;}FAVICON_CACHE.set(host,img.dataset.provider||'google');});
  span.appendChild(img);tryNext();return span;
}

// ── Card ───────────────────────────────────────────────────────────────────
function createCard(item){
  const d=document.createElement('a');d.className='card card-link';d.href=item.url||'#';
  if(item.url){d.target='_blank';d.rel='noopener noreferrer';d.setAttribute('aria-label',item.name+' — abrir site');}
  else{d.setAttribute('aria-disabled','true');d.addEventListener('click',e=>e.preventDefault());}
  const parsed=parseCompanyItem(item.name);
  const title=document.createElement('p');title.className='title-line';
  (window.requestIdleCallback||window.requestAnimationFrame)(()=>{try{const ico=createFaviconEl(item.url,parsed.item);title.insertBefore(ico,title.firstChild);}catch(e){}});
  // Name; a trailing "(...)" goes to its own line so long names don't get truncated
  const nameEl=document.createElement('span');nameEl.className='name';
  const m=parsed.item.match(/^(.*?)\s*(\(.*\))\s*$/);
  if(m&&m[1]){nameEl.appendChild(document.createTextNode(m[1].trim()));const par=document.createElement('span');par.className='paren';par.textContent=m[2];nameEl.appendChild(par);}
  else{nameEl.textContent=parsed.item;}
  title.appendChild(nameEl);
  if(isFeatured(item)){const s=document.createElement('span');s.className='featured-star';s.title=getLang()==='en'?'Featured':'Destaque';s.textContent='★';title.appendChild(s);}
  if(isEnded(item)){const s=document.createElement('span');s.className='featured-star ended-badge';s.title=getLang()==='en'?'Ended':'Encerrado';s.textContent='🪦';title.appendChild(s);}
  // Featured + ended: star sits left of the tombstone and the text keeps clear of both
  const starEl=title.querySelector('.featured-star:not(.ended-badge)'),endedEl=title.querySelector('.ended-badge');
  if(starEl&&endedEl){endedEl.style.right='0px';starEl.style.right='30px';title.style.paddingRight='56px';}
  d.appendChild(title);
  if(parsed.company){const sub=document.createElement('p');sub.className='subtitle';sub.textContent=parsed.company;d.appendChild(sub);}
  return d;
}

// ── Category section with subcategory groups + collapse toggle ─────────────
function buildCategory(name,items){
  const sec=document.createElement('section');
  sec.className='category';
  sec.id=catSlugFor(name);

  const h2=document.createElement('h2');

  // Icon
  const ico=document.createElement('span');ico.className='cat-ico';ico.textContent=catIcon(name);ico.setAttribute('aria-hidden','true');
  h2.appendChild(ico);

  // Title
  const titleSpan=document.createElement('span');titleSpan.className='cat-title';titleSpan.textContent=catLabel(name);
  h2.appendChild(titleSpan);

  // Anchor link
  const anchor=document.createElement('a');anchor.className='cat-anchor';anchor.href='#'+catSlugFor(name);
  anchor.setAttribute('aria-label',getLang()==='en'?'Copy link to category':'Copiar link da categoria');
  anchor.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.59 13.41a1 1 0 0 0 1.41 1.41l4.24-4.24a3 3 0 0 0-4.24-4.24l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-4.24 4.24Zm2.82-2.82a1 1 0 0 0-1.41-1.41L7.35 13.4a3 3 0 1 0 4.24 4.24l1.06-1.06a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41l4.24-4.24Z"/></svg>`;
  anchor.addEventListener('click',async e=>{
    e.preventDefault();const id=catSlugFor(name);
    if(history.replaceState)history.replaceState(null,'','#'+id);else location.hash=id;
    const s=document.getElementById(id);if(s)smoothScrollToId(s.id);
    try{await navigator.clipboard.writeText(location.origin+location.pathname+'#'+id);showToast(getLang()==='en'?I18N.en.copied:I18N.pt.copied);}catch(err){}
  });
  h2.appendChild(anchor);

  sec.appendChild(h2);

  // Subcategory groups
  const subGroups=groupBy(items,'subcategory');
  const namedSubs=Object.keys(subGroups).filter(s=>s&&s.trim()).sort((a,b)=>subcatLabel(a).localeCompare(subcatLabel(b),undefined,{sensitivity:'base'}));

  // Items with empty/no subcategory (e.g. Termos) - rendered as flat grid
  const flatItems=subGroups['']||subGroups[undefined]||[];
  if(flatItems.length){
    const flatGrid=document.createElement('div');flatGrid.className='grid';
    sortFeaturedAlpha(flatItems).forEach((it,i)=>{const c=createCard(it);c.style.animationDelay=(i*15)+'ms';flatGrid.appendChild(c);});
    sec.appendChild(flatGrid);
  }

  // Named subcategories with individual +/- collapse toggles
  namedSubs.forEach(sub=>{
    const subSec=document.createElement('div');subSec.className='subcategory';subSec.id=subcatSlugFor(name,sub);

    const h3=document.createElement('h3');h3.className='subcat-h3';
    h3.setAttribute('role','button');h3.setAttribute('tabindex','0');
    const subIco=document.createElement('span');subIco.className='cat-ico';subIco.style.fontSize='13px';subIco.textContent=subcatIcon(sub);subIco.setAttribute('aria-hidden','true');
    const subLbl=document.createElement('span');subLbl.className='subcat-lbl-text';subLbl.textContent=' '+subcatLabel(sub);
    const subBtn=document.createElement('span');subBtn.className='subcat-inline-toggle';subBtn.setAttribute('aria-hidden','true');
    subBtn.textContent='+';
    subSec.classList.add('is-collapsed');
    const doSubToggle=()=>{
      const collapsed=subSec.classList.toggle('is-collapsed');
      subBtn.textContent=collapsed?'+':'−';
      h3.setAttribute('aria-expanded',collapsed?'false':'true');
      if(!collapsed){if(history.replaceState)history.replaceState(null,'','#'+subSec.id);else location.hash=subSec.id;}
    };
    h3.addEventListener('click',doSubToggle);
    h3.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();doSubToggle();}});
    h3.setAttribute('aria-expanded','false');
    h3.appendChild(subIco);h3.appendChild(subLbl);h3.appendChild(subBtn);
    subSec.appendChild(h3);

    const grid=document.createElement('div');grid.className='grid';
    sortFeaturedAlpha(subGroups[sub]).forEach((it,i)=>{const c=createCard(it);c.style.animationDelay=(i*15)+'ms';grid.appendChild(c);});
    subSec.appendChild(grid);sec.appendChild(subSec);
  });

  const sep=document.createElement('div');sep.className='category-sep';sec.appendChild(sep);
  return sec;
}


function populateSelect(cats){
  const sel=document.querySelector('#categoryFilter');
  while(sel.firstChild)sel.removeChild(sel.firstChild);
  const all=document.createElement('option');all.value='all';all.textContent=getLang()==='en'?I18N.en.allCats:I18N.pt.allCats;sel.appendChild(all);
  Object.keys(cats).sort(compareCats).forEach(cat=>{const op=document.createElement('option');op.value=catSlugFor(cat);op.textContent=catLabel(cat);sel.appendChild(op);});
}

// ── Filters ────────────────────────────────────────────────────────────────
function applyFilters(data){
  const q=document.getElementById('search').value.trim().toLowerCase();
  const catSlug=document.getElementById('categoryFilter').value;
  const root=document.getElementById('root');
  const filtered=data.filter(item=>{
    const hay=(item.name+' '+(item.category||'')+' '+(item.subcategory||'')).toLowerCase();
    return(q===''||hay.includes(q))&&(catSlug==='all'||catSlugFor(item.category)===catSlug);
  });
  const cats=groupBy(filtered,'category');
  const names=Object.keys(cats).sort(compareCats);
  const countEl=document.getElementById('count');if(countEl)countEl.textContent=filtered.length;
  if(names.length===0){const p=document.createElement('p');p.className='no-results';p.textContent=getLang()==='en'?I18N.en.noResults:I18N.pt.noResults;root.replaceChildren(p);return;}
  const frag=document.createDocumentFragment();
  names.forEach(n=>frag.appendChild(buildCategory(n,cats[n])));
  root.replaceChildren(frag);
  const sk=document.getElementById('skeleton');if(sk&&sk.parentElement===root)try{sk.remove();}catch(e){}
}

// ── Theme ──────────────────────────────────────────────────────────────────
function setTheme(theme){
  document.documentElement.setAttribute('data-theme',theme);
  try{localStorage.setItem('libia-theme',theme);}catch(e){}
  const btn=document.getElementById('themeToggle');if(btn)btn.textContent=theme==='light'?'🌙':'☀️';
}
function initTheme(){
  let theme='dark';
  try{const s=localStorage.getItem('libia-theme');if(s==='light'||s==='dark')theme=s;else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)theme='light';}catch(e){}
  setTheme(theme);
}

// ── Utilities ──────────────────────────────────────────────────────────────
function ensureToastContainer(){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}return t;}
function showToast(msg){const t=ensureToastContainer();t.textContent=msg;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600);}
function getHeaderOffset(){const h=document.querySelector('.site-header');const bar=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bvbar-h'))||44;return bar+(h?h.offsetHeight:0)+12;}
function smoothScrollToId(id){const el=document.getElementById(id);if(!el)return;const y=window.scrollY+el.getBoundingClientRect().top-getHeaderOffset();requestAnimationFrame(()=>window.scrollTo({top:Math.max(0,y),behavior:'smooth'}));}
// Scroll to subcategory with extra offset so h3 title is fully visible (not hidden behind header)
function smoothScrollToSubcat(id){
  const el=document.getElementById(id);
  if(!el)return;
  const hdrOffset=getHeaderOffset();
  // Include the subcategory's top margin (12px) so the title isn't clipped
  const extraPad=24;
  const y=window.scrollY+el.getBoundingClientRect().top-hdrOffset-extraPad;
  requestAnimationFrame(()=>window.scrollTo({top:Math.max(0,y),behavior:'smooth'}));
}
function ensureTopButton(){let b=document.getElementById('toTopBtn');if(!b){b=document.createElement('button');b.id='toTopBtn';b.setAttribute('title',getLang()==='en'?'Back to top':'Voltar ao topo');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-7 7h4v9h6v-9h4z"/></svg>`;document.body.appendChild(b);b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}return b;}
function updateDocTitleAndMeta(){const lang=getLang();const name=lang==='en'?'BiblioVerse — The Design Library':'BiblioVerse — A Biblioteca de Design';const desc=lang==='en'?'Searchable catalog of the best design resources by category':'Catálogo pesquisável dos melhores recursos de design por categoria';document.title=name+' — '+desc;const meta=document.querySelector('meta[name="description"]');if(meta)meta.setAttribute('content',desc);}
function setupShare(){const btn=document.getElementById('shareBtn');if(!btn)return;btn.addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:document.title,url:location.href});return;}catch(e){}}try{await navigator.clipboard.writeText(location.href);alert(getLang()==='en'?I18N.en.copied:I18N.pt.copied);}catch(e){}});}
function setupFavorite(){const btn=document.getElementById('favBtn');if(!btn)return;btn.addEventListener('click',()=>{if(window.external&&'AddFavorite'in window.external){try{window.external.AddFavorite(location.href,document.title);return;}catch(e){}}alert(getLang()==='en'?I18N.en.favHelp:I18N.pt.favHelp);});}
function setupInfo(){const btn=document.getElementById('infoBtn'),tip=document.getElementById('infoTip');if(!btn||!tip)return;tip.textContent=getLang()==='en'?I18N.en.kbdTitle:I18N.pt.kbdTitle;const show=()=>tip.setAttribute('aria-hidden','false'),hide=()=>tip.setAttribute('aria-hidden','true');btn.addEventListener('mouseenter',show);btn.addEventListener('focus',show);btn.addEventListener('mouseleave',hide);btn.addEventListener('blur',hide);}

// Hash may point to a category (#cat) or a subcategory (#cat--sub)
function openHash(data,h){
  const sel=document.getElementById('categoryFilter');
  const catId=h.split('--')[0];
  if(![...sel.options].some(o=>o.value===catId))return false;
  if(sel.value!==catId){sel.value=catId;applyFilters(data);}
  if(h!==catId){
    const sub=document.getElementById(h);
    if(sub){sub.classList.remove('is-collapsed');const b=sub.querySelector('.subcat-inline-toggle');if(b)b.textContent='−';const h3=sub.querySelector('h3');if(h3)h3.setAttribute('aria-expanded','true');smoothScrollToSubcat(h);}
  }else{const s=document.getElementById(catId);if(s)smoothScrollToId(catId);}
  scrollSidebarToId(catId);
  return true;
}

// ── Sidebar scroll helper ──────────────────────────────────────────────────
function scrollSidebarToId(idOrAll){
  try{
    const sideScroll=document.getElementById('sideScroll'),menu=document.getElementById('sideMenu');if(!sideScroll||!menu)return;
    const sel=idOrAll&&idOrAll!=='all'?`#sideMenu a[href="#${idOrAll}"]`:'#sideMenu a[href="#"]';
    const link=document.querySelector(sel);if(!link)return;
    const item=link.closest('li')||link;
    menu.querySelectorAll('.sidepush-item.active,.sidepush-subitem.active').forEach(el=>el.classList.remove('active'));
    link.classList.add('active');
    const offsetTop=item.offsetTop-8,itemBottom=offsetTop+item.offsetHeight;
    const viewTop=sideScroll.scrollTop,viewBottom=viewTop+sideScroll.clientHeight;
    if(offsetTop<viewTop||itemBottom>viewBottom){const t=offsetTop-Math.max(0,(sideScroll.clientHeight-item.offsetHeight)/2);requestAnimationFrame(()=>sideScroll.scrollTo({top:Math.max(0,t),behavior:'smooth'}));}
  }catch(e){}
}

// ── Main init ──────────────────────────────────────────────────────────────
(function init(){
  initTheme();
  const savedLang=getLang();setLang(savedLang);
  let data=[];
  const preload=document.getElementById('preloaded-data');
  if(preload&&preload.textContent.trim())try{data=JSON.parse(preload.textContent);}catch(e){}
  window.__allData=data;
  document.getElementById('count').textContent=data.length;
  const cats=groupBy(data,'category');populateSelect(cats);
  const sel=document.getElementById('categoryFilter');
  const initialHash=(location.hash||'').replace(/^#/,'');
  sel.value='all';applyFilters(data);
  ensureToastContainer();
  const toTop=ensureTopButton();
  updateDocTitleAndMeta();
  // Initialize the single nav hint block
  const hintEl=document.getElementById('subcatNavHint');
  if(hintEl)hintEl.textContent=getLang()==='en'
    ?'← To navigate subcategories, open the left sidebar. Click the title of a subcategory below to explore it. ↓'
    :'← Para navegar pelas subcategorias, abra o menu lateral esquerdo. Clique no título de uma subcategoria abaixo para explorá-la. ↓';
  window.scrollTo({top:0,behavior:'smooth'});
  window.addEventListener('scroll',()=>{const y=window.scrollY||document.documentElement.scrollTop;toTop.classList.toggle('show',y>200);});
  if(initialHash)setTimeout(()=>openHash(data,initialHash),0);
  document.getElementById('search').addEventListener('input',()=>applyFilters(data));
  sel.addEventListener('change',()=>{
    const v=sel.value;applyFilters(data);
    if(v==='all'){if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);else location.hash='';window.scrollTo({top:0,behavior:'smooth'});scrollSidebarToId('all');}
    else{const h='#'+v;if(h!==location.hash){if(history.replaceState)history.replaceState(null,'',h);else location.hash=h;}const s=document.getElementById(v);if(s)smoothScrollToId(s.id);scrollSidebarToId(v);}
  });
  document.getElementById('themeToggle').addEventListener('click',()=>{const now=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';setTheme(now);});
  const langBtn=document.getElementById('langToggle');
  function switchLang(){const next=getLang()==='en'?'pt':'en';setLang(next);const c2=groupBy(data,'category');populateSelect(c2);sel.value='all';applyFilters(data);if(window.__rebuildSideMenu)window.__rebuildSideMenu();if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);else location.hash='';updateDocTitleAndMeta();window.scrollTo({top:0,behavior:'smooth'});}
  if(langBtn){langBtn.textContent=getLang()==='en'?'🇧🇷':'🇦🇺';langBtn.addEventListener('click',switchLang);}
  window.addEventListener('hashchange',()=>{const h=decodeURIComponent((location.hash||'').replace(/^#/,''));if(h)openHash(data,h);if(!h&&sel.value!=='all'){sel.value='all';applyFilters(data);window.scrollTo({top:0,behavior:'smooth'});scrollSidebarToId('all');}});
  setupShare();setupFavorite();setupInfo();
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey)return; // leave browser shortcuts (Ctrl+L, Ctrl+T...) alone
    const inField=e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
    if(e.key==='/'&&!inField){e.preventDefault();document.querySelector('#search').focus();}
    if(!inField&&e.key&&e.key.toLowerCase()==='t'){e.preventDefault();const now=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';setTheme(now);}
    if(!inField&&e.key&&e.key.toLowerCase()==='l'){e.preventDefault();switchLang();}
  });
})();

// ── Sidebar (push + overlay) ───────────────────────────────────────────────
(function(){
  function slugify(s){return(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

  // Which PT category key maps to this slug?
  function ptKeyForSlug(id){
    for(const k of Object.keys(CAT_ICON)){if(slugify(k)===id)return k;}
    for(const k of Object.keys(CAT_I18N)){if(slugify((CAT_I18N[k]||'').replace(/&/g,'and'))===id)return k;}
    return null;
  }

  var openCatId=null;

  function collectSubcategories(catId){
    // Use raw data (always available, regardless of DOM state)
    const data=window.__allData||[];
    const seenLabels=new Set();
    const subs=[];
    data.forEach(item=>{
      const itemCatId=catSlugFor(item.category);
      if(itemCatId!==catId)return;
      if(!item.subcategory||!item.subcategory.trim())return;
      const subId=subcatSlugFor(item.category,item.subcategory);
      if(seenLabels.has(subId))return;
      seenLabels.add(subId);
      subs.push({id:subId,label:subcatLabel(item.subcategory)});
    });
    subs.sort((a,b)=>a.label.localeCompare(b.label,undefined,{sensitivity:'base'}));
    return subs;
  }

  function collectCategories(){
    const sel=document.getElementById('categoryFilter');if(!sel||!sel.options)return[];
    const arr=[];
    for(let i=0;i<sel.options.length;i++){const op=sel.options[i];if(!op||op.value==='all')continue;arr.push({id:op.value,label:op.textContent.trim()});}
    arr.sort((a,b)=>a.label.localeCompare(b.label,undefined,{sensitivity:'base'}));
    return arr;
  }

  function buildSideMenu(){
    const ul=document.getElementById('sideMenu');if(!ul)return;
    ul.innerHTML='';
    const cats=collectCategories();
    const hash=(location.hash||'').replace('#','');

    // Helper: make a uniform row wrapper (always used, even for Home & Terms)
    function makeRow(iconEmoji,label,href,isActive,hasSubs,isExpanded,onNavigate,onToggle){
      const li=document.createElement('li');
      const row=document.createElement('div');row.className='sidepush-item-row';

      const a=document.createElement('a');a.href=href||'#';a.className='sidepush-item';
      if(isActive)a.classList.add('active');
      if(hasSubs){
        const toggleIndicator=`<span class="sidepush-expand-icon" aria-hidden="true">${isExpanded?'\u2212':'+'}</span>`;
        a.innerHTML=`<span class="ico">${iconEmoji}</span><span class="label">${label}</span>${toggleIndicator}`;
      } else {
        a.innerHTML=`<span class="ico">${iconEmoji}</span><span class="label">${label}</span>`;
      }
      a.addEventListener('click',ev=>{ev.preventDefault();onNavigate(a,row);});
      row.appendChild(a);

      li.appendChild(row);
      return li;
    }

    // Home item
    const homeLi=makeRow('🏠',getLang()==='en'?I18N.en.allCats:I18N.pt.allCats,'#',!hash,false,false,(a)=>{
      document.body.classList.add('side-open');updateMenuToggleUi();
      ul.querySelectorAll('.sidepush-item.active,.sidepush-subitem.active').forEach(el=>el.classList.remove('active'));
      a.classList.add('active');openCatId=null;
      const sel=document.getElementById('categoryFilter');if(sel){sel.value='all';sel.dispatchEvent(new Event('change'));}
      if(window.innerWidth<900)document.body.classList.remove('side-open');
      setTimeout(buildSideMenu,60);
    },null);
    ul.appendChild(homeLi);

    cats.forEach(c=>{
      const ptKey=ptKeyForSlug(c.id);
      const iconEmoji=ptKey?catIcon(ptKey):'📦';
      const subs=collectSubcategories(c.id);
      const hasSubs=subs.length>0;
      const isExpanded=openCatId===c.id;
      const isActive=hash===c.id||(hash&&hash.startsWith(c.id+'--'));

      const catLi=makeRow(iconEmoji,c.label,'#'+c.id,isActive,hasSubs,isExpanded,
        (a)=>{
          document.body.classList.add('side-open');updateMenuToggleUi();
          ul.querySelectorAll('.sidepush-item.active,.sidepush-subitem.active').forEach(el=>el.classList.remove('active'));
          a.classList.add('active');
          if(history.replaceState)history.replaceState(null,'','#'+c.id);else location.hash=c.id;
          const sel=document.getElementById('categoryFilter');if(sel){sel.value=c.id;sel.dispatchEvent(new Event('change'));}
          // Scroll to top so the instruction hint is visible
          window.scrollTo({top:0,behavior:'smooth'});
          // Toggle expand/collapse when clicking category name (if has subcategories)
          if(hasSubs){
            const opening=openCatId!==c.id;
            openCatId=opening?c.id:null;
            setTimeout(buildSideMenu,80);
          } else {
            if(window.innerWidth<900)document.body.classList.remove('side-open');
          }
        },
        ()=>{
          const opening=openCatId!==c.id;
          openCatId=opening?c.id:null;
          if(opening){document.body.classList.add('side-open');updateMenuToggleUi();}
          setTimeout(buildSideMenu,40);
        }
      );
      ul.appendChild(catLi);

      if(isExpanded){
        subs.forEach(sub=>{
          const sli=document.createElement('li');
          sli.className='sidepush-subcat-li';
          const sa=document.createElement('a');sa.href='#'+sub.id;sa.className='sidepush-subitem';
          sa.innerHTML=`<span class="label">${sub.label}</span>`;
          if(hash===sub.id)sa.classList.add('active');
          sa.addEventListener('click',ev=>{
            ev.preventDefault();
            ul.querySelectorAll('.sidepush-subitem.active').forEach(el=>el.classList.remove('active'));
            sa.classList.add('active');
            if(history.replaceState)history.replaceState(null,'','#'+sub.id);else location.hash=sub.id;
            // Ensure the category filter shows this category
            const catFilter=document.getElementById('categoryFilter');
            if(catFilter&&catFilter.value!==c.id){catFilter.value=c.id;catFilter.dispatchEvent(new Event('change'));}
            // After DOM updates, expand subcategory and scroll to it
            setTimeout(()=>{
              const subSec=document.getElementById(sub.id);
              if(subSec){
                subSec.classList.remove('is-collapsed');
                const btn=subSec.querySelector('.subcat-inline-toggle');
                const h3=subSec.querySelector('h3');
                if(btn)btn.textContent='\u2212';
                if(h3)h3.setAttribute('aria-expanded','true');
              }
              if(typeof smoothScrollToSubcat==='function')smoothScrollToSubcat(sub.id);
            },80);
            if(window.innerWidth<900)document.body.classList.remove('side-open');
          });
          sli.appendChild(sa);ul.appendChild(sli);
        });
      }
    });
  }

  function initToggle(){
    const btn=document.getElementById('menuToggle');if(!btn)return;
    updateMenuToggleUi();
    btn.addEventListener('click',()=>{document.body.classList.toggle('side-open');setTimeout(buildSideMenu,10);updateMenuToggleUi();});
  }

  window.addEventListener('hashchange',()=>{
    const hash=(location.hash||'').replace('#','');
    document.querySelectorAll('.sidepush-item,.sidepush-subitem').forEach(a=>{
      const href=a.getAttribute('href')||'';const id=href.startsWith('#')?href.slice(1):href;
      a.classList.toggle('active',id===hash);
    });
    if(!hash){const home=document.querySelector('.sidepush-item[href="#"]');if(home){document.querySelectorAll('.sidepush-item,.sidepush-subitem').forEach(a=>a.classList.remove('active'));home.classList.add('active');}}
  });

  document.addEventListener('DOMContentLoaded',()=>{initToggle();setTimeout(()=>{buildSideMenu();updateMenuToggleUi();},80);});
  window.__rebuildSideMenu=buildSideMenu;
})();

if(typeof updateMenuToggleUi==='function')window.addEventListener('resize',updateMenuToggleUi);

// Mobile overlay/scrim
(function(){
  const isOverlay=()=>window.matchMedia('(max-width: 768px), (max-width: 1024px) and (orientation: portrait)').matches;
  let scrim=document.querySelector('.side-scrim');
  if(!scrim){scrim=document.createElement('div');scrim.className='side-scrim';document.body.appendChild(scrim);}
  scrim.addEventListener('click',()=>document.body.classList.remove('side-open'),{passive:true});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('side-open');});
  const syncLock=()=>{document.body.style.overflow=document.body.classList.contains('side-open')&&isOverlay()?'hidden':'';};
  window.addEventListener('resize',syncLock);syncLock();
})();

window.addEventListener('load',()=>{try{document.getElementById('root').classList.add('hydrated');}catch(e){}});
