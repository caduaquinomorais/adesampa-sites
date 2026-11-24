# 05 — Cards e listas: como acrescentar mais itens

[← Voltar ao índice](../DOCUMENTACAO.md)

Quase todo "card" dos sites (destaques, notícias, revistas, dúvidas, benefícios…) é **um item de uma lista** num arquivo de conteúdo. Para criar mais um card, **copie um item que já existe e troque os valores**. Não é preciso mexer no layout: a página monta o card novo sozinha.

---

## O método em 4 passos

1. **Ache a lista** na tabela do seu site (abaixo).
2. **Copie um item inteiro.** Ele começa no `- ` e vai até a linha antes do próximo `- `.
3. **Cole logo abaixo**, com **o mesmo recuo**, e troque os valores.
4. **Teste** com `npm run build` e `npm test -- build` (ver [08 — Testes](08-testes.md)).

**Exemplo:** um card novo em "Destaques e oportunidades", no arquivo [destaques.yaml](../sites/home/src/content/destaques.yaml).

```yaml
- id: game-dev                       ← card que já existia
  ordem: 2
  programa: games
  etiqueta: 'Sampa Games'
  titulo: 'Curso de game dev: inscrições abertas'
  texto: 'Confira os detalhes sobre o curso…'
  botao: { texto: 'Acesse a página do programa', link: '' }
- id: feira-criativa                 ← card NOVO (copiado e alterado)
  ordem: 5
  programa: criativa
  etiqueta: 'Sampa Criativa'
  titulo: 'Feira criativa de dezembro'
  texto: 'Expositores de moda, design e artesanato no centro da cidade.'
  botao: { texto: 'Saiba mais', link: 'https://…' }
```

Cuidados:
- Um `id` **nunca se repete**. Use letras minúsculas e hífens.
- Um campo com **opções fixas** (como `programa`) só aceita os valores listados no comentário do arquivo ou nas tabelas abaixo.
- Se o item tem **foto**, coloque o arquivo na pasta indicada e escreva a **descrição** (`alt`).

---

## 🟢 × 🟡: nem todo card é "só conteúdo"

| Símbolo | Significa |
|---|---|
| 🟢 | Basta copiar o item no arquivo de conteúdo |
| 🟡 | O card novo também precisa de uma **mudança no código** (normalmente um ícone ou logo novo). A tabela explica o motivo |
| 📏 | A seção tem a **altura conferida com o Figma**. Se o card novo criar uma nova linha, o teste visual vai reprovar. Ver [quando o Figma reprova](#quando-o-teste-do-figma-reprova-depois-de-acrescentar-cards) |

---

## Home

Arquivos em [sites/home/src/content/](../sites/home/src/content/).

| Lista | Onde | Campos de cada item | Tipo |
|---|---|---|---|
| **Destaques e oportunidades** (carrossel do Início) | [destaques.yaml](../sites/home/src/content/destaques.yaml) | `id`, `ordem` (menor aparece primeiro), `programa` (`empreende`, `tech`, `games`, `verde` ou `criativa`, que define as cores), `etiqueta`, `titulo`, `texto`, `botao` | 🟢 |
| **Notícias** | pasta [noticias/](../sites/home/src/content/noticias/) | um **arquivo** por notícia ([ver abaixo](#notícias)) | 🟢 |
| **Categorias das notícias** (filtros) | [categorias.yaml](../sites/home/src/content/categorias.yaml) | `id-da-categoria:` e, abaixo, `nome:` | 🟢 |
| **Revistas e cartilhas** | [publicacoes.yaml](../sites/home/src/content/publicacoes.yaml) | `id`, `tipo` (`revista` ou `cartilha`), `ordem`, `titulo`, `capa` (imagem em `assets/publicacoes/`), `capaAlt`, `arquivo` (link do PDF; vazio = o card não abre nada) | 🟢 |
| **Fotos de Parcerias governamentais** (Início) | `paginas/inicio.md` → `parcerias.itens` | `titulo`, `imagem` (em `assets/fotos/`), `alt` | 🟢 |
| **Fotos da Praça** (Início) | `paginas/inicio.md` → `praca.fotos` | `imagem`, `alt` | 🟢 |
| **Números** (Início) | `paginas/inicio.md` → `numeros.itens` | `valor`, `texto` | 🟢 📏 |
| **Produtos digitais** (3 cards do Início) | `paginas/inicio.md` → `produtos.itens` | `id`, `nome`, `texto`, `link` | 🟡 Só aceita os 3 produtos atuais. Um produto novo exige o ícone em `assets/produtos/`, o registro em `ICONES_PRODUTOS` (no [index.astro](../sites/home/src/pages/index.astro)) e o `id` novo em [content.config.ts](../sites/home/src/content.config.ts) 📏 |
| **Eixos de atuação** (5 programas) | [components/Eixos.astro](../sites/home/src/components/Eixos.astro), lista `EIXOS` | — | 🟡 Os cards são imagens e ficam no código, não no conteúdo |
| **Pilares** (Sobre) | `paginas/sobre.md` → `pilares.itens` | `icone` (`governamental` ou `empreendedor`), `titulo`, `texto` | 🟢 com um desses ícones; 🟡 com um ícone novo 📏 |
| **Cards do manual de marca** (Comunicação) | `paginas/comunicacao.md` → `manualMarca.cards` | copie um item existente | 🟢 📏 |
| **E-mails de contato** (Comunicação) | `paginas/comunicacao.md` → `contato.emails` | `rotulo`, `email` | 🟢 📏 |
| **Recursos de uma plataforma** (página Produtos digitais) | `paginas/produtos-digitais.md` → `produtos[…].recursos` | `icone`, `titulo`, `texto`. Ícones disponíveis: `gratuito`, `certificado`, `ampulheta`, `dinheiro`, `caixa`, `vitrine`, `grafico`, `mapa` e `apoio` | 🟢 com esses ícones; 🟡 com um ícone novo ([como fazer](../docs/RECEITAS.md#ícones-escolhidos-pelo-conteúdo)) |
| **Plataforma nova** (página Produtos digitais) | `paginas/produtos-digitais.md` → `produtos` | `id`, `nome`, `texto`, `botao`, `recursos` | 🟡 Exige o logo em `assets/produtos/`, o registro em `LOGOS` (no `produtos-digitais/index.astro`) e o `id` novo em `content.config.ts` |

### Notícias

1. Na pasta [noticias/](../sites/home/src/content/noticias/), **copie** uma notícia e dê um nome novo ao arquivo: letras minúsculas, sem acento, com hífens (ex.: `feira-de-credito-zona-leste.md`). **O nome do arquivo vira o endereço da notícia.**
2. No topo, entre as linhas `---`, preencha:
   - `titulo`, `resumo` (texto do card, até 220 caracteres) e `data` (formato `2026-11-20`);
   - `categoria`: um dos ids de `categorias.yaml` (`editais-e-chamadas`, `eventos`, `teia` ou `microcredito`);
   - `subtitulo`: opcional;
   - `imagem` e `imagemAlt`: opcionais. A imagem vai em `sites/home/src/assets/noticias/`, e a descrição é obrigatória quando há imagem;
   - `rascunho: true`: deixa a notícia **fora** do site até você tirar essa linha.
3. Depois do segundo `---`, escreva o texto, com uma linha em branco entre os parágrafos. Link: `[texto do link](https://…)`.

A notícia aparece **sozinha** na página Comunicação (entre as 6 mais recentes), na lista completa, na categoria, na busca e em "Também pode interessar".

> ⚠️ **Não apague** a notícia `mais-mulheres-terceira-edicao.md`: o teste do Figma usa essa notícia como modelo. Se ela precisar sair, avise quem cuida dos testes, para atualizar o [figma-home.json](../tests/visual/figma-home.json).

---

## Sampa Tech

Arquivos em [sites/tech/src/content/paginas/](../sites/tech/src/content/paginas/).

| Lista | Onde | Formato de cada item | Tipo |
|---|---|---|---|
| **Programa novo** na página Sampa Tech | `inicio.md` → `programas` | copie o bloco inteiro, de `- status:` até o fim do `resumo`. O link no submenu é criado sozinho | 🟢 📏 |
| **Itens com ✓** de um programa | `inicio.md` → `programas[…].itens` | `- 'Texto'` | 🟢 📏 |
| **Benefícios** (Vai Tec) | `vaitec.md` → `beneficios.itens` | `- { icone: dinheiro, titulo: '…', texto: '…' }`. Ícones: `dinheiro`, `formacao`, `mentoria` e `rede` | 🟢 com esses ícones; 🟡 com um ícone novo (desenhado em [Icone.astro](../sites/tech/src/components/Icone.astro)) 📏 |
| **Temas abordados** | `vaitec.md` → `temas.itens` | `- 'Texto'` (a numeração é automática) | 🟢 📏 |
| **Quem pode se inscrever?** | `vaitec.md` → `quemPode.perguntas` | `- pergunta: '…'` e, na linha de baixo, `resposta: '…'` | 🟢 📏 |
| **Cronograma** | `vaitec.md` → `cronograma.etapas` | `- { data: "…", titulo: '…' }` | 🟢 📏 |
| **Dúvidas** | `vaitec.md` → `duvidas.perguntas` | igual a "Quem pode" (a numeração é automática) | 🟢 📏 |
| **Notas do edital** | `vaitec.md` → `edital.notas` | `- 'Texto'` | 🟢 📏 |

---

## Teia

Tudo em [sites/teia/src/content/paginas/teia.md](../sites/teia/src/content/paginas/teia.md).

| Lista | Onde | Formato de cada item | Tipo |
|---|---|---|---|
| **Foto de um espaço** | `espacos[…].fotos` | `- { imagem: ../../assets/fotos/arquivo.jpg, alt: '…' }`. Com 2 fotos ou mais, aparecem os pontinhos | 🟢 |
| **Espaço novo** | `espacos` | copie um bloco inteiro, de `- ancora:` até o fim de `fotos`. A `ancora` é o "id" do espaço (única, minúsculas) | 🟢, mas 📏 com alerta: um espaço novo **acrescenta uma seção** e desloca a numeração das seções seguintes no teste do Figma |
| **Unidade no mapa** | `mapa.unidades` | copie o bloco de `- nome:` até `endereco:`. Com 2 unidades ou mais, aparece o seletor | 🟢 📏 |
| **Dúvida** | `duvidas.itens` | `- { pergunta: '…', resposta: '…' }`. **Sem resposta, não aparece** | 🟢 |
| **Documento das normas** | `normas.documentos` | `- { titulo: '…', descricao: '…', arquivo: 'documentos/nome.pdf', botao: 'Baixar PDF' }`. O PDF vai em `sites/teia/public/documentos/` | 🟢 |

---

## Quando o teste do Figma reprova depois de acrescentar cards

Algumas seções são comparadas com o desenho do Figma, inclusive na **altura** (com tolerância de 4 px). Se você acrescentou um card e a seção ganhou uma linha a mais, o teste vai dizer algo como:

```
altura 620 (Figma 498, +122)
```

**Isso não é um erro do seu conteúdo.** Significa que a página ficou diferente do Figma de propósito. Para resolver, quem cuida dos testes atualiza o arquivo de comparação:

1. abra `tests/visual/figma-<site>.json` (ex.: [figma-tech.json](../tests/visual/figma-tech.json));
2. ache a seção pelo `nome` (ex.: `"duvidas"`);
3. troque o valor de `"altura"` pelo novo valor, ou por `null` (sem conferir a altura) quando a lista vai mudar com frequência.

Esse ajuste é 🟡. Os detalhes estão em [docs/TESTES.md](../docs/TESTES.md#comparação-com-o-figma).

---

## Cards que não estão em lista

Se você quer um **tipo de card que ainda não existe** (por exemplo, uma seção nova de "Eventos" com cards), isso é criar estrutura nova, e não só conteúdo. Veja [06 — Criar uma página](06-criar-pagina.md#criar-uma-seção-nova-numa-página-existente).
