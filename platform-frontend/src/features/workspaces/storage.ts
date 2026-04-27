// "내 워크스페이스 목록" 로컬 캐시.
// 소스 오브 트루스는 향후 백엔드 API — localStorage 는 첫 페인트를 위한 옵티미스틱 캐시.
// 캐시는 사용자 id 별로 분리한다 (`creatordesk.workspaces.v1.<userId>`).

import { type MyWorkspace } from './types';

const KEY_PREFIX = 'creatordesk.workspaces.v1.';
const ANON_KEY = `${KEY_PREFIX}anon`;

function keyFor(userId: string | number | null | undefined): string {
  if (userId === null || userId === undefined || userId === '') return ANON_KEY;
  return `${KEY_PREFIX}${userId}`;
}

export function loadMyWorkspaces(userId: string | number | null | undefined): MyWorkspace[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MyWorkspace[]) : [];
  } catch {
    return [];
  }
}

export function saveMyWorkspaces(
  userId: string | number | null | undefined,
  list: MyWorkspace[],
): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(keyFor(userId), JSON.stringify(list));
}

/** 단건 추가/갱신 — 워크스페이스 생성 완료 직후 사용. 같은 id 는 최신으로 교체. */
export function upsertMyWorkspace(
  userId: string | number | null | undefined,
  entry: MyWorkspace,
): void {
  const list = loadMyWorkspaces(userId);
  const filtered = list.filter((w) => w.id !== entry.id);
  filtered.unshift(entry);
  saveMyWorkspaces(userId, filtered);
}

/** 내 워크스페이스 캐시 비우기 — 로그아웃 시 호출. */
export function clearMyWorkspaces(userId: string | number | null | undefined): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(keyFor(userId));
}
