import type { ReactNode } from 'react';
import MarketingHeader from './MarketingHeader';
import AppFooter from './AppFooter';

// 공개 영역(/, /features, /templates, /pricing, /use-cases, /contact, /login, /signup) 공통 셸.
// flush 프롭: hero 가 화면 가득 차야 하는 랜딩류 페이지는 본문 래퍼의 max-width/padding 을 끈다.
export default function MarketingShell({ children, flush }: { children: ReactNode; flush?: boolean }) {
  return (
    <div className="app-shell">
      <MarketingHeader />
      <main className={`app-main ${flush ? 'marketing-main-flush' : 'marketing-main-contained'}`}>
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
