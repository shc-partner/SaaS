import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';

// /auth/callback
// 백엔드가 OAuth 처리 후 이 페이지로 돌려보내며 토큰을 URL fragment 로 전달.
//   .../auth/callback#token=xxx&expiresAt=...&provider=google&uid=1&name=...&email=...
//   .../auth/callback#error=<code>
// fragment 는 서버 로그에 남지 않고, 브라우저는 새로고침해도 보존된다.
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { adoptToken } = useAuth();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) { setErr('인증 응답이 비어 있습니다.'); return; }

    const q = new URLSearchParams(hash);
    const error = q.get('error');
    const token = q.get('token');

    if (error) { setErr(decodeURIComponent(error)); return; }
    if (!token) { setErr('토큰을 받지 못했습니다.'); return; }

    const prefill = {
      id:    Number(q.get('uid') ?? 0),
      email: q.get('email') ?? '',
      name:  q.get('name')  ?? '',
    };

    let alive = true;
    adoptToken(token, prefill)
      .then(() => {
        if (!alive) return;
        // fragment 를 URL 에서 지우며 대시보드로 이동.
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/dashboard', { replace: true });
      })
      .catch((x: Error) => { if (alive) setErr(x.message || '로그인 처리 실패'); });
    return () => { alive = false; };
  }, [adoptToken, navigate]);

  if (err) {
    return (
      <div className="mk-auth-center">
        <div className="mk-auth-card">
          <span className="badge danger" style={{ marginBottom: 12 }}>오류</span>
          <h1>로그인 처리 실패</h1>
          <p className="desc">{err}</p>
          <Link to="/login" className="btn primary btn-block">로그인 페이지로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-auth-center">
      <div className="mk-auth-card" style={{ textAlign: 'center' }}>
        <h1>로그인 중…</h1>
        <p className="desc">인증 정보를 확인하고 있습니다. 잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
