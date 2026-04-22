import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import {
  selectBasic,
  selectSelectedFeatures,
  selectSiteType,
  validateBasic,
  validateFeatures,
  type FeatureId,
} from '../../features/siteBuilder/siteBuilderSlice';

// 좌우 분할 결과 확인 화면.
// 좌: 생성될 페이지 구조 트리.  우: 입력값/선택 기능 요약.
// 최종 생성은 mock — 현재는 가짜 ID 를 만들어 done 화면으로 보낸다.
// 실제 엔진 연결은 다음 Phase. mock 결과는 라우트 state 로 전달해 Redux 를 지저분하게 하지 않는다.
export default function Review() {
  const navigate = useNavigate();
  const siteType = useAppSelector(selectSiteType);
  const basic = useAppSelector(selectBasic);
  const features = useAppSelector(selectSelectedFeatures);

  // 단계 가드 — 이전 단계가 미완료면 해당 단계로 돌려보낸다.
  if (!siteType) return <Navigate to="/sites/new/type" replace />;
  if (Object.keys(validateBasic(basic)).length > 0) return <Navigate to="/sites/new/setup/basic" replace />;
  if (Object.keys(validateFeatures(features)).length > 0) return <Navigate to="/sites/new/setup/features" replace />;

  const isOn = (key: FeatureId) => features.includes(key);

  const pages = [
    { key: 'home',     label: '홈',           always: true,  on: false },
    { key: 'about',    label: '회사 소개',     always: false, on: isOn('aboutPage') },
    { key: 'services', label: '서비스 소개',   always: false, on: isOn('servicesPage') },
    { key: 'contact',  label: '문의하기',      always: false, on: isOn('contactPage') },
  ].filter((p) => p.always || p.on);

  const handleGenerate = () => {
    // mock: 진짜 생성 엔진은 다음 Phase 에서.
    const id = `mock-${Date.now()}`;
    const createdAt = new Date().toISOString();
    navigate(`/sites/new/done/${encodeURIComponent(id)}`, { state: { createdAt } });
  };

  return (
    <section className="step step-review">
      <h2>이렇게 생성됩니다</h2>
      <p className="step-desc">아래 내용으로 사이트를 생성합니다. 수정이 필요하면 단계로 돌아가세요.</p>

      <div className="review-split">
        <div className="review-pane">
          <h3>생성될 페이지 구조</h3>
          <ul className="page-tree">
            <li className="page-tree-root">
              <strong>{basic.slug || 'site'}/</strong>
              <ul>
                {pages.map((p) => (
                  <li key={p.key}>📄 <code>/{p.key === 'home' ? '' : p.key}</code> — {p.label}</li>
                ))}
                {isOn('adminEditable') && (
                  <li>🛠 <code>/admin</code> — 관리자 (콘텐츠 수정)</li>
                )}
              </ul>
            </li>
          </ul>
          <p className="hint">
            산출물에는 React 프런트엔드 + plain PHP 백엔드 + MySQL 스키마/seed 가 함께 포함됩니다.
          </p>
        </div>

        <div className="review-pane">
          <h3>입력 요약</h3>
          <dl className="kv">
            <dt>유형</dt><dd>{siteType === 'company-intro' ? '기업 소개형' : siteType}</dd>
            <dt>사이트 이름</dt><dd>{basic.siteName}</dd>
            <dt>slug</dt><dd><code>{basic.slug}</code></dd>
            <dt>업종/주제</dt><dd>{basic.industry}</dd>
            <dt>한 줄 소개</dt><dd>{basic.summary}</dd>
            <dt>포함 페이지</dt>
            <dd>
              {[
                isOn('aboutPage') && '회사 소개',
                isOn('servicesPage') && '서비스 소개',
                isOn('contactPage') && '문의하기',
              ].filter(Boolean).join(', ') || '— (홈만)'}
            </dd>
            <dt>관리자 수정</dt>
            <dd>{isOn('adminEditable') ? '활성' : '비활성 (정적 콘텐츠만)'}</dd>
          </dl>
        </div>
      </div>

      <div className="form-actions form-actions-spread">
        <button type="button" className="btn-ghost" onClick={() => navigate('/sites/new/setup/features')}>
          ← 기능 선택 수정
        </button>
        <button type="button" className="cta cta-primary" onClick={handleGenerate}>
          이대로 생성하기 (mock)
        </button>
      </div>
    </section>
  );
}
