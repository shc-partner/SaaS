import type { HeaderContent, PageRow } from '../types';

interface Props {
  content: HeaderContent;
  pages: PageRow[];
  currentKey?: string;
  /** SPA 라우팅 연동 시 클릭 핸들러. e.preventDefault() 후 내부에서 navigate(). */
  onNavigate?: (key: string) => void;
  /** 실제 링크 href 빌드. 제공되면 <a> 로 렌더되어 새 탭 열기/북마크가 정상 동작. */
  getPageHref?: (key: string) => string;
}

// 사이트 헤더 — 브랜드 + nav.
// 우선순위: getPageHref 있음 → <a href> (+ onNavigate 가 있으면 SPA 가로채기)
//           getPageHref 없고 onNavigate 만 있음 → <button> (빌더 프리뷰 등 URL 없는 컨텍스트)
//           둘 다 없음 → <span> (정적 이관본의 임시 뷰)
export default function HeaderSection({ content, pages, currentKey, onNavigate, getPageHref }: Props) {
  const active = currentKey ?? pages[0]?.key;

  return (
    <header className="lp-header">
      <div className="lp-brand">{content.brand || 'Your Brand'}</div>
      <nav className="lp-nav">
        {pages.map((p) => {
          const isActive = p.key === active;
          const cls = isActive ? 'is-active' : '';

          if (getPageHref) {
            const href = getPageHref(p.key);
            return (
              <a
                key={p.key}
                className={cls}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  // 좌클릭 + 수정키 없음 → SPA 가로채기. 중버튼/Ctrl/Shift 클릭은 브라우저 기본 동작 유지.
                  if (!onNavigate) return;
                  if (e.defaultPrevented) return;
                  if (e.button !== 0) return;
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onNavigate(p.key);
                }}
              >
                {p.label}
              </a>
            );
          }
          if (onNavigate) {
            return (
              <button
                key={p.key}
                type="button"
                className={cls}
                onClick={() => onNavigate(p.key)}
                aria-current={isActive ? 'page' : undefined}
              >
                {p.label}
              </button>
            );
          }
          return <span key={p.key} className={cls}>{p.label}</span>;
        })}
      </nav>
    </header>
  );
}
