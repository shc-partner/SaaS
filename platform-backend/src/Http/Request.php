<?php
declare(strict_types=1);

namespace CreatorDesk\Http;

// ?¤ì–´??HTTP ?”ì²­??ì¢ì? ?œë©´ë§??¸ì¶œ ??superglobal ì§ì ‘ ?‘ê·¼??ì»¨íŠ¸ë¡¤ëŸ¬?ì„œ ë§‰ê¸° ?„í•´.
final class Request
{
    /**
     * @param array<string,string> $params
     * @param array<string,string> $query   URL ì¿¼ë¦¬ ?Œë¼ë¯¸í„° (?key=value)
     * @param array<string,string> $headers ?Œë¬¸???¤ë¡œ ?•ê·œ?”ëœ ?¤ë” ë§?
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

        // JSON body ë§?ì§€?? form-encoded ê°€ ?„ìš”???”ë“œ?¬ì¸?¸ëŠ” ?„ì¬ ?†ë‹¤.
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

        // Headers ??$_SERVER ??HTTP_* ?„ë¦¬?½ìŠ¤ë¥??•ê·œ??
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
