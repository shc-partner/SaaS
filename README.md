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
```

`platform-backend/public/` is the Apache DocumentRoot (configured in [infra/Dockerfile.web](infra/Dockerfile.web)).

## Prerequisites

- Docker Desktop
- Node 20+ and npm

## First-time setup

```bash
# 1. Start backend stack (DB only in MVP)
docker compose up -d --build

# 2. Install frontend deps and start dev server
cd platform-frontend
npm install
npm run dev
```

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
```

## Status

MVP — localStorage mock 기반 프론트엔드 동작 중. 백엔드 API는 미구현.
다음 작업: 워크스페이스 CRUD API, 콘텐츠 아이템 상태 전이 API, 인증 실구현.
