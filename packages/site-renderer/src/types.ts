// 산출물 사이트의 데이터 형태.
// 백엔드 GET /api/public/sites/:slug 의 data 필드와 동일한 형태로 맞춰야 한다.
// platform-frontend 의 라이브 프리뷰는 동일 형태를 입력값에서 in-memory 로 합성한다.

export type SectionKind = 'header' | 'hero' | 'about' | 'services' | 'contact' | 'board' | 'footer';

export interface SiteRow {
  id: number;
  slug: string;
  type: string;
  templateKey?: string | null;
  name: string;
  industry: string | null;
  summary: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageRow {
  id: number;
  key: string;
  label: string;
  path: string;
  sort: number;
}

export interface SectionRow<C = unknown> {
  id: number;
  pageId: number | null;
  kind: SectionKind | string;
  sort: number;
  content: C;
}

export interface SiteData {
  site: SiteRow;
  features: string[];
  pages: PageRow[];
  sections: SectionRow[];
  publicUrl?: string;
  adminUrl?: string | null;
}

// 섹션별 content 스키마 — 백엔드 Service::create() 가 만드는 모양과 1:1.
export interface HeaderContent  { brand: string }
export interface HeroContent    { title: string; subtitle: string; cta: string }
export interface AboutContent   { heading: string; industry: string; cards: { title: string; body: string }[] }
export interface ServicesContent{ heading: string; lead: string; items: { title: string; body: string }[] }
export interface ContactContent { heading: string; lead: string; address: string; phone: string; email: string; hours: string }
export interface BoardContent   { heading: string; lead: string; posts: { title: string; excerpt: string; date: string }[] }
export interface FooterContent  { brand: string }
