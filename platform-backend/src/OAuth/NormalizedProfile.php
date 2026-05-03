<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

// provider ë³??ì´???„ë¡œ???‘ë‹µ??ê³µí†µ ?•íƒœë¡??•ê·œ??
final class NormalizedProfile
{
    public function __construct(
        public readonly string $providerUserId,
        public readonly ?string $email,
        public readonly ?string $name,
        /** @var array<string,mixed> provider ?ë³¸ ?‘ë‹µ ë³´ì¡´ */
        public readonly array $raw,
    ) {}
}
