<?php
declare(strict_types=1);

// docker-compose ??db ?œë¹„?¤ì? ?™ì¼ ?ê²©ì¦ëª…. ?˜ê²½ë³€??override ê°€ ?°ì„ .
return [
    'host'    => getenv('DB_HOST')    ?: 'db',
    'port'    => (int)(getenv('DB_PORT') ?: 3306),
    'dbname'  => getenv('DB_NAME')    ?: 'saasdb',
    'user'    => getenv('DB_USER')    ?: 'saasuser',
    'pass'    => getenv('DB_PASS')    ?: '',
    'charset' => 'utf8mb4',
];
