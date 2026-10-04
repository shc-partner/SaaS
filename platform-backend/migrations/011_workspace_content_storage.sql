SET @has_description := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'workspaces'
    AND COLUMN_NAME = 'description'
);
SET @add_description_sql := IF(
  @has_description = 0,
  'ALTER TABLE workspaces ADD COLUMN description TEXT NULL AFTER name',
  'DO 0'
);
PREPARE add_description_stmt FROM @add_description_sql;
EXECUTE add_description_stmt;
DEALLOCATE PREPARE add_description_stmt;

CREATE TABLE IF NOT EXISTS workspace_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  workspace_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'owner',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_workspace_member (workspace_id, user_id),
  KEY idx_workspace_members_user (user_id),
  CONSTRAINT fk_workspace_members_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_workspace_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS content_items (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  workspace_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  channels JSON NOT NULL,
  content_format VARCHAR(100) NOT NULL DEFAULT '',
  tags JSON NOT NULL,
  assignee VARCHAR(100) NOT NULL DEFAULT '',
  priority VARCHAR(16) NOT NULL DEFAULT 'medium',
  script MEDIUMTEXT NOT NULL,
  title_candidates JSON NOT NULL,
  thumbnail_texts JSON NOT NULL,
  editing_notes MEDIUMTEXT NOT NULL,
  reference_links JSON NOT NULL,
  publish_date VARCHAR(20) NOT NULL DEFAULT '',
  shoot_date VARCHAR(20) NOT NULL DEFAULT '',
  edit_due_date VARCHAR(20) NOT NULL DEFAULT '',
  is_sponsored TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  KEY idx_content_items_workspace (workspace_id),
  KEY idx_content_items_status (workspace_id, status),
  CONSTRAINT fk_content_items_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS content_ideas (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  workspace_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT '',
  priority VARCHAR(16) NOT NULL DEFAULT 'medium',
  tags JSON NOT NULL,
  memo MEDIUMTEXT NOT NULL,
  reference_links JSON NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_content_ideas_workspace (workspace_id),
  CONSTRAINT fk_content_ideas_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
