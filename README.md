<<<<<<< HEAD
# CreatorDesk

크리에이터 콘텐츠 운영 워크스페이스 SaaS.
유튜버, 라이브 스트리밍, 숏폼 크리에이터가 아이디어부터 업로드까지 콘텐츠 제작 전 과정을 한 곳에서 관리한다.

- **Platform stack**: React + Vite + TS (frontend) / PHP (backend, MVP 이후) / MySQL
- **MVP**: localStorage mock 기반, 백엔드 없이 실행
- **Tenancy**: workspace_id 스코프
- **Admin UX**: desktop-first

See [CLAUDE.md](CLAUDE.md) for AI-collaboration rules.

## Repository layout

```
.
├─ platform-frontend/   # React + Vite + TS (CreatorDesk SPA)
├─ platform-backend/    # PHP API (MVP 이후 구현)
├─ infra/               # Dockerfiles, server config
├─ docker-compose.yml   # dev stack: web (PHP), db (MySQL)
└─ CLAUDE.md
=======
# SiteForge — Website Builder SaaS (Stage 1)

고객이 위저드로 **기업 소개 웹사이트**를 만들고, 그 결과물을 그대로 다운로드해 자신의 머신에서 실행할 수 있도록 하는 SaaS.

- 플랫폼/산출물 모두 동일 스택: **React + plain PHP (no framework) + MySQL**
- Stage 1 = "생성 + 내보내기"까지. 자세한 범위는 [docs/mvp-goal.md](docs/mvp-goal.md), [docs/build-phases-aligned-with-ui-flow.md](docs/build-phases-aligned-with-ui-flow.md) 참조.

## 디렉터리

```
.
├─ platform-frontend/   # React (Vite) — SaaS 자체 UI
├─ platform-backend/    # plain PHP API — public/, src/{Controllers,Services,Routing,Support}
├─ templates/           # 산출물 템플릿 (Phase 5+에서 채워짐)
├─ generated-apps/      # 생성 작업/산출물 임시 저장 (gitignored)
├─ infra/               # Docker 빌드 정의 (Dockerfile.web 등)
├─ docs/                # 기획·아키텍처·정책 문서
└─ docker-compose.yml
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
```

## 로컬 실행 (Phase 1)

<<<<<<< HEAD
## Prerequisites

- Docker Desktop
- Node 20+ and npm

## First-time setup

```bash
# 1. Start backend stack (DB only in MVP)
docker compose up -d --build
=======
전제: Docker Desktop 설치.

```bash
# 1) 빌드 및 부팅
docker compose up --build
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8

# 2) 브라우저
#    http://localhost:8080   → React 프런트 (SiteForge 랜딩)
#    http://localhost:8081   → plain PHP API
#    http://localhost:8081/api/health → 헬스체크 JSON
#    http://localhost:8082   → phpMyAdmin (root / root1234)
```

<<<<<<< HEAD
| Service           | URL                     |
| ----------------- | ----------------------- |
| Frontend (Vite)   | http://localhost:5173   |
| PHP API           | http://localhost:8080   |
| MySQL (host)      | localhost:3306          |

## Database credentials (dev)

```
Host:     db (from containers) / localhost:3306 (from host)
Database: saasdb
User:     saasuser
Password: saaspass1234
Root PW:  root1234
```

## Common commands

```bash
# Frontend
cd platform-frontend
npm run dev         # start Vite dev server
npm run build       # production build
npm run lint        # lint

# Stack lifecycle
docker compose up -d --build   # rebuild & start
docker compose down            # stop
docker compose logs -f web     # tail web logs
=======
처음 실행 시 `frontend` 컨테이너에서 `npm install`이 자동 수행됩니다(수십 초 소요).

### 헬스체크 확인

```bash
curl http://localhost:8081/api/health
# → {"ok":true,"data":{"status":"ok","service":"platform-backend","time":"2026-04-21T..."}}
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
```

랜딩 화면 우측 상단의 배지가 **API 연결됨** (녹색)으로 표시되면 정상.

<<<<<<< HEAD
MVP — localStorage mock 기반 프론트엔드 동작 중. 백엔드 API는 미구현.
다음 작업: 워크스페이스 CRUD API, 콘텐츠 아이템 상태 전이 API, 인증 실구현.
=======
### 종료 / 초기화

```bash
docker compose down            # 컨테이너만 정리
docker compose down -v         # MySQL 데이터까지 초기화
```

## API 응답 엔벨롭

모든 플랫폼 API는 다음 포맷을 따릅니다.

```json
// 성공
{ "ok": true, "data": { ... } }
// 실패
{ "ok": false, "error": { "code": "NOT_FOUND", "message": "Route not found" } }
```

## 프런트엔드 상태 관리

- **Redux Toolkit + react-redux** 채택. 멀티스텝 위저드와 곧 도입될 인증 상태를 한 store 에서 관리.
- 슬라이스
  - `siteBuilder` — 사이트 생성 위저드(유형/기본정보/기능/단계). `localStorage` 영속.
  - `auth` — 로그인 사용자/세션 (현재는 placeholder, 실제 API 미연결).
- 구조
  ```
  platform-frontend/src/
  ├─ app/store.js                              # configureStore + 영속화
  ├─ features/siteBuilder/siteBuilderSlice.js  # 위저드 상태/액션/검증
  └─ features/auth/authSlice.js                # 인증 placeholder
  ```
- 어떤 상태를 Redux 에, 어떤 상태를 local 에, 어떤 상태를 서버에 둘지: [docs/state-management-guide.md](docs/state-management-guide.md)
- 도입 배경/장단점/확장 계획: [docs/redux-toolkit-adoption.md](docs/redux-toolkit-adoption.md)

## 다음 단계

- [docs/phase-1.md](docs/phase-1.md) — 1단계에서 한 일과 의도적 제외 항목
- [docs/build-phases-aligned-with-ui-flow.md](docs/build-phases-aligned-with-ui-flow.md) — 전체 Phase 로드맵
>>>>>>> 3e4b835ce910371b1be45acf592df021faeaa6e8
