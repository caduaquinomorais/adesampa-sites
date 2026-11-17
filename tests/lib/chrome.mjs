// Chrome/Edge headless controlado pelo DevTools Protocol, com o WebSocket nativo do Node (sem npm).
// Adaptado de teia-teste/tests/visual/comparar.mjs.
import { spawn } from 'node:child_process';
import { mkdtempSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function acharChrome() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  ].filter(Boolean);
  const achado = candidatos.find((p) => existsSync(p));
  if (!achado) throw new Error('Chrome/Edge não encontrado. Defina CHROME_PATH.');
  return achado;
}

class Cdp {
  constructor(url) { this.url = url; this.id = 0; this.pendentes = new Map(); this.ouvintes = []; }
  abrir() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id && this.pendentes.has(msg.id)) {
          const { resolve: ok, reject: erro } = this.pendentes.get(msg.id);
          this.pendentes.delete(msg.id);
          msg.error ? erro(new Error(msg.error.message)) : ok(msg.result);
        } else if (msg.method) {
          this.ouvintes.forEach((l) => l(msg));
        }
      };
    });
  }
  enviar(metodo, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method: metodo, params }));
    return new Promise((resolve, reject) => this.pendentes.set(id, { resolve, reject }));
  }
  esperar(metodo, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('tempo esgotado: ' + metodo)), timeout);
      const l = (msg) => { if (msg.method === metodo) { clearTimeout(t); this.ouvintes = this.ouvintes.filter((x) => x !== l); resolve(msg); } };
      this.ouvintes.push(l);
    });
  }
  async avaliar(expr) {
    const r = await this.enviar('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error('Erro no navegador: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
}

/**
 * Inicia o Chrome e devolve { proc, perfil, ws } (ou null se o DevTools não responder a tempo).
 * Porta 0: o próprio Chrome escolhe uma porta livre e a informa no stderr ("DevTools listening on
 * ws://127.0.0.1:<porta>/…"). Uma porta sorteada às vezes já estava ocupada no runner do CI.
 */
async function iniciarChrome(limiteMs) {
  const perfil = mkdtempSync(join(tmpdir(), 'adesampa-chrome-'));
  const proc = spawn(acharChrome(), [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${perfil}`,
    '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--disable-extensions', '--lang=pt-BR', '--font-render-hinting=none',
    ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let porta = null;
  let saiu = false;
  let stderr = '';
  proc.stderr.on('data', (d) => {
    stderr = (stderr + d).slice(-4000);
    const m = /DevTools listening on ws:\/\/[^:]+:(\d+)\//.exec(stderr);
    if (m) porta = m[1];
  });
  proc.on('exit', () => { saiu = true; });
  let ws;
  const fim = Date.now() + limiteMs;
  while (!ws && !saiu && Date.now() < fim) {
    if (porta) {
      try {
        const lista = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json();
        ws = lista.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
      } catch { /* aguardando */ }
    }
    if (!ws) await sleep(100);
  }
  if (ws) return { proc, perfil, ws };
  proc.kill();
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* ignora */ }
  const ultima = stderr.trim().split('\n').slice(-3).join(' | ');
  console.error(`  (Chrome não respondeu${saiu ? ': o processo terminou' : ''}${ultima ? ` — ${ultima}` : ''})`);
  return null;
}

/** Abre o Chrome headless e devolve { cdp, fechar }. Tenta até 3 vezes (runner do CI lento ou ocupado). */
export async function abrirChrome() {
  let iniciado = null;
  for (let tentativa = 1; tentativa <= 3 && !iniciado; tentativa++) {
    iniciado = await iniciarChrome(30000);
    if (!iniciado && tentativa < 3) { console.error(`  Chrome não abriu (tentativa ${tentativa} de 3); tentando de novo…`); await sleep(1000); }
  }
  if (!iniciado) throw new Error('Chrome não iniciou o DevTools (3 tentativas).');
  const { proc, perfil, ws } = iniciado;
  const cdp = new Cdp(ws);
  await cdp.abrir();
  await cdp.enviar('Page.enable');
  await cdp.enviar('Runtime.enable');
  // "Reduzir movimento": a rolagem suave (scroll-behavior: smooth) vira instantânea, e as medições
  // logo depois de rolar não dependem da velocidade da máquina.
  await cdp.enviar('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  return {
    cdp,
    fechar: async () => {
      try { cdp.ws.close(); } catch { /* já fechado */ }
      proc.kill();
      await sleep(300);
      try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Windows às vezes segura o perfil */ }
    },
  };
}

/**
 * Carrega a URL numa largura, espera fontes e imagens (inclusive as lazy).
 * simples: true = só espera o load (necessário com os scripts desligados, quando timers não rodam).
 */
export async function carregar(cdp, url, largura, altura = 900, { simples = false } = {}) {
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: largura < 768 });
  await cdp.enviar('Emulation.setTouchEmulationEnabled', { enabled: largura < 1024 });
  const carregou = cdp.esperar('Page.loadEventFired');
  await cdp.enviar('Page.navigate', { url });
  await carregou;
  if (simples) return;
  // Rola até o fim e volta: as imagens loading="lazy" do rodapé carregam.
  // (A viewport não é esticada até a altura da página: unidades vh mudariam o layout.)
  // Rola em etapas (como uma pessoa): pular direto para o fim não carrega as imagens do meio.
  await cdp.avaliar(`document.fonts.ready.then(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, document.documentElement.scrollHeight); return true;
  })`);
  await sleep(100);
  // Imagens lazy fora da tela na horizontal (carrosséis) nunca carregam: limite de 5 s na espera.
  await cdp.avaliar(`Promise.race([
    Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))]),
    new Promise((r) => setTimeout(r, 5000)),
  ]).then(() => { window.scrollTo(0, 0); return true; })`);
  await sleep(150);
}

/** Captura a página inteira, além da viewport. */
export async function capturar(cdp) {
  const { width, height } = await cdp.avaliar('({ width: document.documentElement.clientWidth, height: document.documentElement.scrollHeight })');
  const { data } = await cdp.enviar('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  return Buffer.from(data, 'base64');
}

export async function tecla(cdp, key, code = key, keyCode = 0, shift = false) {
  const base = { key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, modifiers: shift ? 8 : 0 };
  await cdp.enviar('Input.dispatchKeyEvent', { type: 'keyDown', ...base });
  await cdp.enviar('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
}

export async function clicar(cdp, x, y) {
  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.enviar('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
  }
}
