<?php
declare(strict_types=1);

namespace SiteForge\Auth;

use InvalidArgumentException;
use SiteForge\Http\Request;
use SiteForge\Http\Response;
use SiteForge\OAuth\Service as OAuthService;

// Auth 엔드포인트 컨트롤러. 얇은 HTTP ↔ Service 변환만.
final class Controller
{
    public function __construct(
        private Service $service = new Service(),
        private OAuthService $oauth = new OAuthService(),
    ) {}

    public function register(Request $req): Response
    {
        $body = \is_array($req->body) ? $req->body : [];
        try {
            $result = $this->service->register(
                [
                    'email'    => (string)($body['email']    ?? ''),
                    'password' => (string)($body['password'] ?? ''),
                    'name'     => (string)($body['name']     ?? ''),
                ],
                $req->header('user-agent'),
                $this->clientIp(),
            );
            return Response::ok($result, 201);
        } catch (InvalidArgumentException $e) {
            return Response::error(400, 'validation_failed', $e->getMessage());
        }
    }

    public function login(Request $req): Response
    {
        $body = \is_array($req->body) ? $req->body : [];
        try {
            $result = $this->service->login(
                [
                    'email'    => (string)($body['email']    ?? ''),
                    'password' => (string)($body['password'] ?? ''),
                ],
                $req->header('user-agent'),
                $this->clientIp(),
            );
            return Response::ok($result);
        } catch (InvalidArgumentException $e) {
            return Response::error(401, 'invalid_credentials', $e->getMessage());
        }
    }

    public function logout(Request $req): Response
    {
        $token = $req->bearerToken();
        if ($token !== null) {
            $this->service->logout($token);
        }
        return Response::ok(['ok' => true]);
    }

    public function me(Request $req): Response
    {
        $token = $req->bearerToken();
        if ($token === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }
        $user = $this->service->me($token);
        if ($user === null) {
            return Response::error(401, 'invalid_session', '세션이 만료되었거나 유효하지 않습니다.');
        }
        return Response::ok(['user' => $user]);
    }

    // ---------- OAuth (SNS 로그인) ----------

    /**
     * 1) 프론트가 이 엔드포인트로 진입 → 302 로 provider 동의 화면으로 리다이렉트.
     *    provider 미설정 시 백엔드 자체 콜백으로 바로 되돌아 mock 로그인 완결.
     */
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

    /**
     * 2) provider → 여기로 돌아옴. code/state 검증 → 사용자 find-or-create → 세션 발급 →
     *    프론트 /auth/callback 으로 리다이렉트하며 토큰을 URL fragment 로 전달.
     *    fragment 는 서버 로그에 남지 않음.
     */
    public function oauthCallback(Request $req): Response
    {
        $provider = (string)($req->params['provider'] ?? '');
        $code     = $req->queryParam('code')  ?? '';
        $state    = $req->queryParam('state') ?? '';
        $error    = $req->queryParam('error');

        $front = (getenv('OAUTH_FRONTEND_CALLBACK_URL') ?: 'http://localhost:8080/auth/callback');

        if ($error !== null && $error !== '') {
            return Response::redirect($front . '#error=' . rawurlencode($error));
        }
        if ($code === '' || $state === '') {
            return Response::redirect($front . '#error=missing_params');
        }

        try {
            $session = $this->oauth->handleCallback(
                $provider,
                $code,
                $state,
                $req->header('user-agent'),
                $this->clientIp(),
            );
        } catch (\Throwable $e) {
            return Response::redirect($front . '#error=' . rawurlencode($e->getMessage()));
        }

        $frag = http_build_query([
            'token'     => $session['token'],
            'expiresAt' => $session['expiresAt'],
            'provider'  => $provider,
            'uid'       => (string)$session['user']['id'],
            'name'      => (string)$session['user']['name'],
            'email'     => (string)$session['user']['email'],
        ]);
        return Response::redirect($front . '#' . $frag);
    }

    private function clientIp(): ?string
    {
        // 프록시 뒤에 있을 수 있으니 X-Forwarded-For 우선.
        $fwd = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null;
        if (\is_string($fwd) && $fwd !== '') {
            return trim(explode(',', $fwd)[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? null;
    }
}
