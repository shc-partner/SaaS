<?php
declare(strict_types=1);

// ê°€ë²¼ìš´ ë§ˆì´ê·¸ë ˆ?´ì…˜ ?¬ë„ˆ ??`php migrations/apply.php` ë¡??¤í–‰.
// migrations/*.sql ???¬ì „?œìœ¼ë¡??œì°¨ ?¤í–‰. ë©±ë“±?±ì? ê°?.sql ?´ë???IF NOT EXISTS ?±ì´ ì±…ìž„.

require __DIR__ . '/../src/Bootstrap.php';
\CreatorDesk\Bootstrap::class; // autoloader ?±ë¡ ?¸ë¦¬ê±°ìš©

// Bootstrap::run() ?€ HTTP ì²˜ë¦¬ ë£¨í‹´?´ë?ë¡??¬ê¸°???¸ì¶œ?˜ë©´ ????
// ?€??autoload ë§??±ë¡?˜ë„ë¡??™ì¼ ë¡œì§???¸ë¼??
spl_autoload_register(static function (string $class): void {
    $prefix = 'CreatorDesk\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $path = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

$pdo = \CreatorDesk\Db\Connection::pdo();

$files = glob(__DIR__ . '/*.sql') ?: [];
sort($files);

// ë©±ë“± ì²˜ë¦¬??SQLSTATE ?´ëž˜??/ ?ëŸ¬ ì½”ë“œ.
//   42S21 / 1060 = ì¤‘ë³µ ì»¬ëŸ¼  (ADD COLUMN ?¬ì‹¤??
//   42000 / 1061 = ì¤‘ë³µ ???´ë¦„
//          1826 = ì¤‘ë³µ FK ?´ë¦„
//          1091 = DROP ?€?ì´ ?´ë? ?†ìŒ
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
