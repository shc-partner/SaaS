# Export-First Architecture (Stage 1)

> 본 문서는 [mvp-goal.md](mvp-goal.md)를 어떤 시스템 구조로 달성하는지 정의한다.
> 핵심 원칙: **"먼저 만들고 내보낸다. 호스팅·운영은 그 다음."**

## 1. 핵심 원칙

1. **산출물이 1차 산출물이다.** 플랫폼은 산출물을 만들기 위한 도구.
2. **산출물은 플랫폼 없이 독립 실행된다.** 플랫폼으로 콜백·키 종속·과금 게이트 없음.
3. **템플릿은 코드, 사이트는 데이터.** 같은 템플릿이 입력만 다르게 받아 다른 회사를 표현.
4. **같은 스택 양쪽.** 플랫폼도 산출물도 React + plain PHP + MySQL → 템플릿이 그대로 플랫폼 모듈을 닮음.

## 2. 두 개의 시스템

```
┌──────────────────────────────────────────────────────────────┐
│  Platform (the SaaS itself)                                  │
│                                                              │
│  ┌────────────────────┐    ┌────────────────────────────┐    │
│  │ platform-frontend  │    │ platform-backend           │    │
│  │ React admin SPA    │◄──►│ plain PHP API              │    │
│  │ - signup/login     │    │ - auth, projects           │    │
│  │ - wizard           │    │ - generate, export         │    │
│  │ - download link    │    │ - download token           │    │
│  └────────────────────┘    └────────┬───────────────────┘    │
│                                     │ invokes                │
│                                     ▼                        │
│                       ┌──────────────────────────┐           │
│                       │ generator                │           │
│                       │ - templates/             │           │
│                       │ - engine (render)        │           │
│                       │ - packager (zip/tar)     │           │
│                       └────────────┬─────────────┘           │
│                                    │ writes                  │
│                                    ▼                        │
│                            ┌──────────────┐                  │
│                            │ exports/     │ (gitignored)     │
│                            │ *.zip / *.tar│                  │
│                            └──────────────┘                  │
└──────────────────────────────────────────────────────────────┘

      ▼ customer downloads, unzips, runs `docker compose up`

┌──────────────────────────────────────────────────────────────┐
│  Deliverable (independent customer site)                     │
│                                                              │
│  React frontend  +  plain PHP backend  +  MySQL              │
│  Self-contained: docker-compose.yml, README, .env.example    │
└──────────────────────────────────────────────────────────────┘
```

## 3. 산출물(Deliverable) 구조

```
company-{slug}-{timestamp}/
├─ README.md
├─ docker-compose.yml
├─ .env.example
├─ frontend/
│  ├─ src/                  # React 코드 (템플릿 + 입력 데이터로 렌더된 결과)
│  ├─ public/
│  ├─ package.json
│  └─ vite.config.* (or build config)
├─ backend/
│  ├─ public/
│  │  └─ index.php          # entry
│  ├─ src/
│  │  ├─ Controllers/
│  │  ├─ Services/
│  │  └─ Repositories/
│  ├─ composer.json         # plain PHP, minimal deps
│  └─ .htaccess (or nginx hint)
├─ database/
│  ├─ schema.sql            # 스키마 DDL
│  └─ seed.sql              # 초기 컨텐츠 (회사 정보, 메뉴, 페이지)
└─ media/                   # 업로드된 이미지/로고 (있으면)
```

원칙:
- `docker compose up` 1회로 부팅
- DB 컨테이너가 `schema.sql + seed.sql` 자동 적용
- 외부 API 키 미포함 (필요 시 `.env.example`에 placeholder)

## 4. 템플릿(Template) 구조

> **UI 정책 — 산출물 템플릿의 공개 frontend 는 반응형 필수** (desktop/tablet/mobile).
> 단일 진실원: [ui-policy.md](ui-policy.md).
> 산출물 안의 `/admin` 은 데스크탑 전용 (운영자 PC 사용 가정).

`generator/templates/company-intro/` 안에:

```
company-intro/
├─ manifest.json            # 템플릿 메타: 입력 스키마, 변수 목록, 파일 매핑
├─ frontend/                # React 소스 — 템플릿 변수 포함
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  └─ config/site.json.tmpl
│  └─ package.json.tmpl
├─ backend/                 # plain PHP 소스 — 템플릿 변수 포함
│  ├─ public/index.php
│  ├─ src/
│  └─ composer.json.tmpl
├─ database/
│  ├─ schema.sql            # 모든 회사가 공유하는 스키마
│  └─ seed.sql.tmpl         # 회사별로 채워지는 초기 데이터
└─ docker-compose.yml.tmpl
```

- `.tmpl` 파일은 변수 치환 대상 (예: `{{ company.name }}`, `{{ db.password }}`)
- 비-`.tmpl` 파일은 그대로 복사
- 입력 검증은 `manifest.json`의 JSON Schema로

## 5. 생성 파이프라인 (Generator Engine)

```
[ wizard 입력 ]
        │
        ▼
[ 1. 입력 검증 ]            manifest.json 의 input schema 로 zod/JSON Schema 검증
        │
        ▼
[ 2. 작업 디렉토리 생성 ]   /tmp/gen-{job_id}/
        │
        ▼
[ 3. 템플릿 복사 + 치환 ]   .tmpl → 변수 치환, 그 외는 그대로 복사
        │
        ▼
[ 4. 산출물 검증 ]          최소 파일 존재 여부, JSON 유효성, package.json 파싱
        │
        ▼
[ 5. 패키징 ]               zip 또는 tar 로 압축 → exports/{archive_name}.zip
        │
        ▼
[ 6. 다운로드 토큰 발급 ]   짧은 만료의 단방향 토큰. DB에 (token, file_path, expires_at) 기록
        │
        ▼
[ 7. 작업 디렉토리 정리 ]   /tmp/gen-{job_id} 삭제
```

실패 시:
- 단계별 에러 코드 (`GEN_INPUT_INVALID`, `GEN_RENDER_FAILED`, `GEN_PACKAGE_FAILED` 등)
- 작업 디렉토리는 디버깅 위해 일정 시간 유지 (개발 모드)

## 6. 다운로드 채널

- 다운로드 엔드포인트: `GET /api/exports/{token}`
- 토큰: 일회성 또는 N회 (정책 결정), 짧은 만료 (기본 7일 또는 N회)
- 파일은 `exports/` 외부 비공개 위치 → 응답 시 스트리밍
- 만료된 토큰: 410 Gone, 파일은 백그라운드 잡이 정리

## 7. 플랫폼 백엔드 (platform-backend)

플랫폼이 제공하는 API (Stage 1 최소):

| 메서드 | 경로 | 목적 |
|---|---|---|
| POST | `/api/auth/signup` | 가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET  | `/api/projects` | 내 프로젝트 목록 |
| POST | `/api/projects` | 신규 프로젝트 생성 (위저드 입력 저장) |
| GET  | `/api/projects/{id}` | 단건 조회 |
| POST | `/api/projects/{id}/generate` | 산출물 생성 트리거 |
| GET  | `/api/projects/{id}/exports` | 산출물 목록 |
| GET  | `/api/exports/{token}` | 산출물 다운로드 |

응답 envelope: `{ ok, data?, error? }` (모든 엔드포인트).

## 8. 플랫폼 프런트엔드 (platform-frontend)

Stage 1 화면 (최소):
- 로그인 / 가입
- 프로젝트 대시보드 (목록 + 신규)
- 위저드 (회사 정보, 메뉴, 페이지 — 단계 분할)
- 생성 진행 화면
- 다운로드 화면 (파일 + 만료 정보)

> **UI 정책 — 데스크탑 전용 (platform-frontend) / 반응형 (산출물 템플릿).**
> 단일 진실원: [ui-policy.md](ui-policy.md).
> 요약: 플랫폼은 PC 작업 도구이므로 데스크탑 전용. 산출물은 일반 방문자가 보는 회사 홈페이지이므로 반드시 반응형.

## 9. 데이터 모델 (플랫폼 측, Stage 1 최소)

| 테이블 | 핵심 컬럼 |
|---|---|
| `users` | id, email, password_hash, created_at |
| `projects` | id, user_id, name, slug, input_data(JSON), status, created_at, updated_at |
| `generation_jobs` | id, project_id, status, started_at, finished_at, error_code, error_message |
| `exports` | id, project_id, job_id, file_path, format(zip/tar), size_bytes, created_at |
| `download_tokens` | token, export_id, expires_at, used_count, max_uses |

> 이 단계에서는 멀티테넌트 site_id 추상화 없음. 그건 Stage 2 호스팅에 필요할 뿐, 생성·내보내기에는 불필요.

## 10. 산출물 내부의 데이터 모델 (Deliverable 측, 회사 1곳용)

| 테이블 | 핵심 컬럼 |
|---|---|
| `admin_users` | id, email, password_hash |
| `pages` | id, slug, title, body_html, sort_order |
| `menus` | id, label, target(page_id or url), sort_order |
| `company_info` | key, value (singleton 형태 또는 단일 행) |
| `media_assets` | id, path, mime, size |

(템플릿이 표현하는 회사 소개 페이지에 필요한 최소만)

## 11. Stage 1에서 명시적으로 안 하는 것

- 멀티테넌트 라우팅 / connection resolver
- 사이트 호스팅 / 도메인 매핑 / SSL
- 결제·플랜·청구
- 산출물 생성 큐의 분산 처리 (단일 노드 순차 OK)
- 산출물 자동 배포 외부 통합
- 알림

## 12. Stage 2 진입 시 추가될 것 (참고)

- `site_id` 도입 + connection resolver → 호스팅된 멀티테넌트 운영
- 다른 사이트 유형 템플릿
- 결제·구독
- 백업·해지·유예 정책의 코드 적용
- export 정책의 정교화 (이미 [export-and-migration-policy.md](export-and-migration-policy.md)에 골격 있음 — Stage 2에서 정합)
