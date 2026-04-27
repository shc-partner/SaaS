import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  me as apiMe,
  register as apiRegister,
  type AuthUser,
} from '../../api/auth';
import {
  clearAuthToken,
  loadAuthToken,
  loadStoredUser,
  saveAuthToken,
  saveStoredUser,
} from './storage';
import { clearMySites } from '../mySites/storage';

// 세션 상태 전역 공유.
// - 앱 시작 시 토큰이 있으면 /api/auth/me 로 검증.
// - login/register/logout 은 서버 호출 + 토큰 저장/파기 + 상태 갱신을 한 번에.
interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;          // 초기 부팅 중 여부
  isAuthenticated: boolean;
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
  /** OAuth 콜백 페이지가 호출 — 이미 서버가 발급한 토큰을 그대로 채택한다. */
  adoptToken: (token: string, prefillUser?: { id: number; email: string; name: string }) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(loadAuthToken()));

  // 앱 마운트 시 토큰 검증 — 만료/삭제된 세션이면 조용히 로그아웃 처리.
  useEffect(() => {
    const token = loadAuthToken();
    if (!token) { setLoading(false); return; }

    let alive = true;
    apiMe()
      .then((r) => { if (alive) setUser(r.user); })
      .catch(() => { if (alive) { clearAuthToken(); setUser(null); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const s = await apiLogin({ email, password });
    saveAuthToken(s.token);
    saveStoredUser({ id: s.user.id, email: s.user.email, name: s.user.name });
    setUser(s.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const s = await apiRegister({ name, email, password });
    saveAuthToken(s.token);
    saveStoredUser({ id: s.user.id, email: s.user.email, name: s.user.name });
    setUser(s.user);
  }, []);

  const logout = useCallback(async () => {
    // 서버 세션 파기 — 실패해도 로컬은 무조건 비움.
    try { await apiLogout(); } catch { /* noop */ }
    // 다른 계정이 같은 브라우저로 로그인할 때 이전 사용자의 사이트 캐시가 보이지 않도록 정리.
    if (user?.id !== undefined) clearMySites(user.id);
    clearAuthToken();
    setUser(null);
  }, [user?.id]);

  // OAuth 콜백 처리 — 서버가 이미 세션 토큰을 발급해 URL fragment 로 넘겨주었다.
  // 토큰만 저장한 뒤 /api/auth/me 로 사용자 정보를 정식으로 채운다.
  const adoptToken = useCallback(async (
    token: string,
    prefillUser?: { id: number; email: string; name: string },
  ): Promise<AuthUser> => {
    saveAuthToken(token);
    if (prefillUser) saveStoredUser(prefillUser);
    const r = await apiMe();
    saveStoredUser({ id: r.user.id, email: r.user.email, name: r.user.name });
    setUser(r.user);
    return r.user;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: user !== null,
    login, register, logout, adoptToken,
  }), [user, loading, login, register, logout, adoptToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// 초기 복구용 — 토큰은 있는데 me() 가 끝나기 전이면 loadStoredUser() 로 이름 정도는 즉시 표시.
export function useDisplayName(): string | null {
  const { user } = useAuth();
  if (user) return user.name;
  return loadStoredUser()?.name ?? null;
}
