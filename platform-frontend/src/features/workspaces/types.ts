// 워크스페이스 도메인 타입 정의.
// 향후 packages/contracts/ 로 이전 예정.

export type WorkspacePurpose = 'youtube' | 'streaming' | 'shortform' | 'podcast' | 'blog' | 'brand';
export type WorkspaceChannel = 'youtube' | 'twitch' | 'tiktok' | 'instagram' | 'blog' | 'podcast';
export type ContentFormat = 'gaming' | 'info' | 'review' | 'vlog' | 'news' | 'tutorial';
export type ProductionPreset = 'simple' | 'standard' | 'team';
export type ManagementItem = 'script' | 'thumbnail' | 'shooting' | 'upload' | 'performance';
export type WorkspaceTemplateKey = 'youtube-channel' | 'streaming' | 'shortform' | 'blog-newsletter' | 'brand-team';
export type WorkspaceStatus = 'active' | 'paused' | 'archived';

export interface MyWorkspace {
  id: string;
  name: string;
  purpose: WorkspacePurpose;
  channels: WorkspaceChannel[];
  format: ContentFormat;
  templateKey: WorkspaceTemplateKey;
  preset: ProductionPreset;
  items: ManagementItem[];
  createdAt: string;
  status: WorkspaceStatus;
}

export interface WorkspaceCreationState {
  step: number;
  purpose: WorkspacePurpose | null;
  channels: WorkspaceChannel[];
  format: ContentFormat | null;
  preset: ProductionPreset | null;
  items: ManagementItem[];
  templateKey: WorkspaceTemplateKey | null;
  name: string;
}
