import type { SiteData } from './types';

// 빌더 라이브 프리뷰 전용 — "아직 백엔드에 보내기 전"의 입력값으로 SiteData 를 합성한다.
// 백엔드 Service::create() 의 초기 콘텐츠 빌드 규칙과 맞춰서, 생성 전/후 프리뷰 모양이 동일하도록 한다.
//
// 이번 스테이지부터는 선택된 페이지 목록과 페이지별 사용자 입력(PageContent)을 함께 받아,
// 사용자가 입력한 제목/리드/본문이 즉시 프리뷰에 반영되게 한다. 값이 비어 있으면 플레이스홀더 문구로 대체.

export interface PageContentInput {
  heading?: string;
  lead?: string;
  body?: string;
}

interface BuildInput {
  siteName: string;
  slug: string;
  industry: string;
  summary: string;
  /** 포함할 페이지 키 목록 (home 은 항상 포함되는 것으로 간주) */
  selectedPages?: string[];
  /** 페이지별 사용자 입력 */
  pageContents?: Partial<Record<string, PageContentInput>>;
  /** 기능 목록 — adminPage/contactForm/gallery/seoBasics */
  features: string[];
}

let nextId = -1;
const fakeId = () => nextId--;

const fallback = (v: string | undefined, placeholder: string): string =>
  (v && v.trim().length > 0) ? v : placeholder;

export function buildPreviewSiteData(input: BuildInput): SiteData {
  const name     = input.siteName;
  const industry = input.industry;
  const summary  = input.summary;
  const features = input.features;
  const selected = input.selectedPages ?? ['home', 'about', 'services', 'contact'];
  const pc       = input.pageContents ?? {};

  // ---------- pages ----------
  const pages: SiteData['pages'] = [{ id: fakeId(), key: 'home', label: '홈', path: '/', sort: 0 }];
  if (selected.includes('about'))    pages.push({ id: fakeId(), key: 'about',    label: '회사 소개', path: '/about',    sort: 10 });
  if (selected.includes('services')) pages.push({ id: fakeId(), key: 'services', label: '서비스',    path: '/services', sort: 20 });
  if (selected.includes('contact'))  pages.push({ id: fakeId(), key: 'contact',  label: '문의하기',  path: '/contact',  sort: 30 });
  if (selected.includes('board'))    pages.push({ id: fakeId(), key: 'board',    label: '게시판',    path: '/board',    sort: 40 });

  const homeId = pages[0].id;
  const aboutPage    = pages.find((p) => p.key === 'about')    ?? null;
  const servicesPage = pages.find((p) => p.key === 'services') ?? null;
  const contactPage  = pages.find((p) => p.key === 'contact')  ?? null;
  const boardPage    = pages.find((p) => p.key === 'board')    ?? null;

  const home     = pc.home     ?? {};
  const about    = pc.about    ?? {};
  const services = pc.services ?? {};
  const contact  = pc.contact  ?? {};
  const board    = pc.board    ?? {};

  // ---------- sections ----------
  // 헤더/푸터는 사이트 전역(pageId=null) — 어느 페이지에서도 동일하게 나타남.
  // hero/about/services/contact 는 각 페이지(pageId)에 귀속.
  const sections: SiteData['sections'] = [
    { id: fakeId(), pageId: null, kind: 'header', sort: 0, content: { brand: name } },
    {
      id: fakeId(), pageId: homeId, kind: 'hero', sort: 1,
      content: {
        // 홈 heading 을 입력했다면 사이트 이름보다 우선. 없으면 사이트 이름.
        title:    fallback(home.heading, name),
        subtitle: fallback(home.lead,     summary || (industry ? `${industry} 분야의 신뢰할 수 있는 파트너` : '')),
        cta:      '자세히 알아보기',
      },
    },
  ];

  if (aboutPage) {
    sections.push({
      id: fakeId(), pageId: aboutPage.id, kind: 'about', sort: 0,
      content: {
        heading: fallback(about.heading, '회사 소개'),
        industry,
        cards: [
          { title: '비전', body: fallback(about.lead, '기술과 경험을 결합해, 가장 확실한 결과를 전달합니다.') },
          { title: '경험', body: fallback(about.body, '다양한 업계 프로젝트를 통해 검증된 전문성을 보유하고 있습니다.') },
          { title: '팀',   body: '분야별 전문가가 협업하여 프로젝트의 성공을 책임집니다.' },
        ],
      },
    });
  }
  if (servicesPage) {
    sections.push({
      id: fakeId(), pageId: servicesPage.id, kind: 'services', sort: 0,
      content: {
        heading: fallback(services.heading, '서비스 소개'),
        lead:    fallback(services.lead,    '고객의 단계별 니즈에 맞춰 세 가지 영역의 서비스를 제공합니다.'),
        items: [
          { title: '컨설팅',       body: fallback(services.body, '비즈니스 목표에 맞춘 전략과 실행 계획을 함께 설계합니다.') },
          { title: '프로젝트 수행', body: '경험 있는 팀이 일정과 품질을 책임지고 결과물을 전달합니다.' },
          { title: '운영 지원',     body: '런칭 이후에도 안정적인 운영을 위한 유지보수와 개선을 지원합니다.' },
        ],
      },
    });
  }
  if (contactPage) {
    sections.push({
      id: fakeId(), pageId: contactPage.id, kind: 'contact', sort: 0,
      content: {
        heading: fallback(contact.heading, '문의하기'),
        lead:    fallback(contact.lead, `${name || 'Your Brand'} 에 대해 더 알고 싶다면 편하게 연락해 주세요.`),
        address: '서울특별시 ○○구 ○○로 00, 0층',
        phone:   '02-000-0000',
        email:   'contact@example.com',
        hours:   '평일 09:00 — 18:00',
      },
    });
  }
  if (boardPage) {
    sections.push({
      id: fakeId(), pageId: boardPage.id, kind: 'board', sort: 0,
      content: {
        heading: fallback(board.heading, '게시판'),
        lead: fallback(board.lead, '공지사항과 최신 소식을 한곳에서 확인하세요.'),
        posts: [
          {
            title: fallback(board.body, '사이트 오픈 안내'),
            excerpt: '새로운 소식과 운영 공지를 게시판에서 순차적으로 제공할 예정입니다.',
            date: '2026-04-25',
          },
          {
            title: '자주 묻는 질문',
            excerpt: '서비스 이용 방법과 문의 전 확인할 내용을 정리합니다.',
            date: '2026-04-25',
          },
        ],
      },
    });
  }
  sections.push({ id: fakeId(), pageId: null, kind: 'footer', sort: 99, content: { brand: name } });

  // 기능(contactForm/gallery/seoBasics)은 현재 렌더러에서 별도 섹션이 아직 없으므로
  // features 에 포함시켜 표기만 남기고, 렌더러 확장 시 참조하도록 둔다.
  void features;

  return {
    site: {
      id: 0,
      slug: input.slug || 'your-site',
      type: 'company',
      name,
      industry: industry || null,
      summary: summary || null,
      status: 'draft',
    },
    features,
    pages,
    sections,
    publicUrl: `/sites/${input.slug || 'your-site'}`,
  };
}
