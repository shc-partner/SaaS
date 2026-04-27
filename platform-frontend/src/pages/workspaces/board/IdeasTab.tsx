// 아이디어 탭 — 아이디어 카드 목록을 그리드로 표시.

import type { MyWorkspace } from '../../../features/workspaces/types';
import { useBoardState, useBoardDispatch } from '../../../features/workspaces/boardStore';
import type { Priority } from '../../../features/workspaces/boardTypes';

const PRIORITY_LABEL: Record<Priority, string> = {
  high:   '높음',
  medium: '보통',
  low:    '낮음',
};

const PRIORITY_COLOR: Record<Priority, string> = {
  high:   'var(--red-500, #ef4444)',
  medium: 'var(--amber-500, #f59e0b)',
  low:    'var(--text-3)',
};

export default function IdeasTab({ workspace: _w }: { workspace: MyWorkspace }) {
  const { ideas } = useBoardState();
  const dispatch  = useBoardDispatch();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>아이디어 ({ideas.length})</h3>
        <button
          type="button"
          className="btn ghost"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_IDEA_MODAL' })}
        >
          + 아이디어
        </button>
      </div>

      <div className="ws-ideas-grid">
        {ideas.map((idea) => (
          <div key={idea.id} className="ws-idea-card">
            <div className="ws-idea-card-header">
              <span className="ws-idea-title">{idea.title}</span>
              <span
                className="ws-badge"
                style={{
                  color:        PRIORITY_COLOR[idea.priority],
                  borderColor:  PRIORITY_COLOR[idea.priority],
                  background:   'transparent',
                }}
              >
                {PRIORITY_LABEL[idea.priority]}
              </span>
            </div>
            {idea.source && (
              <span className="ws-idea-source">출처: {idea.source}</span>
            )}
            {idea.tags.length > 0 && (
              <div className="ws-card-tags" style={{ marginTop: 8 }}>
                {idea.tags.map((t) => (
                  <span key={t} className="ws-tag">{t}</span>
                ))}
              </div>
            )}
            {idea.memo && (
              <p className="ws-idea-memo">{idea.memo}</p>
            )}
            <span className="ws-idea-date">{idea.createdAt.slice(0, 10)}</span>
          </div>
        ))}

        {ideas.length === 0 && (
          <div className="ws-tab-placeholder">
            <div className="ws-tab-placeholder-icon">💡</div>
            <h3>아이디어가 없습니다</h3>
            <p>+ 아이디어 버튼으로 추가해 보세요.</p>
          </div>
        )}
      </div>

      {/* 아이디어 탭에서 모달 접근 시 BoardTab 의 모달 인스턴스가 없으므로 여기서도 렌더 */}
    </div>
  );
}
