import AuthAwareCta from '../../components/auth/AuthAwareCta';

// /features — 기능 소개 페이지.
// SaaS 제품 기능 소개 톤. 개발자 문서 아님.
export default function FeaturesPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Product</span>
          <h1 style={{ fontSize: 40 }}>제작부터 운영·이관까지, 한곳에서</h1>
          <p>CreatorDesk 는 워크스페이스 생성에서 끝나지 않습니다. 만든 뒤에도 계속 쓰이는 SaaS 가 되도록 설계되어 있습니다.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-grid-2">
            <Block
              eyebrow="Site Builder"
              title="사이트 빌더"
              desc="유형 선택 → 기본 정보 → 페이지 선택 → 기능 선택 → 페이지별 콘텐츠 입력 → 결과 확인 순서로 진행됩니다. 좌측 실시간 미리보기에서 바로 결과를 보며 구성할 수 있습니다."
              bullets={['회사 소개/포트폴리오 등 8종 유형 준비', '홈 + 회사소개 + 서비스 + 문의 등 개별 페이지 생성', 'PC/모바일 뷰 실시간 스위칭']}
            />
            <Block
              eyebrow="Admin"
              title="관리자 운영 기능"
              desc="만든 사이트를 실제로 운영할 수 있는 관리자 화면이 함께 생성됩니다. 대시보드 · 콘텐츠 · 문의 · 공개 상태 4영역으로 구성됩니다."
              bullets={['페이지별 텍스트/이미지/섹션 편집', '방문자 문의 관리', '사이트 공개/비공개 전환']}
            />
            <Block
              eyebrow="Page & Content"
              title="페이지 · 콘텐츠 관리"
              desc="사용자가 선택한 페이지는 각각 독립 라우트와 URL 을 가진 진짜 웹페이지로 생성됩니다. 하나의 긴 랜딩 페이지가 아닙니다."
              bullets={['/about, /services, /contact 개별 경로', '페이지 단위 콘텐츠 저장 구조', '네비게이션은 실제 라우터 기반 이동']}
            />
            <Block
              eyebrow="Multi-tenant"
              title="멀티테넌트 운영 구조"
              desc="한 인프라 위에서 수많은 고객 사이트를 안전하게 격리합니다. site_id 단위의 데이터 스코프로 설계되어, 커질수록 깔끔하게 확장됩니다."
              bullets={['site_id 기반 테넌트 격리', '향후 dedicated DB 전환 가능', '플랫폼 공통 업데이트 적용']}
            />
            <Block
              eyebrow="Export"
              title="Export 가능한 구조"
              desc="SaaS 안에서 운영하다가 필요해지면 자기 서버로 산출물을 이관할 수 있는 경로를 열어둡니다."
              bullets={['렌더러는 플랫폼/공개/export 3컨텍스트 공용', '정적 HTML 출력 경로 (로드맵)']}
            />
            <Block
              eyebrow="Roadmap"
              title="커스텀 도메인 · 엔터프라이즈"
              desc="장기적으로 커스텀 도메인·SSL 자동화·전용 DB 분리 플랜을 제공할 예정입니다."
              bullets={['커스텀 도메인 연결', 'SSL 자동 프로비저닝', '엔터프라이즈 전용 DB']}
            />
          </div>

          <div className="mk-cta-band" style={{ marginTop: 56 }}>
            <div>
              <h3>지금 가장 확실한 1종부터 시작</h3>
              <p>회사 소개형 사이트는 바로 만들 수 있습니다. 나머지 유형은 순차 공개됩니다.</p>
            </div>
            <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ eyebrow, title, desc, bullets }: { eyebrow: string; title: string; desc: string; bullets: string[] }) {
  return (
    <article className="mk-card">
      <span className="mk-eyebrow" style={{ display: 'block', marginBottom: 8 }}>{eyebrow}</span>
      <h3 style={{ fontSize: 18 }}>{title}</h3>
      <p style={{ marginTop: 8 }}>{desc}</p>
      <ul style={{ listStyle: 'disc', paddingLeft: 20, marginTop: 14, color: 'var(--text-2)', fontSize: 13 }}>
        {bullets.map((b) => <li key={b} style={{ marginBottom: 6 }}>{b}</li>)}
      </ul>
    </article>
  );
}
