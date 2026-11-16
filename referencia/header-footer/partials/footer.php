<?php
/**
 * Rodapé institucional ADE SAMPA ("Rodapé/Redapé V1").
 * Uso: $hf = require 'config.php'; require 'partials/footer.php';
 * As cores das barras das colunas são identidade visual (fixas aqui).
 * @var array $hf conteúdo vindo de config.php
 */
require_once __DIR__ . '/../helpers.php';
$r = $hf['rodape'];
$colunas = [
    'col_adesampa' => 'empreende',
    'col_empreende' => 'empreende',
    'col_tech' => 'tech',
    'col_games' => 'games',
    'col_verde' => 'verde',
    'col_criativa' => 'criativa',
    'col_outros' => 'empreende',
    'col_comunicacao' => 'empreende',
];
$redes = [
    'instagram' => 'Instagram',
    'linkedin' => 'LinkedIn',
    'youtube' => 'YouTube',
    'facebook' => 'Facebook',
];
?>
<footer class="site-footer">
    <div class="site-footer__top hf-container">
        <div class="site-footer__about">
            <a class="site-footer__logo"<?= hf_href($r['logo_link']) ?> aria-label="ADE SAMPA">
                <img src="<?= hf_e(hf_asset($hf, 'icons/logo-adesampa-rodape.svg')) ?>" alt="ADE SAMPA" width="199" height="34" loading="lazy">
            </a>
            <p class="site-footer__text"><?= hf_e($r['texto']) ?></p>
        </div>
        <div class="site-footer__social">
            <p class="site-footer__heading"><?= hf_e($r['redes_titulo']) ?></p>
            <ul class="site-footer__social-list">
                <?php foreach ($redes as $key => $nome): ?>
                    <li>
                        <a class="social-btn"<?= hf_href($r['redes'][$key] ?? '') ?> aria-label="<?= hf_e($nome) ?>">
                            <img src="<?= hf_e(hf_asset($hf, 'icons/rede-' . $key . '.svg')) ?>" alt="" width="15" height="15" loading="lazy">
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>

    <nav class="site-footer__columns hf-container" aria-label="Mapa do site ADE SAMPA">
        <?php foreach ($colunas as $key => $cor): if (!isset($r['colunas'][$key])) { continue; } $col = $r['colunas'][$key]; ?>
            <div class="site-footer__col">
                <p class="site-footer__col-title"><span class="site-footer__bar site-footer__bar--<?= hf_e($cor) ?>" aria-hidden="true"></span><?= hf_e($col['titulo']) ?></p>
                <ul class="site-footer__links">
                    <?php foreach ($col['links'] as $link): ?>
                        <li><a class="site-footer__link"<?= hf_href($link['link']) ?>><?= hf_e($link['rotulo']) ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endforeach; ?>
    </nav>

    <div class="site-footer__bottom hf-container">
        <div class="site-footer__legal">
            <ul class="site-footer__legal-links">
                <?php foreach ($r['legais'] as $i => $link): ?>
                    <?php if ($i > 0): ?><li class="site-footer__dot" aria-hidden="true">•</li><?php endif; ?>
                    <li><a class="site-footer__link"<?= hf_href($link['link']) ?>><?= hf_e($link['rotulo']) ?></a></li>
                <?php endforeach; ?>
            </ul>
            <p class="site-footer__info">
                <strong><?= hf_e($r['empresa']) ?></strong> <span>| <?= hf_e($r['cnpj']) ?></span><br>
                <?= hf_e($r['endereco']) ?><br>
                <?= hf_e($r['copyright']) ?>
            </p>
        </div>
        <div class="site-footer__logos">
            <img class="site-footer__logo-ade" src="<?= hf_e(hf_asset($hf, 'icons/logo-adesampa-rodape-assinatura.svg')) ?>" alt="ADE SAMPA" width="133" height="23" loading="lazy">
            <img class="site-footer__logo-pref" src="<?= hf_e(hf_asset($hf, 'icons/logo-prefeitura-rodape.svg')) ?>" alt="Prefeitura de São Paulo" width="161" height="51" loading="lazy">
        </div>
    </div>
</footer>
