// TESTE DE IDENTIDADE — a garantia do requisito central do projeto:
// o <header class="site-header"> e o <footer class="site-footer"> são IDÊNTICOS, byte a byte, em
// todas as páginas de todos os sites. Única diferença aceita: o item ativo do menu
// (class "is-active" + aria-current). Os caminhos das imagens mudam só no prefixo da pasta de cada
// site (ex.: /homolog/_astro/logo.X.svg × /homolog/tech/_astro/logo.X.svg); o arquivo (com hash) é o
// mesmo, e o prefixo é normalizado antes da comparação.
//
//   npm run build && node tests/build/identidade.mjs
import { sitesConstruidos, sitesDoRepositorio, arquivos, ler, urlDaPagina } from './lib.mjs';

const sites = sitesConstruidos();
const faltando = sitesDoRepositorio().filter((n) => !sites.some((s) => s.nome === n));
if (faltando.length) { console.error(`Sem build: ${faltando.join(', ')}. Rode npm run build.`); process.exit(2); }

const falhas = [];
const PARTES = [
  ['cabeçalho', /<header class="site-header"[\s\S]*?<\/header>/g],
  ['rodapé', /<footer class="site-footer"[\s\S]*?<\/footer>/g],
];

function normalizar(html, base) {
  let ativos = 0;
  const semAtivo = html
    .replace(/class="site-header__item is-active"/g, () => { ativos++; return 'class="site-header__item"'; })
    .replace(/ aria-current="true"/g, '');
  const semBase = semAtivo.replaceAll(`"${base}_astro/`, '"{BASE}_astro/');
  return { html: semBase, ativos };
}

function primeiraDiferenca(a, b) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  const ini = Math.max(0, i - 60);
  return `\n      referência: …${a.slice(ini, i + 80)}…\n      esta página: …${b.slice(ini, i + 80)}…`;
}

let paginas = 0;
const referencia = {};
for (const site of sites) {
  for (const arquivo of arquivos(site.dist, '.html')) {
    paginas++;
    const url = urlDaPagina(site, arquivo);
    const html = ler(arquivo);
    for (const [nome, re] of PARTES) {
      const achados = html.match(re) ?? [];
      if (achados.length !== 1) { falhas.push(`${url}: ${achados.length} ${nome}(s) (esperado 1)`); continue; }
      const { html: norm, ativos } = normalizar(achados[0], site.base);
      if (ativos > 1) falhas.push(`${url}: ${ativos} itens ativos no menu (máximo 1)`);
      if (!referencia[nome]) { referencia[nome] = { html: norm, url }; continue; }
      if (norm !== referencia[nome].html) {
        falhas.push(`${url}: ${nome} DIFERENTE de ${referencia[nome].url}${primeiraDiferenca(referencia[nome].html, norm)}`);
      }
    }
  }
}

console.log(`Identidade do cabeçalho e do rodapé: ${paginas} páginas de ${sites.length} site(s) (${sites.map((s) => s.nome).join(', ')}).`);
if (falhas.length) {
  for (const f of falhas) console.log(`  ✗ ${f}`);
  console.log(`${falhas.length} FALHA(S)`);
  process.exit(1);
}
console.log(`  ✓ cabeçalho (${referencia['cabeçalho'].html.length} bytes) e rodapé (${referencia['rodapé'].html.length} bytes) idênticos em todas as páginas.`);
