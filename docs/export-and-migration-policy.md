# Export & Migration Policy (초안)


## 1. Export 정책의 위치
이 SaaS는 **반-lock-in**을 핵심 가치로 한다. 고객은 사이트를 자신의 자산으로 인식하고, 언제든 자기 인프라로 이전할 수 있다.

## 2. 고객 export 가능 범위

| 항목 | 포함 여부 | 비고 |
|---|---|---|
| 사이트 컨텐츠(페이지, 블록, 메뉴) | ○ | site_id 스코프 전체 |
| 미디어 파일(이미지, 첨부) | ○ | 원본 그대로 |
| 사이트 설정(테마, 도메인 설정 등) | ○ | |
| 예약/문의 데이터 | ○ | 고객 PII 포함 — 처리 책임 이전 명시 |
| 사이트 회원 계정 | ○ (해시된 비밀번호) | 비밀번호 평문 export 불가 |
| 사이트 운영 통계 | △ | 집계만, 원본 로그 제외 |
| 다른 테넌트 데이터 | × | 절대 금지 |
| 플랫폼 운영 코드(SaaS 자체) | △ | 일반 공개 산출물만, 내부 도구 제외 |

## 3. Export 산출물 구성
표준 export zip 구조 (제안):

```
site-{slug}-{timestamp}.zip
├─ README.md                  # 이전 절차, 라이선스, 책임 안내
├─ frontend/                  # 공개 사이트용 React 앱 (런타임 또는 빌드 산출물)
│  ├─ src/
│  ├─ public/
│  └─ package.json
├─ backend/                   # plain PHP API 사본
│  ├─ src/
│  ├─ public/
│  └─ composer.json
├─ database/
│  ├─ schema.sql              # 스키마 DDL
│  └─ data.sql                # 해당 site_id 데이터만 dump
├─ media/                     # 업로드된 미디어 파일
├─ config/
│  ├─ .env.example            # 환경변수 템플릿
│  └─ site-config.json        # 사이트 메타·설정
└─ docker-compose.yml         # 자체 호스팅용 기본 stack
```

**원칙**
- 동일 export는 **다른 환경에서 docker compose up만으로 기동**되는 것이 목표
- 비밀정보(API 키, 외부 서비스 토큰)는 export에서 제거 또는 placeholder 처리
- 라이선스·저작권 표기 포함

## 4. Export 시점과 제한
- 트리거: 고객 관리자 페이지의 export 메뉴
- 빈도 제한(권장):
  - 무료 플랜: 월 N회 (수치는 비즈니스 결정 필요)
  - 유료 플랜: 무제한 또는 더 높은 한도
- 동시 1건 제한 (생성 중에는 새 요청 거부)
- 산출물 보관 기간(서버에 저장 시): **7일 후 자동 삭제** (다운로드 링크 만료)
- 해지 후 유예(`grace`) 기간 동안 export는 무료·우선 제공

## 5. Export 이후 고객 책임 범위
Export 산출물을 다운로드한 시점부터 다음은 **전적으로 고객 책임**:
- 자체 인프라의 보안·가용성·백업
- 데이터 보호 법규(개인정보처리방침, 쿠키, GDPR/PIPA 등) 준수
- 산출물 내 제3자 라이브러리 라이선스 준수
- 산출물의 추가 운영·업데이트(SaaS 본 업데이트와 무관)
- 사이트 회원·예약자의 PII 보호 책임 이전

## 6. Customer-owned Server 이전 절차 (초안)
1. **사전 점검**: 대상 서버에 Docker, MySQL, Node, PHP 환경 확인
2. **export**: 관리자 페이지에서 export 트리거 → zip 다운로드
3. **압축 해제 및 환경 설정**: `.env.example` 복사 → `.env` 작성
4. **DB 부팅**: `docker compose up -d db` → `database/schema.sql` 적용 → `data.sql` 적용
5. **백엔드 부팅**: `docker compose up -d backend`
6. **프런트엔드 빌드/배포**: `npm install && npm run build` (또는 dev 서버)
7. **도메인·SSL 설정**: 고객 자체 (Let's Encrypt 등)
8. **검증**: 공개 페이지·관리자 페이지 동작 확인
9. **DNS 전환**: 기존 SaaS 도메인 → 자체 서버
10. **SaaS 측 정리**: 이전 완료 확인 후 운영자에게 통지 → SaaS 측 사이트 `status=migrated` 또는 `terminated` 처리

> 운영자(SaaS)는 본 절차에 대한 **유료 마이그레이션 지원** 옵션을 별도 제공할 수 있음.

## 7. Dedicated DB / Dedicated Stack 승격 (내부 운영 절차 요약)

### 7.1 Dedicated DB (가벼운 격리)
- 사용처: 데이터량 증가, 노이즈 격리, 백업 주기 분리 요구
- 절차:
  1. 신규 DB 인스턴스(또는 같은 서버 내 별도 DB) 프로비저닝
  2. site_id 단위 dump → 신규 DB에 import
  3. 운영 중 차이 보정(증분 sync) 또는 짧은 다운타임 윈도우
  4. `connection resolver`에서 해당 site_id를 새 DB로 라우팅
  5. 기존 shared DB의 해당 site_id 데이터는 7일 검증 후 삭제

### 7.2 Dedicated Docker Stack (강한 격리)
- 사용처: 엔터프라이즈, 법규 요구(데이터 격리), 성능 격리
- 절차:
  1. 신규 stack(별도 web/db/storage 컨테이너) 프로비저닝
  2. export 산출물을 신규 stack에 부트스트랩
  3. 도메인 라우팅(리버스 프록시) 전환
  4. 검증 → 트래픽 컷오버
  5. 기존 stack의 해당 사이트 데이터 단계적 정리
- 결과: `site.status = migrated`, 별도 운영 그룹

## 8. 고객 통지·기록
- export 트리거·완료·다운로드는 모두 `audit_logs` 기록
- dedicated 승격은 시작·완료 시 고객·운영자 양쪽에 통지
- 승격 후 책임 경계(SLA·지원 범위)는 별도 계약으로 확정

## 9. Export·Migration의 제약
- 외부 API 키, 결제 토큰, 분석 도구 ID 등은 **고객이 직접 재발급**해야 함
- 검색엔진 색인·도메인 평판은 SaaS 측에서 이전 보장 불가
- 산출물 코드의 보안 패치는 자체 호스팅 시 고객 책임 (단, 일정 기간 보안 권고 메일 제공 가능)
