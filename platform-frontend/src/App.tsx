import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import MarketingShell from './components/layout/MarketingShell';

// Public (marketing)
import HomePage      from './pages/marketing/HomePage';
import FeaturesPage  from './pages/marketing/FeaturesPage';
import TemplatesPage from './pages/marketing/TemplatesPage';
import PricingPage   from './pages/marketing/PricingPage';
import UseCasesPage  from './pages/marketing/UseCasesPage';
import ContactPage   from './pages/marketing/ContactPage';
import LoginPage     from './pages/auth/LoginPage';
import SignupPage    from './pages/auth/SignupPage';

// Authenticated area
import DashboardPage from './pages/app/DashboardPage';
import MySitesPage   from './pages/MySitesPage';
import BuilderPage   from './pages/BuilderPage';
import AdminPlaceholderPage       from './pages/AdminPlaceholderPage';
import SitePreviewPlaceholderPage from './pages/SitePreviewPlaceholderPage';

// 3개의 셸:
//  - MarketingShell : 공개 영역(로그인 전). 상단 헤더는 기능/템플릿/요금/사례/문의 + 로그인/시작하기
//  - AppShell       : 가입 후 운영 영역. 상단 헤더는 대시보드/내 사이트/빌더
//  - AppShell flush : 빌더와 공개 사이트 런타임 — 화면 가득 차야 하는 뷰
export default function App() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/"           element={<MarketingShell flush><HomePage /></MarketingShell>} />
      <Route path="/features"   element={<MarketingShell><FeaturesPage /></MarketingShell>} />
      <Route path="/templates"  element={<MarketingShell><TemplatesPage /></MarketingShell>} />
      <Route path="/pricing"    element={<MarketingShell><PricingPage /></MarketingShell>} />
      <Route path="/use-cases"  element={<MarketingShell><UseCasesPage /></MarketingShell>} />
      <Route path="/customers"  element={<Navigate to="/use-cases" replace />} />
      <Route path="/contact"    element={<MarketingShell><ContactPage /></MarketingShell>} />

      {/* ---------- Auth ---------- */}
      <Route path="/login"  element={<MarketingShell flush><LoginPage /></MarketingShell>} />
      <Route path="/signup" element={<MarketingShell flush><SignupPage /></MarketingShell>} />

      {/* ---------- Authenticated app area ---------- */}
      <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
      <Route path="/sites"     element={<AppShell><MySitesPage /></AppShell>} />
      {/* /app 은 이전 라우트 호환을 위해 /sites 로 보냄 */}
      <Route path="/app"       element={<Navigate to="/sites" replace />} />

      <Route path="/builder"            element={<AppShell flush><BuilderPage /></AppShell>} />
      <Route path="/admin"              element={<AppShell><AdminPlaceholderPage /></AppShell>} />
      <Route path="/admin/sites/:siteId" element={<AppShell><AdminPlaceholderPage /></AppShell>} />

      {/*
        공개된 생성 사이트 — 멀티페이지.
        `/sites/:slug` 와 `/sites` (목록)가 공존하지만 React Router 가 정확히 매칭.
      */}
      <Route path="/sites/:slug"           element={<AppShell flush><SitePreviewPlaceholderPage /></AppShell>} />
      <Route path="/sites/:slug/:pageKey"  element={<AppShell flush><SitePreviewPlaceholderPage /></AppShell>} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <MarketingShell>
            <div className="page-404">
              <h1>페이지를 찾을 수 없습니다</h1>
              <p>주소가 올바른지 확인하거나, 홈에서 다시 시작해 주세요.</p>
            </div>
          </MarketingShell>
        }
      />
    </Routes>
  );
}
