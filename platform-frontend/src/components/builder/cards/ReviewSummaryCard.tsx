import { useAppSelector } from '../../../app/hooks';
import {
  selectAdminRequired,
  selectBasicInfo,
  selectSelectedFeatures,
  selectSelectedPages,
  selectSiteType,
} from '../../../features/siteBuilder/selectors';
import {
  FEATURE_OPTIONS,
  PAGE_OPTIONS,
  SITE_TYPE_OPTIONS,
} from '../../../features/siteBuilder/types';

// 결과 확인 단계에서 보여주는 입력 요약.
// 유형 · 사이트 식별 · 선택 페이지 · 선택 기능 · 관리자 필요 여부.
export default function ReviewSummaryCard() {
  const siteType      = useAppSelector(selectSiteType);
  const basic         = useAppSelector(selectBasicInfo);
  const pages         = useAppSelector(selectSelectedPages);
  const features      = useAppSelector(selectSelectedFeatures);
  const adminRequired = useAppSelector(selectAdminRequired);

  const typeLabel    = SITE_TYPE_OPTIONS.find((t) => t.id === siteType)?.label ?? '-';
  const pageLabels   = PAGE_OPTIONS.filter((p) => pages.includes(p.id)).map((p) => p.label);
  const featureLabels = FEATURE_OPTIONS
    .filter((f) => f.id !== 'adminPage' && features.includes(f.id))
    .map((f) => f.label);

  return (
    <div className="summary-card">
      <h3>입력 요약</h3>
      <dl className="summary-kv">
        <dt>사이트 유형</dt><dd>{typeLabel}</dd>
        <dt>사이트 이름</dt><dd>{basic.siteName || '-'}</dd>
        <dt>slug</dt><dd><code>{basic.slug || '-'}</code></dd>
        <dt>업종/주제</dt><dd>{basic.industry || '-'}</dd>
        <dt>한 줄 소개</dt><dd>{basic.summary || <em>(미입력)</em>}</dd>
        <dt>포함 페이지</dt><dd>{pageLabels.join(', ') || '-'}</dd>
        <dt>선택 기능</dt><dd>{featureLabels.join(', ') || <em>(선택 없음)</em>}</dd>
        <dt>관리자 페이지</dt>
        <dd>
          {adminRequired
            ? <span className="badge brand">생성됨</span>
            : <span className="badge">미사용</span>}
        </dd>
      </dl>
    </div>
  );
}
