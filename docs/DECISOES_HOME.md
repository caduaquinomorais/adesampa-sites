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

**Mapa interativo (Google My Maps), só no clique.** Com `teia.mapaEmbed` preenchido em `paginas/inicio.md`, aparece sobre a imagem o botão "Ver mapa interativo". O clique troca a imagem pelo iframe do My Maps (`src/scripts/mapa.ts`).
- O Google só carrega quando a pessoa pede: a página inicial não chama serviços do Google sozinha (LGPD) e continua leve.
- Por que My Maps: a lista salva do Google Maps (`maps.app.goo.gl/…`) não tem código de incorporação. O My Maps tem, e as unidades são editadas lá, sem deploy.
- A CSP libera só `frame-src https://www.google.com` (o resto continua `'self'`).
- O build recusa qualquer `mapaEmbed` que não seja `https://www.google.com/maps/d/embed?mid=…`.
- Sem JavaScript, ou com `mapaEmbed` vazio, fica só a imagem com link (`mapaLink`).

## H-05 — Carrosséis e galerias

- **"Destaques e oportunidades", revistas e cartilhas:** são faixas roláveis.
  - Sem JavaScript, rolam com o dedo, o mouse ou o teclado (a faixa recebe foco).
  - Com JavaScript, as setas avançam um card por vez e ficam desativadas no começo e no fim.
  - Não há rotação automática.
- **Galerias com pontinhos:** manuais por padrão. A troca automática é opcional, por galeria (ver H-14).
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

## H-09 — Menu de projetos (item "Programas" do cabeçalho)

Figma: frame "Menu de projetos" (656:19254), 1008 × 476. Fica em todos os sites (cabeçalho compartilhado).
- **Dados:** `MENU_PROJETOS` em `packages/ui/src/data/institucional.ts`. Os links vazios estão pendentes (aparecem, mas não navegam).
- **Computador:** painel centralizado sob o cabeçalho, com 1008 px de largura (a proporção do Figma; não ocupa a página toda).
  - Abre ao passar o mouse (fecha 200 ms depois de o mouse sair) e também ao clicar.
  - Teclado: Enter abre, Esc fecha e devolve o foco, e sair com Tab fecha.
- **Celular e tablet (< 1024 px):** vira uma sanfona dentro do ☰, numa coluna só, com alvos de toque de 44 px.
- **Sem JavaScript:** abre com `:hover` / `:focus-within`. No celular, fica sempre expandido.
- **Fora do Figma:**
  - sombra leve, para separar o painel do conteúdo branco da página;
  - seta do "Programas" girando quando o menu está aberto;
  - "Atendimento" com a grafia corrigida (no Figma está "Atendimenro"). O rodapé foi corrigido também, em 23/11/2026.
- **Logos dos eixos:** SVGs exportados do Figma (`packages/ui/assets/icons/menu-*.svg`, com 28 px de altura) e carregados só quando o menu abre (lazy). O teste visual força o carregamento deles para confirmar que não estão quebrados.
- **Logos como links (23/11/2026):** cada logo leva à página do programa (campo `link` de cada eixo em `MENU_PROJETOS`). Hoje só o Sampa Tech tem página; os outros 4 ficam pendentes (aparecem, mas não clicam).
  - Ao passar o mouse ou focar pelo teclado, o logo com link cresce 5% em 180 ms (fora do Figma, a pedido). Os pendentes ficam parados.
- **Títulos dos grupos como links (23/11/2026):** em "Espaços e plataformas", o título **Teia** leva ao site do Teia e **Produtos digitais** leva à página nova (H-12). Sampa Ensina, Gestão Sampa e Data Sampa levam à seção de cada um nessa página (`#sampa-ensina`, `#gestao-sampa`, `#data-sampa`). "Praça Victor Civita" continua pendente (campo `link` de cada grupo).

## H-10 — Efeitos de hover (Início e rodapé)

Tirados das interações "ao passar o mouse" do protótipo no Figma.
- **Cards de "Nosso impacto" e "Nossos produtos digitais":**
  - fundo de `#001B4D` para `#042F80`;
  - borda de `rgba(207,230,255,.2)` para `#327CFE`;
  - transição "dissolve" de 160 ms, ease-out;
  - só em telas com mouse; no produto, também com foco pelo teclado.
- **Botões das redes sociais:**
  - fundo de `#042F80` para `#1158D4`;
  - ícone de `#BEDDFF` para branco;
  - troca instantânea, como no protótipo.
- **Links do Menu de projetos:** de `#262930` para `#1158D4`.

## H-11 — Parcerias governamentais e item "Governamental" (Figma de 19/11/2026)

O Figma da Início ganhou uma seção nova e o cabeçalho ganhou um item. Comparação feita com a versão de 16/11 (base da Home).
- **Seção "Parcerias governamentais"** (966:18689), entre "Destaques" e "Nosso impacto":
  - textos e fotos em `inicio.md` (`parcerias`); as 2 fotos foram baixadas do Figma;
  - carrossel **manual** com pontinhos (componente `Galeria`), como os outros do site (H-05). No Figma ele passa sozinho a cada 4 s. A passagem automática foi ligada depois, a cada 10 s (ver H-14);
  - o título fica sobre a foto, num degradê azul `#042F80` em "multiplicar" (75%), como no card 1 do Figma. O card 2 do Figma usa um degradê um pouco mais estreito; o site usa o mesmo nos dois;
  - os pontinhos seguem o número de fotos (2), e não os 4 desenhados no Figma;
  - contraste do título: medido no print (o teste automático não mede texto sobre foto). Em 90% dos pixels atrás dele fica ≥ 4,9:1 (texto grande exige 3:1), com uma sombra leve no texto para reforçar;
  - "inteligencia" foi escrito com acento ("inteligência");
  - a etiqueta continua "Lorem Ipsum Dollor", como no Figma, até o texto ser definido (pendência P-H6).
- **Item "Governamental" no cabeçalho** (7 sites): leva a `parcerias-governamentais/` no site Home, uma página **provisória** ("Em construção", fora dos buscadores). O botão "Veja nossa atuação em parcerias" leva à mesma página. Quando o frame "Parcerias Governamentais" (966:21749) for implementado, basta substituir essa página.
- **Não seguido:** as faixas de degradê dos destaques (Rectangle 908/909) saíram do lugar no Figma, aparentemente sem querer. O site as mantém alinhadas ao carrossel.
- **Teste visual:** a referência `inicio-1440.png` foi montada com a imagem antiga mais a exportação da seção nova, porque a API do Figma estava no limite de uso.

## H-12 — Página Produtos digitais (23/11/2026)

Figma: frame "Produtos Digitais" (685:50101). Endereço: `/comunicacao/produtos-digitais/`, com "Comunicação" ativo no menu, como no Figma.
- **Textos:** `paginas/produtos-digitais.md`. Uma seção por plataforma, com fundos alternados (claro / branco / claro) e o card de recursos invertido.
- **Breadcrumb:** "Início / Comunicação / Produtos digitais". O Figma mostra só "Início / Produtos Digitais"; o item do meio foi acrescentado porque a página fica dentro de Comunicação.
- **Botões "Conheça a plataforma":** pendentes (aparecem, mas não clicam) até chegarem os endereços das plataformas. Os cards "Acesse a plataforma" da Início também.
- **Logos e ícones:** SVGs exportados do Figma.
  - logos em `src/assets/produtos/logo-*.svg`. O do Gestão Sampa tem 88 px de altura (o til sobe acima da linha); os outros têm 80;
  - os 9 ícones estão em `src/assets/icones/produtos/` e são escolhidos pelo campo `icone:` no conteúdo (`components/IconeProduto.astro`).
- **Medidas:** o limite de uso do Figma acabou no meio da leitura. Vieram a estrutura, os textos, as medidas e o banner; as cores dos fundos e dos cards saíram do print do frame.
- **Teste:** a página não tem referência no teste de comparação com o Figma; passa pelos testes de responsividade e acessibilidade.

## H-13 — Menu Comunicação (24/11/2026)

Figma: frame "Menu Comunicação" (1117:22696), 195 px de largura. Fica no cabeçalho compartilhado (todos os sites).
- **Itens:** Notícias, Publicações, Central de conteúdo, Manual de marcas, Manual de redação e Contato (`submenu` do item `comunicacao` em `CABECALHO.menu`, `institucional.ts`).
- **"Central de conteúdo"** leva à página Comunicação (`/comunicacao/`), que não tem outro nome no Figma. Os manuais e o Contato levam às seções dessa página (`#manual-de-marca`, `#manual-de-redacao`, `#contato`).
- **Comportamento igual ao de "Programas"** (H-09): "Comunicação" deixou de ser link e virou um botão que abre a lista (passar o mouse ou clicar; Esc fecha; Tab para fora fecha). Abrir um menu fecha o outro. No celular, vira sanfona dentro do ☰.
- **Fora do Figma:**
  - sombra e cantos arredondados embaixo, iguais aos do Menu de projetos;
  - linhas divisórias numa cor só (`#DDEEFF`). No print do Figma, elas alternam entre azul-claro e cinza;
  - hover: texto azul e fundo `#F4F9FF`.
- **"Produtos digitais"** não entra neste menu (segue o Figma). Continua no Menu de projetos.
- **Medidas:** a API e o MCP do Figma estavam no limite de uso, então o menu foi feito a partir de um print. A altura de cada item (40 px) e o tamanho do texto (14 px) são aproximados.

## H-14 — Troca automática em Parcerias governamentais (24/11/2026)

- As fotos de "Parcerias governamentais" (Início) passam sozinhas **a cada 10 s** (o Figma usa 4 s; 10 s foi pedido pela equipe).
- Como ligar em uma galeria: `<Galeria … automatico={10} />` na página. Sem a opção, a galeria continua manual (Praça e capas de Comunicação).
- Caminho: página (`automatico`) → `Galeria.astro` (`data-automatico`) → `scripts/carrossel.ts` (função `iniciarGaleria`, `setInterval`).
- Pausa com o mouse em cima, com o foco do teclado dentro da galeria e com a aba oculta. Não roda com "reduzir movimento" (`prefers-reduced-motion`).
- **Pendente (acessibilidade, WCAG 2.2.2):** falta um botão visível de pausar. Não foi feito para manter a mudança mínima.
- Os testes não verificam a troca em si (só que a página continua válida). Conferir com `npm run dev -w sites/home`.

## H-15 — Menu de projetos: itens sem link ficam ocultos (24/11/2026)

- Só Sampa Empreende e Sampa Tech estão em uso. Os itens dos demais programas ainda não têm página.
- Regra: nos **eixos** do Menu de projetos, item com destino vazio não é exibido. Se nenhum item do programa tem destino, fica só o logo.
- Os textos continuam em `institucional.ts` (`MENU_PROJETOS`): basta preencher o destino para o item voltar.
- Onde: `Header.astro`, lista `mega__links` dos eixos (`.some(...) &&` + `.filter((l) => l.link)`).
- "Espaços e plataformas" **não** usa a regra: "Conheça os equipamentos" (Praça) continua visível sem link.
- O Menu de projetos não existe em `referencia/`, então o teste de referência não muda.

## Pendências de conteúdo (confirmar com a ADE SAMPA)

| # | Onde | Pendência |
|---|---|---|
| P-H1 | Destaque "Aceleração Vai Tec" | O texto diz "Inscrições abertas até **xx** de janeiro". Falta a data. |
| P-H2 | Sobre, "Nosso pilares" | Grafia mantida como no Figma. O certo seria "Nossos pilares"? |
| P-H3 | Início ("13 anos") × Sobre ("Há 14 anos") | Os números divergem no Figma. |
| P-H4 | Links pendentes | Programas, Transparência, redes sociais, links legais, sites dos 5 programas, produtos digitais, botões dos destaques, "Ver programação completa", manuais (PDF) e PDFs das revistas e cartilhas. |
| P-H5 | Revistas 1ª a 3ª edição | Os textos alternativos das capas são genéricos. Faltam os temas de cada edição. |
| P-H7 | Produtos digitais | Endereços das 3 plataformas (botões "Conheça a plataforma" e cards "Acesse a plataforma" da Início). |
| P-H6 | Início, "Parcerias governamentais" | Texto da etiqueta (no Figma: "Lorem Ipsum Dollor") e textos alternativos das 2 fotos (escritos por nós). |
