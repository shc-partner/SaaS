import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { togglePage } from '../../../features/siteBuilder/siteBuilderSlice';
import {
  selectSelectedPages,
  selectSiteType,
} from '../../../features/siteBuilder/selectors';
import { PAGE_OPTIONS, SITE_TYPE_OPTIONS } from '../../../features/siteBuilder/types';

// 4단계 — 유형별 자동 제안 페이지 세트 확인 및 조정.
// 사이트 유형이 선택되는 순간 slice 에서 DEFAULT_PAGES_BY_TYPE 로 자동 세팅된다.
// 사용자는 여기서 필요에 맞게 추가/제거만 하면 된다.
export default function PageSetStep() {
  const dispatch  = useAppDispatch();
  const selected  = useAppSelector(selectSelectedPages);
  const siteType  = useAppSelector(selectSiteType);

  const typeLabel = SITE_TYPE_OPTIONS.find((o) => o.id === siteType)?.label ?? '선택한 유형';

  return (
    <section className="step">
      <header className="step-head">
        <h2>페이지 구성</h2>
        <p className="step-desc">
          <strong>{typeLabel}</strong> 사이트에 맞는 기본 페이지를 자동으로 구성했습니다.
          필요에 맞게 추가하거나 제거하세요.
        </p>
      </header>

      <div className="page-set-grid">
        {PAGE_OPTIONS.map((p) => {
          const checked = selected.includes(p.id);
          const isRequired = p.required === true;
          return (
            <label
              key={p.id}
              className={`page-set-card${checked ? ' checked' : ''}${isRequired ? ' locked' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={isRequired}
                onChange={() => dispatch(togglePage(p.id))}
                className="sr-only"
              />
              <span className="page-set-card-check" aria-hidden>{checked ? '✓' : ''}</span>
              <span className="page-set-card-body">
                <span className="page-set-card-label">
                  {p.label}
                  {isRequired && <span className="page-set-required-tag">필수</span>}
                </span>
                <span className="page-set-card-desc">{p.desc}</span>
                <span className="page-set-card-path">{p.path}</span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="field-hint" style={{ marginTop: 16 }}>
        선택한 페이지만 실제 URL 로 생성됩니다. 생성 이후에도 관리자 페이지에서 추가·삭제할 수 있습니다.
      </p>
    </section>
  );
}
