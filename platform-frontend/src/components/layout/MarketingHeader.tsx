import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

// 공개 영역(미가입 방문자) 상단 헤더 — 제품 소개/요금/문의/로그인/시작하기.
// 가입 후 내부 영역은 AppHeader(대시보드·빌더·내 사이트)가 따로 담당한다.
export default function MarketingHeader() {
  return (
    <header className="app-header marketing-header">
      <Link to="/" className="app-header-brand" aria-label="SiteForge 홈">
        <span className="brand-logo">
          <Logo size={16} />
        </span>
        <span className="brand-name">SiteForge</span>
        <span className="brand-tag">BETA</span>
      </Link>

      <nav className="app-header-nav" aria-label="주요 메뉴">
        <NavLink to="/features"  className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>기능</NavLink>
        <NavLink to="/templates" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>템플릿</NavLink>
        <NavLink to="/pricing"   className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>요금</NavLink>
        <NavLink to="/use-cases" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>고객 사례</NavLink>
        <NavLink to="/contact"   className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>문의</NavLink>
      </nav>

      <div className="app-header-right">
        <ThemeToggle />
        <Link to="/login"  className="btn subtle">로그인</Link>
        <Link to="/signup" className="btn primary">무료로 시작하기</Link>
      </div>
    </header>
  );
}
