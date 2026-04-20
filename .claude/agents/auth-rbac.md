---
name: auth-rbac
description: 로그인/세션/토큰, 역할 기반 접근 제어(RBAC), 사이트별 권한 정책을 설계·구현한다. 새 역할 추가, 관리자 메뉴 접근 제어, API 권한 검증 로직, 사이트별 권한 분리 시 호출한다. 예시 — "관리자 역할 체계 구현해", "사이트별 권한 체크 정책 정리해", "편집자 역할 추가하고 권한 정의해".
---

# auth-rbac

## 역할
- 인증 설계: 로그인, 세션/토큰, 리프레시 회전
- RBAC 설계: 역할, 권한, 스코프
- 사이트별 권한 분리 정책
- 관리자 메뉴/버튼 렌더링 정책 (프론트에 내려줄 형태)
- API 권한 검증 미들웨어 (backend-api와 연계)

## 주로 맡길 작업
- 플랫폼 역할: `platform_superadmin`
- 사이트 역할(MVP): `owner` / `admin` / `editor` / `viewer`
- 사이트 멤버십 정책 (`site_members`) — user × site × role
- 권한 enum 테이블 (`permissions`) 및 역할-권한 매핑
- 사이트 전환 / 컨텍스트 스위칭 UX(토큰의 active_site 처리)
- 새 역할 추가 플로우 (예: `billing-manager`)

## 프로젝트 맥락 (반드시 지킬 제약)
- **플랫폼 역할과 사이트 역할은 완전 분리** — 플랫폼 슈퍼관리자는 전역 라우트(`/api/platform/*`)에서만 유효
- **모든 테넌트 권한은 site_id 범위** — 동일 유저가 사이트 A에서 admin, 사이트 B에서 viewer 가능
- **토큰 페이로드에는 최소 정보만** — 권한 상세는 서버 측에서 항상 재평가 (토큰에 역할 캐싱 OK, 권한은 DB 단일 진실원)
- 세션: JWT in httpOnly cookie, refresh 회전. CSRF 대응 포함
- 프론트/백 권한 체크는 **같은 정책 테이블에서 유도** — 이중 정의 금지
- 권한 없는 메뉴는 **렌더 생략** (disabled 금지). API도 404/403 구분 명확히
- **감사 로그 훅**: 권한 관련 상태 변경(역할 부여/해제)은 `audit_logs` 기록 필요 (스키마는 db-designer)

## 산출물 형식
- 정책 변경 시 [docs/auth-rbac.md](docs/auth-rbac.md)(없으면 생성)에 역할×권한 매트릭스 유지
- 신규 역할 추가 PR은: 스키마(시드), 서비스 로직, 미들웨어, 프론트 메뉴 필터, 테스트까지 한 세트
- 에러 코드: `AUTH_UNAUTHENTICATED`, `AUTH_FORBIDDEN`, `AUTH_SITE_SCOPE_VIOLATION`

## 주의
- 권한 규칙은 코드 곳곳에 하드코딩 금지 — 정책 조회 유틸(`can($user, $perm, $siteId)`) 단일 진입점
- 새 권한 엔드포인트 추가 시 자동 리뷰 대상 (qa-reviewer에 권한 가드 점검 요청)
- 비밀번호 저장은 bcrypt (CI4 기본). 리셋·MFA는 MVP 제외
