<?php
declare(strict_types=1);

// OAuth provider 설정.
// 실제 client_id/secret 은 배포 환경 변수로만 주입. 값이 비어 있으면 Service 가 "mock mode" 로 떨어져
// 실제 외부 호출 없이 가짜 프로필로 사용자 생성/로그인이 완결되도록 한다.
//
// 각 provider 콘솔에 등록할 Authorized redirect URI:
//   http://localhost:8000/api/auth/oauth/google/callback
//   http://localhost:8000/api/auth/oauth/naver/callback
//   http://localhost:8000/api/auth/oauth/kakao/callback

$appBase = getenv('APP_BASE_URL') ?: 'http://localhost:8000';
$front   = getenv('OAUTH_FRONTEND_CALLBACK_URL') ?: 'http://localhost:8080/auth/callback';

return [
    'frontendCallback' => $front,

    'google' => [
        'clientId'     => getenv('OAUTH_GOOGLE_CLIENT_ID')     ?: '',
        'clientSecret' => getenv('OAUTH_GOOGLE_CLIENT_SECRET') ?: '',
        'redirectUri'  => $appBase . '/api/auth/oauth/google/callback',
        'authorizeUrl' => 'https://accounts.google.com/o/oauth2/v2/auth',
        'tokenUrl'     => 'https://oauth2.googleapis.com/token',
        'profileUrl'   => 'https://www.googleapis.com/oauth2/v3/userinfo',
        'scope'        => 'openid email profile',
    ],
    'naver' => [
        'clientId'     => getenv('OAUTH_NAVER_CLIENT_ID')     ?: '',
        'clientSecret' => getenv('OAUTH_NAVER_CLIENT_SECRET') ?: '',
        'redirectUri'  => $appBase . '/api/auth/oauth/naver/callback',
        'authorizeUrl' => 'https://nid.naver.com/oauth2.0/authorize',
        'tokenUrl'     => 'https://nid.naver.com/oauth2.0/token',
        'profileUrl'   => 'https://openapi.naver.com/v1/nid/me',
        'scope'        => '',
    ],
    'kakao' => [
        'clientId'     => getenv('OAUTH_KAKAO_CLIENT_ID')     ?: '',
        'clientSecret' => getenv('OAUTH_KAKAO_CLIENT_SECRET') ?: '',  // 선택
        'redirectUri'  => $appBase . '/api/auth/oauth/kakao/callback',
        'authorizeUrl' => 'https://kauth.kakao.com/oauth/authorize',
        'tokenUrl'     => 'https://kauth.kakao.com/oauth/token',
        'profileUrl'   => 'https://kapi.kakao.com/v2/user/me',
        'scope'        => 'profile_nickname,account_email',
    ],
];
