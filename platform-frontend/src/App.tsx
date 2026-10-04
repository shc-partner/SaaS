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
          <ProtectedRoute><AppShell fullScreen><WorkspacePage /></AppShell></ProtectedRoute>
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
