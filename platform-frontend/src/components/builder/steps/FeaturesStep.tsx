import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleFeature } from '../../../features/siteBuilder/siteBuilderSlice';
import { selectSelectedFeatures } from '../../../features/siteBuilder/selectors';
import { FEATURE_OPTIONS } from '../../../features/siteBuilder/types';
import FeatureCard from '../cards/FeatureCard';

// 단계 4 — 기능 선택.
// 기획안 3번: 문의 폼 / 갤러리·배너 / SEO 기본 / 관리자 페이지 필요.
// "관리자 페이지 필요" 체크 시 이후 flow 에 adminSetup 단계가 삽입된다 — slice 의 goToNext/Prev 가
// selectSelectedFeatures 를 기반으로 activeSteps 를 동적으로 계산한다.
export default function FeaturesStep() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedFeatures);

  const adminFeature = FEATURE_OPTIONS.find((f) => f.branch === 'admin');
  const otherFeatures = FEATURE_OPTIONS.filter((f) => f.branch !== 'admin');

  return (
    <section className="step">
      <header className="step-head">
        <h2>필요한 기능을 선택하세요</h2>
        <p className="step-desc">
          사이트 운영에 필요한 기능을 선택합니다. <strong>관리자 페이지 필요</strong>는 체크 시
          이후에 관리자 생성 단계가 추가됩니다.
        </p>
      </header>

      <div className="feature-group">
        <h3>사이트 기능</h3>
        <ul className="feature-list">
          {otherFeatures.map((f) => (
            <FeatureCard
              key={f.id}
              opt={f}
              checked={selected.includes(f.id)}
              onToggle={() => dispatch(toggleFeature(f.id))}
            />
          ))}
        </ul>
      </div>

      {adminFeature && (
        <div className="feature-group">
          <h3>운영 옵션</h3>
          <ul className="feature-list">
            <FeatureCard
              opt={adminFeature}
              checked={selected.includes(adminFeature.id)}
              onToggle={() => dispatch(toggleFeature(adminFeature.id))}
            />
          </ul>
          <p className="field-hint" style={{ marginTop: 8 }}>
            체크 시 <strong>관리자 생성 Flow</strong> 단계가 추가됩니다.
            미체크 시 결과 확인으로 바로 진행합니다.
          </p>
        </div>
      )}
    </section>
  );
}
