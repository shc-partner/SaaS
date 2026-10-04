CREATE TABLE IF NOT EXISTS content_task_requests (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  workspace_id BIGINT UNSIGNED NOT NULL,
  content_item_id VARCHAR(64) NOT NULL DEFAULT '',
  task_name VARCHAR(255) NOT NULL,
  description MEDIUMTEXT NOT NULL,
  requester VARCHAR(100) NOT NULL DEFAULT '',
  worker VARCHAR(100) NOT NULL DEFAULT '',
  reviewer VARCHAR(100) NOT NULL DEFAULT '',
  status VARCHAR(24) NOT NULL DEFAULT 'requested',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  KEY idx_content_task_requests_workspace (workspace_id),
  KEY idx_content_task_requests_status (workspace_id, status),
  KEY idx_content_task_requests_content_item (workspace_id, content_item_id),
  CONSTRAINT fk_content_task_requests_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
