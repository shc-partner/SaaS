import AuthAwareCta from '../../components/auth/AuthAwareCta';
import { TEMPLATE_OPTIONS } from '../../features/workspaces/constants';

const TEMPLATE_THUMB_LABELS: Record<string, string> = {
  'youtube-channel': 'youtube',
  streaming: 'streaming',
  shortform: 'shortform',
  'blog-newsletter': 'blog',
  'brand-team': 'brand',
};

export default function TemplatesPage() {
  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Templates</span>
          <h1 style={{ fontSize: 40 }}>콘텐츠 운영 템플릿</h1>
          <p>채널 유형에 맞는 보드, 관리 항목, 캘린더 흐름으로 워크스페이스를 빠르게 시작합니다.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-section-inner">
          <div className="mk-grid-4">
            {TEMPLATE_OPTIONS.map((template) => (
              <article key={template.id} className="mk-template-card">
                <div className="mk-template-thumb">{TEMPLATE_THUMB_LABELS[template.id] ?? template.id}</div>
                <div className="mk-template-body">
                  <div className="title">
                    {template.label}
                    <span className="badge success">MVP</span>
                  </div>
                  <p className="desc">{template.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mk-cta-band" style={{ marginTop: 56 }}>
            <div>
              <h3>운영 목적에 맞는 워크스페이스를 만들어보세요</h3>
              <p>템플릿을 선택하면 기본 보드와 관리 항목이 자동으로 구성됩니다.</p>
            </div>
            <AuthAwareCta intent="template" className="btn primary">템플릿으로 시작하기</AuthAwareCta>
          </div>
        </div>
      </section>
    </>
  );
}
