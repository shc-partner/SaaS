<?php
declare(strict_types=1);

namespace SiteForge\Http;

// 들어온 HTTP 요청의 좁은 표면만 노출 — superglobal 직접 접근을 컨트롤러에서 막기 위해.
final class Request
{
    /** @param array<string,string> $params */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $params = [],
        public readonly mixed $body = null,
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

        return new self($method, $path, [], $body);
    }

    /** @param array<string,string> $params */
    public function withParams(array $params): self
    {
        return new self($this->method, $this->path, $params, $this->body);
    }
}
