// Leitura e escrita de PNG RGBA 8 bits (sem dependências). Adaptado de teia-teste/tests/visual/comparar.mjs.
import zlib from 'node:zlib';

export function decodePng(buf) {
  let pos = 8; let width = 0; let height = 0; let colorType = 0; let depth = 0; const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos); const typ = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (typ === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); depth = data[8]; colorType = data[9]; if (data[12] !== 0) throw new Error('PNG entrelaçado não suportado'); }
    if (typ === 'IDAT') idat.push(data);
    if (typ === 'IEND') break;
    pos += 12 + len;
  }
  if (depth !== 8 || ![2, 6].includes(colorType)) throw new Error(`PNG não suportado (profundidade ${depth}, tipo ${colorType})`);
  const bpp = colorType === 6 ? 4 : 3; const stride = width * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(width * height * 4); let prev = Buffer.alloc(stride); let o = 0;
  for (let y = 0; y < height; y++) {
    const f = raw[o++]; const line = Buffer.from(raw.subarray(o, o + stride)); o += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0; const b = prev[x]; const c = x >= bpp ? prev[x - bpp] : 0;
      if (f === 1) line[x] = (line[x] + a) & 255;
      else if (f === 2) line[x] = (line[x] + b) & 255;
      else if (f === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255;
      else if (f === 4) { const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c); line[x] = (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255; }
    }
    for (let x = 0; x < width; x++) {
      out[(y * width + x) * 4] = line[x * bpp]; out[(y * width + x) * 4 + 1] = line[x * bpp + 1];
      out[(y * width + x) * 4 + 2] = line[x * bpp + 2]; out[(y * width + x) * 4 + 3] = bpp === 4 ? line[x * bpp + 3] : 255;
    }
    prev = line;
  }
  return { width, height, data: out };
}

export function encodePng({ width, height, data }) {
  const chunk = (type, body) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(body.length);
    const tb = Buffer.concat([Buffer.from(type, 'ascii'), body]);
    const c = Buffer.alloc(4); c.writeUInt32BE(zlib.crc32(tb) >>> 0);
    return Buffer.concat([len, tb, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) { raw[y * (width * 4 + 1)] = 0; data.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}

/** Recorta uma região de uma imagem (preenche com branco o que ficar fora). */
export function recortar(img, x, y, w, h) {
  const out = Buffer.alloc(w * h * 4, 255);
  for (let yy = 0; yy < h; yy++) {
    const sy = y + yy; if (sy < 0 || sy >= img.height) continue;
    for (let xx = 0; xx < w; xx++) {
      const sx = x + xx; if (sx < 0 || sx >= img.width) continue;
      img.data.copy(out, (yy * w + xx) * 4, (sy * img.width + sx) * 4, (sy * img.width + sx) * 4 + 4);
    }
  }
  return { width: w, height: h, data: out };
}

/**
 * Compara duas imagens do mesmo tamanho (a menor é completada com branco).
 * Um pixel "difere" quando algum canal muda mais que `limiar` (absorve suavização de fonte).
 * Retorna a porcentagem de pixels diferentes e uma imagem de diferenças (vermelho = diferente).
 */
export function comparar(a, b, limiar = 24) {
  const w = Math.max(a.width, b.width); const h = Math.max(a.height, b.height);
  const A = recortar(a, 0, 0, w, h); const B = recortar(b, 0, 0, w, h);
  const diff = Buffer.alloc(w * h * 4); let diferentes = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const d = Math.max(Math.abs(A.data[o] - B.data[o]), Math.abs(A.data[o + 1] - B.data[o + 1]), Math.abs(A.data[o + 2] - B.data[o + 2]));
    if (d > limiar) { diferentes++; diff[o] = 230; diff[o + 1] = 0; diff[o + 2] = 0; diff[o + 3] = 255; }
    else { const g = 255 - Math.round((255 - (A.data[o] * 0.3 + A.data[o + 1] * 0.59 + A.data[o + 2] * 0.11)) * 0.25); diff[o] = g; diff[o + 1] = g; diff[o + 2] = g; diff[o + 3] = 255; }
  }
  return { porcentagem: (diferentes / (w * h)) * 100, diferentes, diff: { width: w, height: h, data: diff } };
}

/** Junta imagens lado a lado (com uma faixa de separação), para o relatório. */
export function ladoALado(imagens, espaco = 16) {
  const w = imagens.reduce((s, i) => s + i.width, 0) + espaco * (imagens.length - 1);
  const h = Math.max(...imagens.map((i) => i.height));
  const out = Buffer.alloc(w * h * 4, 0);
  for (let i = 0; i < w * h; i++) { out[i * 4] = 120; out[i * 4 + 1] = 120; out[i * 4 + 2] = 120; out[i * 4 + 3] = 255; }
  let x0 = 0;
  for (const img of imagens) {
    for (let y = 0; y < img.height; y++) img.data.copy(out, (y * w + x0) * 4, y * img.width * 4, (y + 1) * img.width * 4);
    x0 += img.width + espaco;
  }
  return { width: w, height: h, data: out };
}
