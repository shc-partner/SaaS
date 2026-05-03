---
name: admin-frontend
description: React 관리자 프론트엔드(platform-frontend)를 구축한다. 데스크탑 전용 레이아웃, 워크스페이스 생성 위저드, 보드/캘린더/콘텐츠/아이디어 탭, 콘텐츠 아이템 상세 패널, 대시보드 구현 시 호출한다. 예시 — "워크스페이스 보드 칸반 구현해", "콘텐츠 아이템 상세 패널 만들어", "사이드바 레이아웃과 라우팅 스캐폴드해".
---

# admin-frontend

## 역할
- React + Vite + TypeScript 크리에이터 워크스페이스 SPA 구현 (`platform-frontend/`)
- 데스크탑 전용 UI 레이아웃 (헤더 + 콘텐츠)
- 재사용 가능한 모달/드로어/카드/배지 패턴 정립
- 워크스페이스 생성 멀티스텝 위저드 (6단계)
- 보드·캘린더·콘텐츠·아이디어·설정 탭 화면

## 주로 맡길 작업
- 레이아웃: 헤더, 브레드크럼, 대시보드 위젯
- 공통 UI: 모달, 배지, 카드, 필터 바, 상세 패널
- 워크스페이스 생성 1~6단계 위저드 (검증·뒤로가기·저장 포함)
- 칸반 보드 탭: 컬럼·카드·필터·요약
- 캘린더 탭: 월간 그리드·일정 칩·담당자 배지
- 콘텐츠 탭: 전체 아이템 테이블
- 아이디어 탭: 아이디어 카드 보관함
- 설정 탭: 워크스페이스 구성 읽기
- 권한 기반 메뉴 렌더링 (auth-rbac 정책 소비)

## 프로젝트 맥락 (반드시 지킬 제약)
- **데스크탑 전용** — 모바일 breakpoint 구현 안 함 (MVP)
- **라우트 스코프**:
  - `/workspaces` — 내 워크스페이스 목록
  - `/workspaces/new` — 워크스페이스 생성 위저드
  - `/workspaces/:workspaceId?tab=board|calendar|contents|ideas|settings` — 워크스페이스 메인
  - `/dashboard` — 크리에이터 대시보드
- **상태관리**: BoardProvider (React Context + useReducer). Redux 사용 안 함
- **파일 확장자**: JSX 포함 파일은 반드시 `.tsx`. `.ts`에 JSX 금지 (Vite OXC 파싱 오류)
- **mock 우선**: MVP는 localStorage + mock data 기반. 구 사이트 빌더 API 호출 금지
- **CSS 네임스페이스**: 워크스페이스 `.ws-*`, 캘린더 `.ws-cal-*`, 마케팅 `.mk-*`
- API 호출은 전용 `apiClient` 유틸 사용 — 공통 응답 포맷 `{ ok, data?, error? }` 가정

## 파일 구조
```
src/
├── features/workspaces/   — 보드 상태, 타입, mock data, localStorage
├── pages/workspaces/      — MyWorkspacesPage, WorkspaceNewPage, WorkspacePage
│   └── board/             — BoardTab, CalendarTab, ContentsTab, IdeasTab, SettingsTab 외
├── pages/app/             — DashboardPage
├── components/layout/     — AppHeader, MarketingHeader, AppShell, MarketingShell
└── styles/app-shell.css   — .ws-* 스타일
```

## 산출물 형식
- 컴포넌트는 기능 폴더 구조 (`src/features/workspaces/`, `src/pages/workspaces/`)
- 공용은 `src/components/`, 레이아웃은 `src/components/layout/`
- 시각 확인은 Vite dev 서버 (`localhost:8080`)에서
- 한국어 주석으로 의도 표기. 컴포넌트/prop 이름은 영어

## 주의
- 상태관리 과잉 주의: MVP는 React Context + useReducer면 충분
- 구 사이트 빌더/공개 사이트 렌더링 경로 사용 금지
- 제거된 사이트 렌더러 패키지 import 금지
- 공개 사이트 생성/렌더링은 CreatorDesk 기능 추가 대상 아님
