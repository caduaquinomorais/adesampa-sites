<?php
/**
 * Cabeçalho institucional ADE SAMPA ("menu header") + submenu opcional do programa.
 * Uso: $hf = require 'config.php'; require 'partials/header.php';
 * @var array $hf conteúdo vindo de config.php
 */
require_once __DIR__ . '/../helpers.php';
$cab = $hf['cabecalho'];
$sub = $hf['submenu'] ?? ['links' => []];
?>
<header class="site-header" id="topo">
    <div class="site-header__inner">
        <a class="site-header__logo"<?= hf_href($cab['logo_link']) ?> aria-label="ADE SAMPA — página inicial">
            <img src="<?= hf_e(hf_asset($hf, 'icons/logo-adesampa.svg')) ?>" alt="ADE SAMPA" width="123" height="21">
        </a>
        <button class="site-header__toggle" type="button" aria-expanded="false" aria-controls="menu-principal">
            <span class="site-header__toggle-icon" aria-hidden="true"></span>
            <span>Menu</span>
        </button>
        <nav class="site-header__nav" id="menu-principal" aria-label="Menu principal">
            <ul class="site-header__menu">
                <?php foreach ($cab['menu'] as $item): ?>
                    <li class="site-header__item<?= $item['ativo'] ? ' is-active' : '' ?>">
                        <a class="site-header__link"<?= hf_href($item['link']) ?><?= $item['ativo'] ? ' aria-current="true"' : '' ?>>
                            <?= hf_e($item['rotulo']) ?>
                            <?php if ($item['seta']): ?>
                                <img class="site-header__arrow" src="<?= hf_e(hf_asset($hf, 'icons/seta-menu.svg')) ?>" alt="" width="7" height="4">
                            <?php endif; ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
            <a class="site-header__cta"<?= hf_href($cab['botao_link']) ?>><?= hf_e($cab['botao_texto']) ?></a>
        </nav>
    </div>
</header>
<?php if (!empty($sub['links'])): ?>
<nav class="submenu" aria-label="Seções de <?= hf_e($sub['logo_alt'] ?? 'navegação') ?>">
    <div class="submenu__inner">
        <?php if (!empty($sub['logo'])): ?>
            <a class="submenu__logo"<?= hf_href($sub['logo_link'] ?? '#topo') ?> aria-label="<?= hf_e($sub['logo_alt']) ?> — topo da página">
                <img src="<?= hf_e(hf_asset($hf, $sub['logo'])) ?>" alt="<?= hf_e($sub['logo_alt']) ?>" width="<?= (int) $sub['logo_largura'] ?>" height="<?= (int) $sub['logo_altura'] ?>">
            </a>
        <?php endif; ?>
        <ul class="submenu__list">
            <?php foreach ($sub['links'] as $item): ?>
                <li><a class="submenu__link"<?= hf_href($item['link']) ?>><?= hf_e($item['rotulo']) ?></a></li>
            <?php endforeach; ?>
        </ul>
    </div>
</nav>
<?php endif; ?>
