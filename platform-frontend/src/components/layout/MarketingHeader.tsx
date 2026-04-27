import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '../../features/auth/AuthProvider';

// 공개 영역 상단 헤더.
// 메뉴 순서: 주요 기능 / 템플릿 / 고객 사례 / 요금 / 고객지원
// 로그인 상태면 우측을 "대시보드 진입 + UserMenu" 로 교체.
export default function MarketingHeader() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="app-header marketing-header">
      <Link to="/home" className="app-header-brand" aria-label="CreatorDesk 홈">
        <span className="brand-logo">
          <Logo size={16} />
        </span>
        <span className="brand-name">CreatorDesk</span>
        <span className="brand-tag">BETA</span>
      </Link>

      <nav className="app-header-nav" aria-label="주요 메뉴">
        <NavLink to="/features"   className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>주요 기능</NavLink>
        <NavLink to="/templates"  className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>템플릿</NavLink>
        <NavLink to="/use-cases"  className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>고객 사례</NavLink>
        <NavLink to="/pricing"    className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>요금</NavLink>
        <NavLink to="/contact"    className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>고객지원</NavLink>
      </nav>

      <div className="app-header-right">
        <ThemeToggle />
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn ghost">대시보드</Link>
            <UserMenu />
          </>
        ) : (
          <>
            <Link to="/login"  className="btn subtle">로그인</Link>
            <Link to="/signup" className="btn primary">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}
