<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use InvalidArgumentException;
use RuntimeException;
use CreatorDesk\Auth\Repository as AuthRepository;
use CreatorDesk\Auth\Service as AuthService;

// SNS 로그???��??�트?�이??
// - start(provider): state 발급 + authorize URL 반환
// - handleCallback(provider, code, state): state 검�???provider ?�큰/?�로????
//   user_identities 매칭/?�성 ???�규�?users ?�성 ??AuthService 경유�??�션 발급
//
// ?�격증명(client_id) ??비어 ?�으�?"mock mode" ???��? ?�출 ?�이 고정 ?�로?�로 진행.
// 개발 ?�경?�서 UI/DB ?�로?��? ?�까지 검�?가?�하�??�기 ?�함?�며, ?�영?�선 비활?�화?�야 ?�다.
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

        // mock mode ??client_id ?�음 ??백엔???�체 콜백?�로 바로 보내 fake 로그?�을 ?�결?�다.
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
            throw new InvalidArgumentException('OAuth state 가 ?�효?��? ?�거??만료?�었?�니??');
        }

        // ---- profile ?�집 ----
        if ($provider->isConfigured()) {
            $tok     = $provider->exchangeCode($code, $state);
            $profile = $provider->fetchProfile($tok['accessToken']);
        } else {
            // mock profile ???�버 ?�시?�해???�일 ?�로 ?�별?�도�?provider �?고정�?
            $profile = new NormalizedProfile(
                providerUserId: "mock-{$providerId}-1",
                email: "mock+{$providerId}@CreatorDesk.app",
                name:  "Mock " . ucfirst($providerId) . " User",
                raw:   ['mock' => true],
            );
        }

        // ---- ?�별??매칭 ?�는 ?�성 ----
        $identity = $this->authRepo->findIdentity($providerId, $profile->providerUserId);
        $profileJson = json_encode($profile->raw, JSON_UNESCAPED_UNICODE) ?: '{}';

        if ($identity !== null) {
            // ?��? ?�결??계정 ??최신 ?�로??갱신.
            $this->authRepo->updateIdentityProfile(
                (int)$identity['id'],
                $profile->email,
                $profile->name,
                $profileJson,
            );
            $userId = (int)$identity['user_id'];
        } else {
            // 같�? ?�메?�의 로컬 계정???�으�??�당 계정??SNS ?�결.
            $existing = $profile->email !== null ? $this->authRepo->findUserByEmail(strtolower($profile->email)) : null;

            if ($existing !== null) {
                $userId = (int)$existing['id'];
            } else {
                // ?�규 ?�용???�성 ???�셜 ?�용(password_hash NULL).
                $userId = $this->authRepo->insertUser([
                    'email'         => $profile->email !== null
                        ? strtolower($profile->email)
                        : "{$providerId}-{$profile->providerUserId}@social.CreatorDesk.app",
                    'password_hash' => '',   // NULL ?�용 ?�직 ?�벽�??�아 �?문자?�로 ?�텁
                    'name'          => $profile->name !== null && trim($profile->name) !== ''
                        ? $profile->name
                        : ucfirst($providerId) . ' User',
                ]);
                // password ?�음 ?�시 ??NULL �??�데?�트.
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

        // AuthService ???��? ?�션 발급 로직???�사?�하�??�해 리플?�션 ?�??
        // 별도 public 진입?�을 만들지 ?�고, ?�기??바로 insertSession + ?�용??조회.
        $days = (int)(getenv('AUTH_SESSION_DAYS') ?: 14);
        if ($days < 1) $days = 14;
        $token     = bin2hex(random_bytes(32));
        $expiresAt = (new \DateTimeImmutable('+' . $days . ' days'))->format('Y-m-d H:i:s');
        $this->authRepo->insertSession($token, $userId, $expiresAt, $userAgent, $ip);

        $u = $this->authRepo->findUserById($userId);
        if ($u === null) {
            throw new RuntimeException('?�션 발급 직후 ?�용??조회 ?�패');
        }
        // AuthService �?직접 건드리�? ?�고 ?�일 ?�태 ?�답 구성.
        unset($this->auth); // static 분석 조용??
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
            throw new InvalidArgumentException("지?�하지 ?�는 provider: {$id}");
        }
        return $this->providers[$id];
    }
}
