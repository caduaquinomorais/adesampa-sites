# 11 — Histórico de mudanças

[← Voltar ao índice](../DOCUMENTACAO.md)

O que foi feito em cada commit, do mais recente para o mais antigo, com os arquivos mexidos. Serve para tirar dúvidas como "quando isso mudou?" ou "onde está aquilo?".

- **Linhas:** são as linhas do arquivo **depois** da mudança (ex.: `144–171` = da linha 144 à 171). "Arquivo novo" = o arquivo inteiro foi criado; "só remoções" = só foram apagadas linhas.
- **Commits grandes** (criação de site, dezenas de arquivos): aparecem as pastas principais, e não linha por linha.
- **Ver o commit completo:** no GitHub, `https://github.com/caduaquinomorais/adesampa-sites/commit/<código>`. No computador: `git show <código>`.
- **Mudanças ainda sem commit** aparecem no topo, como "commit pendente", com a mensagem sugerida. O código entra depois do commit.

---

## Commit pendente — Cabeçalho some ao rolar para baixo nas páginas com submenu (25/11/2026)

**Mensagem sugerida:** "Cabeçalho some ao rolar para baixo e volta ao subir nas páginas com submenu; histórico de mudanças"

Nas páginas dos programas que têm submenu (Sampa Tech, Vai Tec e Teia), o cabeçalho e o submenu ficam presos no topo. Rolando para baixo, o cabeçalho desliza para cima e o submenu fica sozinho no topo; rolando para cima, o cabeçalho volta. Vale em todas as telas. A Home não muda, porque não tem submenu.

| Arquivo | Linhas | O quê |
|---|---|---|
| `packages/ui/src/layouts/BaseLayout.astro` | 53–60 | Com submenu, cabeçalho + submenu ficam dentro de um bloco preso ao topo (`topo-fixo`) |
| `packages/ui/src/styles/header-footer.css` | 223–232 | Topo preso, deslizar em 200 ms e folga das âncoras abaixo do topo |
| `packages/ui/src/scripts/menu.ts` | 99–139 | Esconde o cabeçalho ao descer e mostra ao subir; nunca esconde no começo da página nem com um menu aberto |
| `sites/tech/src/styles/site.css` | 40 | Folga das âncoras passou para o arquivo compartilhado |
| `tests/visual/comparar.mjs` | 68–70, 72 | O teste do cabeçalho "solta" o topo preso antes de comparar (preso, a suavização das letras muda alguns pixels) |
| `docs/HEADER_FOOTER.md` | seção "Submenu do programa" | Documentação do comportamento |
| `base-de-conhecimento/11-historico.md` | arquivo novo | Este histórico |
| `DOCUMENTACAO.md` | tabela "Quero…" | Link para este histórico |

---

## 6ce06dc — Correção ao último commit (25/11/2026)

O teste do Vai Tec barrou o deploy porque as listas Temas e Dúvidas mudaram de tamanho com o conteúdo novo. As 4 seções de lista passaram a ter altura livre no teste (decisão T-06).

| Arquivo | Linhas |
|---|---|
| `tests/visual/figma-tech.json` | 20–23 |
| `docs/DECISOES_TECH.md` | 62–67 |

## 374895b — Correção dos arquivos de texto e efeito dos cards de eixos (25/11/2026)

- **Hover dos cards dos 5 eixos** (Início e Sobre): ao passar o mouse, aparece a versão branca com logo, texto e botão "Saiba mais" (decisão H-14).
- **Arquivos de texto:** foram apagados os comentários (linhas com `#`) de vários `.md` e `.yaml`; no Vai Tec, entrou um tema e saiu uma pergunta das Dúvidas.

| Arquivo | Linhas |
|---|---|
| `sites/home/src/components/Eixos.astro` | 2–9, 17–22, 33–44, 53–64 |
| `sites/home/src/content/eixos.yaml` | arquivo novo |
| `sites/home/src/content.config.ts` | 10, 65–70, 225 |
| `sites/home/src/styles/site.css` | 144–171 |
| `sites/home/src/content/paginas/inicio.md` | 18, 43 |
| `sites/home/src/content/paginas/sobre.md` | 26 |
| `sites/tech/src/content/paginas/vaitec.md` | 58, 100–101 |
| `categorias.yaml`, `destaques.yaml`, `publicacoes.yaml`, `comunicacao.md`, `produtos-digitais.md`, `publicacoes.md` (Home), `inicio.md` (Tech), `teia.md` | só remoções (comentários) |
| `docs/DECISOES_HOME.md` · `docs/CONTEUDO_HOME.md` · `base-de-conhecimento/01-mapa-home.md` | 185–195 · 17 · 43 |

## 08bd1e9 — Link sem destino some do cabeçalho, carrossel automático (24/11/2026)

- Itens do cabeçalho sem destino deixam de aparecer.
- O carrossel passa as fotos sozinho.

| Arquivo | Linhas |
|---|---|
| `packages/ui/src/components/Header.astro` | 10–271 (reorganizado) |
| `packages/ui/src/data/institucional.ts` | 201, 244–260 |
| `sites/home/src/scripts/carrossel.ts` | 40, 42, 46 |
| `sites/home/src/pages/index.astro` | 121 |
| `docs/DECISOES_HOME.md` · `docs/HEADER_FOOTER.md` · `base-de-conhecimento/04-mapa-compartilhado.md` | 176–184 · 34–43, 51 · 56–77 |

## 282b087 — Menu Comunicação e galeria automática (24/11/2026)

- **Menu Comunicação:** lista suspensa com Notícias, Publicações, Central de conteúdo, Manual de marcas, Manual de redação e Contato (decisão H-13).
- **Galeria de fotos** da Início passando sozinha.

| Arquivo | Linhas |
|---|---|
| `packages/ui/src/data/institucional.ts` | 152–156, 175–189, 391 |
| `packages/ui/src/components/Header.astro` | 7–8, 81–90 |
| `packages/ui/src/scripts/menu.ts` | 15–96 (os dois menus suspensos usam o mesmo código) |
| `packages/ui/src/styles/header-footer.css` | 153, 155, 199–222, 356–363 |
| `sites/home/src/components/Galeria.astro` | 5–74 |
| `sites/home/src/scripts/carrossel.ts` | 40–57 |
| `sites/home/src/pages/index.astro` | várias (reformatação) |
| `docs/DECISOES_HOME.md` · `docs/HEADER_FOOTER.md` · `base-de-conhecimento/01` e `04` | 154–175 · 9, 39, 59–76 · — |

## df579d4 — Documentação para a equipe e README (24/11/2026)

Criação da `DOCUMENTACAO.md` e da pasta `base-de-conhecimento/` (guias 00 a 10).

| Arquivo | Linhas |
|---|---|
| `DOCUMENTACAO.md` | arquivo novo |
| `base-de-conhecimento/00` a `10` | arquivos novos |
| `tests/rodar.mjs` | 4, 18, 36–41 |
| `docs/TESTES.md` | 13, 16–17 |

## 6a10874 — Documentação técnica (contexto para o Claude) (23/11/2026)

README e guias técnicos em `docs/`.

| Arquivo | Linhas |
|---|---|
| `README.md` | arquivo novo |
| `docs/ARQUITETURA.md`, `FIGMA.md`, `HEADER_FOOTER.md`, `NOVO_SITE.md`, `RECEITAS.md`, `TESTES.md` | arquivos novos |
| `docs/ONDE_MUDAR.md` · `docs/DEPLOY.md` · `docs/PROMPT_ADESAMPA_SITES.md` | 5–6, 134–136 · 34 · 3–4 |

## 6b607d3 — Página Produtos digitais e títulos do Menu de projetos como links (23/11/2026)

- Página nova `/comunicacao/produtos-digitais/`, com os logos e os 9 ícones do Figma (decisão H-12).
- No Menu de projetos, "Teia" e "Produtos digitais" viraram links; Sampa Ensina, Gestão Sampa e Data Sampa levam às seções da página nova.

| Arquivo | Linhas |
|---|---|
| `sites/home/src/pages/comunicacao/produtos-digitais/index.astro` | arquivo novo |
| `sites/home/src/content/paginas/produtos-digitais.md` | arquivo novo |
| `sites/home/src/components/IconeProduto.astro` | arquivo novo |
| `sites/home/src/assets/icones/produtos/*.svg` (9) e `assets/produtos/logo-*.svg` (3) | arquivos novos |
| `sites/home/src/content.config.ts` | 4–5, 197–218 |
| `sites/home/src/styles/site.css` | 433–451, 476–478, 522–525 |
| `packages/ui/src/data/institucional.ts` | 195–196, 243, 251–260, 375–376 |
| `packages/ui/src/components/Header.astro` | 72 |
| `packages/ui/src/styles/header-footer.css` | 192–194, 331 |
| `docs/DECISOES_HOME.md` · `docs/CONTEUDO_HOME.md` · `docs/ONDE_MUDAR.md` | 110, 141–152, 162 · 15 · 21 |

## 9db9521 — Logos do Menu de projetos como links e deploy com 3 tentativas (23/11/2026)

- Os 5 logos do Menu de projetos viraram links (só o Sampa Tech com destino por enquanto), com um leve zoom no hover.
- O deploy tenta enviar até 3 vezes, com pausas, porque a KingHost às vezes recusa a conexão.
- Guia "Onde mudar o quê" criado.

| Arquivo | Linhas |
|---|---|
| `packages/ui/src/data/institucional.ts` | 188–189, 211, 222–223, 227, 235 |
| `packages/ui/src/components/Header.astro` | 60 |
| `packages/ui/src/styles/header-footer.css` | 184–189 |
| `.github/workflows/testes.yml` | 182, 295–323, 379–383 |
| `docs/ONDE_MUDAR.md` | arquivo novo |
| `docs/DEPLOY.md` · `docs/DECISOES_HOME.md` | 18–19, 42 · 108–109 |

## fa9dbf2 — Teia no projeto e testes visuais em paralelo (23/11/2026)

- Site novo `sites/teia/`, publicado em `/homolog/teia/`, com o mapa interativo carregado só no clique. O Teia antigo (`www/teia/`) continua no ar sem mudanças.
- Os testes visuais passaram a rodar um site por vez, em paralelo.

Principais pastas: `sites/teia/` (site inteiro), `tests/visual/` (referência e `figma-teia.json`), `.github/workflows/testes.yml`, `packages/ui/src/data/institucional.ts` (site no mapa `SITES` e links do menu e do rodapé), `sites/home/src/content/paginas/inicio.md` (links "Saiba mais" do Teia) e `docs/` (`DECISOES_TEIA.md`, `CONTEUDO_TEIA.md`).

## 3db12e8 — Site Sampa Tech e correção do "Atendimento" no rodapé (23/11/2026)

- Site novo `sites/tech/`, publicado em `/homolog/sampa-tech/`, com as páginas Sampa Tech e Aceleração Vai Tec.
- O rodapé dizia "Atendimenro"; corrigido em todos os sites.

Principais pastas: `sites/tech/` (site inteiro), `tests/visual/` (referências e `figma-tech.json`), `referencia/header-footer/` (correção do rodapé), `packages/ui/src/data/institucional.ts` e `docs/` (`DECISOES_TECH.md`, `CONTEUDO_TECH.md`, `DEPLOY.md`).

## 91309ae — Parcerias governamentais e item "Governamental" no cabeçalho (19/11/2026)

- Seção "Parcerias governamentais" na Início, com carrossel de fotos (decisão H-11).
- Item "Governamental" no cabeçalho, levando a uma página provisória ("Em construção").

| Arquivo | Linhas |
|---|---|
| `sites/home/src/pages/index.astro` | 55–70 |
| `sites/home/src/pages/parcerias-governamentais/index.astro` | arquivo novo |
| `sites/home/src/content/paginas/inicio.md` | 20–33 |
| `sites/home/src/content.config.ts` | 88–95 |
| `sites/home/src/components/Galeria.astro` | 6, 12, 25–28 |
| `sites/home/src/styles/site.css` | 271–292, 454 |
| `packages/ui/src/data/institucional.ts` | 125, 151–152 |
| `referencia/header-footer/config.php` · `exemplo.html` · `html/header.html` | 29 · 46–49 · 33–36 |
| `tests/visual/figma-home.json` · `tests/visual/paginas.mjs` | 2, 10–15 · 48–51 |
| `docs/DECISOES_HOME.md` · `docs/CONTEUDO_HOME.md` | 123–137, 147 · 11, 19 |

## 0223cd0 — Menu de projetos, deploy pelo último sucesso e transições do Figma (19/11/2026)

- "Programas" passa a abrir o Menu de projetos, com os logos dos 5 programas (decisão H-09).
- O deploy compara com o último deploy que deu certo, para não perder mudanças de um deploy que falhou.

| Arquivo | Linhas |
|---|---|
| `packages/ui/src/components/Header.astro` | 7–18, 26–33, 48–81 |
| `packages/ui/src/data/institucional.ts` | 147–148, 156–220, 331–332 |
| `packages/ui/src/scripts/menu.ts` | 14–66 |
| `packages/ui/src/styles/header-footer.css` | 147–189, 232, 306–322 |
| `packages/ui/assets/icons/menu-*.svg` (5) | arquivos novos |
| `scripts/deploy-plano.mjs` | 8–9, 12, 22 |
| `.github/workflows/testes.yml` | 103–105, 118–131 |
| `sites/home/src/styles/site.css` | 230, 232 |
| `tests/build/identidade.mjs` · `tests/visual/comparar.mjs` | 24–25 · 78–87 |
| `docs/DECISOES_HOME.md` · `docs/DEPLOY.md` | 94–122 · 1–31 |

## 48c0ad8 — Abertura do Chrome mais resistente nos testes (17/11/2026)

| Arquivo | Linhas |
|---|---|
| `tests/lib/chrome.mjs` | 63–113 |

## ea1ac80 — Links das redes sociais e hovers (17/11/2026)

Links do Instagram, LinkedIn, YouTube e Facebook no rodapé; hover dos botões das redes e dos cards "Nosso impacto" e "Produtos digitais" (decisão H-10).

| Arquivo | Linhas |
|---|---|
| `packages/ui/src/data/institucional.ts` | 190–193 |
| `packages/ui/src/styles/header-footer.css` | 189–193 |
| `sites/home/src/styles/site.css` | 229–239 |
| `referencia/header-footer/` (`config.php`, `exemplo.html`, `html/footer.html`, `assets/css/header-footer.css`) | links e hover iguais aos do site |

## ce366b4 — Links das publicações e primeira versão do mapa do Teia na Início (17/11/2026)

| Arquivo | Linhas |
|---|---|
| `sites/home/src/content/publicacoes.yaml` | 3–67 (campo `arquivo` de cada publicação) |
| `sites/home/src/pages/index.astro` | 86–97 |
| `sites/home/src/scripts/mapa.ts` | arquivo novo |
| `sites/home/src/content.config.ts` | 72, 100–112 |
| `sites/home/src/content/paginas/inicio.md` | 37–40 |
| `sites/home/src/pages/comunicacao/publicacoes/index.astro` | 39 |
| `sites/home/src/styles/site.css` | 213–217 |
| `sites/home/public/.htaccess` | 32 (libera o Google My Maps) |
| `docs/DECISOES_HOME.md` | 48–53 |

## 9f83224 — Notícias de exemplo (17/11/2026)

Três notícias novas, para testar o caminho de publicação.

| Arquivo | Linhas |
|---|---|
| `sites/home/src/content/noticias/feira-empreendedora-fim-de-ano.md`, `microcredito-orientacao-gratuita.md`, `teia-novas-turmas-coworking.md` | arquivos novos |

## 0d39528 — Testes visuais estáveis no Linux (17/11/2026)

| Arquivo | Linhas |
|---|---|
| `tests/lib/chrome.mjs` | 87–89 |
| `tests/visual/comparar.mjs` | 184–196, 270 |

## a9b2328 — Deploy automático na KingHost (17/11/2026)

| Arquivo | Linhas |
|---|---|
| `.github/workflows/testes.yml` | 1–23, 44–47, 86–307 (jobs de deploy) |
| `scripts/deploy-plano.mjs` | arquivo novo |
| `tests/rodar.mjs` | 37–45 |

## a2a5850 — Testes de identidade, links e CI (17/11/2026)

| Arquivo | Linhas |
|---|---|
| `.github/workflows/testes.yml` | arquivo novo |
| `tests/build/identidade.mjs`, `tests/build/links.mjs`, `tests/build/lib.mjs`, `tests/unit/links.test.mjs` | arquivos novos |
| `tests/rodar.mjs` | 3–42 |
| `sites/exemplo/src/pages/index.astro` | 29–30 |

## 1dd6f0d — Site Home a partir do Figma (17/11/2026)

Primeira versão das páginas Início, Sobre, Comunicação, Notícias e Publicações.

Principais pastas: `sites/home/` (site inteiro: páginas, componentes, conteúdo, imagens e estilos) e `tests/visual/` (referências do Figma).

## ba93855 — Correções da revisão (16/11/2026)

| Arquivo | Linhas |
|---|---|
| `packages/ui/src/data/institucional.ts` | 43–52, 71, 141, 153, 183, 257 |
| `packages/ui/src/integracao.ts` | 15–20 |
| `sites/exemplo/public/.htaccess` | 46 |
| `tests/rodar.mjs` | 1–23 |
| `tests/visual/comparar.mjs` | 60–64, 191–217 |

## 1102587 — Criação do projeto: cabeçalho e rodapé compartilhados (16/11/2026)

Estrutura do repositório, pacote compartilhado (cabeçalho, rodapé, layout, cores e fonte), site de exemplo e cópia da referência do Teia.

Principais pastas: `packages/ui/` (componentes, estilos, ícones e fonte), `referencia/header-footer/`, `sites/exemplo/` e `tests/lib/`.
