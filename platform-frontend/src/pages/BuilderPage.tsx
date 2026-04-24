import BuilderLayout from '../components/builder/BuilderLayout';
import SiteTypeStep from '../components/builder/steps/SiteTypeStep';
import BasicInfoStep from '../components/builder/steps/BasicInfoStep';
import PageSelectionStep from '../components/builder/steps/PageSelectionStep';
import FeaturesStep from '../components/builder/steps/FeaturesStep';
import PageContentStep from '../components/builder/steps/PageContentStep';
import AdminSetupStep from '../components/builder/steps/AdminSetupStep';
import ReviewStep from '../components/builder/steps/ReviewStep';
import { useAppSelector } from '../app/hooks';
import { selectCurrentStep } from '../features/siteBuilder/selectors';

// 단일 페이지 빌더 — currentStep 에 따라 step 컴포넌트만 갈아끼운다.
// 라우팅은 /builder 한 개로 충분. step 순서는 slice 가 관리.
export default function BuilderPage() {
  const step = useAppSelector(selectCurrentStep);
  return (
    <BuilderLayout>
      {step === 'siteType'   && <SiteTypeStep />}
      {step === 'basicInfo'  && <BasicInfoStep />}
      {step === 'pages'      && <PageSelectionStep />}
      {step === 'features'   && <FeaturesStep />}
      {step === 'content'    && <PageContentStep />}
      {step === 'adminSetup' && <AdminSetupStep />}
      {step === 'review'     && <ReviewStep />}
    </BuilderLayout>
  );
}
