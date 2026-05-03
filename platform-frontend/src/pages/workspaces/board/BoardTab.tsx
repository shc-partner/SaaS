// 보드 탭 — 칸반 레이아웃 진입점.
// 프리셋에 따라 컬럼 구성이 달라진다.

import { useEffect } from 'react';
import type { MyWorkspace } from '../../../features/workspaces/types';
import type { ProductionPreset } from '../../../features/workspaces/types';
import { COLUMNS_BY_PRESET } from '../../../features/workspaces/boardData';
import { useBoardState, useBoardDispatch } from '../../../features/workspaces/boardStore';
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
  const columns = COLUMNS_BY_PRESET[preset] ?? COLUMNS_BY_PRESET.standard;

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
      {selectedItemId && (
        <div className="ws-board-panel">
          <ContentDetailPanel />
        </div>
      )}

      {/* 모달 */}
      {showNewContentModal && <NewContentModal workspaceId={workspace.id} />}
      {showNewIdeaModal    && <NewIdeaModal    workspaceId={workspace.id} />}
    </div>
  );
}
