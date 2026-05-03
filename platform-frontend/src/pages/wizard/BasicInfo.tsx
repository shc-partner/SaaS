import { useMemo, type ChangeEvent, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectBasic,
  selectSiteType,
  updateBasicInfo,
  validateBasic,
} from '../../features/siteBuilder/siteBuilderSlice';

// 사이트 이름에서 slug 자동 추출 — 사용자가 그대로 두면 추적, 직접 수정하면 멈춘다.
function suggestSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

export default function BasicInfo() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const siteType = useAppSelector(selectSiteType);
  const basic = useAppSelector(selectBasic);

  const errors = useMemo(() => validateBasic(basic), [basic]);
  const isValid = Object.keys(errors).length === 0;

  // 단계 가드 — render 중 navigate() 호출은 React 가 경고하므로 <Navigate> 로 교체.
  // 유형 선택 안 했으면 처음으로 돌려보낸다.
  if (!siteType) return <Navigate to="/sites/new/type" replace />;

  const onName = (e: ChangeEvent<HTMLInputElement>) => {
    const siteName = e.target.value;
    const autoPrev = suggestSlug(basic.siteName);
    const userTouchedSlug = basic.slug && basic.slug !== autoPrev;
    dispatch(updateBasicInfo({
      siteName,
      slug: userTouchedSlug ? basic.slug : suggestSlug(siteName),
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/sites/new/setup/features');
  };

  return (
    <section className="step step-basic">
      <h2>기본 정보</h2>
      <p className="step-desc">사이트의 기본 식별 정보를 입력하세요.</p>

      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span>사이트 이름</span>
          <input
            type="text"
            value={basic.siteName}
            onChange={onName}
            placeholder="예: 한빛소프트"
            autoFocus
          />
          {errors.siteName && <em className="field-error">{errors.siteName}</em>}
        </label>

        <label className="field">
          <span>slug</span>
          <input
            type="text"
            value={basic.slug}
            onChange={(e) => dispatch(updateBasicInfo({ slug: e.target.value }))}
            placeholder="예: hanbit-soft"
          />
          <small className="field-hint">URL 과 산출물 폴더명에 사용. 영문 소문자/숫자/하이픈만.</small>
          {errors.slug && <em className="field-error">{errors.slug}</em>}
        </label>

        <label className="field">
          <span>업종/주제</span>
          <input
            type="text"
            value={basic.industry}
            onChange={(e) => dispatch(updateBasicInfo({ industry: e.target.value }))}
            placeholder="예: 소프트웨어, 카페, 디자인 스튜디오"
          />
          {errors.industry && <em className="field-error">{errors.industry}</em>}
        </label>

        <label className="field">
          <span>한 줄 소개</span>
          <input
            type="text"
            value={basic.summary}
            onChange={(e) => dispatch(updateBasicInfo({ summary: e.target.value }))}
            placeholder="예: 빠르고 정확한 백오피스 솔루션"
          />
          {errors.summary && <em className="field-error">{errors.summary}</em>}
        </label>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/sites/new/type')}>
            {/* 유형 재선택 — 다시 돌아가도 이미 고른 값은 Redux 에 남는다. */}
            ← 유형 다시 고르기
          </button>
          <button type="submit" className="cta" disabled={!isValid}>
            다음: 기능 선택 →
          </button>
        </div>
      </form>
    </section>
  );
}
