# CreatorDesk

크리에이터 컨텐츠 운영 워크스페이스 SaaS.
유튜버, 라이브 스트리밍, 숏폼 크리에이터가 아이디어부터 업로드까지 컨텐츠 제작 전 과정을 한 곳에서 관리한다.

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

## 로컬 실행

### Prerequisites

- Docker Desktop
- Node 20+ and npm

### First-time setup

```bash
# 백엔드 스택 시작 (MVP에서는 DB만)
docker compose up -d --build
```

| Service           | URL                     |
| ----------------- | ----------------------- |
| Frontend (Vite)   | http://localhost:8080   |
| PHP API           | http://localhost:8000   |
| MySQL (host)      | localhost:3306          |

### Database credentials (dev)

```
Host:     db (from containers) / localhost:3306 (from host)
Database: saasdb
User:     saasuser
Password: saaspass1234
Root PW:  root1234
```

### Common commands

```bash
# 프론트엔드 단독 실행
cd platform-frontend
npm run dev         # Vite dev server 시작
npm run build       # 프로덕션 빌드
npm run typecheck   # 타입 체크

# 스택 생명주기
docker compose up -d --build   # 재빌드 & 시작
docker compose down            # 중지
docker compose logs -f web     # 로그 확인
```

## 현재 상태

MVP — localStorage mock 기반 프론트엔드 동작 중. 백엔드 API는 미구현.
다음 작업: 워크스페이스 CRUD API, 컨텐츠 아이템 상태 전이 API, 인증 실구현.
