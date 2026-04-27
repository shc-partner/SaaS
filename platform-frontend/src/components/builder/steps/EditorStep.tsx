import { useEffect, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createSite } from '../../../api/sites';
import { useAuth } from '../../../features/auth/AuthProvider';
import { upsertMySite } from '../../../features/mySites/storage';
import {
  setActivePageTab,
  setSiteCreated,
  setSubmitError,
  setSubmitting,
  updatePageContent,
} from '../../../features/siteBuilder/siteBuilderSlice';
import {
  selectActivePageTab,
  selectAdminRequired,
  selectBasicInfo,
  selectCompletion,
  selectIsBasicInfoValid,
  selectIsSubmitting,
  selectPageContents,
  selectSelectedFeatures,
  selectSelectedPages,
  selectSelectedTemplateKey,
  selectSiteType,
  selectSubmitError,
} from '../../../features/siteBuilder/selectors';
import { PAGE_OPTIONS, type PageKey } from '../../../features/siteBuilder/types';
import CompletionStep from './CompletionStep';

// 5단계(마지막) — 페이지별 콘텐츠 편집 + 사이트 생성.
// 좌측 패널에서 페이지 탭을 전환하며 텍스트를 입력하고, 우측 미리보기를 확인한 뒤 생성 버튼을 누른다.
export default function EditorStep() {
  const dispatch      = useAppDispatch();
  const { user }      = useAuth();
  const siteType      = useAppSelector(selectSiteType);
  const templateKey   = useAppSelector(selectSelectedTemplateKey);
  const basic         = useAppSelector(selectBasicInfo);
  const pages         = useAppSelector(selectSelectedPages);
  const features      = useAppSelector(selectSelectedFeatures);
  const contents      = useAppSelector(selectPageContents);
  const active        = useAppSelector(selectActivePageTab);
  const adminRequired = useAppSelector(selectAdminRequired);
  const basicValid    = useAppSelector(selectIsBasicInfoValid);
  const submitting    = useAppSelector(selectIsSubmitting);
  const submitError   = useAppSelector(selectSubmitError);
  const completion    = useAppSelector(selectCompletion);

  const tabs = PAGE_OPTIONS.filter((p) => pages.includes(p.id));

  useEffect(() => {
    if (!tabs.some((t) => t.id === active) && tabs[0]) {
      dispatch(setActivePageTab(tabs[0].id));
    }
  }, [tabs, active, dispatch]);

  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const value   = current ? contents[current.id as PageKey] : null;

  const onChange = (field: 'heading' | 'lead' | 'body') =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!current) return;
      dispatch(updatePageContent({ page: current.id as PageKey, patch: { [field]: e.target.value } }));
    };

  const allValid = siteType === 'company' && basicValid && pages.length >= 1;

  const submitSite = async () => {
    if (siteType !== 'company') return;
    dispatch(setSubmitting(true));
    dispatch(setSubmitError(null));
    try {
      const data = await createSite({
        siteType: 'company',
        selectedTemplateKey: templateKey ?? undefined,
        basic,
        selectedPages: pages,
        pageContents: contents,
        features,
      });

      const createdAt = data.site.createdAt ?? new Date().toISOString();

      dispatch(setSiteCreated({
        siteId:        String(data.site.id),
        slug:          data.site.slug,
        name:          data.site.name,
        adminRequired,
        createdAt,
      }));

      const pageInfos = PAGE_OPTIONS
        .filter((p) => pages.includes(p.id))
        .map((p) => ({ key: p.id, label: p.label, path: p.path }));

      upsertMySite(user?.id ?? null, {
        id:            String(data.site.id),
        slug:          data.site.slug,
        name:          data.site.name,
        type:          data.site.type,
        createdAt,
        status:        'published',
        adminRequired,
        pages:         pageInfos,
      });
    } catch (e) {
      dispatch(setSubmitError(e instanceof Error ? e.message : '알 수 없는 오류'));
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  if (completion) return <CompletionStep />;

  return (
    <section className="step step-editor">
      <header className="step-head">
        <h2>페이지 콘텐츠 편집</h2>
        <p className="step-desc">
          각 페이지의 텍스트를 입력하면 오른쪽 미리보기에 즉시 반영됩니다.
          완료되면 <strong>사이트 생성하기</strong>를 눌러 주세요.
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
              className={`page-tab${current?.id === t.id ? ' active' : ''}`}
              onClick={() => dispatch(setActivePageTab(t.id as PageKey))}
              aria-current={current?.id === t.id ? 'page' : undefined}
            >
              <span className="page-tab-label">{t.label}</span>
              <span className={`page-tab-dot${hasAny ? ' filled' : ''}`} aria-hidden />
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
              placeholder={
                current.id === 'home'
                  ? '예: 더 나은 비즈니스를 만드는 파트너'
                  : `예: ${current.label}`
              }
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
            이미지 업로드·섹션 블록 배치는 생성 후 관리자 편집기에서 제공됩니다.
          </p>
        </form>
      ) : (
        <p className="field-hint">선택된 페이지가 없습니다. 이전 단계에서 페이지를 선택해 주세요.</p>
      )}

      <div className="editor-submit-area">
        {submitError && <p className="form-error">{submitError}</p>}
        <button
          type="button"
          className="btn primary btn-block"
          disabled={!allValid || submitting}
          onClick={submitSite}
        >
          {submitting ? '생성 중…' : '사이트 생성하기'}
        </button>
        <p className="field-hint" style={{ textAlign: 'center', marginTop: 8 }}>
          생성 즉시 임시 URL 이 발급되며, 관리자 페이지에서 계속 편집할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
