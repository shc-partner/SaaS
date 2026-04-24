<?php
declare(strict_types=1);

namespace SiteForge\Http;

// 모든 응답은 { ok: bool, data?, error? } 형태. 컨트롤러는 이 헬퍼만 쓴다.
final class Response
{
    /** @param array<string,mixed> $payload */
    private function __construct(
        public readonly int $status,
        public readonly array $payload,
    ) {}

    public static function ok(mixed $data = null, int $status = 200): self
    {
        return new self($status, ['ok' => true, 'data' => $data]);
    }

    /** @param array<string,mixed>|null $details */
    public static function error(int $status, string $code, string $message, ?array $details = null): self
    {
        $error = ['code' => $code, 'message' => $message];
        if ($details !== null) {
            $error['details'] = $details;
        }
        return new self($status, ['ok' => false, 'error' => $error]);
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($this->payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
