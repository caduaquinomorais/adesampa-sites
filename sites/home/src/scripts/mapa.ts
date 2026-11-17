/*
 * Mapa do Teia no Início: troca a imagem pelo Google My Maps só quando a pessoa clica no botão.
 * Assim o Google não carrega (nem recebe dados do visitante) até alguém pedir — LGPD e desempenho.
 * Melhoria progressiva: sem JavaScript, o botão fica escondido e a imagem continua sendo um link.
 * A CSP (public/.htaccess) libera frame-src só para https://www.google.com.
 */
for (const raiz of document.querySelectorAll<HTMLElement>('[data-mapa]')) {
  const botao = raiz.querySelector<HTMLButtonElement>('[data-mapa-botao]');
  const url = raiz.dataset.mapa ?? '';
  if (!botao || !/^https:\/\/www\.google\.com\/maps\/d\/(u\/\d+\/)?embed\?/.test(url)) continue;

  botao.hidden = false;
  botao.addEventListener(
    'click',
    () => {
      const frame = document.createElement('iframe');
      frame.src = url;
      frame.title = raiz.dataset.mapaTitulo ?? 'Mapa interativo';
      frame.className = 'teia__mapa-frame';
      frame.allowFullscreen = true;
      frame.tabIndex = 0;
      raiz.replaceChildren(frame);
      frame.focus();
    },
    { once: true },
  );
}
