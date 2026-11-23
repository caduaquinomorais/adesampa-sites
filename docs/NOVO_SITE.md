# Criar um site novo

Exemplo: o site **Sampa Games** em `https://oranilom.com.br/homolog/sampa-games/`. O modelo mais completo é o `sites/tech/`, com hero, submenu, página interna, 404 e conteúdo editável.

Tempo estimado: 15 minutos até o site em branco estar no ar. Depois disso, é montar as páginas.

## 1. Copiar o modelo

```bash
cp -r sites/tech sites/games
rm -rf sites/games/dist sites/games/.astro sites/games/node_modules
```

No Windows (Explorador), copie a pasta `sites/tech`, renomeie para `games` e apague dentro dela as pastas `dist`, `.astro` e `node_modules`, se existirem.

## 2. Dar nome ao site

1. **`sites/games/package.json`:** troque o `name` e a `description`:
   ```json
   "name": "@adesampa/site-games",
   "description": "Site do Sampa Games.",
   ```
2. **`sites/games/astro.config.mjs`:**
   ```js
   export default configurarSite('games');
   ```
3. **`packages/ui/src/data/institucional.ts`:** cadastre o site no mapa `SITES`, copiando o bloco do `tech`:
   ```ts
   games: {
     rotulo: 'Sampa Games',
     url: {
       teste: 'https://oranilom.com.br/homolog/sampa-games/',
       producao: 'https://oranilom.com.br/homolog/sampa-games/',
     },
     pastaFtp: { teste: 'homolog/sampa-games', producao: 'homolog/sampa-games' },
     publicar: true,
   },
   ```
   - A URL termina com `/`, e a pasta do FTP **não** começa com `/`.
   - Duas pastas iguais dão erro no teste unitário.
4. Na raiz do projeto, rode `npm install` para o npm registrar o workspace novo. O `package-lock.json` muda: inclua-o no commit.

## 3. Limpar o conteúdo do modelo

O site copiado ainda tem as páginas do Sampa Tech. O caminho mais simples:

1. Em `src/pages/`, mantenha `index.astro` e `404.astro` e apague `vaitec/`.
2. Em `src/content/paginas/`, mantenha `inicio.md` (troque os textos) e apague `vaitec.md`.
3. Em `src/content.config.ts`, apague a coleção `vaitec` e ajuste os campos de `inicio` ao que a página nova precisa.
4. Em `src/assets/`, troque fotos e logos.
5. Em `src/styles/site.css`, ajuste as cores do programa no bloco `:root` (ex.: `--games-001: #9B32E0`). Confira o contraste: texto branco sobre a cor do programa precisa de 4,5:1.
6. Ajuste o submenu em `index.astro` (`rotulo`, `logo`, `links`).

Rode `npm run dev -w sites/games` e confira em `http://localhost:4321/homolog/sampa-games/`.

## 4. Segurança e servidor

`sites/games/public/.htaccess` já veio do modelo, e não precisa mudar nada, **exceto** se o site incorporar conteúdo de outro domínio (mapa, vídeo). Nesse caso, libere só aquele domínio na linha `Content-Security-Policy`, como no Teia:

```
frame-src https://www.google.com;
```

## 5. Ligar o site ao resto

Em `institucional.ts`:
- **Menu de projetos:** no eixo `games`, troque `link: ''` por `link: pagina('games')`. O logo passa a ser um link, com o zoom no hover;
- **rodapé:** ligue os itens da coluna "Sampa Games", ex.: `link('Curso de game dev', pagina('games', 'curso/'))`;
- **outras páginas:** um card na Home que leve ao site novo usa `resolverDestino(pagina('games'), ambienteAtual())` (veja `sites/home/src/components/Eixos.astro`).

## 6. Criar a pasta no FTP (antes do primeiro deploy)

O deploy **só publica numa pasta que tenha o marcador do projeto**. É uma proteção contra sobrescrever a pasta errada.

1. Pelo gerenciador de arquivos da KingHost (ou por um programa de FTP), crie a pasta `www/homolog/sampa-games/`.
2. Dentro dela, crie o arquivo `.adesampa-site` (com o ponto no começo). O **único conteúdo** é o nome do site, como em `astro.config.mjs`:
   ```
   games
   ```

Sem o marcador, ou com outro conteúdo, o deploy desse site para com erro e não envia nada.

## 7. Testar e publicar

```bash
npm run build
npm test -- games
```

O site novo entra **sozinho** em todos os testes: identidade do cabeçalho e do rodapé, links, comparação com a referência, responsividade e acessibilidade. A comparação com o Figma é opcional (ver [TESTES.md](TESTES.md#comparação-com-o-figma)).

Faça commit e push. Como `packages/` mudou (o mapa `SITES`), o deploy publica **todos** os sites, inclusive o novo.

## 8. Documentar

- Em `docs/DEPLOY.md`, acrescente a linha na tabela "Sites e pastas no FTP".
- No `README.md`, acrescente a linha na tabela "Sites".
- Crie `docs/CONTEUDO_GAMES.md` (como editar os textos) e `docs/DECISOES_GAMES.md` (o que ficou diferente do Figma e as pendências). Copie os do Tech como modelo.
- Em `docs/ONDE_MUDAR.md`, acrescente o site na primeira tabela.
