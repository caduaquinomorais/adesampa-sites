# 10 — Erros comuns: o que a mensagem quer dizer

[← Voltar ao índice](../DOCUMENTACAO.md)

Procure com **Ctrl+F** um trecho da mensagem de erro que você recebeu.

---

## Erros de conteúdo (arquivos `.md` e `.yaml`)

Aparecem no `npm run build`, no `npm run dev` ou no GitHub. A mensagem **diz o arquivo e o campo** com problema.

| Mensagem ou sintoma | O que quer dizer | Como resolver |
|---|---|---|
| Erro apontando um `.md`/`.yaml` e um campo (ex.: `titulo: Required`) | Falta um campo obrigatório, ou ele tem o tipo errado | Confira se o item novo tem **todos** os campos dos itens vizinhos |
| `Invalid enum value` / valor não permitido | O campo só aceita algumas opções (ex.: `programa` só aceita `empreende`, `tech`, `games`, `verde` ou `criativa`) | Use uma das opções listadas na mensagem ou no [05 — Cards e listas](05-cards-e-listas.md) |
| Erro de YAML (`bad indentation`, `unexpected`…) | O **recuo** ou as **aspas** estão errados | Recue com **espaços** (nunca Tab), igual às linhas vizinhas. Feche todas as aspas. Apóstrofo dentro de aspas simples vira dois: `'D''Ávila'` |
| Imagem não encontrada | O caminho da foto está errado, ou o arquivo não está na pasta | Confira o nome do arquivo (maiúsculas, extensão `.jpg`/`.png`) e o caminho `../../assets/…` |
| A notícia não aparece | Ela tem `rascunho: true`, ou a `data` está errada | Tire o `rascunho` e confira o formato da data: `2026-11-20` |
| A dúvida do Teia não aparece | A `resposta` está vazia | Escreva a resposta |

---

## Erros dos testes

| Mensagem | O que quer dizer | Como resolver |
|---|---|---|
| `HTML com conteúdo inline bloqueado pela CSP` | Há estilo (`style="…"`, `<style>`) ou script (`onclick`, `<script>` com código) escrito dentro de um `.astro`. O servidor bloqueia isso por segurança | Mova o CSS para o `site.css` e o código para um arquivo `.ts` ([docs/RECEITAS.md](../docs/RECEITAS.md#adicionar-javascript-a-uma-página)) |
| Link quebrado `→ /homolog/xyz/` | Um link leva a uma página ou a um trecho (`#…`) que não existe | Confira o endereço. Se a página ainda não existe, deixe o link vazio (`''`) |
| `rolagem horizontal (1132px)` | Algo ficou mais largo que a tela do celular | No CSS, troque larguras fixas (`width: 540px`) por `max-width: 540px`. Textos muito longos sem espaço também causam isso |
| `alvos < 44px: Texto (38×44)` | Um link ou botão ficou pequeno demais para o dedo, no celular ou tablet | No bloco `@media (max-width: 1023px)` do CSS, dê ao elemento `min-height: 44px; min-width: 44px;` |
| `contraste abaixo do AA: Texto 3.2:1` | A cor do texto está clara (ou escura) demais em relação ao fundo | Escureça ou clareie a cor até 4,5:1 (3:1 para texto grande). Use o [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) |
| `2 elementos <h1> (esperado 1)` | A página tem dois títulos principais | Deixe um só `<h1>`. Os outros viram `<h2>` |
| `imagem sem alt` | Uma imagem não tem descrição | Escreva o `alt`. Se a imagem for só decoração, use `alt=""` |
| `ID repetido` | Dois elementos da página têm o mesmo `id` | Dê nomes diferentes |
| Identidade: cabeçalho ou rodapé diferente entre páginas | Algo dentro do cabeçalho ou do rodapé foi mudado num site só | Mude só em `packages/ui/` ([04](04-mapa-compartilhado.md)) |
| Referência: diferença de pixels no cabeçalho ou no rodapé | O texto do cabeçalho ou do rodapé mudou, mas o modelo de comparação não | Atualize os 3 arquivos de `referencia/header-footer/` ([04](04-mapa-compartilhado.md#o-cuidado-mais-importante)) |
| Figma: `altura 520 (Figma 498, +22)` | A seção ficou mais alta (ou mais baixa) que no desenho do Figma | Se foi sem querer, ajuste os espaços no CSS. Se foi de propósito (mais cards, textos maiores), atualize o `figma-<site>.json` ([05](05-cards-e-listas.md#quando-o-teste-do-figma-reprova-depois-de-acrescentar-cards)) |
| `Nenhuma bateria tem "…" no nome` | A palavra do filtro do `npm test` não existe | Confira a lista de nomes que aparece logo abaixo da mensagem |
| `Chrome não iniciou o DevTools` | O navegador demorou a abrir | Rode de novo. No GitHub, **Re-run failed jobs** |

---

## Erros no computador

| Mensagem ou sintoma | Como resolver |
|---|---|
| `npm` não é reconhecido | O Node.js não está instalado, ou o terminal foi aberto antes da instalação. Instale e reabra o VS Code |
| `Cannot find module…` ou `Cannot find package…` | Rode `npm ci` na pasta do projeto (as ferramentas não estão instaladas ou estão desatualizadas) |
| Os testes dizem que não encontraram o site gerado | Rode `npm run build` antes do `npm test` |
| Os testes visuais não encontram o navegador | Instale o Chrome ou o Edge, ou defina a variável `CHROME_PATH` com o caminho do executável |
| A versão do Node está errada (`engines`) | Instale o Node **26.13.1** (a versão do arquivo `.nvmrc`) |
| O `npm run dev` diz que a porta está em uso | Já existe outro `npm run dev` aberto. Feche-o com Ctrl+C, ou use o endereço que aparecer |

---

## Erros na publicação

Veja [09 — Publicação](09-publicacao.md#quando-a-publicação-falha).

---

**Não achou o seu erro?** Veja a tabela completa em [docs/TESTES.md](../docs/TESTES.md#falhas-comuns-e-como-resolver) ou peça ajuda a alguém da equipe, com o **texto completo** da mensagem.
