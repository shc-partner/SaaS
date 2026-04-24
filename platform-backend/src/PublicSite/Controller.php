<?php
declare(strict_types=1);

namespace SiteForge\PublicSite;

use SiteForge\Http\Request;
use SiteForge\Http\Response;
use SiteForge\Sites\Service;

// 공개 채널 — public-web 런타임이 호출하는 슬러그 기반 단건 조회.
// status='published' 만 노출. 어드민/내부 식별자는 가능한 한 숨긴다.
final class Controller
{
    public function __construct(
        private Service $service = new Service(),
    ) {}

    public function show(Request $req): Response
    {
        $slug = (string)($req->params['slug'] ?? '');
        if ($slug === '') {
            return Response::error(400, 'invalid_slug', 'slug 가 비어 있습니다.');
        }
        $payload = $this->service->findPublic($slug);
        if ($payload === null) {
            return Response::error(404, 'not_found', '사이트를 찾을 수 없습니다.');
        }
        return Response::ok($payload);
    }
}
