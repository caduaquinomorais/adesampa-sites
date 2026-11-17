/*
 * Busca de notícias (página /comunicacao/noticias/busca/). Lê ?q=, baixa o índice estático
 * (busca.json, gerado no build) e mostra os resultados. Monta o HTML só com textContent e
 * setAttribute (nada de innerHTML), para não executar nada vindo do índice ou da URL.
 */
interface ItemIndice { titulo: string; resumo: string; categoria: string; data: string; dataTexto: string; url: string; texto: string }

const raiz = document.querySelector<HTMLElement>('[data-busca]');

function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function card(item: ItemIndice, textoBotao: string): HTMLLIElement {
  const li = document.createElement('li');
  const art = document.createElement('article');
  art.className = 'card-noticia';
  const meta = document.createElement('p');
  meta.className = 'card-noticia__meta';
  const cat = document.createElement('span');
  cat.textContent = item.categoria;
  const time = document.createElement('time');
  time.setAttribute('datetime', item.data);
  time.textContent = item.dataTexto;
  meta.append(cat, time);
  const textos = document.createElement('div');
  textos.className = 'card-noticia__textos';
  const h = document.createElement('h2');
  h.className = 'card-noticia__titulo';
  h.textContent = item.titulo;
  const p = document.createElement('p');
  p.className = 'card-noticia__resumo';
  p.textContent = item.resumo;
  textos.append(h, p);
  const a = document.createElement('a');
  a.className = 'botao botao--contorno';
  a.href = item.url;
  a.textContent = textoBotao;
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = `: ${item.titulo}`;
  a.append(sr);
  art.append(meta, textos, a);
  li.append(art);
  return li;
}

async function buscar(): Promise<void> {
  if (!raiz) return;
  const lista = raiz.querySelector<HTMLUListElement>('[data-resultados]');
  const status = raiz.querySelector<HTMLElement>('[data-status]');
  const campo = document.querySelector<HTMLInputElement>('#busca-noticias');
  if (!lista || !status) return;
  const termo = (new URLSearchParams(location.search).get('q') ?? '').trim().slice(0, 80);
  if (campo) campo.value = termo;
  if (termo === '') { status.textContent = 'Digite uma palavra para pesquisar nas notícias.'; return; }

  try {
    const resp = await fetch(raiz.dataset.indice ?? '', { headers: { Accept: 'application/json' } });
    if (!resp.ok) throw new Error(String(resp.status));
    const indice = (await resp.json()) as ItemIndice[];
    const palavras = normalizar(termo).split(/\s+/).filter(Boolean);
    const achados = indice.filter((n) => palavras.every((w) => n.texto.includes(w)));
    lista.replaceChildren(...achados.map((n) => card(n, raiz.dataset.botao ?? 'Ler notícia')));
    status.textContent = achados.length === 0
      ? `Nenhuma notícia encontrada para “${termo}”.`
      : `${achados.length} ${achados.length === 1 ? 'notícia encontrada' : 'notícias encontradas'} para “${termo}”.`;
  } catch {
    status.textContent = 'Não foi possível carregar a busca agora. Tente novamente em instantes.';
  }
}

void buscar();
