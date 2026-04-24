import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createSite } from '../../../api/sites';
import { saveMySite } from '../../../features/mySites/storage';
import {
  setSiteCreated,
  setSubmitError,
  setSubmitting,
} from '../../../features/siteBuilder/siteBuilderSlice';
import {
  selectAdminRequired,
  selectBasicInfo,
  selectCompletion,
  selectIsBasicInfoValid,
  selectIsSubmitting,
  selectPageContents,
  selectSelectedFeatures,
  selectSelectedPages,
  selectSiteType,
  selectSubmitError,
} from '../../../features/siteBuilder/selectors';
import { PAGE_OPTIONS } from '../../../features/siteBuilder/types';
import ReviewSummaryCard from '../cards/ReviewSummaryCard';
import CompletionStep from './CompletionStep';

// 마지막 단계 — 결과 확인 + 생성 요청.
// 좌측 미리보기는 BuilderLayout 이 항상 띄우므로, 이 단계는 "최종 점검 + 생성" 만 담당.
//
// 참고: 백엔드 API 가 아직 선택 페이지/기능의 신규 키셋을 받지 않으므로,
//       현재는 기존 키셋(companyPage/servicesPage/contactPage/adminEditable) 으로 변환 전송한다.
//       페이지별 콘텐츠(pageContents) 역시 다음 스테이지에서 API 에 추가 예정.
export default function ReviewStep() {
  const dispatch = useAppDispatch();
  const siteType      = useAppSelector(selectSiteType);
  const basic         = useAppSelector(selectBasicInfo);
  const pages         = useAppSelector(selectSelectedPages);
  const pageContents  = useAppSelector(selectPageContents);
  const features      = useAppSelector(selectSelectedFeatures);
  const adminRequired = useAppSelector(selectAdminRequired);
  const basicValid    = useAppSelector(selectIsBasicInfoValid);
  const submitting    = useAppSelector(selectIsSubmitting);
  const submitError   = useAppSelector(selectSubmitError);
  const completion    = useAppSelector(selectCompletion);

  // 홈은 기본 포함이므로 최소 1개 페이지는 항상 보장.
  const allValid = siteType === 'company' && basicValid && pages.length >= 1;

  const submitSite = async () => {
    if (siteType !== 'company') return;
    dispatch(setSubmitting(true));
    dispatch(setSubmitError(null));
    try {
      const data = await createSite({
        siteType: 'company',
        basic,
        selectedPages: pages,
        pageContents,
        features,
      });

      const createdAt = data.site.createdAt ?? new Date().toISOString();
      dispatch(setSiteCreated({
        siteId: String(data.site.id),
        slug:   data.site.slug,
        name:   data.site.name,
        adminRequired,
        createdAt,
      }));

      // 내 사이트 목록 누적 저장 — /app 에서 즉시 확인 가능.
      // 선택되어 실제 생성된 페이지들을 함께 저장 → 목록/완료 화면에서 멀티페이지 구조를 시각화.
      const pageInfos = PAGE_OPTIONS
        .filter((p) => pages.includes(p.id))
        .map((p) => ({ key: p.id, label: p.label, path: p.path }));

      saveMySite({
        id:            String(data.site.id),
        slug:          data.site.slug,
        name:          data.site.name,
        type:          data.site.type,
        createdAt,
        status:        'published',
        adminRequired,
        pages:         pageInfos,
      });
    } catch (e) {
      dispatch(setSubmitError(e instanceof Error ? e.message : '알 수 없는 오류'));
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  if (completion) return <CompletionStep />;

  return (
    <section className="step step-review">
      <header className="step-head">
        <h2>마지막으로 확인해 주세요</h2>
        <p className="step-desc">
          좌측 미리보기 그대로의 사이트가 생성되고 즉시 임시 URL 이 발급됩니다.
          입력값을 다시 확인한 뒤 <strong>사이트 생성하기</strong> 를 눌러주세요.
        </p>
      </header>

      <ReviewSummaryCard />
      {submitError && <p className="form-error">{submitError}</p>}
      <button
        type="button"
        className="btn primary btn-block"
        disabled={!allValid || submitting}
        onClick={submitSite}
      >
        {submitting ? '생성 중…' : '사이트 생성하기'}
      </button>
    </section>
  );
}
