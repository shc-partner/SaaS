import type { ServicesContent } from '../types';

interface Props { content: ServicesContent }

export default function ServicesSection({ content }: Props) {
  return (
    <section className="lp-section lp-services">
      <h2>{content.heading}</h2>
      <p className="lead">{content.lead}</p>
      <div className="lp-services-grid">
        {content.items.map((it) => (
          <div className="lp-service-card" key={it.title}>
            <div className="lp-icon" />
            <strong>{it.title}</strong>
            <p>{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
