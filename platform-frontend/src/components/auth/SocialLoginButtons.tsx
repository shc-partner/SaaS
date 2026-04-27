// SNS 로그인 버튼 3종.
// 각 버튼은 백엔드 /api/auth/oauth/:provider/start 로 브라우저를 "완전 이동" 시킨다.
// (fetch() 가 아님 — OAuth 는 반드시 top-level navigation.)
const PROVIDERS = [
  { id: 'google', label: 'Google 로 계속하기', cls: 'social-btn google', icon: <GoogleIcon /> },
  { id: 'naver',  label: '네이버로 계속하기',   cls: 'social-btn naver',  icon: <NaverIcon />  },
  { id: 'kakao',  label: '카카오로 계속하기',   cls: 'social-btn kakao',  icon: <KakaoIcon />  },
] as const;

export default function SocialLoginButtons() {
  const go = (provider: string) => {
    // proxy 설정에 의해 /api/* 는 백엔드로 전달되지만, OAuth 는 302 리다이렉트를 따라가야 하므로
    // 브라우저 주소창 자체를 이동시킨다. 현재 origin 을 그대로 사용.
    window.location.href = `/api/auth/oauth/${provider}/start`;
  };

  return (
    <>
      <div className="social-divider"><span>또는</span></div>
      <div className="social-list">
        {PROVIDERS.map((p) => (
          <button key={p.id} type="button" className={p.cls} onClick={() => go(p.id)}>
            <span className="icon" aria-hidden>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2A20 20 0 0 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
function NaverIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#fff" d="M14.1 13.1L9.6 6H6v12h4V10.9l4.4 7.1H18V6h-3.9z"/>
    </svg>
  );
}
function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#000" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.5 21c-.1.3.2.6.5.4l4.2-2.8c.6.1 1.2.1 1.8.1 5.5 0 10-3.6 10-8 0-4.4-4.5-7.7-10-7.7z"/>
    </svg>
  );
}
