import { Link } from 'react-router-dom';
import AuthAwareCta from '../../components/auth/AuthAwareCta';

const REASON_CARDS = [
  {
    title: '트렌드를 바로 기획으로',
    desc: 'YouTube 인기 영상과 검색어를 확인하고 AI 추천으로 컨텐츠 아이디어를 빠르게 정리합니다.',
    visual: 'AI',
  },
  {
    title: '작업 요청까지 한곳에서',
    desc: '요청자, 작업자, 검수자를 지정하고 요청, 작업중, 작업완료 상태를 추적합니다.',
    visual: 'TASK',
  },
  {
    title: '팀 기준으로 분리되는 공간',
    desc: '워크스페이스별 컨텐츠, 아이디어, 트렌드 카테고리, 멤버 권한을 독립적으로 관리합니다.',
    visual: 'TEAM',
  },
  {
    title: '일정과 제작 상태 연결',
    desc: '시작일자, 마감일자, 제작 보드, 캘린더를 컨텐츠 단위로 연결해 흐름을 놓치지 않습니다.',
    visual: 'CAL',
  },
];

const WORKFLOW_CARDS = [
  { title: '트렌드 탐색', desc: '검색어와 카테고리로 최근 인기 영상을 찾고 AI 아이디어를 생성합니다.' },
  { title: '아이디어 저장', desc: '괜찮은 주제를 아이디어 노트에 저장하고 우선순위와 태그를 붙입니다.' },
  { title: '컨텐츠 등록', desc: '아이디어를 컨텐츠로 전환하고 제작 보드에서 상태를 관리합니다.' },
  { title: '작업 요청', desc: '썸네일, 편집, 검수 등 필요한 작업을 담당자에게 요청합니다.' },
  { title: '캘린더 운영', desc: '시작일자와 마감일자를 기준으로 월간 제작 일정을 확인합니다.' },
  { title: '팀 관리', desc: '워크스페이스 생성자는 관리자, 나머지 멤버는 일반 권한으로 운영합니다.' },
];

const TEMPLATE_PREVIEW = [
  { id: 'youtube-channel', label: 'YouTube 채널 운영', desc: '영상 아이디어, 대본, 편집, 업로드 일정 관리', mono: 'YT', enabled: true },
  { id: 'streaming', label: '스트리밍 운영', desc: '방송 주제, 클립 아이디어, 다시보기 편집 관리', mono: 'ST', enabled: true },
  { id: 'shortform', label: '숏폼 제작', desc: '쇼츠, 릴스, 틱톡 반복 제작 루틴 관리', mono: 'SF', enabled: true },
  { id: 'team', label: '팀 컨텐츠 제작', desc: '작업 요청, 검수자, 권한 관리가 필요한 팀 운영', mono: 'TM', enabled: true },
];

const QUICK_LINKS = ['모든 크리에이터', '숏폼 팀', '라이브 스트리머', '채널 매니저', '제작 대행사'];

const PROMO_CARDS = [
  {
    tag: 'AI Trend',
    title: '인기 영상 흐름을 아이디어로 전환',
    desc: '검색어와 카테고리를 저장하고, 반복되는 소재를 컨텐츠 후보로 빠르게 정리합니다.',
    cta: '트렌드 기능 보기',
    to: '/features',
    tone: 'sunrise',
  },
  {
    tag: 'Production',
    title: '기획, 편집, 검수를 하나의 보드에서',
    desc: '9단계 제작 상태와 작업 요청을 연결해 업로드 전 병목을 줄입니다.',
    cta: '운영 흐름 보기',
    to: '/use-cases',
    tone: 'blue',
  },
  {
    tag: 'Workspace',
    title: '채널 단위로 분리되는 운영 공간',
    desc: '아이디어, 일정, 자산, 권한을 워크스페이스 기준으로 관리합니다.',
    cta: '템플릿 보기',
    to: '/templates',
    tone: 'green',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mk-home-hero">
        <div className="mk-home-hero-inner">
          <div className="mk-home-hero-copy">
            <span className="mk-eyebrow">Creator Workspace</span>
            <h1>
              콘텐츠 기획부터 업로드까지
              <br />
              크리에이터 운영의 모든 흐름을
              <br />
              한 화면에서 관리하세요
            </h1>
            <p>
              콘텐츠 아이디어, 제작 일정, 진행 상태, 업로드 계획을 한 화면에서
              정리하고 관리하세요.
            </p>
            <div className="mk-hero-ctas">
              <AuthAwareCta intent="start" className="btn primary">시작하기</AuthAwareCta>
              <Link to="/features" className="btn ghost">기능 둘러보기</Link>
            </div>
            <div className="mk-hero-hint">무료로 시작 · YouTube 트렌드 탐색 · 팀 작업 관리 지원</div>
          </div>

          <WorkspaceHeroPreview />
        </div>
      </section>

      <section className="mk-home-links" aria-label="CreatorDesk 이용 대상">
        <div className="mk-home-links-inner">
          <strong>CreatorDesk 이용 대상:</strong>
          <div>
            {QUICK_LINKS.map((item) => (
              <Link to="/use-cases" key={item}>{item}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-home-promos">
        <div className="mk-section-inner">
          <div className="mk-home-promo-grid">
            {PROMO_CARDS.map((card) => (
              <article className={`mk-home-promo-card ${card.tone}`} key={card.title}>
                <span>{card.tag}</span>
                <h2>{card.title}</h2>
                <p>{card.desc}</p>
                <Link to={card.to}>{card.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-home-reasons">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Why CreatorDesk</span>
            <h2>크리에이터 팀이 매일 반복하는 일을 한 화면에 모았습니다</h2>
            <p>트렌드를 보고, 아이디어를 정리하고, 컨텐츠로 등록한 뒤 작업자와 검수자까지 지정하는 흐름입니다.</p>
          </div>
          <div className="mk-home-reason-grid">
            {REASON_CARDS.map((card) => (
              <article className="mk-home-reason-card" key={card.title}>
                <div className="mk-home-reason-visual">{card.visual}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-home-apps">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Workspace Flow</span>
            <h2>컨텐츠 운영에 필요한 주요 화면</h2>
            <p>운영 도구를 따로 오가지 않고 워크스페이스 안에서 이어서 처리합니다.</p>
          </div>
          <div className="mk-home-app-grid">
            {WORKFLOW_CARDS.map((card, index) => (
              <article className="mk-home-app-card" key={card.title}>
                <div className="mk-home-app-thumb">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-home-templates">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Templates</span>
            <h2>채널 운영 방식에 맞는 워크스페이스로 시작하세요</h2>
            <p>생성 단계에서 고른 템플릿과 관리 항목이 보드, 메뉴, 캘린더 구성에 반영됩니다.</p>
          </div>
          <TemplatePreviewGrid />
        </div>
      </section>

      <section className="mk-home-final">
        <div className="mk-home-final-inner">
          <div>
            <span className="mk-eyebrow">Start CreatorDesk</span>
            <h2>트렌드가 보이면 바로 컨텐츠 기획으로 바꾸세요</h2>
            <p>아이디어, 작업 요청, 제작 상태, 팀 권한까지 CreatorDesk 워크스페이스에서 함께 관리할 수 있습니다.</p>
          </div>
          <AuthAwareCta intent="start" className="btn primary">무료로 시작하기</AuthAwareCta>
        </div>
      </section>

      <div className="mk-home-sticky-cta" aria-label="CreatorDesk 시작하기">
        <div>
          <strong>CreatorDesk</strong>
          <span>AI 트렌드 분석부터 팀 컨텐츠 제작 관리까지</span>
        </div>
        <AuthAwareCta intent="start" className="btn primary">워크스페이스 만들기</AuthAwareCta>
      </div>
    </>
  );
}

function WorkspaceHeroPreview() {
  return (
    <div className="mk-home-workspace-preview" aria-label="CreatorDesk 대시보드 미리보기">
      <div className="mk-home-workspace-head">
        <div>
          <span>CreatorDesk</span>
          <strong>오늘의 운영 보드</strong>
        </div>
        <small>LIVE</small>
      </div>
      <div className="mk-home-workspace-body">
        <section className="mk-home-dashboard-card schedule">
          <div className="mk-home-dashboard-card-head">
            <span>오늘의 콘텐츠 일정</span>
            <b>3건</b>
          </div>
          <div className="mk-home-schedule-list">
            <p><i /> 10:00 쇼츠 아이디어 정리</p>
            <p><i /> 14:30 썸네일 시안 검토</p>
          </div>
        </section>

        <section className="mk-home-dashboard-card progress">
          <div className="mk-home-dashboard-card-head">
            <span>제작 진행률</span>
            <b>72%</b>
          </div>
          <div className="mk-home-progress-track">
            <span />
          </div>
          <div className="mk-home-progress-steps">
            <i />
            <i />
            <i />
          </div>
        </section>

        <section className="mk-home-dashboard-card checklist">
          <div className="mk-home-dashboard-card-head">
            <span>업로드 체크리스트</span>
          </div>
          <ul>
            <li><i /> 제목 후보 확정</li>
            <li><i /> 설명란 링크 확인</li>
            <li className="muted"><i /> 예약 업로드</li>
          </ul>
        </section>

        <section className="mk-home-dashboard-card memo">
          <div className="mk-home-dashboard-card-head">
            <span>트렌드 영상 메모</span>
          </div>
          <p>최근 48시간 내 반응이 오른 주제를 다음 기획 후보로 저장했습니다.</p>
        </section>
      </div>
    </div>
  );
}

function TemplatePreviewGrid() {
  return (
    <div className="mk-home-template-grid">
      {TEMPLATE_PREVIEW.map((template) => (
        <article key={template.id} className="mk-template-card mk-home-template-card">
          <div className="mk-template-thumb">{template.mono}</div>
          <div className="mk-template-body">
            <div className="title">
              {template.label}
              {template.enabled && <span className="badge success">추천</span>}
            </div>
            <p className="desc">{template.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
