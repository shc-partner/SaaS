# platform-backend

SiteForge 플랫폼 API. **CI4 등 프레임워크를 사용하지 않는 plain PHP** 구조.

## 디렉터리

- `public/` — Apache docroot. `index.php` 가 모든 요청의 단일 진입점.
- `src/` — 애플리케이션 코드. PSR-4 (`SiteForge\\` → `src/`).
  - `Http/` — Router, Request, Response. JSON envelope `{ ok, data?, error? }` 통일.
  - `Db/Connection.php` — PDO 단일 인스턴스.
  - `Sites/` — 사이트 도메인 (Repository / Service / Controller).
  - `PublicSite/Controller.php` — 공개 슬러그 기반 조회.
- `config/db.php` — DB 자격증명 (환경변수 우선).
- `migrations/` — `*.sql` + `apply.php` (가벼운 러너).

## 실행

```bash
docker compose up -d
docker compose exec web php /var/www/html/migrations/apply.php
curl http://localhost:8080/api/health
```

## API (단계 1)

| Method | Path | 용도 |
|---|---|---|
| GET   | `/api/health`              | 헬스체크 |
| POST  | `/api/sites`               | 빌더 submit |
| GET   | `/api/sites/{id}`          | 어드민용 단건 조회 |
| GET   | `/api/public/sites/{slug}` | 공개 (public-web 용) |

응답: `{ ok: true, data: { site, features, pages, sections, publicUrl, adminUrl } }`.

## 앞으로

- 단계 2: `public-web/` 프로젝트가 `/api/public/sites/{slug}` 를 호출해 렌더.
- 단계 3: 어드민 인라인 편집 → `PATCH /api/sites/{id}/sections/{sectionId}`. `site-template/` 이관 패키지 골격.
