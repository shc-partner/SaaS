<<<<<<< HEAD
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import MarketingShell from './components/layout/MarketingShell';
import LatencyOverlay from './components/dev/LatencyOverlay';
import { GuestRoute, ProtectedRoute } from './components/auth/RouteGuards';

import HomePage from './pages/marketing/HomePage';
import FeaturesPage from './pages/marketing/FeaturesPage';
import TemplatesPage from './pages/marketing/TemplatesPage';
import PricingPage from './pages/marketing/PricingPage';
import UseCasesPage from './pages/marketing/UseCasesPage';
import ContactPage from './pages/marketing/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';
import DashboardPage from './pages/app/DashboardPage';
import MyWorkspacesPage from './pages/workspaces/MyWorkspacesPage';
import WorkspaceNewPage from './pages/workspaces/WorkspaceNewPage';
import WorkspacePage from './pages/workspaces/WorkspacePage';
import { useAuth } from './features/auth/AuthProvider';

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <MarketingShell flush><HomePage /></MarketingShell>;
}

export default function App() {
  return (
    <>
      <LatencyOverlay />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={<MarketingShell flush><HomePage /></MarketingShell>} />

        <Route path="/features" element={<MarketingShell><FeaturesPage /></MarketingShell>} />
        <Route path="/templates" element={<MarketingShell><TemplatesPage /></MarketingShell>} />
        <Route path="/pricing" element={<MarketingShell><PricingPage /></MarketingShell>} />
        <Route path="/use-cases" element={<MarketingShell><UseCasesPage /></MarketingShell>} />
        <Route path="/customers" element={<Navigate to="/use-cases" replace />} />
        <Route path="/contact" element={<MarketingShell><ContactPage /></MarketingShell>} />

        <Route path="/login" element={
          <GuestRoute><MarketingShell flush><LoginPage /></MarketingShell></GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute><MarketingShell flush><SignupPage /></MarketingShell></GuestRoute>
        } />
        <Route path="/auth/callback" element={
          <MarketingShell flush><OAuthCallbackPage /></MarketingShell>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>
        } />

        <Route path="/app" element={<Navigate to="/workspaces" replace />} />

        <Route path="/workspaces" element={
          <ProtectedRoute><AppShell><MyWorkspacesPage /></AppShell></ProtectedRoute>
        } />
        <Route path="/workspaces/new" element={
          <ProtectedRoute><AppShell flush><WorkspaceNewPage /></AppShell></ProtectedRoute>
        } />
        <Route path="/workspaces/:workspaceId" element={
          <ProtectedRoute><AppShell><WorkspacePage /></AppShell></ProtectedRoute>
        } />

        <Route
          path="*"
          element={
            <MarketingShell>
              <div className="page-404">
                <h1>페이지를 찾을 수 없습니다</h1>
                <p>주소가 올바른지 확인하거나 홈에서 다시 시작해 주세요.</p>
              </div>
            </MarketingShell>
          }
        />
      </Routes>
    </>
  );
}
=======
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import HealthBadge from './components/HealthBadge';

import WizardLayout from './pages/wizard/WizardLayout';
import TypeSelect from './pages/wizard/TypeSelect';
import BasicInfo from './pages/wizard/BasicInfo';
import Features from './pages/wizard/Features';
import Review from './pages/wizard/Review';
import Done from './pages/wizard/Done';

// 앱 전체 셸 — 헤더(브랜드 + API 헬스 배지) + 라우팅된 본문.
// 생성 위저드는 /sites/new/* 아래에서 WizardLayout 으로 묶고,
// 진행 표시(Steps)와 본문(Outlet) 구조를 공유한다.
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">SiteForge</Link>
        <HealthBadge />
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* 위저드: 유형 → setup/기본정보 → setup/기능 → 결과확인 → mock 완료 */}
          <Route path="/sites/new" element={<WizardLayout />}>
            <Route index element={<Navigate to="type" replace />} />
            <Route path="type" element={<TypeSelect />} />
            <Route path="setup">
              <Route index element={<Navigate to="basic" replace />} />
              <Route path="basic" element={<BasicInfo />} />
              <Route path="features" element={<Features />} />
            </Route>
            <Route path="review" element={<Review />} />
            <Route path="done/:id" element={<Done />} />

            {/* 구(舊) flat 경로 호환 — 새 setup/* 경로로 자동 이전. */}
            <Route path="basic" element={<Navigate to="setup/basic" replace />} />
            <Route path="features" element={<Navigate to="setup/features" replace />} />
          </Route>

          {/* /start 는 생성 플로우 진입점의 별칭. 랜딩 CTA 나 외부 딥링크에서 사용. */}
          <Route path="/start" element={<Navigate to="/sites/new/type" replace />} />

          <Route path="*" element={<p>페이지를 찾을 수 없습니다.</p>} />
        </Routes>
      </main>
    </div>
  );
}
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
