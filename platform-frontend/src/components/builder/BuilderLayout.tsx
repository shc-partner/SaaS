import type { ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCompletion } from '../../features/siteBuilder/selectors';
import BuilderProgress from './BuilderProgress';
import BuilderFooter from './BuilderFooter';
import BuilderPreviewPanel from './BuilderPreviewPanel';

// 빌더 셸 — AppShell(flush) 안에서 좌/우 분할 또는 풀폭으로 렌더.
// 상단 브랜드는 AppHeader 가 담당하므로, 여기서는 step progress 부터 시작한다.
// 생성 완료 상태에서는 분할을 풀고 결과 화면이 전체 폭을 차지한다.
interface Props {
  children: ReactNode;
}

export default function BuilderLayout({ children }: Props) {
  const completion = useAppSelector(selectCompletion);

  if (completion) {
    return (
      <div className="builder">
        <BuilderProgress />
        <main className="builder-body builder-body-full">{children}</main>
      </div>
    );
  }

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
