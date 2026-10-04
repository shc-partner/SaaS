// 운영 템플릿 정의 — 워크스페이스 생성 시 보드·캘린더·관리항목·샘플 데이터를 자동 구성한다.
// BoardColumn.id 는 ContentStatus 와 일치해야 한다.

import type { WorkspaceTemplateKey } from './types';
import type { BoardColumn, ContentItem, Idea } from './boardTypes';

export interface WorkspaceTemplate {
  id: WorkspaceTemplateKey;
  name: string;
  description: string;
  recommendedFor: string;
  badge?: string;
  icon: string;
  accentColor: string;
  columns: BoardColumn[];
  managementFields: string[];
  calendarEventTypes: string[];
  defaultTags: string[];
  sampleItems: Omit<ContentItem, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>[];
  sampleIdeas: Omit<Idea, 'id' | 'workspaceId' | 'createdAt'>[];
}

export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: 'youtube-channel',
    name: '유튜브 채널 운영',
    description: '영상 아이디어부터 대본·촬영·편집·썸네일·업로드까지 전 과정을 하나의 보드로 관리합니다.',
    recommendedFor: '영상 아이디어, 대본, 촬영, 편집, 업로드 일정을 관리하려는 유튜버',
    badge: '인기',
    icon: '▶',
    accentColor: '#ff4444',
    columns: [
      { id: 'idea',       label: '아이디어' },
      { id: 'planning',   label: '기획중' },
      { id: 'scripting',  label: '대본 작성' },
      { id: 'shooting',   label: '촬영' },
      { id: 'editing',    label: '작업중' },
      { id: 'edit-review',label: '편집 검수' },
      { id: 'thumbnail',  label: '썸네일 작업' },
      { id: 'scheduled',  label: '업로드 예약' },
      { id: 'published',  label: '배포 완료' },
    ],
    managementFields: ['대본 / 구성안', '제목 후보', '썸네일 문구', '촬영 체크리스트', '편집 메모', '업로드 예정일', '참고 링크', '성과 기록'],
    calendarEventTypes: ['촬영일', '편집 마감일', '썸네일 마감일', '업로드 예정일'],
    defaultTags: ['#유튜브', '#영상제작', '#편집'],
    sampleItems: [
      {
        title: '신작 게임 업데이트 리뷰',
        status: 'editing',
        channels: ['유튜브'],
        contentFormat: '리뷰',
        tags: ['#게임', '#리뷰', '#신작'],
        assignee: '', priority: 'high',
        isSponsored: true, publishDate: '', shootDate: '', editDueDate: '',
        script: '1. 인트로 — 업데이트 이전과 이후 비교\n2. 주요 변경사항 5가지\n3. 유저 반응 분석\n4. 총평',
        titleCandidates: ['신작 게임 업데이트 완벽 리뷰', '이 게임 진짜 달라졌다'],
        thumbnailTexts: ['업데이트 후 충격 변화', '전 vs 후'], editingNotes: '인트로 3초 컷 강조',
        referenceLinks: [],
      },
      {
        title: '2026년 생산성 앱 추천',
        status: 'planning',
        channels: ['유튜브'],
        contentFormat: '정보전달',
        tags: ['#생산성', '#앱추천', '#유용한앱'],
        assignee: '', priority: 'medium',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: ['2026 생산성 앱 TOP 7'], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
      {
        title: '구독자 Q&A 영상',
        status: 'idea',
        channels: ['유튜브'],
        contentFormat: '정보전달',
        tags: ['#QnA', '#구독자소통'],
        assignee: '', priority: 'low',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
    ],
    sampleIdeas: [
      {
        title: '게이밍 의자 1년 사용기',
        source: '댓글', priority: 'medium', tags: ['#장비', '#리뷰'],
        memo: '구독자 요청 많음. 실사용 경험 기반으로 제작', referenceLinks: [],
      },
      {
        title: '이 게임 왜 망했나? 분석',
        source: '트렌드', priority: 'high', tags: ['#게임분석', '#흥행'],
        memo: '흥행 실패 게임 3개 비교 분석', referenceLinks: [],
      },
      {
        title: '스트리밍 셋업 공개',
        source: '자체기획', priority: 'medium', tags: ['#셋업', '#장비'],
        memo: '방 정리 후 촬영 예정', referenceLinks: [],
      },
    ],
  },

  {
    id: 'streaming',
    name: '라이브 스트리밍 방송 운영',
    description: '방송 일정, 컨텐츠 주제, 클립 아이디어, 다시보기 편집을 체계적으로 관리합니다.',
    recommendedFor: '방송 일정, 클립 아이디어, 다시보기를 관리하려는 라이브 스트리밍',
    icon: '📡',
    accentColor: '#6441a5',
    columns: [
      { id: 'idea',      label: '방송 아이디어' },
      { id: 'planning',  label: '준비중' },
      { id: 'shooting',  label: '방송 완료' },
      { id: 'editing',   label: '클립 편집' },
      { id: 'thumbnail', label: '다시보기 편집' },
      { id: 'scheduled', label: '업로드 예약' },
      { id: 'published', label: '업로드 완료' },
    ],
    managementFields: ['방송 주제', '라이브 일정', '클립 후보', '시청자 요청', '후원 / 협찬 메모', '다시보기 링크'],
    calendarEventTypes: ['라이브 방송일', '클립 편집 마감일', '다시보기 업로드일'],
    defaultTags: ['#스트리밍', '#라이브', '#클립'],
    sampleItems: [
      {
        title: '주말 랭크 게임 방송',
        status: 'planning',
        channels: ['트위치', '유튜브'],
        contentFormat: '게임방송',
        tags: ['#랭크', '#게임', '#라이브'],
        assignee: '', priority: 'high',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: ['주말 랭크 도전 라이브'], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
      {
        title: '시청자 참여 미션 방송',
        status: 'idea',
        channels: ['트위치'],
        contentFormat: '게임방송',
        tags: ['#참여', '#미션', '#소통'],
        assignee: '', priority: 'medium',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
      {
        title: '이번 주 하이라이트 클립',
        status: 'editing',
        channels: ['유튜브'],
        contentFormat: '게임방송',
        tags: ['#하이라이트', '#클립'],
        assignee: '', priority: 'medium',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '웃긴 장면 위주로 편집',
        referenceLinks: [],
      },
    ],
    sampleIdeas: [
      {
        title: '시청자와 함께하는 공포게임 방송',
        source: '시청자 요청', priority: 'high', tags: ['#공포', '#소통'],
        memo: '투표로 게임 선정', referenceLinks: [],
      },
      {
        title: '신규 게임 첫 플레이 리액션',
        source: '트렌드', priority: 'medium', tags: ['#신작', '#리액션'],
        memo: '', referenceLinks: [],
      },
    ],
  },

  {
    id: 'shortform',
    name: '쇼츠 / 릴스 제작',
    description: '짧은 영상의 반복 업로드 루틴을 유지하면서 훅, 자막, 트렌드 태그를 체계적으로 관리합니다.',
    recommendedFor: '쇼츠, 릴스, 틱톡 등 짧은 영상을 반복 제작하는 크리에이터',
    badge: '숏폼',
    icon: '⚡',
    accentColor: '#ff6b35',
    columns: [
      { id: 'idea',      label: '아이디어' },
      { id: 'planning',  label: '훅 작성' },
      { id: 'shooting',  label: '촬영' },
      { id: 'editing',   label: '편집·자막' },
      { id: 'scheduled', label: '예약됨' },
      { id: 'published', label: '배포 완료' },
    ],
    managementFields: ['3초 훅', '자막 문구', '반복 시청 포인트', '트렌드 태그', '업로드 채널', '제목 후보'],
    calendarEventTypes: ['촬영일', '편집 마감일', '업로드 예정일', '반복 업로드 일정'],
    defaultTags: ['#쇼츠', '#릴스', '#숏폼'],
    sampleItems: [
      {
        title: '3초 만에 이해하는 생산성 팁',
        status: 'editing',
        channels: ['유튜브'],
        contentFormat: '정보전달',
        tags: ['#생산성', '#팁', '#쇼츠'],
        assignee: '', priority: 'high',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '훅: "하루 1시간을 아끼는 방법"',
        titleCandidates: ['생산성 팁 30초'], thumbnailTexts: ['하루 1시간 절약'], editingNotes: '자막 강조색 적용',
        referenceLinks: [],
      },
      {
        title: '이번 주 밈 활용 쇼츠',
        status: 'planning',
        channels: ['기타'],
        contentFormat: '정보전달',
        tags: ['#밈', '#트렌드', '#쇼츠'],
        assignee: '', priority: 'medium',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
      {
        title: 'Before / After 편집 영상',
        status: 'idea',
        channels: ['유튜브'],
        contentFormat: '튜토리얼',
        tags: ['#편집', '#변화', '#숏폼'],
        assignee: '', priority: 'low',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
    ],
    sampleIdeas: [
      {
        title: '요즘 유행하는 챌린지 참여',
        source: '트렌드', priority: 'high', tags: ['#챌린지', '#트렌드'],
        memo: '빠른 업로드 필요', referenceLinks: [],
      },
      {
        title: '하루 루틴 모닝 쇼츠',
        source: '자체기획', priority: 'medium', tags: ['#루틴', '#일상'],
        memo: '', referenceLinks: [],
      },
    ],
  },

  {
    id: 'blog-newsletter',
    name: '블로그 / 뉴스레터 운영',
    description: '글감 수집, 초안 작성, SEO 키워드 관리, 배포 일정을 체계적으로 운영합니다.',
    recommendedFor: '글감, 초안, 배포 일정, SEO 키워드를 관리하려는 블로거·뉴스레터 운영자',
    icon: '✍',
    accentColor: '#2d9a4e',
    columns: [
      { id: 'idea',      label: '글감' },
      { id: 'planning',  label: '자료 조사' },
      { id: 'scripting', label: '초안 작성' },
      { id: 'editing',   label: '편집·교정' },
      { id: 'scheduled', label: '예약됨' },
      { id: 'published', label: '배포 완료' },
    ],
    managementFields: ['제목 후보', 'SEO 키워드', '목차', '참고 링크', '초안', '배포일', '카테고리'],
    calendarEventTypes: ['초안 마감일', '편집 마감일', '배포 예정일'],
    defaultTags: ['#블로그', '#뉴스레터', '#글쓰기'],
    sampleItems: [
      {
        title: '크리에이터를 위한 컨텐츠 루틴 만들기',
        status: 'scripting',
        channels: ['기타'],
        contentFormat: '정보전달',
        tags: ['#크리에이터', '#루틴', '#컨텐츠'],
        assignee: '', priority: 'high',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '# 컨텐츠 루틴의 중요성\n## 주간 루틴 설계\n## 도구 추천\n## 마무리',
        titleCandidates: ['크리에이터 컨텐츠 루틴 완벽 가이드'], thumbnailTexts: [], editingNotes: 'SEO: 크리에이터 루틴, 컨텐츠 계획',
        referenceLinks: [],
      },
      {
        title: '이번 주 뉴스레터 초안',
        status: 'planning',
        channels: ['기타'],
        contentFormat: '뉴스·시사',
        tags: ['#뉴스레터', '#주간'],
        assignee: '', priority: 'medium',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
      {
        title: '검색 유입을 늘리는 글쓰기 체크리스트',
        status: 'idea',
        channels: ['기타'],
        contentFormat: '정보전달',
        tags: ['#SEO', '#글쓰기', '#검색최적화'],
        assignee: '', priority: 'medium',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
    ],
    sampleIdeas: [
      {
        title: '올해 읽은 책 추천 TOP 10',
        source: '자체기획', priority: 'medium', tags: ['#독서', '#추천'],
        memo: '연말 기획 컨텐츠', referenceLinks: [],
      },
      {
        title: '블로그 수익화 6개월 후기',
        source: '독자요청', priority: 'high', tags: ['#수익화', '#후기'],
        memo: '실제 데이터 포함', referenceLinks: [],
      },
    ],
  },

  {
    id: 'brand-team',
    name: '브랜드 컨텐츠 팀 운영',
    description: '캠페인, 담당자, 검수, 채널별 배포 상태를 팀 단위로 관리합니다.',
    recommendedFor: '캠페인·담당자·검수·채널별 배포 상태를 관리하는 브랜드·마케팅 컨텐츠 팀',
    badge: '팀용',
    icon: '🏢',
    accentColor: '#3b6ef6',
    columns: [
      { id: 'idea',        label: '아이디어' },
      { id: 'planning',    label: '기획중' },
      { id: 'shooting',    label: '제작중' },
      { id: 'editing',     label: '작업중' },
      { id: 'edit-review', label: '검수중' },
      { id: 'scheduled',   label: '예약됨' },
      { id: 'published',   label: '배포 완료' },
    ],
    managementFields: ['캠페인명', '담당자', '검수자', '채널', '협찬 여부', '마감일', '피드백 메모', '성과 기록'],
    calendarEventTypes: ['제작 마감일', '검수 마감일', '캠페인 배포일', '협찬 마감일'],
    defaultTags: ['#브랜드', '#캠페인', '#마케팅'],
    sampleItems: [
      {
        title: '5월 브랜드 캠페인 영상',
        status: 'editing',
        channels: ['유튜브'],
        contentFormat: '정보전달',
        tags: ['#캠페인', '#5월', '#브랜드'],
        assignee: '김팀장', priority: 'high',
        isSponsored: true, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '브랜드 가이드라인 색상 적용 필수',
        referenceLinks: [],
      },
      {
        title: '인스타그램 릴스 광고 소재',
        status: 'edit-review',
        channels: ['기타'],
        contentFormat: '정보전달',
        tags: ['#릴스', '#광고', '#소재'],
        assignee: '이디자이너', priority: 'high',
        isSponsored: true, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '광고 심의 필요',
        referenceLinks: [],
      },
      {
        title: '신제품 출시 컨텐츠 패키지',
        status: 'planning',
        channels: ['유튜브', '기타'],
        contentFormat: '정보전달',
        tags: ['#신제품', '#런칭', '#멀티채널'],
        assignee: '', priority: 'high',
        isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
        script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
        referenceLinks: [],
      },
    ],
    sampleIdeas: [
      {
        title: '브랜드 스토리 시리즈 기획',
        source: '자체기획', priority: 'medium', tags: ['#브랜드스토리', '#시리즈'],
        memo: '3부작으로 구성 검토', referenceLinks: [],
      },
      {
        title: '고객 후기 UGC 캠페인',
        source: '마케팅팀', priority: 'high', tags: ['#UGC', '#후기', '#고객참여'],
        memo: '해시태그 캠페인 연계', referenceLinks: [],
      },
    ],
  },
];

export function getTemplate(key: WorkspaceTemplateKey): WorkspaceTemplate | undefined {
  return WORKSPACE_TEMPLATES.find((t) => t.id === key);
}
