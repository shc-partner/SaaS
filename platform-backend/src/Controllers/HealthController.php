<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Support\Response;

// 헬스체크 컨트롤러.
// 프런트엔드의 HealthBadge 컴포넌트가 주기적으로 호출해 API 가동 여부를 표시한다.
// 외부 의존(DB 등)은 일부러 검사하지 않는다 — Phase 1 은 "프로세스가 살아있는가" 만 확인.
final class HealthController
{
    public function index(): void
    {
        Response::json([
            'status' => 'ok',
            'service' => 'platform-backend',
            'time' => gmdate('c'), // ISO 8601 UTC
        ]);
    }
}
