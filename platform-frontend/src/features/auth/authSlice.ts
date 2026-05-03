import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// 인증 placeholder 슬라이스.
// 실제 로그인 API 는 후속 Phase 에서 연결한다.
// 구조만 먼저 잡아둬서 컴포넌트가 Redux 기준으로 인증 여부를 읽도록 준비한다.

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.status = action.payload ? 'authenticated' : 'idle';
    },
    clearAuthUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
    setAuthStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
  },
});

export const { setAuthUser, clearAuthUser, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;

// selectors
export const selectAuthUser = (s: RootState): AuthUser | null => s.auth.user;
export const selectIsAuthenticated = (s: RootState): boolean => s.auth.isAuthenticated;
export const selectAuthStatus = (s: RootState): AuthStatus => s.auth.status;
