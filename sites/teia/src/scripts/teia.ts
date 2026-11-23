/*
 * Teia — interações (migradas de teia-teste/public/assets/js/site.js). A página funciona sem JavaScript;
 * o menu mobile do cabeçalho fica em packages/ui (menu.ts).
 */

// ---------- Âncoras: move o foco para a seção (acessibilidade) ----------
document.addEventListener('click', (ev) => {
  const link = ev.target instanceof Element ? ev.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
  const id = link?.getAttribute('href')?.slice(1);
  const alvo = id ? document.getElementById(id) : null;
  if (!alvo) return;
  if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
  setTimeout(() => alvo.focus({ preventScroll: true }), 0);
});

// ---------- Carrossel de fotos (com 2 ou mais fotos) ----------
for (const galeria of document.querySelectorAll<HTMLElement>('[data-gallery]')) {
  const slides = [...galeria.querySelectorAll<HTMLElement>('[data-slide]')];
  const pontos = [...galeria.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  if (slides.length < 2) continue;
  let atual = 0;
  const mostrar = (i: number): void => {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, n) => { s.hidden = n !== atual; });
    pontos.forEach((p, n) => p.setAttribute('aria-pressed', n === atual ? 'true' : 'false'));
  };
  for (const ponto of pontos) {
    ponto.addEventListener('click', () => mostrar(Number(ponto.dataset.dot)));
    ponto.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      ev.preventDefault();
      mostrar(atual + (ev.key === 'ArrowRight' ? 1 : -1));
      pontos[atual]?.focus();
    });
  }
  // Gesto de arrastar no celular.
  const quadro = galeria.querySelector<HTMLElement>('.gallery__frame');
  let inicioX: number | null = null;
  quadro?.addEventListener('touchstart', (ev) => { inicioX = ev.touches[0]?.clientX ?? null; }, { passive: true });
  quadro?.addEventListener('touchend', (ev) => {
    const fimX = ev.changedTouches[0]?.clientX;
    if (inicioX === null || fimX === undefined) return;
    const dx = fimX - inicioX;
    if (Math.abs(dx) > 40) mostrar(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });
}

// ---------- Mapa: troca de unidade (com 2 ou mais unidades) ----------
const cartao = document.querySelector<HTMLElement>('.map-card');
const seletor = cartao?.querySelector<HTMLSelectElement>('[data-map-select]');
if (cartao && seletor) {
  const titulo = cartao.querySelector<HTMLElement>('[data-map-title]');
  seletor.addEventListener('change', () => {
    for (const unidade of cartao.querySelectorAll<HTMLElement>('[data-map-unit]')) {
      const escolhida = unidade.dataset.mapUnit === seletor.value;
      unidade.hidden = !escolhida;
      if (escolhida && titulo) titulo.textContent = unidade.dataset.mapName ?? '';
    }
  });
}

// ---------- Mapa interativo (Google My Maps), só no clique ----------
// O Google só carrega (e só recebe dados do visitante) quando alguém pede: LGPD e desempenho.
// A CSP (public/.htaccess) libera frame-src só para https://www.google.com.
if (cartao) {
  const botao = cartao.querySelector<HTMLButtonElement>('[data-mapa-botao]');
  const url = cartao.dataset.mapa ?? '';
  if (botao && /^https:\/\/www\.google\.com\/maps\/d\/(u\/\d+\/)?embed\?/.test(url)) {
    botao.hidden = false;
    botao.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = url;
      frame.title = cartao.dataset.mapaTitulo ?? 'Mapa interativo';
      frame.className = 'map-card__frame';
      frame.allowFullscreen = true;
      frame.tabIndex = 0;
      cartao.classList.add('map-card--full');
      cartao.replaceChildren(frame);
      frame.focus();
    }, { once: true });
  }
}
