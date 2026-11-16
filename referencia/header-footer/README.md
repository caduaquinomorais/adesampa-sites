# Cabeçalho e rodapé institucionais — ADE SAMPA

Componentes extraídos do projeto **TEIA** (`teia-teste`) para reutilizar em outros subdomínios.
Não dependem do framework do TEIA: funcionam em qualquer site PHP 8.0+ ou em HTML puro.

## O que tem aqui

```
adesampa-header-footer/
├── config.php              ← textos e links (edite aqui)
├── helpers.php             ← funções hf_e(), hf_href(), hf_asset()
├── partials/
│   ├── header.php          ← cabeçalho + submenu do programa (opcional)
│   └── footer.php          ← rodapé
├── html/
│   ├── header.html         ← versão pronta em HTML puro (para sites sem PHP)
│   └── footer.html
├── assets/
│   ├── css/header-footer.css
│   ├── js/header-footer.js ← menu mobile (abrir/fechar)
│   ├── fonts/              ← fonte Geist (licença OFL.txt)
│   └── icons/              ← logos e ícones das redes sociais
├── exemplo.php             ← página de exemplo (PHP)
└── exemplo.html            ← mesma página já gerada em HTML
```

## Como usar em um site PHP

1. Copie esta pasta inteira para o projeto do subdomínio.
2. Em `config.php`, ajuste `assets_url` para o endereço público da pasta `assets/`
   (ex.: `'/assets'` ou `'/header-footer/assets'`).
3. No `<head>` da página:
   ```html
   <html lang="pt-BR" class="no-js">
   ...
   <link rel="stylesheet" href="/assets/css/header-footer.css">
   <script src="/assets/js/header-footer.js" defer></script>
   ```
4. No `<body>`:
   ```php
   <?php
   require_once __DIR__ . '/adesampa-header-footer/helpers.php';
   $hf = require __DIR__ . '/adesampa-header-footer/config.php';
   require __DIR__ . '/adesampa-header-footer/partials/header.php';
   ?>
   <main id="conteudo"> ... conteúdo do subdomínio ... </main>
   <?php require __DIR__ . '/adesampa-header-footer/partials/footer.php'; ?>
   ```

Para testar no computador: dentro desta pasta rode `php -S localhost:8000` e abra
<http://localhost:8000/exemplo.php>.

## Como usar em um site sem PHP

Copie o conteúdo de `html/header.html` e `html/footer.html` para as suas páginas, inclua o CSS e o JS
como no passo 3 e copie a pasta `assets/`. Os caminhos das imagens estão como `assets/icons/...`;
ajuste se a pasta ficar em outro lugar. Para mudar textos/links nessa versão, edite o HTML direto
(ou edite `config.php` e gere de novo — veja abaixo).

Para gerar os HTML de novo depois de editar o `config.php`:

```bash
php -r 'require "helpers.php"; $hf = require "config.php"; ob_start(); require "partials/header.php"; file_put_contents("html/header.html", ob_get_clean()); ob_start(); require "partials/footer.php"; file_put_contents("html/footer.html", ob_get_clean());'
php exemplo.php > exemplo.html
```

## Personalizando para o novo subdomínio

- **Item ativo do menu:** em `config.php`, coloque `'ativo' => true` no item da seção atual.
- **Submenu (faixa cinza):** troque o logo (`submenu.logo`, arquivo em `assets/icons/`) e os links.
  Para esconder o submenu, deixe `'links' => []`.
  As cores da faixa ficam em `--hf-submenu-fundo`, `--hf-submenu-texto` e
  `--hf-submenu-texto-hover` no topo do CSS.
- **Links vazios (`''`)** = item aparece mas não navega (marcado como `data-link-pendente="true"`).
  São os mesmos TODO-LINK do TEIA: preencha quando os endereços forem definidos.
- Links aceitos: `https://...`, `http://...`, caminhos internos `/pagina`, `#ancora`, `mailto:` e `tel:`.

## Cuidados para não conflitar com o site

- Todos os estilos ficam dentro de `.site-header`, `.submenu` e `.site-footer`; as variáveis de cor
  começam com `--hf-` e as funções PHP com `hf_`. O CSS **não** mexe no `body` nem em elementos fora
  dos componentes.
- Se o site já tiver classes chamadas `site-header`, `site-footer`, `submenu`, `social-btn` ou
  `skip-link`, renomeie de um lado.
- O `id="topo"` do cabeçalho e o `id="menu-principal"` precisam ser únicos na página.

## Origem

Arquivos originais no TEIA: `app/views/site/_header.php`, `app/views/site/_footer.php`,
`app/content/layout.php`, `public/assets/css/site.css` (seções de cabeçalho, submenu e rodapé) e
`public/assets/js/site.js` (menu mobile). Se mudar algo lá, lembre de atualizar aqui também.
