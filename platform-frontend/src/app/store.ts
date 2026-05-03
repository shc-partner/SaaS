import { configureStore } from '@reduxjs/toolkit';
import siteBuilderReducer, {
  type SiteBuilderState,
} from '../features/siteBuilder/siteBuilderSlice';
import authReducer from '../features/auth/authSlice';

// 전역 Redux store.
// 원칙: 여러 화면에서 공유되는 상태만 담는다. 지역 UI 상태는 컴포넌트 useState 유지.
// 자세한 판단 기준은 docs/state-management-guide.md.

// 슬라이스 모양이 바뀌면 키의 버전 번호를 올려 이전 저장값을 자동 무효화한다.
// v2: currentStep 키 제거, selectedFeatures 의 단일 출처화 (PAGE_FEATURE_IDS).
const PERSIST_KEY = 'siteforge:store:v2';

// preloadedState 의 일부 슬라이스만 복원하므로 부분 타입을 명시한다.
type PersistedShape = { siteBuilder?: SiteBuilderState };

// siteBuilder 만 localStorage 에 보존한다. auth 는 서버 세션이 진실원이 될 예정.
function loadPersisted(): PersistedShape | undefined {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as PersistedShape;
    return parsed.siteBuilder ? { siteBuilder: parsed.siteBuilder } : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    siteBuilder: siteBuilderReducer,
    auth: authReducer,
  },
  preloadedState: loadPersisted(),
});

// 변경 시 siteBuilder 슬라이스만 직렬화해 저장한다.
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(PERSIST_KEY, JSON.stringify({ siteBuilder: state.siteBuilder }));
  } catch {
    // 저장소 차단 환경에서는 메모리 상태로만 동작.
  }
});

// 슬라이스/셀렉터에서 사용할 전역 타입.
// store 인스턴스에서 추론하므로, 슬라이스가 늘어도 자동으로 따라온다.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
