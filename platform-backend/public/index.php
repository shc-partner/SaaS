<?php
declare(strict_types=1);

// Front controller — 모든 요청은 여기로 들어온다.
// .htaccess 가 정적 파일이 아닌 모든 경로를 index.php 로 rewrite.

require __DIR__ . '/../src/Bootstrap.php';

\CreatorDesk\Bootstrap::run();
