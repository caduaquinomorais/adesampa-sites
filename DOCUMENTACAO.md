# Base de conhecimento — Sites ADE SAMPA

Este é o ponto de partida para quem vai **mexer nos sites** da ADE SAMPA, mesmo sem experiência em programação.

A ideia é simples: você diz **o que quer fazer** e a base mostra **em qual arquivo mexer**.

> **Comece por aqui:** se é a sua primeira vez no projeto, leia a [Visão geral](base-de-conhecimento/00-visao-geral.md). São 10 minutos de leitura, e o resto da base vai fazer muito mais sentido depois dela.

---

## A regra das 3 camadas

Toda parte de qualquer site deste projeto é formada por 3 camadas, cada uma num arquivo diferente:

| Camada | Pergunta que responde | Onde fica | Exemplo |
|---|---|---|---|
| 📝 **Conteúdo** | **O que** aparece? (textos, links, fotos, listas de cards) | `src/content/` (arquivos `.md` e `.yaml`) | O título "Destaques e oportunidades" |
| 🧱 **Estrutura** | **Em que ordem e de que forma** aparece? (seções, colunas, quais cards) | `src/pages/` e `src/components/` (arquivos `.astro`) | A seção de destaques vir depois dos eixos |
| 🎨 **Visual** | **Como** aparece? (cores, tamanhos, espaços, celular) | `src/styles/site.css` | O fundo azul-claro da seção |

Quase toda tarefa começa respondendo à pergunta: **"isto é conteúdo, estrutura ou visual?"**

---

## Níveis de risco

Cada guia diz o nível de risco da tarefa. O nível também define **quais testes rodar** (ver [Testes](base-de-conhecimento/08-testes.md)).

| Nível | O que você mexeu | Quem é afetado | Teste no computador |
|---|---|---|---|
| 🟢 **Conteúdo** | Só arquivos `.md` ou `.yaml` (textos, cards, fotos) | Só aquela página | `npm test -- build` (segundos) |
| 🟡 **Um site** | Layout, CSS, página nova ou componente de **um** site | Só aquele site | `npm test -- build home` (troque `home` pelo site; alguns minutos) |
| 🔴 **Todos os sites** | Cabeçalho, menu, rodapé, cores gerais, site novo | Todos os sites de uma vez | `npm test` (tudo; vários minutos) |

> Qualquer que seja o nível, o GitHub **sempre roda todos os testes** antes de publicar. Se algum falhar, nada vai para o ar. Rodar no computador serve para achar o erro mais cedo.

---

## Quero…

### Entender o projeto
| Quero… | Guia |
|---|---|
| Entender como o projeto funciona, as pastas e os termos usados | [00 — Visão geral](base-de-conhecimento/00-visao-geral.md) |

### Mudar o que já existe
| Quero… | Risco | Guia |
|---|---|---|
| Mudar um texto, link ou foto da **Home** (ADE SAMPA) | 🟢 | [01 — Mapa da Home](base-de-conhecimento/01-mapa-home.md) |
| Mudar um texto, link ou foto do **Sampa Tech** | 🟢 | [02 — Mapa do Sampa Tech](base-de-conhecimento/02-mapa-sampa-tech.md) |
| Mudar um texto, link ou foto do **Teia** | 🟢 | [03 — Mapa do Teia](base-de-conhecimento/03-mapa-teia.md) |
| Mudar o layout ou o visual de uma página | 🟡 | O mapa do site (01, 02 ou 03), nas colunas 🧱 e 🎨 |
| Mudar o cabeçalho, o menu, o rodapé, as cores gerais ou a fonte | 🔴 | [04 — Partes compartilhadas](base-de-conhecimento/04-mapa-compartilhado.md) |

### Criar coisas novas
| Quero… | Risco | Guia |
|---|---|---|
| Acrescentar mais cards (destaques, notícias, revistas, dúvidas…) | 🟢 ou 🟡 | [05 — Cards e listas](base-de-conhecimento/05-cards-e-listas.md) |
| Publicar uma notícia | 🟢 | [05 — Cards e listas](base-de-conhecimento/05-cards-e-listas.md#notícias) |
| Criar uma página nova num site que já existe | 🟡 | [06 — Criar uma página](base-de-conhecimento/06-criar-pagina.md) |
| Criar um site novo no projeto (ex.: Sampa Games) | 🔴 | [07 — Criar um site](base-de-conhecimento/07-criar-site.md) |

### Testar, publicar e resolver problemas
| Quero… | Guia |
|---|---|
| Saber o que cada teste confere, qual rodar e como rodar no meu computador | [08 — Testes](base-de-conhecimento/08-testes.md) |
| Publicar uma mudança e saber se ela chegou ao site | [09 — Publicação](base-de-conhecimento/09-publicacao.md) |
| Entender uma mensagem de erro | [10 — Erros comuns](base-de-conhecimento/10-erros-comuns.md) |
| Saber o que mudou em cada commit e em quais arquivos | [11 — Histórico de mudanças](base-de-conhecimento/11-historico.md) |

---

## E a pasta `docs/`?

A pasta [docs/](docs/) é a **documentação técnica**: tem código, decisões de projeto e detalhes de implementação. Ela é usada principalmente como **contexto para ferramentas de IA** (como o Claude) e para quem precisa se aprofundar. Os guias desta base apontam para ela quando vale a pena ir mais fundo.

**Ao mudar algo importante no projeto**, atualize as duas: a `docs/` (técnica) e esta base (para a equipe).
