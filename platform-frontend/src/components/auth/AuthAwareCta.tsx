import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import {
  AUTH_HOME,
  PUBLIC_LOGIN,
  dashboardTarget,
  startCtaTarget,
  templateCtaTarget,
  workspaceNewTarget,
  workspacesTarget,
} from '../../features/auth/routes';

export type CtaIntent = 'start' | 'workspaceNew' | 'template' | 'workspaces' | 'dashboard';

interface Props {
  intent: CtaIntent;
  className?: string;
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

function authedTarget(intent: CtaIntent): string {
  switch (intent) {
    case 'start': return AUTH_HOME;
    case 'workspaceNew': return '/workspaces/new';
    case 'template': return '/workspaces/new';
    case 'workspaces': return '/workspaces';
    case 'dashboard': return '/dashboard';
  }
}

function targetFor(intent: CtaIntent, isAuthed: boolean): string {
  if (!isAuthed) return PUBLIC_LOGIN;
  switch (intent) {
    case 'start': return startCtaTarget(true);
    case 'workspaceNew': return workspaceNewTarget(true);
    case 'template': return templateCtaTarget(true);
    case 'workspaces': return workspacesTarget(true);
    case 'dashboard': return dashboardTarget(true);
  }
}

export default function AuthAwareCta({ intent, className, children, title, style }: Props) {
  const { isAuthenticated } = useAuth();
  const to = targetFor(intent, isAuthenticated);
  const state = !isAuthenticated ? { from: authedTarget(intent) } : undefined;

  return (
    <Link to={to} state={state} className={className} title={title} style={style}>
      {children}
    </Link>
  );
}
