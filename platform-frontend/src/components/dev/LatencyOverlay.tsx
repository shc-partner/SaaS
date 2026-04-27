import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';

// 개발자 전용 latency/debug 오버레이.
// 노출 조건(둘 다 true 일 때만):
//   1) VITE_ENABLE_LATENCY_OVERLAY === 'true'  (빌드/환경 단위)
//   2) 로그인 사용자의 name 이 'dev'           (계정 단위)
// 일반 사용자에겐 절대 노출되지 않는다.
//
// 위치: 우측 상단 플로팅. 헤더 바로 아래에 떠 있어, 빌더의 좌측 설정/우측 미리보기를 가리지 않는다.
//
// 측정 항목:
//   - Page  : 현재 라우트 경로
//   - Route : 마지막 경로 변경 후 다음 effect 까지 소요(ms) — SPA 전환 체감 지연
//   - Render: 마지막 라우트 변경 후 첫 paint 까지(ms)         — rAF 기반
//   - API   : 가장 최근 fetch 호출의 응답 시간(ms)            — fetch 래핑

const DEV_NAME = 'dev';
const ENABLED  = import.meta.env.VITE_ENABLE_LATENCY_OVERLAY === 'true';

// ---------- API 측정: 한 번만 fetch 를 monkey-patch. 구독자에게 최신 latency 알림. ----------
type ApiSample = { url: string; ms: number; status: number; at: number };
const apiListeners = new Set<(s: ApiSample) => void>();
let fetchPatched = false;
function patchFetchOnce(): void {
  if (fetchPatched || typeof window === 'undefined' || !window.fetch) return;
  fetchPatched = true;
  const orig = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const start = performance.now();
    let status = 0;
    try {
      const res = await orig(input as RequestInfo, init);
      status = res.status;
      return res;
    } finally {
      const ms = Math.round(performance.now() - start);
      const url = typeof input === 'string' ? input : (input instanceof URL ? input.href : (input as Request).url);
      const sample: ApiSample = { url, ms, status, at: Date.now() };
      apiListeners.forEach((fn) => fn(sample));
    }
  };
}

export default function LatencyOverlay() {
  const { user } = useAuth();
  const location = useLocation();

  // 노출 가드 — name 비교는 trim + lowercase 로 방어.
  const isDevUser = user?.name?.trim().toLowerCase() === DEV_NAME;
  const visible = ENABLED && isDevUser;

  const [routeMs, setRouteMs]   = useState<number | null>(null);
  const [renderMs, setRenderMs] = useState<number | null>(null);
  const [api, setApi]           = useState<ApiSample | null>(null);
  const lastNavAt = useRef<number>(performance.now());

  // 라우트 변경 측정 — pathname 이 바뀔 때마다 시작 시각 갱신, 다음 effect 에서 종료.
  useEffect(() => {
    const start = performance.now();
    lastNavAt.current = start;
    setRouteMs(Math.round(performance.now() - start)); // 본 라이프사이클 자체는 0~1ms

    // Render(첫 paint): rAF 두 번이면 paint 직후.
    const r1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRenderMs(Math.round(performance.now() - start));
      });
    });
    return () => cancelAnimationFrame(r1);
  }, [location.pathname]);

  // API 구독 — overlay 가 활성일 때만 fetch patch + 리스너 등록.
  useEffect(() => {
    if (!visible) return;
    patchFetchOnce();
    const onSample = (s: ApiSample) => setApi(s);
    apiListeners.add(onSample);
    return () => { apiListeners.delete(onSample); };
  }, [visible]);

  if (!visible) return null;

  const apiText = api
    ? `${api.ms}ms · ${api.status} · ${shorten(api.url)}`
    : '— (호출 대기)';

  return (
    <div className="latency-overlay" role="status" aria-label="개발자 디버그 오버레이">
      <header>
        <span className="dot" aria-hidden />
        <strong>DEV OVERLAY</strong>
        <small>{user?.email ?? ''}</small>
      </header>
      <dl>
        <dt>Page</dt>   <dd><code>{location.pathname}</code></dd>
        <dt>Route</dt>  <dd>{fmt(routeMs)}</dd>
        <dt>Render</dt> <dd>{fmt(renderMs)}</dd>
        <dt>API</dt>    <dd title={api?.url ?? ''}>{apiText}</dd>
      </dl>
    </div>
  );
}

function fmt(v: number | null): string {
  return v === null ? '—' : `${v} ms`;
}
function shorten(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname + (u.search ? '?…' : '');
  } catch {
    return url.length > 28 ? url.slice(0, 25) + '…' : url;
  }
}
