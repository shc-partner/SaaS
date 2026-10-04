import { apiRequest } from './http';

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

export function login(input: { email: string; password: string }): Promise<AuthSession> {
  return apiRequest<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function register(input: { email: string; password: string; name: string }): Promise<AuthSession> {
  return apiRequest<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}

export function me(): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/api/auth/me');
}
