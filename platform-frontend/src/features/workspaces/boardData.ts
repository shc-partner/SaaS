// 워크플로우 프리셋별 칸반 컬럼 정의 및 mock 데이터 생성 함수.

import type { BoardColumn, ContentItem, Idea } from './boardTypes';
import type { ProductionPreset } from './types';

export const COLUMNS_BY_PRESET: Record<ProductionPreset, BoardColumn[]> = {
  simple: [
    { id: 'idea',      label: '아이디어' },
    { id: 'editing',   label: '제작중' },
    { id: 'scheduled', label: '예약됨' },
    { id: 'published', label: '작업완료' },
  ],
  standard: [
    { id: 'idea',      label: '아이디어' },
    { id: 'planning',  label: '기획중' },
    { id: 'shooting',  label: '촬영 / 녹화' },
    { id: 'editing',   label: '작업중' },
    { id: 'scheduled', label: '업로드 예약' },
    { id: 'published', label: '작업완료' },
  ],
  team: [
    { id: 'idea',        label: '아이디어' },
    { id: 'planning',    label: '기획중' },
    { id: 'scripting',   label: '대본 작성' },
    { id: 'shooting',    label: '촬영 완료' },
    { id: 'editing',     label: '작업중' },
    { id: 'edit-review', label: '편집 검수' },
    { id: 'thumbnail',   label: '썸네일 작업' },
    { id: 'scheduled',   label: '예약됨' },
    { id: 'published',   label: '작업완료' },
  ],
};

export function getMockItems(workspaceId: string): ContentItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'item-1', workspaceId, title: '제작 중인 것. 타이틀 길이 길게 해봄 ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ',
      status: 'editing', channels: ['유튜브'], contentFormat: '리뷰',
      tags: ['#게임', '#리뷰', '#신작'], assignee: 'HC', priority: 'high',
      isSponsored: true, publishDate: '2026-04-30', shootDate: '2026-04-25', editDueDate: '2026-04-29',
      script: '', titleCandidates: ['신작 게임 업데이트 완벽 리뷰', '이 게임 진짜 달라졌다'],
      thumbnailTexts: ['업데이트 후 완전 달라진 점', '신작 게임 충격 변화'], editingNotes: '인트로 3초 컷 강조',
      referenceLinks: [], createdAt: now, updatedAt: now,
    },
    {
      id: 'item-2', workspaceId, title: '채널 구독자 1만 기념 브이로그',
      status: 'planning', channels: ['유튜브'], contentFormat: '브이로그',
      tags: ['#일상', '#마일스톤'], assignee: 'HC', priority: 'medium',
      isSponsored: false, publishDate: '2026-05-05', shootDate: '', editDueDate: '2026-05-04',
      script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
      referenceLinks: [], createdAt: now, updatedAt: now,
    },
    {
      id: 'item-3', workspaceId, title: '최신 스마트폰 언박싱 & 첫인상',
      status: 'idea', channels: ['유튜브'], contentFormat: '언박싱',
      tags: ['#언박싱', '#스마트폰', '#테크'], assignee: '', priority: 'low',
      isSponsored: false, publishDate: '', shootDate: '', editDueDate: '',
      script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
      referenceLinks: [], createdAt: now, updatedAt: now,
    },
    {
      id: 'item-4', workspaceId, title: 'PC 조립 완전 정복 튜토리얼',
      status: 'scripting', channels: ['유튜브'], contentFormat: '튜토리얼',
      tags: ['#PC', '#조립', '#입문'], assignee: 'HC', priority: 'high',
      isSponsored: false, publishDate: '2026-05-10', shootDate: '2026-05-01', editDueDate: '2026-05-08',
      script: '1. 인트로 — 이 영상을 만든 이유\n2. 부품 소개\n3. 조립 과정\n4. 테스트 및 마무리',
      titleCandidates: ['PC 조립 완전 가이드', '초보자도 가능한 PC 조립'], thumbnailTexts: ['3시간이면 충분!'],
      editingNotes: '', referenceLinks: [], createdAt: now, updatedAt: now,
    },
    {
      id: 'item-5', workspaceId, title: '봄 게임 추천 TOP 5',
      status: 'published', channels: ['유튜브'], contentFormat: '정보전달',
      tags: ['#게임추천', '#봄'], assignee: 'HC', priority: 'medium',
      isSponsored: false, publishDate: '2026-04-15', shootDate: '2026-04-10', editDueDate: '2026-04-14',
      script: '', titleCandidates: [], thumbnailTexts: [], editingNotes: '',
      referenceLinks: [], createdAt: now, updatedAt: now,
    },
    {
      id: 'item-6', workspaceId, title: '스트리밍 셋업 공개',
      status: 'scheduled', channels: ['유튜브', '트위치'], contentFormat: '브이로그',
      tags: ['#셋업', '#라이브 스트리밍'], assignee: 'HC', priority: 'medium',
      isSponsored: true, publishDate: '2026-05-01', shootDate: '2026-04-28', editDueDate: '2026-04-30',
      script: '', titleCandidates: ['내 방송 셋업 전부 공개', '스트리밍 시작하려면 이것만'], thumbnailTexts: [],
      editingNotes: '', referenceLinks: [], createdAt: now, updatedAt: now,
    },
  ];
}

export function getMockIdeas(workspaceId: string): Idea[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'idea-1', workspaceId, title: '게이밍 의자 1년 사용기',
      source: '댓글', priority: 'medium', tags: ['#장비', '#리뷰'],
      memo: '구독자 요청 많음. 6개월 경과 후 촬영 예정', referenceLinks: [], createdAt: now,
    },
    {
      id: 'idea-2', workspaceId, title: '이 게임 왜 망했나? 분석',
      source: '트렌드', priority: 'high', tags: ['#게임분석', '#인기'],
      memo: '흥행 실패 게임 3개 비교 분석', referenceLinks: [], createdAt: now,
    },
    {
      id: 'idea-3', workspaceId, title: '야식 먹방 브이로그',
      source: '자체기획', priority: 'low', tags: ['#먹방', '#일상'],
      memo: '', referenceLinks: [], createdAt: now,
    },
  ];
}
