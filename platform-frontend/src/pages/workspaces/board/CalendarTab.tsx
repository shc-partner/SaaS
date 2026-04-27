// 캘린더 탭 — 업로드 예정 일정 목록 (달력 뷰는 추후 구현).

import type { MyWorkspace } from '../../../features/workspaces/types';
import { useBoardState } from '../../../features/workspaces/boardStore';

export default function CalendarTab({ workspace: _w }: { workspace: MyWorkspace }) {
  const { items } = useBoardState();

  // publishDate 가 있는 항목을 날짜 순으로 최대 8개
  const upcoming = items
    .filter((i) => i.publishDate)
    .sort((a, b) => a.publishDate.localeCompare(b.publishDate))
    .slice(0, 8);

  return (
    <div className="ws-tab-placeholder">
      <div className="ws-tab-placeholder-icon">📅</div>
      <h3>캘린더 화면은 준비 중입니다</h3>
      <p>업로드 예정 일정을 달력 형태로 볼 수 있습니다.</p>

      {upcoming.length > 0 && (
        <div className="ws-calendar-preview">
          <h4>이번 주 / 예정 일정</h4>
          <ul className="ws-calendar-list">
            {upcoming.map((item) => (
              <li key={item.id} className="ws-calendar-item">
                <span className="ws-calendar-date">{item.publishDate}</span>
                <span className="ws-calendar-title">{item.title}</span>
                <span className="ws-badge ws-badge--channel">{item.channels[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
