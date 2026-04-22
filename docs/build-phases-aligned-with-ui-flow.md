# Build Phases — Aligned with UI Flow

> 본 문서는 [mvp-goal.md](mvp-goal.md)의 Stage 1 목표와 **기획안의 9단계 사이트 UI 흐름**을
> 어떤 구현 순서로 실현하는지 고정한다.
> [agent-call-order.md](agent-call-order.md)는 "어떤 역할(에이전트)을 어떤 순서로 쓰는가"를,
> 본 문서는 "어떤 기능을 어떤 순서로 만드는가"를 다룬다. 두 문서는 서로 충돌하지 않는다.

---

## 0. 기획안의 9단계 UI 흐름

| 단계 | 사용자 행동 | 대상 시스템 |
|---|---|---|
| 1 | SaaS 사이트에 접속 (랜딩 → 가입/로그인) | 플랫폼 |
| 2 | 사이트 유형 선택 (Stage 1은 "기업 소개형"만) | 플랫폼 |
| 3 | 구성 설정 — 3-1 기본 정보 / 3-2 기능 선택 (위저드) | 플랫폼 |
| 4 | 생성 결과 확인 (미리보기/요약) | 플랫폼 |
| 5 | 생성 실행 (템플릿 렌더 → 패키징 → 토큰 발급) | 플랫폼 |
| 6 | 생성 완료 후 관리자 진입 (산출물 실행 + 첫 로그인) | 산출물 |
| 7 | 사이트 운영 (관리자 CRUD, 공개 페이지) | 산출물 |
| 8 | export (재-export, 백업) | 플랫폼 + 산출물 |
| 9 | 도메인·오프보딩·전용 분리 | Stage 2 이후 |

**Stage 1 완료선 = 1–8단계**. 9단계는 설계 스케치만 남기고 구현은 Stage 2.

---

## 1. 핵심 원칙

1. **UI 흐름 순서 ≠ 구현 순서**. 사용자가 1단계에서 보는 것을 만들려면 0단계(저장소 골격, 공통 엔벨롭, auth 모델)가 먼저 있어야 한다.
2. **한 단계는 그 단계의 UI가 "끝에서 끝까지" 동작해야 완료**. 중간까지만 되는 채로 다음 단계로 가지 않는다.
3. **산출물(Deliverable) 관련 단계(6,7)는 플랫폼 안에서 테스트 가능해야 한다**. "zip 풀어서 `docker compose up`"이 실제로 돌아야 Phase 완료.
4. **Stage 1에서 하지 않는 것은 설계 문서로만 남긴다**. 코드에 빈 인터페이스/플레이스홀더 금지.

---

## 2. 구현 Phase 정의 (UI 흐름 기준)

> 각 Phase는 "UI 단계 N" 또는 "UI 단계 N–M"을 만족시키는 구현 덩어리다.
> Phase 0만 예외로, UI 이전의 토대(저장소·계약·토대 스키마)를 만든다.

---

### Phase 0 — Repo & Foundation (UI 이전)

**대상 UI 단계**: 없음 (토대)

**목표**
- 저장소 레이아웃 확정 (`platform-frontend/`, `platform-backend/`, `generator/`, `exports/`, `infra/`, `docs/`)
- 플랫폼 dev 스택: `docker-compose` (web + db)
- 공통 응답 엔벨롭 `{ ok, data?, error? }` 결정
- 공통 에러 코드 prefix 합의 (`AUTH_*`, `PROJ_*`, `GEN_*`, `EXP_*`)
- `.env.example`, `.gitignore`, README 초안

**완료 조건**
- [ ] 빈 React SPA가 `npm run dev`로 뜬다
- [ ] 빈 plain PHP API가 `/api/health` → `{ ok:true, data:{ version } }` 반환
- [ ] MySQL 컨테이너가 뜨고 PHP에서 연결 가능
- [ ] `docker compose up` 한 번에 위 3개가 동시에 뜬다
- [ ] CLAUDE.md · architecture 문서가 실제 경로와 일치

**제외**
- 실제 비즈니스 엔드포인트
- 프런트엔드 라우팅(Phase 1에서)

---

### Phase 1 — Landing / Signup / Login (UI 단계 1)

**목표**
- 랜딩 페이지 (서비스 한 줄 설명 + 가입/로그인 CTA)
- 가입 · 로그인 · 로그아웃
- 세션(쿠키 기반) + `GET /api/me`
- 로그인 후 도달할 빈 대시보드

**완료 조건**
- [ ] 가입 → 자동 로그인 → 대시보드 진입 (로그인 유지)
- [ ] 로그아웃 → 랜딩
- [ ] 비로그인 사용자의 보호 경로 접근 차단 (미들웨어)
- [ ] 비밀번호 해시(argon2 또는 bcrypt), 평문 저장 0건

**제외**
- 비밀번호 재설정 (Stage 1 후순위)
- 이메일 인증 / 소셜 로그인
- 팀/역할

---

### Phase 2 — Site Type Selection (UI 단계 2)

**목표**
- "새 사이트 만들기" → 사이트 유형 선택 화면
- 대시보드에 내 프로젝트 목록
- 프로젝트 생성 API: `POST /api/projects` (type, name)
- Stage 1에서 선택 가능한 유형: **company-intro 1종만**. UI엔 "추후 추가 예정" 카드(비활성) 표시 가능하나 서버는 거부

**완료 조건**
- [ ] 대시보드에서 "새 사이트" 버튼 → 유형 선택 → `company-intro` 카드 선택 → 프로젝트 생성
- [ ] 프로젝트 상세로 라우팅 (내용은 Phase 3)
- [ ] 목록이 본인 것만 보인다 (RLS 아닌 `WHERE user_id = ?`)

**제외**
- 다른 사이트 유형 구현
- 프로젝트 삭제/보관 (Phase 7 혹은 Stage 2)

---

### Phase 3 — Wizard: Basic Info & Feature Selection (UI 단계 3-1, 3-2)

**목표**
- 단계형 위저드:
  - 3-1: 회사 기본 정보 (회사명, 슬로건, 연락처, 로고 업로드, 브랜드 컬러 등)
  - 3-2: 기능(섹션/메뉴) 선택 (About / Services / Contact / News 등을 on/off + 순서)
- 위저드 입력은 `projects.input_data` (JSON)에 단계별로 저장
- 중도 이탈해도 다시 들어오면 이어쓰기
- 입력 스키마 = `generator/templates/company-intro/manifest.json` 의 JSON Schema (서버 검증과 동일 출처)

**완료 조건**
- [ ] 모든 필수 필드 미입력 시 "생성 실행" 비활성
- [ ] 위저드 마지막 단계에서 "다음" → Phase 4 화면으로
- [ ] 로고/이미지 업로드는 플랫폼 측에 저장 (산출물에 복사되는 것은 Phase 5)
- [ ] 서버와 클라이언트가 같은 JSON Schema를 공유 (복붙 아님)

**제외**
- 실시간 미리보기 렌더 (Phase 4에서 정적 요약만)
- 다국어 입력
- 협업(여러 사용자 동시 편집)

---

### Phase 4 — Result Preview / Configuration Review (UI 단계 4)

**목표**
- 사용자가 입력한 값으로 만들어질 사이트의 **구성 요약**을 본다
- "무엇이 포함되는지" 명시: 페이지 목록, 메뉴, 관리자 계정 생성 안내, 데이터베이스 스키마 포함 여부, 실행 방법(docker compose)
- 사용자가 "수정" → 위저드로 복귀 / "생성 실행" → Phase 5

**완료 조건**
- [ ] 요약 화면이 `input_data`만 읽어 렌더 (DB/파일 추가 호출 없음)
- [ ] 수정 버튼으로 위저드의 해당 단계로 바로 이동
- [ ] 생성 실행 버튼은 멱등(중복 클릭 방지) 처리
- [ ] 산출물 기대 스펙 표시: "React 프런트엔드 + plain PHP 백엔드 + MySQL + docker-compose.yml"

**제외**
- 실제 렌더된 HTML 미리보기
- 테마/컬러 실시간 미리보기 (Stage 2에서 고려)

---

### Phase 5 — Generation Execution (UI 단계 5)

**목표**
- `POST /api/projects/{id}/generate` → `generation_jobs` 레코드 생성 → 동기 또는 워커로 파이프라인 실행
- 파이프라인: [export-first-architecture.md §5](export-first-architecture.md) 그대로
  1. 입력 검증 (manifest 스키마)
  2. 작업 디렉터리 `/tmp/gen-{job_id}/` 생성
  3. 템플릿 복사 + `.tmpl` 변수 치환
  4. 산출물 검증 (필수 파일, JSON 유효성, `package.json` 파싱)
  5. zip/tar 패키징 → `exports/`
  6. 다운로드 토큰 발급 (`download_tokens`)
  7. 작업 디렉터리 정리
- UI: 진행 상태 표시(큐잉됨 / 렌더 중 / 패키징 중 / 완료 / 실패) + 실패 시 단계별 에러 코드 노출
- 완료 시 다운로드 화면으로 이동 (`company-{slug}-{timestamp}.zip`)

**완료 조건**
- [ ] `company-intro` 템플릿 1종으로 서로 다른 입력 3건이 각기 다른 zip을 만든다
- [ ] 생성 평균 30초 이내 (목표, 초과 시 프로파일링)
- [ ] 실패 시 `GEN_*` 코드와 함께 사용자에게 노출, 서버 로그에 원 트레이스
- [ ] 다운로드 엔드포인트 `GET /api/exports/{token}` 정상 스트리밍, 만료 후 410

**제외**
- 병렬/큐 워커 (순차 처리 OK)
- 부분 재생성 (전체 재생성만)
- 산출물 자동 배포

---

### Phase 6 — Deliverable Boot & First Admin Login (UI 단계 6)

**목표**
- 사용자가 zip 풀고 `docker compose up` 한 번으로 전체 뜬다
- DB 컨테이너가 `schema.sql + seed.sql` 자동 적용
- 관리자 첫 로그인: seed의 초기 계정(이메일/임시 비밀번호) 또는 `.env`에 주입된 값
- 공개 사이트도 동시에 접근 가능

**완료 조건**
- [ ] 외부 머신 3종(본인 로컬, 다른 OS, 또는 VM)에서 그대로 부팅
- [ ] 첫 로그인 후 비밀번호 변경 강제
- [ ] README 지시만 따르면 초심자도 구동 가능 (외부 지식 요구 금지)
- [ ] 산출물에 플랫폼 URL·API 키 유출 0건

**제외**
- HTTPS/도메인 자동화 (사용자 몫)
- 자동 업데이트 훅

---

### Phase 7 — Deliverable Operation (UI 단계 7)

**목표**
- 산출물 내 관리자 기능:
  - 페이지 CRUD (title, slug, body_html, 정렬)
  - 메뉴 CRUD
  - 회사 정보 편집 (singleton)
  - 미디어 업로드
- 공개 사이트: React 프런트엔드가 산출물 백엔드 API를 읽어 렌더
- 관리자는 데스크톱 전용 (모바일 최적화 안 함)

**완료 조건**
- [ ] 관리자에서 페이지/메뉴/회사정보 편집 → 공개 사이트 즉시 반영
- [ ] 미디어 업로드가 산출물 로컬 디스크 또는 컨테이너 볼륨에 저장
- [ ] 산출물 내부에 어떤 외부 의존도 없음 (플랫폼 없이 돌아감)
- [ ] 산출물 DB 스키마가 플랫폼이 생성한 `schema.sql`과 동일

**제외**
- 분석/통계
- 다중 관리자
- 배포 자동화

---

### Phase 8 — Export / Re-export (UI 단계 8)

**목표**
- 프로젝트 상세에서 "다시 생성" → 새 `generation_job` + 새 아카이브
- 과거 export 이력 목록 (파일, 크기, 만료일, 사용 횟수)
- 만료된 export의 조용한 정리 (백그라운드 잡 또는 지연 삭제 보류 — Stage 1은 지연 삭제로 충분)

**완료 조건**
- [ ] 같은 프로젝트에서 재생성 시 과거 파일을 덮어쓰지 않고 새 파일 생성
- [ ] 토큰 만료·사용 횟수 정책 일관 적용
- [ ] 사용자가 이전 버전 zip을 다시 받을 수 있는 경로 (UI 상)

**제외**
- 산출물 내부의 "내보내기"(plugin-level export) — Stage 2
- 자동 백업 스케줄

---

### Phase 9 — Domain / Offboarding / Dedicated (UI 단계 9) *(Stage 2)*

> 본 Phase는 Stage 1에서는 **구현하지 않는다**. 설계·인터페이스만 결정하여
> [service-lifecycle-policy.md](service-lifecycle-policy.md), [export-and-migration-policy.md](export-and-migration-policy.md)에 반영한다.

**Stage 2 전환 시 다룰 항목**
- 도메인 매핑 / SSL 자동화
- 오프보딩 상태 머신 (suspend → grace → export → delete → backup expiry)
- 전용(dedicated) 스택 분리 (DB/컨테이너 단독 할당)
- `site_id` 도입, connection resolver
- 결제·구독

**Stage 1 완료 시점의 유일한 요구**: 위 항목들이 **지금의 코드 가정을 위반하지 않음**을 docs에 명시.

---

## 3. 기존 단계안(agent-call-order.md)과의 차이 · 수정 제안

`agent-call-order.md`는 **에이전트 호출 순서**를 정의한다. 본 문서의 Phase와는 직교 관계다.
단, 아래 2가지 조정이 필요하다.

### 3.1 변경 제안

1. **agent-call-order.md §1(Bootstrapping) 산출물 목록에서 `docs/mvp-scope.md` 제거**
   - Stage 1 목표는 이미 [mvp-goal.md](mvp-goal.md)로 고정됨. `mvp-scope.md`는 중복·혼동 유발.
   - 대신 [mvp-goal.md](mvp-goal.md), [export-first-architecture.md](export-first-architecture.md), **본 문서**를 명시.

2. **agent-call-order.md §4(Implementation)의 FE 순서를 위저드 중심으로 재배치**
   - 현재: 레이아웃 → 위저드 → 예약관리. 예약관리는 Stage 1 제외.
   - 제안: 레이아웃/라우팅 → **사이트 유형 선택 → 위저드(3-1,3-2) → 결과 확인 → 생성 진행 → 다운로드**. 즉 본 문서의 Phase 2–5를 FE 작업 순서로 그대로 채택.

3. **새 에이전트 필요 여부**: 없음.
   - 템플릿 엔진 / 패키저는 `backend-api` 또는 신설 없이 backend-api의 sub-module로 구현. 에이전트 책임만 명확히 명기 (backend-api.md 내부에 `generator/` 소유권 추가) — **이 작업은 `docs-maintainer` 호출 시점에 반영**.

### 3.2 유지

- 결정자 → 실행자 → 검토자 원칙
- 검토 단계(Review)는 각 Phase 완료 직전에 매번 호출

---

## 4. Phase × Agent 매트릭스

| Phase | 주 결정자 | 주 실행자 | 검토 |
|---|---|---|---|
| 0 Foundation | system-architect | backend-api, admin-frontend | qa-reviewer |
| 1 Landing/Auth | auth-rbac, product-planner | backend-api, admin-frontend | security-guard, qa-reviewer |
| 2 Site Type Select | product-planner | backend-api, admin-frontend | qa-reviewer |
| 3 Wizard | product-planner, db-designer | backend-api, admin-frontend | qa-reviewer |
| 4 Preview | product-planner | admin-frontend | qa-reviewer |
| 5 Generation | system-architect | backend-api (generator 포함) | security-guard, qa-reviewer |
| 6 Deliverable Boot | system-architect | backend-api, admin-frontend | qa-reviewer |
| 7 Deliverable Ops | db-designer, auth-rbac | backend-api, admin-frontend | security-guard, qa-reviewer |
| 8 Re-export | service-lifecycle-governor | backend-api | qa-reviewer |
| 9 Stage 2 prep | product-planner, service-lifecycle-governor | — (docs only) | — |

모든 Phase 완료 후 `docs-maintainer`가 영향받은 문서 동기화.

---

## 5. Claude Code 후속 구현 프롬프트 (순서대로)

> 한 프롬프트 = 한 Phase. 각 프롬프트는 **이전 Phase가 완료 조건을 만족한 상태**를 가정한다.
> 각 프롬프트의 마지막 요구는 "완료 조건 체크리스트를 실제로 검증했음을 보고할 것"이다.

### P0. Foundation
```
Phase 0(Foundation)을 구현한다.
- 저장소 레이아웃을 CLAUDE.md의 제안대로 실제로 생성: platform-frontend/ (Vite React TS),
  platform-backend/ (plain PHP, no framework), generator/templates/company-intro/ (빈 스캐폴드),
  exports/, infra/ (docker-compose.yml).
- platform-backend: public/index.php 라우터 + /api/health 엔드포인트만. JSON 엔벨롭 {ok,data,error}.
- infra/docker-compose.yml: web(php:8.3-apache) + db(mysql:8) + 프런트는 개발 중엔 npm run dev로 별도.
- .env.example과 최소 README.
완료 조건은 docs/build-phases-aligned-with-ui-flow.md Phase 0의 체크리스트와 정확히 일치해야 한다.
검증 결과를 보고할 것.
```

### P1. Landing + Auth
```
Phase 1(Landing / Signup / Login)을 구현한다.
- platform-backend: users 테이블, POST /api/auth/signup, /login, /logout, GET /api/me.
  비밀번호는 password_hash(PASSWORD_ARGON2ID). 세션은 http-only 쿠키.
- platform-frontend: 랜딩 + /signup + /login + 로그인 후 /dashboard(빈 화면).
  AuthContext로 세션 유지, 보호 라우트 가드.
- 에러 코드 prefix AUTH_* 사용.
agent-rbac.md의 인증 모델과 일치해야 한다. Phase 1의 체크리스트를 검증 후 보고.
```

### P2. Site Type Selection
```
Phase 2(Site Type Selection)를 구현한다.
- projects 테이블 (id, user_id, name, slug, type, input_data JSON, status, timestamps).
- POST /api/projects, GET /api/projects, GET /api/projects/{id}.
- 프런트: /dashboard에 내 프로젝트 목록 + "새 사이트" → 유형 선택 화면(카드 UI).
  Stage 1은 company-intro 1개만 활성, 나머지는 "추후 제공" 비활성 카드.
- 생성 후 /projects/{id}로 라우팅(본문은 Phase 3).
본인 소유만 조회/수정 가능해야 함. Phase 2 체크리스트 검증 후 보고.
```

### P3. Wizard
```
Phase 3(Wizard 3-1, 3-2)를 구현한다.
- generator/templates/company-intro/manifest.json의 input schema를 확정 (회사 기본 정보 + 섹션 on/off/순서).
- platform-backend에서 manifest를 읽어 입력 검증을 수행하는 PATCH /api/projects/{id} 추가.
  projects.input_data 에 단계별로 병합 저장.
- platform-frontend: 3-1 기본 정보 폼 + 3-2 기능(섹션) 선택 폼. 단계 이동·저장·이어쓰기 지원.
  동일 manifest를 클라이언트에서도 읽어 검증 (복붙 금지).
- 로고/이미지 업로드: POST /api/projects/{id}/media (플랫폼 측 저장).
Phase 3 체크리스트 검증 후 보고.
```

### P4. Result Preview
```
Phase 4(Result Preview)를 구현한다.
- /projects/{id}/review 라우트: projects.input_data 만 읽어 요약 렌더.
  포함될 페이지·메뉴, 생성될 관리자 계정 안내, 실행 방법(docker compose up), 산출물 스펙.
- "수정" 버튼 → 위저드 해당 단계로 이동.
- "생성 실행" 버튼은 Phase 5 API를 호출. 중복 클릭 방지(서버에서도 멱등 처리).
추가 API 호출 없이 렌더되어야 한다. Phase 4 체크리스트 검증 후 보고.
```

### P5. Generation Pipeline
```
Phase 5(Generation Execution)를 구현한다.
- generator/engine: 템플릿 디렉터리 복사 + .tmpl 파일의 {{ var }} 치환.
- generator/packager: zip 아카이빙 (tar는 후순위).
- generation_jobs, exports, download_tokens 테이블.
- POST /api/projects/{id}/generate: 동기 실행으로 시작(Stage 1은 큐 없음).
  실패는 GEN_INPUT_INVALID / GEN_RENDER_FAILED / GEN_PACKAGE_FAILED 등으로 구분.
- GET /api/exports/{token}: 스트리밍, 만료시 410.
- 프런트: /projects/{id}/generate 진행 상태 화면 + 완료 시 다운로드 화면.
- generator/templates/company-intro 안에 "최소 동작하는" React + plain PHP + MySQL 템플릿을 함께 작성.
완료 후 서로 다른 입력 3건으로 서로 다른 zip이 나오는지 수동 검증하고 결과 보고.
```

### P6. Deliverable Boot
```
Phase 6(Deliverable Boot)을 구현한다. (산출물 품질 작업)
- company-intro 템플릿의 docker-compose.yml.tmpl을 실제 동작하도록 완성.
  db 컨테이너가 schema.sql + seed.sql 자동 적용되도록.
- seed.sql.tmpl에 관리자 임시 계정(이메일 + 비밀번호) 주입. 첫 로그인 후 비밀번호 변경 강제.
- README.md를 산출물에 포함하고, 초심자 기준의 실행 순서 기술.
- 생성된 zip을 실제로 풀어 docker compose up 까지 수동 실행하고 공개 사이트 + 관리자 로그인이
  모두 뜨는지 확인.
Stage 1에서 외부 머신 3종 검증은 이후 QA에서 수행 — 지금은 로컬 1곳에서 확인.
Phase 6 체크리스트 검증 후 보고.
```

### P7. Deliverable Ops
```
Phase 7(Deliverable Operation)을 구현한다. (산출물 내부 기능)
- 산출물 backend: pages / menus / company_info / media_assets 테이블 + 관리자 CRUD API.
- 산출물 frontend:
  - 공개 사이트: 템플릿이 정의한 섹션을 DB 값으로 렌더.
  - 관리자: 페이지/메뉴/회사정보/미디어 관리 화면 (데스크톱 전용).
- 인증은 admin_users 테이블 + 세션. 첫 로그인 비밀번호 변경 강제 유지.
산출물 내부에서 플랫폼으로 나가는 호출이 0건이어야 한다(정적 검사 수동).
Phase 7 체크리스트 검증 후 보고.
```

### P8. Re-export
```
Phase 8(Re-export)을 구현한다.
- 프로젝트 상세에 "다시 생성" 버튼. 새 generation_job + 새 export 생성(덮어쓰기 금지).
- exports 목록을 프로젝트 상세에서 조회 가능. 각 row: 파일명, 크기, 만료일, 사용 횟수.
- 만료된 export는 지연 삭제(다운로드 시 410 + 배경 정리 미구현 OK).
- 토큰 정책(만료일/사용 횟수)은 mvp-goal.md의 값과 일치.
Phase 8 체크리스트 검증 후 보고.
```

### P9. Stage 2 준비 (설계만)
```
Phase 9는 Stage 2 영역이므로 구현 금지. 아래 문서만 갱신한다.
- docs/service-lifecycle-policy.md: 오프보딩 상태 머신(suspend→grace→export→delete→backup expiry) 확정.
- docs/export-and-migration-policy.md: 재-export · 보관 기간 · 증거용 아카이브 정리.
- docs/product-vision.md: 도메인 매핑·전용 스택 분리의 예상 구조를 1–2 페이지로 스케치(코드 아님).
구현/스키마 변경은 금지. docs-maintainer 호출 후 정리 보고.
```

---

## 6. 단계 전환 규칙

- 한 Phase의 **완료 체크리스트 전부 ✅ 전에는 다음 Phase 시작 금지**.
- 각 Phase 완료 직전에 `qa-reviewer`, 권한/보안이 관련되면 `security-guard`를 호출한다([agent-call-order.md §5](agent-call-order.md) 그대로).
- 차단 이슈 발생 시 해당 Phase 내에서 수정하고 체크리스트 재검증.
- 문서 변경(인터페이스 추가, 정책 보완)은 Phase 완료와 동시에 `docs-maintainer`로 동기화.

---

## 6.1 현재 진행 상태 (2026-04-22 기준)

> 본 절은 단계 전환을 빠르게 추적하기 위한 라이브 상태표다. 각 Phase 의 정식 완료 조건은 §2 의 체크리스트가 진실원이다.
> 사용자 UI 플로우의 상세는 [site-creation-flow.md](site-creation-flow.md) 참고.

| Phase | 항목 | 상태 | 비고 |
|---|---|---|---|
| 0 | Repo & Foundation | ✅ 구현 | platform-frontend (Vite + React + TS), platform-backend (plain PHP), `/api/health`, docker-compose, vite proxy |
| 1 | Landing / Signup / Login | 🟨 부분 | 랜딩 페이지 + Redux auth slice 자리잡음. Signup/Login API 와 세션은 미구현 |
| 2 | Site Type Selection | 🟨 UI mock | `TypeSelect` 화면 + Redux `siteType` 상태. 라우트 `/sites/new/type`. `POST /api/projects` 미연결 |
| 3 | Wizard 3-1 / 3-2 | 🟨 UI mock | `BasicInfo`, `Features` 완성. 라우트 `/sites/new/setup/basic`, `/sites/new/setup/features`. 서버 PATCH 미구현, manifest.json 미작성 |
| 4 | Result Preview | 🟨 UI mock | `Review` 좌/우 분할 요약 완성. 라우트 `/sites/new/review`. mock 생성 → `/sites/new/done/:id` |
| 5 | Generation Pipeline | ❌ 미시작 | `POST /api/projects/{id}/generate` 미구현. generator/engine 디렉토리 자체가 미생성 |
| 6 | Deliverable Boot | ❌ 미시작 | `templates/company-intro/` 디렉토리만 존재, 템플릿 파일 비어 있음 |
| 7 | Deliverable Ops | ❌ 미시작 | 산출물 admin/공개 사이트 미구현 |
| 8 | Re-export | ❌ 미시작 | 토큰/만료 정책 코드 미반영 |

### 현재 mock 처리된 부분 (Phase 2~4)

- **프로젝트 생성 API 호출 없음**: 유형 선택 → 위저드 진입은 Redux store 만 갱신. `projects` 테이블 레코드는 만들어지지 않는다.
- **저장은 localStorage 단일**: `siteforge:store:v2` 키에 siteBuilder 슬라이스만 보존. 서버 동기화 없음 — 다른 기기/세션에서는 보이지 않는다.
- **이미지 업로드 없음**: 로고/배너 등은 위저드에서 받지 않는다 (Phase 3 본구현 시 필드 추가 예정).
- **manifest.json 미존재**: 입력 스키마는 슬라이스의 `validateBasic` / `validateFeatures` 함수가 임시 진실원. Phase 3 본구현 시 `templates/company-intro/manifest.json` 으로 이전.
- **mock 생성**: `Review` 의 "이대로 생성하기" 는 `mock-{Date.now()}` ID 를 만들어 `/sites/new/done/:id` 로 이동. 실제 zip 생성 없음.

### Phase 5 본구현을 위해 다음에 필요한 것

1. **DB 테이블**: `projects` (id, user_id, name, slug, type, input_data JSON, status), `generation_jobs`, `exports`, `download_tokens`.
2. **manifest.json**: `templates/company-intro/manifest.json` 에 입력 JSON Schema 확정. 검증은 클라/서버가 동일 파일 사용.
3. **프로젝트 API**: `POST /api/projects` (TypeSelect 단계), `PATCH /api/projects/{id}` (BasicInfo/Features 단계별 input_data 병합), `GET /api/projects/{id}` (Review 새로고침 대비).
4. **생성 API**: `POST /api/projects/{id}/generate` (멱등), `GET /api/exports/{token}` (스트리밍 + 410).
5. **generator 모듈**: `generator/engine` (템플릿 복사 + `.tmpl` 치환), `generator/packager` (zip).
6. **프런트 연결**: 현재 슬라이스의 dispatch 시점에 API 호출을 endpoint hook (예: `useUpdateProject`) 로 감싸 주입. Redux state 는 그대로 유지하되 "서버 → 로컬" 동기화 추가.
7. **세션/인증**: Phase 1 본구현 (signup/login) 이 먼저 끝나야 위 API 가 사용자에 묶일 수 있다.

---

## 7. 참고 문서

- [mvp-goal.md](mvp-goal.md) — Stage 1 목표의 단일 진실원
- [export-first-architecture.md](export-first-architecture.md) — 플랫폼/산출물 구조와 생성 파이프라인
- [agent-governance.md](agent-governance.md) — 에이전트 역할 분리
- [agent-call-order.md](agent-call-order.md) — 에이전트 호출 순서 (본 문서와 직교)
- [service-lifecycle-policy.md](service-lifecycle-policy.md) — Stage 2 수명주기 정책 (Phase 9 입력)
- [export-and-migration-policy.md](export-and-migration-policy.md) — export 정책 세부 (Stage 2에서 완성)
