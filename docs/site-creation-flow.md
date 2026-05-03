# Site Creation Flow — Stage 1 (UI-Only)

> 기업 소개형 사이트를 만드는 **사용자 UI 플로우**의 단일 진실원.
> 실제 생성 엔진·DB·API 는 아직 연결되지 않았고, 이 문서는 "끊김 없이 진행 가능한 흐름" 을 기록한다.
> 단계 정의의 상위 문서는 [build-phases-aligned-with-ui-flow.md](build-phases-aligned-with-ui-flow.md) 의 Phase 2–4.
> UI 정책 (데스크탑 전용) 은 [ui-policy.md](ui-policy.md) 참고.

---

## 1. 흐름 개요

```
/                       Landing (CTA "사이트 만들기 시작")
   │
   ▼
/sites/new/type         1. 유형 선택          (1종만 활성: company-intro)
   │
   ▼
/sites/new/setup/basic  2-1. 기본 정보        (이름, slug, 업종, 소개)
   │
   ▼
/sites/new/setup/features
                        2-2. 기능 선택        (페이지 3종 + 관리자 수정)
   │
   ▼
/sites/new/review       3. 결과 확인 (좌/우)  (페이지 구조 + 입력 요약)
   │
   ▼ (mock)
/sites/new/done/:id     mock 완료 화면        (실제 zip 생성 없음)
```

`/start` 는 별칭 — `/sites/new/type` 으로 자동 리다이렉트. 구 경로 `/sites/new/basic`, `/sites/new/features` 도 새 `/setup/...` 경로로 자동 이전.

---

## 2. 단계별 세부

### 1단계 — 사이트 유형 선택 (`/sites/new/type`)

| 항목 | 내용 |
|---|---|
| 목적 | 만들 사이트의 대분류 선택 |
| 입력 | `siteType` (단일) |
| 옵션 | `company-intro` (활성), `reservation`/`blog` (비활성 placeholder) |
| 이동 | 카드 클릭 → 자동으로 `/sites/new/setup/basic` |
| 가드 | 없음 (진입점) |
| 구현 | [TypeSelect.tsx](../platform-frontend/src/pages/wizard/TypeSelect.tsx) |

### 2-1단계 — 기본 정보 (`/sites/new/setup/basic`)

| 항목 | 내용 |
|---|---|
| 목적 | 산출물 폴더명과 공개 페이지 헤더에 들어갈 식별 정보 수집 |
| 입력 | `siteName`, `slug`, `industry`, `summary` |
| 자동화 | `siteName` 입력 시 `slug` 를 실시간 추출 (사용자가 직접 `slug` 를 수정하면 자동 추출 중단) |
| 검증 | `validateBasic()` — 모두 필수, `slug` 는 `^[a-z0-9](-?[a-z0-9])*$` |
| 이동 | "다음" → `/sites/new/setup/features` |
| 가드 | `siteType` 없으면 `/sites/new/type` 로 되돌림 (`<Navigate replace>`) |
| 구현 | [BasicInfo.tsx](../platform-frontend/src/pages/wizard/BasicInfo.tsx) |

### 2-2단계 — 기능 선택 (`/sites/new/setup/features`)

| 항목 | 내용 |
|---|---|
| 목적 | 산출물에 포함할 페이지와 관리자 기능 토글 |
| 입력 | `selectedFeatures: FeatureId[]` |
| 옵션 | `aboutPage`, `servicesPage`, `contactPage` (페이지), `adminEditable` (플래그) |
| 검증 | `validateFeatures()` — 페이지 3종 중 최소 1개 |
| 이동 | "다음" → `/sites/new/review` |
| 가드 | `siteType` 없거나 `validateBasic` 실패 시 해당 단계로 되돌림 |
| 구현 | [Features.tsx](../platform-frontend/src/pages/wizard/Features.tsx) |

### 3단계 — 결과 확인 (`/sites/new/review`)

| 항목 | 내용 |
|---|---|
| 목적 | 생성 직전 입력 요약 + 예상 페이지 구조 시각화 |
| 레이아웃 | **데스크탑 좌/우 2분할 고정** (모바일 대응 미적용 — `ui-policy.md`) |
| 좌측 | 생성될 페이지 트리 (`/`, `/about`, `/services`, `/contact`, `/admin` 토글 반영) |
| 우측 | 입력 요약 (유형/이름/slug/업종/소개/포함 페이지/관리자 수정) |
| 액션 | "← 기능 선택 수정", **"이대로 생성하기 (mock)"** |
| 가드 | 상위 3단계 어느 하나라도 불완전하면 해당 단계로 되돌림 |
| 구현 | [Review.tsx](../platform-frontend/src/pages/wizard/Review.tsx) |

### mock 완료 (`/sites/new/done/:id`)

"이대로 생성하기" 는 현재 `mock-{Date.now()}` ID 를 만들고 이 경로로 이동. 실제 zip 생성 / 다운로드 토큰 발급은 Phase 5 에서 연결.

---

## 3. 상태 관리

### 3.1 공유 상태 (Redux Toolkit)

슬라이스: [siteBuilderSlice.ts](../platform-frontend/src/features/siteBuilder/siteBuilderSlice.ts)

| 키 | 타입 | 쓰이는 단계 |
|---|---|---|
| `siteType` | `'company-intro' \| null` | 1단계 설정, 2-1/2-2/3 가드 |
| `siteName` | `string` | 2-1 입력, 3 요약 |
| `slug` | `string` | 2-1 입력 (자동/수동), 3 요약, 산출물 폴더명 |
| `industry` | `string` | 2-1 입력, 3 요약 |
| `summary` | `string` | 2-1 입력, 3 요약 |
| `selectedFeatures` | `FeatureId[]` | 2-2 토글, 3 페이지 트리/요약 |

리듀서: `setSiteType`, `updateBasicInfo` (Partial<BasicInfo>), `toggleFeature`, `resetSiteBuilder`.

셀렉터: `selectSiteType`, `selectBasic` (createSelector 메모이즈), `selectSelectedFeatures`.

검증: `validateBasic(basic)`, `validateFeatures(features)` — 화면 가드와 disabled 버튼이 같은 규칙을 공유.

### 3.2 진행 단계의 진실원은 URL

Redux 에 `currentStep` 키를 두지 않는다. "지금 어느 단계?" 는 `useLocation()` 에서 파생. 이중 출처 동기화 부담 제거.

### 3.3 지속성

- `localStorage` 키 `siteforge:store:v2` 에 siteBuilder 슬라이스만 직렬화 보존.
- 새로고침·탭 재진입 후에도 중도 이탈 지점에서 이어쓰기 가능.
- 슬라이스 모양 변경 시 키 버전(`v3`)으로 올려 과거 저장값을 자동 무효화.

### 3.4 타입드 hook

컴포넌트는 `useDispatch` / `useSelector` 를 직접 쓰지 않고 [hooks.ts](../platform-frontend/src/app/hooks.ts) 의 `useAppDispatch` / `useAppSelector` 만 사용.

---

## 4. 라우팅

정의: [App.tsx](../platform-frontend/src/App.tsx)

| 경로 | 렌더 | 비고 |
|---|---|---|
| `/` | `Landing` | CTA → `/sites/new/type` |
| `/start` | `<Navigate>` | `/sites/new/type` 별칭 |
| `/sites/new` | `WizardLayout` (Outlet) | 상단 진행 표시 + 본문 |
| `/sites/new` (index) | `<Navigate>` | `type` 으로 |
| `/sites/new/type` | `TypeSelect` | 1단계 |
| `/sites/new/setup` (index) | `<Navigate>` | `basic` 으로 |
| `/sites/new/setup/basic` | `BasicInfo` | 2-1단계 |
| `/sites/new/setup/features` | `Features` | 2-2단계 |
| `/sites/new/review` | `Review` | 3단계 |
| `/sites/new/done/:id` | `Done` | mock 완료 |
| `/sites/new/basic` | `<Navigate>` | 구 경로 호환 → `setup/basic` |
| `/sites/new/features` | `<Navigate>` | 구 경로 호환 → `setup/features` |
| `*` | 404 텍스트 | — |

단계 진행 표시: [WizardSteps.tsx](../platform-frontend/src/components/WizardSteps.tsx) 가 `pathname.startsWith(step.path)` 로 active/done 계산.

---

## 5. mock 처리된 부분 (현 시점)

- **프로젝트 생성 API 호출 없음** — 유형 선택 시 `POST /api/projects` 를 부르지 않는다. Redux store 만 갱신.
- **단계별 서버 PATCH 없음** — 2-1/2-2 입력은 Redux + localStorage 만 거친다. 다른 기기/세션에서 이어쓰기 불가.
- **이미지/로고 업로드 필드 없음** — Phase 3 본구현 때 `POST /api/projects/{id}/media` 와 함께 추가.
- **입력 스키마 단일 출처 없음** — `validateBasic`/`validateFeatures` 가 임시 진실원. `templates/company-intro/manifest.json` 은 아직 비어 있음.
- **"이대로 생성하기"** — 실제 엔진 호출 없이 `mock-{Date.now()}` 생성 후 Done 화면으로 이동.
- **Done 화면의 다운로드 링크 없음** — 토큰/만료 없음.
- **인증 없음** — Landing/위저드 모두 비로그인 상태에서 접근 가능. 가입/로그인은 Phase 1 본구현 때 연결.

---

## 6. 다음 3단계 (생성 엔진 연결) 에서 할 일

순서대로:

1. **인증 본구현 (Phase 1 완료)** — `POST /api/auth/signup|login|logout`, 세션 쿠키, `GET /api/me`. 이게 있어야 projects 가 사용자에 묶인다.
2. **DB 스키마** — `projects`, `generation_jobs`, `exports`, `download_tokens` 테이블.
3. **입력 스키마 단일 출처** — `templates/company-intro/manifest.json` 에 JSON Schema 확정. 클라(현재 `validateBasic`/`validateFeatures`) 와 서버(PHP validator) 가 같은 파일을 읽도록.
4. **프로젝트 API** —
   - `POST /api/projects` (유형 선택 직후 호출, projectId 리턴)
   - `PATCH /api/projects/{id}` (2-1/2-2 단계별 `input_data` 병합 저장)
   - `GET /api/projects/{id}` (Review 새로고침 복원)
5. **생성 API** —
   - `POST /api/projects/{id}/generate` (멱등, 상태를 generation_jobs 로 진행)
   - `GET /api/exports/{token}` (스트리밍 + 만료 시 410)
6. **generator 모듈** —
   - `generator/engine`: 템플릿 디렉토리 복사 + `.tmpl` 치환
   - `generator/packager`: zip 생성 → `exports/`
7. **프런트 연결** — 현재 Redux dispatch 지점을 API hook (`useCreateProject`, `useUpdateProject`, `useGenerate`) 으로 감싸 서버 동기화. Redux state 는 그대로 유지하되 "서버 ↔ 로컬" 이중 저장.
8. **진행/다운로드 UI** — mock Done 화면을 실제 "생성 진행 → 다운로드" 화면으로 교체.

---

## 7. 변경 이력

- 2026-04-22 — 최초 작성. 라우트를 `/sites/new/setup/{basic,features}` 로 정리. 단계 가드를 `<Navigate replace>` 로 교체.
