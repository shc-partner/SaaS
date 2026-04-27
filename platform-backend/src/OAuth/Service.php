<?php
declare(strict_types=1);

namespace SiteForge\OAuth;

use InvalidArgumentException;
use RuntimeException;
use SiteForge\Auth\Repository as AuthRepository;
use SiteForge\Auth\Service as AuthService;

// SNS 로그인 오케스트레이션.
// - start(provider): state 발급 + authorize URL 반환
// - handleCallback(provider, code, state): state 검증 → provider 토큰/프로필 →
//   user_identities 매칭/생성 → 신규면 users 생성 → AuthService 경유로 세션 발급
//
// 자격증명(client_id) 이 비어 있으면 "mock mode" — 외부 호출 없이 고정 프로필로 진행.
// 개발 환경에서 UI/DB 플로우를 끝까지 검증 가능하게 하기 위함이며, 운영에선 비활성화해야 한다.
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

        // mock mode — client_id 없음 → 백엔드 자체 콜백으로 바로 보내 fake 로그인을 완결한다.
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
            throw new InvalidArgumentException('OAuth state 가 유효하지 않거나 만료되었습니다.');
        }

        // ---- profile 수집 ----
        if ($provider->isConfigured()) {
            $tok     = $provider->exchangeCode($code, $state);
            $profile = $provider->fetchProfile($tok['accessToken']);
        } else {
            // mock profile — 서버 재시작해도 동일 키로 식별되도록 provider 별 고정값.
            $profile = new NormalizedProfile(
                providerUserId: "mock-{$providerId}-1",
                email: "mock+{$providerId}@siteforge.app",
                name:  "Mock " . ucfirst($providerId) . " 사용자",
                raw:   ['mock' => true],
            );
        }

        // ---- 식별자 매칭 또는 생성 ----
        $identity = $this->authRepo->findIdentity($providerId, $profile->providerUserId);
        $profileJson = json_encode($profile->raw, JSON_UNESCAPED_UNICODE) ?: '{}';

        if ($identity !== null) {
            // 이미 연결된 계정 — 최신 프로필 갱신.
            $this->authRepo->updateIdentityProfile(
                (int)$identity['id'],
                $profile->email,
                $profile->name,
                $profileJson,
            );
            $userId = (int)$identity['user_id'];
        } else {
            // 같은 이메일의 로컬 계정이 있으면 해당 계정에 SNS 연결.
            $existing = $profile->email !== null ? $this->authRepo->findUserByEmail(strtolower($profile->email)) : null;

            if ($existing !== null) {
                $userId = (int)$existing['id'];
            } else {
                // 신규 사용자 생성 — 소셜 전용(password_hash NULL).
                $userId = $this->authRepo->insertUser([
                    'email'         => $profile->email !== null
                        ? strtolower($profile->email)
                        : "{$providerId}-{$profile->providerUserId}@social.siteforge.app",
                    'password_hash' => '',   // NULL 허용 아직 완벽치 않아 빈 문자열로 스텁
                    'name'          => $profile->name !== null && trim($profile->name) !== ''
                        ? $profile->name
                        : ucfirst($providerId) . ' 사용자',
                ]);
                // password 없음 표시 — NULL 로 업데이트.
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

        // AuthService 의 내부 세션 발급 로직을 재사용하기 위해 리플렉션 대신
        // 별도 public 진입점을 만들지 않고, 여기서 바로 insertSession + 사용자 조회.
        $days = (int)(getenv('AUTH_SESSION_DAYS') ?: 14);
        if ($days < 1) $days = 14;
        $token     = bin2hex(random_bytes(32));
        $expiresAt = (new \DateTimeImmutable('+' . $days . ' days'))->format('Y-m-d H:i:s');
        $this->authRepo->insertSession($token, $userId, $expiresAt, $userAgent, $ip);

        $u = $this->authRepo->findUserById($userId);
        if ($u === null) {
            throw new RuntimeException('세션 발급 직후 사용자 조회 실패');
        }
        // AuthService 를 직접 건드리지 않고 동일 형태 응답 구성.
        unset($this->auth); // static 분석 조용히
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
