import { useState } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
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

function monthLabel(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

export default function DatePickerField({
  label,
  value,
  onChange,
  autoFocus,
  labelClassName = 'ws-date-picker-label',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  labelClassName?: string;
}) {
  const baseDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(baseDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(baseDate.getMonth());
  const todayKey = toDateKey(new Date());
  const days = buildMonthDays(viewYear, viewMonth);

  function moveMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function selectDate(dateKey: string) {
    onChange(dateKey);
    setOpen(false);
  }

  return (
    <div className="ws-date-picker">
      <span className={labelClassName}>{label}</span>
      <button
        type="button"
        className={`ws-date-picker-trigger${open ? ' is-open' : ''}${value ? '' : ' is-empty'}`}
        onClick={() => setOpen((current) => !current)}
        autoFocus={autoFocus}
      >
        {value || '날짜 선택'}
      </button>

      {open && (
        <div className="ws-date-picker-popover">
          <div className="ws-date-picker-head">
            <button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">‹</button>
            <strong>{monthLabel(viewYear, viewMonth)}</strong>
            <button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">›</button>
          </div>
          <div className="ws-date-picker-weekdays">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="ws-date-picker-grid">
            {days.map(({ date, currentMonth }) => {
              const dateKey = toDateKey(date);
              return (
                <button
                  key={dateKey}
                  type="button"
                  className={[
                    currentMonth ? '' : 'is-muted',
                    dateKey === value ? 'is-selected' : '',
                    dateKey === todayKey ? 'is-today' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => selectDate(dateKey)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="ws-date-picker-foot">
            <button type="button" onClick={() => selectDate(todayKey)}>오늘</button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              비우기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
