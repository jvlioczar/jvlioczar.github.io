# biblioverse.org

## llms.txt, sitemap e dados estruturados

`llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml`, o `llms.txt` de cada biblioteca e os blocos
JSON-LD no `<head>` do hub e das bibliotecas são gerados por `_tools/seo.py`.
Depois de mudar o conteúdo de uma biblioteca ou os cards do hub, rode na raiz:

```
python _tools/seo.py
```
