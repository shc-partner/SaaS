# CLAUDE.md

This file guides Claude Code (and any AI collaborator) when working in this repository. Keep it concise and current.

## Fixed Goal (Stage 1 — Export First)

A SaaS that lets a customer **generate a company-introduction website**. The customer's deliverable is a downloadable bundle they can run anywhere.

**Stage 1 success criteria** (this is the only thing that matters right now):
1. Customer signs up and runs a small wizard.
2. System generates a complete deliverable: **React frontend + plain PHP backend + MySQL schema/seed**.
3. Customer downloads the deliverable as a single archive (`.zip` or `.tar`).
4. Customer can run that archive on their own machine and see a working company website + minimal admin.

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
```

## Ground rules

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
