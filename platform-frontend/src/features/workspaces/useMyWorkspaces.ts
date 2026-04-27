// 내 워크스페이스 목록 훅.
// MVP 단계: API 가 아직 존재하지 않으므로 localStorage 에서만 읽는다.
// 향후 /api/me/workspaces 연동 시 이 훅만 수정하면 된다.

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { loadMyWorkspaces } from './storage';
import { type MyWorkspace } from './types';

interface UseMyWorkspacesResult {
  workspaces: MyWorkspace[];
  loading: boolean;
}

export default function useMyWorkspaces(): UseMyWorkspacesResult {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [workspaces, setWorkspaces] = useState<MyWorkspace[]>(() =>
    loadMyWorkspaces(userId),
  );
  const [loading, setLoading] = useState<boolean>(authLoading);

  // 사용자가 바뀌면 (로그인/로그아웃/계정 전환) 해당 사용자의 캐시로 갱신.
  useEffect(() => {
    setWorkspaces(loadMyWorkspaces(userId));
    setLoading(false);
  }, [userId, authLoading]);

  return { workspaces, loading };
}
