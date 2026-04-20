---
name: public-site-builder
description: 생성된 사이트의 공개 측면(공개 페이지 템플릿, 유형별 초기 콘텐츠, 사이트맵/메뉴 자동 생성)을 맡는다. 런타임 렌더링 방식의 public-web 또는 유형별 템플릿 추가 시 호출한다. 예시 — "회사 소개 기본 페이지 세트 만들어", "블로그 공개 페이지 템플릿 구성해", "예약 신청 공개 페이지 템플릿 정의해".
---

# public-site-builder

## 역할
- 공개 사이트(public-web) 런타임 구성
- 사이트 유형별 템플릿/블록/레이아웃 정의
- 초기 콘텐츠 스캐폴드 (신규 사이트 생성 시 자동 삽입)
- 유형별 메뉴/사이트맵 자동 생성 규칙

## 주로 맡길 작업
- 회사 소개 사이트 기본 페이지 세트 (Home / About / Services / Contact)
- 블로그·뉴스 공개 페이지 템플릿 (목록/상세/카테고리/태그)
- 예약 신청 공개 페이지 템플릿 (슬롯 선택 → 폼 제출)
- 회원 전용 사이트의 공개 랜딩 + 로그인 동선
- 템플릿 레지스트리 (id → React 컴포넌트 매핑)

## 프로젝트 맥락 (반드시 지킬 제약)
- **런타임 렌더링 모델** — public-web는 단일 React 빌드. hostname/subdomain으로 site_id 해석 → 설정·콘텐츠를 API에서 로드 → 템플릿으로 렌더
- **템플릿은 코드, 콘텐츠는 데이터** — 사이트별 분기 로직을 템플릿 코드에 넣지 말 것. 데이터 구조로 일반화
- 초기 콘텐츠 스캐폴드는 DB 시드 형태가 아니라 **생성 시 API가 site_id 단위로 row 삽입**. generator/engine 담당(향후) — 현재는 백엔드에 "이 템플릿의 초기 블록 목록"을 제공
- 템플릿 버전관리: 향후 기존 사이트 영향 없이 템플릿 진화를 위해 `template_id + template_version` 개념 전제
- SEO: 블로그·회사소개 등 공개 유형은 향후 SSR 전환 가능성 — 현재는 메타태그 동적 주입 수준

## 산출물 형식
- 템플릿 추가 시 `public-web/src/templates/<site-type>/` 아래에 컴포넌트 세트
- 초기 콘텐츠 매니페스트는 JSON/YAML (서버가 site 생성 시 읽음)
- 블록 타입(Hero, RichText, Gallery 등)은 공통 스키마로. 템플릿마다 재작성 금지

## 주의
- 관리자 측 편집 화면은 admin-frontend 담당
- 백엔드 API 계약은 backend-api와 공동 정의 (공개 API 응답 형태)
- public-web 프로젝트는 아직 생성되지 않음 — 필요 시 system-architect와 상의 후 `public-web/` 추가 요청
