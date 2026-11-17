// Compõe o fundo do banner do Início exatamente como o Figma (frame 55:1964, 1440×592):
//  1. foto (imageTransform: largura total, altura 592/1.4572 = 406,3 px, topo em 0,6290/1.4572·592 = 255,6 px), opacidade 0,8 sobre branco
//  2. SOLID #1158D4 a 61% com blend "COLOR" (matiz/saturação da cor, luminosidade do fundo)
//  3. degradê vertical #E8F1FC sólido até 50,48% → transparente em 87,98%
//  4. degradê vertical #0055EA (a 4%) em 0% → transparente em 26,92%
// Uso: node scripts/compor-banner.mjs <foto original> <saida.png> [escala=2]
// Depois converta para JPEG (qualidade 88) e salve em sites/home/src/assets/fotos/banner-fundo.jpg.
// A foto original é o preenchimento de imagem do frame 55:1964 (Figma, imageRef f6bf0d5a…).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const [,, foto, saida, escalaTxt = '2'] = process.argv;
const E = +escalaTxt; const W = 1440 * E; const H = 592 * E;
const imgH = Math.round((592 / 1.4571949243545532) * E);
const imgTop = Math.round((0.6290397644042969 / 1.4571949243545532) * 592 * E);

const foto2 = await sharp(foto).resize(W, imgH, { fit: 'fill' }).removeAlpha().raw().toBuffer();
const out = Buffer.alloc(W * H * 3);
const lum = (r, g, b) => 0.3 * r + 0.59 * g + 0.11 * b;
function clip(r, g, b) {
  const l = lum(r, g, b); const n = Math.min(r, g, b); const x = Math.max(r, g, b);
  if (n < 0) { r = l + ((r - l) * l) / (l - n); g = l + ((g - l) * l) / (l - n); b = l + ((b - l) * l) / (l - n); }
  if (x > 1) { r = l + ((r - l) * (1 - l)) / (x - l); g = l + ((g - l) * (1 - l)) / (x - l); b = l + ((b - l) * (1 - l)) / (x - l); }
  return [r, g, b];
}
const setLum = (r, g, b, l) => { const d = l - lum(r, g, b); return clip(r + d, g + d, b + d); };
const C = [0x11 / 255, 0x58 / 255, 0xd4 / 255];
const G1 = [0xe8 / 255, 0xf1 / 255, 0xfc / 255];
const G2 = [0, 0x55 / 255, 0xea / 255];
const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);

for (let y = 0; y < H; y++) {
  const fy = y / H;
  // camada 3 e 4 (alfas)
  const a3 = fy <= 0.504807710647583 ? 1 : fy >= 0.879807710647583 ? 0 : 1 - (fy - 0.504807710647583) / (0.879807710647583 - 0.504807710647583);
  const a4 = 0.04 * (fy >= 0.26923078298568726 ? 0 : 1 - fy / 0.26923078298568726);
  for (let x = 0; x < W; x++) {
    let px = [1, 1, 1];
    const iy = y - imgTop;
    if (iy >= 0 && iy < imgH) {
      const o = (iy * W + x) * 3;
      px = mix(px, [foto2[o] / 255, foto2[o + 1] / 255, foto2[o + 2] / 255], 0.8);
      // blend COLOR: matiz/sat da cor C com a luminosidade do fundo, a 61%
      const colorido = setLum(C[0], C[1], C[2], lum(px[0], px[1], px[2]));
      px = mix(px, colorido, 0.61);
    } else {
      const colorido = setLum(C[0], C[1], C[2], lum(1, 1, 1));
      px = mix(px, colorido, 0.61);
    }
    px = mix(px, G1, a3);
    px = mix(px, G2, a4);
    const o = (y * W + x) * 3;
    out[o] = Math.round(px[0] * 255); out[o + 1] = Math.round(px[1] * 255); out[o + 2] = Math.round(px[2] * 255);
  }
}
await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(saida);
console.log('ok', W + 'x' + H, 'foto em y', imgTop / E, 'altura', imgH / E);
