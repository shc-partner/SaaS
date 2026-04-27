import type { ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCompletion, selectCurrentStep } from '../../features/siteBuilder/selectors';
import BuilderProgress from './BuilderProgress';
import BuilderFooter from './BuilderFooter';
import BuilderPreviewPanel from './BuilderPreviewPanel';

// 빌더 셸 — step에 따라 3가지 레이아웃을 분기한다.
//
//  ① startMode   : 미리보기 없음 — 전체 화면 집중형 선택 UI
//  ② 그 외 step  : 왼쪽 미리보기 / 오른쪽 설정 분할 레이아웃
//  ③ completion  : 미리보기 없음 — 결과 화면이 전체 폭을 차지
interface Props {
  children: ReactNode;
}

export default function BuilderLayout({ children }: Props) {
  const currentStep = useAppSelector(selectCurrentStep);
  const completion  = useAppSelector(selectCompletion);

  // ③ 완료 화면
  if (completion) {
    return (
      <div className="builder">
        <BuilderProgress />
        <main className="builder-body builder-body-full">{children}</main>
      </div>
    );
  }

  // ① 시작 방식 선택 — 미리보기 없는 집중형 레이아웃
  if (currentStep === 'startMode') {
    return (
      <div className="builder">
        <BuilderProgress />
        <div className="builder-selection-layout">
          <div className="builder-selection-body">{children}</div>
          <BuilderFooter />
        </div>
      </div>
    );
  }

  // ② 나머지 step — 왼쪽 미리보기 / 오른쪽 설정
  return (
    <div className="builder">
      <BuilderProgress />
      <div className="builder-split">
        <aside className="builder-preview-pane">
          <BuilderPreviewPanel />
        </aside>
        <section className="builder-settings-pane">
          <div className="builder-settings-body">{children}</div>
          <BuilderFooter />
        </section>
      </div>
    </div>
  );
}
