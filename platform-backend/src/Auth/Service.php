<?php
declare(strict_types=1);

namespace CreatorDesk\Auth;

use InvalidArgumentException;
use RuntimeException;

// 계정 · ?�션 관??비즈?�스 규칙.
// - 비�?번호: password_hash + password_verify (bcrypt)
// - ?�션 ?�큰: 32바이??random_bytes ??hex(64??. user_sessions.id ???�??
// - ?�션 만료: 기본 14??(?�경변??AUTH_SESSION_DAYS �??�버?�이??가??.
final class Service
{
    private const EMAIL_REGEX = '/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/';

    public function __construct(
        private Repository $repo = new Repository(),
    ) {}

    /**
     * @param array{email:string, password:string, name:string} $input
     * @return array{user:array<string,mixed>, token:string, expiresAt:string}
     */
    public function register(array $input, ?string $userAgent = null, ?string $ip = null): array
    {
        $email = trim(strtolower((string)($input['email'] ?? '')));
        $pw    = (string)($input['password'] ?? '');
        $name  = trim((string)($input['name'] ?? ''));

        if (!preg_match(self::EMAIL_REGEX, $email)) {
            throw new InvalidArgumentException('이메일 형식이 올바르지 않습니다.');
        }
        if (strlen($pw) < 8) {
            throw new InvalidArgumentException('비밀번호는 8자 이상이어야 합니다.');
        }
        if ($name === '' || mb_strlen($name) > 100) {
            throw new InvalidArgumentException('이름은 1~100자 사이여야 합니다.');
        }
        if ($this->repo->findUserByEmail($email) !== null) {
            throw new InvalidArgumentException('이미 등록된 이메일입니다.');
        }

        $hash = password_hash($pw, PASSWORD_BCRYPT);
        if ($hash === false) {
            throw new RuntimeException('비밀번호 해시 실패');
        }

        $id = $this->repo->insertUser([
            'email'         => $email,
            'password_hash' => $hash,
            'name'          => $name,
        ]);
        $this->repo->touchLastLogin($id);

        return $this->issueSession($id, $userAgent, $ip);
    }

    /**
     * @param array{email:string, password:string} $input
     * @return array{user:array<string,mixed>, token:string, expiresAt:string}
     */
    public function login(array $input, ?string $userAgent = null, ?string $ip = null): array
    {
        $email = trim(strtolower((string)($input['email'] ?? '')));
        $pw    = (string)($input['password'] ?? '');

        $user = $this->repo->findUserByEmail($email);
        if ($user === null || !password_verify($pw, (string)$user['password_hash'])) {
            // 계정 존재 ?��?�??�리지 ?�기 ?�해 ?�일 메시지.
            throw new InvalidArgumentException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        if (($user['status'] ?? 'active') !== 'active') {
            throw new InvalidArgumentException('비활성 계정입니다.');
        }

        $this->repo->touchLastLogin((int)$user['id']);
        return $this->issueSession((int)$user['id'], $userAgent, $ip);
    }

    public function logout(string $token): void
    {
        $this->repo->deleteSession($token);
    }

    /** @return array<string,mixed>|null */
    public function me(string $token): ?array
    {
        $row = $this->repo->findSessionWithUser($token);
        if ($row === null) return null;
        return [
            'id'          => (int)$row['user_id'],
            'email'       => (string)$row['email'],
            'name'        => (string)$row['name'],
            'status'      => (string)$row['status'],
            'createdAt'   => (string)$row['created_at'],
            'lastLoginAt' => $row['last_login_at'] !== null ? (string)$row['last_login_at'] : null,
        ];
    }

    /**
     * @return array{user:array<string,mixed>, token:string, expiresAt:string}
     */
    private function issueSession(int $userId, ?string $userAgent, ?string $ip): array
    {
        $days = (int)(getenv('AUTH_SESSION_DAYS') ?: 14);
        if ($days < 1) $days = 14;

        $token     = bin2hex(random_bytes(32));
        $expiresAt = (new \DateTimeImmutable('+' . $days . ' days'))->format('Y-m-d H:i:s');

        $this->repo->insertSession($token, $userId, $expiresAt, $userAgent, $ip);

        $u = $this->repo->findUserById($userId);
        if ($u === null) {
            throw new RuntimeException('세션 발급 직후 사용자 조회 실패');
        }
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
}
