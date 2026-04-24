import type { BasicInfo } from './types';

// 사이트 이름 → slug 자동 추출.
// 사용자가 slug 를 직접 수정하면 BasicInfoStep 안에서 자동 덮어쓰기를 멈춘다.
export function suggestSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9](-?[a-z0-9])*$/.test(slug);
}

export interface BasicInfoErrors {
  siteName?: string;
  slug?: string;
  industry?: string;
  summary?: string;
}

// 화면 disabled 와 step 이동 가드가 같은 규칙을 공유하도록 한 곳에 둔다.
// summary 는 약한 권장 — 빈값을 에러로 만들지 않는다.
export function validateBasicInfo(b: BasicInfo): BasicInfoErrors {
  const e: BasicInfoErrors = {};
  if (!b.siteName.trim()) e.siteName = '사이트 이름은 필수입니다.';
  if (!b.slug.trim()) e.slug = 'slug 는 필수입니다.';
  else if (!isValidSlug(b.slug)) e.slug = 'slug 는 영문 소문자/숫자/하이픈만 사용할 수 있습니다.';
  if (!b.industry.trim()) e.industry = '업종/주제를 입력하세요.';
  return e;
}
