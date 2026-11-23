# Deploy (KingHost)

O deploy é automático. Ele é feito pelo workflow [.github/workflows/testes.yml](../.github/workflows/testes.yml).

## Como funciona

1. **Push no `main`** dispara o workflow. Ele também pode ser disparado pelo botão *Run workflow* na aba Actions.
2. **Testes:** roda `check`, build e todos os testes. Se algum falhar, nada é publicado e o site no ar continua como estava.
3. **Planejar:** o script [scripts/deploy-plano.mjs](../scripts/deploy-plano.mjs) decide quais sites publicar.
   - Ele compara com o commit do **último run bem-sucedido** no `main`. Não compara só com o push anterior.
   - Mudou algo compartilhado (`packages/`, `scripts/`, workflow, `package*.json`, `.nvmrc`)? Publica **todos** os sites.
   - Caso contrário, publica só os sites cujos arquivos em `sites/<nome>/` mudaram.
   - No *Run workflow*, o campo "site" aceita o nome de um site ou "todos".
4. **Deploy:** um site por vez, por FTPS (`web1160.kinghost.net`).
   - Antes de enviar, confere o marcador `.adesampa-site` na pasta de destino, para não sobrescrever a pasta errada.
   - Se o envio falhar, faz uma pausa e tenta de novo.
   - Depois de enviar, confere no ar a página, a 404 e os cabeçalhos de segurança.

Configuração no GitHub: os segredos `FTP_USERNAME` e `FTP_PASSWORD`, e as variáveis `ADESAMPA_AMBIENTE` (padrão `teste`) e `FTP_SERVER`.

## Sites e pastas no FTP

| Site | Pasta no FTP (dentro de `www/`) | Conteúdo do marcador `.adesampa-site` | Endereço de teste |
|---|---|---|---|
| `home` | `homolog/` | `home` | oranilom.com.br/homolog/ |
| `tech` | `homolog/sampa-tech/` | `tech` | oranilom.com.br/homolog/sampa-tech/ |

**Site novo:** antes do primeiro deploy, crie a pasta pelo FTP ou pelo gerenciador de arquivos da KingHost e, dentro dela, um arquivo `.adesampa-site` cujo único conteúdo é o nome do site. Sem o marcador, o deploy desse site para com um erro e não envia nada.

## Problemas conhecidos

| Sintoma | Causa | O que fazer |
|---|---|---|
| Actions verde, mas o site no ar não mudou | Até 18/11/2026, o plano comparava só com o push anterior. Um deploy que falhava "perdia" as mudanças. | Já corrigido (comparação com o último run bem-sucedido). Para forçar: *Run workflow* → `todos`. |
| "Chrome não iniciou o DevTools" | O Chrome demorou a abrir no runner do GitHub. | Os testes agora usam uma porta livre escolhida pelo Chrome, esperam 30 s e tentam 3 vezes. Se ainda acontecer, rode o workflow de novo. |
| Página antiga no navegador | Cache do navegador. | Ctrl+F5. O HTML é servido com `no-cache`, e CSS/JS têm nome com hash. |

## Conferir se o deploy chegou

Abra o site e veja o código-fonte (Ctrl+U). O nome do CSS (`site.<hash>.css`) muda a cada mudança de estilo.
