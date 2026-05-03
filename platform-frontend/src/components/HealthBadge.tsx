import { useEffect, useState } from 'react';
import { fetchHealth, type HealthData } from '../api/health';

// 헤더 우측에 표시되는 API 헬스 배지.
// 마운트 시 1회 헬스체크. 실패 시 빨간색으로 즉시 알 수 있게 한다(개발 편의).
// 주기 폴링은 일부러 안 함 — 필요해질 때 도입.
type BadgeStatus = 'checking' | 'ok' | 'down';

interface BadgeState {
  status: BadgeStatus;
  detail: HealthData | string | null;
}

export default function HealthBadge() {
  const [state, setState] = useState<BadgeState>({ status: 'checking', detail: null });

  useEffect(() => {
    // 컴포넌트 언마운트 후 setState 가 일어나지 않도록 가드.
    let cancelled = false;
    fetchHealth()
      .then((data) => {
        if (!cancelled) setState({ status: 'ok', detail: data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setState({ status: 'down', detail: message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const label: Record<BadgeStatus, string> = {
    checking: 'API 확인 중…',
    ok: 'API 연결됨',
    down: 'API 연결 실패',
  };

  return (
    // title 에 JSON 을 넣어두면 hover 로 응답 본문을 즉시 확인 가능.
    <span className={`health-badge health-${state.status}`} title={JSON.stringify(state.detail)}>
      {label[state.status]}
    </span>
  );
}
