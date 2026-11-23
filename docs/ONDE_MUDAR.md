# Onde mudar o quê

Guia rápido para achar o arquivo certo de cada mudança. Os caminhos partem da pasta do projeto (`adesampa-sites/`).

Cada site fica em `sites/<site>/`:

| Site | Pasta | Endereço de teste |
|---|---|---|
| Home (ADE SAMPA) | `sites/home/` | oranilom.com.br/homolog/ |
| Sampa Tech | `sites/tech/` | oranilom.com.br/homolog/sampa-tech/ |
| Teia | `sites/teia/` | oranilom.com.br/homolog/teia/ |

O que é **igual em todos os sites** (cabeçalho, menu, rodapé, fonte) fica em `packages/ui/`. Mudou ali, muda em todos.

---

## Textos

| Quero mudar… | Arquivo |
|---|---|
| Um texto de uma página da Home | `sites/home/src/content/paginas/` → `inicio.md`, `sobre.md`, `comunicacao.md`, `publicacoes.md` ou `produtos-digitais.md` |
| Cards "Destaques e oportunidades" (Início) | `sites/home/src/content/destaques.yaml` |
| Notícias (criar, editar, apagar) | `sites/home/src/content/noticias/`, um arquivo `.md` por notícia |
| Categorias das notícias (filtros) | `sites/home/src/content/categorias.yaml` |
| Revistas e cartilhas | `sites/home/src/content/publicacoes.yaml` |
| Textos do Sampa Tech | `sites/tech/src/content/paginas/inicio.md` e `vaitec.md` |
| Textos do Teia | `sites/teia/src/content/paginas/teia.md` |
| Textos do cabeçalho, do Menu de projetos ou do rodapé | `packages/ui/src/data/institucional.ts` (ver o "Cuidado" em [Links](#links)) |

Passo a passo de cada site: [CONTEUDO_HOME.md](CONTEUDO_HOME.md), [CONTEUDO_TECH.md](CONTEUDO_TECH.md) e [CONTEUDO_TEIA.md](CONTEUDO_TEIA.md).

> Os arquivos `.md` e `.yaml` usam o formato YAML: texto entre aspas simples, recuo com espaços (nunca Tab). Se algo ficar errado, o build mostra o arquivo e o campo com problema, e nada é publicado.

## Links

| Quero mudar… | Onde |
|---|---|
| Links do menu, do Menu de projetos, das redes sociais e do rodapé | `packages/ui/src/data/institucional.ts`: `CABECALHO`, `MENU_PROJETOS`, `redes`, `colunas` e `legais` |
| Link de um botão dentro de uma página | No arquivo de conteúdo da página, campo `link:` |
| Endereço de um site inteiro (ex.: quando houver o domínio final) | `packages/ui/src/data/institucional.ts`, mapa `SITES` |

Como escrever um link em `institucional.ts`:

```ts
link('Transparência')                                    // sem destino = pendente (aparece, mas não clica)
link('Sampa Ensina', 'https://sampaensina.sp.gov.br/')   // endereço externo
link('Sobre nós', pagina('home', 'sobre/'))              // página de um site deste projeto (prefira este)
```

Nos arquivos de conteúdo (`.md`), o link é um texto: `''` (pendente), `'https://…'`, `'#secao'` (âncora na mesma página) ou `'sobre/'` (página do mesmo site, sem barra no começo).

> Para achar todos os links pendentes, busque `TODO-LINK` no projeto.

**Cuidado:** em `institucional.ts`, mudar só o **destino** de um link é seguro. Já mudar o **texto**, acrescentar ou remover itens muda a aparência, e o teste que compara o cabeçalho e o rodapé com a referência vai acusar diferença. Nesse caso, atualize também os 3 arquivos de `referencia/header-footer/` (`config.php`, `exemplo.html` e `html/header.html` ou `html/footer.html`).

## Imagens e ícones

| Quero mudar… | Onde |
|---|---|
| Uma foto de página | `sites/<site>/src/assets/fotos/`. Troque o arquivo mantendo o nome, ou aponte o novo nome no conteúdo (campo `imagem:`) |
| Ícones de uma página | `sites/<site>/src/assets/icones/` |
| Logos e ícones do cabeçalho e do rodapé | `packages/ui/assets/icons/` |
| Logos do Menu de projetos | `packages/ui/assets/icons/menu-*.svg` |

Toda foto precisa de uma descrição (campo `alt:` ou `…Alt:` no conteúdo), que é lida por quem usa leitor de tela. O site gera sozinho as versões leves (WebP/AVIF) em vários tamanhos, então pode colocar a foto em boa resolução.

## Cores, fontes e tamanhos

| Quero mudar… | Onde |
|---|---|
| Cores, tamanhos de texto e espaçamentos **comuns a todos os sites** | `packages/ui/src/styles/tokens.css` (variáveis como `--empreende-001`, `--fs-h2`) |
| Cores e estilos do **cabeçalho, menu e rodapé** | `packages/ui/src/styles/header-footer.css` (variáveis `--hf-*`) |
| Cores e estilos das páginas de **um site** | `sites/<site>/src/styles/site.css`. As cores ficam no começo do arquivo, no bloco `:root` |
| A fonte (Geist) | `packages/ui/assets/fonts/` (carregada em `packages/ui/src/layouts/BaseLayout.astro`) |
| Comportamento no celular e no tablet | No fim de cada `site.css`, nos blocos `@media (max-width: 1023px)` (tablet) e `@media (max-width: 767px)` (celular) |

Prefira mudar a **variável** (ex.: `--azul-600: #1158D4;`) a trocar a cor em cada lugar: a variável muda todos os usos de uma vez.

> Antes de escurecer ou clarear uma cor de texto, veja as decisões de acessibilidade em `DECISOES_HOME.md` (H-02) e `DECISOES_TECH.md` (T-02). Algumas cores do Figma foram ajustadas de propósito para ter contraste suficiente, e o teste acusa se o contraste cair.

## Estrutura das páginas

| Quero… | Onde |
|---|---|
| Mudar a ordem ou o layout das seções de uma página | `sites/<site>/src/pages/…/index.astro`. Ex.: Sobre = `sites/home/src/pages/sobre/index.astro` |
| Mudar uma peça reaproveitada (botão, card, carrossel, hero) | `sites/<site>/src/components/` |
| Mudar o cabeçalho, o rodapé ou o submenu (marcação) | `packages/ui/src/components/` (`Header.astro`, `Footer.astro`, `Submenu.astro`) |
| Mudar o comportamento do menu (abrir, fechar) | `packages/ui/src/scripts/menu.ts` |

O endereço de cada página segue a pasta: `pages/sobre/index.astro` vira `/sobre/`, e `pages/comunicacao/publicacoes/index.astro` vira `/comunicacao/publicacoes/`.

### Criar uma seção nova numa página

Exemplo: uma seção "Nossa história" na página Sobre da Home. São 4 lugares:

1. **Textos**, em `sites/home/src/content/paginas/sobre.md`:
   ```yaml
   historia:
     titulo: 'Nossa história'
     texto: 'A ADE SAMPA foi criada em…'
   ```
2. **Regra dos campos**, em `sites/home/src/content.config.ts`, na coleção `sobre`. Ela diz que campos existem e se são obrigatórios:
   ```ts
   historia: z.object({ titulo: z.string(), texto: z.string() }),
   ```
3. **Marcação**, em `sites/home/src/pages/sobre/index.astro`, no ponto da página onde a seção deve aparecer:
   ```astro
   <section class="secao historia" aria-labelledby="titulo-historia">
       <div class="container">
           <h2 id="titulo-historia" class="h-secao">{p.historia.titulo}</h2>
           <p class="texto-1">{p.historia.texto}</p>
       </div>
   </section>
   ```
4. **Estilo**, se precisar, em `sites/home/src/styles/site.css`:
   ```css
   .historia { background: var(--azul-50); }
   ```

Reaproveite as classes que já existem (`secao`, `container`, `h-secao`, `texto-1`, `etiqueta`, `botao`…): assim a seção nova já sai com as medidas do Figma.

### Criar uma página nova num site

1. Crie `sites/<site>/src/pages/<endereco>/index.astro`. Copiar uma página parecida é o caminho mais curto.
2. Se a página tiver textos editáveis, crie o arquivo de conteúdo em `src/content/paginas/` e a coleção em `src/content.config.ts`.
3. Se ela tiver de aparecer no menu ou no rodapé, acrescente o link em `packages/ui/src/data/institucional.ts`.

## Site novo, segurança e publicação

| Quero… | Onde |
|---|---|
| Criar um site novo (ex.: Sampa Games) | Copie `sites/tech/` como modelo, cadastre o site em `SITES` (`institucional.ts`) e crie a pasta com o marcador no FTP ([DEPLOY.md](DEPLOY.md#sites-e-pastas-no-ftp)) |
| Regras do servidor (segurança, cache, página 404) | `sites/<site>/public/.htaccess` |
| Liberar um serviço externo incorporado (ex.: um mapa ou um vídeo de outro site) | `sites/<site>/public/.htaccess`, na linha `Content-Security-Policy` |
| Como o deploy funciona e o que fazer quando falha | [DEPLOY.md](DEPLOY.md) e `.github/workflows/testes.yml` |
| Por que algo está diferente do Figma | `DECISOES_HOME.md`, `DECISOES_TECH.md` e `DECISOES_TEIA.md` |

## Depois de qualquer mudança

1. **Opcional — ver no computador antes de publicar:** `npm run dev -w sites/<site>` e abra o endereço que aparecer.
2. **Commit e push.** O GitHub testa tudo e, se os testes passarem, publica sozinho. Se algum teste falhar, nada é publicado e o site no ar continua como estava.
