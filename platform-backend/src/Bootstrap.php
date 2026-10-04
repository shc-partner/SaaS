<?php
declare(strict_types=1);

namespace CreatorDesk;

use CreatorDesk\Auth\Controller as AuthController;
use CreatorDesk\Ai\Controller as AiController;
use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;
use CreatorDesk\Http\Router;
use CreatorDesk\Workspaces\Controller as WorkspacesController;
use CreatorDesk\Youtube\Controller as YoutubeController;
use Throwable;

final class Bootstrap
{
    public static function run(): void
    {
        self::registerAutoloader();
        self::loadEnv();
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

    private static function loadEnv(): void
    {
        $paths = [
            dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
            dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env',
        ];

        foreach ($paths as $path) {
            if (!is_file($path) || !is_readable($path)) {
                continue;
            }

            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines === false) {
                continue;
            }

            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }

                [$key, $value] = array_map('trim', explode('=', $line, 2));
                $value = trim($value, "\"'");
                if ($key !== '' && getenv($key) === false) {
                    putenv("{$key}={$value}");
                    $_ENV[$key] = $value;
                }
            }
        }
    }

    private static function buildRouter(): Router
    {
        $router = new Router();

        $router->get('/api/health', static function (): Response {
            return Response::ok(['status' => 'ok']);
        });

        $router->get('/api/youtube/trends', [YoutubeController::class, 'trends']);
        $router->get('/api/youtube/trend-categories', [YoutubeController::class, 'categories']);
        $router->post('/api/youtube/trend-categories', [YoutubeController::class, 'saveCategories']);
        $router->post('/api/youtube/trend-categories/defaults', [YoutubeController::class, 'restoreDefaultCategories']);

        $router->post('/api/ai/trend-ideas', [AiController::class, 'trendIdeas']);
        $router->post('/api/ai/trend-ideas/from-videos', [AiController::class, 'trendIdeasFromVideos']);

        $router->get('/api/workspaces', [WorkspacesController::class, 'index']);
        $router->post('/api/workspaces', [WorkspacesController::class, 'create']);
        $router->post('/api/workspaces/{workspaceId}', [WorkspacesController::class, 'update']);
        $router->post('/api/workspaces/{workspaceId}/delete', [WorkspacesController::class, 'delete']);
        $router->get('/api/workspaces/{workspaceId}/members', [WorkspacesController::class, 'members']);
        $router->post('/api/workspaces/{workspaceId}/members', [WorkspacesController::class, 'addMember']);
        $router->post('/api/workspaces/{workspaceId}/members/{memberUserId}', [WorkspacesController::class, 'updateMember']);
        $router->post('/api/workspaces/{workspaceId}/members/{memberUserId}/delete', [WorkspacesController::class, 'removeMember']);
        $router->get('/api/workspaces/{workspaceId}/board', [WorkspacesController::class, 'board']);
        $router->post('/api/workspaces/{workspaceId}/board', [WorkspacesController::class, 'syncBoard']);

        $router->post('/api/auth/register', [AuthController::class, 'register']);
        $router->post('/api/auth/login', [AuthController::class, 'login']);
        $router->post('/api/auth/logout', [AuthController::class, 'logout']);
        $router->get('/api/auth/me', [AuthController::class, 'me']);
        $router->get('/api/auth/oauth/{provider}/start', [AuthController::class, 'oauthStart']);
        $router->get('/api/auth/oauth/{provider}/callback', [AuthController::class, 'oauthCallback']);

        return $router;
    }
}
