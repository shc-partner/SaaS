// 사이트 API 클라이언트.
// vite dev 가 /api 를 백엔드(8080)로 프록시하므로 base 는 상대경로 그대로 둔다.
// 모든 호출은 Bearer 토큰을 자동으로 부착 — 사이트는 본인 것만 다룬다.

import type { SiteData } from '@app/site-renderer';
import { loadAuthToken } from '../features/auth/storage';
import type { PageContent, PageKey, SiteFeatureKey } from '../features/siteBuilder/types';

interface ApiOk<T>   { ok: true;  data: T }
interface ApiError   { ok: false; error: { code: string; message: string; details?: unknown } }
type ApiEnvelope<T> = ApiOk<T> | ApiError;

export interface CreateSiteRequest {
  siteType: 'company';
  selectedTemplateKey?: string;
  basic: { siteName: string; slug: string; industry: string; summary: string };
  selectedPages: PageKey[];
  pageContents: Partial<Record<PageKey, PageContent>>;
  features: SiteFeatureKey[];
}

/** /api/me/sites 응답 — 대시보드/내 사이트 목록 카드에 필요한 만큼만 담는다. */
export interface MySiteSummary {
  id: number;
  slug: string;
  type: string;
  name: string;
  status: 'published' | 'draft' | 'wip' | string;
  createdAt: string;
  updatedAt: string;
  adminRequired: boolean;
  pages: Array<{ key: string; label: string; path: string }>;
}

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

export function createSite(req: CreateSiteRequest): Promise<SiteData> {
  return call<SiteData>('/api/sites', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export function fetchSiteBySlug(slug: string): Promise<SiteData> {
  return call<SiteData>(`/api/public/sites/${encodeURIComponent(slug)}`);
}

export function fetchSiteById(id: number | string): Promise<SiteData> {
  return call<SiteData>(`/api/sites/${encodeURIComponent(String(id))}`);
}

/** 현재 로그인한 사용자가 만든 사이트 목록. 비로그인이면 401 → 빈 배열로 강등. */
export function fetchMySites(): Promise<MySiteSummary[]> {
  return call<MySiteSummary[]>('/api/me/sites');
}
