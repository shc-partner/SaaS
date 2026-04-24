import { useEffect, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setActivePageTab,
  updatePageContent,
} from '../../../features/siteBuilder/siteBuilderSlice';
import {
  selectActivePageTab,
  selectPageContents,
  selectSelectedPages,
} from '../../../features/siteBuilder/selectors';
import { PAGE_OPTIONS, type PageKey } from '../../../features/siteBuilder/types';

// 단계 5 — 선택한 페이지들만 순서대로 정보 입력.
// 기획안: 홈 정보 → 회사 소개 입력 → 서비스 소개 입력 → 문의하기 입력.
// 이번 스테이지에서는 텍스트(heading/lead/body)부터 입력받고, 이미지·레이아웃·섹션 블록 편집은
// 다음 스테이지에서 같은 pageContents 구조에 추가.
export default function PageContentStep() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedPages);
  const active   = useAppSelector(selectActivePageTab);
  const contents = useAppSelector(selectPageContents);

  // 선택 목록에 따라 탭 라벨 순서를 정리 (PAGE_OPTIONS 의 정렬 기준을 따름).
  const tabs = PAGE_OPTIONS.filter((p) => selected.includes(p.id));

  // activePageTab 이 해제된 페이지를 가리키면 첫 탭으로 돌림.
  useEffect(() => {
    if (!tabs.some((t) => t.id === active) && tabs[0]) {
      dispatch(setActivePageTab(tabs[0].id));
    }
  }, [tabs, active, dispatch]);

  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const value = current ? contents[current.id as PageKey] : null;

  const onChange = (field: 'heading' | 'lead' | 'body') =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!current) return;
      dispatch(updatePageContent({
        page: current.id as PageKey,
        patch: { [field]: e.target.value },
      }));
    };

  return (
    <section className="step">
      <header className="step-head">
        <h2>페이지별 정보 입력</h2>
        <p className="step-desc">
          선택한 페이지마다 제목·리드·본문을 입력하세요. 좌측 미리보기에 즉시 반영됩니다.
        </p>
      </header>

      <nav className="page-tabs" aria-label="페이지 탭">
        {tabs.map((t) => {
          const filled = contents[t.id as PageKey];
          const hasAny = Boolean(filled.heading || filled.lead || filled.body);
          return (
            <button
              key={t.id}
              type="button"
              className={`page-tab ${current?.id === t.id ? 'active' : ''}`}
              onClick={() => dispatch(setActivePageTab(t.id as PageKey))}
              aria-current={current?.id === t.id ? 'page' : undefined}
            >
              <span className="page-tab-label">{t.label}</span>
              <span className={`page-tab-dot ${hasAny ? 'filled' : ''}`} aria-hidden />
            </button>
          );
        })}
      </nav>

      {current && value ? (
        <form className="form" onSubmit={(e) => e.preventDefault()} key={current.id}>
          <label className="field">
            <span className="field-label">제목</span>
            <input
              type="text"
              value={value.heading}
              onChange={onChange('heading')}
              placeholder={current.id === 'home'
                ? '예: 더 나은 비즈니스를 만드는 파트너'
                : `예: ${current.label}`}
            />
          </label>

          <label className="field">
            <span className="field-label">리드 문구</span>
            <input
              type="text"
              value={value.lead}
              onChange={onChange('lead')}
              placeholder="한 문장으로 핵심 메시지를 적어 주세요."
            />
          </label>

          <label className="field">
            <span className="field-label">본문 / 추가 설명</span>
            <textarea
              rows={5}
              value={value.body}
              onChange={onChange('body')}
              placeholder="상세 설명, 소개 문단, 강조하고 싶은 내용을 자유롭게 입력하세요."
            />
          </label>

          <p className="field-hint">
            이미지 업로드 · 섹션 블록 배치는 다음 스테이지의 관리자 편집기에서 제공됩니다.
            지금 입력한 텍스트는 생성 직후 즉시 공개 사이트에 반영됩니다.
          </p>
        </form>
      ) : (
        <p className="field-hint">입력할 페이지가 없습니다. 이전 단계에서 페이지를 선택하세요.</p>
      )}
    </section>
  );
}
