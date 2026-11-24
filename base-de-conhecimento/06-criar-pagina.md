# 06 — Criar uma página (ou uma seção) num site que já existe

[← Voltar ao índice](../DOCUMENTACAO.md)

**Risco: 🟡 um site.** **Teste no computador:** `npm run build` e depois `npm test -- build <site>` (ex.: `npm test -- build home`).

---

## Criar uma página nova

**Exemplo:** criar a página "Eventos" em `oranilom.com.br/homolog/comunicacao/eventos/`, no site Home.

Uma página nova envolve **até 5 lugares**. Eles seguem as 3 camadas:

| # | Camada | Arquivo | O que fazer |
|---|---|---|---|
| 1 | 🧱 Estrutura | `sites/home/src/pages/comunicacao/eventos/index.astro` | **Criar.** A pasta define o endereço. O caminho mais curto é **copiar uma página parecida** e apagar as seções que não servem |
| 2 | 📝 Conteúdo | `sites/home/src/content/paginas/eventos.md` | **Criar** com os textos da página (título, descrição, textos das seções) |
| 3 | 📝 Regras do conteúdo | [sites/home/src/content.config.ts](../sites/home/src/content.config.ts) | **Registrar** o arquivo novo: dizer quais campos ele tem e quais são obrigatórios |
| 4 | 🎨 Visual | [sites/home/src/styles/site.css](../sites/home/src/styles/site.css) | **Só se precisar.** Reaproveite as classes que já existem (abaixo) |
| 5 | 🔗 Acesso | um link para a página | No menu ou no rodapé ([institucional.ts](../packages/ui/src/data/institucional.ts), 🔴) ou num botão de outra página (campo `link:` no `.md`, 🟢) |

O **código pronto** de cada passo (com o esqueleto da página para copiar) está em [docs/RECEITAS.md — Criar uma página nova](../docs/RECEITAS.md#criar-uma-página-nova).

### Qual página copiar?

| Quero uma página… | Copie |
|---|---|
| Com topo simples e seções de texto | `sites/home/src/pages/sobre/index.astro` |
| Com seções que se repetem (uma por item) | `sites/home/src/pages/comunicacao/produtos-digitais/index.astro` |
| Com carrosséis de cards | `sites/home/src/pages/comunicacao/publicacoes/index.astro` |
| Provisória ("em construção"), sem conteúdo ainda | `sites/home/src/pages/parcerias-governamentais/index.astro` |
| De programa, com submenu e perguntas | `sites/tech/src/pages/vaitec/index.astro` |

### Três ajustes que todo `.astro` novo precisa

1. **O item ativo do menu:** `ativo="comunicacao"` no `<BaseLayout …>` (ver [04](04-mapa-compartilhado.md#item-ativo-do-menu)).
2. **A trilha do topo** ("Início > Comunicação > Eventos"), no `<Hero trilha={…}>`.
3. **Os `../../../`** dos `import`: eles dependem de quantas pastas existem entre o arquivo e `src/`. Uma página em `pages/comunicacao/eventos/` precisa de `../../../`; uma em `pages/eventos/`, de `../../`.

### Página provisória

Para publicar uma página "em construção", acrescente `semIndexacao` no `<BaseLayout>`: assim ela fica fora do Google. Retire quando a página definitiva estiver pronta.

---

## Criar uma seção nova numa página existente

**Exemplo:** uma seção "Nossa história" na página Sobre. São os mesmos 4 lugares de sempre:

| # | Camada | Arquivo | O que fazer |
|---|---|---|---|
| 1 | 📝 Conteúdo | [paginas/sobre.md](../sites/home/src/content/paginas/sobre.md) | Acrescentar um bloco `historia:` com `titulo:` e `texto:` |
| 2 | 📝 Regras | [content.config.ts](../sites/home/src/content.config.ts), na coleção `sobre` | Declarar o campo `historia` |
| 3 | 🧱 Estrutura | [pages/sobre/index.astro](../sites/home/src/pages/sobre/index.astro) | Acrescentar a `<section>` no ponto da página onde ela deve aparecer |
| 4 | 🎨 Visual | [site.css](../sites/home/src/styles/site.css) | Só se as classes prontas não bastarem |

O código de cada passo está em [docs/RECEITAS.md — Criar uma seção nova](../docs/RECEITAS.md#criar-uma-seção-nova-numa-página).

> 📏 Se a página é comparada com o Figma (Início, Sobre, Comunicação, Publicações, Sampa Tech, Vai Tec, Teia), uma seção nova **no meio** dela muda a numeração das seções seguintes no teste. Atualize o `tests/visual/figma-<site>.json` (ver [docs/TESTES.md](../docs/TESTES.md#comparação-com-o-figma)).

---

## Classes prontas (Home)

Use estas classes para a página ou seção nova já sair com as medidas e cores do Figma, sem escrever CSS:

| Classe | O que faz |
|---|---|
| `secao` | O espaço vertical padrão de uma seção |
| `secao--clara`, `secao--escura`, `secao--marinho`, `secao--royal`, `secao--clara-sem-borda` | Cores de fundo |
| `container` | Centraliza o conteúdo na largura máxima do site |
| `h-display`, `h-secao`, `h-card`, `h-5` | Títulos, do maior para o menor |
| `texto-1`, `texto-2` | Parágrafos (grande e normal) |
| `etiqueta`, `etiqueta--solida` | A "tag" em letras maiúsculas acima dos títulos |
| `quebras` | Respeita as quebras de linha `\n` do conteúdo |

O Sampa Tech e o Teia têm classes parecidas. Abra o começo do `site.css` de cada um para ver.

---

## Regras que os testes vão conferir na página nova

A página nova entra **sozinha** nos testes de responsividade e acessibilidade, em 5 larguras de tela (do celular pequeno ao computador). Garanta que:

- existe **um único título principal** (`<h1>`) na página; os outros títulos são `<h2>`, `<h3>`…;
- **toda imagem** tem descrição (`alt`);
- **nada fica mais largo que a tela** do celular (sem rolagem para o lado);
- botões e links têm **tamanho bom para o dedo** no celular (44 × 44 px);
- as cores de texto têm **contraste** suficiente;
- não há **estilo nem script escrito dentro** do `.astro` (`style="…"`, `<style>`, `<script>` com código). CSS vai no `site.css`.

Se algo falhar, veja [10 — Erros comuns](10-erros-comuns.md).

---

## Depois de criar

- Atualize o **mapa do site** nesta base ([01](01-mapa-home.md), [02](02-mapa-sampa-tech.md) ou [03](03-mapa-teia.md)) com a página nova.
- Atualize também a doc técnica: `docs/CONTEUDO_<SITE>.md` e, se algo ficou diferente do Figma, `docs/DECISOES_<SITE>.md`.
