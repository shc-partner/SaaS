// 백엔드 헬스체크 호출.
// vite dev proxy 가 /api 를 backend:80 으로 포워딩하므로 상대 경로만 쓴다.
// 응답은 표준 엔벨롭({ok, data|error}) 이므로 ok=false 면 예외로 변환한다.

// 백엔드가 돌려주는 헬스 응답의 최소 형태. 필드는 늘어날 수 있어 unknown 으로 열어둔다.
export interface HealthData {
  status?: string;
  [key: string]: unknown;
}

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string };
}

export async function fetchHealth(): Promise<HealthData> {
  const res = await fetch('/api/health', {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    // 네트워크/HTTP 레벨 실패 (404, 500 등)
    throw new Error(`HTTP ${res.status}`);
  }
  const body = (await res.json()) as ApiEnvelope<HealthData>;
  if (!body.ok) {
    // 애플리케이션 레벨 실패 — 표준 error 엔벨롭에서 메시지 추출
    throw new Error(body.error?.message || 'Unknown error');
  }
  return body.data ?? {};
}
