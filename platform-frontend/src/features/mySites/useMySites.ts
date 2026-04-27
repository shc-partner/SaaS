import { useEffect, useState } from 'react';
import { fetchMySites, type MySiteSummary } from '../../api/sites';
import { useAuth } from '../auth/AuthProvider';
import { loadMySites, purgeLegacyCaches, saveMySites, type MySite } from './storage';

// 백엔드 /api/me/sites 가 진실의 출처. localStorage 는 "첫 페인트 빠르게" 를 위한 캐시일 뿐.
// - 마운트 시: 캐시 즉시 반환 → 화면 깜빡임 없음.
// - 동시에 fetch → 응답이 오면 캐시 갱신 + 상태 업데이트.
// - 비로그인이면 항상 빈 배열.
function summaryToMySite(s: MySiteSummary): MySite {
  return {
    id:            String(s.id),
    slug:          s.slug,
    name:          s.name,
    type:          s.type,
    createdAt:     s.createdAt,
    status:        (s.status === 'published' || s.status === 'draft' || s.status === 'wip') ? s.status : 'published',
    adminRequired: s.adminRequired,
    pages:         s.pages.map((p) => ({ key: p.key, label: p.label, path: p.path })),
  };
}

interface UseMySitesResult {
  sites:   MySite[];
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
}

export function useMySites(): UseMySitesResult {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [sites, setSites] = useState<MySite[]>(() => loadMySites(userId));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const doFetch = async (uid: number | null) => {
    if (uid === null) {
      setSites([]);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const remote = await fetchMySites();
      const mapped = remote.map(summaryToMySite);
      setSites(mapped);
      saveMySites(uid, mapped);
    } catch (e) {
      // 401 등은 비로그인 상태로 간주 — 조용히 빈 목록.
      const msg = e instanceof Error ? e.message : '알 수 없는 오류';
      if (/로그인|unauth/i.test(msg)) {
        setSites([]);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 사용자가 바뀌면 (로그인/로그아웃/계정 전환) 캐시도 다시 부트스트랩.
  useEffect(() => {
    purgeLegacyCaches();
    setSites(loadMySites(userId));
    setLoading(true);
    if (authLoading) return;       // 토큰 검증 중에는 fetch 보류
    void doFetch(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, authLoading]);

  return {
    sites,
    loading,
    error,
    refresh: () => doFetch(userId),
  };
}
