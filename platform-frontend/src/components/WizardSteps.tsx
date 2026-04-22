import { useLocation } from 'react-router-dom';

// 위저드 상단 진행 표시.
// 현재 라우트와 비교해 active/done 상태를 시각화한다.
interface Step {
  path: string;
  label: string;
}

const STEPS: ReadonlyArray<Step> = [
  { path: '/sites/new/type',           label: '1. 유형 선택' },
  { path: '/sites/new/setup/basic',    label: '2-1. 기본 정보' },
  { path: '/sites/new/setup/features', label: '2-2. 기능 선택' },
  { path: '/sites/new/review',         label: '3. 결과 확인' },
];

export default function WizardSteps() {
  const { pathname } = useLocation();
  const currentIndex = STEPS.findIndex((s) => pathname.startsWith(s.path));

  return (
    <ol className="wizard-steps">
      {STEPS.map((step, i) => {
        const status =
          i < currentIndex ? 'done' :
          i === currentIndex ? 'active' :
          'todo';
        return (
          <li key={step.path} className={`wizard-step wizard-step-${status}`}>
            <span className="wizard-step-dot" />
            <span className="wizard-step-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
