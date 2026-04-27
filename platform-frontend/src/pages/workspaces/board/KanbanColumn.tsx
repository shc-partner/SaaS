// 칸반 보드 컬럼 — 컬럼 헤더 + 카드 목록.

import type { BoardColumn, ContentItem } from '../../../features/workspaces/boardTypes';
import ContentCard from './ContentCard';

interface Props {
  column: BoardColumn;
  items: ContentItem[];
}

export default function KanbanColumn({ column, items }: Props) {
  return (
    <div className="ws-kanban-col">
      <div className="ws-kanban-col-header">
        <span className="ws-kanban-col-label">{column.label}</span>
        <span className="ws-kanban-col-count">{items.length}</span>
      </div>
      <div className="ws-kanban-col-body">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <div className="ws-kanban-col-empty">비어 있음</div>
        )}
      </div>
    </div>
  );
}
