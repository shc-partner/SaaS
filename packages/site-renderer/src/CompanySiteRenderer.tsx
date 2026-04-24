import { useState } from 'react';
import type {
  SiteData,
  HeaderContent,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
  BoardContent,
  FooterContent,
} from './types';
import HeaderSection from './sections/HeaderSection';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ContactSection from './sections/ContactSection';
import BoardSection from './sections/BoardSection';
import FooterSection from './sections/FooterSection';

interface Props {
  data: SiteData;
  /** 현재 보여줄 페이지 키. 주어지지 않으면 첫 페이지(home). */
  currentPageKey?: string;
  /** 네비게이션 제어권을 상위에 넘기고 싶을 때(SPA 라우팅 연동 등). 없으면 내부 state 로 전환. */
  onNavigate?: (key: string) => void;
  /** 실제 페이지 URL 빌더. 제공되면 헤더 nav 가 <a href> 로 렌더돼 새 탭 열기/북마크가 정상 동작. */
  getPageHref?: (key: string) => string;
}

// 기업 소개형 사이트의 풀 렌더링.
// 멀티 페이지: site_pages 의 각 페이지는 독립 화면. 사용자가 선택한 페이지만 등장하고,
// 헤더/푸터는 모든 페이지 공통. 클릭 시 현재 페이지만 바꾼다.
//
// 섹션 분배 규칙:
//   - kind === 'header' / 'footer' → 모든 페이지에 공통 렌더.
//   - pageId === null               → 공통 렌더(사이트 전역 섹션).
//   - 그 외                         → 해당 page.id 와 일치할 때만 렌더.
//
// 같은 컴포넌트 트리를 — 빌더 라이브 프리뷰 / public-web 런타임 / 어드민 편집기 / 산출물 이관본 —
// 네 군데가 모두 사용한다. 현재 페이지 제어권(currentPageKey / onNavigate)만 각 컨텍스트가 주입한다.
export default function CompanySiteRenderer({ data, currentPageKey, onNavigate, getPageHref }: Props) {
  const pages = data.pages;
  const firstKey = pages[0]?.key ?? 'home';

  // 상위에서 현재 페이지를 제어하지 않으면 내부에서 유지 — 정적 사용처(이관 HTML)까지 같은 컴포넌트로 덮기 위함.
  const [internalKey, setInternalKey] = useState<string>(firstKey);
  const activeKey = currentPageKey ?? internalKey;
  const navigate = (k: string) => {
    if (onNavigate) onNavigate(k);
    else setInternalKey(k);
  };

  const activePage = pages.find((p) => p.key === activeKey) ?? pages[0] ?? null;
  const sortedAll = [...data.sections].sort((a, b) => a.sort - b.sort);

  const headerSec = sortedAll.find((s) => s.kind === 'header');
  const footerSec = sortedAll.find((s) => s.kind === 'footer');
  const pageSecs  = sortedAll.filter((s) =>
    s.kind !== 'header' && s.kind !== 'footer' && activePage && s.pageId === activePage.id,
  );

  const brand = data.site.name;

  return (
    <article className="lp-site">
      {headerSec && (
        <HeaderSection
          content={headerSec.content as HeaderContent}
          pages={pages}
          currentKey={activeKey}
          onNavigate={navigate}
          getPageHref={getPageHref}
        />
      )}

      {pageSecs.map((s) => {
        switch (s.kind) {
          case 'hero':     return <HeroSection     key={s.id} content={s.content as HeroContent} />;
          case 'about':    return <AboutSection    key={s.id} content={s.content as AboutContent} brand={brand} />;
          case 'services': return <ServicesSection key={s.id} content={s.content as ServicesContent} />;
          case 'contact':  return <ContactSection  key={s.id} content={s.content as ContactContent} />;
          case 'board':    return <BoardSection    key={s.id} content={s.content as BoardContent} />;
          default:         return null;
        }
      })}

      {footerSec && <FooterSection content={footerSec.content as FooterContent} />}
    </article>
  );
}
