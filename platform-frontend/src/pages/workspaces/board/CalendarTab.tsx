import { useMemo, useState } from 'react';
import type { MyWorkspace } from '../../../features/workspaces/types';
import { useBoardDispatch, useBoardState } from '../../../features/workspaces/boardStore';
import type { ContentItem } from '../../../features/workspaces/boardTypes';
import DatePickerField from './DatePickerField';
import { matchesBoardChannel, visibleBoardChannels } from './boardChannels';

interface CalendarRange {
  id: string;
  item: ContentItem;
  start: string;
  end: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const STATUS_LABEL: Record<string, string> = {
  idea: '아이디어',
  planning: '기획중',
  scripting: '대본 작성',
  shooting: '촬영',
  editing: '작업중',
  'edit-review': '검수',
  thumbnail: '썸네일',
  scheduled: '예약',
  published: '완료',
};

function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function dayNumber(dateKey: string): number {
  return Number(dateKey.slice(8, 10));
}

function monthDay(dateKey: string): string {
  return `${Number(dateKey.slice(5, 7))}/${Number(dateKey.slice(8, 10))}`;
}

function rangeLabel(start: string, end: string): string {
  if (start === end) return `${dayNumber(start)}일`;
  if (start.slice(0, 7) === end.slice(0, 7)) return `${dayNumber(start)}일~${dayNumber(end)}일`;
  return `${monthDay(start)}~${monthDay(end)}`;
}

function buildMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const days: { date: Date; currentMonth: boolean }[] = [];

  for (let offset = first.getDay(); offset > 0; offset -= 1) {
    days.push({ date: new Date(year, month, 1 - offset), currentMonth: false });
  }

  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= lastDate; day += 1) {
    days.push({ date: new Date(year, month, day), currentMonth: true });
  }

  for (let day = 1; days.length < 42; day += 1) {
    days.push({ date: new Date(year, month + 1, day), currentMonth: false });
  }

  return days;
}

function itemsToRanges(items: ContentItem[]): CalendarRange[] {
  return items.flatMap((item) => {
    const dates = [item.shootDate, item.editDueDate].filter(Boolean).sort();
    if (dates.length === 0) return [];

    return [{
      id: item.id,
      item,
      start: dates[0],
      end: dates[dates.length - 1],
    }];
  });
}

function rangeIncludesDate(range: CalendarRange, dateKey: string): boolean {
  return range.start <= dateKey && dateKey <= range.end;
}

function buildRangeLanes(ranges: CalendarRange[]): Map<string, number> {
  const lanes: string[] = [];
  const rangeLanes = new Map<string, number>();

  for (const range of ranges) {
    const lane = lanes.findIndex((laneEnd) => laneEnd < range.start);
    const nextLane = lane === -1 ? lanes.length : lane;

    lanes[nextLane] = range.end;
    rangeLanes.set(range.id, nextLane);
  }

  return rangeLanes;
}

function monthLabel(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

function shouldShowRangeText(range: CalendarRange, date: Date, dateKey: string): boolean {
  return dateKey === range.start || date.getDate() === 1;
}

function rangeClass(range: CalendarRange, date: Date, dateKey: string): string {
  const starts = dateKey === range.start;
  const ends = dateKey === range.end;
  const weekStarts = date.getDay() === 0;
  const weekEnds = date.getDay() === 6;

  return [
    'ws-calendar-range',
    `priority-${range.item.priority}`,
    starts || weekStarts ? 'starts' : '',
    ends || weekEnds ? 'ends' : '',
    starts && ends ? 'single-day' : '',
  ].filter(Boolean).join(' ');
}

export default function CalendarTab({ workspace: _workspace }: { workspace: MyWorkspace }) {
  const { items } = useBoardState();
  const dispatch = useBoardDispatch();
  const today = new Date();
  const todayKey = toDateKey(today);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState('all');
  const [search, setSearch] = useState('');

  const channels = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      for (const channel of visibleBoardChannels(item.channels)) set.add(channel);
    }
    return [...set].sort();
  }, [items]);

  const ranges = useMemo(() => {
    const query = search.trim().toLowerCase();

    return itemsToRanges(items)
      .filter((range) => {
        if (channelFilter !== 'all' && !matchesBoardChannel(range.item.channels, channelFilter)) return false;
        if (query && !range.item.title.toLowerCase().includes(query)) return false;
        return true;
      })
      .sort((a, b) => a.start.localeCompare(b.start) || a.item.title.localeCompare(b.item.title));
  }, [channelFilter, items, search]);

  const rangesByDate = useMemo(() => {
    const map = new Map<string, CalendarRange[]>();
    for (const day of buildMonthDays(year, month)) {
      const dateKey = toDateKey(day.date);
      map.set(dateKey, ranges.filter((range) => rangeIncludesDate(range, dateKey)));
    }
    return map;
  }, [month, ranges, year]);

  const days = useMemo(() => buildMonthDays(year, month), [month, year]);
  const rangeLanes = useMemo(() => buildRangeLanes(ranges), [ranges]);
  const selectedRanges = ranges
    .filter((range) => rangeIncludesDate(range, selectedDate))
    .sort((a, b) => {
      if (a.id === selectedRangeId) return -1;
      if (b.id === selectedRangeId) return 1;
      return a.start.localeCompare(b.start) || a.item.title.localeCompare(b.item.title);
    });

  function moveMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(todayKey);
    setSelectedRangeId(null);
  }

  function updateRangeDates(range: CalendarRange, field: 'shootDate' | 'editDueDate', value: string) {
    dispatch({
      type: 'UPDATE_ITEM_DATES',
      payload: {
        id: range.item.id,
        shootDate: field === 'shootDate' ? value : range.item.shootDate,
        editDueDate: field === 'editDueDate' ? value : range.item.editDueDate,
        publishDate: range.item.publishDate,
      },
    });
  }

  return (
    <div className="ws-calendar">
      <div className="ws-calendar-toolbar">
        <div className="ws-calendar-month-control">
          <button type="button" className="ws-calendar-icon-btn" onClick={() => moveMonth(-1)} aria-label="이전 달">
            ‹
          </button>
          <strong>{monthLabel(year, month)}</strong>
          <button type="button" className="ws-calendar-icon-btn" onClick={() => moveMonth(1)} aria-label="다음 달">
            ›
          </button>
          <button type="button" className="btn ghost ws-calendar-today" onClick={goToday}>
            오늘
          </button>
        </div>

        <div>
          <button
            type="button"
            className="btn primary"
            onClick={() => dispatch({ type: 'TOGGLE_NEW_CONTENT_MODAL' })}
          >
            + 컨텐츠 추가
          </button>
        </div>
      </div>

      <div className="ws-calendar-filters">
        <input
          className="ws-calendar-search"
          type="search"
          placeholder="컨텐츠 제목 검색"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="ws-calendar-select"
          value={channelFilter}
          onChange={(event) => setChannelFilter(event.target.value)}
        >
          <option value="all">전체 채널</option>
          {channels.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
      </div>

      <div className="ws-calendar-layout">
        <section className="ws-calendar-main" aria-label="월간 컨텐츠 캘린더">
          <div className="ws-calendar-weekdays">
            {WEEKDAYS.map((weekday, index) => (
              <div
                key={weekday}
                className={`ws-calendar-weekday${index === 0 ? ' sunday' : index === 6 ? ' saturday' : ''}`}
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="ws-calendar-grid">
            {days.map(({ date, currentMonth }) => {
              const dateKey = toDateKey(date);
              const dayRanges = rangesByDate.get(dateKey) ?? [];
              const visibleRanges = dayRanges.filter((range) => (rangeLanes.get(range.id) ?? 0) < 3);
              const isSelected = selectedDate === dateKey;
              const isToday = todayKey === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={[
                    'ws-calendar-day',
                    currentMonth ? '' : 'is-muted',
                    isSelected ? 'is-selected' : '',
                    isToday ? 'is-today' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setSelectedRangeId(null);
                  }}
                >
                  <span className="ws-calendar-day-number">{date.getDate()}</span>
                  <span className="ws-calendar-day-events">
                    {visibleRanges.map((range) => (
                      <span
                        key={range.id}
                        className={`${rangeClass(range, date, dateKey)}${selectedRangeId === range.id ? ' is-selected' : ''}`}
                        style={{ gridRowStart: (rangeLanes.get(range.id) ?? 0) + 1 }}
                        title={`${rangeLabel(range.start, range.end)} ${range.item.title}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedDate(dateKey);
                          setSelectedRangeId(range.id);
                        }}
                      >
                        {shouldShowRangeText(range, date, dateKey) && (
                          <span className="ws-calendar-range-title">
                            {rangeLabel(range.start, range.end)} {range.item.title}
                          </span>
                        )}
                      </span>
                    ))}
                    {dayRanges.length > 3 && (
                      <span className="ws-calendar-more">+{dayRanges.length - 3}개 더</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="ws-calendar-agenda" aria-label="선택한 날짜의 일정">
          <div className="ws-calendar-agenda-head">
            <strong>{selectedDate}</strong>
            <span>{selectedRanges.length}개 진행 중</span>
          </div>

          {selectedRanges.length === 0 ? (
            <div className="ws-calendar-empty">
              <strong>진행 중인 컨텐츠가 없습니다</strong>
              <p>컨텐츠에 시작일자와 마감일자를 입력하면 기간이 바로 표시됩니다.</p>
            </div>
          ) : (
            <div className="ws-calendar-agenda-list">
              {selectedRanges.map((range) => (
                <article
                  key={range.id}
                  className={[
                    'ws-calendar-agenda-card',
                    `priority-${range.item.priority}`,
                    selectedRangeId === range.id ? 'is-selected' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="ws-calendar-agenda-top">
                    <span>{rangeLabel(range.start, range.end)}</span>
                    <small>{STATUS_LABEL[range.item.status] ?? range.item.status}</small>
                  </div>
                  <h3>{range.item.title}</h3>
                  <div className="ws-calendar-date-editor">
                    <DatePickerField
                      label="시작일자"
                      value={range.item.shootDate}
                      onChange={(value) => updateRangeDates(range, 'shootDate', value)}
                    />
                    <DatePickerField
                      label="마감일자"
                      value={range.item.editDueDate}
                      onChange={(value) => updateRangeDates(range, 'editDueDate', value)}
                    />
                  </div>
                  <div className="ws-calendar-agenda-meta">
                    {visibleBoardChannels(range.item.channels).map((channel) => (
                      <span key={channel}>{channel}</span>
                    ))}
                    {range.item.assignee && <span>{range.item.assignee}</span>}
                    {range.item.isSponsored && <span>협찬</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
