<?php
declare(strict_types=1);

namespace SiteForge\OAuth;

use RuntimeException;

// 카카오 로그인 — kakao_account.email, properties.nickname 사용.
final class KakaoProvider implements Provider
{
    /** @param array<string,string> $config */
    public function __construct(
        private array $config,
        private HttpClient $http = new HttpClient(),
    ) {}

    public function id(): string { return 'kakao'; }
    public function isConfigured(): bool { return $this->config['clientId'] !== ''; }

    public function buildAuthorizeUrl(string $state): string
    {
        $q = http_build_query(array_filter([
            'client_id'     => $this->config['clientId'],
            'redirect_uri'  => $this->config['redirectUri'],
            'response_type' => 'code',
            'state'         => $state,
            'scope'         => $this->config['scope'] ?: null,
        ]));
        return $this->config['authorizeUrl'] . '?' . $q;
    }

    public function exchangeCode(string $code, string $state): array
    {
        $params = [
            'grant_type'   => 'authorization_code',
            'client_id'    => $this->config['clientId'],
            'redirect_uri' => $this->config['redirectUri'],
            'code'         => $code,
        ];
        if ($this->config['clientSecret'] !== '') {
            $params['client_secret'] = $this->config['clientSecret'];
        }
        $tok = $this->http->postForm($this->config['tokenUrl'], $params);
        if (!isset($tok['access_token'])) {
            throw new RuntimeException('Kakao 토큰 응답에 access_token 이 없습니다.');
        }
        return ['accessToken' => (string)$tok['access_token'], 'raw' => $tok];
    }

    public function fetchProfile(string $accessToken): NormalizedProfile
    {
        $p = $this->http->getJson($this->config['profileUrl'], [
            'Authorization' => 'Bearer ' . $accessToken,
        ]);
        $id = isset($p['id']) ? (string)$p['id'] : '';
        if ($id === '') {
            throw new RuntimeException('Kakao 프로필에 id 가 없습니다.');
        }
        $account = is_array($p['kakao_account'] ?? null) ? $p['kakao_account'] : [];
        $props   = is_array($p['properties'] ?? null)    ? $p['properties']    : [];
        return new NormalizedProfile(
            providerUserId: $id,
            email: isset($account['email']) ? (string)$account['email'] : null,
            name:  (string)($props['nickname'] ?? '') ?: null,
            raw: $p,
        );
    }
}
