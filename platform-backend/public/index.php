<?php
declare(strict_types=1);

// 플랫폼 API의 단일 진입점(Front Controller).
// 모든 HTTP 요청은 .htaccess 의 RewriteRule 에 의해 이 파일로 들어온다.

// PSR-4 형태의 최소 오토로더.
// App\Foo\Bar 클래스를 src/Foo/Bar.php 로 매핑한다. composer 없이 동작.
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';
    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return; // 우리 네임스페이스가 아니면 무시
    }
    $relative = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

use App\Routing\Router;
use App\Support\Response;
use App\Controllers\HealthController;

// 라우트 등록 — Phase 1 은 헬스체크 한 개만.
$router = new Router();
$router->get('/api/health', [HealthController::class, 'index']);

// 요청 메서드/경로 추출. 쿼리스트링은 파싱 단계에서 제거.
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// 어떤 예외가 터져도 표준 에러 엔벨롭으로 응답한다.
try {
    $router->dispatch($method, $path);
} catch (Throwable $e) {
    Response::error('SERVER_ERROR', 'Unexpected server error', 500);
}
