# Prompt: monorepo Astro dos 7 subdomínios da ADE SAMPA

> **Documento histórico.** Este é o pedido original que deu início ao projeto (16/11/2026). Ele descreve o plano, não o estado atual. Para o estado atual, comece pelo [README.md](../README.md).

Prompt para um agente de IA (ex.: Claude Code) aberto numa **pasta vazia**, nesta mesma máquina. Ele cria um repositório único com os 7 subdomínios da ADE SAMPA. O cabeçalho e o rodapé ficam num só lugar e são idênticos em todos os sites. O deploy publica na KingHost por FTPS.

**Como usar:**
1. Crie uma pasta vazia (ex.: `C:\Users\Kadu\Documents\adesampa-sites`) e abra o Claude Code nela.
2. Preencha o que souber na tabela "Parâmetros". O que ficar como `A DEFINIR`, o agente pergunta antes de começar.
3. Copie tudo entre `--- INÍCIO DO PROMPT ---` e `--- FIM DO PROMPT ---` e cole como primeira mensagem.

---

`--- INÍCIO DO PROMPT ---`

Você é um engenheiro front-end sênior. Nesta pasta vazia, crie um **monorepo Astro** com os sites dos 7 subdomínios da ADE SAMPA. O requisito central: o **cabeçalho e o rodapé são idênticos nos 7 sites**, com o mesmo design e os mesmos links, e existem num **único lugar** do código. Mudou ali, um push publica a mudança em todos os sites.

## Parâmetros

| Parâmetro | Valor |
|---|---|
| Subdomínios (7) | A DEFINIR: nome, endereço final e pasta na KingHost de cada um |
| Site piloto (o primeiro a construir) | A DEFINIR |
| Figma do piloto | A DEFINIR (link, se houver) |
| Ambiente de teste | Por enquanto os sites são testados como pastas em `https://oranilom.com.br/<pasta>/`, como o TEIA (`https://oranilom.com.br/teia/`) |
| Hospedagem | KingHost compartilhada, só FTP/FTPS (sem SSH, sem Node no servidor) |
| Servidor FTP | `web1160.kinghost.net` (confirme com `nslookup ftp.<domínio>`) |
| Repositório | A DEFINIR (sugestão: `github.com/caduaquinomorais/adesampa-sites`, público) |
| Usuário | Fala português e tem pouca experiência com Git/GitHub. Quer um passo por vez, com links diretos |

**Antes de escrever qualquer código**, confira a tabela. Pergunte ao usuário o que estiver `A DEFINIR`, tudo numa mensagem só, e espere a resposta. Se ele ainda não souber os 7 nomes, comece só com o piloto e deixe a estrutura pronta para os demais.

## Material de referência (só leitura, nunca altere)

1. `C:\Users\Kadu\Documents\adesampa-header-footer\`: cabeçalho, submenu e rodapé já extraídos do TEIA. É a **fonte da verdade do design e dos links**:
   - `config.php`: todos os textos e links;
   - `partials/header.php` e `partials/footer.php`: a marcação HTML;
   - `assets/css/header-footer.css`: os estilos, já restritos aos componentes;
   - `assets/js/header-footer.js`: o menu mobile;
   - `assets/icons/` e `assets/fonts/`: logos, ícones e a fonte Geist (OFL);
   - `exemplo.html`: o resultado esperado, renderizado.
2. `C:\Users\Kadu\Documents\teia-teste\`: o site TEIA, em produção (PHP). Leia:
   - `docs/DESIGN_TOKENS.md` e `docs/DECISOES_DE_DESIGN.md`: tokens e decisões de acessibilidade e responsividade (ex.: D-12, contraste dos links do rodapé);
   - `docs/DEPLOY.md`, `docs/PROMPT_DEPLOY_KINGHOST.md` e `.github/workflows/testes.yml`: **o deploy na KingHost que funciona**, com as armadilhas já resolvidas;
   - `tests/visual/`: a comparação visual com o Figma via Chrome headless, que serve de modelo.

## Arquitetura (decidida, não reabra)

- **npm workspaces** (não use pnpm nem yarn, para não somar ferramentas). Use o Node LTS atual e fixe a versão em `.nvmrc` e em `engines`. Use a versão estável mais recente do Astro, com versões exatas e `package-lock.json` versionado.
- **Saída 100% estática** (`output: 'static'`), sem adaptador de servidor. O servidor só recebe HTML, CSS, JS e imagens.
- Estrutura:
  ```
  packages/ui/                 ← compartilhado por todos os sites
    src/components/Header.astro, Footer.astro, Submenu.astro, SkipLink.astro
    src/layouts/BaseLayout.astro   ← <html>, <head>, fonte, header, <main>, footer
    src/data/institucional.ts      ← TODOS os links e textos do header/footer (tipados)
    src/styles/tokens.css, header-footer.css
    src/scripts/menu.ts
    assets/ (icons, fonts)
  sites/<nome>/                ← um por subdomínio; só as páginas e o conteúdo dele
    astro.config.mjs, src/pages/, src/content/, public/.htaccess
  tests/
  .github/workflows/
  docs/
  ```
- **O que é fixo e o que varia por site:**
  - Fixos, iguais nos 7 sites: a marcação do cabeçalho e do rodapé, os textos, os links, os ícones e os estilos. **Nenhum site pode passar textos ou links próprios para o Header ou o Footer.**
  - Variam por site, só por props: o item ativo do menu (`ativo`) e o **Submenu** do programa (logo, rótulo e âncoras). O submenu fica abaixo do cabeçalho e é opcional.
- **Links entre subdomínios:** saem de um mapa central em `institucional.ts`, com uma URL por ambiente (`teste` = `oranilom.com.br/<pasta>/`, `producao` = endereço final). O build escolhe o ambiente por uma variável (ex.: `ADESAMPA_AMBIENTE`). Link vazio = o item aparece sem `href`, com `data-link-pendente="true"`, como no TEIA. Aceite só `https:`, `http:`, `mailto:`, `tel:`, `#ancora` e caminhos internos.
- **`site` e `base` do Astro** vêm de variáveis por site e por ambiente. No teste o site fica numa subpasta (`/tech/`); em produção, na raiz do subdomínio (`/`). Nenhum caminho pode ficar fixo no código: use `import.meta.env.BASE_URL` ou os helpers do Astro.
- **Fonte e ícones** ficam locais em cada build. Nada de CDN ou Google Fonts, por privacidade (LGPD) e para manter a CSP restrita.
- **JavaScript mínimo:** o site funciona sem JS (classe `no-js`, como no TEIA). O menu mobile vira um script do Astro empacotado num arquivo, **nunca inline**, por causa da CSP.

## Requisitos de qualidade

- **Paridade visual:** o Header e o Footer em Astro precisam ficar visualmente iguais ao `exemplo.html` de referência, em 1440, 1024, 768 e 390 px. Automatize a comparação, reaproveitando a abordagem de `teia-teste/tests/visual/`, e mostre os prints ao usuário.
- **Acessibilidade:** mantenha tudo o que o TEIA já tem: skip link, `aria-expanded`/`aria-controls`, fechar com Esc e com clique fora, foco visível, alvos de toque de 44 px no mobile e contraste AA.
- **Segurança no servidor (`public/.htaccess` de cada site):**
  - CSP restrita (`default-src 'self'`, sem `unsafe-inline` para scripts), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`;
  - `ErrorDocument 404` apontando para a página 404 do site, respeitando o `base`;
  - cache longo para `/_astro/*` (arquivos com hash) e curto para HTML.
  - Na KingHost, **nunca** use `php_value`/`php_flag`: eles causam erro 500. O TEIA envia os cabeçalhos pelo PHP, então ninguém confirmou ainda que `mod_headers` funciona lá. Use `<IfModule mod_headers.c>` e **confira os cabeçalhos no ar** depois do primeiro deploy. Se não vierem, avise o usuário e documente.
  - Confira no HTML gerado que não sobrou nenhum `<script>` ou `style=""` inline que a CSP bloquearia (por exemplo, as ilhas e as transições do Astro).
- **Testes** (rodam em todo PR):
  1. `astro check` e o build de todos os sites;
  2. **teste de identidade:** extrai `<header class="site-header">` e `<footer class="site-footer">` do HTML de cada site e confirma que são **idênticos byte a byte** entre os 7, aceitando como única diferença o item ativo. É a garantia do requisito central;
  3. links internos quebrados e assets que dão 404 no build;
  4. nenhum `href` com esquema proibido (`javascript:` etc.).

## Deploy na KingHost (siga o TEIA, não reinvente)

Reaproveite o workflow do TEIA (`teia-teste/.github/workflows/testes.yml`) e respeite **todos** os fatos verificados de `teia-teste/docs/PROMPT_DEPLOY_KINGHOST.md`:
- complete a cadeia do certificado FTPS sem desligar a verificação TLS;
- use `web1160.kinghost.net`, e não `ftp.<domínio>`;
- o `server-dir` é **relativo** (`./pasta/`);
- uma falha de login bloqueia o IP por alguns minutos;
- liste com `LIST`;
- pause cerca de 20 s e tente de novo uma vez.

Diferenças para este projeto:
- **Build antes do envio:** `npm ci`, o build do site e `local-dir: ./sites/<nome>/dist/`.
- **Matriz por site, com `max-parallel: 1`.** Os deploys vão **um por vez**, com pausa entre eles, porque várias conexões FTP seguidas bloqueiam o IP na KingHost.
- **O que publicar:** se mudou `packages/ui/`, `package-lock.json` ou o workflow, publique **todos** os sites. Se mudou só `sites/<nome>/`, publique só esse site. O `workflow_dispatch` aceita o nome de um site ou "todos".
- **Assinatura da pasta:** o deploy só envia para uma pasta que já tenha um arquivo-marcador do projeto (ex.: `.adesampa-site` com o nome do site). Antes do primeiro deploy, oriente o usuário a criar a pasta com esse arquivo pelo FTP ou pelo gerenciador de arquivos.
- **Conferência final por site:** a página inicial e o CSS respondem 200, e a página tem o rodapé (procure um texto fixo, como o CNPJ).
- Deploy só no `main`, depois dos testes (`needs`), nunca em `pull_request`. Use um grupo de concurrency próprio, que nunca cancele um deploy em andamento.

## Fases (pare ao fim de cada uma e mostre o resultado ao usuário)

1. **Perguntas:** a tabela de parâmetros.
2. **Base:** o monorepo, `packages/ui` com Header, Footer, Submenu e BaseLayout, e um site `sites/exemplo` que só mostra o cabeçalho e o rodapé. Mostre os prints comparados com `exemplo.html` nas 4 larguras.
3. **Piloto:** as páginas do primeiro subdomínio, a partir do Figma (se houver um link, use o MCP do Figma) ou do conteúdo que o usuário passar. Conteúdo editável em arquivos (`src/content/`, coleções do Astro), sem CMS e sem banco.
4. **Testes e CI:** os testes de qualidade e o workflow de PR.
5. **Deploy:** o workflow de deploy, o primeiro envio do piloto para a pasta de teste e a conferência no ar, incluindo os cabeçalhos de segurança.
6. **Documentação** (descreva o estado atual, não planos):
   - `README.md`;
   - `docs/ARQUITETURA.md`;
   - `docs/NOVO_SITE.md`: passo a passo para criar o próximo subdomínio, que deve levar minutos;
   - `docs/HEADER_FOOTER.md`: como mudar um link e o que acontece nos 7 sites;
   - `docs/DEPLOY.md`: com a tabela sintoma → causa → solução.

Os outros 6 sites **não** fazem parte desta tarefa. Deixe só a estrutura e o guia `NOVO_SITE.md`. A migração do TEIA para este monorepo vem depois, numa tarefa separada.

## Divisão de trabalho com o usuário

- Faça você mesmo tudo o que não exige credenciais: código, testes, commits em **branch** (nunca direto no `main`), push e acompanhamento das execuções pela API pública do GitHub.
- Peça ao usuário só o que exige login, **um passo por vez**, com **links diretos**:
  - criar o repositório;
  - cadastrar os segredos `FTP_USERNAME` e `FTP_PASSWORD` em `https://github.com/<repo>/settings/secrets/actions/new`, na **aba Secrets**;
  - abrir e mesclar o PR (`https://github.com/<repo>/compare/main...<branch>?expand=1`);
  - configurar o ruleset do `main`;
  - criar as pastas na KingHost.
- Explique em português simples, sem jargão desnecessário.

## Regras

- Nunca peça senha no chat. Se aparecer alguma, oriente o usuário a apagar a mensagem e trocar a senha.
- Nunca desligue a verificação de certificado. Nunca use `git push --force` no `main`.
- Nunca publique numa pasta sem o marcador do projeto.
- Não altere as pastas de referência (`adesampa-header-footer`, `teia-teste`).
- Confirme com o usuário antes de qualquer ação irreversível ou visível para outras pessoas.

## Critério de pronto

- O piloto está no ar em `https://oranilom.com.br/<pasta>/`, com o cabeçalho e o rodapé iguais aos do TEIA.
- Um merge no `main` dispara testes e deploy, e todos os jobs ficam verdes.
- O teste de identidade do header/footer passa.
- Mudar um link em `institucional.ts` e fazer o merge publica a mudança em todos os sites existentes.
- `docs/NOVO_SITE.md` permite criar o próximo subdomínio sem ajuda.

`--- FIM DO PROMPT ---`
