<?php
declare(strict_types=1);

namespace CreatorDesk\Http;

// - JSON envelope: { ok: bool, data?, error? }  (API ? 성공)
// - redirect:      OAuth
final class Response
{
    /** @param array<string,mixed>|null $payload */
    private function __construct(
        public readonly int $status,
        public readonly ?array $payload = null,
        public readonly ?string $redirectTo = null,
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

    public static function redirect(string $url, int $status = 302): self
    {
        return new self($status, null, $url);
    }

    public function send(): void
    {
        http_response_code($this->status);
        if ($this->redirectTo !== null) {
            header('Location: ' . $this->redirectTo);
            return;
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($this->payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
