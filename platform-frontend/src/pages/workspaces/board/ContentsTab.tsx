import type { MyWorkspace } from '../../../features/workspaces/types';
import { useBoardDispatch, useBoardState } from '../../../features/workspaces/boardStore';
import type { ContentStatus } from '../../../features/workspaces/boardTypes';
import { visibleBoardChannels } from './boardChannels';

const STATUS_META: Record<ContentStatus, {
  label: string;
  nextTask: string;
  progress: number;
}> = {
  idea: { label: '아이디어', nextTask: '기획 정리', progress: 10 },
  planning: { label: '기획중', nextTask: '대본 작성', progress: 25 },
  scripting: { label: '대본 작성', nextTask: '촬영 준비', progress: 38 },
  shooting: { label: '촬영중', nextTask: '편집 진행', progress: 52 },
  editing: { label: '작업중', nextTask: '검수 요청', progress: 68 },
  'edit-review': { label: '검수중', nextTask: '썸네일 확인', progress: 78 },
  thumbnail: { label: '썸네일', nextTask: '예약 등록', progress: 86 },
  scheduled: { label: '예약', nextTask: '게시 확인', progress: 94 },
  published: { label: '완료', nextTask: '성과 확인', progress: 100 },
};

export default function ContentsTab({ workspace: _workspace }: { workspace: MyWorkspace }) {
  const { items } = useBoardState();
  const dispatch = useBoardDispatch();
  const today = new Date().toISOString().slice(0, 10);

  function isOverdue(item: { editDueDate: string; status: string }): boolean {
    return Boolean(item.editDueDate && item.editDueDate < today && item.status !== 'published');
  }

  function deleteItem(itemId: string, title: string) {
    if (!window.confirm(`"${title}" 컨텐츠를 삭제할까요?`)) return;
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  }

  return (
    <div>
      <div className="ws-tab-section-head">
        <h3 className="ws-tab-title">전체 컨텐츠 ({items.length})</h3>
        <button
          type="button"
          className="btn primary"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
        >
          + 새 컨텐츠
        </button>
      </div>

      <div className="ws-contents-table">
        <div className="ws-contents-table-head">
          <span>컨텐츠</span>
          <span>상태</span>
          <span>다음 작업</span>
          <span>시작일자</span>
          <span>마감일자</span>
          <span>담당자</span>
          <span></span>
        </div>
        {items.map((item) => {
          const meta = STATUS_META[item.status];
          return (
            <div
              key={item.id}
              className={`ws-contents-table-row${isOverdue(item) ? ' overdue' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => dispatch({ type: 'SELECT_ITEM', payload: item.id })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') dispatch({ type: 'SELECT_ITEM', payload: item.id });
              }}
            >
              <span className="ws-contents-row-title">
                <span>
                  {item.title}
                  {item.isSponsored && (
                    <span className="ws-badge ws-badge--sponsored" style={{ marginLeft: 6 }}>
                      협찬
                    </span>
                  )}
                </span>
                <small>{visibleBoardChannels(item.channels).join(', ') || '-'}</small>
              </span>
              <span>
                <span className="ws-badge">{meta.label}</span>
              </span>
              <span>{meta.nextTask}</span>
              <span>{item.shootDate || '-'}</span>
              <span>{item.editDueDate || '-'}</span>
              <span>{item.assignee || '-'}</span>
              <span className="ws-contents-row-actions">
                <button
                  type="button"
                  className="ws-contents-delete-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteItem(item.id, item.title);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  삭제
                </button>
              </span>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="ws-contents-empty">컨텐츠가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
