import { CompanySiteRenderer, buildPreviewSiteData } from '@app/site-renderer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setActivePageTab, setPreviewViewport } from '../../features/siteBuilder/siteBuilderSlice';
import {
  selectActivePageTab,
  selectBasicInfo,
  selectPageContents,
  selectPreviewUrl,
  selectPreviewViewport,
  selectSelectedFeatures,
  selectSelectedPages,
  selectSiteType,
} from '../../features/siteBuilder/selectors';
import { SITE_TYPE_OPTIONS, type PageKey } from '../../features/siteBuilder/types';

// 빌더 좌측 — 모든 단계에서 상시 노출되는 실시간 사이트 미리보기.
// PC/모바일 뷰포트 토글: 모바일 상태에서는 프레임 폭을 375px 로 제한해 모바일 렌더링을 확인할 수 있게 한다.
// 페이지 선택/기능 선택/페이지별 입력이 모두 이 한 곳에서 실시간 합성된다.
export default function BuilderPreviewPanel() {
  const dispatch  = useAppDispatch();
  const siteType  = useAppSelector(selectSiteType);
  const basic     = useAppSelector(selectBasicInfo);
  const pages     = useAppSelector(selectSelectedPages);
  const features  = useAppSelector(selectSelectedFeatures);
  const contents  = useAppSelector(selectPageContents);
  const url       = useAppSelector(selectPreviewUrl);
  const viewport  = useAppSelector(selectPreviewViewport);
  const activeTab = useAppSelector(selectActivePageTab);

  const opt = SITE_TYPE_OPTIONS.find((o) => o.id === siteType);
  const templateLabel = opt ? `${opt.label} 템플릿` : '템플릿 선택 필요';

  const data = siteType === 'company'
    ? buildPreviewSiteData({
        siteName: basic.siteName,
        slug:     basic.slug,
        industry: basic.industry,
        summary:  basic.summary,
        selectedPages: pages,
        pageContents:  contents,
        features,
      })
    : null;

  return (
    <div className={`preview-frame preview-${viewport}`}>
      <div className="preview-chrome">
        <div className="preview-dots"><span /><span /><span /></div>
        <div className="preview-url" title={url}>{url}</div>
        <div className="preview-viewport-toggle" role="group" aria-label="미리보기 뷰포트">
          <button
            type="button"
            className={viewport === 'desktop' ? 'active' : ''}
            onClick={() => dispatch(setPreviewViewport('desktop'))}
            aria-pressed={viewport === 'desktop'}
            title="데스크탑"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </button>
          <button
            type="button"
            className={viewport === 'mobile' ? 'active' : ''}
            onClick={() => dispatch(setPreviewViewport('mobile'))}
            aria-pressed={viewport === 'mobile'}
            title="모바일"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="7" y="2" width="10" height="20" rx="2" />
              <path d="M11 18h2" />
            </svg>
          </button>
        </div>
        <span className="preview-template-tag">{templateLabel}</span>
      </div>
      {data ? (
        <div className="preview-viewport-body">
          <CompanySiteRenderer
            data={data}
            currentPageKey={activeTab}
            onNavigate={(key) => dispatch(setActivePageTab(key as PageKey))}
          />
        </div>
      ) : (
        <div className="preview-placeholder">
          <h3>좌측 미리보기 대기 중</h3>
          <p>
            우측에서 사이트 유형을 선택하면, 이 영역에 해당 템플릿의 실시간 미리보기가 표시됩니다.
            입력값을 바꿀 때마다 즉시 반영됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
