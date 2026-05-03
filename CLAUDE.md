# CLAUDE.md

This file guides Claude Code (and any AI collaborator) when working in this repository. Keep it concise and current.

## Product

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

## Repository layout (current)

```
.
├─ platform-frontend/   # React + Vite + TS — CreatorDesk SPA (desktop-first)
├─ platform-backend/    # PHP API (MVP 이후 구현 예정)
├─ infra/
│  └─ Dockerfile.web    # php:8.4-apache + pdo_mysql
├─ docker-compose.yml   # web (PHP) + db (MySQL)
├─ CLAUDE.md
└─ README.md
```

**Planned additions (not yet created):**

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
