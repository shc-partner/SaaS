import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BLANK_PAGE_CONTENT,
  DEFAULT_FEATURES,
  DEFAULT_PAGES,
  getActiveSteps,
  type BasicInfo,
  type BuilderStep,
  type PageContent,
  type PageKey,
  type PreviewViewport,
  type SiteFeatureKey,
  type SiteType,
} from './types';

// 생성 완료 결과 — 백엔드가 반환한 공식 식별자를 담는다.
export interface SiteCompletion {
  siteId: string;
  slug: string;
  name: string;
  adminRequired: boolean;
  createdAt: string;
}

export interface SiteBuilderState {
  currentStep: BuilderStep;
  siteType: SiteType | null;
  basicInfo: BasicInfo;
  selectedPages: PageKey[];
  selectedFeatures: SiteFeatureKey[];
  pageContents: Record<PageKey, PageContent>;
  activePageTab: PageKey;      // content 스텝에서 현재 편집 중인 페이지
  previewViewport: PreviewViewport;
  isSubmitting: boolean;
  submitError: string | null;
  completion: SiteCompletion | null;
}

const blankPageContents = (): Record<PageKey, PageContent> => ({
  home:     { ...BLANK_PAGE_CONTENT },
  about:    { ...BLANK_PAGE_CONTENT },
  services: { ...BLANK_PAGE_CONTENT },
  contact:  { ...BLANK_PAGE_CONTENT },
  board:    { ...BLANK_PAGE_CONTENT },
});

const initialState: SiteBuilderState = {
  currentStep: 'siteType',
  siteType: null,
  basicInfo: { siteName: '', slug: '', industry: '', summary: '' },
  selectedPages: [...DEFAULT_PAGES],
  selectedFeatures: [...DEFAULT_FEATURES],
  pageContents: blankPageContents(),
  activePageTab: 'home',
  previewViewport: 'desktop',
  isSubmitting: false,
  submitError: null,
  completion: null,
};

const slice = createSlice({
  name: 'siteBuilder',
  initialState,
  reducers: {
    setCurrentStep(s, a: PayloadAction<BuilderStep>) {
      s.currentStep = a.payload;
    },
    setSiteType(s, a: PayloadAction<SiteType | null>) {
      s.siteType = a.payload;
    },
    updateBasicInfo(s, a: PayloadAction<Partial<BasicInfo>>) {
      Object.assign(s.basicInfo, a.payload);
    },
    togglePage(s, a: PayloadAction<PageKey>) {
      if (a.payload === 'home') return; // 홈은 필수, 토글 불가
      const i = s.selectedPages.indexOf(a.payload);
      if (i >= 0) s.selectedPages.splice(i, 1);
      else s.selectedPages.push(a.payload);
    },
    toggleFeature(s, a: PayloadAction<SiteFeatureKey>) {
      const i = s.selectedFeatures.indexOf(a.payload);
      if (i >= 0) s.selectedFeatures.splice(i, 1);
      else s.selectedFeatures.push(a.payload);
    },
    updatePageContent(s, a: PayloadAction<{ page: PageKey; patch: Partial<PageContent> }>) {
      Object.assign(s.pageContents[a.payload.page], a.payload.patch);
    },
    setActivePageTab(s, a: PayloadAction<PageKey>) {
      s.activePageTab = a.payload;
    },
    setPreviewViewport(s, a: PayloadAction<PreviewViewport>) {
      s.previewViewport = a.payload;
    },
    goToNextStep(s) {
      const active = getActiveSteps(s.selectedFeatures.includes('adminPage'));
      const i = active.indexOf(s.currentStep);
      if (i >= 0 && i < active.length - 1) s.currentStep = active[i + 1];
    },
    goToPrevStep(s) {
      const active = getActiveSteps(s.selectedFeatures.includes('adminPage'));
      const i = active.indexOf(s.currentStep);
      if (i > 0) s.currentStep = active[i - 1];
    },
    resetSiteBuilder() {
      return initialState;
    },
    setSubmitting(s, a: PayloadAction<boolean>) {
      s.isSubmitting = a.payload;
    },
    setSubmitError(s, a: PayloadAction<string | null>) {
      s.submitError = a.payload;
    },
    setSiteCreated(s, a: PayloadAction<SiteCompletion>) {
      s.completion = a.payload;
    },
    clearCompletion(s) {
      s.completion = null;
    },
  },
});

export const {
  setCurrentStep,
  setSiteType,
  updateBasicInfo,
  togglePage,
  toggleFeature,
  updatePageContent,
  setActivePageTab,
  setPreviewViewport,
  goToNextStep,
  goToPrevStep,
  resetSiteBuilder,
  setSubmitting,
  setSubmitError,
  setSiteCreated,
  clearCompletion,
} = slice.actions;

export default slice.reducer;
