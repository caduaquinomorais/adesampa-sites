// ADE SAMPA — executa as baterias de teste em sequência e para na primeira que falhar.
//   npm test                 (todas)
//   npm test -- visual       (só as que têm "visual" no nome; também "build", "unitários", "home"…)
// Pressupõe o build feito (npm run build). No CI o workflow faz o build antes.
// Para continuar depois de uma falha (ver todas): ADESAMPA_TESTES_CONTINUAR=1 npm test
//
// Cada site em sites/<nome> entra sozinho nos testes visuais:
//   - cabeçalho/rodapé iguais à referência (todos);
//   - responsividade e acessibilidade de todas as páginas (todos, exceto "exemplo");
//   - comparação com o Figma (se existir tests/visual/figma-<nome>.json).
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const filtro = process.argv[2] ?? '';
const sites = readdirSync(join(RAIZ, 'sites'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(RAIZ, 'sites', d.name, 'package.json')))
  .map((d) => d.name)
  .sort((a, b) => (a === 'exemplo' ? -1 : b === 'exemplo' ? 1 : a.localeCompare(b)));

const BATERIAS = [
  { nome: 'unitários: links e mapa de sites', args: ['--test', 'tests/unit/'] },
  { nome: 'build: identidade do cabeçalho e do rodapé (todos os sites)', args: ['tests/build/identidade.mjs'] },
  { nome: 'build: links internos, assets e esquemas proibidos', args: ['tests/build/links.mjs'] },
  ...sites.flatMap((s) => [
    { nome: `visual: ${s} — cabeçalho e rodapé iguais à referência`, args: ['tests/visual/comparar.mjs', s] },
    ...(existsSync(join(RAIZ, 'tests', 'visual', `figma-${s}.json`)) ? [{ nome: `visual: ${s} × Figma (1440 px)`, args: ['tests/visual/figma.mjs', s] }] : []),
    ...(s !== 'exemplo' ? [{ nome: `visual: ${s} — páginas (responsividade e acessibilidade)`, args: ['tests/visual/paginas.mjs', s] }] : []),
  ]),
];

let falhas = 0;
for (const b of BATERIAS.filter((x) => x.nome.includes(filtro))) {
  console.log(`\n=== ${b.nome}`);
  const r = spawnSync(process.execPath, b.args, { cwd: RAIZ, stdio: 'inherit', timeout: 15 * 60 * 1000, killSignal: 'SIGKILL' });
  if (r.error?.code === 'ETIMEDOUT') console.log(`✗ ${b.nome}: passou de 15 minutos (travou?)`);
  if (r.status !== 0) { falhas++; console.log(`✗ ${b.nome}`); if (!process.env.ADESAMPA_TESTES_CONTINUAR) break; continue; }
  console.log(`✓ ${b.nome}`);
}
console.log(falhas ? `\n${falhas} bateria(s) falharam.` : '\nTodas as baterias passaram.');
process.exit(falhas ? 1 : 0);
