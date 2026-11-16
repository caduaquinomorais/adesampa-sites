// Servidor HTTP estático mínimo para os testes (sem dependências).
// Monta cada pasta num prefixo de URL, imitando o Apache da KingHost:
//   servir({ '/homolog/': 'sites/home/dist', '/ref/': 'referencia/header-footer' })
// "/pasta/" → pasta/index.html; arquivo inexistente → 404.html do site (se houver), com status 404.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, sep } from 'node:path';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

async function ehArquivo(caminho) {
  try {
    return (await stat(caminho)).isFile();
  } catch {
    return false;
  }
}

/** Resolve uma URL para um arquivo dentro das montagens. Retorna { arquivo, status } ou null. */
export async function resolver(montagens, urlPath) {
  // O prefixo mais longo vence (ex.: /homolog/tech/ antes de /homolog/).
  const prefixos = Object.keys(montagens).sort((a, b) => b.length - a.length);
  let caminho;
  try {
    caminho = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null;
  }
  for (const prefixo of prefixos) {
    if (!caminho.startsWith(prefixo) && caminho + '/' !== prefixo) continue;
    const raiz = montagens[prefixo];
    const resto = caminho.slice(prefixo.length);
    const alvo = normalize(join(raiz, resto));
    if (alvo !== normalize(raiz) && !alvo.startsWith(normalize(raiz) + sep)) return null; // ../
    if (caminho + '/' === prefixo) return { redirecionar: prefixo };
    if (resto === '' || resto.endsWith('/')) {
      const indice = join(alvo, 'index.html');
      if (await ehArquivo(indice)) return { arquivo: indice, status: 200 };
    } else if (await ehArquivo(alvo)) {
      return { arquivo: alvo, status: 200 };
    } else if (await ehArquivo(join(alvo, 'index.html'))) {
      return { redirecionar: caminho + '/' };
    }
    const erro = join(raiz, '404.html');
    if (await ehArquivo(erro)) return { arquivo: erro, status: 404 };
    return null;
  }
  return null;
}

export function servir(montagens, porta = 0) {
  const servidor = createServer(async (req, res) => {
    const r = await resolver(montagens, req.url ?? '/');
    if (r?.redirecionar) {
      res.writeHead(301, { Location: r.redirecionar });
      res.end();
      return;
    }
    if (!r) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }
    const corpo = await readFile(r.arquivo);
    res.writeHead(r.status, { 'Content-Type': TIPOS[extname(r.arquivo).toLowerCase()] ?? 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : corpo);
  });
  return new Promise((resolve) => {
    servidor.listen(porta, '127.0.0.1', () => {
      const { port } = servidor.address();
      resolve({ url: `http://127.0.0.1:${port}`, fechar: () => new Promise((ok) => servidor.close(ok)) });
    });
  });
}
