<?php
declare(strict_types=1);

namespace SiteForge\Sites;

use PDO;
use SiteForge\Db\Connection;

// site / features / pages / sections 4 테이블의 R/W. SQL 은 여기에만 둔다.
final class Repository
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Connection::pdo();
    }

    public function pdo(): PDO
    {
        return $this->pdo;
    }

    public function existsBySlug(string $slug): bool
    {
        $st = $this->pdo->prepare('SELECT 1 FROM sites WHERE slug = :slug LIMIT 1');
        $st->execute([':slug' => $slug]);
        return (bool)$st->fetchColumn();
    }

    /**
     * @param array{slug:string,type:string,name:string,industry:?string,summary:?string} $row
     */
    public function insertSite(array $row): int
    {
        $st = $this->pdo->prepare(
            'INSERT INTO sites (slug, type, name, industry, summary) VALUES (:slug, :type, :name, :industry, :summary)'
        );
        $st->execute([
            ':slug'     => $row['slug'],
            ':type'     => $row['type'],
            ':name'     => $row['name'],
            ':industry' => $row['industry'],
            ':summary'  => $row['summary'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    /** @param array<int,string> $features */
    public function insertFeatures(int $siteId, array $features): void
    {
        if ($features === []) {
            return;
        }
        $st = $this->pdo->prepare('INSERT INTO site_features (site_id, feature_key) VALUES (:site_id, :key)');
        foreach ($features as $key) {
            $st->execute([':site_id' => $siteId, ':key' => $key]);
        }
    }

    /**
     * @param array{key:string,label:string,path:string,sort_order:int} $row
     */
    public function insertPage(int $siteId, array $row): int
    {
        $st = $this->pdo->prepare(
            'INSERT INTO site_pages (site_id, page_key, label, path, sort_order)
             VALUES (:site_id, :key, :label, :path, :sort)'
        );
        $st->execute([
            ':site_id' => $siteId,
            ':key'     => $row['key'],
            ':label'   => $row['label'],
            ':path'    => $row['path'],
            ':sort'    => $row['sort_order'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    /** @param array<string,mixed> $content */
    public function insertSection(int $siteId, ?int $pageId, string $kind, int $sortOrder, array $content): int
    {
        $st = $this->pdo->prepare(
            'INSERT INTO site_sections (site_id, page_id, kind, sort_order, content_json)
             VALUES (:site_id, :page_id, :kind, :sort, :content)'
        );
        $st->execute([
            ':site_id' => $siteId,
            ':page_id' => $pageId,
            ':kind'    => $kind,
            ':sort'    => $sortOrder,
            ':content' => json_encode($content, JSON_UNESCAPED_UNICODE),
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    /** @return array<string,mixed>|null */
    public function findSiteById(int $id): ?array
    {
        $st = $this->pdo->prepare('SELECT * FROM sites WHERE id = :id');
        $st->execute([':id' => $id]);
        $row = $st->fetch();
        return $row === false ? null : $row;
    }

    /** @return array<string,mixed>|null */
    public function findSiteBySlug(string $slug): ?array
    {
        $st = $this->pdo->prepare('SELECT * FROM sites WHERE slug = :slug');
        $st->execute([':slug' => $slug]);
        $row = $st->fetch();
        return $row === false ? null : $row;
    }

    /** @return array<int,string> */
    public function listFeatures(int $siteId): array
    {
        $st = $this->pdo->prepare('SELECT feature_key FROM site_features WHERE site_id = :id');
        $st->execute([':id' => $siteId]);
        return array_map(static fn (array $r): string => (string)$r['feature_key'], $st->fetchAll());
    }

    /** @return array<int,array<string,mixed>> */
    public function listPages(int $siteId): array
    {
        $st = $this->pdo->prepare(
            'SELECT id, page_key, label, path, sort_order
             FROM site_pages WHERE site_id = :id ORDER BY sort_order'
        );
        $st->execute([':id' => $siteId]);
        return $st->fetchAll();
    }

    /** @return array<int,array<string,mixed>> */
    public function listSections(int $siteId): array
    {
        $st = $this->pdo->prepare(
            'SELECT id, page_id, kind, sort_order, content_json
             FROM site_sections WHERE site_id = :id ORDER BY sort_order, id'
        );
        $st->execute([':id' => $siteId]);
        return $st->fetchAll();
    }
}
