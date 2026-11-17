// LINKS E ASSETS — lê o build de todos os sites e confere:
//   1. nenhum href/src/action com esquema proibido (javascript:, data:, vbscript:, file: …);
//   2. todo link interno (do próprio site ou de outro site deste monorepo, pelo mapa SITES)
//      aponta para uma página ou arquivo que existe no build — inclusive #âncoras;
//   3. toda imagem, CSS, JS e fonte referenciada no HTML e no CSS existe (seria 404 no servidor);
//   4. links pendentes (data-link-pendente) não têm href.
// Links externos (outros domínios) não são acessados.
//
//   npm run build && node tests/build/links.mjs
import { sitesConstruidos, sitesDoRepositorio, arquivos, ler, urlDaPagina, decodificar, arquivoDoCaminho } from './lib.mjs';

const sites = sitesConstruidos();
const faltando = sitesDoRepositorio().filter((n) => !sites.some((s) => s.nome === n));
if (faltando.length) { console.error(`Sem build: ${faltando.join(', ')}. Rode npm run build.`); process.exit(2); }

const ESQUEMAS_OK = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const falhas = [];
const idsPorArquivo = new Map();
let verificados = 0;
let externos = 0;

const idsDe = (arquivo) => {
  if (!idsPorArquivo.has(arquivo)) idsPorArquivo.set(arquivo, new Set([...ler(arquivo).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idsPorArquivo.get(arquivo);
};

/** Encontra o site deste monorepo dono de uma URL absoluta, ou null (externo). */
function siteDaUrl(u) {
  return sites
    .filter((s) => u.origin === s.origem && u.pathname.startsWith(s.base))
    .sort((a, b) => b.base.length - a.base.length)[0] ?? null;
}

function verificar(valor, contexto, paginaUrl, { exigirArquivo = false } = {}) {
  const bruto = decodificar(valor).trim();
  if (bruto === '') { falhas.push(`${contexto}: atributo vazio`); return; }
  const esquema = /^([a-z][a-z0-9+.-]*):/i.exec(bruto)?.[1]?.toLowerCase();
  if (esquema && !ESQUEMAS_OK.has(`${esquema}:`)) { falhas.push(`${contexto}: esquema proibido "${esquema}:" em ${bruto.slice(0, 60)}`); return; }
  if (esquema === 'mailto' || esquema === 'tel') return;
  if (bruto.startsWith('//')) { falhas.push(`${contexto}: URL sem esquema (//…) ${bruto}`); return; }

  const u = new URL(bruto, paginaUrl);
  const dono = siteDaUrl(u);
  if (!dono) { externos++; return; }
  verificados++;
  const arquivo = arquivoDoCaminho(dono, u.pathname);
  if (!arquivo) { falhas.push(`${contexto}: ${bruto} → 404 (${u.pathname} não existe no build de "${dono.nome}")`); return; }
  if (exigirArquivo && arquivo.endsWith('.html')) { falhas.push(`${contexto}: ${bruto} aponta para uma página, não para um arquivo`); return; }
  if (u.hash.length > 1 && arquivo.endsWith('.html')) {
    const id = decodeURIComponent(u.hash.slice(1));
    if (!idsDe(arquivo).has(id)) falhas.push(`${contexto}: âncora ${u.hash} não existe em ${u.pathname}`);
  }
}

let paginas = 0;
for (const site of sites) {
  for (const arquivo of arquivos(site.dist, '.html')) {
    paginas++;
    const url = urlDaPagina(site, arquivo);
    const paginaUrl = site.origem + url;
    const html = ler(arquivo);
    for (const m of html.matchAll(/<(\w+)\b([^>]*)>/g)) {
      const [, tag, attrs] = m;
      const pendente = /\sdata-link-pendente="true"/.test(attrs);
      for (const a of attrs.matchAll(/\s(href|src|action|poster|srcset)\s*=\s*"([^"]*)"/g)) {
        const [, nome, valor] = a;
        const ctx = `${url} <${tag} ${nome}>`;
        if (pendente && nome === 'href') { falhas.push(`${ctx}: link pendente não pode ter href`); continue; }
        if (nome === 'srcset') {
          for (const parte of valor.split(',')) { const src = parte.trim().split(/\s+/)[0]; if (src) verificar(src, ctx, paginaUrl, { exigirArquivo: true }); }
        } else {
          verificar(valor, ctx, paginaUrl, { exigirArquivo: nome !== 'href' && nome !== 'action' || /\brel="(stylesheet|preload|icon)"/.test(attrs) });
        }
      }
    }
  }
  // url(...) dentro dos CSS gerados (fontes, imagens de fundo).
  for (const css of arquivos(site.dist, '.css')) {
    const cssUrl = site.origem + site.base + css.slice(site.dist.length + 1).split('\\').join('/');
    for (const m of ler(css).matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      if (m[1].startsWith('data:')) { falhas.push(`${cssUrl}: data: no CSS (a CSP bloqueia)`); continue; }
      verificar(m[1], `${cssUrl} url()`, cssUrl, { exigirArquivo: true });
    }
  }
}

console.log(`Links e assets: ${paginas} páginas de ${sites.length} site(s); ${verificados} referências internas verificadas, ${externos} externas ignoradas.`);
if (falhas.length) {
  for (const f of [...new Set(falhas)]) console.log(`  ✗ ${f}`);
  console.log(`${new Set(falhas).size} FALHA(S)`);
  process.exit(1);
}
console.log('  ✓ nenhum link quebrado, nenhum asset 404, nenhum esquema proibido.');
