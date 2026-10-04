import AuthAwareCta from '../../components/auth/AuthAwareCta';

const FEATURE_BLOCKS = [
  {
    eyebrow: 'Trend AI Search',
    title: '트렌드 영상을 AI 기획안으로 전환',
    desc: 'YouTube 인기 영상과 검색어 기반 트렌드를 탐색하고, 결과 목록 전체를 AI가 분석해 바로 쓸 수 있는 컨텐츠 아이디어로 정리합니다.',
    bullets: ['국가, 기간, 카테고리, 검색어 기반 탐색', '탐색 결과 전체 기반 AI 기획 추천', '추천안을 아이디어 또는 컨텐츠로 바로 저장'],
  },
  {
    eyebrow: 'Trend Explorer',
    title: '카테고리와 검색어를 함께 보는 트렌드 탐색',
    desc: '게임, 음악, 엔터테인먼트 같은 카테고리뿐 아니라 쉼표로 구분한 여러 검색어를 한 번에 탐색할 수 있습니다.',
    bullets: ['여러 검색어 동시 입력', '조회수, 최신순, 트렌드 점수순 정렬', '영상별 조회수, 좋아요, 댓글, 트렌드 점수 표시'],
  },
  {
    eyebrow: 'AI Idea Workflow',
    title: '추천에서 저장까지 이어지는 제작 흐름',
    desc: 'AI가 제안한 제목, 훅, 썸네일 문구, 제작 메모를 바로 아이디어 노트나 컨텐츠 목록에 등록할 수 있습니다.',
    bullets: ['아이디어로 저장', '컨텐츠로 등록', '참고 영상 링크 자동 보관'],
  },
  {
    eyebrow: 'Workspace Board',
    title: '컨텐츠 제작 상태를 한눈에 관리',
    desc: '아이디어, 기획, 대본, 촬영, 편집, 썸네일, 예약, 배포까지 제작 단계를 보드로 관리합니다.',
    bullets: ['제작 보드와 컨텐츠 목록', '워크스페이스별 데이터 분리', '팀 운영에 맞춘 관리 항목'],
  },
  {
    eyebrow: 'Calendar',
    title: '촬영과 업로드 일정을 캘린더로 확인',
    desc: '촬영일, 편집 마감일, 업로드 예정일을 월간 캘린더에서 확인하고 일정 충돌을 줄입니다.',
    bullets: ['월간 캘린더', '컨텐츠별 일정 관리', '워크스페이스 단위 일정 저장'],
  },
  {
    eyebrow: 'Usage Control',
    title: 'AI 사용량과 플랜 확장을 준비',
    desc: 'AI 추천은 계정별 일일 사용량을 기록하고, 이후 유료 플랜에 따라 한도를 확장할 수 있는 구조로 준비되어 있습니다.',
    bullets: ['오늘 AI 추천 사용량 표시', '무료 플랜 일일 한도', '유료 플랜 확장 정책 준비'],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="mk-features-hero">
        <div className="mk-features-hero-inner">
          <div>
            <span className="mk-eyebrow">Features</span>
            <h1 className="mk-page-hero-title">트렌드를 찾고, AI로 컨텐츠 기획까지 연결하세요.</h1>
            <p>
              CreatorDesk는 YouTube 트렌드 탐색과 AI 아이디어 추천을 중심으로,
              크리에이터 팀이 컨텐츠를 빠르게 기획하고 제작 흐름으로 옮길 수 있게 돕습니다.
            </p>
            <div className="mk-features-hero-actions">
              <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
              <AuthAwareCta intent="template" className="btn ghost">워크스페이스 샘플 보기</AuthAwareCta>
            </div>
          </div>

          <div className="mk-trend-ai-preview" aria-label="트렌드 AI 검색 미리보기">
            <div className="mk-trend-ai-preview-head">
              <span>Trend AI Search</span>
              <strong>KR · 최근 7일</strong>
            </div>
            <div className="mk-trend-ai-searchbar">
              <span>인기 게임, 밈·챌린지, 숏폼 트렌드</span>
              <b>AI 추천</b>
            </div>
            <div className="mk-trend-ai-video-list">
              <PreviewVideo title="요즘 뜨는 게임 플레이 반응 모음" score="92,410" />
              <PreviewVideo title="쇼츠에서 확산 중인 챌린지 클립" score="81,200" />
              <PreviewVideo title="시청자가 반복 재생한 인기 장면" score="74,880" />
            </div>
            <div className="mk-trend-ai-result">
              <small>AI 기획 추천</small>
              <strong>인기 게임과 숏폼 챌린지를 엮은 주간 트렌드 컨텐츠</strong>
              <p>반응이 높은 장면을 모아 댓글 참여와 다음 편 투표까지 자연스럽게 유도합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mk-section mk-features-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Core Flow</span>
            <h2>트렌드 탐색에서 컨텐츠 등록까지 한 흐름으로 이어집니다.</h2>
            <p>아이디어를 따로 복사하지 않고, 발견한 트렌드를 바로 제작 가능한 작업으로 전환합니다.</p>
          </div>

          <div className="mk-grid-2">
            {FEATURE_BLOCKS.map((block) => (
              <Block key={block.eyebrow} {...block} />
            ))}
          </div>

          <div className="mk-cta-band" style={{ marginTop: 56 }}>
            <div>
              <h3>트렌드를 놓치지 않는 컨텐츠 운영 공간을 만들어보세요</h3>
              <p>첫 워크스페이스는 무료로 만들 수 있습니다. 트렌드 탐색, AI 추천, 보드, 캘린더를 한 곳에서 확인하세요.</p>
            </div>
            <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
          </div>
        </div>
      </section>
    </>
  );
}

function PreviewVideo({ title, score }: { title: string; score: string }) {
  return (
    <div>
      <span />
      <p>{title}</p>
      <strong>{score}</strong>
    </div>
  );
}

function Block({ eyebrow, title, desc, bullets }: { eyebrow: string; title: string; desc: string; bullets: string[] }) {
  return (
    <article className="mk-card mk-feature-card">
      <span className="mk-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ul>
        {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>
    </article>
  );
}
