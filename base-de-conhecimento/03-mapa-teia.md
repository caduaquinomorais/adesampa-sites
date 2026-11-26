# 03 — Mapa do Teia

[← Voltar ao índice](../DOCUMENTACAO.md)

**Pasta do site:** [sites/teia/](../sites/teia/) · **Endereço de teste:** oranilom.com.br/homolog/teia/

O Teia tem **uma página só**, e quase tudo dela está em **um único arquivo de conteúdo**:

- 📝 **Conteúdo:** [sites/teia/src/content/paginas/teia.md](../sites/teia/src/content/paginas/teia.md)
- 🧱 **Estrutura:** [sites/teia/src/pages/index.astro](../sites/teia/src/pages/index.astro)
- 🎨 **Visual:** [sites/teia/src/styles/site.css](../sites/teia/src/styles/site.css)
- ⚙️ **Comportamento** (carrossel de fotos, seletor de unidade, mapa interativo): [sites/teia/src/scripts/teia.ts](../sites/teia/src/scripts/teia.ts)

> O cabeçalho, o menu e o rodapé estão em [04 — Partes compartilhadas](04-mapa-compartilhado.md).

> Atenção: existe um **Teia antigo** no servidor (`www/teia/`). Ele **não** faz parte deste projeto. Nunca mexa nele.

---

## A página, seção por seção

| Seção | 📝 Conteúdo (em `teia.md`) | 🧱 Estrutura (em `index.astro`) | 🎨 Visual (procure no `site.css`) |
|---|---|---|---|
| **Submenu** (faixa com o logo do Teia e os links para os espaços) | Montado **sozinho** a partir de `espacos`, mais os links de mapa e dúvidas | variável `submenu` no topo do arquivo | (compartilhado: ver [04](04-mapa-compartilhado.md)) |
| **Banner** (etiqueta, título, texto e botões) | `banner`. Foto de fundo: `assets/fotos/banner-fundo.jpg` | `<section class="hero">` | `Banner` e `.hero` |
| **Os espaços** (Coworking, Podcast, Fotografia, Música), um bloco para cada, com fotos | `espacos` (um item por espaço; fotos em `fotos`) | `<section class="space">` (o fundo alterna sozinho) | `Espaços` e `.space` |
| **Botões "Mapa dos Teias" e "Faça seu agendamento"** | `textoBotaoMapa`, `textoBotaoAgendamento` e `linkAgendamento` | dentro de cada espaço | `Botões` |
| **Mapa** (unidades e mapa interativo) | `mapa` (as unidades ficam em `mapa.unidades`) | `<section class="map-section">` | `Mapa` e `.map-section` |
| **Dúvidas frequentes** | `duvidas.itens` | `<section class="faq">` | `Dúvidas frequentes` e `.faq` |
| **Normas de uso** (PDFs para baixar) | `normas.documentos`. PDFs em `sites/teia/public/documentos/` (crie a pasta no primeiro PDF) | `<section class="rules">` | `Normas de uso` e `.rules` |
| **Página de erro 404** | — | [pages/404.astro](../sites/teia/src/pages/404.astro) | `Página 404` |

---

## Regras especiais do Teia

| Situação | O que acontece |
|---|---|
| Uma **dúvida sem resposta** | Ela **não aparece** no site. Basta escrever a `resposta` para ela surgir |
| Um espaço com **2 fotos ou mais** | Aparecem os pontinhos do carrossel sozinhos |
| **2 unidades ou mais** no mapa | Aparece sozinho o seletor "Escolha a unidade" |
| Um documento das normas com `arquivo: ''` | O card aparece, mas **sem** o botão "Baixar PDF" |
| `mapa.embed` vazio | Fica só a prévia do mapa (imagem), sem o mapa interativo |
| Um **espaço novo** | O link no submenu usa o `titulo` do espaço. Os 4 atuais têm nomes curtos definidos no `index.astro` (🟡) |

> O mapa interativo é do Google My Maps. Ele carrega sozinho quando a pessoa rola até perto do mapa, e o painel da unidade continua ao lado. Para isso, o servidor do Teia libera o endereço `https://www.google.com` (regra no arquivo [sites/teia/public/.htaccess](../sites/teia/public/.htaccess)). As unidades do mapa interativo são editadas no próprio My Maps, sem deploy.

Para acrescentar espaços, fotos, unidades, dúvidas ou documentos, veja [05 — Cards e listas](05-cards-e-listas.md#teia).

---

## Imagens

| O quê | Onde |
|---|---|
| Fotos dos espaços, banner e mapa | [sites/teia/src/assets/fotos/](../sites/teia/src/assets/fotos/) |
| Ícones (seta, PDF) e logos brancos (ADE SAMPA, Prefeitura) | [sites/teia/src/assets/icones/](../sites/teia/src/assets/icones/) |
| Logo do Teia (o mesmo do menu) | `packages/ui/assets/icons/logo-teia.svg` (compartilhado, 🔴) |

**Para se aprofundar:** [docs/CONTEUDO_TEIA.md](../docs/CONTEUDO_TEIA.md) e [docs/DECISOES_TEIA.md](../docs/DECISOES_TEIA.md).
