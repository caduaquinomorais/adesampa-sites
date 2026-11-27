# Do Figma para o código

Como transformar uma tela do Figma em página, e como lidar com os limites de uso do Figma.

## O arquivo

- **Arquivo:** "Site - Ade Sampa". Chave: `r1NdYceMw9ocdyDDrVQUGW` (aparece na URL: `figma.com/design/<chave>/…`).
- **Só existe a versão de 1440 px** (computador). As versões de tablet e celular são decididas no código (H-07 em `DECISOES_HOME.md`).
- Para abrir um frame direto, use a URL com `?node-id=`: o frame `685:50101` vira `node-id=685-50101`.

### Frames já implementados

| Página | Frame | Código |
|---|---|---|
| Início | `1:2884` | `sites/home/src/pages/index.astro` |
| Sobre | `306:4533` | `sites/home/src/pages/sobre/` |
| Comunicação | `264:3552` | `sites/home/src/pages/comunicacao/index.astro` |
| Exemplo de notícia | `574:43625` | `sites/home/src/pages/comunicacao/noticias/[slug].astro` |
| Publicações | `654:15568` | `sites/home/src/pages/comunicacao/publicacoes/` |
| Produtos digitais | `685:50101` | `sites/home/src/pages/comunicacao/produtos-digitais/` |
| Menu de projetos | `656:19254` | `packages/ui/src/components/Header.astro` |
| Sampa Tech | `468:12857` | `sites/tech/src/pages/index.astro` |
| Aceleração Vai Tec | `64:2150` | `sites/tech/src/pages/vaitec/` |
| Teia | `212:2903` | `sites/teia/src/pages/index.astro` |
| Parcerias governamentais | `966:21749` | `sites/home/src/pages/parcerias-governamentais/` |

Cada página `.astro` cita o frame no comentário do topo.

## Passo a passo: implementar uma tela

1. **Leia a tela inteira** e liste as seções, de cima para baixo. Cada seção vira uma `<section>`.
2. **Procure o que já existe:** componentes (`Hero`, `Botao`, `Galeria`, `Carrossel`…), classes (`secao`, `container`, `h-secao`…) e variáveis de cor. Quase tudo no Figma usa os mesmos estilos (Display 61 px, Body 1 20 px, Empreende/001 `#1158D4`…), que já estão em `tokens.css` e `site.css`.
3. **Separe o conteúdo:** todo texto vai para um `.md` em `src/content/paginas/`, e não fica no `.astro`.
4. **Exporte imagens e ícones** (ver abaixo).
5. **Monte a página** seguindo [RECEITAS.md](RECEITAS.md#criar-uma-página-nova).
6. **Compare:** gere o build, rode `npm test -- <site>` e abra o print em `tests/visual/reports/paginas-<site>/<página>-1440.png` ao lado do Figma.
7. **Registre** no `DECISOES_<SITE>.md` tudo o que ficou diferente do Figma de propósito (contraste, textos corrigidos, comportamentos que o Figma não mostra) e as pendências (textos "Lorem ipsum", links que faltam).

## Medidas

No Figma, selecione um elemento e veja o painel da direita (ou o **Dev Mode**, ícone `</>`):
- **posição e tamanho** (X, Y, W, H), **espaçamento** entre itens (auto layout: *gap*) e **padding**;
- **texto:** família, peso, tamanho e altura de linha. "Body 1" = 20 px / 1.25; "Display" = 61 px / 1;
- **cores:** o nome do estilo (ex.: "Empreende/001") indica a variável CSS correspondente.

Prefira **layout flexível** (flex e grid com `gap`) a posições absolutas: o Figma mostra 1440 px, mas o site precisa funcionar de 320 px em diante.

Para o teste de comparação (`figma-<site>.json`), anote o **Y do topo** e a **altura** de cada seção, medidos em relação ao topo do frame (ver [TESTES.md](TESTES.md#comparação-com-o-figma)).

## Exportar imagens e ícones (manual, sem limite)

Selecione a camada e use **Export**, no fim do painel da direita:

| Tipo | Formato | Para onde vai |
|---|---|---|
| Ícone, logo | **SVG** | `src/assets/icones/` ou `src/assets/logos/` (cabeçalho/rodapé: `packages/ui/assets/icons/`) |
| Foto | **JPG 2x** (ou PNG, se tiver transparência) | `src/assets/fotos/` |
| Referência do teste | **PNG 1x** do frame inteiro | `tests/visual/reference/<site>/<nome>-1440.png` |

- Nomes de arquivo em minúsculas, com hífens e sem acentos (`logo-sampa-ensina.svg`).
- Não edite o SVG à mão. Se ele vier com o fundo (ex.: o círculo azul do ícone), use assim mesmo.
- O site gera as versões leves (WebP/AVIF) das fotos sozinho.
- O fundo do banner do Início é uma composição de foto mais camadas de cor; o `scripts/compor-banner.mjs` refaz essa composição exatamente como no Figma.

## Acesso automático (Claude e API) e os limites

O Figma pode ser lido de duas formas automáticas. **As duas têm limite de uso no plano atual (Starter)**:

| Forma | Como funciona | Limite observado |
|---|---|---|
| **MCP do Figma** (pelo Claude) | O Claude lê o frame, os textos, as medidas e as imagens | Cota **mensal** de chamadas. Esgotou em 17/11 e de novo em 23/11/2026 |
| **API REST** (`api.figma.com`) | Leitura com um token pessoal | Poucas exportações de imagem já levam a uma espera de **~3 dias** (erro 429 com `Retry-After`) |

**Token da API:**
- É criado no Figma em *Settings → Security → Personal access tokens*, só com permissão de leitura (*File content: read*). Ele expira em até 30 dias.
- Fica guardado como variável de ambiente do Windows (do usuário) `FIGMA_TOKEN`. **Nunca** vai para o código, para o Git nem para o chat.
- Para usar no PowerShell: `[Environment]::GetEnvironmentVariable('FIGMA_TOKEN','User')`.

**Para gastar menos cota:**
- peça tudo de uma vez: `GET /v1/files/<chave>/nodes?ids=<frame>` traz a estrutura, os textos, as cores e as medidas num pedido só;
- `GET /v1/files/<chave>/images` (imagens originais do arquivo) é mais barato que `GET /v1/images/<chave>?ids=…` (renderizações);
- guarde as respostas e reaproveite; não peça o mesmo frame duas vezes.

**Quando o limite acabar:** exporte manualmente (seção acima) e mande os arquivos, ou mande um print do frame. Com o print, dá para seguir o layout, mas as medidas ficam aproximadas: registre isso nas decisões.
