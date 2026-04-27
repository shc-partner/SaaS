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

// 멱등 처리할 SQLSTATE 클래스 / 에러 코드.
//   42S21 / 1060 = 중복 컬럼  (ADD COLUMN 재실행)
//   42000 / 1061 = 중복 키 이름
//          1826 = 중복 FK 이름
//          1091 = DROP 대상이 이미 없음
$IDEMPOTENT_CODES = [1060, 1061, 1091, 1826];

foreach ($files as $file) {
    $sql = file_get_contents($file);
    if ($sql === false || trim($sql) === '') {
        continue;
    }
    echo "[migrate] applying " . basename($file) . " ... ";
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
        try {
            $pdo->exec($stmt);
        } catch (\PDOException $e) {
            $code = (int)($e->errorInfo[1] ?? 0);
            if (in_array($code, $IDEMPOTENT_CODES, true)) {
                continue;
            }
            throw $e;
        }
    }
    echo "ok\n";
}
echo "[migrate] done\n";
