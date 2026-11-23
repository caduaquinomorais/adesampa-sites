/*
 * Coleções de conteúdo do site Sampa Tech. TODO o texto editável fica em src/content/paginas/:
 *
 *   inicio.md  → página Sampa Tech (raiz do site)
 *   vaitec.md  → página Aceleração Vai Tec (/vaitec/)
 *
 * Como editar: docs/CONTEUDO_TECH.md. O build falha com uma mensagem clara se faltar um campo.
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Link: '' (pendente), https://…, mailto:, #ancora ou caminho do site ("vaitec/", sem barra inicial). */
const link = z.string().default('');
const botao = z.object({ texto: z.string(), link });

/** Situação das inscrições (bolinha verde = abertas; cinza = fechadas). */
const status = z.object({ texto: z.string(), aberto: z.boolean() });

/** Card "Resumo do Edital". */
const resumo = z.object({
  titulo: z.string(),
  valor: z.string(),
  valorTexto: z.string(),
  itens: z.array(z.object({ destaque: z.string(), texto: z.string(), link: link.optional() })).min(1),
});

const perguntas = z.array(z.object({ pergunta: z.string(), resposta: z.string() })).min(1);
const cabecalho = { titulo: z.string(), texto: z.string() };

const inicio = defineCollection({
  loader: glob({ pattern: 'inicio.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    hero: z.object({ etiqueta: z.string(), titulo: z.string(), texto: z.string() }),
    programas: z.array(z.object({
      status,
      titulo: z.string(),
      texto: z.string(),
      itens: z.array(z.string()),
      botao,
      resumo,
    })).min(1),
  }),
});

const vaitec = defineCollection({
  loader: glob({ pattern: 'vaitec.md', base: './src/content/paginas' }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    descricao: z.string(),
    submenu: z.object({
      sobre: z.string(), beneficios: z.string(), temas: z.string(), quemPode: z.string(),
      cronograma: z.string(), duvidas: z.string(), inscricoes: z.string(),
    }),
    hero: z.object({ status, titulo: z.string(), texto: z.string(), resumo }),
    sobre: z.object({ titulo: z.string(), texto: z.string(), imagem: image(), imagemAlt: z.string() }),
    beneficios: z.object({
      titulo: z.string(),
      itens: z.array(z.object({ icone: z.enum(['dinheiro', 'formacao', 'mentoria', 'rede']), titulo: z.string(), texto: z.string() })).min(1),
    }),
    temas: z.object({ ...cabecalho, itens: z.array(z.string()).min(1) }),
    quemPode: z.object({ ...cabecalho, perguntas }),
    cronograma: z.object({ ...cabecalho, etapas: z.array(z.object({ data: z.string(), titulo: z.string() })).min(1) }),
    duvidas: z.object({ ...cabecalho, perguntas }),
    edital: z.object({ ...cabecalho, botaoPrincipal: botao, botaoSecundario: botao, notas: z.array(z.string()) }),
  }),
});

export const collections = { inicio, vaitec };
