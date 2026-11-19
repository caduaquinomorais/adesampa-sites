/*
 * ADE SAMPA — TODOS os textos e links do cabeçalho e do rodapé institucionais.
 *
 * ESTE É O ÚNICO LUGAR onde eles existem. Mudou aqui, o próximo deploy publica a mudança
 * nos sites de todos os subdomínios (ver docs/HEADER_FOOTER.md).
 *
 * Origem: adesampa-header-footer/config.php (extraído do TEIA), textos exatos do Figma.
 *
 * Como escrever um link:
 *   ''                          → pendente: o item aparece, mas não navega (data-link-pendente)
 *   'https://…', 'mailto:…'     → endereço fixo
 *   pagina('home', 'sobre/')    → página de um site deste monorepo; o endereço muda sozinho
 *                                 conforme o ambiente (teste/produção), pelo mapa SITES abaixo
 *
 * Use só sintaxe TypeScript "apagável" (sem enum/namespace): o Node também executa este arquivo
 * (testes e deploy).
 */

// ============================================================================
// 1. Mapa dos sites (subdomínios) e ambientes
// ============================================================================

export type Ambiente = 'teste' | 'producao';
export const AMBIENTES: readonly Ambiente[] = ['teste', 'producao'];
export const AMBIENTE_PADRAO: Ambiente = 'teste';

export interface Site {
  /** Nome legível (logs e documentação). */
  rotulo: string;
  /** Endereço público, terminado em "/". Vira o `site` (origem) e o `base` (caminho) do Astro. */
  url: Record<Ambiente, string>;
  /** Pasta no FTP da KingHost, RELATIVA à pasta onde o FTP abre (www/). Ex.: "homolog/tech". */
  pastaFtp: Record<Ambiente, string>;
  /** false = existe só para testes, nunca é publicado. */
  publicar: boolean;
}

/*
 * teste    → pastas em https://oranilom.com.br/homolog/ (homologação na KingHost)
 * producao → endereço definitivo. Decisão de 16/11/2026: por enquanto também fica em
 *            oranilom.com.br/homolog/. Quando houver domínio definitivo, troque só `producao`.
 */
/** Congela o objeto inteiro: nenhum site consegue alterar estes dados durante o build. */
function congelar<T>(obj: T): T {
  if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj)) congelar(v);
    Object.freeze(obj);
  }
  return obj;
}

export const SITES = congelar({
  home: {
    rotulo: 'Home (ADE SAMPA)',
    url: {
      teste: 'https://oranilom.com.br/homolog/',
      producao: 'https://oranilom.com.br/homolog/',
    },
    pastaFtp: { teste: 'homolog', producao: 'homolog' },
    publicar: true,
  },
  exemplo: {
    rotulo: 'Exemplo (só cabeçalho e rodapé, usado nos testes)',
    url: {
      teste: 'https://oranilom.com.br/homolog/exemplo/',
      producao: 'https://oranilom.com.br/homolog/exemplo/',
    },
    pastaFtp: { teste: 'homolog/exemplo', producao: 'homolog/exemplo' },
    publicar: false,
  },
} as const satisfies Record<string, Site>);

export type NomeSite = keyof typeof SITES;

export function ehNomeSite(nome: string): nome is NomeSite {
  return Object.hasOwn(SITES, nome);
}

/** Ambiente do build, pela variável ADESAMPA_AMBIENTE ("teste" se vazia). Valor inválido = erro. */
export function ambienteAtual(valor: string | undefined = process.env.ADESAMPA_AMBIENTE): Ambiente {
  const v = (valor ?? '').trim();
  if (v === '') return AMBIENTE_PADRAO;
  if ((AMBIENTES as readonly string[]).includes(v)) return v as Ambiente;
  throw new Error(`ADESAMPA_AMBIENTE inválido: "${v}". Use ${AMBIENTES.join(' ou ')}.`);
}

// ============================================================================
// 2. Links
// ============================================================================

/** Página de um site deste monorepo (o endereço é resolvido por ambiente). */
export interface LinkPagina {
  site: NomeSite;
  /** Caminho dentro do site, sem barra inicial. '' = página inicial. Ex.: 'sobre/'. */
  caminho: string;
}

/** '' (pendente), endereço fixo ou página de um site do monorepo. */
export type Destino = string | LinkPagina;

export const pagina = (site: NomeSite, caminho = ''): LinkPagina => ({ site, caminho });

/** Endereço público de uma página de um site do monorepo. */
export function urlDoSite(site: NomeSite, ambiente: Ambiente, caminho = ''): string {
  return new URL(caminho.replace(/^\/+/, ''), SITES[site].url[ambiente]).href;
}

/** Transforma um Destino em texto ('' continua '' = pendente). */
export function resolverDestino(destino: Destino, ambiente: Ambiente): string {
  return typeof destino === 'string' ? destino : urlDoSite(destino.site, ambiente, destino.caminho);
}

export interface Link {
  rotulo: string;
  link: Destino;
}

const link = (rotulo: string, destino: Destino = ''): Link => ({ rotulo, link: destino });

// ============================================================================
// 3. Cabeçalho
// ============================================================================

/** Chaves do menu principal. É o valor da prop `ativo` do Header/BaseLayout. */
export type ChaveMenu = 'home' | 'sobre' | 'programas' | 'comunicacao' | 'transparencia' | 'governamental';

export interface ItemMenu extends Link {
  chave: ChaveMenu;
  /** Mostra a setinha de menu suspenso. */
  seta: boolean;
}

export interface Cabecalho {
  logoLink: Destino;
  logoRotulo: string;
  menu: ItemMenu[];
  botaoTexto: string;
  botaoLink: Destino;
}

export const CABECALHO: Cabecalho = congelar({
  logoLink: pagina('home'),
  logoRotulo: 'ADE SAMPA — página inicial',
  menu: [
    { chave: 'home', rotulo: 'Home', link: pagina('home'), seta: false },
    { chave: 'sobre', rotulo: 'Sobre', link: pagina('home', 'sobre/'), seta: false },
    // Abre o "Menu de projetos" (MENU_PROJETOS, abaixo); por isso não tem link próprio.
    { chave: 'programas', rotulo: 'Programas', link: '', seta: true },
    { chave: 'comunicacao', rotulo: 'Comunicação', link: pagina('home', 'comunicacao/'), seta: true },
    { chave: 'transparencia', rotulo: 'Transparência', link: '', seta: false }, // TODO-LINK
    // Página provisória (em produção): parcerias-governamentais/ no site Home. Figma: frame "Parcerias Governamentais" (966:21749).
    { chave: 'governamental', rotulo: 'Governamental', link: pagina('home', 'parcerias-governamentais/'), seta: false },
  ],
  botaoTexto: 'Agendamentos',
  botaoLink: 'https://app.adesampa.com.br/welcome',
});

// ============================================================================
// 3b. Menu de projetos (menu suspenso do item "Programas")
// Figma: frame "Menu de projetos" (656:19254), 1008 × 476. Links vazios = TODO-LINK.
// ============================================================================

export interface EixoMenu {
  cor: CorPrograma;
  /** Nome do programa (texto alternativo do logo). */
  nome: string;
  links: Link[];
}

export interface GrupoMenu {
  titulo: string;
  links: Link[];
}

export interface MenuProjetos {
  eixosTitulo: string;
  eixos: EixoMenu[];
  espacosTitulo: string;
  espacos: GrupoMenu[];
}

export const MENU_PROJETOS: MenuProjetos = congelar({
  eixosTitulo: 'Eixos de atuação',
  eixos: [
    {
      cor: 'empreende',
      nome: 'Sampa Empreende',
      links: [
        link('Atendimento ao empreendedor'),
        link('Orientação empresarial'),
        link('Curso fábrica de negócios'),
        link('Curso de gestão de negócios'),
        link('Linhas de crédito'),
        link('Consultoria em gestão financeira'),
        link('Educação financeira'),
      ],
    },
    { cor: 'tech', nome: 'Sampa Tech', links: [link('Aceleração Vai Tec')] },
    { cor: 'games', nome: 'Sampa Games', links: [link('Aceleração de estúdios'), link('Curso de game dev'), link('Hub de educação')] },
    {
      cor: 'verde',
      nome: 'Sampa Verde',
      links: [
        link('Aceleração de negócios rurais'),
        link('Aceleração de hortas'),
        link('Aceleração de negócios verdes'),
        link('Hub de inovação'),
      ],
    },
    { cor: 'criativa', nome: 'Sampa Criativa', links: [link('Aceleração de audiovisual'), link('Aceleração de moda')] },
  ],
  espacosTitulo: 'Espaços e plataformas',
  espacos: [
    {
      titulo: 'Teia',
      links: [link('Coworkings públicos'), link('Estúdios de podcast'), link('Estúdios de fotografia'), link('Estúdios de música')],
    },
    { titulo: 'Produtos digitais', links: [link('Sampa Ensina'), link('Gestão Sampa'), link('Data Sampa')] },
    { titulo: 'Praça Victor Civita', links: [link('Conheça os equipamentos')] },
  ],
});

// ============================================================================
// 4. Rodapé
// ============================================================================

/** Cor da barrinha ao lado do título de cada coluna (identidade visual dos programas). */
export type CorPrograma = 'empreende' | 'tech' | 'games' | 'verde' | 'criativa';

export interface ColunaRodape {
  titulo: string;
  cor: CorPrograma;
  links: Link[];
}

export type RedeSocial = 'instagram' | 'linkedin' | 'youtube' | 'facebook';

export interface Rodape {
  logoLink: Destino;
  texto: string;
  redesTitulo: string;
  redes: { rede: RedeSocial; nome: string; link: Destino }[];
  colunas: ColunaRodape[];
  legais: Link[];
  empresa: string;
  cnpj: string;
  endereco: string;
  copyright: string;
}

export const RODAPE: Rodape = congelar({
  logoLink: pagina('home'),
  texto:
    'Entidade vinculada à Prefeitura de São Paulo, por meio da Secretaria Municipal de Desenvolvimento Econômico e Trabalho (SMDET), dedicada à aceleração de negócios, inclusão produtiva e redução das desigualdades regionais.',
  redesTitulo: 'Redes sociais',
  /** A ordem aqui é a ordem dos botões. */
  redes: [
    { rede: 'instagram', nome: 'Instagram', link: 'https://www.instagram.com/adesampa/' },
    { rede: 'linkedin', nome: 'LinkedIn', link: 'https://br.linkedin.com/company/adesampa' },
    { rede: 'youtube', nome: 'YouTube', link: 'https://www.youtube.com/@Adesampa' },
    { rede: 'facebook', nome: 'Facebook', link: 'https://www.facebook.com/adesampaoficial/?locale=pt_BR' },
  ],
  /** Colunas do mapa do site (links vazios = TODO-LINK). Textos copiados exatamente do Figma. */
  colunas: [
    { titulo: 'ADE SAMPA', cor: 'empreende', links: [link('Início', pagina('home')), link('Sobre nós', pagina('home', 'sobre/')), link('Transparência')] },
    {
      titulo: 'Sampa Empreende',
      cor: 'empreende',
      links: [
        link('Atendimenro ao empreendedor'), // Grafia exatamente como no Figma (pendência P-18 no TEIA).
        link('Orientação empresarial'),
        link('Curso fábrica de negócios'),
        link('Curso de gestão de negócios'),
        link('Linhas de crédito'),
        link('Consultoria em gestão financeira'),
        link('Educação financeira'),
      ],
    },
    { titulo: 'Sampa Tech', cor: 'tech', links: [link('Aceleração Vai Tec')] },
    {
      titulo: 'Sampa Games',
      cor: 'games',
      links: [link('Aceleração de estúdios'), link('Curso de game dev'), link('Hub de educação')],
    },
    {
      titulo: 'Sampa Verde',
      cor: 'verde',
      links: [
        link('Aceleração de negócios rurais'),
        link('Aceleração de hortas'),
        link('Aceleração de negócios verdes'),
        link('Hub de inovação'),
      ],
    },
    { titulo: 'Sampa Criativa', cor: 'criativa', links: [link('Aceleração de audiovisual'), link('Aceleração de moda')] },
    {
      titulo: 'Outros programas',
      cor: 'empreende',
      links: [
        link('Teia: coworkings e estúdios públicos', 'https://oranilom.com.br/teia/'),
        link('Sampa Ensina'),
        link('Gestão Sampa'),
        link('Data Sampa'),
        link('Praça Victor Civita'),
      ],
    },
    {
      titulo: 'Comunicação',
      cor: 'empreende',
      links: [
        link('Notícias', pagina('home', 'comunicacao/noticias/')),
        link('Publicações', pagina('home', 'comunicacao/publicacoes/')),
        link('Manual de marca', pagina('home', 'comunicacao/#manual-de-marca')),
        link('Manual de redação', pagina('home', 'comunicacao/#manual-de-redacao')),
        link('Contato', pagina('home', 'comunicacao/#contato')),
      ],
    },
  ],
  legais: [link('Termos de uso'), link('Privacidade (LGPD)'), link('Acessibilidade')], // TODO-LINK
  empresa: 'ADE SAMPA – Agência São Paulo de Desenvolvimento',
  cnpj: 'CNPJ: 21.154.061/0001-83',
  endereco:
    'Sede Administrativa: Rua Líbero Badaró, 425 - 11º andar - Centro Histórico, São Paulo - SP, CEP 01009-000',
  copyright: '© 2026 ADE SAMPA • Prefeitura de São Paulo. Todos os direitos reservados.',
});

/** Todos os destinos do cabeçalho e do rodapé (usado pelos testes). */
export function todosOsDestinos(): Destino[] {
  return [
    CABECALHO.logoLink,
    ...CABECALHO.menu.map((i) => i.link),
    CABECALHO.botaoLink,
    ...MENU_PROJETOS.eixos.flatMap((e) => e.links.map((l) => l.link)),
    ...MENU_PROJETOS.espacos.flatMap((g) => g.links.map((l) => l.link)),
    RODAPE.logoLink,
    ...RODAPE.redes.map((r) => r.link),
    ...RODAPE.colunas.flatMap((c) => c.links.map((l) => l.link)),
    ...RODAPE.legais.map((l) => l.link),
  ];
}
