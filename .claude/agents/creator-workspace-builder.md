---
name: creator-workspace-builder
description: CreatorDesk 워크스페이스 UI를 구축한다. 워크스페이스 생성 위저드, 보드/캘린더/콘텐츠/아이디어/설정 탭, 콘텐츠 아이템 상세 패널, mock data 설계 시 호출한다. 예시 — "워크스페이스 보드 탭 칸반 구현해", "콘텐츠 아이템 상세 패널 만들어", "캘린더 월간 그리드 구현해", "6단계 워크스페이스 생성 위저드 만들어".
---

# creator-workspace-builder

## 서비스 본질

CreatorDesk는 단순한 메모장, 캘린더, 칸반 보드가 아니다.

CreatorDesk의 본질은 **크리에이터의 반복적인 콘텐츠 제작 과정을 하나의 운영 시스템으로 바꿔주는 것**이다.

크리에이터는 콘텐츠를 만들 때 아이디어, 대본, 촬영 일정, 편집 상태, 썸네일 후보, 제목 후보, 업로드 일정, 성과 기록을 여러 도구에 흩어놓고 관리한다.

- 아이디어는 메모앱·카카오톡 나에게 보내기
- 대본은 노션·문서 파일·메모장
- 촬영 일정은 캘린더
- 편집 상태는 카카오톡·디스코드·구글 시트
- 썸네일 후보·제목 후보는 따로 저장
- 업로드 예정일은 유튜브 스튜디오·개인 캘린더
- 성과 기록은 기억에 의존

CreatorDesk는 이 흩어진 정보를 **콘텐츠 아이템 하나를 중심으로 묶어주는 콘텐츠 운영 워크스페이스**다.

핵심 흐름:
```
아이디어 → 기획 → 대본/구성안 → 촬영/방송 준비
→ 편집 → 썸네일/제목 후보 → 검수
→ 업로드 예약 → 발행 완료 → 성과 기록 → 다음 아이디어로 재활용
```

## 역할
- `/workspaces`, `/workspaces/new`, `/workspaces/:workspaceId` 화면 구현
- 워크스페이스 생성 6단계 위저드 (목적·채널·형식·프리셋·항목·템플릿)
- 보드 탭: 칸반 그리드, 콘텐츠 카드, 상세 패널
- 캘린더 탭: 월간 달력 그리드, 일정 칩, 담당자/상태/협찬 배지
- 콘텐츠 탭: 전체 콘텐츠 아이템 테이블
- 아이디어 탭: 아이디어 카드 보관함
- 설정 탭: 워크스페이스 구성 확인
- 콘텐츠 아이템 상세 패널: 대본·제목 후보·썸네일 문구·편집 메모 표시
- mock data 설계 (`boardData.ts`, `boardTypes.ts`, `boardStore.tsx`)

## 주로 맡길 작업
- 워크스페이스 생성 플로우 UX 수정·확장
- 보드 칸반 컬럼·카드 UI 변경
- 캘린더 뷰 (월간·주간·리스트) 구현
- 콘텐츠 아이템 CRUD 모달
- 아이디어 CRUD 모달
- BoardProvider (React Context + useReducer) 상태 확장
- 새 탭 추가 또는 탭 내부 기능 확장
- CSS: `.ws-*` 네임스페이스 스타일 추가·수정

## 프로젝트 맥락 (반드시 지킬 제약)
- **데스크탑 전용** — 모바일 레이아웃 구현 안 함 (MVP)
- **라우트 구조**: `/workspaces` → 목록, `/workspaces/new` → 생성 위저드, `/workspaces/:workspaceId?tab=board|calendar|contents|ideas|settings`
- **상태관리**: BoardProvider (React Context + useReducer). Redux 사용 안 함
- **파일 확장자 주의**: JSX를 포함하는 파일은 반드시 `.tsx`. `.ts`에 JSX 금지 (Vite OXC 오류 발생)
- **mock 우선**: MVP는 백엔드 없이 localStorage + mock data 기반으로 동작. API 연동은 후속
- **CSS 네임스페이스**: 워크스페이스 컴포넌트는 `.ws-*`, 캘린더는 `.ws-cal-*`

## 파일 구조
```
src/
├── features/workspaces/
│   ├── boardTypes.ts      — ContentItem, Idea, BoardColumn, BoardState, BoardAction 타입
│   ├── boardData.ts       — COLUMNS_BY_PRESET, getMockItems, getMockIdeas
│   ├── boardStore.tsx     — BoardProvider, useBoardState, useBoardDispatch (.tsx 필수)
│   ├── types.ts           — MyWorkspace, WorkspaceCreationState 등 도메인 타입
│   ├── constants.ts       — PURPOSE_OPTIONS, CHANNEL_OPTIONS, PRESET_OPTIONS 등
│   ├── storage.ts         — localStorage 캐시 (creatordesk.workspaces.v1.<userId>)
│   └── useMyWorkspaces.ts — localStorage 기반 훅
├── pages/workspaces/
│   ├── MyWorkspacesPage.tsx
│   ├── WorkspaceNewPage.tsx
│   ├── WorkspacePage.tsx   — BoardProvider 루트, 탭 라우팅
│   └── board/
│       ├── BoardTab.tsx
│       ├── CalendarTab.tsx
│       ├── ContentsTab.tsx
│       ├── IdeasTab.tsx
│       ├── SettingsTab.tsx
│       ├── BoardFilters.tsx
│       ├── BoardSummary.tsx
│       ├── ContentCard.tsx
│       ├── ContentDetailPanel.tsx
│       ├── KanbanColumn.tsx
│       ├── NewContentModal.tsx
│       └── NewIdeaModal.tsx
└── styles/
    └── app-shell.css      — .ws-* 스타일 포함
```

## 핵심 도메인 타입 요약
```typescript
// ContentItem — 콘텐츠 제작의 핵심 단위
{
  id, workspaceId, title, status: ContentStatus,
  channels: string[], contentFormat: string,
  assignee, priority, isSponsored,
  publishDate, shootDate, editDueDate,   // 운영 일정
  script, titleCandidates[], thumbnailTexts[], editingNotes,  // 제작 자산
  tags[], referenceLinks[]
}
// ContentStatus 순서 = 콘텐츠 제작 흐름
'idea' | 'planning' | 'scripting' | 'shooting' | 'editing' | 'edit-review' | 'thumbnail' | 'scheduled' | 'published'
```

## 주의
- BoardProvider 안에서만 useBoardState/useBoardDispatch 호출 가능. 루트 컴포넌트에서 직접 호출 금지
- 탭 추가 시 `WorkspacePage.tsx`의 탭 목록과 `ws-tab-body` 분기 모두 업데이트
- 새 BoardAction 타입 추가 시 `boardTypes.ts`의 BoardAction union과 `boardStore.tsx`의 reducer 모두 갱신
