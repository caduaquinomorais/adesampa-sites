/*
 * Configuração do Astro COMUM a todos os sites. Cada sites/<nome>/astro.config.mjs só faz:
 *
 *   import { configurarSite } from '@adesampa/ui/config';
 *   export default configurarSite('home');
 *
 * `site` e `base` saem do mapa SITES (institucional.ts) conforme ADESAMPA_AMBIENTE:
 *   teste    → ex.: site https://oranilom.com.br, base /homolog/tech/
 *   producao → ex.: site https://tech.adesampa.com.br, base /
 * Nenhum caminho fica fixo no código: use caminho('sobre/') de '@adesampa/ui/caminhos' (ou import.meta.env.BASE_URL).
 */
import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import { SITES, ambienteAtual, ehNomeSite } from './data/institucional.ts';
import { adesampa } from './integracao.ts';

/** O que um site pode acrescentar. Todo o resto (base, saída estática, regras da CSP…) é comum e fixo. */
export interface OpcoesSite {
  integrations?: AstroIntegration[];
}

export function configurarSite(nome: string, opcoes: OpcoesSite = {}) {
  if (!ehNomeSite(nome)) {
    throw new Error(`Site "${nome}" não está no mapa SITES de packages/ui/src/data/institucional.ts.`);
  }
  const ambiente = ambienteAtual();
  const endereco = new URL(SITES[nome].url[ambiente]);

  return defineConfig({
    site: endereco.origin,
    base: endereco.pathname,
    output: 'static', // 100% estático: o servidor só recebe HTML, CSS, JS e imagens.
    trailingSlash: 'always',
    build: {
      format: 'directory', // /sobre/ → sobre/index.html (funciona no Apache sem regras extras)
      assets: '_astro',
      inlineStylesheets: 'never', // nada de <style> inline (CSP: style-src 'self')
    },
    compressHTML: true,
    devToolbar: { enabled: false },
    prefetch: false,
    vite: {
      build: {
        // 0 = nunca embutir arquivos como data: nem scripts pequenos inline (CSP: script-src 'self').
        assetsInlineLimit: 0,
      },
    },
    integrations: [adesampa(nome), ...(opcoes.integrations ?? [])],
  });
}
