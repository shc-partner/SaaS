<?php
declare(strict_types=1);

namespace SiteForge\Db;

use PDO;
use PDOException;
use RuntimeException;

// PDO 단일 인스턴스 제공. 컨테이너에서 docker-compose 의 db 서비스로 붙는다.
final class Connection
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }
        /** @var array{host:string,port:int,dbname:string,user:string,pass:string,charset:string} $cfg */
        $cfg = require __DIR__ . '/../../config/db.php';

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $cfg['host'], $cfg['port'], $cfg['dbname'], $cfg['charset']
        );
        try {
            $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            throw new RuntimeException('DB connection failed: ' . $e->getMessage(), previous: $e);
        }
        self::$pdo = $pdo;
        return $pdo;
    }
}
