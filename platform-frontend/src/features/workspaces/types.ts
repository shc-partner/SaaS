// Workspace domain types.
// These can move into packages/contracts later when backend contracts are added.

export type WorkspacePurpose = 'youtube' | 'streamer' | 'other';
export type WorkspaceChannel = 'youtube' | 'chzzk' | 'soop' | 'twitch' | 'other';
export type ContentFormat = 'gaming' | 'info' | 'review' | 'vlog' | 'news' | 'shortform' | 'blog' | 'other';
export type ProductionPreset = 'simple' | 'standard' | 'team';
export type ManagementItem =
  | 'title'
  | 'status'
  | 'dueDate'
  | 'publishDate'
  | 'contentUrl'
  | 'channel'
  | 'format'
  | 'priority'
  | 'tags'
  | 'memo'
  | 'referenceLinks'
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
  | 'streamStartTime'
  | 'streamEndTime'
  | 'streamTopic'
  | 'vodUrl'
  | 'peakViewers'
  | 'chatIssueMemo'
  | 'gameTitle'
  | 'platform'
  | 'highlightMemo'
  | 'partyMembers'
  | 'gameMode'
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
  | 'sensitivity'
  | 'shortformHook'
  | 'shortformCaption'
  | 'shortformSound'
  | 'keyword'
  | 'seoTitle'
  | 'metaDescription';
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

export interface WorkspaceChannelSetting {
  key: WorkspaceChannel | string;
  label: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface WorkspaceBoardColumn {
  id: string;
  label: string;
  sortOrder: number;
  isDone: boolean;
}

export interface WorkspaceContentField {
  key: ManagementItem | string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'boolean' | 'number' | string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface WorkspaceCalendarEventType {
  key: string;
  label: string;
  color: string;
  sortOrder: number;
}

export type WorkspaceMemberRole = 'admin' | 'member';

export interface WorkspaceMember {
  userId: number;
  email: string;
  name: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
}

export interface MyWorkspace {
  id: string;
  ownerUserId?: number | null;
  name: string;
  description?: string;
  purpose: WorkspacePurpose;
  channels: WorkspaceChannel[];
  format: ContentFormat;
  templateKey: WorkspaceTemplateKey;
  preset: ProductionPreset;
  items: ManagementItem[];
  channelSettings?: WorkspaceChannelSetting[];
  boardColumns?: WorkspaceBoardColumn[];
  contentFields?: WorkspaceContentField[];
  calendarEventTypes?: WorkspaceCalendarEventType[];
  members?: WorkspaceMember[];
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
