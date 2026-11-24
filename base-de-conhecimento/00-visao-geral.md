# 00 — Visão geral

[← Voltar ao índice](../DOCUMENTACAO.md)

O que você vai encontrar aqui: o que é o projeto, como ele está organizado e o significado dos termos que aparecem no resto da base.

---

## O que é este projeto

É **um único repositório** (uma pasta versionada no GitHub) que guarda **vários sites** da ADE SAMPA. Todos eles compartilham o mesmo cabeçalho, o mesmo menu e o mesmo rodapé.

| Site | Pasta no projeto | Endereço de teste (homologação) |
|---|---|---|
| **Home** (ADE SAMPA) | [sites/home/](../sites/home/) | oranilom.com.br/homolog/ |
| **Sampa Tech** | [sites/tech/](../sites/tech/) | oranilom.com.br/homolog/sampa-tech/ |
| **Teia** | [sites/teia/](../sites/teia/) | oranilom.com.br/homolog/teia/ |
| Exemplo | [sites/exemplo/](../sites/exemplo/) | não é publicado (usado só nos testes) |

Cada site corresponde a um **endereço** (domínio ou subpasta). Quando dizemos "criar um novo domínio dentro do projeto", estamos falando de criar uma nova pasta em `sites/` (ver [07 — Criar um site](07-criar-site.md)).

### Como funciona, em uma frase

Você edita arquivos de texto → o **Astro** (a ferramenta do projeto) transforma esses arquivos em páginas prontas → o GitHub **testa** tudo → se estiver tudo certo, **publica** sozinho no servidor (KingHost).

Não existe painel de administração nem banco de dados: **o conteúdo do site são os próprios arquivos**.

---

## As 3 camadas (o conceito mais importante)

Pense numa página como uma casa:

| Camada | Na casa | No site | Arquivo |
|---|---|---|---|
| 📝 **Conteúdo** | Os móveis e os objetos | Textos, links, fotos, listas de cards | `.md` e `.yaml` em `src/content/` |
| 🧱 **Estrutura** | As paredes e os cômodos | Quais seções existem, em que ordem, como os cards se organizam | `.astro` em `src/pages/` e `src/components/` |
| 🎨 **Visual** | A pintura e a decoração | Cores, tamanhos, espaçamentos, como fica no celular | `site.css` em `src/styles/` |

**Exemplo real:** na página inicial da Home há uma seção "Nosso impacto em números".
- O **conteúdo** (o título e os números "13 anos", "+500.000"…) está em [sites/home/src/content/paginas/inicio.md](../sites/home/src/content/paginas/inicio.md), no trecho `numeros:`.
- A **estrutura** (a seção ter um título em cima e os números lado a lado) está em [sites/home/src/pages/index.astro](../sites/home/src/pages/index.astro), na `<section class="… numeros">`.
- O **visual** (o fundo escuro, o tamanho dos números) está em [sites/home/src/styles/site.css](../sites/home/src/styles/site.css), no bloco `/* Números */`.

> **Dica de ouro:** a palavra que aparece no `class="…"` de uma seção no `.astro` é a mesma que você procura (Ctrl+F) no `site.css` para achar o visual dela. Por exemplo: `class="secao numeros"` → procure `.numeros` no `site.css`.

---

## Como as pastas estão organizadas

Todo site tem a mesma organização interna. Se você aprendeu um, aprendeu todos:

```
sites/<site>/
├── src/
│   ├── content/          📝 TEXTOS editáveis (.md e .yaml)
│   │   └── paginas/         um arquivo por página (inicio.md, sobre.md…)
│   ├── content.config.ts    as "regras" dos textos: quais campos existem e quais são obrigatórios
│   ├── pages/            🧱 PÁGINAS: cada pasta vira um endereço
│   ├── components/       🧱 PEÇAS reaproveitadas (botão, card, carrossel…)
│   ├── assets/           📝 FOTOS, ícones e logos
│   ├── styles/site.css   🎨 VISUAL das páginas deste site
│   ├── scripts/             comportamentos (carrossel que gira, busca…)
│   └── lib/                 funções de apoio (raramente precisa mexer)
└── public/               arquivos copiados como estão (PDFs, regras do servidor)
```

E o que é **igual em todos os sites** fica num lugar só:

```
packages/ui/              🔴 COMPARTILHADO: mudou aqui, muda em TODOS os sites
├── src/data/institucional.ts   textos e links do cabeçalho, do menu e do rodapé
├── src/components/             Header (cabeçalho), Footer (rodapé), Submenu
├── src/styles/tokens.css       cores, fontes e espaçamentos gerais
└── src/styles/header-footer.css  visual do cabeçalho, do menu e do rodapé
```

Outras pastas da raiz:

| Pasta | Para que serve | Você mexe? |
|---|---|---|
| [tests/](../tests/) | Testes automáticos | Raramente (só quando o Figma muda) |
| [referencia/](../referencia/) | O modelo original do cabeçalho e do rodapé, usado para comparação | Só ao mudar textos do cabeçalho ou do rodapé |
| [docs/](../docs/) | Documentação técnica (contexto para IA) | Para consultar |
| [scripts/](../scripts/) | Automação da publicação | Não |
| `.github/` | Configuração dos testes e da publicação no GitHub | Não |

### Endereço = pasta

O endereço de uma página segue o caminho da pasta dentro de `src/pages/`:

| Arquivo | Endereço |
|---|---|
| `sites/home/src/pages/index.astro` | oranilom.com.br/homolog/ |
| `sites/home/src/pages/sobre/index.astro` | oranilom.com.br/homolog/sobre/ |
| `sites/home/src/pages/comunicacao/publicacoes/index.astro` | oranilom.com.br/homolog/comunicacao/publicacoes/ |
| `sites/tech/src/pages/vaitec/index.astro` | oranilom.com.br/homolog/sampa-tech/vaitec/ |

---

## Como ler um arquivo de conteúdo (YAML)

Os arquivos `.md` e `.yaml` usam um formato chamado **YAML**: uma lista de "nome: valor". O recuo (espaços no começo da linha) indica o que está dentro de quê.

```yaml
numeros:                                   ← uma seção da página
  titulo: 'Nosso impacto em números'       ← um texto dentro dela
  itens:                                   ← uma lista (de cards)
    - { valor: '13 anos', texto: 'de apoio' }      ← 1º card
    - { valor: '+30', texto: 'coworkings' }        ← 2º card
```

Regras que evitam 90% dos erros:

1. **Texto entre aspas simples:** `'Texto'`. Se o texto tiver apóstrofo, escreva-o duas vezes: `'D''Ávila'`.
2. **Recuo com espaços, nunca com Tab.** Mantenha o mesmo recuo das linhas vizinhas.
3. **Item de lista começa com `- `** (hífen e espaço).
4. **Quebra de linha forçada:** use aspas **duplas** e `\n`: `"Linha 1\nLinha 2"` (só vale em telas grandes).
5. **Link vazio `''`** = o botão aparece, mas ainda não leva a lugar nenhum (link pendente).
6. **Link para página do mesmo site:** sem barra no começo: `'sobre/'`. Para fora: `'https://…'`.
7. Linhas que começam com `#` são **comentários**: explicações para quem edita, que não aparecem no site.

Nos arquivos `.md`, o conteúdo fica entre as duas linhas `---` do topo. Nas notícias, o texto da notícia vem **depois** do segundo `---`.

Se algo ficar errado, o projeto **avisa** qual arquivo e qual campo têm problema, e nada é publicado.

---

## Ver as mudanças no seu computador

Antes de publicar, você pode ver o site funcionando no seu computador. A preparação é feita **uma vez só**. Os detalhes estão em [08 — Testes](08-testes.md#preparar-o-computador-uma-vez-só).

Para abrir um site em modo de edição, rode no terminal do VS Code:

```bash
npm run dev -w sites/home      # troque "home" por "tech" ou "teia"
```

Abra o endereço que aparecer (ex.: `http://localhost:4321/homolog/`). **Cada arquivo salvo aparece na hora** no navegador. Para parar, pressione `Ctrl+C` no terminal.

---

## Regras de ouro

1. **Textos ficam no conteúdo** (`.md`/`.yaml`), nunca escritos direto no `.astro`.
2. **Cabeçalho e rodapé só se mudam em `packages/ui/`.** Eles precisam ser idênticos em todos os sites, e existe um teste só para isso.
3. **Nunca escreva endereços fixos** como `/homolog/sobre/` no código. Use os formatos de link explicados nos guias.
4. **Toda imagem precisa de descrição** (o campo `alt`), para quem usa leitor de tela.
5. **Nada de estilo ou script escrito dentro do HTML.** CSS vai no `site.css` e comportamento num arquivo `.ts`. O servidor bloqueia o resto por segurança, e o projeto acusa erro.
6. **Nunca coloque senhas no código** nem em mensagens.
7. **Nunca mexa nas pastas antigas** `www/teia/` e `www/sampa-tech/` do servidor: elas não fazem parte deste projeto.

---

## Glossário

| Termo | O que significa |
|---|---|
| **Astro** | A ferramenta que transforma os arquivos do projeto em páginas de site |
| **Build** | O momento em que o Astro gera as páginas finais (pasta `dist/` de cada site). Comando: `npm run build` |
| **Deploy / publicação** | Enviar as páginas geradas para o servidor, deixando-as no ar |
| **Homologação** | O ambiente de teste (`/homolog/`), onde as páginas são conferidas antes da versão definitiva |
| **Repositório / Git / GitHub** | A pasta do projeto com o histórico de todas as mudanças. O GitHub é o site que guarda essa pasta online |
| **Commit** | "Salvar uma versão" das suas mudanças, com uma descrição |
| **Push** | Enviar os seus commits para o GitHub. Um push no `main` dispara os testes e a publicação |
| **`main`** | O ramo principal do projeto: o que está nele é o que vai para o ar |
| **Actions** | A aba do GitHub onde os testes e a publicação rodam |
| **YAML** | O formato dos arquivos de conteúdo (`nome: valor`) |
| **Componente** | Uma peça reaproveitável (botão, card, carrossel) que é usada em várias páginas |
| **CSS** | A linguagem que define o visual (cores, tamanhos, espaços) |
| **Classe** | O "apelido" de um elemento (`class="numeros"`), que liga a estrutura ao visual no CSS |
| **`@media`** | Um bloco do CSS que só vale em telas menores (tablet ou celular) |
| **Variável de cor** | Um nome para uma cor (`--azul-600`). Mudou a variável, mudam todos os lugares que a usam |
| **Link pendente** | Um link vazio (`''`): o botão aparece, mas não leva a lugar nenhum. Busque `TODO-LINK` para achar todos |
| **Âncora** | Um link para um trecho da mesma página (`#duvidas`) |
| **Figma** | A ferramenta onde o design das páginas foi desenhado. Os testes comparam o site com ele |
| **CSP** | Uma regra de segurança do servidor que bloqueia scripts e estilos "soltos" no HTML |
| **Contraste AA** | A regra de acessibilidade que exige diferença suficiente entre a cor do texto e a do fundo |
| **Monorepo** | Um repositório com vários projetos (aqui, vários sites) |
