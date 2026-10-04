// 보드 탭 — 칸반 레이아웃 진입점.
// 프리셋에 따라 컬럼 구성이 달라진다.

import { useEffect } from 'react';
import type { MyWorkspace } from '../../../features/workspaces/types';
import type { ProductionPreset } from '../../../features/workspaces/types';
import { COLUMNS_BY_PRESET } from '../../../features/workspaces/boardData';
import { useBoardState, useBoardDispatch } from '../../../features/workspaces/boardStore';
import type { BoardColumn } from '../../../features/workspaces/boardTypes';
import KanbanColumn from './KanbanColumn';
import BoardFilters from './BoardFilters';
import BoardSummary from './BoardSummary';
import ContentDetailPanel from './ContentDetailPanel';
import NewContentModal from './NewContentModal';
import NewIdeaModal from './NewIdeaModal';
import { matchesBoardChannel } from './boardChannels';

interface Props {
  workspace: MyWorkspace;
}

function BoardHero({ workspace }: Props) {
  const dispatch = useBoardDispatch();

  return (
    <section className="ws-board-hero" aria-label="Workspace overview">
      <div className="ws-board-hero-copy">
        <span className="ws-board-kicker">CreatorDesk workspace</span>
        <h2>
          오늘도 <span>콘텐츠</span>를
          <br />
          완성해 볼까요?
        </h2>
        <p>{workspace.name}의 아이디어, 제작 일정, 발행 준비를 한 화면에서 정리합니다.</p>
      </div>
      <div className="ws-board-hero-actions">
        <button
          type="button"
          className="ws-hero-primary"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
        >
          <span aria-hidden="true">+</span>
          새 콘텐츠
        </button>
        <button
          type="button"
          className="ws-hero-secondary"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}
        >
          <span aria-hidden="true">◇</span>
          아이디어 추가
        </button>
      </div>
    </section>
  );
}

function BoardInsights({ columns }: { columns: BoardColumn[] }) {
  const { items, ideas, selectedItemId } = useBoardState();
  const selected = items.find((item) => item.id === selectedItemId);
  const upcoming = [...items]
    .filter((item) => item.publishDate || item.editDueDate || item.shootDate)
    .sort((a, b) => {
      const left = new Date(a.publishDate || a.editDueDate || a.shootDate).getTime();
      const right = new Date(b.publishDate || b.editDueDate || b.shootDate).getTime();
      return left - right;
    })
    .slice(0, 3);
  const published = items.filter((item) => item.status === 'published').length;
  const scheduled = items.filter((item) => item.status === 'scheduled').length;
  const active = Math.max(items.length - published, 0);
  const completionRate = items.length > 0 ? Math.round((published / items.length) * 100) : 0;

  return (
    <aside className="ws-insight-stack" aria-label="Workspace insights">
      <section className="ws-insight-panel">
        <div className="ws-insight-head">
          <strong>다가오는 일정</strong>
          <span>이번 주</span>
        </div>
        <div className="ws-schedule-list">
          {upcoming.map((item) => {
            const date = item.publishDate || item.editDueDate || item.shootDate;
            return (
              <article key={item.id} className="ws-schedule-card">
                <div className="ws-schedule-date">
                  <span>{date.slice(5, 7)}.{date.slice(8, 10)}</span>
                  <small>{item.status === 'scheduled' ? '발행' : '제작'}</small>
                </div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.assignee || '담당자 미정'} · {item.contentFormat || '콘텐츠'}</p>
                </div>
              </article>
            );
          })}
          {upcoming.length === 0 && (
            <div className="ws-insight-empty">예정된 일정이 없습니다.</div>
          )}
        </div>
      </section>

      <section className="ws-insight-panel">
        <div className="ws-insight-head">
          <strong>채널 퍼포먼스</strong>
          <span>운영 요약</span>
        </div>
        <div className="ws-metric-grid">
          <div>
            <span>진행 중</span>
            <strong>{active}</strong>
          </div>
          <div>
            <span>예약</span>
            <strong>{scheduled}</strong>
          </div>
          <div>
            <span>아이디어</span>
            <strong>{ideas.length}</strong>
          </div>
        </div>
        <div className="ws-progress-widget">
          <div>
            <span>완료율</span>
            <strong>{completionRate}%</strong>
          </div>
          <div className="ws-progress-track">
            <span style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </section>

      <section className="ws-insight-panel ws-insight-panel--compact">
        <div className="ws-insight-head">
          <strong>파이프라인</strong>
          <span>{columns.length}단계</span>
        </div>
        <div className="ws-stage-dots">
          {columns.map((column) => (
            <span
              key={column.id}
              className={items.some((item) => item.status === column.id) ? 'active' : ''}
              title={column.label}
            />
          ))}
        </div>
      </section>

      {selected && (
        <section className="ws-insight-panel ws-selected-preview">
          <div className="ws-insight-head">
            <strong>선택한 콘텐츠</strong>
            <span>{selected.status}</span>
          </div>
          <h3>{selected.title}</h3>
          <p>{selected.editingNotes || selected.script || '상세 패널에서 제작 자산을 정리하세요.'}</p>
        </section>
      )}
    </aside>
  );
}

export default function BoardTab({ workspace }: Props) {
  const {
    items,
    selectedItemId,
    showNewContentModal,
    showNewIdeaModal,
    filterChannel,
    filterFormat,
    searchQuery,
  } = useBoardState();
  const dispatch = useBoardDispatch();

  const preset: ProductionPreset = workspace.preset ?? 'standard';
  const columns: BoardColumn[] = workspace.boardColumns && workspace.boardColumns.length > 0
    ? workspace.boardColumns.map((column) => ({ id: column.id as BoardColumn['id'], label: column.label }))
    : COLUMNS_BY_PRESET[preset] ?? COLUMNS_BY_PRESET.standard;

  useEffect(() => {
    const firstColId = columns[0]?.id;
    if (!firstColId) return;
    const firstItem = items.find((item) => item.status === firstColId);
    if (firstItem) dispatch({ type: 'SELECT_ITEM', payload: firstItem.id });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 필터 적용
  const filtered = items.filter((item) => {
    if (!matchesBoardChannel(item.channels, filterChannel)) return false;
    if (filterFormat  && item.contentFormat !== filterFormat)    return false;
    if (searchQuery   && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="ws-board-layout">
      {/* 칸반 메인 영역 */}
      <div className={`ws-board-main${selectedItemId ? ' ws-board-main--panel-open' : ''}`}>
        <BoardHero workspace={workspace} />
        <BoardSummary />
        <BoardFilters />

        <div className="ws-kanban-board">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              items={filtered.filter((item) => item.status === col.id)}
            />
          ))}
        </div>
      </div>

      {/* 우측 상세 패널 */}
      <div className="ws-board-panel ws-board-panel--insights">
        <BoardInsights columns={columns} />
        {selectedItemId && <ContentDetailPanel />}
      </div>

      {/* 모달 */}
      {showNewContentModal && <NewContentModal workspaceId={workspace.id} />}
      {showNewIdeaModal    && <NewIdeaModal    workspaceId={workspace.id} />}
    </div>
  );
}
