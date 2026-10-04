// 칸반 보드 전용 타입 정의.
// ContentItem — 컨텐츠 제작 단위, Idea — 아이디어 카드, BoardColumn — 칸반 컬럼.

export type ContentStatus =
  | 'idea'
  | 'planning'
  | 'scripting'
  | 'shooting'
  | 'editing'
  | 'edit-review'
  | 'thumbnail'
  | 'scheduled'
  | 'published';

export type Priority = 'high' | 'medium' | 'low';
export type ContentTaskRequestStatus =
  | 'requested'
  | 'in-progress'
  | 'review-requested'
  | 'review-completed'
  | 'completed';

export interface ContentItem {
  id: string;
  workspaceId: string;
  title: string;
  status: ContentStatus;
  channels: string[];
  contentFormat: string;
  tags: string[];
  assignee: string;
  priority: Priority;
  script: string;
  titleCandidates: string[];
  thumbnailTexts: string[];
  editingNotes: string;
  referenceLinks: string[];
  publishDate: string;
  shootDate: string;
  editDueDate: string;
  isSponsored: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  workspaceId: string;
  title: string;
  source: string;
  priority: Priority;
  tags: string[];
  memo: string;
  referenceLinks: string[];
  createdAt: string;
}

export interface ContentTaskRequest {
  id: string;
  workspaceId: string;
  contentItemId: string;
  taskName: string;
  description: string;
  requester: string;
  worker: string;
  reviewer: string;
  status: ContentTaskRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: ContentStatus;
  label: string;
}

export interface BoardState {
  workspaceId: string;
  boardLoaded: boolean;
  items: ContentItem[];
  ideas: Idea[];
  taskRequests: ContentTaskRequest[];
  selectedItemId: string | null;
  showNewContentModal: boolean;
  showNewIdeaModal: boolean;
  filterChannel: string;
  filterFormat: string;
  filterStatus: string;
  searchQuery: string;
}

export type BoardAction =
  | { type: 'HYDRATE_BOARD'; payload: { items: ContentItem[]; ideas: Idea[]; taskRequests?: ContentTaskRequest[] } }
  | { type: 'ADD_ITEM'; payload: ContentItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_IDEA'; payload: Idea }
  | { type: 'ADD_TASK_REQUEST'; payload: ContentTaskRequest }
  | { type: 'UPDATE_TASK_REQUEST_STATUS'; payload: { id: string; status: ContentTaskRequestStatus } }
  | { type: 'UPDATE_ITEM_STATUS'; payload: { id: string; status: ContentStatus } }
  | { type: 'UPDATE_ITEM_DATES'; payload: { id: string; shootDate: string; editDueDate: string; publishDate: string } }
  | { type: 'SELECT_ITEM'; payload: string | null }
  | { type: 'TOGGLE_NEW_CONTENT_MODAL' }
  | { type: 'TOGGLE_NEW_IDEA_MODAL' }
  | { type: 'SET_FILTER_CHANNEL'; payload: string }
  | { type: 'SET_FILTER_FORMAT'; payload: string }
  | { type: 'SET_FILTER_STATUS'; payload: string }
  | { type: 'SET_SEARCH'; payload: string };
