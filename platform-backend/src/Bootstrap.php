<?php
declare(strict_types=1);

namespace CreatorDesk;

use CreatorDesk\Auth\Controller as AuthController;
use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;
use CreatorDesk\Http\Router;
use Throwable;

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
            Response::error(500, 'internal_error', $e->getMessage())->send();
        }
    }

    private static function registerAutoloader(): void
    {
        $base = __DIR__;
        spl_autoload_register(static function (string $class) use ($base): void {
            $prefix = 'CreatorDesk\\';
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
        $router = new Router();

        $router->get('/api/health', static function (): Response {
            return Response::ok(['status' => 'ok']);
        });

        $router->post('/api/auth/register', [AuthController::class, 'register']);
        $router->post('/api/auth/login', [AuthController::class, 'login']);
        $router->post('/api/auth/logout', [AuthController::class, 'logout']);
        $router->get('/api/auth/me', [AuthController::class, 'me']);
        $router->get('/api/auth/oauth/{provider}/start', [AuthController::class, 'oauthStart']);
        $router->get('/api/auth/oauth/{provider}/callback', [AuthController::class, 'oauthCallback']);

        return $router;
    }
}
