// /workspaces/:workspaceId — 워크스페이스 상세 페이지.
// 탭은 ?tab= 쿼리스트링으로 구분한다.
// BoardProvider 를 최상단에서 마운트하여 모든 탭이 동일한 상태를 공유한다.

import { useParams, useSearchParams } from 'react-router-dom';
import useMyWorkspaces from '../../features/workspaces/useMyWorkspaces';
import { PRESET_OPTIONS, CHANNEL_OPTIONS } from '../../features/workspaces/constants';
import { BoardProvider } from '../../features/workspaces/boardStore';
import { useBoardDispatch } from '../../features/workspaces/boardStore';
import { getMockItems, getMockIdeas } from '../../features/workspaces/boardData';
import type { MyWorkspace } from '../../features/workspaces/types';
import BoardTab    from './board/BoardTab';
import CalendarTab from './board/CalendarTab';
import ContentsTab from './board/ContentsTab';
import IdeasTab    from './board/IdeasTab';
import SettingsTab from './board/SettingsTab';
import NewContentModal from './board/NewContentModal';
import NewIdeaModal    from './board/NewIdeaModal';
import { useBoardState } from '../../features/workspaces/boardStore';

type TabKey = 'board' | 'calendar' | 'contents' | 'ideas' | 'settings';

const TABS: { id: TabKey; label: string }[] = [
  { id: 'board',    label: '보드' },
  { id: 'calendar', label: '캘린더' },
  { id: 'contents', label: '콘텐츠' },
  { id: 'ideas',    label: '아이디어' },
  { id: 'settings', label: '설정' },
];

function channelLabel(ch: string): string | null {
  return CHANNEL_OPTIONS.find((c) => c.id === ch)?.label ?? null;
}

function presetLabel(preset: MyWorkspace['preset']): string {
  return PRESET_OPTIONS.find((p) => p.id === preset)?.label ?? preset;
}

// BoardProvider 안쪽에서만 렌더되는 헤더 — dispatch 훅 사용 가능
function WorkspaceHeader({ workspace }: { workspace: MyWorkspace }) {
  const dispatch = useBoardDispatch();
  return (
    <div className="ws-page-header">
      <div className="ws-page-header-info">
        <h1 className="ws-page-title">{workspace.name}</h1>
        {workspace.description && (
          <p className="ws-page-description">{workspace.description}</p>
        )}
        <p className="ws-page-subtitle">
          {workspace.channels.map(channelLabel).filter(Boolean).join(' · ')}
          {workspace.preset ? ` · ${presetLabel(workspace.preset)} 제작 흐름` : ''}
        </p>
      </div>
      <div className="ws-page-actions">
        <button
          type="button"
          className="btn primary"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
        >
          + 새 콘텐츠
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}
        >
          + 아이디어
        </button>
      </div>
    </div>
  );
}

// BoardProvider 안쪽 실제 페이지 — 모달 상태도 여기서 소비
function WorkspaceInner({ workspace }: { workspace: MyWorkspace }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') ?? 'board') as TabKey;
  const { showNewContentModal, showNewIdeaModal } = useBoardState();

  function switchTab(tab: TabKey) {
    setSearchParams({ tab });
  }

  return (
    <div className="ws-page">
      <WorkspaceHeader workspace={workspace} />

      <div className="ws-workspace-layout">
        {/* 탭 네비게이션 */}
        <aside className="ws-tabs" aria-label="워크스페이스 메뉴">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`ws-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="ws-tab-dot" aria-hidden />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* 탭 본문 */}
        <div className="ws-tab-body">
          {activeTab === 'board'    && <BoardTab    workspace={workspace} />}
          {activeTab !== 'board' && (
            <div className="ws-board-main ws-tab-panel-main">
              {activeTab === 'calendar' && <CalendarTab workspace={workspace} />}
              {activeTab === 'contents' && <ContentsTab workspace={workspace} />}
              {activeTab === 'ideas'    && <IdeasTab    workspace={workspace} />}
              {activeTab === 'settings' && <SettingsTab workspace={workspace} />}
            </div>
          )}
        </div>
      </div>

      {/* 보드 탭 이외의 탭에서도 모달 접근 가능하도록 최상위에서 렌더 */}
      {showNewContentModal && activeTab !== 'board' && (
        <NewContentModal workspaceId={workspace.id} />
      )}
      {showNewIdeaModal && activeTab !== 'board' && (
        <NewIdeaModal workspaceId={workspace.id} />
      )}
    </div>
  );
}

// workspaceId 가 localStorage 에 없는 경우 fallback 워크스페이스 생성
function makeFallbackWorkspace(id: string): MyWorkspace {
  return {
    id,
    name: '내 워크스페이스',
    description: '',
    purpose:     'youtube',
    channels:    ['youtube'],
    format:      'info',
    templateKey: 'youtube-channel',
    preset:      'standard',
    items:       ['title', 'status', 'publishDate', 'channel', 'format', 'priority', 'tags', 'memo', 'thumbnail', 'script', 'upload'],
    createdAt:   new Date().toISOString(),
    status:      'active',
  };
}

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { workspaces, loading } = useMyWorkspaces();

  if (loading) {
    return <div className="ws-page-loading">불러오는 중...</div>;
  }

  const id        = workspaceId ?? '';
  const workspace = workspaces.find((w) => w.id === id) ?? makeFallbackWorkspace(id);

  const mockItems = getMockItems(id);
  const mockIdeas = getMockIdeas(id);

  return (
    <BoardProvider initialItems={mockItems} initialIdeas={mockIdeas}>
      <WorkspaceInner workspace={workspace} />
    </BoardProvider>
  );
}
