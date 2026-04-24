import { configureStore } from '@reduxjs/toolkit';
import siteBuilderReducer from '../features/siteBuilder/siteBuilderSlice';

// 전역 store. 슬라이스가 늘어나면 reducer 키를 추가한다.
// 지속성(localStorage 등) 은 다음 단계에서 도입 — 현재는 메모리 상태만으로 충분.
export const store = configureStore({
  reducer: {
    siteBuilder: siteBuilderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
