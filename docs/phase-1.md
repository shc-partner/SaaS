# Phase 1 — SaaS 진입 골격

> 본 문서는 [build-phases-aligned-with-ui-flow.md](build-phases-aligned-with-ui-flow.md)의
> **Phase 1**(UI 단계 1: SaaS 사이트 접속) 구현 결과를 기록한다.
>
> 가입·로그인은 보류하고, **사용자가 접속해 워크스페이스 만들기 흐름의
> 입구로 진입할 수 있는 최소 골격**까지만 구현한다.

## 1. 1단계 목표

- 사용자가 접속할 수 있는 SaaS 사이트의 최소 골격 제공
- React 프런트엔드(8080) ↔ plain PHP API(8081) ↔ MySQL(3306) ↔ phpMyAdmin(8082) 4서비스 동시 부팅
- 프런트엔드가 백엔드 헬스체크를 호출해 연결 상태를 화면에서 확인
- 랜딩 → "워크스페이스 만들기 시작" → 워크스페이스 유형 선택 placeholder 까지의 라우팅 동작

## 2. 현재 구현 범위

### 2.1 인프라
- `docker-compose.yml`
  - `frontend` (node:24-bookworm, 8080)
  - `backend` (php:8.3-apache, 8081, 빌드: `infra/Dockerfile.web`)
  - `db` (mysql:8.4, 3306)
  - `phpmyadmin` (8082)
- `infra/Dockerfile.web` — Apache + `pdo_mysql`/`mysqli`/`zip` + `mod_rewrite`, DocumentRoot=`public/`

### 2.2 platform-backend (plain PHP)
- 디렉터리 구조
  - `public/index.php` — 프런트 컨트롤러 + PSR-4 오토로더
  - `public/.htaccess` — 모든 요청을 `index.php`로
  - `src/Routing/Router.php` — 메서드+경로 → 핸들러 단순 라우터
  - `src/Support/Response.php` — 표준 JSON 엔벨롭 (`{ok, data}` / `{ok:false, error}`)
  - `src/Controllers/HealthController.php` — 헬스체크
  - `src/Services/.gitkeep` — 향후 비즈니스 로직 위치
- 엔드포인트
  - `GET /api/health` → `{ "ok": true, "data": { "status": "ok", "service": "platform-backend", "time": "..." } }`

### 2.3 platform-frontend (React + Vite)
- 라우팅
  - `/` 랜딩 (서비스명, 한 줄 설명, "워크스페이스 만들기 시작" CTA)
  - `/start` 시작 안내 화면 (다음 단계 안내)
  - `/sites/new/type` 워크스페이스 유형 선택 placeholder (기업 소개형 활성, 그 외 비활성 카드)
- 공통
  - 헤더에 `HealthBadge` — `/api/health` 호출 결과를 색 배지로 노출
  - Vite dev 서버가 `/api/*`를 backend 컨테이너로 프록시 (CORS 회피)

### 2.4 폴더
- `templates/` (.gitkeep) — Phase 5에서 사용
- `generated-apps/` (.gitkeep, gitignored) — 산출물 생성 작업 디렉터리 후보
- `docs/phase-1.md` — 본 문서

## 3. 아직 하지 않은 것 (Phase 1 의도적 제외)

- **가입 / 로그인 / 세션** — 인증은 후속 Phase로 분리
- **DB 사용** — Phase 1은 MySQL 컨테이너를 띄우기만 하고 PHP에서 쿼리하지 않음
- **워크스페이스 생성 Flow 본문** — `/sites/new/type` 이후 단계 화면 없음
- **워크스페이스 생성 엔진 / 패키저 / export** — Phase 5–8
- **관리자 화면 / 산출물 내부 기능** — Phase 6–7
- **테스트 자동화 / CI** — 별도 단계
- **디자인 시스템** — 기능 동작 우선

## 4. 로컬 실행

[README.md](../README.md) 참조.

## 5. 다음 단계로 가기 전 확인 사항

- `docker compose up`으로 4개 컨테이너가 모두 healthy 상태로 뜨는지
- `http://localhost:8080`에서 랜딩이 보이고 헤더의 API 배지가 "API 연결됨" 상태인지
- `http://localhost:8081/api/health`가 JSON 엔벨롭으로 200 응답하는지
- `http://localhost:8082` phpMyAdmin 로그인 가능 여부 (root/root1234)
- `/start` → `/sites/new/type` 라우팅 동작 여부
