import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { togglePage } from '../../../features/siteBuilder/siteBuilderSlice';
import { selectSelectedPages } from '../../../features/siteBuilder/selectors';
import { PAGE_OPTIONS } from '../../../features/siteBuilder/types';
import PageCard from '../cards/PageCard';

// 단계 3 — 어떤 페이지를 포함할지 결정.
// 기획안 2번: 홈/회사 소개/서비스 소개/문의하기. 기타 페이지는 placeholder.
// 선택 결과가 이후 "페이지별 입력" 단계의 대상이 된다.
export default function PageSelectionStep() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedPages);

  return (
    <section className="step">
      <header className="step-head">
        <h2>어떤 페이지가 필요한가요?</h2>
        <p className="step-desc">
          선택한 페이지만 이후 <strong>페이지별 정보 입력</strong> 단계의 대상이 됩니다.
          홈은 기본으로 포함됩니다.
        </p>
      </header>

      <ul className="feature-list">
        {PAGE_OPTIONS.map((p) => (
          <PageCard
            key={p.id}
            opt={p}
            checked={selected.includes(p.id)}
            onToggle={() => dispatch(togglePage(p.id))}
          />
        ))}
      </ul>

      <p className="field-hint" style={{ marginTop: 12 }}>
        선택한 항목만 실제 공개 URL 로 생성됩니다. 예약 / 쇼핑몰 등 고급 페이지는 다음 유형으로 제공될 예정입니다.
      </p>
    </section>
  );
}
