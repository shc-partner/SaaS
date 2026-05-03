import AuthAwareCta from '../../components/auth/AuthAwareCta';

// /features — 기능 소개 페이지.
// SaaS 제품 기능 소개 톤. 개발자 문서 아님.
export default function FeaturesPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Product</span>
          <h1 style={{ fontSize: 40 }}>아이디어부터 업로드까지, 한곳에서</h1>
          <p>CreatorDesk 는 콘텐츠 제작 흐름 전체를 워크스페이스 하나로 관리합니다. 아이디어가 떠오른 순간부터 업로드 완료까지, 흩어진 메모·대본·일정을 하나의 보드에서 추적하세요.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-grid-2">
            <Block
              eyebrow="Idea Vault"
              title="아이디어 보관함"
              desc="떠오른 아이디어를 바로 저장하고, 우선순위·태그·참고 링크를 붙여 관리합니다. 준비가 되면 콘텐츠 아이디어로 전환하세요."
              bullets={['빠른 메모 → 아이디어 저장', '우선순위 · 태그 · 출처 기록', '아이디어 → 콘텐츠 아이템 전환']}
            />
            <Block
              eyebrow="Content Board"
              title="콘텐츠 상태 보드"
              desc="아이디어 · 기획 · 대본 · 촬영 · 편집 · 검수 · 썸네일 · 예약 · 발행까지 9단계 상태를 칸반 보드로 한눈에 파악합니다."
              bullets={['9단계 상태 머신 (idea → published)', '칸반 보드 + 목록 뷰 전환', '상태 변경 이력 기록']}
            />
            <Block
              eyebrow="Production Assets"
              title="제작 자산 관리"
              desc="콘텐츠별로 대본, 제목 후보, 썸네일 문구, 편집 메모, 참고 링크를 한 카드에 모아 관리합니다."
              bullets={['대본 직접 작성 · 저장', '제목 후보 · 썸네일 문구 후보 목록', '편집 메모 · 참고 링크']}
            />
            <Block
              eyebrow="Calendar"
              title="월간 콘텐츠 캘린더"
              desc="촬영일 · 편집 마감일 · 업로드 예정일을 월간 캘린더로 확인합니다. 겹치는 일정을 한눈에 파악해 제작 흐름을 조율하세요."
              bullets={['촬영 · 편집마감 · 업로드 일정 통합', '월간 그리드 뷰', '이벤트 유형별 색상 구분']}
            />
            <Block
              eyebrow="Workspace"
              title="채널별 워크스페이스"
              desc="유튜브 채널, 틱톡 계정, 블로그 등 채널 단위로 워크스페이스를 분리해 운영합니다. 채널별 목적·포맷·톤앤매너를 설정하세요."
              bullets={['채널 단위 워크스페이스 생성', '채널 목적 · 콘텐츠 포맷 설정', '워크스페이스별 독립 데이터']}
            />
            <Block
              eyebrow="Roadmap"
              title="팀 협업 · 성과 기록"
              desc="팀원 초대, 담당자 배정, 검수 흐름과 콘텐츠별 성과 기록은 v2 로드맵에 포함되어 있습니다."
              bullets={['팀원 역할 초대 (owner / editor / viewer)', '콘텐츠 담당자 배정', '조회수 · 구독 증감 성과 기록']}
            />
          </div>

          <div className="mk-cta-band" style={{ marginTop: 56 }}>
            <div>
              <h3>무료로 워크스페이스를 만들어보세요</h3>
              <p>첫 워크스페이스는 무료입니다. 지금 바로 콘텐츠 제작 흐름을 정리하세요.</p>
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
