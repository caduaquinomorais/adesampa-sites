/*
 * Filtro por categoria e paginação das notícias SEM recarregar a página (Comunicação e lista de notícias).
 *
 * Os filtros e a paginação continuam sendo links para as páginas estáticas da lista
 * (/comunicacao/noticias/categoria/<id>/pagina/<n>/), que funcionam sem JavaScript. Com JavaScript, o clique
 * busca essa página em segundo plano e troca só o bloco [data-noticias-lista] (cards + paginação).
 *
 * Endereço na barra do navegador (data-noticias-endereco):
 *   "consulta" (Comunicação): /comunicacao/?categoria=eventos&pagina=2#noticias. Abrir esse endereço aplica o filtro;
 *   "real" (lista de notícias): o endereço da própria página estática.
 * O botão Voltar do navegador desfaz o filtro. Decisão H-18 (docs/DECISOES_HOME.md).
 */
interface Estado { categoria: string; pagina: number }

const secao = document.querySelector<HTMLElement>('[data-noticias]');
const base = secao?.dataset.noticiasBase ?? '';

if (secao && base) {
  const consulta = secao.dataset.noticiasEndereco === 'consulta';
  const nivel = secao.dataset.noticiasNivel === 'h3' ? 'H3' : 'H2';
  const aviso = secao.querySelector<HTMLElement>('[data-noticias-aviso]');

  /** Endereço da página estática de um filtro. */
  const urlReal = ({ categoria, pagina }: Estado): string =>
    base + (categoria ? `categoria/${categoria}/` : '') + (pagina > 1 ? `pagina/${pagina}/` : '');

  /** Lê um endereço de página estática da lista; null = não é um link da lista. */
  const lerReal = (href: string): Estado | null => {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return null;
    const m = url.pathname.slice(base.length).match(/^(?:categoria\/([\w-]+)\/)?(?:pagina\/(\d+)\/)?$/);
    return m ? { categoria: m[1] ?? '', pagina: Number(m[2] ?? 1) } : null;
  };

  /** Estado a partir da barra de endereço. */
  const lerAtual = (): Estado => {
    if (!consulta) return lerReal(location.href) ?? { categoria: '', pagina: 1 };
    const q = new URLSearchParams(location.search);
    const categoria = /^[\w-]+$/.test(q.get('categoria') ?? '') ? q.get('categoria') ?? '' : '';
    const pagina = Math.max(1, Number.parseInt(q.get('pagina') ?? '1', 10) || 1);
    return { categoria, pagina };
  };

  /** Endereço que aparece na barra do navegador. */
  const urlVisivel = (e: Estado): string => {
    if (!consulta) return urlReal(e);
    const q = new URLSearchParams();
    if (e.categoria) q.set('categoria', e.categoria);
    if (e.pagina > 1) q.set('pagina', String(e.pagina));
    const s = q.toString();
    return `${location.pathname}${s ? `?${s}` : ''}#noticias`;
  };

  const marcarFiltro = (e: Estado): string => {
    let nome = 'Todos';
    for (const chip of secao.querySelectorAll<HTMLAnchorElement>('.filtros__categorias a')) {
      const alvo = lerReal(chip.href);
      const ativo = alvo !== null && alvo.categoria === e.categoria;
      if (ativo) { chip.setAttribute('aria-current', 'page'); nome = chip.textContent?.trim() ?? nome; }
      else chip.removeAttribute('aria-current');
    }
    return nome;
  };

  let pedido = 0;
  const aplicar = async (e: Estado, modo: 'push' | 'replace' | 'nenhum', rolar = false): Promise<void> => {
    const atual = secao.querySelector<HTMLElement>('[data-noticias-lista]');
    if (!atual) return;
    const meu = ++pedido;
    atual.setAttribute('aria-busy', 'true');
    try {
      const resposta = await fetch(urlReal(e), { headers: { Accept: 'text/html' } });
      if (!resposta.ok) throw new Error(String(resposta.status));
      const doc = new DOMParser().parseFromString(await resposta.text(), 'text/html');
      const nova = doc.querySelector<HTMLElement>('[data-noticias-lista]');
      if (!nova) throw new Error('lista não encontrada');
      if (meu !== pedido) return; // um clique mais novo já está em andamento
      // Na Comunicação os títulos dos cards são <h3> (a seção tem <h2>); na lista, <h2>.
      for (const t of nova.querySelectorAll('.card-noticia__titulo')) {
        if (t.tagName === nivel) continue;
        const novo = document.createElement(nivel);
        novo.className = t.className;
        novo.textContent = t.textContent;
        t.replaceWith(novo);
      }
      atual.replaceWith(document.importNode(nova, true));
      const nome = marcarFiltro(e);
      if (aviso) aviso.textContent = `Mostrando notícias: ${nome}${e.pagina > 1 ? `, página ${e.pagina}` : ''}.`;
      if (modo === 'push') history.pushState(e, '', urlVisivel(e));
      if (modo === 'replace') history.replaceState(e, '', urlVisivel(e));
      if (rolar && secao.getBoundingClientRect().top < 0) secao.scrollIntoView({ block: 'start' });
    } catch {
      // Sem conexão ou erro: abre a página estática (o jeito antigo, que sempre funciona).
      location.href = urlReal(e);
    }
  };

  secao.addEventListener('click', (ev) => {
    if (ev.defaultPrevented || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
    const link = ev.target instanceof Element ? ev.target.closest<HTMLAnchorElement>('.filtros__categorias a, .paginacao a') : null;
    const e = link ? lerReal(link.href) : null;
    if (!link || !e) return;
    ev.preventDefault();
    void aplicar(e, 'push', link.closest('.paginacao') !== null);
  });

  addEventListener('popstate', () => { void aplicar(lerAtual(), 'nenhum'); });

  // Comunicação aberta com ?categoria=…: aplica o filtro ao carregar.
  const inicial = lerAtual();
  if (consulta && (inicial.categoria || inicial.pagina > 1)) void aplicar(inicial, 'replace');
  else history.replaceState(inicial, '');
}
