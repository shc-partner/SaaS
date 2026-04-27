<?php
declare(strict_types=1);

namespace SiteForge\Auth;

use SiteForge\Http\Request;

// 컨트롤러에서 "현재 로그인한 사용자" 를 얻기 위한 얇은 헬퍼.
// 별도 미들웨어 계층이 아직 없으므로 — 라우트 단위로 명시적으로 호출한다.
final class TokenGuard
{
    public function __construct(
        private Service $service = new Service(),
    ) {}

    /** 현재 요청의 Bearer 토큰으로 사용자 정보를 찾아 반환. 없거나 만료면 null. */
    public function user(Request $req): ?array
    {
        $token = $req->bearerToken();
        if ($token === null) return null;
        return $this->service->me($token);
    }

    public function userId(Request $req): ?int
    {
        $u = $this->user($req);
        return $u === null ? null : (int)$u['id'];
    }
}
