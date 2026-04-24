import type { HeroContent } from '../types';

interface Props { content: HeroContent }

export default function HeroSection({ content }: Props) {
  const titleEmpty = !content.title;
  const subEmpty = !content.subtitle;
  return (
    <section className="lp-hero">
      <h1 className={titleEmpty ? 'lp-placeholder' : ''}>
        {content.title || '여기에 사이트 이름이 표시됩니다'}
      </h1>
      <p className={subEmpty ? 'lp-placeholder' : ''}>
        {content.subtitle || '한 줄 소개를 입력하면 이 자리에 표시됩니다'}
      </p>
      {content.cta && <span className="lp-cta">{content.cta}</span>}
    </section>
  );
}
