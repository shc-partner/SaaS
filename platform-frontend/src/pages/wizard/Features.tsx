import { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  PAGE_FEATURE_IDS,
  selectBasic,
  selectSelectedFeatures,
  selectSiteType,
  toggleFeature,
  validateBasic,
  validateFeatures,
  type FeatureId,
  type PageFeatureId,
} from '../../features/siteBuilder/siteBuilderSlice';

// 페이지 id 자체는 슬라이스의 PAGE_FEATURE_IDS 가 단일 출처.
// 여기서는 그 id 에 사람이 보는 라벨/설명만 매핑한다.
const PAGE_LABELS: Record<PageFeatureId, { label: string; desc: string }> = {
  aboutPage:    { label: '회사 소개 페이지',  desc: '회사 연혁, 비전 등 소개 콘텐츠.' },
  servicesPage: { label: '서비스 소개 페이지', desc: '제공 서비스/제품 카드 목록.' },
  contactPage:  { label: '문의하기 페이지',    desc: '연락처, 주소, 폼.' },
};

export default function Features() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const siteType = useAppSelector(selectSiteType);
  const basic = useAppSelector(selectBasic);
  const features = useAppSelector(selectSelectedFeatures);

  const errors = useMemo(() => validateFeatures(features), [features]);
  const isValid = Object.keys(errors).length === 0;

  // 단계 가드 — 이전 단계가 비어 있거나 유효하지 않으면 해당 단계로 돌려보낸다.
  if (!siteType) return <Navigate to="/sites/new/type" replace />;
  if (Object.keys(validateBasic(basic)).length > 0) {
    return <Navigate to="/sites/new/setup/basic" replace />;
  }

  const isOn = (key: FeatureId) => features.includes(key);

  return (
    <section className="step step-features">
      <h2>어떤 페이지/기능을 포함할까요?</h2>
      <p className="step-desc">최소 한 개 페이지는 선택해야 합니다.</p>

      <ul className="toggle-list">
        {PAGE_FEATURE_IDS.map((id) => (
          <li key={id} className="toggle-item">
            <label>
              <input
                type="checkbox"
                checked={isOn(id)}
                onChange={() => dispatch(toggleFeature(id))}
              />
              <span className="toggle-text">
                <strong>{PAGE_LABELS[id].label}</strong>
                <small>{PAGE_LABELS[id].desc}</small>
              </span>
            </label>
          </li>
        ))}
        <li className="toggle-item toggle-divider">
          <label>
            <input
              type="checkbox"
              checked={isOn('adminEditable')}
              onChange={() => dispatch(toggleFeature('adminEditable'))}
            />
            <span className="toggle-text">
              <strong>관리자 수정 가능</strong>
              <small>해제하면 산출물에 정적 콘텐츠만 포함되고 관리자 화면이 빠집니다.</small>
            </span>
          </label>
        </li>
      </ul>

      {errors._form && <p className="form-error">{errors._form}</p>}

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={() => navigate('/sites/new/setup/basic')}>
          ← 기본 정보 수정
        </button>
        <button
          type="button"
          className="cta"
          disabled={!isValid}
          onClick={() => navigate('/sites/new/review')}
        >
          다음: 결과 확인 →
        </button>
      </div>
    </section>
  );
}
