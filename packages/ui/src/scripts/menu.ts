/*
 * ADE SAMPA — menu mobile do cabeçalho.
 * O cabeçalho funciona sem JavaScript (classe "no-js" no <html>: o menu fica sempre aberto);
 * este script só melhora a experiência. O Astro o empacota num arquivo em /_astro/ (nunca inline),
 * para respeitar a CSP (script-src 'self').
 * Origem: adesampa-header-footer/assets/js/header-footer.js.
 */

document.documentElement.classList.remove('no-js');

const header = document.querySelector<HTMLElement>('.site-header');
const toggle = header?.querySelector<HTMLButtonElement>('.site-header__toggle');

if (header && toggle) {
  const aberto = (): boolean => header.classList.contains('is-open');
  const definir = (abrir: boolean): void => {
    header.classList.toggle('is-open', abrir);
    toggle.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  };

  toggle.addEventListener('click', () => definir(!aberto()));

  // Esc fecha e devolve o foco ao botão.
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && aberto()) {
      definir(false);
      toggle.focus();
    }
  });

  // Clique fora do cabeçalho fecha.
  document.addEventListener('click', (ev) => {
    if (aberto() && ev.target instanceof Node && !header.contains(ev.target)) definir(false);
  });

  // Clicar numa âncora interna (#secao) fecha o menu.
  header.addEventListener('click', (ev) => {
    if (ev.target instanceof Element && ev.target.closest('a[href^="#"]')) definir(false);
  });
}
