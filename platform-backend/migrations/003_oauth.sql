-- SNS 로그인(OAuth 2.0 Authorization Code) 지원.
-- 한 사용자 = 여러 provider 연결 가능. user_identities 가 (provider, provider_user_id) 유일키.

-- 소셜 전용 계정은 password 가 없으므로 password_hash 를 NULL 허용으로 완화.
ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;

CREATE TABLE IF NOT EXISTS user_identities (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id            BIGINT UNSIGNED NOT NULL,
  provider           VARCHAR(32)     NOT NULL,   -- 'google' | 'naver' | 'kakao'
  provider_user_id   VARCHAR(191)    NOT NULL,
  email              VARCHAR(191)    NULL,
  display_name       VARCHAR(100)    NULL,
  profile_json       JSON            NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_identity (provider, provider_user_id),
  KEY idx_identity_user (user_id),
  CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CSRF 방지용 state 저장소. 만료는 10분.
CREATE TABLE IF NOT EXISTS oauth_states (
  state        CHAR(64)    NOT NULL PRIMARY KEY,
  provider     VARCHAR(32) NOT NULL,
  created_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME    NOT NULL,
  KEY idx_states_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
