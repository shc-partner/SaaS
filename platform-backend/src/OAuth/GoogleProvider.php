<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use RuntimeException;

// Google OAuth 2.0과 OpenID Connect 기반 userinfo 응답을 표준 프로필로 변환.
final class GoogleProvider implements Provider
{
    /** @param array<string,string> $config */
    public function __construct(
        private array $config,
        private HttpClient $http = new HttpClient(),
    ) {}

    public function id(): string { return 'google'; }
    public function isConfigured(): bool { return $this->config['clientId'] !== ''; }

    public function buildAuthorizeUrl(string $state): string
    {
        $q = http_build_query([
            'client_id'     => $this->config['clientId'],
            'redirect_uri'  => $this->config['redirectUri'],
            'response_type' => 'code',
            'scope'         => $this->config['scope'],
            'state'         => $state,
            'access_type'   => 'online',
            'prompt'        => 'select_account',
        ]);
        return $this->config['authorizeUrl'] . '?' . $q;
    }

    public function exchangeCode(string $code, string $state): array
    {
        $tok = $this->http->postForm($this->config['tokenUrl'], [
            'client_id'     => $this->config['clientId'],
            'client_secret' => $this->config['clientSecret'],
            'code'          => $code,
            'grant_type'    => 'authorization_code',
            'redirect_uri'  => $this->config['redirectUri'],
        ]);
        if (!isset($tok['access_token'])) {
            throw new RuntimeException('Google 토큰 응답에 access_token이 없습니다.');
        }
        return ['accessToken' => (string)$tok['access_token'], 'raw' => $tok];
    }

    public function fetchProfile(string $accessToken): NormalizedProfile
    {
        $p = $this->http->getJson($this->config['profileUrl'], [
            'Authorization' => 'Bearer ' . $accessToken,
        ]);
        $sub = (string)($p['sub'] ?? '');
        if ($sub === '') {
            throw new RuntimeException('Google 프로필에 sub가 없습니다.');
        }
        return new NormalizedProfile(
            providerUserId: $sub,
            email: isset($p['email']) ? (string)$p['email'] : null,
            name:  isset($p['name'])  ? (string)$p['name']  : null,
            raw: $p,
        );
    }
}
