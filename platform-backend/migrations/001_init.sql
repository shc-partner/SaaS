-- SiteForge 초기 스키마.
-- 모든 테넌트 데이터는 site_id 로 격리. 이관 시 site_id 단일 필터로 dump 가능하게 설계.

CREATE TABLE IF NOT EXISTS sites (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(64)  NOT NULL UNIQUE,
  type        VARCHAR(32)  NOT NULL,
  name        VARCHAR(255) NOT NULL,
  industry    VARCHAR(255) NULL,
  summary     TEXT         NULL,
  status      VARCHAR(16)  NOT NULL DEFAULT 'published',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS site_features (
  site_id      BIGINT UNSIGNED NOT NULL,
  feature_key  VARCHAR(64)     NOT NULL,
  PRIMARY KEY (site_id, feature_key),
  CONSTRAINT fk_features_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS site_pages (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id     BIGINT UNSIGNED NOT NULL,
  page_key    VARCHAR(64)     NOT NULL,
  label       VARCHAR(255)    NOT NULL,
  path        VARCHAR(255)    NOT NULL,
  sort_order  INT             NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_site_pagekey (site_id, page_key),
  CONSTRAINT fk_pages_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- kind: 'header' | 'hero' | 'about' | 'services' | 'contact' | 'footer' (그 외 확장 가능)
-- content_json 은 섹션별로 자유 스키마. 렌더러가 kind 별로 해석한다.
CREATE TABLE IF NOT EXISTS site_sections (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_id       BIGINT UNSIGNED NOT NULL,
  page_id       BIGINT UNSIGNED NULL,
  kind          VARCHAR(64)     NOT NULL,
  sort_order    INT             NOT NULL DEFAULT 0,
  content_json  JSON            NOT NULL,
  CONSTRAINT fk_sections_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
  CONSTRAINT fk_sections_page FOREIGN KEY (page_id) REFERENCES site_pages(id) ON DELETE CASCADE,
  KEY idx_sections_site (site_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
