import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// 사이트 생성 위저드 전용 슬라이스.
// 단계 사이에서 공유되는 값만 보관한다 — 각 입력의 포커스/블러/로컬 에러는 컴포넌트가 소유.
//
// 진행 단계(현재 어느 화면인지) 는 라우트(URL)가 진실원이다.
// Redux 에 따로 currentStep 을 두지 않는다 — 이중 출처가 되어 동기화 부담만 늘어난다.
// "지금 어느 단계?" 가 필요한 컴포넌트는 useLocation() 으로 파생한다.

// 페이지 기능 id 단일 출처. validator/UI/요약 화면이 모두 이 목록을 import 해서 쓴다.
export const PAGE_FEATURE_IDS = ['aboutPage', 'servicesPage', 'contactPage'] as const;
export type PageFeatureId = typeof PAGE_FEATURE_IDS[number];
export type FeatureId = PageFeatureId | 'adminEditable';

export type SiteType = 'company-intro' | null;

export interface BasicInfo {
  siteName: string;
  slug: string;
  industry: string;
  summary: string;
}

export interface SiteBuilderState extends BasicInfo {
  siteType: SiteType;
  selectedFeatures: FeatureId[];
}

// 기본 정보 필드 단일 출처. 액션 reducer 의 화이트리스트로 사용.
const BASIC_FIELDS: ReadonlyArray<keyof BasicInfo> = [
  'siteName', 'slug', 'industry', 'summary',
];

const initialState: SiteBuilderState = {
  siteType: null,
  siteName: '',
  slug: '',
  industry: '',
  summary: '',
  // 페이지 id (PAGE_FEATURE_IDS) + 'adminEditable' 플래그 가 한 배열에 공존.
  // 기본은 모두 활성. toggleFeature 로 켜고 끈다.
  selectedFeatures: [...PAGE_FEATURE_IDS, 'adminEditable'],
};

const siteBuilderSlice = createSlice({
  name: 'siteBuilder',
  initialState,
  reducers: {
    setSiteType(state, action: PayloadAction<SiteType>) {
      state.siteType = action.payload;
    },
    // payload: { siteName?, slug?, industry?, summary? } 부분 갱신.
    updateBasicInfo(state, action: PayloadAction<Partial<BasicInfo>>) {
      for (const key of BASIC_FIELDS) {
        const v = action.payload[key];
        if (v !== undefined) state[key] = v;
      }
    },
    // 문자열 feature id 를 토글한다.
    toggleFeature(state, action: PayloadAction<FeatureId>) {
      const id = action.payload;
      const i = state.selectedFeatures.indexOf(id);
      if (i >= 0) state.selectedFeatures.splice(i, 1);
      else state.selectedFeatures.push(id);
    },
    resetSiteBuilder() {
      // createSlice 의 Immer 컨텍스트에서 전체 치환은 return 방식.
      return initialState;
    },
  },
});

export const {
  setSiteType,
  updateBasicInfo,
  toggleFeature,
  resetSiteBuilder,
} = siteBuilderSlice.actions;

export default siteBuilderSlice.reducer;

// ---------- selectors ----------
export const selectSiteType = (s: RootState): SiteType => s.siteBuilder.siteType;

// 기본 정보 4필드를 묶어 돌려준다.
// createSelector 로 메모이제이션 — 입력 4개가 모두 같으면 동일 참조를 유지한다.
// 메모이제이션이 없으면 무관한 dispatch 에도 새 객체가 반환되어 useSelector 가 매번 재렌더된다.
export const selectBasic = createSelector(
  [
    (s: RootState) => s.siteBuilder.siteName,
    (s: RootState) => s.siteBuilder.slug,
    (s: RootState) => s.siteBuilder.industry,
    (s: RootState) => s.siteBuilder.summary,
  ],
  (siteName, slug, industry, summary): BasicInfo => ({ siteName, slug, industry, summary }),
);

export const selectSelectedFeatures = (s: RootState): FeatureId[] => s.siteBuilder.selectedFeatures;

// ---------- validators ----------
// 화면의 disabled 와 라우트 가드 양쪽이 같은 규칙을 공유하도록 여기 모아둔다.
// 추후 platform-backend 의 manifest.json JSON Schema 와 1:1 대응시킬 자리.
export type BasicErrors = Partial<Record<keyof BasicInfo, string>>;
export type FeaturesErrors = { _form?: string };

export function validateBasic(basic: BasicInfo): BasicErrors {
  const errors: BasicErrors = {};
  if (!basic.siteName?.trim()) errors.siteName = '사이트 이름은 필수입니다.';
  if (!basic.slug?.trim()) errors.slug = 'slug 는 필수입니다.';
  else if (!/^[a-z0-9](-?[a-z0-9])*$/.test(basic.slug)) {
    errors.slug = 'slug 는 영문 소문자/숫자/하이픈만 사용할 수 있습니다.';
  }
  if (!basic.industry?.trim()) errors.industry = '업종/주제를 입력하세요.';
  if (!basic.summary?.trim()) errors.summary = '한 줄 소개를 입력하세요.';
  return errors;
}

export function validateFeatures(selectedFeatures: FeatureId[]): FeaturesErrors {
  const anyPage = PAGE_FEATURE_IDS.some((k) => selectedFeatures.includes(k));
  return anyPage ? {} : { _form: '최소 한 개 페이지는 포함해야 합니다.' };
}
