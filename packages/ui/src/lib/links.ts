/*
 * Validação de links do cabeçalho, do submenu e do rodapé (tradução de hf_url_permitida/hf_href
 * do PHP de referência). Aceita só:
 *   https://… e http://… (com host e sem usuário/senha), mailto:, tel:, #ancora e caminhos
 *   internos começando com "/" (mas não "//").
 * Qualquer outra coisa (javascript:, data:, vbscript:, "//host"…) vira link PENDENTE:
 * o item aparece sem href e com data-link-pendente="true".
 */

const CONTROLE_OU_ESPACO = /[\x00-\x20\x7F]/;
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function urlPermitida(entrada: string): boolean {
  const url = entrada.trim();
  if (url === '' || url.length > 2048 || CONTROLE_OU_ESPACO.test(url)) return false;

  if (url.startsWith('#')) return /^#[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(url);
  if (url.startsWith('/')) return !url.startsWith('//') && !url.includes('\\');

  const minusculo = url.toLowerCase();
  if (minusculo.startsWith('mailto:')) {
    const endereco = url.slice(7).split('?', 1)[0] ?? '';
    try {
      return EMAIL.test(decodeURIComponent(endereco));
    } catch {
      return false;
    }
  }
  if (minusculo.startsWith('tel:')) return /^tel:\+?[0-9().-]{3,20}$/i.test(url);
  if (!/^https?:\/\//i.test(url)) return false;

  try {
    const u = new URL(url);
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname !== '' && u.username === '' && u.password === '';
  } catch {
    return false;
  }
}

/** Atributos de um link. Vazio/inválido = sem href, com data-link-pendente="true". */
export function atributosLink(entrada: string): Record<string, string> {
  const url = entrada.trim();
  if (!urlPermitida(url)) return { 'data-link-pendente': 'true' };
  if (/^https?:\/\//i.test(url)) return { href: url, rel: 'noopener noreferrer' };
  return { href: url };
}
