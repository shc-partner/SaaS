import { useEffect, useState } from 'react';
import { fetchWorkspaces } from '../../api/workspaces';
import { useAuth } from '../auth/AuthProvider';
import { type MyWorkspace } from './types';

interface UseMyWorkspacesResult {
  workspaces: MyWorkspace[];
  loading: boolean;
}

export default function useMyWorkspaces(): UseMyWorkspacesResult {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<MyWorkspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setWorkspaces([]);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    fetchWorkspaces()
      .then((items) => { if (alive) setWorkspaces(items); })
      .catch(() => { if (alive) setWorkspaces([]); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [authLoading, isAuthenticated]);

  return { workspaces, loading };
}
