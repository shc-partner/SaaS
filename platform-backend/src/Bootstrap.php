<?php
declare(strict_types=1);

namespace SiteForge;

use SiteForge\Http\Router;
use SiteForge\Http\Request;
use SiteForge\Http\Response;
use SiteForge\Auth\Controller as AuthController;
use SiteForge\Sites\Controller as SitesController;
use SiteForge\PublicSite\Controller as PublicSiteController;
use Throwable;

// 진입점이 위임하는 단일 부트스트랩.
// PSR-4 오토로더 + 라우트 등록 + 글로벌 예외 변환을 모두 여기서 한다.
final class Bootstrap
{
    public static function run(): void
    {
        self::registerAutoloader();
        self::handleCors();

        $router = self::buildRouter();
        $request = Request::fromGlobals();

        try {
            $router->dispatch($request);
        } catch (Throwable $e) {
            // 어떤 예외도 서버 500 + JSON envelope 로 통일.
            Response::error(500, 'internal_error', $e->getMessage())->send();
        }
    }

    private static function registerAutoloader(): void
    {
        // 외부 의존성 없이 PSR-4 만 처리. (composer install 없이도 동작)
        $base = __DIR__; // src/
        spl_autoload_register(static function (string $class) use ($base): void {
            $prefix = 'SiteForge\\';
            if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
                return;
            }
            $relative = substr($class, strlen($prefix));
            $path = $base . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $relative) . '.php';
            if (is_file($path)) {
                require $path;
            }
        });
    }

    private static function handleCors(): void
    {
        // 개발 단계 — 프론트(Vite, 5173) 가 다른 origin 에서 호출하므로 허용.
        // 운영에선 ALLOWED_ORIGIN 환경변수로 제한할 것.
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    private static function buildRouter(): Router
    {
        $r = new Router();

        // 헬스체크 — 인프라 검증용.
        $r->get('/api/health', static function (): Response {
            return Response::ok(['status' => 'ok']);
        });

        // 인증 — 이메일/비밀번호 기반. 성공 시 서버 세션 발급, Bearer 토큰으로 반환.
        $r->post('/api/auth/register', [AuthController::class, 'register']);
        $r->post('/api/auth/login',    [AuthController::class, 'login']);
        $r->post('/api/auth/logout',   [AuthController::class, 'logout']);
        $r->get ('/api/auth/me',       [AuthController::class, 'me']);

        // SNS 로그인 (OAuth 2.0 Authorization Code).
        //   start    : GET  → 302 로 provider 동의 페이지로
        //   callback : GET  → provider 에서 돌아와 세션 발급 후 프론트로 302
        $r->get('/api/auth/oauth/{provider}/start',    [AuthController::class, 'oauthStart']);
        $r->get('/api/auth/oauth/{provider}/callback', [AuthController::class, 'oauthCallback']);

        // 어드민/빌더용 — 사이트 생성 + 단건 조회.
        // /api/me/sites: 현재 로그인한 사용자가 만든 사이트 목록 (대시보드/내 사이트 화면이 사용).
        $r->post('/api/sites', [SitesController::class, 'create']);
        $r->get ('/api/me/sites', [SitesController::class, 'listMine']);
        $r->get ('/api/sites/{id}', [SitesController::class, 'show']);

        // 공개 (public-web 런타임이 호출) — 슬러그로 site payload.
        $r->get('/api/public/sites/{slug}', [PublicSiteController::class, 'show']);

        return $r;
    }
}
