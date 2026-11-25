# Cabeçalho, menu, submenu e rodapé

Estas partes são **iguais em todos os sites**. Elas existem num lugar só, e uma mudança aqui é publicada em **todos** os sites no próximo deploy (o deploy entende que mudou `packages/` e publica tudo).

| O quê | Dados (textos e links) | Marcação | Estilo |
|---|---|---|---|
| Cabeçalho (logo, menu, botão "Agendamentos") | `CABECALHO` | `Header.astro` | `header-footer.css` |
| Menu de projetos (abre em "Programas") | `MENU_PROJETOS` | `Header.astro` | `header-footer.css` (`.mega…`) |
| Menu Comunicação (lista simples) | `submenu` do item `comunicacao` em `CABECALHO.menu` | `Header.astro` | `header-footer.css` (`.dropdown…`) |
| Rodapé | `RODAPE` | `Footer.astro` | `header-footer.css` (`.site-footer…`) |
| Submenu do programa (opcional) | na própria página do site | `Submenu.astro` | `header-footer.css` (`.submenu…`) |
| Abrir e fechar o menu (☰, teclado) | — | `scripts/menu.ts` | — |

Os dados ficam em `packages/ui/src/data/institucional.ts`, e o resto em `packages/ui/src/` (`components/`, `styles/`, `scripts/`).

## Mudar um link

Em `institucional.ts`, todo item tem um texto e um **destino**:

```ts
link('Transparência')                                     // '' = pendente: aparece, mas não clica
link('Sampa Ensina', 'https://sampaensina.sp.gov.br/')    // endereço externo
link('Sobre nós', pagina('home', 'sobre/'))               // página de um site deste projeto
link('Estúdios de podcast', pagina('teia', '#podcast'))   // âncora numa página de outro site
```

Prefira `pagina(site, caminho)` para páginas do projeto. O endereço completo é montado conforme o ambiente (teste ou produção), pelo mapa `SITES`. O teste de links confere se a página e a âncora existem.

**Exemplo:** ligar "Termos de uso" no rodapé.
```ts
legais: [link('Termos de uso', 'https://www.adesampa.com.br/termos'), link('Privacidade (LGPD)'), …],
```

### Link vazio: aparece ou some?

| Onde | Sem destino (`link('Texto')` ou `link: ''`) |
|---|---|
| Itens abaixo dos logos dos programas (`MENU_PROJETOS.eixos[].links`) | **Some.** O `Header.astro` filtra com `.filter((l) => l.link)`; se nenhum item do programa tem destino, a lista inteira (`<ul class="mega__links">`) não é desenhada e fica só o logo. O texto continua em `institucional.ts` e volta sozinho quando o destino for preenchido |
| Logo do programa (`eixos[].link`) | Aparece sempre; só não clica (e não cresce no hover) |
| Espaços e plataformas, menu principal, submenu Comunicação, rodapé | Aparece, mas não clica (pendente) |

Para ocultar itens vazios em outro bloco, aplique o mesmo `.filter((l) => l.link)` no `.map` correspondente do `Header.astro` ou do `Footer.astro`. Decisão: H-15 em [DECISOES_HOME.md](DECISOES_HOME.md).

### Partes do `institucional.ts`

| Bloco | O que tem |
|---|---|
| `SITES` | Endereço e pasta no FTP de cada site, por ambiente (ver [ARQUITETURA.md](ARQUITETURA.md#endereços-ambientes-site-e-base)). |
| `CABECALHO.menu` | Itens do menu principal. Cada um tem uma `chave` (`'home'`, `'sobre'`, `'programas'`, `'comunicacao'`, `'transparencia'`, `'governamental'`), um `rotulo`, um `link` e `seta` (mostra a setinha). Com `submenu` (lista de `link(...)`), o item vira um menu suspenso, como "Comunicação". |
| `CABECALHO.botaoTexto` / `botaoLink` | O botão azul "Agendamentos". |
| `MENU_PROJETOS.eixos` | As 5 colunas de programas (Sampa Empreende, Tech, Games, Verde e Criativa). `link` = para onde vai o **logo**; `links` = os itens abaixo dele. **Item sem destino fica oculto** (ver abaixo). |
| `MENU_PROJETOS.espacos` | Grupos de "Espaços e plataformas" (Teia, Produtos digitais, Praça Victor Civita). `link` = para onde vai o **título** do grupo; `links` = os itens. |
| `RODAPE.redes` | Botões das redes sociais (a ordem da lista é a ordem na tela). |
| `RODAPE.colunas` | Colunas de links do rodapé. `cor` = cor da barrinha ao lado do título. |
| `RODAPE.legais` | Termos, Privacidade e Acessibilidade. |
| `RODAPE.empresa`, `cnpj`, `endereco`, `copyright` | Os textos do rodapé. |

## Mudar um texto, acrescentar ou remover itens

Mudar só o **destino** de um link é seguro. Já mudar um **texto**, acrescentar ou remover itens do menu principal ou do rodapé muda a aparência, e o teste visual que compara com a referência (`visual: <site> — cabeçalho e rodapé iguais à referência`) vai acusar diferença.

Nesse caso, atualize também a referência em `referencia/header-footer/`, nos 3 arquivos:
- `config.php`, os dados no modelo PHP original;
- `exemplo.html`, a página que o teste compara;
- `html/header.html` ou `html/footer.html`, as versões em HTML puro.

> O **Menu de projetos** não existe na referência (foi criado depois, a partir do Figma). Mudanças nele não exigem atualizar `referencia/`.

### Menu suspenso de um item (ex.: Comunicação)

Qualquer item do menu principal pode ganhar uma lista suspensa. Basta o campo `submenu`:

```ts
{
  chave: 'comunicacao', rotulo: 'Comunicação', link: pagina('home', 'comunicacao/'), seta: true,
  submenu: [
    link('Notícias', pagina('home', 'comunicacao/noticias/')),
    link('Contato', pagina('home', 'comunicacao/#contato')),
  ],
},
```

- Com `submenu`, o item vira um **botão** que abre a lista (igual a "Programas"), e o `link` do item não aparece no cabeçalho. Por isso, a página principal da seção precisa estar **dentro** da lista (no caso de Comunicação, "Central de conteúdo").
- Para mudar, acrescentar ou remover itens da lista, edite só o `submenu`. A lista não existe na referência, e não é preciso atualizar `referencia/`.
- Comportamento: `scripts/menu.ts` (o mesmo de "Programas"). Visual: `.dropdown` em `header-footer.css`.

### Item novo no menu principal

1. Em `institucional.ts`, acrescente a chave nova no tipo `ChaveMenu`:
   ```ts
   export type ChaveMenu = 'home' | 'sobre' | … | 'governamental' | 'eventos';
   ```
2. Acrescente o item em `CABECALHO.menu`, na posição desejada:
   ```ts
   { chave: 'eventos', rotulo: 'Eventos', link: pagina('home', 'eventos/'), seta: false },
   ```
3. Atualize os 3 arquivos de `referencia/header-footer/` (ver acima).
4. Nas páginas que pertencem a essa seção, marque o item como ativo: `<BaseLayout titulo="…" ativo="eventos">`.

Confira em 390 px (celular) se o menu continua cabendo. Os testes de responsividade avisam se aparecer rolagem horizontal.

### Logo novo no Menu de projetos

Os logos dos programas são SVGs em `packages/ui/assets/icons/menu-*.svg`, com 28 px de altura. A lista e as larguras ficam em `LOGOS_EIXOS`, no topo do `Header.astro`. Logo com `link` cresce 5% ao passar o mouse; os pendentes ficam parados.

## Item ativo do menu

Cada página diz a que seção pertence com a prop `ativo` do `BaseLayout`:

```astro
<BaseLayout titulo="Publicações" ativo="comunicacao">
```

O item fica sublinhado em azul e ganha `aria-current`. É a **única** diferença permitida entre os cabeçalhos das páginas.

## Submenu do programa

É a faixa clara abaixo do cabeçalho, com o logo do programa e links para as seções (ex.: Sampa Tech, Teia). Diferente do cabeçalho, **cada site monta o seu**, passando a prop `submenu` ao `BaseLayout`:

```astro
<BaseLayout
    titulo="Sampa Tech"
    ativo="programas"
    submenu={{
        rotulo: 'Sampa Tech',              // nome do programa (texto alternativo do logo)
        logo: logoTech,                    // import logoTech from '../assets/logos/….svg?url'
        logoLargura: 92, logoAltura: 9,
        logoLink: caminho(),               // para onde o logo leva
        links: [
            { rotulo: 'Aceleração Vai Tec', link: caminho('vaitec/') },
            { rotulo: 'Dúvidas', link: '#duvidas' },
        ],
    }}
>
```

Sem `submenu`, a faixa não aparece. Como fica fora do `<header>`, ela não entra no teste de identidade.

**Topo fixo:** com `submenu`, o `BaseLayout` coloca o cabeçalho e o submenu dentro de `<div class="topo-fixo" data-topo-fixo>`, preso no topo (`position: sticky`).
- Rolando para baixo, o cabeçalho desliza para cima (200 ms, classe `is-recolhido`) e o submenu fica sozinho no topo. Rolando para cima, o cabeçalho volta.
- O cabeçalho nunca se esconde no começo da página, com um menu aberto ou com o foco do teclado dentro dele.
- As âncoras (`#secao`) param abaixo do topo fixo, com 16 px de folga (`scroll-padding-top`).
- Código: `scripts/menu.ts` (fim do arquivo) e `.topo-fixo` em `header-footer.css`. Páginas sem submenu (Home) não mudam.

## Garantias (testes)

- **Identidade** (`tests/build/identidade.mjs`): o `<header>` e o `<footer>` são iguais, byte a byte, em todas as páginas de todos os sites (fora o item ativo).
- **Referência** (`tests/visual/comparar.mjs`): o cabeçalho e o rodapé de cada site são comparados, pixel a pixel, com `referencia/header-footer/exemplo.html` em 4 larguras, inclusive com o menu do celular aberto.
- **Links** (`tests/build/links.mjs`): todo link para uma página do projeto existe, inclusive as `#âncoras`.

## Correções em relação à referência

O CSS veio do projeto Teia (`adesampa-header-footer`), com 3 correções intencionais. O teste aplica as mesmas correções à referência antes de comparar.

| Código | Correção |
|---|---|
| C-1 | `:is(...) a { color: inherit }` virou `:where(...)`. Antes, a regra vencia as cores do botão "Agendamentos", dos links do menu e dos links do rodapé, que herdavam a cor da página. |
| C-2 | `.site-header` define a própria cor de texto (o botão "Menu" não depende mais da página). |
| C-3 | Abaixo de 1024 px, os links do rodapé têm alvo de toque de 44 × 44 px (eram 32 px de altura). |

Outras mudanças, como a grafia de "Atendimento", o Menu de projetos e os logos como links, estão em H-08 e H-09 de [DECISOES_HOME.md](DECISOES_HOME.md).
