// 사이트 빌더 타입과 상수의 단일 출처.
// 슬라이스 / 셀렉터 / UI 모두 여기서 import 해서 쓴다.
//
// Flow (startMode에 따라 분기):
//   template : startMode → templateSelect → basicInfo → pageSet → editor
//   ai/blank : startMode → siteType       → basicInfo → pageSet → editor

// ---------- 시작 방식 ----------
export type StartMode = 'template' | 'ai' | 'blank';

export interface StartModeOption {
  id: StartMode;
  label: string;
  desc: string;
  badge?: string;
}

export const START_MODE_OPTIONS: ReadonlyArray<StartModeOption> = [
  { id: 'template', label: '템플릿으로 시작',    desc: '업종에 맞는 완성형 템플릿을 골라 바로 편집하세요.' },
  { id: 'ai',       label: 'AI 초안으로 시작',   desc: '사이트 정보를 입력하면 AI가 초안을 자동 구성해 드립니다.', badge: 'BETA' },
  { id: 'blank',    label: '빈 구조로 시작',      desc: '페이지 구조만 잡고, 처음부터 직접 채워 보세요.' },
];

// ---------- 빌더 step ----------
export type BuilderStep =
  | 'startMode'
  | 'templateSelect'   // template 모드에서만 등장
  | 'siteType'         // ai/blank 모드에서만 등장
  | 'basicInfo'
  | 'pageSet'
  | 'editor';

// 시작 방식에 따라 step 목록이 다르다.
export function getActiveSteps(startMode: StartMode | null): BuilderStep[] {
  if (startMode === 'template') {
    return ['startMode', 'templateSelect', 'basicInfo', 'pageSet', 'editor'];
  }
  return ['startMode', 'siteType', 'basicInfo', 'pageSet', 'editor'];
}

export const STEP_LABELS: Record<BuilderStep, string> = {
  startMode:      '시작 방식',
  templateSelect: '템플릿 선택',
  siteType:       '사이트 유형',
  basicInfo:      '기본 정보',
  pageSet:        '페이지 구성',
  editor:         '콘텐츠 편집',
};

// ---------- 사이트 유형 ----------
export type SiteType =
  | 'company' | 'portfolio' | 'blog' | 'shop'
  | 'booking' | 'workspace' | 'members' | 'education';

// ---------- 페이지 ----------
export type PageKey = 'home' | 'about' | 'services' | 'contact' | 'board';

export interface PageOption {
  id: PageKey;
  label: string;
  desc: string;
  path: string;
  sort: number;
  required?: boolean;
}

export const PAGE_OPTIONS: ReadonlyArray<PageOption> = [
  { id: 'home',     label: '홈',     desc: '방문자가 처음 만나는 메인 페이지.',     path: '/',         sort: 0,  required: true },
  { id: 'about',    label: '소개',   desc: '브랜드·팀·비전을 소개하는 페이지.',     path: '/about',    sort: 10 },
  { id: 'services', label: '서비스', desc: '제공하는 서비스·제품 라인업.',          path: '/services', sort: 20 },
  { id: 'contact',  label: '문의',   desc: '연락처·주소·문의 폼.',                 path: '/contact',  sort: 30 },
  { id: 'board',    label: '게시판', desc: '공지사항·소식을 게시판 형태로 제공.',   path: '/board',    sort: 40 },
];

export const DEFAULT_PAGES_BY_TYPE: Record<SiteType, PageKey[]> = {
  company:   ['home', 'about', 'services', 'contact'],
  portfolio: ['home', 'about', 'services', 'contact'],
  blog:      ['home', 'about', 'board',    'contact'],
  shop:      ['home', 'about', 'services', 'contact'],
  booking:   ['home', 'about', 'services', 'contact'],
  workspace: ['home', 'about', 'services', 'contact'],
  members:   ['home', 'about', 'services', 'contact'],
  education: ['home', 'about', 'services', 'board'],
};

// ---------- 기능 ----------
export type SiteFeatureKey = 'contactForm' | 'gallery' | 'seoBasics' | 'adminPage';

export interface FeatureOption {
  id: SiteFeatureKey;
  label: string;
  desc: string;
}

export const FEATURE_OPTIONS: ReadonlyArray<FeatureOption> = [
  { id: 'contactForm', label: '문의 폼',        desc: '방문자가 문의 내용을 남길 수 있는 폼.' },
  { id: 'gallery',     label: '갤러리 / 배너',  desc: '이미지 슬라이드·배너 영역.' },
  { id: 'seoBasics',   label: 'SEO 기본 설정',  desc: '검색엔진 노출용 메타/OG 태그.' },
  { id: 'adminPage',   label: '관리자 페이지',  desc: '운영 중 콘텐츠를 수정할 수 있는 관리자 영역.' },
];

export const DEFAULT_FEATURES: ReadonlyArray<SiteFeatureKey> = [
  'contactForm', 'gallery', 'seoBasics', 'adminPage',
];

// ---------- 페이지별 콘텐츠 ----------
export interface PageContent {
  heading: string;
  lead: string;
  body: string;
}

export const BLANK_PAGE_CONTENT: PageContent = { heading: '', lead: '', body: '' };

// ---------- 템플릿 seed 타입 ----------
// 각 섹션이 렌더러에 어떤 종류로 맵핑되는지 나타낸다.
// home 페이지 → hero 섹션, 나머지는 페이지 키와 동일.
export type TemplateSectionKind = 'hero' | 'about' | 'services' | 'contact' | 'board';

export interface TemplateSectionSeed {
  kind: TemplateSectionKind;
  sortOrder: number;
  content: PageContent;
}

export interface TemplatePageSeed {
  key: PageKey;
  label: string;
  sections: TemplateSectionSeed[];
}

// ---------- 기본 정보 ----------
export interface BasicInfo {
  siteName: string;
  slug: string;
  industry: string;
  summary: string;
}

// ---------- 사이트 템플릿 seed ----------
export interface SiteTemplateSeed {
  key: string;
  name: string;
  tagline: string;          // 카드 강조 한 줄
  description: string;
  styleTone: string;        // 미리보기 chrome 배지 및 카드 분위기
  accentColor: string;      // 카드 포인트 컬러 (CSS var 또는 hex)
  recommendedFor: string[]; // 추천 업종 태그
  defaultPages: PageKey[];  // 기본 선택 페이지 목록
  defaultFeatures?: SiteFeatureKey[];
  pages: TemplatePageSeed[];  // 전체 페이지 + 섹션 초안 데이터
}

// SiteTemplate은 SiteTemplateSeed의 별칭으로 유지(하위 호환)
export type SiteTemplate = SiteTemplateSeed;

export const COMPANY_TEMPLATES: ReadonlyArray<SiteTemplateSeed> = [
  // ① 기본 기업형
  {
    key: 'basic-corporate',
    name: '기본 기업형',
    tagline: '가장 표준적인 기업 소개 사이트',
    description: '안정적이고 범용적인 구성으로 다양한 업종에 어울립니다.',
    styleTone: '안정적 · 범용',
    accentColor: '#3b6ef8',
    recommendedFor: ['일반 기업', '중소기업', 'B2B', '유통'],
    defaultPages: ['home', 'about', 'services', 'contact'],
    pages: [
      {
        key: 'home', label: '홈',
        sections: [{
          kind: 'hero', sortOrder: 0,
          content: {
            heading: '신뢰할 수 있는 비즈니스 파트너',
            lead: '고객의 성공이 우리의 최우선 목표입니다',
            body: '설립 이래 수백 개의 기업과 함께 성장해온 경험을 바탕으로, 최고의 비즈니스 솔루션을 제공합니다. 신뢰와 전문성, 그리고 고객 중심의 서비스로 함께하겠습니다.',
          },
        }],
      },
      {
        key: 'about', label: '소개',
        sections: [{
          kind: 'about', sortOrder: 0,
          content: {
            heading: '회사 소개',
            lead: '믿음과 성과로 증명하는 기업입니다',
            body: '20년의 업력과 전문 인력을 보유한 신뢰할 수 있는 비즈니스 파트너입니다. 각 분야 전문가들이 최선의 성과를 위해 일하고 있으며, 고객사와 장기적인 파트너십을 이어가고 있습니다.',
          },
        }],
      },
      {
        key: 'services', label: '서비스',
        sections: [{
          kind: 'services', sortOrder: 0,
          content: {
            heading: '서비스 소개',
            lead: '고객 맞춤형 솔루션을 제공합니다',
            body: '컨설팅, 운영 지원, 기술 서비스까지 다양한 분야에서 전문적인 서비스를 제공합니다. 고객의 상황과 목표에 맞는 최적의 솔루션을 찾아드립니다.',
          },
        }],
      },
      {
        key: 'contact', label: '문의',
        sections: [{
          kind: 'contact', sortOrder: 0,
          content: {
            heading: '문의하기',
            lead: '언제든지 연락 주세요',
            body: '담당자가 신속하게 답변드리겠습니다. 아래 양식을 통해 문의하시거나 직접 전화 또는 이메일로 연락해 주세요. 영업일 기준 1일 내 회신드립니다.',
          },
        }],
      },
    ],
  },

  // ② SaaS / 스타트업형
  {
    key: 'saas-startup',
    name: 'SaaS / 스타트업형',
    tagline: '제품 가치를 임팩트 있게 전달',
    description: 'IT·플랫폼·스타트업에 적합한 현대적이고 깔끔한 구성입니다.',
    styleTone: '모던 · 임팩트',
    accentColor: '#7c3aed',
    recommendedFor: ['스타트업', 'IT/SaaS', '앱 서비스', '플랫폼'],
    defaultPages: ['home', 'about', 'services', 'contact'],
    pages: [
      {
        key: 'home', label: '홈',
        sections: [{
          kind: 'hero', sortOrder: 0,
          content: {
            heading: '비즈니스를 더 스마트하게',
            lead: '우리 플랫폼으로 팀 생산성을 2배 높이세요',
            body: '복잡한 업무 프로세스를 자동화하고, 데이터 기반 의사결정으로 더 빠르게 성장하세요. 수천 개의 팀이 이미 더 나은 방법으로 일하고 있습니다. 지금 바로 무료로 시작해 보세요.',
          },
        }],
      },
      {
        key: 'about', label: '소개',
        sections: [{
          kind: 'about', sortOrder: 0,
          content: {
            heading: '우리는 문제를 해결합니다',
            lead: '글로벌 경험과 로컬 인사이트의 만남',
            body: '실리콘밸리와 국내 스타트업 생태계 경험을 가진 팀이 모여, 기업들이 겪는 실제 문제를 기술로 해결합니다. 고객의 피드백을 즉각 반영하는 애자일 문화로 제품을 빠르게 개선합니다.',
          },
        }],
      },
      {
        key: 'services', label: '서비스',
        sections: [{
          kind: 'services', sortOrder: 0,
          content: {
            heading: '제품 소개',
            lead: '강력하지만 사용하기 쉬운 플랫폼',
            body: '대시보드 분석, 자동화 워크플로우, 팀 협업 도구 등 비즈니스 성장에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다. 복잡한 설정 없이 5분 안에 시작할 수 있습니다.',
          },
        }],
      },
      {
        key: 'contact', label: '문의',
        sections: [{
          kind: 'contact', sortOrder: 0,
          content: {
            heading: '도입 문의',
            lead: '14일 무료 체험, 카드 없이 시작',
            body: '제품 데모를 신청하시거나 무료 체험을 시작하세요. 전담 매니저가 온보딩을 도와드립니다. 도입 규모와 무관하게 성실하게 답변드립니다.',
          },
        }],
      },
    ],
  },

  // ③ 전문 서비스형
  {
    key: 'professional-service',
    name: '전문 서비스형',
    tagline: '신뢰와 전문성을 전면에',
    description: '컨설팅·법무·세무·에이전시 등 전문직 업종에 최적화된 구성입니다.',
    styleTone: '신뢰 · 전문성',
    accentColor: '#0d7a5f',
    recommendedFor: ['컨설팅', '법무/세무', '디자인', '에이전시', '회계'],
    defaultPages: ['home', 'about', 'services', 'contact'],
    pages: [
      {
        key: 'home', label: '홈',
        sections: [{
          kind: 'hero', sortOrder: 0,
          content: {
            heading: '전문가가 함께합니다',
            lead: '검증된 전문성으로 최선의 결과를 만들어 드립니다',
            body: '각 분야 최고의 전문가들이 고객의 성공을 위해 맞춤형 서비스를 제공합니다. 수백 건의 성공 사례와 높은 고객 만족도가 우리의 전문성을 증명합니다.',
          },
        }],
      },
      {
        key: 'about', label: '소개',
        sections: [{
          kind: 'about', sortOrder: 0,
          content: {
            heading: '우리의 전문성',
            lead: '경력과 실적으로 말합니다',
            body: '풍부한 경험과 전문 자격을 보유한 전문가 집단입니다. 각 사안에 대해 심층 분석과 맞춤형 전략을 제시하며, 실행 단계까지 끝까지 책임지고 함께합니다.',
          },
        }],
      },
      {
        key: 'services', label: '서비스',
        sections: [{
          kind: 'services', sortOrder: 0,
          content: {
            heading: '제공 서비스',
            lead: '맞춤형 전문 서비스를 경험하세요',
            body: '초기 진단부터 전략 수립, 실행, 사후 관리까지 원스톱으로 제공합니다. 고객의 상황과 목표에 맞는 최적의 솔루션을 찾아 명확한 결과를 만들어 드립니다.',
          },
        }],
      },
      {
        key: 'contact', label: '문의',
        sections: [{
          kind: 'contact', sortOrder: 0,
          content: {
            heading: '상담 예약',
            lead: '지금 바로 전문가와 상담하세요',
            body: '무료 초기 상담을 통해 현재 상황을 파악하고, 최적의 솔루션을 제안드립니다. 상담 후 진행 여부는 부담 없이 결정하실 수 있습니다.',
          },
        }],
      },
    ],
  },

  // ④ 제조 / 산업형
  {
    key: 'manufacturing',
    name: '제조 / 산업형',
    tagline: '기술력과 생산 역량을 앞세우는 구성',
    description: '제조업·B2B 산업·기술 공급업체에 적합한 신뢰감 있는 구성입니다.',
    styleTone: '기술 · 안정',
    accentColor: '#b45309',
    recommendedFor: ['제조업', 'B2B', '건설/자재', '기계/설비', '화학'],
    defaultPages: ['home', 'about', 'services', 'contact'],
    pages: [
      {
        key: 'home', label: '홈',
        sections: [{
          kind: 'hero', sortOrder: 0,
          content: {
            heading: '기술이 미래를 만듭니다',
            lead: '30년 제조 노하우, 글로벌 품질 기준',
            body: '엄격한 품질 관리와 첨단 기술력을 바탕으로, 국내외 수백 개 기업에 신뢰할 수 있는 제품과 솔루션을 공급합니다. 귀사의 생산 경쟁력을 높여 드립니다.',
          },
        }],
      },
      {
        key: 'about', label: '소개',
        sections: [{
          kind: 'about', sortOrder: 0,
          content: {
            heading: '기업 개요',
            lead: '국내 최고 수준의 기술력을 보유한 제조 기업',
            body: '1994년 설립 이래 꾸준한 기술 개발과 품질 혁신으로 업계를 선도해 왔습니다. ISO 인증과 다수의 특허를 보유하고 있으며, 연간 수출액 500억 원을 달성한 강소기업입니다.',
          },
        }],
      },
      {
        key: 'services', label: '서비스',
        sections: [{
          kind: 'services', sortOrder: 0,
          content: {
            heading: '제품 및 솔루션',
            lead: '다양한 산업 분야의 맞춤형 솔루션',
            body: '산업용 장비, 정밀 부품, 맞춤형 제조 솔루션까지 다양한 제품 라인업을 갖추고 있습니다. OEM/ODM 서비스와 소량 시제품 제작도 지원합니다.',
          },
        }],
      },
      {
        key: 'contact', label: '문의',
        sections: [{
          kind: 'contact', sortOrder: 0,
          content: {
            heading: '견적 및 납품 문의',
            lead: 'B2B 전담팀이 신속하게 답변드립니다',
            body: '사업자 등록 기업을 대상으로 납품 상담, 견적, 샘플 신청이 가능합니다. 소규모 발주부터 대량 납품까지 규모와 무관하게 성실하게 응대합니다.',
          },
        }],
      },
    ],
  },

  // ⑤ 로컬 비즈니스형
  {
    key: 'local-business',
    name: '로컬 비즈니스형',
    tagline: '지역 고객과의 거리를 좁히는 친근한 구성',
    description: '병원·학원·스튜디오·소매점 등 지역 밀착형 업체에 최적화된 구성입니다.',
    styleTone: '친근 · 접근성',
    accentColor: '#b91c6e',
    recommendedFor: ['병원/클리닉', '학원/교육', '미용/뷰티', '카페/식당', '스튜디오'],
    defaultPages: ['home', 'about', 'services', 'contact'],
    pages: [
      {
        key: 'home', label: '홈',
        sections: [{
          kind: 'hero', sortOrder: 0,
          content: {
            heading: '우리 동네 최고의 선택',
            lead: '가까운 곳에서 최고의 서비스를 만나보세요',
            body: '지역 주민들과 함께 성장해온 믿음직한 이웃입니다. 편안하게 방문하시거나 연락 주세요. 처음 방문하시는 분께는 특별한 혜택을 드립니다.',
          },
        }],
      },
      {
        key: 'about', label: '소개',
        sections: [{
          kind: 'about', sortOrder: 0,
          content: {
            heading: '우리 이야기',
            lead: '지역 사회와 함께 성장해 왔습니다',
            body: '2010년 처음 문을 연 이래, 지역 주민 여러분의 사랑으로 성장해 왔습니다. 작은 가게에서 시작해 지금은 스태프 10명과 함께 더 나은 서비스를 드리고 있습니다.',
          },
        }],
      },
      {
        key: 'services', label: '서비스',
        sections: [{
          kind: 'services', sortOrder: 0,
          content: {
            heading: '이용 안내',
            lead: '편리하게 이용하실 수 있습니다',
            body: '방문, 전화, 온라인 예약 모두 가능합니다. 주차 공간이 넉넉하며 편안한 환경에서 서비스를 받으실 수 있습니다. 단체 예약 시 별도 할인이 적용됩니다.',
          },
        }],
      },
      {
        key: 'contact', label: '문의',
        sections: [{
          kind: 'contact', sortOrder: 0,
          content: {
            heading: '오시는 길 & 예약',
            lead: '전화 한 통으로 쉽게 예약하세요',
            body: '평일 오전 9시부터 오후 7시, 주말 오전 10시부터 오후 6시까지 운영합니다. 주차는 건물 내 무료 주차장을 이용하세요. 예약 없이 방문하셔도 대기 후 이용 가능합니다.',
          },
        }],
      },
    ],
  },
];

// ---------- 사이트 유형 카드 ----------
export type SiteTypePricing = 'free' | 'paid';

export interface SiteTypeOption {
  id: SiteType;
  label: string;
  desc: string;
  pricing: SiteTypePricing;
  enabled: boolean;
}

export const SITE_TYPE_OPTIONS: ReadonlyArray<SiteTypeOption> = [
  { id: 'company',   label: '회사 소개',          desc: '기업 정보·서비스·문의로 구성된 사이트.',    pricing: 'free', enabled: true  },
  { id: 'portfolio', label: '포트폴리오',          desc: '프로젝트/작업물 갤러리형 사이트.',           pricing: 'free', enabled: false },
  { id: 'blog',      label: '블로그 / 뉴스',       desc: '글 발행과 카테고리 기반 사이트.',            pricing: 'free', enabled: false },
  { id: 'shop',      label: '쇼핑몰',              desc: '상품 카탈로그 + 장바구니/결제.',             pricing: 'paid', enabled: false },
  { id: 'booking',   label: '예약 / 신청',         desc: '시간/슬롯 기반 예약과 신청 폼.',             pricing: 'paid', enabled: false },
  { id: 'workspace', label: '회사 업무 관리',      desc: '내부 업무 도구 (게시판/일정/문서).',         pricing: 'paid', enabled: false },
  { id: 'members',   label: '회원 전용 사이트',    desc: '로그인한 회원에게만 콘텐츠 제공.',           pricing: 'paid', enabled: false },
  { id: 'education', label: '교육 / 강의 사이트',  desc: '강의 콘텐츠/수강 진도 관리.',                pricing: 'paid', enabled: false },
];

// ---------- 미리보기 뷰포트 ----------
export type PreviewViewport = 'desktop' | 'mobile';
