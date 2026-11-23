# Como editar o conteúdo — site Teia

Todo o texto fica em `sites/teia/src/content/paginas/teia.md`. Depois de editar, faça commit e push: o deploy publica sozinho.

| O que mudar | Onde, em `teia.md` |
|---|---|
| Banner (etiqueta, título, texto) | `banner` |
| Os 4 espaços (texto e fotos) | `espacos` (fotos em `sites/teia/src/assets/fotos/`) |
| Link dos botões "Faça seu agendamento" | `linkAgendamento` |
| Mapa: textos, unidades e o mapa interativo (Google My Maps) | `mapa` |
| Dúvidas frequentes | `duvidas.itens`: escreva a `resposta`. **Pergunta sem resposta não aparece.** |
| PDFs das normas | coloque o PDF em `sites/teia/public/documentos/` e escreva `arquivo: 'documentos/nome.pdf'` |

- **Foto nova num espaço:** acrescente uma linha em `fotos`. Com 2 fotos ou mais, aparecem os pontinhos do carrossel.
- **Unidade nova:** acrescente um item em `mapa.unidades`. Com 2 unidades ou mais, aparece o seletor "Escolha a unidade".

As regras de escrita do YAML (aspas, quebras de linha) são as mesmas da Home: ver [CONTEUDO_HOME.md](CONTEUDO_HOME.md#regras-de-escrita-yaml).
