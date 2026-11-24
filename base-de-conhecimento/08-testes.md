# 08 — Testes: o que conferem, qual rodar e como rodar no computador

[← Voltar ao índice](../DOCUMENTACAO.md)

---

## Primeiro, o essencial

- O projeto tem **testes automáticos**: programas que abrem o site e conferem se nada quebrou.
- O **GitHub roda todos eles sozinho** a cada push. **Se algum falhar, nada é publicado**, e o site no ar continua como estava. Você não consegue "quebrar o site no ar" por acidente.
- Rodar os testes **no seu computador** é opcional, mas economiza tempo: o erro aparece em segundos, em vez de esperar o GitHub.
- Você **não precisa rodar tudo sempre**. O tipo de mudança define quais testes valem a pena (tabela abaixo).

---

## Qual teste rodar? (a tabela de decisão)

Sempre gere o site antes (`npm run build`): os testes conferem o site **já gerado**.

| O que você mudou | Risco | Comando | Tempo aproximado |
|---|---|---|---|
| Textos, links, fotos ou cards em `.md` ou `.yaml` | 🟢 | `npm test -- build` | segundos |
| Uma notícia nova | 🟢 | `npm test -- build` | segundos |
| **Bastante** conteúdo (cards a mais, textos bem maiores) | 🟢+ | `npm test -- build home` (troque `home` pelo site) | alguns minutos |
| Visual (`site.css`), estrutura (`.astro`), componente ou página nova de **um site** | 🟡 | `npm test -- build home` (troque `home` pelo site) | alguns minutos |
| Só o **destino** de um link do cabeçalho, do menu ou do rodapé (`institucional.ts`) | 🔴 leve | `npm test -- unitários build` | segundos |
| Texto ou itens do cabeçalho ou do rodapé, cores gerais (`tokens.css`), qualquer coisa em `packages/ui/` | 🔴 | `npm test` (tudo) | vários minutos |
| Um site novo | 🔴 | `npm test` (tudo) | vários minutos |
| Só documentação (`docs/`, `base-de-conhecimento/`, `README.md`) | — | nenhum | — |

**Por que "bastante conteúdo" pede o teste do site?** Mais cards podem criar uma linha nova numa seção, e algumas seções têm a altura conferida com o Figma. Textos muito longos também podem "estourar" a largura do celular. Veja [05 — Cards e listas](05-cards-e-listas.md#quando-o-teste-do-figma-reprova-depois-de-acrescentar-cards).

### Como funciona o filtro

O `npm test` é uma **fila de baterias** de teste. A(s) palavra(s) depois do `--` escolhem quais baterias rodam: roda toda bateria que tiver **qualquer uma** das palavras no nome.

| Bateria (nome) | O que confere | Tempo |
|---|---|---|
| `unitários: links e mapa de sites` | Se os links e o cadastro dos sites (`SITES`) estão bem escritos | segundos |
| `build: identidade do cabeçalho e do rodapé` | Se o cabeçalho e o rodapé são **idênticos** em todas as páginas de todos os sites | segundos |
| `build: links internos, assets e esquemas proibidos` | Se **todo link** leva a uma página que existe e se toda imagem, fonte e arquivo existem | segundos |
| `visual: <site> — cabeçalho e rodapé iguais à referência` | Se o cabeçalho e o rodapé estão iguais, pixel a pixel, ao modelo original, em 4 tamanhos de tela | ~1 min por site |
| `visual: <site> × Figma (1440 px)` | Se cada seção tem a mesma altura do desenho no Figma (tolerância de 4 px) | ~1 min por site |
| `visual: <site> — páginas (responsividade e acessibilidade)` | Em **todas** as páginas, em 5 tamanhos de tela: nada mais largo que a tela, letra de no mínimo 12 px, contraste de cores, botões grandes o bastante para o dedo, um só título principal, toda imagem com descrição, sem `id` repetido | 1 a 8 min por site |

Exemplos:

```bash
npm test                         # todas as baterias
npm test -- build                # as 2 baterias "build" (rápido)
npm test -- build home           # as 2 "build" + as 3 visuais da Home
npm test -- unitários build      # unitários + as 2 "build"
npm test -- "visual: tech "      # só as visuais do Sampa Tech
```

Se você digitar uma palavra que não existe em nenhuma bateria, o comando **avisa** e mostra a lista de nomes.

Além das baterias, o **próprio `npm run build` já é um teste**: ele para com erro se um arquivo de conteúdo tiver um campo faltando ou mal escrito, ou se houver estilo ou script escrito dentro do HTML.

---

## Preparar o computador (uma vez só)

Você precisa de:

| Programa | Para quê | Onde baixar |
|---|---|---|
| **Node.js 26.13.1** e npm 11 | Rodar o projeto (a versão exata está no arquivo [.nvmrc](../.nvmrc)) | nodejs.org |
| **Git** | Baixar o projeto e enviar as mudanças | git-scm.com |
| **VS Code** | Editar os arquivos e usar o terminal | code.visualstudio.com |
| **Google Chrome** ou **Microsoft Edge** | Só para os testes visuais | já costuma estar instalado |

Depois, no terminal do VS Code, **uma única vez**:

```bash
git clone https://github.com/caduaquinomorais/adesampa-sites.git
cd adesampa-sites
npm ci
```

O `npm ci` instala as ferramentas do projeto nas versões exatas. Rode de novo **sempre que o arquivo `package-lock.json` mudar** (por exemplo, depois de baixar mudanças de outra pessoa que criou um site novo).

---

## Rodar os testes no dia a dia

```bash
# 1. Baixe as mudanças mais recentes da equipe
git pull

# 2. (Opcional) Veja o site enquanto edita — atualiza a cada arquivo salvo
npm run dev -w sites/home        # Ctrl+C para parar

# 3. Gere os sites
npm run build

# 4. Rode os testes certos para a sua mudança (tabela acima)
npm test -- build
```

No fim, aparece `Todas as baterias passaram.` ou a lista do que falhou.

### Dicas

- **Ver todas as falhas de uma vez.** Por padrão, os testes param na primeira bateria que falha. Para continuar até o fim:
  - no PowerShell: `$env:ADESAMPA_TESTES_CONTINUAR=1; npm test`
  - no Git Bash: `ADESAMPA_TESTES_CONTINUAR=1 npm test`
- **Gerar um site só** é mais rápido (`npm run build -w sites/home`). Mas, se você mudou links **entre** sites, gere todos (`npm run build`), porque o teste de links confere os outros sites também.
- **O navegador não foi encontrado?** Os testes visuais usam o Chrome ou o Edge. Se nenhum for achado, defina o caminho do executável na variável `CHROME_PATH`.

---

## Ver o resultado dos testes visuais (imagens)

Os testes visuais salvam imagens para você **ver** a diferença. Elas ficam em `tests/visual/reports/` (essa pasta não vai para o GitHub):

| Pasta | O que tem |
|---|---|
| `reports/<site>/relatorio.html` | Cabeçalho e rodapé: o modelo, o site e as diferenças em vermelho |
| `reports/figma-<site>/relatorio.html` | Cada seção: o Figma, o site e as diferenças |
| `reports/paginas-<site>/` | Foto da página inteira, no celular (390 px) e no computador (1440 px) |

Abra o `relatorio.html` no navegador. No GitHub, as mesmas imagens ficam em **Actions → a execução → Artifacts** (`relatorios-visuais-<site>`), no fim da página.

---

## Testes no GitHub

A cada push, o GitHub roda **tudo**, nesta ordem:

```
1. confere os tipos (check)  →  2. gera os sites (build)  →  3. unitários, identidade e links
→  4. testes visuais (todos os sites ao mesmo tempo)  →  5. publica (só no main)
```

Acompanhe na aba **Actions** do repositório. ✅ verde = passou e publicou; ❌ vermelho = algo falhou e **nada foi publicado**. Clique na execução para ver o que falhou: as falhas aparecem como anotações no resumo.

---

## Quando o teste está "certo" em reprovar, mas a mudança foi de propósito

| Situação | O que atualizar |
|---|---|
| Uma seção ficou mais alta ou mais baixa que o Figma **de propósito** (mais cards, texto real maior) | A `altura` da seção em `tests/visual/figma-<site>.json` (ou `null`) |
| Mudou o texto ou os itens do cabeçalho ou do rodapé | Os 3 arquivos de `referencia/header-footer/` (ver [04](04-mapa-compartilhado.md#o-cuidado-mais-importante)) |
| Uma seção nova **no meio** de uma página comparada com o Figma | A numeração dos seletores em `tests/visual/figma-<site>.json` |

Esses ajustes são 🟡. Os detalhes estão em [docs/TESTES.md](../docs/TESTES.md).

Para entender uma mensagem de erro específica, veja [10 — Erros comuns](10-erros-comuns.md).
