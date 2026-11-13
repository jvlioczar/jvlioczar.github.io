"""Gera llms.txt, llms-full.txt, robots.txt, sitemap.xml e os dados estruturados (JSON-LD)
do hub e das 23 bibliotecas da BiblioVerse.

Rodar da raiz do repositório depois de mudar o conteúdo de qualquer biblioteca ou os cards do hub:

    python _tools/seo.py

O script é idempotente: os blocos que ele injeta no <head> ficam entre
<!-- seo:start --> e <!-- seo:end --> e são substituídos a cada execução.
A pasta começa com "_" para o Jekyll do GitHub Pages não publicá-la.
"""
import html as H
import json
import os
import re
import subprocess
import sys
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SITE = 'https://biblioverse.org'
RE_DATA = re.compile(r'<script id="preloaded-data" type="application/json">(.*?)</script>', re.S)
RE_BLOCK = re.compile(r'\n?<!-- seo:start -->.*?<!-- seo:end -->', re.S)
RE_OLD_LD = re.compile(r'\n?<script type="application/ld\+json">.*?</script>', re.S)

ORG = {
    '@type': 'Organization',
    '@id': f'{SITE}/#org',
    'name': 'BiblioVerse',
    'url': f'{SITE}/',
    'logo': f'{SITE}/images/logo.png',
    'sameAs': ['https://www.linkedin.com/company/biblioverse.org'],
}
WEBSITE_REF = {'@id': f'{SITE}/#website'}


def read(path):
    with open(path, encoding='utf-8', newline='') as f:
        return f.read()


def write(path, text):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(text)


def strip(s):
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()


def last_modified(path):
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', path], capture_output=True,
                             text=True, check=True).stdout.strip()
        return out or None
    except Exception:
        return None


def meta(h, name):
    m = re.search(r'<meta[^>]*name="' + name + r'"[^>]*>', h)
    if not m:
        return ''
    c = re.search(r'content="([^"]*)"', m.group(0))
    return H.unescape(c.group(1)).strip() if c else ''


def brand(script, nth):
    names = re.findall(r'brand:\s*"([^"]+)"', script)
    return names[nth] if len(names) > nth else ''


def ld_script(graph):
    body = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False,
                      separators=(',', ':'))
    return '<script type="application/ld+json">' + body.replace('</', '<\\/') + '</script>'


def inject(h, block):
    h = RE_BLOCK.sub('', h)
    h = RE_OLD_LD.sub('', h)
    i = h.index('</head>')
    return h[:i].rstrip('\n') + '\n<!-- seo:start -->\n' + block + '\n<!-- seo:end -->\n' + h[i:]


# ---------------------------------------------------------------- bibliotecas
libraries = []
for slug in sorted(os.listdir('.')):
    page = os.path.join(slug, 'index.html')
    if slug.startswith(('.', '_')) or not os.path.isfile(page):
        continue
    h = read(page)
    m = RE_DATA.search(h)
    if not m:
        continue
    items = json.loads(m.group(1))
    script = read(os.path.join(slug, 'script.js')) if os.path.isfile(os.path.join(slug, 'script.js')) else ''
    name_pt = brand(script, 0) or strip(re.search(r'class="[^"]*i18n-brand[^"]*">(.*?)<', h).group(1))
    libraries.append({
        'slug': slug,
        'url': f'{SITE}/{slug}/',
        'name': name_pt,
        'name_en': brand(script, 1),
        'description': meta(h, 'description'),
        'items': items,
        'modified': last_modified(page),
    })

# ---------------------------------------------------------------- hub: grupos e cards
hub = read('index.html')
groups = []
for part in re.split(r'(?=<h3 class="lib-group-title")', hub)[1:]:
    title = strip(re.match(r'<h3[^>]*>(.*?)</h3>', part, re.S).group(1))
    cards = []
    for a in re.finditer(r'<a class="lib-card[^"]*"([^>]*)>(.*?)</a>', part, re.S):
        attrs, body = a.group(1), a.group(2)
        href = re.search(r'href="([^"]+)"', attrs).group(1)
        name = strip(re.search(r'class="lib-name"[^>]*>(.*?)</span>', body, re.S).group(1))
        d = re.search(r'class="lib-desc"[^>]*>(.*?)</span>', body, re.S)
        cards.append({'url': href, 'name': name, 'description': strip(d.group(1)) if d else ''})
    if cards:
        groups.append((title, cards))
lib_urls = {l['url'] for l in libraries}
lib_groups = [(t, c) for t, c in groups if all(x['url'] in lib_urls for x in c)]
special_groups = [(t, c) for t, c in groups if not any(x['url'] in lib_urls for x in c)]
about_p = [strip(m.group(1)) for m in re.finditer(r'data-i18n="section\.about\.p\d"[^>]*>(.*?)</p>', hub, re.S)]

PROJECT_LLMS = {
    'australianculture.biblioverse.org', 'cienciaparainiciantes.biblioverse.org', 'curatedai.biblioverse.org',
    'eticaparainiciantes.biblioverse.org', 'fortheanimals.biblioverse.org', 'pelosanimais.biblioverse.org',
    'politicaparainiciantes.biblioverse.org', 'questaodeetica.biblioverse.org',
}


def project_link(url):
    host = re.sub(r'^https?://', '', url).strip('/')
    return f'https://{host}/llms.txt' if host in PROJECT_LLMS else url

# ---------------------------------------------------------------- llms.txt por biblioteca
def library_md(lib):
    lines = [f"# {lib['name']}", '']
    lines.append(f"> {lib['description']}")
    lines.append('')
    en = f" ({lib['name_en']})" if lib['name_en'] else ''
    lines.append(f"Biblioteca temática da BiblioVerse{en}, com curadoria humana. "
                 f"Página: {lib['url']} · {len(lib['items'])} itens"
                 + (f" · atualizada em {lib['modified']}" if lib['modified'] else '') + '.')
    legend = ['★ destaque da curadoria']
    if any(it.get('ended') for it in lib['items']):
        legend.append('🪦 pessoa falecida, banda desfeita ou serviço encerrado')
    lines.append('Legenda: ' + ' · '.join(legend) + '.')
    tree = OrderedDict()
    for it in lib['items']:
        tree.setdefault(it.get('category') or 'Outros', OrderedDict()).setdefault(it.get('subcategory') or '', []).append(it)
    for cat, subs in tree.items():
        lines += ['', f'## {cat}']
        for sub, its in subs.items():
            if sub:
                lines += ['', f'### {sub}']
            lines.append('')
            for it in its:
                name = strip(it['name']).replace('[', '(').replace(']', ')')
                extra = []
                if it.get('name_en') and it['name_en'] != it['name']:
                    extra.append(f"EN: {strip(it['name_en'])}")
                if it.get('description'):
                    extra.append(strip(it['description']))
                tail = (': ' + '; '.join(extra)) if extra else ''
                flags = (' ★' if it.get('featured') else '') + (' 🪦' if it.get('ended') else '')
                lines.append(f"- [{name}]({it['url']}){flags}{tail}")
    return '\n'.join(lines) + '\n'


library_files = {}
for lib in libraries:
    md = library_md(lib)
    library_files[lib['slug']] = md
    write(os.path.join(lib['slug'], 'llms.txt'), md)

# ---------------------------------------------------------------- llms.txt raiz
total_items = sum(len(l['items']) for l in libraries)
by_url = {l['url']: l for l in libraries}
root = ['# BiblioVerse', '',
        '> A biblioteca de tudo. Bibliotecas temáticas com curadoria humana, com os melhores sites, apps e '
        'referências de cada área, e projetos especiais que exploram um só tema em profundidade. '
        'Gratuito, sem anúncios e de código aberto.', '']
for p in about_p:
    root += [p, '']
total_fmt = f'{total_items:,}'.replace(',', '.')
root += [f'O site é em português do Brasil, com versão em inglês em todas as páginas. São {len(libraries)} bibliotecas '
         f'com {total_fmt} links no total. Cada link de biblioteca abaixo aponta para um '
         'llms.txt com o catálogo completo daquela biblioteca, organizado por categoria. '
         f'O arquivo {SITE}/llms-full.txt junta todos os catálogos em um só.']
for title, cards in lib_groups:
    root += ['', f'## Bibliotecas: {title}', '']
    for c in cards:
        lib = by_url[c['url']]
        root.append(f"- [{c['name']}]({c['url']}llms.txt): {c['description']} ({len(lib['items'])} itens)")
for title, cards in special_groups:
    root += ['', f'## Projetos especiais: {title}', '']
    for c in cards:
        root.append(f"- [{c['name']}]({project_link(c['url'])}): {c['description']}")
root += ['', '## Optional', '',
         f'- [Catálogo completo de todas as bibliotecas]({SITE}/llms-full.txt): os {len(libraries)} catálogos em um arquivo',
         f'- [Página inicial]({SITE}/): portal com todas as bibliotecas e projetos, e o painel Sobre',
         '- [BiblioVerse no LinkedIn](https://www.linkedin.com/company/biblioverse.org)']
write('llms.txt', '\n'.join(root) + '\n')
write('llms-full.txt', '\n'.join(root) + '\n\n' + '\n\n'.join(library_files[l['slug']] for l in libraries))

# ---------------------------------------------------------------- robots.txt e sitemap.xml
write('robots.txt', '# BiblioVerse: todo o conteúdo pode ser lido e indexado, inclusive por assistentes de IA.\n'
      '# Resumo para modelos de linguagem: https://biblioverse.org/llms.txt\n\n'
      'User-agent: *\nAllow: /\n\n'
      f'Sitemap: {SITE}/sitemap.xml\n')
urls = [(f'{SITE}/', last_modified('index.html'), '1.0')] + [(l['url'], l['modified'], '0.8') for l in libraries]
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, mod, prio in urls:
    sm.append(f'  <url><loc>{loc}</loc>' + (f'<lastmod>{mod}</lastmod>' if mod else '') +
              f'<priority>{prio}</priority></url>')
sm.append('</urlset>')
write('sitemap.xml', '\n'.join(sm) + '\n')

# ---------------------------------------------------------------- JSON-LD do hub
website = {
    '@type': 'WebSite', '@id': f'{SITE}/#website', 'name': 'BiblioVerse',
    'alternateName': ['A Biblioteca de Tudo', 'The Library of Everything'],
    'url': f'{SITE}/', 'inLanguage': ['pt-BR', 'en'], 'publisher': {'@id': ORG['@id']},
    'description': about_p[0] if about_p else meta(hub, 'description'),
}
founder = re.search(r'class="cur-name">([^<]+)</p><p class="cur-desc" data-i18n="section\.creator\.role"', hub)
org = dict(ORG)
if founder:
    org['founder'] = {'@type': 'Person', 'name': founder.group(1).strip(),
                      'sameAs': re.findall(r'href="(https://www\.(?:linkedin\.com/in|instagram\.com)/[^"]+)"', hub)[:2]}
lib_list = {'@type': 'ItemList', '@id': f'{SITE}/#libraries', 'name': 'Bibliotecas temáticas',
            'numberOfItems': len(libraries),
            'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': c['url'], 'name': c['name']}
                                for i, c in enumerate(c for _, cs in lib_groups for c in cs)]}
specials = [c for _, cs in special_groups for c in cs]
proj_list = {'@type': 'ItemList', '@id': f'{SITE}/#projects', 'name': 'Projetos especiais',
             'numberOfItems': len(specials),
             'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': c['url'], 'name': c['name']}
                                 for i, c in enumerate(specials)]}
home = {'@type': 'CollectionPage', '@id': f'{SITE}/#page', 'url': f'{SITE}/', 'name': 'BiblioVerse — A Biblioteca de Tudo',
        'isPartOf': WEBSITE_REF, 'inLanguage': 'pt-BR', 'about': {'@id': ORG['@id']},
        'hasPart': [{'@id': lib_list['@id']}, {'@id': proj_list['@id']}]}
hub_block = '\n'.join([
    f'<link href="{SITE}/" rel="canonical"/>',
    '<link href="/llms.txt" rel="alternate" title="llms.txt" type="text/plain"/>',
    ld_script([website, org, home, lib_list, proj_list]),
])
write('index.html', inject(hub, hub_block))

# ---------------------------------------------------------------- JSON-LD das bibliotecas
for lib in libraries:
    path = os.path.join(lib['slug'], 'index.html')
    h = read(path)
    featured = [it for it in lib['items'] if it.get('featured')][:60]
    if len(featured) < 10:
        seen, featured = set(), []
        for it in lib['items']:
            key = (it.get('category'), it.get('subcategory'))
            if key not in seen:
                seen.add(key)
                featured.append(it)
        featured = featured[:60]
    cats = list(OrderedDict.fromkeys(it.get('category') for it in lib['items'] if it.get('category')))
    page = {
        '@type': 'CollectionPage', '@id': lib['url'] + '#page', 'url': lib['url'], 'name': lib['name'],
        'alternateName': lib['name_en'] or None, 'description': lib['description'],
        'inLanguage': ['pt-BR', 'en'], 'isPartOf': {'@type': 'WebSite', 'name': 'BiblioVerse', 'url': f'{SITE}/', '@id': WEBSITE_REF['@id']},
        'publisher': {'@type': 'Organization', 'name': 'BiblioVerse', 'url': f'{SITE}/', '@id': ORG['@id']},
        'keywords': ', '.join(cats), 'dateModified': lib['modified'],
        'breadcrumb': {'@id': lib['url'] + '#breadcrumb'}, 'mainEntity': {'@id': lib['url'] + '#list'},
    }
    page = {k: v for k, v in page.items() if v}
    crumbs = {'@type': 'BreadcrumbList', '@id': lib['url'] + '#breadcrumb', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'BiblioVerse', 'item': f'{SITE}/'},
        {'@type': 'ListItem', 'position': 2, 'name': lib['name'], 'item': lib['url']}]}
    lst = {'@type': 'ItemList', '@id': lib['url'] + '#list', 'name': f"Destaques — {lib['name']}",
           'numberOfItems': len(lib['items']),
           'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': strip(it['name']), 'url': it['url']}
                               for i, it in enumerate(featured)]}
    block = '\n'.join([
        f'<link href="{lib["url"]}llms.txt" rel="alternate" title="llms.txt" type="text/plain"/>',
        ld_script([page, crumbs, lst]),
    ])
    write(path, inject(h, block))

print(f'{len(libraries)} bibliotecas, {total_items} itens')
print(f'llms.txt {os.path.getsize("llms.txt")} bytes, llms-full.txt {os.path.getsize("llms-full.txt")} bytes')
print('grupos de bibliotecas:', [t for t, _ in lib_groups])
print('grupos de projetos:', [(t, len(c)) for t, c in special_groups])
