// 칸반 컬럼 내 개별 콘텐츠 카드.
// 클릭 시 우측 상세 패널이 열린다.

import type { ContentItem, Priority } from '../../../features/workspaces/boardTypes';
import { useBoardDispatch } from '../../../features/workspaces/boardStore';

function priorityColor(p: Priority): string {
  return p === 'high'
    ? 'var(--red-500, #ef4444)'
    : p === 'medium'
    ? 'var(--amber-500, #f59e0b)'
    : 'var(--text-3)';
}

export default function ContentCard({ item }: { item: ContentItem }) {
  const dispatch = useBoardDispatch();
  return (
    <div
      className="ws-content-card"
      role="button"
      tabIndex={0}
      onClick={() => dispatch({ type: 'SELECT_ITEM', payload: item.id })}
      onKeyDown={(e) => {
        if (e.key === 'Enter') dispatch({ type: 'SELECT_ITEM', payload: item.id });
      }}
    >
      <div className="ws-card-priority-bar" style={{ background: priorityColor(item.priority) }} />
      <div className="ws-card-body">
        <p className="ws-card-title">{item.title}</p>
        <div className="ws-card-meta">
          {item.channels.map((ch) => (
            <span key={ch} className="ws-badge ws-badge--channel">{ch}</span>
          ))}
          {item.contentFormat && (
            <span className="ws-badge ws-badge--format">{item.contentFormat}</span>
          )}
          {item.isSponsored && <span className="ws-badge ws-badge--sponsored">협찬</span>}
        </div>
        {item.tags.length > 0 && (
          <div className="ws-card-tags">
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className="ws-tag">{t}</span>
            ))}
          </div>
        )}
        <div className="ws-card-footer">
          {item.publishDate && (
            <span className="ws-card-date">📅 {item.publishDate}</span>
          )}
          {item.assignee && (
            <span className="ws-card-assignee">{item.assignee}</span>
          )}
        </div>
      </div>
    </div>
  );
}
