# Decisões de design — site Home

Este documento registra as decisões tomadas onde o Figma não define o comportamento e os desvios intencionais do Figma. Ele segue o padrão de `teia-teste/docs/DECISOES_DE_DESIGN.md`.

O Figma usado é o arquivo `r1NdYceMw9ocdyDDrVQUGW`, com estes frames:
- Início `1:2884`;
- Sobre `306:4533`;
- Comunicação `264:3552`;
- Exemplo de notícia `574:43625`;
- Publicações `654:15568`.

O Figma só tem a versão de 1440 px.

## H-01 — Fidelidade ao Figma

Em 1440 px, as 25 seções conferidas têm a mesma altura do Figma, com tolerância de ±4 px. O teste é o `tests/visual/figma.mjs`.

A diferença de pixels por seção fica entre 1,5% e 8%, na mesma faixa do TEIA. Ela vem de 3 fontes:
- a suavização de fontes (Figma × Chrome);
- os ajustes de cor da decisão H-02;
- o conteúdo real no lugar do *Lorem ipsum* do Figma (cards de notícias).

## H-02 — Cores ajustadas por acessibilidade (WCAG AA)

Várias combinações do Figma ficam abaixo do contraste mínimo (4,5:1 para texto normal). Foi usada a cor mais próxima da original que atinge o mínimo:

| Onde | Figma | No site | Contraste |
|---|---|---|---|
| Botão Sampa Tech (texto branco) | `#00B1E2` | `#007EA0` | 2,5 → 4,7 |
| Botão Sampa Verde e etiqueta "Espaço público" | `#52AF27` | `#3E841D` | 2,8 → 4,6 |
| Texto da etiqueta Sampa Tech | `#00B1E2` | `#007494` | 2,2 → 4,7 |
| Texto da etiqueta Sampa Games | `#9B32E0` | `#922FD3` | 4,3 → 4,7 |
| Texto azul sobre `#BEDDFF` (etiquetas e filtros) | `#327CFE`/`#1158D4` | `#245AB8` | 2,8 → 4,6 |
| "Acesse a plataforma" sobre fundo escuro | `#327CFE` | `#4F8FFE` | 4,3 → 4,7 |
| "Ler notícia", "Saiba mais", filtro ativo, página atual | `#327CFE` | `#1158D4` | 3,6 → 5,9 |
| Número "+500.000" | `#1158D4` | `#327CFE` (igual aos outros números) | 2,7 → 4,3 (texto grande) |

O teste `tests/visual/paginas.mjs` confere o contraste de todos os textos de todas as páginas, em 5 larguras.

## H-03 — Banner do Início

O fundo foi gerado a partir das camadas do Figma: a foto com 80% de opacidade, a cor `#1158D4` no modo "Color" a 61% e os 2 degradês. O resultado é uma imagem única (`assets/fotos/banner-fundo.jpg`), porque o modo de mistura "Color" não tem um equivalente exato e estável em CSS. Para refazer: `scripts/compor-banner.mjs`.

## H-04 — Mapa do Teia no Início

No Figma, o mapa é uma imagem: um painel da unidade junto com um trecho do Google Maps. Ela foi usada como está, com uma descrição em texto (alt), e leva ao mapa do site do Teia.

Não há Google Maps ao vivo na Home. Isso evita carregar serviços do Google na página inicial (LGPD) e mantém a CSP fechada.

**Pendência:** se preferirem o mapa interativo, troca-se a imagem por um iframe e libera-se `frame-src` para o Google. É o mesmo caminho do TEIA, decisão D-05.

## H-05 — Carrosséis e galerias

- **"Destaques e oportunidades", revistas e cartilhas:** são faixas roláveis.
  - Sem JavaScript, rolam com o dedo, o mouse ou o teclado (a faixa recebe foco).
  - Com JavaScript, as setas avançam um card por vez e ficam desativadas no começo e no fim.
  - Não há rotação automática.
- **Praça Victor Civita e capa das publicações:** o Figma mostra 4 pontinhos, mas só uma foto.
  - Os pontinhos só aparecem com 2 fotos ou mais, como no TEIA (decisão D-06).
  - Para incluir fotos, use a lista `fotos` em `inicio.md` ou `capas` em `comunicacao.md`.

## H-06 — Notícias, filtros e busca

- **6 notícias por página**, como no Figma: 2 linhas de 3.
  - A página Comunicação mostra as 6 mais recentes.
  - A paginação continua em `/comunicacao/noticias/pagina/2/`.
- **Filtros:** cada categoria é uma página estática (`/comunicacao/noticias/categoria/<id>/`). Funcionam sem JavaScript.
- **Busca:** usa um índice estático (`busca.json`, gerado no build) e roda no navegador, porque não há servidor de aplicação. Sem JavaScript, o campo de busca fica oculto.
- **Página da notícia:** o título "Notícias" do topo não é o `<h1>`. O `<h1>` é o título da notícia, para que haja um único `<h1>` por página.
- **Imagem e "Também pode interessar":** a imagem só aparece se a notícia tiver uma. A seção "Também pode interessar" só aparece se houver outras notícias.
- **Cards de exemplo do Figma:** os cards em *Lorem ipsum* **não** foram publicados. Só a notícia real do Figma, "Mais Mulheres", foi incluída.

## H-07 — Responsividade (o Figma só tem 1440 px)

| Largura | Comportamento |
|---|---|
| ≥ 1280 px | Fiel ao Figma |
| 1024–1279 px | Margens fluidas |
| 768–1023 px | Duas colunas viram uma; notícias em 2 colunas; eixos em 3 colunas; alvos de toque de 44 px |
| < 768 px | Uma coluna; títulos menores, com a mesma escala do TEIA; eixos em 2 colunas |

As quebras de linha forçadas do Figma só valem em telas grandes.

## H-08 — Correções no cabeçalho e no rodapé compartilhados

Estas correções afetam os 7 sites e estão descritas em [HEADER_FOOTER.md](HEADER_FOOTER.md):
- **C-1:** cores herdadas por um erro de especificidade do CSS;
- **C-2:** o cabeçalho define a própria cor de texto;
- **C-3:** links do rodapé com alvo de toque de 44 px abaixo de 1024 px.

## Pendências de conteúdo (confirmar com a ADE SAMPA)

| # | Onde | Pendência |
|---|---|---|
| P-H1 | Destaque "Aceleração Vai Tec" | O texto diz "Inscrições abertas até **xx** de janeiro". Falta a data. |
| P-H2 | Sobre, "Nosso pilares" | Grafia mantida como no Figma. O certo seria "Nossos pilares"? |
| P-H3 | Início ("13 anos") × Sobre ("Há 14 anos") | Os números divergem no Figma. |
| P-H4 | Links pendentes | Programas, Transparência, redes sociais, links legais, sites dos 5 programas, produtos digitais, botões dos destaques, "Ver programação completa", manuais (PDF) e PDFs das revistas e cartilhas. |
| P-H5 | Revistas 1ª a 3ª edição | Os textos alternativos das capas são genéricos. Faltam os temas de cada edição. |
