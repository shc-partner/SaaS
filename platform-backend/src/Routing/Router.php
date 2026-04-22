<?php
declare(strict_types=1);

namespace App\Routing;

use App\Support\Response;

// 플랫폼 API 전용 최소 라우터.
// 의존성 0, 패턴 매칭 0, 정적 경로 1:1 매핑만 지원한다.
// 경로 파라미터(/projects/{id})는 후속 Phase 에서 필요해질 때 확장한다.
final class Router
{
    // ['GET' => ['/api/health' => 핸들러, ...], 'POST' => [...]]
    /** @var array<string, array<string, callable|array{0:class-string,1:string}>> */
    private array $routes = [];

    // GET 라우트 등록.
    public function get(string $path, callable|array $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    // POST 라우트 등록. (Phase 2 이후 사용)
    public function post(string $path, callable|array $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    // 들어온 요청을 등록된 핸들러로 위임한다.
    public function dispatch(string $method, string $path): void
    {
        $handler = $this->routes[$method][$path] ?? null;

        // 매칭되는 라우트가 없으면 표준 에러 엔벨롭으로 404.
        if ($handler === null) {
            Response::error('NOT_FOUND', 'Route not found', 404);
            return;
        }

        // [Controller::class, 'action'] 형태면 인스턴스 생성 후 메서드 호출.
        if (is_array($handler)) {
            [$class, $action] = $handler;
            $instance = new $class();
            $instance->{$action}();
            return;
        }

        // 클로저/함수면 그대로 호출.
        $handler();
    }
}
