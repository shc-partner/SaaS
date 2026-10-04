<?php
declare(strict_types=1);

namespace CreatorDesk\Http;

final class Request
{
    /**
     * @param array<string,string> $params
     * @param array<string,string> $query
     * @param array<string,string> $headers
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

        $body = null;
        $raw = file_get_contents('php://input');
        if ($raw !== false && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $body = $decoded;
            }
        }

        $query = [];
        $qs = parse_url($uri, PHP_URL_QUERY);
        if (is_string($qs) && $qs !== '') {
            parse_str($qs, $parsed);
            foreach ($parsed as $k => $v) {
                if (is_scalar($v)) {
                    $query[(string)$k] = (string)$v;
                }
            }
        }

        $headers = [];
        foreach ($_SERVER as $k => $v) {
            if (strncmp($k, 'HTTP_', 5) === 0) {
                $name = strtolower(str_replace('_', '-', substr($k, 5)));
                $headers[$name] = (string)$v;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = (string)$_SERVER['CONTENT_TYPE'];
        }
        if (isset($_SERVER['CONTENT_LENGTH'])) {
            $headers['content-length'] = (string)$_SERVER['CONTENT_LENGTH'];
        }

        return new self($method, $path, [], $body, $query, $headers);
    }

    public function header(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->header('authorization');
        if ($auth === null) {
            return null;
        }
        if (stripos($auth, 'Bearer ') !== 0) {
            return null;
        }
        $token = trim(substr($auth, 7));
        return $token === '' ? null : $token;
    }

    public function userAgent(): ?string
    {
        return $this->header('user-agent');
    }

    public function queryParam(string $name, ?string $default = null): ?string
    {
        return $this->query[$name] ?? $default;
    }

    /** @return array<string,mixed> */
    public function json(): array
    {
        return is_array($this->body) ? $this->body : array();
    }

    /** @param array<string,string> $params */
    public function withParams(array $params): self
    {
        return new self($this->method, $this->path, $params, $this->body, $this->query, $this->headers);
    }
}
