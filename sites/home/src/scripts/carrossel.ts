/*
 * Carrosséis (setas ← →) e galerias (pontinhos). Melhoria progressiva: sem JavaScript, as faixas
 * continuam rolando com o dedo, o mouse ou o teclado. Respeita prefers-reduced-motion.
 */
const suave = (): ScrollBehavior => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

function iniciarCarrossel(raiz: HTMLElement): void {
  const trilho = raiz.querySelector<HTMLElement>('[data-trilho]');
  const anterior = raiz.querySelector<HTMLButtonElement>('[data-anterior]');
  const proximo = raiz.querySelector<HTMLButtonElement>('[data-proximo]');
  if (!trilho || !anterior || !proximo) return;

  const passo = (): number => {
    const item = trilho.querySelector<HTMLElement>(':scope > li');
    const gap = parseFloat(getComputedStyle(trilho).columnGap) || 0;
    return item ? item.getBoundingClientRect().width + gap : trilho.clientWidth;
  };
  const atualizar = (): void => {
    const max = trilho.scrollWidth - trilho.clientWidth - 2;
    anterior.disabled = trilho.scrollLeft <= 2;
    proximo.disabled = trilho.scrollLeft >= max;
  };
  anterior.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: suave() }));
  proximo.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: suave() }));
  trilho.addEventListener('scroll', atualizar, { passive: true });
  addEventListener('resize', atualizar);
  atualizar();
}

function iniciarGaleria(raiz: HTMLElement): void {
  const trilho = raiz.querySelector<HTMLElement>('[data-trilho]');
  const pontos = [...raiz.querySelectorAll<HTMLButtonElement>('[data-ponto]')];
  if (!trilho || pontos.length < 2) return;
  const marcar = (i: number): void => pontos.forEach((p, j) => p.setAttribute('aria-pressed', i === j ? 'true' : 'false'));
  pontos.forEach((p, i) => p.addEventListener('click', () => {
    trilho.scrollTo({ left: i * trilho.clientWidth, behavior: suave() });
    marcar(i);
  }));
  trilho.addEventListener('scroll', () => marcar(Math.round(trilho.scrollLeft / Math.max(1, trilho.clientWidth))), { passive: true });
}

document.querySelectorAll<HTMLElement>('[data-carrossel]').forEach(iniciarCarrossel);
document.querySelectorAll<HTMLElement>('[data-galeria]').forEach(iniciarGaleria);
