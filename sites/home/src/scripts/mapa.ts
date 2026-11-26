/*
 * Mapa do Teia no Início: troca a imagem pelo Google My Maps sozinho, quando a pessoa chega perto da seção
 * (300 px antes de ela aparecer na tela). Decisão H-16: antes era só no clique (LGPD); agora o Google carrega
 * para quem rolar até o mapa, e isso precisa constar na política de privacidade.
 * Navegador sem IntersectionObserver (muito antigo): aparece o botão "Ver mapa interativo", como antes.
 * Sem JavaScript, a imagem continua sendo um link para o Teia.
 * A CSP (public/.htaccess) libera frame-src só para https://www.google.com.
 */
const EMBED = /^https:\/\/www\.google\.com\/maps\/d\/(u\/\d+\/)?embed\?/;

function carregarMapa(raiz: HTMLElement, url: string): void {
  const frame = document.createElement('iframe');
  frame.src = url;
  frame.title = raiz.dataset.mapaTitulo ?? 'Mapa interativo';
  frame.className = 'teia__mapa-frame';
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  raiz.replaceChildren(frame);
}

for (const raiz of document.querySelectorAll<HTMLElement>('[data-mapa]')) {
  const url = raiz.dataset.mapa ?? '';
  if (!EMBED.test(url)) continue;

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      carregarMapa(raiz, url);
    }, { rootMargin: '300px 0px' });
    observador.observe(raiz);
    continue;
  }

  const botao = raiz.querySelector<HTMLButtonElement>('[data-mapa-botao]');
  if (!botao) continue;
  botao.hidden = false;
  botao.addEventListener('click', () => carregarMapa(raiz, url), { once: true });
}
