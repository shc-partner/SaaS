<?php
declare(strict_types=1);

namespace CreatorDesk\Auth;

use InvalidArgumentException;
use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;
use CreatorDesk\OAuth\Service as OAuthService;

// Auth 도메인의 HTTP 컨트롤러. 비즈니스 규칙은 Service에 위임.
final class Controller
{
    public function __construct(
        private Service $service = new Service(),
        private OAuthService $oauth = new OAuthService(),
    ) {}

    public function register(Request $req): Response
    {
        try {
            $result = $this->service->register($req->json(), $req->userAgent(), $this->clientIp());
            setcookie('cd_session', $result['token'], [
                'expires'  => strtotime($result['expiresAt']),
                'path'     => '/',
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            return Response::ok([
                'user' => $result['user'],
                'token' => $result['token'],
                'expiresAt' => $result['expiresAt'],
            ], 201);
        } catch (InvalidArgumentException $e) {
            return Response::error(400, 'validation_failed', $e->getMessage());
        }
    }

    public function login(Request $req): Response
    {
        try {
            $result = $this->service->login($req->json(), $req->userAgent(), $this->clientIp());
            setcookie('cd_session', $result['token'], [
                'expires'  => strtotime($result['expiresAt']),
                'path'     => '/',
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            return Response::ok([
                'user' => $result['user'],
                'token' => $result['token'],
                'expiresAt' => $result['expiresAt'],
            ]);
        } catch (InvalidArgumentException $e) {
            return Response::error(401, 'invalid_credentials', $e->getMessage());
        }
    }

    public function logout(Request $req): Response
    {
        $token = $this->sessionToken($req);
        if (\is_string($token) && $token !== '') {
            $this->service->logout($token);
        }
        setcookie('cd_session', '', [
            'expires'  => time() - 3600,
            'path'     => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        return Response::ok(['loggedOut' => true]);
    }

    public function me(Request $req): Response
    {
        $token = $this->sessionToken($req);
        if (!\is_string($token) || $token === '') {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }
        $user = $this->service->me($token);
        if ($user === null) {
            return Response::error(401, 'invalid_session', '세션이 만료되었거나 유효하지 않습니다.');
        }
        return Response::ok(['user' => $user]);
    }

    public function oauthStart(Request $req): Response
    {
        $provider = (string)($req->params['provider'] ?? '');
        try {
            $result = $this->oauth->start($provider);
            return Response::redirect($result['redirectUrl']);
        } catch (InvalidArgumentException $e) {
            return Response::error(400, 'unsupported_provider', $e->getMessage());
        }
    }

    public function oauthCallback(Request $req): Response
    {
        $provider = (string)($req->params['provider'] ?? '');
        $q = $req->query;
        $code  = (string)($q['code'] ?? '');
        $state = (string)($q['state'] ?? '');

        try {
            $result = $this->oauth->handleCallback($provider, $code, $state, $req->userAgent(), $this->clientIp());
            setcookie('cd_session', $result['token'], [
                'expires'  => strtotime($result['expiresAt']),
                'path'     => '/',
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            $front = getenv('FRONTEND_URL') ?: 'http://localhost:8080';
            $fragment = http_build_query(array(
                'token' => $result['token'],
                'expiresAt' => $result['expiresAt'],
                'provider' => $provider,
                'uid' => (string)$result['user']['id'],
                'name' => (string)$result['user']['name'],
                'email' => (string)$result['user']['email'],
            ));
            $url = $front . '/auth/callback#' . $fragment;
            return Response::redirect($url);
        } catch (\Throwable $e) {
            $front = getenv('FRONTEND_URL') ?: 'http://localhost:8080';
            $url = $front . '/auth/callback#ok=0&error=' . rawurlencode($e->getMessage());
            return Response::redirect($url);
        }
    }

    private function clientIp(): ?string
    {
        $fwd = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null;
        if (\is_string($fwd) && $fwd !== '') {
            return trim(explode(',', $fwd)[0]);
        }
        $remote = $_SERVER['REMOTE_ADDR'] ?? null;
        return \is_string($remote) ? $remote : null;
    }

    private function sessionToken(Request $req): ?string
    {
        $token = $req->bearerToken();
        if ($token !== null && $token !== '') {
            return $token;
        }
        $cookie = $_COOKIE['cd_session'] ?? null;
        return \is_string($cookie) && $cookie !== '' ? $cookie : null;
    }
}
