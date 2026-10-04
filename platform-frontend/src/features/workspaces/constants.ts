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
  { id: 'youtube', label: '유튜브', desc: '유튜브 채널 운영과 영상 컨텐츠 제작' },
  { id: 'streamer', label: '라이브 스트리밍', desc: '라이브 방송과 다시보기 컨텐츠 관리' },
  { id: 'other', label: '기타', desc: '다른 형태의 크리에이터 활동 관리' },
];

export const CHANNEL_OPTIONS: ReadonlyArray<{
  id: WorkspaceChannel;
  label: string;
}> = [
  { id: 'youtube', label: '유튜브' },
  { id: 'chzzk', label: '치지직' },
  { id: 'soop', label: 'SOOP' },
  { id: 'twitch', label: '트위치' },
  { id: 'other', label: '기타' },
];

export const FORMAT_OPTIONS: ReadonlyArray<{
  id: ContentFormat;
  label: string;
}> = [
  { id: 'gaming', label: '게임방송' },
  { id: 'info', label: '정보전달' },
  { id: 'review', label: '리뷰/비평' },
  { id: 'vlog', label: '브이로그' },
  { id: 'news', label: '뉴스/시사' },
  { id: 'shortform', label: '숏폼' },
  { id: 'blog', label: '블로그/뉴스레터' },
  { id: 'other', label: '기타' },
];

export const PRESET_OPTIONS: ReadonlyArray<{
  id: ProductionPreset;
  label: string;
  desc: string;
}> = [
  { id: 'simple', label: '간단형', desc: '혼자 빠르게 핵심 단계만 정리' },
  { id: 'standard', label: '표준형', desc: '기획부터 업로드까지 단계별 관리' },
  { id: 'team', label: '팀 작업형', desc: '담당자, 검수, 피드백까지 포함' },
];

export const REQUIRED_MANAGEMENT_ITEMS: ManagementItem[] = ['title', 'status'];

export const BASE_MANAGEMENT_ITEMS: ManagementItem[] = [
  ...REQUIRED_MANAGEMENT_ITEMS,
  'dueDate',
  'publishDate',
  'contentUrl',
  'referenceLinks',
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
  'scheduled',
];

export const COLLABORATION_MANAGEMENT_ITEMS: ManagementItem[] = [
  'assignee',
  'reviewStatus',
  'feedbackMemo',
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
      { id: 'title', label: '컨텐츠 제목' },
      { id: 'status', label: '컨텐츠 상태' },
      { id: 'dueDate', label: '마감일' },
      { id: 'publishDate', label: '배포일' },
      { id: 'contentUrl', label: '컨텐츠 URL' },
      { id: 'referenceLinks', label: '참고 링크' },
      { id: 'channel', label: '활동 채널' },
      { id: 'format', label: '컨텐츠 형식' },
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
      { id: 'scheduled', label: '예약 배포 여부' },
    ],
  },
  {
    id: 'collaboration',
    title: '협업 항목',
    items: [
      { id: 'assignee', label: '담당자' },
      { id: 'reviewStatus', label: '검수 상태' },
      { id: 'feedbackMemo', label: '피드백 메모' },
    ],
  },
  {
    id: 'revenue',
    title: '수익 / 성과 항목',
    items: [
      { id: 'sponsored', label: '협찬 여부' },
      { id: 'sponsorBrand', label: '협찬사 / 브랜드' },
      { id: 'views', label: '조회수' },
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
      { id: 'gameMode', label: '게임 모드' },
      { id: 'partyMembers', label: '참여 멤버' },
      { id: 'highlightMemo', label: '하이라이트 메모' },
      { id: 'streamTime', label: '방송 예정 시간' },
      { id: 'clipProduction', label: '클립 제작 여부' },
      { id: 'vodUpload', label: '다시보기 업로드 여부' },
      { id: 'avgViewers', label: '평균 시청자 수' },
    ],
  },
  info: {
    title: '정보전달 추천 항목',
    items: [
      { id: 'research', label: '자료 조사' },
      { id: 'sourceLinks', label: '출처 링크' },
      { id: 'referenceImages', label: '참고 이미지' },
    ],
  },
  review: {
    title: '리뷰/비평 추천 항목',
    items: [
      { id: 'productName', label: '제품명' },
      { id: 'comparisonTarget', label: '비교 대상' },
      { id: 'purchaseLink', label: '구매 링크' },
      { id: 'prosConsMemo', label: '장단점 메모' },
      { id: 'sponsored', label: '협찬 여부' },
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
      { id: 'publishDeadline', label: '배포 마감 시간' },
      { id: 'factCheck', label: '팩트 체크' },
      { id: 'sensitivity', label: '민감도' },
      { id: 'keyword', label: '핵심 키워드' },
    ],
  },
  shortform: {
    title: '숏폼 추천 항목',
    items: [
      { id: 'shortformHook', label: '첫 3초 훅' },
      { id: 'shortformCaption', label: '자막 문구' },
      { id: 'shortformSound', label: '사용 음원' },
      { id: 'highlightMemo', label: '하이라이트 메모' },
    ],
  },
  blog: {
    title: '블로그/뉴스레터 추천 항목',
    items: [
      { id: 'keyword', label: '키워드' },
      { id: 'seoTitle', label: 'SEO 제목' },
      { id: 'metaDescription', label: '메타 설명' },
      { id: 'sourceLinks', label: '출처 링크' },
    ],
  },
};

export const STREAMING_MANAGEMENT_ITEMS: ReadonlyArray<{ id: ManagementItem; label: string }> = [
  { id: 'streamStartTime', label: '방송 시작 시간' },
  { id: 'streamEndTime', label: '방송 종료 시간' },
  { id: 'streamTopic', label: '방송 주제' },
  { id: 'vodUrl', label: '다시보기 URL' },
  { id: 'peakViewers', label: '최고 시청자 수' },
  { id: 'avgViewers', label: '평균 시청자 수' },
  { id: 'chatIssueMemo', label: '채팅 이슈 메모' },
];

const LEGACY_MANAGEMENT_ITEM_OPTIONS: ReadonlyArray<{ id: ManagementItem; label: string }> = [
  { id: 'upload', label: '업로드 여부' },
  { id: 'notification', label: '알림 여부' },
];

function uniqueItemOptions(
  options: ReadonlyArray<{ id: ManagementItem; label: string }>,
): ReadonlyArray<{ id: ManagementItem; label: string }> {
  const seen = new Set<ManagementItem>();
  return options.filter((option) => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

export const ITEM_OPTIONS: ReadonlyArray<{ id: ManagementItem; label: string }> = uniqueItemOptions([
  ...MANAGEMENT_ITEM_GROUPS.flatMap((group) => group.items),
  ...Object.values(FORMAT_MANAGEMENT_ITEM_GROUPS).flatMap((group) => group?.items ?? []),
  ...STREAMING_MANAGEMENT_ITEMS,
  ...LEGACY_MANAGEMENT_ITEM_OPTIONS,
]);

export const SELECTABLE_ITEM_OPTIONS: ReadonlyArray<{ id: ManagementItem; label: string }> = uniqueItemOptions([
  ...MANAGEMENT_ITEM_GROUPS.flatMap((group) => group.items),
  ...Object.values(FORMAT_MANAGEMENT_ITEM_GROUPS).flatMap((group) => group?.items ?? []),
  ...STREAMING_MANAGEMENT_ITEMS,
]);

function withRequiredItems(items: ReadonlyArray<ManagementItem>): ManagementItem[] {
  return uniqueItems([...REQUIRED_MANAGEMENT_ITEMS, ...items]);
}

function uniqueItems(items: ReadonlyArray<ManagementItem>): ManagementItem[] {
  return Array.from(new Set(items));
}

export const PRESET_RECOMMENDED_ITEMS: Record<ProductionPreset, ManagementItem[]> = {
  simple: withRequiredItems(['dueDate', 'channel', 'format', 'priority', 'tags', 'memo']),
  standard: withRequiredItems([...BASE_MANAGEMENT_ITEMS, ...PRODUCTION_MANAGEMENT_ITEMS]),
  team: withRequiredItems([
    ...BASE_MANAGEMENT_ITEMS,
    ...PRODUCTION_MANAGEMENT_ITEMS,
    ...COLLABORATION_MANAGEMENT_ITEMS,
  ]),
};

export const TEMPLATE_OPTIONS: ReadonlyArray<{
  id: WorkspaceTemplateKey;
  label: string;
  desc: string;
}> = [
  { id: 'creator-simple', label: '간단형', desc: '핵심 단계만 정리하는 개인 운영 템플릿' },
  { id: 'creator-standard', label: '표준형', desc: '기획부터 업로드까지 단계별 관리' },
  { id: 'creator-team', label: '팀 작업형', desc: '담당자, 검수, 피드백을 포함한 팀 운영' },
  { id: 'youtube-channel', label: '유튜브 채널 운영', desc: '영상 제작과 업로드 중심 템플릿' },
  { id: 'streaming', label: '스트리밍 방송 운영', desc: '라이브 방송과 다시보기 운영 템플릿' },
  { id: 'shortform', label: '숏폼 제작', desc: '짧은 영상 제작과 반복 업로드 관리' },
  { id: 'blog-newsletter', label: '블로그 / 뉴스레터 운영', desc: '글 배포과 SEO 메타 정보 관리' },
  { id: 'brand-team', label: '브랜드 컨텐츠팀 운영', desc: '브랜드 컨텐츠 제작과 협업 관리' },
];

export const STEP_LABELS = ['목표', '템플릿', '관리 항목'] as const;
