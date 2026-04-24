// 사이트 API 클라이언트.
// vite dev 가 /api 를 백엔드(8080)로 프록시하므로 base 는 상대경로 그대로 둔다.

import type { SiteData } from '@app/site-renderer';
import type { PageContent, PageKey, SiteFeatureKey } from '../features/siteBuilder/types';

interface ApiOk<T>   { ok: true;  data: T }
interface ApiError   { ok: false; error: { code: string; message: string; details?: unknown } }
type ApiEnvelope<T> = ApiOk<T> | ApiError;

export interface CreateSiteRequest {
  siteType: 'company';
  basic: { siteName: string; slug: string; industry: string; summary: string };
  selectedPages: PageKey[];
  pageContents: Partial<Record<PageKey, PageContent>>;
  features: SiteFeatureKey[];
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
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
