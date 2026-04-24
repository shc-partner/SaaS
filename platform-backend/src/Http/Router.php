<?php
declare(strict_types=1);

namespace SiteForge\Http;

// 작은 정적 라우터. {param} 자리표시자만 지원 — 정규식이나 그룹은 의도적으로 없음.
final class Router
{
    /** @var array<int,array{method:string,pattern:string,regex:string,paramNames:array<int,string>,handler:callable|array{0:class-string,1:string}}> */
    private array $routes = [];

    /** @param callable|array{0:class-string,1:string} $handler */
    public function get(string $pattern, callable|array $handler): void
    {
        $this->add('GET', $pattern, $handler);
    }

    /** @param callable|array{0:class-string,1:string} $handler */
    public function post(string $pattern, callable|array $handler): void
    {
        $this->add('POST', $pattern, $handler);
    }

    /** @param callable|array{0:class-string,1:string} $handler */
    public function patch(string $pattern, callable|array $handler): void
    {
        $this->add('PATCH', $pattern, $handler);
    }

    /** @param callable|array{0:class-string,1:string} $handler */
    private function add(string $method, string $pattern, callable|array $handler): void
    {
        $paramNames = [];
        $regex = preg_replace_callback(
            '#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#',
            static function (array $m) use (&$paramNames): string {
                $paramNames[] = $m[1];
                return '([^/]+)';
            },
            $pattern,
        );
        $this->routes[] = [
            'method'     => $method,
            'pattern'    => $pattern,
            'regex'      => '#^' . $regex . '$#',
            'paramNames' => $paramNames,
            'handler'    => $handler,
        ];
    }

    public function dispatch(Request $req): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $req->method) {
                continue;
            }
            if (!preg_match($route['regex'], $req->path, $matches)) {
                continue;
            }
            $params = [];
            foreach ($route['paramNames'] as $i => $name) {
                $params[$name] = $matches[$i + 1];
            }
            $request = $req->withParams($params);
            $response = $this->invoke($route['handler'], $request);
            $response->send();
            return;
        }

        Response::error(404, 'not_found', 'No route matches ' . $req->method . ' ' . $req->path)->send();
    }

    /** @param callable|array{0:class-string,1:string} $handler */
    private function invoke(callable|array $handler, Request $req): Response
    {
        if (is_array($handler)) {
            [$class, $method] = $handler;
            $instance = new $class();
            /** @var Response $resp */
            $resp = $instance->$method($req);
            return $resp;
        }
        /** @var Response $resp */
        $resp = $handler($req);
        return $resp;
    }
}
