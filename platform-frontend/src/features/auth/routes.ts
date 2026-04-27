// 로그인 상태에 따른 진입 경로 결정 — 단일 출처.
// 모든 CTA 와 우회 리다이렉트는 이 헬퍼들을 거쳐야 한다.
//   - 비로그인: 가입/로그인 경로로
//   - 로그인됨: 내부 진입(대시보드/내 사이트/빌더)으로
//
// 같은 의미("시작하기" / "사이트 만들기" / "내 사이트") 라도 컨텍스트에 따라
// 어느 내부 페이지로 보낼지가 달라지므로, 의도별로 헬퍼를 분리해 둔다.

/** 미가입 사용자에게 일반적으로 보이는 가입 진입점. */
export const PUBLIC_SIGNUP = '/signup' as const;
export const PUBLIC_LOGIN  = '/login'  as const;

/** 로그인된 사용자가 처음 들어가게 되는 곳. */
export const AUTH_HOME = '/dashboard' as const;

// 로그인이 필요한 서비스 진입 CTA 는 비로그인 시 **/login** 으로 보낸다.
// 신규 사용자는 로그인 페이지의 "회원가입" 링크를 통해 /signup 으로 이동.
// (헤더 우측의 명시적 "무료로 시작하기" 버튼만 /signup 직행 — 사용자가 의도적으로 가입을 선택한 경우.)

/** "지금 시작하기" / "무료로 시작하기" 등 메인 진입 CTA. */
export function startCtaTarget(isAuthed: boolean): string {
  return isAuthed ? AUTH_HOME : PUBLIC_LOGIN;
}

/** "사이트 만들기" / "+ 새 사이트 만들기" 등 빌더 진입 CTA. */
export function builderCtaTarget(isAuthed: boolean): string {
  return isAuthed ? '/builder' : PUBLIC_LOGIN;
}

/** "템플릿 사용하기" 등 — 비로그인 시 로그인 후 빌더로 진입. */
export function templateCtaTarget(isAuthed: boolean): string {
  return isAuthed ? '/builder' : PUBLIC_LOGIN;
}

/** "내 사이트 목록" 진입. 비로그인은 로그인부터. */
export function mySitesTarget(isAuthed: boolean): string {
  return isAuthed ? '/sites' : PUBLIC_LOGIN;
}

/** "대시보드" 진입. */
export function dashboardTarget(isAuthed: boolean): string {
  return isAuthed ? '/dashboard' : PUBLIC_LOGIN;
}

/** 로그인 / 회원가입 페이지로의 일반 직접 이동(분기 X) — 헤더 우측의 명시적 버튼용. */
export const explicitLogin  = PUBLIC_LOGIN;
export const explicitSignup = PUBLIC_SIGNUP;
