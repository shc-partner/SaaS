import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { goToNextStep, goToPrevStep } from '../../features/siteBuilder/siteBuilderSlice';
import {
  selectActiveSteps,
  selectCanGoNext,
  selectCompletion,
  selectCurrentStep,
} from '../../features/siteBuilder/selectors';

// 이전/다음 네비게이션.
// - review 단계의 "사이트 생성하기" 버튼은 ReviewStep 내부.
// - 완료 이후에는 완료 화면이 자체 CTA 를 가지므로 푸터를 숨긴다.
// - activeSteps 는 adminRequired 여부에 따라 adminSetup 이 포함/제외된다.
export default function BuilderFooter() {
  const dispatch   = useAppDispatch();
  const step       = useAppSelector(selectCurrentStep);
  const canNext    = useAppSelector(selectCanGoNext);
  const completion = useAppSelector(selectCompletion);
  const steps      = useAppSelector(selectActiveSteps);

  if (completion) return null;

  const idx = steps.indexOf(step);
  const showNext = step !== 'review';

  return (
    <footer className="builder-footer">
      <button
        type="button"
        className="btn ghost"
        disabled={idx <= 0}
        onClick={() => dispatch(goToPrevStep())}
      >
        ← 이전
      </button>
      {showNext && (
        <button
          type="button"
          className="btn primary"
          disabled={!canNext}
          onClick={() => dispatch(goToNextStep())}
        >
          다음 →
        </button>
      )}
    </footer>
  );
}
