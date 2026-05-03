import { Outlet } from 'react-router-dom';
import WizardSteps from '../../components/WizardSteps';

// 위저드 4단계 화면이 공유하는 레이아웃.
// 상단 진행 표시 + 본문 영역. 본문은 중첩 라우트로 채워진다.
export default function WizardLayout() {
  return (
    <div className="wizard">
      <WizardSteps />
      <div className="wizard-body">
        <Outlet />
      </div>
    </div>
  );
}
