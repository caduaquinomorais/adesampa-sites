// Decide QUAIS sites publicar e monta a matriz do job de deploy (GitHub Actions).
//
// Regras:
//   - workflow_dispatch: o site escolhido no campo "site", ou "todos";
//   - push no main: se mudou algo compartilhado (packages/, package.json, package-lock.json, .nvmrc,
//     .github/workflows/, scripts/), publica TODOS; senão, só os sites cujos arquivos mudaram
//     (sites/<nome>/…); primeiro push (sem "antes") = todos.
//   - A comparação parte do commit do último run BEM-SUCEDIDO no main (ULTIMO_OK). Assim, se um deploy
//     falhou, o push seguinte publica também as mudanças dele. Sem ULTIMO_OK, usa o push anterior (ANTES).
//   - Só entram sites com publicar: true no mapa SITES (packages/ui/src/data/institucional.ts).
//
// Variáveis: EVENTO, SITE_ESCOLHIDO, ULTIMO_OK, ANTES, DEPOIS, ADESAMPA_AMBIENTE. Saída: GITHUB_OUTPUT
//   matriz = [{"nome":"home","pasta":"homolog","url":"https://…/"}], quantidade = N
//
// Teste local: EVENTO=workflow_dispatch SITE_ESCOLHIDO=todos node scripts/deploy-plano.mjs
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync } from 'node:fs';
import { SITES, ambienteAtual, ehNomeSite } from '../packages/ui/src/data/institucional.ts';

const evento = process.env.EVENTO ?? '';
const escolhido = (process.env.SITE_ESCOLHIDO ?? 'todos').trim() || 'todos';
const antes = (process.env.ULTIMO_OK || process.env.ANTES || '').trim();
const depois = process.env.DEPOIS ?? 'HEAD';
const ambiente = ambienteAtual();

const publicaveis = Object.entries(SITES)
  .filter(([nome, s]) => s.publicar && existsSync(`sites/${nome}/package.json`))
  .map(([nome]) => nome);

const COMPARTILHADO = [/^packages\//, /^package(-lock)?\.json$/, /^\.nvmrc$/, /^\.npmrc$/, /^\.github\/workflows\//, /^scripts\//];

let nomes;
let motivo;
if (evento === 'workflow_dispatch') {
  if (escolhido === 'todos') { nomes = publicaveis; motivo = 'execução manual: todos'; }
  else if (ehNomeSite(escolhido) && publicaveis.includes(escolhido)) { nomes = [escolhido]; motivo = `execução manual: ${escolhido}`; }
  else { console.error(`::error::Site "${escolhido}" não existe ou não é publicável. Opções: todos, ${publicaveis.join(', ')}`); process.exit(1); }
} else if (!antes || /^0+$/.test(antes)) {
  nomes = publicaveis; motivo = 'primeiro envio: todos';
} else {
  let mudados;
  try {
    mudados = execFileSync('git', ['diff', '--name-only', antes, depois], { encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    mudados = null; // histórico indisponível (ex.: force push) → publica todos, por segurança
  }
  if (!mudados) { nomes = publicaveis; motivo = 'não foi possível comparar os commits: todos'; }
  else if (mudados.some((f) => COMPARTILHADO.some((re) => re.test(f)))) { nomes = publicaveis; motivo = 'mudou algo compartilhado: todos'; }
  else {
    const tocados = new Set(mudados.map((f) => /^sites\/([^/]+)\//.exec(f)?.[1]).filter(Boolean));
    nomes = publicaveis.filter((n) => tocados.has(n));
    motivo = nomes.length ? `mudaram: ${nomes.join(', ')}` : 'nenhum site mudou';
  }
}

const matriz = nomes.map((nome) => ({ nome, pasta: SITES[nome].pastaFtp[ambiente], url: SITES[nome].url[ambiente] }));
console.log(`Ambiente: ${ambiente}. ${motivo}.`);
console.log(JSON.stringify(matriz, null, 2));
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `matriz=${JSON.stringify(matriz)}\nquantidade=${matriz.length}\n`);
  appendFileSync(process.env.GITHUB_STEP_SUMMARY ?? '/dev/null', `### Deploy (${ambiente})\n${motivo}\n\n${matriz.map((m) => `- **${m.nome}** → \`./${m.pasta}/\` → ${m.url}`).join('\n') || '_nada a publicar_'}\n`);
}
