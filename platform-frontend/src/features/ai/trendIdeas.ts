import { apiRequest } from '../../api/http';
import type { TrendVideo } from '../youtube/trends';

export interface AiTrendIdea {
  title: string;
  angle: string;
  hook: string;
  thumbnailText: string;
  format: string;
  difficulty: string;
  targetAudience: string;
  productionNotes: string;
  tags: string[];
}

export interface FetchTrendIdeasParams {
  workspaceId: string;
  video: TrendVideo;
  count?: number;
}

export interface AiUsageQuota {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  feature: string;
}

export interface FetchTrendIdeasResult {
  ideas: AiTrendIdea[];
  usage?: AiUsageQuota;
}

export async function fetchTrendIdeas({
  workspaceId,
  video,
  count = 5,
}: FetchTrendIdeasParams): Promise<FetchTrendIdeasResult> {
  const data = await apiRequest<FetchTrendIdeasResult>('/api/ai/trend-ideas', {
    method: 'POST',
    body: JSON.stringify({ workspaceId, video, count }),
  });

  return {
    ideas: data.ideas ?? [],
    usage: data.usage,
  };
}

export async function fetchTrendIdeasFromVideos({
  workspaceId,
  videos,
  count = 7,
}: {
  workspaceId: string;
  videos: TrendVideo[];
  count?: number;
}): Promise<FetchTrendIdeasResult> {
  const data = await apiRequest<FetchTrendIdeasResult>('/api/ai/trend-ideas/from-videos', {
    method: 'POST',
    body: JSON.stringify({ workspaceId, videos, count }),
  });

  return {
    ideas: data.ideas ?? [],
    usage: data.usage,
  };
}
