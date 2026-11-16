/*
 * Integração do Astro comum a todos os sites (registrada por configurarSite()).
 * Depois do build:
 *   1. preenche __BASE__ no dist/.htaccess do site (ex.: "ErrorDocument 404 __BASE__404.html");
 *   2. cria dist/_astro/.htaccess com cache longo (arquivos com hash no nome);
 *   3. FALHA o build se algum HTML tiver <script> inline, style="" ou <style>, que a CSP bloquearia.
 */
import type { AstroIntegration } from 'astro';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HTACCESS_ASTRO = `# Gerado no build por packages/ui/src/integracao.ts — não edite.
# Arquivos em /_astro/ têm hash no nome: podem ficar em cache por 1 ano.
<IfModule mod_headers.c>
    Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`;

async function listarHtml(pasta: string): Promise<string[]> {
  const itens = await readdir(pasta, { withFileTypes: true, recursive: true });
  return itens.filter((i) => i.isFile() && i.name.endsWith('.html')).map((i) => join(i.parentPath, i.name));
}

/** Procura o que a CSP (script-src 'self'; style-src 'self') bloquearia. */
export function inlineProibido(html: string): string[] {
  const achados: string[] = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1] ?? '';
    const corpo = (m[2] ?? '').trim();
    const ehDados = /type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs);
    if (!/\bsrc\s*=/i.test(attrs) && corpo !== '' && !ehDados) achados.push(`<script> inline: ${corpo.slice(0, 60)}`);
  }
  if (/<style[\s>]/i.test(html)) achados.push('<style> inline');
  for (const m of html.matchAll(/<[a-z][^>]*\sstyle\s*=\s*["'][^"']*["']/gi)) achados.push(`style="": ${m[0].slice(0, 80)}`);
  for (const m of html.matchAll(/\son[a-z]+\s*=\s*["']/gi)) achados.push(`atributo de evento: ${m[0].trim()}`);
  return achados;
}

export function adesampa(nome: string): AstroIntegration {
  let base = '/';
  return {
    name: 'adesampa',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.endsWith('/') ? config.base : `${config.base}/`;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);

        // 1. .htaccess do site
        const caminhoHt = join(dist, '.htaccess');
        let ht: string;
        try {
          ht = await readFile(caminhoHt, 'utf8');
        } catch {
          throw new Error(`[${nome}] falta sites/${nome}/public/.htaccess (copie de sites/exemplo/public/.htaccess).`);
        }
        if (!ht.includes('__BASE__')) throw new Error(`[${nome}] .htaccess sem a marca __BASE__ (ErrorDocument 404).`);
        if (/^\s*php_(value|flag)\b/im.test(ht)) throw new Error(`[${nome}] .htaccess com php_value/php_flag: dá erro 500 na KingHost.`);
        await writeFile(caminhoHt, ht.replaceAll('__BASE__', base));

        // 2. cache longo em /_astro/
        await mkdir(join(dist, '_astro'), { recursive: true });
        await writeFile(join(dist, '_astro', '.htaccess'), HTACCESS_ASTRO);

        // 3. nada inline que a CSP bloquearia
        const problemas: string[] = [];
        for (const arquivo of await listarHtml(dist)) {
          for (const p of inlineProibido(await readFile(arquivo, 'utf8'))) problemas.push(`${arquivo.slice(dist.length)}: ${p}`);
        }
        if (problemas.length > 0) {
          throw new Error(`[${nome}] HTML com conteúdo inline bloqueado pela CSP:\n  ${problemas.join('\n  ')}`);
        }
        logger.info(`.htaccess pronto (base ${base}); nenhum script/estilo inline.`);
      },
    },
  };
}
