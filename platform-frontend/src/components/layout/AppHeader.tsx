import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '../../features/auth/AuthProvider';

// SaaS 플랫폼 공통 상단 바.
// 좌: 로고+서비스명, 가운데: 주요 내비, 우: 테마 토글 + 사용자 placeholder.
// sticky 로 페이지 스크롤 시에도 상단 유지.
export default function AppHeader() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="app-header">
      <Link to="/" className="app-header-brand" aria-label="CreatorDesk 홈">
        <span className="brand-logo">
          <Logo size={16} />
        </span>
        <span className="brand-name">CreatorDesk</span>
        <span className="brand-tag">BETA</span>
      </Link>

      <nav className="app-header-nav" aria-label="주요 메뉴">
        <NavLink to="/dashboard"      className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>대시보드</NavLink>
        <NavLink to="/workspaces"     className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>내 워크스페이스</NavLink>
        <NavLink to="/workspaces/new" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>+ 새 워크스페이스</NavLink>
      </nav>

      <div className="app-header-right">
        <ThemeToggle />
        <Link to="/" className="btn subtle" title="공개 사이트로">홈</Link>
        {isAuthenticated
          ? <UserMenu />
          : <Link to="/login" className="btn primary">로그인</Link>}
      </div>
    </header>
  );
}
