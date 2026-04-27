import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BLANK_PAGE_CONTENT,
  COMPANY_TEMPLATES,
  DEFAULT_FEATURES,
  DEFAULT_PAGES_BY_TYPE,
  getActiveSteps,
  type BasicInfo,
  type BuilderStep,
  type PageContent,
  type PageKey,
  type PreviewViewport,
  type SiteFeatureKey,
  type SiteTemplateSeed,
  type SiteType,
  type StartMode,
} from './types';
import { mapTemplateToBuilderState } from './mapTemplateToBuilderState';

export interface SiteCompletion {
  siteId: string;
  slug: string;
  name: string;
  adminRequired: boolean;
  createdAt: string;
}

export interface SiteBuilderState {
  currentStep: BuilderStep;
  startMode: StartMode | null;
  selectedTemplateKey: string | null; // 템플릿 모드에서 선택한 템플릿
  siteType: SiteType | null;
  basicInfo: BasicInfo;
  selectedPages: PageKey[];
  selectedFeatures: SiteFeatureKey[];
  pageContents: Record<PageKey, PageContent>;
  activePageTab: PageKey;
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
  currentStep: 'startMode',
  startMode: null,
  selectedTemplateKey: null,
  siteType: null,
  basicInfo: { siteName: '', slug: '', industry: '', summary: '' },
  selectedPages: ['home', 'about', 'services', 'contact'],
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

    setStartMode(s, a: PayloadAction<StartMode>) {
      s.startMode = a.payload;
      // 시작 방식이 바뀌면 이전 템플릿/유형 선택 초기화
      s.selectedTemplateKey = null;
      s.siteType = null;
    },

    // 템플릿 key로 선택 — COMPANY_TEMPLATES에서 seed를 찾아 applyTemplateSeed에 위임
    setSelectedTemplate(s, a: PayloadAction<string>) {
      const tpl = COMPANY_TEMPLATES.find((t) => t.key === a.payload);
      if (!tpl) return;
      const patch = mapTemplateToBuilderState(tpl);
      s.selectedTemplateKey = patch.selectedTemplateKey;
      s.siteType             = patch.siteType;
      s.selectedPages        = patch.selectedPages;
      s.selectedFeatures     = patch.selectedFeatures;
      s.pageContents         = patch.pageContents;
      s.activePageTab        = patch.activePageTab;
    },

    // 템플릿 seed 객체를 직접 받아 전체 builder 초기값을 한 번에 주입한다.
    // startMode까지 포함하므로 외부에서 setStartMode를 별도로 호출할 필요가 없다.
    applyTemplateSeed(s, a: PayloadAction<SiteTemplateSeed>) {
      const patch = mapTemplateToBuilderState(a.payload);
      s.startMode            = patch.startMode;
      s.selectedTemplateKey  = patch.selectedTemplateKey;
      s.siteType             = patch.siteType;
      s.selectedPages        = patch.selectedPages;
      s.selectedFeatures     = patch.selectedFeatures;
      s.pageContents         = patch.pageContents;
      s.activePageTab        = patch.activePageTab;
    },

    setSiteType(s, a: PayloadAction<SiteType | null>) {
      s.siteType = a.payload;
      if (a.payload) {
        s.selectedPages = [...DEFAULT_PAGES_BY_TYPE[a.payload]];
      }
    },

    updateBasicInfo(s, a: PayloadAction<Partial<BasicInfo>>) {
      Object.assign(s.basicInfo, a.payload);
    },

    togglePage(s, a: PayloadAction<PageKey>) {
      if (a.payload === 'home') return;
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

    // startMode에 따라 활성 step 목록이 다르므로 동적으로 계산
    goToNextStep(s) {
      const active = getActiveSteps(s.startMode);
      const i = active.indexOf(s.currentStep);
      if (i >= 0 && i < active.length - 1) {
        s.currentStep = active[i + 1];
      }
    },

    goToPrevStep(s) {
      const active = getActiveSteps(s.startMode);
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
  setStartMode,
  setSelectedTemplate,
  applyTemplateSeed,
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
