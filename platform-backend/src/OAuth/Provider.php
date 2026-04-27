<?php
declare(strict_types=1);

namespace SiteForge\OAuth;

// OAuth provider 공통 인터페이스.
// 각 provider 는 authorize URL 빌드 + code→token 교환 + 토큰→프로필 조회를 캡슐화.
interface Provider
{
    public function id(): string;
    public function isConfigured(): bool;

    public function buildAuthorizeUrl(string $state): string;

    /**
     * @return array{accessToken:string, raw:array<string,mixed>}
     */
    public function exchangeCode(string $code, string $state): array;

    /**
     * @return NormalizedProfile
     */
    public function fetchProfile(string $accessToken): NormalizedProfile;
}
