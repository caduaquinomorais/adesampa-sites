// ADE SAMPA — paridade visual do cabeçalho/rodapé em Astro × referencia/header-footer/exemplo.html,
// mais verificações de acessibilidade do topo e do rodapé. Sem npm: Chrome headless via DevTools.
//
//   npm run build -w sites/exemplo
//   node tests/visual/comparar.mjs              (site "exemplo", padrão)
//   node tests/visual/comparar.mjs home         (qualquer site: compara só o cabeçalho e o rodapé)
//
// Gera tests/visual/reports/<site>/relatorio.html, com capturas lado a lado
// (referência | Astro | diferenças em vermelho) e resultado.json. Sai com código 1 se algo falhar.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITES, ehNomeSite } from '../../packages/ui/src/data/institucional.ts';
import { servir } from '../lib/servidor.mjs';
import { abrirChrome, carregar, capturar, tecla, clicar, sleep } from '../lib/chrome.mjs';
import { decodePng, encodePng, recortar, comparar, ladoALado } from '../lib/png.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const NOME = process.argv[2] ?? 'exemplo';
if (!ehNomeSite(NOME)) { console.error(`Site desconhecido: ${NOME}`); process.exit(2); }
const DIST = join(RAIZ, 'sites', NOME, 'dist');
if (!existsSync(join(DIST, 'index.html'))) { console.error(`Rode antes: npm run build -w sites/${NOME}`); process.exit(2); }
const BASE = new URL(SITES[NOME].url.teste).pathname; // os testes usam o build do ambiente "teste"
const REF = join(RAIZ, 'referencia', 'header-footer');
const SAIDA = join(RAIZ, 'tests', 'visual', 'reports', NOME);
const LARGURAS = [1440, 1024, 768, 390];
const MAX_DIFERENCA = 0.5; // % de pixels diferentes aceitos por região
const TOL_GEOMETRIA = 1; // px
rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });

// O submenu só entra na comparação quando o site o exibe (o exemplo exibe o do Teia, como a referência).
const SELETORES = [
  '.site-header', '.site-header__logo img', '.site-header__link', '.site-header__arrow', '.site-header__cta', '.site-header__toggle',
  '.submenu', '.submenu__logo img', '.submenu__link',
  '.site-footer', '.site-footer__logo img', '.site-footer__text', '.site-footer__heading', '.social-btn', '.site-footer__col',
  '.site-footer__col-title', '.site-footer__link', '.site-footer__info', '.site-footer__logo-ade', '.site-footer__logo-pref',
];

const MEDIR = `(() => {
  const caixa = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.left * 10) / 10, y: Math.round((b.top + scrollY) * 10) / 10, w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10 }; };
  const um = (s) => { const el = document.querySelector(s); return el ? caixa(el) : null; };
  const geo = {};
  for (const s of ${JSON.stringify(SELETORES)}) geo[s] = [...document.querySelectorAll(s)].map(caixa);
  return { header: um('.site-header'), submenu: um('.submenu'), footer: um('.site-footer'), geo };
})()`;

// Correções intencionais C-1 e C-2 (docs/HEADER_FOOTER.md) aplicadas também à referência, para que a
// comparação continue exata no resto. Sem isso, a referência mostra "Agendamentos" escuro, os links do
// rodapé brancos (contraste D-12 perdido) e o menu na cor do <body>.
// (Seletores com 2 classes: precisam vencer a regra ":is(...) a" da referência, de especificidade 0,1,1.)
const CORRECOES_REF = `.site-header { color: #262930; }
.site-header .site-header__link { color: #262930; } .site-header .site-header__link[href]:hover { color: #1158D4; }
.site-header .site-header__cta { color: #FFFFFF; }
.submenu .submenu__link { color: #3A3E4A; } .submenu .submenu__link[href]:hover { color: #14171F; }
.site-footer .site-footer__link { color: rgba(207, 230, 255, 0.6); } .site-footer .site-footer__link[href]:hover { color: #FFFFFF; }`;
const INJETAR_CORRECOES = `(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(CORRECOES_REF)}; document.head.append(s); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(true)))); })()`;
const carregarRef = async (largura) => { await carregar(cdp, urlRef, largura); await cdp.avaliar(INJETAR_CORRECOES); };

// Imagens do topo/rodapé que não carregaram (404, SVG inválido…). Com width/height fixos, uma imagem
// quebrada ocupa a mesma caixa: só esta verificação a pega com certeza.
const IMAGENS_QUEBRADAS = `[...document.querySelectorAll('.site-header img, .submenu img, .site-footer img')]
  .filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'))`;

const resultado = { site: NOME, larguras: [], falhas: [] };
const falhar = (msg) => { resultado.falhas.push(msg); console.log('  ✗ ' + msg); };
const ok = (msg) => console.log('  ✓ ' + msg);

function regioes(m, largura) {
  const topoFim = Math.ceil(Math.max(m.header.y + m.header.h, m.submenu ? m.submenu.y + m.submenu.h : 0));
  return {
    topo: { x: 0, y: 0, w: largura, h: topoFim },
    rodape: { x: 0, y: Math.floor(m.footer.y), w: largura, h: Math.ceil(m.footer.h) },
  };
}

function salvarTrio(nome, a, b) {
  const c = comparar(a, b);
  writeFileSync(join(SAIDA, `${nome}.png`), encodePng(ladoALado([a, b, c.diff])));
  return c;
}

function compararGeometria(largura, gRef, gSite, mRef, mSite) {
  let problemas = 0;
  for (const s of SELETORES) {
    const a = gRef[s]; const b = gSite[s];
    if (a.length !== b.length) { falhar(`${largura}px: ${s} — ${a.length} na referência × ${b.length} no Astro`); problemas++; continue; }
    // Rodapé: posição relativa ao topo do rodapé (o conteúdo da página acima pode ter outra altura).
    const noRodape = s.startsWith('.site-footer') || s === '.social-btn';
    const dyRef = noRodape ? mRef.footer.y : 0; const dySite = noRodape ? mSite.footer.y : 0;
    a.forEach((ra, i) => {
      const rb = b[i];
      const d = Math.max(Math.abs(ra.x - rb.x), Math.abs((ra.y - dyRef) - (rb.y - dySite)), Math.abs(ra.w - rb.w), Math.abs(ra.h - rb.h));
      if (d > TOL_GEOMETRIA) { falhar(`${largura}px: ${s}[${i}] difere ${d.toFixed(1)}px (ref ${JSON.stringify(ra)} × astro ${JSON.stringify(rb)})`); problemas++; }
    });
  }
  return problemas;
}

// ---------------------------------------------------------------- acessibilidade (página do site)
const CONTRASTE = `(() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const mistura = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const fundo = (el) => { let cor = { r: 255, g: 255, b: 255, a: 1 }; const pilha = []; for (let e = el; e; e = e.parentElement) pilha.push(parse(getComputedStyle(e).backgroundColor)); for (const c of pilha.reverse()) if (c && c.a > 0) cor = mistura(c, cor); return cor; };
  const ruins = [];
  for (const el of document.querySelectorAll('.site-header *, .submenu *, .site-footer *')) {
    const temTexto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!temTexto) continue; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const bg = fundo(el); let fg = parse(cs.color); fg = mistura(fg, bg);
    let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 1) fg = mistura({ ...fg, a: op }, bg);
    const L1 = lum(fg); const L2 = lum(bg); const razao = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    if (razao < (grande ? 3 : 4.5)) ruins.push(el.textContent.trim().slice(0, 30) + ' (' + razao.toFixed(2) + ':1)');
  }
  return ruins;
})()`;

const ALVOS = `(() => {
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const pequenos = [];
  for (const el of document.querySelectorAll(':is(.site-header, .submenu, .site-footer) :is(a[href], button)')) {
    if (!vis(el) || el.closest('p')) continue; const b = el.getBoundingClientRect();
    if (b.width < 43.5 || b.height < 43.5) pequenos.push((el.textContent.trim() || el.getAttribute('aria-label') || el.tagName).slice(0, 30) + ' (' + Math.round(b.width) + '×' + Math.round(b.height) + ')');
  }
  return pequenos;
})()`;

async function acessibilidade(cdp, url, largura) {
  await carregar(cdp, url, largura);
  const estado = () => cdp.avaliar(`(() => { const t = document.querySelector('.site-header__toggle'); const n = document.getElementById('menu-principal'); return { exp: t.getAttribute('aria-expanded'), visivel: getComputedStyle(n).display !== 'none', foco: document.activeElement?.className || '' }; })()`);

  if (await cdp.avaliar('document.documentElement.classList.contains("no-js")')) falhar(`${largura}px: classe no-js não foi removida pelo script`);
  if (await cdp.avaliar('document.documentElement.scrollWidth > document.documentElement.clientWidth + 0.5')) falhar(`${largura}px: rolagem horizontal`);

  // 1º Tab = "Pular para o conteúdo", com foco visível.
  await cdp.avaliar('window.scrollTo(0,0); document.activeElement?.blur(); true');
  await tecla(cdp, 'Tab', 'Tab', 9);
  const foco = await cdp.avaliar(`(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { cls: a.className, href: a.getAttribute('href'), destino: !!document.getElementById('conteudo'), visivel: a.getBoundingClientRect().top >= 0 }; })()`);
  if (foco.cls !== 'skip-link' || foco.href !== '#conteudo' || !foco.destino || !foco.visivel) falhar(`${largura}px: o 1º Tab não leva ao link "Pular para o conteúdo" visível (${JSON.stringify(foco)})`);
  // Foco visível num link do cabeçalho.
  await tecla(cdp, 'Tab', 'Tab', 9);
  const contorno = await cdp.avaliar(`(() => { const cs = getComputedStyle(document.activeElement); return cs.outlineStyle + ' ' + cs.outlineWidth; })()`);
  if (!/solid 2px/.test(contorno)) falhar(`${largura}px: foco sem contorno visível no 2º Tab (${contorno})`);

  const ruins = await cdp.avaliar(CONTRASTE);
  if (ruins.length) falhar(`${largura}px: contraste abaixo do AA: ${ruins.join('; ')}`);

  if (largura < 1024) {
    const caixaBotao = await cdp.avaliar(`(() => { const b = document.querySelector('.site-header__toggle').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    let e = await estado();
    if (e.exp !== 'false' || e.visivel) falhar(`${largura}px: menu deveria começar fechado (${JSON.stringify(e)})`);
    await clicar(cdp, caixaBotao.x, caixaBotao.y); await sleep(50); e = await estado();
    if (e.exp !== 'true' || !e.visivel) falhar(`${largura}px: o botão Menu não abriu o menu (${JSON.stringify(e)})`);
    const pequenos = await cdp.avaliar(ALVOS);
    if (pequenos.length) falhar(`${largura}px: alvos de toque menores que 44px: ${pequenos.join('; ')}`);
    await tecla(cdp, 'Escape', 'Escape', 27); await sleep(50); e = await estado();
    if (e.exp !== 'false' || e.visivel || !e.foco.includes('site-header__toggle')) falhar(`${largura}px: Esc não fechou o menu nem devolveu o foco (${JSON.stringify(e)})`);
    await clicar(cdp, caixaBotao.x, caixaBotao.y); await sleep(50);
    await clicar(cdp, 5, 860); await sleep(50); e = await estado();
    if (e.exp !== 'false' || e.visivel) falhar(`${largura}px: clique fora não fechou o menu (${JSON.stringify(e)})`);
    ok(`${largura}px: menu mobile abre, fecha com Esc (foco volta ao botão) e com clique fora; alvos ≥ 44px`);
  } else {
    const pequenos = await cdp.avaliar(ALVOS); // desktop: só informativo
    if (pequenos.length) console.log(`  · ${largura}px (desktop, informativo): alvos < 44px: ${pequenos.length}`);
  }

  // Sem JavaScript: o menu aparece aberto (classe no-js).
  await cdp.enviar('Emulation.setScriptExecutionDisabled', { value: true });
  await carregar(cdp, url, largura);
  const semJs = await cdp.avaliar(`getComputedStyle(document.getElementById('menu-principal')).display !== 'none' && document.documentElement.classList.contains('no-js')`);
  await cdp.enviar('Emulation.setScriptExecutionDisabled', { value: false });
  if (!semJs) falhar(`${largura}px: sem JavaScript o menu não fica visível`);
}

// ---------------------------------------------------------------- execução
const montagens = { [BASE]: DIST, '/ref/': REF };
const srv = await servir(montagens);
const chrome = await abrirChrome();
const { cdp } = chrome;
const urlRef = `${srv.url}/ref/exemplo.html`;
const urlSite = `${srv.url}${BASE}`;
const comSubmenu = existsSync(DIST) && readFileSync(join(DIST, 'index.html'), 'utf8').includes('class="submenu"');
console.log(`Paridade visual — site "${NOME}" (${urlSite}) × referência (${urlRef})${comSubmenu ? '' : ' — sem submenu: compara só cabeçalho e rodapé'}`);

try {
  for (const largura of LARGURAS) {
    console.log(`\n${largura}px`);
    await carregarRef(largura);
    const mRef = await cdp.avaliar(MEDIR); const imgRef = decodePng(await capturar(cdp));
    const quebradasRef = await cdp.avaliar(IMAGENS_QUEBRADAS);
    await carregar(cdp, urlSite, largura);
    const mSite = await cdp.avaliar(MEDIR); const imgSite = decodePng(await capturar(cdp));
    const quebradasSite = await cdp.avaliar(IMAGENS_QUEBRADAS);
    if (quebradasRef.length) falhar(`${largura}px: imagens que não carregaram na REFERÊNCIA: ${quebradasRef.join(', ')}`);
    if (quebradasSite.length) falhar(`${largura}px: imagens que não carregaram no Astro: ${quebradasSite.join(', ')}`);
    if (!comSubmenu) { delete mRef.geo['.submenu']; for (const s of SELETORES) if (s.startsWith('.submenu')) { mRef.geo[s] = []; mSite.geo[s] = []; } mRef.submenu = null; }

    // Cada imagem comparada isoladamente: um ícone pequeno diferente não se perde na região inteira.
    const IMGS = SELETORES.filter((s) => /img$|__arrow$|__logo-(ade|pref)$/.test(s));
    for (const s of IMGS) {
      const noRodape = s.startsWith('.site-footer');
      mRef.geo[s].forEach((ra, i) => {
        const rb = mSite.geo[s][i]; if (!rb) return;
        const a = recortar(imgRef, Math.floor(ra.x), Math.floor(ra.y), Math.ceil(ra.w), Math.ceil(ra.h));
        const b = recortar(imgSite, Math.floor(rb.x), Math.floor(rb.y), Math.ceil(rb.w), Math.ceil(rb.h));
        const c = comparar(a, b);
        if (c.porcentagem > 2) falhar(`${largura}px: imagem ${s}[${i}]${noRodape ? ' (rodapé)' : ''} difere ${c.porcentagem.toFixed(1)}%`);
      });
    }
    // Ícones das redes (o <img> fica dentro do botão).
    for (const [i, ra] of (mRef.geo['.social-btn'] ?? []).entries()) {
      const rb = mSite.geo['.social-btn'][i]; if (!rb) continue;
      const c = comparar(recortar(imgRef, Math.floor(ra.x), Math.floor(ra.y), Math.ceil(ra.w), Math.ceil(ra.h)), recortar(imgSite, Math.floor(rb.x), Math.floor(rb.y), Math.ceil(rb.w), Math.ceil(rb.h)));
      if (c.porcentagem > 2) falhar(`${largura}px: botão de rede social [${i}] difere ${c.porcentagem.toFixed(1)}%`);
    }

    const rRef = regioes(mRef, largura); const rSite = regioes(mSite, largura);
    const linha = { largura, regioes: {} };
    for (const nome of ['topo', 'rodape']) {
      const a = recortar(imgRef, rRef[nome].x, rRef[nome].y, rRef[nome].w, rRef[nome].h);
      const b = recortar(imgSite, rSite[nome].x, rSite[nome].y, rSite[nome].w, rSite[nome].h);
      const c = salvarTrio(`${largura}-${nome}`, a, b);
      linha.regioes[nome] = { porcentagem: +c.porcentagem.toFixed(3), alturaRef: a.height, alturaAstro: b.height, arquivo: `${largura}-${nome}.png` };
      if (a.height !== b.height) falhar(`${largura}px ${nome}: altura ${a.height}px na referência × ${b.height}px no Astro`);
      if (c.porcentagem > MAX_DIFERENCA) falhar(`${largura}px ${nome}: ${c.porcentagem.toFixed(2)}% de pixels diferentes (máx. ${MAX_DIFERENCA}%)`);
      else ok(`${largura}px ${nome}: ${c.porcentagem.toFixed(3)}% de pixels diferentes`);
    }
    const g = compararGeometria(largura, mRef.geo, mSite.geo, mRef, mSite);
    if (!g) ok(`${largura}px: posição e tamanho de ${SELETORES.length} grupos de elementos iguais (±${TOL_GEOMETRIA}px)`);

    // Menu mobile aberto: também precisa ser igual.
    if (largura < 1024) {
      const abrirMenu = `(() => { document.querySelector('.site-header__toggle').click(); const n = document.getElementById('menu-principal').getBoundingClientRect(); return Math.ceil(n.bottom + scrollY); })()`;
      await carregarRef(largura); const fimRef = await cdp.avaliar(abrirMenu); await sleep(80); const aRef = decodePng(await capturar(cdp));
      await carregar(cdp, urlSite, largura); const fimSite = await cdp.avaliar(abrirMenu); await sleep(80); const aSite = decodePng(await capturar(cdp));
      const c = salvarTrio(`${largura}-menu-aberto`, recortar(aRef, 0, 0, largura, fimRef), recortar(aSite, 0, 0, largura, fimSite));
      linha.regioes['menu-aberto'] = { porcentagem: +c.porcentagem.toFixed(3), arquivo: `${largura}-menu-aberto.png` };
      if (fimRef !== fimSite) falhar(`${largura}px menu aberto: altura ${fimRef}px × ${fimSite}px`);
      if (c.porcentagem > MAX_DIFERENCA) falhar(`${largura}px menu aberto: ${c.porcentagem.toFixed(2)}% de pixels diferentes`);
      else ok(`${largura}px menu aberto: ${c.porcentagem.toFixed(3)}% de pixels diferentes`);
    }

    await acessibilidade(cdp, urlSite, largura);
    resultado.larguras.push(linha);
  }
} finally {
  await chrome.fechar();
  await srv.fechar();
}

// ---------------------------------------------------------------- relatório
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const blocos = resultado.larguras.map((l) => `<h2>${l.largura}px</h2>` + Object.entries(l.regioes).map(([nome, r]) =>
  `<figure><figcaption>${esc(nome)} — ${r.porcentagem}% de pixels diferentes</figcaption><img src="${esc(r.arquivo)}" alt="${esc(nome)} em ${l.largura}px"></figure>`).join('')).join('');
writeFileSync(join(SAIDA, 'relatorio.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Paridade visual — ${esc(NOME)}</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f4f4f4}figure{margin:0 0 32px}img{max-width:100%;border:1px solid #ccc;background:#fff}figcaption{font-weight:600;margin:8px 0}.f{color:#b00}</style>
<h1>Cabeçalho e rodapé: referência × Astro (${esc(NOME)})</h1>
<p>Em cada imagem: <b>referência</b> (exemplo.html) | <b>Astro</b> | <b>diferenças</b> (vermelho).</p>
<p>${resultado.falhas.length ? `<span class="f">${resultado.falhas.length} falha(s):</span><ul>${resultado.falhas.map((f) => `<li class="f">${esc(f)}</li>`).join('')}</ul>` : '<b>Nenhuma falha.</b>'}</p>
${blocos}</html>`);
writeFileSync(join(SAIDA, 'resultado.json'), JSON.stringify(resultado, null, 2));

console.log(`\nRelatório: ${join(SAIDA, 'relatorio.html')}`);
if (resultado.falhas.length) { console.log(`${resultado.falhas.length} FALHA(S)`); process.exit(1); }
console.log('Tudo igual à referência.');
