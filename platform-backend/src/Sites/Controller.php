<?php
declare(strict_types=1);

namespace SiteForge\Sites;

use InvalidArgumentException;
use SiteForge\Http\Request;
use SiteForge\Http\Response;

// 어드민/빌더 채널 — 사이트 생성과 단건 조회.
final class Controller
{
    public function __construct(
        private Service $service = new Service(),
    ) {}

    public function create(Request $req): Response
    {
        $body = is_array($req->body) ? $req->body : [];
        try {
            $payload = $this->service->create($body);
            return Response::ok($payload, 201);
        } catch (InvalidArgumentException $e) {
            return Response::error(400, 'validation_failed', $e->getMessage());
        }
    }

    public function show(Request $req): Response
    {
        $id = (int)($req->params['id'] ?? 0);
        if ($id <= 0) {
            return Response::error(400, 'invalid_id', 'site id 가 유효하지 않습니다.');
        }
        $payload = $this->service->find($id);
        if ($payload === null) {
            return Response::error(404, 'not_found', '사이트를 찾을 수 없습니다.');
        }
        return Response::ok($payload);
    }
}
