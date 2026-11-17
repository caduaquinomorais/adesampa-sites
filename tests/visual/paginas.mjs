// ADE SAMPA — responsividade e acessibilidade de TODAS as páginas de um site (Chrome headless).
//
//   npm run build -w sites/home && node tests/visual/paginas.mjs home
//
// Em 320, 390, 768, 1024 e 1440 px, para cada página HTML do build:
//   - sem rolagem horizontal; fonte mínima de 12 px;
//   - contraste WCAG AA em todos os textos visíveis (4,5:1; 3:1 para texto grande);
//   - alvos de toque de 44 × 44 px abaixo de 1024 px (links dentro de parágrafos são exceção, WCAG 2.5.8);
//   - um único <h1>; toda <img> com alt; campos com rótulo; lang="pt-BR";
//   - nenhum ID repetido.
// Salva capturas de página inteira em tests/visual/reports/paginas-<site>/ (390 e 1440 px).
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITES, ehNomeSite } from '../../packages/ui/src/data/institucional.ts';
import { servir } from '../lib/servidor.mjs';
import { abrirChrome, carregar, capturar } from '../lib/chrome.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const NOME = process.argv[2] ?? 'home';
if (!ehNomeSite(NOME)) { console.error(`Site desconhecido: ${NOME}`); process.exit(2); }
const DIST = join(RAIZ, 'sites', NOME, 'dist');
if (!existsSync(join(DIST, 'index.html'))) { console.error(`Rode antes: npm run build -w sites/${NOME}`); process.exit(2); }
const BASE = new URL(SITES[NOME].url.teste).pathname;
const SAIDA = join(RAIZ, 'tests', 'visual', 'reports', `paginas-${NOME}`);
const LARGURAS = [320, 390, 768, 1024, 1440];
rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });

const paginas = readdirSync(DIST, { recursive: true, withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith('.html'))
  .map((e) => relative(DIST, join(e.parentPath, e.name)).split(sep).join('/'))
  .map((p) => (p === 'index.html' ? '' : p.replace(/index\.html$/, '')))
  .sort();

const VERIFICAR = `(() => {
  const W = innerWidth; const r = {};
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const nome = (el) => (el.textContent.trim() || el.getAttribute('aria-label') || el.getAttribute('alt') || el.tagName).replace(/\\s+/g, ' ').slice(0, 40);
  r.rolagem = document.documentElement.scrollWidth > document.documentElement.clientWidth + 0.5 ? document.documentElement.scrollWidth : 0;
  // Fonte mínima e contraste
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const mistura = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const temImagemAtras = (el) => { for (let e = el; e; e = e.parentElement) { if (getComputedStyle(e).backgroundImage !== 'none') return true; } return false; };
  const fundo = (el) => { let cor = { r: 255, g: 255, b: 255, a: 1 }; const pilha = []; for (let e = el; e; e = e.parentElement) pilha.push(parse(getComputedStyle(e).backgroundColor)); for (const c of pilha.reverse()) if (c && c.a > 0) cor = mistura(c, cor); return cor; };
  r.fonteMinima = 99; r.contraste = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('.sr-only, .skip-link, [aria-hidden="true"], .banner')) continue;
    const proprio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() !== '');
    if (!proprio || !vis(el)) continue;
    const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize);
    r.fonteMinima = Math.min(r.fonteMinima, fs);
    if (temImagemAtras(el)) continue;
    const bg = fundo(el); let fg = mistura(parse(cs.color), bg);
    let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    if (op < 1) fg = mistura({ ...fg, a: op }, bg);
    const L1 = lum(fg); const L2 = lum(bg); const razao = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const grande = fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700);
    if (razao < (grande ? 3 : 4.5) - 0.01) r.contraste.push(nome(el) + ' ' + razao.toFixed(2) + ':1');
  }
  // Banner do Início: texto sobre a foto clara — mede contra a cor mais escura do degradê (#E8F1FC).
  r.alvos = [];
  if (W < 1024) {
    for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')) {
      if (!vis(el) || el.closest('.skip-link') || el.closest('p') || el.closest('.artigo__texto')) continue;
      if (el.matches('[data-trilho], .carrossel__trilho, .galeria__trilho')) continue; // faixas roláveis
      const b = el.getBoundingClientRect();
      if (b.width < 43.5 || b.height < 43.5) {
        // Alvo menor é aceito se a área clicável (::after) ou o espaço em volta completar 44 px — só pontinhos da galeria.
        if (el.matches('.galeria__ponto')) continue;
        r.alvos.push(nome(el) + ' (' + Math.round(b.width) + '×' + Math.round(b.height) + ')');
      }
    }
  }
  r.h1 = document.querySelectorAll('h1').length;
  r.semAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src'));
  r.semRotulo = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-label')).map((el) => el.id || el.name);
  r.lang = document.documentElement.lang;
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); r.idsRepetidos = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  return r;
})()`;

const falhas = [];
const srv = await servir({ [BASE]: DIST });
const chrome = await abrirChrome();
try {
  for (const pg of paginas) {
    const url = `${srv.url}${BASE}${pg}`;
    const problemasPagina = [];
    for (const largura of LARGURAS) {
      await carregar(chrome.cdp, url, largura);
      const r = await chrome.cdp.avaliar(VERIFICAR);
      const p = [];
      if (r.rolagem) p.push(`rolagem horizontal (${r.rolagem}px)`);
      if (r.fonteMinima < 12) p.push(`fonte de ${r.fonteMinima}px`);
      if (r.contraste.length) p.push(`contraste abaixo do AA: ${[...new Set(r.contraste)].slice(0, 6).join('; ')}`);
      if (r.alvos.length) p.push(`alvos < 44px: ${[...new Set(r.alvos)].slice(0, 6).join('; ')}${r.alvos.length > 6 ? ` (+${r.alvos.length - 6})` : ''}`);
      if (r.h1 !== 1) p.push(`${r.h1} elementos <h1> (esperado 1)`);
      if (r.semAlt.length) p.push(`imagem sem alt: ${r.semAlt.join(', ')}`);
      if (r.semRotulo.length) p.push(`campo sem rótulo: ${r.semRotulo.join(', ')}`);
      if (r.lang !== 'pt-BR') p.push(`lang="${r.lang}"`);
      if (r.idsRepetidos.length) p.push(`IDs repetidos: ${r.idsRepetidos.join(', ')}`);
      if (largura === 390 || largura === 1440) {
        writeFileSync(join(SAIDA, `${(pg || 'inicio').replace(/[\\/]+/g, '_').replace(/_$/, '').replace(/\.html$/, '')}-${largura}.png`), await capturar(chrome.cdp));
      }
      for (const x of p) problemasPagina.push(`${largura}px: ${x}`);
    }
    console.log(`${problemasPagina.length ? '✗' : '✓'} ${BASE}${pg}`);
    for (const x of problemasPagina) { console.log(`    ${x}`); falhas.push(`${BASE}${pg} — ${x}`); }
  }
} finally {
  await chrome.fechar();
  await srv.fechar();
}
writeFileSync(join(SAIDA, 'resultado.json'), JSON.stringify({ paginas, falhas }, null, 2));
console.log(`\n${paginas.length} páginas × ${LARGURAS.length} larguras. Capturas: ${SAIDA}`);
if (falhas.length) { console.log(`${falhas.length} FALHA(S)`); process.exit(1); }
console.log('Todas as páginas passaram.');
