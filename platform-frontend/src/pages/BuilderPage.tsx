import BuilderLayout       from '../components/builder/BuilderLayout';
import StartModeStep       from '../components/builder/steps/StartModeStep';
import TemplateSelectStep  from '../components/builder/steps/TemplateSelectStep';
import SiteTypeStep        from '../components/builder/steps/SiteTypeStep';
import BasicInfoStep       from '../components/builder/steps/BasicInfoStep';
import PageSetStep         from '../components/builder/steps/PageSetStep';
import EditorStep          from '../components/builder/steps/EditorStep';
import { useAppSelector }  from '../app/hooks';
import { selectCurrentStep } from '../features/siteBuilder/selectors';

// 단일 페이지 빌더. startMode에 따라 step 흐름이 분기된다.
//   template : startMode → templateSelect → basicInfo → pageSet → editor
//   ai/blank : startMode → siteType       → basicInfo → pageSet → editor
export default function BuilderPage() {
  const step = useAppSelector(selectCurrentStep);
  return (
    <BuilderLayout>
      {step === 'startMode'      && <StartModeStep />}
      {step === 'templateSelect' && <TemplateSelectStep />}
      {step === 'siteType'       && <SiteTypeStep />}
      {step === 'basicInfo'      && <BasicInfoStep />}
      {step === 'pageSet'        && <PageSetStep />}
      {step === 'editor'         && <EditorStep />}
    </BuilderLayout>
  );
}
