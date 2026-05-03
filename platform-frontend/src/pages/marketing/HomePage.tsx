import { Link } from 'react-router-dom';
import AuthAwareCta from '../../components/auth/AuthAwareCta';

const TEMPLATE_PREVIEW = [
  { id: 'youtube-channel', label: 'YouTube 채널 운영', desc: '영상 아이디어, 대본, 촬영, 편집, 업로드 일정 관리', mono: 'YT', enabled: true },
  { id: 'streaming', label: '스트리밍 운영', desc: '방송 주제, 클립 아이디어, 다시보기 편집 관리', mono: 'ST', enabled: true },
  { id: 'shortform', label: '숏폼 제작', desc: '쇼츠, 릴스, 틱톡 반복 제작 루틴 관리', mono: 'SF', enabled: true },
  { id: 'blog-newsletter', label: '블로그 / 뉴스레터', desc: '글감, 초안, SEO 키워드, 발행 일정 관리', mono: 'BL', enabled: false },
];

export default function HomePage() {
  return (
    <>
      <section className="mk-hero mk-hero-product">
        <div className="mk-hero-inner">
          <div className="mk-hero-copy">
            <span className="mk-eyebrow">크리에이터 콘텐츠 워크스페이스</span>
            <h1>
              콘텐츠 아이디어부터
              <br />
              <em>업로드 일정</em>까지
              <br />
              손쉽게 관리하세요
            </h1>
            <p>
              유튜버와 라이브 스트리밍를 위한 콘텐츠 운영 워크스페이스입니다.
              <br />
              아이디어, 대본, 편집 상태, 업로드 일정을 한곳에서 관리하세요.
            </p>
            <div className="mk-hero-ctas">
              <AuthAwareCta intent="start" className="btn primary">내 워크스페이스 만들기</AuthAwareCta>
              <Link to="/templates" className="btn ghost">템플릿 둘러보기</Link>
            </div>
            <div className="mk-hero-hint">신용카드 없이 시작 · 크리에이터 전용 워크스페이스 자동 구성</div>
          </div>

          <ProductMockup />
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Why CreatorDesk</span>
            <h2>흩어진 콘텐츠 작업을 하나의 운영 공간으로 모으세요</h2>
            <p>아이디어 메모, 제작 단계, 캘린더, 제작 자산을 콘텐츠 아이템 중심으로 연결합니다.</p>
          </div>
          <div className="mk-grid-3">
            <FeatureTile
              icon={<Icon d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
              title="아이디어를 놓치지 않게"
              desc="댓글, 트렌드, 시청자 요청에서 나온 아이디어를 빠르게 저장하고 우선순위와 태그로 정리합니다."
            />
            <FeatureTile
              icon={<Icon d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2" />}
              title="제작 상태를 한눈에"
              desc="아이디어, 기획, 대본, 촬영, 편집, 썸네일, 예약, 발행까지 9단계 보드로 추적합니다."
            />
            <FeatureTile
              icon={<Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />}
              title="업로드 일정을 체계적으로"
              desc="촬영일, 편집 마감일, 업로드 예정일, 라이브 방송 일정을 월간 캘린더로 관리합니다."
            />
          </div>
        </div>
      </section>

      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Features</span>
            <h2>콘텐츠 운영에 필요한 핵심 기능을 정돈했습니다</h2>
          </div>
          <div className="mk-grid-3">
            <FeatureTile title="콘텐츠 아이디어 보관함" desc="떠오른 주제, 댓글 요청, 트렌드 키워드, 참고 링크를 빠르게 저장하고 분류합니다." />
            <FeatureTile title="콘텐츠 제작 보드" desc="콘텐츠 아이템의 진행 상태를 칸반 보드와 목록 뷰로 관리합니다." />
            <FeatureTile title="대본 / 구성안 관리" desc="스크립트, 화면 구성, B-roll, 자막 포인트를 콘텐츠별로 정리합니다." />
            <FeatureTile title="제목 / 썸네일 후보" desc="제목 후보, 썸네일 문구, 클릭 유도 포인트를 한 카드에 모아 비교합니다." />
            <FeatureTile title="업로드 캘린더" desc="촬영, 편집 마감, 예약 업로드, 라이브 일정을 월간 뷰에서 확인합니다." />
            <FeatureTile title="채널별 워크스페이스" desc="YouTube, Twitch, TikTok, Reels, Blog 등 여러 채널을 워크스페이스 단위로 운영합니다." />
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Templates</span>
            <h2>콘텐츠 유형에 맞는 운영 템플릿으로 시작하세요</h2>
            <p>활동 유형에 맞는 템플릿을 선택하면 기본 보드, 관리 항목, 캘린더 구성이 자동으로 잡힙니다.</p>
          </div>
          <TemplatePreviewGrid />
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/templates" className="btn ghost">운영 템플릿 보기</Link>
          </div>
        </div>
      </section>

      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">How it works</span>
            <h2>6단계로 콘텐츠 운영 공간 만들기</h2>
          </div>
          <div className="mk-flow">
            <FlowStep n={1} title="사용 목적 선택" desc="YouTube, 스트리밍, 숏폼, 블로그, 브랜드 팀 중 운영 목적을 선택합니다." />
            <FlowStep n={2} title="운영 채널 선택" desc="YouTube, Twitch, TikTok, Reels, Blog 등 운영 채널을 고릅니다." />
            <FlowStep n={3} title="콘텐츠 형식 선택" desc="게임 방송, 리뷰, 브이로그, 정보 전달, 튜토리얼 등 형식을 고릅니다." />
            <FlowStep n={4} title="제작 흐름 선택" desc="간단형, 표준형, 팀 작업형 중 제작 방식에 맞는 흐름을 선택합니다." />
            <FlowStep n={5} title="관리 항목 선택" desc="대본, 썸네일 문구, 촬영 체크리스트, 업로드 일정 등 필요한 항목을 고릅니다." />
            <FlowStep n={6} title="워크스페이스 생성" desc="콘텐츠 보드, 아이디어 보관함, 캘린더가 바로 준비됩니다." />
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-cta-band">
          <div>
            <h3>지금 CreatorDesk로 콘텐츠 운영 공간을 만들어보세요</h3>
            <p>아이디어, 대본, 촬영, 편집, 업로드 일정까지 반복되는 제작 흐름을 한 워크스페이스에서 관리할 수 있습니다.</p>
          </div>
          <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap' }}>
            <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
            <Link to="/use-cases" className="btn ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>고객사례 보기</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductMockup() {
  return (
    <div className="mk-product-mockup" aria-hidden>
      <div className="mockup-topbar">
        <span />
        <span />
        <span />
        <strong>CreatorDesk / 유튜브 채널 운영실</strong>
      </div>
      <div className="mockup-body">
        <aside className="mockup-sidebar">
          <b>워크스페이스</b>
          <span className="active">콘텐츠 보드</span>
          <span>캘린더</span>
          <span>아이디어</span>
          <span>자료함</span>
        </aside>
        <main className="mockup-main">
          <div className="mockup-stats">
            <div><small>진행 중</small><strong>18</strong></div>
            <div><small>이번 주 업로드</small><strong>7</strong></div>
            <div><small>예약됨</small><strong>5</strong></div>
          </div>
          <div className="mockup-board">
            {['아이디어', '편집중', '예약됨'].map((column, index) => (
              <div className="mockup-column" key={column}>
                <b>{column}</b>
                <div className="mockup-card strong">신작 게임 업데이트 리뷰</div>
                {index === 0 && <div className="mockup-card">쇼츠 클립 아이디어</div>}
                {index === 1 && <div className="mockup-card accent">썸네일 문구 확정</div>}
                {index === 2 && <div className="mockup-card accent">업로드 일정 확정</div>}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function FeatureTile({ icon, title, desc }: { icon?: React.ReactNode; title: string; desc: string }) {
  return (
    <article className="mk-card">
      {icon && <div className="mk-card-icon">{icon}</div>}
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

function TemplatePreviewGrid() {
  return (
    <div className="mk-grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {TEMPLATE_PREVIEW.map((template) => (
        <article key={template.id} className="mk-template-card">
          <div className="mk-template-thumb">{template.mono}</div>
          <div className="mk-template-body">
            <div className="title">
              {template.label}
              {template.enabled
                ? <span className="badge success">추천</span>
                : <span className="badge">준비중</span>}
            </div>
            <p className="desc">{template.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
