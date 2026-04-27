import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import MarketingShell from './components/layout/MarketingShell';
import LatencyOverlay from './components/dev/LatencyOverlay';
import { GuestRoute, ProtectedRoute } from './components/auth/RouteGuards';

// Public (marketing)
import HomePage      from './pages/marketing/HomePage';
import FeaturesPage  from './pages/marketing/FeaturesPage';
import TemplatesPage from './pages/marketing/TemplatesPage';
import PricingPage   from './pages/marketing/PricingPage';
import UseCasesPage  from './pages/marketing/UseCasesPage';
import ContactPage   from './pages/marketing/ContactPage';
import LoginPage          from './pages/auth/LoginPage';
import SignupPage         from './pages/auth/SignupPage';
import OAuthCallbackPage  from './pages/auth/OAuthCallbackPage';

// Authenticated area
import DashboardPage from './pages/app/DashboardPage';
import AdminPlaceholderPage       from './pages/AdminPlaceholderPage';
import SitePreviewPlaceholderPage from './pages/SitePreviewPlaceholderPage';

// Workspace pages
import MyWorkspacesPage  from './pages/workspaces/MyWorkspacesPage';
import WorkspaceNewPage  from './pages/workspaces/WorkspaceNewPage';
import WorkspacePage     from './pages/workspaces/WorkspacePage';

// 라우트 분기 정책:
//   - "/" : 로그인 상태에 따라 /dashboard 또는 마케팅 홈으로 자동 분기
//   - 인증 화면(/login, /signup, /auth/callback): GuestRoute — 로그인됨이면 /dashboard 로 우회
//   - 내부 영역(/dashboard, /workspaces, /admin/*): ProtectedRoute — 비로그인이면 /login 으로
//   - 공개 영역(/features, /templates, /pricing, /use-cases, /contact)은 누구나 접근 가능 (안의 CTA 만 분기)
//   - /sites/:slug 는 생성된 사이트의 공개 런타임 — 접근 제한 없음
//   - /sites, /builder, /app 은 하위 호환 리다이렉트
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
      {/* 개발자 전용 latency/debug 오버레이 */}
      <LatencyOverlay />
      <Routes>
        {/* ---------- Root ---------- */}
        <Route path="/" element={<RootRedirect />} />
        {/* /home 은 인증 여부 무관하게 항상 마케팅 홈을 보여준다 (헤더 로고/홈 버튼 대상) */}
        <Route path="/home" element={<MarketingShell flush><HomePage /></MarketingShell>} />

        {/* ---------- Public marketing ---------- */}
        <Route path="/features"   element={<MarketingShell><FeaturesPage /></MarketingShell>} />
        <Route path="/templates"  element={<MarketingShell><TemplatesPage /></MarketingShell>} />
        <Route path="/pricing"    element={<MarketingShell><PricingPage /></MarketingShell>} />
        <Route path="/use-cases"  element={<MarketingShell><UseCasesPage /></MarketingShell>} />
        <Route path="/customers"  element={<Navigate to="/use-cases" replace />} />
        <Route path="/contact"    element={<MarketingShell><ContactPage /></MarketingShell>} />

        {/* ---------- Auth (guest only) ---------- */}
        <Route path="/login"  element={
          <GuestRoute><MarketingShell flush><LoginPage /></MarketingShell></GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute><MarketingShell flush><SignupPage /></MarketingShell></GuestRoute>
        } />
        <Route path="/auth/callback" element={
          <MarketingShell flush><OAuthCallbackPage /></MarketingShell>
        } />

        {/* ---------- Authenticated app area (protected) ---------- */}
        <Route path="/dashboard" element={
          <ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>
        } />

        {/* 하위 호환 리다이렉트 — /sites, /builder, /app 은 워크스페이스로 연결 */}
        <Route path="/sites"    element={<Navigate to="/workspaces" replace />} />
        <Route path="/builder"  element={<Navigate to="/workspaces/new" replace />} />
        <Route path="/app"      element={<Navigate to="/workspaces" replace />} />

        {/* ---------- Workspace routes ---------- */}
        <Route path="/workspaces" element={
          <ProtectedRoute><AppShell><MyWorkspacesPage /></AppShell></ProtectedRoute>
        } />
        <Route path="/workspaces/new" element={
          <ProtectedRoute><AppShell flush><WorkspaceNewPage /></AppShell></ProtectedRoute>
        } />
        <Route path="/workspaces/:workspaceId" element={
          <ProtectedRoute><AppShell><WorkspacePage /></AppShell></ProtectedRoute>
        } />

        {/* ---------- Admin (legacy) ---------- */}
        <Route path="/admin" element={
          <ProtectedRoute><AppShell><AdminPlaceholderPage /></AppShell></ProtectedRoute>
        } />
        <Route path="/admin/sites/:siteId" element={
          <ProtectedRoute><AppShell><AdminPlaceholderPage /></AppShell></ProtectedRoute>
        } />

        {/* ---------- Public site runtime (멀티페이지 산출물) ---------- */}
        <Route path="/sites/:slug"          element={<AppShell flush><SitePreviewPlaceholderPage /></AppShell>} />
        <Route path="/sites/:slug/:pageKey" element={<AppShell flush><SitePreviewPlaceholderPage /></AppShell>} />

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
    </>
  );
}
