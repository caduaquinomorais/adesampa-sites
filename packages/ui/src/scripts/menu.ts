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
 * Menus suspensos do cabeçalho: "Programas" (Menu de projetos, [data-mega]) e itens com submenu, como
 * "Comunicação" ([data-dropdown]). Botão com aria-expanded (padrão "disclosure").
 * Computador com mouse: abre ao passar o mouse (fecha 200 ms depois de sair) e também ao clicar.
 * Teclado: Enter/Espaço abre e fecha; Esc fecha e devolve o foco; sair com Tab fecha.
 * Celular/tablet (< 1024 px): só o toque abre e fecha (sanfona dentro do ☰).
 * Abrir um menu fecha o outro. Registrado antes do menu mobile, para o Esc fechar primeiro o menu suspenso.
 */
const computador = matchMedia('(min-width: 1024px) and (hover: hover)');
const larga = matchMedia('(min-width: 1024px)');
const fechadores: ((exceto?: HTMLElement) => void)[] = [];

for (const item of header?.querySelectorAll<HTMLElement>('[data-mega], [data-dropdown]') ?? []) {
  const gatilho = item.querySelector<HTMLButtonElement>('.site-header__trigger');
  if (!gatilho) continue;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abertoPeloMouse = false;
  const aberto = (): boolean => item.classList.contains('is-open');
  const definir = (abrir: boolean): void => {
    clearTimeout(timer);
    if (abrir) for (const fechar of fechadores) fechar(item);
    else abertoPeloMouse = false;
    item.classList.toggle('is-open', abrir);
    gatilho.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  };
  fechadores.push((exceto) => { if (exceto !== item && aberto()) definir(false); });

  // Se o mouse já abriu, o clique mantém aberto (em vez de fechar logo em seguida).
  gatilho.addEventListener('click', () => {
    if (abertoPeloMouse) { abertoPeloMouse = false; return; }
    definir(!aberto());
  });
  item.addEventListener('mouseenter', () => {
    if (!computador.matches) return;
    if (!aberto()) abertoPeloMouse = true;
    definir(true);
  });
  item.addEventListener('mouseleave', () => {
    if (!computador.matches) return;
    clearTimeout(timer);
    timer = setTimeout(() => definir(false), 200);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && aberto()) {
      definir(false);
      gatilho.focus();
      ev.stopImmediatePropagation();
    }
  });
  item.addEventListener('focusout', (ev) => {
    const destino = ev.relatedTarget;
    if (larga.matches && destino instanceof Node && !item.contains(destino)) definir(false);
  });
  document.addEventListener('click', (ev) => {
    if (aberto() && larga.matches && ev.target instanceof Node && !item.contains(ev.target)) definir(false);
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

  // Clicar numa âncora (#secao), inclusive da mesma página com endereço completo (menu Comunicação), fecha o menu.
  header.addEventListener('click', (ev) => {
    if (ev.target instanceof Element && ev.target.closest('a[href*="#"]')) definir(false);
  });
}

/*
 * Topo fixo das páginas com submenu (BaseLayout: [data-topo-fixo]).
 * Rolando para baixo, o cabeçalho desliza para fora e o submenu fica preso no topo; rolando para cima,
 * o cabeçalho volta. Ele nunca se esconde no começo da página, com um menu aberto (☰, Programas,
 * Comunicação) ou com o foco do teclado dentro dele. Mudanças de menos de 6 px são ignoradas (tremidas).
 * As alturas são medidas aqui e passadas ao CSS por variáveis (CSSOM: permitido pela CSP).
 */
const topo = document.querySelector<HTMLElement>('[data-topo-fixo]');
if (topo && header) {
  const raiz = document.documentElement;
  const medir = (): void => {
    topo.style.setProperty('--topo-cabecalho', `${header.offsetHeight}px`);
    raiz.style.setProperty('--topo-altura', `${topo.offsetHeight}px`);
  };
  medir();
  addEventListener('resize', medir);

  const recolher = (sim: boolean): void => { topo.classList.toggle('is-recolhido', sim); };
  const algoAberto = (): boolean =>
    header.classList.contains('is-open') || header.querySelector('.is-open') !== null || header.contains(document.activeElement);

  let ultimoY = scrollY;
  let agendado = false;
  addEventListener('scroll', () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => {
      agendado = false;
      const y = scrollY;
      if (y <= header.offsetHeight) { recolher(false); ultimoY = y; return; }
      const delta = y - ultimoY;
      if (Math.abs(delta) < 6) return;
      recolher(delta > 0 && !algoAberto());
      ultimoY = y;
    });
  }, { passive: true });

  // Foco do teclado no cabeçalho (Tab vindo do link "Pular para o conteúdo" ou de volta do submenu): mostra.
  header.addEventListener('focusin', () => recolher(false));
}
