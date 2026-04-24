import type { ContactContent } from '../types';

interface Props { content: ContactContent }

export default function ContactSection({ content }: Props) {
  return (
    <section className="lp-section lp-contact">
      <h2>{content.heading}</h2>
      <p className="lead">{content.lead}</p>
      <div className="lp-contact-grid">
        <div className="lp-contact-info">
          <dl>
            <dt>주소</dt>     <dd>{content.address}</dd>
            <dt>전화</dt>     <dd>{content.phone}</dd>
            <dt>이메일</dt>   <dd>{content.email}</dd>
            <dt>운영시간</dt> <dd>{content.hours}</dd>
          </dl>
        </div>
        <div className="lp-contact-form">
          <div className="lp-field" />
          <div className="lp-field" />
          <div className="lp-field tall" />
          <span className="lp-submit">문의 보내기</span>
        </div>
      </div>
    </section>
  );
}
