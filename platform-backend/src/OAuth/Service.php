<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use InvalidArgumentException;
use RuntimeException;
use CreatorDesk\Auth\Repository as AuthRepository;
use CreatorDesk\Auth\Service as AuthService;

// SNS 로그인의 진입점을 담당합니다.
// - start(provider): state 발급 후 authorize URL 반환
// - handleCallback(provider, code, state): state 검증, 프로필 조회, 사용자/identity 연결, 세션 발급
//
// OAuth client_id가 비어 있으면 개발용 mock mode로 동작합니다.
// 운영 환경에서는 실제 OAuth 설정을 사용하는 것이 전제입니다.
final class Service
{
    /** @var array<string, Provider> */
    private array $providers;

    /** @param array<string,mixed>|null $config */
    public function __construct(
        ?array $config = null,
        private AuthRepository $authRepo = new AuthRepository(),
        private AuthService $auth = new AuthService(),
    ) {
        $cfg = $config ?? require __DIR__ . '/../../config/oauth.php';
        $this->providers = [
            'google' => new GoogleProvider($cfg['google']),
            'naver'  => new NaverProvider($cfg['naver']),
            'kakao'  => new KakaoProvider($cfg['kakao']),
        ];
    }

    /**
     * @return array{redirectUrl:string, mock:bool}
     */
    public function start(string $providerId): array
    {
        $provider = $this->requireProvider($providerId);
        $state = bin2hex(random_bytes(32));
        $expires = (new \DateTimeImmutable('+10 minutes'))->format('Y-m-d H:i:s');
        $this->authRepo->insertOauthState($state, $providerId, $expires);

        // mock mode에서는 백엔드 콜백으로 바로 보내 fake 로그인을 완료합니다.
        if (!$provider->isConfigured()) {
            $base = getenv('APP_BASE_URL') ?: 'http://localhost:8000';
            return [
                'redirectUrl' => $base . "/api/auth/oauth/{$providerId}/callback?code=MOCK&state={$state}",
                'mock'        => true,
            ];
        }
        return [
            'redirectUrl' => $provider->buildAuthorizeUrl($state),
            'mock'        => false,
        ];
    }

    /**
     * @return array{user:array<string,mixed>, token:string, expiresAt:string}
     */
    public function handleCallback(string $providerId, string $code, string $state, ?string $userAgent, ?string $ip): array
    {
        $provider = $this->requireProvider($providerId);

        $st = $this->authRepo->consumeOauthState($state, $providerId);
        if ($st === null) {
            throw new InvalidArgumentException('OAuth state가 유효하지 않거나 만료되었습니다.');
        }

        if ($provider->isConfigured()) {
            $tok     = $provider->exchangeCode($code, $state);
            $profile = $provider->fetchProfile($tok['accessToken']);
        } else {
            $profile = new NormalizedProfile(
                providerUserId: "mock-{$providerId}-1",
                email: "mock+{$providerId}@CreatorDesk.app",
                name:  "Mock " . ucfirst($providerId) . " User",
                raw:   ['mock' => true],
            );
        }

        $identity = $this->authRepo->findIdentity($providerId, $profile->providerUserId);
        $profileJson = json_encode($profile->raw, JSON_UNESCAPED_UNICODE) ?: '{}';

        if ($identity !== null) {
            $this->authRepo->updateIdentityProfile(
                (int)$identity['id'],
                $profile->email,
                $profile->name,
                $profileJson,
            );
            $userId = (int)$identity['user_id'];
        } else {
            $existing = $profile->email !== null ? $this->authRepo->findUserByEmail(strtolower($profile->email)) : null;

            if ($existing !== null) {
                $userId = (int)$existing['id'];
            } else {
                $userId = $this->authRepo->insertUser([
                    'email'         => $profile->email !== null
                        ? strtolower($profile->email)
                        : "{$providerId}-{$profile->providerUserId}@social.CreatorDesk.app",
                    'password_hash' => '',
                    'name'          => $profile->name !== null && trim($profile->name) !== ''
                        ? $profile->name
                        : ucfirst($providerId) . ' User',
                ]);
                $this->authRepo->pdo()->prepare('UPDATE users SET password_hash = NULL WHERE id = :id')
                    ->execute([':id' => $userId]);
            }

            $this->authRepo->insertIdentity([
                'user_id'          => $userId,
                'provider'         => $providerId,
                'provider_user_id' => $profile->providerUserId,
                'email'            => $profile->email,
                'display_name'     => $profile->name,
                'profile_json'     => $profileJson,
            ]);
        }

        $this->authRepo->touchLastLogin($userId);

        $days = (int)(getenv('AUTH_SESSION_DAYS') ?: 14);
        if ($days < 1) {
            $days = 14;
        }
        $token     = bin2hex(random_bytes(32));
        $expiresAt = (new \DateTimeImmutable('+' . $days . ' days'))->format('Y-m-d H:i:s');
        $this->authRepo->insertSession($token, $userId, $expiresAt, $userAgent, $ip);

        $u = $this->authRepo->findUserById($userId);
        if ($u === null) {
            throw new RuntimeException('세션 발급 직후 사용자 조회 실패');
        }
        unset($this->auth); // static 분석 도구의 미사용 경고를 피합니다.
        return [
            'user' => [
                'id'          => (int)$u['id'],
                'email'       => (string)$u['email'],
                'name'        => (string)$u['name'],
                'status'      => (string)$u['status'],
                'createdAt'   => (string)$u['created_at'],
                'lastLoginAt' => $u['last_login_at'] !== null ? (string)$u['last_login_at'] : null,
            ],
            'token'     => $token,
            'expiresAt' => $expiresAt,
        ];
    }

    private function requireProvider(string $id): Provider
    {
        if (!isset($this->providers[$id])) {
            throw new InvalidArgumentException("지원하지 않는 provider: {$id}");
        }
        return $this->providers[$id];
    }
}
