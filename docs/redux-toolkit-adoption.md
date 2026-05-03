# Redux Toolkit 도입 기록

## 1. 왜 Redux Toolkit 을 도입했는가

위저드가 4단계(유형 → 기본 → 기능 → 결과 확인) + mock 완료로 확장되면서, **여러 화면 사이에서 공유되는 상태**가 생겼다. 초기에는 `useState` + React Context 로 운영했지만 다음 한계가 드러났다.

- 새로고침/뒤로가기에 상태가 휘발되어 수동 영속화 코드를 매번 붙여야 했다.
- 다음 Phase 에서 인증·현재 사이트·관리자 공통 상태가 추가되면 Context 를 여러 개 중첩하거나 재구성이 필요했다.
- 검증 규칙·selector 를 공통 위치에 두기 어려웠다.

**Redux Toolkit(@reduxjs/toolkit) + react-redux** 는
- Immer 기반의 "mutate 처럼 쓰는 불변 업데이트" 로 reducer 작성 비용이 낮다
- slice 당 하나의 파일로 action/reducer/selectors 동거 — 찾기 쉬움
- 표준 구조(store, Provider, useSelector, useDispatch)가 고정이라 새 팀원 합류가 쉬움
- 필요해지면 RTK Query 로 서버 상태까지 자연스럽게 확장할 수 있음

동시에 과잉을 경계한다: **모든 UI 상태를 Redux 에 올리지 않는다**. 지역 UI 상태(입력 focus, modal open/close 등)는 그대로 `useState`.

## 2. 현재 Redux 가 맡는 역할

| 슬라이스 | 책임 | 현재 상태 |
|---|---|---|
| `siteBuilder` | 사이트 생성 위저드의 단계 간 공유 데이터 | **실사용** |
| `auth` | 로그인 사용자/세션 상태 | **placeholder** (실제 API 미연결) |

## 3. 지금 Redux 에 넣은 상태

### `siteBuilder`
- `siteType` — 선택된 사이트 유형 (Stage 1 은 `'company-intro'` 만)
- `siteName`, `slug`, `industry`, `summary` — 기본 정보 입력값
- `selectedFeatures` — 포함할 페이지/기능 id 배열. 페이지 id 는 슬라이스 export 인 `PAGE_FEATURE_IDS` 가 단일 출처(`aboutPage`/`servicesPage`/`contactPage`), 그 외에 `adminEditable` 플래그가 함께 들어간다.

액션: `setSiteType`, `updateBasicInfo`, `toggleFeature`, `resetSiteBuilder`

> **현재 단계는 Redux 에 두지 않는다.** 라우트(`/sites/new/*`)가 진실원이며, `WizardSteps` 등 단계 표시는 `useLocation()` 으로 파생한다. 이중 출처를 만들면 뒤로가기/직접 URL 진입에서 동기화 코드만 늘어난다.

### `auth` (placeholder)
- `user` — `{ id, email, displayName }` 또는 `null`
- `isAuthenticated`
- `status` — `'idle' | 'loading' | 'authenticated' | 'error'`

액션: `setAuthUser`, `clearAuthUser`, `setAuthStatus`

## 4. 아직 Redux 에 넣지 않은 상태

- 각 입력의 지역 UI 상태(에러 메시지의 표시 타이밍, 자동완성 hover 등)
- 모달 open/close — 해당 컴포넌트가 소유
- 순간 네트워크 응답 원본 — 현재 API 호출이 거의 없다. 생길 때 RTK Query 또는 수동 thunk 로 편입
- mock 생성 결과 — 라우트 state(`navigate(..., { state })`) 로 단발 전달

## 5. 향후 확장 계획

- **인증**: 로그인 API 연결 시 `setAuthUser` 를 `thunk` 로 감싸 `/api/auth/login` → 세션 쿠키 확인 → 상태 반영. 보호 라우트는 `selectIsAuthenticated` 기준으로 guard.
- **현재 site 상태**: 관리자 진입 이후 "지금 보고 있는 내 사이트" 가 고정될 때 `currentSite` 슬라이스 신설. 라우트 `:siteId` 와 동기화.
- **관리자 공통 상태**: 사이드바 접힘, 알림 큐, 토스트 등 전역 UI 는 `ui` 슬라이스 하나로 묶는다.
- **API 상태 관리**: 목록/상세 캐시가 필요해지는 시점에 **RTK Query** 도입 검토. 지금은 도입하지 않는다.

## 6. 장점과 주의사항

**장점**
- 위저드 입력이 Redux 에 있어 단계 간 이동/새로고침/탭 이탈이 자연스럽다(localStorage 동기화는 store subscribe 1곳에만 존재).
- `selectors + validators` 가 slice 모듈에 모여 있어 화면/가드가 규칙을 공유한다.
- 컴포넌트는 `useSelector`/`useDispatch` 만 알면 되며, 리팩터 시 store 구조만 바꾸면 된다.

**주의사항**
- **지역 UI 상태까지 올리지 말 것** — 리렌더 비용·디버깅 비용 모두 증가.
- **selector 는 파생값을 곧바로 만들지 말 것** — 객체 새로 만들면 reselect(`createSelector`)로 메모이제이션 필요. 지금은 slice 에서 단순 읽기만.
- **localStorage 영속**은 `siteBuilder` 에만 한정. `auth` 는 서버 세션이 진실원이므로 클라이언트 저장 금지.
- Redux DevTools 는 dev 에서만 사용. 민감 정보(비밀번호·토큰)를 action payload 로 절대 싣지 않는다.
