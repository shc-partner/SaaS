<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

// OAuth provider 공통 ?�터?�이??
// �?provider ??authorize URL 빌드 + code?�token 교환 + ?�큰?�프로필 조회�?캡슐??
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
