import type { HeroContent } from '../types';

interface Props { content: HeroContent; variant?: string }

export default function HeroSection({ content, variant }: Props) {
  const t  = content.title    || '여기에 사이트 이름이 표시됩니다';
  const s  = content.subtitle || '한 줄 소개를 입력하면 이 자리에 표시됩니다';
  const te = !content.title;
  const se = !content.subtitle;

  /* ② SaaS / 스타트업 — 좌측 텍스트 + 우측 대시보드 목업 + 하단 메트릭 스트립 */
  if (variant === 'saas-startup') {
    return (
      <section className="lp-hero lp-hero--saas">
        <div className="lp-saas-row">
          <div className="lp-hero__text">
            <h1 className={te ? 'lp-placeholder' : ''}>{t}</h1>
            <p  className={se ? 'lp-placeholder' : ''}>{s}</p>
            {content.cta && (
              <div className="lp-hero__ctas">
                <span className="lp-cta">{content.cta}</span>
                <span className="lp-cta lp-cta--ghost">무료로 시작</span>
              </div>
            )}
          </div>
          <div className="lp-hero__visual">
            <div className="lp-dashboard-mock">
              <div className="lp-dash-header"/>
              <div className="lp-dash-bars"><span/><span/><span/><span/><span/></div>
              <div className="lp-dash-metrics"><div/><div/><div/></div>
            </div>
          </div>
        </div>
        <div className="lp-saas-metrics">
          <div className="lp-saas-metric"><strong>12,000+</strong><span>활성 고객사</span></div>
          <div className="lp-saas-metric"><strong>99.9%</strong><span>업타임 보장</span></div>
          <div className="lp-saas-metric"><strong>4.9★</strong><span>고객 만족도</span></div>
          <div className="lp-saas-metric"><strong>2×</strong><span>생산성 향상</span></div>
        </div>
      </section>
    );
  }

  /* ③ 전문 서비스 — 좌측 소개 + 우측 전문가 프로필 카드 + 하단 서비스 카드 3개 */
  if (variant === 'professional-service') {
    return (
      <>
        <section className="lp-hero lp-hero--split lp-hero--professional">
          <div className="lp-hero__text">
            <h1 className={te ? 'lp-placeholder' : ''}>{t}</h1>
            <p  className={se ? 'lp-placeholder' : ''}>{s}</p>
            {content.cta && <span className="lp-cta">{content.cta}</span>}
          </div>
          <div className="lp-hero__visual">
            <div className="lp-profile-card">
              <div className="lp-profile-avatar"/>
              <div className="lp-profile-info">
                <strong>전문 컨설턴트</strong>
                <span className="lp-profile-role">15년 경력</span>
                <span className="lp-stars">★★★★★</span>
              </div>
            </div>
          </div>
        </section>
        <div className="lp-home-features">
          <div className="lp-home-feat-card">
            <div className="lp-home-feat-icon"/>
            <strong>전략 컨설팅</strong>
            <span>비즈니스 목표에 맞춘 전략 수립과 실행</span>
          </div>
          <div className="lp-home-feat-card">
            <div className="lp-home-feat-icon"/>
            <strong>교육 · 코칭</strong>
            <span>전문 지식 전수와 조직 역량 강화</span>
          </div>
          <div className="lp-home-feat-card">
            <div className="lp-home-feat-icon"/>
            <strong>운영 지원</strong>
            <span>지속적인 성과 관리와 개선 파트너십</span>
          </div>
        </div>
      </>
    );
  }

  /* ④ 제조 / 산업 — 좌측 정렬 히어로 + 우측 설비 비주얼 블록 + 하단 공정 카드 3개 */
  if (variant === 'manufacturing') {
    return (
      <>
        <section className="lp-hero lp-hero--industrial">
          <div className="lp-hero__text">
            <span className="lp-kicker">제조 전문 기업</span>
            <h1 className={te ? 'lp-placeholder' : ''}>{t}</h1>
            <p  className={se ? 'lp-placeholder' : ''}>{s}</p>
            {content.cta && <span className="lp-cta">{content.cta}</span>}
          </div>
          <div className="lp-hero__visual lp-industrial-visual">
            <div className="lp-industrial-block">
              <span/><span/><span/>
            </div>
          </div>
        </section>
        <div className="lp-home-features lp-home-features--mfg">
          <div className="lp-home-feat-card">
            <div className="lp-home-feat-icon"/>
            <strong>공정 관리</strong>
            <span>ISO 9001 인증 품질 공정 운영</span>
          </div>
          <div className="lp-home-feat-card">
            <div className="lp-home-feat-icon"/>
            <strong>납기 준수</strong>
            <span>98% 이상 정시 납품 실적</span>
          </div>
          <div className="lp-home-feat-card">
            <div className="lp-home-feat-icon"/>
            <strong>기술 노하우</strong>
            <span>30년 제조업 전문 경험</span>
          </div>
        </div>
      </>
    );
  }

  /* ⑤ 로컬 비즈니스 — 중앙 히어로 + 하단 영업정보 3-카드 */
  if (variant === 'local-business') {
    return (
      <section className="lp-hero lp-hero--local">
        <h1 className={te ? 'lp-placeholder' : ''}>{t}</h1>
        <p  className={se ? 'lp-placeholder' : ''}>{s}</p>
        {content.cta && (
          <div className="lp-hero__ctas">
            <span className="lp-cta">{content.cta}</span>
            <span className="lp-cta lp-cta--ghost">전화하기</span>
          </div>
        )}
        <div className="lp-local-info">
          <div className="lp-local-card"><strong>영업시간</strong><span>평일 09:00 — 18:00</span></div>
          <div className="lp-local-card"><strong>위치</strong><span>서울특별시 ○○구</span></div>
          <div className="lp-local-card"><strong>예약</strong><span>전화 또는 온라인</span></div>
        </div>
      </section>
    );
  }

  /* ① 기본 기업형 (basic-corporate + fallback) — 다크 히어로 중앙 정렬 + 하단 특징 카드 3개 */
  return (
    <>
      <section className="lp-hero">
        <h1 className={te ? 'lp-placeholder' : ''}>{t}</h1>
        <p  className={se ? 'lp-placeholder' : ''}>{s}</p>
        {content.cta && <span className="lp-cta">{content.cta}</span>}
      </section>
      <div className="lp-home-features">
        <div className="lp-home-feat-card">
          <div className="lp-home-feat-icon"/>
          <strong>신뢰와 경험</strong>
          <span>오랜 경험으로 쌓은 검증된 전문성</span>
        </div>
        <div className="lp-home-feat-card">
          <div className="lp-home-feat-icon"/>
          <strong>맞춤 솔루션</strong>
          <span>고객 상황에 최적화된 제안과 실행</span>
        </div>
        <div className="lp-home-feat-card">
          <div className="lp-home-feat-icon"/>
          <strong>신속한 지원</strong>
          <span>언제든지 함께하는 든든한 파트너</span>
        </div>
      </div>
    </>
  );
}
