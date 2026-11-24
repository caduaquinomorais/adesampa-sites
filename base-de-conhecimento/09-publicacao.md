# 09 — Publicação: do seu computador até o site no ar

[← Voltar ao índice](../DOCUMENTACAO.md)

A publicação é **automática**. Você não envia arquivos para o servidor à mão: basta mandar a mudança para o ramo `main` do GitHub.

---

## O caminho de uma mudança

```
Você edita os arquivos
   ↓
commit  (salva uma versão, com uma descrição do que mudou)
   ↓
push no main  (envia para o GitHub)
   ↓
GitHub: testes  ──❌ falhou──→  NADA é publicado. O site no ar continua como estava.
   ↓ ✅ passou
GitHub: decide quais sites publicar
   ↓
GitHub: envia para a KingHost, um site por vez, e confere se chegou
   ↓
Site atualizado em oranilom.com.br/homolog/…
```

Acompanhe tudo na aba **Actions** do repositório no GitHub.

---

## Quais sites são publicados?

O GitHub publica **só o que mudou** desde a última publicação que deu certo:

| Você mudou… | É publicado |
|---|---|
| Arquivos dentro de `sites/home/` | Só a Home |
| Arquivos dentro de `sites/tech/` | Só o Sampa Tech |
| Arquivos dentro de `sites/teia/` | Só o Teia |
| Algo em `packages/ui/` (cabeçalho, rodapé, cores gerais), `scripts/`, `.github/workflows/`, `package.json`, `package-lock.json`, `.nvmrc` ou `.npmrc` | **Todos** os sites |
| Só os testes (`tests/`) | Nenhum (os testes rodam, mas nada vai para o ar) |
| Só documentação (`docs/`, `base-de-conhecimento/`, `README.md`, `DOCUMENTACAO.md`) | Nenhum (os testes rodam, mas nada vai para o ar) |

**Forçar a publicação:** na aba **Actions**, escolha "Testes e deploy" → **Run workflow** e, no campo "site", escreva o nome de um site (ex.: `home`) ou `todos`.

---

## Conferir se a mudança chegou

1. Na aba **Actions**, a execução precisa estar ✅ verde, **incluindo** os passos de deploy.
2. Abra o site e recarregue sem o cache do navegador: **Ctrl+F5**.
3. Ainda vendo a versão antiga? Veja o código-fonte da página (**Ctrl+U**) e procure `site.` seguido de letras e números (ex.: `site.a1b2c3.css`). Esse nome muda sempre que o visual muda.

---

## Quando a publicação falha

| O que aparece | O que fazer |
|---|---|
| ❌ num passo de **teste** | A mudança tem um problema. Abra a execução e leia a anotação de erro. Veja [10 — Erros comuns](10-erros-comuns.md) |
| ❌ no **deploy** de um site, com erro de conexão (ex.: `control socket`) | O servidor recusou a conexão naquele momento. O GitHub já tenta 3 vezes sozinho. Se ainda falhar, abra a execução e clique em **Re-run failed jobs**: só o site que falhou é publicado de novo |
| `Chrome não iniciou o DevTools` | O navegador do teste demorou a abrir. Clique em **Re-run failed jobs** |
| O deploy de um site novo para dizendo que falta o marcador | Falta criar a pasta e o arquivo `.adesampa-site` no servidor (ver [07 — Criar um site](07-criar-site.md#7-o-marcador-no-servidor)) |
| ✅ verde, mas o site parece igual | Primeiro, **Ctrl+F5**. Se continuar, rode **Run workflow** com `todos` |

---

## Endereços e pastas no servidor

| Site | Pasta no servidor (dentro de `www/`) | Endereço de teste |
|---|---|---|
| Home | `homolog/` | oranilom.com.br/homolog/ |
| Sampa Tech | `homolog/sampa-tech/` | oranilom.com.br/homolog/sampa-tech/ |
| Teia | `homolog/teia/` | oranilom.com.br/homolog/teia/ |

> ⚠️ As pastas `www/teia/` e `www/sampa-tech/` (sem o `homolog/`) são os **sites antigos**, fora deste projeto. **Nunca mexa nelas.**

As senhas do servidor ficam guardadas nos *Secrets* do GitHub. **Nunca** as coloque em arquivos do projeto nem em mensagens.

**Para se aprofundar:** [docs/DEPLOY.md](../docs/DEPLOY.md).
