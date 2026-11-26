# 01 — Mapa da Home (ADE SAMPA)

[← Voltar ao índice](../DOCUMENTACAO.md)

**Pasta do site:** [sites/home/](../sites/home/) · **Endereço de teste:** oranilom.com.br/homolog/

Este mapa mostra, para **cada seção de cada página**, onde fica:
- 📝 **Conteúdo**: o que aparece (textos, links, fotos, cards);
- 🧱 **Estrutura**: como a seção é montada (ordem, colunas, quais peças usa);
- 🎨 **Visual**: cores, tamanhos e espaços. É o termo que você procura (Ctrl+F) no [site.css](../sites/home/src/styles/site.css).

> O **cabeçalho, o menu e o rodapé** não estão aqui: eles são iguais em todos os sites. Veja [04 — Partes compartilhadas](04-mapa-compartilhado.md).

---

## Arquivos de conteúdo da Home

Todos ficam em [sites/home/src/content/](../sites/home/src/content/):

| Arquivo | O que guarda |
|---|---|
| [paginas/inicio.md](../sites/home/src/content/paginas/inicio.md) | Textos da página inicial |
| [paginas/sobre.md](../sites/home/src/content/paginas/sobre.md) | Textos da página Sobre |
| [paginas/comunicacao.md](../sites/home/src/content/paginas/comunicacao.md) | Textos da página Comunicação e das páginas de notícias |
| [paginas/publicacoes.md](../sites/home/src/content/paginas/publicacoes.md) | Textos da página Publicações |
| [paginas/produtos-digitais.md](../sites/home/src/content/paginas/produtos-digitais.md) | Textos da página Produtos digitais |
| [destaques.yaml](../sites/home/src/content/destaques.yaml) | Cards de "Destaques e oportunidades" |
| [publicacoes.yaml](../sites/home/src/content/publicacoes.yaml) | Revistas e cartilhas |
| [categorias.yaml](../sites/home/src/content/categorias.yaml) | Categorias das notícias (os filtros) |
| [noticias/](../sites/home/src/content/noticias/) | As notícias: **um arquivo por notícia** |

Fotos, ícones e logos ficam em [sites/home/src/assets/](../sites/home/src/assets/): `fotos/`, `icones/`, `eixos/`, `produtos/` e `publicacoes/`.

---

## Página inicial

**Endereço:** /homolog/ · **🧱 Estrutura:** [pages/index.astro](../sites/home/src/pages/index.astro) · **📝 Conteúdo:** [paginas/inicio.md](../sites/home/src/content/paginas/inicio.md)

| Seção (de cima para baixo) | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual (procure no `site.css`) |
|---|---|---|---|
| **Banner** (frase principal e botão) | `inicio.md` → `banner`. Foto de fundo: `assets/fotos/banner-fundo.jpg` | `index.astro`, `<section class="banner">` | `.banner` |
| **Nossos eixos de atuação** (5 programas) | Título e texto: `inicio.md` → `eixos`. Texto de cada card (o que aparece ao passar o mouse): [eixos.yaml](../sites/home/src/content/eixos.yaml). As 5 imagens, os logos e os links ficam **no componente**; as cores dos botões, em `site.css` (procure `.eixo-card`) | [components/Eixos.astro](../sites/home/src/components/Eixos.astro). Imagens em `assets/eixos/` | `Eixos de atuação` |
| **Destaques e oportunidades** (carrossel de cards) | Título: `inicio.md` → `destaques`. **Cards:** [destaques.yaml](../sites/home/src/content/destaques.yaml) | `index.astro` + [components/Carrossel.astro](../sites/home/src/components/Carrossel.astro) | `Carrossel` e `Destaques` |
| **Parcerias governamentais** (texto + fotos) | `inicio.md` → `parcerias` (fotos em `parcerias.itens`) | `index.astro` + [components/Galeria.astro](../sites/home/src/components/Galeria.astro) | `Parcerias governamentais` |
| **Nosso impacto em números** | `inicio.md` → `numeros` | `index.astro`, `<section class="… numeros">` | `Números` |
| **Teia** (texto, botões e mapa) | `inicio.md` → `teia` | `index.astro`, `<section class="… teia">` | `Duas colunas` e `.teia` |
| **Nossos produtos digitais** (3 cards) | `inicio.md` → `produtos`. Ícones em `assets/produtos/` | `index.astro`, `<section class="… produtos">` | `Produtos digitais` |
| **Praça Victor Civita** (texto + fotos) | `inicio.md` → `praca` | `index.astro` + `Galeria.astro` | `Praça Victor Civita` |

---

## Sobre

**Endereço:** /homolog/sobre/ · **🧱 Estrutura:** [pages/sobre/index.astro](../sites/home/src/pages/sobre/index.astro) · **📝 Conteúdo:** [paginas/sobre.md](../sites/home/src/content/paginas/sobre.md)

| Seção | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Topo** (título com formas decorativas) | `sobre.md` → `hero` | [components/Hero.astro](../sites/home/src/components/Hero.astro) | `Hero das páginas internas` |
| **Quem somos** | `sobre.md` → `quemSomos` (parágrafos separados por linha em branco) | `sobre/index.astro` | `.bloco-texto` |
| **Como operamos** | `sobre.md` → `comoOperamos` | `sobre/index.astro` | `.bloco-texto` e `.secao--royal` |
| **Eixos de atuação** | `sobre.md` → `eixos` | `Eixos.astro` (o mesmo da página inicial) | `Eixos de atuação` |
| **Pilares** | `sobre.md` → `pilares`. Ícones em `assets/icones/pilar-*.svg` | `sobre/index.astro` | `.pilares` e `.pilar` |

---

## Comunicação

**Endereço:** /homolog/comunicacao/ · **🧱 Estrutura:** [pages/comunicacao/index.astro](../sites/home/src/pages/comunicacao/index.astro) · **📝 Conteúdo:** [paginas/comunicacao.md](../sites/home/src/content/paginas/comunicacao.md)

| Seção | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Topo** | `comunicacao.md` → `hero` | `Hero.astro` | `Hero das páginas internas` |
| **Notícias** (as 6 mais recentes, filtros e busca) | Textos: `comunicacao.md` → `noticias`. **Notícias:** pasta [noticias/](../sites/home/src/content/noticias/). Filtros: [categorias.yaml](../sites/home/src/content/categorias.yaml) | `comunicacao/index.astro` + [CardNoticia.astro](../sites/home/src/components/CardNoticia.astro), [FiltrosNoticias.astro](../sites/home/src/components/FiltrosNoticias.astro) e [Paginacao.astro](../sites/home/src/components/Paginacao.astro) | `.noticias-secao`, `.grade-noticias`, `.card-noticia` |
| **Publicações** (chamada com capas) | `comunicacao.md` → `publicacoes` | `comunicacao/index.astro` + `Galeria.astro` | `.publicacoes-chamada` |
| **Manual de marca** | `comunicacao.md` → `manualMarca` (lista `cards`) | `comunicacao/index.astro` | `.manual` |
| **Manual de redação** | `comunicacao.md` → `manualRedacao` | `comunicacao/index.astro` | `.manual` e `.redacao` |
| **Contato** (e-mails) | `comunicacao.md` → `contato` (lista `emails`) | `comunicacao/index.astro` | `.contato` |

### Páginas de notícias

| Página | Endereço | 🧱 Estrutura | 📝 Conteúdo |
|---|---|---|---|
| Lista de todas as notícias (e por categoria) | /comunicacao/noticias/ | [pages/comunicacao/noticias/[...lista].astro](../sites/home/src/pages/comunicacao/noticias/[...lista].astro) | Notícias em `noticias/`; textos em `comunicacao.md` → `paginaNoticias` |
| Uma notícia | /comunicacao/noticias/nome-do-arquivo/ | [pages/comunicacao/noticias/[slug].astro](../sites/home/src/pages/comunicacao/noticias/[slug].astro) | O próprio arquivo da notícia |
| Busca | /comunicacao/noticias/busca/ | [pages/comunicacao/noticias/busca.astro](../sites/home/src/pages/comunicacao/noticias/busca.astro) + [scripts/busca.ts](../sites/home/src/scripts/busca.ts) | Gerada a partir das notícias |

- **Quantas notícias por página:** `NOTICIAS_POR_PAGINA = 6`, em [lib/conteudo.ts](../sites/home/src/lib/conteudo.ts) (🟡).
- **Visual da notícia aberta:** procure `Notícia` no `site.css`.

---

## Publicações

**Endereço:** /homolog/comunicacao/publicacoes/ · **🧱 Estrutura:** [pages/comunicacao/publicacoes/index.astro](../sites/home/src/pages/comunicacao/publicacoes/index.astro)

| Seção | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Topo** | [paginas/publicacoes.md](../sites/home/src/content/paginas/publicacoes.md) → `hero` | `Hero.astro` | `Hero das páginas internas` |
| **Revistas** (carrossel) | Título: `publicacoes.md` → `revistas`. **Cards:** [publicacoes.yaml](../sites/home/src/content/publicacoes.yaml) com `tipo: revista`. Capas em `assets/publicacoes/` | `publicacoes/index.astro` + `Carrossel.astro` | `Publicações` e `.card-publicacao` |
| **Cartilhas** (carrossel) | Título: `publicacoes.md` → `cartilhas`. **Cards:** `publicacoes.yaml` com `tipo: cartilha` | o mesmo | o mesmo |

---

## Produtos digitais

**Endereço:** /homolog/comunicacao/produtos-digitais/ · **🧱 Estrutura:** [pages/comunicacao/produtos-digitais/index.astro](../sites/home/src/pages/comunicacao/produtos-digitais/index.astro) · **📝 Conteúdo:** [paginas/produtos-digitais.md](../sites/home/src/content/paginas/produtos-digitais.md)

| Seção | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Topo** | `produtos-digitais.md` → `hero` | `Hero.astro` | `Hero das páginas internas` |
| **Uma seção por plataforma** (Sampa Ensina, Gestão Sampa, Data Sampa), com fundo alternado | `produtos-digitais.md` → `produtos` (cada plataforma tem a sua lista `recursos`) | `produtos-digitais/index.astro`. Logos em `assets/produtos/logo-*.svg`. Ícones dos recursos: [IconeProduto.astro](../sites/home/src/components/IconeProduto.astro) | `Página Produtos digitais` e `.produto` |

---

## Outras páginas

| Página | 🧱 Estrutura | Observação |
|---|---|---|
| **Parcerias governamentais** (provisória, "em construção") | [pages/parcerias-governamentais/index.astro](../sites/home/src/pages/parcerias-governamentais/index.astro) | Exceção: o texto está **direto no `.astro`**, por ser provisória. Quando a página definitiva for feita, o texto deve ir para um `.md` |
| **Página de erro 404** | [pages/404.astro](../sites/home/src/pages/404.astro) | Visual: `404` |

---

## Peças reaproveitadas (componentes)

Ficam em [sites/home/src/components/](../sites/home/src/components/). Mudar um componente muda **todas as páginas que o usam** (🟡).

| Componente | O que é | Onde aparece |
|---|---|---|
| `Botao.astro` | Botão (azul, contorno, branco, cores dos programas) | Em quase todas as páginas |
| `Hero.astro` | Topo das páginas internas (trilha "Início > …", título e texto) | Sobre, Comunicação, Publicações, Produtos digitais, notícias |
| `Breadcrumb.astro` | A trilha "Início > Comunicação > …" | Dentro do Hero |
| `Carrossel.astro` | Fileira de cards com setas | Destaques (Início), Revistas e Cartilhas |
| `Galeria.astro` | Fotos com pontinhos para trocar. Com `automatico={segundos}`, passam sozinhas | Parcerias (automática, 10 s) e Praça (Início), capas (Comunicação) |
| `Eixos.astro` | Os 5 cards dos programas | Início e Sobre |
| `CardNoticia.astro` | O card de uma notícia | Comunicação, lista de notícias, "Também pode interessar" |
| `FiltrosNoticias.astro` | Os botões de categoria e a busca. O filtro e a paginação trocam só os cards, sem recarregar a página ([scripts/noticias.ts](../sites/home/src/scripts/noticias.ts)) | Páginas de notícias |
| `Paginacao.astro` | "1 2 3 próxima" | Páginas de notícias |
| `IconeProduto.astro` | Traduz o nome do ícone (`mapa`, `gratuito`…) para o arquivo | Produtos digitais |

Comportamentos (o que "se mexe") ficam em [sites/home/src/scripts/](../sites/home/src/scripts/): `carrossel.ts` (setas, pontinhos e troca automática), `busca.ts` (busca de notícias) e `mapa.ts` (mapa interativo do Teia na página inicial).

### Troca automática das fotos (ex.: Parcerias a cada 10 s) — 🟡 um site

| Quero… | Onde |
|---|---|
| Mudar o tempo (ex.: de 10 para 6 s) | [index.astro](../sites/home/src/pages/index.astro), na `<Galeria>` de Parcerias: `automatico={10}` |
| Ligar em outra galeria (ex.: Praça) | Acrescente `automatico={10}` na `<Galeria>` dela, na página |
| Desligar | Apague o `automatico={…}` da `<Galeria>` |
| Mudar **como** a troca funciona (pausar, ordem, velocidade da animação) | [carrossel.ts](../sites/home/src/scripts/carrossel.ts), função `iniciarGaleria`, bloco "Troca automática" |

A troca para sozinha com o mouse em cima, com o foco do teclado na galeria, com a aba escondida e para quem ativou "reduzir movimento" no computador. Os testes não conferem a troca em si: veja no `npm run dev -w sites/home`. Decisão registrada em [docs/DECISOES_HOME.md](../docs/DECISOES_HOME.md#h-14--troca-automática-em-parcerias-governamentais-24112026).

---

## Cores e estilos gerais da Home

No começo do [site.css](../sites/home/src/styles/site.css) fica o bloco `:root`, com as **variáveis de cor** do site. Logo depois vêm os estilos comuns: `Tipografia`, `Etiqueta`, `Botões`.

No fim do arquivo ficam os ajustes de tela menor:
- `@media (max-width: 1023px)`: tablet e celular;
- `@media (max-width: 767px)`: só celular.

> Algumas cores foram ajustadas de propósito em relação ao Figma, para garantir a leitura (contraste). Elas estão marcadas com `AA:` no CSS. Antes de mudar, leia [docs/DECISOES_HOME.md](../docs/DECISOES_HOME.md).

**Para se aprofundar:** [docs/CONTEUDO_HOME.md](../docs/CONTEUDO_HOME.md) (edição de conteúdo) e [docs/DECISOES_HOME.md](../docs/DECISOES_HOME.md) (por que algo está diferente do Figma, e pendências).
