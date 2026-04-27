-- 사용자 계정 + 세션.
-- MVP: 이메일/비밀번호. OAuth/SSO 는 추후.
-- 세션은 서버 측 저장 — SPA 가 Bearer 토큰으로 전달, 로그아웃 시 즉시 무효화 가능.

CREATE TABLE IF NOT EXISTS users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(191) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  status          VARCHAR(16)  NOT NULL DEFAULT 'active', -- active | disabled
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at   DATETIME     NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_sessions (
  id          CHAR(64)    NOT NULL PRIMARY KEY,   -- 토큰 자체(랜덤 32바이트 hex)
  user_id     BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at  DATETIME    NOT NULL,
  user_agent  VARCHAR(255) NULL,
  ip          VARCHAR(45)  NULL,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_sessions_user    (user_id),
  KEY idx_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 추후 site 에 owner 컬럼 추가를 대비한 인덱스(현재 MVP 는 단일 사용자이므로 스키마 변경은 별도 마이그레이션에서).
