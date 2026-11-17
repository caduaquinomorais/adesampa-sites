// ADE SAMPA — comparação das páginas de um site com o Figma (1440 px), no modelo de
// teia-teste/tests/visual/comparar.mjs. Confere a altura de cada seção (±4 px) e mede a diferença de
// pixels seção a seção (informativa: suavização de fonte, fotos e conteúdo real × Lorem ipsum do Figma).
//
//   npm run build -w sites/home && node tests/visual/figma.mjs home
//
// Gera tests/visual/reports/figma-<site>/relatorio.html com cada seção lado a lado
// (Figma | site | diferenças). Sai com código 1 se alguma altura sair da tolerância.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITES, ehNomeSite } from '../../packages/ui/src/data/institucional.ts';
import { servir } from '../lib/servidor.mjs';
import { abrirChrome, carregar, capturar } from '../lib/chrome.mjs';
import { decodePng, encodePng, recortar, comparar, ladoALado } from '../lib/png.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const NOME = process.argv[2] ?? 'home';
if (!ehNomeSite(NOME)) { console.error(`Site desconhecido: ${NOME}`); process.exit(2); }
const CONFIG = join(RAIZ, 'tests', 'visual', `figma-${NOME}.json`);
if (!existsSync(CONFIG)) { console.error(`Sem geometria do Figma para "${NOME}" (${CONFIG}).`); process.exit(2); }
const { paginas } = JSON.parse(readFileSync(CONFIG, 'utf8'));
const DIST = join(RAIZ, 'sites', NOME, 'dist');
if (!existsSync(join(DIST, 'index.html'))) { console.error(`Rode antes: npm run build -w sites/${NOME}`); process.exit(2); }
const BASE = new URL(SITES[NOME].url.teste).pathname;
const SAIDA = join(RAIZ, 'tests', 'visual', 'reports', `figma-${NOME}`);
const TOL_ALTURA = 4;
rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });

const falhas = [];
const linhas = [];
const srv = await servir({ [BASE]: DIST });
const chrome = await abrirChrome();
try {
  for (const pg of paginas) {
    console.log(`\n${pg.nome} (${BASE}${pg.url})`);
    const ref = decodePng(readFileSync(join(RAIZ, 'tests', 'visual', 'reference', NOME, pg.referencia)));
    await carregar(chrome.cdp, `${srv.url}${BASE}${pg.url}`, 1440);
    const caixas = await chrome.cdp.avaliar(`(${JSON.stringify(pg.secoes.map((s) => s.seletor))}).map((s) => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return { y: Math.round(b.top + scrollY), h: Math.round(b.height) }; })`);
    const img = decodePng(await capturar(chrome.cdp));
    pg.secoes.forEach((s, i) => {
      const c = caixas[i];
      if (!c) { falhas.push(`${pg.nome}/${s.nome}: seletor ${s.seletor} não encontrado`); console.log(`  ✗ ${s.nome}: não encontrada`); return; }
      const alturaFigma = s.altura ?? c.h;
      const a = recortar(ref, 0, s.y, 1440, Math.min(alturaFigma, ref.height - s.y));
      const b = recortar(img, 0, c.y, 1440, c.h);
      const cmp = comparar(a, b);
      const arquivo = `${pg.nome}-${s.nome}.png`;
      writeFileSync(join(SAIDA, arquivo), encodePng(ladoALado([a, b, cmp.diff])));
      const dif = s.altura === null ? null : c.h - s.altura;
      const ok = dif === null || Math.abs(dif) <= TOL_ALTURA;
      if (!ok) falhas.push(`${pg.nome}/${s.nome}: altura ${c.h}px × Figma ${s.altura}px`);
      linhas.push({ pagina: pg.nome, secao: s.nome, altura: c.h, figma: s.altura, porcentagem: +cmp.porcentagem.toFixed(1), arquivo });
      console.log(`  ${ok ? '✓' : '✗'} ${s.nome.padEnd(20)} altura ${String(c.h).padStart(5)} (Figma ${s.altura ?? 'livre'})  pixels diferentes ${cmp.porcentagem.toFixed(1)}%`);
    });
  }
} finally {
  await chrome.fechar();
  await srv.fechar();
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
writeFileSync(join(SAIDA, 'relatorio.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Figma × ${esc(NOME)}</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f4f4f4}figure{margin:0 0 32px}img{max-width:100%;border:1px solid #ccc;background:#fff}figcaption{font-weight:600;margin:8px 0}.f{color:#b00}</style>
<h1>Site ${esc(NOME)} × Figma (1440 px)</h1><p>Em cada imagem: <b>Figma</b> | <b>site</b> | <b>diferenças</b> (vermelho).</p>
<p>${falhas.length ? `<span class="f">${falhas.length} falha(s)</span><ul>${falhas.map((f) => `<li class="f">${esc(f)}</li>`).join('')}</ul>` : '<b>Todas as alturas dentro da tolerância (±4 px).</b>'}</p>
${linhas.map((l) => `<figure><figcaption>${esc(l.pagina)} / ${esc(l.secao)} — ${l.altura}px (Figma ${l.figma ?? 'livre'}) — ${l.porcentagem}% de pixels diferentes</figcaption><img src="${esc(l.arquivo)}" alt=""></figure>`).join('')}</html>`);
writeFileSync(join(SAIDA, 'resultado.json'), JSON.stringify({ falhas, linhas }, null, 2));
console.log(`\nRelatório: ${join(SAIDA, 'relatorio.html')}`);
if (falhas.length) { console.log(`${falhas.length} FALHA(S)`); process.exit(1); }
console.log('Alturas iguais ao Figma.');
