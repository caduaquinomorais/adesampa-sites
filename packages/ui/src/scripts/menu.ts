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

/*
 * Menu de projetos (item "Programas"). Botão com aria-expanded (padrão "disclosure").
 * Computador com mouse: abre ao passar o mouse (fecha 200 ms depois de sair) e também ao clicar.
 * Teclado: Enter/Espaço abre e fecha; Esc fecha e devolve o foco; sair com Tab fecha.
 * Celular/tablet (< 1024 px): só o toque abre e fecha (sanfona dentro do ☰).
 * Registrado antes do menu mobile, para o Esc fechar primeiro o Menu de projetos.
 */
const itemMega = header?.querySelector<HTMLElement>('[data-mega]');
const gatilho = itemMega?.querySelector<HTMLButtonElement>('.site-header__trigger');

if (itemMega && gatilho) {
  const computador = matchMedia('(min-width: 1024px) and (hover: hover)');
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abertoPeloMouse = false;
  const megaAberto = (): boolean => itemMega.classList.contains('is-open');
  const definirMega = (abrir: boolean): void => {
    clearTimeout(timer);
    if (!abrir) abertoPeloMouse = false;
    itemMega.classList.toggle('is-open', abrir);
    gatilho.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  };

  // Se o mouse já abriu, o clique mantém aberto (em vez de fechar logo em seguida).
  gatilho.addEventListener('click', () => {
    if (abertoPeloMouse) { abertoPeloMouse = false; return; }
    definirMega(!megaAberto());
  });
  itemMega.addEventListener('mouseenter', () => {
    if (!computador.matches) return;
    if (!megaAberto()) abertoPeloMouse = true;
    definirMega(true);
  });
  itemMega.addEventListener('mouseleave', () => {
    if (!computador.matches) return;
    clearTimeout(timer);
    timer = setTimeout(() => definirMega(false), 200);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && megaAberto()) {
      definirMega(false);
      gatilho.focus();
      ev.stopImmediatePropagation();
    }
  });
  itemMega.addEventListener('focusout', (ev) => {
    const destino = ev.relatedTarget;
    if (matchMedia('(min-width: 1024px)').matches && destino instanceof Node && !itemMega.contains(destino)) definirMega(false);
  });
  document.addEventListener('click', (ev) => {
    if (megaAberto() && matchMedia('(min-width: 1024px)').matches && ev.target instanceof Node && !itemMega.contains(ev.target)) definirMega(false);
  });
}

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
