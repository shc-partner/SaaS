// Workspace domain types.
// These can move into packages/contracts later when backend contracts are added.

export type WorkspacePurpose = 'youtube' | 'streamer' | 'other';
export type WorkspaceChannel = 'youtube' | 'chzzk' | 'soop' | 'twitch' | 'other';
export type ContentFormat = 'gaming' | 'info' | 'review' | 'vlog' | 'news' | 'other';
export type ProductionPreset = 'simple' | 'standard' | 'team';
export type ManagementItem =
  | 'title'
  | 'status'
  | 'publishDate'
  | 'channel'
  | 'format'
  | 'priority'
  | 'tags'
  | 'memo'
  | 'thumbnail'
  | 'script'
  | 'shooting'
  | 'editing'
  | 'upload'
  | 'scheduled'
  | 'assignee'
  | 'reviewStatus'
  | 'feedbackMemo'
  | 'notification'
  | 'sponsored'
  | 'sponsorBrand'
  | 'views'
  | 'avgViewers'
  | 'gameTitle'
  | 'platform'
  | 'streamTime'
  | 'clipProduction'
  | 'vodUpload'
  | 'research'
  | 'sourceLinks'
  | 'referenceImages'
  | 'productName'
  | 'comparisonTarget'
  | 'purchaseLink'
  | 'prosConsMemo'
  | 'shootingLocation'
  | 'shootingDate'
  | 'brollCheck'
  | 'musicBgm'
  | 'issueSource'
  | 'publishDeadline'
  | 'factCheck'
  | 'sensitivity';
export type WorkspaceTemplateKey =
  | 'creator-simple'
  | 'creator-standard'
  | 'creator-team'
  | 'youtube-channel'
  | 'streaming'
  | 'shortform'
  | 'blog-newsletter'
  | 'brand-team';
export type WorkspaceStatus = 'active' | 'paused' | 'archived';

export interface MyWorkspace {
  id: string;
  name: string;
  description?: string;
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
  name: string;
  description: string;
  purpose: WorkspacePurpose | null;
  channels: WorkspaceChannel[];
  format: ContentFormat | null;
  preset: ProductionPreset | null;
  items: ManagementItem[];
}
