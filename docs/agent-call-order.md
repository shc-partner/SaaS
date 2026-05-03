# Agent Call Order (초안)

> 단계별로 어떤 에이전트를 어떤 순서로 호출하는지 정의한다. [agent-governance.md](agent-governance.md)와 함께 본다.

## 0. 일반 원칙
- **결정자 → 실행자 → 검토자** 순서를 지킨다.
- 같은 단계에서 결정자가 둘 이상 필요하면, 상위 결정자(planner > architect > domain)부터.
- 검토자(qa-reviewer, security-guard)는 항상 마지막. 검토 전에 임시 머지/배포 금지.

---

## 1. 프로젝트 시작 단계 (Bootstrapping)
**목표**: 무엇을 만들지·어떤 구조로 만들지 합의

```
1. product-planner             ← 비전·MVP 범위·사이트 유형·티어 경계
2. service-lifecycle-governor  ← 가입·해지·export·삭제 정책 골격
3. system-architect            ← 모듈 경계·테넌시 전략·생성 흐름
4. docs-maintainer             ← product-vision / mvp-scope / architecture 문서화
```

산출물: `docs/product-vision.md`, `docs/mvp-scope.md`(미작성 시 신설), `docs/architecture.md`, 정책 문서 7종

---

## 2. 구조 설계 단계 (Architecture)
**목표**: 큰 그림 → 모듈 단위 결정

```
1. system-architect            ← 모듈/계층/공통 엔진/생성기 흐름
2. auth-rbac                   ← 인증·권한 모델 결정 (역할/권한/스코프)
3. service-lifecycle-governor  ← site.status 머신을 코드 모델에 매핑 검증
4. docs-maintainer             ← architecture.md / frontend-backend-separation.md 갱신
```

규칙: db-designer는 **이 단계 후에 호출**. 권한 모델·테넌시 전략이 스키마에 영향을 줌.

---

## 3. DB 설계 단계 (Schema)
**목표**: 모든 도메인 엔티티의 스키마 확정

```
1. db-designer                 ← 공통 + 사이트별 확장 테이블
2. auth-rbac                   ← roles/permissions/site_members 검토
3. reservation-module          ← 예약 관련 테이블 검토
4. service-lifecycle-governor  ← site.status 컬럼·감사 로그 컬럼 검증
5. docs-maintainer             ← 스키마 ERD/마이그레이션 문서 갱신
```

규칙: backend-api는 **이 단계 후에 호출**. 마이그레이션 적용 전 스키마 확정 필수.

---

## 4. 구현 단계 (Implementation)

### 4.1 백엔드 먼저
```
1. backend-api                 ← 컨트롤러/서비스/리포지토리·공통 응답 포맷
2. auth-rbac                   ← 미들웨어·정책 헬퍼 구현
3. reservation-module          ← 예약 API·상태머신·이벤트 발행
```

### 4.2 프런트엔드 뒤
```
1. admin-frontend              ← 레이아웃·라우팅·공통 UI
2. admin-frontend              ← 사이트 생성 위저드 + CRUD 화면
3. admin-frontend (with reservation-module) ← 예약 관리 화면
```

규칙:
- 한 기능은 BE → FE 순. 동시 작업 시 API 계약(DTO/에러코드) 먼저 합의
- 새 엔드포인트는 auth-rbac 검토 거친 후 머지

---

## 5. 검수 단계 (Review)
**목표**: 머지/릴리스 직전 점검

```
1. qa-reviewer                 ← 요구사항·회귀·UI/API 정합성·권한 가드 누락
2. security-guard              ← 테넌트 격리·OWASP·비밀관리·업로드·감사 로그
3. (이슈 발견 시) 원래 담당 agent 호출 → 수정
4. docs-maintainer             ← 변경된 문서 동기화
```

규칙:
- 검토자는 코드 수정 금지. 이슈 분류만(차단/추적/완료)
- security-guard 차단 이슈는 backend-api/auth-rbac 중 해당 영역에 되돌려 보냄
- qa-reviewer 차단 이슈는 원 구현자에게 되돌려 보냄

---

## 6. 운영 정책 정리 단계 (Policy)
**목표**: 약관·개인정보·해지·환불·export 정책의 정합성 유지

```
1. service-lifecycle-governor  ← 생애주기 정책 변경 또는 신규 정책 도입 결정
2. product-planner             ← 정책이 제품 가치/UX 메시지와 충돌하는지 확인
3. docs-maintainer             ← terms / privacy / refund / lifecycle / export 문서 갱신
4. legal-review-checklist 갱신 ← 변호사 검토 항목 보강
```

규칙:
- 정책 변경은 코드 변경보다 먼저 문서화
- 변경 후 db-designer / backend-api / admin-frontend 의 영향(예: 새 status, 새 알림 트리거)을 확인하고 호출

---

## 7. 단계 간 호출 매트릭스 (요약)

| 단계 | 결정자 | 실행자 | 검토자 |
|---|---|---|---|
| 시작 | planner, lifecycle-governor, architect | — | — |
| 구조 | architect, auth-rbac | — | — |
| DB | db-designer | — | (auth-rbac, reservation, lifecycle-governor 검토) |
| 구현 BE | (architect, auth-rbac 결정 적용) | backend-api, reservation-module | — |
| 구현 FE | (planner UX 적용) | admin-frontend | — |
| 검수 | — | (수정 시 원 담당) | qa-reviewer, security-guard |
| 정책 | lifecycle-governor, planner | — | — |
| 마무리 | — | docs-maintainer | — |

---

## 8. 안티패턴

- ❌ **검토자가 직접 코드 수정**: 책임 경계 무너짐
- ❌ **planner와 lifecycle-governor가 동시에 정책 결정**: 권한 충돌
- ❌ **architect 없이 db-designer가 스키마 결정**: 테넌시 전제 누락 위험
- ❌ **backend-api가 권한 정책 임의 변경**: auth-rbac을 우회
- ❌ **admin-frontend가 API 계약 단독 결정**: BE/FE 동기화 깨짐
- ❌ **docs-maintainer가 정책/기술 결정**: 단순 동기화 역할 초과
