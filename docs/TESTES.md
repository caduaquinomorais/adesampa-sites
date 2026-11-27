# Testes

Os testes rodam sozinhos no GitHub a cada push, e **nada é publicado se algum falhar**. Rodar no computador antes do push economiza tempo: o erro aparece em segundos, em vez de minutos.

## Como rodar

```bash
npm run build                 # os testes leem o build: sempre gere antes
npm test                      # todas as baterias (para na primeira que falhar)
npm test -- home              # só as baterias com "home" no nome
npm test -- "visual: tech "   # só os testes visuais do Sampa Tech
npm test -- build             # só identidade e links (rápido, sem navegador)
npm test -- build home        # várias palavras: roda as baterias que têm QUALQUER uma delas no nome
```

Um filtro que não bate com nenhuma bateria (erro de digitação) falha e lista os nomes disponíveis.

- Para ver **todas** as falhas sem parar na primeira: no PowerShell, `$env:ADESAMPA_TESTES_CONTINUAR=1; npm test`; no bash, `ADESAMPA_TESTES_CONTINUAR=1 npm test`.
- Os testes visuais usam o Chrome ou o Edge instalado no computador. Se nenhum for encontrado, defina a variável `CHROME_PATH` com o caminho do executável.
- Mudou só um site? `npm run build -w sites/home` e `npm test -- home` bastam. Mudou `packages/ui`? Rode tudo.

## As baterias

| Bateria | Arquivo | O que confere | Tempo |
|---|---|---|---|
| **unitários** | `tests/unit/links.test.mjs` | Validação de links (`javascript:` vira pendente…), mapa `SITES` (URLs com `https` e `/` no fim, pastas do FTP únicas) e dados do cabeçalho e do rodapé congelados | segundos |
| **build: identidade** | `tests/build/identidade.mjs` | `<header>` e `<footer>` **idênticos** em todas as páginas de todos os sites (fora o item ativo do menu) | segundos |
| **build: links** | `tests/build/links.mjs` | Todo link interno e toda `#âncora` existem; toda imagem, CSS, JS e fonte existem; nenhum esquema proibido; links pendentes sem `href` | segundos |
| **visual: referência** | `tests/visual/comparar.mjs` | Cabeçalho e rodapé de cada site iguais, pixel a pixel, a `referencia/header-footer/exemplo.html`, em 1440, 1024, 768 e 390 px, inclusive com o menu do celular aberto | ~1 min por site |
| **visual: Figma** | `tests/visual/figma.mjs` | Altura de cada seção igual à do Figma (±4 px) a 1440 px. A diferença de pixels é só informativa | ~1 min por site |
| **visual: páginas** | `tests/visual/paginas.mjs` | Em **todas** as páginas, em 320, 390, 768, 1024 e 1440 px: sem rolagem horizontal; fonte ≥ 12 px; contraste AA; alvos de toque ≥ 44 px abaixo de 1024 px; um único `<h1>`; toda `<img>` com `alt`; campos com rótulo; `lang="pt-BR"`; nenhum `id` repetido | 1–8 min por site |

Além deles, o **build** falha sozinho se houver script ou estilo inline (`packages/ui/src/integracao.ts`) ou um campo de conteúdo inválido (`content.config.ts`). No GitHub, o `astro check` também confere os tipos.

Um site novo em `sites/` entra **sozinho** em todas as baterias. A comparação com o Figma é a única que precisa de configuração.

## Relatórios e capturas

Os testes visuais salvam imagens em `tests/visual/reports/` (pasta ignorada pelo Git):

| Pasta | Conteúdo |
|---|---|
| `reports/<site>/relatorio.html` | Cabeçalho e rodapé: referência \| site \| diferenças em vermelho |
| `reports/figma-<site>/relatorio.html` | Cada seção: Figma \| site \| diferenças |
| `reports/paginas-<site>/` | Print de página inteira de cada página, em 390 e 1440 px |

No GitHub, as mesmas pastas ficam em **Artifacts** (`relatorios-visuais-<site>`), no fim da página da execução, em Actions.

## Falhas comuns e como resolver

| Mensagem | Causa provável | Solução |
|---|---|---|
| `HTML com conteúdo inline bloqueado pela CSP` | `<style>`, `style="…"`, `onclick="…"` ou `<script>` com código no `.astro` | Mova o CSS para o `site.css` e o JS para um `.ts` ([RECEITAS](RECEITAS.md#adicionar-javascript-a-uma-página)) |
| Erro de conteúdo apontando um `.md` e um campo | Campo faltando, com tipo errado ou com YAML mal formatado (Tab, aspas) | Corrija o arquivo indicado. Confira o recuo com espaços |
| `rolagem horizontal (1132px)` | Algo mais largo que a tela (largura fixa, texto longo sem quebra) | Troque `width: 540px` por `max-width` ou `minmax(0, 540px)` e confira os blocos `@media` |
| `alvos < 44px: Texto (38×44)` | Link ou botão pequeno demais no toque (< 1024 px) | No bloco `@media (max-width: 1023px)`: `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center;` |
| `contraste abaixo do AA: Texto 3.2:1` | Cor do texto muito clara (ou escura) para o fundo | Escureça ou clareie a cor até 4,5:1 (3:1 para texto grande). Marque com `AA:` no CSS |
| `2 elementos <h1> (esperado 1)` | Dois títulos principais na página | Deixe um `<h1>`; o resto vira `<h2>` ou `<p>` |
| `imagem sem alt` | `<img>` sem o atributo `alt` | Descreva a imagem, ou use `alt=""` se ela for decorativa |
| `ID repetido` | Dois elementos com o mesmo `id` | Use ids únicos (ex.: `titulo-${item.id}`) |
| Link quebrado `→ /homolog/xyz/` | Página ou âncora que não existe, ou endereço escrito errado | Confira o caminho, crie a página ou deixe o link pendente (`''`) |
| Identidade: cabeçalho ou rodapé diferente entre páginas | Um site mudou algo dentro do `<header>`/`<footer>`, ou copiou um SVG do cabeçalho para a própria pasta | Mude só em `packages/ui`; para reaproveitar um ícone, importe de `@adesampa/ui/assets/icons/…` |
| Referência: diferença de pixels no cabeçalho/rodapé | Texto ou item mudou em `institucional.ts` sem atualizar a referência | Atualize `referencia/header-footer/` ([HEADER_FOOTER.md](HEADER_FOOTER.md#mudar-um-texto-acrescentar-ou-remover-itens)) |
| Figma: `altura 520 (Figma 498, +22)` | A seção ficou mais alta ou mais baixa que no Figma | Ajuste os espaçamentos. Se a mudança foi intencional (texto real maior que o do Figma), atualize o `figma-<site>.json` |
| `Chrome não iniciou o DevTools` | O navegador demorou a abrir | Rode de novo; no GitHub, use *Re-run failed jobs* |

## Comparação com o Figma

Cada site com páginas do Figma tem um `tests/visual/figma-<site>.json`, mais as imagens de referência em `tests/visual/reference/<site>/`:

```json
{
  "paginas": [
    {
      "nome": "vaitec", "url": "vaitec/", "referencia": "vaitec-1440.png", "frame": "64:2150",
      "secoes": [
        { "nome": "hero", "seletor": "main > section:nth-of-type(1)", "y": 110, "altura": 496 },
        { "nome": "rodape", "seletor": ".site-footer", "y": 5521, "altura": 679 }
      ]
    }
  ]
}
```

- `url`: caminho da página no site (`""` = página inicial).
- `referencia`: o PNG do frame exportado do Figma a 1440 px (escala 1x).
- `frame`: o id do frame no Figma (só para consulta).
- `seletor`: como achar a seção na página. `y` e `altura`: a posição e a altura no Figma (ver [FIGMA.md](FIGMA.md#medidas)).
- `"altura": null`: só compara a imagem, sem conferir a altura. Use quando o conteúdo real tem outro tamanho (ex.: lista de dúvidas maior que no Figma).

**Página nova com Figma:** acrescente um bloco em `paginas`, exporte o frame do Figma para `reference/<site>/<nome>-1440.png` e meça as seções.
**Seção nova numa página com Figma:** os seletores `nth-of-type` das seções seguintes mudam de número. Atualize-os e acrescente a seção nova.

A página Produtos digitais ainda não tem referência do Figma: passa só pelos testes de páginas.
