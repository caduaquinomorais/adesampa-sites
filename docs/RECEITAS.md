# Receitas

Passo a passo das alterações mais comuns, com código. Para achar um arquivo rapidamente, veja [ONDE_MUDAR.md](ONDE_MUDAR.md). Para entender o porquê das regras, veja [ARQUITETURA.md](ARQUITETURA.md).

Os exemplos usam o site **Home** (`sites/home/`), mas valem para todos os sites: basta trocar a pasta.

**Antes de começar:** rode `npm run dev -w sites/home` e deixe aberto. Cada arquivo salvo aparece na hora no navegador.

---

## Índice

- [Mudar um texto](#mudar-um-texto)
- [Acrescentar um campo novo ao conteúdo](#acrescentar-um-campo-novo-ao-conteúdo)
- [Criar uma seção nova numa página](#criar-uma-seção-nova-numa-página)
- [Criar uma página nova](#criar-uma-página-nova)
- [Criar um componente](#criar-um-componente)
- [Imagens: fotos, SVGs e ícones](#imagens-fotos-svgs-e-ícones)
- [Links: interno, outro site, externo e pendente](#links-interno-outro-site-externo-e-pendente)
- [Cores, fontes e espaçamentos](#cores-fontes-e-espaçamentos)
- [Ajustar para celular e tablet](#ajustar-para-celular-e-tablet)
- [Adicionar JavaScript a uma página](#adicionar-javascript-a-uma-página)
- [Incorporar conteúdo de outro site (mapa, vídeo)](#incorporar-conteúdo-de-outro-site-mapa-vídeo)
- [Disponibilizar um PDF para download](#disponibilizar-um-pdf-para-download)
- [Página provisória ("em construção")](#página-provisória-em-construção)
- [Item novo no menu ou no rodapé](#item-novo-no-menu-ou-no-rodapé)

---

## Mudar um texto

1. Ache o arquivo em [ONDE_MUDAR.md](ONDE_MUDAR.md#textos). Quase sempre é um `.md` em `src/content/paginas/`.
2. Os textos ficam no bloco entre os dois `---`, no formato YAML:
   ```yaml
   hero:
     titulo: 'Sobre a ADE SAMPA'
     texto: 'Texto do parágrafo.'
   ```
3. Regras do YAML:
   - texto entre **aspas simples**; apóstrofo vira dois: `'D''Ávila'`;
   - recuo com **espaços**, nunca Tab. O recuo define o que está dentro de quê;
   - quebra de linha forçada: aspas **duplas** com `\n` (`"Linha 1\nLinha 2"`);
   - item de lista começa com `- `.

Se algo ficar errado, o `npm run dev` ou o build mostra o arquivo e o campo com problema.

---

## Acrescentar um campo novo ao conteúdo

Exemplo: um subtítulo opcional no hero da página Sobre.

1. **Regra do campo**, em `sites/home/src/content.config.ts`, na coleção `sobre`:
   ```ts
   hero: z.object({
     etiqueta: z.string(),
     titulo: z.string(),
     texto: z.string(),
     subtitulo: z.string().optional(),   // ← novo
   }),
   ```
2. **Valor**, em `src/content/paginas/sobre.md`:
   ```yaml
   hero:
     subtitulo: 'Há 14 anos apoiando quem empreende'
   ```
3. **Uso**, na página (`src/pages/sobre/index.astro`):
   ```astro
   {p.hero.subtitulo && <p class="texto-2">{p.hero.subtitulo}</p>}
   ```

Tipos mais usados no `content.config.ts`:

| Quero | Escreva |
|---|---|
| Texto obrigatório | `z.string()` |
| Texto opcional | `z.string().optional()` |
| Texto com valor padrão | `z.string().default('Saiba mais')` |
| Link (vazio = pendente) | `link` (já definido no topo do arquivo) |
| Número | `z.number()` |
| Sim/não | `z.boolean().default(false)` |
| Uma opção de uma lista | `z.enum(['azul', 'verde'])` |
| Lista (pelo menos 1 item) | `z.array(z.object({ titulo: z.string() })).min(1)` |
| Imagem de `src/assets/` | `image()` (o schema precisa ser `schema: ({ image }) => z.object({…})`) |

> Campo **obrigatório** novo exige preencher o valor em todos os arquivos daquela coleção, senão o build falha. Na dúvida, comece com `.optional()`.

---

## Criar uma seção nova numa página

Exemplo: uma seção "Nossa história" na página Sobre.

1. **Textos**, em `src/content/paginas/sobre.md`:
   ```yaml
   historia:
     titulo: 'Nossa história'
     texto: 'A ADE SAMPA foi criada em…'
   ```
2. **Regra**, em `src/content.config.ts`, na coleção `sobre`:
   ```ts
   historia: z.object({ titulo: z.string(), texto: z.string() }),
   ```
3. **Marcação**, em `src/pages/sobre/index.astro`, no ponto onde a seção deve aparecer:
   ```astro
   <section class="secao secao--clara historia" aria-labelledby="titulo-historia">
       <div class="container">
           <h2 id="titulo-historia" class="h-secao">{p.historia.titulo}</h2>
           <p class="texto-1">{p.historia.texto}</p>
       </div>
   </section>
   ```
4. **Estilo** (se precisar), em `src/styles/site.css`:
   ```css
   .historia .container { display: flex; flex-direction: column; gap: 24px; }
   ```

**Classes prontas** (Home), para a seção nova já sair com as medidas do Figma:

| Classe | O que faz |
|---|---|
| `secao` | Espaço vertical padrão da seção (72 px; menos no celular) |
| `secao--clara`, `secao--escura`, `secao--marinho`, `secao--royal`, `secao--clara-sem-borda` | Fundos |
| `container` | Largura máxima de 1110 px, centralizada, com margem lateral |
| `h-display`, `h-secao`, `h-card`, `h-5` | Títulos (do maior para o menor) |
| `texto-1`, `texto-2` | Parágrafos (20 px e 16 px) |
| `etiqueta`, `etiqueta--solida` | Tag em maiúsculas |
| `quebras` | Respeita as quebras `\n` do texto (só em telas grandes) |
| `sr-only` | Texto só para leitor de tela |

**Boas práticas:**
- Cada seção tem um título `<h2>`, ligado por `aria-labelledby` a um `id` único na página.
- Existe **um único `<h1>`** por página (normalmente no hero). O teste confere.
- Testes visuais com o Figma usam seletores como `main > section:nth-of-type(3)`. Se você inserir uma seção no meio de uma página com referência do Figma, ajuste a numeração em `tests/visual/figma-<site>.json` (ver [TESTES.md](TESTES.md#comparação-com-o-figma)).

---

## Criar uma página nova

Exemplo: `/comunicacao/eventos/` no site Home.

1. **Crie a pasta e o arquivo** `src/pages/comunicacao/eventos/index.astro`. O endereço segue a pasta. O caminho mais curto é copiar uma página parecida (ex.: `comunicacao/produtos-digitais/index.astro`).
2. **Esqueleto mínimo:**
   ```astro
   ---
   /* Eventos — Figma: frame "Eventos" (id do frame). Textos: src/content/paginas/eventos.md. */
   import { getEntry } from 'astro:content';
   import BaseLayout from '@adesampa/ui/BaseLayout.astro';
   import { caminho } from '@adesampa/ui/caminhos';
   import Hero from '../../../components/Hero.astro';
   import '../../../styles/site.css';

   const entrada = await getEntry('eventos', 'eventos');
   if (!entrada) throw new Error('Falta src/content/paginas/eventos.md');
   const p = entrada.data;
   ---
   <BaseLayout titulo={p.titulo} descricao={p.descricao} ativo="comunicacao">
       <Hero
           trilha={[{ rotulo: 'Início', href: caminho() }, { rotulo: 'Comunicação', href: caminho('comunicacao/') }, { rotulo: p.titulo }]}
           titulo={p.hero.titulo}
           texto={p.hero.texto}
       />
       <!-- seções -->
   </BaseLayout>
   ```
   Os `../../../` dependem da profundidade da pasta: conte quantas pastas há entre o arquivo e `src/`.
3. **Conteúdo:** crie `src/content/paginas/eventos.md`:
   ```yaml
   ---
   titulo: 'Eventos'
   descricao: 'Agenda de eventos da ADE SAMPA.'
   hero:
     titulo: 'Eventos'
     texto: 'Feiras, oficinas e encontros para quem empreende.'
   ---
   ```
4. **Coleção**, em `src/content.config.ts`:
   ```ts
   const eventos = defineCollection({
     loader: glob({ pattern: 'eventos.md', base: './src/content/paginas' }),
     schema: z.object({
       titulo: z.string(),
       descricao: z.string(),
       hero: z.object({ titulo: z.string(), texto: z.string() }),
     }),
   });

   export const collections = { …, eventos };   // acrescente na lista do fim do arquivo
   ```
5. **Link para a página:** no menu ou no rodapé (`institucional.ts`, `pagina('home', 'comunicacao/eventos/')`) ou num botão de outra página (`link: 'comunicacao/eventos/'` no `.md`).
6. **Documente** a página em `docs/CONTEUDO_<SITE>.md` e as decisões em `docs/DECISOES_<SITE>.md`.

A página entra sozinha nos testes de responsividade e acessibilidade (5 larguras).

**Props do `BaseLayout`:**

| Prop | Para quê |
|---|---|
| `titulo` | Título da aba e dos buscadores (ganha " \| ADE SAMPA") |
| `descricao` | Descrição para buscadores e redes sociais |
| `ativo` | Item do menu sublinhado: `'home'`, `'sobre'`, `'programas'`, `'comunicacao'`, `'transparencia'` ou `'governamental'` |
| `submenu` | Faixa do programa abaixo do cabeçalho (ver [HEADER_FOOTER.md](HEADER_FOOTER.md#submenu-do-programa)) |
| `semIndexacao` | `true` = fora do Google (páginas provisórias e 404) |

---

## Criar um componente

Quando um mesmo bloco aparece em mais de um lugar, crie um componente em `src/components/`.

`src/components/CardEvento.astro`:
```astro
---
/* Card de evento (página Eventos e Início). */
import { attrs } from '../lib/conteudo';

interface Props {
  titulo: string;
  data: string;
  link: string;
}
const { titulo, data, link } = Astro.props;
---
<article class="card-evento">
    <p class="texto-2">{data}</p>
    <h3 class="h-5">{titulo}</h3>
    <a class="link-seta" {...attrs(link)}>Saiba mais<span class="sr-only">: {titulo}</span></a>
</article>
```

Uso:
```astro
import CardEvento from '../../components/CardEvento.astro';
<CardEvento titulo="Feira" data="20 nov." link="comunicacao/eventos/feira/" />
```

- O CSS do componente vai no `site.css` do site (`.card-evento { … }`), e **não** num `<style>` dentro do componente, por causa da CSP.
- O `<span class="sr-only">` completa o texto para quem usa leitor de tela ("Saiba mais: Feira"), já que vários "Saiba mais" iguais confundem.

---

## Imagens: fotos, SVGs e ícones

### Foto (JPG/PNG)

1. Coloque o arquivo em `src/assets/fotos/` (pode ser em boa resolução: o site gera versões leves sozinho).
2. Se ela vier do conteúdo, aponte no `.md` com o caminho relativo e escreva a descrição:
   ```yaml
   imagem: ../../assets/fotos/feira.jpg
   alt: 'Pessoas visitando estandes numa feira de empreendedores'
   ```
   E no `content.config.ts`, use `imagem: image(), alt: z.string()`.
3. Na página, use o `Picture` do Astro:
   ```astro
   import { Picture } from 'astro:assets';
   <Picture src={p.imagem} alt={p.alt} formats={['avif', 'webp']} fallbackFormat="jpg"
            widths={[480, 960]} sizes="(max-width: 767px) 100vw, 540px" loading="lazy" />
   ```
   - `widths` = os tamanhos gerados; `sizes` = a largura com que a imagem aparece.
   - Use `loading="eager"` só na imagem do topo da página.

**Trocar uma foto existente:** substitua o arquivo mantendo o **mesmo nome**, e confira se o `alt` ainda descreve a foto nova.

### SVG (logo, ícone)

SVGs não precisam de otimização. Importe com `?url` e use `<img>`:

```astro
import logo from '../assets/produtos/logo-data-sampa.svg?url';
<img src={logo} alt="Data Sampa" width="272" height="80">
```

- `width` e `height` = o tamanho do arquivo (está na primeira linha do SVG). Eles evitam que a página "pule" ao carregar.
- **Ícone decorativo** (ao lado de um texto que já diz tudo): `alt=""`. **Ícone que é a única informação** (ex.: botão só com ícone): `alt` descritivo, ou `aria-label` no botão.
- O teste de identidade reclama se o **mesmo** SVG do cabeçalho ou do rodapé for copiado para dentro de um site. Para usá-lo numa página, importe de `@adesampa/ui/assets/icons/…`.

### Ícones escolhidos pelo conteúdo

Exemplo real: os ícones da página Produtos digitais (`components/IconeProduto.astro`). O conteúdo diz `icone: mapa`, e o componente traduz o nome para o arquivo. Para acrescentar um ícone:
1. coloque o SVG em `src/assets/icones/produtos/novo.svg`;
2. importe-o no `IconeProduto.astro` e acrescente-o em `ICONES`;
3. acrescente `'novo'` no `z.enum([...])` do campo `icone` em `content.config.ts`.

---

## Links: interno, outro site, externo e pendente

| Onde | Para | Como |
|---|---|---|
| Conteúdo (`.md`) | Página do mesmo site | `link: 'sobre/'` (sem barra no começo) |
| Conteúdo | Âncora na mesma página | `link: '#contato'` |
| Conteúdo | Site externo | `link: 'https://…'` |
| Conteúdo | Ainda não definido | `link: ''  # TODO-LINK: o que falta` |
| `.astro` | Página do mesmo site | `href={caminho('sobre/')}` |
| `.astro` | Página de outro site do projeto | `href={resolverDestino(pagina('teia'), ambienteAtual())}` |
| `.astro` | Link vindo do conteúdo | `<a {...attrs(p.botao.link)}>` ou `<Botao texto="…" link={p.botao.link} />` |
| `institucional.ts` | Qualquer um | `link('Texto', pagina('home', 'sobre/'))` |

**Nunca** escreva `href="/homolog/sobre/"` nem `href="/sobre/"` fixos: quebram quando o endereço do site muda.

Uma âncora (`#secao`) precisa de um elemento com aquele `id` na página. O teste de links confere.

---

## Cores, fontes e espaçamentos

1. Veja se a cor já existe como variável:
   - comuns a todos os sites: `packages/ui/src/styles/tokens.css` (`--empreende-001`, `--tech-001`, `--fs-h2`, `--sp-24`…);
   - de um site: o bloco `:root` no começo do `sites/<site>/src/styles/site.css`.
2. Mude a **variável**, e não cada uso. Ex.: `--azul-600: #1158D4;` muda todos os botões de uma vez.
3. Cor nova: crie uma variável no `:root` do site e use `var(--minha-cor)`.

**Contraste:** texto normal precisa de 4,5:1 sobre o fundo; texto grande (≥ 24 px, ou ≥ 18,66 px em negrito), de 3:1. O teste mede todos os textos visíveis. Para conferir antes, use o [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). Cores ajustadas por contraste estão marcadas com `AA:` no CSS (ver H-02 em `DECISOES_HOME.md`).

**Fonte:** Geist, servida pelo próprio site (`packages/ui/assets/fonts/`). Fontes do Google Fonts ou de outro CDN são bloqueadas pela CSP.

---

## Ajustar para celular e tablet

No fim de cada `site.css` há os blocos responsivos. Coloque a regra no bloco certo:

```css
@media (max-width: 1023px) { /* tablet e celular */
    .historia .container { flex-direction: column; }
}
@media (max-width: 767px) {  /* só celular */
    .historia { --secao-py: 48px; }
}
```

Regras que o teste confere em 320, 390, 768, 1024 e 1440 px:
- **sem rolagem horizontal:** cuidado com larguras fixas (`width: 540px`). Prefira `max-width`, `minmax(0, 540px)` ou `width: min(540px, 100%)`;
- **alvos de toque de 44 × 44 px** abaixo de 1024 px, para links e botões (fora links dentro de parágrafos);
- **fonte de no mínimo 12 px.**

---

## Adicionar JavaScript a uma página

A CSP proíbe código dentro do HTML, então o JavaScript sempre vai num arquivo.

1. Crie `src/scripts/contador.ts`:
   ```ts
   for (const botao of document.querySelectorAll<HTMLButtonElement>('[data-contador]')) {
     let n = 0;
     botao.addEventListener('click', () => { botao.textContent = `Cliques: ${++n}`; });
   }
   ```
2. No fim da página `.astro`:
   ```astro
   <script>import '../scripts/contador';</script>
   ```
   O Astro transforma isso num arquivo em `/_astro/`, que a CSP permite.
3. Marque os elementos com atributos `data-*` (`<button data-contador>`), e não com `onclick=""`.

A página precisa **funcionar sem JavaScript**: o script só melhora. Exemplos no projeto: `packages/ui/src/scripts/menu.ts` (menu) e `sites/teia/src/scripts/teia.ts` (carrossel e mapa).

---

## Incorporar conteúdo de outro site (mapa, vídeo)

Um `<iframe>` de outro domínio é bloqueado pela CSP (`frame-src 'none'`). Para liberar:

1. Em `sites/<site>/public/.htaccess`, na linha `Content-Security-Policy`, troque `frame-src 'none'` pelo domínio exato:
   ```
   frame-src https://www.youtube-nocookie.com;
   ```
   Libere só no site que precisa e só o domínio necessário.
2. Carregue o conteúdo **só no clique**, por LGPD e desempenho: mostre uma imagem de prévia e um botão, e crie o `<iframe>` por JavaScript. O modelo é o mapa do Teia, em `sites/teia/src/scripts/teia.ts` ("Mapa interativo").
3. Registre a decisão no `DECISOES_<SITE>.md`.

---

## Disponibilizar um PDF para download

1. Coloque o arquivo em `sites/<site>/public/documentos/manual.pdf`. A pasta `public/` é copiada como está.
2. No conteúdo: `arquivo: 'documentos/manual.pdf'` (sem barra no começo).
3. Nomes de arquivo em minúsculas, sem espaços nem acentos (`manual-de-conduta.pdf`).

PDFs grandes deixam o deploy mais lento. Se o arquivo já estiver publicado em outro lugar, prefira o link `https://…`.

---

## Página provisória ("em construção")

Modelo: `sites/home/src/pages/parcerias-governamentais/index.astro`.

```astro
<BaseLayout titulo="…" descricao="…" semIndexacao>
    <Hero trilha={…} etiqueta="Em construção" titulo="…" texto="Esta página está sendo preparada." />
</BaseLayout>
```

`semIndexacao` tira a página do Google. Retire-o quando a página definitiva estiver pronta.

---

## Item novo no menu ou no rodapé

Veja [HEADER_FOOTER.md](HEADER_FOOTER.md#mudar-um-texto-acrescentar-ou-remover-itens). Resumo:
- mudar o **destino** de um link é seguro;
- mudar um **texto** ou acrescentar ou remover itens também exige atualizar `referencia/header-footer/`.
