// 인증 토큰 저장소 — localStorage.
// 토큰은 서버 세션의 식별자이므로, 로그아웃 시 삭제 + 서버 세션도 함께 파기.

const KEY_TOKEN = 'creatordesk.auth.token';
const KEY_USER  = 'creatordesk.auth.user';

export interface StoredUser {
  id: number;
  email: string;
  name: string;
}

export function loadAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(KEY_TOKEN);
}

export function saveAuthToken(token: string): void {
  window.localStorage.setItem(KEY_TOKEN, token);
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(KEY_TOKEN);
  window.localStorage.removeItem(KEY_USER);
}

export function loadStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(KEY_USER);
  if (!raw) return null;
  try { return JSON.parse(raw) as StoredUser; }
  catch { return null; }
}

export function saveStoredUser(u: StoredUser): void {
  window.localStorage.setItem(KEY_USER, JSON.stringify(u));
}
