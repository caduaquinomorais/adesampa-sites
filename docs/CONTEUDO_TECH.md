# Como editar o conteúdo — site Sampa Tech

Todo o texto fica em `sites/tech/src/content/paginas/`. Depois de editar, faça commit e push: o deploy publica sozinho.

## Onde está cada texto

| O que mudar | Arquivo |
|---|---|
| Página Sampa Tech: hero e blocos dos programas (hoje, só o Vai Tec), com o card "Resumo do Edital" | `inicio.md` |
| Página Aceleração Vai Tec: todas as seções | `vaitec.md` |
| Foto do "Sobre" do Vai Tec | `sites/tech/src/assets/fotos/vaitec-sobre.jpg` (e o campo `sobre.imagemAlt` em `vaitec.md`) |

O cabeçalho, o Menu de projetos e o rodapé **não** ficam aqui. Eles são iguais em todos os sites e ficam em `packages/ui/src/data/institucional.ts`.

## Tarefas comuns

- **Abrir ou fechar inscrições:** troque `status: { texto: 'Inscrições abertas', aberto: true }` por, por exemplo, `{ texto: 'Inscrições encerradas', aberto: false }`. A bolinha fica cinza. O status aparece em `inicio.md` e em `vaitec.md` (no `hero`).
- **Responder uma dúvida:** em `vaitec.md`, troque o `resposta:` da pergunta. Para incluir uma pergunta nova, copie um bloco `- pergunta: … resposta: …`. A numeração é automática.
- **Cronograma:** cada linha é um `- { data: "…", titulo: '…' }`. Use `\n` dentro das aspas duplas para quebrar a data em 2 linhas.
- **Links do edital:** preencha `link:` em `edital.botaoPrincipal` (PDF do edital) e em `edital.botaoSecundario` (formulário). Vazio (`''`) = o botão aparece, mas não navega.
- **Novo programa no Sampa Tech:** em `inicio.md`, copie o bloco da lista `programas` (de `- status:` até o fim do `resumo`).

As regras de escrita do YAML (aspas, quebras de linha) são as mesmas da Home: ver [CONTEUDO_HOME.md](CONTEUDO_HOME.md#regras-de-escrita-yaml).

## Testar no computador

```
npm run dev -w sites/tech
```

Abra o endereço que aparecer (termina em `/homolog/sampa-tech/`).
