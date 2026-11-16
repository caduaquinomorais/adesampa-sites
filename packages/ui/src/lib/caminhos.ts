/*
 * Caminhos internos que respeitam o `base` do site (ex.: /homolog/ no teste, / em produção).
 * Nunca escreva "/sobre/" fixo numa página: use caminho('sobre/').
 */

/** BASE_URL sempre com "/" no final. */
export const BASE: string = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** caminho('sobre/') → '/homolog/sobre/'; caminho() → página inicial do site. */
export function caminho(relativo = ''): string {
  return BASE + relativo.replace(/^\/+/, '');
}
