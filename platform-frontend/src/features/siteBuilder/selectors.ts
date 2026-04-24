import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getActiveSteps, type BuilderStep } from './types';
import { validateBasicInfo, type BasicInfoErrors } from './utils';

export const selectCurrentStep      = (s: RootState) => s.siteBuilder.currentStep;
export const selectSiteType         = (s: RootState) => s.siteBuilder.siteType;
export const selectBasicInfo        = (s: RootState) => s.siteBuilder.basicInfo;
export const selectSelectedPages    = (s: RootState) => s.siteBuilder.selectedPages;
export const selectSelectedFeatures = (s: RootState) => s.siteBuilder.selectedFeatures;
export const selectPageContents     = (s: RootState) => s.siteBuilder.pageContents;
export const selectActivePageTab    = (s: RootState) => s.siteBuilder.activePageTab;
export const selectPreviewViewport  = (s: RootState) => s.siteBuilder.previewViewport;
export const selectIsSubmitting     = (s: RootState) => s.siteBuilder.isSubmitting;
export const selectSubmitError      = (s: RootState) => s.siteBuilder.submitError;
export const selectCompletion       = (s: RootState) => s.siteBuilder.completion;

// 관리자 필요 여부 — flow 분기 핵심.
export const selectAdminRequired = createSelector(
  [selectSelectedFeatures],
  (features) => features.includes('adminPage'),
);

// adminRequired 여부에 따라 실제 활성 step 목록.
export const selectActiveSteps = createSelector(
  [selectAdminRequired],
  (adminRequired): BuilderStep[] => getActiveSteps(adminRequired),
);

export const selectBasicInfoErrors = createSelector(
  [selectBasicInfo],
  (b): BasicInfoErrors => validateBasicInfo(b),
);
export const selectIsBasicInfoValid = createSelector(
  [selectBasicInfoErrors],
  (e) => Object.keys(e).length === 0,
);

// 다음 단계 진입 가드 — step 별 조건을 한 곳에서 관리.
export const selectCanGoNext = createSelector(
  [selectCurrentStep, selectSiteType, selectIsBasicInfoValid, selectSelectedPages, selectSelectedFeatures],
  (step, siteType, basicValid, pages, features) => {
    switch (step) {
      case 'siteType':   return siteType === 'company';
      case 'basicInfo':  return basicValid;
      case 'pages':      return pages.length >= 1; // 홈이 필수이므로 항상 true
      case 'features':   return true;
      case 'content':    return true;  // 내용은 선택사항
      case 'adminSetup': return features.includes('adminPage'); // 방어
      case 'review':     return true;
      default:           return false;
    }
  },
);

// ---------- 좌측 실시간 미리보기용 파생 셀렉터 ----------
export const selectPreviewUrl = createSelector(
  [selectBasicInfo],
  (b) => `siteforge.app/sites/${b.slug || 'your-site'}`,
);
