// "내 사이트 목록" 로컬 캐시.
// **소스 오브 트루스는 백엔드 (/api/me/sites)** — localStorage 는 첫 페인트를 위한 옵티미스틱 캐시일 뿐.
// 캐시는 사용자 id 별로 분리한다 (`creatordesk.mySites.v3.<userId>`) — 같은 브라우저를 다른 계정이 쓰더라도 섞이지 않게.

export type MySiteStatus = 'published' | 'draft' | 'wip';

export interface MySitePageInfo {
  key:   string;   // 'home' | 'about' | ...
  label: string;
  path:  string;   // '/' | '/about' | ...
}

export interface MySite {
  id: string;        // 백엔드가 돌려준 site id (문자열로 저장 — string/number 혼용 방지)
  slug: string;
  name: string;
  type: string;      // 'company' 등
  createdAt: string; // ISO
  status: MySiteStatus;
  adminRequired: boolean;
  /** 선택되어 실제 생성된 페이지 목록 — 목록/완료 화면에서 멀티페이지 사실을 시각화. */
  pages: MySitePageInfo[];
}

// v3 부터 사용자별 키. v2/v1 은 더 이상 읽지 않으며 자동으로 정리된다.
const KEY_PREFIX = 'creatordesk.mySites.v3.';
const ANON_KEY = `${KEY_PREFIX}anon`;
const LEGACY_KEYS = ['creatordesk.mySites', 'creatordesk.mySites.v2'] as const;

function keyFor(userId: string | number | null | undefined): string {
  if (userId === null || userId === undefined || userId === '') return ANON_KEY;
  return `${KEY_PREFIX}${userId}`;
}

/** 더 이상 사용하지 않는 글로벌(사용자 무관) 캐시 키를 정리한다 — 호출되어도 안전. */
export function purgeLegacyCaches(): void {
  if (typeof window === 'undefined') return;
  for (const k of LEGACY_KEYS) {
    try { window.localStorage.removeItem(k); } catch { /* noop */ }
  }
}

export function loadMySites(userId: string | number | null | undefined): MySite[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as MySite[] : [];
  } catch {
    return [];
  }
}

export function saveMySites(userId: string | number | null | undefined, list: MySite[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(keyFor(userId), JSON.stringify(list));
}

/** 단건 추가/갱신 — 빌더 완료 직후 사용. 같은 id 는 최신으로 교체. */
export function upsertMySite(userId: string | number | null | undefined, entry: MySite): void {
  const list = loadMySites(userId);
  const filtered = list.filter((s) => s.id !== entry.id);
  filtered.unshift(entry);
  saveMySites(userId, filtered);
}

/** 내 사이트 캐시 비우기 — 로그아웃 시 호출. */
export function clearMySites(userId: string | number | null | undefined): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(keyFor(userId));
}
