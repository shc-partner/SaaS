import type { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setStartMode } from '../../../features/siteBuilder/siteBuilderSlice';
import { selectStartMode } from '../../../features/siteBuilder/selectors';
import { START_MODE_OPTIONS, type StartMode } from '../../../features/siteBuilder/types';

// 각 시작 방식의 강조 태그 — 카드 상단 badge
const MODE_TAGS: Record<StartMode, string> = {
  template: '가장 빠른 시작',
  ai:       'AI 자동 초안',
  blank:    '자유 구성',
};

const MODE_ICONS: Record<StartMode, ReactElement> = {
  template: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  ai: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l1.8 5.5H19l-4.6 3.4 1.8 5.5L12 14l-4.2 3.4 1.8-5.5L5 8.5h5.2z" />
      <path d="M5 20h14" strokeWidth="1" opacity=".5" />
    </svg>
  ),
  blank: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  ),
};

export default function StartModeStep() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectStartMode);

  return (
    <div className="start-mode-screen">
      <header className="start-mode-header">
        <h1 className="start-mode-title">어떻게 시작할까요?</h1>
        <p className="start-mode-subtitle">
          원하는 시작 방식을 선택하면 다음 단계에서 사이트 구성을 이어서 진행할 수 있습니다.
        </p>
      </header>

      <ul className="start-mode-cards" role="list">
        {START_MODE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <li key={opt.id}>
              <button
                type="button"
                className={`sm-card${isSelected ? ' sm-card--selected' : ''}`}
                onClick={() => dispatch(setStartMode(opt.id))}
                aria-pressed={isSelected}
              >
                {/* 상단 태그 */}
                <span className={`sm-card__tag${isSelected ? ' sm-card__tag--selected' : ''}`}>
                  {MODE_TAGS[opt.id]}
                  {opt.badge && <span className="sm-card__badge">{opt.badge}</span>}
                </span>

                {/* 아이콘 */}
                <span className={`sm-card__icon${isSelected ? ' sm-card__icon--selected' : ''}`}>
                  {MODE_ICONS[opt.id]}
                </span>

                {/* 텍스트 */}
                <span className="sm-card__label">{opt.label}</span>
                <span className="sm-card__desc">{opt.desc}</span>

                {/* 선택 indicator */}
                <span className={`sm-card__indicator${isSelected ? ' sm-card__indicator--on' : ''}`} aria-hidden>
                  {isSelected ? '✓ 선택됨' : '선택하기'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
