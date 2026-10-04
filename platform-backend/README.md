# platform-backend

CreatorDesk 플랫폼 API. **프레임워크 없는 plain PHP** 구조.

## 디렉터리

- `public/` — Apache docroot. `index.php` 가 모든 요청의 단일 진입점.
- `src/` — 애플리케이션 코드. PSR-4 (`CreatorDesk\\` → `src/`).
  - `Http/` — Router, Request, Response. JSON envelope `{ ok, data?, error? }` 통일.
  - `Db/Connection.php` — PDO 단일 인스턴스.
  - `Workspaces/` — 워크스페이스 도메인 (Repository / Service / Controller).
  - `ContentItems/` — 컨텐츠 아이템 도메인 (상태 머신, 제작 자산).
  - `Ideas/` — 아이디어 보관함 도메인.
- `config/db.php` — DB 자격증명 (환경변수 우선).
- `migrations/` — `*.sql` + `apply.php` (가벼운 러너).

## 실행

```bash
docker compose up -d
docker compose exec web php /var/www/html/migrations/apply.php
curl http://localhost:8080/api/health
```

## API (MVP 이후 구현 예정)

| Method | Path | 용도 |
|---|---|---|
| GET    | `/api/health`                              | 헬스체크 |
| POST   | `/api/auth/login`                          | 로그인 |
| GET    | `/api/workspaces`                          | 워크스페이스 목록 |
| POST   | `/api/workspaces`                          | 워크스페이스 생성 |
| GET    | `/api/workspaces/{id}/content-items`       | 컨텐츠 아이템 목록 |
| POST   | `/api/workspaces/{id}/content-items`       | 컨텐츠 아이템 생성 |
| PATCH  | `/api/workspaces/{id}/content-items/{cid}` | 상태 변경·정보 수정 |
| GET    | `/api/workspaces/{id}/ideas`               | 아이디어 목록 |
| POST   | `/api/workspaces/{id}/ideas`               | 아이디어 저장 |

응답: `{ ok: true, data: { ... } }` / `{ ok: false, error: { code, message } }`.

## 참고

MVP 단계에서는 백엔드 없이 프론트엔드가 localStorage mock으로 동작한다.
실 API 전환은 MVP 이후 단계에서 진행한다.
