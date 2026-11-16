/* ADE SAMPA — menu mobile do cabeçalho (JavaScript puro, sem dependências).
   O cabeçalho funciona sem JavaScript; este arquivo só melhora a experiência. */
(function () {
    'use strict';
    document.documentElement.classList.remove('no-js');

    var header = document.querySelector('.site-header');
    var toggle = header && header.querySelector('.site-header__toggle');
    if (!toggle) { return; }

    var setOpen = function (open) {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function () {
        setOpen(!header.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && header.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', function (ev) {
        if (header.classList.contains('is-open') && !header.contains(ev.target)) {
            setOpen(false);
        }
    });
    // Fecha o menu ao clicar em uma âncora interna (#secao).
    header.addEventListener('click', function (ev) {
        if (ev.target.closest && ev.target.closest('a[href^="#"]')) { setOpen(false); }
    });
})();
