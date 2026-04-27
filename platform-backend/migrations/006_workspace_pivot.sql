-- CreatorDesk 제품 전환: 웹사이트 빌더 테이블 제거 + 워크스페이스 테이블 신설.
-- DROP 은 IF EXISTS 로 멱등 처리 — 이미 제거된 상태에서 재실행해도 안전하다.
-- FK 의존성 역순(자식 → 부모)으로 DROP.

DROP TABLE IF EXISTS site_sections;
DROP TABLE IF EXISTS site_pages;
DROP TABLE IF EXISTS site_features;
DROP TABLE IF EXISTS sites;

-- 워크스페이스 — 크리에이터 콘텐츠 운영 단위.
-- 한 사용자가 여러 워크스페이스를 보유할 수 있다 (채널·목적 별로 분리).
-- channels / items 은 복수값이므로 JSON 배열로 저장.
CREATE TABLE IF NOT EXISTS workspaces (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id   BIGINT UNSIGNED NULL,
  name            VARCHAR(255)    NOT NULL,
  purpose         VARCHAR(32)     NOT NULL,    -- youtube | streaming | shortform | podcast | blog | brand
  channels        JSON            NOT NULL,    -- ["youtube", "twitch", ...]
  format          VARCHAR(32)     NULL,        -- gaming | info | review | vlog | news | tutorial
  template_key    VARCHAR(64)     NOT NULL,    -- youtube-channel | streaming | shortform | blog-newsletter | brand-team
  preset          VARCHAR(32)     NOT NULL,    -- simple | standard | team
  items           JSON            NOT NULL,    -- ["script", "thumbnail", "shooting", "upload", "performance"]
  status          VARCHAR(16)     NOT NULL DEFAULT 'active',  -- active | paused | archived
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_workspaces_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_workspaces_owner (owner_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
