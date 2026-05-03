<?php
declare(strict_types=1);

namespace CreatorDesk\Auth;

use InvalidArgumentException;
use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;
use CreatorDesk\OAuth\Service as OAuthService;

// Auth ?�드?�인??컨트롤러. ?��? HTTP ??Service 변?�만.
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

    // ---------- OAuth (SNS 로그?? ----------

    /**
     * 1) ?�론?��? ???�드?�인?�로 진입 ??302 �?provider ?�의 ?�면?�로 리다?�렉??
     *    provider 미설????백엔???�체 콜백?�로 바로 ?�돌??mock 로그???�결.
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
     * 2) provider ???�기�??�아?? code/state 검�????�용??find-or-create ???�션 발급 ??
     *    ?�론??/auth/callback ?�로 리다?�렉?�하�??�큰??URL fragment �??�달.
     *    fragment ???�버 로그???��? ?�음.
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
        // ?�록???�에 ?�을 ???�으??X-Forwarded-For ?�선.
        $fwd = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null;
        if (\is_string($fwd) && $fwd !== '') {
            return trim(explode(',', $fwd)[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? null;
    }
}
