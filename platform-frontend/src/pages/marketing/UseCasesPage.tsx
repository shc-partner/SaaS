const CASES = [
  {
    tag: 'YouTuber',
    title: '유튜브 채널 운영',
    desc: '영상 아이디어, 대본, 촬영일, 편집 마감, 업로드 일정을 한 워크스페이스에서 관리합니다.',
    bullets: ['9단계 제작 보드', '제목 후보와 썸네일 문구', '촬영·편집·업로드 캘린더'],
  },
  {
    tag: 'Streamer',
    title: '스트리밍 컨텐츠 운영',
    desc: '라이브 방송 주제와 클립 아이디어, 다시보기 편집 상태를 컨텐츠 단위로 묶어 추적합니다.',
    bullets: ['방송 아이디어 보관함', '클립·하이라이트 편집 메모', '라이브 일정 관리'],
  },
  {
    tag: 'Short-form',
    title: '숏폼 반복 제작',
    desc: '릴스, 쇼츠, 틱톡처럼 빠르게 반복되는 컨텐츠를 아이디어부터 예약 업로드까지 정리합니다.',
    bullets: ['짧은 훅과 자막 메모', '채널별 업로드 일정', '트렌드 태그 정리'],
  },
  {
    tag: 'Podcast',
    title: '팟캐스트 에피소드 관리',
    desc: '에피소드 주제, 녹음 일정, 편집 상태, 배포일을 월간 흐름으로 관리합니다.',
    bullets: ['에피소드 기획 카드', '녹음·편집 마감일', '참고 링크와 쇼노트'],
  },
  {
    tag: 'Blogger',
    title: '블로그·뉴스레터 운영',
    desc: '글감, 초안, 교정, 예약 배포을 컨텐츠 제작 흐름에 맞춰 관리합니다.',
    bullets: ['글감 보관함', 'SEO 키워드와 제목 후보', '배포 캘린더'],
  },
  {
    tag: 'Brand Team',
    title: '브랜드 컨텐츠팀',
    desc: '캠페인 컨텐츠의 담당자, 검토 상태, 채널별 배포 일정을 팀 관점으로 확인합니다.',
    bullets: ['캠페인별 컨텐츠 카드', '검토 상태와 편집 메모', '채널별 배포 일정'],
  },
  {
    tag: 'Solo Creator',
    title: '1인 크리에이터 운영',
    desc: '머릿속에 흩어진 아이디어와 작업 메모를 잃어버리지 않도록 가볍게 모아둡니다.',
    bullets: ['빠른 아이디어 저장', '우선순위와 태그', '오늘 해야 할 컨텐츠 확인'],
  },
  {
    tag: 'Content Studio',
    title: '소규모 제작 스튜디오',
    desc: '여러 채널의 컨텐츠 제작 상황을 워크스페이스별로 분리해 운영합니다.',
    bullets: ['채널 단위 워크스페이스', '제작 단계별 진행률', '월간 컨텐츠 일정'],
  },
];

export default function UseCasesPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Use cases</span>
          <h1 className="mk-page-hero-title">크리에이터 운영 방식에 맞게</h1>
          <p>
            CreatorDesk는 컨텐츠 아이디어부터 배포까지의 운영 흐름을 워크스페이스로 정리하는 SaaS입니다.
          </p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-grid-3">
            {CASES.map((item) => (
              <article key={item.title} className="mk-usecase-card">
                <span className="tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
