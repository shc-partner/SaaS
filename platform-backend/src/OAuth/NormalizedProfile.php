<?php
declare(strict_types=1);

namespace SiteForge\OAuth;

// provider 별 상이한 프로필 응답을 공통 형태로 정규화.
final class NormalizedProfile
{
    public function __construct(
        public readonly string $providerUserId,
        public readonly ?string $email,
        public readonly ?string $name,
        /** @var array<string,mixed> provider 원본 응답 보존 */
        public readonly array $raw,
    ) {}
}
