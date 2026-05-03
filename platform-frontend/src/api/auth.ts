// Mock auth — 백엔드 없이 localStorage 기반으로 동작하는 MVP용 구현.
// AuthProvider, LoginPage, SignupPage 등은 이 파일만 보므로 인터페이스를 그대로 유지한다.

import { loadStoredUser } from '../features/auth/storage';

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

function makeMockUser(email: string, name?: string): AuthUser {
  return {
    id: 1,
    email,
    name: name ?? email.split('@')[0],
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
}

function makeMockSession(email: string, name?: string): AuthSession {
  return {
    user: makeMockUser(email, name),
    token: `mock-token-${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function login(input: { email: string; password: string }): Promise<AuthSession> {
  if (!input.email || !input.password) {
    return Promise.reject(new Error('이메일과 비밀번호를 입력해주세요'));
  }
  return Promise.resolve(makeMockSession(input.email));
}

export function register(input: { email: string; password: string; name: string }): Promise<AuthSession> {
  if (!input.email || !input.password) {
    return Promise.reject(new Error('이메일과 비밀번호를 입력해주세요'));
  }
  return Promise.resolve(makeMockSession(input.email, input.name));
}

export function logout(): Promise<{ ok: boolean }> {
  return Promise.resolve({ ok: true });
}

// 앱 마운트 시 AuthProvider 가 토큰 유효성 검증에 호출한다.
// mock 에서는 localStorage 에 저장된 사용자 정보를 그대로 반환한다.
export function me(): Promise<{ user: AuthUser }> {
  const stored = loadStoredUser();
  if (!stored) return Promise.reject(new Error('세션이 만료되었습니다'));
  return Promise.resolve({
    user: {
      id: stored.id,
      email: stored.email,
      name: stored.name,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  });
}
