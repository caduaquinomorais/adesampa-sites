/* Funções de apoio das páginas do site Home. */
import { getCollection, type CollectionEntry } from 'astro:content';
import { caminho } from '@adesampa/ui/caminhos';
import { atributosLink } from '@adesampa/ui/links';

/**
 * Notícias por página (Figma: 2 linhas de 3). A página Comunicação mostra a página 1; a paginação
 * continua em /comunicacao/noticias/pagina/2/ etc.
 */
export const NOTICIAS_POR_PAGINA = 6;

/**
 * Link escrito no conteúdo → endereço final.
 * '' continua '' (pendente); https://, mailto:, tel: e #ancora ficam como estão;
 * o resto é um caminho deste site ("sobre/") e ganha o base (/homolog/sobre/).
 */
export function resolverLink(link: string): string {
  const l = link.trim();
  // Já resolvido (ex.: caminho() ou urlNoticia()): começa com o base e fica como está.
  if (l === '' || /^(https?:|mailto:|tel:|#|\/)/i.test(l)) return l;
  return caminho(l);
}

/** Atributos de <a> para um link do conteúdo (href ou data-link-pendente). */
export const attrs = (link: string) => atributosLink(resolverLink(link));

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

/** 2026-07-29 → "29 jul. 2026" (como no Figma). Usa UTC: a data do arquivo não muda com o fuso. */
export function formatarData(d: Date): string {
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** 2026-07-29 → "2026-07-29" (atributo datetime). */
export const dataIso = (d: Date): string => d.toISOString().slice(0, 10);

/** Notícias publicadas (sem rascunhos), da mais recente para a mais antiga. */
export async function noticiasPublicadas(): Promise<CollectionEntry<'noticias'>[]> {
  const todas = await getCollection('noticias', (n) => !n.data.rascunho);
  return todas.sort((a, b) => b.data.data.getTime() - a.data.data.getTime() || b.id.localeCompare(a.id, undefined, { numeric: true }));
}

/** Endereço de uma notícia. */
export const urlNoticia = (id: string): string => caminho(`comunicacao/noticias/${id}/`);

/** Endereço de uma página da lista de notícias (opcionalmente filtrada por categoria). */
export function urlLista(pagina = 1, categoria?: string): string {
  const base = categoria ? `comunicacao/noticias/categoria/${categoria}/` : 'comunicacao/noticias/';
  return caminho(pagina > 1 ? `${base}pagina/${pagina}/` : base);
}

/** Divide um texto em parágrafos (linha em branco entre eles). */
export const paragrafos = (texto: string): string[] =>
  texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Total de páginas para N itens. */
export const totalPaginas = (n: number): number => Math.max(1, Math.ceil(n / NOTICIAS_POR_PAGINA));
