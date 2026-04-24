import { Fragment } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
  selectActiveSteps,
  selectCompletion,
  selectCurrentStep,
} from '../../features/siteBuilder/selectors';
import { STEP_LABELS } from '../../features/siteBuilder/types';

// 진행 표시 — 번호 동그라미 + 연결선.
// 관리자 필요 여부에 따라 adminSetup 이 포함/제외되므로 activeSteps 를 기반으로 그린다.
export default function BuilderProgress() {
  const current    = useAppSelector(selectCurrentStep);
  const completion = useAppSelector(selectCompletion);
  const steps      = useAppSelector(selectActiveSteps);
  const idx        = steps.indexOf(current);

  return (
    <ol className="builder-progress" aria-label="진행 단계">
      {steps.map((s, i) => {
        const status = completion
          ? 'done'
          : i < idx ? 'done' : i === idx ? 'active' : 'todo';
        const isLast = i === steps.length - 1;
        return (
          <Fragment key={s}>
            <li
              className={`builder-progress-item builder-progress-${status}`}
              aria-current={status === 'active' ? 'step' : undefined}
            >
              <span className="step-num" aria-hidden>
                {status === 'done' ? '✓' : i + 1}
              </span>
              <span className="label">{STEP_LABELS[s]}</span>
            </li>
            {!isLast && <span className="builder-progress-connector" aria-hidden />}
          </Fragment>
        );
      })}
    </ol>
  );
}
