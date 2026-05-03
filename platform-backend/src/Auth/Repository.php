<?php
declare(strict_types=1);

namespace CreatorDesk\Auth;

use PDO;
use CreatorDesk\Db\Connection;

// ?¬ìš©??Â· ?¸ì…˜ DB ?‘ê·¼. ë¹„ì¦ˆ?ˆìŠ¤ ê·œì¹™(ë¹„ë²ˆ ?´ì‹œ ???€ Service ?ì„œ.
final class Repository
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Connection::pdo();
    }

    public function pdo(): PDO { return $this->pdo; }

    /** @return array<string,mixed>|null */
    public function findUserByEmail(string $email): ?array
    {
        $q = $this->pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $q->execute([':email' => $email]);
        $row = $q->fetch();
        return $row === false ? null : $row;
    }

    /** @return array<string,mixed>|null */
    public function findUserById(int $id): ?array
    {
        $q = $this->pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $q->execute([':id' => $id]);
        $row = $q->fetch();
        return $row === false ? null : $row;
    }

    /**
     * @param array{email:string, password_hash:string, name:string} $u
     */
    public function insertUser(array $u): int
    {
        $q = $this->pdo->prepare(
            'INSERT INTO users (email, password_hash, name) VALUES (:email, :ph, :name)'
        );
        $q->execute([
            ':email' => $u['email'],
            ':ph'    => $u['password_hash'],
            ':name'  => $u['name'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function touchLastLogin(int $userId): void
    {
        $q = $this->pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id');
        $q->execute([':id' => $userId]);
    }

    public function insertSession(string $token, int $userId, string $expiresAt, ?string $ua, ?string $ip): void
    {
        $q = $this->pdo->prepare(
            'INSERT INTO user_sessions (id, user_id, expires_at, user_agent, ip) VALUES (:id, :uid, :exp, :ua, :ip)'
        );
        $q->execute([
            ':id'  => $token,
            ':uid' => $userId,
            ':exp' => $expiresAt,
            ':ua'  => $ua,
            ':ip'  => $ip,
        ]);
    }

    /** @return array<string,mixed>|null */
    public function findSessionWithUser(string $token): ?array
    {
        $q = $this->pdo->prepare(
            'SELECT s.id AS session_id, s.user_id, s.expires_at,
                    u.id, u.email, u.name, u.status, u.created_at, u.last_login_at
               FROM user_sessions s
               JOIN users u ON u.id = s.user_id
              WHERE s.id = :id AND s.expires_at > NOW() AND u.status = :active
              LIMIT 1'
        );
        $q->execute([':id' => $token, ':active' => 'active']);
        $row = $q->fetch();
        return $row === false ? null : $row;
    }

    public function deleteSession(string $token): void
    {
        $q = $this->pdo->prepare('DELETE FROM user_sessions WHERE id = :id');
        $q->execute([':id' => $token]);
    }

    public function purgeExpiredSessions(): void
    {
        $this->pdo->exec('DELETE FROM user_sessions WHERE expires_at <= NOW()');
    }

    // ---------- OAuth identities ----------

    /** @return array<string,mixed>|null */
    public function findIdentity(string $provider, string $providerUserId): ?array
    {
        $q = $this->pdo->prepare(
            'SELECT * FROM user_identities WHERE provider = :p AND provider_user_id = :pid LIMIT 1'
        );
        $q->execute([':p' => $provider, ':pid' => $providerUserId]);
        $row = $q->fetch();
        return $row === false ? null : $row;
    }

    /**
     * @param array{user_id:int, provider:string, provider_user_id:string, email:?string, display_name:?string, profile_json:string} $i
     */
    public function insertIdentity(array $i): int
    {
        $q = $this->pdo->prepare(
            'INSERT INTO user_identities (user_id, provider, provider_user_id, email, display_name, profile_json)
             VALUES (:uid, :p, :pid, :email, :name, :json)'
        );
        $q->execute([
            ':uid'   => $i['user_id'],
            ':p'     => $i['provider'],
            ':pid'   => $i['provider_user_id'],
            ':email' => $i['email'],
            ':name'  => $i['display_name'],
            ':json'  => $i['profile_json'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function updateIdentityProfile(int $id, ?string $email, ?string $name, string $profileJson): void
    {
        $q = $this->pdo->prepare(
            'UPDATE user_identities SET email = :email, display_name = :name, profile_json = :json WHERE id = :id'
        );
        $q->execute([
            ':id'    => $id,
            ':email' => $email,
            ':name'  => $name,
            ':json'  => $profileJson,
        ]);
    }

    // ---------- OAuth states ----------

    public function insertOauthState(string $state, string $provider, string $expiresAt): void
    {
        $q = $this->pdo->prepare(
            'INSERT INTO oauth_states (state, provider, expires_at) VALUES (:s, :p, :e)'
        );
        $q->execute([':s' => $state, ':p' => $provider, ':e' => $expiresAt]);
    }

    /** @return array<string,mixed>|null */
    public function consumeOauthState(string $state, string $provider): ?array
    {
        $q = $this->pdo->prepare(
            'SELECT * FROM oauth_states WHERE state = :s AND provider = :p AND expires_at > NOW() LIMIT 1'
        );
        $q->execute([':s' => $state, ':p' => $provider]);
        $row = $q->fetch();
        if ($row === false) return null;
        $del = $this->pdo->prepare('DELETE FROM oauth_states WHERE state = :s');
        $del->execute([':s' => $state]);
        return $row;
    }

    public function purgeExpiredOauthStates(): void
    {
        $this->pdo->exec('DELETE FROM oauth_states WHERE expires_at <= NOW()');
    }
}
