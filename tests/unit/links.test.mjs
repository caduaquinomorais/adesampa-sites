// Testes unitários (node:test, sem dependências): validação de links e mapa de sites.
//   node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { urlPermitida, atributosLink } from '../../packages/ui/src/lib/links.ts';
import {
  SITES, AMBIENTES, ambienteAtual, urlDoSite, resolverDestino, pagina, todosOsDestinos, CABECALHO, RODAPE,
} from '../../packages/ui/src/data/institucional.ts';

test('aceita os esquemas permitidos', () => {
  for (const url of [
    'https://app.adesampa.com.br/welcome', 'http://exemplo.com.br', 'https://oranilom.com.br/homolog/sobre/',
    'mailto:comunicacao@adesampa.com.br', 'mailto:a@b.com.br?subject=Oi', 'tel:+551130000000', 'tel:(11)3000-0000',
    '#conteudo', '#manual-de-marca', '/homolog/sobre/', '/',
  ]) assert.equal(urlPermitida(url), true, url);
});

test('recusa esquemas perigosos e formatos inválidos', () => {
  for (const url of [
    '', '   ', 'javascript:alert(1)', ' JAVASCRIPT:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<script>x</script>',
    'vbscript:msgbox', 'file:///etc/passwd', '//evil.example', '/\\evil.example', 'https://user:senha@exemplo.com',
    'https://', 'ftp://exemplo.com', 'mailto:nao-e-email', 'tel:abc', '#1abc', '#', 'java\tscript:alert(1)',
    'https://exemplo.com/a b', 'sobre/', 'x'.repeat(3000),
  ]) assert.equal(urlPermitida(url), false, JSON.stringify(url).slice(0, 60));
});

test('atributosLink: vazio ou inválido vira pendente, sem href', () => {
  assert.deepEqual(atributosLink(''), { 'data-link-pendente': 'true' });
  assert.deepEqual(atributosLink('javascript:alert(1)'), { 'data-link-pendente': 'true' });
  assert.deepEqual(atributosLink('https://x.com.br'), { href: 'https://x.com.br', rel: 'noopener noreferrer' });
  assert.deepEqual(atributosLink('#topo'), { href: '#topo' });
  assert.deepEqual(atributosLink('mailto:a@b.com'), { href: 'mailto:a@b.com' });
});

test('ambienteAtual: padrão "teste", aceita "producao" e recusa valores desconhecidos', () => {
  assert.equal(ambienteAtual(undefined), 'teste');
  assert.equal(ambienteAtual(''), 'teste');
  assert.equal(ambienteAtual('producao'), 'producao');
  assert.throws(() => ambienteAtual('prod'), /ADESAMPA_AMBIENTE inválido/);
});

test('mapa SITES: endereços https terminados em "/" e pastas FTP relativas, sem "..", em todos os ambientes', () => {
  for (const [nome, site] of Object.entries(SITES)) {
    for (const amb of AMBIENTES) {
      const u = new URL(site.url[amb]);
      assert.equal(u.protocol, 'https:', `${nome}/${amb}`);
      assert.ok(u.pathname.endsWith('/'), `${nome}/${amb} deve terminar em /`);
      assert.equal(u.search + u.hash, '', `${nome}/${amb} sem ?/#`);
      const pasta = site.pastaFtp[amb];
      assert.match(pasta, /^[a-z0-9][a-z0-9/_-]*[a-z0-9]$/, `${nome}/${amb}: pasta FTP "${pasta}"`);
      assert.ok(!pasta.split('/').includes('..'), `${nome}/${amb}: pasta FTP com ..`);
    }
  }
});

test('nenhum site publicado tem a mesma pasta FTP de outro no mesmo ambiente', () => {
  for (const amb of AMBIENTES) {
    const pastas = Object.values(SITES).map((s) => s.pastaFtp[amb]);
    assert.equal(new Set(pastas).size, pastas.length, `pastas repetidas em ${amb}`);
  }
});

test('urlDoSite e resolverDestino montam o endereço do ambiente', () => {
  assert.equal(urlDoSite('home', 'teste', 'sobre/'), new URL('sobre/', SITES.home.url.teste).href);
  assert.equal(urlDoSite('home', 'teste', '/sobre/'), new URL('sobre/', SITES.home.url.teste).href);
  assert.equal(resolverDestino(pagina('home', 'comunicacao/'), 'producao'), new URL('comunicacao/', SITES.home.url.producao).href);
  assert.equal(resolverDestino('', 'teste'), '');
});

test('todos os links do cabeçalho e do rodapé são vazios (pendentes) ou permitidos, em todos os ambientes', () => {
  for (const amb of AMBIENTES) {
    for (const d of todosOsDestinos()) {
      const url = resolverDestino(d, amb);
      assert.ok(url === '' || urlPermitida(url), `${amb}: ${JSON.stringify(d)} → ${url}`);
    }
  }
});

test('os dados do cabeçalho e do rodapé estão congelados (nenhum site altera)', () => {
  assert.ok(Object.isFrozen(CABECALHO) && Object.isFrozen(CABECALHO.menu) && Object.isFrozen(CABECALHO.menu[0]));
  assert.ok(Object.isFrozen(RODAPE) && Object.isFrozen(RODAPE.colunas[0].links[0]));
  assert.throws(() => { 'use strict'; CABECALHO.menu[0].rotulo = 'x'; }, TypeError);
});
