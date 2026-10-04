import type { ReactNode } from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

// 모든 페이지를 감싸는 최상위 셸.
// 헤더는 sticky, 푸터는 본문 아래.
// `flush` 모드: 빌더처럼 본문을 화면 가득 채우는 페이지용 — 본문 영역의 가운데 정렬/패딩을 끈다.
interface Props {
  children: ReactNode;
  flush?: boolean;
  fullScreen?: boolean;
}

export default function AppShell({ children, flush, fullScreen }: Props) {
  return (
    <div className={`app-shell app-shell--workspace${fullScreen ? ' app-shell--full-screen' : ''}`}>
      <AppHeader />
      <main className={`app-main ${flush || fullScreen ? '' : 'contained'}${fullScreen ? ' app-main--full-screen' : ''}`}>
        {children}
      </main>
      {!fullScreen && <AppFooter />}
    </div>
  );
}
