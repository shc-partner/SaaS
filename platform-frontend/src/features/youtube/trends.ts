export type TrendPeriod = '24h' | '3d' | '7d' | '30d';
export type TrendSort = 'trend' | 'views' | 'latest';
export type TrendMode = 'category' | 'search';
export type TrendLimit = 50 | 100;

export interface TrendVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  trendScore: number;
  youtubeUrl: string;
  categoryId: string;
  regionCode: string;
}

export interface YoutubeTrendCategory {
  idx: number;
  category_id: string;
  category_name: string;
  api_name: string | null;
  is_enabled: number;
  sort_order: number;
  reg_date: string;
  mod_date: string | null;
}

export interface FetchTrendVideosParams {
  mode: TrendMode;
  regionCode: string;
  categoryId: string;
  keyword: string;
  period: TrendPeriod;
  sort: TrendSort;
  limit: TrendLimit;
}

export interface TrendVideosMeta {
  mode: TrendMode;
  keyword: string;
  regionCode: string;
  categoryId: string;
  period: TrendPeriod;
  sort: TrendSort;
  limit: TrendLimit;
  cachedForSeconds: number;
  categoryFallback?: boolean;
  message?: string;
}

export interface TrendVideosResult {
  items: TrendVideo[];
  meta?: TrendVideosMeta;
}

interface ApiResponse {
  ok: boolean;
  data?: {
    items?: TrendVideo[];
    meta?: TrendVideosMeta;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface CategoryApiResponse {
  ok: boolean;
  data?: {
    items?: YoutubeTrendCategory[];
    message?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export async function fetchTrendVideos({
  mode,
  regionCode,
  categoryId,
  keyword,
  period,
  sort,
  limit,
}: FetchTrendVideosParams): Promise<TrendVideosResult> {
  const params = new URLSearchParams({
    mode,
    regionCode,
    period,
    sort,
    limit: String(limit),
  });
  if (mode === 'search') {
    params.set('keyword', keyword);
  } else {
    params.set('categoryId', categoryId);
  }
  const response = await fetch(`/api/youtube/trends?${params.toString()}`);
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error?.message ?? '트렌드 영상을 불러오지 못했습니다.');
  }

  return {
    items: payload.data?.items ?? [],
    meta: payload.data?.meta,
  };
}

export async function fetchYoutubeTrendCategories(workspaceId: string, enabledOnly = false): Promise<YoutubeTrendCategory[]> {
  const params = new URLSearchParams({
    workspaceId,
    enabledOnly: enabledOnly ? '1' : '0',
  });
  const response = await fetch(`/api/youtube/trend-categories?${params.toString()}`);
  const payload = (await response.json()) as CategoryApiResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error?.message ?? '카테고리를 불러오지 못했습니다.');
  }

  return payload.data?.items ?? [];
}

export async function saveYoutubeTrendCategories(
  workspaceId: string,
  enabledCategoryIds: string[],
): Promise<YoutubeTrendCategory[]> {
  const response = await fetch('/api/youtube/trend-categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspaceId, enabledCategoryIds }),
  });
  const payload = (await response.json()) as CategoryApiResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error?.message ?? '카테고리를 저장하지 못했습니다.');
  }

  return payload.data?.items ?? [];
}

export async function restoreDefaultYoutubeTrendCategories(workspaceId: string): Promise<YoutubeTrendCategory[]> {
  const response = await fetch('/api/youtube/trend-categories/defaults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspaceId }),
  });
  const payload = (await response.json()) as CategoryApiResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error?.message ?? '기본값을 복원하지 못했습니다.');
  }

  return payload.data?.items ?? [];
}
