<?php
/*
 * Página de exemplo mostrando como usar o cabeçalho e o rodapé.
 * Para testar no computador:  php -S localhost:8000   e abra http://localhost:8000/exemplo.php
 */
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';
$hf = require __DIR__ . '/config.php';
?>
<!doctype html>
<html lang="pt-BR" class="no-js">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Exemplo — cabeçalho e rodapé ADE SAMPA</title>
    <link rel="preload" href="<?= hf_e(hf_asset($hf, 'fonts/geist-latin.woff2')) ?>" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="<?= hf_e(hf_asset($hf, 'css/header-footer.css')) ?>">
    <script src="<?= hf_e(hf_asset($hf, 'js/header-footer.js')) ?>" defer></script>
    <style>body { margin: 0; font-family: "Geist", system-ui, sans-serif; } main { padding: 64px 24px; max-width: 1110px; margin: 0 auto; min-height: 50vh; }</style>
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<?php require __DIR__ . '/partials/header.php'; ?>
<main id="conteudo" tabindex="-1">
    <h1>Conteúdo do subdomínio</h1>
    <p>O cabeçalho e o rodapé acima/abaixo vêm de partials/header.php e partials/footer.php.</p>
</main>
<?php require __DIR__ . '/partials/footer.php'; ?>
</body>
</html>
