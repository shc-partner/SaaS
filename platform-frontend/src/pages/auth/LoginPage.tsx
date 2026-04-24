import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// /login — 로그인 skeleton. 실제 인증은 아직 없음.
// 제출 시 mock 로그인(localStorage 플래그) 후 /dashboard 로 이동.
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');

  return (
    <div className="mk-auth-center">
      <div className="mk-auth-card">
        <h1>로그인</h1>
        <p className="desc">SiteForge 계정으로 로그인하세요.</p>

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            // mock: 세션 플래그만 세팅
            window.localStorage.setItem('siteforge.auth', JSON.stringify({ email, at: Date.now() }));
            navigate('/dashboard');
          }}
        >
          <label className="field">
            <span className="field-label">이메일</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
          </label>
          <label className="field">
            <span className="field-label">비밀번호</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호" required />
          </label>

          <button type="submit" className="btn primary btn-block">로그인</button>
        </form>

        <div className="mk-auth-note">
          현재 인증 서버가 연결되지 않은 상태입니다. 어떤 이메일/비밀번호든 입력하면 대시보드로 이동합니다.
        </div>

        <p className="mk-auth-footer">
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          <br />
          <Link to="/contact">비밀번호를 잊으셨나요?</Link>
        </p>
      </div>
    </div>
  );
}
