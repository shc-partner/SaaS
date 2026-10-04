import { Link } from 'react-router-dom';
import AuthAwareCta from '../../components/auth/AuthAwareCta';
import type { CtaIntent } from '../../components/auth/AuthAwareCta';

type PlanCta =
  | { intent: CtaIntent; href?: never }
  | { href: string; intent?: never };

interface Plan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  desc: string;
  cta: string;
  ctaTarget: PlanCta;
  featured: boolean;
  metrics: { label: string; value: string }[];
  items: { on: boolean; text: string }[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '0원',
    period: '/ 워크스페이스',
    desc: '1인이 컨텐츠를 가볍게 관리할 수 있는 플랜입니다.',
    cta: '무료로 시작하기',
    ctaTarget: { intent: 'start' },
    featured: false,
    metrics: [
      { label: '워크스페이스', value: '1개' },
      { label: 'AI 컨텐츠 추천', value: '계정당 5회/일' },
      { label: '팀원', value: '1인' },
    ],
    items: [
      { on: true, text: '제작 보드, 캘린더, 컨텐츠 목록' },
      { on: true, text: '아이디어 노트와 자료 보관함' },
      { on: true, text: 'YouTube 트렌드 탐색' },
      { on: true, text: 'AI 아이디어 추천 체험 한도' },
      { on: false, text: '팀원 초대와 역할 관리' },
      { on: false, text: '워크스페이스별 확장 한도' },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    badge: '추천',
    price: '9,900원',
    period: '/ 워크스페이스·월',
    desc: '소규모 팀이 컨텐츠를 함께 관리하기 위한 플랜입니다.',
    cta: 'Starter 플랜 구독',
    ctaTarget: { intent: 'workspaceNew' },
    featured: true,
    metrics: [
      { label: '워크스페이스', value: '구독당 1개' },
      { label: 'AI 컨텐츠 추천', value: '30회/일' },
      { label: '팀원', value: '최대 3명' },
    ],
    items: [
      { on: true, text: 'Free의 모든 기능' },
      { on: true, text: '워크스페이스 기준 AI 추천 한도' },
      { on: true, text: '팀원 초대와 기본 역할 관리' },
      { on: true, text: '컨텐츠·아이디어 운영량 확장' },
      { on: true, text: '트렌드 기반 기획안 저장' },
      { on: false, text: '고급 권한과 운영 리포트' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29,000원',
    period: '/ 워크스페이스·월',
    desc: '대형 팀이 컨텐츠 제작과 운영을 함께 관리하기 위한 플랜입니다.',
    cta: 'Pro 플랜 구독',
    ctaTarget: { intent: 'workspaceNew' },
    featured: false,
    metrics: [
      { label: '워크스페이스', value: '구독당 1개' },
      { label: 'AI 컨텐츠 추천', value: '100회/일' },
      { label: '팀원', value: '최대 10명' },
    ],
    items: [
      { on: true, text: 'Starter의 모든 기능' },
      { on: true, text: '담당자·제작 흐름 기반 운영' },
      { on: true, text: '팀 단위 컨텐츠 관리' },
      { on: true, text: 'AI 추천 사용량 확대' },
      { on: true, text: '워크스페이스 운영 통계 준비' },
      { on: false, text: '전담 지원과 맞춤 계약' },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: '맞춤 견적',
    period: '/ 조직 단위',
    desc: '기업형 조직 운영에 맞춘 맞춤형 플랜입니다.',
    cta: '도입 문의',
    ctaTarget: { href: '/contact' },
    featured: false,
    metrics: [
      { label: '워크스페이스', value: '협의' },
      { label: 'AI 컨첸츠 추천', value: '300회/일+' },
      { label: '팀원', value: '협의' },
    ],
    items: [
      { on: true, text: 'Pro의 모든 기능' },
      { on: true, text: '조직별 워크스페이스 관리' },
      { on: true, text: '고급 권한 관리 준비' },
      { on: true, text: '사용량과 한도 별도 설정' },
      { on: true, text: '온보딩과 운영 컨설팅' },
      { on: true, text: '맞춤 계약과 지원' },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mk-pricing-hero">
        <div className="mk-pricing-hero-inner">
          <span className="mk-eyebrow">Pricing</span>
          <h1 className="mk-page-hero-title">팀 규모에 맞게 확장하세요.</h1>
          <p>
            CreatorDesk의 가격 정책은 채널 운영 단위인 워크스페이스를 기준으로 설계됩니다.
            AI 추천, 팀원, 컨텐츠 운영량을 플랜에 따라 단계적으로 확장할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mk-section mk-pricing-section">
        <div className="mk-section-inner">
          <div className="mk-pricing-grid mk-pricing-grid-4">
            {PLANS.map((plan) => (
              <article key={plan.id} className={`mk-plan ${plan.featured ? 'featured' : ''}`}>
                <div className="mk-plan-top">
                  <span className="mk-plan-name">{plan.name}</span>
                  {plan.badge && <span className="mk-plan-badge">{plan.badge}</span>}
                </div>
                <div>
                  <span className="mk-plan-price">{plan.price}<small>{plan.period}</small></span>
                </div>
                <p className="mk-plan-desc">{plan.desc}</p>

                <div className="mk-plan-metrics">
                  {plan.metrics.map((metric) => (
                    <div key={metric.label}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>

                <ul>
                  {plan.items.map((item) => (
                    <li key={item.text} className={item.on ? '' : 'off'}>{item.text}</li>
                  ))}
                </ul>

                {plan.ctaTarget.intent ? (
                  <AuthAwareCta intent={plan.ctaTarget.intent} className={`btn ${plan.featured ? 'primary' : 'ghost'} btn-block`}>
                    {plan.cta}
                  </AuthAwareCta>
                ) : (
                  <Link to={plan.ctaTarget.href} className={`btn ${plan.featured ? 'primary' : 'ghost'} btn-block`}>
                    {plan.cta}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section alt mk-pricing-policy-section">
        <div className="mk-section-inner">
          <div className="mk-section-head">
            <span className="mk-eyebrow">Policy</span>
            <h2>권한과 사용량은 워크스페이스에 귀속됩니다.</h2>
            <p>
              팀원이 같은 워크스페이스에서 작업할 때 동일한 플랜 한도를 공유하고,
              남용 방지를 위해 계정별 보조 제한을 함께 둘 수 있습니다.
            </p>
          </div>

          <div className="mk-pricing-policy-grid">
            <article>
              <strong>워크스페이스 구독</strong>
              <p>채널 또는 제작팀 단위로 플랜을 적용합니다. 팀원이 바뀌어도 운영 데이터와 권한은 워크스페이스에 남습니다.</p>
            </article>
            <article>
              <strong>AI 추천 한도</strong>
              <p>무료 플랜은 계정당 5회/일로 시작하고, 유료 플랜에서는 워크스페이스 기준 한도로 확장합니다.</p>
            </article>
            <article>
              <strong>팀 협업 확장</strong>
              <p>Starter부터 팀원을 초대하고, Pro 이상에서 역할과 운영 리포트 같은 고급 기능을 확장할 수 있습니다.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
