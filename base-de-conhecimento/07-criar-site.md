# 07 — Criar um site (domínio) novo no projeto

[← Voltar ao índice](../DOCUMENTACAO.md)

**Risco: 🔴 todos os sites.** O site novo precisa ser registrado na parte compartilhada, e por isso o deploy republica **todos** os sites. **Teste no computador:** `npm run build` e depois `npm test` (tudo).

**Exemplo:** criar o site **Sampa Games** em `oranilom.com.br/homolog/sampa-games/`.

> O passo a passo técnico, com todos os comandos, está em [docs/NOVO_SITE.md](../docs/NOVO_SITE.md). Aqui está o **mapa do que mexer**, para você entender o processo.

---

## Visão geral: o que um site novo exige

| # | O quê | Onde | Por quê |
|---|---|---|---|
| 1 | **Copiar um site modelo** | `sites/tech/` → `sites/games/` | O Sampa Tech é o modelo mais completo (topo, submenu, página interna, 404) |
| 2 | **Dar nome ao site** | `sites/games/package.json` (`name` e `description`) e `sites/games/astro.config.mjs` (`configurarSite('games')`) | Para o projeto saber que é um site diferente |
| 3 | **Registrar o endereço** | [packages/ui/src/data/institucional.ts](../packages/ui/src/data/institucional.ts) → `SITES` | Define o endereço e a pasta no servidor. **É isso que cria o "domínio"** dentro do projeto |
| 4 | **Instalar** | `npm install` na raiz | Para o projeto reconhecer a pasta nova. O arquivo `package-lock.json` muda e deve ir junto no commit |
| 5 | **Limpar o conteúdo copiado** | `src/pages/`, `src/content/`, `src/content.config.ts`, `src/assets/` e `src/styles/site.css` do site novo | Tirar as páginas do Sampa Tech e colocar as do Games |
| 6 | **Ligar o site ao resto** | `institucional.ts` → `MENU_PROJETOS` e `RODAPE` | Para o logo no Menu de projetos e os links do rodapé levarem ao site novo |
| 7 | **Preparar o servidor** | No servidor da KingHost: a pasta `www/homolog/sampa-games/` com o arquivo `.adesampa-site` | Proteção: o deploy **só publica** numa pasta que tenha esse marcador |
| 8 | **Testar e publicar** | `npm run build` + `npm test`, depois commit e push | — |
| 9 | **Documentar** | Esta base (um `0X-mapa-games.md`) e a `docs/` | Ver [abaixo](#9-documentar) |

---

## Os pontos que mais confundem

### 3. O registro em `SITES`

No `institucional.ts`, copie o bloco do `tech` e adapte:

```ts
games: {
  rotulo: 'Sampa Games',
  url: {
    teste: 'https://oranilom.com.br/homolog/sampa-games/',
    producao: 'https://oranilom.com.br/homolog/sampa-games/',
  },
  pastaFtp: { teste: 'homolog/sampa-games', producao: 'homolog/sampa-games' },
  publicar: true,
},
```

- O endereço (`url`) **termina** com `/`.
- A pasta do servidor (`pastaFtp`) **não começa** com `/`.
- Duas pastas iguais dão erro no teste.
- Hoje `teste` e `producao` apontam para o mesmo lugar. Quando existir o domínio definitivo (ex.: `sampagames.com.br`), basta trocar o `producao`.

### 5. Limpar o conteúdo copiado

| Pasta ou arquivo | O que fazer |
|---|---|
| `src/pages/` | Manter `index.astro` e `404.astro`; apagar `vaitec/` |
| `src/content/paginas/` | Manter `inicio.md` (trocando os textos); apagar `vaitec.md` |
| `src/content.config.ts` | Apagar a coleção `vaitec` e ajustar os campos de `inicio` |
| `src/assets/` | Trocar fotos e logos |
| `src/styles/site.css` | Trocar as cores do programa no bloco `:root` (ex.: `--games-001`) |
| `src/pages/index.astro` | Ajustar o submenu (nome, logo e links) |

### 7. O marcador no servidor

Antes do **primeiro** deploy, pelo gerenciador de arquivos da KingHost:
1. crie a pasta `www/homolog/sampa-games/`;
2. dentro dela, crie um arquivo chamado `.adesampa-site` (com o ponto no começo), cujo **único conteúdo** é o nome do site: `games`.

Sem esse arquivo, o deploy desse site **para com erro e não envia nada**. É uma proteção contra sobrescrever a pasta errada.

> **Nunca** use as pastas antigas `www/teia/` nem `www/sampa-tech/`.

### Site que incorpora mapa ou vídeo de outro site

Por segurança, o servidor bloqueia conteúdo de outros endereços. Se o site novo tiver um mapa do Google ou um vídeo do YouTube, é preciso liberar **só aquele endereço** no arquivo `sites/games/public/.htaccess` (ver [docs/RECEITAS.md](../docs/RECEITAS.md#incorporar-conteúdo-de-outro-site-mapa-vídeo)).

---

## O que acontece sozinho

- O site novo entra **automaticamente** em todos os testes (cabeçalho e rodapé idênticos, links, responsividade e acessibilidade).
- O deploy passa a publicar o site novo, sem configurar nada no GitHub.
- A **comparação com o Figma** é a única que precisa ser configurada à mão (`tests/visual/figma-games.json`), e é opcional.

---

## 9. Documentar

| Onde | O quê |
|---|---|
| Esta base | Criar `base-de-conhecimento/0X-mapa-games.md` (copie o [mapa do Sampa Tech](02-mapa-sampa-tech.md) como modelo) e acrescentar a linha no [índice](../DOCUMENTACAO.md) |
| [00 — Visão geral](00-visao-geral.md) | Acrescentar o site na tabela de sites |
| [README.md](../README.md) | A linha na tabela "Sites" |
| [docs/DEPLOY.md](../docs/DEPLOY.md) | A linha na tabela "Sites e pastas no FTP" |
| `docs/` | Criar `CONTEUDO_GAMES.md` e `DECISOES_GAMES.md` e acrescentar o site em `ONDE_MUDAR.md` |
