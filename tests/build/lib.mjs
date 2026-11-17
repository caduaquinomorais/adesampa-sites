// Funções comuns aos testes que leem o build (dist/) dos sites.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITES } from '../../packages/ui/src/data/institucional.ts';

export const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** Sites deste monorepo que têm build (sites/<nome>/dist), com base e endereço do ambiente "teste". */
export function sitesConstruidos() {
  return Object.keys(SITES)
    .filter((nome) => existsSync(join(RAIZ, 'sites', nome, 'dist', 'index.html')))
    .map((nome) => {
      const url = new URL(SITES[nome].url.teste);
      return { nome, dist: join(RAIZ, 'sites', nome, 'dist'), url: url.href, origem: url.origin, base: url.pathname };
    });
}

/** Sites cadastrados em SITES que existem como pasta sites/<nome> (o build precisa existir para eles). */
export function sitesDoRepositorio() {
  return Object.keys(SITES).filter((nome) => existsSync(join(RAIZ, 'sites', nome, 'package.json')));
}

export function arquivos(pasta, extensao) {
  return readdirSync(pasta, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(extensao))
    .map((e) => join(e.parentPath, e.name));
}

export const ler = (f) => readFileSync(f, 'utf8');

/** Caminho do arquivo HTML → URL pública (ex.: dist/sobre/index.html → /homolog/sobre/). */
export function urlDaPagina(site, arquivo) {
  const rel = relative(site.dist, arquivo).split(sep).join('/');
  return site.base + rel.replace(/(^|\/)index\.html$/, '$1');
}

export const decodificar = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Arquivo do build que responde a um caminho (sem ?/#), ou null. Imita o Apache (pasta → index.html). */
export function arquivoDoCaminho(site, caminho) {
  if (!caminho.startsWith(site.base)) return null;
  let rel;
  try { rel = decodeURIComponent(caminho.slice(site.base.length)); } catch { return null; }
  const alvo = join(site.dist, rel);
  if (!alvo.startsWith(site.dist)) return null;
  if (existsSync(alvo) && statSync(alvo).isFile()) return alvo;
  const indice = join(alvo, 'index.html');
  if (existsSync(indice)) return indice;
  return null;
}
