// 인증 API 클라이언트.
// 토큰은 Authorization: Bearer 헤더로 전달. 토큰 자체는 localStorage 에 저장한다 (authStorage).

import { loadAuthToken } from '../features/auth/storage';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
}
export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

interface ApiOk<T>   { ok: true;  data: T }
interface ApiError   { ok: false; error: { code: string; message: string; details?: unknown } }
type ApiEnvelope<T> = ApiOk<T> | ApiError;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = loadAuthToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  let body: ApiEnvelope<T>;
  try {
    body = await res.json();
  } catch {
    throw new Error(`서버 응답을 파싱할 수 없습니다 (status ${res.status})`);
  }
  if (!body.ok) {
    throw new Error(body.error.message || body.error.code || 'API 오류');
  }
  return body.data;
}

export function register(input: { email: string; password: string; name: string }): Promise<AuthSession> {
  return call<AuthSession>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) });
}
export function login(input: { email: string; password: string }): Promise<AuthSession> {
  return call<AuthSession>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) });
}
export function logout(): Promise<{ ok: boolean }> {
  return call<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}
export function me(): Promise<{ user: AuthUser }> {
  return call<{ user: AuthUser }>('/api/auth/me');
}
