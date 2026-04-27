import {
  BLANK_PAGE_CONTENT,
  DEFAULT_FEATURES,
  type PageContent,
  type PageKey,
  type SiteFeatureKey,
  type SiteTemplateSeed,
  type TemplatePageSeed,
} from './types';

// TemplateBuilderPatch — 템플릿 선택이 채우는 SiteBuilderState 필드 집합.
// siteBuilderSlice를 직접 import하면 순환 의존성이 생기므로 별도 타입으로 선언한다.
export interface TemplateBuilderPatch {
  startMode: 'template';
  selectedTemplateKey: string;
  siteType: 'company';
  selectedPages: PageKey[];
  selectedFeatures: SiteFeatureKey[];
  pageContents: Record<PageKey, PageContent>;
  activePageTab: PageKey;
}

// 알려진 PageKey 집합 — 런타임 방어용.
const KNOWN_PAGE_KEYS = new Set<string>(['home', 'about', 'services', 'contact', 'board']);
function isPageKey(key: string): key is PageKey {
  return KNOWN_PAGE_KEYS.has(key);
}

/**
 * 템플릿 seed → builder Redux state 초기값 변환 (순수 함수).
 *
 * - 외부 store 직접 접근 없음 / side effect 없음.
 * - 모든 PageContent 필드는 원본을 얕은 복사(spread)하여 반환하므로 seed 원본을 오염시키지 않는다.
 * - seed에 pages가 비어 있거나 섹션이 없어도 BLANK_PAGE_CONTENT로 안전하게 초기화된다.
 */
export function mapTemplateToBuilderState(template: SiteTemplateSeed): TemplateBuilderPatch {
  const defaultPages =
    template.defaultPages.length > 0
      ? template.defaultPages
      : template.pages.map((p) => p.key);

  return {
    startMode:           'template',
    selectedTemplateKey: template.key,
    siteType:            'company',
    selectedPages:       [...defaultPages],
    selectedFeatures:    [...(template.defaultFeatures ?? DEFAULT_FEATURES)],
    pageContents:        extractPageContents(template.pages),
    activePageTab:       (defaultPages[0] ?? 'home') as PageKey,
  };
}

/**
 * TemplatePageSeed[] → Record<PageKey, PageContent>
 *
 * 각 페이지에서 sortOrder가 가장 낮은 섹션의 content를 해당 페이지의 편집 가능 콘텐츠로 사용한다.
 * 섹션이 없는 페이지는 BLANK_PAGE_CONTENT로 초기화된다.
 * 알 수 없는 pageKey는 무시한다.
 */
function extractPageContents(pages: TemplatePageSeed[]): Record<PageKey, PageContent> {
  const result: Record<PageKey, PageContent> = {
    home:     { ...BLANK_PAGE_CONTENT },
    about:    { ...BLANK_PAGE_CONTENT },
    services: { ...BLANK_PAGE_CONTENT },
    contact:  { ...BLANK_PAGE_CONTENT },
    board:    { ...BLANK_PAGE_CONTENT },
  };

  for (const page of pages) {
    if (!isPageKey(page.key)) continue;
    if (page.sections.length === 0) continue;

    // sortOrder 오름차순 정렬 후 첫 번째 섹션이 해당 페이지의 주요(primary) 섹션
    const primary = page.sections
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)[0];

    result[page.key] = { ...primary.content };
  }

  return result;
}
