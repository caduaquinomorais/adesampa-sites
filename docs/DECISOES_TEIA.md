# Decisões — site Teia (migração para o monorepo)

O Teia foi construído no projeto `teia-teste` (PHP), que continua no ar em `oranilom.com.br/teia/`. Esta é a versão do monorepo (Astro), publicada em `oranilom.com.br/homolog/teia/` para conferência. **As decisões de design do Teia continuam valendo** e estão em `teia-teste/docs/DECISOES_DE_DESIGN.md` (D-01 a D-13). Aqui ficam só as diferenças da migração.

## TE-01 — O que mudou na migração

- **Mesma página:** ordem, layout, textos, fotos, ícones e classes CSS iguais ao `teia-teste`. A comparação com o Figma (frame "Teia", 212:2903) dá as mesmas alturas: `tests/visual/figma.mjs teia`.
- **Cabeçalho, submenu e rodapé** vêm do pacote compartilhado (`packages/ui`), iguais aos dos outros sites. Com isso, o Teia ganha o Menu de projetos, o item "Governamental" e os links reais das redes sociais.
- **Mapa:**
  - O Teia antigo carregava o Google Maps sozinho (um iframe por endereço).
  - Agora o cartão mostra só o mapa: uma prévia (imagem do Figma) que vira o Google My Maps sozinha quando a pessoa chega perto da seção (o mesmo do Início). O painel da unidade do Figma era um exemplo e saiu do cartão em 26/11/2026; os dados da unidade continuam em `teia.md` (`mapa.unidades`), sem uso na página.
  - Até 26/11/2026, o Google só carregava no clique. A mudança e a questão de LGPD estão em H-16 (`DECISOES_HOME.md`).
  - Sem JavaScript, fica a prévia (imagem).
- **CEP da unidade:** passou a ser `02169-030`. No Teia antigo, o CEP estava cortado (pendência P-04), e o número completo aparece na imagem do mapa do Figma usada no Início.
- **Trilha:** "Início" leva à Home. "Programas" fica sem link, porque ainda não existe uma página de programas.
- **Links para o Teia:**
  - nos 7 sites, os links do Menu de projetos ("Coworkings públicos", "Estúdios de podcast", "Estúdios de fotografia", "Estúdios de música") e o do rodapé ("Teia: coworkings e estúdios públicos") levam ao Teia novo (`homolog/teia/`);
  - no Início, o "Saiba mais" e o link do mapa também levam ao Teia novo.

## TE-02 — Troca do Teia antigo pelo novo (quando aprovado)

1. Mudar a pasta e o endereço do site `teia` no mapa `SITES` (`packages/ui/src/data/institucional.ts`) para `teia` e `https://oranilom.com.br/teia/`.
2. Na pasta `www/teia/` do FTP, **apagar os arquivos do Teia antigo** (`app/`, `public/`, `index.php`, `.htaccess`…). Antes, guarde uma cópia. Depois, criar o marcador `.adesampa-site` com `teia`.
3. Atualizar os links do Início (`inicio.md`) para o endereço final.

## Pendências (as mesmas do Teia antigo)

| # | Pendência |
|---|---|
| P-01 | Respostas das dúvidas: as perguntas sem resposta não aparecem. |
| P-02 | PDFs das normas: os botões "Baixar PDF" só aparecem com o arquivo. |
