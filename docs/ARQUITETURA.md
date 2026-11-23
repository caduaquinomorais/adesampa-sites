# Arquitetura

Como as peças do projeto se encaixam. Para "onde mudo tal coisa", veja [ONDE_MUDAR.md](ONDE_MUDAR.md).

## Visão geral

```
            packages/ui  (cabeçalho, menu, rodapé, layout, cores base, mapa dos sites)
                 │
     ┌───────────┼───────────┬───────────┐
 sites/home  sites/tech  sites/teia  sites/exemplo
     │           │           │
   build       build       build          (Astro gera HTML estático em dist/)
     │           │           │
   FTP         FTP         FTP            (GitHub Actions → KingHost)
     ▼           ▼           ▼
 /homolog/  /homolog/sampa-tech/  /homolog/teia/
```

- É um **monorepo**: um repositório com vários projetos. O `package.json` da raiz declara os *workspaces* (`packages/*` e `sites/*`), e o npm instala tudo de uma vez e liga os pacotes entre si.
- Cada site importa o pacote compartilhado como `@adesampa/ui` (ex.: `import BaseLayout from '@adesampa/ui/BaseLayout.astro'`). A lista do que pode ser importado está em `exports`, no `packages/ui/package.json`.
- A saída é **100% estática**. O servidor só entrega arquivos e não roda código. Isso deixa o site rápido, barato e com pouca superfície de ataque.

## O pacote compartilhado (`packages/ui`)

| Arquivo | Papel |
|---|---|
| `src/data/institucional.ts` | **Fonte única** de: mapa dos sites (`SITES`), textos e links do cabeçalho (`CABECALHO`), Menu de projetos (`MENU_PROJETOS`) e rodapé (`RODAPE`). |
| `src/config.ts` | `configurarSite(nome)`: a configuração do Astro comum a todos os sites. |
| `src/integracao.ts` | Roda depois do build: ajusta o `.htaccess`, cria o cache de `/_astro/` e **falha** se houver script ou estilo inline. |
| `src/layouts/BaseLayout.astro` | Esqueleto de toda página: `<head>`, fonte, link "pular para o conteúdo", cabeçalho, submenu opcional, `<main>` e rodapé. |
| `src/components/` | `Header.astro`, `Footer.astro`, `Submenu.astro` e `SkipLink.astro`. |
| `src/scripts/menu.ts` | Comportamento do menu: ☰ no celular, abrir e fechar o Menu de projetos, teclado (Esc, Tab). |
| `src/lib/caminhos.ts` | `caminho('sobre/')`: endereço interno que respeita a pasta do site. |
| `src/lib/links.ts` | `atributosLink(url)`: valida o link e devolve `href`, ou marca como pendente. |
| `src/styles/tokens.css` | Variáveis comuns: cores (`--empreende-001`…), tamanhos de fonte (`--fs-h2`…), espaçamentos e raios. |
| `src/styles/header-footer.css` | Estilos do cabeçalho, do menu e do rodapé (variáveis `--hf-*`). |
| `assets/` | Fonte Geist (`fonts/`) e ícones e logos do cabeçalho, do menu e do rodapé (`icons/`). |

## Um site por dentro

Todo `sites/<nome>/astro.config.mjs` tem só isto:

```js
import { configurarSite } from '@adesampa/ui/config';
export default configurarSite('home');
```

O resto é padrão:

| Pasta ou arquivo | Papel |
|---|---|
| `src/pages/` | **Rotas.** `pages/index.astro` = página inicial; `pages/sobre/index.astro` = `/sobre/`; `pages/404.astro` = página de erro. |
| `src/content/` + `src/content.config.ts` | **Conteúdo editável.** Os textos ficam em `.md` (no bloco entre `---`) ou `.yaml`. O `content.config.ts` define os campos de cada arquivo com [zod](https://zod.dev) (`z.string()`, `z.array(…)`…). Se faltar um campo ou o tipo estiver errado, **o build falha** e aponta o arquivo e o campo. |
| `src/components/` | Peças reaproveitadas **só deste site** (botão, hero, cards…). |
| `src/assets/` | Imagens processadas pelo Astro, que gera WebP/AVIF em vários tamanhos e põe um hash no nome. |
| `src/styles/site.css` | Estilos das páginas. Começa com as variáveis de cor do site (`:root`) e termina com os blocos de celular e tablet (`@media`). |
| `src/lib/conteudo.ts` | Funções de apoio, como `attrs(link)`, que transforma o link escrito no conteúdo em atributos de `<a>`. |
| `public/` | Arquivos copiados **sem processamento** (`.htaccess`, PDFs). |

### Como uma página lê o conteúdo

```astro
---
import { getEntry } from 'astro:content';
const entrada = await getEntry('sobre', 'sobre');   // coleção "sobre", arquivo sobre.md
const p = entrada.data;                              // os campos, já validados
---
<h1>{p.hero.titulo}</h1>
```

## Endereços: ambientes, `site` e `base`

Cada site tem um endereço por **ambiente**, definido no mapa `SITES` em `institucional.ts`:

```ts
tech: {
  url: { teste: 'https://oranilom.com.br/homolog/sampa-tech/', producao: '…' },
  pastaFtp: { teste: 'homolog/sampa-tech', producao: '…' },
  publicar: true,
},
```

- O ambiente vem da variável `ADESAMPA_AMBIENTE` (`teste` ou `producao`; vazio = `teste`).
- `configurarSite` divide a URL em `site` (`https://oranilom.com.br`) e `base` (`/homolog/sampa-tech/`). Todo o HTML gerado usa essa base.
- Hoje, `teste` e `producao` apontam para o mesmo lugar. **Quando houver o domínio definitivo, basta mudar `producao`.** Nenhum outro arquivo tem endereço fixo.

Por isso existem duas funções para escrever links:

| Situação | Use | Resultado no teste |
|---|---|---|
| Link para uma página **do mesmo site**, num `.astro` | `caminho('vaitec/')` | `/homolog/sampa-tech/vaitec/` |
| Link no **conteúdo** (`.md`), para o mesmo site | `link: 'vaitec/'` (sem barra no começo) | o mesmo (convertido por `attrs()`) |
| Link para **outro site** do projeto | `resolverDestino(pagina('home', 'sobre/'), ambienteAtual())` | `https://oranilom.com.br/homolog/sobre/` |
| Link no cabeçalho, no menu ou no rodapé | `pagina('teia', '#podcast')` em `institucional.ts` | resolvido sozinho |

## Links pendentes

Um link vazio (`''`) é **pendente**: o texto ou o botão aparece, mas sem `href`, com `data-link-pendente="true"`. Assim dá para publicar a página antes de ter todos os endereços.
- Para achar todos: busque `TODO-LINK` no projeto.
- O mesmo vale para links inválidos ou perigosos (`javascript:`, `data:`…): `atributosLink()` os transforma em pendentes. Links externos ganham `rel="noopener noreferrer"`.

## Segurança (CSP) e o servidor

O `public/.htaccess` de cada site manda cabeçalhos de segurança para o navegador. O principal é a **Content-Security-Policy** (CSP):

```
script-src 'self'; style-src 'self'; img-src 'self'; frame-src 'none'; …
```

Em termos simples, o navegador só executa scripts e estilos que vêm de **arquivos do próprio site**. Isso bloqueia a maioria dos ataques de injeção, mas tem consequências:

- **Proibido:** `<script>código</script>`, `<style>`, `style="…"` e `onclick="…"`. O `integracao.ts` **falha o build** se encontrar algum.
- JavaScript vai num arquivo `.ts`, importado num `<script>` do Astro (que vira arquivo em `/_astro/`).
- Conteúdo de outro site (mapa, vídeo) precisa ser liberado na CSP **daquele site**. O Teia, por exemplo, libera `frame-src https://www.google.com` para o Google My Maps.
- Imagens e fontes também precisam ser locais (`img-src 'self'`), e não de um CDN.

Outras regras do `.htaccess`:
- `ErrorDocument 404 __BASE__404.html`: o `__BASE__` é trocado pela pasta do site no build.
- **Cache:** o HTML sempre é revalidado (`no-cache`); os arquivos de `/_astro/` (com hash no nome) ficam em cache por 1 ano; o resto, por 1 dia.
- Arquivos ocultos (`.adesampa-site`, `.htaccess`) dão 404.
- **Nunca** use `php_value` ou `php_flag`: dá erro 500 na KingHost (o build bloqueia).

## Cabeçalho e rodapé idênticos

O requisito central do projeto é que o `<header>` e o `<footer>` sejam **iguais, byte a byte**, em todas as páginas de todos os sites. A única variação permitida é o item ativo do menu (`ativo="comunicacao"`). O teste `tests/build/identidade.mjs` garante isso.

O **submenu** (a faixa abaixo do cabeçalho, com o logo do programa e âncoras) é a parte que cada site personaliza. Ele fica fora do `<header>`. Detalhes em [HEADER_FOOTER.md](HEADER_FOOTER.md).

## Acessibilidade e responsividade

- O Figma só tem a versão de 1440 px. As versões de tablet (< 1024 px) e celular (< 768 px) foram decididas no código (ver H-07 em `DECISOES_HOME.md`).
- Abaixo de 1024 px, todo link ou botão tem alvo de toque de pelo menos 44 × 44 px.
- Cores do Figma sem contraste suficiente foram ajustadas e estão marcadas com `AA:` no CSS.
- O site funciona sem JavaScript: o menu abre com `:hover` e `:focus-within`, e as perguntas usam `<details>`. O JavaScript só melhora a experiência.
- Mapas e conteúdos de terceiros só carregam no clique (LGPD e desempenho).

## Do push à publicação

```
push no main
  → testes      (check, build em teste e em produção, unitários, identidade, links)
  → visuais     (um job por site, em paralelo, no Chrome: referência, Figma, responsividade e acessibilidade)
  → planejar    (scripts/deploy-plano.mjs: o que mudou desde o último deploy bem-sucedido?)
  → deploy      (um site por vez, por FTPS, conferindo o marcador .adesampa-site; depois confere no ar)
```

Detalhes em [DEPLOY.md](DEPLOY.md) e [TESTES.md](TESTES.md).
