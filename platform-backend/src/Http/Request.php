<?php
declare(strict_types=1);

namespace SiteForge\Http;

// 들어온 HTTP 요청의 좁은 표면만 노출 — superglobal 직접 접근을 컨트롤러에서 막기 위해.
final class Request
{
    /**
     * @param array<string,string> $params
     * @param array<string,string> $query   URL 쿼리 파라미터 (?key=value)
     * @param array<string,string> $headers 소문자 키로 정규화된 헤더 맵
     */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $params = [],
        public readonly mixed $body = null,
        public readonly array $query = [],
        public readonly array $headers = [],
    ) {}

    public static function fromGlobals(): self
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        // JSON body 만 지원. form-encoded 가 필요한 엔드포인트는 현재 없다.
        $body = null;
        $raw = file_get_contents('php://input');
        if ($raw !== false && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $body = $decoded;
            }
        }

        // Query
        $query = [];
        $qs = parse_url($uri, PHP_URL_QUERY);
        if (is_string($qs) && $qs !== '') {
            parse_str($qs, $parsed);
            foreach ($parsed as $k => $v) {
                if (is_scalar($v)) $query[(string)$k] = (string)$v;
            }
        }

        // Headers — $_SERVER 의 HTTP_* 프리픽스를 정규화.
        $headers = [];
        foreach ($_SERVER as $k => $v) {
            if (strncmp($k, 'HTTP_', 5) === 0) {
                $name = strtolower(str_replace('_', '-', substr($k, 5)));
                $headers[$name] = (string)$v;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE']))   $headers['content-type']   = (string)$_SERVER['CONTENT_TYPE'];
        if (isset($_SERVER['CONTENT_LENGTH'])) $headers['content-length'] = (string)$_SERVER['CONTENT_LENGTH'];

        return new self($method, $path, [], $body, $query, $headers);
    }

    public function header(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->header('authorization');
        if ($auth === null) return null;
        if (stripos($auth, 'Bearer ') !== 0) return null;
        $tok = trim(substr($auth, 7));
        return $tok === '' ? null : $tok;
    }

    public function queryParam(string $name, ?string $default = null): ?string
    {
        return $this->query[$name] ?? $default;
    }

    /** @param array<string,string> $params */
    public function withParams(array $params): self
    {
        return new self($this->method, $this->path, $params, $this->body, $this->query, $this->headers);
    }
}
