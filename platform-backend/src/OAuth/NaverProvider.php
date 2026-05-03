<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use RuntimeException;

// ?¤ì´ë²?ë¡œê·¸????response.id ê°€ provider_user_id.
final class NaverProvider implements Provider
{
    /** @param array<string,string> $config */
    public function __construct(
        private array $config,
        private HttpClient $http = new HttpClient(),
    ) {}

    public function id(): string { return 'naver'; }
    public function isConfigured(): bool { return $this->config['clientId'] !== ''; }

    public function buildAuthorizeUrl(string $state): string
    {
        $q = http_build_query([
            'client_id'     => $this->config['clientId'],
            'redirect_uri'  => $this->config['redirectUri'],
            'response_type' => 'code',
            'state'         => $state,
        ]);
        return $this->config['authorizeUrl'] . '?' . $q;
    }

    public function exchangeCode(string $code, string $state): array
    {
        $tok = $this->http->postForm($this->config['tokenUrl'], [
            'grant_type'    => 'authorization_code',
            'client_id'     => $this->config['clientId'],
            'client_secret' => $this->config['clientSecret'],
            'code'          => $code,
            'state'         => $state,
        ]);
        if (!isset($tok['access_token'])) {
            throw new RuntimeException('Naver ? í° ?‘ë‹µ??access_token ???†ìŠµ?ˆë‹¤.');
        }
        return ['accessToken' => (string)$tok['access_token'], 'raw' => $tok];
    }

    public function fetchProfile(string $accessToken): NormalizedProfile
    {
        $p = $this->http->getJson($this->config['profileUrl'], [
            'Authorization' => 'Bearer ' . $accessToken,
        ]);
        $resp = is_array($p['response'] ?? null) ? $p['response'] : [];
        $id = (string)($resp['id'] ?? '');
        if ($id === '') {
            throw new RuntimeException('Naver ?„ë¡œ?„ì— id ê°€ ?†ìŠµ?ˆë‹¤.');
        }
        return new NormalizedProfile(
            providerUserId: $id,
            email: isset($resp['email']) ? (string)$resp['email'] : null,
            name:  (string)($resp['name'] ?? $resp['nickname'] ?? '') ?: null,
            raw: $p,
        );
    }
}
