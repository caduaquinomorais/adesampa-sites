// ADE SAMPA — executa as baterias de teste em sequência e para na primeira que falhar.
//   npm test                 (todas)
//   npm test -- visual       (só as que têm "visual" no nome)
// Pressupõe o build feito (npm run build). No CI o workflow faz o build antes.
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const filtro = process.argv[2] ?? '';

const BATERIAS = [
  { nome: 'visual: paridade com a referência (exemplo)', args: ['tests/visual/comparar.mjs', 'exemplo'] },
  { nome: 'visual: cabeçalho e rodapé do home iguais à referência', args: ['tests/visual/comparar.mjs', 'home'] },
  { nome: 'visual: home × Figma (1440 px)', args: ['tests/visual/figma.mjs', 'home'] },
  { nome: 'visual: páginas do home (responsividade e acessibilidade)', args: ['tests/visual/paginas.mjs', 'home'] },
];

let falhas = 0;
for (const b of BATERIAS.filter((x) => x.nome.includes(filtro))) {
  console.log(`\n=== ${b.nome}`);
  const r = spawnSync(process.execPath, b.args, { cwd: RAIZ, stdio: 'inherit', timeout: 15 * 60 * 1000, killSignal: 'SIGKILL' });
  if (r.error?.code === 'ETIMEDOUT') console.log(`✗ ${b.nome}: passou de 15 minutos (travou?)`);
  if (r.status !== 0) { falhas++; console.log(`✗ ${b.nome}`); break; }
  console.log(`✓ ${b.nome}`);
}
process.exit(falhas ? 1 : 0);
