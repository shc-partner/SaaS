import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import {
  AUTH_HOME,
  PUBLIC_LOGIN,
  builderCtaTarget,
  dashboardTarget,
  mySitesTarget,
  startCtaTarget,
  templateCtaTarget,
} from '../../features/auth/routes';

// 공용 CTA — 로그인 상태에 따라 to 가 자동으로 분기된다.
// 비로그인일 때는 /login 으로 보내되, 사용자가 원래 가려던 내부 경로를 state.from 에 넣어주어
// 로그인 직후 그 페이지로 정확히 복귀할 수 있도록 한다.
export type CtaIntent = 'start' | 'builder' | 'template' | 'mySites' | 'dashboard';

interface Props {
  intent: CtaIntent;
  className?: string;
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

/** 로그인 후 도달해야 하는 의도별 내부 경로. */
function authedTarget(intent: CtaIntent): string {
  switch (intent) {
    case 'start':     return AUTH_HOME;     // /dashboard
    case 'builder':   return '/builder';
    case 'template':  return '/builder';
    case 'mySites':   return '/sites';
    case 'dashboard': return '/dashboard';
  }
}

function targetFor(intent: CtaIntent, isAuthed: boolean): string {
  if (!isAuthed) return PUBLIC_LOGIN;
  switch (intent) {
    case 'start':     return startCtaTarget(true);
    case 'builder':   return builderCtaTarget(true);
    case 'template':  return templateCtaTarget(true);
    case 'mySites':   return mySitesTarget(true);
    case 'dashboard': return dashboardTarget(true);
  }
}

export default function AuthAwareCta({ intent, className, children, title, style }: Props) {
  const { isAuthenticated } = useAuth();
  const to = targetFor(intent, isAuthenticated);
  // 비로그인일 때만 from 을 넘긴다 — LoginPage 가 성공 후 이 경로로 replace 이동.
  const state = !isAuthenticated ? { from: authedTarget(intent) } : undefined;
  return (
    <Link to={to} state={state} className={className} title={title} style={style}>
      {children}
    </Link>
  );
}
