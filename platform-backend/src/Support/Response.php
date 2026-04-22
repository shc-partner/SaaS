<?php
declare(strict_types=1);

namespace App\Support;

// 모든 플랫폼 API 응답을 단일 엔벨롭으로 통일한다.
//   성공: { ok: true,  data: ... }
//   실패: { ok: false, error: { code, message, details? } }
// 컨트롤러는 이 클래스 외 다른 출력 경로를 쓰지 않는다.
final class Response
{
    // 성공 응답을 JSON 으로 출력한다.
    public static function json(mixed $data, int $status = 200): void
    {
        self::headers($status);
        echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    // 실패 응답. code 는 도메인별 prefix 규칙을 따른다(AUTH_*, PROJ_*, GEN_* 등).
    public static function error(string $code, string $message, int $status = 400, ?array $details = null): void
    {
        self::headers($status);
        $error = ['code' => $code, 'message' => $message];
        if ($details !== null) {
            // details 는 검증 실패 항목 목록 등 부가 정보.
            $error['details'] = $details;
        }
        echo json_encode(['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    // 공통 응답 헤더. 캐시 금지 + JSON UTF-8 고정.
    private static function headers(int $status): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
    }
}
