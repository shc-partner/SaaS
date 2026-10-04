DELETE FROM workspace_youtube_trend_category
 WHERE workspace_id NOT REGEXP '^[0-9]+$';

DELETE wytc
  FROM workspace_youtube_trend_category wytc
  LEFT JOIN workspaces w
    ON w.id = CAST(wytc.workspace_id AS UNSIGNED)
 WHERE w.id IS NULL;

ALTER TABLE workspace_youtube_trend_category
  MODIFY workspace_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE workspace_youtube_trend_category
  ADD KEY idx_workspace_youtube_trend_category_workspace (workspace_id);

ALTER TABLE workspace_youtube_trend_category
  ADD KEY idx_workspace_youtube_trend_category_category (category_id);

ALTER TABLE workspace_youtube_trend_category
  ADD CONSTRAINT fk_workspace_youtube_trend_category_workspace
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE workspace_youtube_trend_category
  ADD CONSTRAINT fk_workspace_youtube_trend_category_category
  FOREIGN KEY (category_id) REFERENCES youtube_trend_category(category_id) ON DELETE CASCADE;
