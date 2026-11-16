<?php

/*
 * Funções auxiliares do cabeçalho/rodapé ADE SAMPA.
 * Sem dependências: funciona em qualquer projeto PHP 8.0+.
 * Os nomes começam com "hf_" para não conflitar com funções do site que os recebe.
 */

declare(strict_types=1);

if (!function_exists('hf_e')) {
    /** Escapa texto para HTML (conteúdo e atributos). */
    function hf_e(mixed $value): string
    {
        if ($value === null || is_array($value) || is_object($value)) {
            return '';
        }
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_HTML5 | ENT_SUBSTITUTE, 'UTF-8');
    }
}

if (!function_exists('hf_url_permitida')) {
    /**
     * Aceita somente http(s):// com host, mailto:, tel:, âncoras (#secao) e caminhos
     * internos começando com "/". Recusa javascript:, data: etc.
     */
    function hf_url_permitida(string $url): bool
    {
        $url = trim($url);
        if ($url === '' || strlen($url) > 2048 || preg_match('/[\x00-\x20\x7F]/', $url)) {
            return false;
        }
        if ($url[0] === '#') {
            return (bool) preg_match('/^#[A-Za-z][A-Za-z0-9_-]{0,63}$/', $url);
        }
        if ($url[0] === '/') {
            return !str_starts_with($url, '//');
        }
        $lower = strtolower($url);
        if (str_starts_with($lower, 'mailto:')) {
            $address = explode('?', substr($url, 7), 2)[0];
            return filter_var(rawurldecode($address), FILTER_VALIDATE_EMAIL) !== false;
        }
        if (str_starts_with($lower, 'tel:')) {
            return (bool) preg_match('/^tel:\+?[0-9().\-]{3,20}$/i', $url);
        }
        if (!preg_match('#^https?://#i', $url)) {
            return false;
        }
        $parts = parse_url($url);
        if ($parts === false || empty($parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
            return false;
        }
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
}

if (!function_exists('hf_href')) {
    /**
     * Atributos de um link. URL vazia ou inválida → sem href (o item aparece, mas não
     * navega) e recebe data-link-pendente="true".
     */
    function hf_href(string $url): string
    {
        $url = trim($url);
        if (!hf_url_permitida($url)) {
            return ' data-link-pendente="true"';
        }
        $out = ' href="' . hf_e($url) . '"';
        if (preg_match('#^https?://#i', $url)) {
            $out .= ' rel="noopener noreferrer"';
        }
        return $out;
    }
}

if (!function_exists('hf_asset')) {
    /** URL de um arquivo dentro de assets/, usando o 'assets_url' do config.php. */
    function hf_asset(array $hf, string $path): string
    {
        return rtrim((string) $hf['assets_url'], '/') . '/' . ltrim($path, '/');
    }
}
