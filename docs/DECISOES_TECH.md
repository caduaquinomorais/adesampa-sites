# Decisões de design — site Sampa Tech

Este documento registra as decisões tomadas onde o Figma não define o comportamento e os desvios intencionais do Figma. Ele segue o padrão de [DECISOES_HOME.md](DECISOES_HOME.md).

O Figma usado é o arquivo `r1NdYceMw9ocdyDDrVQUGW`, com estes frames:
- Sampa Tech `468:12857`;
- Aceleração Vai Tec `64:2150`.

O Figma só tem a versão de 1440 px.

## T-01 — Endereço e estrutura

- **Endereço:** o site fica em `oranilom.com.br/homolog/sampa-tech/`, e a página do Vai Tec em `/homolog/sampa-tech/vaitec/`.
- **Site próprio no monorepo** (`sites/tech`, nome `tech` no mapa `SITES`), publicado na pasta `homolog/sampa-tech/` do FTP.
  - O deploy da Home não apaga essa pasta, porque cada deploy só remove os arquivos que ele mesmo enviou.
  - Não confundir com `www/sampa-tech/`, um site antigo que fica fora deste projeto.
- **Conteúdo editável:** `src/content/paginas/inicio.md` (página Sampa Tech) e `vaitec.md` (Vai Tec). Como editar: [CONTEUDO_TECH.md](CONTEUDO_TECH.md).
- **Links nos 7 sites:** "Aceleração Vai Tec", no Menu de projetos e no rodapé, leva à página nova. O card "Sampa Tech" dos eixos do Início leva à página do programa.

## T-02 — Cores ajustadas por acessibilidade (WCAG AA)

Foi usada a cor mais próxima da original que atinge o contraste mínimo. É o mesmo critério da decisão H-02 da Home, e o tom do botão é o mesmo da Home.

| Onde | Figma | No site | Contraste |
|---|---|---|---|
| Botões, etiquetas cheias e números dos temas (texto branco) | `#00B1E2` | `#007EA0` | 2,5 → 4,7 |
| Texto do botão "Preencher formulário" e da pergunta aberta em "Dúvidas" | `#00B1E2` | `#007EA0` | 2,5 → 4,7 |
| Etiqueta "Inscrições abertas" (fundo claro) | `#2589B7` sobre `#C8F9FF` | `#1A6A8F` | 3,5 → 5,3 |
| Cards de "Quem pode se inscrever?" (texto branco) | `#2589B7` | `#1F7AA8` | 3,9 → 4,8 |
| Pergunta aberta em "Quem pode se inscrever?" | `#53D3EE` | `#C8F9FF` | 2,2 → 4,2 (texto grande) |

## T-03 — Comportamentos fora do Figma

- **Perguntas** ("Quem pode se inscrever?" e "Dúvidas"):
  - usam `<details>`, que funciona sem JavaScript, com teclado e leitor de tela;
  - a primeira vem aberta, como no Figma, e a seta gira ao abrir;
  - a numeração ("1.", "2." …) é automática.
- **Submenu do Vai Tec:** cada item leva à seção da própria página. "Inscreva-se" leva ao bloco "Edital e inscrições".
- **Submenu da página Sampa Tech:** "Aceleração Vai Tec" leva à página do Vai Tec.
- **"Leia o edital e inscreva-se"** (card do resumo): leva ao bloco "Edital e inscrições" do Vai Tec.
- **Status das inscrições:** bolinha verde para "abertas" (`aberto: true` no conteúdo) e cinza para "fechadas".
- **Trilha de navegação:** "Programas" aparece sem link, porque ainda não existe uma página de programas.
- **Grafia corrigida:** "mpreendimentos" virou "empreendimentos" (benefício "Aporte financeiro").

## T-04 — Imagens e ícones

- **Fotos e fundos:** são as imagens originais baixadas do Figma (fundo dos heros com losangos, foto do "Sobre" e fundo de "Quem pode se inscrever?").
- **Logo "sampaTECH" do submenu:** foi montado a partir do logo empilhado do Menu de projetos (`menu-tech.svg`), com as duas palavras lado a lado e na mesma altura, como no Figma.
- **Selo ADE SAMPA + Prefeitura:** usa os mesmos logos do rodapé, com o "adesampa" todo em branco.
- **Ícones** (benefícios, ✓ da lista e seta das perguntas): são **provisórios**, desenhados no estilo do Figma, porque a API do Figma estava no limite de uso (pendência P-T6).

## T-05 — Responsividade

| Largura | Comportamento |
|---|---|
| ≥ 1024 px | Fiel ao Figma |
| 768–1023 px | O hero, o bloco do programa e o "Sobre" viram uma coluna; o card do resumo e o selo ficam embaixo; benefícios em 1 coluna; temas em 2 |
| < 768 px | Temas em 1 coluna; no cronograma, a data fica em cima da etapa; os botões do edital ocupam a largura toda |

**Teste:** `tests/visual/figma.mjs tech` compara as 2 páginas com as imagens exportadas do Figma em 23/11/2026 (`tests/visual/reference/tech/`). As 14 seções ficam com a altura do Figma, com tolerância de ±4 px.

## T-06 — Seções com listas têm altura livre no teste (25/11/2026)

Temas, Quem pode, Cronograma e Dúvidas, na página Vai Tec, crescem ou diminuem com a quantidade de itens do conteúdo, que vai variar. No `tests/visual/figma-tech.json`, essas 4 seções têm `"altura": null`: o teste ainda compara a imagem delas com o Figma, mas não bloqueia mais a publicação por causa da altura. As outras seções continuam com tolerância de ±4 px.

Motivo: o commit de 25/11 acrescentou um tema e tirou uma pergunta. O teste viu Temas 122 px mais alta e Dúvidas 118 px mais baixa, e o deploy não aconteceu.

## Pendências de conteúdo (confirmar com a ADE SAMPA)

| # | Onde | Pendência |
|---|---|---|
| P-T1 | Vai Tec, "Dúvidas" | As respostas estão em *Lorem ipsum* no Figma. |
| P-T2 | Vai Tec, "Quem pode se inscrever?" | A seção repete as perguntas e o subtítulo de "Dúvidas". Falta o conteúdo real (critérios de inscrição). |
| P-T3 | Vai Tec, "Cronograma" | As 8 etapas são iguais ("15 de agosto a 30 de outubro — Período de inscrições online"). |
| P-T4 | Datas | Não batem entre si: "Inscrições até 28/01" (cards de resumo), "Prazo final: 30/10 às 18h00" (edital) e cronograma de 15/08 a 30/10. |
| P-T5 | Links | "Baixar edital e documentos" e "Preencher formulário de inscrição" estão sem link. |
| P-T6 | Ícones | Trocar os ícones provisórios pelos SVGs exportados do Figma: benefícios (4), ✓ da lista e seta das perguntas (`CaretCircleDown`). |
| P-T7 | Foto do "Sobre" | O texto alternativo foi escrito por nós. |
