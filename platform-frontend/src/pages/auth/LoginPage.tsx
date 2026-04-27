import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import { AUTH_HOME } from '../../features/auth/routes';

// /login — 실 API 기반.
// 성공 시 세션 토큰이 localStorage 에 저장되고 AuthProvider 가 user 상태를 가진다.
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  // ProtectedRoute 가 막아 보낸 경우 state.from 에 원래 가려던 경로가 들어 있다.
  const fromPath = (location.state as { from?: string } | null)?.from ?? AUTH_HOME;
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [busy, setBusy]   = useState(false);
  const [err, setErr]     = useState<string | null>(null);

  return (
    <div className="mk-auth-center">
      <div className="mk-auth-card">
        <h1>로그인</h1>
        <p className="desc">CreatorDesk 계정으로 로그인하세요.</p>

        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true); setErr(null);
            try {
              await login(email, pw);
              navigate(fromPath, { replace: true });
            } catch (x) {
              setErr(x instanceof Error ? x.message : '로그인 실패');
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="field">
            <span className="field-label">이메일</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus autoComplete="email" />
          </label>
          <label className="field">
            <span className="field-label">비밀번호</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호" required autoComplete="current-password" />
          </label>

          {err && <p className="form-error">{err}</p>}

          <button type="submit" className="btn primary btn-block" disabled={busy}>
            {busy ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <SocialLoginButtons />

        <p className="mk-auth-footer">
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          <br />
          <Link to="/contact">비밀번호를 잊으셨나요?</Link>
        </p>
      </div>
    </div>
  );
}
