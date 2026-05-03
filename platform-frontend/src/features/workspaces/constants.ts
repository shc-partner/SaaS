import type {
  ContentFormat,
  ManagementItem,
  ProductionPreset,
  WorkspaceChannel,
  WorkspacePurpose,
  WorkspaceTemplateKey,
} from './types';

export const PURPOSE_OPTIONS: ReadonlyArray<{
  id: WorkspacePurpose;
  label: string;
  desc: string;
}> = [
  { id: 'youtube', label: '유튜브', desc: '유튜브 채널 운영과 영상 콘텐츠 제작' },
  { id: 'streamer', label: '라이브 스트리밍', desc: '라이브 방송과 다시보기 콘텐츠 관리' },
  { id: 'other', label: '기타', desc: '다른 형태의 크리에이터 활동 관리' },
];

export const CHANNEL_OPTIONS: ReadonlyArray<{
  id: WorkspaceChannel;
  label: string;
}> = [
  { id: 'youtube', label: '유튜브' },
  { id: 'chzzk', label: '치지직' },
  { id: 'soop', label: '숲' },
  { id: 'twitch', label: '트위치' },
  { id: 'other', label: '기타' },
];

export const FORMAT_OPTIONS: ReadonlyArray<{
  id: ContentFormat;
  label: string;
}> = [
  { id: 'gaming', label: '게임방송' },
  { id: 'info', label: '정보전달' },
  { id: 'review', label: '리뷰/비교' },
  { id: 'vlog', label: '브이로그' },
  { id: 'news', label: '뉴스/시사' },
  { id: 'other', label: '기타' },
];

export const PRESET_OPTIONS: ReadonlyArray<{
  id: ProductionPreset;
  label: string;
  desc: string;
}> = [
  { id: 'simple', label: '간단형', desc: '혼자 빠르게 - 핵심 단계만 정리' },
  { id: 'standard', label: '표준형', desc: '기획부터 업로드까지 단계별 관리' },
  { id: 'team', label: '팀 협업형', desc: '담당자/검수/알림 포함' },
];

export const BASE_MANAGEMENT_ITEMS: ManagementItem[] = [
  'title',
  'status',
  'publishDate',
  'channel',
  'format',
  'priority',
  'tags',
  'memo',
];

export const PRODUCTION_MANAGEMENT_ITEMS: ManagementItem[] = [
  'thumbnail',
  'script',
  'shooting',
  'editing',
  'upload',
  'scheduled',
];

export const COLLABORATION_MANAGEMENT_ITEMS: ManagementItem[] = [
  'assignee',
  'reviewStatus',
  'feedbackMemo',
  'notification',
];

export const MANAGEMENT_ITEM_GROUPS: ReadonlyArray<{
  id: string;
  title: string;
  items: ReadonlyArray<{ id: ManagementItem; label: string }>;
}> = [
  {
    id: 'base',
    title: '기본 항목',
    items: [
      { id: 'title', label: '콘텐츠 제목' },
      { id: 'status', label: '콘텐츠 상태' },
      { id: 'publishDate', label: '업로드 예정일' },
      { id: 'channel', label: '활동 채널' },
      { id: 'format', label: '콘텐츠 형식' },
      { id: 'priority', label: '우선순위' },
      { id: 'tags', label: '태그' },
      { id: 'memo', label: '메모' },
    ],
  },
  {
    id: 'production',
    title: '제작 항목',
    items: [
      { id: 'thumbnail', label: '썸네일' },
      { id: 'script', label: '대본 / 구성안' },
      { id: 'shooting', label: '촬영 여부' },
      { id: 'editing', label: '편집 여부' },
      { id: 'upload', label: '업로드 여부' },
      { id: 'scheduled', label: '예약 발행 여부' },
    ],
  },
  {
    id: 'collaboration',
    title: '협업 항목',
    items: [
      { id: 'assignee', label: '담당자' },
      { id: 'reviewStatus', label: '검수 상태' },
      { id: 'feedbackMemo', label: '피드백 메모' },
      { id: 'notification', label: '알림 여부' },
    ],
  },
  {
    id: 'revenue',
    title: '수익 / 성과 항목',
    items: [
      { id: 'sponsored', label: '협찬 여부' },
      { id: 'sponsorBrand', label: '협찬사 / 브랜드' },
      { id: 'views', label: '조회수' },
      { id: 'avgViewers', label: '평균 시청자 수' },
    ],
  },
];

export const FORMAT_MANAGEMENT_ITEM_GROUPS: Partial<Record<ContentFormat, {
  title: string;
  items: ReadonlyArray<{ id: ManagementItem; label: string }>;
}>> = {
  gaming: {
    title: '게임방송 추천 항목',
    items: [
      { id: 'gameTitle', label: '게임명' },
      { id: 'platform', label: '플랫폼' },
      { id: 'streamTime', label: '방송 예정 시간' },
      { id: 'clipProduction', label: '클립 제작 여부' },
      { id: 'vodUpload', label: '다시보기 업로드 여부' },
    ],
  },
  info: {
    title: '정보전달 추천 항목',
    items: [
      { id: 'research', label: '자료 조사' },
      { id: 'sourceLinks', label: '출처 링크' },
      { id: 'referenceImages', label: '참고 이미지' },
      { id: 'reviewStatus', label: '검수 상태' },
    ],
  },
  review: {
    title: '리뷰/비교 추천 항목',
    items: [
      { id: 'productName', label: '제품명' },
      { id: 'comparisonTarget', label: '비교 대상' },
      { id: 'sponsored', label: '협찬 여부' },
      { id: 'purchaseLink', label: '구매 링크' },
      { id: 'prosConsMemo', label: '장단점 메모' },
    ],
  },
  vlog: {
    title: '브이로그 추천 항목',
    items: [
      { id: 'shootingLocation', label: '촬영 장소' },
      { id: 'shootingDate', label: '촬영일' },
      { id: 'brollCheck', label: 'B-roll 체크' },
      { id: 'musicBgm', label: '음악 / BGM' },
    ],
  },
  news: {
    title: '뉴스/시사 추천 항목',
    items: [
      { id: 'issueSource', label: '이슈 출처' },
      { id: 'publishDeadline', label: '발행 마감 시간' },
      { id: 'factCheck', label: '팩트 체크' },
      { id: 'sensitivity', label: '민감도' },
    ],
  },
};

export const ITEM_OPTIONS: ReadonlyArray<{ id: ManagementItem; label: string }> = [
  ...MANAGEMENT_ITEM_GROUPS.flatMap((group) => group.items),
  ...Object.values(FORMAT_MANAGEMENT_ITEM_GROUPS).flatMap((group) => group?.items ?? []),
];

export const PRESET_RECOMMENDED_ITEMS: Record<ProductionPreset, ManagementItem[]> = {
  simple: BASE_MANAGEMENT_ITEMS,
  standard: [...BASE_MANAGEMENT_ITEMS, ...PRODUCTION_MANAGEMENT_ITEMS],
  team: [
    ...BASE_MANAGEMENT_ITEMS,
    ...PRODUCTION_MANAGEMENT_ITEMS,
    ...COLLABORATION_MANAGEMENT_ITEMS,
  ],
};

export const TEMPLATE_OPTIONS: ReadonlyArray<{
  id: WorkspaceTemplateKey;
  label: string;
  desc: string;
}> = [
  { id: 'creator-simple', label: '간단형', desc: '핵심 단계만 정리하는 개인 운영 템플릿' },
  { id: 'creator-standard', label: '표준형', desc: '기획부터 업로드까지 단계별 관리' },
  { id: 'creator-team', label: '팀 협업형', desc: '담당자, 검수, 알림을 포함한 팀 운영' },
  { id: 'youtube-channel', label: '유튜브 채널 운영', desc: '기존 워크스페이스 호환 템플릿' },
  { id: 'streaming', label: '스트리밍 방송 운영', desc: '기존 워크스페이스 호환 템플릿' },
  { id: 'shortform', label: '숏폼 제작', desc: '기존 워크스페이스 호환 템플릿' },
  { id: 'blog-newsletter', label: '블로그 / 뉴스레터 운영', desc: '기존 워크스페이스 호환 템플릿' },
  { id: 'brand-team', label: '브랜드 콘텐츠팀 운영', desc: '기존 워크스페이스 호환 템플릿' },
];

export const STEP_LABELS = ['타겟', '템플릿', '관리 항목'] as const;
