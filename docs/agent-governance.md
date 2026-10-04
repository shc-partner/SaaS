# Agent Governance (초안)

> 본 문서는 `.claude/agents/` 의 거버넌스 규칙이다. 에이전트를 추가/수정/제거할 때는 본 문서를 먼저 갱신한다.

## 1. 최종 에이전트 목록 (9개)

### 1.1 핵심 (Core, 6)
| 이름 | 한 줄 책임 |
|---|---|
| product-planner | 제품 방향·UX·MVP 범위·기능 우선순위의 단일 결정자 |
| system-architect | 전체 구조·모듈 경계·멀티테넌시 전략의 단일 결정자 |
| db-designer | MySQL 스키마·관계·인덱스·마이그레이션의 단일 결정자 |
| backend-api | plain PHP API 구현 (컨트롤러/서비스/리포지토리) |
| admin-frontend | React 데스크탑 관리자 UI 구현 |
| reservation-module | 예약 도메인(상태머신·이력·이벤트 훅) 전담 |

### 1.2 거버넌스 (Governance, 1)
| 이름 | 한 줄 책임 |
|---|---|
| service-lifecycle-governor | 가입·운영·해지·export·삭제·dedicated 분리까지 생애주기 정책의 단일 관리자 |

### 1.3 보조 (Support, 2)
| 이름 | 한 줄 책임 |
|---|---|
| auth-rbac | 인증·세션·RBAC·사이트별 권한의 설계+구현 |
| security-guard | 보안 검토·취약점 점검 (코드 수정 금지) |

### 1.4 문서/품질 (Quality, 2)
| 이름 | 한 줄 책임 |
|---|---|
| qa-reviewer | 요구사항·회귀·UI/API 정합성 검토 (수정 금지) |
| docs-maintainer | 문서 동기화 (코드↔README/CLAUDE.md/docs/) |

> 합계 11개로 보이지만, **실제 호출 빈도 기준 핵심은 6개**, 나머지는 단계별 보조다. 사용자가 "9개 핵심 체계"로 인식하는 것이 본 거버넌스의 의도.

## 2. 책임 범위와 분리 근거

### 2.1 product-planner — "무엇을, 왜"
- **할 일**: 요구사항·플로우·MVP 포함/제외·티어 경계 결정
- **하지 않을 일**: 시스템 구조 결정, 스키마/코드 작성, 정책 문서(약관/생애주기) 작성

### 2.2 system-architect — "어떻게(구조)"
- **할 일**: 모듈/계층/테넌시/생성 흐름 설계, 결정 문서화
- **하지 않을 일**: 코드 직접 작성(개념 PoC 제외), 스키마 직접 작성, 제품 범위 결정

### 2.3 db-designer — "데이터의 형태"
- **할 일**: 스키마·관계·인덱스·마이그레이션 작성
- **하지 않을 일**: 비즈니스 로직, API 컨트롤러, 화면

### 2.4 backend-api — "서버 동작"
- **할 일**: plain PHP API 코드, 미들웨어 집행, 응답 포맷
- **하지 않을 일**: 스키마 변경(요청은 db-designer로), 권한 정책 결정(요청은 auth-rbac로), 화면

### 2.5 admin-frontend — "관리자 화면"
- **할 일**: React 컴포넌트·라우팅·폼·테이블·위저드(데스크탑)
- **하지 않을 일**: API 계약 단독 결정, 권한 정책 결정, 모바일 최적화(MVP)

### 2.6 reservation-module — "예약 도메인"
- **할 일**: 예약 상태머신·이력·검색·이벤트 배포
- **하지 않을 일**: 알림 디스패처 구현, 권한 정책 결정, 일반 컨텐츠 CRUD

### 2.7 service-lifecycle-governor — "생애주기 정책"
- **할 일**: site.status 머신·유예·삭제·백업·dedicated 분리 정책의 정합성 유지, 정책 문서 ↔ 코드 동기화 검증
- **하지 않을 일**: 제품 기능 기획(planner 영역), 약관/개인정보 법률 판단(legal-review-checklist로 위임)

### 2.8 auth-rbac — "권한"
- **할 일**: 인증·세션·역할/권한 정책 + 미들웨어 구현
- **하지 않을 일**: 일반 보안 점검(security-guard), 컨텐츠 화면

### 2.9 security-guard — "보안 검토"
- **할 일**: OWASP, 테넌트 격리, 비밀관리, 업로드, 감사 로그 점검 — **리포트만**
- **하지 않을 일**: 코드 수정(수정은 원래 구현자 호출), 권한 정책 결정(auth-rbac)

### 2.10 qa-reviewer — "요구사항 검증"
- **할 일**: 요구사항/회귀/UI-API 정합성 점검 — **리포트만**
- **하지 않을 일**: 코드 수정, 보안 점검(security-guard), 정책 변경

### 2.11 docs-maintainer — "문서 동기화"
- **할 일**: 코드 변경 후 README/CLAUDE.md/docs/ 갱신
- **하지 않을 일**: 정책·기술 결정, 코드 수정

## 3. 무엇을 제거/병합했는가

| 처리 | 대상 | 이유 |
|---|---|---|
| **신설 안 함** | product-governor | product-planner와 책임 중복. 정책 거버넌스는 service-lifecycle-governor가 충분 |
| **제거** | public-site-builder | 별도 public-web 프로젝트 부재 상태. 책임은 admin-frontend(템플릿 컴포넌트) + backend-api(템플릿 데이터/시드) + system-architect(템플릿 구조 결정)로 분배 |

## 4. 최종 의사결정 우선순위

같은 사안에 대해 의견이 다를 때의 권한 우선순위:

```
제품 범위·플로우·UX           → product-planner       (최종)
구조·계층·테넌시·확장성       → system-architect     (최종)
스키마·인덱스·마이그레이션    → db-designer          (최종)
권한·인증 정책                → auth-rbac            (최종)
생애주기·해지·export·삭제 정책 → service-lifecycle-governor (최종)
구현 코드(BE)                 → backend-api          (실행)
구현 코드(FE)                 → admin-frontend       (실행)
예약 도메인 코드              → reservation-module   (실행)
보안 리포트                   → security-guard       (권고)
요구사항/회귀 리포트          → qa-reviewer          (권고)
문서                          → docs-maintainer      (스냅샷)
```

규칙:
- **결정자(최종) 1개 vs 실행자(실행) 1개**가 같은 영역에 동시에 있을 경우, 결정자가 우선
- security-guard / qa-reviewer는 **차단권 없음** — 권고와 이슈 등록만. 차단/수용 판단은 해당 영역 결정자가 함
- 정책-기술 충돌 시: service-lifecycle-governor의 정책을 코드/스키마로 반영 (정책이 우선)
- 정책-법률 충돌 가능 시: [legal-review-checklist.md](legal-review-checklist.md)로 에스컬레이트

## 5. 충돌 방지 규칙

1. **이중 결정 금지**: 같은 사안에 두 개 결정자가 동시에 호출되면, planner→architect→domain 순서로 우선
2. **검토자는 수정 금지**: security-guard, qa-reviewer는 코드/스키마/정책 수정 금지. 리포트로 원래 담당에게 위임
3. **문서가 곧 결정**: 결정자는 자기 영역 문서를 갱신해야 결정이 효력. 코드만 바꾸고 문서 안 바꾸면 docs-maintainer가 reject
4. **정책 드리프트 = 결함**: 약관/개인정보/생애주기 문서들 사이의 수치/용어 불일치는 service-lifecycle-governor가 정합성 검사

## 6. 갱신 절차

에이전트 추가/수정/제거 시:
1. 본 문서 §1, §2, §4 갱신
2. 영향받는 .claude/agents/*.md 수정
3. [agent-call-order.md](agent-call-order.md) 갱신 (호출 순서 변동 시)
4. CLAUDE.md의 관련 섹션 갱신
