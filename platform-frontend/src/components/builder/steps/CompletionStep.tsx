import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { resetSiteBuilder } from '../../../features/siteBuilder/siteBuilderSlice';
import {
  selectBasicInfo,
  selectCompletion,
  selectSelectedFeatures,
  selectSelectedPages,
  selectSiteType,
} from '../../../features/siteBuilder/selectors';
import {
  FEATURE_OPTIONS,
  PAGE_OPTIONS,
  SITE_TYPE_OPTIONS,
} from '../../../features/siteBuilder/types';

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// "사이트 생성이 완료되었습니다" 화면.
// 기획안 5/6/7번 통합: 임시 URL 발급 → 사이트 확인하기 → 관리자(필요 시) → 내 사이트 목록.
export default function CompletionStep() {
  const dispatch = useAppDispatch();
  const completion = useAppSelector(selectCompletion);
  const siteType   = useAppSelector(selectSiteType);
  const basic      = useAppSelector(selectBasicInfo);
  const pages      = useAppSelector(selectSelectedPages);
  const features   = useAppSelector(selectSelectedFeatures);

  if (!completion) return null;

  const siteTypeLabel =
    SITE_TYPE_OPTIONS.find((o) => o.id === siteType)?.label ?? '—';
  const featureLabels = FEATURE_OPTIONS
    .filter((f) => f.branch !== 'admin' && features.includes(f.id))
    .map((f) => f.label);

  const slug = completion.slug || basic.slug;
  const publicUrl = `/sites/${slug}`;
  const adminUrl  = `/admin/sites/${completion.siteId}`;

  // 생성된 사이트의 실제 페이지 경로 목록 — 선택한 페이지가 각각 독립 URL 을 갖는다는 점을 명시.
  const generatedPages = PAGE_OPTIONS
    .filter((p) => pages.includes(p.id))
    .map((p) => ({
      key:   p.id,
      label: p.label,
      // 홈은 루트, 나머지는 `/<key>` — SitePreviewPlaceholderPage 의 라우팅 규칙과 일치.
      href:  p.id === 'home' ? `/sites/${slug}` : `/sites/${slug}/${p.id}`,
    }));

  return (
    <section className="step step-completion">
      <div className="completion-banner">
        <span className="icon-bubble" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className="text">
          <strong>사이트가 성공적으로 생성되었습니다.</strong>
          <small>임시 URL 이 발급되었습니다. 아래에서 즉시 확인하거나 관리자 페이지로 이동하세요.</small>
        </span>
      </div>

      <div className="completion-grid">
        <div className="completion-card">
          <h3>생성 결과</h3>
          <dl className="summary-kv">
            <dt>사이트 유형</dt>
            <dd>{siteTypeLabel}</dd>

            <dt>사이트 이름</dt>
            <dd>{completion.name || basic.siteName || '—'}</dd>

            <dt>임시 URL</dt>
            <dd><code>{publicUrl}</code></dd>

            <dt>포함 페이지</dt>
            <dd>
              {generatedPages.length === 0 ? '—' : (
                <ul className="completion-page-list">
                  {generatedPages.map((p) => (
                    <li key={p.key}>
                      <Link to={p.href} className="completion-page-link">
                        <span className="completion-page-label">{p.label}</span>
                        <code>{p.href}</code>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </dd>

            <dt>선택 기능</dt>
            <dd>{featureLabels.length ? featureLabels.join(', ') : '—'}</dd>

            <dt>관리자</dt>
            <dd>
              {completion.adminRequired
                ? <span className="badge brand">생성됨</span>
                : <span className="badge">미사용</span>}
            </dd>

            <dt>사이트 ID</dt>
            <dd><code>{completion.siteId}</code></dd>

            <dt>생성 시각</dt>
            <dd>{formatCreatedAt(completion.createdAt)}</dd>
          </dl>
        </div>

        <div className="completion-card completion-actions">
          <h3>바로 시작하기</h3>
          <p className="completion-hint">
            사이트가 만들어졌어요. 지금 바로 공개된 사이트를 확인하거나,
            {completion.adminRequired
              ? ' 관리자 페이지에서 콘텐츠를 수정하세요.'
              : ' 내 사이트 목록에서 다시 찾을 수 있습니다.'}
          </p>

          <Link to={publicUrl} className="btn primary btn-block">
            사이트 확인하기 ↗
          </Link>
          {completion.adminRequired && (
            <Link to={adminUrl} className="btn ghost btn-block" style={{ marginTop: 10 }}>
              관리자 페이지로 이동
            </Link>
          )}
          <Link to="/app" className="btn ghost btn-block" style={{ marginTop: 10 }}>
            내 사이트 목록 보기
          </Link>

          <div className="completion-sub-actions">
            <button
              type="button"
              className="btn subtle"
              onClick={() => dispatch(resetSiteBuilder())}
            >
              새로운 사이트 만들기
            </button>
            <Link to="/" className="completion-weak-link">홈으로</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
