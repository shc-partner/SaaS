import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import { AUTH_HOME, PUBLIC_LOGIN } from '../../features/auth/routes';

// 라우트 단위 인증 가드.
// - ProtectedRoute: 로그인 안 됐으면 /login 으로. 로그인 후 원래 가려던 곳으로 복귀할 수 있도록 state 에 from 저장.
// - GuestRoute   : 이미 로그인됐으면 /dashboard 로 — /login, /signup, /auth/callback 같은 인증 화면이 무한 노출되지 않게.
//
// 부팅 직후 토큰 검증 중(loading) 에는 깜빡임을 막기 위해 빈 화면을 잠깐 보여준다.

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to={PUBLIC_LOGIN} replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
}

interface GuestProps {
  children: ReactNode;
  /** 이미 로그인됐을 때 이동시킬 경로 (기본 /dashboard) */
  redirectTo?: string;
}

export function GuestRoute({ children, redirectTo = AUTH_HOME }: GuestProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (isAuthenticated) {
    // 로그인 후 어딘가로 가려던 흔적이 state.from 에 있으면 우선시.
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from && from !== location.pathname ? from : redirectTo} replace />;
  }
  return <>{children}</>;
}
