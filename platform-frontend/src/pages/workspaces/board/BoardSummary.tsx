// 보드 상단 요약 카드 4개 — 이번 주 업로드, 편집중, 지연, 아이디어.

import { useBoardState } from '../../../features/workspaces/boardStore';

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="ws-summary-card">
      <span className="ws-summary-label">{label}</span>
      <span
        className="ws-summary-value"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

export default function BoardSummary() {
  const { items, ideas } = useBoardState();

  const thisWeek = items.filter((i) => {
    if (!i.publishDate) return false;
    const d    = new Date(i.publishDate);
    const now  = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  const editing = items.filter((i) => i.status === 'editing').length;

  const overdue = items.filter((i) => {
    if (!i.publishDate || i.status === 'published') return false;
    return new Date(i.publishDate) < new Date();
  }).length;

  return (
    <div className="ws-summary-row">
      <SummaryCard label="이번 주 업로드" value={thisWeek} accent="var(--brand)" />
      <SummaryCard label="편집중" value={editing} />
      <SummaryCard label="지연" value={overdue} accent="var(--red-500, #ef4444)" />
      <SummaryCard label="아이디어" value={ideas.length} />
    </div>
  );
}
