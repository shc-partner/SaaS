<?php
declare(strict_types=1);

namespace SiteForge\Sites;

use InvalidArgumentException;
use SiteForge\Auth\TokenGuard;
use SiteForge\Http\Request;
use SiteForge\Http\Response;

// 어드민/빌더 채널 — 사이트 생성, 단건 조회, 내 사이트 목록.
// 모든 엔드포인트는 Bearer 토큰으로 본인 자원만 접근하도록 한다.
final class Controller
{
    public function __construct(
        private Service $service = new Service(),
        private TokenGuard $guard = new TokenGuard(),
    ) {}

    public function create(Request $req): Response
    {
        $userId = $this->guard->userId($req);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }
        $body = \is_array($req->body) ? $req->body : [];
        try {
            $payload = $this->service->create($body, $userId);
            return Response::ok($payload, 201);
        } catch (InvalidArgumentException $e) {
            return Response::error(400, 'validation_failed', $e->getMessage());
        }
    }

    public function show(Request $req): Response
    {
        $userId = $this->guard->userId($req);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }
        $id = (int)($req->params['id'] ?? 0);
        if ($id <= 0) {
            return Response::error(400, 'invalid_id', 'site id 가 유효하지 않습니다.');
        }
        $owner = $this->service->ownerOf($id);
        if ($owner === null) {
            return Response::error(404, 'not_found', '사이트를 찾을 수 없습니다.');
        }
        if ($owner !== $userId) {
            // 소유자가 아닌 경우 — 정보 누출을 막기 위해 not_found 로 응답.
            return Response::error(404, 'not_found', '사이트를 찾을 수 없습니다.');
        }
        $payload = $this->service->find($id);
        if ($payload === null) {
            return Response::error(404, 'not_found', '사이트를 찾을 수 없습니다.');
        }
        return Response::ok($payload);
    }

    public function listMine(Request $req): Response
    {
        $userId = $this->guard->userId($req);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }
        return Response::ok($this->service->listMine($userId));
    }
}
