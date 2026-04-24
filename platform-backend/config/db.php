<?php
declare(strict_types=1);

// docker-compose 의 db 서비스와 동일 자격증명. 환경변수 override 가 우선.
return [
    'host'    => getenv('DB_HOST')    ?: 'db',
    'port'    => (int)(getenv('DB_PORT') ?: 3306),
    'dbname'  => getenv('DB_NAME')    ?: 'saasdb',
    'user'    => getenv('DB_USER')    ?: 'saasuser',
    'pass'    => getenv('DB_PASS')    ?: 'saaspass1234',
    'charset' => 'utf8mb4',
];
