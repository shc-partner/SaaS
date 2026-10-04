CREATE TABLE IF NOT EXISTS user_ai_plan (
  user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  plan_code VARCHAR(32) NOT NULL DEFAULT 'free',
  daily_limit INT DEFAULT NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME DEFAULT NULL,
  CONSTRAINT fk_user_ai_plan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  workspace_id BIGINT UNSIGNED NOT NULL,
  feature VARCHAR(64) NOT NULL,
  plan_code VARCHAR(32) NOT NULL DEFAULT 'free',
  model VARCHAR(100) DEFAULT NULL,
  prompt_tokens INT DEFAULT NULL,
  completion_tokens INT DEFAULT NULL,
  estimated_cost DECIMAL(12, 6) DEFAULT NULL,
  used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ai_usage_user_day (user_id, used_at),
  KEY idx_ai_usage_workspace (workspace_id, used_at),
  KEY idx_ai_usage_feature (feature, used_at),
  CONSTRAINT fk_ai_usage_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_usage_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
