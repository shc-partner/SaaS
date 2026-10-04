import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useMyWorkspaces from '../../features/workspaces/useMyWorkspaces';
import {
  CHANNEL_OPTIONS,
  FORMAT_OPTIONS,
  ITEM_OPTIONS,
  PRESET_OPTIONS,
} from '../../features/workspaces/constants';
import { BoardProvider, useBoardState } from '../../features/workspaces/boardStore';
import type { ManagementItem, MyWorkspace } from '../../features/workspaces/types';
import BoardTab from './board/BoardTab';
import CalendarTab from './board/CalendarTab';
import ContentsTab from './board/ContentsTab';
import ContentTasksTab from './board/ContentTasksTab';
import TrendTab from './board/TrendTab';
import IdeasTab from './board/IdeasTab';
import SettingsTab from './board/SettingsTab';
import NewContentModal from './board/NewContentModal';
import NewIdeaModal from './board/NewIdeaModal';

type ItemTabKey = `item:${ManagementItem}`;
type TabKey =
  | 'board'
  | 'calendar'
  | 'contents'
  | 'contentTasks'
  | 'trend'
  | 'ideas'
  | 'settings'
  | ItemTabKey;

type TabSection = '운영' | '관리' | '설정';
type ItemCategory =
  | '기본'
  | '제작'
  | '협업'
  | '수익 / 성과'
  | '게임방송 추천'
  | '정보전달 추천'
  | '리뷰/비평 추천'
  | '브이로그 추천'
  | '뉴스/시사 추천'
  | '스트리밍 추천'
  | '숏폼 추천'
  | '블로그/뉴스레터 추천'
  | '기타';

interface WorkspaceTab {
  id: TabKey;
  label: string;
  section: TabSection;
  category?: ItemCategory;
  items?: ManagementItem[];
  description?: string;
}

const ITEM_CATEGORY_ITEMS: ReadonlyArray<{
  title: ItemCategory;
  items: readonly ManagementItem[];
}> = [
  {
    title: '기본',
    items: ['title', 'status', 'dueDate', 'publishDate', 'contentUrl', 'referenceLinks', 'channel', 'format', 'priority', 'tags', 'memo'],
  },
  {
    title: '제작',
    items: ['thumbnail', 'script', 'shooting', 'editing', 'upload', 'scheduled'],
  },
  {
    title: '협업',
    items: ['assignee', 'reviewStatus', 'feedbackMemo', 'notification'],
  },
  {
    title: '수익 / 성과',
    items: ['sponsored', 'sponsorBrand', 'views'],
  },
  {
    title: '게임방송 추천',
    items: ['gameTitle', 'platform', 'gameMode', 'partyMembers', 'highlightMemo', 'streamTime', 'clipProduction', 'vodUpload', 'avgViewers'],
  },
  {
    title: '정보전달 추천',
    items: ['research', 'sourceLinks', 'referenceImages'],
  },
  {
    title: '리뷰/비평 추천',
    items: ['productName', 'comparisonTarget', 'purchaseLink', 'prosConsMemo'],
  },
  {
    title: '브이로그 추천',
    items: ['shootingLocation', 'shootingDate', 'brollCheck', 'musicBgm'],
  },
  {
    title: '뉴스/시사 추천',
    items: ['issueSource', 'publishDeadline', 'factCheck', 'sensitivity', 'keyword'],
  },
  {
    title: '스트리밍 추천',
    items: ['streamStartTime', 'streamEndTime', 'streamTopic', 'vodUrl', 'peakViewers', 'chatIssueMemo'],
  },
  {
    title: '숏폼 추천',
    items: ['shortformHook', 'shortformCaption', 'shortformSound'],
  },
  {
    title: '블로그/뉴스레터 추천',
    items: ['keyword', 'seoTitle', 'metaDescription'],
  },
  {
    title: '기타',
    items: [],
  },
];

function itemCategory(item: ManagementItem): ItemCategory {
  return ITEM_CATEGORY_ITEMS.find((category) => category.items.includes(item))?.title ?? '기타';
}

function itemTabId(item: ManagementItem): ItemTabKey {
  return `item:${item}`;
}

function buildWorkspaceTabs(workspace: MyWorkspace): WorkspaceTab[] {
  const tabs: WorkspaceTab[] = [
    { id: 'board', label: '제작 보드', section: '운영' },
    { id: 'calendar', label: '컨텐츠 캘린더', section: '운영' },
    { id: 'contents', label: '컨텐츠 목록', section: '운영' },
    { id: 'contentTasks', label: '컨작업 관리', section: '운영' },
    { id: 'trend', label: '트렌드 탐색', section: '운영' },
    { id: 'ideas', label: '아이디어 노트', section: '운영' },
  ];

  workspace.items.forEach((item) => {
    const label = itemLabel(item);
    tabs.push({
      id: itemTabId(item),
      label,
      section: '관리',
      category: itemCategory(item),
      items: [item],
      description: `${label} 항목을 사용하는 컨텐츠 카드와 상세 정보를 관리합니다.`,
    });
  });

  tabs.push({ id: 'settings', label: '워크스페이스 설정', section: '설정' });
  return tabs;
}

function tabStorageKey(workspaceId: string): string {
  return `creatordesk.workspace.${workspaceId}.activeTab`;
}

function readStoredTab(workspaceId: string): TabKey | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(tabStorageKey(workspaceId));
  return value ? (value as TabKey) : null;
}

function readUrlTab(): TabKey | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('tab');
  return value ? (value as TabKey) : null;
}

function removeTabFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('tab')) return;

  url.searchParams.delete('tab');
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
}

function writeStoredTab(workspaceId: string, tab: TabKey): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(tabStorageKey(workspaceId), tab);
}

function channelLabel(channel: string): string | null {
  return CHANNEL_OPTIONS.find((option) => option.id === channel)?.label ?? null;
}

function presetLabel(preset: MyWorkspace['preset']): string {
  return PRESET_OPTIONS.find((option) => option.id === preset)?.label ?? preset;
}

function formatLabel(format: MyWorkspace['format']): string {
  return FORMAT_OPTIONS.find((option) => option.id === format)?.label ?? format;
}

function itemLabel(item: ManagementItem): string {
  return ITEM_OPTIONS.find((option) => option.id === item)?.label ?? item;
}

function WorkspaceHeader({ workspace }: { workspace: MyWorkspace }) {
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
          {workspace.format ? ` · ${formatLabel(workspace.format)}` : ''}
        </p>
      </div>
    </div>
  );
}

function WorkspaceConfigPanel({
  title,
  description,
  workspace,
  items = [],
}: {
  title: string;
  description: string;
  workspace: MyWorkspace;
  items?: ManagementItem[];
}) {
  const enabledItems = items.filter((item) => workspace.items.includes(item));

  return (
    <div className="ws-config-panel">
      <div className="ws-tab-section-head">
        <div>
          <h3 className="ws-tab-title">{title}</h3>
          <p className="ws-config-description">{description}</p>
        </div>
      </div>

      <div className="ws-config-card-grid">
        {enabledItems.map((item) => (
          <article key={item} className="ws-config-card">
            <strong>{itemLabel(item)}</strong>
            <span>이 워크스페이스의 컨텐츠 카드와 상세 정보에서 사용하는 관리 항목입니다.</span>
          </article>
        ))}
        {enabledItems.length === 0 && (
          <div className="ws-tab-placeholder">
            <div className="ws-tab-placeholder-icon">!</div>
            <h3>활성화된 항목이 없습니다</h3>
            <p>워크스페이스 설정에서 관리 항목을 추가하면 이 메뉴가 채워집니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkspaceTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: WorkspaceTab[];
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const sections: TabSection[] = ['운영', '관리', '설정'];
  const [collapsedCategories, setCollapsedCategories] = useState<Partial<Record<ItemCategory, boolean>>>({});
  const activeCategory = tabs.find((tab) => tab.id === activeTab)?.category;
  const defaultOpenCategory = ITEM_CATEGORY_ITEMS[0]?.title;

  function toggleCategory(category: ItemCategory) {
    const currentlyCollapsed = category === activeCategory
      ? false
      : collapsedCategories[category] ?? category !== defaultOpenCategory;

    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !currentlyCollapsed,
    }));
  }

  function itemCategoryTabs(tabsInSection: WorkspaceTab[]): Array<{
    category: ItemCategory;
    tabs: WorkspaceTab[];
  }> {
    const orderedCategories = ITEM_CATEGORY_ITEMS.map((category) => category.title);
    const presentCategories = new Set(
      tabsInSection.map((tab) => tab.category ?? '기타'),
    );
    const categories = [
      ...orderedCategories.filter((category) => presentCategories.has(category)),
      ...Array.from(presentCategories).filter((category) => !orderedCategories.includes(category)),
    ];

    return categories.map((category) => ({
      category,
      tabs: tabsInSection.filter((tab) => (tab.category ?? '기타') === category),
    }));
  }

  return (
    <aside className="ws-tabs" aria-label="워크스페이스 메뉴">
      {sections.map((section) => {
        const sectionTabs = tabs.filter((tab) => tab.section === section);
        if (sectionTabs.length === 0) return null;

        return (
          <div key={section} className="ws-tab-group">
            <span className="ws-tab-group-label">{section}</span>
            {section === '관리'
              ? itemCategoryTabs(sectionTabs).map(({ category, tabs }) => {
                  const isActiveCategory = activeCategory === category;
                  const collapsed = isActiveCategory
                    ? false
                    : collapsedCategories[category] ?? category !== defaultOpenCategory;

                  return (
                    <div key={category} className="ws-tab-category">
                      <button
                        type="button"
                        className={`ws-tab-category-head${isActiveCategory ? ' active' : ''}`}
                        onClick={() => toggleCategory(category)}
                        aria-expanded={!collapsed}
                        aria-label={`${category} ${collapsed ? '펼치기' : '접기'}`}
                        data-count={tabs.length}
                      >
                        <span>{category}</span>
                        <span className="ws-tab-category-toggle">{collapsed ? '펼치기' : '접기'}</span>
                      </button>
                      {!collapsed && tabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`ws-tab ws-tab--item${activeTab === tab.id ? ' active' : ''}`}
                          onClick={() => onChange(tab.id)}
                        >
                          <span className="ws-tab-label">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  );
                })
              : sectionTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`ws-tab${activeTab === tab.id ? ' active' : ''}`}
                    onClick={() => onChange(tab.id)}
                  >
                    <span className="ws-tab-label">{tab.label}</span>
                  </button>
                ))}
          </div>
        );
      })}
    </aside>
  );
}

function WorkspaceInner({ workspace }: { workspace: MyWorkspace }) {
  const [currentWorkspace, setCurrentWorkspace] = useState(workspace);
  const tabs = useMemo(() => buildWorkspaceTabs(currentWorkspace), [currentWorkspace]);
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const urlTab = readUrlTab();
    if (urlTab && tabs.some((tab) => tab.id === urlTab)) return urlTab;

    const stored = readStoredTab(currentWorkspace.id);
    return stored && tabs.some((tab) => tab.id === stored) ? stored : 'board';
  });
  const activeTabMeta = tabs.find((tab) => tab.id === activeTab);
  const { showNewContentModal, showNewIdeaModal } = useBoardState();

  useEffect(() => {
    setCurrentWorkspace(workspace);
  }, [workspace]);

  useEffect(() => {
    const urlTab = readUrlTab();
    if (urlTab && tabs.some((tab) => tab.id === urlTab)) {
      setActiveTab(urlTab);
      writeStoredTab(currentWorkspace.id, urlTab);
      removeTabFromUrl();
      return;
    }
    removeTabFromUrl();

    const stored = readStoredTab(currentWorkspace.id);
    setActiveTab(stored && tabs.some((tab) => tab.id === stored) ? stored : 'board');
  }, [tabs, currentWorkspace.id]);

  function switchTab(tab: TabKey) {
    setActiveTab(tab);
    writeStoredTab(currentWorkspace.id, tab);
  }

  return (
    <div className="ws-page">
      <div className="ws-workspace-layout">
        <WorkspaceTabs tabs={tabs} activeTab={activeTab} onChange={switchTab} />

        <div className="ws-workspace-content">
          <WorkspaceHeader workspace={currentWorkspace} />

          <div className="ws-tab-body">
            {activeTab === 'board' && <BoardTab workspace={currentWorkspace} />}
            {activeTab !== 'board' && (
              <div className="ws-board-main ws-tab-panel-main">
                {activeTab === 'calendar' && <CalendarTab workspace={currentWorkspace} />}
                {activeTab === 'contents' && <ContentsTab workspace={currentWorkspace} />}
                {activeTab === 'contentTasks' && <ContentTasksTab workspace={currentWorkspace} />}
                {activeTab === 'trend' && <TrendTab workspace={currentWorkspace} />}
                {activeTab === 'ideas' && <IdeasTab workspace={currentWorkspace} />}
                {activeTab === 'settings' && (
                  <SettingsTab
                    workspace={currentWorkspace}
                    onWorkspaceUpdated={setCurrentWorkspace}
                  />
                )}
                {activeTab.startsWith('item:') && activeTabMeta && (
                  <WorkspaceConfigPanel
                    title={activeTabMeta.label}
                    description={activeTabMeta.description ?? '선택한 관리 항목입니다.'}
                    workspace={currentWorkspace}
                    items={activeTabMeta.items}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewContentModal && activeTab !== 'board' && (
        <NewContentModal workspaceId={currentWorkspace.id} />
      )}
      {showNewIdeaModal && activeTab !== 'board' && (
        <NewIdeaModal workspaceId={currentWorkspace.id} />
      )}
    </div>
  );
}

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { workspaces, loading } = useMyWorkspaces();

  if (loading) {
    return <div className="ws-page-loading">불러오는 중...</div>;
  }

  const id = workspaceId ?? '';
  const workspace = workspaces.find((item) => item.id === id);

  if (!workspace) {
    return (
      <div className="ws-page-loading">
        <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
          <strong>워크스페이스를 찾을 수 없습니다.</strong>
          <span>현재 계정에서 접근할 수 없는 워크스페이스입니다.</span>
          <Link to="/workspaces" className="btn primary">워크스페이스로 이동</Link>
        </div>
      </div>
    );
  }

  return (
    <BoardProvider key={id} workspaceId={id} initialItems={[]} initialIdeas={[]}>
      <WorkspaceInner workspace={workspace} />
    </BoardProvider>
  );
}
