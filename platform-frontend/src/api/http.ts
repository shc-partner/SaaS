import { loadAuthToken } from '../features/auth/storage';

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; details?: Record<string, unknown> };
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = loadAuthToken();
  const headers = new Headers(init.headers);

  if (init.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(path, { ...init, headers });
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.ok) {
    const message = payload?.error?.message ?? 'API 요청에 실패했습니다.';
    const reason = payload?.error?.details?.reason;
    throw new Error(typeof reason === 'string' && reason !== '' ? `${message} (${reason})` : message);
  }

  return payload.data as T;
}
