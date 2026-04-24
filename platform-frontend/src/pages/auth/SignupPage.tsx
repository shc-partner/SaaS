import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// /signup — 회원가입 skeleton.
// 제출 시 mock 가입 후 /dashboard 로 이동. 실제 계정 생성은 아직 없음.
export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', pw: '', pw2: '' });
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mk-auth-center">
      <div className="mk-auth-card">
        <h1>회원가입</h1>
        <p className="desc">이메일만으로 지금 바로 시작하세요.</p>

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (form.pw !== form.pw2) { setErr('비밀번호가 일치하지 않습니다.'); return; }
            window.localStorage.setItem('siteforge.auth', JSON.stringify({ email: form.email, name: form.name, at: Date.now() }));
            navigate('/dashboard');
          }}
        >
          <label className="field">
            <span className="field-label">이름</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          </label>
          <label className="field">
            <span className="field-label">이메일</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label className="field">
            <span className="field-label">비밀번호</span>
            <input type="password" value={form.pw} onChange={(e) => setForm({ ...form, pw: e.target.value })} required />
          </label>
          <label className="field">
            <span className="field-label">비밀번호 확인</span>
            <input type="password" value={form.pw2} onChange={(e) => setForm({ ...form, pw2: e.target.value })} required />
            {err && <em className="field-error">{err}</em>}
          </label>

          <button type="submit" className="btn primary btn-block">회원가입</button>
        </form>

        <div className="mk-auth-note">
          현재 인증 서버가 연결되지 않은 상태입니다. 입력값은 브라우저에만 저장되며 실제 계정은 생성되지 않습니다.
        </div>

        <p className="mk-auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
