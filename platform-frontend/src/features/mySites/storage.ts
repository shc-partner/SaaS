// "내 사이트 목록" 로컬 저장소.
// MVP 단계 — 인증이 붙기 전까지는 브라우저 localStorage 에 누적한다.
// 추후 계정 모델이 붙으면 GET /api/me/sites 로 교체하면 되고, UI/데이터 모양은 그대로 재사용.

export type MySiteStatus = 'published' | 'draft' | 'wip';

export interface MySitePageInfo {
  key:   string;   // 'home' | 'about' | ...
  label: string;
  path:  string;   // '/' | '/about' | ...
}

export interface MySite {
  id: string;        // 백엔드가 돌려준 site id (문자열 저장 — string/number 혼용 방지)
  slug: string;
  name: string;
  type: string;      // 'company' 등
  createdAt: string; // ISO
  status: MySiteStatus;
  adminRequired: boolean;
  /** 선택되어 실제 생성된 페이지 목록 — 목록/완료 화면에서 멀티페이지 사실을 시각화. */
  pages: MySitePageInfo[];
}

const KEY = 'siteforge.mySites';

export function loadMySites(): MySite[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as MySite[] : [];
  } catch {
    return [];
  }
}

export function saveMySite(entry: MySite): void {
  if (typeof window === 'undefined') return;
  const list = loadMySites();
  // 중복 id 는 최신으로 교체
  const filtered = list.filter((s) => s.id !== entry.id);
  filtered.unshift(entry);
  window.localStorage.setItem(KEY, JSON.stringify(filtered));
}

export function removeMySite(id: string): void {
  if (typeof window === 'undefined') return;
  const list = loadMySites().filter((s) => s.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}
