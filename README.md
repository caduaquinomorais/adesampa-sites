# ADE SAMPA — sites

Os sites da ADE SAMPA (Agência São Paulo de Desenvolvimento) num repositório só. Todos usam o **mesmo cabeçalho, o mesmo menu e o mesmo rodapé**, e cada um tem as suas páginas.

- **Tecnologia:** [Astro](https://astro.build), que gera **sites estáticos** (só HTML, CSS, JavaScript e imagens). Não há banco de dados, PHP nem painel de administração. Os textos ficam em arquivos `.md` e `.yaml`.
- **Hospedagem:** KingHost (Apache), por FTP.
- **Publicação:** automática. Cada push no `main` roda os testes no GitHub e, se passarem, publica (ver [docs/DEPLOY.md](docs/DEPLOY.md)).

## Sites

| Site | Pasta | Endereço (homologação) | Páginas |
|---|---|---|---|
| Home (ADE SAMPA) | `sites/home/` | https://oranilom.com.br/homolog/ | Início, Sobre, Comunicação, Notícias, Publicações, Produtos digitais, Parcerias governamentais |
| Sampa Tech | `sites/tech/` | https://oranilom.com.br/homolog/sampa-tech/ | Sampa Tech, Aceleração Vai Tec |
| Teia | `sites/teia/` | https://oranilom.com.br/homolog/teia/ | Teia (página única) |
| Exemplo | `sites/exemplo/` | — (nunca é publicado) | Só cabeçalho e rodapé, usado nos testes |

> **Nunca mexa** em `www/teia/` nem em `www/sampa-tech/` no FTP. São os sites antigos, fora deste projeto.

## Começando

Você precisa de:
- **Node.js 26.13.1** (a versão está em `.nvmrc`) e **npm 11**;
- **Git**;
- **Google Chrome** ou **Microsoft Edge**, só para os testes visuais.

```bash
git clone https://github.com/caduaquinomorais/adesampa-sites.git
cd adesampa-sites
npm ci                       # instala as dependências exatas do package-lock.json
npm run dev -w sites/home    # abre o site Home em modo de desenvolvimento
```

Abra o endereço que aparecer no terminal (ex.: `http://localhost:4321/homolog/`). Ao salvar um arquivo, a página atualiza sozinha. Troque `home` por `tech` ou `teia` para os outros sites.

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev -w sites/<site>` | Servidor local com atualização automática |
| `npm run build` | Gera todos os sites em `sites/<site>/dist/` |
| `npm run build -w sites/<site>` | Gera um site só |
| `npm run check` | Confere os tipos (TypeScript) e os arquivos `.astro` |
| `npm test` | Roda **todos** os testes (precisa do build antes) |
| `npm test -- home` | Roda só os testes com "home" no nome (vale também `build`, `unitários`, `visual: tech`…) |

## Como trabalhar no dia a dia

1. **Ache o arquivo.** O guia [docs/ONDE_MUDAR.md](docs/ONDE_MUDAR.md) diz onde fica cada coisa (textos, links, cores, imagens…).
2. **Mude e veja no computador** com `npm run dev -w sites/<site>`.
3. **Opcional, mas recomendado:** rode `npm run build` e depois `npm test`, para pegar os erros antes do GitHub.
4. **Commit e push no `main`.** O GitHub testa tudo e publica só os sites que mudaram. Se algum teste falhar, nada é publicado e o site no ar continua como estava.
5. **Acompanhe** na aba [Actions](https://github.com/caduaquinomorais/adesampa-sites/actions) do GitHub.

## Estrutura de pastas

```
adesampa-sites/
├── sites/                  um site por pasta (cada um é um projeto Astro)
│   ├── home/
│   │   ├── public/.htaccess      regras do servidor (segurança, cache, 404)
│   │   └── src/
│   │       ├── content/          TEXTOS editáveis (.md e .yaml)
│   │       ├── content.config.ts regras dos campos de cada texto
│   │       ├── pages/            uma pasta = um endereço (pages/sobre/ → /sobre/)
│   │       ├── components/       peças reaproveitadas (botão, card, hero…)
│   │       ├── assets/           fotos, ícones e logos
│   │       ├── styles/site.css   estilos das páginas deste site
│   │       └── lib/              funções de apoio
│   ├── tech/  teia/  exemplo/
├── packages/ui/            o que é IGUAL em todos os sites
│   ├── src/data/institucional.ts   textos e links do cabeçalho, menu e rodapé + mapa dos sites
│   ├── src/components/             Header, Footer, Submenu, SkipLink
│   ├── src/layouts/BaseLayout.astro  o "esqueleto" de toda página
│   ├── src/styles/                 tokens.css (cores, fontes) e header-footer.css
│   └── assets/                     fonte Geist e ícones do cabeçalho/rodapé
├── tests/                  testes automáticos (unitários, build e visuais)
├── scripts/                deploy-plano.mjs (o que publicar) e utilitários
├── referencia/header-footer/  modelo original (PHP/HTML) do cabeçalho e do rodapé
├── docs/                   documentação
└── .github/workflows/testes.yml  testes e deploy no GitHub
```

## Documentação

**Para mudar coisas**
- [ONDE_MUDAR.md](docs/ONDE_MUDAR.md): tabela rápida de "quero mudar X → arquivo Y".
- [RECEITAS.md](docs/RECEITAS.md): passo a passo com código (nova página, nova seção, novo campo, ícone, item de menu, script…).
- [CONTEUDO_HOME.md](docs/CONTEUDO_HOME.md), [CONTEUDO_TECH.md](docs/CONTEUDO_TECH.md) e [CONTEUDO_TEIA.md](docs/CONTEUDO_TEIA.md): como editar os textos de cada site (notícias, revistas, dúvidas…).
- [HEADER_FOOTER.md](docs/HEADER_FOOTER.md): cabeçalho, Menu de projetos, submenu e rodapé.
- [NOVO_SITE.md](docs/NOVO_SITE.md): como criar um site novo (ex.: Sampa Games).

**Para entender o projeto**
- [ARQUITETURA.md](docs/ARQUITETURA.md): como as peças se encaixam (monorepo, endereços, links, segurança).
- [TESTES.md](docs/TESTES.md): o que cada teste confere e como resolver as falhas mais comuns.
- [DEPLOY.md](docs/DEPLOY.md): publicação na KingHost e problemas conhecidos.
- [FIGMA.md](docs/FIGMA.md): como transformar o Figma em código (medidas, exportação, limites de uso).

**Decisões (por que algo está diferente do Figma)**
- [DECISOES_HOME.md](docs/DECISOES_HOME.md), [DECISOES_TECH.md](docs/DECISOES_TECH.md) e [DECISOES_TEIA.md](docs/DECISOES_TEIA.md). Cada uma termina com a lista de **pendências** (textos e links que faltam).

## Regras de ouro

1. **Nada de script nem estilo "inline".** Nada de `<script>` com código dentro do HTML, `<style>` ou `style="…"`. O servidor bloqueia (CSP), e o build **falha** se encontrar algum. CSS vai em `.css` e JavaScript em `.ts`, importado (ver [RECEITAS.md](docs/RECEITAS.md#adicionar-javascript-a-uma-página)).
2. **Nunca escreva endereços fixos** como `href="/sobre/"`. Use `caminho('sobre/')` dentro do site e `pagina('home', 'sobre/')` entre sites. Assim os links funcionam no teste (`/homolog/`) e na produção.
3. **Textos ficam no conteúdo** (`src/content/`), não no meio do `.astro`.
4. **Toda imagem tem descrição** (`alt`), e as cores precisam de contraste suficiente (WCAG AA). O teste confere as duas coisas.
5. **Cabeçalho e rodapé só se mudam em `packages/ui`.** Eles precisam ser idênticos em todos os sites, e há um teste só para isso.
6. **Nunca coloque senhas ou tokens no código** nem no chat. As senhas do FTP ficam nos *Secrets* do GitHub.
