# CLAUDE.md

This file guides Claude Code (and any AI collaborator) when working in this repository. Keep it concise and current.

## Fixed Goal (Stage 1 — Export First)

<<<<<<< HEAD
**CreatorDesk** — 크리에이터 콘텐츠 운영 워크스페이스 SaaS.
유튜버, 라이브 스트리밍, 숏폼 크리에이터가 아이디어부터 업로드까지 콘텐츠 제작 전 과정을 한 곳에서 관리한다.

**핵심 기능**:
- **워크스페이스**: 채널 단위 운영 공간. 크리에이터는 워크스페이스 안에서 콘텐츠 아이디어 → 제작 → 발행까지 관리한다.
- **콘텐츠 아이템**: 아이디어에서 발행까지의 제작 단위. 상태 머신으로 진행 관리.
  - 상태 흐름: `idea → planning → scripting → shooting → editing → edit-review → thumbnail → scheduled → published`
- **아이디어 보관함**: 아직 콘텐츠 아이템이 되지 않은 아이디어 저장소.
- **캘린더**: 촬영일·편집마감일·업로드 예정일 기반 월간 콘텐츠 일정 뷰.
- **대본·제목 후보·썸네일 문구·편집 메모**: 콘텐츠 아이템 단위 제작 자산 관리.

**공개 사이트 생성, 페이지 빌더, 사이트 export, 내 서버 이관은 CreatorDesk 범위 아님.**

- **Platform stack**: React + Vite + TypeScript (frontend) / PHP (backend, MVP 이후) / MySQL
- **MVP**: localStorage 기반 mock 데이터로 동작. 백엔드 없이 프론트엔드 단독 실행.
- **Tenancy**: workspace_id 기반 테넌트 스코프. 향후 dedicated DB 전환 가능한 구조 유지.
- **Admin UX**: **desktop-first**. MVP에서 모바일 최적화 없음.
=======
A SaaS that lets a customer **generate a company-introduction website**. The customer's deliverable is a downloadable bundle they can run anywhere.

**Stage 1 success criteria** (this is the only thing that matters right now):
1. Customer signs up and runs a small wizard.
2. System generates a complete deliverable: **React frontend + plain PHP backend + MySQL schema/seed**.
3. Customer downloads the deliverable as a single archive (`.zip` or `.tar`).
4. Customer can run that archive on their own machine and see a working company website + minimal admin.
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8

**Stage 1 is NOT**:
- A polished hosted multi-tenant SaaS.
- Plans / billing / dashboards / team features.
- Notifications, email, analytics.
- Anything beyond the company-introduction site type.

Operational SaaS hosting comes later. Generation + export comes first.

## Technical direction (fixed)

- **Frontend**: React
- **Backend**: **plain PHP** (no framework, **no CodeIgniter**)
- **Database**: MySQL
- **Platform stack** (the SaaS itself): React + plain PHP + MySQL
- **Deliverable stack** (what we generate): React + plain PHP + MySQL — same shape as the platform

Same stack on both sides keeps the generator simple: the platform's own modules can serve as templates.

## Repository layout (proposed, not yet created)

See [docs/mvp-goal.md](docs/mvp-goal.md) and [docs/export-first-architecture.md](docs/export-first-architecture.md) for rationale.

```
.
<<<<<<< HEAD
├─ platform-frontend/   # React + Vite + TS — CreatorDesk SPA (desktop-first)
├─ platform-backend/    # PHP API (MVP 이후 구현 예정)
├─ infra/
│  └─ Dockerfile.web    # php:8.4-apache + pdo_mysql
├─ docker-compose.yml   # web (PHP) + db (MySQL)
├─ CLAUDE.md
└─ README.md
=======
├─ platform-frontend/           # React — admin SPA for the platform itself
├─ platform-backend/            # plain PHP — platform API (auth, projects, generate, export)
├─ generator/
│  ├─ templates/
│  │  └─ company-intro/         # the only site type in Stage 1
│  │     ├─ frontend/           # React template (rendered with site data)
│  │     ├─ backend/            # plain PHP template
│  │     └─ database/           # schema.sql, seed.sql template
│  ├─ engine/                   # render templates → output tree
│  └─ packager/                 # zip/tar the output tree
├─ exports/                     # generated archives (gitignored, served once then evicted)
├─ docs/
└─ infra/                       # docker-compose for the platform's own dev stack
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
```

## Ground rules

<<<<<<< HEAD
- `platform-backend/database/` — 마이그레이션 & 시드 SQL

## Ground rules when writing code

- **모든 테넌트 쿼리는 workspace_id 포함 필수**. 플랫폼 관리자 엔드포인트 외에는 교차 워크스페이스 조회 금지.
- **콘텐츠 상태 전이는 서비스 레이어에서만 처리**. 컨트롤러는 HTTP ↔ 서비스 호출 변환만.
- **Reservation/알림 훅은 미구현**: MVP에서는 이벤트 훅만 설계. 실제 발송 미구현.
- **Admin UI는 데스크탑 전용**. 모바일 레이아웃에 시간 쓰지 않음.
- **JSON 응답 포맷 통일**: `{ ok: boolean, data?, error?: { code, message, details? } }`.
- **Auth**: RBAC — 워크스페이스 역할(owner / editor / viewer) + 플랫폼 슈퍼관리자. MVP는 mock 기반.
- **구 사이트 빌더 코드 참조 금지**: CreatorDesk 범위 밖의 공개 사이트 생성·렌더링·export 관련 코드나 경로는 다시 도입하지 않는다.

## Not in MVP (explicitly deferred)

- 콘텐츠 운영 데이터 내보내기 (CSV, ICS, Markdown, PDF) — MVP 이후
- 팀 협업 (워크스페이스 멤버십, 담당자 배정) — MVP 이후
- 카카오 / 이메일 / SMS 알림
- 커스텀 도메인 SSL 자동화
- Dedicated-DB 테넌트 프로비저닝
- 모바일 최적화 어드민
- 결제 / Stripe 연동
- 공개 사이트 생성·export·내 서버 이관

## Docs to consult

- [docs/architecture.md](docs/architecture.md) — 시스템 구조, 테넌시 모델
- [docs/mvp-scope.md](docs/mvp-scope.md) — v1 범위, 제외 목록
=======
- **Generation first, hosting second.** Every feature is judged by: "does this get us closer to a downloadable, runnable archive?"
- **Deliverable must be self-contained.** It runs without the platform. Includes README, `docker-compose.yml`, `.env.example`, schema/seed.
- **No platform-specific runtime calls in the deliverable.** No callbacks home, no API keys baked in.
- **Templates are code; site content is data.** Templates accept a typed config object; per-customer differences live only in the rendered config / seed.
- **Plain PHP, no framework.** Controller → service → repository structure by convention, not by library.
- **JSON envelope** on all platform APIs: `{ ok, data?, error?: { code, message } }`.

## Non-goals (Stage 1)

- Hosted multi-tenant runtime, custom domains, SSL automation
- Multiple site types beyond company-intro
- Billing, plans, teams, RBAC beyond owner+admin
- Notifications, mail, scheduled jobs
- Mobile-optimized **platform UI** (desktop only — see `docs/ui-policy.md`).
  - Note: the **deliverable** site (templates/) is the opposite — it MUST be responsive (desktop/tablet/mobile).

## Docs to consult

- [docs/mvp-goal.md](docs/mvp-goal.md) — what Stage 1 is and what it isn't
- [docs/export-first-architecture.md](docs/export-first-architecture.md) — generator/export pipeline shape
- [docs/ui-policy.md](docs/ui-policy.md) — **Platform UI = desktop-only / Deliverable UI = responsive required**
- [docs/agent-governance.md](docs/agent-governance.md) — agent roles
- [docs/agent-call-order.md](docs/agent-call-order.md) — agent call order per phase
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
