<?php
declare(strict_types=1);

// 가벼운 마이그레이션 러너 — `php migrations/apply.php` 로 실행.
// migrations/*.sql 을 사전순으로 순차 실행. 멱등성은 각 .sql 내부의 IF NOT EXISTS 등이 책임.

require __DIR__ . '/../src/Bootstrap.php';
\SiteForge\Bootstrap::class; // autoloader 등록 트리거용

// Bootstrap::run() 은 HTTP 처리 루틴이므로 여기서 호출하면 안 됨.
// 대신 autoload 만 등록되도록 동일 로직을 인라인.
spl_autoload_register(static function (string $class): void {
    $prefix = 'SiteForge\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $path = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

$pdo = \SiteForge\Db\Connection::pdo();

$files = glob(__DIR__ . '/*.sql') ?: [];
sort($files);

foreach ($files as $file) {
    $sql = file_get_contents($file);
    if ($sql === false || trim($sql) === '') {
        continue;
    }
    echo "[migrate] applying " . basename($file) . " ... ";
    // 여러 statement 을 안전하게 실행 — 세미콜론으로 분리.
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
        $pdo->exec($stmt);
    }
    echo "ok\n";
}
echo "[migrate] done\n";
