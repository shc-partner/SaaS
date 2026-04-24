import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

// SaaS 플랫폼 공통 상단 바.
// 좌: 로고+서비스명, 가운데: 주요 내비, 우: 테마 토글 + 사용자 placeholder.
// sticky 로 페이지 스크롤 시에도 상단 유지.
export default function AppHeader() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header-brand" aria-label="SiteForge 홈">
        <span className="brand-logo">
          <Logo size={16} />
        </span>
        <span className="brand-name">SiteForge</span>
        <span className="brand-tag">BETA</span>
      </Link>

      <nav className="app-header-nav" aria-label="주요 메뉴">
        <NavLink to="/dashboard" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>대시보드</NavLink>
        <NavLink to="/sites"     className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>내 사이트</NavLink>
        <NavLink to="/builder"   className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>빌더</NavLink>
      </nav>

      <div className="app-header-right">
        <ThemeToggle />
        <Link to="/" className="btn subtle" title="공개 사이트로">홈</Link>
        {/* 사용자 메뉴 placeholder — 인증 붙으면 Avatar/이름/드롭다운으로 교체 */}
        <button type="button" className="user-menu-trigger" aria-label="사용자 메뉴">
          <span className="avatar">U</span>
          <span className="user-name">사용자</span>
        </button>
      </div>
    </header>
  );
}
