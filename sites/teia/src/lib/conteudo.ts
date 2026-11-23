/* Funções de apoio da página do Teia (mesma lógica dos sites Home e Sampa Tech). */
import { caminho } from '@adesampa/ui/caminhos';
import { atributosLink } from '@adesampa/ui/links';

/**
 * Link escrito no conteúdo → endereço final.
 * '' continua '' (pendente); https://, mailto:, tel: e #ancora ficam como estão;
 * o resto é um caminho deste site e ganha o base (/homolog/teia/…).
 */
export function resolverLink(link: string): string {
  const l = link.trim();
  if (l === '' || /^(https?:|mailto:|tel:|#|\/)/i.test(l)) return l;
  return caminho(l);
}

/** Atributos de <a> para um link do conteúdo (href ou data-link-pendente). */
export const attrs = (link: string) => atributosLink(resolverLink(link));

/** Arquivo para download (PDF em public/ ou https://). */
export const urlArquivo = (arquivo: string): string => resolverLink(arquivo);

/** Divide um texto em parágrafos (linha em branco entre eles). */
export const paragrafos = (texto: string): string[] =>
  texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
