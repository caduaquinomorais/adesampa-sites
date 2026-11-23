/* Funções de apoio das páginas do site Sampa Tech (mesma lógica do site Home). */
import { caminho } from '@adesampa/ui/caminhos';
import { atributosLink } from '@adesampa/ui/links';

/**
 * Link escrito no conteúdo → endereço final.
 * '' continua '' (pendente); https://, mailto:, tel: e #ancora ficam como estão;
 * o resto é um caminho deste site ("vaitec/") e ganha o base (/homolog/sampa-tech/vaitec/).
 */
export function resolverLink(link: string): string {
  const l = link.trim();
  if (l === '' || /^(https?:|mailto:|tel:|#|\/)/i.test(l)) return l;
  return caminho(l);
}

/** Atributos de <a> para um link do conteúdo (href ou data-link-pendente). */
export const attrs = (link: string) => atributosLink(resolverLink(link));

/** Divide um texto em parágrafos (linha em branco entre eles). */
export const paragrafos = (texto: string): string[] =>
  texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
