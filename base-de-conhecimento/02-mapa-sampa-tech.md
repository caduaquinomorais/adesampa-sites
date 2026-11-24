# 02 — Mapa do Sampa Tech

[← Voltar ao índice](../DOCUMENTACAO.md)

**Pasta do site:** [sites/tech/](../sites/tech/) · **Endereço de teste:** oranilom.com.br/homolog/sampa-tech/

Para cada seção: 📝 **Conteúdo** (o que aparece), 🧱 **Estrutura** (como é montada) e 🎨 **Visual** (o termo que você procura com Ctrl+F no [site.css](../sites/tech/src/styles/site.css)).

> O cabeçalho, o menu e o rodapé estão em [04 — Partes compartilhadas](04-mapa-compartilhado.md).

---

## Arquivos de conteúdo

Todos ficam em [sites/tech/src/content/paginas/](../sites/tech/src/content/paginas/):

| Arquivo | O que guarda |
|---|---|
| [inicio.md](../sites/tech/src/content/paginas/inicio.md) | Página Sampa Tech: topo e lista de programas (hoje, só o Vai Tec) |
| [vaitec.md](../sites/tech/src/content/paginas/vaitec.md) | Página Aceleração Vai Tec: todas as seções |

Fotos e logos: [sites/tech/src/assets/](../sites/tech/src/assets/) (`fotos/`, `logos/` e `icones/`).

---

## Página Sampa Tech (inicial)

**Endereço:** /homolog/sampa-tech/ · **🧱 Estrutura:** [pages/index.astro](../sites/tech/src/pages/index.astro) · **📝 Conteúdo:** [inicio.md](../sites/tech/src/content/paginas/inicio.md)

| Seção | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Submenu** (faixa com o logo do Sampa Tech) | Os links são montados **sozinhos** a partir da lista `programas` | `index.astro` (prop `submenu`) | `Submenu` |
| **Topo** (fundo azul-petróleo e selo) | `inicio.md` → `hero`. Foto: `assets/fotos/hero-sampa-tech.jpg` | [components/Hero.astro](../sites/tech/src/components/Hero.astro) + [Selo.astro](../sites/tech/src/components/Selo.astro) | `Hero` e `Selo` |
| **Um bloco por programa** (status, texto, lista com ✓, botão e card "Resumo do Edital") | `inicio.md` → `programas` (um item por programa) | `index.astro` + [Status.astro](../sites/tech/src/components/Status.astro) e [Resumo.astro](../sites/tech/src/components/Resumo.astro) | `.programa`, `Situação das inscrições` e `Card "Resumo do Edital"` |

---

## Página Aceleração Vai Tec

**Endereço:** /homolog/sampa-tech/vaitec/ · **🧱 Estrutura:** [pages/vaitec/index.astro](../sites/tech/src/pages/vaitec/index.astro) · **📝 Conteúdo:** [vaitec.md](../sites/tech/src/content/paginas/vaitec.md)

| Seção | 📝 Conteúdo | 🧱 Estrutura | 🎨 Visual |
|---|---|---|---|
| **Submenu** | `vaitec.md` → `submenu` | `vaitec/index.astro` | `Submenu` |
| **Topo** (status das inscrições e card de resumo) | `vaitec.md` → `hero`. Foto: `assets/fotos/hero-vaitec.jpg` | `Hero.astro` + `Status.astro` + `Resumo.astro` | `Hero` |
| **Sobre** (texto e foto) | `vaitec.md` → `sobre`. Foto: `assets/fotos/vaitec-sobre.jpg` | `vaitec/index.astro` | `Sobre` |
| **Benefícios** (cards com ícone) | `vaitec.md` → `beneficios.itens` | `vaitec/index.astro` + [Icone.astro](../sites/tech/src/components/Icone.astro) | `Benefícios` |
| **Temas abordados** (lista numerada) | `vaitec.md` → `temas.itens` | `vaitec/index.astro` | `Temas abordados` |
| **Quem pode se inscrever?** (perguntas que abrem e fecham) | `vaitec.md` → `quemPode.perguntas` | [Perguntas.astro](../sites/tech/src/components/Perguntas.astro) (versão escura) | `Perguntas` |
| **Cronograma** | `vaitec.md` → `cronograma.etapas` | `vaitec/index.astro` | `Cronograma` |
| **Dúvidas** | `vaitec.md` → `duvidas.perguntas` | `Perguntas.astro` (versão clara) | `Perguntas` |
| **Edital e inscrições** (botões e notas) | `vaitec.md` → `edital` | `vaitec/index.astro` | `Edital e inscrições` |

---

## Tarefas comuns (só conteúdo 🟢)

| Quero… | O que fazer |
|---|---|
| **Abrir ou fechar as inscrições** | Troque `status: { texto: 'Inscrições abertas', aberto: true }` por `{ texto: 'Inscrições encerradas', aberto: false }`. A bolinha fica cinza. Faça isso **nos dois arquivos**: `inicio.md` (no programa) e `vaitec.md` (no `hero`) |
| **Colocar o link do edital ou do formulário** | `vaitec.md` → `edital.botaoPrincipal.link` (PDF do edital) e `edital.botaoSecundario.link` (formulário) |
| **Responder uma dúvida** | `vaitec.md` → troque o `resposta:` da pergunta |
| **Mudar uma data do cronograma** | `vaitec.md` → `cronograma.etapas`. Use `\n` entre aspas duplas para quebrar a data em 2 linhas |

Para acrescentar perguntas, etapas, benefícios ou um programa novo, veja [05 — Cards e listas](05-cards-e-listas.md#sampa-tech).

---

## Peças reaproveitadas (componentes)

Ficam em [sites/tech/src/components/](../sites/tech/src/components/):

| Componente | O que é |
|---|---|
| `Hero.astro` | Topo azul-petróleo com os losangos |
| `Selo.astro` | A pílula "ADE SAMPA + Prefeitura" |
| `Status.astro` | A bolinha com "Inscrições abertas" ou "encerradas" |
| `Resumo.astro` | O card "Resumo do Edital" |
| `Perguntas.astro` | A lista de perguntas que abrem e fecham |
| `Icone.astro` | Os ícones desenhados no próprio código: `check`, `dinheiro`, `formacao`, `mentoria` e `rede` |
| `Botao.astro` e `Breadcrumb.astro` | Botão e trilha "Início > Programas > …" |

---

## Cores e estilos gerais

No começo do [site.css](../sites/tech/src/styles/site.css), no bloco `:root`, ficam as variáveis de cor do Sampa Tech. No fim do arquivo ficam os ajustes de tablet (`max-width: 1023px`) e de celular (`max-width: 767px`).

**Para se aprofundar:** [docs/CONTEUDO_TECH.md](../docs/CONTEUDO_TECH.md) e [docs/DECISOES_TECH.md](../docs/DECISOES_TECH.md).
