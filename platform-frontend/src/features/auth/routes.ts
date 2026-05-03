export const PUBLIC_SIGNUP = '/signup' as const;
export const PUBLIC_LOGIN = '/login' as const;
export const AUTH_HOME = '/dashboard' as const;

export function startCtaTarget(isAuthed: boolean): string {
  return isAuthed ? AUTH_HOME : PUBLIC_LOGIN;
}

export function workspaceNewTarget(isAuthed: boolean): string {
  return isAuthed ? '/workspaces/new' : PUBLIC_LOGIN;
}

export function templateCtaTarget(isAuthed: boolean): string {
  return isAuthed ? '/workspaces/new' : PUBLIC_LOGIN;
}

export function workspacesTarget(isAuthed: boolean): string {
  return isAuthed ? '/workspaces' : PUBLIC_LOGIN;
}

export function dashboardTarget(isAuthed: boolean): string {
  return isAuthed ? '/dashboard' : PUBLIC_LOGIN;
}

export const explicitLogin = PUBLIC_LOGIN;
export const explicitSignup = PUBLIC_SIGNUP;
