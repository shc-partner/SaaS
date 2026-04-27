// 워크스페이스 생성 마법사에서 사용하는 선택지 상수.

export const PURPOSE_OPTIONS = [
  { id: 'youtube',   label: '유튜버',          desc: '유튜브 채널 운영 및 영상 콘텐츠 제작', icon: '▶' },
  { id: 'streaming', label: '스트리머',         desc: '방송 일정·클립·팬 소통 관리',           icon: '📡' },
  { id: 'shortform', label: '숏폼 크리에이터', desc: '쇼츠·릴스·틱톡 루틴 관리',               icon: '⚡' },
  { id: 'podcast',   label: '팟캐스터',         desc: '에피소드 기획·녹음·배포 관리',           icon: '🎙' },
  { id: 'blog',      label: '블로그·뉴스레터', desc: '글감·초안·SEO 키워드 관리',               icon: '✍' },
  { id: 'brand',     label: '브랜드 콘텐츠 팀', desc: '캠페인·담당자·검수 흐름 관리',           icon: '🏢' },
] as const;

export const CHANNEL_OPTIONS = [
  { id: 'youtube',   label: 'YouTube' },
  { id: 'twitch',    label: 'Twitch' },
  { id: 'tiktok',    label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'blog',      label: '블로그' },
  { id: 'podcast',   label: '팟캐스트' },
] as const;

export const FORMAT_OPTIONS = [
  { id: 'gaming',   label: '게임방송' },
  { id: 'info',     label: '정보전달' },
  { id: 'review',   label: '리뷰·비교' },
  { id: 'vlog',     label: '브이로그' },
  { id: 'news',     label: '뉴스·시사' },
  { id: 'tutorial', label: '튜토리얼' },
] as const;

export const PRESET_OPTIONS = [
  { id: 'simple',   label: '간단형',   desc: '혼자 빠르게 — 핵심 단계만 관리' },
  { id: 'standard', label: '표준형',   desc: '기획부터 업로드까지 단계별 관리' },
  { id: 'team',     label: '팀협업형', desc: '담당자·검수·알림 포함' },
] as const;

export const ITEM_OPTIONS = [
  { id: 'script',      label: '대본 작성' },
  { id: 'thumbnail',   label: '썸네일 문구' },
  { id: 'shooting',    label: '촬영 체크리스트' },
  { id: 'upload',      label: '업로드 일정' },
  { id: 'performance', label: '성과 기록' },
] as const;

export const TEMPLATE_OPTIONS = [
  { id: 'youtube-channel', label: '유튜브 채널 운영',       desc: '영상 아이디어→대본→촬영→편집→업로드', icon: '▶' },
  { id: 'streaming',       label: '스트리머 방송 운영',     desc: '방송일정/클립아이디어/후원메모',         icon: '📡' },
  { id: 'shortform',       label: '쇼츠 / 릴스 제작',       desc: '숏폼 아이디어/훅문구/업로드루틴',        icon: '⚡' },
  { id: 'blog-newsletter', label: '블로그 / 뉴스레터 운영', desc: '글감/초안/SEO키워드',                    icon: '✍' },
  { id: 'brand-team',      label: '브랜드 콘텐츠 팀 운영',  desc: '캠페인/담당자/검수',                     icon: '🏢' },
] as const;

export const STEP_LABELS = ['목적', '채널', '형식', '프리셋', '관리항목', '템플릿'] as const;
