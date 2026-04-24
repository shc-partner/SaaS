import type { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateBasicInfo } from '../../../features/siteBuilder/siteBuilderSlice';
import {
  selectBasicInfo,
  selectBasicInfoErrors,
} from '../../../features/siteBuilder/selectors';
import { suggestSlug } from '../../../features/siteBuilder/utils';

// 2-1단계 — 기본 정보. siteName 변경 시 slug 자동 추출,
// 사용자가 slug 를 직접 수정한 흔적이 있으면 자동 덮어쓰기 중단.
export default function BasicInfoStep() {
  const dispatch = useAppDispatch();
  const basic = useAppSelector(selectBasicInfo);
  const errors = useAppSelector(selectBasicInfoErrors);

  const onName = (e: ChangeEvent<HTMLInputElement>) => {
    const siteName = e.target.value;
    const prevAuto = suggestSlug(basic.siteName);
    const userTouchedSlug = basic.slug && basic.slug !== prevAuto;
    dispatch(updateBasicInfo({
      siteName,
      slug: userTouchedSlug ? basic.slug : suggestSlug(siteName),
    }));
  };

  return (
    <section className="step">
      <header className="step-head">
        <h2>기본 정보</h2>
        <p className="step-desc">사이트 식별과 공개 페이지 헤더에 쓰일 정보를 입력하세요.</p>
      </header>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span className="field-label">사이트 이름 <em className="required">*</em></span>
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
          <span className="field-label">slug <em className="required">*</em></span>
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
          <span className="field-label">업종/주제 <em className="required">*</em></span>
          <input
            type="text"
            value={basic.industry}
            onChange={(e) => dispatch(updateBasicInfo({ industry: e.target.value }))}
            placeholder="예: 소프트웨어, 카페, 디자인 스튜디오"
          />
          {errors.industry && <em className="field-error">{errors.industry}</em>}
        </label>

        <label className="field">
          <span className="field-label">한 줄 소개</span>
          <input
            type="text"
            value={basic.summary}
            onChange={(e) => dispatch(updateBasicInfo({ summary: e.target.value }))}
            placeholder="회사를 한 문장으로 표현해 주세요. (선택)"
          />
        </label>
      </form>
    </section>
  );
}
