import { Link } from 'react-router-dom';
import AuthAwareCta from '../../components/auth/AuthAwareCta';

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mk-hero">
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Creator Content Workspace</span>
          <h1>
            아이디어부터 업로드 일정까지<br />
            <em>콘텐츠 제작 흐름</em>을 한곳에서 관리하세요.
          </h1>
          <p>
            유튜버, 스트리머, 숏폼 제작자, 콘텐츠 팀을 위한 작업공간을 몇 번의 선택만으로 구성합니다.
            아이디어 보관함, 제작 보드, 대본/구성안, 썸네일 후보, 업로드 캘린더까지
            콘텐츠 운영에 필요한 흐름을 하나로 연결합니다.
          </p>
          <div className="mk-hero-ctas">
            <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
            <Link to="/templates" className="btn ghost">템플릿 둘러보기</Link>
          </div>
          <div className="mk-hero-hint">신용카드 없이 바로 시작 · 크리에이터 전용 워크스페이스 자동 구성</div>
        </div>
      </section>

      {/* ---------- Why CreatorDesk ---------- */}
      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Why CreatorDesk</span>
            <h2>흩어진 콘텐츠 작업을 하나의 운영 공간으로 모으세요</h2>
          </div>
          <div className="mk-grid-3">
            <article className="mk-card">
              <div className="mk-card-icon"><Icon d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></div>
              <h3>아이디어를 놓치지 않게</h3>
              <p>댓글, 트렌드, 경쟁 채널, 시청자 요청에서 나온 아이디어를 빠르게 저장하고 태그와 우선순위로 정리하세요.</p>
            </article>
            <article className="mk-card">
              <div className="mk-card-icon"><Icon d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2" /></div>
              <h3>제작 상태를 한눈에</h3>
              <p>아이디어 → 기획 → 대본 → 촬영 → 편집 → 업로드 예약까지 콘텐츠 진행 상황을 보드에서 확인하세요.</p>
            </article>
            <article className="mk-card">
              <div className="mk-card-icon"><Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /></div>
              <h3>업로드 일정을 체계적으로</h3>
              <p>촬영일, 편집 마감일, 업로드 예정일, 라이브 방송 일정을 캘린더로 관리하세요.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- 주요 기능 ---------- */}
      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Features</span>
            <h2>크리에이터 운영에 필요한 기능을 한곳에 담았습니다</h2>
          </div>
          <div className="mk-grid-3">
            <FeatureTile
              icon={<Icon d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
              title="콘텐츠 아이디어 보관함"
              desc="갑자기 떠오른 소재, 댓글에서 나온 요청, 트렌드 키워드, 참고 링크를 빠르게 저장하고 분류합니다."
            />
            <FeatureTile
              icon={<Icon d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2" />}
              title="콘텐츠 제작 보드"
              desc="아이디어, 기획중, 대본 작성, 촬영, 편집, 썸네일 작업, 업로드 예약, 발행 완료 상태를 칸반 보드로 관리합니다."
            />
            <FeatureTile
              icon={<Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />}
              title="대본 / 구성안 관리"
              desc="오프닝 멘트, 핵심 내용, 장면 구성, B-roll, 자막 포인트, 엔딩 CTA를 콘텐츠별로 정리합니다."
            />
            <FeatureTile
              icon={<Icon d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />}
              title="제목 / 썸네일 후보 관리"
              desc="제목 후보, 썸네일 문구, 클릭 유도 포인트, 설명란 메모를 콘텐츠별로 모아 비교할 수 있습니다."
            />
            <FeatureTile
              icon={<Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />}
              title="업로드 캘린더"
              desc="촬영일, 편집 마감일, 업로드 예정일, 라이브 방송 일정, 협찬 마감일을 캘린더에서 확인합니다."
            />
            <FeatureTile
              icon={<Icon d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />}
              title="채널별 운영 관리"
              desc="YouTube, Shorts, Twitch, TikTok, Reels, Blog, Newsletter 등 여러 채널을 하나의 워크스페이스에서 관리합니다."
            />
          </div>
        </div>
      </section>

      {/* ---------- 템플릿 ---------- */}
      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Templates</span>
            <h2>콘텐츠 유형에 맞는 운영 템플릿으로 시작하세요</h2>
            <p>활동 유형에 맞는 템플릿을 선택하면 기본 보드, 관리 항목, 문서 템플릿이 자동으로 구성됩니다.</p>
          </div>
          <TemplatePreviewGrid />
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/templates" className="btn ghost">운영 템플릿 보기</Link>
          </div>
        </div>
      </section>

      {/* ---------- 사용 흐름 ---------- */}
      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">How it works</span>
            <h2>6단계로 콘텐츠 운영 공간 만들기</h2>
          </div>
          <div className="mk-flow">
            <FlowStep n={1} title="사용 목적 선택"   desc="유튜브, 스트리밍, 숏폼, 블로그, 브랜드 팀 등 운영 목적을 선택합니다." />
            <FlowStep n={2} title="운영 채널 선택"   desc="YouTube, Twitch, TikTok, Reels, Blog, Newsletter 등 운영 채널을 고릅니다." />
            <FlowStep n={3} title="콘텐츠 형식 선택" desc="게임 방송, 리뷰, 브이로그, 정보 전달, 쇼츠 등 주 제작 형식을 선택합니다." />
            <FlowStep n={4} title="제작 흐름 선택"   desc="간단형, 표준형, 팀 협업형 중 내 콘텐츠 제작 방식에 맞는 흐름을 선택합니다." />
            <FlowStep n={5} title="운영 템플릿 선택" desc="유튜브 채널 운영, 스트리머 방송 운영, 쇼츠 제작 등 추천 템플릿을 고릅니다." />
            <FlowStep n={6} title="워크스페이스 생성" desc="콘텐츠 보드, 아이디어 보관함, 대본 템플릿, 업로드 캘린더가 자동으로 구성됩니다." />
          </div>
        </div>
      </section>

      {/* ---------- Use cases ---------- */}
      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Use cases</span>
            <h2>이런 크리에이터에게 필요합니다</h2>
          </div>
          <div className="mk-grid-4">
            <article className="mk-usecase-card">
              <span className="tag">YouTuber</span>
              <h3>유튜브 크리에이터</h3>
              <p>영상 아이디어, 대본, 촬영 일정, 편집 상태, 업로드 계획을 한곳에서 관리합니다.</p>
            </article>
            <article className="mk-usecase-card">
              <span className="tag">Streamer</span>
              <h3>스트리머 / 개인 방송인</h3>
              <p>방송 주제, 라이브 일정, 클립 아이디어, 다시보기 콘텐츠를 체계적으로 운영합니다.</p>
            </article>
            <article className="mk-usecase-card">
              <span className="tag">Short-form</span>
              <h3>쇼츠 / 릴스 / 틱톡 제작자</h3>
              <p>짧은 영상 아이디어, 훅, 자막 문구, 업로드 루틴을 빠르게 관리합니다.</p>
            </article>
            <article className="mk-usecase-card">
              <span className="tag">Content Team</span>
              <h3>브랜드 / 마케팅 콘텐츠 팀</h3>
              <p>캠페인 콘텐츠, 담당자, 검수 상태, 채널별 발행 일정을 팀 단위로 관리합니다.</p>
            </article>
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/use-cases" className="btn ghost">더 많은 사례 보기</Link>
          </div>
        </div>
      </section>

      {/* ---------- Pricing teaser ---------- */}
      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Pricing</span>
            <h2>가볍게 시작하고 콘텐츠 운영이 커지면 확장하세요</h2>
            <p>Free로 개인 콘텐츠 운영 공간을 만들어 보고, 채널이 늘어나거나 팀 작업이 필요해지면 Pro · Team 플랜으로 확장하세요.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/pricing" className="btn primary">요금제 비교하기</Link>
          </div>
        </div>
      </section>

      {/* ---------- 최종 CTA ---------- */}
      <section className="mk-section">
        <div className="mk-cta-band">
          <div>
            <h3>지금 바로 CreatorDesk로 콘텐츠 운영 공간을 만들어보세요</h3>
            <p>아이디어, 대본, 촬영, 편집, 업로드 일정까지 크리에이터의 반복되는 콘텐츠 제작 흐름을 하나의 워크스페이스에서 관리할 수 있습니다.</p>
          </div>
          <div style={{ display: 'inline-flex', gap: 10 }}>
            <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
            <Link to="/templates" className="btn ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>운영 템플릿 보기</Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------- helpers ----------
function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function FeatureTile({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <article className="mk-card">
      <div className="mk-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}

function FlowStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="mk-flow-step">
      <span className="num">{n}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

const TEMPLATE_PREVIEW = [
  { id: 'youtube-channel', label: '유튜브 채널 운영', desc: '영상 아이디어, 대본, 촬영, 편집, 업로드 일정 관리',  mono: 'YT', enabled: true  },
  { id: 'streaming',       label: '스트리머 방송 운영', desc: '방송 일정, 클립 아이디어, 다시보기 관리',          mono: 'ST', enabled: true  },
  { id: 'shortform',       label: '쇼츠 / 릴스 제작',  desc: '짧은 영상 아이디어, 훅, 업로드 루틴 관리',         mono: 'SF', enabled: true  },
  { id: 'blog-newsletter', label: '블로그 / 뉴스레터',  desc: '글감, 초안, 발행 일정, SEO 키워드 관리',           mono: 'BL', enabled: false },
  { id: 'brand-team',      label: '브랜드 콘텐츠 팀',   desc: '캠페인, 담당자, 검수, 채널별 발행 상태 관리',       mono: 'BR', enabled: false },
];

function TemplatePreviewGrid() {
  return (
    <div className="mk-grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
      {TEMPLATE_PREVIEW.map((t) => (
        <article key={t.id} className="mk-template-card">
          <div className="mk-template-thumb">{t.mono}</div>
          <div className="mk-template-body">
            <div className="title">
              {t.label}
              {t.enabled
                ? <span className="badge success">추천</span>
                : <span className="badge">준비중</span>}
            </div>
            <p className="desc">{t.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
