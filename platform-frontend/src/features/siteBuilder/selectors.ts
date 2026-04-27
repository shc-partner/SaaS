import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getActiveSteps, type BuilderStep } from './types';
import { validateBasicInfo, type BasicInfoErrors } from './utils';

export const selectCurrentStep         = (s: RootState) => s.siteBuilder.currentStep;
export const selectStartMode           = (s: RootState) => s.siteBuilder.startMode;
export const selectSelectedTemplateKey = (s: RootState) => s.siteBuilder.selectedTemplateKey;
export const selectSiteType            = (s: RootState) => s.siteBuilder.siteType;
export const selectBasicInfo           = (s: RootState) => s.siteBuilder.basicInfo;
export const selectSelectedPages       = (s: RootState) => s.siteBuilder.selectedPages;
export const selectSelectedFeatures    = (s: RootState) => s.siteBuilder.selectedFeatures;
export const selectPageContents        = (s: RootState) => s.siteBuilder.pageContents;
export const selectActivePageTab       = (s: RootState) => s.siteBuilder.activePageTab;
export const selectPreviewViewport     = (s: RootState) => s.siteBuilder.previewViewport;
export const selectIsSubmitting        = (s: RootState) => s.siteBuilder.isSubmitting;
export const selectSubmitError         = (s: RootState) => s.siteBuilder.submitError;
export const selectCompletion          = (s: RootState) => s.siteBuilder.completion;

// adminPage는 항상 포함 — 완료 화면 링크 분기용
export const selectAdminRequired = createSelector(
  [selectSelectedFeatures],
  (features) => features.includes('adminPage'),
);

// startMode에 따라 step 목록이 달라진다
export const selectActiveSteps = createSelector(
  [selectStartMode],
  (startMode): BuilderStep[] => getActiveSteps(startMode),
);

export const selectBasicInfoErrors = createSelector(
  [selectBasicInfo],
  (b): BasicInfoErrors => validateBasicInfo(b),
);

export const selectIsBasicInfoValid = createSelector(
  [selectBasicInfoErrors],
  (e) => Object.keys(e).length === 0,
);

// 다음 단계 진입 가드
export const selectCanGoNext = createSelector(
  [selectCurrentStep, selectStartMode, selectSelectedTemplateKey, selectSiteType, selectIsBasicInfoValid, selectSelectedPages],
  (step, startMode, templateKey, siteType, basicValid, pages) => {
    switch (step) {
      case 'startMode':      return startMode !== null;
      case 'templateSelect': return templateKey !== null;
      case 'siteType':       return siteType !== null;
      case 'basicInfo':      return basicValid;
      case 'pageSet':        return pages.length >= 1;
      case 'editor':         return true;
      default:               return false;
    }
  },
);

export const selectPreviewUrl = createSelector(
  [selectBasicInfo],
  (b) => `creatordesk.app/sites/${b.slug || 'your-site'}`,
);
