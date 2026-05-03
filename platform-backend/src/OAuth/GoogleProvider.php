<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use RuntimeException;

// Google OAuth 2.0 ??OpenID Connect ë² ì´?? userinfo ?”ë“œ?¬ì¸?¸ëŠ” sub/email/name ë°˜í™˜.
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
            throw new RuntimeException('Google ? í° ?‘ë‹µ??access_token ???†ìŠµ?ˆë‹¤.');
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
            throw new RuntimeException('Google ?„ë¡œ?„ì— sub ê°€ ?†ìŠµ?ˆë‹¤.');
        }
        return new NormalizedProfile(
            providerUserId: $sub,
            email: isset($p['email']) ? (string)$p['email'] : null,
            name:  isset($p['name'])  ? (string)$p['name']  : null,
            raw: $p,
        );
    }
}
