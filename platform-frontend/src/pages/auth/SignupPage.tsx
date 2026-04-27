import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import { AUTH_HOME } from '../../features/auth/routes';

// /signup — 실 API 기반.
// 성공 시 자동 로그인 상태로 /dashboard 로 이동.
export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const fromPath = (location.state as { from?: string } | null)?.from ?? AUTH_HOME;
  const [form, setForm] = useState({ name: '', email: '', pw: '', pw2: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState<string | null>(null);

  return (
    <div className="mk-auth-center">
      <div className="mk-auth-card">
        <h1>회원가입</h1>
        <p className="desc">이메일만으로 지금 바로 시작하세요.</p>

        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            if (form.pw !== form.pw2) { setErr('비밀번호가 일치하지 않습니다.'); return; }
            if (form.pw.length < 8)   { setErr('비밀번호는 8자 이상이어야 합니다.'); return; }

            setBusy(true);
            try {
              await register(form.name, form.email, form.pw);
              navigate(fromPath, { replace: true });
            } catch (x) {
              setErr(x instanceof Error ? x.message : '회원가입 실패');
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="field">
            <span className="field-label">이름</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus autoComplete="name" />
          </label>
          <label className="field">
            <span className="field-label">이메일</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
          </label>
          <label className="field">
            <span className="field-label">비밀번호 <small style={{ color: 'var(--text-3)', fontWeight: 400 }}>(8자 이상)</small></span>
            <input type="password" value={form.pw} onChange={(e) => setForm({ ...form, pw: e.target.value })} required autoComplete="new-password" />
          </label>
          <label className="field">
            <span className="field-label">비밀번호 확인</span>
            <input type="password" value={form.pw2} onChange={(e) => setForm({ ...form, pw2: e.target.value })} required autoComplete="new-password" />
          </label>

          {err && <p className="form-error">{err}</p>}

          <button type="submit" className="btn primary btn-block" disabled={busy}>
            {busy ? '가입 처리 중…' : '회원가입'}
          </button>
        </form>

        <SocialLoginButtons />

        <p className="mk-auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
