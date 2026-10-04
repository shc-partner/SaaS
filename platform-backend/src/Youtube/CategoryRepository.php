<?php
declare(strict_types=1);

namespace CreatorDesk\Youtube;

use CreatorDesk\Db\Connection;
use PDO;

final class CategoryRepository
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo !== null ? $pdo : Connection::pdo();
    }

    /** @return array<int,array<string,mixed>> */
    public function allForWorkspace(int $workspaceId): array
    {
        $q = $this->pdo->prepare(
            'SELECT
                c.idx,
                c.category_id,
                c.category_name,
                c.api_name,
                c.sort_order,
                c.is_default,
                c.reg_date,
                NULL AS mod_date,
                IFNULL(w.is_enabled, c.is_default) AS is_enabled
               FROM youtube_trend_category c
               LEFT JOIN workspace_youtube_trend_category w
                 ON c.category_id = w.category_id
                AND w.workspace_id = :workspace_id
              ORDER BY c.sort_order ASC, c.idx ASC'
        );
        $q->execute(array(':workspace_id' => $workspaceId));
        return $q->fetchAll();
    }

    /** @return array<int,array<string,mixed>> */
    public function enabledForWorkspace(int $workspaceId): array
    {
        $rows = $this->allForWorkspace($workspaceId);
        $enabled = array();
        foreach ($rows as $row) {
            if ((int)$row['is_enabled'] === 1) {
                $enabled[] = $row;
            }
        }
        return $enabled;
    }

    /** @param array<int,string> $enabledIds */
    public function saveForWorkspace(int $workspaceId, array $enabledIds): void
    {
        $enabledMap = array();
        foreach ($enabledIds as $id) {
            $enabledMap[(string)$id] = true;
        }

        $rows = $this->allForWorkspace($workspaceId);
        $q = $this->pdo->prepare(
            'INSERT INTO workspace_youtube_trend_category
                (workspace_id, category_id, is_enabled, reg_date, mod_date)
             VALUES
                (:workspace_id, :category_id, :is_enabled, NOW(), NULL)
             ON DUPLICATE KEY UPDATE
                is_enabled = VALUES(is_enabled),
                mod_date = NOW()'
        );

        $this->pdo->beginTransaction();
        try {
            foreach ($rows as $row) {
                $id = (string)$row['category_id'];
                $q->execute(array(
                    ':workspace_id' => $workspaceId,
                    ':category_id' => $id,
                    ':is_enabled' => isset($enabledMap[$id]) ? 1 : 0,
                ));
            }
            $this->pdo->commit();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function restoreDefaultsForWorkspace(int $workspaceId): void
    {
        $q = $this->pdo->prepare(
            'DELETE FROM workspace_youtube_trend_category WHERE workspace_id = :workspace_id'
        );
        $q->execute(array(':workspace_id' => $workspaceId));
    }
}
