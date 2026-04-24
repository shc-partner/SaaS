import { Link } from 'react-router-dom';
import { SITE_TYPE_OPTIONS } from '../../features/siteBuilder/types';

// /templates — 지원 템플릿/사이트 유형 목록.
// SITE_TYPE_OPTIONS 를 단일 출처로 사용해 빌더와 마케팅 페이지가 어긋나지 않게 한다.
export default function TemplatesPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Templates</span>
          <h1 style={{ fontSize: 40 }}>업종·용도별 사이트 템플릿</h1>
          <p>회사 소개형부터 시작해 포트폴리오·블로그·쇼핑몰·예약 등 다양한 유형이 순차 공개됩니다.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-grid-4">
            {SITE_TYPE_OPTIONS.map((t) => (
              <article key={t.id} className="mk-template-card">
                <div className="mk-template-thumb">{t.label.slice(0, 2)}</div>
                <div className="mk-template-body">
                  <div className="title">
                    {t.label}
                    <span className={`pricing pricing-${t.pricing}`}>{t.pricing === 'free' ? '무료' : '유료'}</span>
                  </div>
                  <p className="desc">{t.desc}</p>
                  <div className="status">
                    {t.enabled
                      ? <span className="badge success">지금 지원</span>
                      : <span className="badge">준비중</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mk-cta-band" style={{ marginTop: 56 }}>
            <div>
              <h3>회사 소개형부터 시작해 보세요</h3>
              <p>가장 먼저 공개된 템플릿으로 바로 사이트를 생성할 수 있습니다.</p>
            </div>
            <Link to="/signup" className="btn primary">무료로 시작하기</Link>
          </div>
        </div>
      </section>
    </>
  );
}
