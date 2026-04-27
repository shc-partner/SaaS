// 콘텐츠 탭 — 전체 콘텐츠 목록을 테이블 형태로 표시.

import type { MyWorkspace } from '../../../features/workspaces/types';
import { useBoardState, useBoardDispatch } from '../../../features/workspaces/boardStore';

// 상태 ID → 한국어 레이블 매핑
const STATUS_LABEL: Record<string, string> = {
  idea:          '아이디어',
  planning:      '기획중',
  scripting:     '대본 작성',
  shooting:      '촬영중',
  editing:       '편집중',
  'edit-review': '검수중',
  thumbnail:     '썸네일',
  scheduled:     '예약됨',
  published:     '발행완료',
};

export default function ContentsTab({ workspace: _w }: { workspace: MyWorkspace }) {
  const { items } = useBoardState();
  const dispatch  = useBoardDispatch();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>전체 콘텐츠 ({items.length})</h3>
        <button
          type="button"
          className="btn primary"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
        >
          + 새 콘텐츠
        </button>
      </div>

      <div className="ws-contents-table">
        <div className="ws-contents-table-head">
          <span>제목</span>
          <span>채널</span>
          <span>형식</span>
          <span>상태</span>
          <span>업로드 예정</span>
          <span>담당자</span>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="ws-contents-table-row"
            role="button"
            tabIndex={0}
            onClick={() => dispatch({ type: 'SELECT_ITEM', payload: item.id })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') dispatch({ type: 'SELECT_ITEM', payload: item.id });
            }}
          >
            <span className="ws-contents-row-title">
              {item.title}
              {item.isSponsored && (
                <span className="ws-badge ws-badge--sponsored" style={{ marginLeft: 6 }}>협찬</span>
              )}
            </span>
            <span>{item.channels.join(', ')}</span>
            <span>{item.contentFormat || '—'}</span>
            <span>
              <span className="ws-badge">{STATUS_LABEL[item.status] ?? item.status}</span>
            </span>
            <span>{item.publishDate || '—'}</span>
            <span>{item.assignee || '—'}</span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="ws-contents-empty">콘텐츠가 없습니다.</div>
        )}
      </div>

      {/* 콘텐츠 탭에서도 상세 패널·모달 접근 가능 */}
    </div>
  );
}
