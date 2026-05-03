# State Management Guide

> 본 문서는 platform-frontend 의 **상태 관리 판단 기준**을 한 곳에 모은다.
> "이 값을 어디에 둘 것인가?" 에 답하기 위해 사용한다.
> 도입 배경은 [redux-toolkit-adoption.md](redux-toolkit-adoption.md) 참조.

## 1. 세 곳의 저장소

| 저장소 | 책임 | 예시 |
|---|---|---|
| **서버 DB (MySQL)** | 진실원. 사용자 간/세션 간 공유되는 영속 데이터 | 사용자 계정, 프로젝트, 산출물, 다운로드 토큰 |
| **Redux store** | 한 사용자/한 세션 안에서 **여러 화면이 공유**하는 상태 | 위저드 입력, 인증 사용자, 현재 사이트 |
| **컴포넌트 local state (`useState`)** | 한 화면/한 컴포넌트에서만 쓰는 상태 | 모달 open/close, 입력 focus, 토스트 표시 |

판단 순서:
1. **여러 사용자가 같은 값을 봐야 하나?** → 서버 DB
2. **새로고침/다른 화면에서도 이 값이 살아있어야 하나?** → Redux (필요 시 영속화)
3. 위 둘 다 아니면 → local state

## 2. 어떤 상태가 어디에 있나 (현재 프로젝트 기준)

### 2.1 Redux 로 관리 (`siteBuilder`)
- `siteType`, `siteName`, `slug`, `industry`, `summary`, `selectedFeatures`
- 이유: 4단계 위저드가 같은 값을 읽고 쓰며, 새로고침/뒤로가기에 살아남아야 한다.
- 영속: `siteBuilder` 슬라이스만 `localStorage` 동기화. 다음 Phase 에서 서버 영속(`projects.input_data`)으로 이전 예정.
- **단계 진행 상태(현재 어느 화면인지)는 Redux 에 넣지 않는다.** 라우트가 진실원이며, 단계 표시(WizardSteps)는 `useLocation()` 으로 파생한다. URL 과 store 두 곳에 같은 값을 두면 뒤로가기/직접 URL 진입에서 동기화 부담만 생긴다.

### 2.2 Redux 로 관리 (`auth`, placeholder)
- `user`, `isAuthenticated`, `status`
- 이유: 모든 보호 라우트와 헤더가 동일한 인증 상태를 본다.
- 영속: 하지 않음. 서버 세션(http-only 쿠키)이 진실원이며, 부팅 시 `GET /api/me` 등으로 복원할 예정.

### 2.3 컴포넌트 local state 로 유지
- `HealthBadge` 의 호출 결과/상태
- 모달 open/close, 드롭다운 펼침 여부, hover, focus
- `Review` 화면이 mock 생성 결과(`id`, `createdAt`)를 다음 라우트로 넘기는 임시값 (라우트 `state` 사용)
- 입력 필드의 임시 검증 메시지 표시 타이밍

### 2.4 서버 DB 로 저장 예정 (현재 구현 안 됨)
- `users`, `projects`, `generation_jobs`, `exports`, `download_tokens`
- 위저드 입력 자체는 다음 Phase 에서 `projects.input_data` (JSON) 컬럼에 단계별로 누적 저장된다.

## 3. 원칙

1. **공유되지 않는 값은 Redux 에 올리지 않는다.** 한 컴포넌트가 끝나면 끝나는 값은 `useState`.
2. **이미 다른 곳이 진실원인 값은 Redux 에 복제하지 않는다.** URL/라우트, 서버 세션, 폼의 DOM 값 등은 거기서 읽는다. 같은 값을 두 곳에 두면 동기화 코드가 새로 생긴다.
3. **새로고침에 살아남아야 하는 값은 영속 저장소를 정한다.** 정답이 서버에 있으면 서버, 일시 보존이면 `localStorage`. 영속 키에 버전 번호(`:v2`)를 붙여 슬라이스 모양이 바뀔 때 자동 무효화한다.
4. **selector 가 새 객체를 만들지 않게 한다.** 객체 가공이 필요하면 `createSelector` 로 메모이제이션. 매번 새 참조를 반환하는 selector 는 무관한 dispatch 에도 모든 구독자를 재렌더시킨다.
5. **단일 출처 원칙을 슬라이스 내부에도 적용한다.** 페이지 id 목록 같은 도메인 상수는 슬라이스에서 export 해 화면·검증·요약 화면이 모두 import. magic 문자열을 화면마다 적지 않는다.
6. **payload 에 비밀을 싣지 않는다.** 비밀번호·토큰은 액션을 거치지 않는다(서버 호출 결과만 결과 상태로 받는다).
7. **slice 안에 검증 규칙을 함께 둔다.** 화면(disabled)과 라우트 가드가 같은 함수를 import 하도록 한다. 백엔드 manifest schema 와 어긋나지 않게 추적.
8. **새 슬라이스를 만들기 전 기존에 합쳐도 되는지 검토.** UI 전역값(사이드바 접힘, 토스트 등)은 `ui` 한 슬라이스에 모은다 — 슬라이스 폭증 방지.

## 4. 예시

### 4.1 siteBuilder 상태 (Redux)
```js
// 읽기
const basic = useSelector(selectBasic);
const features = useSelector(selectSelectedFeatures);

// 쓰기
dispatch(updateBasicInfo({ siteName: '한빛소프트' }));
dispatch(toggleFeature('contactPage'));

// 검증 (slice 모듈에서 import)
const errors = validateBasic(basic);
```

### 4.2 auth 상태 (Redux placeholder)
```js
const user = useSelector(selectAuthUser);
const isAuth = useSelector(selectIsAuthenticated);

// 로그인 API 연결 시 (다음 Phase)
dispatch(setAuthStatus('loading'));
const me = await fetch('/api/auth/login', ...).then(r => r.json());
dispatch(setAuthUser(me.data));
```

### 4.3 modal open/close (local state — Redux 금지)
```jsx
function PageActions() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <button onClick={() => setConfirmOpen(true)}>삭제</button>
      {confirmOpen && <ConfirmModal onClose={() => setConfirmOpen(false)} />}
    </>
  );
}
```
이 값을 다른 화면이 알 필요가 없다 → Redux 에 올리지 않는다.

### 4.4 폼 입력 임시 상태 (local 권장)
- 사용자가 타이핑하는 동안의 `value` 가 **여러 화면에서 동시에 보여야** 한다면 Redux.
- 그렇지 않다면 `useState`. (예: 검색창의 입력)
- 위저드는 단계 간 이동에서 값을 보존해야 하므로 Redux 에 둔다.

## 5. 향후 도입 검토 (지금은 도입 금지)

- **RTK Query**: 프로젝트 목록·상세·산출물 목록처럼 서버 데이터의 캐시·invalidation 이 필요해지는 시점에 검토. 현재는 API 호출이 거의 없어 도입 비용이 이득보다 크다. 본 문서에 메모만 남기고 코드에는 추가하지 않는다.
- **listener middleware**: 액션을 트리거로 부수효과(자동 저장, 알림 dispatch 등)가 필요해지면 도입. 지금은 `store.subscribe` 1곳으로 충분.
- **persist 라이브러리(redux-persist 등)**: 직접 `subscribe` 한 줄로 끝나는 한 도입하지 않는다.

## 6. 안티패턴 (피할 것)

- ❌ 한 컴포넌트만 쓰는 toggle/hover 상태를 Redux 에 올림
- ❌ URL 로 이미 표현되는 값(현재 단계, 현재 탭, 현재 사이트 id) 을 Redux 에 따로 둠 — 라우트가 이미 진실원
- ❌ selector 안에서 매번 새 배열·객체를 `map`/`filter` 로 만들어 반환 → 무한 리렌더 위험
- ❌ 슬라이스에서 import 가능한 도메인 상수(`PAGE_FEATURE_IDS` 같은) 를 화면마다 magic 문자열로 다시 적기
- ❌ 비밀번호·세션 토큰을 action payload 에 노출
- ❌ slice 1개 = 화면 1개 (slice 가 화면 수만큼 늘어나면 도메인 기준으로 합치기)
- ❌ Redux 와 서버 DB 양쪽에 동일 데이터를 동시 저장하면서 동기화 코드를 화면마다 작성 — 진실원을 한쪽으로 몰 것
- ❌ Redux 에 dispatch 만 하고 아무도 select 하지 않는 키 — 죽은 상태. 추가 시 "누가 읽는가" 를 먼저 답할 것
