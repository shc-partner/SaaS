# CLAUDE.md

This file guides Claude Code (and any AI collaborator) when working in this repository. Keep it concise and current.

## Product

A **website-builder SaaS**. Users sign up, choose a site type (company / blog / reservation / member), configure content, and publish a public website. Platform is multi-tenant.

**What "a website" means here** — not a single landing page. SiteForge builds **real multi-page sites**:
- A **main (home) page** plus **one independent page per user-selected page** (e.g. `/about`, `/services`, `/contact`), each with its own route, URL, and content.
- An **admin page** (when the user opts in) with dashboard / content / inquiries / visibility modules, living under `/admin/sites/:id`.
- Unselected pages are **not** created — selection drives actual page/route generation, not section toggles.
- Navigation is router-based (`<a href>`), not anchor-scroll. Single-page-landing output is explicitly *not* the product.

- **Platform stack**: React (admin SPA) + PHP CodeIgniter 4 (API) + MySQL
- **Generated-site stack**: React (public runtime) + PHP CI4 (shared API) — *same tech as platform*, not a separate codebase
- **Tenancy (MVP)**: shared MySQL, tenant rows scoped by `site_id`
- **Tenancy (future)**: dedicated DB per tenant (enterprise tier) — design must keep this path open
- **Admin UX**: **desktop-first**. No mobile optimization in MVP.
- **Reservation module**: ships in MVP **without notifications** (no Kakao/email yet); integration hooks are designed in but not wired.

## Repository layout (current)

```
.
├─ platform-frontend/   # React + Vite + TS — admin SPA (desktop-first)
├─ platform-backend/    # CodeIgniter 4 — API (platform + tenant + public)
├─ infra/
│  └─ Dockerfile.web    # php:8.4-apache + intl/pdo_mysql + CI4 docroot
├─ docs/                # architecture, scope, separation docs
├─ docker-compose.yml   # web (CI4) + db (MySQL) + phpmyadmin
├─ CLAUDE.md
└─ README.md
```

**Planned additions (not yet created):**

- `public-web/` — React runtime that renders all generated sites (read site config by host at runtime)
- `generator/` — server-side site scaffolding (templates, engine, initial content)
- `packages/` — shared UI / contracts / site-template definitions
- `database/` — migrations & seeds (will live under `platform-backend/app/Database/` per CI4 convention)

The CI4 app's web root is `platform-backend/public/`; Apache's DocumentRoot is set there by [infra/Dockerfile.web](infra/Dockerfile.web).

## Ground rules when writing code

- **Every tenant-scoped query MUST include `site_id`**. No global queries that fan across tenants except in explicit platform-admin endpoints.
- **Don't couple generated-site code to one tenant**. `public-web` reads site config by host/subdomain at runtime; site-specific logic lives in data, not code.
- **Reservation notifications are a hook, not a call**. Emit a domain event on status change; leave the notification dispatcher unimplemented in MVP.
- **Admin UI is desktop-only**. Don't spend effort on mobile layouts.
- **Thin controllers, service layer for business logic** in CI4. Controllers translate HTTP ↔ service calls; models are data access only.
- **JSON response shape is standardized**: `{ ok: boolean, data?, error?: { code, message, details? } }`. All endpoints conform.
- **Auth**: RBAC with roles (owner, admin, editor, viewer, plus platform-level super-admin). Site-level permission checks are middleware, not per-endpoint ad-hoc.

## Not in MVP (explicitly deferred)

- Kakao / email / SMS notifications
- Custom domain SSL automation
- Dedicated-DB tenant provisioning
- Mobile-optimized admin
- Template marketplace / paid templates
- Billing / Stripe integration

## Docs to consult

- [docs/architecture.md](docs/architecture.md) — system structure, tenancy model, generation flow
- [docs/mvp-scope.md](docs/mvp-scope.md) — what ships in v1, what doesn't, cut lines
- [docs/frontend-backend-separation.md](docs/frontend-backend-separation.md) — which layer owns what
