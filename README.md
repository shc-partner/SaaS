<<<<<<< HEAD
# SaaS — Website Builder Platform

Multi-tenant website-builder SaaS. Users sign up, pick a site type (company / blog / reservation / member), edit content, and publish. Platform and generated sites share one stack.

- **Platform stack**: React (admin SPA) + PHP CodeIgniter 4 (API) + MySQL
- **Generated-site stack**: React (public runtime) + PHP CodeIgniter 4 (shared API) + MySQL
- **Tenancy (MVP)**: shared MySQL, rows scoped by `site_id`
- **Admin UX**: desktop-first

See [CLAUDE.md](CLAUDE.md) for AI-collaboration rules, [docs/](docs/) for architecture and scope.

## Repository layout

```
.
├─ platform-frontend/   # React + Vite + TS (admin SPA)
├─ platform-backend/    # CodeIgniter 4 (API)
├─ infra/               # Dockerfiles, server config
├─ docs/                # architecture, scope, separation docs
├─ docker-compose.yml   # dev stack: web (CI4), db (MySQL), phpmyadmin
└─ CLAUDE.md
```

`platform-backend/public/` is the Apache DocumentRoot (configured in [infra/Dockerfile.web](infra/Dockerfile.web)).

## Prerequisites

- Docker Desktop
- Node 20+ and npm (for running `platform-frontend` on the host)

## First-time setup

```bash
# 1. Build and start backend stack
docker compose up -d --build

# 2. Install frontend deps and start dev server
cd platform-frontend
npm install
npm run dev
```

Verify:

| Service           | URL                                    |
| ----------------- | -------------------------------------- |
| CI4 API           | http://localhost:8080                  |
| Frontend (Vite)   | http://localhost:5173                  |
| phpMyAdmin        | http://localhost:8081 (root / root1234) |
| MySQL (host)      | localhost:3306                         |

Hitting http://localhost:8080 should show the default CI4 welcome page.

## Database credentials (dev)

```
Host:     db (from containers) / localhost:3306 (from host)
Database: saasdb
User:     saasuser
Password: saaspass1234
Root PW:  root1234
```

Copy `platform-backend/env` → `platform-backend/.env` and fill in the DB section before running migrations.

## Common commands

```bash
# Backend
docker compose exec web composer install            # refresh CI4 deps
docker compose exec web php spark migrate           # run migrations (after they exist)
docker compose exec web php spark serve             # optional: run CI4 dev server

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

Skeleton only. No features implemented yet. Next work: auth/RBAC, core multi-tenant schema, site CRUD. See [docs/mvp-scope.md](docs/mvp-scope.md) when written.
=======
# SaaS
SaaS Project
>>>>>>> 48aadfa4e38e61ef489eae39323b1b4e30cda354
