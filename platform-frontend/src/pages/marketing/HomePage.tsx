import { Link } from 'react-router-dom';

// 공개 메인 랜딩 — SiteForge 가 무엇을 주는 서비스인지 1화면 안에서 보여주는 역할.
// 세부 섹션 순서: hero → 핵심 가치 3 → 주요 기능 4 → 템플릿 프리뷰 → 사용 흐름 → 사례 teaser → 요금 teaser → 최종 CTA.
export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mk-hero">
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Website Builder SaaS</span>
          <h1>
            클릭 몇 번으로 <em>내 사이트</em>를<br />
            만들고, 운영해 보세요.
          </h1>
          <p>
            회사 소개부터 포트폴리오, 쇼핑몰, 예약까지 —
            전문 지식 없이 필요한 페이지만 골라 멀티페이지 사이트를 생성하고,
            관리자 화면에서 바로 운영할 수 있습니다.
          </p>
          <div className="mk-hero-ctas">
            <Link to="/signup"  className="btn primary">무료로 시작하기</Link>
            <Link to="/features" className="btn ghost">기능 둘러보기</Link>
          </div>
          <div className="mk-hero-hint">신용카드 없이 바로 시작 · 언제든 export 가능</div>
        </div>
      </section>

      {/* ---------- 핵심 가치 ---------- */}
      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Why SiteForge</span>
            <h2>쉽게 만들고, 바로 운영하세요</h2>
            <p>필요한 만큼만 선택해 나만의 사이트를 빠르게 시작하고, 성장에 따라 확장하세요.</p>
          </div>
          <div className="mk-grid-3">
            <article className="mk-card">
              <div className="mk-card-icon"><Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></div>
              <h3>클릭 몇 번으로 제작</h3>
              <p>템플릿 선택 → 페이지 고르기 → 콘텐츠 입력. 복잡한 개발 지식 없이 멀티페이지 사이트가 완성됩니다.</p>
            </article>
            <article className="mk-card">
              <div className="mk-card-icon"><Icon d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 8v4l3 2" /></div>
              <h3>생성 즉시 운영</h3>
              <p>임시 URL 이 즉시 발급되고, 관리자에서 콘텐츠를 바로 수정할 수 있습니다.</p>
            </article>
            <article className="mk-card">
              <div className="mk-card-icon"><Icon d="M4 4h16v4H4zm0 6h10v10H4zm14 0h2v4M18 16h2v4" /></div>
              <h3>언제든 export</h3>
              <p>플랫폼 안에서 운영하다가 필요하면 내 서버로 옮길 수 있는 구조로 설계됩니다.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- 주요 기능 ---------- */}
      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Features</span>
            <h2>SaaS 빌더가 갖춰야 할 모든 것</h2>
            <p>제작·운영·이관까지 연결된 기능 세트.</p>
          </div>
          <div className="mk-grid-4">
            <FeatureTile icon={<Icon d="M4 4h16v12H4zM8 20h8M12 16v4" />} title="사이트 빌더" desc="유형 · 페이지 · 기능을 선택해 실제 멀티페이지를 생성합니다." />
            <FeatureTile icon={<Icon d="M4 6h16M4 12h16M4 18h10" />}       title="페이지 · 콘텐츠 관리" desc="페이지별 텍스트·이미지·섹션을 관리자에서 즉시 편집." />
            <FeatureTile icon={<Icon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />} title="템플릿 기반 시작" desc="업종·용도별 템플릿으로 빈 화면에서 시작하지 않습니다." />
            <FeatureTile icon={<Icon d="M12 3v18M3 12h18" />}               title="확장 가능 구조" desc="커스텀 도메인, export, dedicated DB 까지 로드맵에 준비됨." />
          </div>
        </div>
      </section>

      {/* ---------- 템플릿 프리뷰 ---------- */}
      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Templates</span>
            <h2>업종·용도에 맞는 템플릿</h2>
            <p>현재는 <strong>회사 소개형</strong>을 우선 제공하며, 다른 유형도 순차 공개됩니다.</p>
          </div>
          <TemplatePreviewGrid />
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/templates" className="btn ghost">전체 템플릿 보기</Link>
          </div>
        </div>
      </section>

      {/* ---------- 사용 흐름 ---------- */}
      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">How it works</span>
            <h2>4단계로 나만의 사이트</h2>
          </div>
          <div className="mk-flow">
            <FlowStep n={1} title="가입" desc="이메일로 계정을 만들고 바로 시작합니다." />
            <FlowStep n={2} title="사이트 생성" desc="유형·페이지·기능을 고르고 콘텐츠를 입력합니다." />
            <FlowStep n={3} title="운영" desc="임시 URL 공유, 관리자에서 콘텐츠 수정." />
            <FlowStep n={4} title="성장 · export" desc="필요 시 내 서버로 이관하거나 유료 플랜으로 확장." />
          </div>
        </div>
      </section>

      {/* ---------- 사례 teaser ---------- */}
      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Use cases</span>
            <h2>이런 분들이 사용합니다</h2>
          </div>
          <div className="mk-grid-3">
            <article className="mk-usecase-card">
              <span className="tag">Company</span>
              <h3>스타트업 · 중소기업 홈페이지</h3>
              <p>회사 소개/서비스/문의로 구성된 기업 사이트를 몇 분 안에 구축.</p>
            </article>
            <article className="mk-usecase-card">
              <span className="tag">Creator</span>
              <h3>프리랜서 · 디자이너 포트폴리오</h3>
              <p>작업물을 보여주고, 문의 폼으로 프로젝트를 연결.</p>
            </article>
            <article className="mk-usecase-card">
              <span className="tag">Service</span>
              <h3>예약/신청이 필요한 로컬 비즈니스</h3>
              <p>예약 폼과 운영 시간을 공개하고 관리자에서 접수 처리.</p>
            </article>
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/use-cases" className="btn ghost">더 많은 사례 보기</Link>
          </div>
        </div>
      </section>

      {/* ---------- 요금 teaser ---------- */}
      <section className="mk-section alt">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Pricing</span>
            <h2>가볍게 시작하고 필요할 때 확장</h2>
            <p>Free 로 만들어 보고, 사업이 커지면 Pro · Business 로 전환하세요.</p>
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
            <h3>지금 바로 SiteForge 로 시작하세요</h3>
            <p>신용카드 없이 무료로 멀티페이지 사이트를 만들 수 있습니다.</p>
          </div>
          <div style={{ display: 'inline-flex', gap: 10 }}>
            <Link to="/signup" className="btn primary">무료로 시작하기</Link>
            <Link to="/templates" className="btn ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>템플릿 보기</Link>
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
  { id: 'company',   label: '회사 소개',   desc: '기업·서비스·문의 구성', mono: 'Co', enabled: true },
  { id: 'portfolio', label: '포트폴리오',  desc: '작업물 갤러리',         mono: 'Po', enabled: false },
  { id: 'blog',      label: '블로그',      desc: '글 발행 / 카테고리',    mono: 'Bl', enabled: false },
  { id: 'shop',      label: '쇼핑몰',      desc: '카탈로그 / 결제',       mono: 'Sh', enabled: false },
];
function TemplatePreviewGrid() {
  return (
    <div className="mk-grid-4">
      {TEMPLATE_PREVIEW.map((t) => (
        <article key={t.id} className="mk-template-card">
          <div className="mk-template-thumb">{t.mono}</div>
          <div className="mk-template-body">
            <div className="title">
              {t.label}
              {t.enabled
                ? <span className="badge success">지원</span>
                : <span className="badge">준비중</span>}
            </div>
            <p className="desc">{t.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
