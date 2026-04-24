// 사이트 빌더의 타입과 상수 단일 출처.
// 슬라이스 / 셀렉터 / UI 모두 여기서 import 해서 쓴다 — 문자열 하드코딩을 막는다.
//
// Flow 구조도에 맞춰 step 은 다음과 같이 재정의되었다.
//   1. siteType      — 유형 선택
//   2. basicInfo     — 사이트 식별(이름/slug/업종/요약)
//   3. pages         — 필요한 페이지 선택
//   4. features      — 기능 선택 (문의 폼/갤러리/SEO/관리자 페이지)
//   5. content       — 선택한 페이지 순서대로 페이지별 정보 입력
//   6. adminSetup    — (조건부) 관리자 페이지 필요 시만 진입
//   7. review        — 결과 확인 / 임시 URL 발급
//
// 관리자 필요 체크 여부가 "flow 분기"의 핵심. slice 가 이 flag 를 읽어 step 목록을 동적으로 구성한다.

export type BuilderStep =
  | 'siteType'
  | 'basicInfo'
  | 'pages'
  | 'features'
  | 'content'
  | 'adminSetup'
  | 'review';

export type SiteType =
  | 'company'
  | 'portfolio'
  | 'blog'
  | 'shop'
  | 'booking'
  | 'workspace'
  | 'members'
  | 'education';

// ---------- 페이지 ----------
// 홈은 늘 기본 포함. 나머지는 선택.
export type PageKey = 'home' | 'about' | 'services' | 'contact' | 'board';

export interface PageOption {
  id: PageKey;
  label: string;
  desc: string;
  path: string;
  sort: number;
  required?: boolean; // 해제 불가 (홈)
}

export const PAGE_OPTIONS: ReadonlyArray<PageOption> = [
  { id: 'home',     label: '홈',         desc: '방문자가 처음 만나는 메인 페이지.', path: '/',         sort: 0,  required: true  },
  { id: 'about',    label: '회사 소개',   desc: '회사의 비전/경험/팀을 소개.',       path: '/about',    sort: 10 },
  { id: 'services', label: '서비스 소개', desc: '제공하는 서비스/제품 라인업.',       path: '/services', sort: 20 },
  { id: 'contact',  label: '문의하기',    desc: '연락처/주소/문의 폼.',               path: '/contact',  sort: 30 },
  { id: 'board',    label: '게시판',      desc: '공지사항과 소식을 게시판 형태로 제공.', path: '/board',    sort: 40 },
];

// ---------- 기능 ----------
// 기획안의 4종을 그대로 반영. adminPage 가 flow 분기 트리거.
export type SiteFeatureKey = 'contactForm' | 'gallery' | 'seoBasics' | 'adminPage';

export interface FeatureOption {
  id: SiteFeatureKey;
  label: string;
  desc: string;
  branch?: 'admin'; // 체크 시 flow 분기가 걸리는 기능
}

export const FEATURE_OPTIONS: ReadonlyArray<FeatureOption> = [
  { id: 'contactForm', label: '문의 폼',        desc: '방문자가 문의 내용을 남길 수 있는 폼.' },
  { id: 'gallery',     label: '갤러리 / 배너',  desc: '이미지 슬라이드·배너 영역.' },
  { id: 'seoBasics',   label: 'SEO 기본 설정',  desc: '검색엔진 노출용 메타/OG 태그.' },
  { id: 'adminPage',   label: '관리자 페이지 필요', desc: '운영 중 콘텐츠를 수정하려면 필요. 체크 시 관리자 생성 Flow 진행.', branch: 'admin' },
];

export const DEFAULT_FEATURES: ReadonlyArray<SiteFeatureKey> = ['contactForm', 'adminPage'];
export const DEFAULT_PAGES: ReadonlyArray<PageKey> = ['home', 'about', 'services', 'contact', 'board'];

// ---------- 페이지별 콘텐츠 ----------
// 기획안의 "텍스트 / 이미지 / 레이아웃 / 섹션 구성" 중, 이번 단계에서는 핵심 텍스트부터 입력 받는다.
// 이미지·레이아웃 블록 편집은 다음 스테이지 — 상태 구조만 확장 가능한 형태로 잡아둔다.
export interface PageContent {
  heading: string;  // 섹션 제목(hero/about heading 등)
  lead: string;     // 리드 문구 / 부제목
  body: string;     // 본문 설명
}

export const BLANK_PAGE_CONTENT: PageContent = { heading: '', lead: '', body: '' };

// ---------- 기본 정보 ----------
export interface BasicInfo {
  siteName: string;
  slug: string;
  industry: string;
  summary: string;
}

// ---------- step 메타 ----------
// 전체 목록. flow 는 slice 의 adminRequired 여부에 따라 adminSetup 을 포함/제외한다.
export const ALL_BUILDER_STEPS: ReadonlyArray<BuilderStep> = [
  'siteType', 'basicInfo', 'pages', 'features', 'content', 'adminSetup', 'review',
];

export const STEP_LABELS: Record<BuilderStep, string> = {
  siteType:   '유형 선택',
  basicInfo:  '기본 정보',
  pages:      '페이지 선택',
  features:   '기능 선택',
  content:    '페이지별 입력',
  adminSetup: '관리자 페이지',
  review:     '결과 확인',
};

export function getActiveSteps(adminRequired: boolean): BuilderStep[] {
  return ALL_BUILDER_STEPS.filter((s) => (s === 'adminSetup' ? adminRequired : true));
}

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
  { id: 'company',   label: '회사 소개',          desc: '기업 정보·서비스·문의로 구성된 단일 사이트.', pricing: 'free', enabled: true  },
  { id: 'portfolio', label: '포트폴리오',         desc: '프로젝트/작업물 갤러리형 사이트.',           pricing: 'free', enabled: false },
  { id: 'blog',      label: '블로그 / 뉴스',      desc: '글 발행과 카테고리 기반 사이트.',             pricing: 'free', enabled: false },
  { id: 'shop',      label: '쇼핑몰',             desc: '상품 카탈로그 + 장바구니/결제.',              pricing: 'paid', enabled: false },
  { id: 'booking',   label: '예약 / 신청',        desc: '시간/슬롯 기반 예약과 신청 폼.',              pricing: 'paid', enabled: false },
  { id: 'workspace', label: '회사 업무 관리',     desc: '내부 업무 도구 (게시판/일정/문서).',          pricing: 'paid', enabled: false },
  { id: 'members',   label: '회원 전용 사이트',   desc: '로그인한 회원에게만 콘텐츠 제공.',            pricing: 'paid', enabled: false },
  { id: 'education', label: '교육 / 강의 사이트', desc: '강의 콘텐츠/수강 진도 관리.',                 pricing: 'paid', enabled: false },
];

// ---------- 미리보기 뷰포트 ----------
export type PreviewViewport = 'desktop' | 'mobile';
