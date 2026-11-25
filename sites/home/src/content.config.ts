/*
 * Coleções de conteúdo do site Home. TODO o texto editável fica em src/content/:
 *
 *   paginas/inicio.md, paginas/sobre.md, paginas/comunicacao.md, paginas/publicacoes.md,
 *   paginas/produtos-digitais.md
 *                         → textos fixos de cada página (no cabeçalho "---" do arquivo)
 *   noticias/*.md         → uma notícia por arquivo (o nome do arquivo vira o endereço)
 *   categorias.yaml       → categorias das notícias (os filtros da página Comunicação)
 *   destaques.yaml        → cards de "Destaques e oportunidades" do Início
 *   eixos.yaml            → texto dos cards dos 5 eixos (versão de hover; Início e Sobre)
 *   publicacoes.yaml      → revistas ADE SAMPA News e cartilhas
 *
 * Como editar: docs/CONTEUDO_HOME.md. O build falha com uma mensagem clara se faltar um campo.
 */
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

/** Link: '' (pendente), https://…, mailto:, #ancora ou caminho do site ("sobre/", sem barra inicial). */
const link = z.string().default('');

/** Cor/identidade de um programa (etiquetas, botões e cards). */
const programa = z.enum(['empreende', 'tech', 'games', 'verde', 'criativa']);

const botao = z.object({ texto: z.string(), link });

const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      /** Linha fina abaixo do título (opcional). */
      subtitulo: z.string().optional(),
      /** Texto curto do card (até ~150 caracteres). */
      resumo: z.string().max(220),
      categoria: reference('categorias'),
      data: z.coerce.date(),
      imagem: image().optional(),
      imagemAlt: z.string().optional(),
      /** true = não publica (rascunho). */
      rascunho: z.boolean().default(false),
    }).refine((n) => !n.imagem || (n.imagemAlt ?? '').trim() !== '', {
      message: 'Notícia com imagem precisa de imagemAlt (descrição da imagem para acessibilidade).',
      path: ['imagemAlt'],
    }),
});

const categorias = defineCollection({
  loader: file('src/content/categorias.yaml'),
  schema: z.object({ nome: z.string() }),
});

const destaques = defineCollection({
  loader: file('src/content/destaques.yaml'),
  schema: z.object({
    ordem: z.number(),
    programa,
    etiqueta: z.string(),
    titulo: z.string(),
    texto: z.string(),
    botao,
  }),
});

/** Cards dos 5 eixos (Início e Sobre): texto da versão de hover. Links: components/Eixos.astro. */
const eixos = defineCollection({
  loader: file('src/content/eixos.yaml'),
  schema: z.object({ nome: z.string(), texto: z.string(), botao: z.string().default('Saiba mais') }),
});

const publicacoes = defineCollection({
  loader: file('src/content/publicacoes.yaml'),
  schema: ({ image }) =>
    z.object({
      tipo: z.enum(['revista', 'cartilha']),
      ordem: z.number(),
      titulo: z.string(),
      capa: image(),
      capaAlt: z.string(),
      /** Link da publicação (https://… — PDF ou livro digital; ou arquivo em public/) — vazio = ainda sem link (o card não vira link). */
      arquivo: link,
    }),
});

// ---------------------------------------------------------------- páginas (um arquivo cada)
const cabecalhoSecao = z.object({ titulo: z.string(), texto: z.string().optional() });

const inicio = defineCollection({
  loader: glob({ pattern: 'inicio.md', base: './src/content/paginas' }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    descricao: z.string(),
    banner: z.object({ titulo: z.string(), texto: z.string(), botao }),
    eixos: cabecalhoSecao,
    destaques: z.object({ titulo: z.string() }),
    /** Seção "Parcerias governamentais" (Figma 966:18689). Com 2 ou mais itens, vira carrossel com pontinhos. */
    parcerias: z.object({
      etiqueta: z.string(),
      titulo: z.string(),
      texto: z.string(),
      botao,
      itens: z.array(z.object({ titulo: z.string(), imagem: image(), alt: z.string() })).min(1),
    }),
    numeros: cabecalhoSecao.extend({
      itens: z.array(z.object({ valor: z.string(), texto: z.string() })).min(1),
    }),
    teia: z.object({
      etiqueta: z.string(),
      titulo: z.string(),
      texto: z.string(),
      botaoSecundario: botao,
      botaoPrincipal: botao,
      mapa: image(),
      mapaAlt: z.string(),
      mapaLink: link,
      /**
       * Mapa interativo (Google My Maps), carregado só quando a pessoa clica no botão (LGPD e desempenho).
       * Link de incorporação: https://www.google.com/maps/d/embed?mid=… — vazio = fica só a imagem.
       */
      mapaEmbed: z
        .string()
        .trim()
        .default('')
        .refine(
          (v) => v === '' || /^https:\/\/www\.google\.com\/maps\/d\/(u\/\d+\/)?embed\?mid=[\w-]+(&[\w.=-]+)*$/.test(v),
          'teia.mapaEmbed: use o link de incorporação do Google My Maps (https://www.google.com/maps/d/embed?mid=…)',
        ),
      mapaBotao: z.string().default('Ver mapa interativo'),
    }),
    produtos: cabecalhoSecao.extend({
      etiqueta: z.string(),
      itens: z.array(z.object({ id: z.enum(['sampa-ensina', 'gestao-sampa', 'data-sampa']), nome: z.string(), texto: z.string(), link })),
      textoLink: z.string(),
    }),
    praca: z.object({
      etiqueta: z.string(),
      titulo: z.string(),
      texto: z.string(),
      funcionamento: z.object({ titulo: z.string(), texto: z.string() }),
      localizacao: z.object({ titulo: z.string(), texto: z.string() }),
      botao,
      /** Com 2 ou mais fotos, vira carrossel com pontinhos. */
      fotos: z.array(z.object({ imagem: image(), alt: z.string() })).min(1),
    }),
  }),
});

const sobre = defineCollection({
  loader: glob({ pattern: 'sobre.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    hero: z.object({ etiqueta: z.string(), titulo: z.string(), texto: z.string() }),
    quemSomos: z.object({ titulo: z.string(), texto: z.string() }),
    comoOperamos: z.object({ titulo: z.string(), texto: z.string() }),
    eixos: cabecalhoSecao,
    pilares: z.object({
      titulo: z.string(),
      proposito: z.object({ titulo: z.string(), texto: z.string() }),
      itens: z.array(z.object({ icone: z.enum(['governamental', 'empreendedor']), titulo: z.string(), texto: z.string() })),
    }),
  }),
});

const comunicacao = defineCollection({
  loader: glob({ pattern: 'comunicacao.md', base: './src/content/paginas' }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    descricao: z.string(),
    hero: z.object({ etiqueta: z.string(), titulo: z.string(), texto: z.string() }),
    noticias: z.object({ titulo: z.string(), textoBotao: z.string(), rotuloBusca: z.string() }),
    paginaNoticias: z.object({ titulo: z.string(), texto: z.string(), relacionadas: z.string() }),
    publicacoes: z.object({
      titulo: z.string(),
      texto: z.string(),
      itens: z.array(z.object({ destaque: z.string(), texto: z.string() })),
      botao,
      /** Capas exibidas ao lado (com 2 ou mais, viram carrossel com pontinhos). */
      capas: z.array(z.object({ imagem: image(), alt: z.string() })).min(1),
    }),
    manualMarca: cabecalhoSecao.extend({
      cards: z.array(z.object({ titulo: z.string(), texto: z.string(), botao })),
    }),
    manualRedacao: cabecalhoSecao.extend({
      card: z.object({ titulo: z.string(), texto: z.string(), botao }),
    }),
    contato: cabecalhoSecao.extend({
      emails: z.array(z.object({ rotulo: z.string(), email: z.email() })),
    }),
  }),
});

const paginaPublicacoes = defineCollection({
  loader: glob({ pattern: 'publicacoes.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    hero: z.object({ titulo: z.string(), texto: z.string() }),
    revistas: cabecalhoSecao,
    cartilhas: cabecalhoSecao,
  }),
});

/** Página Produtos digitais (Figma 685:50101). Ícones: components/IconeProduto.astro. */
const produtosDigitais = defineCollection({
  loader: glob({ pattern: 'produtos-digitais.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    hero: z.object({ etiqueta: z.string(), titulo: z.string(), texto: z.string() }),
    produtos: z.array(z.object({
      id: z.enum(['sampa-ensina', 'gestao-sampa', 'data-sampa']),
      nome: z.string(),
      texto: z.string(),
      botao,
      recursos: z.array(z.object({
        icone: z.enum(['gratuito', 'certificado', 'ampulheta', 'dinheiro', 'caixa', 'vitrine', 'grafico', 'mapa', 'apoio']),
        titulo: z.string(),
        texto: z.string(),
      })).min(1),
    })).min(1),
  }),
});

export const collections = { eixos, noticias, categorias, destaques, publicacoes, inicio, sobre, comunicacao, paginaPublicacoes, produtosDigitais };
