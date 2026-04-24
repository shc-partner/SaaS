import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setSiteType } from '../../../features/siteBuilder/siteBuilderSlice';
import { selectSiteType } from '../../../features/siteBuilder/selectors';
import { SITE_TYPE_OPTIONS } from '../../../features/siteBuilder/types';
import SiteTypeCard from '../cards/SiteTypeCard';

// 1단계 — 사이트 유형 선택. 현재는 company 만 활성.
export default function SiteTypeStep() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSiteType);

  return (
    <section className="step">
      <header className="step-head">
        <h2>클릭 몇 번으로 나만의 사이트를 만들고, 운영해 보세요.</h2>
        <p className="step-desc">
          현재는 <strong>회사 소개</strong> 사이트만 만들 수 있어요. 다른 유형은 곧 제공됩니다.
        </p>
      </header>
      <ul className="site-type-grid">
        {SITE_TYPE_OPTIONS.map((opt) => (
          <SiteTypeCard
            key={opt.id}
            opt={opt}
            selected={selected === opt.id}
            onSelect={() => {
              if (!opt.enabled) return;
              dispatch(setSiteType(opt.id));
            }}
          />
        ))}
      </ul>
    </section>
  );
}
