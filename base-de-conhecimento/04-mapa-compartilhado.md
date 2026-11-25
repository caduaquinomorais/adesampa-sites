# 04 — Partes compartilhadas (cabeçalho, menu, rodapé, cores gerais)

[← Voltar ao índice](../DOCUMENTACAO.md)

**Risco: 🔴 todos os sites.** Tudo o que está aqui fica em [packages/ui/](../packages/ui/) e aparece em **todos os sites ao mesmo tempo**. Uma mudança aqui é publicada em todos eles no próximo deploy.

**Teste no computador:** `npm run build` e depois `npm test` (tudo). Veja [08 — Testes](08-testes.md).

---

## O mapa

| Parte | 📝 Conteúdo (textos e links) | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Cabeçalho** (logo, menu, botão "Agendamentos") | [institucional.ts](../packages/ui/src/data/institucional.ts) → `CABECALHO` | [Header.astro](../packages/ui/src/components/Header.astro) | [header-footer.css](../packages/ui/src/styles/header-footer.css) |
| **Menu de projetos** (abre em "Programas") | `institucional.ts` → `MENU_PROJETOS` | `Header.astro` | `header-footer.css`, procure `.mega` |
| **Menu Comunicação** (lista que abre em "Comunicação") | `institucional.ts` → `CABECALHO.menu`, item `comunicacao`, campo `submenu` | `Header.astro` | `header-footer.css`, procure `.dropdown` |
| **Rodapé** | `institucional.ts` → `RODAPE` | [Footer.astro](../packages/ui/src/components/Footer.astro) | `header-footer.css`, procure `.site-footer` |
| **Submenu** (faixa do programa abaixo do cabeçalho) | **Cada site define o seu**, na própria página (ver os mapas [02](02-mapa-sampa-tech.md) e [03](03-mapa-teia.md)) | [Submenu.astro](../packages/ui/src/components/Submenu.astro) | `header-footer.css`, procure `.submenu` |
| **Abrir e fechar o menu** (☰ no celular, teclado) | — | [scripts/menu.ts](../packages/ui/src/scripts/menu.ts) | — |
| **Topo preso nas páginas com submenu** (o cabeçalho some ao rolar para baixo e volta ao subir; o submenu fica) | — | [layouts/BaseLayout.astro](../packages/ui/src/layouts/BaseLayout.astro) + fim do [scripts/menu.ts](../packages/ui/src/scripts/menu.ts) | `header-footer.css`, procure `.topo-fixo` |
| **Esqueleto de toda página** (cabeçalho + conteúdo + rodapé, fonte, título da aba) | — | [layouts/BaseLayout.astro](../packages/ui/src/layouts/BaseLayout.astro) | — |
| **Cores, tamanhos de texto e espaçamentos gerais** | — | — | [tokens.css](../packages/ui/src/styles/tokens.css) |
| **Fonte** (Geist) | — | — | [packages/ui/assets/fonts/](../packages/ui/assets/fonts/) |
| **Logos e ícones** do cabeçalho, do menu e do rodapé | — | — | [packages/ui/assets/icons/](../packages/ui/assets/icons/) |
| **Endereço de cada site** (teste e produção) e pasta no servidor | `institucional.ts` → `SITES` | — | — |

---

## O arquivo `institucional.ts`, parte por parte

Este é o arquivo de **conteúdo** das partes compartilhadas. Ele não é YAML: é código, mas as partes que você edita seguem um padrão simples.

| Bloco | O que tem |
|---|---|
| `SITES` | O endereço e a pasta no servidor de cada site |
| `CABECALHO.menu` | Os itens do menu principal (Home, Sobre, Programas, Comunicação…). O campo `submenu` de um item é a lista que abre embaixo dele (hoje, só em Comunicação) |
| `CABECALHO.botaoTexto` e `botaoLink` | O botão azul "Agendamentos" |
| `MENU_PROJETOS.eixos` | As 5 colunas de programas. `link` = para onde vai o **logo**; `links` = os itens abaixo dele |
| `MENU_PROJETOS.espacos` | "Espaços e plataformas" (Teia, Produtos digitais, Praça) |
| `RODAPE.redes` | Os botões das redes sociais (na ordem da tela) |
| `RODAPE.colunas` | As colunas de links do rodapé |
| `RODAPE.legais` | Termos, Privacidade e Acessibilidade |
| `RODAPE.empresa`, `cnpj`, `endereco`, `copyright` | Os textos do rodapé |

### Como escrever um link aqui

```ts
link('Transparência')                                    // sem destino = pendente (aparece, mas não clica)
link('Sampa Ensina', 'https://sampaensina.sp.gov.br/')   // endereço externo
link('Sobre nós', pagina('home', 'sobre/'))              // página de um site deste projeto
link('Estúdios de podcast', pagina('teia', '#podcast'))  // trecho de uma página de outro site
```

Para páginas do próprio projeto, use sempre `pagina('nome-do-site', 'caminho/')`. Assim o endereço é montado sozinho, e o teste confere se a página existe.

### Link vazio: o item aparece ou some?

| Onde | Sem link, o item… |
|---|---|
| Os itens **abaixo dos logos dos programas** (Menu de projetos) | **Some do site.** Se nenhum item do programa tem link, aparece só o logo |
| O **logo** do programa | Aparece sempre, mas só clica quando tiver link |
| "Espaços e plataformas", menu principal, menu Comunicação e rodapé | Aparece, mas não clica |

**Exemplo:** hoje os itens do Sampa Empreende estão escritos assim e, por isso, não aparecem:

```ts
link('Linhas de crédito'),
```

Quando a página existir, preencha o destino e o item aparece sozinho:

```ts
link('Linhas de crédito', 'https://www.exemplo.sp.gov.br/credito'),
```

Ou seja: **não apague** os itens que ainda não têm página. Deixe o texto escrito e só acrescente o link quando ele existir. Tudo isso fica em [institucional.ts](../packages/ui/src/data/institucional.ts), no bloco `MENU_PROJETOS`.

---

## O cuidado mais importante

| Mudança | É seguro? | O que fazer |
|---|---|---|
| Trocar **só o destino** de um link | ✅ Sim | Basta mudar e testar |
| Mudar o **texto** de um item do cabeçalho ou do rodapé | ⚠️ Exige um passo a mais | Atualize também os 3 arquivos da referência (abaixo) |
| **Acrescentar ou remover** itens do menu principal ou do rodapé | ⚠️ Exige um passo a mais | Atualize também os 3 arquivos da referência (abaixo) |
| Mudar o **Menu de projetos** | ✅ Sim | Ele não existe na referência |
| Mudar os itens do **menu Comunicação** (`submenu`) | ✅ Sim | Ele também não existe na referência |

**Por quê?** Um teste compara o cabeçalho e o rodapé de cada site, **pixel a pixel**, com um modelo original guardado em [referencia/header-footer/](../referencia/header-footer/). Se o texto muda no site mas não no modelo, o teste acusa diferença.

**Os 3 arquivos da referência:**
- [config.php](../referencia/header-footer/config.php);
- [exemplo.html](../referencia/header-footer/exemplo.html) (é a página que o teste compara);
- [html/header.html](../referencia/header-footer/html/header.html) ou [html/footer.html](../referencia/header-footer/html/footer.html).

Item novo no **menu principal** tem mais passos (criar a "chave" do item e marcar as páginas). Veja [docs/HEADER_FOOTER.md](../docs/HEADER_FOOTER.md#item-novo-no-menu-principal).

---

## Item ativo do menu

Cada página diz a qual item do menu ela pertence, e esse item fica sublinhado. Isso é definido **na própria página**, com `ativo="…"` no `BaseLayout`:

```astro
<BaseLayout titulo="Publicações" ativo="comunicacao">
```

Opções: `home`, `sobre`, `programas`, `comunicacao`, `transparencia` e `governamental`.

---

## Cores gerais × cores de um site

| Quero mudar… | Onde |
|---|---|
| Uma cor, um tamanho de texto ou um espaçamento usado em **todos os sites** (ex.: a cor oficial do Sampa Tech, `--tech-001`) | [tokens.css](../packages/ui/src/styles/tokens.css) 🔴 |
| A cor do **cabeçalho, do menu ou do rodapé** | [header-footer.css](../packages/ui/src/styles/header-footer.css) (variáveis `--hf-…`) 🔴 |
| Uma cor só das páginas de **um site** | O bloco `:root` no começo do `site.css` daquele site 🟡 |

Prefira sempre mudar a **variável** (ex.: `--azul-600: #1158D4;`) a trocar a cor em cada lugar. Mudou a variável, mudam todos os usos de uma vez.

> **Contraste:** o teste mede se todo texto tem contraste suficiente com o fundo (regra AA). Antes de clarear ou escurecer uma cor de texto, confira em [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

---

## Por que existe um teste só para o cabeçalho e o rodapé?

O requisito central do projeto é que o cabeçalho e o rodapé sejam **idênticos em todas as páginas de todos os sites**. A única diferença permitida é o item ativo do menu. Por isso:
- **nunca** copie o cabeçalho ou o rodapé para dentro de um site;
- **nunca** copie um ícone do cabeçalho para a pasta de um site. Se precisar dele numa página, importe de `@adesampa/ui/assets/icons/…`.

**Para se aprofundar:** [docs/HEADER_FOOTER.md](../docs/HEADER_FOOTER.md) e [docs/ARQUITETURA.md](../docs/ARQUITETURA.md).
