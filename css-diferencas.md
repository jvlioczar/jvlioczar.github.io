# CSS compartilhado das 23 bibliotecas — o que foi comparado, decidido e unificado

Data: 2026-11-07. Resultado: as 23 bibliotecas do hub (`biblioverse.org/<nome>/`)
passaram a usar uma única folha, **`assets/library.css`**, e os 23 `styles.css`
locais foram apagados. Este documento registra as diferenças que existiam entre
eles, o que foi feito com cada uma, como a unificação foi verificada e onde
mexer para alterar todas as bibliotecas de uma vez.

## 1. Ponto de partida: 5 versões do mesmo template

As 23 folhas tinham hashes diferentes, mas depois de normalizar fim de linha
(CRLF → LF) e espaços à direita sobraram quatro versões reais mais duas
variantes:

| Versão | Bibliotecas | Linhas | O que a distingue |
|---|---|---|---|
| **A** (a mais nova) | antiscam, art, job, list, management, photography, print, travel, **web3** | 1550 | menu lateral com subcategorias (`.sidepush-item-row`, `.sidepush-subitem`, `.subcategory`, `.subcat-h3`…) |
| **B** | conspiracy, design, esports, history, philosophy, thinking, truecrime | 1547 | idêntica a A menos duas linhas em branco e um comentário |
| **C** | code, games, music, social | 1324 | versão anterior do menu lateral, sem o bloco de subcategorias |
| ai | ai | 1307 | C sem as regras de `.ended-badge` |
| language | language | 1342 | C mais o seletor de idioma em lista (`.lang-picker`, `.lang-dropdown`, `.lang-option`) |
| data | data | 1372 | C com regras antigas misturadas a remendos manuais e um bloco quebrado |

`web3` constava como variante isolada só porque estava salva com CRLF; o
conteúdo é a versão A byte a byte depois da normalização.

## 2. Diferenças encontradas e o que foi feito com cada uma

### 2.1 A × B — formatação

Duas linhas em branco e o comentário "Sidebar width CSS var default…".
Sem efeito. Unificado.

### 2.2 A × C (e ai, language, data) — o menu lateral antigo

| Diferença em C | O que fazia na prática | Decisão |
|---|---|---|
| `.sidepush-top{ height:56px }` sem `flex:0 0 auto` (A: `37px; flex:0 0 auto`) | Como `.sidepush-top` é item de um flex em coluna e o menu quase sempre transborda, ela encolhia para a altura do botão (36,8px). Nunca media 56px. | Versão A. Medido: em code/ai/data a altura vai de 36,8 para 37px; em language, no desktop, de 39,2 para 37px (o menu desce 2px). |
| `.sidepush-item` sem `min-width:0; flex:1 1 0; transition: background .15s, border-color .15s; box-sizing` | O `box-sizing` já vinha do `*{box-sizing:border-box}`; o `flex` só age dentro de `.sidepush-item-row`, que C não tem. A única mudança real é o hover do item passar a animar em .15s, como nas outras 16. | Versão A. |
| `.sidepush-item .ico` sem `flex-shrink:0` | Sem efeito medido. | Versão A. |
| Bloco `.sidepush{position:fixed…}` repetido mais adiante (sem `box-shadow`) | Duplicata do bloco anterior; não alterava nada. | Removido. |
| `.push-wrap{ margin-left:0 }` antes do `.push-wrap{ margin-left: var(--side-w-closed) }` | Sobrescrito logo depois. | Removido. |
| `section.category{ scroll-margin-top:90px }` antes da versão `calc(var(--bvbar-h) + 90px)` | Sobrescrito logo depois. | Removido. |
| `.sidepush .label` / `body.side-open .sidepush .label` repetidos | Iguais aos de A. | Uma ocorrência só. |
| `.sidepush-scroll{ overflow-x:hidden; scrollbar-gutter:stable }` em outra posição | A tem o mesmo no fim do arquivo. | Uma ocorrência só. |
| Falta o bloco de subcategorias (`.subcategory`, `.cat-toggle`, `.sidepush-subitem`, `.sidepush-expand-icon`, `.subcat-nav-hint`, `.subcat-h3`…) e `.sidepush-item-row` | Essas classes só existem no HTML/JS das bibliotecas da versão A. Nas outras não casam com nada. | Mantidas na folha única. |

### 2.3 ai

Sem `.ended-badge`. O `script.js` da ai não gera esse selo, então a regra não
casa com nada lá. Mantida na folha única (as outras 22 usam).

### 2.4 language

Tem o seletor de idioma em lista (`.lang-picker`, `.lang-dropdown`,
`.lang-option`). Só a language tem esse HTML. Mantido na folha única, na
seção de controles. A sombra do `.lang-dropdown` é `5px 5px 12px` (12 e não
10 de blur como o resto), preservada como estava.

### 2.5 data — a que mais divergia

| Diferença | O que fazia | Decisão |
|---|---|---|
| `.title-line .paren{ font-weight:400; opacity:.9 }` sem `display:block; font-size:.85em` | O trecho entre parênteses do título ("RStudio (Posit)") ficava no mesmo tamanho do nome (14px). Nas outras 22 é 0,85em. | **Versão das outras 22**: a única mudança visível desta unificação. Na data o parêntese passa de 14 para ~11,9px (12 cards na primeira tela). |
| Falta `.title-line .name{ min-width:0 }` | Sem efeito medido. | Versão A. |
| Linha solta `\1` no lugar do seletor `.card.card-link:hover, .card.card-link:focus-visible` (resto de um `sed` mal aplicado) | O bloco virava uma regra com seletor inválido: o card da data **não** tinha o efeito de hover (levantar + sombra). | Hover restaurado, igual às outras 22. |
| `section.category{ scroll-margin-top:90px }` (sem a superbar) | Ao clicar numa âncora de categoria, o título parava 36px mais alto, atrás da superbar. | `calc(var(--bvbar-h,44px) + 90px)` como nas outras. |
| `.pwa-install{ z-index:8990 }` (outras: 60) | Nos dois casos o botão fica acima de tudo do site (menu 50, cabeçalho 8000 não se sobrepõe a ele) e abaixo da superbar (9000). | 60, como as outras 22. |
| `--lib1…--lib8`, `--sidepush-w`, `--superbar-radius`, `--header-offset` | Variáveis que nada lê (nem CSS, nem HTML, nem JS). | Removidas. |
| Bloco "Super-bar v2/v2.1/v3" (`--superbar-h:29px`, `body{padding-top:…}` três vezes, `html,body{margin:0 !important}`, `.site-header{top:0; z-index:40}`) | Tudo sobrescrito ou pelas regras seguintes do próprio arquivo ou pelas regras que `superbar.js` injeta (`:root:root{--bvbar-h:36px}` e `html.bvbar-on body{padding-top:var(--bvbar-h)!important}`). | Removido; fica a versão A (`body{ padding-top: var(--bvbar-h, 44px) }` como reserva até a superbar carregar). |
| `.noscript-catalog` | Catálogo estático para quem está sem JavaScript; só a data o gera. | Mantido na folha única (seção 12). |
| `<noscript><style>#skeleton{display:none}</style>` no `data/index.html` | Só vale sem JavaScript e depende do `<noscript>`. | Fica no HTML da data. |

### 2.6 Diferenças que pareceram intencionais

Nenhuma. Tudo o que divergia era deriva do template: cópias feitas em momentos
diferentes, remendos aplicados numa biblioteca e não propagados, ou erro
(o `\1` da data). Por isso nenhuma biblioteca ficou com `styles.css` próprio.

## 3. CSS fora do `styles.css`

- **Blocos `<style>` nos `index.html`**: nenhum, a não ser o `#skeleton{display:none}` dentro do `<noscript>` da data (fica lá, ver 2.5).
- **Atributos `style=""` nos `index.html`**: os mesmos três em todas: o placeholder `<nav id="bvbar">` de 36px da superbar (contrato com `superbar.js`, não mexer), o link de fallback dentro dele e o tamanho do logo (`height:23px;width:23px`). Ficaram como estão.
- **Estilos aplicados pelo `script.js`**: nenhum `<style>` injetado. Há só atribuições a `element.style` que dependem dos dados: o atraso da animação de cada card (`animationDelay = i*15ms`), a posição dos selos quando um card tem ★ e 🪦 ao mesmo tempo, o tamanho do ícone da subcategoria (13px) e o bloqueio da rolagem do fundo com a gaveta aberta (`body.style.overflow`). Ficam no JS (o `script.js` não foi alterado).

## 4. Animações e transições

Todas as 23 tinham as mesmas animações; só a data tinha o hover do card quebrado
(ver 2.5). Na folha única elas ficam na **seção 13**:

| Animação | Onde é usada | Duração |
|---|---|---|
| `cardIn` (sobe 6px e aparece) | `.card` | .28s, atraso por card vem do `script.js` |
| `logoFocus` (desfoque → foco) e `logoShine` (brilho que passa) | `.brand-gradient` | .85s e 1.1s (começa em .9s) |
| `skeleton-shimmer` | `.skeleton-title`, `.skeleton-card` | 1.2s em loop |
| `prefers-reduced-motion: reduce` | tudo | zera animações e transições |

Transições (hover/abrir/fechar) ficam em cada componente: cards (120ms), botões
(.12s), menu lateral (`--dur-side` = .22s), tooltips e itens do menu
(`--dur-fast` = .15s), voltar ao topo e toast (.18s).

## 5. O que a folha única consolidou

A versão A era um "diário de remendos": a mesma regra aparecia várias vezes e
a última vencia. A folha nova guarda só o resultado final de cada seletor.
Principais fusões (número de ocorrências originais):

- `.card` (5), `.card .title-line` (6), `.card .subtitle` (6), `.card .actions` (4), `.card.card-link` (7), `.card.card-link:active` (6), hover/focus no tema claro (5 variantes de seletor com o mesmo efeito), `.card:hover` (2)
- `:root` (5) e `:root[data-theme="light"]` (2) → um bloco de tokens cada
- `.site-header` (3), `html`/`html, body`/`body` (6 blocos)
- `.sidepush` (2), `.sidepush-top` (2), `.sidepush-scroll` (3), `.sidepush-menu` (2), `.side-toggle` (3), `.side-toggle:active` (2), `.push-wrap` (4), `body.side-open .push-wrap` (4), `.sidepush .label` (3 pares), `.side-scrim` (2)
- `input[type="search"], select` (2), `select` (2), `.control-group` (2), `.controls .toggle` (2), `.infotooltip` (2), regras de `font-family` dos controles (4 → a regra com `!important` que já cobria todas)
- `.footer .proj-name` (2), `.featured-star` e `.ended-badge` (mesmo bloco, só a cor muda), `.category h2 .cat-title` (regra do tema claro era idêntica à do escuro)

Regras removidas por nunca terem efeito:

- `.sidepush-item.active{…}` simples: sempre perdia para `.sidepush-menu .sidepush-item.active`, que redefine fundo e borda.
- `@media (max-width:800px){ :root{ --side-w-open:84vw } }` (duas vezes): vinha **antes** de `@media (max-width:1024px){ --side-w-open:min(44vw,320px) }`, que também casa abaixo de 800px e, por vir depois, sempre vencia. A folha mantém o comportamento real (`min(44vw,320px)`).
- `.sidebar, .site-sidebar` na regra do `top` da superbar: essas classes não existem em nenhuma biblioteca.
- `@media (prefers-reduced-motion){ .sidepush, .side-scrim, .push-wrap{transition:none} }`: coberto pelo `*{animation:none; transition:none}` do mesmo media query.
- Duplicatas da data listadas em 2.5.

Tokens novos (valores iguais aos literais que substituem, sem mudança visual):
`--font-ui`, `--grad-brand`, `--grad-accent`, `--shadow-neo`,
`--shadow-neo-lg`, `--shadow-neo-xl`, `--radius-sm/md/lg/card`,
`--dur-fast`, `--dur-side`. Os tokens antigos continuam com o mesmo nome
(`--bg`, `--accent1…3`, `--control-h`, `--ctrl-*`, `--side-*`, `--superbar-h`).

## 6. Como a unificação foi verificada

Para cada biblioteca de referência (uma de cada versão: antiscam, truecrime,
code, ai, language, data, web3), com a página carregada no `home-static`
(porta 8787), tema escuro e claro, 1280px e 375px:

1. com o `styles.css` original, leitura de **todas** as propriedades computadas (≈350 por elemento) e do retângulo dos primeiros 1500 elementos da página;
2. troca do `<link>` para `/assets/library.css` na mesma página;
3. nova leitura e comparação propriedade a propriedade.

| Biblioteca (versão) | Elementos com alguma diferença | O que mudou |
|---|---|---|
| antiscam (A), web3 (A/CRLF), truecrime (B) | 0 de 1500 | nada |
| code (C), ai | 98 e 84 de 1500 | só `transition` do hover de `.sidepush-item`, `flex-grow/shrink` e `max-width` sem efeito no retângulo de nenhum elemento |
| language | 83 de 1500 | o mesmo de code mais o topo do menu 2px mais baixo no desktop (39,2 → 37px) |
| data | 12 cards + 9 seções | parêntese do título em 0,85em; `scroll-margin-top` 90 → 126px; `overflow-x`/`scrollbar-gutter` da área de rolagem do menu; variáveis mortas sumiram |

Depois da troca definitiva nos HTML, cada uma das sete foi aberta de novo para
conferir console sem erros novos (os 404 que aparecem em ai, language e data
são favicons externos e já existiam antes) e a superbar fixa no topo com o
cabeçalho do site grudado logo abaixo dela.

Estados de hover, foco e `:active` não entram na medição automática; foram
conferidos lendo a cascata (seções 7 e 8 da folha guardam o valor final de
cada um).

## 7. Como alterar em massa

Tudo está em `assets/library.css`, que as 23 bibliotecas carregam por
`<link href="/assets/library.css">`. Mudou lá, mudou em todas (lembrando que o
service worker do hub é "rede primeiro", então a atualização chega no próximo
carregamento com conexão).

| Quero trocar… | Onde |
|---|---|
| cores (fundo, texto, acentos do gradiente, bordas, sombras) | seção 1, `:root` (escuro) e `:root[data-theme="light"]` (claro). O gradiente da identidade é `--grad-brand`; o dos botões, `--grad-accent`. |
| a fonte | seção 1, `--font-ui` (vale para body, controles, botões e tooltips). A fonte em si vem do Google Fonts no `<head>` de cada `index.html`. |
| raios de borda | seção 1, `--radius-sm` (8px: selos, cards-link, toggles pequenos), `--radius-md` (12px: itens do menu, botões, toast), `--radius-lg` (14px: busca, select, voltar ao topo), `--radius-card` (18px: card sem link). |
| sombras neumórficas | seção 1, `--shadow-neo` (pequena), `--shadow-neo-lg` (média), `--shadow-neo-xl` (grande). |
| velocidade do menu lateral e dos hovers | seção 1, `--dur-side` (.22s) e `--dur-fast` (.15s). |
| uma animação (entrada dos cards, logo, esqueleto) | seção 13 (`@keyframes`); quem a usa está indicado em comentário. |
| a largura do menu lateral ou em que largura ele vira gaveta | seção 1 (`--side-w-closed`, `--side-w-open`) e os `@media` no fim da seção 11 (768px celular, 1024px retrato tablet). |
| tamanho e espaçamento dos cards | seção 7 (`.card` e `.card.card-link`). |
| o cabeçalho (altura, marca, selo BETA) | seção 4. |
| o que só uma biblioteca usa | continua na folha única, marcado: seletor de idioma (language, seção 5), catálogo sem JS (data, seção 12), subcategorias (as 9 da versão A, seção 6 e 11). Regras que não casam com nada numa biblioteca não a afetam. |

Se um dia uma biblioteca precisar de algo só dela, crie um `styles.css` nela
só com o override e inclua um segundo `<link>` depois do `library.css`; não
copie a folha inteira.

## 8. Pendências e observações

- `script.js` continua um por biblioteca (fora do escopo desta tarefa); os
  estilos que ele aplica são dependentes de dados (ver seção 3).
- O `<noscript><style>` da data e os três `style=""` do placeholder da superbar
  e do logo ficam nos HTML de propósito.
- Os 404 no console de ai, language e data são favicons de sites externos e não
  têm relação com o CSS.
