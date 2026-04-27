// /use-cases — 활용 예시. mock 사례 카드.
const CASES = [
  { tag: '기업',       title: '스타트업 홈페이지',   desc: '회사 소개/서비스/문의로 구성된 B2B 사이트.',    bullets: ['회사 소개 페이지', '제품·서비스 소개', '문의 폼'] },
  { tag: '크리에이터', title: '포트폴리오 사이트',    desc: '프로젝트/작업물을 갤러리 형태로 소개.',         bullets: ['작업물 갤러리', '연락·협업 문의', '블로그 teaser'] },
  { tag: '미디어',     title: '블로그 · 뉴스',       desc: '카테고리 기반 콘텐츠 발행.',                     bullets: ['포스트 관리', '카테고리/태그', '구독 placeholder'] },
  { tag: '커머스',     title: '쇼핑몰',              desc: '상품 카탈로그 + 결제(로드맵).',                  bullets: ['카탈로그', '장바구니', '결제 연동'] },
  { tag: '서비스',     title: '예약 · 신청',         desc: '시간/슬롯 단위 예약 폼과 상태 관리.',           bullets: ['예약 폼', '관리자 승인', '알림 hook'] },
  { tag: '내부도구',   title: '사내 업무 관리',      desc: '게시판·일정·문서 등 내부 도구.',                 bullets: ['게시판', '일정 공유', '문서 보관'] },
  { tag: '회원',       title: '회원 전용 사이트',    desc: '로그인한 회원에게만 콘텐츠 제공.',               bullets: ['회원 가입/로그인', '권한별 열람', '구독 관리'] },
  { tag: '교육',       title: '강의 · 교육 사이트',  desc: '강의 콘텐츠 제공과 수강 관리.',                   bullets: ['강의 목록', '수강 진도', '과제/퀴즈'] },
];

export default function UseCasesPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Use cases</span>
          <h1 style={{ fontSize: 40 }}>CreatorDesk, 이런 분들이 씁니다</h1>
          <p>8가지 대표적인 활용 시나리오. 지금은 회사 소개형부터 시작해, 필요에 따라 유형이 확대됩니다.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-grid-3">
            {CASES.map((c) => (
              <article key={c.title} className="mk-usecase-card">
                <span className="tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul>{c.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
