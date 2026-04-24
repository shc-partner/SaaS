import type { AboutContent } from '../types';

interface Props { content: AboutContent; brand: string }

export default function AboutSection({ content, brand }: Props) {
  const industry = content.industry || '업종 미지정';
  return (
    <section className="lp-section lp-about">
      <h2>{content.heading}</h2>
      <p className="lead">
        {brand || 'Your Brand'} 는 <strong>{industry}</strong> 분야에서 고객의 비즈니스 성장을 함께 만들어 갑니다.
      </p>
      <div className="lp-about-grid">
        {content.cards.map((c) => (
          <div className="lp-about-card" key={c.title}>
            <strong>{c.title}</strong>
            {c.body}
          </div>
        ))}
      </div>
    </section>
  );
}
