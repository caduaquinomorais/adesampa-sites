/*
 * Coleção de conteúdo do site Teia. TODO o texto editável fica em src/content/paginas/teia.md.
 * Como editar: docs/CONTEUDO_TEIA.md. O build falha com uma mensagem clara se faltar um campo.
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Link: '' (pendente), https://…, mailto:, #ancora ou caminho do site (sem barra inicial). */
const link = z.string().default('');

const teia = defineCollection({
  loader: glob({ pattern: 'teia.md', base: './src/content/paginas' }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    descricao: z.string(),
    linkAgendamento: link,
    banner: z.object({ etiqueta: z.string(), titulo: z.string(), texto: z.string() }),
    espacos: z.array(z.object({
      ancora: z.string().regex(/^[a-z0-9-]+$/, 'ancora: só letras minúsculas, números e hífen'),
      etiqueta: z.string(),
      titulo: z.string(),
      texto: z.string(),
      fotos: z.array(z.object({ imagem: image(), alt: z.string() })).min(1),
    })).min(1),
    textoBotaoMapa: z.string(),
    textoBotaoAgendamento: z.string(),
    mapa: z.object({
      titulo: z.string(),
      texto: z.string(),
      botao: z.string(),
      embed: z
        .string()
        .trim()
        .default('')
        .refine(
          (v) => v === '' || /^https:\/\/www\.google\.com\/maps\/d\/(u\/\d+\/)?embed\?mid=[\w-]+(&[\w.=-]+)*$/.test(v),
          'mapa.embed: use o link de incorporação do Google My Maps (https://www.google.com/maps/d/embed?mid=…)',
        ),
      botaoInterativo: z.string(),
      rotulos: z.object({ unidade: z.string(), zona: z.string(), classificacao: z.string(), status: z.string(), endereco: z.string() }),
      unidades: z.array(z.object({
        nome: z.string(), zona: z.string().default(''), classificacao: z.string().default(''), status: z.string().default(''), endereco: z.string(),
      })).min(1),
    }),
    duvidas: z.object({
      titulo: z.string(),
      subtitulo: z.string().default(''),
      itens: z.array(z.object({ pergunta: z.string(), resposta: z.string().default('') })),
    }),
    normas: z.object({
      titulo: z.string(),
      texto: z.string().default(''),
      documentos: z.array(z.object({ titulo: z.string(), descricao: z.string().default(''), arquivo: link, botao: z.string() })),
    }),
  }),
});

export const collections = { teia };
