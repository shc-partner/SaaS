# Service Lifecycle Policy (초안)

> ⚠️ **본 문서는 초안입니다.** 실제 적용 전 법무·운영 검토 필수.

고객 사이트의 생애주기를 정의한다. 모든 단계는 코드 상의 사이트 상태(`site.status`)와 1:1로 매핑되어야 한다.

## 사이트 상태 정의 (제안)

| status | 의미 | 공개 노출 | 관리자 접근 | 데이터 보존 |
|---|---|---|---|---|
| `pending` | 가입 직후, 사이트 미생성 | × | 일부 | 보존 |
| `active` | 정상 운영 | ○ | ○ | 보존 |
| `suspended` | 약관 위반·결제 실패 등 운영자 일시 중지 | × | 읽기 전용 | 보존 |
| `grace` | 해지 요청 후 유예 기간 | × | 읽기·export | 보존 |
| `terminated` | 유예 종료, 운영 데이터 삭제 완료 | × | × | 최소 기록만 |
| `migrated` | dedicated stack으로 분리 완료 | (이전 stack에서) × | × | 이전됨 |

## 1. 가입 (Sign-up)
- 이메일·비밀번호(향후 OAuth) 기반
- 이용약관·개인정보처리방침 동의 필수 (동의 시각·버전 기록)
- 계정 생성 시점에 사이트는 미존재. `users` 행만 생성

## 2. 사용 개시 (Activation)
- 이메일 인증(권장, MVP 정책 결정 필요)
- 무료 플랜 즉시 사용 가능

## 3. 사이트 생성 (Site Creation)
- 위저드(유형 선택 → 옵션 → 기본 정보) → `sites` 행 생성, `status=active`
- 초기 콘텐츠·메뉴·페이지 자동 시드(generator)
- 생성 시점·생성자(user_id) 감사 기록

## 4. 운영 (Operation)
- 관리자가 콘텐츠·메뉴·예약·미디어 관리
- 모든 상태 변경은 `audit_logs` 기록
- 결제 플랜에 따른 사용량 한도 체크(MVP는 한도만 정의, 강제는 후속)

## 5. Export
- 고객은 운영 중 언제든 export 트리거 가능 (정책: 일정 주기 내 횟수 제한 가능)
- export 산출물: [export-and-migration-policy.md](export-and-migration-policy.md) 참조
- export는 운영을 중단시키지 않음

## 6. 해지 요청 (Cancellation Request)
- 고객 또는 운영자(약관 위반·결제 실패 시)가 트리거
- 즉시 `active → grace` 전환. **즉시 삭제 금지**
- 해지 사유·요청 시각·요청자 기록
- 고객에게 유예 기간·export 가능 사실 통지

## 7. 유예 기간 (Grace Period)
- 기본 권장: **30일** (약관에 명시. 법률 검토 필요)
- 사이트 공개 노출 중단 (`status=grace`)
- 관리자는 읽기 전용 + export 가능
- 결제 재개·해지 철회 시 `grace → active` 복귀 가능
- 유예 만료 7일 전·1일 전 알림(메일) 권장

## 8. 운영 중지 (Suspension)
- 사유: 약관 위반, 결제 실패, 보안 사고, 운영자 판단
- `active → suspended` 전환, 공개 노출 중단
- 고객에게 사유·해소 절차 통지
- 해소 시 `suspended → active`, 미해소 시 `suspended → grace → terminated`

## 9. 데이터 삭제 (Operational Data Deletion)
- 유예 종료 시: `grace → terminated`
- 운영 DB의 사이트 콘텐츠·미디어·예약 데이터 삭제 (site_id 스코프 일괄)
- 고객 계정은 다른 사이트 보유 여부에 따라 별도 처리
- 삭제 시각·실행자(자동 잡 vs. 수동) 기록

## 10. 백업 만료 삭제 (Backup Expiration)
- 백업은 운영 DB와 분리된 보존 주기
- 기본 권장 보존: **운영 데이터 삭제 후 추가 30일** (총 ≤ 60일 from 해지)
- 만료 시 백업 매체에서 자동 삭제, 삭제 로그만 별도 보존
- 법적 보관 의무 데이터(거래 기록 등)는 예외 — [refund-cancellation-policy.md](refund-cancellation-policy.md) 참조

## 11. Dedicated Stack 분리 (Migration to Dedicated)
- 트리거: 고객 요청 + 플랜 업그레이드 또는 운영자 판단(부하·격리 요구)
- 절차 요약:
  1. 대상 사이트 사전 export 스냅샷 생성
  2. dedicated DB 또는 dedicated Docker stack 프로비저닝
  3. 데이터 이전(스키마+데이터+미디어) 및 검증
  4. 라우팅 전환(connection resolver 매핑 변경)
  5. 기존 shared 데이터는 일정 유예 후 삭제
- 상세: [export-and-migration-policy.md](export-and-migration-policy.md)
- 결과: `status=migrated`

## 12. 관리자(운영자)와 고객의 책임 구분

| 영역 | 운영자(SaaS 제공자) | 고객 |
|---|---|---|
| 인프라 가용성·백업 | ○ | × |
| 코드·플랫폼 보안 | ○ | × |
| 사이트 콘텐츠 적법성 | × | ○ |
| 콘텐츠 저작권 | × | ○ |
| 사용자 정보 입력 정확성 | × | ○ |
| 약관 위반 모니터링 | ○ | — |
| 해지 요청·export 책임 | 절차 제공 | 시점 결정·다운로드 |
| Export 후 자체 운영 | × | ○ |
| 유예·삭제 통지 | ○ | 수신·확인 |

## 정책 트레이드오프 (요약)

**유예 + export + 단계 삭제 정책의 장점**
- 고객 데이터 보호·신뢰 확보
- 해지 후 분쟁(잘못된 클릭, 자동 갱신 누락) 회복 가능
- 법적 분쟁·감사 시 방어 가능

**단점·리스크**
- 운영 비용 증가(스토리지·관리)
- 악의적 고객의 데이터 잔존 우려 → 명확한 보존 기간·삭제 보장 필요
- GDPR 등 "잊혀질 권리"와 충돌 가능 → 즉시 삭제 요청 별도 절차 필요
