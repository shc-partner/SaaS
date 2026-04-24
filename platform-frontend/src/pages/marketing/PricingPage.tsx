import { Link } from 'react-router-dom';

// /pricing — 요금제 비교.
// 실제 과금 로직은 없음. 플랜 이름/가격/기능 매트릭스만 mock.
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₩0',
    period: '/ 영구 무료',
    desc: '처음 사이트를 만들어 보고 싶을 때.',
    cta: '무료로 시작하기',
    ctaTo: '/signup',
    featured: false,
    items: [
      { on: true,  text: '사이트 최대 1개 생성' },
      { on: true,  text: '회사 소개형 템플릿' },
      { on: true,  text: '임시 URL (/sites/:slug)' },
      { on: true,  text: '관리자 페이지 기본' },
      { on: false, text: '커스텀 도메인' },
      { on: false, text: 'export' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₩19,000',
    period: '/ 월',
    desc: '본격 운영하는 1인 · 팀 단위.',
    cta: 'Pro 시작하기',
    ctaTo: '/signup',
    featured: true,
    items: [
      { on: true,  text: '사이트 최대 5개 생성' },
      { on: true,  text: '모든 무료 템플릿' },
      { on: true,  text: '커스텀 도메인 연결' },
      { on: true,  text: '관리자 고급 편집기' },
      { on: true,  text: 'export (정적 HTML)' },
      { on: false, text: '전용 DB (dedicated)' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: '문의',
    period: '/ 월',
    desc: '조직 단위 운영 · 엔터프라이즈.',
    cta: '도입 문의',
    ctaTo: '/contact',
    featured: false,
    items: [
      { on: true,  text: '사이트 무제한' },
      { on: true,  text: '유료 템플릿 포함' },
      { on: true,  text: '커스텀 도메인 · SSL 자동화' },
      { on: true,  text: '전용 DB (dedicated)' },
      { on: true,  text: 'SLA · 우선 지원' },
      { on: true,  text: 'SSO / 권한 관리' },
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Pricing</span>
          <h1 style={{ fontSize: 40 }}>간단한 3단계 요금제</h1>
          <p>Free 로 만들고, 필요해지면 Pro · Business 로 자연스럽게 확장하세요.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-pricing-grid">
            {PLANS.map((p) => (
              <article key={p.id} className={`mk-plan ${p.featured ? 'featured' : ''}`}>
                <span className="mk-plan-name">{p.name}</span>
                <div>
                  <span className="mk-plan-price">{p.price}<small>{p.period}</small></span>
                </div>
                <p className="mk-plan-desc">{p.desc}</p>
                <ul>
                  {p.items.map((it, i) => (
                    <li key={i} className={it.on ? '' : 'off'}>{it.text}</li>
                  ))}
                </ul>
                <Link to={p.ctaTo} className={`btn ${p.featured ? 'primary' : 'ghost'} btn-block`}>{p.cta}</Link>
              </article>
            ))}
          </div>

          <p className="mk-hero-hint" style={{ textAlign: 'center', marginTop: 28 }}>
            모든 플랜은 언제든 변경·해지할 수 있습니다. 과금은 실제 결제 연동 전까지 mock 표기입니다.
          </p>
        </div>
      </section>
    </>
  );
}
