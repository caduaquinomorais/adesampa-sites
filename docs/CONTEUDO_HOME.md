# Como editar o conteúdo do site Home

Todo o texto do site Home fica em arquivos dentro de `sites/home/src/content/`. Não há painel nem banco de dados: você edita o arquivo, faz o commit e, depois do merge no `main`, o deploy publica.

O build confere cada arquivo. Se faltar um campo obrigatório ou um valor estiver errado, ele falha com uma mensagem que diz o arquivo e o campo.

## Onde está cada texto

| O que mudar | Arquivo |
|---|---|
| Textos da página Início (banner, parcerias governamentais, números, Teia, produtos, Praça) | `paginas/inicio.md` |
| Textos da página Sobre | `paginas/sobre.md` |
| Textos da página Comunicação (manuais, contatos, cabeçalho das notícias) | `paginas/comunicacao.md` |
| Textos da página Publicações | `paginas/publicacoes.md` |
| Textos da página Produtos digitais (plataformas, recursos, ícones e botões) | `paginas/produtos-digitais.md` |
| Cards "Destaques e oportunidades" do Início | `destaques.yaml` |
| Revistas ADE SAMPA News e cartilhas | `publicacoes.yaml` |
| Categorias das notícias (os filtros) | `categorias.yaml` |
| Notícias | `noticias/` (um arquivo por notícia) |
| Fotos do carrossel "Parcerias governamentais" (foto, título sobre a foto e descrição) | `paginas/inicio.md`, lista `parcerias.itens` (fotos em `src/assets/fotos/`) |

O cabeçalho e o rodapé **não** ficam aqui: eles são iguais em todos os sites e ficam em `packages/ui/src/data/institucional.ts` (ver [HEADER_FOOTER.md](HEADER_FOOTER.md)).

## Regras de escrita (YAML)

- Textos entre aspas simples: `'Texto'`. Se o texto tiver apóstrofo, escreva-o duas vezes: `'D''Ávila'`.
- Quebra de linha forçada: use aspas duplas e `\n`, por exemplo `"Linha 1\nLinha 2"`. Ela só vale em telas grandes, porque no celular o texto quebra sozinho.
- Parágrafos (em `sobre.md`): use `|-` e deixe uma linha em branco entre eles.
- Links:
  - `''` (vazio): o item aparece, mas não navega (link pendente);
  - `'sobre/'`: página deste site, escrita **sem** barra no começo. O endereço completo é montado sozinho, tanto no teste quanto na produção;
  - `'https://…'`: endereço externo;
  - `'mailto:…'`: e-mail.

## Publicar uma notícia

1. Copie `noticias/mais-mulheres-terceira-edicao.md` com um novo nome em letras minúsculas e com hífens, por exemplo `noticias/feira-de-credito-zona-leste.md`. O nome vira o endereço: `/comunicacao/noticias/feira-de-credito-zona-leste/`.
2. Edite o cabeçalho, que fica entre as linhas `---`:
   - `titulo`, `resumo` (o texto do card, com até 220 caracteres) e `data` (no formato `2026-11-20`);
   - `categoria`: um dos ids de `categorias.yaml`, como `editais-e-chamadas`, `eventos`, `teia` ou `microcredito`;
   - `subtitulo`: opcional;
   - `imagem` + `imagemAlt`: opcionais. Coloque a imagem em `sites/home/src/assets/noticias/` e escreva `imagem: ../../assets/noticias/arquivo.jpg`. A descrição (`imagemAlt`) é obrigatória quando há imagem;
   - `rascunho: true` mantém a notícia fora do site.
3. Escreva o texto abaixo do segundo `---`, com uma linha em branco entre os parágrafos. Links no formato `[texto](https://…)`.

A notícia aparece sozinha:
- na página Comunicação, entre as 6 mais recentes;
- na lista completa;
- na página da categoria;
- na busca;
- em "Também pode interessar" das outras notícias.

## Revistas e cartilhas

Em `publicacoes.yaml`, cada item tem:
- `tipo`: `revista` ou `cartilha`;
- `ordem`: o menor número aparece primeiro;
- `titulo`;
- `capa`: imagem em `src/assets/publicacoes/`;
- `capaAlt`: a descrição da capa;
- `arquivo`: o link do PDF. Enquanto `arquivo` estiver vazio, o card aparece, mas não abre nada.

## Testar no computador

```bash
npm run dev -w sites/home
```

Abra o endereço que aparecer no terminal (por exemplo, `http://localhost:4321/homolog/`).
