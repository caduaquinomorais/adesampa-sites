/* Índice estático da busca de notícias (gerado no build): /comunicacao/noticias/busca.json */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { noticiasPublicadas, formatarData, dataIso, urlNoticia } from '../../../lib/conteudo';

const normalizar = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const GET: APIRoute = async () => {
  const nomes = new Map((await getCollection('categorias')).map((c) => [c.id, c.data.nome]));
  const itens = (await noticiasPublicadas()).map((n) => {
    const categoria = nomes.get(n.data.categoria.id) ?? '';
    return {
      titulo: n.data.titulo,
      resumo: n.data.resumo,
      categoria,
      data: dataIso(n.data.data),
      dataTexto: formatarData(n.data.data),
      url: urlNoticia(n.id),
      // Texto pesquisável: sem acentos, minúsculo (título, linha fina, resumo, categoria e corpo).
      texto: normalizar([n.data.titulo, n.data.subtitulo ?? '', n.data.resumo, categoria, n.body ?? ''].join(' ')),
    };
  });
  return new Response(JSON.stringify(itens), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
